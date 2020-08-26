import { Component, OnInit } from '@angular/core';
import { EventEmitterService } from '../../service/event-emitter.service'; 
import { AuthService } from '../../service/auth.service';
import { Router } from '@angular/router';
import { ServerService } from '../../service/server.service';
declare var $:any;
@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.css']
})
export class SideNavComponent implements OnInit {

  isAuthenticated: boolean;

  constructor(
    private eventEmitterService: EventEmitterService,
    private auth: AuthService,
    public rout: Router,
    private server: ServerService
    ) { }

  ngOnInit(): void {
    this.listenToEvents();

    // check if isAuthenticated
    this.isAuthenticated = this.auth.isAuthenticated();

    $('#main').click(function() {
      if(this.isAuthenticated) {
        document.getElementById("mySidenav").style.width = "0";
        document.getElementById("main").style.marginLeft = "0";
        document.body.style.backgroundColor = "white";
      }
    })
  }

  /* Set the width of the side navigation to 250px and the left margin of the page content to 250px and add a black background color to body */
  openNav() {
    document.getElementById("mySidenav").style.width = "240px";
    document.getElementById("main").style.marginLeft = "250px";
    document.body.style.backgroundColor = "white"
    document.body.style.color = "black"
  }

  /* Set the width of the side navigation to 0 and the left margin of the page content to 0, and the background color of body to white */
  closeNav() {
    document.getElementById("mySidenav").style.width = "0";
    document.getElementById("main").style.marginLeft = "0";
    document.body.style.backgroundColor = "white";
  }

  public listenToEvents():void {
    if (this.eventEmitterService.subsVar==undefined) {    
      this.eventEmitterService.subsVar = this.eventEmitterService.    
      sideBarOn.subscribe((name:string) => {    
        this.openNav();    
      });    
    }  
  }

  dashboard() {
    this.closeNav();
    this.rout.navigate(['dashboard'])
  }

  startOperation(){
    this.closeNav();
    this.rout.navigate(['MyRoute'])
  }

  logout(): void {
    this.auth.logout();
    window.location.reload(false);
  } 

  refresh(): void {
    // location.reload()
    window.location.reload(false); 
  }

}
