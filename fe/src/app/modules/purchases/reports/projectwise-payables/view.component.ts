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
import { PurchasesService } from 'src/app/shared/services/purchases.service';

import { CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent } from 'angular-calendar';
import {
  isSameDay,
  isSameMonth
} from 'date-fns';
import { CalendarAppEvent } from 'src/app/shared/models/calendar-event.model';
import * as _ from 'lodash';
import * as moment from 'moment';

declare let $: any;

@Component({
  selector: 'purchases-reports-projectwise-payables',
  templateUrl: './view.component.html'
})
export class PurchasesProjectWisePayablesComponent implements OnInit, AfterViewInit {
  searchControl: FormControl = new FormControl();
  loading: any = false;
  isMonthWise: any = false;
  isProjectWise: any = false;
  countries: any = [];
  selectedCountry: any;
  cities: any = [];
  selectedCity: any;
  locations: any = [];
  selectedLocation: any;
  projects: any = [];
  selectedProject: any;
  vendors: any = [];
  selectedVendor: any;
  pos: any = [];

  vendorFilters: any = {};

  @ViewChild('assignModal') assignModal: any;
  @ViewChild('projectProjectsModal') projectProjectsModal: any;
  @ViewChild('unassignedPOsModal') unassignedPOsModal: any;
  @ViewChild('statusChangePOsModal') statusChangePOsModal: any;

  public view: any = 'month';
  public viewDate = new Date();
  private actions: CalendarEventAction[];
  public events: CalendarAppEvent[] = [];
  private colors: any = {
    red: {
      primary: '#f44336',
      secondary: '#FAE3E3'
    },
    blue: {
      primary: '#247ba0',
      secondary: '#D1E8FF'
    }, green: {
      primary: '#54bd05',
      secondary: '#54bd05'
    },
    orange: {
      primary: '#f57c3a',
      secondary: '#f57c3a'
    }
  };

