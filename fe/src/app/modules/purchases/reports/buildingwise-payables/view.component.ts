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
import * as _ from 'lodash';
import * as moment from 'moment';

declare let $: any;

@Component({
  selector: 'purchases-reports-buildingwise-payables',
  templateUrl: './view.component.html'
})
export class PurchasesBuildingWisePayablesComponent implements OnInit, AfterViewInit {
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
  buildings: any = [];
  selectedBuilding: any;
  vendors: any = [];
  selectedVendor: any;
  pos: any = [];

  vendorFilters: any = {};

  @ViewChild('assignModal') assignModal: any;
  @ViewChild('buildingProjectsModal') buildingProjectsModal: any;
  @ViewChild('unassignedPOsModal') unassignedPOsModal: any;
  @ViewChild('statusChangePOsModal') statusChangePOsModal: any;

  constructor(private dialogs: DialogsService, private service: AdminService,
    public purchasesService: PurchasesService, public reportsService: ReportsService) {
  }

  ngAfterViewInit() { }

  ngOnInit() {
    this.searchControl.valueChanges
      .pipe(debounceTime(200))
      .pipe(take(1)).subscribe(value => {
        this.vendorFilters.search = value;
        this.loadBuildings();
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
        this.loadBuildings();
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
        this.loadBuildings();
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
        this.loadBuildings();
      });
  }

  data: any = [];
  loadBuildings() {
    this.loading = true;
    this.vendorFilters.building = null;
    this.vendorFilters.vendorId = null;
    this.reportsService.getPurchaseBuilingWisePayables(this.vendorFilters).pipe(take(1)).subscribe(
      res => {
        this.data = res['data'];

        var data = _.clone(this.data);
        this.buildings = [];
        var self = this;

        this.onStatusChange();
        this.loading = false;

        // this.loadVendors(self.buildings[7]);
      }, error => {

      });
  }

  selectedStatuses: any = ['Raised', 'Started', 'Closed', 'Approved', 'Paid'];
  // selectedStatuses: any = ['Raised', 'Started', 'Closed'];
  isBill: any = "";
  onBillTypeSelected() {
    if (parseInt(this.isBill)) {
      this.selectedStatuses = ['Raised', 'Approved', 'Paid'];
    } else if (parseInt(this.isBill) == 0) {
      this.selectedStatuses = ['Raised', 'Started', 'Closed'];
    } else if (this.isBill == "") {
      this.selectedStatuses = ['Raised', 'Started', 'Closed', 'Approved', 'Paid'];
    }
    this.onStatusChange();
  }

