import { Component, OnInit, ViewChild } from '@angular/core';
import { ProductService } from 'src/app/shared/services/product.service';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { debounceTime, take } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HttpClient } from "@angular/common/http";
import { DialogsService } from 'src/app/shared/services/dialogs.services';
import { DataLayerService } from 'src/app/shared/services/data-layer.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { SupportService } from 'src/app/shared/services/support.service';
import { AdminService } from 'src/app/shared/services/admin.service';
import { BookingsService } from 'src/app/shared/services/bookings.service';
import { UploadService } from 'src/app/shared/services/upload.service';
import { ReportsService } from 'src/app/shared/services/reports.service';

import { Helpers } from '../../../helpers';
import * as _ from 'lodash';
import * as moment from 'moment';
import * as $ from 'jquery';

@Component({
  selector: 'tickets-list',
  templateUrl: './list.component.html'
})
export class TicketListComponent implements OnInit {
  searchControl: FormControl = new FormControl();
  ticket: any = {};
  @ViewChild('list') list: any;
  @ViewChild('newTicketModal') newTicketModal: any;
  @ViewChild('viewMessageModal') viewMessageModal: any;

  ticketForm: FormGroup;

  items: any = [];
  selectedItem: any = {};
  loading: boolean = false;
  noResults: boolean = false;
  offset: number = 0;
  limit: number = 20;
  filter: any = { excludeStatuses: [], statuses: ['New', 'Attended', 'AwaitingInternalReply', 'AwaitingClientReply'] };
  categories: any = [];

  countries: any = [];
  selectedCountry: any = {};
  cities: any = [];
  selectedCity: any = {};
  locations: any = [];
  selectedLocation: any = {};
  offices: any = [];
  selectedOffice: any = {};
  bookings: any = [];
  selectedBooking: any = {};
  cabins: any = [];
  selectedCabin: any = {};

  listObservable: Observable<any[]>;
  user: any;

  constructor(private dialogs: DialogsService, private service: SupportService, private uploadService: UploadService,
    private adminService: AdminService, private reportService: ReportsService, private bookingsService: BookingsService,
    private commonService: CommonService) {

    var user = localStorage.getItem("cwo_user");
    if (user && user != "") {
      this.user = JSON.parse(user);
    }
  }

  ngOnInit() {
    // this.deskTypes = this.commonService.values.deskTypes;
    // this.ticketSources = this.commonService.values.ticketSources;
    this.searchControl.valueChanges
      .pipe(debounceTime(200))
      .subscribe(value => {
        this.filter.search = value;
        this.resetList();
      });

    this.ticketForm = new FormGroup({
      booking: new FormControl("", Validators.required),
      cabin: new FormControl(""),
      // category: new FormControl("", Validators.required),
      // subCategory: new FormControl("", Validators.required),
      // context: new FormControl("", Validators.required),
      // issue: new FormControl(""),
      description: new FormControl(""),
      attachment: new FormControl(""),
    });

    // this.newTicket();

    this.adminService.listCountries({ filters: { active: 1 }, offset: 0, limit: 100 }).pipe(take(1)).subscribe(
      res => {
        this.countries = res['data'];
        this.selectedCountry = res['data'][0];
        this.onCountrySelected();
      });

    this.service.getCategories().pipe(take(1)).subscribe(
      res => {
        this.categories = res['data'];
      }
    )
  }
  onCountrySelected() {
    this.adminService.listCities({ filters: { countryId: this.selectedCountry.id, active: 1 }, offset: 0, limit: 100 }).pipe(take(1)).subscribe(
      res => {
        this.cities = res['data'];
        this.selectedCity = {};
        this.selectedLocation = {};
        this.selectedCity = res['data'][0];
        this.onCitySelected();
      });
  }
  onCitySelected() {
    this.adminService.listLocations({ filters: { cityId: this.selectedCity.id, active: 1 }, offset: 0, limit: 100 }).pipe(take(1)).subscribe(
      res => {
        this.locations = res['data'];
        this.selectedLocation = {};
        this.selectedLocation = res['data'][0];
        this.onLocationSelected();
      });
  }
  onLocationSelected() {
    this.adminService.listOffices({ filters: { locationId: this.selectedLocation.id }, offset: 0, limit: 100 }).pipe(take(1)).subscribe(
      res => {
        this.offices = res['data'].map((i) => { i.officeName = i.building.name + ' - ' + i.name; return i; });;
        this.loadBuildingTickets();
        this.getTicketsByStatus();
      }, error => {

      });
  }
  onOfficeSelected() {
    this.bookingsService.getBookings({ officeId: this.selectedOffice.id, locationId: this.selectedLocation.id }).pipe(take(1)).subscribe(
      res => {
        this.bookings = res['data'];
      }, error => {

      });
  }

