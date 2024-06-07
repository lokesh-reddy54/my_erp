import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { ProductService } from 'src/app/shared/services/product.service';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { debounceTime, take } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from "@angular/common/http";

import { environment } from 'src/environments/environment';
import { CommonService } from 'src/app/shared/services/common.service';
import { DialogsService } from 'src/app/shared/services/dialogs.services';
import { AdminService } from 'src/app/shared/services/admin.service';
import { ReportsService } from 'src/app/shared/services/reports.service';
import * as _ from 'lodash';
import * as moment from 'moment';

declare let $: any;
declare let SVG: any;

@Component({
  selector: 'accounts-reports-expenses',
  templateUrl: './view.component.html'
})
export class AccountsExpensesReportComponent implements OnInit, AfterViewInit {

  countries: any = [];
  selectedCountry: any = {};
  cities: any = [];
  selectedCity: any = {};
  locations: any = [];
  selectedLocation: any = {};
  vendors: any = [];
  selectedVendor: any = {};
  buildings: any = [];
  selectedOffice: any = {};
  categories: any = [];
  selectedCategory: any = {};
  types: any = [];
  selectedType: any = {};
  skus: any = [];
  selectedSku: any = {};
  services: any = [];
  selectedService: any = {};


  buildingsFilters: any = { type: '' };
  categoriesFilters: any = {};
  typesFilters: any = {};
  skusFilters: any = {};
  servicesFilters: any = {};

  isHq: any = 0;
  constructor(private dialogs: DialogsService, private service: AdminService, public reportsService: ReportsService, private route: ActivatedRoute) {
    this.isHq = parseInt(this.route.snapshot.params['ho']);
  }

  ngAfterViewInit() { }

  ngOnInit() {
    this.loading = true;
    this.service.listCountries({ filters: { active: 1 }, offset: 0, limit: 100 }).pipe(take(1)).subscribe(
      res => {
        this.countries = res['data'];
        this.selectedCountry = res['data'][0];
        this.onCountrySelected();
      });
  }

  onCountrySelected() {
    this.service.listCities({ filters: { countryId: this.selectedCountry.id, active: 1 }, offset: 0, limit: 100 }).pipe(take(1)).subscribe(
      res => {
        this.cities = res['data'];
        this.selectedCity = {};
        this.selectedLocation = {};
        this.selectedCity = res['data'][0];
        this.onCitySelected();
      });
  }
  onCitySelected() {
    this.service.listLocations({ filters: { cityId: this.selectedCity.id, active: 1 }, offset: 0, limit: 100 }).pipe(take(1)).subscribe(
      res => {
        this.locations = res['data'];
        this.selectedLocation = {};
        this.selectedLocation = res['data'][0];
        this.loadBuildings();
        this.loadExpenses();
        this.loadBills();
      });
  }

  loading: any = false;
  selectedBuilding: any;
  selectedBuildings: any = [];
  loadBuildings() {
    this.service.listBuildings({
      filters: {
        locationId: this.selectedLocation ? this.selectedLocation.id : null,
        statuses: ['Live']
      }
    }).subscribe(res => {
      this.buildings = res['data'];
      this.selectedBuildings = [];
      this.expensesData = null;
      this.loadExpenses();
      this.billsData = null;
      this.loadBills();
    })
  }


  expensesData: any;
  loadExpenses() {
    this.buildingsFilters.locationId = this.selectedLocation ? this.selectedLocation.id : null;
    this.buildingsFilters.isOpex = 1;
    this.buildingsFilters.isHq = this.isHq;
    if (!this.expensesData) {
      this.loading = true;
      this.reportsService.getExpenses({ filters: this.buildingsFilters }).pipe(take(1)).subscribe(
        res => {
          this.expensesData = res['data'];
          this.generateReport();
        }, error => {

        });
    } else {
      this.generateReport();
    }
  }

  billsData: any;
  loadBills() {
    this.buildingsFilters.locationId = this.selectedLocation ? this.selectedLocation.id : null;
    this.buildingsFilters.isHq = this.isHq;
    if (!this.billsData) {
      this.loading = true;
      this.reportsService.getBills({ filters: this.buildingsFilters }).pipe(take(1)).subscribe(
        res => {
          this.billsData = res['data'];
          this.generateReport();
        }, error => {

        });
    } else {
      this.generateReport();
    }
  }

  generateReport() {
    if (this.billsData && this.expensesData) {
      this.monthlyReport = { months: [], rows: [] };
      this.colWidth = 10;
      this.selectedRow = null;
      this.categories = [];
      this.selectedBuilding = null;

      if (this.buildingsFilters.type == '') {
        this.generateMonthlyReport();
      } else if (this.buildingsFilters.type == 'POs') {
        this.generateMonthlyPosReport(false);
      } else if (this.buildingsFilters.type == 'Bills') {
        this.generateMonthlyBillsReport(false);
      }
      this.loading = false;
    }
  }

