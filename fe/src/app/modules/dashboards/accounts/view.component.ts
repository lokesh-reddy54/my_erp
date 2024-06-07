import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { ProductService } from 'src/app/shared/services/product.service';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from "@angular/common/http";
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, take } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import { CommonService } from 'src/app/shared/services/common.service';
import { DialogsService } from 'src/app/shared/services/dialogs.services';
import { ReportsService } from 'src/app/shared/services/reports.service';
import { DashboardsService } from 'src/app/shared/services/dashboards.services';
import * as _ from 'lodash';
import * as moment from 'moment';

import * as shape from 'd3-shape';
import * as d3Array from 'd3-array';

import { colorSets } from '@swimlane/ngx-charts';
import { formatLabel, escapeLabel } from '@swimlane/ngx-charts';

const monthName = new Intl.DateTimeFormat('en-us', { month: 'short' });
const weekdayName = new Intl.DateTimeFormat('en-us', { weekday: 'short' });

function multiFormat(value) {
  if (value < 1000) return `${value.toFixed(2)}ms`;
  value /= 1000;
  if (value < 60) return `${value.toFixed(2)}s`;
  value /= 60;
  if (value < 60) return `${value.toFixed(2)}mins`;
  value /= 60;
  return `${value.toFixed(2)}hrs`;
}

import {
  SingleSeries,
  MultiSeries,
  BubbleChartMultiSeries,
  Series,
  TreeMapData
} from '@swimlane/ngx-charts';

declare let $: any;

@Component({
  selector: 'accounts-dashboards',
  templateUrl: './view.component.html'
})
export class AccountsDashboardComponent implements OnInit, AfterViewInit {
  searchControl: FormControl = new FormControl();
  loading: any = false;

  constructor(private dialogs: DialogsService, public reportsService: ReportsService, private service: DashboardsService) {
  }

  colorSets: any;
  colorScheme: any;
  schemeType: string = 'ordinal';
  selectedColorScheme: string;
  setColorScheme(name) {
    this.selectedColorScheme = name;
    this.colorScheme = this.colorSets.find(s => s.name === name);
  }

  theme = 'dark';
  chartType: string;
  chartGroups: any[];
  chart: any;
  realTimeData: boolean = false;
  countries: any[];
  single: any[];
  multi: any[];
  fiscalYearReport: any[];
  dateData: any[];
  dateDataWithRange: any[];
  calendarData: any[];
  statusData: any[];
  sparklineData: any[];
  timelineFilterBarData: any[];
  graph: { links: any[]; nodes: any[] };
  bubble: any;
  linearScale: boolean = false;
  range: boolean = false;

  view: any[];
  width: number = 700;
  height: number = 300;
  fitContainer: boolean = false;

  // options
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  legendTitle = 'Legend';
  legendPosition = 'right';
  showXAxisLabel = true;
  tooltipDisabled = false;
  showText = true;
  xAxisLabel = 'Project';
  showYAxisLabel = true;
  yAxisLabel = 'Expenses by Category';
  showGridLines = true;
  innerPadding = '10%';
  barPadding = 50;
  groupPadding = 16;
  roundDomains = false;
  maxRadius = 10;
  minRadius = 3;
  showSeriesOnHover = true;
  roundEdges: boolean = true;
  animations: boolean = true;
  xScaleMin: any;
  xScaleMax: any;
  yScaleMin: number;
  yScaleMax: number;
  showDataLabel = true;
  noBarWhenZero = true;
  trimXAxisTicks = true;
  trimYAxisTicks = true;
  rotateXAxisTicks = true;
  maxXAxisTickLength = 16;
  maxYAxisTickLength = 16;
  autoScale = true;
  timeline = false;
  curve: any = shape.curveLinear;
  rangeFillOpacity: number = 0.15;

  ngOnInit() {
    this.colorSets = colorSets;
    this.setColorScheme('cool');
  }

