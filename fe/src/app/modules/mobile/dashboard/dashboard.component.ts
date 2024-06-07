import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EChartOption } from 'echarts';
import { Router, NavigationEnd } from '@angular/router';
import { echartStyles } from '../../../shared/echart-styles';
import * as _ from 'lodash';
import * as moment from 'moment';
import { Utils } from 'src/app/shared/utils';
import { debounceTime, take } from 'rxjs/operators';
import { Helpers } from "src/app/helpers";
import { ReportsService } from 'src/app/shared/services/reports.service';
import { BookingsService } from 'src/app/shared/services/bookings.service';
import { DialogsService } from 'src/app/shared/services/dialogs.services';
import { SupportService } from 'src/app/shared/services/support.service';
import { PurchasesService } from 'src/app/shared/services/purchases.service';
import { AccountsService } from 'src/app/shared/services/accounts.service';
import { AdminService } from 'src/app/shared/services/admin.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { UploadService } from 'src/app/shared/services/upload.service';
import { PgClientService } from 'src/app/shared/services/pgclient.service';

import { environment } from "src/environments/environment";

@Component({
  selector: 'app-dashboard-mobile',
  templateUrl: './dashboard.component.html'
})
export class MobileDashboardComponent implements OnInit {
  user: any;
  form: FormGroup;

  constructor(public router: Router, private service: ReportsService, private purchasesService: PurchasesService,
    private uploadService: UploadService, private accountsService: AccountsService, private adminService: AdminService,
    private pgService: PgClientService, private bookingsService: BookingsService, private authService: AuthService,
    private supportService: SupportService, private dialogs: DialogsService) {
    this.user = JSON.parse(localStorage.getItem("cwo_user"));
  }

  greetingText: any = "Good Morning";
  userRole: any = {};
  userRoleType: any = "admin";
  selectedBuilding: any;
  ngOnInit() {
    console.log("DashboardClientComponent :: onInit .. !!!");

    this.greetingText = Utils.getGreetingText();

    this.form = new FormGroup({
      billDate: new FormControl("", Validators.required),
      paymentType: new FormControl("", Validators.required),
      paymentMode: new FormControl(""),
      amount: new FormControl("", Validators.required)
    });

    this.authService.userRole.subscribe(role => {
      this.userRole = role;
      this.getWorkBenches();
    })

    this.authService.selectedBuilding.subscribe(building => {
      this.selectedBuilding = building;
      this.getWorkBenches();
    })

    this.loading = true;

    var self = this;
    setTimeout(function() {
      self.userRole = self.authService.userRoles[0];
      // console.log("mobile dashboard ::: userRoles :: ", self.authService.userRoles, self.userRole);
      self.getWorkBenches();
    }, 500);
  }

  clearBuilding() {
    this.selectedBuilding = null;
    this.authService.selectedBuilding.next(null);
  }
  loading: boolean = false;
  workbenches: any = {};

  getWorkBenches() {
    this.loading = true;
    var buildingIds = [];
    if (this.user && this.user.geoTags) {
      buildingIds = this.user.geoTags.buildingIds;
    }
    if (this.selectedBuilding) {
      buildingIds = [this.selectedBuilding.id];
    }
    var data: any = { userId: this.user.id, buildingIds: buildingIds, workbenches: [] }
    data.assignedTo = this.user.id;

    if (this.userRole.type == 'admin') {
      data.workbenches = ['deskBookings', 'resourceBookings', 'moveIns', 'exits', 'payIns',
        'payOuts', 'visits', 'support', 'renewals', 'purchaseCapex', 'bills'];
      delete data.assignedTo;
    } else if (this.userRole.type == 'buildingOps') {
      data.workbenches = ['deskBookings', 'moveIns', 'exits', 'payOuts', 'support', 'bills',
        'tenantsList', 'vendorsList', 'serviceProvidersList', 'ownerContacts', 'buildingContracts', 'buildingAmcs'];
    } else if (this.userRole.type == 'projects') {
      data.workbenches = ['purchaseCapex', 'vendorsList', 'bills', 'payOuts'];
    } else if (this.userRole.type == 'accounts') {
      data.workbenches = ['deskBookings', 'payIns', 'bills', 'payOuts', 'support'];
    } else if (this.userRole.type == 'support') {
      data.workbenches = ['support', 'ownerContacts', 'buildingAmcs'];
      if (this.user.managerRoles.indexOf("SUPPORT") > -1 || !this.user.roles) {
        delete data.assignedTo;
      }
    } else if (this.userRole.type == 'businessOps') {
      data.workbenches = ['deskBookings', 'resourceBookings', 'moveIns', 'exits', 'payIns'];
    }
    this.userRoleType = this.userRole.type;
    this.service.getWorkBenches(data).pipe(take(1)).subscribe(
      res => {
        if (res['data']) {
          this.workbenches = res['data'];
        }
        this.loading = false;
      }, error => {

      });

    this.poSelectedProject = null;
    this.woSelectedProject = null;
    this.milestoneSelectedProject = null;
  }

