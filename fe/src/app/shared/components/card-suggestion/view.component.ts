import { Component, OnInit, Input } from '@angular/core';
import { AdminService } from 'src/app/shared/services/admin.service';
import * as _ from "lodash";
 
@Component({
  selector: 'card-suggestion',
  templateUrl: './view.component.html'
})
export class CardSuggestionComponent implements OnInit {
  @Input('type') type: string = "popup";
  @Input('placement') placement: string = "top";
  @Input('card') card: any = {};
  popOverTitle: any;
  popOverBody: any;

  constructor(private service: AdminService) { }

  ngOnInit() {
    this.placement = this.card.placement || 'top';
    this.type = this.card.type;
    this.popOverTitle = this.card.title;
    this.popOverBody = this.card.info;
  }

}