  onStatusChange() {
    var self = this;
    // console.log("onStatusChange : isBill " + this.isBill);
    this.loading = true;
    // this.selectedBuilding = null;
    // this.selectedVendor = null;
    // this.vendorFilters.building = null;
    // this.vendorFilters.vendorId = null;

    var data = _.clone(this.data);
    this.buildings = [];
    this.months = [];
    this.vendors = [];

    var buildings = _.uniq(_.map(data, 'building'), 'building');
    // console.log("getPurchaseBuilingWisePayables :: buildings for status : " + this.selectedStatuses, buildings);

    var buildingData = [];
    _.each(buildings, function(b) {
      var building: any = { name: b };
      // buildingData = _.filter(data, function(d) { return d.building == b && d.yetToPay > 0 });
      if (self.selectedStatuses.length) {
        buildingData = _.filter(data, function(d) { return d.building == b && self.selectedStatuses.indexOf(d.status) > -1 });
      } else {
        buildingData = _.filter(data, function(d) { return d.building == b });
      }
      if (parseInt(self.isBill)) {
        buildingData = _.filter(buildingData, function(d) { return d.isBill == 1 });
        building.bills = buildingData.length;
        building.pos = 0;

        building.raisedBills = _.filter(buildingData, function(d) { return d.status == "Raised" }).length;
        building.approvedBills = _.filter(buildingData, function(d) { return d.status == "Approved" }).length;
        building.paidBills = _.filter(buildingData, function(d) { return d.status == "Paid" }).length;
        // console.log("Building Data : " + b, building.bills);
      } else if (parseInt(self.isBill) == 0) {
        buildingData = _.filter(buildingData, function(d) { return d.isBill != 1 });
        building.pos = buildingData.length;
        building.bills = 0;
      } else if (self.isBill == "") {
        building.pos = _.filter(buildingData, function(d) { return d.isBill != 1 }).length;
        building.bills = _.filter(buildingData, function(d) { return d.isBill == 1 }).length;

        building.raisedBills = _.filter(buildingData, function(d) { return d.isBill == 1 && d.status == "Raised" }).length;
        building.approvedBills = _.filter(buildingData, function(d) { return d.isBill == 1 && d.status == "Approved" }).length;
        building.paidBills = _.filter(buildingData, function(d) { return d.isBill == 1 && d.status == "Paid" }).length;
      }
      // console.log("Building Data : " + b, buildingData.length);
      if (buildingData.length) {
        building.buildingId = buildingData[0].buildingId;
      }
      building.vendors = _.uniq(_.map(buildingData, 'vendor'), 'vendor').length;
      building.total = Math.round(_.sumBy(buildingData, 'amount'));
      building.drafted = Math.round(_.sumBy(buildingData, 'draftAmount'));
      building.released = Math.round(_.sumBy(buildingData, 'releasedAmount'));
      building.approved = Math.round(_.sumBy(buildingData, 'approvedAmount'));
      building.paid = Math.round(_.sumBy(buildingData, 'paidAmount'));
      building.unassignedPos = _.filter(buildingData, function(d) { return d.projectId == null }).length;
      building.yetToPay = Math.round(_.sumBy(buildingData, 'yetToPay'));
      building.redPos = _.filter(buildingData, function(d) { return d.isBill != 1 && d.status != 'Closed' && !d.paidAmount && moment(d.date).isSameOrBefore(moment().add(-30, 'days')) }).length;
      building.yellowPos = _.filter(buildingData, function(d) { return d.isBill != 1 && !d.paidAmount && moment(d.date).isAfter(moment().add(-30, 'days')) && moment(d.date).isBefore(moment().add(-15, 'days')) }).length;
      building.lightPos = _.filter(buildingData, function(d) { return d.isBill != 1 && !d.paidAmount && moment(d.date).isAfter(moment().add(-15, 'days')) }).length;
      building.unpaid = _.filter(buildingData, function(d) { return d.isBill != 1 && !d.paidAmount }).length;
      building.partialPaid = _.filter(buildingData, function(d) { return d.isBill != 1 && d.paidAmount && d.paidAmount <= d.amount }).length;
      building.closed = _.filter(buildingData, function(d) { return d.isBill != 1 && d.status == 'Closed' }).length;
      var projects = _.map(_.filter(buildingData, function(d) { return d.projectId != null }), 'projectId');
      building.projects = _.uniq(projects, 'projectId').length;

      self.buildings.push(building);
    });

    if (this.selectedBuilding) {
      this.loadVendors(this.selectedBuilding);
    }
    this.loading = false;
  }