  updated: any = false;
  openedModal: any;
  actions: any = {};
  title: any;

  buildingContracts: any = [];
  selectedBuildingContract: any = [];
  @ViewChild('ownerContractTermsModal') ownerContractTermsModal: any;
  openBuildingContracts(title, buildingContracts, actions?) {
    this.actions = actions || {};
    this.title = title;
    this.buildingContracts = _.clone(buildingContracts);
    if (buildingContracts.length) {
      this.openedModal = this.dialogs.modal(this.ownerContractTermsModal, { size: 'xlg' });
      if (this.selectedBuilding) {
        this.filterBuildingContracts(this.selectedBuilding);
      }
    }
  }
  ownerAgreement: any;
  contractsSelectedBuilding: any;
  filterBuildingContracts(building) {
    var self = this;
    this.selectedBuildingContract = _.find(this.buildingContracts, function(t) {
      return t.id == building.id;
    });
    if (this.selectedBuildingContract) {
      this.contractTerms = this.selectedBuildingContract.terms;
      this.ownerAgreement = this.selectedBuildingContract.agreement;
    } else {
      this.contractTerms = [];
      this.ownerAgreement = null;
    }
    this.contractsSelectedBuilding = building;
  }

  amcs: any = [];
  buildingAmcs: any = [];
  @ViewChild('buildingAMCsModal') buildingAMCsModal: any;
  openBuildingAMCs(title, amcs, actions?) {
    this.actions = actions || {};
    this.title = title;
    this.amcs = _.clone(amcs);
    if (amcs.length) {
      this.openedModal = this.dialogs.modal(this.buildingAMCsModal, { size: 'xlg' });
      if (this.selectedBuilding) {
        this.filterBuildingAMCs(this.selectedBuilding);
      }
    }
  }
  amcsSelectedBuilding: any;
  filterBuildingAMCs(building) {
    var self = this;
    this.buildingAmcs = _.filter(this.amcs, function(t) {
      return t.buildingId == building.id;
    });
    this.amcsSelectedBuilding = building;
  }

  ownerContacts: any = [];
  buildingOwnerContacts: any = [];
  @ViewChild('ownerContactsModal') ownerContactsModal: any;
  openOwnerContacts(title, ownerContacts, actions?) {
    this.actions = actions || {};
    this.title = title;
    this.ownerContacts = _.clone(ownerContacts);
    if (ownerContacts.length) {
      this.openedModal = this.dialogs.modal(this.ownerContactsModal, { size: 'xlg' });
      if (this.selectedBuilding) {
        this.filterOwnerContacts(this.selectedBuilding);
      }
    }
  }
  ownerContactsSelectedBuilding: any;
  filterOwnerContacts(building) {
    var self = this;
    this.buildingOwnerContacts = _.filter(this.ownerContacts, function(t) {
      return t.buildingId == building.id;
    });
    this.ownerContactsSelectedBuilding = building;
  }

  tenantSearch: any = "";
  tenantsSearchControl: FormControl = new FormControl();
  tenants: any = [];
  buildingTenants: any = [];
  @ViewChild('tenantsModal') tenantsModal: any;
  openTenants(title, tenants, actions?) {
    this.actions = actions || {};
    this.title = title;
    this.tenants = _.clone(tenants);
    if (tenants.length) {
      this.openedModal = this.dialogs.modal(this.tenantsModal, { size: 'xlg' });
      if (this.selectedBuilding) {
        this.filterTenants(this.selectedBuilding);
      }
      this.tenantsSearchControl.valueChanges
        .pipe(debounceTime(200))
        .subscribe(value => {
          this.filterTenants(this.tenantsSelectedBuilding);
        });
    }
  }
  tenantsSelectedBuilding: any;
  filterTenants(building) {
    var self = this;
    this.buildingTenants = _.filter(this.tenants, function(t) {
      var flag = t.office && t.office.buildingId == building.id;
      if (flag && self.tenantSearch != "") {
        flag = t.client.company.toLowerCase().indexOf(self.tenantSearch) > -1
      }
      return flag;
    });
    this.tenantsSelectedBuilding = building;
  }

