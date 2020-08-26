import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ServerService } from '../../service/server.service';

@Component({
  selector: 'app-poc',
  templateUrl: './poc.component.html',
  styleUrls: ['./poc.component.css']
})
export class PocComponent implements OnInit {

  public pocId; loading:boolean; success:boolean; failure: boolean; alert;

  public pocCoord = {
    lat: null,
    long: null
  }

  public traffic = {
    chair: null, poster: null, chiller: null, survey: null
  }

  constructor(public actRoute: ActivatedRoute, private server: ServerService, public rout: Router) { }

  ngOnInit(): void {
    this.alert = 'Take Photo';
    this.getPocId();
    // call function todo what needs to be done
    this.getPocValidation(this.pocId);
  }

  getPocId() {
    this.actRoute.paramMap.subscribe((param => {
        this.pocId = param.get('pocId');
    }))
  }

  getPocValidation(pocId) {
     let data = JSON.parse(localStorage.getItem('data'));

     data.forEach(element => {
       if(element.id==pocId){
         this.pocCoord.lat = element.latitude;
         this.pocCoord.long = element.longitude;
         this.traffic.chiller = element.chiller;
         this.traffic.chair = element.chair;
         this.traffic.poster = element.poster;
         this.traffic.survey = element.survey;
       }
     });
     
    this.loading = true;
    this.success =  this.failure = !this.loading;
    this.proceed(this.server.getPocValidation(this.pocCoord))
  }

  handleError() {
    this.alert = 'Cannot open Camera!';
  }

  proceed(data) {
    if(data > 50) {
      this.loading = true;
        this.failure = true;
        this.success = !this.failure;
    }
    else if(data <= 50){
      this.loading = false;
      this.success = true;
      sessionStorage.setItem("cam", "true");
      this.failure = !this.success;
    }
  }

  okThanks():void {
    window.history.back()
  }

  snapShot(x): void {
    if(this.success) {
      this.server.tempStoreDataForCamera(this.pocId, x);
      this.rout.navigate(['camera']);
    }
    else {
      alert("I can't open your camera, proximity beyond 50m");
    }
  }

  opportunity(): void {
    if(this.success) {
      this.server.tempStoreDataForCamera(this.pocId, 'opportunity');
      this.rout.navigate(['camera']);
    }
    else {
      alert("I can't open opportunity, proximity beyond 50m");
    }
  }

  survey(): void {
    if(this.success) {
      this.server.tempStoreDataForCamera(this.pocId, 'survey');
      this.rout.navigate(['survey']);
    }
    else {
      alert("I can't open Success, proximity beyond 50m");
    }
  }

  backFunc() {
    window.history.back()
  }

}
