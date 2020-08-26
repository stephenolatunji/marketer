import { Component, OnInit } from '@angular/core';
import { ViewChild } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {

  

  constructor(public router: Router) { }

  ngOnInit(): void {
    // this.initMap()
  }

  // initMap() {
    
  //   // let lat = parseFloat(localStorage.getItem('lat'));
  //   // let long = parseFloat(localStorage.getItem('long'));
  //   let lat = parseFloat('6.48804');
  //   let long = parseFloat('3.17058');

  //     var map = new google.maps.Map(document.getElementById('map'), {
  //       zoom: 14,
  //       // center: {lat: this.coord.lat, lng: this.coord.long }
  //       center: { lat: lat, lng: long }
  //     });
  //     // this.setMarkers(map); 
  //   }


  // setMarkers(map) {
  //   var icon = {
  //     url: "https://salesboxai.com/wp-content/uploads/2019/05/marker-icon.png",
  //     // url: "https://www.shareicon.net/data/512x512/2016/08/24/819488_pin_512x512.png",
  //     scaledSize: new google.maps.Size(50, 50), // scaled size
  //     origin: new google.maps.Point(0,0), // origin
  //     anchor: new google.maps.Point(0, 0) // anchor
  // };
  

    // for (var i = 0; i < this.dataCollector.length; i++) {

    //   this.marker = new google.maps.Marker({
    //   map: map,
    //   // draggable: true,
    //   icon: icon,
    //   animation: google.maps.Animation.DROP,
    //   position: {lat: parseFloat(this.dataCollector[i].latitude), lng: parseFloat(this.dataCollector[i].longitude) },
    //   title: this.dataCollector[i].outlet
    // });
  
    // var content = 'write up';
    // var infowindow = new google.maps.InfoWindow()
    
    // google.maps.event.addListener(this.marker,'click', (function(marker,content,infowindow,){ 
    //   return function() {
    //     infowindow.setContent(content);
    //     infowindow.open(map,marker);
    // };
    // })(this.marker,content,infowindow));
  // }
// }


showOutlet(x) {
  this.router.navigate(['outlets'])
}


}