  vendorSearch: any = "";
  vendorsSearchControl: FormControl = new FormControl();
  vendors: any = [];
  buildingVendors: any = [];
  @ViewChild('vendorsModal') vendorsModal: any;
  openVendors(title, vendors, actions?) {
    this.actions = actions || {};
    this.title = title;
    this.vendors = _.clone(vendors);
    if (vendors.length) {
      this.openedModal = this.dialogs.modal(this.vendorsModal, { size: 'xlg' });
      if (this.selectedBuilding) {
        this.filterVendors(this.selectedBuilding);
      }
      this.vendorsSearchControl.valueChanges
        .pipe(debounceTime(200))
        .subscribe(value => {
          this.filterVendors(this.vendorsSelectedBuilding);
        });
    }
  }
  vendorsSelectedBuilding: any;
  filterVendors(building) {
    var self = this;
    this.buildingVendors = _.filter(this.vendors, function(t) {
      var flag = t.buildingId == building.id;
      if (flag && self.vendorSearch != '') {
        flag = (t.name.toLowerCase().indexOf(self.vendorSearch) > -1
          || (t.contactName && t.contactName.toLowerCase().indexOf(self.vendorSearch) > -1)
          || (t.skuTypes.length && t.skuTypes.join(", ").toLowerCase().indexOf(self.vendorSearch) > -1))
      }
      return flag;
    });
    this.vendorsSelectedBuilding = building;
  }

  providerSearch: any = "";
  providersSearchControl: FormControl = new FormControl();
  providers: any = [];
  buildingProviders: any = [];
  @ViewChild('providersModal') providersModal: any;
  openProviders(title, providers, actions?) {
    this.actions = actions || {};
    this.title = title;
    this.providers = _.clone(providers);
    if (providers.length) {
      this.openedModal = this.dialogs.modal(this.providersModal, { size: 'xlg' });
      if (this.selectedBuilding) {
        this.filterProviders(this.selectedBuilding);
      }

      this.providersSearchControl.valueChanges
        .pipe(debounceTime(200))
        .subscribe(value => {
          this.filterProviders(this.providersSelectedBuilding);
        });
    }
  }
  providersSelectedBuilding: any;
  filterProviders(building) {
    var self = this;
    this.buildingProviders = _.filter(this.providers, function(t) {
      var flag = t.buildingId == building.id;
      if (flag && self.providerSearch != "") {
        flag = (t.name.toLowerCase().indexOf(self.providerSearch) > -1
          || (t.contactName && t.contactName.toLowerCase().indexOf(self.providerSearch) > -1)
          || (t.category && t.category.join(", ").toLowerCase().indexOf(self.providerSearch) > -1))
      }
      return flag;
    });
    this.providersSelectedBuilding = building;
  }

  tickets: any = [];
  @ViewChild('ticketsModal') ticketsModal: any;
  openTickets(title, tickets, actions?) {
    this.actions = actions || {};
    this.updated = false;
    this.title = title;
    this.tickets = tickets;

    if (tickets.length) {
      this.openedModal = this.dialogs.modal(this.ticketsModal, { size: 'xlg' });
      var self = this;
      this.openedModal.result.then(function() {
        if (self.updated) self.getWorkBenches();
      })
    }
  }

  bookings: any = [];
  @ViewChild('bookingsModal') bookingsModal: any;
  openBookings(title, bookings, actions?) {
    this.title = title;
    this.bookings = bookings;
    this.actions = actions || {};
    this.updated = false;
    if (bookings.length) {
      this.openedModal = this.dialogs.modal(this.bookingsModal, { size: 'xlg' });
      var self = this;
      this.openedModal.result.then(function() {
        if (self.updated) self.getWorkBenches();
      })
    }

  }

  resourceBookings: any = [];
  @ViewChild('resourceBookingsModal') resourceBookingsModal: any;
  openResourceBookings(title, resourceBookings, actions?) {
    this.title = title;
    this.resourceBookings = resourceBookings;
    this.actions = actions || {};
    this.updated = false;
    if (resourceBookings.length) {
      this.openedModal = this.dialogs.modal(this.bookingsModal, { size: 'xlg' });
      var self = this;
      this.openedModal.result.then(function() {
        if (self.updated) self.getWorkBenches();
      })
    }

  }

  visits: any = [];
  @ViewChild('visitsModal') visitsModal: any;
  openVisits(title, visits, actions?) {
    this.title = title;
    this.visits = visits;
    this.actions = actions || {};
    this.updated = false;
    if (visits.length) {
      this.openedModal = this.dialogs.modal(this.visitsModal, { size: 'xlg' });
      var self = this;
      this.openedModal.result.then(function() {
        if (self.updated) self.getWorkBenches();
      })
    }

  }

