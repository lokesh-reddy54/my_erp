import { Component, OnInit, ViewChild } from '@angular/core';
import { ProductService } from 'src/app/shared/services/product.service';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { debounceTime,take } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HttpClient } from "@angular/common/http";
import { DialogsService } from 'src/app/shared/services/dialogs.services';
import { AdminService } from 'src/app/shared/services/admin.service';
import { BookingsService } from 'src/app/shared/services/bookings.service';
import { Helpers } from '../../../helpers';
import * as _ from 'lodash';

@Component({
  selector: 'admin-scheduler',
  templateUrl: './view.component.html'
})
export class AdminSchedulerComponent implements OnInit {
  searchControl: FormControl = new FormControl();
  filter: any = {};
  loading: boolean = false;

  constructor(private dialogs: DialogsService, private service: AdminService, private bookingService: BookingsService) { }

  ngOnInit() {
    this.searchControl.valueChanges
      .pipe(debounceTime(200))
      .pipe(take(1)).subscribe(value => {
        this.filter.search = value;
      });
  }

  raiseMonthlyInvoices() {
    var data = {}
    var self = this;
    this.dialogs.confirm("Are you sure to run Monthly Invoice Generation Job now .. ?")
      .then(event => {
        if (event.value) {
          self.loading = true;
          self.service.raiseMonthlyInvoices(data)
            .pipe(take(1)).subscribe(res => {
              self.loading = false;
              if (res['data']) {
                self.dialogs.success("Monthly Invoices Job Started .. ")
              } else if (res['error']) {
                self.dialogs.error(res['error']);
              }
            })
        }
      });
  }  

  settleShortTermBookings() {
    var data = {}
    var self = this;
    this.dialogs.confirm("Are you sure to Settle all ShortTerm Bookings .. ?")
      .then(event => {
        if (event.value) {
          self.loading = true;
          self.bookingService.settleShortTermBookings(data)
            .pipe(take(1)).subscribe(res => {
              self.loading = false;
              if (res['data']) {
                self.dialogs.success(res['data']);
              } else if (res['error']) {
                self.dialogs.error(res['error']);
              }
            })
        }
      });
  }
  updateFreeCredits() {
    var data = {}
    var self = this;
    this.dialogs.confirm("Are you sure to Add Monthly Free Credits to all Bookings .. ?")
      .then(event => {
        if (event.value) {
          self.loading = true;
          self.bookingService.updateFreeCredits(data)
            .pipe(take(1)).subscribe(res => {
              self.loading = false;
              if (res['data']) {
                self.dialogs.success(res['data']);
              } else if (res['error']) {
                self.dialogs.error(res['error']);
              }
            })
        }
      });
  }
}