  openedModal: any;
  newTicket() {
    var self = this;
    this.openedModal = this.dialogs.modal(this.newTicketModal, { size: 'lg' });
    this.openedModal.result.then(function() {
      self.ticket = {};
      self.loading = false;
      self.ticketForm.reset();
    }).catch(function(e) {
      self.ticket = {};
      self.loading = false;
      self.ticketForm.reset();
    })
  }

  isSupportManager() {
    return !this.user.roles || this.user.managerRoles && this.user.managerRoles.indexOf("SUPPORT") > -1
  }

  loadMore() {
    console.log("loadmore :: ");
    if (!this.loading && !this.noResults) {
      this.loading = true;
      if (!this.isSupportManager()) {
        //this.filter.assignedTo = this.user.id;
      }
      var data = { filters: this.filter, limit: this.limit, offset: this.offset };
      this.service.listTickets(data)
        .pipe(take(1)).subscribe((res) => {
          console.log("TicketList :: loadMore : res : ", res);
          if (res['data']) {
            var data = res['data'];
            _.each(data, function(d) {
              if (d.attended && moment(d.attended).isBefore(d.expectedAttended)) {
                d.attendedInTime = true;
              } else if (d.attended && moment(d.attended).isAfter(d.expectedAttended)) {
                d.attendedInTime = false;
              } else if (!d.attended && moment().isAfter(d.expectedAttended)) {
                d.attendedInTime = false;
              }
              if (d.resolved && moment(d.resolved).isBefore(d.expectedResolved)) {
                d.resolvedInTime = true;
              } else if (d.resolved && moment(d.resolved).isAfter(d.expectedResolved)) {
                d.resolvedInTime = false;
              } else if (!d.resolved && moment().isAfter(d.expectedResolved)) {
                d.resolvedInTime = false;
              }
              if (d.closed && moment(d.closed).isBefore(d.expectedClosed)) {
                d.closedInTime = true;
              } else if (d.closed && moment(d.closed).isAfter(d.expectedClosed)) {
                d.closedInTime = false;
              } else if (!d.closed && moment().isAfter(d.expectedClosed)) {
                d.resolvedInTime = false;
              }
            })
            this.items = this.items.concat(data);
            this.loading = false;
            if (res['data'].length >= this.limit) {
              this.offset = this.offset + this.limit;
            } else {
              this.noResults = true;
            }
          } else {
            this.dialogs.error(res['error'], "Error")
          }
        });
    }
  }

  message:any = {}
  openViewMessage(msg?) {
    this.message = msg;
    this.openedModal = this.dialogs.modal(this.viewMessageModal, { size: 'md' });

    if(this.user.id == this.message.userId){
      this.service.saveTicketMessage({read:1, ticketId: this.message.ticketId, id: this.message.id}).subscribe();
    }
  }

