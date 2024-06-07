import { Component, OnInit, ViewChild } from '@angular/core';
import { ProductService } from 'src/app/shared/services/product.service';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { debounceTime, take } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HttpClient } from "@angular/common/http";
import { DialogsService } from 'src/app/shared/services/dialogs.services';
import { DataLayerService } from 'src/app/shared/services/data-layer.service';
import { BookingsService } from 'src/app/shared/services/bookings.service';

import { Helpers } from '../../../helpers';
import * as _ from 'lodash';
import * as moment from 'moment';

@Component({
  selector: 'client-resource-bookings',
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
  filter: any = {};

  listObservable: Observable<any[]>;

  user: any = {};
  constructor(private dialogs: DialogsService, private service: BookingsService) {
    this.user = JSON.parse(localStorage.getItem("cwo_user"));
  }

  clientBookings: any = [];
  ngOnInit() {
    this.searchControl.valueChanges
      .pipe(debounceTime(200))
      .subscribe(value => {
        this.filter.search = value;

        this.offset = 0;
        this.items = [];
        this.loadMore();
      });

    var data = {
      filters: { clientId: this.user.clientId }
    };
    this.service.listBookings(data)
      .pipe(take(1)).subscribe((res) => {
        this.clientBookings = res['data'];
        // this.newBooking();
      });
  }

  newBooking() {
    var self = this;
    var dialog = this.dialogs.newResourceBooking(this.clientBookings[0].id, this.clientBookings[0].officeId, null, {
      id: this.user.clientId, name: this.user.name,
      email: this.user.email, phone: this.user.phone, company: this.user.companyName,
      clientSide: true
    });
    dialog.result.then(function(data) {
      if (data && data.bookingId) {
        self.dialogs.success("New  Booking is successful .. !", "Resource Booking")
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
      this.filter.clientId = this.user.clientId;
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

  cancelBooking(booking) {
    var data = {
      id: booking.id,
      bookingId: booking.bookingId,
      status: 'Cancelled',
      cancelled: true
    }
    var self = this;
    this.dialogs.confirm("Are you sure to cancel '" + booking.name + "' Booking for " + moment(booking.from).format("MMM DD, YYYY hh:mm a"), booking.resource.type + " Cancellation")
      .then( (result) => {
        if (result.value) {
          self.service.saveResourceBooking(data)
            .subscribe((res) => {
              console.log("ResourceBookingsList :: saveResourceBooking : res : ", res);
              if (res['data']) {
                self.dialogs.success("Resource Booking is cancelled successfully .!");
                self.offset = 0;
                self.items = [];
                self.loadMore();
              } else {
                self.dialogs.error(res['error'], "Error")
              }
            });
        }
      })
  }

}