  col4Width: any = 300;
  col4Height: any;
  ngAfterViewInit() {
    var width = document.getElementById("col-4").clientWidth;
    var height = document.getElementById("col-4").clientHeight;
    // this.view = [width, this.height];
    this.col4Width = width - 50;

    var finYearStart = moment("2020-04-01");
    var finYearEnd = moment("2021-03-31");
    var currentMonEnd = moment().endOf('month');
    var self = this;

    var epicker: any = $('#edaterangepicker');
    epicker.val(finYearStart.format('MM/DD/YYYY') + ' - ' + finYearEnd.format('MM/DD/YYYY'));
    epicker.daterangepicker({
      opens: 'left',
      autoUpdateInput: false,
      ranges: {
        'This Financial Year': [finYearStart, finYearEnd],
        'Last Financial Year': [finYearStart.clone().subtract(1, 'year'), finYearEnd.clone().subtract(1, 'year')],
        'This Month': [moment().startOf('month'), moment().endOf('month')],
        'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
        'Last 2 Months': [moment().subtract(2, 'month').startOf('month'), moment().endOf('month')],
        'Last 3 Months': [moment().subtract(3, 'month').startOf('month'), moment().endOf('month')],
        'Last 6 Months': [moment().subtract(6, 'month').startOf('month'), moment().endOf('month')],
        'Last 9 Months': [moment().subtract(9, 'month').startOf('month'), moment().endOf('month')],
        'Last 12 Months': [moment().subtract(12, 'month').startOf('month'), moment().endOf('month')]
      }
    }, function(start, end, label) {
      console.log("A new date selection was made: " + label);
      epicker.val(start.format('MM/DD/YYYY') + ' - ' + end.format('MM/DD/YYYY'));
      self.expensesFilters.startDate = start.format('YYYY-MM-DD');
      self.expensesFilters.endDate = end.format('YYYY-MM-DD');
      self.loadData();
    });
    epicker.on('apply.edaterangepicker', function(ev, picker) {
      $(this).val(picker.startDate.format('MM/DD/YYYY') + ' - ' + picker.endDate.format('MM/DD/YYYY'));
    });
    epicker.on('cancel.edaterangepicker', function(ev, picker) {
      epicker.val(finYearStart.format('MM/DD/YYYY') + ' - ' + finYearEnd.format('MM/DD/YYYY'));
      self.expensesFilters.startDate = finYearStart.format('YYYY-MM-DD');
      self.expensesFilters.endDate = finYearEnd.format('YYYY-MM-DD');
      self.loadData();
    });
    self.expensesFilters.startDate = finYearStart.format('YYYY-MM-DD');
    self.expensesFilters.endDate = finYearEnd.format('YYYY-MM-DD');


    var rpicker: any = $('#rdaterangepicker');
    rpicker.val(finYearStart.format('MM/DD/YYYY') + ' - ' + finYearEnd.format('MM/DD/YYYY'));
    rpicker.daterangepicker({
      opens: 'left',
      autoUpdateInput: false,
      ranges: {
        'This Financial Year': [finYearStart, finYearEnd],
        'Last Financial Year': [finYearStart.clone().subtract(1, 'year'), finYearEnd.clone().subtract(1, 'year')],
        'This Month': [moment().startOf('month'), moment().endOf('month')],
        'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
        'Last 2 Months': [moment().subtract(2, 'month').startOf('month'), moment().endOf('month')],
        'Last 3 Months': [moment().subtract(3, 'month').startOf('month'), moment().endOf('month')],
        'Last 6 Months': [moment().subtract(6, 'month').startOf('month'), moment().endOf('month')],
        'Last 9 Months': [moment().subtract(9, 'month').startOf('month'), moment().endOf('month')],
        'Last 12 Months': [moment().subtract(12, 'month').startOf('month'), moment().endOf('month')]
      }
    }, function(start, end, label) {
      console.log("A new date selection was made: " + label);
      rpicker.val(start.format('MM/DD/YYYY') + ' - ' + end.format('MM/DD/YYYY'));
      self.revenueFilters.startDate = start.format('YYYY-MM-DD');
      self.revenueFilters.endDate = end.format('YYYY-MM-DD');
      self.loadData();
    });
    rpicker.on('apply.rdaterangepicker', function(ev, picker) {
      $(this).val(picker.startDate.format('MM/DD/YYYY') + ' - ' + picker.endDate.format('MM/DD/YYYY'));
      //  self.revenueFilters.startDate = finYearStart.format('YYYY-MM-DD');
      // self.revenueFilters.endDate = currentMonEnd.format('YYYY-MM-DD');
      // self.loadData();
    });
    rpicker.on('cancel.rdaterangepicker', function(ev, picker) {
      rpicker.val(finYearStart.format('MM/DD/YYYY') + ' - ' + finYearEnd.format('MM/DD/YYYY'));
      self.revenueFilters.startDate = finYearStart.format('YYYY-MM-DD');
      self.revenueFilters.endDate = finYearEnd.format('YYYY-MM-DD');
      self.loadData();
    });
    self.revenueFilters.startDate = finYearStart.format('YYYY-MM-DD');
    self.revenueFilters.endDate = finYearEnd.format('YYYY-MM-DD');



    var plpicker: any = $('#pldaterangepicker');
    plpicker.val(finYearStart.format('MM/DD/YYYY') + ' - ' + finYearEnd.format('MM/DD/YYYY'));
    plpicker.daterangepicker({
      opens: 'left',
      autoUpdateInput: false,
      ranges: {
        'This Financial Year': [finYearStart, finYearEnd],
        'Last Financial Year': [finYearStart.clone().subtract(1, 'year'), finYearEnd.clone().subtract(1, 'year')],
        'This Month': [moment().startOf('month'), moment().endOf('month')],
        'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
        'Last 2 Months': [moment().subtract(2, 'month').startOf('month'), moment().endOf('month')],
        'Last 3 Months': [moment().subtract(3, 'month').startOf('month'), moment().endOf('month')],
        'Last 6 Months': [moment().subtract(6, 'month').startOf('month'), moment().endOf('month')],
        'Last 9 Months': [moment().subtract(9, 'month').startOf('month'), moment().endOf('month')],
        'Last 12 Months': [moment().subtract(12, 'month').startOf('month'), moment().endOf('month')]
      }
    }, function(start, end, label) {
      console.log("A new date selection was made: " + label);
      plpicker.val(start.format('MM/DD/YYYY') + ' - ' + end.format('MM/DD/YYYY'));
      self.plFilters.startDate = start.format('YYYY-MM-DD');
      self.plFilters.endDate = end.format('YYYY-MM-DD');
      self.loadData();
    });
    plpicker.on('apply.pldaterangepicker', function(ev, picker) {
      $(this).val(picker.startDate.format('MM/DD/YYYY') + ' - ' + picker.endDate.format('MM/DD/YYYY'));
      //  self.plFilters.startDate = finYearStart.format('YYYY-MM-DD');
      // self.plFilters.endDate = currentMonEnd.format('YYYY-MM-DD');
      // self.loadData();
    });
    plpicker.on('cancel.pldaterangepicker', function(ev, picker) {
      plpicker.val(finYearStart.format('MM/DD/YYYY') + ' - ' + finYearEnd.format('MM/DD/YYYY'));
      self.plFilters.startDate = finYearStart.format('YYYY-MM-DD');
      self.plFilters.endDate = finYearEnd.format('YYYY-MM-DD');
      self.loadData();
    });
    self.plFilters.startDate = finYearStart.format('YYYY-MM-DD');
    self.plFilters.endDate = finYearEnd.format('YYYY-MM-DD');


    var cpicker: any = $('#cdaterangepicker');
    // cpicker.val(finYearStart.format('MM/DD/YYYY') + ' - ' + currentMonEnd.format('MM/DD/YYYY'));
    cpicker.daterangepicker({
      opens: 'left',
      autoUpdateInput: false,
      ranges: {
        'This Financial Year': [finYearStart, finYearEnd],
        'Last Financial Year': [finYearStart.clone().subtract(1, 'year'), finYearEnd.clone().subtract(1, 'year')],
        'This Month': [moment().startOf('month'), moment().endOf('month')],
        'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
        'Last 2 Months': [moment().subtract(2, 'month').startOf('month'), moment().endOf('month')],
        'Last 3 Months': [moment().subtract(3, 'month').startOf('month'), moment().endOf('month')],
        'Last 6 Months': [moment().subtract(6, 'month').startOf('month'), moment().endOf('month')],
        'Last 9 Months': [moment().subtract(9, 'month').startOf('month'), moment().endOf('month')],
        'Last 12 Months': [moment().subtract(12, 'month').startOf('month'), moment().endOf('month')]
      }
    }, function(start, end, label) {
      console.log("A new date selection was made: " + label);
      cpicker.val(start.format('MM/DD/YYYY') + ' - ' + end.format('MM/DD/YYYY'));
      self.capexFilters.startDate = start.format('YYYY-MM-DD');
      self.capexFilters.endDate = end.format('YYYY-MM-DD');
      self.loadData();
    });
    cpicker.on('apply.cdaterangepicker', function(ev, picker) {
      $(this).val(picker.startDate.format('MM/DD/YYYY') + ' - ' + picker.endDate.format('MM/DD/YYYY'));
      //  self.expensesFilters.startDate = finYearStart.format('YYYY-MM-DD');
      // self.expensesFilters.endDate = currentMonEnd.format('YYYY-MM-DD');
      // self.loadData();
    });
    cpicker.on('cancel.cdaterangepicker', function(ev, picker) {
      cpicker.val(null);
      self.capexFilters.startDate = null;
      self.capexFilters.endDate = null;
      self.loadData();
    });
    self.capexFilters.startDate = null;
    self.capexFilters.endDate = null;
    this.loadData();
  }

