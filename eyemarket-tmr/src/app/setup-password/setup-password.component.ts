import { Component, OnInit } from '@angular/core';
import { ServerService } from '../service/server.service';

@Component({
  selector: 'app-setup-password',
  templateUrl: './setup-password.component.html',
  styleUrls: ['./setup-password.component.scss']
})
export class SetupPasswordComponent implements OnInit {
  public user = {
    cpassword: null,
    password: null
  };

  notice;
  loading: boolean;

  constructor(private server: ServerService) {}

  ngOnInit(): void {
    this.loading = false;
    this.notice = 'Password Setup';
  }

  setPassword() {
    this.loading = true;
    if (this.user.cpassword == this.user.password) {
      let data = {
        password: this.user.password,
        email: this.server.getSavedData()
      };

      this.server.setPassword(data).subscribe(
        data => {
          this.loading = false;
          data ? window.location.reload(false) : (this.notice = 'Unsuccessful');
        },
        error => this.handleError(error.status)
      );
    } else {
      this.loading = false;
      this.notice = 'Password Mismatch!';
    }
  }

  handleError(status) {
    this.loading = false;
    this.notice = status == 401 ? 'Invalid Credential(s)' : 'Network Problem';
  }
}
