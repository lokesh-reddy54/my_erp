import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EChartOption } from 'echarts';
import { Router, NavigationEnd } from '@angular/router';
import { echartStyles } from '../../../shared/echart-styles';
import * as _ from 'lodash';
import { Utils } from 'src/app/shared/utils';
import { debounceTime, take } from 'rxjs/operators';
import { Helpers } from "src/app/helpers";
import { ReportsService } from 'src/app/shared/services/reports.service';
import { BookingsService } from 'src/app/shared/services/bookings.service';
import { DialogsService } from 'src/app/shared/services/dialogs.services';
import { SupportService } from 'src/app/shared/services/support.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { UploadService } from 'src/app/shared/services/upload.service';
import { PgClientService } from 'src/app/shared/services/pgclient.service';

import { environment } from "src/environments/environment";

@Component({
  selector: 'app-dashboard-client',
  templateUrl: './dashboard-client.component.html'
})
export class ClientDashboardComponent implements OnInit {
  user: any;
  @ViewChild('newTicketModal') newTicketModal: any;
  @ViewChild('exitRequestModal') exitRequestModal: any;
  @ViewChild('paymentModal') paymentModal: any;

  ticketForm: FormGroup;
  exitForm: FormGroup;
  paymentForm: FormGroup;

  constructor(public router: Router, private service: ReportsService, private uploadService: UploadService,
    private pgService: PgClientService, private bookingsService: BookingsService, private authService: AuthService,
    private supportService: SupportService, private dialogs: DialogsService) {
    this.user = JSON.parse(localStorage.getItem("cwo_user"));
    if (!this.user.clientId) {
      this.router.navigateByUrl('/dashboards/main');
    }
  }

  greetingText: any = "Good Morning";
  ngOnInit() {
    console.log("DashboardClientComponent :: onInit .. !!!");
    this.getDashboard();

    this.greetingText = Utils.getGreetingText();

    this.exitForm = new FormGroup({
      exitDate: new FormControl("", Validators.required),
    });

    this.paymentForm = new FormGroup({
      date: new FormControl("", Validators.required),
      amount: new FormControl("", Validators.required),
      utr: new FormControl("", Validators.required)
    });
  }

  loading: boolean = false;
  myBookings: any = [];
  futureContracts: any = [];
  exits: any = [];
  employees: any = 0;
  pendingInvoices: any = [];
  thisMonthPayments: any = [];
  totalDue: any = 0;
  thisMonthPayment: any = 0;
  openedTickets: any = [];
  openedRfcs: any = [];
  todaysVisits: any = 0;
  activeBookings: any = 0;
  upcomingResourceBookings: any = [];
  availableCredits: any = 0;
  getDashboard() {
    this.loading = true;
    var data = { clientId: this.user.clientId }
    this.service.getClientDashboards(data).pipe(take(1)).subscribe(
      res => {
        if (res['data']) {
          var dashboards = res['data'];
          this.myBookings = dashboards.myBookings;
          this.authService.myBookings = this.myBookings;
          this.futureContracts = dashboards.futureContracts;
          this.exits = dashboards.exits;
          this.employees = dashboards.employees;
          this.todaysVisits = dashboards.todaysVisits;
          this.activeBookings = dashboards.myBookings.length;
          this.totalDue = _.sumBy(dashboards.pendingInvoices, 'due');
          this.thisMonthPayment = _.sumBy(dashboards.thisMonthPayments, 'amount');
          this.openedTickets = dashboards.openedTickets;
          this.openedRfcs = dashboards.openedRfcs;
          this.pendingInvoices = dashboards.pendingInvoices;
          this.thisMonthPayments = dashboards.thisMonthPayments;
          this.upcomingResourceBookings = dashboards.upcomingResourceBookings;
          this.availableCredits = dashboards.availableCredits;
        }
        this.loading = false;
      }, error => {

      });
  }

