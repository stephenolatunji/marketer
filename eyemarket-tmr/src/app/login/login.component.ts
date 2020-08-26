import { Component, OnInit, Injectable } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { ServerService } from '../service/server.service';
import { LocalServerService } from '../service/local-server.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

@Injectable({
  providedIn: 'root'
})

export class LoginComponent implements OnInit {
  public notice = 'Sign In';
  constructor(private auth: AuthService, private server: ServerService, private localServer: LocalServerService, public rout: Router) {}

  public user = {
    email: null,
    password: null
  };

  admin: boolean = false;
  userId: boolean;
  password: boolean;
  resetPassword: boolean = false;
  setupPassword: boolean = false;
  loading: boolean;

  ne = [];
  public pocCoord = {
    lat: null,
    long: null
  }

  ngOnInit(): void {
    this.setDisplay();
    this.toggleResetPasswordDisplay = this.toggleResetPasswordDisplay.bind(
      this
    );
  }

  next() {
    this.notice = 'Sign In';
    if (this.user.email == null) {
      this.notice = 'Please fill the input box correctly';
    } else {
      this.loading = true;

      this.server.verifyEmail(this.user.email).subscribe(
        data => {
          this.loading = false;
          this.userId = false;

          if (data.pocs.length > 0 && data.pocs[0].activated == 0) {
            this.password = this.userId;
            this.resetPassword = this.userId;
            this.setupPassword = !this.userId;
            this.server.setData(this.user.email);

          } else if (data.pocs.length == 0) {
            this.notice = 'Invalid Email';
            this.loading = false;
            this.userId = true;

          } else if (data.pocs[0].activated == 1) {
            this.password = !this.userId;
            this.setupPassword = this.userId;
            this.resetPassword = this.userId;
          }
        },
        error => this.handleError(error.status)
      );
    }
  }

  setDisplay() {
    this.userId = true;
    this.password = !this.userId;
    this.resetPassword = !this.userId;
    this.setupPassword = !this.userId;
    this.loading = false;

    this.admin = (window.location.pathname == '/admin')? true : false;
  }

  login(): void {
    this.notice = 'Sign In';
    if (this.user.email == null || this.user.password == null) {
      this.notice = 'Please fill all input boxes correctly';
    } else {

      this.notice = 'Sign In'; this.loading = true;
      this.server.logMeInMyDear(this.user).subscribe(
        data => {
          if (
            data.success == true &&
            data.user.type == 'TMR'
          ) {
            this.auth.setAuth(this.user.email);
            localStorage.setItem('who', 'TMR');
            this.getDataFromServer(this.user.email);
            setTimeout(() => {
              window.location.href = '/TMR';
              // window.location.href = 'http://localhost:4200/TMR';
            }, 1200);

          } else if (
            data.success == true &&
            data.user.type == 'BDR'
          ) {
            this.auth.setAuth(this.user.email);
            localStorage.setItem('who', 'BDR');

            this.getDataFromServer(this.user.email);
            
            setTimeout(() => {
              window.location.href = '/BDR';
              // window.location.href = 'http://localhost:4200/BDR';
            }, 4000);
          }
        },
        error => this.handleError(error.status)
      );

    }
  }

  toggleResetPasswordDisplay() {
    this.resetPassword = !this.resetPassword;
  }

  getDataFromServer(userId) {
    try {
      this.server.getData(userId).subscribe(data=>{
          // function to get address and distance and getting it into localserver
          let allData = this.updateLocalServerWithAddressAndDistance(data.pocs);
          this.server.getTask(userId).subscribe(data=>{console.log(data)
            this.localServer.updateTask(data);
            // if(data.results.length!==0){
            // }
          })
          
          setTimeout(() => {
            this.localServer.updateLocalDisk(allData);
          }, 1400);
  
          
        }, error => this.handleError(error.status));

        return { "success":true }
    }
    catch {
      return { "success":false }
    }
      
  } 

   // function to update address and distance;
  updateLocalServerWithAddressAndDistance(oldData) {

    oldData.forEach(element => {
      this.pocCoord.lat = element.latitude; 
      this.pocCoord.long = element.longitude; 
      //  get distance
        let distance = this.server.getPocValidation(this.pocCoord);
        element.distance = distance.toFixed(2);
        });

    return oldData;
  }


  handleError(status) {
    this.loading = false;
    this.notice = status == 401 ? 'Invalid Credential(s)' : 'Network Problem';
  }
}
