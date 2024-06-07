
import { Component, OnInit, ViewChild } from '@angular/core';
import { ProductService } from 'src/app/shared/services/product.service';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { debounceTime, take } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HttpClient } from "@angular/common/http";
import { Utils } from 'src/app/shared/utils';
import { DialogsService } from 'src/app/shared/services/dialogs.services';
import { CommonService } from 'src/app/shared/services/common.service';
import { AccountsService } from 'src/app/shared/services/accounts.service';
import { AdminService } from 'src/app/shared/services/admin.service';
import { PurchasesService } from 'src/app/shared/services/purchases.service';
import { BookingsService } from 'src/app/shared/services/bookings.service';
import { Helpers } from '../../../helpers';
import * as _ from 'lodash';
import * as moment from 'moment';
import readXlsxFile from 'read-excel-file';
import { parseExcelDate } from 'read-excel-file';

@Component({
  selector: 'accounts-payin-entries',
  templateUrl: './view.component.html'
})
export class AccountsPayinEntriesComponent implements OnInit {
  payinForm: FormGroup;
  selectedBooking: FormControl = new FormControl("");

  selectedPayin: any = {};
  payin: any = {};
  payinConfig: any = {};
  // 'NotLinked','NotAttributed'
  payinsFilters: any = { statuses: [], paymentMode: 'BankTransfer', notAttributed: true };

  @ViewChild('payinsList') payinsList: any;
  @ViewChild('entryModal') entryModal: any;
  @ViewChild('importModal') importModal: any;

  search: any = new FormControl('');
  bookingSearchControl: any = new FormControl('');
  items: any = [];
  selectedItem: any = {};
  filters: any = {};
  loading: boolean = false;
  noResults: boolean = false;
  offset: number = 0;
  limit: number = 20;

  constructor(private dialogs: DialogsService, private purchasesService: PurchasesService, private bookingsService: BookingsService,
    private service: AccountsService, private adminService: AdminService, private commonService: CommonService) {
  }

