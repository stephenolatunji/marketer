import { Component, OnInit } from '@angular/core';
import { AdminAuthService } from '../service/admin-auth.service';
import { ServerService } from '../service/server.service';
import { stringify } from '@angular/compiler/src/util';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  content: boolean = false; data; tempData; finalPage: number = 10; initialPage: number = 0; searchVal; filterBy: string = 'BDR';trimmedDataForDisplay;

  constructor(private auth: AdminAuthService, private server: ServerService) { }

  ngOnInit(): void {
    (this.auth.isAuthenticated())? this.content = true : this.content = false;
    if(this.content) {
      this.server.getDataForAdminDashboard().subscribe(data=>{
        this.data = data;
          this.tempData = data;
          this.trimmedDataForDisplay = this.data.slice(this.initialPage, this.finalPage)
      })
    }
  }

  copyFunc(url: string) {
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = url;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  };

  refresh(): void {
    window.location.reload();
  }

  next(): void {
    if(this.trimmedDataForDisplay.length >= this.finalPage){
      this.initialPage = this.finalPage
      this.finalPage += 10;
      this.data == undefined? null :
      this.trimmedDataForDisplay = this.tempData.slice(this.initialPage, this.finalPage);
    }
  }

  previous(): void {
    if(this.initialPage!==0) {
      this.initialPage-=10;
      this.finalPage -= 10;
      this.data == undefined? null :
      this.trimmedDataForDisplay = this.tempData.slice(this.initialPage, this.finalPage);     
    }
  }

  filter_by(x) {
    
    this.filterBy = x.toUpperCase() ;
    document.getElementById("search").focus();
    this.filterFunc();
    this.trimmedDataForDisplay = this.tempData.slice(this.initialPage, this.finalPage)
  }

  search() {
    this.tempData = [];
    this.initialPage = 0;
    this.finalPage = 10;
      this.filterFunc();
      this.trimmedDataForDisplay = this.tempData.slice(this.initialPage, this.finalPage)
  }

  filterFunc() {
    this.data.forEach(element => {
      
      switch (this.filterBy) {

        case 'EXEC_TYPE':
          (element.action == 'success')? element.action = 'good' : null;
          if (element.action.toLowerCase().indexOf(this.searchVal.toLowerCase()) > -1) {console.log(element.action)
            this.tempData.push(element);
          }
          break;

        case 'BDR':
          if (element.name.toLowerCase().indexOf(this.searchVal.toLowerCase()) > -1) {
            this.tempData.push(element);
            // this.trimmedDataForDisplay = this.tempData.slice(this.initialPage, this.finalPage)
          }
          break;

        case 'POC_ID':
          if (element.id.toString().indexOf(this.searchVal.toLowerCase()) > -1) {
            this.tempData.push(element)
          }
          break;

        case 'DISTRICT':
          if (element.district.toLowerCase().indexOf(this.searchVal.toLowerCase()) > -1) {
            this.tempData.push(element)
          }
          break;

        case 'TASK_TYPE':
          (element.taskType == 'chair')? element.taskType = 'Trophy Availability' : null;
          if (element.taskType.toLowerCase().indexOf(this.searchVal.toLowerCase()) > -1) {
            this.tempData.push(element);console.log(element)
          }
          break;


        case 'DATE':
          if (element.date.toLowerCase().indexOf(this.searchVal.toLowerCase()) > -1) {
            this.tempData.push(element)
          }
          break;
      
        default:
          break;
      }
      
    });
  }
}