  clearExpenseDates() {
    var finYearStart = moment("2020-04-01");
    var currentMonEnd = moment("2021-03-31");
    var self = this;
    var epicker: any = $('#edaterangepicker');
    epicker.val(finYearStart.format('MM/DD/YYYY') + ' - ' + currentMonEnd.format('MM/DD/YYYY'));
    self.expensesFilters.startDate = finYearStart.format('YYYY-MM-DD');
    self.expensesFilters.endDate = currentMonEnd.format('YYYY-MM-DD');
    self.loadData();
  }

  clearRevenueDates() {
    var finYearStart = moment("2020-04-01");
    var currentMonEnd = moment("2021-03-31");
    var self = this;
    var epicker: any = $('#rdaterangepicker');
    epicker.val(finYearStart.format('MM/DD/YYYY') + ' - ' + currentMonEnd.format('MM/DD/YYYY'));
    self.revenueFilters.startDate = finYearStart.format('YYYY-MM-DD');
    self.revenueFilters.endDate = currentMonEnd.format('YYYY-MM-DD');
    self.loadData();
  }

  clearCapexDates() {
    var self = this;
    var epicker: any = $('#cdaterangepicker');
    epicker.val(null);
    self.capexFilters.startDate = null;
    self.capexFilters.endDate = null;
    self.loadData();
  }

