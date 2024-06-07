import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { ProductService } from 'src/app/shared/services/product.service';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { debounceTime, take } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HttpClient } from "@angular/common/http";

import { environment } from 'src/environments/environment';
import { CommonService } from 'src/app/shared/services/common.service';
import { DialogsService } from 'src/app/shared/services/dialogs.services';
import { AdminService } from 'src/app/shared/services/admin.service';
import { ReportsService } from 'src/app/shared/services/reports.service';
import * as _ from 'lodash';

declare let $: any;
declare let SVG: any;

@Component({
  selector: 'purchases-reports-building-skus',
  templateUrl: './view.component.html'
})
export class PurchasesBuildingWiseSkusComponent implements OnInit, AfterViewInit {

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


  buildingsFilters: any = { type: 'expenses', expensesBy: 'buildings', billsBy: 'overall' };
  categoriesFilters: any = {};
  typesFilters: any = {};
  skusFilters: any = {};
  servicesFilters: any = {};

  constructor(private dialogs: DialogsService, private service: AdminService, public reportsService: ReportsService) {
  }

  ngAfterViewInit() { }

  ngOnInit() {
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
        this.loadExpenses();
      });
  }

  expensesData: any;
  loadExpenses() {
    if (this.selectedLocation && this.selectedLocation.id) {
      this.buildingsFilters.locationId = this.selectedLocation.id;
      if (!this.expensesData) {
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
  }

  billsData: any;
  loadBills() {
    if (this.selectedLocation && this.selectedLocation.id) {
      this.buildingsFilters.locationId = this.selectedLocation.id;
      if (!this.billsData) {
        this.reportsService.getBills({ filters: this.buildingsFilters }).pipe(take(1)).subscribe(
          res => {
            this.billsData = res['data'];
            this.generateMonthlyBillsReport(false);
          }, error => {

          });
      } else {
        this.generateMonthlyBillsReport(false);
      }
    }
  }

  generateReport() {
    if (this.buildingsFilters.type == 'expenses') {
      if (this.buildingsFilters.expensesBy == 'buildings') {
        this.listOfficeExpenses();
      } else if (this.buildingsFilters.expensesBy == 'vendors') {
        this.listVendorExpenses();
      }
    } else if (this.buildingsFilters.type == 'bills') {
      if (this.buildingsFilters.billsBy == 'buildings') {
        this.generateMonthlyBillsReport(true);
      } else if (this.buildingsFilters.billsBy == 'overall') {
        this.generateMonthlyBillsReport(false);
      } 
    }
  }

  listOfficeExpenses() {
    this.buildingsFilters.buildingId = null;
    this.buildingsFilters.catId = null;
    this.buildingsFilters.typeId = null;
    this.buildingsFilters.skuId = null;
    // console.log("ExpensesReport :: expensesData : ", this.expensesData);
    this.buildings = _(this.expensesData)
      .groupBy('buildingId')
      .map((building, id) => ({
        buildingId: id,
        building: building[0].building,
        vendors: _.uniqBy(building, 'vendorId').length,
        categories: _.uniqBy(building, 'catId').length,
        types: _.uniqBy(building, 'typeId').length,
        skus: _.uniqBy(building, 'skuId').length,
        items: building.length,
        expense: _.sumBy(building, 'expense'),
      }))
      .value();
    console.log("ExpensesReport :: buildings list : ", this.buildings);
  }

  listOfficeCategories(building) {
    if (this.selectedOffice) {
      this.selectedOffice.selected = false;
    }
    building.selected = true;
    this.selectedOffice = building;
    this.buildingsFilters.buildingId = building.buildingId || building.vendorId;
    this.buildingsFilters.catId = null;
    this.buildingsFilters.typeId = null;
    this.buildingsFilters.skuId = null;
    // console.log("ExpensesReport :: expensesData : ", this.expensesData);
    var buildingExpenses;
    if (this.buildingsFilters.expensesBy == 'buildings') {
      buildingExpenses = _.filter(this.expensesData, { buildingId: parseInt(building.buildingId) });
    } else if (this.buildingsFilters.expensesBy == 'vendors') {
      buildingExpenses = _.filter(this.expensesData, { vendorId: parseInt(building.vendorId) });
    }
    var categories = _(buildingExpenses)
      .groupBy('catId')
      .map((cat, id) => ({
        buildingId: cat[0].buildingId,
        vendorId: cat[0].vendorId,
        catId: id,
        name: cat[0].category,
        types: _.uniqBy(cat, 'typeId').length,
        skus: _.uniqBy(cat, 'skuId').length,
        items: cat.length,
        expense: Math.round(_.sumBy(cat, 'expense')),
      }))
      .value();
    this.categories = _.sortBy(categories, ['expense']).reverse();
    console.log("ExpensesReport :: categories list : ", this.categories);
  }

  listOfficeTypes(cat) {
    if (this.selectedCategory) {
      this.selectedCategory.selected = false;
    }
    cat.selected = true;
    this.selectedCategory = cat;
    this.buildingsFilters.catId = cat.catId;
    this.buildingsFilters.typeId = null;
    this.buildingsFilters.skuId = null;
    // console.log("ExpensesReport :: expensesData : ", this.expensesData);
    var catExpenses;
    if (this.buildingsFilters.expensesBy == 'buildings') {
      catExpenses = _.filter(this.expensesData, { buildingId: parseInt(cat.buildingId), catId: parseInt(cat.catId) });
    } else if (this.buildingsFilters.expensesBy == 'vendors') {
      catExpenses = _.filter(this.expensesData, { vendorId: parseInt(cat.vendorId), catId: parseInt(cat.catId) });
    }
    this.types = _(catExpenses)
      .groupBy('typeId')
      .map((type, id) => ({
        typeId: id,
        buildingId: type[0].buildingId,
        vendorId: type[0].vendorId,
        catId: type[0].catId,
        name: type[0].type,
        skus: _.uniqBy(type, 'skuId').length,
        items: type.length,
        expense: Math.round(_.sumBy(type, 'expense')),
      }))
      .value();
    this.types = _.sortBy(this.types, ['expense']).reverse();
    console.log("ExpensesReport :: types list : ", this.types);
  }

  listOfficeSkus(type) {
    if (this.selectedType) {
      this.selectedType.selected = false;
    }
    type.selected = true;
    this.selectedType = type;
    this.buildingsFilters.typeId = type.typeId;
    this.buildingsFilters.skuId = null;
    // console.log("ExpensesReport :: expensesData : ", this.expensesData);
    var catExpenses;
    if (this.buildingsFilters.expensesBy == 'buildings') {
      catExpenses = _.filter(this.expensesData, { buildingId: parseInt(type.buildingId), catId: parseInt(type.catId), typeId: parseInt(type.typeId) });
    } else if (this.buildingsFilters.expensesBy == 'vendors') {
      catExpenses = _.filter(this.expensesData, { vendorId: parseInt(type.vendorId), catId: parseInt(type.catId), typeId: parseInt(type.typeId) });
    }
    this.skus = _(catExpenses)
      .groupBy('skuId')
      .map((sku, id) => ({
        skuId: id,
        buildingId: sku[0].buildingId,
        vendorId: sku[0].vendorId,
        catId: sku[0].catId,
        typeId: sku[0].typeId,
        name: sku[0].sku,
        skus: _.uniqBy(sku, 'skuId').length,
        items: sku.length,
        expense: Math.round(_.sumBy(sku, 'expense')),
      }))
      .value();
    this.skus = _.sortBy(this.skus, ['expense']).reverse();
    console.log("ExpensesReport :: skus list : ", this.skus);
  }

  listVendorExpenses() {
    var buildings = _(this.expensesData)
      .groupBy('vendorId')
      .map((vendor, id) => ({
        vendorId: id,
        vendor: vendor[0].vendor,
        buildings: _.uniqBy(vendor, 'buildingId').length,
        categories: _.uniqBy(vendor, 'catId').length,
        types: _.uniqBy(vendor, 'typeId').length,
        skus: _.uniqBy(vendor, 'skuId').length,
        items: vendor.length,
        expense: Math.round(_.sumBy(vendor, 'expense'))
      }))
      .value()
    this.buildings = _.sortBy(buildings, ['expense']).reverse();
  }

  // -------------- Bills Reports ----------------
  
  selectedBuilding: any;
  reportType: any = "overall";

  monthlyReport: any = { months: [], rows: [] };
  colWidth: any = 10;

  generateMonthlyBillsReport(buildingWise) {
    var report = { months: [], rows: [] };
    var data = this.billsData;

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
      report.months.unshift("Opex Type");
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
    console.log("RevenueReport :: generateMonthlyBillsReport : report: ", report);
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
        data = _.filter(this.billsData, { building: this.selectedBuilding, category: row.cols[0].value });
      } else {
        data = _.filter(this.billsData, { category: row.cols[0].value });
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
