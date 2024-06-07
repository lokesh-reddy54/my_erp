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
  selector: 'accounts-reports-revenue',
  templateUrl: './view.component.html'
})
export class AccountsRevenueReportComponent implements OnInit, AfterViewInit {
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
        if (this.clientWiseReport) {
          this.generateClientsReport();
        } else {
          this.generateMonthlyReport(this.selectedBuilding ? true : false);
        }
      });
    this.loadData();
  }

  data: any;
  loadData() {
    this.reportsService.getRevenue({filters: this.filters})
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

  categories: any = [];
  monthlyReport: any = { months: [], rows: [] };
  colWidth: any = 10;

  generateMonthlyReport(buildingWise) {
    this.clientWiseReport = false;
    var report = { months: [], rows: [] };
    var data = this.data;
    var self = this;

    if (this.categories.length == 0) {
      this.categories = _(data)
        .groupBy(x => x.category)
        .map((value, key) => ({ category: key, values: value }))
        .value();
      _.each(this.categories, function(c) {
        c.types = _.uniq(_.map(c.values, 'type'));
        delete c.values;
      })
    }

    if (self.searchClient && self.searchClient != '') {
      data = _.filter(data, function(c) {
        var name = c.client.toLowerCase();
        var search = self.searchClient.toLowerCase();
        return name.indexOf(search) > -1 || c.building.indexOf(search) > -1
      })

      this.selectedBuilding = null;
    }

    if (buildingWise) {
      var buildings = _.orderBy(data, ['buildingId'], ['asc'])
      this.buildings = _.uniq(_.map(buildings, 'building'));
      if (!this.selectedBuilding) {
        this.selectedBuilding = this.buildings[0];
      }
      data = _.filter(data, { building: this.selectedBuilding });
      this.selectedRow = null;
    } else {
      this.selectedBuilding = null;
    }

    var months = [];
    if (this.monthlyReport.months.length == 0 || !buildingWise) {
      months = _.uniq(_.map(data, 'month'));
      report.months = _.clone(months);
      report.months.unshift("Revenue Type");
    } else {
      report.months = _.clone(this.monthlyReport.months);
      months = _.clone(this.monthlyReport.months);
      months.shift();
    }
    this.colWidth = 85 / (report.months.length - 1);

    var categories = _(data)
      .groupBy(x => x.category)
      .map((value, key) => ({ category: key, values: value }))
      .value();

    var totals = [];
    var rows = [];
    _.each(categories, function(c) {
      var row = { value: c.category };
      var cols = [row];
      var total = 0;
      _.each(months, function(m) {
        var sum = _.sumBy(_.filter(c.values, { month: m }), 'amount');
        cols.push({ value: sum });
        totals.push({ month: m, sum: sum });
      })
      rows.push({ cols: cols, types: [] })
    })

    _.each(this.categories, function(c) {
      var categoryFound = false;
      _.each(rows, function(r) {
        if (r.cols[0].value == c.category) {
          report.rows.push(r);
          categoryFound = true;
        }
      })
      if (!categoryFound) {
        var cols = [{ value: c.category }];
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
    if (this.selectedRow) {
      this.selectedRow.selected = false;
    }
    if (row.types && row.types.length) {
      row.types = [];
      row.selected = false;
      this.selectedRow = null;
    } else if (row.types) {
      row.selected = true;
      var months = _.clone(this.monthlyReport.months);
      months.shift();

      var types = [];
      var data;
      if (this.selectedBuilding) {
        data = _.filter(this.data, { building: this.selectedBuilding, category: row.cols[0].value });
      } else {
        data = _.filter(this.data, { category: row.cols[0].value });
      }
      var _types = _(data)
        .groupBy(x => x.type)
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

      row.types = types;
      console.log("RevenueReport :: generateMonthlyReport : row.types: ", row.types);
      this.selectedRow = row;
    }
  }

  clientWiseReport: boolean = false;
  tabs: any = [];
  searchClient: any;
  generateClientsReport() {
    this.clientWiseReport = true;
    var data = _.clone(this.data);
    var self = this;

    this.tabs = _(data)
      .groupBy(x => x.month)
      .map((value, key) => ({ month: key, values: value }))
      .value();
      _.each(this.tabs, function(t) {
      console.log("TTTTTTTTTTTTTTTTT", t)
      t.clients = [];
      var clients = [];
      var _clients = _.filter(data, { month: t.month });
      if (self.searchClient && self.searchClient != '') {
        _clients = _.filter(_clients, function(c) {
          var name = c.client.toLowerCase();
          var search = self.searchClient.toLowerCase();
          return name.indexOf(search) > -1 || c.building.indexOf(search) > -1
        })
      }

      clients = _(_clients)
        .groupBy(x => x.client)
        .map((value, key) => ({ client: key, values: value }))
        .value();

      _.each(clients, function(c) {
        var _client = { name: c.client, liability: 0, rent: 0, others: 0, total: 0 };
        _.each(c.values, function(i) {
          if (i.category == 'Security') {
            _client.liability = _client.liability + i.amount;
          } else if (i.category == 'Other') {
            _client.others = _client.others + i.amount;
          } else {
            _client.rent = _client.rent + i.amount;
          }
        })
        _client.total = _client.liability + _client.rent + _client.others;
        t.clients.push(_client);
        delete t.values;

        t.clients = _.orderBy(t.clients, ['name'], ['asc']);
      })
    })
    this.sort.name = { asc: true }

    console.log("RevenueReport :: generateClientsReport : tabs : ", this.tabs);
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
