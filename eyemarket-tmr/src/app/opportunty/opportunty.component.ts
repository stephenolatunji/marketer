import { Component, OnInit } from '@angular/core';
import { ServerService } from '../service/server.service';
import { Router } from '@angular/router';
import { LocalServerService } from '../service/local-server.service';

@Component({
  selector: 'app-opportunty',
  templateUrl: './opportunty.component.html',
  styleUrls: ['./opportunty.component.scss']
})
export class OpportuntyComponent implements OnInit {

 data; success:boolean = false; notice: boolean = false;

  public opportunity = {
   Promotion: false,
   BrandingOutlet: false,
   NewChairTable: false,
   ABS: false
 }

  constructor(public server: ServerService, public rout: Router, public localServer: LocalServerService) { }

  ngOnInit(): void {
    this.data = this.server.getDataForCamBack();
  }
  
  handleSubmit() {

    if(this.opportunity.ABS == false && this.opportunity.BrandingOutlet == false && this.opportunity.NewChairTable == false && this.opportunity.Promotion == false){
      this.notice = true;
    }

    else {
      (this.data.poc_id == null)? 
      this.rout.navigate(['MyRoute']) : 
      this.localServer.updateOpportunity(this.data, this.opportunity);
      this.success = true;

      setTimeout(() => {
        this.rout.navigate(['MyRoute'])
      }, 5000);

    }
  }
  

  backFunc() :void {
    this.rout.navigate(['camera'])
  }

  opportunityFunc(x) {
    this.notice = false;
    switch (x) {
      case 'promotion':
        this.opportunity.Promotion = !this.opportunity.Promotion;
        break;
      case 'brandingOutlet':
        this.opportunity.BrandingOutlet = !this.opportunity.BrandingOutlet;
        break;
      case 'newChair':
        this.opportunity.NewChairTable = !this.opportunity.NewChairTable;
        break;
      case 'abs':
        this.opportunity.ABS = !this.opportunity.ABS;
        break;
    
      default:
        break;
    }
    console.log(this.opportunity)
  }

}