  ngOnInit() {
    this.search.valueChanges
      .pipe(debounceTime(200))
      .subscribe(value => {
        this.payinsFilters.search = value;
      });

    this.getPayinsByStatus();

    this.bookingSearchControl.valueChanges
      .pipe(debounceTime(200))
      .subscribe(value => {
        this.bookingSearch = value;
        this.getUnlinkedPayments();
      });

    this.payinForm = new FormGroup({
      receivedDate: new FormControl("", Validators.required),
      amount: new FormControl("", Validators.required),
      narration: new FormControl("", Validators.required),
      utr: new FormControl(""),
      chequeNo: new FormControl(""),
    })

    var actions: any = [
      { icon: 'fa fa-info', hint: 'Show Entry', style: 'info', code: 'showInfo', condition: { label: 'attributed', value: 1 }, and: { label: 'paymentMode', value: 'BankTransfer' } },
      // { icon: 'fa fa-info', hint: 'Show Entry', style: 'info', code: 'showInfo', condition: { label: 'paymentMode', not: 'BankTransfer' }, and: { label: 'linked', value: 1 } },
      // { icon: 'fa fa-pencil', hint: 'Edit Entry', code: 'editPayin', style: 'info', condition: { label: 'attributed', not: 1 }, and: { label: 'nonRevenue', not: 1 } },
      // { icon: 'fa fa-link', hint: 'Link Entry', code: 'linkEntry', style: 'info', condition: { label: 'linked', not: 1 }, and: { label: 'paymentMode', value: 'BankTransfer' } },
      // { icon: 'fa fa-check', hint: 'Attribute Entry', code: 'attributeEntry', style: 'primary', condition: { label: 'attributed', not: 1 }, also: { label: 'paymentMode', value: 'BankTransfer' }, and: { label: 'nonRevenue', not: 1 } },
      // { icon: 'fa fa-times', hint: 'DeAttribute Entry', code: 'deattributeEntry', style: 'danger', condition: { label: 'attributed', value: 1 }, and: { label: 'nonRevenue', not: 1 },  role: 'accounts.deattributeCreditEntry' },
      { icon: 'fa fa-times', hint: 'DeAttribute Entry', code: 'deattributeEntry', style: 'danger', condition: { label: 'nonRevenue', value: 1 }, role: 'accounts:deattributeCreditEntry' },
    ]
    if (this.commonService.checkAccess("accounts:editCreditEntry")) {
      actions.push({ icon: 'fa fa-pencil', hint: 'Edit Entry', code: 'editPayin', style: 'info', condition: { label: 'attributed', not: 1 }, and: { label: 'nonRevenue', not: 1 } });
    }
    if (this.commonService.checkAccess("accounts:attributeCreditEntry")) {
      actions.push({ icon: 'fa fa-check', hint: 'Attribute Entry', code: 'attributeEntry', style: 'primary', condition: { label: 'attributed', not: 1 }, also: { label: 'paymentMode', value: 'BankTransfer' }, and: { label: 'nonRevenue', not: 1 } });
    }
    if (this.commonService.checkAccess("accounts:deattributeCreditEntry")) {
      actions.push({ icon: 'fa fa-times', hint: 'DeAttribute Entry', code: 'deattributeEntry', style: 'danger', condition: { label: 'attributed', value: 1 }, and: { label: 'nonRevenue', not: 1 }, role: 'accounts:deattributeCreditEntry' });
      // actions.push({ icon: 'fa fa-times', hint: 'DeAttribute Entry', code: 'deattributeEntry', style: 'danger', condition: { label: 'attributed', value: 1 }, and: { label: 'nonRevenue', not: 1 }, role: 'accounts:deattributeCreditEntry' });
    }
    this.payinConfig = {
      columns: [
        { label: 'Amount', field: 'amount', type: 'inr', styleClass: 'w-10 text-right', sortable: true },
        { label: 'ReceivedOn', field: 'receivedDate', type: 'date', styleClass: 'w-10 text-center', sortable: true },
        { label: 'Status', field: 'status', type: 'text', styleClass: 'w-5 text-center', sortable: true, tooltip: 'reason', lightRed: 'notAttributed', warning: 'suspense', light: 'nonRevenue' },
        { label: 'UTR', field: 'utr', type: 'text', styleClass: 'w-15 text-left', sortable: true },
        { label: 'Narration', field: 'narration', type: 'text', styleClass: 'w-30 text-left', sortable: true },
        { label: 'Attribution / Info', field: 'booking', type: 'link', href: '#/bookings/view/', id: 'bookingId', styleClass: 'w-20', sortable: true },
        // { label: 'AddedOn', field: 'addedOn', tooltip: 'addedBy', type: 'date', styleClass: 'w-10 text-center', sortable: true },
      ],
      actions: actions,
      options: {
        debounceDelay: 500,
        actionStyleClass: 'w-10 icons-td text-center',
      }
    }

    // this.payinsFilters.startDate = moment().add(-1, 'months').startOf('month');
    // this.payinsFilters.endDate = moment().endOf('month');
    var self = this;
    var picker: any = $('#daterangepicker');
    picker.daterangepicker({
      opens: 'left',
      autoUpdateInput: false,
      // startDate: this.payinsFilters.startDate,
      // endDate: this.payinsFilters.endDate,
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
      self.payinsFilters.startDate = start.format('YYYY-MM-DD');
      self.payinsFilters.endDate = end.format('YYYY-MM-DD');
      self.getPayinsByStatus();
    });
    picker.on('apply.daterangepicker', function(ev, picker) {
      $(this).val(picker.startDate.format('MM/DD/YYYY') + ' - ' + picker.endDate.format('MM/DD/YYYY'));
      self.getPayinsByStatus();
    });
    picker.on('cancel.daterangepicker', function(ev, picker) {
      $(this).val('');
      self.payinsFilters.startDate = null;
      self.payinsFilters.endDate = null;
      self.getPayinsByStatus();
    });
  }

