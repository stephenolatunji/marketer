
import { Injectable, EventEmitter } from '@angular/core';  
import { Subscription } from 'rxjs/internal/Subscription';   

@Injectable({
  providedIn: 'root'
})
export class CallFuncInAppService {

  call = new EventEmitter(); 
  subsVar: Subscription;    
    
  constructor() { }    
    
  Call() {    
    this.call.emit();    
  }    

}
