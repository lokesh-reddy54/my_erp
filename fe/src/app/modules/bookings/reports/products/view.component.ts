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

@Component({
  selector: 'bookings-reports-products',
  templateUrl: './view.component.html'
})
export class BookingsProductsReportComponent implements OnInit, AfterViewInit {
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
        this.loadData();
      });
    this.loadData();
  }

  data: any;
  loadData() {
    this.reportsService.getProductsAnalysis(this.filters)
      .pipe(take(1))
      .subscribe(
        res => {
          var data = res['data'];
          this.data = data;
          this.generateMonthlyReport(false);
        }, error => {

        });
  }

  buildings: any = [];
  selectedBuilding: any;
  reportType: any = "overall";

  deskTypes: any = [];
  monthlyReport: any = { months: [], rows: [] };
  colWidth: any = 10;

  generateMonthlyReport(buildingWise) {
    // console.log("ProductAnalysis ::: Data : ", this.data);
    var data = _.clone(this.data);
    var report = { months: [], rows: [] };

    if (this.deskTypes.length == 0) {
      this.deskTypes = _(data)
        .groupBy(x => x.deskType)
        .map((value, key) => ({ deskType: key, values: value }))
        .value();
      _.each(this.deskTypes, function(c) {
        c.types = _.uniq(_.map(c.values, 'officeType'));
        delete c.values;
      })
    }

    if (buildingWise) {
      var buildings = _.orderBy(data, ['buildingId'], ['asc'])
      this.buildings = _.uniq(_.map(buildings, 'building'));
      if (!this.selectedBuilding) {
        this.selectedBuilding = this.buildings[0];
      }
      data = _.filter(data, { building: this.selectedBuilding });
      this.selectedRow = null;
    }

    var months = [];
    if (this.monthlyReport.months.length == 0 || !buildingWise) {
      months = _.uniq(_.map(data, 'month'));
      report.months = _.clone(months);
      report.months.unshift("Product Type");
    } else {
      report.months = _.clone(this.monthlyReport.months);
      months = _.clone(this.monthlyReport.months);
      months.shift();
    }
    this.colWidth = 85 / (report.months.length - 1);

    var deskTypes = _(data)
      .groupBy(x => x.deskType)
      .map((value, key) => ({ deskType: key, values: value }))
      .value();

    var totals = [];
    var rows = [];
    _.each(deskTypes, function(c) {
      var row = { value: c.deskType };
      var cols = [row];
      var total = 0;
      _.each(months, function(m) {
        var sum = _.sumBy(_.filter(c.values, { month: m }), 'amount');
        cols.push({ value: sum });
        totals.push({ month: m, sum: sum });
      })
      rows.push({ cols: cols, types: [] })
    })

    _.each(this.deskTypes, function(c) {
      var deskTypeFound = false;
      _.each(rows, function(r) {
        if (r.cols[0].value == c.deskType) {
          report.rows.push(r);
          deskTypeFound = true;
        }
      })
      if (!deskTypeFound) {
        var cols = [{ value: c.deskType }];
        _.each(months, function(m) {
          cols.push({ value: 0 });
        })
        report.rows.push({ cols: cols, types: [] })
      }
    })

    var cols = [{ value: 'Total' }];
    _.each(months, function(m) {
      var sum = _.sumBy(_.filter(totals, { month: m }), 'sum');
      cols.push({ value: sum });
    })
    report.rows.push({ cols: cols, types: null })

    this.monthlyReport = report;
    console.log("RevenueReport :: generateMonthlyReport : report: ", report);
  }

  selectedRow: any;
  getTypes(row) {
    if (row.cols[0].value != "Enterprise") {
      this.selectedRow.selected = false;
      this.selectedRow.types = [];
      this.selectedRow = null;
      return;
    }
    if (this.selectedRow) {
      this.selectedRow.selected = false;
    }
    if (row.types && row.types.length) {
      row.types = [];
      row.selected = false;
      this.selectedRow = null;
    } else if (row.types) {
      var months = _.clone(this.monthlyReport.months);
      months.shift();

      var types = [];
      var data;
      if (this.selectedBuilding) {
        data = _.filter(this.data, { building: this.selectedBuilding, deskType: row.cols[0].value });
      } else {
        data = _.filter(this.data, { deskType: row.cols[0].value });
      }
      var _types = _(data)
        .groupBy(x => x.officeType)
        .map((value, key) => ({ type: key, values: value }))
        .value();

      _.each(_types, function(c) {
        var row = { value: c.type };
        var cols = [row];

        _.each(months, function(m) {
          var sum = _.sumBy(_.filter(c.values, { month: m }), 'amount');
          cols.push({ value: sum });
        })
        types.push({ cols: cols })
      })
      if (types.length) {
        row.selected = true;
        row.types = types;
        console.log("RevenueReport :: generateMonthlyReport : row.types: ", row.types);
        this.selectedRow = row;
      }
    }
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

}
