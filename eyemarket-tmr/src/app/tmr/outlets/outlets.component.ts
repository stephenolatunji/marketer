import { Component, OnInit } from '@angular/core';
import { IOutlet } from '../models/outlet';
import { outlets } from '../../../assets/data/outlets';
import { Router } from '@angular/router';

@Component({
  selector: 'app-outlets',
  templateUrl: './outlets.component.html',
  styleUrls: ['./outlets.component.scss']
})
export class OutletsComponent implements OnInit {
  outlets: IOutlet[] = outlets;
  constructor( public router: Router ) {}

  ngOnInit(): void {}
  
  backFunc() {
    this.router.navigate(['map'])
  }
}
