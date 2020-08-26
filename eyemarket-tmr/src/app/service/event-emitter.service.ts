import { Injectable, EventEmitter } from '@angular/core';  
import { Subscription } from 'rxjs/internal/Subscription';   

@Injectable({
  providedIn: 'root'
})
export class EventEmitterService {

  sideBarOn = new EventEmitter(); 
  subsVar: Subscription;    
    
  constructor() { }    
    
  OpenSideBar() {    
    this.sideBarOn.emit();    
  }    

}

