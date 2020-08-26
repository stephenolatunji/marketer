import { Component, OnInit, Input } from '@angular/core';
import { ServerService } from 'src/app/service/server.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  @Input() searchResult

  public task; _image; show: boolean = false;

  constructor(private server: ServerService) { }

  ngOnInit(): void {
    // this.task = this.server.returnDataForSearch();
  }

  image(x) {
    this._image = x;
    this.show = !this.show
  }

  backFunc_() {
    this.show = !this.show
  }

}
