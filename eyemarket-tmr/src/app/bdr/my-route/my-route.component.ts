import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EventEmitterService } from '../../service/event-emitter.service'; 
import { LocalServerService } from '../../service/local-server.service';
import { ServerService } from '../../service/server.service';
import { LoginComponent } from 'src/app/login/login.component';
declare var $: any;

@Component({
  selector: 'app-my-route',
  templateUrl: './my-route.component.html',
  styleUrls: ['./my-route.component.css']
})
export class MyRouteComponent implements OnInit {

  public user; downloadNotice; uploadNotice; dataLog; totalStuffsToUpload=0; 
  taskToUpload; opportunityToUpload; surveyToUpload; pendingTasks = []; pendingSurvey = []; pendingOpportunity = [];

  constructor(
    private eventEmitterService: EventEmitterService,
    public rout: Router, 
    private localServer: LocalServerService,
    private server: ServerService,
    public funcFromLogin: LoginComponent
    ) { }

  ngOnInit(): void {
    // ensure camera is off
    sessionStorage.setItem("cam", "null");

    this.downloadNotice = 'Download Data';
    this.uploadNotice = 'Upload Pending Task';
    this.user = localStorage.getItem('userId');

    this.taskToUpload = this.localServer.supplyTaskFromLocalStorage();
    this.opportunityToUpload = this.localServer.supplyOpportunityFromLocalStorage();
    this.surveyToUpload = this.localServer.supplySurveyFromLocalStorage();

    if(this.taskToUpload == null) {
      this.totalStuffsToUpload += 0
    }
    else {
      this.totalStuffsToUpload += this.taskToUpload.filter(task=>task.action=='pending').length;
      this.pendingTasks =  this.taskToUpload.filter(task=>task.action=='pending')
    }
    
    if(this.opportunityToUpload == null) {
      this.totalStuffsToUpload += 0
    }

    else {
      this.totalStuffsToUpload += this.opportunityToUpload.filter(task=>task.action=='pending').length;
      this.pendingOpportunity =  this.opportunityToUpload.filter(task=>task.action=='pending')
    }

    if(this.surveyToUpload == null) {
      this.totalStuffsToUpload += 0
    }

    else {
      this.totalStuffsToUpload += this.surveyToUpload.filter(task=>task.action=='pending').length;
      this.pendingSurvey =  this.surveyToUpload.filter(task=>task.action=='pending')
    }

  }

  backFunc() {
    this.rout.navigate(['']);
    this.eventEmitterService.OpenSideBar();    
  }

  addPocAndShowDailyShedule() {
    this.rout.navigate(['DailySchedule']);
  }

  downloadCallSchedule() {
    // u[pload bfo u download]
    // if(this.pendingTasks.length == 0 && this.pendingOpportunity.length == 0 && this.pendingSurvey.length == 0) {

      this.downloadNotice = 'Downloading...';
      let x = this.funcFromLogin.getDataFromServer(this.user); console.log(x)

      if(x.success) {
        setTimeout(() => {
          this.downloadNotice = 'Successfully Downloaded!';
        }, 1500);

        setTimeout(() => {
          window.location.reload();
        }, 2500);
      }
      // this.server.getData(this.user).subscribe(data=>{
      //   let oldData = this.funcFromLogin.updateLocalServerWithAddressAndDistance(data.pocs);
      //   this.localServer.updateLocalDisk(oldData);

      //   this.server.getTask(this.user).subscribe(data=>{console.log(data)
      //     this.localServer.updateTaskFromServer(data.results)
      //   })
      // }, error => this.handleError(error.status));


    // }

    // else {
    //   this.downloadNotice = 'Please Upload tasks!';
    // }
  }



  uploadPendingInformation() {
    this.uploadNotice = 'Uploading...';
    // let dataToUpload = this.localServer.supplyDataFromLocalStorage();
    // this.dataLog = [];
    
    // for (let i = 0; i < dataToUpload.length; i++) {
    //   if(dataToUpload[i].altered) {
    //     this.dataLog.push(dataToUpload[i]);
    //   }
    // }

    if(
      this.pendingTasks.length == 0 && 
      this.pendingOpportunity.length == 0 && 
      this.pendingSurvey.length == 0) {
      this.uploadNotice = 'No task to be updated!';
    }

    else {
      this.server.uploadDataFrmLocalServer(
        this.pendingTasks, this.pendingOpportunity, this.pendingSurvey, this.user).subscribe(data=>{
          // use the data to connect to AI endpoint
              // this.server.getTask(this.user).subscribe(data=>{console.log(data)
                localStorage.setItem('task', null);
                this.localServer.updateTaskFromServer(data.results);
                this.uploadNotice = 'Successfully updated!';
              // })   
              setTimeout(() => {
                window.location.reload()
              }, 700);
          
        }, error => this.handleError(error.status))

        

        // setTimeout(() => {
        //   window.location.reload()
        // }, 1900);
        // setTimeout(() => {
        //   window.location.reload()
        // }, 1000);
    }
  }

  handleError(status) {
    this.uploadNotice = 'Network Error';
  }
}