  moveins: any = [];
  @ViewChild('moveinsModal') moveinsModal: any;
  openMoveIns(title, moveins, actions?) {
    this.title = title;
    this.moveins = moveins;
    this.actions = actions || {};
    this.updated = false;
    if (moveins.length) {
      this.openedModal = this.dialogs.modal(this.moveinsModal, { size: 'xlg' });
      var self = this;
      this.openedModal.result.then(function() {
        if (self.updated) self.getWorkBenches();
      })
    }
  }

  exits: any = [];
  @ViewChild('exitsModal') exitsModal: any;
  openExits(title, exits, actions?) {
    this.title = title;
    this.exits = exits;
    this.actions = actions || {};
    this.updated = false;
    if (exits.length) {
      this.openedModal = this.dialogs.modal(this.exitsModal, { size: 'xlg' });
      var self = this;
      this.openedModal.result.then(function() {
        if (self.updated) self.getWorkBenches();
      })
    }

  }

  renewals: any = [];
  @ViewChild('renewalsModal') renewalsModal: any;
  openRenewals(title, renewals, actions?) {
    this.title = title;
    this.renewals = renewals;
    this.actions = actions || {};
    this.updated = false;
    if (renewals.length) {
      this.openedModal = this.dialogs.modal(this.renewalsModal, { size: 'xlg' });
      var self = this;
      this.openedModal.result.then(function() {
        if (self.updated) self.getWorkBenches();
      })
    }
  }

  milestoneSearchControl: FormControl = new FormControl();
  projects: any = [];
  milestones: any = [];
  @ViewChild('milestonesModal') milestonesModal: any;
  openMilestones(title, milestones, actions?) {
    this.title = title;
    this.actions = actions || {};
    this.updated = false;
    this.milestones = milestones;
    if (milestones.length) {
      this.openedModal = this.dialogs.modal(this.milestonesModal, { size: 'xlg' });
      var self = this;
      this.openedModal.result.then(function() {
        if (self.updated) self.getWorkBenches();
      })
      var projects = _.uniqBy(this.milestones, function(m) { return m.purchaseOrder && m.purchaseOrder.project && m.purchaseOrder.project.title });
      this.projects = [];
      var self = this;
      _.each(projects, function(p) {
        self.projects.push(p.purchaseOrder.project)
      })

      this.milestoneSearchControl.valueChanges
        .pipe(debounceTime(200))
        .subscribe(value => {
          this.filterMilestones(this.milestoneSelectedProject);
        });
    }
  }
  milestoneSearch: any;
  projectMilestones: any = [];
  milestoneSelectedProject: any;
  filterMilestones(project) {
    var self = this;
    this.projectMilestones = _.filter(this.milestones, function(t) {
      var flag = t.purchaseOrder && t.purchaseOrder.project && t.purchaseOrder.project.title == project.title;
      if (flag && self.milestoneSearch) {
        flag = t.purchaseOrder.vendor.name.toLowerCase().indexOf(self.milestoneSearch.toLowerCase()) > -1
      }
      return flag;
      return
    });
    this.milestoneSelectedProject = project;
  }

  poSearchControl: FormControl = new FormControl();
  purchaseOrders: any = [];
  @ViewChild('purchaseOrdersModal') purchaseOrdersModal: any;
  openPurchaseOrders(title, purchaseOrders, actions?) {
    this.title = title;
    this.actions = actions || {};
    this.updated = false;
    this.purchaseOrders = purchaseOrders;
    if (purchaseOrders.length) {
      this.openedModal = this.dialogs.modal(this.purchaseOrdersModal, { size: 'xlg' });
      var self = this;
      this.openedModal.result.then(function() {
        if (self.updated) self.getWorkBenches();
      })
      var projects = _.uniqBy(this.purchaseOrders, function(m) { return m.project && m.project.title });
      this.projects = [];
      var self = this;
      _.each(projects, function(p) {
        self.projects.push(p.project)
      })

      this.poSearchControl.valueChanges
        .pipe(debounceTime(200))
        .subscribe(value => {
          this.filterPurchaseOrders(this.poSelectedProject);
        });
    }
  }

  poSearch: any;
  projectPurchaseOrders: any = [];
  poSelectedProject: any;
  filterPurchaseOrders(project) {
    var self = this;
    this.projectPurchaseOrders = _.filter(this.purchaseOrders, function(t) {
      var flag = t.project && t.project.title == project.title;
      if (flag && self.poSearch) {
        flag = t.vendor.name.toLowerCase().indexOf(self.poSearch.toLowerCase()) > -1
      }
      return flag;
    });
    this.poSelectedProject = project;
  }

