import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { outlets } from 'src/assets/data/outlets';
import { ServerService } from 'src/app/service/server.service';

@Component({
  selector: 'app-outlet',
  templateUrl: './outlet.component.html',
  styleUrls: ['./outlet.component.scss']
})
export class OutletComponent implements OnInit {
  id;
  outlet;

  constructor(private route: ActivatedRoute, private server: ServerService, public rout: Router) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.id = params.get('id');
      this.outlet = outlets[--this.id];
    });
  }

  snapShot(): void {
      this.server.tempStoreDataForCamera(this.id, 'chiller');
      this.rout.navigate(['camera']);
  }

  opportunity(): void {
      this.server.tempStoreDataForCamera(this.id, 'opportunity');
      this.rout.navigate(['camera']);
  }

  survey(): void {
      this.server.tempStoreDataForCamera(this.id, 'survey');
      this.rout.navigate(['survey']);
  }

}
