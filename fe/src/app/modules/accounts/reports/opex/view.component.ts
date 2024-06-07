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
  selector: 'accounts-reports-opex',
  templateUrl: './view.component.html'
})
export class AccountsOpexReportComponent implements OnInit, AfterViewInit {
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
    if (this.opexAp) {
      this.filters.onlyAp = true;
    }
    this.filters.fromDate = moment().startOf('month').add(-5, 'month');
    this.filters.toDate = moment().endOf('month');
    this.reportsService.getBills(this.filters)
      .pipe(take(1))
      .subscribe(
        res => {
          var data = res['data'];
          this.data = data;
          this.changeView();
        }, error => {

        });
  }

  buildings: any = [];
  selectedBuilding: any;
  buildingWise: any = false;
  opexAp: any = false;
  overDue: any = false;
  reportType: any = "category";

  categories: any = [];
  monthlyReport: any = { months: [], rows: [] };
  colWidth: any = 10;

  changeView() {
    if (this.opexAp) {
      this.generateOpexApReport();
    } else {
      if (!this.buildingWise) {
        this.selectedBuilding = null;
      }
      this.categories = [];
      this.generateMonthlyOpexReport();
    }
  }

  apReportType: any = "total";
  apReport: any = {};
  serviceProviders: any = [];
  selectedServiceProvider: any = {};
  opexApBills: any = [];
  generateOpexApReport() {
    var self = this;
    var report = { months: [], rows: [] };
    var data = this.data;

    if (this.apReportType == 'total') {
      this.selectedBuilding = null;
      this.selectedServiceProvider = null;

    } else if (this.apReportType == 'building') {
      this.selectedServiceProvider = null;
      var buildings = _.orderBy(data, ['buildingId'], ['asc'])
      this.buildings = _.uniq(_.map(buildings, 'building'));
      if (!this.selectedBuilding) {
        this.selectedBuilding = this.buildings[0];
      }
      data = _.filter(data, { building: this.selectedBuilding });

    } else if (this.apReportType == 'serviceProvider') {
      this.selectedBuilding = null;
      var serviceProviders = _.orderBy(data, ['serviceProvider'], ['asc'])
      this.serviceProviders = _.uniq(_.map(serviceProviders, 'serviceProvider'));
      if (!this.selectedServiceProvider) {
        this.selectedServiceProvider = this.serviceProviders[0];
      }
      data = _.filter(data, { serviceProvider: this.selectedServiceProvider });
    }

    var _months = _.clone(_.uniq(_.map(data, 'month')));
    var months = [];
    _.each(_months, function(m) {
      months.push({ name: m, total: 0 });
    })
    report.months = _.clone(months);
    report.months.push({ name: "Total", total: 0 });
    this.colWidth = 70 / (report.months.length);

    var opexApBills = _(data)
      .groupBy(x => x.category)
      .map((value, key) => ({
        name: key,
        bills: value
      }))
      .value();

    _.each(opexApBills, function(opexCategoryBill) {
      var opexTypeBills = _(opexCategoryBill.bills)
        .filter(object => object.type != null)
        .groupBy(x => x.type)
        .map((value, key) => ({
          name: key,
          bills: value
        }))
        .value();
      opexCategoryBill.opexTypeBills = opexTypeBills;
      opexCategoryBill.count = 0;
      opexCategoryBill.billsAmount = 0;
      delete opexCategoryBill.bills;

      _.each(opexCategoryBill.opexTypeBills, function(typeBill) {
        opexCategoryBill.count = opexCategoryBill.count + typeBill.bills.length;
        opexCategoryBill.billsAmount = opexCategoryBill.billsAmount + _.sumBy(typeBill.bills, 'amount');

        var itemBills = _(typeBill.bills)
          .filter(object => object.item != null)
          .groupBy(x => x.item)
          .map((value, key) => ({
            name: key,
            bills: value
          }))
          .value();
        if (itemBills.length) {
          typeBill.itemBills = itemBills;
          delete typeBill.bills;

          _.each(typeBill.itemBills, function(itemBill) {
            itemBill.values = [];
            itemBill.total = 0;
            _.each(_months, function(m) {
              if (self.overDue) {
                var dueBills = _.filter(itemBill.bills, function(i) {
                  return i.month == m && moment(i.billDueDate).isBefore(moment());
                })
                var amount = _.sumBy(_.filter(dueBills, { month: m }), 'amount');
                itemBill.values.push(amount);
                itemBill.total = itemBill.total + amount;
                var rm = _.find(report.months, { name: m });
                rm.total = rm.total + amount;
              } else {
                var amount = _.sumBy(_.filter(itemBill.bills, { month: m }), 'amount');
                itemBill.values.push(amount);
                itemBill.total = itemBill.total + amount;
                var rm = _.find(report.months, { name: m });
                rm.total = rm.total + amount;
              }
            })
            itemBill.values.push(itemBill.total);
            delete itemBill.bills;
          })
        } else {
          typeBill.values = [];
          typeBill.total = 0;
          _.each(_months, function(m) {
            if (self.overDue) {
              var dueBills = _.filter(typeBill.bills, function(i) {
                return i.month == m && moment(i.billDueDate).isBefore(moment());
              })
              var amount = _.sumBy(_.filter(dueBills, { month: m }), 'amount');
              typeBill.values.push(amount);
              typeBill.total = typeBill.total + amount;
              var rm = _.find(report.months, { name: m });
              rm.total = rm.total + amount;
            } else {
              var amount = _.sumBy(_.filter(typeBill.bills, { month: m }), 'amount');
              typeBill.values.push(amount);
              typeBill.total = typeBill.total + amount;
              var rm = _.find(report.months, { name: m });
              rm.total = rm.total + amount;
            }
          })
          typeBill.values.push(typeBill.total);
          delete typeBill.bills;
        }
      })
    })

    console.log("opexApBills ::: ", opexApBills);
    console.log("opexApBills ::: report ", report);
    var totalAp = 0;
    _.each(report.months, function(m) {
      totalAp = totalAp + m.total;
    })
    report.months[report.months.length - 1]['total'] = totalAp;
    this.apReport = report;
    this.opexApBills = opexApBills;
  }

  generateMonthlyOpexReport() {
    var self = this;
    var report = { months: [], rows: [] };
    var data = this.data;

    if (this.buildingWise) {
      var buildings = _.orderBy(data, ['buildingId'], ['asc'])
      this.buildings = _.uniq(_.map(buildings, 'building'));
      if (!this.selectedBuilding) {
        this.selectedBuilding = this.buildings[0];
      }
      data = _.filter(data, { building: this.selectedBuilding });
      this.selectedRow = null;
    }

    if (this.selectedBuilding == 'Head Office') {
      data = _.filter(data, function(o) { return o.isOfficeExpense == 1; })
    } else {
      data = _.filter(data, function(o) { return o.isOfficeExpense == 0; })
    }

    if (this.categories.length == 0) {
      this.categories = _(data)
        .groupBy(x => x[self.reportType])
        .map((value, key) => ({ category: key, values: value }))
        .value();
      _.each(this.categories, function(c) {
        c.types = _.uniq(_.map(c.values, self.reportType));
        delete c.values;
      })
    }


    var months = [];
    if (this.monthlyReport.months.length == 0 || !this.buildingWise) {
      months = _.uniq(_.map(data, 'month'));
      report.months = _.clone(months);
      if (this.reportType == "serviceProvider") {
        report.months.unshift("Provider");
      } else if (this.reportType == "paymentMode") {
        report.months.unshift("Payment Mode");
      } else {
        report.months.unshift("OpEx Codes");
      }
    } else {
      report.months = _.clone(this.monthlyReport.months);
      months = _.clone(this.monthlyReport.months);
      months.shift();
    }
    this.colWidth = 85 / (report.months.length - 1);

    var categories = _(data)
      .groupBy(x => x[self.reportType])
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
    console.log("RevenueReport :: generateMonthlyOpexReport : report: ", report);
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
      console.log("RevenueReport :: generateMonthlyOpexReport : row.types: ", row.types);
      this.selectedRow = row;
    }
  }

}
