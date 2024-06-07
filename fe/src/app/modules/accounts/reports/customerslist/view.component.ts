import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { ProductService } from 'src/app/shared/services/product.service';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { debounceTime, take } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HttpClient } from "@angular/common/http";

import { Helpers } from 'src/app/helpers';
import { environment } from 'src/environments/environment';
import { CommonService } from 'src/app/shared/services/common.service';
import { DialogsService } from 'src/app/shared/services/dialogs.services';
import { AdminService } from 'src/app/shared/services/admin.service';
import { ReportsService } from 'src/app/shared/services/reports.service';
import { BookingsService } from 'src/app/shared/services/bookings.service';
import * as _ from 'lodash';
import * as moment from 'moment';

@Component({
  selector: 'accounts-reports-customerslist',
  templateUrl: './view.component.html'
})
export class AccountsCustomersListReportComponent implements OnInit, AfterViewInit {
  trackById = Helpers.trackById;

  searchControl: FormControl = new FormControl();
  loading: any = false;
  filters: any = { statuses: [] };
  // filters: any = { statuses:['Booked','Active','Exiting','Exited']};

  constructor(private dialogs: DialogsService, private service: AdminService,
    private bookingsService: BookingsService, public reportsService: ReportsService) {
  }

  ngAfterViewInit() { }

  ngOnInit() {
    this.searchControl.valueChanges
      .pipe(debounceTime(200))
      .subscribe(value => {
        this.filters.search = value;
        this.searchClient = value;
      });

    this.loadData();
  }

  data: any;
  clients: any = [];
  loadData() {
    this.loading = true;
    this.filters.search = this.searchClient;
    this.reportsService.listCustomers(this.filters)
      .pipe(take(1))
      .subscribe(
        res => {
          var data = res['data'];
          this.data = data;
          this.clients = [];
          this.generateClientsReport();
          this.loading = false;
        }, error => {

        });
  }
  buildings: any = [];

  categories: any = [];
  monthlyReport: any = { months: [], rows: [] };
  colWidth: any = 10;

  clientWiseReport: boolean = false;
  searchClient: any;
  statuses: any = [];
  generateClientsReport() {
    this.clientWiseReport = true;
    var data = _.clone(this.data);
    var self = this;

    var clients = _(data)
      .groupBy(x => x.id)
      .map((value, key) => ({
        id: key,
        company: value[0].company,
        gstNo: value[0].gstNo,
        name: value[0].name,
        panNo: value[0].panNo,
        _bookings: value
      })).value();

    _.each(clients, function(c) {
      c.bookings = _.filter(c._bookings, function(b) {
        return b.brefNo != null
      })
      if (!c.bookings.length) {
        c.bookings = c._bookings;
      }
      delete c._bookings;
    })

    self.clients = _.orderBy(clients, ['company'], ['asc']);
    this.sort.name = { asc: true }
    console.log("Clients :: ", self.clients);
  }

  sort: any = { company: { asc: true } }
  sortBy(col) {
    var sort = _.clone(this.sort);
    var _sort = {};
    var sortType = 'asc';
    if (sort[col] && sort[col].asc) {
      sort[col].asc = false;
      sort[col].desc = true;
      sortType = 'desc';
      this.sort = sort;
    } else {
      _sort[col] = { asc: true };
      this.sort = _sort;
    }
    var data = _.clone(this.clients);
    this.clients = _.orderBy(data, [col], [sortType]);
  }

  ledgerAdded(booking) {
    var self = this;
    this.dialogs.confirm("Are you sure that you have added new ledger in Account Books for " + booking.company + " ?")
      .then(event => {
        if (event.value) {
          self.loading = true;
          self.bookingsService.saveBooking({ id: booking.bookingId, itLedgerAdded: 1 }).subscribe(res => {
            if (res['data']) {
              booking.itLedgerAdded = 1;
              self.dialogs.success("Booking " + booking.refNo + " ledger has registered.");
              self.loading = false;
            }
          })
        }
      })
  }
  ledgerSettled(booking) {
    var self = this;
    this.dialogs.confirm("Are you sure that you have settled ledger in Account Books for " + booking.company + " ?")
      .then(event => {
        if (event.value) {
          self.loading = true;
          self.bookingsService.saveBooking({ id: booking.bookingId, itLedgerSettled: 1 }).subscribe(res => {
            if (res['data']) {
              booking.itLedgerSettled = 1;
              self.dialogs.success("Booking " + booking.refNo + " ledger has settled.")
              self.loading = false;
            }
          })
        }
      })
  }


  @ViewChild('exitRefundModal') exitRefundModal: any;
  booking:any;
  showExitStatement(booking){
    this.booking = booking;
    this.dialogs.modal(this.exitRefundModal, { size: 'sm' });
  }
}
