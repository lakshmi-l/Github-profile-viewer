import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  form = new FormGroup({
    username: new FormControl('')
  });
  title = `github-profile-viewer`;
  data: any;
  name: any;
  avatarUrl: any;
  location: any;
  htmlUrl: any;
  noData = false;
  dataFound = false;
  dataLoading = false;
  localData: any;
  constructor(private http: HttpClient, private snackBar: MatSnackBar) {}
  ngOnInit(): void {}

  findMe() {
    const localData = JSON.parse(
      localStorage.getItem(this.form.value.username)
    );

    if (localData) {
      this.fill(localData);
      this.show();
      this.dataLoading = false;
    } else {
      this.show();
      this.http
        .get(
          `https://api.github.com/users/` +
            this.form.value.username +
            `?access_token=beba3c150021bfb49769385927dfa59fac2cdf04`
        )
        .subscribe(
          response => {
            this.dataLoading = false;
            this.data = response;
            this.fill(this.data);
            localStorage.setItem(
              this.form.value.username,
              JSON.stringify(this.data)
            );
          },
          error => {
            this.hide();
            this.openSnackBar(`Invalid Username`, `Try again`);
          }
        );
    }
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
      verticalPosition: 'top',
      horizontalPosition: 'right'
    });
  }

  fill(data) {
    this.name = data.name;
    this.avatarUrl = data.avatar_url;
    this.location = data.location;
    this.htmlUrl = data.html_url;
  }

  show() {
    this.dataLoading = true;
    this.dataFound = true;
    this.noData = false;
  }

  hide() {
    this.dataLoading = false;
    this.dataFound = false;
    this.noData = true;
  }
}
