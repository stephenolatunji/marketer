import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServerService } from '../../service/server.service';
import { LocalServerService } from '../../service/local-server.service';
declare var $: any;

@Component({
  selector: 'app-daily-schedule',
  templateUrl: './daily-schedule.component.html',
  styleUrls: ['./daily-schedule.component.css']
})
export class DailyScheduleComponent implements OnInit {

  public data; public day; public userId; public dailyScheduleShow: boolean; 
  public pocsToAdd = []; public markMe; public pocsOnSchedule = [];

  constructor(public rout: Router, private server: ServerService, private localServer: LocalServerService ) { }

  ngOnInit(): void {  
    
    this.day = this.dateFunc();
    this.fetchData();

    document.getElementById('btnList').style.background = '#FFF';
    document.getElementById('btnList').style.color = '#ee611f';

    this.dailyScheduleShow = true;
    this.markMe = 'none';

    // scroll to top
    $('.arrow').click(()=> {
      $('html, body').animate({
        scrollTop: $('#top').offset().top-400
      },1000)
    });
    

  }

  fetchData() {
      this.data = this.localServer.supplyDataFromLocalStorage();
      this.listDailySchedule(this.data);
  }

  backFunc() {
    // this.rout.navigate(['MyRoute']); 
    window.history.back()
  }

  addPoc() {

    this.dailyScheduleShow = false;
    document.getElementById('btnAdd').style.background = '#FFF';
    document.getElementById('btnAdd').style.color = '#ee611f';
    document.getElementById('btnList').style.background = '#ee611f';
    document.getElementById('btnList').style.color = '#FFF';
    (this.pocsToAdd.length == 0)? this.pushPocToBeAdded() : null;

  }

  pushPocToBeAdded(): void {

    this.data.forEach(element => {
      if(element.schedule.trim() !== this.day) {
        // checking if we have data in the service so as to knw wc one has bn marked(the data is the on we added to shedule)
        if(this.server.supplyPocs()!==undefined){
          
          for (let i = 0; i < this.server.supplyPocs().length; i++) {
            // checking if the data is already 
              if(this.server.supplyPocs()[i].id == element.id){
                element.markMe = true;
              }
              else {
                // element.markMe = false;
              }
            }
            
            this.pocsToAdd.unshift(element);
            this.pocsToAdd.sort(function(a,b){return a.distance - b.distance})
        }
        
        else{
          //checking if we have no data in d service to avoid error - undefiuned...
          this.pocsToAdd.unshift(element);
          this.pocsToAdd.sort(function(a,b){return a.distance - b.distance})
        }
      }
    });

  }

  listDailySchedule(data) {

    this.dailyScheduleShow = true;
    document.getElementById('btnList').style.background = '#FFF';
    document.getElementById('btnList').style.color = '#ee611f';
    document.getElementById('btnAdd').style.background = '#ee611f';
    document.getElementById('btnAdd').style.color = '#FFF';
    (this.pocsOnSchedule.length == 0)? this.pushDailySchedule(data) : null;

  }

  pushDailySchedule(data) {

    if(this.server.supplyPocs()==undefined) {
      this.pocsOnSchedule = data.filter(dat => dat.schedule.trim() == this.day);
      // data.forEach(element => {console.log(element.schedule.toString()=='Monday')
      //   if(element.schedule == this.day) {
      //     this.pocsOnSchedule.unshift(element);
          // this.pocsOnSchedule = Object.values(this.pocsOnSchedule.reduce((acc,cur)=>Object.assign(acc,{[cur.id]:cur}),{}));
          // remove multiple
          this.pocsOnSchedule.filter((v,i,a)=>a.findIndex(t=>(t.id === v.id))===i)

          this.pocsOnSchedule = this.pocsOnSchedule.sort(function(a, b){return a.distance - b.distance});
          // this.pocsOnSchedule = this.pocsOnSchedule.reverse();
        // }
      // });

    }

    else {

      this.server.supplyPocs().forEach(element => {
          this.pocsOnSchedule.unshift(element);
          // this.pocsOnSchedule = Object.values(this.pocsOnSchedule.reduce((acc,cur)=>Object.assign(acc,{[cur.id]:cur}),{}));
          this.pocsOnSchedule = this.pocsOnSchedule.filter((v,i,a)=>a.findIndex(t=>(t.id === v.id))===i);
          this.pocsOnSchedule = this.pocsOnSchedule.sort(function(a, b){return a.distance - b.distance});
          
      });
    }

  }

  addThisPoc(data) {
    
      (this.pocsOnSchedule.includes(data))? null: this.unShift(data);
      // this.pocsOnSchedule = Object.values(this.pocsOnSchedule.reduce((acc,cur)=>Object.assign(acc,{[cur.id]:cur}),{}));
      // this.pocsOnSchedule = this.pocsOnSchedule.reverse();

  }

  unShift(data) {

    data.markMe = true;
    this.pocsOnSchedule.unshift(data);
    this.pocsOnSchedule = this.pocsOnSchedule.filter((v,i,a)=>a.findIndex(t=>(t.id === v.id))===i);
    this.server.storeForSupplyPocs(this.pocsOnSchedule);
    
  }

  
  dateFunc() {
    switch(new Date().getDay()) {
      case 1:
        return 'Monday';
        break;
      case 2:
        return 'Tuesday';
        break;
      case 3:
        return 'Wednesday';
        break;
      case 4:
        return 'Thursday';
        break;
      case 5:
        return 'Friday';
        break;
      case 6:
        return 'Saturday';
        break;
      case 7:
        return 'Sunday';
        break;
    }
  }

  backToTop(event) {
    
  }

}
