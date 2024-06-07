import { Component, OnInit, ViewChild, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { debounceTime, take } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from "@angular/common/http";
import { DialogsService } from 'src/app/shared/services/dialogs.services';
import { DataLayerService } from 'src/app/shared/services/data-layer.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { BookingsService } from 'src/app/shared/services/bookings.service';
import { UploadService } from 'src/app/shared/services/upload.service';
import { AccountsService } from 'src/app/shared/services/accounts.service';
import { PgClientService } from 'src/app/shared/services/pgclient.service';
import { Helpers } from '../../../helpers';
import { Utils } from 'src/app/shared/utils';
import * as _ from 'lodash';
import * as moment from 'moment';
import { environment } from "src/environments/environment";

@Component({
  selector: 'client-booking-view',
  templateUrl: './booking.component.html'
})
export class BookingViewComponent implements OnInit, AfterViewInit {

  searchControl: FormControl = new FormControl();
  form: FormGroup;
  exitForm: FormGroup;
  invoiceForm: FormGroup;
  additionalInvoiceForm: FormGroup;
  employeeForm: FormGroup;
  paymentForm: FormGroup;
  acrForm: FormGroup;
  deductionForm: FormGroup;
  commentForm: FormGroup;
  contractForm: FormGroup;
  clientForm: FormGroup;
  mailsListConfig: any = {};
  mailsListFilter: any = {};

  id: any = 1;
  @ViewChild('tabset') tabset: any;
  @ViewChild('viewEmailModal') viewEmailModal: any;
  @ViewChild('invoiceModal') invoiceModal: any;
  @ViewChild('contractsHistoryModal') contractsHistoryModal: any;
  @ViewChild('paymentModal') paymentModal: any;
  @ViewChild('employeeModal') employeeModal: any;
  @ViewChild('paymentsListModal') paymentsListModal: any;
  @ViewChild('creditsHistoryModal') creditsHistoryModal: any;
  @ViewChild('expansionModal') expansionModal: any;
  @ViewChild('contractionModal') contractionModal: any;
  @ViewChild('contractModal') contractModal: any;
  @ViewChild('clientModal') clientModal: any;
  @ViewChild('additionalInvoicesModal') additionalInvoicesModal: any;

  booking: any = { client: {}, contract: {} };
  creditsHistory: any = {};
  deposit: any = 0;
  invoiceAmount: any = 0;
  paidAmount: any = 0;
  dueAmount: any = 0;
  extraAmount: any = 0;
  liabilityClearedAmount: any = 0;
  loading: boolean = false;

  viewObservable: Observable<any[]>;
  invoiceTypes: any = [];
  invoiceServices: any = [];
  paymentTypes: any = [];
  departments: any = [];
  contactPurposes: any = [];

  constructor(private ref: ChangeDetectorRef, private route: ActivatedRoute, private dialogs: DialogsService,
    private pgService: PgClientService, private uploadService: UploadService, private accountsService: AccountsService,
    private service: BookingsService, private commonService: CommonService) {
    this.invoiceTypes = this.commonService.values.invoiceTypes;
    this.paymentTypes = this.commonService.values.paymentTypes;
    this.departments = this.commonService.values.departments;
    this.contactPurposes = this.commonService.values.contactPurposes;
    this.id = this.route.snapshot.params['id'];
  }

  user: any = {};
  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem("cwo_user"));

    this.form = new FormGroup({
      name: new FormControl("", Validators.required),
      phone: new FormControl("", Validators.compose([
        Validators.required,
        Validators.pattern('^[6,7,8,9][0-9]{9}$')
      ])),
      email: new FormControl("", Validators.compose([
        Validators.required,
        Validators.email
      ])),
      username: new FormControl("", Validators.compose([
        Validators.maxLength(100),
        Validators.minLength(3),
        Validators.required
      ])),
      password: new FormControl("", Validators.compose([
        Validators.maxLength(20),
        Validators.minLength(3),
        Validators.required
      ]))
    });

    this.exitForm = new FormGroup({
      exitDate: new FormControl("", Validators.required),
    });

    this.invoiceForm = new FormGroup({
      type: new FormControl("", Validators.required),
      date: new FormControl("", Validators.required),
      dueDate: new FormControl("", Validators.required),
      amount: new FormControl("", Validators.required),
      description: new FormControl("", Validators.required),
    });
    this.additionalInvoiceForm = new FormGroup({
      invoiceServiceId: new FormControl("", Validators.required),
      amount: new FormControl("", Validators.required),
      item: new FormControl("", Validators.required),
    });

    this.paymentForm = new FormGroup({
      date: new FormControl("", Validators.required),
      amount: new FormControl("", Validators.required),
      utr: new FormControl("", Validators.required)
    });

    this.employeeForm = new FormGroup({
      name: new FormControl("", Validators.required),
      // department: new FormControl("", Validators.required),
      contactPurposes: new FormControl("", Validators.required),
      password: new FormControl(""),
      email: new FormControl("", Validators.compose([
        Validators.required,
        Validators.email
      ])),
      phone: new FormControl("", Validators.compose([
        Validators.required,
        Validators.pattern('^[6,7,8,9][0-9]{9}$')
      ]))
    });

    this.acrForm = new FormGroup({
      damage: new FormControl("", Validators.required),
      charge: new FormControl("", Validators.required),
    });

    this.deductionForm = new FormGroup({
      description: new FormControl("", Validators.required),
      charge: new FormControl("", Validators.required),
    });

    this.commentForm = new FormGroup({
      comment: new FormControl("", Validators.required)
    });

    this.contractForm = new FormGroup({
      security: new FormControl("", Validators.required),
      rent: new FormControl("", Validators.required),
      token: new FormControl("", Validators.required),
      lockin: new FormControl("", Validators.required),
      lockinPenaltyType: new FormControl("", Validators.required),
      lockInPenalty: new FormControl("", Validators.required),
      noticePeriod: new FormControl("", Validators.required),
      noticePeriodViolationType: new FormControl("", Validators.required),
      noticePeriodViolation: new FormControl("", Validators.required),
    });

    this.clientForm = new FormGroup({
      company: new FormControl("", Validators.required),
      name: new FormControl("", Validators.required),
      email: new FormControl("", Validators.required),
      phone: new FormControl("", Validators.required),
      address: new FormControl(""),
      gstNo: new FormControl(""),
      panNo: new FormControl(""),
      stateCode: new FormControl(""),
      website: new FormControl(""),
    });

    this.mailsListConfig = {
      columns: [
        { label: 'Subject', field: 'subject', type: 'text', styleClass: 'w-40', sortable: true },
        { label: 'Receivers', field: 'receivers', type: 'text', styleClass: 'w-30', sortable: true },
        { label: 'Status', field: 'status', type: 'text', styleClass: 'w-5', sortable: true },
        { label: 'Sent', field: 'date', type: 'dateTime', styleClass: 'w-10 text-center', sortable: true },
        { label: 'By', field: 'by', type: 'text', styleClass: 'w-10 text-center', sortable: true },
      ],
      actions: [
        { icon: 'i-Magnifi-Glass1', hint: 'View Mail', code: 'view', style: 'info' },
      ],
      options: {
        debounceDelay: 500,
        actionStyleClass: 'w-5 icons-td text-center',
      }
    }
    this.mailsListFilter = { id: this.id };

    this.getBooking();
  }

  ngAfterViewInit() {
    var tab = this.route.snapshot.params['tab'];
    if (tab) {
      this.tabset.select(tab);
    }
  }

  getBooking() {
    this.loading = true;
    this.service.getBooking(this.id).pipe(take(1)).subscribe(
      res => {
        this.booking = res['data'];
        this.loadInvoices();
        this.loadEmployees();
        this.loadResourceBookings();
        // this.newResourceBooking();

        this.getBookingCreditHistory(this.id);
        this.loading = false;
      },
      error => {
        this.dialogs.error(error, 'Error while saving')
      }
    )
  }

  invoices = [];
  invoiceGroups = [];
  loadInvoices() {
    console.log("loadInvoices :: ");
    this.service.getInvoices(this.id)
      .pipe(take(1)).subscribe(res => {
        this.invoices = res['data'];
        this.loading = false;
        this.deposit = _.sumBy(_.filter(this.invoices, function(i) { return i.isLiability == 1 && i.isCancelled == 0 && i.isLiabilityCleared == 0 }), "amount");
        this.invoiceAmount = _.sumBy(_.filter(this.invoices, function(i) { return i.isLiability == 0 && i.isCancelled == 0 }), "amount");
        this.liabilityClearedAmount = _.sumBy(_.filter(this.invoices, function(i) { return i.isLiabilityCleared == 1 && i.isCancelled == 0 }), "amount");
        this.dueAmount = _.sumBy(_.filter(this.invoices, function(i) { return i.isCancelled == 0 }), "due");

        this.invoiceGroups = _(this.invoices)
          .groupBy(x => moment(x.date, 'YYYY-MM-DD').format('MMM, YYYY'))
          .map((value, key) => ({ name: key, invoices: value }))
          .value();
        console.log("Invoice Groups : ", this.invoiceGroups);
        this.loadPayments();
      });
  }

  paymentsList = [];
  paymentGroups = [];
  liabilityPaid: any = false;
  toRefund: any = 0;
  loadPayments() {
    console.log("loadPayments :: ");
    this.service.getPayments(this.id)
      .pipe(take(1)).subscribe(res => {
        this.paymentsList = res['data'];
        this.loading = false;
        this.paidAmount = _.sumBy(this.paymentsList, "amount");
        if (this.deposit && this.paidAmount > this.deposit) {
          this.liabilityPaid = true;
          this.paidAmount = this.paidAmount - this.deposit;
        }
        this.extraAmount = this.paidAmount - this.invoiceAmount;
        if (this.liabilityClearedAmount > 0 && this.paidAmount > this.invoiceAmount) {
          this.toRefund = this.paidAmount - this.invoiceAmount;
        }

        this.paymentGroups = _(this.paymentsList)
          .groupBy(x => moment(x.date, 'YYYY-MM-DD').format('MMM, YYYY'))
          .map((value, key) => ({ name: key, payments: value }))
          .value();
        console.log("paymentGroups Groups : ", this.paymentGroups);

        if (this.booking.exitRequest && (!this.booking.exitRequest.fcpStatus || this.booking.exitRequest.fcpStatus == 'Rejected')) {
          this.calculateExitCharges();
        }
      });
  }

  employees = [];
  loadEmployees() {
    console.log("loadEmployees :: ");
    this.service.getEmployees(this.booking.clientId)
      .pipe(take(1)).subscribe(res => {
        this.employees = res['data'];
        this.loading = false;
      });
  }

  resourceBookings = [];
  loadResourceBookings() {
    console.log("loadResourceBookings :: ");
    this.loading = true;
    this.service.getResourceBookings(this.id)
      .pipe(take(1)).subscribe(res => {
        this.resourceBookings = res['data'];
        this.loading = false;
      });
  }

  cancelBooking() {
    var self = this;
    this.dialogs.confirm("Are you sure to Cancel this booking for '" + this.booking.client.company + "' ?")
      .then(event => {
        if (event.value) {
          self.loading = true;
          self.service.cancelBooking(self.id).pipe(take(1)).subscribe(
            res => {
              if (res['data']) {
                self.dialogs.success("Booking is cancelled successfully ");
                self.getBooking();
              } else if (res['error']) {
                self.dialogs.error(res['error'])
              }
              self.loading = false;
            },
            error => {
              self.dialogs.error(error, 'Error while saving')
            }
          )
        }
      })
  }
  showExitForm: any = false;
  requestExit() {
    this.loading = true;
    var data = this.exitForm.value;
    data.bookingId = this.id;
    data.exitDate = Utils.ngbDateToDate(data.exitDate);
    this.service.requestExit(data).pipe(take(1)).subscribe(
      res => {
        if (res['data']) {
          this.dialogs.success("Booking Exit Request is submitted successfully ");
          this.loading = false;
          this.showExitForm = false;
          this.getBooking();
        } else if (res['error']) {
          this.dialogs.error(res['error'])
        }
      },
      error => {
        this.dialogs.error(error, 'Error while saving')
      }
    )
  }
  cancelExitRequest() {
    this.loading = true;
    this.service.cancelExitRequest(this.id).pipe(take(1)).subscribe(
      res => {
        if (res['data']) {
          this.dialogs.success("Booking Exit request is cancelled successfully ");
          this.loading = false;
          this.getBooking();
        } else if (res['error']) {
          this.dialogs.error(res['error'])
        }
      },
      error => {
        this.dialogs.error(error, 'Error while saving')
      }
    )
  }

  openedModal: any;
  contract: any = {};
  editContract(contract?) {
    this.contract = _.clone(contract || this.booking.contract);
    this.openedModal = this.dialogs.modal(this.contractModal, { size: 'lg' });
    var self = this;
    this.openedModal.result.then(function() {
      self.contract = {};
      self.loading = false;
      self.contractForm.reset();
    }).catch(function(e) {
      self.contract = {};
      self.loading = false;
      self.contractForm.reset();
    })
  }
  confirmContract() {
    var self = this;
    this.dialogs.confirm("Are you sure to Confirm Contract for this Booking .. ?", "Confirm Contract")
      .then(function(event) {
        if (event.value) {
          self.saveContract(true);
        }
      })
  }
  approveContract() {
    this.contract.status = 'Approved';
    this.saveContract(false);
  }
  saveContract(confirm?) {
    let self = this;
    this.loading = true;
    var contract = _.clone(this.contract);
    if (confirm) {
      contract.status = "Confirmed";
      contract.confirmed = true;
    }
    if (contract.kind == 'ReLocation') {
      contract.additionalRent = contract.rent;
    } else if (contract.kind == 'Expansion') {
      contract.additionalRent = contract.rent - this.booking.contract.rent;
    } else if (contract.kind == "Contraction") {
      contract.additionalRent = contract.rent - this.booking.contract.rent;
    }
    contract.invoiceServiceType = "OfficeRent";
    contract.bookingId = this.booking.id;
    this.service.saveContract(contract).pipe(take(1)).subscribe(
      res => {
        if (!confirm) {
          self.dialogs.success("Contract is updated successfully ");
        } else {
          self.dialogs.success("Contract is confirmed successfully ");
        }
        self.loading = false;
        this.openedModal.dismiss();
        self.getBooking();
      },
      error => {
        self.dialogs.error(error, 'Error while saving')
      }
    )
  }
  saveAdditionalInvoice(item?) {
    let self = this;
    this.loading = true;
    var additionalInvoice = _.clone(item || this.additionalInvoice);
    additionalInvoice.contractId = this.contract.id;
    if (additionalInvoice.invoiceService) {
      additionalInvoice.invoiceServiceId = additionalInvoice.invoiceService.id;
    }
    this.service.saveAdditionalInvoice(additionalInvoice).pipe(take(1)).subscribe(
      res => {
        self.loading = false;
        if (res['data']) {
          additionalInvoice = res['data'];
          if (this.additionalInvoice) {
            additionalInvoice.invoiceService = this.additionalInvoice.invoiceService;
          }
          if (!additionalInvoice.id) {
            self.dialogs.success("Contract Additional Invoice is added successfully ");
            this.contract.additionalInvoices.push(additionalInvoice);
          } else {
            self.dialogs.success("Contract Additional Invoice is updated successfully ");
            this.contract.additionalInvoices = _.reject(this.contract.additionalInvoices, { id: additionalInvoice.id });
            if (additionalInvoice.status == 'Published') {
              this.contract.additionalInvoices.push(additionalInvoice);
            }
          }
          this.additionalInvoice = null;
        } else {
          this.dialogs.error(res['error']);
        }
      },
      error => {
        self.dialogs.error(error, 'Error while saving')
      }
    )
  }
  cancelContract(contract) {
    let self = this;
    contract = _.clone(contract);
    contract.cancelled = true;
    this.dialogs.confirm("Are you sure to Confirm " + contract.kind + " Contract for this Booking .. ?", "Cancel " + contract.kind + " Contract")
      .then(function(event) {
        if (event.value) {
          self.loading = true;
          self.service.saveContract(contract).pipe(take(1)).subscribe(
            res => {
              if (res['data']) {
                self.dialogs.success(contract.kind + " Contract is cancelled successfully ");
                self.loading = false;
                self.getBooking();
              } else if (res['error']) {
                self.dialogs.error(res['error'])
              }
              self.loading = false;
            },
            error => {
              self.dialogs.error(error, 'Error while saving')
            }
          )
        }
      })
  }
  invoice: any = {};
  openInvoiceModal() {
    this.openedModal = this.dialogs.modal(this.invoiceModal, { size: 'md' });
    var self = this;
    this.accountsService.listInvoiceServices({ filters: { status: 'Published' }, limit: 100 })
      .pipe(take(1)).subscribe((res) => {
        if (res['data']) {
          this.invoiceServices = res['data'];
        } else {
          this.dialogs.error(res['error']);
        }
        this.loading = false;
      })
    this.openedModal.result.then(function() {
      self.invoice = {};
      self.loading = false;
      self.invoiceForm.reset();
    }).catch(function(e) {
      self.invoice = {};
      self.loading = false;
      self.invoiceForm.reset();
    })
  }
  additionalInvoice: any;
  openAdditionalInvoices(contract) {
    this.contract = contract;
    this.openedModal = this.dialogs.modal(this.additionalInvoicesModal, { size: 'lg' });
    var self = this;
    this.accountsService.listInvoiceServices({ filters: { status: 'Published' }, limit: 100 })
      .pipe(take(1)).subscribe((res) => {
        if (res['data']) {
          this.invoiceServices = res['data'];
        } else {
          this.dialogs.error(res['error']);
        }
        this.loading = false;
      })
    this.openedModal.result.then(function() {
      self.loading = false;
    }).catch(function(e) {
      self.loading = false;
    })
  }
  updateInvoiceName() {
    if (this.invoice.type && this.invoice.date) {
      if (this.invoice.type.monthly) {
        this.invoice.name = this.invoice.type.name + " for " + moment(this.invoice.date).format("MMM YYYY");
      } else {
        this.invoice.name = this.invoice.type.name;
      }
    }
  }
  saveInvoice() {
    let self = this;
    this.loading = true;
    var invoice = _.clone(this.invoice);
    invoice.bookingId = this.id;
    invoice.date = Utils.ngbDateToMoment(this.invoice.date).add(9, 'hours').toDate();
    invoice.dueDate = Utils.ngbDateToMoment(this.invoice.dueDate).add(9, 'hours').toDate();
    invoice.startDate = Utils.ngbDateToMoment(this.invoice.date).startOf('month').add(9, 'hours').toDate();
    invoice.endDate = Utils.ngbDateToMoment(this.invoice.date).endOf('month').add(9, 'hours').toDate();
    invoice.type = this.invoice.invoiceService.type;
    invoice.name = this.invoice.invoiceService.name;
    invoice.invoiceServiceId = this.invoice.invoiceService.id;
    invoice.isLiability = this.invoice.invoiceService.isLiability;
    this.service.saveInvoice(invoice).pipe(take(1)).subscribe(
      res => {
        self.dialogs.success("Invoice '" + invoice.name + "' saved successfully ");
        self.loading = false;
        this.openedModal.dismiss();
        self.loadInvoices();
      },
      error => {
        self.dialogs.error(error, 'Error while saving')
      }
    )
  }
  payment: any = {};
  paymentAmount: any = 0;
  openPaymentModal(invoice?) {
    this.pgService.initialize(environment.test ? 'TEST' : 'PROD', Helpers.composeEnvUrl());
    if (invoice) {
      this.paymentAmount = invoice.amount;
    } else {
      this.paymentAmount = this.dueAmount;
    }
    this.booking.onlinePayment = Math.round(this.paymentAmount * (1 + (2.75 / 100)));
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
  savePayment() {
    let self = this;
    this.loading = true;
    var payment = _.clone(this.payment);
    payment.bookingId = this.id;
    payment.date = Utils.ngbDateToDate(this.payment.date);
    payment.type = this.payment.type.type;
    this.service.savePayment(payment).pipe(take(1)).subscribe(
      res => {
        self.dialogs.success("Payment is saved successfully ");
        self.loading = false;
        this.openedModal.dismiss();
        this.loadInvoices();
      },
      error => {
        self.dialogs.error(error, 'Error while saving')
      }
    )
  }
  employee: any = {};

  openEmployeeModal(employee?) {
    if (employee) {
      this.employee = _.clone(employee);
    }
    if (this.employee && this.employee.contactPurposes) {
      this.employee.contactPurposes = this.employee.contactPurposes.split(", ");
    }
    this.openedModal = this.dialogs.modal(this.employeeModal, { size: 'md' });
    var self = this;
    this.openedModal.result.then(function() {
      self.employee = {};
      self.loading = false;
      self.employeeForm.reset();
    }).catch(function(e) {
      self.employee = {};
      self.loading = false;
      self.invoiceForm.reset();
    })
  }
  saveEmployee() {
    let self = this;
    this.loading = true;
    var employee = _.clone(this.employee);
    employee.clientId = this.booking.clientId;
    // employee.department = this.employee.department.department;
    employee.contactPurposes = _.map(this.employee.contactPurposes, "type").join(", ");
    this.service.saveEmployee(employee).pipe(take(1)).subscribe(
      res => {
        self.dialogs.success("Employee is saved successfully ");
        self.loading = false;
        this.openedModal.dismiss();
        this.loadEmployees();
      },
      error => {
        self.dialogs.error(error, 'Error while saving')
      }
    )
  }
  openPaymentsList() {
    this.openedModal = this.dialogs.modal(this.paymentsListModal, { size: 'lg' });
    this.openedModal.result.then(function() {
    }).catch(function(e) {
    })
  }
  raiseInvoices() {
    this.loading = true;
    this.service.raiseInvoices({ bookingId: this.booking.id }).pipe(take(1)).subscribe(
      res => {
        if (res['data'] != null) {
          if (res['data'] > 0) {
            this.dialogs.success("Invoice is sent to client mail successfully ");
            this.loadInvoices();
          } else {
            this.dialogs.info("No invoices are pending to raise. ");
          }
        } else if (res['error']) {
          this.dialogs.error(res['error'])
        }
        this.loading = false;
      },
      error => {
        this.loading = false;
        this.dialogs.error(error, 'Error while saving')
      }
    )
  }
  isCancellable(item) {
    return item.status != "Cancelled";
  }
  updateBookingsLedger() {
    this.loading = true;
    this.service.updateBookingsLedger({ bookingIds: [parseInt(this.id)] }).pipe(take(1)).subscribe(
      res => {
        this.getBooking();
      },
      error => {
        this.loading = false;
        this.dialogs.error(error, 'Error while saving')
      }
    )
  }
  generateAgreement() {
    this.loading = true;
    this.service.generateAgreement(this.id).pipe(take(1)).subscribe(
      res => {
        if (res['data']) {
          this.dialogs.success("Agreement generated successfully .. !");
          this.getBooking();
        } else if (res['error']) {
          this.dialogs.error(res['error'])
        }
        this.loading = false;
      },
      error => {
        this.loading = false;
        this.dialogs.error(error, 'Error while saving')
      }
    )
  }
  sendInvoice(item: any) {
    this.loading = true;
    this.service.sendInvoice(item.id).pipe(take(1)).subscribe(
      res => {
        if (res['data']) {
          this.dialogs.success("Invoice is sent to client mail successfully ");
        } else if (res['error']) {
          this.dialogs.error(res['error'])
        }
        this.loading = false;
      },
      error => {
        this.loading = false;
        this.dialogs.error(error, 'Error while saving')
      }
    )
  }
  cancelInvoice(item: any) {
    if (moment(item.date).isBefore(moment().startOf('month'))) {
      this.dialogs.error("Cant cancel this invoice as this is previous months invoice");
      return;
    }
    this.loading = true;
    this.service.cancelInvoice(item.id).pipe(take(1)).subscribe(
      res => {
        if (res['data']) {
          this.dialogs.success("Invoice is cancelled successfully ");
          this.loading = false;
          this.loadInvoices();
        } else if (res['error']) {
          this.dialogs.error(res['error'])
        }
      },
      error => {
        this.dialogs.error(error, 'Error while saving')
      }
    )
  }
  refundLiability(item: any) {
    var self = this;
    this.dialogs.confirm("Are you sure to refund " + item.name + " of amount Rs." + item.amount + " .. ?")
      .then(event => {
        if (event.value) {
          self.loading = true;
          self.service.refundLiability(item).pipe(take(1)).subscribe(
            res => {
              if (res['data']) {
                self.dialogs.success("Refund of amount Rs." + item.amount + " processed for payment .");
                self.loading = false;
                self.loadInvoices();
              } else if (res['error']) {
                self.dialogs.error(res['error'])
              }
            },
            error => {
              self.dialogs.error(error, 'Error while saving')
            }
          )
        }
      }).catch(err => {
      })
  }
  editInvoice(item) {
    if (moment(item.date).isBefore(moment().startOf('month'))) {
      this.dialogs.error("Cant edit this invoice as this is previous months invoice");
      return;
    }
    this.invoice = _.clone(item);
    this.invoice.date = {
      year: moment(item.date).year(),
      month: moment(item.date).month() + 1,
      day: moment(item.date).date()
    }
    this.invoice.dueDate = {
      year: moment(item.dueDate).year(),
      month: moment(item.dueDate).month() + 1,
      day: moment(item.dueDate).date()
    }
    this.openedModal = this.dialogs.modal(this.invoiceModal, { size: 'md' });
    var self = this;
    this.openedModal.result.then(function() {
      self.invoice = {};
      self.loading = false;
      self.invoiceForm.reset();
    }).catch(function(e) {
      self.invoice = {};
      self.loading = false;
      self.invoiceForm.reset();
    })
  }
  save() {
    console.log("UsersComponent ::: save :: user ");
    this.loading = true;
    var self = this;
    setTimeout(function() {
      self.loading = false;
      self.dialogs.success('Toastr success!', 'Toastr title');
    }, 5000);
  }
  getDepartment(department) {
    return _.find(this.departments, { department: department }).name;
  }
  newResourceBooking() {
    var self = this;
    var dialog = this.dialogs.newResourceBooking(this.id, this.booking.officeId, this.booking.locationId, this.booking.client);
    dialog.result.then(function(data) {
      if (data && data.id) {
        self.dialogs.success("New resource booking is successful .. !", data.name)
        self.resourceBookings = [];
        self.loadResourceBookings();
        self.getBooking();
        self.creditsHistory = {};
      }
    })
  }
  getBookingCreditHistory(id) {
    this.loading = true;
    this.service.getBookingCreditHistory(id)
      .pipe(take(1)).subscribe(res => {
        this.creditsHistory = res['data'];
        this.loading = false;
      });
  }
  openCreditsHistory() {
    if (!this.creditsHistory.validCredits) {
      this.creditsHistory = {};
      this.getBookingCreditHistory(this.id);
    }
    var self = this;
    this.openedModal = this.dialogs.modal(this.creditsHistoryModal, { size: 'xlg' });
    this.openedModal.result.then(function() {
    }).catch(function(e) {
    })
  }
  creditEntry = {}
  showEntryForm = false;
  saveCreditEntry() {
    let self = this;
    this.loading = true;
    var creditEntry = _.clone(this.creditEntry);
    creditEntry.bookingId = this.id;
    this.service.saveCreditEntry(creditEntry).pipe(take(1)).subscribe(
      res => {
        self.dialogs.success("CreditEntry is saved successfully ");
        self.loading = false;
        this.showEntryForm = false;
        this.getBookingCreditHistory(this.id);
      },
      error => {
        self.dialogs.error(error, 'Error while saving')
      }
    )
  }
  deleteCreditEntry(entry) {
    let self = this;
    this.loading = true;
    this.service.deleteCreditEntry(entry.id).pipe(take(1)).subscribe(
      res => {
        self.dialogs.success("CreditEntry is deleted successfully ");
        self.loading = false;
        this.getBookingCreditHistory(this.id);
      },
      error => {
        self.dialogs.error(error, 'Error while saving')
      }
    )
  }
  exitCalculations: any = { earlyExitCharge: { charge: 0 }, noticePeriodPenality: { charge: 0 } }
  calculateExitCharges() {
    var requestedDate = moment(this.booking.exitRequest.requestedDate);
    var exitDate = moment(this.booking.exitRequest.exitDate);
    var startedDate = moment(this.booking.started);
    var requestedBeforeDays = exitDate.diff(requestedDate, 'days') + 1;
    var stayDuration = exitDate.diff(startedDate, 'days');
    this.exitCalculations.requestedBeforeDays = requestedBeforeDays;
    this.exitCalculations.stayDuration = stayDuration;
    this.exitCalculations.noticePeriodPenality.requestedBeforeDays = requestedBeforeDays;
    this.exitCalculations.noticePeriodPenality.stayDuration = stayDuration;
    this.exitCalculations.noticePeriodPenality.noticePeriod = (this.booking.contract.noticePeriod * 30) + " days";
    if (this.booking.contract.noticePeriod * 30 > requestedBeforeDays) {
      this.exitCalculations.noticePeriodPenality.statement = "Notice Period penality will apply as exit is requested before agreed NoticePeriod of " + (this.booking.contract.noticePeriod * 30) + " days as per contract."
      this.exitCalculations.noticePeriodPenality.period = (this.booking.contract.noticePeriod * 30) + " days";
      var charge: any = 0;
      if (this.booking.contract.noticePeriodViolationType == "Fixed") {
        this.exitCalculations.noticePeriodPenality.penality = "Fixed amount of Rs. " + this.booking.contract.noticePeriodViolation;
        charge = this.booking.contract.noticePeriodViolation;
      } else {
        this.exitCalculations.noticePeriodPenality.penality = this.booking.contract.noticePeriodViolation + " month(s) rent on prorata basis";
        charge = ((this.booking.contract.noticePeriodViolation * this.booking.contract.rent) / (this.booking.contract.noticePeriod * 30)) * requestedBeforeDays;
      }
      this.exitCalculations.noticePeriodPenality.charge = charge;
    } else {
      this.exitCalculations.noticePeriodPenality.statement = "Notice Period penality wont apply as exit is requested after agreed NoticePeriod of " + (this.booking.contract.noticePeriod * 30) + " days as per contract."
    }
    this.exitCalculations.earlyExitCharge.lockIn = (this.booking.contract.lockIn * 30) + " days";
    if (this.booking.contract.lockIn * 30 > stayDuration) {
      this.exitCalculations.earlyExitCharge.statement = "Early Exit Charge will apply as exit is requested before agreed LockIn period of " + (this.booking.contract.lockIn * 30) + " days as per contract."
      this.exitCalculations.earlyExitCharge.period = (this.booking.contract.lockIn * 30) + " days";
      var charge: any = 0;
      if (this.booking.contract.lockInPenaltyType == "Fixed") {
        this.exitCalculations.earlyExitCharge.penality = "Fixed amount of Rs. " + this.booking.contract.lockInPenalty;
        charge = this.booking.contract.lockInPenalty;
      } else {
        this.exitCalculations.earlyExitCharge.penality = this.booking.contract.lockInPenalty + " month(s) rent on prorata basis";
        charge = ((this.booking.contract.lockInPenalty * this.booking.contract.rent) / (this.booking.contract.lockIn * 30)) * ((this.booking.contract.lockIn * 30) - stayDuration);
      }
      this.exitCalculations.earlyExitCharge.charge = charge;
    } else {
      this.exitCalculations.earlyExitCharge.statement = "Early Exit charge wont apply as exit is requested after LockIn period of " + (this.booking.contract.lockIn * 30) + " days as per contract."
    }
    this.booking.exitRequest.monthlyInvoices = this.invoiceAmount;
    this.booking.exitRequest.totalPaid = this.booking.paid;
    this.booking.exitRequest.earlyExitCharge = parseInt(this.exitCalculations.earlyExitCharge.charge || 0);
    this.booking.exitRequest.noticePeriodPenalty = parseInt(this.exitCalculations.noticePeriodPenality.charge || 0);
    this.booking.exitRequest.assetDamages = _.sumBy(this.booking.exitRequest.acrs, "charge") || 0;
    this.booking.exitRequest.otherDeductions = _.sumBy(this.booking.exitRequest.deductions, "charge") || 0;
    var tdsAmount = _.sumBy(_.filter(this.invoices, function(i) { return i.isCancelled == 0 }), "tds");
    var tdsPaidAmount = _.sumBy(_.filter(this.invoices, function(i) { return i.isCancelled == 0 }), "tdsPaid");
    this.booking.exitRequest.tdsLiability = tdsAmount - tdsPaidAmount;
    this.booking.exitRequest.deregistrationLiability = 0;
    this.booking.exitRequest.tdsPenalty = 0;
    this.calculateExpectedAmount();
  }
  calculateExpectedAmount() {
    var amount = this.booking.exitRequest.monthlyInvoices + this.booking.exitRequest.earlyExitCharge + this.booking.exitRequest.noticePeriodPenalty
      + this.booking.exitRequest.assetDamages + this.booking.exitRequest.otherDeductions + this.booking.exitRequest.tdsLiability
      + this.booking.exitRequest.deregistrationLiability + this.booking.exitRequest.tdsPenalty;
    this.booking.exitRequest.refund = 0;
    this.booking.exitRequest.due = 0;
    this.booking.exitRequest.expectedAmount = amount;
    var self = this;
    if (self.booking.paid > amount) {
      self.booking.exitRequest.refund = self.booking.paid - amount;
    } else {
      self.booking.exitRequest.due = amount - self.booking.paid;
    }
    return amount;
  }
  approveFinalStatement() {
    var self = this;
    this.dialogs.confirm("Are you sure to request for Final Statement Approval . ?")
      .then(function(event) {
        if (event.value) {
          self.loading = true;
          self.service.approveFinalStatement(self.booking.exitRequest).pipe(take(1)).subscribe(
            res => {
              if (res['data']) {
                self.dialogs.success("Final Statement is approved successfully .. !");
                self.booking.exitRequest = res['data'];
              } else {
                self.dialogs.error(res['error']);
              }
              self.loading = false;
            })
        }
      })
  }
  acceptFinalStatement() {
    var self = this;
    this.dialogs.confirm("Are you sure to force accept Final Statement on client behalf . ?")
      .then(function(event) {
        if (event.value) {
          self.loading = true;
          var data = {
            exitRequestId: self.booking.exitRequest.id,
            clientId: self.booking.client.id,
            accountNumber: self.booking.client.accountNumber || '',
            ifscCode: self.booking.client.ifscCode || '',
            companyId: self.booking.companyId,
          }
          self.service.acceptFinalStatement(data).pipe(take(1)).subscribe(
            res => {
              if (res['data']) {
                self.dialogs.success("Final Statement is force accepted successfully .. !");
                self.booking.exitRequest = res['data'];
                self.getBooking();
              } else {
                self.dialogs.error(res['error']);
              }
              self.loading = false;
            })
        }
      })
  }

  acr: any;
  savingAcr: any = false;
  addAcr() {
    this.acr = { exitRequestId: this.booking.exitRequest.id };
  }
  saveAcr() {
    this.acr.status = "Published";
    var acr = _.clone(this.acr);
    this.savingAcr = true;
    this.service.saveAcr(acr).pipe(take(1)).subscribe(
      res => {
        if (res['data']) {
          this.dialogs.success("Asset Damage charge is saved .. !")
          this.booking.exitRequest.acrs.push(res['data']);
          this.acr = null;
          this.calculateExitCharges();
        } else {
          this.dialogs.error(res['error']);
        }
        this.savingAcr = false;
      })
  }
  deleteAcr(acr) {
    acr.status = "Archived";
    this.savingAcr = true;
    this.service.saveAcr(acr).pipe(take(1)).subscribe(
      res => {
        this.booking.exitRequest.acrs = _.without(this.booking.exitRequest.acrs, acr);
        this.savingAcr = false;
        this.calculateExitCharges();
      })
  }
  deduction: any;
  savingDeduction: any = false;
  addDeduction() {
    this.deduction = { exitRequestId: this.booking.exitRequest.id };
  }
  saveDeduction() {
    this.deduction.status = "Published";
    var deduction = _.clone(this.deduction);
    this.savingDeduction = true;
    this.service.saveDeduction(deduction).pipe(take(1)).subscribe(
      res => {
        if (res['data']) {
          this.dialogs.success("Other deduction charge is saved .. !")
          this.booking.exitRequest.deductions.push(res['data']);
          this.deduction = null;
          this.calculateExitCharges();
        } else {
          this.dialogs.error(res['error']);
        }
        this.savingDeduction = false;
      })
  }
  deleteDeduction(deduction) {
    deduction.status = "Archived";
    this.savingDeduction = true;
    this.service.saveDeduction(deduction).pipe(take(1)).subscribe(
      res => {
        this.booking.exitRequest.deductions = _.without(this.booking.exitRequest.deductions, deduction);
        this.savingDeduction = false;
        this.calculateExitCharges();
      })
  }
  comment: any;
  savingComment: any = false;
  addComment() {
    this.comment = { exitRequestId: this.booking.exitRequest.id };
  }
  saveComment() {
    this.comment.status = "Published";
    var comment = _.clone(this.comment);
    this.savingComment = true;
    this.service.saveExitComment(comment).pipe(take(1)).subscribe(
      res => {
        if (res['data']) {
          this.dialogs.success("Other comment charge is saved .. !")
          this.booking.exitRequest.comments.push(res['data']);
          this.comment = null;
        } else {
          this.dialogs.error(res['error']);
        }
        this.savingComment = false;
      })
  }
  deleteComment(comment) {
    comment.status = "Archived";
    this.savingComment = true;
    this.service.saveExitComment(comment).pipe(take(1)).subscribe(
      res => {
        this.booking.exitRequest.comments = _.without(this.booking.exitRequest.comments, comment);
        this.savingComment = false;
      })
  }
  invalidRelocation: boolean = false;
  expansionType: any;
  openExpansion() {
    this.expansionType = "Expansion";
    var self = this;
    this.openedModal = this.dialogs.modal(this.expansionModal, { size: 'xlg' });
    this.openedModal.result.then(function() {
      self.selectedBuilding = null;
      self.expansionDesks = null;
      self.expansionDate = null;
      self.selectedOffices = [];
      self.buildings = [];
      self.desks = [];
    }).catch(function(e) {
      self.selectedBuilding = null;
      self.expansionDesks = null;
      self.expansionDate = null;
      self.selectedOffices = [];
      self.buildings = [];
      self.desks = [];
    })
  }
  openRelocation() {
    this.expansionType = "ReLocation";
    this.expansionDesks = this.booking.bookedDesks.length;
    var self = this;
    this.openedModal = this.dialogs.modal(this.expansionModal, { size: 'xlg' });
    this.openedModal.result.then(function() {
      self.selectedBuilding = null;
      self.expansionDesks = null;
      self.expansionDate = null;
      self.selectedOffices = [];
      self.buildings = [];
      self.desks = [];
    }).catch(function(e) {
      self.selectedBuilding = null;
      self.expansionDesks = null;
      self.expansionDate = null;
      self.selectedOffices = [];
      self.buildings = [];
      self.desks = [];
    })
  }
  openContraction() {
    this.contract = _.clone(this.booking.contract);
    this.expansionType = "Contraction";
    var self = this;
    this.desks = [];
    var desks = [];
    _.each(this.booking.bookedDesks, function(d) {
      desks.push({
        id: d.id,
        facilitySetId: d.facilitySetId,
        deskId: d.id,
        office: d.desk.cabin.office.name,
        cabin: d.desk.cabin.name,
        desk: d.desk.name,
        price: d.price,
        status: d.status,
        started: d.started
      })
    })
    this.offices = _(desks)
      .groupBy(x => x.office)
      .map((value, key) => ({ office: key, name: value[0].office, desks: value }))
      .value();
    _.each(this.offices, function(o) {
      o.cabins = _(o.desks)
        .groupBy(x => x.cabin)
        .map((value, key) => ({ cabin: key, name: value[0].cabin, desks: value }))
        .value();
      delete o.desks;
    })
    this.openedModal = this.dialogs.modal(this.contractionModal, { size: 'xlg' });
    this.openedModal.result.then(function() {
      self.contractionDesks = null;
      self.contractionDate = null;
      self.offices = [];
      self.deductionPrice = 0;
    }).catch(function(e) {
      self.contractionDesks = null;
      self.contractionDate = null;
      self.offices = [];
      self.deductionPrice = 0;
    })
  }
  deductionPrice: any = 0;
  deductionNewRent: any = 0;
  validContractionDate: boolean = false;
  minContractionDate: any;
  checkForValidContraction() {
    var noticePeriodDays = this.booking.contract.noticePeriod * 30;
    this.minContractionDate = moment().add(noticePeriodDays, 'days');
    if (Utils.ngbDateToMoment(this.contractionDate).isAfter(this.minContractionDate)) {
      this.validContractionDate = true;
    } else {
      this.validContractionDate = false;
    }
    this.validContractionDate = true;
  }
  selectDeskForContraction(desk) {
    desk.selected = !desk.selected;
    if (desk.selected) {
      desk.status = 'Releasing';
      this.desks.push(desk);
      if (this.desks.length > this.contractionDesks) {
        this.desks[0].selected = false;
        this.deductionPrice = this.deductionPrice - this.desks[0].price;
        this.desks.shift();
      }
      this.deductionPrice = this.deductionPrice + desk.price;
    } else {
      desk.status = 'InUse';
      this.desks = _.without(this.desks, desk);
      this.deductionPrice = this.deductionPrice - desk.price;
    }
    this.deductionNewRent = this.booking.contract.rent - this.deductionPrice;
  }
  contractsHistory: any = [];
  openContracsHistory() {
    this.service.getContracts(this.booking.id)
      .pipe(take(1)).subscribe(res => {
        this.contractsHistory = res['data'];
      })
    this.openedModal = this.dialogs.modal(this.contractsHistoryModal, { size: 'lg' });
    this.openedModal.result.then(function() {
    }).catch(function(e) {
    })
  }

  buildings: any = [];
  offices: any = [];
  expansionDate: any;
  expansionDesks: any;
  searchOffices() {
    if (!this.expansionDate) {
      this.offices = [];
      return;
    }
    this.contract = _.clone(this.booking.contract);
    delete this.contract.discount;
    delete this.contract.id;
    var deskTypes = [this.booking.contract.type];
    var data = {
      // "locationId": this.booking.locationId,
      // "officeId": this.booking.officeId,
      "deskTypes": deskTypes,
      "startDate": Utils.ngbDateToDate(this.expansionDate),
      "desks": this.expansionDesks,
      "hideSold": false
    }
    this.loading = true;
    this.service.searchOffices(data).pipe(take(1)).subscribe(
      res => {
        console.log("searchOffices :: offices : ", res['data']);
        if (res['data']) {
          this.buildings = res['data'];
          this.renderMap();
        }
        this.loading = false;
      }, error => {
      });
  }
  selectedBuilding: any;
  selectedOffices = [];
  selectedCabins = [];
  selectedDesks = [];
  desks = [];
  totalBookingPrice: any = 0;
  selectDesk(desk) {
    var allDesksSelected = false;
    if (desk.status == "Available") {
      var selectedDesks = _.filter(this.selectedDesks, { selected: true });
      if (selectedDesks.length >= this.expansionDesks) {
        selectedDesks[0].selected = false;
      }
      var selectedDesk = _.find(this.selectedDesks, { id: desk.id });
      if (selectedDesk) {
        selectedDesk.selected = !selectedDesk.selected;
      } else {
        desk.selected = !desk.selected;
        if (desk.selected) {
          this.selectedDesks.push(desk);
        }
      }
    }
    selectedDesks = _.filter(this.selectedDesks, { selected: true });
    this.desks = selectedDesks;
    if (selectedDesks.length >= this.expansionDesks) {
      allDesksSelected = true;
    } else {
      allDesksSelected = false;
    }
    this.selectedOffices = [];
    this.selectedCabins = [];
    var selectedCabins = [];
    var self = this;
    if (allDesksSelected) {
      var selectedCabinIds = _.uniq(_.map(selectedDesks, "cabinId"));
      _.each(self.offices, function(o) {
        var cabins = _.filter(o.cabins, function(c) {
          return selectedCabinIds.indexOf(parseInt(c.id)) >= 0;
        })
        _.each(cabins, function(c) {
          var pricings = _.filter(o.pricings, { deskType: c.deskType });
          c.pricings = pricings;
          c.officeId = o.id;
          c.office = o.name;
        })
        selectedCabins = selectedCabins.concat(cabins);
      })
      _.each(selectedCabins, function(c) {
        self.desks = _.filter(self.selectedDesks, function(d) {
          return d.selected && d.cabinId == parseInt(c.id)
        });
        self.selectedCabins.push({
          id: c.id,
          officeId: c.officeId,
          office: c.office,
          name: c.name,
          desks: self.desks,
          desksCount: self.desks.length,
          deskType: c.deskType,
          pricings: c.pricings,
        })
      })
      console.log("selectedCabins : ", self.selectedCabins);
      if (self.selectedCabins.length) {
        var offices = _(self.selectedCabins)
          .groupBy(x => x.officeId)
          .map((value, key) => ({ officeId: key, office: value[0].office, cabins: value }))
          .value();
        _.each(offices, function(o) {
          var cabins = _(o.cabins)
            .groupBy(x => x.deskType)
            .map((value, key) => ({ deskType: key, pricings: value[0].pricings, cabins: value }))
            .value();
          _.each(cabins, function(c) {
            var desksCount = _.sumBy(c.cabins, "desksCount");
            var cnames = _.map(c.cabins, "name").join(", ");
            c.desksCount = desksCount;
            c.names = cnames;
          })
          o.cabins = cabins;
        });
        this.selectedOffices = offices;
        console.log("selectedOffices : ", self.selectedOffices);
      }
    }
  }
  selectHotDesks(office, cabin) {
    if (this.contract.type == "HotDesk") {
      _.each(this.offices, function(o) {
        _.each(o.cabins, function(c) {
          c.selected = false;
        })
      })
      cabin.selected = true;
      var self = this;
      this.desks = [];
      var i = 0;
      _.each(cabin.desks, function(d) {
        if (d.status == 'Available' && i < self.expansionDesks) {
          self.desks.push(d);
          i++;
        }
      })
      var pricings = _.filter(office.pricings, { deskType: cabin.deskType });
      var _cabin = {
        names: cabin.name,
        desks: self.desks,
        desksCount: self.desks.length,
        deskType: cabin.deskType,
        value: cabin.value,
        pricings: pricings
      }
      this.selectedOffices = [{ officeId: office.id, office: office.name, cabins: [_cabin] }];
      console.log("selectHotDesks ::: selectedOffices :: ", this.selectedOffices);
    }
  }
  updateBookingPrice() {
    var self = this;
    this.totalBookingPrice = 0;
    _.each(this.selectedOffices, function(o) {
      _.each(o.cabins, function(c) {
        c.price = c.value.split(",")[0];
        c.facilitySetId = c.value.split(",")[1];
        if (c.price && c.price > 0) {
          self.totalBookingPrice = self.totalBookingPrice + (c.price * c.desksCount);
          if (c.cabins) {
            self.desks = [];
            _.each(c.cabins, function(cabin) {
              _.each(cabin.desks, function(d) {
                self.desks.push({
                  id: d.id,
                  facilitySetId: c.facilitySetId,
                  price: c.price
                })
              })
            })
          } else {
            var desks = [];
            _.each(self.desks, function(d) {
              desks.push({
                id: d.id,
                facilitySetId: c.facilitySetId,
                price: c.price
              })
            })
            self.desks = desks;
          }
        }
        if (self.expansionType && self.expansionType == "Expansion") {
          self.contract.rent = self.booking.contract.rent + self.totalBookingPrice;
        } else if (self.expansionType && self.expansionType == "ReLocation") {
          self.contract.rent = self.totalBookingPrice;
        }
        self.contract.security = self.contract.rent * 2;
      })
    })
    if (self.contract.term == 'ShortTerm') {
      var rent = 0;
      var noOfDays = moment(self.booking.endDate).diff(moment(self.booking.startDate), 'days') + 1;
      var rentPerDay = self.totalBookingPrice / moment(self.booking.startDate).daysInMonth();
      var rent = rentPerDay * noOfDays;
      self.totalBookingPrice = Math.round(rent);
      self.contract.security = 0;
      self.contract.token = 0;
      self.contract.lockIn = 0;
      self.contract.lockInPenalty = 0;
      self.contract.lockInPenaltyType = 'Fixed';
      self.contract.noticePeriod = 0;
      self.contract.noticePeriodViolation = 0;
      self.contract.noticePeriodViolationType = 'Fixed';
    }
    setTimeout(function() {
      self.ref.detectChanges();
    }, 500)
  }
  confirmExpansion() {
    // this.contract.rent = this.booking.contract.rent + this.totalBookingPrice - (this.contract.discount || 0);
    var data = {
      bookingId: this.booking.id,
      additionalRent: (this.totalBookingPrice - (this.contract.discount || 0)),
      expansionDate: Utils.ngbDateToMoment(this.expansionDate).add(8, 'hours').toDate(),
      desks: this.desks,
      contract: this.contract
    }
    console.log("BookingComponent ::: confirmExpansion :: data : ", data);
    this.loading = true;
    this.service.bookingExpansion(data).pipe(take(1)).subscribe(
      res => {
        this.loading = false;
        if (res['data']) {
          this.dialogs.success("Desk Expansion has done successfully .. !!")
          this.getBooking();
          this.openedModal.close(res['data']);
        } else {
          this.dialogs.error(res['error']);
        }
      })
  }
  confirmRelocation() {
    var currentDesks = _.map(this.booking.bookedDesks, "id");
    var data = {
      bookingId: this.booking.id,
      relocationDate: Utils.ngbDateToMoment(this.expansionDate).add(8, 'hours').toDate(),
      desks: this.desks,
      contract: this.contract,
      currentDesks: currentDesks
    }
    console.log("BookingComponent ::: confirmRelocation :: data : ", data);
    this.loading = true;
    this.service.bookingRelocation(data).pipe(take(1)).subscribe(
      res => {
        this.loading = false;
        if (res['data']) {
          this.dialogs.success("Booking Relocation has done successfully .. !!")
          this.getBooking();
          this.openedModal.close(res['data']);
        } else {
          this.dialogs.error(res['error']);
        }
      })
  }
  contractionDate: any;
  contractionDesks: any;
  confirmContraction() {
    this.contract.rent = this.booking.contract.rent - this.deductionPrice;
    var contract = _.clone(this.contract);
    delete contract.id;
    var desks = [];
    _.each(this.offices, function(o) {
      _.each(o.cabins, function(c) {
        _.each(c.desks, function(d) {
          desks.push(d);
        })
      })
    })
    var data = {
      bookingId: this.booking.id,
      contractionDate: Utils.ngbDateToMoment(this.contractionDate).add(8, 'hours').toDate(),
      desks: desks,
      contract: contract
    }
    console.log("BookingComponent ::: confirmContraction :: data : ", data);
    this.loading = true;
    this.service.bookingContraction(data).pipe(take(1)).subscribe(
      res => {
        this.loading = false;
        if (res['data']) {
          this.dialogs.success("Booking Contraction has done successfully .. !!")
          this.getBooking();
          this.openedModal.close(res['data']);
        } else {
          this.dialogs.error(res['error']);
        }
      })
  }
  listBookedOffices() {
  }
  client: any = {};
  editClient() {
    this.client = _.clone(this.booking.client);
    this.openedModal = this.dialogs.modal(this.clientModal, { size: 'lg' });
    var self = this;
    this.openedModal.result.then(function() {
      self.client = {};
      self.loading = false;
      self.clientForm.reset();
    }).catch(function(e) {
      self.client = {};
      self.loading = false;
      self.clientForm.reset();
    })
  }
  saveClient() {
    let self = this;
    this.loading = true;
    var client = _.clone(this.client);
    client.bookingId = this.booking.id;
    this.service.saveClient(client).pipe(take(1)).subscribe(
      res => {
        self.dialogs.success("Client is updated successfully ");
        self.loading = false;
        this.openedModal.dismiss();
        self.getBooking();
      },
      error => {
        self.dialogs.error(error, 'Error while saving')
      }
    )
  }
  companyRegistrationFile: any;
  companyRegistrationFileChange(event) {
    this.companyRegistrationFile = event.target.files[0];
  }
  companyRegistrationUploadResponse: any = { status: '', message: '', filePath: '' };
  companyRegistrationFileError: any;
  uploadCompanyRegistrationFile() {
    const formData = new FormData();
    formData.append('file', this.companyRegistrationFile);
    this.loading = true;
    this.uploadService.upload(formData).subscribe(
      (res) => {
        this.companyRegistrationUploadResponse = res;
        if (res.file) {
          this.loading = false;
          this.booking.client.companyRegistration = res;
          this.client.companyRegistrationId = res.id;
          this.service.saveClient({ id: this.booking.client.id, companyRegistrationId: res.id })
            .pipe(take(1)).subscribe(res => this.dialogs.success("Company Registration Certificate uploaded successfully..!!"))
        }
      },
      (err) => this.companyRegistrationFileError = err
    );
  }
  gstRegistrationFile: any;
  gstRegistrationFileChange(event) {
    this.gstRegistrationFile = event.target.files[0];
  }
  gstRegistrationUploadResponse: any = { status: '', message: '', filePath: '' };
  gstRegistrationFileError: any;
  uploadGstRegistrationFile() {
    const formData = new FormData();
    formData.append('file', this.gstRegistrationFile);
    this.loading = true;
    this.uploadService.upload(formData).subscribe(
      (res) => {
        this.gstRegistrationUploadResponse = res;
        if (res.file) {
          this.loading = false;
          this.booking.client.gstRegistration = res;
          this.client.gstRegistrationId = res.id;
          this.service.saveClient({ id: this.booking.client.id, gstRegistrationId: res.id })
            .pipe(take(1)).subscribe(res => this.dialogs.success("GST Registration Certificate uploaded successfully..!!"))
        }
      },
      (err) => this.gstRegistrationFileError = err
    );
  }
  panCardFile: any;
  panCardFileChange(event) {
    this.panCardFile = event.target.files[0];
  }
  panCardUploadResponse: any = { status: '', message: '', filePath: '' };
  panCardFileError: any;
  uploadPanCardFile() {
    const formData = new FormData();
    formData.append('file', this.panCardFile);
    this.loading = true;
    this.uploadService.upload(formData).subscribe(
      (res) => {
        this.panCardUploadResponse = res;
        if (res.file) {
          this.loading = false;
          this.booking.client.panCard = res;
          this.client.panCardId = res.id;
          this.service.saveClient({ id: this.booking.client.id, panCardId: res.id })
            .pipe(take(1)).subscribe(res => this.dialogs.success("PAN Card uploaded successfully..!!"))
        }
      },
      (err) => this.panCardFileError = err
    );
  }


  lat: any;
  lng: any;
  minLat: any; maxLat: any; minLng: any; maxLng: any;
  selectedMarker;
  markers = [];
  max(coordType: 'lat' | 'lng'): number {
    return Math.max(...this.markers.map(marker => marker[coordType])) + 0.00100;
  }
  min(coordType: 'lat' | 'lng'): number {
    return Math.min(...this.markers.map(marker => marker[coordType])) - 0.00100;
  }
  markerOut(marker) {
    marker.animation = null;
  }
  markerOver(marker) {
    marker.animation = "BOUNCE";
  }
  isMapReady: boolean = false;
  renderMap() {
    var self = this;
    var index = 1;
    this.markers = [];
    _.each(this.buildings, function(b) {
      self.markers.push({
        fillColor: '#EC407A',
        label: {
          color: 'white',
          text: index + "",
          fontWeight: 'bold',
          fontSize: '14px',
        },
        animation: '',
        lat: b.lat,
        lng: b.lng,
        alpha: 1
      })
      index++;
    })
    this.minLat = this.min('lat');
    this.maxLat = this.max('lat');
    this.minLng = this.min('lng');
    this.maxLng = this.max('lng');
    this.lat = (this.minLat + this.maxLat) / 2;
    this.lng = (this.minLng + this.maxLng) / 2;
    console.log("markers : ", this.markers);
    console.log("lat lng : ", this.lat, this.lng);
    this.isMapReady = true;
  }
  hoverBuilding(building, hover) {
    var marker = _.find(this.markers, { lat: building.lat, lng: building.lng });
    if (hover) {
      building.selected = true;
      marker.animation = 'BOUNCE';
    } else {
      building.selected = false;
      marker.animation = '';
    }
  }
  checkForAccess(element) {
    return Helpers.checkAccess(element);
  }
  signedAgreementFile: any;
  signedAgreementFileChange(event) {
    this.signedAgreementFile = event.target.files[0];
  }
  signedAgreementUploadResponse: any = { status: '', message: '', filePath: '' };
  signedAgreementFileError: any;
  uploadSignedAgreementFile(contract) {
    const formData = new FormData();
    formData.append('file', this.signedAgreementFile);
    this.loading = true;
    this.uploadService.upload(formData).subscribe(
      (res) => {
        this.signedAgreementUploadResponse = res;
        if (res.file) {
          this.loading = false;
          contract.signedAgreement = res;
          this.service.saveContract({ id: contract.id, signedAgreementId: res.id })
            .pipe(take(1)).subscribe(res => this.dialogs.success("Signed Agreement is uploaded successfully..!!"))
        }
      },
      (err) => this.panCardFileError = err
    );
  }
  email: any;
  action(event) {
    console.log("BookingsComponent ::: action :: event ", event);
    if (event.action == 'view') {
      var email = _.clone(event.item);
      var regex = /<head>*<\/head>/g;
      email.body = email.body.replace(regex, "");
      this.email = email;
      this.openedModal = this.dialogs.modal(this.viewEmailModal, { size: 'lg', backdrop: 'static' });
    }
  }


  urn: any = {}
  urnSubmitted: any = false;
  saveUrnPayment() {
    this.loading = true;
    this.urn.status = "Submitted";
    this.service.saveUrnPayment(this.urn).pipe(take(1)).subscribe(
      res => {
        this.loading = false;
        this.urnSubmitted = true;
        this.booking.due = this.booking.due - this.urn.amount;
      })
  }

  payNow() {
    var self = this;
    this.loading = true;
    var data = {
      orderId: this.booking.refNo,
      bookingId: this.booking.id,
      currency: 'INR',
      amount: this.booking.onlinePayment,
      merchant: {
        name: this.booking.company.name,
        image: this.booking.company.logo
      },
      customer: {
        firstName: this.booking.client.name,
        lastName: '',
        phoneCountryCode: '+91',
        phone: this.booking.client.phone,
        email: this.booking.client.email
      }
    }
    this.pgService.makePaymentRequest(data).then(function(response) {
      console.log("handleSuccessfulPayment SuccessCallback ::: response :: ", response);
      self.loading = false;
    }).catch(function(err) {
      console.log("handleSuccessfulPayment SuccessCallback ::: error :: ", err);
      self.loading = false;
    })
  }
}