  saveTicket() {
    let self = this;
    this.loading = true;
    var ticket = _.clone(this.ticket);
    ticket.bookingId = this.selectedBooking.id;
    ticket.cabinId = this.ticket.cabin ? this.ticket.cabin.id : null;
    ticket.category = this.ticket.category.name;
    ticket.subCategory = this.ticket.subCategory.name;
    ticket.context = this.ticket.context.context;
    ticket.contextId = this.ticket.context.id;
    ticket.priorityId = this.ticket.context.priority.id;
    if (!ticket.attachments) {
      ticket.attachments = [];
    }
    ticket.attachments.push(this.ticket.attachment);

    this.service.saveTicket(ticket).pipe(take(1)).subscribe(
      res => {
        self.dialogs.success("Ticket for '" + ticket.context + "' is saved successfully ");
        self.loading = false;
        this.openedModal.dismiss();
        self.resetList();
      },
      error => {
        self.dialogs.error(error, 'Error while saving')
      }
    )
  }

  setAside(ticket) {
    var msg = "Are you sure to mark this ticket as RFC . ?";
    if (ticket.setAside) {
      msg = "Are you sure to mark this ticket as Issue . ?"
    }
    this.dialogs.confirm(msg)
      .then(event => {
        if (event.value) {
          var _ticket = {
            id: ticket.id,
            setAside: !ticket.setAside
          }
          this.service.saveTicket(_ticket).pipe(take(1)).subscribe(
            res => {
              this.dialogs.success("Ticket is set aside successfully ");
              this.loading = false;
              this.resetList();
            },
            error => {
              this.dialogs.error(error, 'Error while saving')
            }
          )
        }
      })
  }

  moreFilters: any = true;
  resetList() {
    this.items = [];
    this.offset = 0;
    this.limit = 20;
    this.noResults = false;
    this.loadMore();
    if (this.moreFilters) {
      this.loadBuildingTickets();
      this.getTicketsByStatus();
    }
  }

  selectBuilding(building) {
    if (building.id != this.selectedBuilding.id) {
      this.selectedBuilding = building;
      this.filter.buildingIds = [building.id];
    } else {
      this.selectedBuilding = {};
      this.filter.buildingIds = [];
    }
    this.resetList();
  }

  selectedBuilding: any = {};
  buildingTickets: any = [];
  ticketsByStatuses: any = [];
  loadBuildingTickets() {
    this.reportService.loadBuildingTickets({
      statuses: this.filter.statuses,
      setAside: this.filter.setAside,
      excludes: this.filter.excludeStatuses
    }).subscribe(res => {
      this.buildingTickets = res['data'];
    })
  }

  totalTicketsCount:any = 0;
  getTicketsByStatus() {
    this.reportService.getTicketsByStatus({
      statuses: this.filter.statuses,
      setAside: this.filter.setAside,
      excludes: this.filter.excludeStatuses,
      buildingIds: this.filter.buildingIds
    }).subscribe(res => {
      this.ticketsByStatuses = res['data'];
      this.totalTicketsCount = _.sumBy(this.ticketsByStatuses,'count');
    })
  }

  uploadResponse: any = { status: '', message: '', filePath: '' };
  fileError: any;
  onFileChange(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];

      const formData = new FormData();
      formData.append('file', file);

      this.uploadService.upload(formData).subscribe(
        (res) => this.uploadResponse = res,
        (err) => this.fileError = err
      );
    }
  }

  attachmentFile: any;
  attachmentFileChange(event) {
    this.attachmentFile = event.target.files[0];
  }
  attachmentUploadResponse: any = { status: '', message: '', filePath: '' };
  attachmentFileError: any;
  uploadAttachementFile() {
    const formData = new FormData();
    formData.append('file', this.attachmentFile);

    this.loading = true;
    this.uploadService.upload(formData).subscribe(
      (res) => {
        this.loading = false;
        this.attachmentUploadResponse = res;
        if (res.file) {
          this.ticket.attachment = res;
        }
      }, (err) => this.attachmentFileError = err
    );
  }
}
