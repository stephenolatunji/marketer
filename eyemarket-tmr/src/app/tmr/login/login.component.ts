import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../service/auth.service';
import { ServerService } from '../../service/server.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public notice = 'Sign In';
  constructor(private auth: AuthService, private server: ServerService) {}

  public user = {
    email: null,
    password: null
  };

  userId: boolean;
  password: boolean;
  resetPassword: boolean;
  setupPassword: boolean;
  loading: boolean;

  ngOnInit(): void {
    this.setDisplay();
  }

  next() {
    this.notice = 'Log in';
    if (this.user.email == null) {
      this.notice = 'Please fill the input box correctly';
    } else {
      this.loading = true;

      this.server.getData(this.user.email).subscribe(
        data => {
          this.loading = false;
          if (data.pocs.length > 0 && data.pocs[0].activated == 0) {
            this.userId = false;
            this.password = this.userId;
            this.setupPassword = !this.userId;
            // this.server.setData(this.user.email);
          } else if (data.pocs.length == 0) {
            this.notice = 'Invalid Email';
          } else if (data.pocs[0].activated == 1) {
            this.userId = false;
            this.password = !this.userId;
            this.setupPassword = this.userId;
          }
        },
        error => this.handleError(error.status)
      );
    }
  }

  setDisplay() {
    this.userId = true;
    this.password = !this.userId;
    this.setupPassword = !this.userId;
    this.loading = false;
  }

  login(): void {
    this.notice = 'Sign In';
    if (this.user.email == null || this.user.password == null) {
      this.notice = 'Please fill all input boxes correctly';
    } else {
      this.notice = 'Sign In';
      this.server.logMeInMyDear(this.user).subscribe(
        data => {
          if (data.success == true) {
            this.auth.setAuth(this.user.email);

            // this

            window.location.reload(false);
          }
        },
        error => this.handleError(error.status)
      );
    }
  }

  toggleResetPasswordDisplay() {
    this.resetPassword = !this.resetPassword;
  }

  handleError(status) {
    this.loading = false;
    this.notice = status == 401 ? 'Invalid Credential(s)' : 'Network Problem';
  }
}
