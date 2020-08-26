import { Component, OnInit } from '@angular/core';
import { ServerService } from '../service/server.service';
import { Router } from '@angular/router';
import { LocalServerService } from '../service/local-server.service';
import { CallFuncInAppService } from '../service/call-func-in-app.service';
declare var $: any;
@Component({
  selector: 'app-camera',
  templateUrl: './camera.component.html',
  styleUrls: ['./camera.component.css']
})
export class CameraComponent implements OnInit {
  data_; notice; amOnline; success:boolean; 

  constructor(
    private server: ServerService, 
    public rout: Router, 
    private localServer: LocalServerService, 
    private Event: CallFuncInAppService) { }
  
  ngOnInit(): void {

    // check IFU RE BN ROUTED WEL
    this.getPocId();
    this.success = false;
    this.amOnline = this.server.checkIfIAmOnline();

    $(document).ready(function(){
      
      var photo = document.getElementById('photo');
      var video = document.querySelector('video');
      var canvas = document.querySelector('canvas');
      var startButton = document.getElementById('startbutton');
      var proceed = document.getElementById('proceed');
      var reSnap = document.getElementById('reSnap');
      var back = document.getElementById('back');

      var context = canvas.getContext('2d');
      var w, h, ratio;

      video.addEventListener('loadedmetadata', function() {
        ratio = video.videoWidth / video.videoHeight;
        w = video.videoWidth - 100;
        h = w/ratio;
        canvas.width = w;
        canvas.height = parseInt(h, 10);
        
      }, false);

      $('#startbutton').click(function(){
        // u can use this function to snap any thing u want
        context.fillRect(0, 0, w, h);
        context.drawImage(video, 0, 0, w, h);
        
        photo.style.display = 'inline-block';
        video.style.display = 'none';
        startButton.style.display = 'none';
        back.style.display = 'none';
        proceed.style.display = 'inline-block';
        reSnap.style.display = 'inline-block';

        var data = canvas.toDataURL('image/jpeg', 1);
        // var data = canvas.toDataURL('image/jpeg', 1);
        // var data = canvas.toDataURL('image/jpeg', 0.1);

        photo.setAttribute('src', data);
        // console.log(data)
        // incase u need fr fdownload of image
        // document.getElementById('img').setAttribute('href', data);
        // use for what u want
        localStorage.setItem('image', data);
      })

      $('#reSnap').click(function(){
        photo.style.display = 'none';
        video.style.display = 'inline-block';
        startButton.style.display = 'block';
        proceed.style.display = 'none';
        reSnap.style.display = 'none';
        back.style.display = 'block';
      })

    });

    this.notice = 'Proceed';
  }

  getPocId() {
    this.data_ = this.server.getDataForCamBack();
    if(this.data_.poc_id == undefined) {
      this.rout.navigate(['']);
    }
  }

  proceed() {
  if(this.data_.value=='opportunity') {
    this.rout.navigate(['opportunity']);
  }

  else {
    let dataFrmStore = this.localServer.supplyDataFromLocalStorage();
    // console.log(this.pocId)

      for (let i = 0; i < dataFrmStore.length; i++) {
        
        if(dataFrmStore[i].id == this.data_.poc_id) {
          dataFrmStore[i].traffic = 'pending';
          dataFrmStore[i].altered = true;
          dataFrmStore[i].dayOfAltered = new Date().getDay();
        }
        
      }
      this.localServer.updateLocalDisk(dataFrmStore);
      this.notice='Updating...';
        this.notice = 'Proceed';
        this.success = true;
        document.getElementById('photo').style.display='none';
        document.getElementById('video').style.display='none';
        document.getElementById('reSnap').style.display='none';
        document.getElementById('proceed').style.display='none';
        document.getElementById('startbutton').style.display='none';

        setTimeout(() => {
          (localStorage.getItem('who')=='BDR') ?
          window.location.href = "/DailySchedule" :
          window.location.href = "/outlets"
        }, 5000);
        
        
        this.localServer.updateTask(this.server.getDataForCamBack());
        this.Event.Call();    

    }

  }

  backFunc() {
    this.rout.navigate([`poc/${this.data_.poc_id}`]);
  }
  
  handleError(status) {
    alert('Network Error, Please go to upload when the network is available');
    this.notice = 'Proceed';
    this.rout.navigate(['MyRoute']);
  }


}