  viewBooking() {
    if (this.myBookings.length == 1) {
      this.router.navigateByUrl('/client/booking/' + this.myBookings[0].id);
    } else {
      this.router.navigateByUrl('/client/bookings');
    }
  }
  viewInvoices() {
    if (this.myBookings.length == 1) {
      this.router.navigateByUrl('/client/booking/' + this.myBookings[0].id + '/invoices');
    } else {
      this.router.navigateByUrl('/client/bookings');
    }
  }
  viewPayments() {
    if (this.myBookings.length == 1) {
      this.router.navigateByUrl('/client/booking/' + this.myBookings[0].id + '/payments');
    } else {
      this.router.navigateByUrl('/client/bookings');
    }
  }
  viewEmployees() {
    if (this.myBookings.length == 1) {
    this.router.navigateByUrl('/client/employees/' + this.myBookings[0].id);
    } else {
      this.router.navigateByUrl('/client/bookings');
    }
  }
  viewCredits() {
    if (this.myBookings.length == 1) {
      this.router.navigateByUrl('/client/credits/' + this.myBookings[0].id);
    } else {
      this.router.navigateByUrl('/client/bookings');
    }
  }

  newResourceBooking() {
    var self = this;
    var bookings = this.myBookings[0].id;
    if (this.myBookings.length > 1) {
      bookings = this.myBookings;
    }
    var dialog = this.dialogs.newResourceBooking(bookings, this.myBookings[0].officeId, null, {
      id: this.user.clientId, name: this.user.name,
      email: this.user.email, phone: this.user.phone, company: this.user.clientCompany,
      clientSide: true
    });
    dialog.result.then(function(data) {
      if (data && data.bookingId) {
        self.dialogs.success("New  Booking is successful .. !", "Resource Booking")
        self.upcomingResourceBookings.push(data);
      }
    })
  }

  onBookingSelected() {
    if (this.selectedBooking) {
      var bookingInvoices = _.filter(this.pendingInvoices, { bookingId: this.selectedBooking.id });
      this.paymentAmount = _.sumBy(bookingInvoices, 'due');
      this.selectedBooking.onlinePayment = Math.round(this.paymentAmount * (1 + (2.75 / 100)));
    }
  }

  payment: any = {};
  paymentAmount: any = 0;
  selectedBooking: any;
  openPaymentModal() {
    this.pgService.initialize(environment.test ? 'TEST' : 'PROD', Helpers.composeEnvUrl());
    if (this.myBookings.length == 1) {
      this.paymentAmount = this.totalDue;
      this.selectedBooking = this.myBookings[0];
      this.selectedBooking.onlinePayment = Math.round(this.paymentAmount * (1 + (2.75 / 100)));
    }
    this.openedModal = this.dialogs.modal(this.paymentModal, { size: 'lg' });
    var self = this;
    this.openedModal.result.then(function() {
      self.payment = {};
      self.paymentForm.reset();
      self.loading = false;
    }).catch(function(e) {
      self.payment = {};
      self.paymentForm.reset();
      self.loading = false;
    })
  }

  urn: any = {}
  urnSubmitted: any = false;
  saveUrnPayment() {
    this.loading = true;
    this.urn.status = "Submitted";
    this.bookingsService.saveUrnPayment(this.urn).pipe(take(1)).subscribe(
      res => {
        this.loading = false;
        this.urnSubmitted = true;
        this.selectedBooking.due = this.selectedBooking.due - this.urn.amount;
      })
  }

  payNow() {
    var self = this;
    this.loading = true;
    var data = {
      orderId: this.selectedBooking.refNo,
      bookingId: this.selectedBooking.id,
      currency: 'INR',
      amount: this.selectedBooking.onlinePayment,
      merchant: {
        name: this.selectedBooking.company.name,
        image: this.selectedBooking.company.logo
      },
      customer: {
        firstName: this.selectedBooking.client.name,
        lastName: '',
        phoneCountryCode: '+91',
        phone: this.selectedBooking.client.phone,
        email: this.selectedBooking.client.email
      }
    }
    this.pgService.makePaymentRequest(data).then(function(response) {
      console.log("handleSuccessfulPayment SuccessCallback ::: response :: ", response);
      self.loading = false;
    }).catch(function(err) {
      console.log("handleSuccessfulPayment SuccessCallback ::: error :: ", err);
      self.loading = false;
    })
    setTimeout(function() {
      self.openedModal.close()
    }, 5000);
  }

