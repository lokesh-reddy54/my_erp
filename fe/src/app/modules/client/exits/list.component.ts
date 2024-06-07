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
import { Utils } from 'src/app/shared/utils';
import * as _ from 'lodash';

@Component({
  selector: 'client-exit-requests',
  templateUrl: './list.component.html'
})
export class ExitRequestsComponent implements OnInit {
  searchControl: FormControl = new FormControl();
  booking: any = {};
  @ViewChild('list') list: any;
  @ViewChild('exitRequestModal') exitRequestModal: any;

  exitForm: FormGroup;
  items: any = [];
  selectedItem: any = {};
  loading: boolean = false;
  noResults: boolean = false;
  offset: number = 0;
  limit: number = 20;
  filter: any = { status: "" };
  user: any;
  listObservable: Observable<any[]>;

  constructor(private dialogs: DialogsService, private service: BookingsService) { }

  ngOnInit() {
    var user = localStorage.getItem('cwo_user');
    if (user && user != '') {
      this.user = JSON.parse(user);
    }
    this.exitForm = new FormGroup({
      exitDate: new FormControl("", Validators.required),
    });

    this.searchControl.valueChanges
      .pipe(debounceTime(200))
      .subscribe(value => {
        this.filter.search = value;
        this.resetList();
      });
  }

  loadMore() {
    console.log("loadmore :: ");
    if (!this.loading) {
      this.loading = true;
      this.filter.clientId = this.user.clientId;
      this.filter.getExitRequest = true;
      var data = { filters: this.filter, limit: this.limit, offset: this.offset };
      this.service.listBookings(data)
        .pipe(take(1)).subscribe((res) => {
          console.log("BookingList :: loadMore : res : ", res);
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
    this.offset = 0;
    this.limit = 20;
    this.items = [];
    this.loadMore();
  }

  requestExit() {
    this.loading = true;
    var data = this.exitForm.value;
    data.bookingId = this.booking.id;
    data.exitDate = Utils.ngbDateToDate(data.exitDate);
    this.service.requestExit(data).pipe(take(1)).subscribe(
      res => {
        if (res['data']) {
          this.dialogs.success("Booking Exit Request is submitted successfully ");
          this.loading = false;
          this.resetList();
          this.openedModal.close();

        } else if (res['error']) {
          this.dialogs.error(res['error'])
        }
      },
      error => {
        this.dialogs.error(error, 'Error while saving')
      }
    )
  }
  cancelExitRequest(booking) {
    this.loading = true;
    this.service.cancelExitRequest(booking.id).pipe(take(1)).subscribe(
      res => {
        if (res['data']) {
          this.dialogs.success("Booking Exit request is cancelled successfully ");
          this.loading = false;
          this.resetList();
        } else if (res['error']) {
          this.dialogs.error(res['error'])
        }
      },
      error => {
        this.dialogs.error(error, 'Error while saving')
      }
    )
  }

  openedModal: any;
  openExitRequest(booking) {
    this.booking = booking;
    this.openedModal = this.dialogs.modal(this.exitRequestModal, { size: 'sm' });
    var self = this;
    this.openedModal.result.then(function() {
      self.loading = false;
      self.exitForm.reset();
    }).catch(function(e) {
      self.loading = false;
      self.exitForm.reset();
    })
  }

}