  woSearch: any;
  woSearchControl: FormControl = new FormControl();
  workOrders: any = [];
  @ViewChild('workOrdersModal') workOrdersModal: any;
  openWorkOrders(title, workOrders, actions?) {
    this.title = title;
    this.actions = actions || {};
    this.updated = false;
    this.workOrders = workOrders;
    if (workOrders.length) {
      this.openedModal = this.dialogs.modal(this.workOrdersModal, { size: 'xlg' });
      var self = this;
      this.openedModal.result.then(function() {
        if (self.updated) self.getWorkBenches();
      })
      var projects = _.uniqBy(this.workOrders, function(m) { return m.project && m.project.title });
      this.projects = [];
      var self = this;
      _.each(projects, function(p) {
        self.projects.push(p.project)
      })

      this.woSearchControl.valueChanges
        .pipe(debounceTime(200))
        .subscribe(value => {
          this.filterWorkOrders(this.woSelectedProject);
        });
    }
  }
  projectWorkOrders: any = [];
  woSelectedProject: any;
  filterWorkOrders(project) {
    var self = this;
    this.projectWorkOrders = _.filter(this.workOrders, function(t) {
      var flag = t.project && t.project.title == project.title;
      if (flag && self.woSearch) {
        flag = t.vendor.name.toLowerCase().indexOf(self.woSearch.toLowerCase()) > -1
      }
      return flag;
    });
    this.woSelectedProject = project;
  }

  payins: any = [];
  @ViewChild('payinsModal') payinsModal: any;
  openPayins(title, payins, actions?) {
    this.title = title;
    this.actions = actions || {};
    this.updated = false;
    this.payins = payins;
    if (payins.length) {
      this.openedModal = this.dialogs.modal(this.payinsModal, { size: 'xlg' });
      var self = this;
      this.openedModal.result.then(function() {
        if (self.updated) self.getWorkBenches();
      })
    }
  }

  capexPayouts: any = [];
  @ViewChild('capexPayoutsModal') capexPayoutsModal: any;
  openCapexPayouts(title, capexPayouts, actions?) {
    this.title = title;
    this.actions = actions || {};
    this.updated = false;
    this.capexPayouts = capexPayouts;
    if (capexPayouts.length) {
      this.openedModal = this.dialogs.modal(this.capexPayoutsModal, { size: 'xlg' });
      var self = this;
      this.openedModal.result.then(function() {
        if (self.updated) self.getWorkBenches();
      })
    }
  }

  opexPayouts: any = [];
  @ViewChild('opexPayoutsModal') opexPayoutsModal: any;
  openOpexPayouts(title, opexPayouts, actions?) {
    this.title = title;
    this.actions = actions || {};
    this.updated = false;
    this.opexPayouts = opexPayouts;
    if (opexPayouts.length) {
      this.openedModal = this.dialogs.modal(this.opexPayoutsModal, { size: 'xlg' });
      var self = this;
      this.openedModal.result.then(function() {
        if (self.updated) self.getWorkBenches();
      })
    }
  }

  exitPayouts: any = [];
  @ViewChild('exitPayoutsModal') exitPayoutsModal: any;
  openExitPayouts(title, exitPayouts, actions?) {
    this.title = title;
    this.actions = actions || {};
    this.updated = false;
    this.exitPayouts = exitPayouts;
    if (exitPayouts.length) {
      this.openedModal = this.dialogs.modal(this.exitPayoutsModal, { size: 'xlg' });
      var self = this;
      this.openedModal.result.then(function() {
        if (self.updated) self.getWorkBenches();
      })
    }
  }


  messages: any = [];
  ticket: any;
  @ViewChild('messagesModal') messagesModal: any;
  viewMessage(item) {
    this.ticket = item;
    this.openedModal = this.dialogs.modal(this.messagesModal, { size: 'xlg' });
    this.supportService.getTicket(item.id).subscribe(res => {
      if (res['data']) {
        this.messages = res['data']['messages'];
      }
    })
  }

  @ViewChild('replyModal') replyModal: any;
  replyMessage(item?) {
    if (item) {
      this.ticket = item;
    }
    this.openedModal = this.dialogs.modal(this.replyModal, { size: 'xlg' });
  }

  submitMessage(reply) {
    var data = {
    }
    this.supportService.saveTicketMessage(data).subscribe(res => {

    })
  }