  capexData: any;
  capexFilters: any = {};
  projects: any = [];
  sprojects: any = [];
  cats: any = [];
  scats: any = [];
  types: any = [];
  stypes: any = [];
  capexGraphData: any = [];
  cshowLegend: any = true;

  expensesFilters: any = { isHq: '0' };
  expensesData: any;
  buildings: any = [];
  sbuildings: any = [];
  ecats: any = [];
  escats: any = [];
  etypes: any = [];
  estypes: any = [];
  expensesGraphData: any = [];
  eshowLegend: any = true;

  revenueData: any;
  revenueFilters: any = {};
  rbuildings: any = [];
  rsbuildings: any = [];
  rcats: any = [];
  rscats: any = [];
  rtypes: any = [];
  rstypes: any = [];
  revenueGraphData: any = [];
  buildingMetrics: any = [];
  rshowLegend: any = true;

  plData: any;
  plFilters: any = {};
  plbuildings: any = [];
  plsbuildings: any = [];
  plshowLegend: any = true;

  loadData() {
    this.loading = true;
    this.service.getBuildingMetrics({}).pipe(take(1)).subscribe(
      res => {
        this.buildingMetrics = res['data'];
      }, error => {

      });

    this.service.getCapexDashboard({ filters: this.capexFilters }).pipe(take(1)).subscribe(
      res => {
        var data = res['data'];
        this.capexData = data;
        this.buildCapexReport();
        this.loading = false;
      }, error => {

      });

    var expensesFilters = _.clone(this.expensesFilters);
    expensesFilters.isHq = parseInt(this.expensesFilters.isHq);
    this.service.getExpensesDashboard({ filters: expensesFilters }).pipe(take(1)).subscribe(
      res => {
        var data = res['data'];
        this.expensesData = data;
        this.buildExpensesReport();
        this.loading = false;
      }, error => {

      });

    this.service.getRevenueDashboard({ filters: this.revenueFilters }).pipe(take(1)).subscribe(
      res => {
        var data = res['data'];
        this.revenueData = data;
        this.buildRevenueReport();
        this.loading = false;
      }, error => {

      });

    this.service.getProfitandLossDashboard({ filters: this.plFilters }).pipe(take(1)).subscribe(
      res => {
        var data = res['data'];
        this.plData = data;
        this.buildProfitLossReport();
        this.loading = false;
      }, error => {

      });
  }

