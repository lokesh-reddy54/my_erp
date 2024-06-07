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
import * as _ from 'lodash';
import * as moment from 'moment';

@Component({
  selector: 'accounts-reports-revenueinvoices',
  templateUrl: './view.component.html'
})
export class AccountsRevenueInvoicesReportComponent implements OnInit, AfterViewInit {
  trackById = Helpers.trackById;

  searchControl: FormControl = new FormControl();
  loading: any = false;
  filters: any = {};

  constructor(private dialogs: DialogsService, private service: AdminService, public reportsService: ReportsService) {
  }

  ngAfterViewInit() { }

  ngOnInit() {
    this.searchControl.valueChanges
      .pipe(debounceTime(200))
      .subscribe(value => {
        this.filters.search = value;
        this.searchClient = value;
      });

    var startMonth = moment("2020-04-01");
    var endMonth = moment().endOf('month');
    startMonth = endMonth.clone().add(-11, 'months');
    var i = 0;
    while (startMonth.isSameOrBefore(endMonth)) {
      this.months.push({
        id: i + "",
        title: startMonth.clone().format("MMM, YY"),
        month: startMonth.clone().format("YYMM"),
        startDate: startMonth.clone().startOf('month'),
        endDate: startMonth.clone().endOf('month'),
      })
      startMonth.add(1, 'month');
      i++;
    }
    this.currentMonth = this.months[this.months.length - 1];

    this.loadData();
  }
  months: any = [];
  currentMonth: any;

  data: any;
  loadData() {
    if (!this.currentMonth.clients) {
      this.loading = true;
      this.filters.fromDate = this.currentMonth.startDate;
      this.filters.toDate = this.currentMonth.endDate;
      this.filters.search = this.searchClient;
      this.reportsService.getRevenueInvoices(this.filters)
        .pipe(take(1))
        .subscribe(
          res => {
            var data = res['data'];
            this.data = data;
            this.currentMonth.clients = [];
            this.generateClientsReport();
            this.loading = false;
          }, error => {

          });
    }
  }
  buildings: any = [];

  categories: any = [];
  monthlyReport: any = { months: [], rows: [] };
  colWidth: any = 10;

  clientWiseReport: boolean = false;
  searchClient: any;
  generateClientsReport() {
    this.clientWiseReport = true;
    var data = _.clone(this.data);
    var self = this;

    var clients = _(data)
      .groupBy(x => x.gstNo)
      .map((value, key) => ({ gstNo: key, values: value }))
      .value();

    _.each(clients, function(c) {
      var _client = c.values[0];
      var invoices = _(c.values)
        .groupBy(x => x.invoiceId)
        .map((value, key) => ({
          invoiceId: key,
          refNo: value[0].refNo,
          date: value[0].date,
          file: value[0].file,
          category: value[0].category,
          type: value[0].type,
          taxableAmount: value[0].taxableAmount,
          gst: value[0].gst,
          tds: value[0].tds,
          invoiceAmount: value[0].invoiceAmount,
          items: value
        })).value();
      _client.taxableAmount = _.sumBy(invoices, "taxableAmount");
      _client.gst = _.sumBy(invoices, "gst");
      _client.tds = _.sumBy(invoices, "tds");
      _client.total = _.sumBy(invoices, "invoiceAmount");
      _client.invoices = invoices;
      self.currentMonth.clients.push(_client);
      delete c.values;
    })
    self.currentMonth.clients = _.orderBy(self.currentMonth.clients, ['client'], ['asc']);
    this.sort.name = { asc: true }

    console.log("RevenueReport :: generateClientsReport : currentMonth : ", this.currentMonth);
  }

  sort: any = {}
  sortBy(tab, col) {
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
    var data = _.clone(tab.clients);
    tab.clients = _.orderBy(data, [col], [sortType]);
  }

  downloadInvoices() {
    var user = JSON.parse(localStorage.getItem("cwo_user"));
    var companyId = user && user.companyId ? user.companyId : 1;
    var url = environment.host + ":" + environment.port + "/v1/internal/reports/downloadInvoices/" + companyId + "/" + this.currentMonth.startDate.format("YYYY-MM")
    window.open(url, "_blank");
  }

}
