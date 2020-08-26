import { Component, OnInit, Injectable } from '@angular/core';
import { LocalServerService } from 'src/app/service/local-server.service';
import { concat } from 'rxjs';
import { EventEmitterService } from 'src/app/service/event-emitter.service';
import { ServerService } from 'src/app/service/server.service';


@Injectable({
  providedIn: 'root'
})

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  data: any; task: any; goodExecution: any; badExecution: any; completedExecution: any; searchResult = []; notice = 'Search';
  search_: boolean = false; completedChair; completedChiller; completedPoster;

  public taskEval = {
    completedChillerExecution: null,
    goodChillerExecution: null,
    completedPosterExecution: null,
    goodPosterExecution: null,
    completedChairExecution: null,
    goodChairExecution: null,
  }


  constructor(private localServer: LocalServerService, private server: ServerService) { }

  ngOnInit(): void {
    this.data = this.getDataFromLocalService();
    this.task = this.getTaskFromLocalService();

    this.getPocName();

    let pocLength = this.data.length;
    
    this.taskCompleted();
  }

  getDataFromLocalService() {
    return this.localServer.supplyDataFromLocalStorage()
  }

  getTaskFromLocalService() {
    return this.localServer.supplyTaskFromLocalStorage()
  }

  taskCompleted() {
    let goodChillerExecution = 0; let badChillerExecution = 0;
    let goodPosterExecution = 0; let badPosterExecution = 0;
    let goodChairExecution = 0; let badChairExecution = 0;

    this.completedChiller = this.task.filter(chiller => chiller.taskType == 'chiller')
    this.completedPoster = this.task.filter(chiller => chiller.taskType == 'poster')
    this.completedChair = this.task.filter(chiller => chiller.taskType == 'chair')
    
    if(this.task!==null) {

      this.task.forEach(element => {
        (element.action == "success" && element.taskType == "chiller")?
        goodChillerExecution++ : goodChillerExecution;

        (element.action == "bad" && element.taskType == "chiller")?
        badChillerExecution++ : badChillerExecution;

        (element.action == "success" && element.taskType == "poster")?
        goodPosterExecution++ : goodPosterExecution;

        (element.action == "bad" && element.taskType == "poster")?
        badPosterExecution++ : badPosterExecution;

        (element.action == "success" && element.taskType == "chair")?
        goodChairExecution++ : goodChairExecution;

        (element.action == "bad" && element.taskType == "chair")?
        badChairExecution++ : badChairExecution;
      });

    }

    // this.taskEval.completedChillerExecution = ((goodChillerExecution + badChillerExecution) * 100 /this.data.length).toFixed(1);
    this.taskEval.completedChillerExecution = ((this.completedChiller.length) * 100 /this.data.length).toFixed(1);
    this.taskEval.goodChillerExecution = (goodChillerExecution * 100 / this.data.length).toFixed(1);

    // this.taskEval.completedPosterExecution = ((goodPosterExecution + badPosterExecution) * 100 /this.data.length).toFixed(1);
    this.taskEval.completedPosterExecution = ((this.completedPoster.length) * 100 /this.data.length).toFixed(1);
    this.taskEval.goodPosterExecution = (goodPosterExecution * 100 / this.data.length).toFixed(1);

    this.taskEval.completedChairExecution = ((this.completedPoster.length) * 100 /this.data.length).toFixed(1);
    this.taskEval.goodChairExecution = (goodChairExecution * 100 / this.data.length).toFixed(1);
    
  }

  backFunc(): void {
    window.history.back()
  }

  backToDash(): void {
    this.search_ = false;
  }

  search(event): void {
    let i = 0; this.searchResult = [];

    if(this.task !== null) {
      // this.searchResult = this.task.filter(dat => dat.outlet.indexOf(event.target.value) > -1);
      for (let i = 0; i < this.task.length; i++) {

        if(this.task[i].outlet!==undefined && this.task[i].outlet.toLowerCase().indexOf(event.target.value.toLowerCase()) > -1  ){
          this.searchResult.push(this.task[i]);
        };

      }
     
      if(this.searchResult.length == 0) {
        // this.searchResult = this.task.filter(dat => dat.outlet.indexOf(event.target.value) > -1);
        for (let i = 0; i < this.task.length; i++) {this.task
          if(this.task[i].date!==undefined && this.task[i].date.indexOf(event.target.value) > -1  ){
            this.searchResult.push(this.task[i]);
          };
        }
      }

      if(this.searchResult.length == 0) {
        // this.searchResult = this.task.filter(dat => dat.outlet.indexOf(event.target.value) > -1);
        for (let i = 0; i < this.task.length; i++) {

            // changing taskType frm whats is comin frm db to what we re useing in FE
            if(this.task[i].taskType == 'chair'){
              this.task[i].taskType = 'Trophy Stout Availablity';
            }
            else if(this.task[i].taskType == 'poster'){
              this.task[i].taskType = 'IbShopNow Poster';
            }
        // seaarch stuff gan gan

          if(this.task[i].taskType!==undefined && this.task[i].taskType.toLowerCase().indexOf(event.target.value.toLowerCase()) > -1  ){
            this.searchResult.push(this.task[i]);console.log(this.task[i])
          };

        }
      }

      if(this.searchResult.length == 0) {
        this.notice = 'No result found';
      }

      else {
        // console.log(this.server.keepForSearch(this.searchResult));
        this.notice = this.searchResult.length + ' Result(s) found!';
        this.search_ = true;
      }
    }

    else {
      this.notice = 'You have performed Zero task';
    }
    // console.log(this.searchResult)
  }

  getPocName() {
    if(this.task!==null){
      this.task.forEach(task => {
        this.data.forEach(dashData => {
            (dashData.id == task.pocId)? task.outlet = dashData.outlet : null;
        });
      });
    }
  }

}