  clearDates() {
    $('#daterangepicker').val('');
    this.payinsFilters.startDate = null;
    this.payinsFilters.endDate = null;
    this.payinsList.reset();
    this.getPayinsByStatus();
  }
  openedModal: any;
  savePayin() {
    console.log("PayinEntryComponent ::: save :: payin ", this.payin);
    this.loading = true;
    let self = this;
    var data: any = {
      id: this.payin.id,
      amount: this.payin.amount,
      paymentMode: this.payinsFilters.paymentMode,
      utr: this.payin.utr,
      narration: this.payin.narration,
      suspense: this.payin.suspense,
      nonRevenue: this.payin.nonRevenue,
      receivedDate: Utils.ngbDateToDate(this.payin.receivedDate)
    }
    if (data.paymentMode == 'Cheque') {
      data.issuedOn = Utils.ngbDateToDate(this.payin.issuedOn);
      data.chequeNo = this.payin.chequeNo;
    }
    console.log("PayinEntryComponent ::: save :: payin data ", data);
    this.loading = false;
    this.service.savePayinEntry(data).pipe(take(1)).subscribe(
      res => {
        if (res['data']) {
          self.dialogs.success("PayinEntry of Rs. " + this.payin.amount + " is updated. ");
          this.loading = false;
          self.payinsList.reset();
          self.payinForm.reset();
          self.openedModal.close();
        } else {
          self.dialogs.error(res['error'], 'Error while saving')
        }
      },
      error => {
        self.dialogs.error(error, 'Error while saving')
      }
    )
  }

  action(event) {
    console.log("PayinEntryComponent ::: action :: event ", event);
    if (event.action == 'editPayin') {
      this.isForm = true;
      this.payin = _.clone(event.item);
      this.openEntryModal(event.item);
    } else if (event.action == 'showInfo') {
      this.payin = _.clone(event.item);
      this.openEntryModal(event.item);
    } else if (event.action == 'linkEntry') {
      this.payin = event.item;
      this.openEntryModal(event.item);
    } else if (event.action == 'attributeEntry') {
      this.payin = event.item;
      this.openEntryModal(event.item);
      this.getUnlinkedPayments();
    } else if (event.action == 'deattributeEntry') {
      this.deattributeEntry(event.item);
    }
  }

  isForm: any = false;
  openEntryModal(entry?) {
    this.unlinkedEntries = [];
    this.attributions = [];
    this.selectedBookings = [];
    if (this.payinsFilters.paymentMode == 'BankTransfer') {
      this.payinForm.addControl('utr', new FormControl('', [Validators.required]));
    } else {
      this.payinForm.removeControl('utr');
    }
    if (this.payinsFilters.paymentMode == 'Cheque') {
      this.payinForm.addControl('chequeNo', new FormControl('', [Validators.required]));
    } else {
      this.payinForm.removeControl('chequeNo');
    }
    this.openedModal = this.dialogs.modal(this.entryModal, { size: 'lg', keyboard: false });
    var self = this;
    if (this.isForm) {
      this.payin.receivedDate = Utils.dateToNgbDate(this.payin.receivedDate);
    }
    if (!this.payin) {
      this.payin = {};
    }
    this.openedModal.result.then(function() {
      self.payin = {};
      self.payinForm.reset();
      self.isForm = false;
    }).catch(function(e) {
      self.payin = {};
      self.payinForm.reset();
      self.isForm = false;
    })
  }

  statuses: any = [];
  totalPayins: any = [];
  notAttributed: any = 0;
  suspense: any = 0;
  nonRevenue: any = 0;
  noInvoice: any = 0;
  linked: any = 0;
  attributedPayins: any = 0;
  getPayinsByStatus() {
    this.service.getPayinsByStatus(this.payinsFilters).subscribe(res => {
      this.statuses = res['data']['statuses'];
      this.totalPayins = _.sumBy(this.statuses, 'count');
      this.attributedPayins = _.sumBy(_.filter(this.statuses, { status: "Attributed" }), 'count');
      this.linked = res['data']['linked'];
      this.notAttributed = res['data']['notAttributed'];
      this.nonRevenue = res['data']['nonRevenue'];
      this.suspense = res['data']['suspense'];
      this.noInvoice = res['data']['noInvoice'];
    })
  }

