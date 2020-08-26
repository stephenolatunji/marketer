import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-am-online',
  templateUrl: './am-online.component.html',
  styleUrls: ['./am-online.component.css']
})
export class AmOnlineComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  okThanks() {
    document.getElementById('container').style.display = 'none';
  }

}