  booking: any;
  requestExit() {
    var data = this.exitForm.value;
    data.bookingId = this.booking.id;
    data.exitDate = Utils.ngbDateToDate(data.exitDate);
    var self = this;
    this.dialogs.confirm("Are you sure to Request Exit for this booking .. ?", "Exit Request")
      .then(result => {
        if (result.value) {
          self.loading = true;
          self.bookingsService.requestExit(data).pipe(take(1)).subscribe(
            res => {
              if (res['data']) {
                self.dialogs.success("Booking Exit Request is submitted successfully ");
                self.loading = false;
                self.openedModal.close();

                self.getDashboard();

              } else if (res['error']) {
                self.dialogs.error(res['error'])
              }
            },
            error => {
              self.dialogs.error(error, 'Error while saving')
            }
          )
        }
      })
  }
  cancelExitRequest(booking) {
    var self = this;
    this.dialogs.confirm("Are you sure to Cancel Request Exit for this booking .. ?", "Cqncel Exit Request")
      .then(result => {
        if (result.value) {
          self.loading = true;
          self.bookingsService.cancelExitRequest(booking.id).pipe(take(1)).subscribe(
            res => {
              if (res['data']) {
                self.dialogs.success("Booking Exit request is cancelled successfully ");
                self.loading = false;
                self.getDashboard();
              } else if (res['error']) {
                self.dialogs.error(res['error'])
              }
            },
            error => {
              self.dialogs.error(error, 'Error while saving')
            }
          )
        }
      })
  }

  openExitRequest(booking) {
    this.booking = booking;
    this.openedModal = this.dialogs.modal(this.exitRequestModal, { size: 'sm' });
    var self = this;
    this.openedModal.result.then(function() {
      self.loading = false;
      self.exitForm.reset();
    }).catch(function(e) {
      self.loading = false;
      self.exitForm.reset();
    })
  }


  openedModal: any;
  ticket: any = {};
  categories: any = [];
  raiseTicket() {
    if (this.myBookings.length == 1) {
      this.selectedBooking = this.myBookings[0];
    }
    this.supportService.getCategories().pipe(take(1)).subscribe(
      res => {
        this.categories = res['data'];
      }
    )

    var self = this;
    this.openedModal = this.dialogs.modal(this.newTicketModal, { size: 'lg' });
    this.openedModal.result.then(function() {
      self.ticket = {};
      self.loading = false;

    }).catch(function(e) {
      self.ticket = {};
      self.loading = false;
    })
  }

  saveTicket() {
    let self = this;
    this.loading = true;
    var ticket = _.clone(this.ticket);
    ticket.clientEmployeeId = this.user.id;
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

    this.supportService.saveTicket(ticket).pipe(take(1)).subscribe(
      res => {
        if (res['data']) {
          self.dialogs.success("Ticket for '" + ticket.context + "' is raised successfully ");
          self.loading = false;
          this.openedModal.dismiss();
          ticket.id = res['data'].id;
          ticket.status = 'New';
          this.openedTickets.push(ticket);

          ticket = res['data'];
          var message = "Your ticket will be attended in " + ticket.priority.attendIn + " " + ticket.priority.attendInType + " and expected to get resolved in " + ticket.priority.resolveIn + " " + ticket.priority.resolveInType;
          if (ticket.assigned) {
            message = "Your ticket is assigned to " + ticket.assigned.name + " and will be attended in " + ticket.priority.attendIn + " " + ticket.priority.attendInType + " and expected to get resolved in " + ticket.priority.resolveIn + " " + ticket.priority.resolveInType;
          }
          self.dialogs.msg(message, 'info', 20000);
        }
      },
      error => {
        self.dialogs.error(error, 'Error while saving')
      }
    )
  }

  uploadResponse: any = { status: '', message: '', filePath: '' };
  fileError: any;
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