  processPayout(item) {
    var self = this;
    var name;
    if (item.purchaseOrder) {
      name = item.purchaseOrder.vendor.name;
    } else if (item.exitRequest) {
      name = item.exitRequest.booking.client.company;
    } else if (item.exitRequest) {
      name = item.opexBill.serviceProvider.name;
    }
    this.dialogs.confirm("Are you sure to Process Payment for " + name + " of Rs. " + item.amount + " .. ? ")
      .then(event => {
        if (event.value) {
          var data = {
            id: item.id,
            process: true
          }
          self.accountsService.processPayout(data)
            .pipe(take(1)).subscribe(res => {
              self.dialogs.success("Payout of Rs. " + item.amount + "  for '" + name + "' is processed successfully ");
              item.updated = true;
              self.updated = true;
            })
        }
      })
  }
  markMoveIn(booking) {
    var self = this;
    this.dialogs.confirm("Are you sure to mark " + booking.client.company + " as MovedIn .. ? ")
      .then(event => {
        if (event.value) {
          self.bookingsService.saveBooking({ id: booking.id, status: 'Active', onBoarded: true })
            .pipe(take(1)).subscribe(res => {
              booking.updated = true;
              self.updated = true;
              booking.status = 'Active';
              self.dialogs.success("Booking is OnBoarded successfully .. !!");
              self.bookingsService.saveSchedule({ bookingId: booking.id, status: 'Done' })
                .pipe(take(1)).subscribe(res => {
                })
            })
        }
      })
  }

  @ViewChild('contractsModal') contractsModal: any;
  contracts: any = [];
  viewContracts(booking) {
    this.loading = true;
    this.bookingsService.getContracts(booking.id)
      .subscribe(res => {
        this.contracts = res['data'];
        this.loading = false;
        this.openedModal = this.dialogs.modal(this.contractsModal, { size: 'xlg' });
      })
  }

  @ViewChild('bookingContractTermsModal') bookingContractTermsModal: any;
  contractTerms: any = [];
  viewContractTerms(terms) {
    this.contractTerms = terms;
    this.loading = false;
    this.openedModal = this.dialogs.modal(this.bookingContractTermsModal, { size: 'xlg' });
  }

  @ViewChild('exitProcessModal') exitProcessModal: any;
  exitRequest: any = {};
  booking: any = {};
  openExitProcess(booking) {
    this.loading = true;
    this.bookingsService.getBookingExitRequest(booking.id)
      .subscribe(res => {
        this.loading = false;
        if (res['data'] && res['data']['exitRequest']) {
          this.exitRequest = res['data']['exitRequest'];
          this.booking = booking;
          this.openedModal = this.dialogs.modal(this.exitProcessModal, { size: 'xlg' });
        }
      })
  }
  acrImageFile: any;
  acrImageFileChange(event) {
    this.acrImageFile = event.target.files[0];
  }
  acrImageUploadResponse: any = { status: '', message: '', filePath: '' };
  acrImageFileError: any;
  uploadAcrImageFile() {
    const formData = new FormData();
    formData.append('file', this.acrImageFile);

    this.loading = true;
    this.uploadService.upload(formData).subscribe(
      (res) => {
        this.acrImageUploadResponse = res;
        if (res.file) {
          this.loading = false;
          this.acrImageFile = null;
          this.newAcr.image = res.file;
        }
      },
      (err) => this.acrImageFileError = err
    );
  }
  newAcr: any;
  saveAcr() {
    this.loading = true;
    this.newAcr.exitRequestId = this.exitRequest.id;
    this.newAcr.status = "Published";
    this.bookingsService.saveAcr(this.newAcr)
      .subscribe(res => {
        this.loading = false;
        this.newAcr = null;
        this.exitRequest.acrs.push(res['data']);
      })
  }

  confirmBookingExit(booking) {
    var self = this;
    this.dialogs.confirm("Are you sure to proceed with Exit Process .?")
      .then((event) => {
        if (event.value) {
          self.loading = true;
          self.bookingsService.saveBooking({ id: self.booking.id, exited: true, status: 'Exited' })
            .pipe(take(1)).subscribe(res => {
              booking.updated = true;
              self.updated = true;
              self.dialogs.success("Booking is Exited successfully .. !!");
              self.bookingsService.saveSchedule({ bookingId: booking.id, status: 'Done' })
                .pipe(take(1)).subscribe(res => {
                  self.loading = false;
                  self.openedModal.close();
                })
            })
        }
      });
  }
  approveContract(booking) {
    var self = this;
    this.dialogs.confirm("Are you sure to Approve Contract of " + booking.client.company + " .. ? ")
      .then(event => {
        if (event.value) {
          var contract = {
            id: booking.contract.id,
            bookingId: booking.id,
            status: "Approved",
            approved: true,
          }
          self.bookingsService.saveContract(contract)
            .pipe(take(1)).subscribe(res => {
              booking.updated = true;
              self.updated = true;
              self.dialogs.success("Booking Contract is confirmed successfully .. !!");
            })
        }
      })
  }
  confirmContract(booking) {
    var self = this;
    this.dialogs.confirm("Are you sure to Confirm Contract of " + booking.client.company + " .. ? ")
      .then(event => {
        if (event.value) {
          var contract = {
            id: booking.contract.id,
            desks: booking.contract.desks,
            rent: booking.contract.rent,
            kind: booking.contract.kind,
            additionalRent: booking.contract.additionalRent,
            additionalDesks: booking.contract.additionalDesks,
            bookingId: booking.id,
            status: "Confirmed",
            confirmed: true,
            invoiceServiceType: "OfficeRent",
          }
          self.bookingsService.saveContract(contract)
            .pipe(take(1)).subscribe(res => {
              booking.updated = true;
              self.updated = true;
              self.dialogs.success("Booking Contract is confirmed successfully .. !!");
            })
        }
      })
  }