  generateMonthlyReport() {
    var report = { months: [], rows: [] };
    var billsData = _.clone(this.billsData);
    var expensesData = _.clone(this.expensesData);
    var self = this;
    if (this.selectedBuildings.length) {
      billsData = _.filter(billsData, function(d) {
        return self.selectedBuildings.indexOf(d.buildingId) > -1
      })
      expensesData = _.filter(expensesData, function(d) {
        return self.selectedBuildings.indexOf(d.buildingId) > -1
      })
    }

    var months = _.uniq(billsData, function(d) { return d.mon });
    months = months.concat(_.uniq(expensesData, function(d) { return d.mon }));

    months = _.orderBy(months, "mon");
    months = _.uniq(_.map(months, 'month'));
    months.unshift("");
    console.log("months :: ", months);
    report.months = _.clone(months);

    var totals = [];
    var rows = [];

    var row = { value: "POs" };
    var cols = [row];
    var total = 0;
    months.shift();
    _.each(months, function(m) {
      var sum = _.sumBy(_.filter(expensesData, { month: m }), 'amount');
      cols.push({ value: sum });
      totals.push({ month: m, sum: sum });
    })
    rows.push({ cols: cols, types: [] });

    row = { value: "Bills" };
    cols = [row];
    total = 0;
    _.each(months, function(m) {
      var sum = _.sumBy(_.filter(billsData, { month: m }), 'amount');
      cols.push({ value: sum });
      totals.push({ month: m, sum: sum });
    })
    rows.push({ cols: cols, types: [] });
    report.rows = rows;

    var cols = [{ value: 'Total' }];
    _.each(months, function(m) {
      var sum = _.sumBy(_.filter(totals, { month: m }), 'sum');
      cols.push({ value: sum });
    })
    report.rows.push({ cols: cols, types: null })

    this.monthlyReport = report;
    console.log("RevenueReport :: generateMonthlyReport : report: ", report);
  }

  reportType: any = "overall";

  monthlyReport: any = { months: [], rows: [] };
  colWidth: any = 10;
  selectedRow: any;

  generateMonthlyBillsReport(all) {
    var report = { months: [], rows: [] };
    var data = _.clone(this.billsData);
    var self = this;
    if (this.selectedBuildings.length) {
      data = _.filter(data, function(d) {
        return self.selectedBuildings.indexOf(d.buildingId) > -1
      })
    }

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

    var months = [];
    if (this.monthlyReport.months.length == 0 || !all) {
      months = _.uniq(_.map(data, 'month'));
      report.months = _.clone(months);
      report.months.unshift("Expense Type");
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
      rows.push({ cols: cols, types: [] });
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
        report.rows.push({ cols: cols, types: [] });
      }
    })

    var cols = [{ value: 'Total' }];
    _.each(months, function(m) {
      var sum = _.sumBy(_.filter(totals, { month: m }), 'sum');
      cols.push({ value: sum });
    })
    report.rows.push({ cols: cols, types: null })

    this.monthlyReport = report;
    console.log("RevenueReport :: generateMonthlyBillsReport : report: ", report);
  }

  generateMonthlyPosReport(all) {
    var report = { months: [], rows: [] };
    var data = _.clone(this.expensesData);
    if (this.selectedBuildings.length) {
      var self = this;
      data = _.filter(data, function(d) {
        return self.selectedBuildings.indexOf(d.buildingId) > -1
      })
    }

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

    var months = [];
    if (this.monthlyReport.months.length == 0 || !all) {
      // months = _.uniq(_.map(data, 'month'));
      var startMonth = moment().subtract(10, 'months');
      months = [];
      while (startMonth.isBefore(moment())) {
        months.push(startMonth.format("MMM YY"));
        startMonth = startMonth.add(1, 'month');
      }
      report.months = _.clone(months);
      report.months.unshift("SKU Type");
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
      rows.push({ cols: cols, types: [] });
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
        report.rows.push({ cols: cols, types: [] });
      }
    })

    var cols = [{ value: 'Total' }];
    _.each(months, function(m) {
      var sum = _.sumBy(_.filter(totals, { month: m }), 'sum');
      cols.push({ value: sum });
    })
    report.rows.push({ cols: cols, types: null });

    this.monthlyReport = report;
    console.log("RevenueReport :: generateMonthlyPosReport : report: ", report);
  }

  getTypes(row) {
    var data = _.clone(this.billsData)
    if (this.buildingsFilters.type == 'POs') {
      data = _.clone(this.expensesData);
    }
    if (this.selectedBuildings.length) {
      var self = this;
      data = _.filter(data, function(d) {
        return self.selectedBuildings.indexOf(d.buildingId) > -1
      })
    }
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
      data = _.filter(data, { category: row.cols[0].value });
      if (!data.length) {
        row.selected = false;
        this.selectedRow = null;
        return;
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
      console.log("RevenueReport :: generateMonthlyBillsReport : row.types: ", row.types);
      this.selectedRow = row;
    }
  }

}
