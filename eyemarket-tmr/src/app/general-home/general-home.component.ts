import { Component, OnInit } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { ServerService } from '../service/server.service';
import { LocalServerService } from '../service/local-server.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-general-home',
  templateUrl: './general-home.component.html',
  styleUrls: ['./general-home.component.scss']
})
export class GeneralHomeComponent implements OnInit {

  constructor(private auth: AuthService, private server: ServerService, private localServer: LocalServerService, public rout: Router) { }

  ngOnInit() {
    if(localStorage.getItem('who')=='BDR'){this.rout.navigate(['BDR'])}
    else if(localStorage.getItem('who')=='TMR'){this.rout.navigate(['TMR'])}
  }

}
