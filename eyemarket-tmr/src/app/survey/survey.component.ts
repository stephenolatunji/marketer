import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocalServerService } from '../service/local-server.service';
import { CallFuncInAppService } from '../service/call-func-in-app.service';
import { ServerService } from '../service/server.service';

@Component({
  selector: 'app-survey',
  templateUrl: './survey.component.html',
  styleUrls: ['./survey.component.scss']
})
export class SurveyComponent implements OnInit {

  index = 1; slide1; slide2; success:boolean = false;

  public survey = {
    q1: null,
    q2: null,
    q3: null,
    q4: null,
    q5: null,
    q6: null,
    q7: null,
    q8: null,
  }

  constructor(
    public rout: Router, 
    public localServer: LocalServerService,
    public Event: CallFuncInAppService,
    public server: ServerService
    ) { }

  ngOnInit(): void {
    this.switch()
  }

  next():void {
    this.index += 1; 
    this.switch();
  }
  previous():void {
    this.index -= 1; 
    this.switch();
  }

  switch() {
    
    switch (this.index) {
      case 1:
        this.slide1 = true;
        this.slide2 = false;
        break;

      case 2:
        this.slide2 = true;
        this.slide1 = false;
        break;
    }
  }

  snapShot(): void {
    // if(this.success) {
    //   this.server.tempStoreDataForCamera(this.pocId, 'survey');
      this.rout.navigate(['camera']);
    // }
  }

  submit() {
    // console.log(this.survey);
    this.localServer.updateSurvey(this.survey);
    this.slide1 = this.slide2 = this.success;
    this.success = true;

    this.Event.Call();

    setTimeout(() => {
      this.rout.navigate(['MyRoute'])
    }, 4000);
  }

  backFunc() {
    let pocId = this.server.getDataForCamBack().poc_id;
    window.history.back();
  }


}
