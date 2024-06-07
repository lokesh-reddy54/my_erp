import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { debounceTime, take } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from "@angular/common/http";
import { DialogsService } from 'src/app/shared/services/dialogs.services';
import { DataLayerService } from 'src/app/shared/services/data-layer.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { SupportService } from 'src/app/shared/services/support.service';
import { AdminService } from 'src/app/shared/services/admin.service';
import { BookingsService } from 'src/app/shared/services/bookings.service';
import { UploadService } from 'src/app/shared/services/upload.service';

import { Helpers } from '../../../helpers';
import * as _ from 'lodash';
import * as moment from 'moment';
import * as $ from 'jquery';

@Component({
  selector: 'client-tickets-list',
  templateUrl: './list.component.html'
})
export class ClientTicketListComponent implements OnInit {
  searchControl: FormControl = new FormControl();
  ticket: any = {};
  @ViewChild('list') list: any;
  @ViewChild('newTicketModal') newTicketModal: any;

  ticketForm: FormGroup;

  items: any = [];
  selectedItem: any = {};
  loading: boolean = false;
  noResults: boolean = false;
  offset: number = 0;
  limit: number = 20;
  filter: any = {};
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
  setAside:any = 0;

  listObservable: Observable<any[]>;

  constructor(private route: ActivatedRoute, private dialogs: DialogsService, private service: SupportService, private uploadService: UploadService,
    private adminService: AdminService, private bookingsService: BookingsService, private commonService: CommonService) { }

  user: any;
  ngOnInit() {
    this.setAside = parseInt(this.route.snapshot.params['setAside']);
    // this.deskTypes = this.commonService.values.deskTypes;
    // this.ticketSources = this.commonService.values.ticketSources;
    var user = localStorage.getItem('cwo_user');
    if (user && user != '') {
      this.user = JSON.parse(user);
    }

    this.searchControl.valueChanges
      .pipe(debounceTime(200))
      .pipe(take(1)).subscribe(value => {
        this.filter.search = value;
      });

    this.ticketForm = new FormGroup({
      booking: new FormControl("", Validators.required),
      cabin: new FormControl(""),
      category: new FormControl("", Validators.required),
      subCategory: new FormControl("", Validators.required),
      context: new FormControl("", Validators.required),
      issue: new FormControl("", Validators.required),
      description: new FormControl("", Validators.required),
      attachment: new FormControl(""),
    });

    // this.newTicket();
  }

  openedModal: any;
  newTicket() {
    this.bookingsService.getBookings({ clientId: this.user.clientId }).pipe(take(1)).subscribe(
      res => {
        this.bookings = res['data'];
        if (this.bookings.length == 1) {
          this.selectedBooking = this.bookings[0];
        }
      }, error => {

      });

    this.service.getCategories().pipe(take(1)).subscribe(
      res => {
        this.categories = res['data'];
      }
    )

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

  noMoreResults: boolean = false;
  loadMore() {
    console.log("loadmore :: ");
    if (!this.loading && !this.noMoreResults) {
      this.filter.clientId = this.user.clientId;
      this.filter.setAside = this.setAside;
      this.loading = true;
      var data = { filters: this.filter, limit: this.limit, offset: this.offset };
      this.service.listTickets(data)
        .pipe(take(1)).subscribe((res) => {
          console.log("TicketList :: loadMore : res : ", res);
          if (res['data']) {
            this.items = this.items.concat(res['data']);
            this.loading = false;
            if (res['data'].length >= this.limit) {
              this.offset = this.offset + this.limit;
            } else {
              this.noMoreResults = true;
            }
          } else {
            this.dialogs.error(res['error'], "Error")
          }
        });
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

  resetList() {
    this.noMoreResults = false;
    this.items = [];
    this.offset = 0;
    this.limit = 20;
    this.loadMore();
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