  unlinkedEntries: any = [];
  attributions: any = [];
  bookingSearch: any;
  getUnlinkedPayments() {
    var data: any = {
      filters: { notLinked: true, paymentModes: ['Cash', 'Cheque', 'PG'], amount: this.payin.amount },
    }
    this.service.listPayinEntries(data).subscribe(res => {
      if (res['data']) {
        this.unlinkedEntries = res['data'];
      }
    })
    data = {
      amount: this.payin.amount,
      date: this.payin.receivedDate,
      search: this.bookingSearch
    }
    this.service.getAttributeSuggestions(data).subscribe(res => {
      if (res['data']) {
        this.attributions = res['data'];
      }
    })
  }

  linkPayinTo(entry) {
    entry.creditedDate = this.payin.receivedDate;
    entry.linked = 1;
    entry.status = 'Credited';
    this.service.savePayinEntry(entry).subscribe(res => {
      console.log("Linked entry is updated .. ", res['data']);
    });

    this.loading = true;
    this.service.savePayinEntry({ id: this.payin.id, status: 'Linked', linked: 1, linkedId: entry.id }).subscribe(res => {
      if (res['data']) {
        this.payin.linked = 1;
        this.payin.linkedTo = entry;
        this.loading = false;
        this.payinsList.reset();
        this.dialogs.success("PayIn entry is linked successfully.")
      }
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
        } else {
          this.dialogs.error(res['error']);
        }
        this.loading = false;
      })
  }

  confirmAttribution() {
    let self = this;
    this.dialogs.confirm("Are you sure to attribute amount of Rs." + this.payin.amount + " to " + (this.selectedBookings[0].company || this.selectedBookings[0].name))
      .then((event) => {
        if (event.value) {
          self.loading = true;
          var payment: any = {
            amount: this.payin.amount,
            date: this.payin.receivedDate,
            utr: this.payin.utr,
            comments: this.payin.narration,
            type: this.payin.linkedTo ? this.payin.linkedTo.paymentMode : this.payin.paymentMode
          };
          payment.bookingId = this.selectedBookings.length ? this.selectedBookings[0].id : null;
          self.service.savePayment(payment).pipe(take(1)).subscribe(
            res => {
              if (res['data']) {
                self.dialogs.success("Payment from '" + this.selectedBookings[0].name + "' of Rs." + payment.amount + " is added successfully ");

                this.service.savePayinEntry({
                  id: this.payin.id,
                  bookingId: payment.bookingId,
                  paymentId: res['data']['id'],
                  status: 'Attributed',
                  attributed: 1,
                  suspense: 0,
                }).subscribe(res => {
                  if (res['data']) {
                    this.payin.attributed = 1;
                    this.payin.suspense = 0;
                    this.payin.nonRevenue = 0;
                    this.loading = false;
                    this.openedModal.close();
                    this.payinsList.reset();
                    this.getPayinsByStatus();
                    this.dialogs.success("PayIn entry is linked successfully.")
                  }
                })
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

  deattributeEntry(entry) {
    let self = this;
    this.dialogs.confirm("Are you sure to attribute amount of Rs." + entry.amount + " for " + entry.booking)
      .then((event) => {
        if (event.value) {
          self.loading = true;
          self.bookingsService.savePayment({
            utr: entry.utr,
            status: 'Cancelled',
            cancelled: 1,
            cancelledReason: 'Credit entry is deattributed'
          }).subscribe(res => {
            if (res['data'] && entry.id) {
              self.service.savePayinEntry({
                id: entry.id,
                bookingId: null,
                status: 'Credited',
                attributed: 0,
                suspense: 0,
                noInvoice: 0,
                nonRevenue: 0,
                reason: null,
                info: null,
              }).subscribe(res => {
                if (res['data']) {
                  entry.attributed = 0;
                  entry.suspense = 0;
                  entry.nonRevenue = 0;
                  self.loading = false;
                  self.payinsList.reset();
                  self.getPayinsByStatus();
                  self.dialogs.success("PayIn entry is deattributed successfully.");
                }
              })
            }
          })
        }
      })
  }

  openImport() {
    var self = this;
    this.openedModal = this.dialogs.modal(this.importModal, { size: 'xlg' });
    this.openedModal.result.then(function() {
      self.importRows = [];
      self.payinsList.reset();
      this.getPayinsByStatus();
    }).catch(function(e) {
      self.importRows = [];
      self.payinsList.reset();
    })
  }

  importRows: any = [];
  onImportFileChange(event) {
    var self = this;
    this.loading = true;
    readXlsxFile(event.target.files[0], { sheet: 1 }).then((rows) => {
      // console.log("excel rows :: ", rows);
      rows.shift();
      var self = this;
      _.each(rows, function(r) {
        var date = r[0];
        // console.log("row date : ", parseExcelDate(date));
        self.importRows.push({
          date: parseExcelDate(date),
          narration: r[1],
          utr: r[2],
          amount: r[3],
        })
      })
      self.loading = false;
    })
  }

  savePayinRow(row) {
    let self = this;
    var data: any = {
      id: row.id,
      amount: row.amount,
      paymentMode: 'BankTransfer',
      utr: row.utr,
      narration: row.narration,
      receivedDate: Utils.ngbDateToDate(row.date),
      duplicateCheck: true
    }
    console.log("PayinEntryComponent ::: save :: payin data ", data);
    this.loading = false;
    this.service.savePayinEntry(data).pipe(take(1)).subscribe(
      res => {
        if (res['data']) {
          row.id = res['data']['id'];
          self.dialogs.success("PayinEntry of Rs. " + row.amount + " is updated. ");
          this.loading = false;
        } else {
          self.dialogs.error(res['error'], 'Error while saving')
        }
      },
      error => {
        self.dialogs.error(error, 'Error while saving')
      }
    )
  }

  confirmImport() {
    var self = this;
    _.each(this.importRows, function(row) {
      if (!row.id) {
        self.savePayinRow(row);
      }
    })
  }


  reasonModal: any;
  invoiceServices: any = [];
  @ViewChild('billReasonModal') billReasonModal: any;
  openBillReason() {
    var self = this;
    this.payin.reason = null;
    this.invoiceService = null;
    this.service.listInvoiceServices({ filters: {} })
      .pipe(take(1)).subscribe(res => {
        var data = res['data'];
        data = _.orderBy(data, 'category');
        _.each(data, function(i) {
          i.label = i.category + " - " + i.type
        })
        this.invoiceServices = data
      })
    this.reasonModal = this.dialogs.modal(this.billReasonModal, { size: 'md' });
    this.reasonModal.result.then(function() {
      self.payinsList.reset();
      self.getPayinsByStatus();
    }).catch(function(e) {
      // self.payinsList.reset();
    })
  }

  invoiceService: any;
  onInvoiceServiceSelected() {
    this.payin.reason = this.invoiceService.name + " Revenue";
    this.payin.invoiceServiceId = this.invoiceService.id;

    this.payin.attributed = 1;
    this.payin.status = "Attributed";
  }

  confirmReason() {
    this.loading = false;
    var self = this;
    var data = _.clone(this.payin);
    this.service.savePayinEntry(data).pipe(take(1)).subscribe(
      res => {
        if (res['data']) {
          this.dialogs.success("PayinEntry of Rs. " + data.amount + " is updated. ");
          this.loading = false;
          this.reasonModal.close();
          this.openedModal.close();
        } else {
          this.dialogs.error(res['error'], 'Error while saving')
        }
      },
      error => {
        this.dialogs.error(error, 'Error while saving')
      }
    )
  }
}