  changeTicketStatus(item, status) {
    var self = this;
    var data: any = {
      id: item.id,
      statusChange: true,
      status: status
    }
    if (status == 'Attended') {
      data.attended = moment().toDate();
    }
    if (status == 'Resolved') {
      data.resolved = moment().toDate();
    }
    if (status == 'Closed') {
      data.closed = moment().toDate();
    }
    this.dialogs.confirm("Are you sure to update ticket status .. ? ")
      .then(event => {
        if (event.value) {
          self.supportService.saveTicket(data).pipe(take(1)).subscribe(
            res => {
              self.dialogs.success("Ticket " + status + " successfully ");
              item.updated = true;
              self.updated = true;
            },
            error => {
              self.dialogs.error(error, 'Error while saving')
            }
          )
        }
      })
  }

  startPO(item) {
    var self = this;
    this.loading = true;
    var data: any = {
      id: item.id,
      status: 'Started',
      startedOn: new Date()
    }
    this.dialogs.confirm("Are you sure to update ticket status .. ? ")
      .then(event => {
        if (event.value) {
          console.log("PurchaseOrderViewComponent ::: savePurchaseItemStatus :: startPO : ", data);
          self.purchasesService.savePurchaseOrder(data).pipe(take(1)).subscribe(
            res => {
              self.dialogs.success("Purchase Order is marked as Started ");
              self.loading = false;
              self.updated = true;
              item.updated = true;
            },
            error => {
              self.dialogs.error(error, 'Error while saving')
            }
          )
        }
      })
  }

  releaseMilestone(item) {
    var self = this;
    var data: any = {
      id: item.id,
      status: 'Released'
    }
    this.loading = true;
    this.dialogs.confirm("Are you sure to release milestone for " + item.vendor.name + " .. ? ")
      .then(event => {
        if (event.value) {
          self.purchasesService.savePurchaseOrderMilestone(data).pipe(take(1)).subscribe(
            res => {
              if (res['data']) {
                self.loading = false;
                self.dialogs.success("MileStone payment is released for payment");
                item.updated = true;
                self.updated = true;
              } else if (res['error']) {
                self.dialogs.msg(res['error'], 'error');
              }
            })
        }
      })
  }

  approveMilestone(item) {
    var self = this;
    if (item.purchaseOrder && !item.purchaseOrder.proformaInvoiceId) {
      this.dialogs.msg("Please upload proforma invoice to make any of the payments", 'error');
      return;
    }
    var data: any = {
      id: item.id,
      status: 'Approved',
      approved: true
    }
    if (item.amount >= 1000000) {
      this.dialogs.msg("You cannot pay more than 10 lakhs at a time. Please reduce MileStone amount and try", 'error');
      return;
    }
    this.dialogs.confirm("Are you sure to approve milestone for " + item.vendor.name + " .. ? ")
      .then(event => {
        if (event.value) {
          self.loading = true;
          self.purchasesService.savePurchaseOrderMilestone(data).pipe(take(1)).subscribe(
            res => {
              if (res['data']) {
                self.loading = false;
                self.dialogs.success("MileStone payment is approved for payment");
                item.updated = true;
                self.updated = true;
              } else if (res['error']) {
                self.dialogs.msg(res['error'], 'error');
              }
            })
        }
      })
  }

  @ViewChild('billModal') billModal: any;
  @ViewChild('billDataModal') billDataModal: any;
  bill: any = {};
  newBill() {
    this.imageFile = null;
    this.bill = {}
    this.openedModal = this.dialogs.modal(this.billDataModal, { size: 'xlg' });
  }

