import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DashboardComponent } from '../dashboard/dashboard.component';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})

export class SummaryComponent implements OnInit {

  parameter: any; header: any; subHeader: any; parameter2: any; tasks: any; _image: any; show: boolean = false;

  constructor(private actRout: ActivatedRoute, public dashboardData: DashboardComponent, public rout: Router) { }

  ngOnInit(): void {
    this.actRout.paramMap.subscribe(param=>{
      this.parameter = Number(param.get('val1'));
      this.parameter2 = Number(param.get('val2'));
    })

    this.setHeader();

    this.getTask();

    this.getPocName();
  }

  setHeader() {
    const headers = ['Chiller Verification', 'IbShopnow Poster', 'Trophy Stout Availabilty'];
    const subHeaders = ['Pocs Completed', 'Good Execution'];
    this.header = headers[this.parameter2];
    this.subHeader = subHeaders[this.parameter];
  }

  getTask() {
    this.tasks = this.dashboardData.getTaskFromLocalService();

    if(this.tasks!==null) {

      switch (this.parameter2) {
        case 0:
          (this.parameter == 0)? 
          this.tasks = this.tasks.filter(task => task.taskType == 'chiller') :
          this.tasks = this.tasks.filter(task => task.taskType == 'chiller' && task.action=='success');
          break;

        case 1:
          (this.parameter == 0)? 
          this.tasks = this.tasks.filter(task => task.taskType == 'poster') :
          this.tasks = this.tasks.filter(task => task.taskType == 'poster' && task.action=='success');
          break;

        case 2:
          (this.parameter == 0)? 
          this.tasks = this.tasks.filter(task => task.taskType == 'chair') :
          this.tasks = this.tasks.filter(task => task.taskType == 'chair' && task.action=='success');
          break;
      
        default:
          break;
      }
    }
    
  }

  getPocName() {
    if(this.tasks!==null){
      this.tasks.forEach(task => {
        this.dashboardData.getDataFromLocalService().forEach(dashData => {
            (dashData.id == task.pocId)? task.outlet = dashData.outlet : null;
        });
      });
    }
  }

  image(x) {
    this._image = x;
    this.show = !this.show
  }

  backFunc(): void {
    window.history.back()
  }
  backFunc_(): void {
    this.show = !this.show
  }

}
