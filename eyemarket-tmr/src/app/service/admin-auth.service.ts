import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AdminAuthService {

  constructor(private http: HttpClient) { }

  public callBack;

  public fakeTokenData = {
    fakeToken: null,
    userIdentity1: null,
    userIdentity2: null,
    token1: null,
    token2: null,
    finalToken: null
  }

  isAuthenticated() {
    if(localStorage.getItem('shuke') !== null && localStorage.getItem('userId')!==null && localStorage.getItem('shuke').slice(0,3)) {
      return this.checkAuth(localStorage.getItem('userId'));
    }
    else {
      return false
    }
  }
  
  setAuth(userId) {
    let token = 'din'+this.generateToken(userId);
    let setToken = this.setToken(token);
    
    (setToken)? this.callBack = this.checkAuth(userId) : this.callBack = false;

    if(this.callBack) {
      return true
    }
    else {
      return false
    }
  }

  generateToken(userId) {
    this.fakeTokenData.fakeToken = Math.random().toString(36).substring(2) + 
    Math.random()*100000000000000000;
    this.fakeTokenData.userIdentity1 =  userId.slice(0,1).toLowerCase();
    this.fakeTokenData.userIdentity2 = userId.slice(2,3).toLowerCase();
    this.fakeTokenData.token1 = this.fakeTokenData.fakeToken.slice(0, 10);
    this.fakeTokenData.token2 = this.fakeTokenData.fakeToken.slice(10, 20);
    this.fakeTokenData.finalToken = this.fakeTokenData.token1 + this.fakeTokenData.userIdentity1 +
    this.fakeTokenData.token2 + this.fakeTokenData.userIdentity2;

    // set user intolocalStorage
    localStorage.setItem('userId', userId);

    return this.fakeTokenData.finalToken;
  }

  setToken(token) {
    document.cookie = "shuke="+token;
    localStorage.setItem('shuke', token);
    
    return true
  }

  checkAuth(userId) {
    if(userId!==null) {
      let tokenFromLocalStorage = localStorage.getItem('shuke');
      let tokenFromCookie = this.getTokenFromCookie();
      let loggedInUserId = userId;
      // if( tokenFromCookie === tokenFromLocalStorage &&
      if( 
        tokenFromLocalStorage !== null &&
        tokenFromCookie.slice(13,14) === loggedInUserId.slice(0,1).toLowerCase() &&
        tokenFromCookie.slice(24,25) === loggedInUserId.slice(2,3).toLowerCase()) {
          return true
        }
        else {
          return false;
        }
    }
    else {
      return false
    }
  }

  logout() {
    localStorage.clear();
    document.cookie = "shuke=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    return true;
  }

  getTokenFromCookie() {
    var name = "shuke=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  } 

}