  takePicture() {
    this.camera = true;
    this.openedModal = this.dialogs.modal(this.billModal, { size: 'xlg' });
    var self = this;
    setTimeout(function() {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        var constraints: any = {
          video: {
            facingMode: {
              exact: 'environment'
            }
          }
        };
        // constraints = { video: true };
        navigator.mediaDevices.getUserMedia(constraints).then(stream => {
          console.log("getUserMedia :: stream : ", stream);
          var video: any = document.getElementById("video");
          video.srcObject = stream;
          video.play();

          // var camera: any = document.getElementById("camera");
          // var canvas: any = document.getElementById("canvas");
          // canvas.width = camera.clientWidth;
          // canvas.height = camera.clientHeight;
        });
      }
    }, 100)
  }

  camera: any = true;
  imageFile: any;
  dataUrl: any;
  public captureBill() {
    var video: any = document.getElementById("video");
    var canvas: any = document.getElementById("canvas");
    var context = canvas.getContext("2d").drawImage(video, 0, 0, 640, 480);
    var dataUrl = canvas.toDataURL("image/jpeg");

    this.dataUrl = _.clone(dataUrl);
    dataUrl = dataUrl.replace("data:image/jpeg;base64,", "")
    var blob = this.dataURItoBlob(dataUrl);
    this.imageFile = new File([blob], new Date().getTime() + "_bill.jpeg", { type: 'image/jpeg' });
    console.log("captures :: imageFile ", this.imageFile);
    this.camera = false;
  }

  imageFileChange(event) {
    this.imageFile = event.target.files[0];
  }
  imageUploadResponse: any = { status: '', message: '', filePath: '' };
  imageFileError: any;

  uploadBill() {
    this.loading = true;
    const formData = new FormData();
    formData.append('file', this.imageFile, this.imageFile.name);
    this.uploadService.upload(formData).subscribe(res => {
      console.log("ImageUploading :: res : ", res);
      if (res.file) {
        this.loading = false;
        this.imageFile = res;
        this.bill.imageId = this.imageFile.id;
        if (!this.camera) {
          this.openedModal.close();
          this.camera = true;
        }
      }
    })
  }

  buildings: any = [];
  getPostingData() {
    var payment = this.bill;
    if (this.bill.billType == 'BuildingOpex') {
      this.adminService.listBuildings({ filters: { statuses: ['Live'] } })
        .pipe(take(1)).subscribe(res => {
          this.buildings = res['data'];
        })
    } else if (this.bill.billType == 'Capex') {
      this.purchasesService.listProjects({ filters: {} })
        .pipe(take(1)).subscribe(res => {
          this.projects = res['data'];
        })
    }
  }

  submitBill() {
    console.log("OpexBillsComponent ::: submitBill :: bill ", this.bill);
    this.loading = true;
    var self = this;
    var bill = _.clone(this.bill);
    if (bill.billDate) {
      bill.billDate = Utils.ngbDateToMoment(bill.billDate).format("YYYY-MM-DD");
    }
    if (bill.paymentType == 'PrePaid') {
      bill.paidOn = moment().format("YYYY-MM-DD");
    }
    if (bill.billType == 'HOOpex') {
      bill.buildingId = -1;
    }
    if (bill.project) {
      bill.projectId = bill.project.id;
      bill.buildingId = bill.project.buildingId;
    }
    if (bill.project) {
      bill.projectId = bill.project.id;
      bill.buildingId = bill.project.buildingId;
    }
    if (bill.imageId && bill.amount && bill.billDate) {
      bill.status = "New";
    }
    this.accountsService.saveBillsQueue(bill).pipe(take(1)).subscribe(
      res => {
        var msg = "Bill of Rs.'" + bill.amount + "' is saved successfully ";
        self.dialogs.success(msg);
        self.loading = false;
        self.bill = {};
        self.imageFile = null;
        this.form.reset();
        this.openedModal.close();
        this.getWorkBenches();
      }, error => {
        self.dialogs.error(error, 'Error while saving')
      }
    )
  }

  debitCardAccounts: any;
  pettyCashAccounts: any;
  getPaymentAccounts() {
    if (!this.debitCardAccounts) {
      this.adminService.listDebitCardAccounts({ filters: { active: 1 } }).subscribe(res => {
        this.debitCardAccounts = res['data'];
      })
    }
    if (!this.pettyCashAccounts) {
      this.adminService.listPettyCashAccounts({ filters: { active: 1 } }).subscribe(res => {
        this.pettyCashAccounts = res['data'];
      })
    }
  }

  dataURItoBlob(dataURI) {
    const byteString = window.atob(dataURI);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([int8Array], { type: 'image/png' });
    return blob;
  }

}