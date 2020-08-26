import { Component, OnInit, ɵConsole } from '@angular/core';
import { AuthService } from '../../service/auth.service';
import { Router } from '@angular/router';
import { ViewChild } from '@angular/core';
import { ServerService } from '../../service/server.service';
import { LocalServerService } from '../../service/local-server.service';
import { environment } from 'src/environments/environment';

import * as mapboxgl from 'mapbox-gl';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  //@ViewChild('map') mapElement: any;
  // map: google.maps.Map;

  map: mapboxgl.Map;

  public day;
  public beach;
  public fakerIt;
  public marker;
  public dataCollector;
  public coord;
  public userId;
  showPocList: boolean;

  constructor(
    private auth: AuthService,
    public rout: Router,
    private server: ServerService,
    private localServer: LocalServerService
  ) { }

  ngOnInit(): void {

    this.coord = {
      lat: localStorage.getItem('lat'),
      long: localStorage.getItem('long'),
    }; 
    this.day = this.dateFunc();
    this.dataFunc();

    this.showPocList = true;
  }

  initMap(data) {

    this.dataCollector = data;
    
    // ds must be comin frm local storage
    let lat = parseFloat(this.dataCollector[3].latitude);
    let long = parseFloat(this.dataCollector[3].longitude);

    mapboxgl.accessToken = environment.mapboxkey;
    this.map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v11', // stylesheet location
      center: [long, lat-0.05], // starting position [lng, lat]
      zoom: 10.5 // starting zoom
      });

      
      // outlet location
      this.dataCollector.forEach(element => {
        this.createMarkers([element.longitude, element.latitude])    
      });

      // bdr location
      this.createBDRMarker([long, lat]);
  }

  createMarkers(cord) {

    var el = document.createElement('img');
    el.srcset = 'https://salesboxai.com/wp-content/uploads/2019/05/marker-icon.png';
    el.setAttribute('width', '40px'); 

    const marker = new mapboxgl.Marker(el)
      .setLngLat(cord)
      .addTo(this.map);

  }

  // BDR current Location
  createBDRMarker(cord) {
    var el = document.createElement('img');
    el.srcset = 'https://icongr.am/jam/map-marker-f.svg?size=45&color=333333';

    const marker = new mapboxgl.Marker(el)
      .setLngLat(cord)
      .addTo(this.map);
  }
  
  // initMap(data) {
  //   // (data == undefined)? setTimeout(()=>{location.reload(false)}, 1500) : null;
    
  //   this.dataCollector = data;
  //   // let lat = parseFloat(this.dataCollector[3].latitude);
  //   // let long = parseFloat(this.dataCollector[3].longitude);
  //   let lat = 6.20990153;
  //   let long = 6.9484128;
  //   this.dataCollector.push({outlet: 'me', latitude: lat, longitude: long});

  //     var map = new google.maps.Map(document.getElementById('map'), {
  //       zoom: 14,
  //       // center: {lat: this.coord.lat, lng: this.coord.long }
  //       center: { lat: lat-0.0100, lng: long }
  //     });
  //     this.setMarkers(map);
  //   }


  // setMarkers(map) {
  //   var icon = {
  //     url: "https://salesboxai.com/wp-content/uploads/2019/05/marker-icon.png",
  //     // url: "https://www.shareicon.net/data/512x512/2016/08/24/819488_pin_512x512.png",
  //     scaledSize: new google.maps.Size(50, 50), // scaled size
  //     origin: new google.maps.Point(0,0), // origin
  //     anchor: new google.maps.Point(0, 0) // anchor
  // };
  //   var iconMe = {
  //     url: "https://thumbs.gfycat.com/InfamousShorttermElver-size_restricted.gif",
  //     scaledSize: new google.maps.Size(50, 50), // scaled size
  //     origin: new google.maps.Point(0,0), // origin
  //     anchor: new google.maps.Point(0, 0) // anchor
  // };
  

  //   for (var i = 0; i < this.dataCollector.length; i++) {

  //     this.marker = new google.maps.Marker({
  //     map: map,
  //     icon: this.dataCollector[i].outlet=='me'? iconMe : icon ,
  //     animation: google.maps.Animation.DROP,
  //     position: {lat: parseFloat(this.dataCollector[i].latitude), lng: parseFloat(this.dataCollector[i].longitude) },
  //     title: this.dataCollector[i].outlet
  //   });
  // }
  // }

  dataFunc() {

    this.userId = localStorage.getItem('userId');
    let dataCollector_ = [];
    dataCollector_ = this.localServer.supplyDataFromLocalStorage().reverse().filter(dat => dat.schedule.trim() == this.day);
    dataCollector_ = dataCollector_.slice(0, 9);
    if(dataCollector_ !== null) {
    dataCollector_ = dataCollector_.sort(function(a, b){return a.distance - b.distance});
    dataCollector_.forEach(element => {
      if(element.distance > 999) {
        element.distance = (element.distance/1000).toFixed(2)+' km';
      }
      else {
        element.distance = element.distance+' m';
      }
    });
    this.initMap(dataCollector_);
  }

  else {
    this.server.getData(this.userId).subscribe(data=>{
      this.dataCollector=data.pocs;
      this.localServer.updateLocalDisk(this.dataCollector);
      // ds was done when data were nt showin on fifrst login
      setTimeout(() => {
        window.location.reload();
      }, 500);
    })
  }

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
      case 0:
        return 'Sunday';
        break;
    }
  }

  closeCallShedule() {
    document.getElementById('callShedule').style.display = 'none'
  }

  hidePocList() {
    this.showPocList = false;
  }

  showPocListFunc() {
    this.showPocList = true;
  }

}
