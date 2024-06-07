import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { ProductService } from 'src/app/shared/services/product.service';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from "@angular/common/http";
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, take } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import { CommonService } from 'src/app/shared/services/common.service';
import { DialogsService } from 'src/app/shared/services/dialogs.services';
import { AdminService } from 'src/app/shared/services/admin.service';
import { ReportsService } from 'src/app/shared/services/reports.service';
import * as _ from 'lodash';

declare let $: any;

@Component({
  selector: 'accounts-reports-liabilities',
  templateUrl: './view.component.html'
})
export class AccountsLiabilityReportComponent implements OnInit, AfterViewInit {
  searchControl: FormControl = new FormControl();
  loading: any = false;

  buildings: any = [];
  selectedBuilding: any;
  overAllLiability: any = 0;
  totalLiability: any = 0;
  filters: any = {};
  reportType: any = "overall";

  constructor(private dialogs: DialogsService, private service: AdminService, public reportsService: ReportsService) {
  }

  ngAfterViewInit() { }

  ngOnInit() {
    this.searchControl.valueChanges
      .pipe(debounceTime(200))
      .pipe(take(1))
      .subscribe(value => {
        this.filters.search = value;
        this.generateReport(false);
      });

    this.loadData();
  }

  data: any;
  loadData() {
    this.loading = true;
    this.reportsService.getLiability(this.filters).pipe(take(1)).subscribe(
      res => {
        var data = res['data'];
        this.data = data;
        this.generateReport(false);
      }, error => {

      });
  }

  failed: any = [];
  booked: any = [];
  active: any = [];
  exiting: any = [];
  exited: any = [];
  settled: any = [];
  tdsHolded: any = [];

  report: any = { failed: {}, booked: {}, active: {}, exiting: {}, exited: {}, settled: {}, tdsHolded: {} }
  generateReport(buildingWise) {
    var self = this;
    var data = this.data;
    this.overAllLiability = _.sumBy(data, "amount");

    if (buildingWise || this.selectedBuilding) {
      var buildings = _.orderBy(data, ['buildingId'], ['asc'])
      this.buildings = _.uniq(_.map(buildings, 'building'));
      if (!this.selectedBuilding) {
        this.selectedBuilding = this.buildings[0];
      }
      data = _.filter(data, { building: this.selectedBuilding });
    } else {
      this.buildings = [];
    }

    this.totalLiability = _.sumBy(data, "amount");

    if (this.filters.search && this.filters.search != '') {
      data = _.filter(data, function(c) {
        var name = c.client.toLowerCase();
        var search = self.filters.search.toLowerCase();
        return name.indexOf(search) > -1
      })
    }

    this.booked = _.filter(data, { status: 'Booked' });
    this.active = _.filter(data, { status: 'Active' });
    this.exiting = _.filter(data, { status: 'Exiting' });
    this.exited = _.filter(data, { status: 'Exited' });
    this.failed = _.filter(data, { status: 'Failed' });
    this.settled = _.filter(data, { status: 'Settled' });
    this.tdsHolded = _.filter(data, { status: 'TDSHolded' });

    this.report.failed.total = _.sumBy(this.failed, 'amount');
    this.report.failed.count = this.failed.length;
    this.report.booked.total = _.sumBy(this.booked, 'amount');
    this.report.booked.count = this.booked.length;
    this.report.active.total = _.sumBy(this.active, 'amount');
    this.report.active.count = this.active.length;
    this.report.exiting.total = _.sumBy(this.exiting, 'amount');
    this.report.exiting.count = this.exiting.length;
    this.report.exited.total = _.sumBy(this.exited, 'amount');
    this.report.exited.count = this.exited.length;
    this.report.settled.total = _.sumBy(this.settled, 'amount');
    this.report.settled.count = this.settled.length;
    this.report.tdsHolded.total = _.sumBy(this.tdsHolded, 'amount');
    this.report.tdsHolded.count = this.tdsHolded.length;

    this.sortBy('', 'amount');

    this.loading = false;
  }


  sort: any = {}
  sortBy(type, col) {
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

    this.failed = _.orderBy(this.failed, [col], [sortType]);
    this.booked = _.orderBy(this.booked, [col], [sortType]);
    this.active = _.orderBy(this.active, [col], [sortType]);
    this.exiting = _.orderBy(this.exiting, [col], [sortType]);
    this.exited = _.orderBy(this.exited, [col], [sortType]);
    this.settled = _.orderBy(this.settled, [col], [sortType]);
    this.tdsHolded = _.orderBy(this.tdsHolded, [col], [sortType]);
  }
}
