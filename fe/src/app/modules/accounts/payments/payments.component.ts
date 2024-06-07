import { Component, OnInit, ViewChild } from '@angular/core';
import { ProductService } from 'src/app/shared/services/product.service';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { debounceTime, take } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HttpClient } from "@angular/common/http";
import { Router } from '@angular/router';
import { DialogsService } from 'src/app/shared/services/dialogs.services';
import { Utils } from 'src/app/shared/utils';
import { BookingsService } from 'src/app/shared/services/bookings.service';
import { AccountsService } from 'src/app/shared/services/accounts.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { Helpers } from '../../../helpers';
import * as _ from 'lodash';
// import * as $ from 'jquery';
import * as moment from 'moment';

declare let $: any;

@Component({
  selector: 'accounts-payments',
  templateUrl: './payments.component.html'
})
export class AccountPaymentsComponent implements OnInit {
  paymentForm: FormGroup;
  selectedBooking: FormControl = new FormControl("");

  selectedPayment: any = {};
  payment: any = {};
  paymentsConfig: any = {};
  cancelledPaymentsConfig: any = {};

  @ViewChild('paymentsList') paymentsList: any;
  @ViewChild('cancelledPaymentsList') cancelledPaymentsList: any;
  @ViewChild('paymentModal') paymentModal: any;

  search: any = new FormControl('');
  items: any = [];
  selectedItem: any = {};
  filters: any = {};
  loading: boolean = false;
  noResults: boolean = false;
  showCancelled: boolean = false;
  offset: number = 0;
  limit: number = 30;

  constructor(private dialogs: DialogsService, private router: Router, private commonService: CommonService,
    private service: AccountsService, private bookingsService: BookingsService) {
  }

  ngOnInit() {
    this.search.valueChanges
      .pipe(debounceTime(200))
      .subscribe(value => {
        this.filters.search = value;
      });

    this.paymentForm = new FormGroup({
      amount: new FormControl("", Validators.required),
      type: new FormControl("", Validators.required),
      date: new FormControl("", Validators.required),
      utr: new FormControl(""),
    });
    var actions: any = [
      // { icon: 'fa fa-ban', hint: 'Archive Payment', code: 'archivePayment', style: 'danger' }
    ]
    if (this.commonService.checkAccess("accounts:archieveTenantPayment")) {
      actions.push({ icon: 'fa fa-ban', hint: 'Archive Payment', code: 'archivePayment', style: 'danger' });
    }
    this.paymentsConfig = {
      columns: [
        { label: 'Client', field: 'booking.client.company', type: 'text', styleClass: 'w-30', sortable: true },
        { label: 'RefNo', field: 'booking.refNo', type: 'link', id: 'booking.id', href: '#/bookings/view/', styleClass: 'w-15 text-center', sortable: true },
        { label: 'Amount', field: 'amount', type: 'inr', styleClass: 'w-10 text-right', sortable: true },
        { label: 'PaymentMode', field: 'type', type: 'text', styleClass: 'w-10 text-center', sortable: true },
        { label: 'Paid On', field: 'date', tooltip: 'paidBy', type: 'date', styleClass: 'w-10 text-center', sortable: true },
        // { label: 'Paid By', field: 'paidBy', type: 'text', styleClass: 'w-10'},
        { label: 'UTR', field: 'utr', type: 'text', styleClass: 'w-15' },
      ],
      actions:actions,
      options: {
        debounceDelay: 500,
        actionStyleClass: 'w-5 icons-td text-center',
      }
    }

    this.cancelledPaymentsConfig = {
      columns: [
        { label: 'Client', field: 'booking.client.company', type: 'text', styleClass: 'w-25', sortable: true },
        { label: 'RefNo', field: 'booking.refNo', type: 'link', id: 'booking.id', href: '#/bookings/view/', styleClass: 'w-10 text-center word-break', sortable: true },
        { label: 'Amount', field: 'amount', type: 'inr', styleClass: 'w-10 text-right', sortable: true },
        // { label: 'UTR', field: 'utr', type: 'text', styleClass: 'w-15' },
        { label: 'Paid On', field: 'date', tooltip: 'paidBy', type: 'date', styleClass: 'w-10 text-center', sortable: true },
        { label: 'Cancelled On', field: 'cancelledDate', tooltip: 'cancelledBy', type: 'date', styleClass: 'w-10 text-center', sortable: true },
        { label: 'Cancelled Reason', field: 'cancelledReason', type: 'text', styleClass: 'w-30', sortable: true },
      ],
      actions: [
        // { icon: 'fa fa-ban', hint: 'Archive Payment', code: 'archivePayment', style: 'danger' }
      ],
      options: {
        debounceDelay: 500,
        actionStyleClass: 'w-5 icons-td text-center',
      }
    }

    this.filters.startDate = moment().add(-1, 'months').startOf('month');
    this.filters.endDate = moment().endOf('month');
    var self = this;
    var picker: any = $('#daterangepicker');
    picker.daterangepicker({
      opens: 'left',
      startDate: this.filters.startDate,
      endDate: this.filters.endDate,
      ranges: {
        'Today': [moment(), moment()],
        'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
        'Last 7 Days': [moment().subtract(6, 'days'), moment()],
        'Last 30 Days': [moment().subtract(29, 'days'), moment()],
        'This Month': [moment().startOf('month'), moment().endOf('month')],
        'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
      }
    }, function(start, end, label) {
      console.log("A new date selection was made: " + label);
      self.filters.startDate = start.format('YYYY-MM-DD');
      self.filters.endDate = end.format('YYYY-MM-DD');
    });
  }

