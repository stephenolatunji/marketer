import { Injectable } from '@angular/core';
import { CanActivate } from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class BdrLockService implements CanActivate {

  constructor() { }

  canActivate(): boolean {
    if (localStorage.getItem('who')!=='BDR') {
      return false;
    }
    return true;
  }

}
