import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tmr-home',
  templateUrl: './tmr-home.component.html',
  styleUrls: ['./tmr-home.component.scss']
})
export class TmrHomeComponent implements OnInit {

  userId;

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.userId = localStorage.getItem('userId');
  }

}