  months: any = [];
  loadMonthWiseVendors(building) {
    var data = _.clone(this.data);
    this.months = [];
    var self = this;

    var buildingData = _.filter(data, function(d) { return d.building == building.name });
    if (this.isBill == '1') {
      buildingData = _.filter(buildingData, function(d) { return d.isBill == 1 });
    } else if (this.isBill == '0') {
      buildingData = _.filter(buildingData, function(d) { return d.isBill == 0 });
    }

    var _months = _(buildingData)
      .groupBy(x => x.month)
      .map((value, key) => ({ name: key, month: value[0].mon, vendors: value }))
      .value();

    _.each(_months, function(month) {
      var monthsData = _.filter(buildingData, function(d) { return d.month == month.name });

      var vendors = _.uniq(_.map(monthsData, 'vendor'), 'vendor');
      console.log("loadMonthWiseVendors :: vendors : " + month.name, vendors);

      var vendorData = [];
      var monthlyVendors = [];
      if (vendors.length) {
        _.each(vendors, function(v) {
          var vendor: any = { name: v };
          if (self.selectedStatuses.length) {
            vendorData = _.filter(buildingData, function(d) { return d.vendor == v && d.month == month.name && self.selectedStatuses.indexOf(d.status) > -1 });
          } else {
            vendorData = _.filter(buildingData, function(d) { return d.vendor == v && d.month == month.name });
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

  projects: any = [];
  loadProjectsWiseVendors(building) {
    var data = _.clone(this.data);
    this.projects = [];
    var self = this;

    var buildingData = _.filter(data, function(d) { return d.building == building.name });
    if (this.isBill == '1') {
      buildingData = _.filter(buildingData, function(d) { return d.isBill == 1 });
    } else if (this.isBill == '0') {
      buildingData = _.filter(buildingData, function(d) { return d.isBill == 0 });
    }

    var _projects = _(buildingData)
      .filter(object => _.has(object, 'projectId'))
      .groupBy(x => x.projectId)
      .map((value, key) => ({ projectId: key, title: value[0].title, proposedDate: value[0].proposedDate, vendors: value }))
      .value();

    // console.log("loadProjectsWiseVendors :: _projects : ", _projects);

    _.each(_projects, function(project) {
      var projectsData = _.filter(buildingData, function(d) { return d.title == project.title });

      var vendors = _.uniq(_.map(projectsData, 'vendor'), 'vendor');
      // console.log("loadProjectsWiseVendors :: vendors : " + project.title, vendors);

      var vendorData = [];
      var projectVendors = [];
      if (vendors.length) {
        _.each(vendors, function(v) {
          var vendor: any = { name: v };
          if (self.selectedStatuses.length) {
            vendorData = _.filter(buildingData, function(d) { return d.vendor == v && d.title == project.title && self.selectedStatuses.indexOf(d.status) > -1 });
          } else {
            vendorData = _.filter(buildingData, function(d) { return d.vendor == v && d.title == project.title });
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

  loadVendors(building) {
    if (this.selectedBuilding && this.selectedBuilding.selected) {
      this.selectedBuilding.selected = false;
    }
    this.selectedBuilding = building;
    this.selectedBuilding.selected = true;
    this.vendorFilters.building = building.name;
    this.vendorFilters.vendor = null;
    this.selectedVendor = null;

    this.loading = true;

    this.months = [];
    this.vendors = [];
    this.projects = [];
    this.pos = [];

    if (this.isMonthWise) {
      this.isProjectWise = false;
      this.loadMonthWiseVendors(building);
    } if (this.isProjectWise) {
      this.isMonthWise = false;
      this.loadProjectsWiseVendors(building);
    } else {
      this.isProjectWise = false;
      this.isMonthWise = false;
      var data = _.clone(this.data);
      var self = this;

      // data = _.filter(data, function(d) { return d.building == building.name && d.yetToPay > 0 });
      data = _.filter(data, function(d) { return d.building == building.name });
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
        self.vendors.push(vendor);
      });

      self.vendors = _.orderBy(self.vendors, 'yetToPay', 'desc');
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
    this.vendorFilters.vendor = vendor.name;
    this.pos = vendor.pos;
  }

  selectedProject: any = "";
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

  loadPOs(vendor) {
    this.selectedMonth = "";
    this.loading = true;
    if (this.selectedVendor && this.selectedVendor.selected) {
      this.selectedVendor.selected = false;
    }
    this.selectedVendor = vendor;
    this.selectedVendor.selected = true;
    this.vendorFilters.vendor = vendor.name;

    var data = _.clone(this.data);
    this.pos = [];
    var self = this;
    // data = _.filter(data, function(d) { return d.building == self.selectedBuilding.name && d.vendor == vendor.name && d.yetToPay > 0 });
    if (self.selectedStatuses.length) {
      data = _.filter(data, function(d) { return d.building == self.selectedBuilding.name && d.vendor == vendor.name && self.selectedStatuses.indexOf(d.status) > -1 });
    } else {
      data = _.filter(data, function(d) { return d.building == self.selectedBuilding.name && d.vendor == vendor.name });
    }
    this.pos = _.orderBy(data, 'yetToPay', 'desc');
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

    // console.log("Buildingwise Payables :: sortBy : data : ", data);
    this[table] = data;
  }

  openedModal: any;
  projectsToAssign: any = [];
  openProjectAssignModal(item?) {
    console.log("openProjectAssignModal :: PO : ", item);
    this.currentPurchaseOrder = item;
    this.openedModal = this.dialogs.modal(this.assignModal, { size: 'md', backdrop: 'static' });
    var self = this;
    this.projectsToAssign = [];
    this.openedModal.result.then(function(project) {
      console.log("openProjectAssignModal :: project : ", project);
      if (project) {
        item.projectId = item.id;
        item.title = item.title;
      }
    }).catch(function(e) {
    })
     // buildingId: item.buildingId 
    this.purchasesService.listProjects({ filters: {} }).subscribe(res => {
      this.projectsToAssign = res['data'];
    })
  }

  currentPurchaseOrder: any;
  assignedProject: any;
  assignProject() {
    this.loading = true;
    this.purchasesService.savePurchaseOrder({ id: this.currentPurchaseOrder.id, projectId: this.assignedProject.id })
      .subscribe(res => {
        this.dialogs.success("PO is assigned to " + this.assignedProject.title);
        this.openedModal.close(this.assignedProject);
        this.assignedProject = null;
        this.currentPurchaseOrder = null;
        this.loading = false;
      })
  }


  unassignedPos: any = [];
  currentBuilding: any;
  title: any;
  openUnAssignedPOs(building?) {
    this.title = 'UnAssigned POs';
    this.currentBuilding = _.clone(building);
    this.unassignedPos = _.filter(this.data, function(d) { return d.buildingId == building.buildingId && !d.projectId })

    if (this.unassignedPos.length) {
      this.openedModal = this.dialogs.modal(this.unassignedPOsModal, { size: 'xlg', backdrop: 'static' });
    }
  }
  openRedPOs(building?) {
    this.title = 'POs raised before 30 days';
    this.currentBuilding = _.clone(building);
    this.unassignedPos = _.filter(this.data, function(d) { return d.buildingId == building.buildingId && !d.paidAmount && moment(d.date).isBefore(moment().add(-30, 'days')) })

    if (this.unassignedPos.length) {
      this.openedModal = this.dialogs.modal(this.statusChangePOsModal, { size: 'xlg', backdrop: 'static' });
    }
  }
  openYellowPOs(building?) {
    this.title = 'POs raised before 15 days';
    this.currentBuilding = _.clone(building);
    this.unassignedPos = _.filter(this.data, function(d) { return d.buildingId == building.buildingId && !d.paidAmount && moment(d.date).isAfter(moment().add(-30, 'days')) && moment(d.date).isBefore(moment().add(-15, 'days')) })

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

  buildingProjects: any = [];
  openBuildingProjects(building?) {
    this.currentBuilding = _.clone(building);
    var self = this;
    var buildingProjectIds = _.uniq(_.map(_.filter(self.data, function(d) { return d.buildingId == building.buildingId && d.projectId != null }), 'projectId'), 'projectId');

    this.buildingProjects = [];
    _.each(buildingProjectIds, function(id) {
      var projectsData = _.filter(self.data, function(d) { return d.projectId == id && d.buildingId == building.buildingId });
      var project: any = {
        id: projectsData[0].projectId,
        title: projectsData[0].title,
        projectStatus: projectsData[0].projectStatus,
        proposedDate: projectsData[0].proposedDate
      };
      project.pos = projectsData.length;
      project.total = Math.round(_.sumBy(projectsData, 'amount'));
      project.drafted = Math.round(_.sumBy(projectsData, 'draftAmount'));
      project.released = Math.round(_.sumBy(projectsData, 'releasedAmount'));
      project.approved = Math.round(_.sumBy(projectsData, 'approvedAmount'));
      project.paid = Math.round(_.sumBy(projectsData, 'paidAmount'));
      project.yetToPay = Math.round(_.sumBy(projectsData, 'yetToPay'));
      self.buildingProjects.push(project);
    })

    console.log("openBuildingProjects :: buildingProjects : ", this.buildingProjects);
    this.openedModal = this.dialogs.modal(this.buildingProjectsModal, { size: 'xlg', backdrop: 'static' });
    var self = this;
    this.openedModal.result.then(function(result) {
    }).catch(function(e) {
    })
  }

  markAsOpex(po) {
    this.purchasesService.savePurchaseOrder({ id: po.id, isOpex: !po.isOpex }).subscribe(res => {
      if (res['data']) {
        po.isOpex = !po.isOpex;
        this.dialogs.success("PO for " + po.vendor + " of " + this.currentBuilding.name + " is marked as OpEx");
      }
    })
  }
}
