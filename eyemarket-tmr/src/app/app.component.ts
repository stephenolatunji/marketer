import { Component, OnInit } from '@angular/core';
import { AuthService } from './service/auth.service';
import { ServerService } from './service/server.service';
import { LocalServerService } from "./service/local-server.service";
import { CallFuncInAppService } from './service/call-func-in-app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'eye-market';
  public user;
  public data;
  public amOnline: boolean;
  public activate;
  isAuthenticated: boolean;
  public pocCoord = {
    lat: null,
    long: null
  }

  constructor(
    private auth: AuthService, 
    private server: ServerService, 
    private localServer: LocalServerService,
    public Event: CallFuncInAppService
    ) { }

  ngOnInit() {
    // listen to events
    this.listenToEvent();

    if(this.isAuthenticated = this.auth.isAuthenticated()) {
      this.user = localStorage.getItem('userId');
      // this.amOnline = this.server.checkIfIAmOnline();
    };
    this.concatLocalDataWithTrafficLights();
  }

  concatLocalDataWithTrafficLights() {
    let data = this.localServer.supplyDataFromLocalStorage();
    let task = this.localServer.supplyTaskFromLocalStorage();
    let opportunity = this.localServer.supplyOpportunityFromLocalStorage();
    let survey = this.localServer.supplySurveyFromLocalStorage();
    
    if(data !== null) {
      data.forEach(data => {

        if(task !== null) {
          // data.taskPercentage = 0;
          task.forEach(task => {
            if(data.id == task.pocId) {
              if(task.taskType == 'chiller'){
                data.chiller = task.action;
                data.chillerDate = task.date;
                data.chillerTime = task.time;
                (data.taskPercentage == undefined)? data.taskPercentage = 33.3 : (data.chillerAlready == undefined)? data.taskPercentage += 33.3 : null;
                data.chillerAlready = true;
              }
              else if(task.taskType == 'poster'){
                data.poster = task.action;
                data.posterDate = task.date;
                data.posterTime = task.time;
                (data.taskPercentage == undefined)? data.taskPercentage = 33.3 : (data.posterAlready == undefined)? data.taskPercentage += 33.3 : null;
                data.posterAlready = true;
              }
              else if(task.taskType == 'chair'){
                data.chair = task.action;
                data.chairDate = task.date;
                data.chairTime = task.time;
                (data.taskPercentage == undefined)? data.taskPercentage = 33.3 : (data.chairAlready == undefined)? data.taskPercentage += 33.3 : null;
                data.chairAlready = true;
              }
            }
          });
        }

        if(survey !== null) {
          survey.forEach(survey => {
            if(data.id == survey.pocId) {
              data.survey = survey.action;
              data.surveyDate = survey.date;
              data.surveyTime = survey.time
            }
          });
        }

        // update distance
        this.pocCoord.lat = data.latitude;
        this.pocCoord.long = data.longitude;
        data.distance = this.server.getPocValidation(this.pocCoord).toFixed(2);
      });

      setTimeout(() => {
        this.localServer.updateLocalDisk(data)  
      }, 1000);

    }
  }

  listenToEvent() {
    if (this.Event.subsVar==undefined) {    
      this.Event.subsVar = this.Event.    
      call.subscribe((name:string) => {    
        this.concatLocalDataWithTrafficLights();    
      });    
    }
  }

}