  constructor(private dialogs: DialogsService, private service: AdminService,
    public purchasesService: PurchasesService, public reportsService: ReportsService) {
    this.actions = [{
      label: '<i class="i-Edit m-1 text-secondary"></i>',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('edit', event);
      }
    }];
  }

  ngAfterViewInit() { }

  ngOnInit() {
    this.searchControl.valueChanges
      .pipe(debounceTime(200))
      .pipe(take(1)).subscribe(value => {
        this.vendorFilters.search = value;
        this.loadBaseReport();
      });

    this.service.listCountries({ filters: { active: 1 }, offset: 0, limit: 100 }).pipe(take(1)).subscribe(
      res => {
        this.countries = res['data'];
        this.selectedCountry = res['data'][0];
        this.vendorFilters = {
          countryId: this.selectedCountry.id
        }
        this.onCountrySelected();
      });
  }

  onCountrySelected() {
    this.service.listCities({ filters: { countryId: this.selectedCountry.id, active: 1 }, offset: 0, limit: 100 }).pipe(take(1)).subscribe(
      res => {
        this.cities = res['data'];
        this.selectedCity = null;
        this.selectedLocation = null;
        // this.selectedCity = res['data'][0];
        this.vendorFilters = {
          countryId: this.selectedCountry.id
        }
        this.loadBaseReport();
      });
  }
  onCitySelected() {
    this.service.listLocations({ filters: { cityId: this.selectedCity.id, active: 1 }, offset: 0, limit: 100 }).pipe(take(1)).subscribe(
      res => {
        this.locations = res['data'];
        this.selectedLocation = null;
        // this.selectedLocation = res['data'][0];
        this.vendorFilters = {
          countryId: this.selectedCountry.id,
          cityId: this.selectedCity.id,
        }
        this.loadBaseReport();
      });
  }
  onLocationSelected() {
    this.service.listLocations({ filters: { cityId: this.selectedCity.id, active: 1 }, offset: 0, limit: 100 }).pipe(take(1)).subscribe(
      res => {
        this.locations = res['data'];
        this.selectedLocation = {};
        // this.selectedLocation = res['data'][0];
        this.vendorFilters = {
          countryId: this.selectedCountry.id,
          cityId: this.selectedCity.id,
          locationId: this.selectedLocation.id,
        }
        this.loadBaseReport();
      });
  }

  data: any = [];
  reportType: any = "Projects";
  loadBaseReport() {
    this.loading = true;
    this.reportsService.getPurchaseBuilingWisePayables(this.vendorFilters).pipe(take(1)).subscribe(
      res => {
        this.data = res['data'];
        this.onBillTypeSelected();
      }, error => {

      });
  }

  monthlyData: any;
  loadMonthlyDuesData() {
    if (!this.monthlyData) {
      this.loading = true;
      this.reportsService.getPurchaseDueMilestones(this.vendorFilters).pipe(take(1)).subscribe(
        res => {
          this.monthlyData = res['data'];
          if (this.selectedProject && !this.vendorFilters.projectVendor) {
            this.loadProjectDueDates(this.selectedProject);
          } else if (this.selectedVendor) {
            this.loadVendorDueDates(this.selectedVendor);
          } else {
            this.getMonthlyDuesData();
          }
          this.loading = false;
        }, error => { });
    } else {
      this.getMonthlyDuesData();
    }
  }

  getMonthlyDuesData() {
    var self = this;
    var data = _.clone(this.monthlyData);
    data = _.filter(data, function(d) { return d.dueDate && self.selectedStatuses.indexOf(d.poStatus) > -1 });

    var events = [];
    _.each(data, function(e) {
      var event = {
        _id: e.poId,
        start: moment(e.dueDate, "YYYY-MM-DD"),
        end: moment(e.dueDate, "YYYY-MM-DD"),
        title: "Rs. " + e.amount + " - " + e.vendor + " - " + e.project + " by " + moment(e.dueDate, "YYYY-MM-DD").format("MMM DD, YYYY"),
        color: self.colors.blue
      }
      if (moment(e.dueDate).isSameOrBefore(moment())) {
        event.color = self.colors.red;
      }
      events.push(event);
    })

    self.events = self.initEvents(events);
    console.log("MonthlyDues :: events : ", events);
  }

  initEvents(events): CalendarAppEvent[] {
    return events.map(event => {
      event.actions = this.actions;
      var e = new CalendarAppEvent(event);
      e.draggable = false;
      e.resizable = null;
      return e;
    });
  }

  handleEvent(action: string, event: CalendarAppEvent): void {
    console.log("event click : ", event);
    window.open("#/purchases/purchaseorder/" + event._id, '_blank')
  }

  activeDayIsOpen: any = false;
  public dayClicked({ date, events }: { date: Date, events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
        this.viewDate = date;
      }
    }
  }

  isBill: any = "";
  onBillTypeSelected() {
    if (parseInt(this.isBill)) {
      this.selectedStatuses = ['Raised', 'Approved', 'Paid'];
    } else if (parseInt(this.isBill) == 0) {
      this.selectedStatuses = ['Raised', 'Started', 'Closed'];
    } else if (this.isBill == "") {
      this.selectedStatuses = ['Raised', 'Started', 'Closed', 'Approved', 'Paid'];
    }
    this.getReportsData();
  }

  getReportsData() {
    this.projects = [];
    this.vendors = [];
    this.events = [];
    this.monthlyPODues = [];
    this.months = [];
    this.projectVendors = [];
    this.selectedVendor = null;
    this.selectedProject = null;
    this.loading = true;
    this.vendorFilters = {};

    if (this.reportType == 'Projects') {
      this.getProjectsData();
    } else if (this.reportType == 'Vendors') {
      this.getVendorsData();
    } else if (this.reportType == 'MonthlyDues') {
      this.loadMonthlyDuesData();
    }
    this.loading = false;
  }

  getProjectsData() {
    var data = _.clone(this.data);
    var self = this;
    data = _.filter(data, function(d) { return d.title != null });

    var projects = _.uniq(_.map(data, 'title'), 'title');

    console.log("getPurchaseBuilingWisePayables :: projects : ", projects);

    var projectData = [];
    _.each(projects, function(b) {
      var project: any = { name: b };
      // projectData = _.filter(data, function(d) { return d.project == b && d.yetToPay > 0 });
      if (self.selectedStatuses.length) {
        projectData = _.filter(data, function(d) { return d.title == b && self.selectedStatuses.indexOf(d.status) > -1 });
      } else {
        projectData = _.filter(data, function(d) { return d.title == b });
      }

      if (parseInt(self.isBill)) {
        projectData = _.filter(projectData, function(d) { return d.isBill == 1 });
        project.bills = projectData.length;
        project.pos = 0;
         project.raisedBills = _.filter(projectData, function(d) { return d.status == "Raised" }).length;
        project.approvedBills = _.filter(projectData, function(d) { return d.status == "Approved" }).length;
        project.paidBills = _.filter(projectData, function(d) { return d.status == "Paid" }).length;

        console.log("Building Data : " + b, project.bills);
      } else if (parseInt(self.isBill) == 0) {
        projectData = _.filter(projectData, function(d) { return d.isBill != 1 });
        project.pos = projectData.length;
        project.bills = 0;
      } else if (self.isBill == "") {
        project.pos = _.filter(projectData, function(d) { return d.isBill != 1 }).length;
        project.bills = _.filter(projectData, function(d) { return d.isBill == 1 }).length;

         project.raisedBills = _.filter(projectData, function(d) { return d.isBill == 1 && d.status == "Raised" }).length;
        project.approvedBills = _.filter(projectData, function(d) { return d.isBill == 1 && d.status == "Approved" }).length;
        project.paidBills = _.filter(projectData, function(d) { return d.isBill == 1 && d.status == "Paid" }).length;
      }
      // console.log("Project Data : " + b, projectData.length);
      project.vendors = _.uniq(_.map(projectData, 'vendor'), 'vendor').length;
      project.projectId = projectData.length ? projectData[0].projectId : null;
      project.redPos = _.filter(projectData, function(d) { return d.isBill != 1 &&  d.status != 'Closed' && !d.paidAmount && moment(d.date).isSameOrBefore(moment().add(-30, 'days')) }).length;
      project.yellowPos = _.filter(projectData, function(d) { return d.isBill != 1 && !d.paidAmount && moment(d.date).isAfter(moment().add(-29, 'days')) && moment(d.date).isSameOrBefore(moment().add(-15, 'days')) }).length;
      project.lightPos = _.filter(projectData, function(d) { return d.isBill != 1 && !d.paidAmount && moment(d.date).isAfter(moment().add(-14, 'days')) }).length;
      project.unpaid = _.filter(projectData, function(d) { return d.isBill != 1 && !d.paidAmount }).length;
      project.partialPaid = _.filter(projectData, function(d) { return d.isBill != 1 && d.paidAmount && d.paidAmount < d.amount && d.status != 'Closed' }).length;
      project.closed = _.filter(projectData, function(d) { return d.isBill != 1 && d.status == 'Closed' }).length;

      project.total = Math.round(_.sumBy(projectData, 'amount'));
      project.drafted = Math.round(_.sumBy(projectData, 'draftAmount'));
      project.released = Math.round(_.sumBy(projectData, 'releasedAmount'));
      project.approved = Math.round(_.sumBy(projectData, 'approvedAmount'));
      project.paid = Math.round(_.sumBy(projectData, 'paidAmount'));
      project.yetToPay = Math.round(_.sumBy(projectData, 'yetToPay'));
      project.due = project.released + project.approved;
      self.projects.push(project);
    });
    this.loading = false;

    // this.loadVendors(self.projects[7]);
  }

  getVendorsData() {
    var data = _.clone(this.data);
    var self = this;
    data = _.filter(data, function(d) { return d.vendor != null });

    var vendors = _.uniq(_.map(data, 'vendor'), 'vendor');
    console.log("getPurchaseBuilingWisePayables :: vendors : ", vendors);

    var vendorData = [];
    _.each(vendors, function(b) {
      var vendor: any = { name: b };
      // vendorData = _.filter(data, function(d) { return d.vendor == b && d.yetToPay > 0 });
      if (self.selectedStatuses.length) {
        vendorData = _.filter(data, function(d) { return d.vendor == b && self.selectedStatuses.indexOf(d.status) > -1 });
      } else {
        vendorData = _.filter(data, function(d) { return d.vendor == b });
      }
      if (vendorData.length) {
        vendor.pos = vendorData.length;
        vendor.vendorId = vendorData[0].vendorId;
        vendor.redPos = _.filter(vendorData, function(d) { return d.status != 'Closed' && !d.paidAmount && moment(d.date).isSameOrBefore(moment().add(-30, 'days')) }).length;
        vendor.yellowPos = _.filter(vendorData, function(d) { return !d.paidAmount && moment(d.date).isAfter(moment().add(-30, 'days')) && moment(d.date).isBefore(moment().add(-15, 'days')) }).length;
        vendor.lightPos = _.filter(vendorData, function(d) { return !d.paidAmount && moment(d.date).isAfter(moment().add(-15, 'days')) }).length;
        vendor.partialPaid = _.filter(vendorData, function(d) { return d.paidAmount && d.paidAmount < d.amount }).length;
        vendor.closed = _.filter(vendorData, function(d) { return d.status == 'Closed' }).length;

        vendor.total = Math.round(_.sumBy(vendorData, 'amount'));
        vendor.drafted = Math.round(_.sumBy(vendorData, 'draftAmount'));
        vendor.released = Math.round(_.sumBy(vendorData, 'releasedAmount'));
        vendor.approved = Math.round(_.sumBy(vendorData, 'approvedAmount'));
        vendor.paid = Math.round(_.sumBy(vendorData, 'paidAmount'));
        vendor.yetToPay = Math.round(_.sumBy(vendorData, 'yetToPay'));
        vendor.due = vendor.released + vendor.approved;
        self.vendors.push(vendor);
      }
    });
    this.loading = false;

    // this.loadVendors(self.projects[7]);
  }

  selectedStatuses: any = ['Raised', 'Started', 'Closed'];
  months: any = [];
  loadMonthWiseVendors(project) {
    var data = _.clone(this.data);
    this.months = [];
    this.monthlyPODues = [];
    var self = this;

    var projectData = _.filter(data, function(d) { return d.title == project.name });
    if (this.isBill == '1') {
      projectData = _.filter(projectData, function(d) { return d.isBill == 1 });
    } else if (this.isBill == '0') {
      projectData = _.filter(projectData, function(d) { return d.isBill == 0 });
    }
    var _months = _(projectData)
      .groupBy(x => x.month)
      .map((value, key) => ({ name: key, month: value[0].mon, vendors: value }))
      .value();

    _.each(_months, function(month) {
      var monthsData = _.filter(projectData, function(d) { return d.month == month.name });

      var vendors = _.uniq(_.map(monthsData, 'vendor'), 'vendor');
      console.log("loadMonthWiseVendors :: vendors : " + month.name, vendors);

      var vendorData = [];
      var monthlyVendors = [];
      if (vendors.length) {
        _.each(vendors, function(v) {
          var vendor: any = { name: v };
          if (self.selectedStatuses.length) {
            vendorData = _.filter(projectData, function(d) { return d.vendor == v && d.month == month.name && self.selectedStatuses.indexOf(d.status) > -1 });
          } else {
            vendorData = _.filter(projectData, function(d) { return d.vendor == v && d.month == month.name });
          }
          vendor.total = Math.round(_.sumBy(vendorData, 'amount'));
          vendor.drafted = Math.round(_.sumBy(vendorData, 'draftAmount'));
          vendor.released = Math.round(_.sumBy(vendorData, 'releasedAmount'));
          vendor.approved = Math.round(_.sumBy(vendorData, 'approvedAmount'));
          vendor.paid = Math.round(_.sumBy(vendorData, 'paidAmount'));
          vendor.yetToPay = Math.round(_.sumBy(vendorData, 'yetToPay'));
          vendor.pos = vendorData;

          if (vendorData.length) {
            monthlyVendors.push(vendor);
          }
        });

        if (monthlyVendors.length) {
          self.months.push({
            name: month.name,
            month: month.month,
            vendors: monthlyVendors,
          })
        }
      }
    })

    this.months = _.sortBy(this.months, 'month');
    console.log("loadMonthWiseVendors :: months : ", this.months);
  }

  monthlyPODues: any = [];
  loadProjectDueDates(project) {
    var data = _.clone(this.monthlyData);
    this.months = [];
    this.monthlyPODues = [];
    var self = this;

    var projectData = _.filter(data, function(d) { return d.project == project.name && d.amount > 0 });
    if (this.isBill == '1') {
      projectData = _.filter(projectData, function(d) { return d.isBill == 1 });
    } else if (this.isBill == '0') {
      projectData = _.filter(projectData, function(d) { return d.isBill == 0 });
    }
    var _months = _(projectData)
      .groupBy(x => moment(x.dueDate, 'YYYY-MM-DD').format("YYYYMM"))
      .map((value, key) => ({ name: key, month: moment(value[0].dueDate, 'YYYY-MM-DD').format("MMM YY"), dues: value }))
      .value();

    _.each(_months, function(month) {
      var monthsData = _.filter(month.dues, function(d) { return moment(d.dueDate, 'YYYY-MM-DD').format("YYYYMM") == month.name });
      if (monthsData.length) {
        _.each(monthsData, function(d) {
          d.date = moment(d.dueDate, 'YYYY-MM-DD').format("YYYYMMDD")
        })
        monthsData = _.sortBy(monthsData, 'date');
        self.monthlyPODues.push({
          name: month.name,
          month: month.month,
          dates: monthsData,
        })
      }
    })

    this.monthlyPODues = _.sortBy(this.monthlyPODues, 'name');
    console.log("loadProjectDueDates :: months : ", this.months);
    console.log("loadProjectDueDates :: monthlyPODues : ", this.monthlyPODues);
  }

  loadProjectsWiseVendors(project) {
    var data = _.clone(this.data);
    this.projects = [];
    var self = this;

    var projectData = _.filter(data, function(d) { return d.project == project.name });
    if (this.isBill == '1') {
      projectData = _.filter(projectData, function(d) { return d.isBill == 1 });
    } else if (this.isBill == '0') {
      projectData = _.filter(projectData, function(d) { return d.isBill == 0 });
    }
    var _projects = _(data)
      .filter(object => _.has(object, 'projectId'))
      .groupBy(x => x.projectId)
      .map((value, key) => ({ projectId: key, title: value[0].title, proposedDate: value[0].proposedDate, vendors: value }))
      .value();

    console.log("loadProjectsWiseVendors :: _projects : ", _projects);

    _.each(_projects, function(project) {
      var projectsData = _.filter(projectData, function(d) { return d.title == project.name });

      var vendors = _.uniq(_.map(projectsData, 'vendor'), 'vendor');
      console.log("loadProjectsWiseVendors :: vendors : " + project.title, vendors);

      var vendorData = [];
      var projectVendors = [];
      if (vendors.length) {
        _.each(vendors, function(v) {
          var vendor: any = { name: v };
          if (self.selectedStatuses.length) {
            vendorData = _.filter(projectData, function(d) { return d.vendor == v && d.title == project.title && self.selectedStatuses.indexOf(d.status) > -1 });
          } else {
            vendorData = _.filter(projectData, function(d) { return d.vendor == v && d.title == project.title });
          }
          vendor.total = Math.round(_.sumBy(vendorData, 'amount'));
          vendor.drafted = Math.round(_.sumBy(vendorData, 'draftAmount'));
          vendor.released = Math.round(_.sumBy(vendorData, 'releasedAmount'));
          vendor.approved = Math.round(_.sumBy(vendorData, 'approvedAmount'));
          vendor.paid = Math.round(_.sumBy(vendorData, 'paidAmount'));
          vendor.yetToPay = Math.round(_.sumBy(vendorData, 'yetToPay'));
          vendor.pos = vendorData;

          if (vendorData.length) {
            projectVendors.push(vendor);
          }
        });

        if (projectVendors.length) {
          self.projects.push({
            projectId: project.projectId,
            title: project.title,
            proposedDate: project.proposedDate,
            vendors: projectVendors,
          })
        }
      }
    })

    this.projects = _.sortBy(this.projects, 'proposedDate', 'desc');
    console.log("loadProjectsWiseVendors :: projects : ", this.projects);
  }

  projectVendors: any = [];
  duesByDates: any = false;
  loadProjectVendors(project) {
    if (this.selectedProject && this.selectedProject.selected) {
      this.selectedProject.selected = false;
    }
    this.selectedProject = project;
    this.selectedProject.selected = true;
    this.vendorFilters.project = project.name;
    this.vendorFilters.vendor = null;
    this.selectedVendor = null;

    this.loading = true;

    this.months = [];
    this.monthlyPODues = [];
    this.projectVendors = [];
    this.pos = [];

    if (this.duesByDates) {
      if (this.monthlyData) {
        this.loadProjectDueDates(project);
      } else {
        this.loadMonthlyDuesData();
      }
    } else if (this.isMonthWise) {
      this.loadMonthWiseVendors(project);
    } else {
      this.isMonthWise = false;
      var data = _.clone(this.data);
      var self = this;

      // data = _.filter(data, function(d) { return d.project == project.name && d.yetToPay > 0 });
      data = _.filter(data, function(d) { return d.title == project.name });
      if (this.isBill == '1') {
        data = _.filter(data, function(d) { return d.isBill == 1 });
      } else if (this.isBill == '0') {
        data = _.filter(data, function(d) { return d.isBill == 0 });
      }
      var vendors = _.uniq(_.map(data, 'vendor'), 'vendor');
      // console.log("getPurchaseBuilingWisePayables :: vendors : ", vendors);

      var vendorData = [];
      _.each(vendors, function(v) {
        var vendor: any = { name: v };
        // vendorData = _.filter(data, function(d) { return d.vendor == v && d.yetToPay > 0 });
        if (self.selectedStatuses.length) {
          vendorData = _.filter(data, function(d) { return d.vendor == v && self.selectedStatuses.indexOf(d.status) > -1 });
        } else {
          vendorData = _.filter(data, function(d) { return d.vendor == v });
        }
        vendor.pos = _.uniq(_.map(vendorData, 'id'), 'id').length;
        vendor.total = Math.round(_.sumBy(vendorData, 'amount'));
        vendor.drafted = Math.round(_.sumBy(vendorData, 'draftAmount'));
        vendor.released = Math.round(_.sumBy(vendorData, 'releasedAmount'));
        vendor.approved = Math.round(_.sumBy(vendorData, 'approvedAmount'));
        vendor.paid = Math.round(_.sumBy(vendorData, 'paidAmount'));
        vendor.yetToPay = Math.round(_.sumBy(vendorData, 'yetToPay'));
        self.projectVendors.push(vendor);
      });

      self.projectVendors = _.orderBy(self.projectVendors, 'yetToPay', 'desc');
    }
    this.loading = false;
  }

  selectedMonth: any = "";
  loadMonthPOs(month, vendor) {
    this.selectedMonth = month;
    if (this.selectedVendor && this.selectedVendor.selected) {
      this.selectedVendor.selected = false;
    }
    this.selectedVendor = vendor;
    this.selectedVendor.selected = true;
    this.vendorFilters.projectVendor = vendor.name;
    this.vendorPos = vendor.pos;
  }

  loadProjectPOs(project, vendor) {
    this.selectedProject = project;
    if (this.selectedVendor && this.selectedVendor.selected) {
      this.selectedVendor.selected = false;
    }
    this.selectedVendor = vendor;
    this.selectedVendor.selected = true;
    this.vendorFilters.vendor = vendor.name;
    this.pos = vendor.pos;
  }



  loadVendorMonthWisePOs(vendor) {
    var data = _.clone(this.data);
    this.vendorMonths = [];
    this.vendorMonthlyPODues = [];
    var self = this;

    var vendorData = _.filter(data, function(d) { return d.vendor == vendor.name });

    var _months = _(vendorData)
      .groupBy(x => x.month)
      .map((value, key) => ({ name: key, month: value[0].mon, vendors: value }))
      .value();

    _.each(_months, function(month) {
      var monthsData = _.filter(vendorData, function(d) { return d.month == month.name });

      if (monthsData.length) {
        self.vendorMonths.push({
          name: month.name,
          month: month.month,
          monthlyPos: monthsData
        })
      }
    })

    this.vendorMonths = _.sortBy(this.vendorMonths, 'month');
    console.log("loadVendorMonthWisePOs :: vendorMonths : ", this.vendorMonths);
    this.loading = false;
  }

  loadVendorDueDates(vendor) {
    var data = _.clone(this.monthlyData);
    this.vendorMonths = [];
    this.vendorMonthlyPODues = [];
    var self = this;

    var vendorData = _.filter(data, function(d) { return d.vendor == vendor.name && d.amount > 0 });

    var _months = _(vendorData)
      .groupBy(x => moment(x.dueDate, 'YYYY-MM-DD').format("YYYYMM"))
      .map((value, key) => ({ name: key, month: moment(value[0].dueDate, 'YYYY-MM-DD').format("MMM YY"), dues: value }))
      .value();

    _.each(_months, function(month) {
      var monthsData = _.filter(month.dues, function(d) { return moment(d.dueDate, 'YYYY-MM-DD').format("YYYYMM") == month.name });
      if (monthsData.length) {
        _.each(monthsData, function(d) {
          d.date = moment(d.dueDate, 'YYYY-MM-DD').format("YYYYMMDD")
        })
        monthsData = _.sortBy(monthsData, 'date');
        self.vendorMonthlyPODues.push({
          name: month.name,
          month: month.month,
          dates: monthsData,
        })
      }
    })

    this.vendorMonthlyPODues = _.sortBy(this.vendorMonthlyPODues, 'name');
    console.log("loadVendorDueDates :: vendorMonths : ", this.vendorMonths);
    console.log("loadVendorDueDates :: vendorMonthlyPODues : ", this.vendorMonthlyPODues);
  }

  vendorPos: any = [];
  vendorMonths: any = [];
  vendorMonthlyPODues: any = [];
  loadPOs(vendor) {
    this.selectedMonth = "";
    this.loading = true;
    if (this.selectedVendor && this.selectedVendor.selected) {
      this.selectedVendor.selected = false;
    }
    this.selectedVendor = vendor;
    this.selectedVendor.selected = true;
    if (this.selectedProject) {
      this.vendorFilters.vendor = null;
      this.vendorFilters.projectVendor = vendor.name;
    } else {
      this.vendorFilters.projectVendor = null;
      this.vendorFilters.vendor = vendor.name;
    }

    this.pos = [];
    this.vendorPos = [];
    this.vendorMonths = [];
    this.vendorMonthlyPODues = [];
    if (this.duesByDates) {
      if (this.monthlyData) {
        this.loadVendorDueDates(vendor);
      } else {
        this.loadMonthlyDuesData();
      }
    } else if (this.isMonthWise) {
      this.loadVendorMonthWisePOs(vendor);
    } else {
      var data = _.clone(this.data);
      var self = this;
      // data = _.filter(data, function(d) { return d.project == self.selectedProject.name && d.vendor == vendor.name && d.yetToPay > 0 });
      if (self.selectedStatuses.length) {
        if (self.selectedProject) {
          data = _.filter(data, function(d) { return d.title == self.selectedProject.name && d.vendor == vendor.name && self.selectedStatuses.indexOf(d.status) > -1 });
        } else {
          data = _.filter(data, function(d) { return d.vendor == vendor.name && self.selectedStatuses.indexOf(d.status) > -1 });
        }
      } else {
        if (self.selectedProject) {
          data = _.filter(data, function(d) { return d.title == self.selectedProject.name && d.vendor == vendor.name });
        } else {
          data = _.filter(data, function(d) { return d.vendor == vendor.name });
        }
      }
      this.vendorPos = _.orderBy(data, 'yetToPay', 'desc');
    }
    this.loading = false;
  }

  sort: any = {}
  sortBy(data, col, table) {
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
    data = _.orderBy(data, [col], [sortType]);

    // console.log("Projectwise Payables :: sortBy : data : ", data);
    this[table] = data;
  }


  unassignedPos: any = [];
  currentProject: any;
  title: any;
  openedModal: any;
  openUnAssignedPOs(project?) {
    this.title = 'UnAssigned POs';
    this.currentProject = _.clone(project);
    this.unassignedPos = _.filter(this.data, function(d) { return d.projectId == project.projectId && !d.projectId })

    if (this.unassignedPos.length) {
      this.openedModal = this.dialogs.modal(this.unassignedPOsModal, { size: 'xlg', backdrop: 'static' });
    }
  }
  openRedPOs(project?) {
    this.title = 'POs raised before 30 days';
    this.currentProject = _.clone(project);
    this.unassignedPos = _.filter(this.data, function(d) { return d.projectId == project.projectId && !d.paidAmount && moment(d.date).isBefore(moment().add(-30, 'days')) })

    if (this.unassignedPos.length) {
      this.openedModal = this.dialogs.modal(this.statusChangePOsModal, { size: 'xlg', backdrop: 'static' });
    }
  }
  openYellowPOs(project?) {
    this.title = 'POs raised before 15 days';
    this.currentProject = _.clone(project);
    this.unassignedPos = _.filter(this.data, function(d) { return d.projectId == project.projectId && !d.paidAmount && moment(d.date).isAfter(moment().add(-30, 'days')) && moment(d.date).isBefore(moment().add(-15, 'days')) })

    if (this.unassignedPos.length) {
      this.openedModal = this.dialogs.modal(this.statusChangePOsModal, { size: 'xlg', backdrop: 'static' });
    }
  }

  updatePOStatus(po) {
    var data: any = {
      id: po.id,
      status: po.status
    }
    this.purchasesService.savePurchaseOrder(data)
      .pipe(take(1)).subscribe((res) => {
        this.dialogs.success("Status updated !!")
      });
  }

}