  hoFilterUpdated() {
    this.loading = true;
    var expensesFilters = _.clone(this.expensesFilters);
    expensesFilters.isHq = parseInt(this.expensesFilters.isHq);
    this.service.getExpensesDashboard({ filters: expensesFilters }).pipe(take(1)).subscribe(
      res => {
        var data = res['data'];
        this.expensesData = data;
        this.ecats = [];
        this.escats = [];
        this.etypes = [];
        this.estypes = [];
        this.sbuildings = [];
        this.buildExpensesReport();
        this.loading = false;
      }, error => {

      });
  }

  sqftRevenue: any = [];
  rcarpetArea: any = 0;
  rsba: any = 0;
  rbarPadding: any = 40;
  rshowStack: any = false;
  buildRevenueReport() {
    var self = this;
    var data = _.clone(this.revenueData);
    // console.log("RevenueDashboard ::: buildRevenueReport :: data : ", data);
    var buildingMetrics = this.buildingMetrics;
    if (this.rsbuildings.length) {
      data = _.filter(data, function(p) {
        return self.rsbuildings.indexOf(p.building) > -1
      })
      buildingMetrics = _.filter(this.buildingMetrics, function(b) {
        return self.rsbuildings.indexOf(b.name) > -1
      })
    }
    if (!this.rbuildings.length) {
      this.rbuildings = _.uniq(_.map(data, 'building'));
    }

    var carpetArea = this.rcarpetArea = _.sumBy(buildingMetrics, 'carpetArea');
    var sba = this.rsba = _.sumBy(buildingMetrics, 'sba');

    var carpetSeries = [];
    var sbaSeries = [];

    var months = _(data)
      .groupBy(x => x.month)
      .map((value, key) => ({ name: key, revenue: value }))
      .value();

    var cats = [];
    self.rtypes = [];
    // self.rstypes = [];
    _.each(months, function(month) {
      var monthlyRevenue = _.sumBy(month.revenue, "amount");
      var liveBuildings = _.filter(buildingMetrics, function(b) {
        var monthLastDate = moment(month.name, "MMM YYYY").endOf('month');
        var flag = false;
        if (b.expectedLive && b.lastDate) {
          flag = moment(b.expectedLive).isBefore(monthLastDate) && moment(b.lastDate).isAfter(monthLastDate)
        } else if (b.expectedLive) {
          flag = moment(b.expectedLive).isBefore(monthLastDate);
        }
        return flag;
      })
      carpetArea = _.sumBy(liveBuildings, 'carpetArea');
      sba = _.sumBy(liveBuildings, 'sba');


      var series = [];
      if (self.rscats.length == 1) {
        var cat = self.rscats[0];
        var types: any = _.uniq(_.map(_.filter(month.revenue, { category: cat.name }), 'type'));
        types = self.etypes.concat(types);
        types = _.uniq(types).sort();
        self.rtypes = types;
        if (self.rstypes.length) {
          types = self.rstypes;
        }

        _.each(types, function(type) {
          var value = _.sumBy(_.filter(month.revenue, { category: cat.name, type: type }), 'amount');
          series.push({ name: type, value: Math.round(value) });
        })
        month.series = series;
        self.rshowLegend = true;
      } else {
        self.rstypes = [];
        var categories = _(month.revenue)
          .groupBy(x => x.category)
          .map((value, key) => ({ name: key, revenue: value }))
          .value();

        if (self.rscats.length) {
          categories = _.filter(categories, function(p) {
            var scat = _.find(self.rscats, { name: p.name });
            return scat != null;
          })
        }

        categories = _.orderBy(categories, ['name']);
        _.each(categories, function(cat) {
          var value = _.sumBy(cat.revenue, 'amount');
          series.push({ name: cat.name, value: Math.round(value) });

          var types = _.map(cat.revenue, 'type');
          var _cat = { name: cat.name, types: _.uniq(types) }

          delete cat.revenue;
          cats.push(_cat);
        })
        if (!self.rscats.length && !self.rshowStack) {
          series = [{ name: "Total", value: Math.round(monthlyRevenue) }];
          self.rshowLegend = false;
        } else {
          self.rshowLegend = true;
        }
        series = _.orderBy(series, 'name');
        month.series = series;
      }
      delete month.revenue;
      monthlyRevenue = _.sumBy(series, "value");
      carpetSeries.push({ name: month.name, value: Math.round((monthlyRevenue / carpetArea) * 100) / 100 });
      sbaSeries.push({ name: month.name, value: Math.round((monthlyRevenue / sba) * 100) / 100 });
    });

    if (!this.rcats.length) {
      self.rcats = _.uniqBy(cats, 'name');
    }
    console.log("RevenueDashboard ::: buildRevenueReport :: series : ", months);
    this.multi = months;
    var width = document.getElementById("col-8").clientWidth;
    var bars = months.length
    this.rbarPadding = ((width - (50 * bars)) / bars) / 1.1;

    this.sqftRevenue = [{
      "name": "Carpet Area",
      "series": carpetSeries
    }, {
      "name": "Super Buildup Area",
      "series": sbaSeries
    }]
  }

