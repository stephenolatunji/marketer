import { Component, OnInit } from '@angular/core';
import { EventEmitterService } from '../service/event-emitter.service'; 
import { AuthService } from '../service/auth.service';
import { AdminAuthService } from '../service/admin-auth.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {

  isAuthenticated: boolean; isAdminAuthenticated: boolean; isBdr;

  constructor(private eventEmitterService: EventEmitterService, private auth: AuthService, private admin_auth: AdminAuthService) { }

  ngOnInit(): void {
    // check if isAuthenticated
    this.isAuthenticated = this.auth.isAuthenticated();
    this.isAdminAuthenticated = this.admin_auth.isAuthenticated();
    this.isBdr = localStorage.getItem('who');
  }

  openSideNav(){    
    this.eventEmitterService.OpenSideBar();    
  } 

  logout() {
    this.auth.logout();
    window.location.reload(false)
  }

}