  openedModal: any;
  openPaymentModal() {
    this.loading = false;
    this.openedModal = this.dialogs.modal(this.paymentModal, { size: 'md' });
    var self = this;
    this.openedModal.result.then(function() {
      self.payment = {};
    }).catch(function(e) {
      self.payment = {};
    })
  }

  selectedBookings: any = [];
  autocompleteBookings: any = [];
  searchBookings(text: any) {
    this.autocompleteBookings = [];
    this.loading = true;
    this.bookingsService.searchBookings({ filters: { search: text, typeSearch: true } })
      .pipe(take(1)).subscribe(res => {
        if (res['data']) {
          this.autocompleteBookings = res['data'];
          setTimeout(function(){
            $(".ng2-tag-input__text-input").click();            
          }, 300)
        } else {
          this.dialogs.error(res['error']);
        }
        this.loading = false;
      })
  }

  onBookingSelected() {
    if (this.selectedBookings.length) {
      var contractStatus = this.selectedBookings[0].status;
      if (contractStatus != "Confirmed") {
        this.dialogs.confirm("Contract for this booking is not confirmed yet. You need to confirm contract to add a payment to this booking. Would you like to proceed to confirm contract of this .. ?", "Contract not Confirmed")
          .then(event => {
            if (event.value) {
              this.openedModal.close();
              this.router.navigate(['/bookings/view/' + this.selectedBookings[0].id]);
            }
          })
      }
    }
  }

  archivePayment() {
    console.log("PaymentsComponent ::: save :: payment ", this.payment);
    let self = this;
    this.dialogs.confirm("Are you sure to archive payment from '" + this.payment.booking.client.name + "' of Rs." + this.payment.amount + "?")
      .then(function(event) {
        if (event.value) {
          self.dialogs.prompt("Please mention reason for archiving .?")
            .then((result) => {
              if (result.value) {
                self.loading = true;
                self.payment.cancelledReason = result.value;
                self.payment.cancelled = true;
                self.service.savePayment(self.payment).pipe(take(1)).subscribe(
                  res => {
                    if (res['data']) {
                      self.dialogs.success("Payment from '" + self.payment.booking.client.name + "' of Rs." + self.payment.amount + " is archived successfully ");
                      self.paymentsList.reset();
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
      })
  }

  makePayment() {
    console.log("PaymentsComponent ::: makePayment :: payment ", this.payment);
    let self = this;
    self.loading = true;
    self.payment.bookingId = this.selectedBookings.length ? this.selectedBookings[0].id : null;
    self.payment.date = Utils.ngbDateToDate(this.payment.date);
    self.service.savePayment(self.payment).pipe(take(1)).subscribe(
      res => {
        if (res['data']) {
          self.dialogs.success("Payment from '" + this.selectedBookings[0].name + "' of Rs." + self.payment.amount + " is added successfully ");
          self.paymentsList.reset();
          this.openedModal.close();
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

  action(event) {
    console.log("PayoutComponent ::: action :: event ", event);
    if (event.action == 'archivePayment') {
      this.payment = _.clone(event.item);
      this.payment.active = 0;
      this.archivePayment();
    }
  }

  clearDates() {
    $('#daterangepicker').val('');
    this.filters.startDate = null;
    this.filters.endDate = null;
  }
}