  sqftExpenses: any = [];
  ecarpetArea: any = 0;
  esba: any = 0;
  ebarPadding: any = 40;
  eshowStack: any = false;
  buildExpensesReport() {
    var self = this;

    var data = _.clone(this.expensesData);
    // console.log("CapexDashboard ::: buildReport :: data : ", data);
    var buildingMetrics = this.buildingMetrics;
    if (this.sbuildings.length) {
      data = _.filter(data, function(p) {
        return self.sbuildings.indexOf(p.building) > -1
      })
      buildingMetrics = _.filter(this.buildingMetrics, function(b) {
        return self.sbuildings.indexOf(b.name) > -1
      })
    }
    if (!this.buildings.length) {
      this.buildings = _.uniq(_.map(data, 'building'));
    }

    this.ecarpetArea = _.sumBy(buildingMetrics, 'carpetArea');
    this.esba = _.sumBy(buildingMetrics, 'sba');

    var months = _(data)
      .groupBy(x => x.month)
      .map((value, key) => ({ name: key, expenses: value }))
      .value();

    var cats = [];
    var carpetSeries: any = [];
    var sbaSeries: any = [];
    self.etypes = [];
    // self.estypes = [];
    var carpetArea = 0;
    var sba = 0;
    _.each(months, function(month) {
      var monthlyExpenses = _.sumBy(month.expenses, "amount");
      var liveBuildings = _.filter(buildingMetrics, function(b) {
        var monthLastDate = moment(month.name, "MMM YYYY").endOf('month');
        var flag = false;
        if (b.expectedLive && b.lastDate) {
          flag = moment(b.expectedLive).isBefore(monthLastDate) && moment(b.lastDate).isAfter(monthLastDate)
        } else if (b.expectedLive) {
          flag = moment(b.expectedLive).isBefore(monthLastDate);
        }
        return flag;
      })
      carpetArea = _.sumBy(liveBuildings, 'carpetArea');
      sba = _.sumBy(liveBuildings, 'sba');

      var series = [];
      if (self.escats.length == 1) {
        var cat = self.escats[0];
        var types: any = _.uniq(_.map(_.filter(month.expenses, { category: cat.name }), 'type'));
        types = self.etypes.concat(types);
        types = _.uniq(types).sort();
        self.etypes = types;
        if (self.estypes.length) {
          types = self.estypes;
        }

        _.each(types, function(type) {
          var value = _.sumBy(_.filter(month.expenses, { category: cat.name, type: type }), 'amount');
          series.push({ name: type, value: Math.round(value) });
        })
        month.series = series;
        self.eshowLegend = true;
      } else {
        var categories = _(month.expenses)
          .groupBy(x => x.category)
          .map((value, key) => ({ name: key, expenses: value }))
          .value();

        if (self.escats.length) {
          categories = _.filter(categories, function(p) {
            var scat = _.find(self.escats, { name: p.name });
            return scat != null;
          })
        }
        categories = _.orderBy(categories, ['name']);
        _.each(categories, function(cat) {
          var value = _.sumBy(cat.expenses, 'amount');
          series.push({ name: cat.name, value: Math.round(value) });

          var types = _.map(cat.expenses, 'type');
          var _cat = { name: cat.name, types: _.uniq(types) }

          delete cat.expenses;
          cats.push(_cat);
        })
        if (!self.escats.length && !self.eshowStack) {
          series = [{ name: "Total", value: Math.round(monthlyExpenses) }];
          self.eshowLegend = false;
        } else {
          self.eshowLegend = true;
        }
        series = _.orderBy(series, 'name');
        month.series = series;
      }
      delete month.expenses;
      monthlyExpenses = _.sumBy(series, "value");
      carpetSeries.push({ name: month.name, value: Math.round((monthlyExpenses / carpetArea) * 100) / 100 });
      sbaSeries.push({ name: month.name, value: Math.round((monthlyExpenses / sba) * 100) / 100 });
    });

    if (!this.ecats.length) {
      self.ecats = _.uniqBy(cats, 'name');
    }
    console.log("AccountsDashboard ::: expenses :: series : ", months);
    this.expensesGraphData = months;
    var width = document.getElementById("col-8").clientWidth;
    var bars = months.length
    this.ebarPadding = ((width - (50 * bars)) / bars) / 1.1;

    this.sqftExpenses = [{
      "name": "Carpet Area",
      "series": carpetSeries
    }, {
      "name": "Super Buildup Area",
      "series": sbaSeries
    }]
    console.log("AccountsDashboard ::: expenses :: sqftExpense : ", JSON.stringify(this.sqftExpenses));
    var self = this;
    setTimeout(function() {
      var height = document.getElementById("col-8").clientHeight;
      self.col4Height = height - 60;
    }, 500)
  }

