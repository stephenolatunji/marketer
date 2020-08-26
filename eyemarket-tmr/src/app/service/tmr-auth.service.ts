import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class TmrAuthService implements CanActivate{

  constructor() { }

  canActivate(): boolean {
    if (localStorage.getItem('who')!=='TMR') {
      return false;
    }
    return true;
  }

}
