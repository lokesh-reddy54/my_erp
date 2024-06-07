import { Component, OnInit, ViewChild } from '@angular/core';
import { ProductService } from 'src/app/shared/services/product.service';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HttpClient } from "@angular/common/http";
import { DialogsService } from 'src/app/shared/services/dialogs.services';
import { DataLayerService } from 'src/app/shared/services/data-layer.service';
import { BookingsService } from 'src/app/shared/services/bookings.service';

import { Helpers } from '../../../helpers';
import * as _ from 'lodash';

@Component({
  selector: 'resource-bookings',
  templateUrl: './list.component.html'
})
export class ResoureBookingsListComponent implements OnInit {
  searchControl: FormControl = new FormControl();
  booking: any = {};
  @ViewChild('list') list: any;

  items: any = [];
  selectedItem: any = {};
  loading: boolean = false;
  noResults: boolean = false;
  offset: number = 0;
  limit: number = 20;
  filter: any = { statuses:['Pending']};

  listObservable: Observable<any[]>;

  constructor(private dialogs: DialogsService, private service: BookingsService) { }

  ngOnInit() {
    this.searchControl.valueChanges
      .pipe(debounceTime(200))
      .subscribe(value => {
        this.filter.search = value;

        this.offset = 0;
        this.items = [];
        this.loadMore();
      });

    // this.newBooking();
  }

  newBooking() {
    var self = this;
    var dialog = this.dialogs.newResourceBooking();
    dialog.result.then(function(data) {
      if (data) {
        self.dialogs.success("New " + data.type + " Booking is successful .. !", data.client.name)
        self.offset = 0;
        self.items = [];
        self.loadMore();
      }
    })
  }

  loadMore() {
    console.log("loadmore :: ");
    if (!this.loading) {
      this.loading = true;
      var data = { filters: this.filter, limit: this.limit, offset: this.offset };
      this.service.listResourceBookings(data)
        .subscribe((res) => {
          console.log("ResourceBookingsList :: loadMore : res : ", res);
          if (res['data']) {
            this.items = this.items.concat(res['data']);
            this.loading = false;
            if (res['data'].length >= this.limit) {
              this.offset = this.offset + this.limit;
            }
          } else {
            this.dialogs.error(res['error'], "Error")
          }
        });
    }
  }

  resetList() {
    this.loading = false;
    this.offset = 0;
    this.items = [];
    this.loadMore();
  }

}