  cshowStack: any = false;
  buildCapexReport() {
    var self = this;

    var data = _.clone(this.capexData);
    // console.log("CapexDashboard ::: buildCapexReport :: data : ", data);
    var projects = _(data)
      .groupBy(x => x.project)
      .map((value, key) => ({ name: key, expenses: value }))
      .value();

    if (this.sprojects.length) {
      projects = _.filter(projects, function(p) {
        return self.sprojects.indexOf(p.name) > -1
      })
    }

    if (!this.projects.length) {
      this.projects = _.map(projects, 'name');
    }

    var cats = [];
    self.types = [];
    // self.stypes = [];
    _.each(projects, function(project) {
      var series = [];
      if (self.scats.length == 1) {
        var cat = self.scats[0];
        var types = _.uniq(_.map(_.filter(project.expenses, { category: cat.name }), 'type'));
        types = self.types.concat(types);
        types = _.uniq(types).sort();
        self.types = types;
        if (self.stypes.length) {
          types = self.stypes;
        }

        _.each(types, function(type) {
          var value = _.sumBy(_.filter(project.expenses, { category: cat.name, type: type }), 'amount');
          series.push({ name: type, value: Math.round(value) });
        })
        project.series = series;
        self.cshowLegend = true;
      } else {
        self.stypes = [];
        var categories = _(project.expenses)
          .groupBy(x => x.category)
          .map((value, key) => ({ name: key, expenses: value }))
          .value();

        if (self.scats.length) {
          categories = _.filter(categories, function(p) {
            var scat = _.find(self.scats, { name: p.name });
            return scat != null;
          })
        }

        categories = _.orderBy(categories, ['name']);
        _.each(categories, function(cat) {
          var value = _.sumBy(cat.expenses, 'amount');
          series.push({ name: cat.name, value: Math.round(value) });

          var types = _.map(cat.expenses, 'type');
          var _cat = { name: cat.name, types: _.uniq(types) }

          delete cat.expenses;
          cats.push(_cat);
        })
        if (!self.scats.length && !self.cshowStack) {
          series = [{ name: "Total", value: Math.round(_.sumBy(project.expenses, 'amount')) }];
          self.cshowLegend = false;
        } else {
          self.cshowLegend = true;
        }
        series = _.orderBy(series, 'name');
        project.series = series;
      }
      delete project.expenses;
    });

    if (!this.cats.length) {
      self.cats = _.uniqBy(cats, 'name');
    }
    console.log("CapexDashboard ::: buildCapexReport :: series : ", projects);
    this.capexGraphData = projects;

    var width = document.getElementById("col-8").clientWidth;
    var bars = projects.length
    this.barPadding = ((width - (50 * bars)) / bars) * 1.5;

    if (this.barPadding < 10) {
      this.barPadding = 10;
    }
  }


