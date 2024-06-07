import { Component, OnInit, ViewChild } from '@angular/core';
import { ProductService } from 'src/app/shared/services/product.service';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { debounceTime, take } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from "@angular/common/http";
import { DialogsService } from 'src/app/shared/services/dialogs.services';
import { DataLayerService } from 'src/app/shared/services/data-layer.service';
import { BookingsService } from 'src/app/shared/services/bookings.service';

import { Helpers } from '../../../helpers';
import * as _ from 'lodash';

@Component({
  selector: 'client-creddits-list',
  templateUrl: './view.component.html'
})
export class CreditsComponent implements OnInit {
  searchControl: FormControl = new FormControl();
  booking: any = {};
  @ViewChild('list') list: any;

  items: any = [];
  selectedItem: any = {};
  loading: boolean = false;
  noResults: boolean = false;
  offset: number = 0;
  limit: number = 20;
  filter: any = { status: "" };
  user: any;
  listObservable: Observable<any[]>;

  constructor(private dialogs: DialogsService, private route: ActivatedRoute, private service: BookingsService) { }

  ngOnInit() {
    var user = localStorage.getItem('cwo_user');
    if (user && user != '') {
      this.user = JSON.parse(user);
    }
    var id = this.route.snapshot.params['id'];
    this.getBookingCreditHistory(id);
  }

  creditsHistory: any = {};
  getBookingCreditHistory(id) {
    this.loading = true;
    this.service.getBookingCreditHistory(id)
      .pipe(take(1)).subscribe(res => {
        this.creditsHistory = res['data'];
        this.loading = false;
      });
  }

}