  sqftProfitLoss: any = [];
  plGraphData: any = [];
  plcarpetArea: any = 0;
  plsba: any = 0;
  plbarPadding: any = 8;
  buildProfitLossReport() {
    var self = this;

    var data = _.clone(this.plData);
    var revenueData = data.revenues;
    var expenseData = data.expenses;
    // console.log("CapexDashboard ::: buildReport :: data : ", data);
    var buildingMetrics = this.buildingMetrics;
    var totalCarpetArea = _.sumBy(buildingMetrics, 'carpetArea');
    var totalSba = _.sumBy(buildingMetrics, 'sba');
    if (this.plsbuildings.length) {
      revenueData = _.filter(revenueData, function(p) {
        return self.plsbuildings.indexOf(p.building) > -1
      })
      expenseData = _.filter(expenseData, function(p) {
        return self.plsbuildings.indexOf(p.building) > -1 || p.building == "HO"
      })

      buildingMetrics = _.filter(this.buildingMetrics, function(b) {
        return self.plsbuildings.indexOf(b.name) > -1
      })
    }
    if (!this.plbuildings.length) {
      this.plbuildings = _.uniq(_.map(data.revenues, 'building'));
    }

    this.plcarpetArea = _.sumBy(buildingMetrics, 'carpetArea');
    this.plsba = _.sumBy(buildingMetrics, 'sba');

    var monthsRevenues = _(revenueData)
      .groupBy(x => x.month)
      .map((value, key) => ({ name: key, revenues: value }))
      .value();
    var monthsExpenses = _(expenseData)
      .groupBy(x => x.month)
      .map((value, key) => ({ name: key, expenses: value }))
      .value();

    var carpetSeries: any = [];
    var sbaSeries: any = [];
    var profitLossSeries: any = [];
    var carpetArea = 0;
    var sba = 0;
    _.each(monthsRevenues, function(month) {
      var monthRevenue = Math.round(_.sumBy(month.revenues, "amount"));
      var monthBuildingExpenses = 0;
      var monthHoExpenses = 0;

      var liveBuildings = _.filter(buildingMetrics, function(b) {
        var monthLastDate = moment(month.name, "MMM YYYY").endOf('month');
        var flag = false;
        if (b.expectedLive && b.lastDate) {
          flag = moment(b.expectedLive).isBefore(monthLastDate) && moment(b.lastDate).isAfter(monthLastDate)
        } else if (b.expectedLive) {
          flag = moment(b.expectedLive).isBefore(monthLastDate);
        }
        return flag;
      })
      carpetArea = _.sumBy(liveBuildings, 'carpetArea');
      sba = _.sumBy(liveBuildings, 'sba');

      var monthExpensesData = _.find(monthsExpenses, { name: month.name });
      if (monthExpensesData) {
        monthBuildingExpenses = Math.round(_.sumBy(_.filter(monthExpensesData.expenses, function(e) {
          return e.building != "HO";
        }), "amount"));
        monthHoExpenses = Math.round(_.sumBy(_.filter(monthExpensesData.expenses, function(e) {
          return e.building == "HO";
        }), "amount"));

        if(self.plsbuildings.length){
          monthHoExpenses = Math.round(monthHoExpenses * (carpetArea/ totalCarpetArea));
        }
      }
      var monthProfit = Math.round(monthRevenue - monthBuildingExpenses - monthHoExpenses);

      var series = [];
      profitLossSeries.push({
        name: month.name,
        series: [
          { name: "Revenue", value: monthRevenue },
          { name: "Building Expenses", value: monthBuildingExpenses },
          { name: "HO Expenses", value: monthHoExpenses },
          { name: "Profit", value: monthProfit },
        ]
      })

      carpetSeries.push({ name: month.name, value: Math.round((monthProfit / carpetArea) * 100) / 100 });
      sbaSeries.push({ name: month.name, value: Math.round((monthProfit / sba) * 100) / 100 });
    });

    this.plGraphData = profitLossSeries;
    console.log("AccountsDashboard ::: profitLossSeries : ", profitLossSeries);

    this.sqftProfitLoss = [{
      "name": "Carpet Area",
      "series": carpetSeries
    }, {
      "name": "Super Buildup Area",
      "series": sbaSeries
    }]
    console.log("AccountsDashboard ::: profitLossSeries :: sqftProfitLoss : ", JSON.stringify(this.sqftProfitLoss));
  }

  onSelect(event) {
    console.log("Capex Graph ::: onSelect :: event : ", event);
  }
}
