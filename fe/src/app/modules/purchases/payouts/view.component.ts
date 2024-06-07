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
import { PurchasesService } from 'src/app/shared/services/purchases.service';
import { AdminService } from 'src/app/shared/services/admin.service';
import { Helpers } from '../../../helpers';
import * as _ from 'lodash';
import * as moment from 'moment';

@Component({
  selector: 'purchases-payouts',
  templateUrl: './view.component.html'
})
export class PurchasesPayoutComponent implements OnInit {
  payoutForm: FormGroup;
  rejectForm: FormGroup;
  paymentForm: FormGroup;

  selectedPayout: any = {};
  payout: any = {};
  payoutConfig: any = {};
  payoutsFilters: any = { types: ['VendorPayment'], paymentModes: [], statuses: ["Approved", "PrePaid"] };

  @ViewChild('payoutsList') payoutsList: any;
  @ViewChild('rejectMessageModal') rejectMessageModal: any;
  @ViewChild('submitPayoutModal') submitPayoutModal: any;
  @ViewChild('infoModal') infoModal: any;
  @ViewChild('changePaymentModal') changePaymentModal: any;
  @ViewChild('futurePayoutModal') futurePayoutModal: any;
  @ViewChild('vendorPaymentModal') vendorPaymentModal: any;

  search: any = new FormControl('');
  items: any = [];
  selectedItem: any = {};
  filters: any = {};
  loading: boolean = false;
  noResults: boolean = false;
  offset: number = 0;
  limit: number = 20;
  facilityFilters: any = {};
  facilitySetFilters: any = {};
  locationFilters: any = {};


  constructor(private dialogs: DialogsService, private service: PurchasesService, private accountsService: AccountsService,
    private adminService: AdminService, private commonService: CommonService) {
  }

  ngOnInit() {
    this.search.valueChanges
      .pipe(debounceTime(200))
      .subscribe(value => {
        this.payoutsFilters.search = value;
      });

    this.vendorReleaseAmountControl.valueChanges
      .pipe(debounceTime(200))
      .subscribe(value => {
        this.updateReleaseAmounts();
      });

    this.rejectForm = new FormGroup({
      rejectedMessage: new FormControl("", Validators.required)
    })
    this.payoutForm = new FormGroup({
      paymentMode: new FormControl("", Validators.required),
      paidOn: new FormControl("", Validators.required),
      utr: new FormControl("", Validators.required)
    })
    this.paymentForm = new FormGroup({
      paymentMode: new FormControl("", Validators.required),
      paidOn: new FormControl("", Validators.required),
    })
    var actions: any = [
      { icon: 'fa fa-search', hint: 'Open PO', code: 'openPO', style: 'info', condition: { label: 'purchaseOrderId', not: 'poid' } },
      { icon: 'fa fa-search', hint: 'View Bill', code: 'viewBill', style: 'info', condition: { label: 'providerBillId', not: 'billid' } },
      // { icon: 'fa fa-check', hint: 'Mark as Encashed', code: 'submitPayout', style: 'info', condition: { label: 'status', value: 'Issued' } },
      { icon: 'fa fa-info', hint: 'Show Info', code: 'showInfo', style: 'info', condition: { label: 'status', value: 'Paid' } },
      // { icon: 'fa fa-check', hint: 'Approve Payout', code: 'approvePayout', style: 'info', condition: { label: 'status', value: 'Pending' } },
      // { icon: 'fa fa-times', hint: 'Reject Payout', code: 'rejectPayout', style: 'danger', condition: { label: 'status', value: 'Pending' } },
      // { icon: 'fa fa-times', hint: 'Reject Payout', code: 'rejectPayout', style: 'danger', condition: { label: 'status', value: 'Approved' } },
      // { icon: 'fa fa-times', hint: 'Reject Payout', code: 'rejectPayout', style: 'danger', condition: { label: 'status', value: 'FuturePayout' } },
      // { icon: 'fa fa-search', hint: 'View Reject Message', code: 'showRejectMessage', style: 'warning', condition: { label: 'status', value: 'Rejected' } },
      // { icon: 'fa fa-refresh', hint: 'Change Payment Method', code: 'submitPayout', style: 'info', condition: { label: 'status', value: 'Approved' }, also: { label: 'paymentMode', value: 'CashFree' } },
      // { icon: 'fa fa-refresh', hint: 'Reset Error', code: 'resetError', style: 'primary', condition: { label: 'status', value: 'Error' } },
      // { icon: 'fa fa-dollar', hint: 'Process Payout', code: 'processPayout', style: 'primary', condition: { label: 'status', value: 'Approved' }, also: { label: 'paymentMode', value: 'CashFree' } },
      // { icon: 'fa fa-dollar', hint: 'Process Payout', code: 'processPayout', style: 'primary', condition: { label: 'status', value: 'FuturePayout' }, also: { label: 'paymentMode', value: 'CashFree' } },
      // { icon: 'fa fa-refresh', hint: 'Update Payout Status', code: 'updatePayoutStatus', style: 'primary', condition: { label: 'paymentStatus', value: 'PENDING' }, also: { label: 'paymentMode', value: 'CashFree' } },
      // { icon: 'i-Credit-Card', hint: 'Submit Payout Details', code: 'submitPayout', style: 'primary', condition: { label: 'status', value: 'Approved' }, also: { label: 'paymentMode', not: 'CashFree' } },
      // { icon: 'i-Credit-Card', hint: 'Submit Payout Details', code: 'submitPayout', style: 'primary', condition: { label: 'status', value: 'PrePaid' } },
      // { icon: 'i-Credit-Card', hint: 'Submit Payout Details', code: 'submitPayout', style: 'primary', condition: { label: 'status', value: 'FuturePayout' } },
      // { icon: 'i-Right', hint: 'Mark as FuturePayout', code: 'markFuturePayment', style: 'primary', condition: { label: 'status', value: 'Approved' } },
      // { icon: 'i-Right', hint: 'Mark as FuturePayout', code: 'markFuturePayment', style: 'primary', condition: { label: 'status', value: 'FuturePayout' } }
    ];

    if (this.commonService.checkAccess("accounts:markAsFuturePayout")) {
      actions.push({ icon: 'i-Right', hint: 'Mark as FuturePayout', code: 'markFuturePayment', style: 'primary', condition: { label: 'status', value: 'Approved' } });
      actions.push({ icon: 'i-Right', hint: 'Mark as FuturePayout', code: 'markFuturePayment', style: 'primary', condition: { label: 'status', value: 'FuturePayout' } });
    }
    if (this.commonService.checkAccess("accounts:rejectPayout")) {
      actions.push({ icon: 'fa fa-times', hint: 'Reject Payout', code: 'rejectPayout', style: 'danger', condition: { label: 'status', value: 'Pending' } });
      actions.push({ icon: 'fa fa-times', hint: 'Reject Payout', code: 'rejectPayout', style: 'danger', condition: { label: 'status', value: 'Approved' } });
      actions.push({ icon: 'fa fa-times', hint: 'Reject Payout', code: 'rejectPayout', style: 'danger', condition: { label: 'status', value: 'FuturePayout' } });
      actions.push({ icon: 'fa fa-search', hint: 'View Reject Message', code: 'showRejectMessage', style: 'warning', condition: { label: 'status', value: 'Rejected' } });
    }

    // console.log("PayoutComponent ::: actions ", actions);
    var self = this;
    setTimeout(function() {
      self.payoutConfig = {
        columns: [
          { label: 'Payout Towards', field: 'info', type: 'url', tooltip: 'benificiary', styleClass: 'w-15 fs-12', url: 'link', sortable: true },
          { label: 'Amount', field: 'amount', type: 'inr', styleClass: 'w-10 text-right', sortable: true },
          { label: 'Status', field: 'status', type: 'text', styleClass: 'w-10', sortable: true },
          // { label: 'ApprovedBy', field: 'approvedBy', type: 'text', styleClass: 'w-10' },
          { label: 'ApprovedOn', field: 'approvedOn', tooltip: 'approvedBy', type: 'date', styleClass: 'w-10 text-center', sortable: true },
          // { label: 'PaidBy', field: 'paidBy', type: 'text', styleClass: 'w-10' },
          { label: 'PaidOn', field: 'paidOn', tooltip: 'paidBy', type: 'date', styleClass: 'w-10 text-center', sortable: true },
          // { label: 'Type', field: 'type', type: 'text', styleClass: 'w-10 text-left', tooltip: 'subType', sortable: true },
          { label: 'Mode', field: 'paymentMode', type: 'text', styleClass: 'w-10 text-left', sortable: true },
          { label: 'UTR', field: 'utr', type: 'text', styleClass: 'w-15 text-center break-word', sortable: true },
        ],
        actions: actions,
        options: {
          debounceDelay: 500,
          actionStyleClass: 'w-10 icons-td text-center',
        }
      }
      console.log("PayoutComponent ::  payoutConfig: ", self.payoutConfig);
    }, 500);

    // this.payoutsFilters.startDate = moment().add(-1, 'months').startOf('month');
    // this.payoutsFilters.endDate = moment().endOf('month');
    var self = this;
    var picker: any = $('#daterangepicker');
    picker.daterangepicker({
      opens: 'left',
      autoUpdateInput: false,
      // startDate: this.payoutsFilters.startDate,
      // endDate: this.payoutsFilters.endDate,
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
      self.payoutsFilters.startDate = start.format('YYYY-MM-DD');
      self.payoutsFilters.endDate = end.format('YYYY-MM-DD');
    });
    picker.on('apply.daterangepicker', function(ev, picker) {
      $(this).val(picker.startDate.format('MM/DD/YYYY') + ' - ' + picker.endDate.format('MM/DD/YYYY'));
    });
    picker.on('cancel.daterangepicker', function(ev, picker) {
      $(this).val('');
      self.payoutsFilters.startDate = null;
      self.payoutsFilters.endDate = null;
    });

    this.getPayoutsByStatus();
  }
  clearDates() {
    $('#daterangepicker').val('');
    this.payoutsFilters.startDate = null;
    this.payoutsFilters.endDate = null;
  }

  statuses: any = [];
  totalPayouts: any = 0;
  getPayoutsByStatus() {
    this.accountsService.getPayoutsByStatus({
      paymentModes: this.payoutsFilters.paymentModes,
      types: this.payoutsFilters.types
    }).subscribe(res => {
      this.statuses = res['data']['statuses'];
      this.totalPayouts = _.sumBy(this.statuses, 'count');
    })
  }

  openedModal: any;
  openRejectMessageModal() {
    this.loading = false;
    this.openedModal = this.dialogs.modal(this.rejectMessageModal, { size: 'md' });
    var self = this;
    this.openedModal.result.then(function() {
      self.payout = {};
    }).catch(function(e) {
      self.payout = {};
    })
  }

  processPayout() {
    console.log("PayoutComponent ::: save :: payout ", this.payout);
    this.loading = true;
    let self = this;
    var data = {
      id: this.payout.id,
      process: true
    }
    this.accountsService.processPayout(data).pipe(take(1)).subscribe(
      res => {
        if (res['data']) {
          self.dialogs.success("Payout of Rs. " + this.payout.amount + "  for '" + this.payout.benificiary + "' is approved successfully ");
        } else {
          self.dialogs.error(res['error'], 'Error')
        }
        self.payoutsList.reset();
        this.loading = false;
      },
      error => {
        self.dialogs.error(error, 'Error while saving')
      }
    )
  }
  updatePayoutStatus() {
    console.log("PayoutComponent ::: save :: payout ", this.payout);
    this.loading = true;
    let self = this;
    var data = {
      id: this.payout.id,
    }
    this.accountsService.updatePayoutStatus(data).pipe(take(1)).subscribe(
      res => {
        if (res['data']) {
          self.payoutsList.reset();
        } else {
          self.dialogs.error(res['error'], 'Error')
        }
        this.loading = false;
      },
      error => {
        self.dialogs.error(error, 'Error while saving')
      }
    )
  }
  confirmPayout() {
    console.log("PayoutComponent ::: save :: payout ", this.payout);
    this.loading = true;
    let self = this;
    var data: any = {
      id: this.payout.id,
      paid: true,
      paymentMode: this.payout.paymentMode,
      pettyCashAccountId: this.payout.pettyCashAccountId,
      debitCardAccountId: this.payout.debitCardAccountId,
      utr: (this.payout.paymentMode != 'PettyCash' || this.payout.paymentMode != 'Cash') ? this.payout.utr : ('paid through ' + this.payout.paymentMode),
      paidOn: Utils.ngbDateToDate(this.payout.paidOn),
    }
    if (data.paymentMode == 'Cheque') {
      data.issuedOn = Utils.ngbDateToDate(this.payout.issuedOn);
      data.chequeNo = this.payout.chequeNo;
      data.utr = this.payout.utr;

      if (!data.paidOn || !data.utr) {
        data.paid = false;
      }
    }
    console.log("PayoutComponent ::: save :: payout data ", data);
    this.loading = false;
    this.accountsService.savePayout(data).pipe(take(1)).subscribe(
      res => {
        self.dialogs.success("Payout of Rs. " + this.payout.amount + "  for '" + this.payout.benificiary + "' is submitted successfully ");
        this.loading = false;
        self.payoutsList.reset();
        self.openedModal.close();
      },
      error => {
        self.dialogs.error(error, 'Error while saving')
      }
    )
  }
  approvePayout() {
    console.log("PayoutComponent ::: save :: payout ", this.payout);
    this.loading = true;
    let self = this;
    var data = {
      id: this.payout.id,
      approved: true
    }
    this.accountsService.savePayout(data).pipe(take(1)).subscribe(
      res => {
        self.dialogs.success("Payout of Rs. " + this.payout.amount + "  for '" + this.payout.benificiary + "' is approved successfully ");
        this.loading = false;
        self.payoutsList.reset();
      },
      error => {
        self.dialogs.error(error, 'Error while saving')
      }
    )
  }
  resetPayoutError() {
    console.log("PayoutComponent ::: save :: payout ", this.payout);
    this.loading = true;
    let self = this;
    var data = {
      id: this.payout.id,
      status: 'Approved'
    }
    this.accountsService.savePayout(data).pipe(take(1)).subscribe(
      res => {
        self.dialogs.success("Payout of Rs. " + this.payout.amount + "  for '" + this.payout.benificiary + "' is resetted successfully ");
        this.loading = false;
        self.payoutsList.reset();
      },
      error => {
        self.dialogs.error(error, 'Error while saving')
      }
    )
  }
  rejectPayout() {
    console.log("PayoutComponent ::: save :: payout ", this.payout);
    this.loading = true;
    let self = this;
    var data = {
      id: this.payout.id,
      status: "Rejected",
      rejectedMessage: this.payout.rejectedMessage
    }
    this.dialogs.confirm("Are you sure to Reject this Payout Item for " + self.payout.benificiary + " ? ")
      .then(function(flag) {
        if (flag) {
          self.accountsService.savePayout(data).pipe(take(1)).subscribe(
            res => {
              self.dialogs.success("Payout of Rs. " + self.payout.amount + "  for '" + self.payout.benificiary + "' is rejected .. ");
              self.loading = false;
              self.payoutsList.reset();
              self.openedModal.close();
            },
            error => {
              self.dialogs.error(error, 'Error while saving')
            }
          )
        }
      })
  }

  action(event) {
    console.log("PayoutComponent ::: action :: event ", event);
    if (event.action == 'approvePayout') {
      this.payout = _.clone(event.item);
      this.approvePayout();
    } else if (event.action == 'processPayout') {
      event.item.disabled = true;
      this.payout = event.item;
      this.processPayout();
    } else if (event.action == 'updatePayoutStatus') {
      this.payout = event.item;
      this.updatePayoutStatus();
    } else if (event.action == 'resetError') {
      this.payout = event.item;
      this.resetPayoutError();
    } else if (event.action == 'showInfo') {
      this.showInfo(event.item);
    } else if (event.action == 'submitPayout') {
      this.payout = _.clone(event.item);
      this.submitPayout();
    } else if (event.action == 'rejectPayout' || event.action == 'showRejectMessage') {
      this.payout = _.clone(event.item);
      this.openRejectMessageModal();
    } else if (event.action == 'openPO') {
      window.open("#/purchases/purchaseorder/" + event.item.purchaseOrderId, '_blank');
    } else if (event.action == 'viewBill') {
      this.dialogs.msg("This feature will come soon. You can hover on Benificiary Name to see details of month and building of this bill.")
    } else if (event.action == 'markFuturePayment') {
      // this.dialogs.confirm("Are you sure to mark " + event.item.benificiary + " payout as FuturePayout")
      //   .then(evt => {
      //     if (evt.value) {
      //       this.accountsService.savePayout({ id: event.item.id, status: 'FuturePayout' }).pipe(take(1))
      //         .subscribe(res => {
      //           if (res['data']) {
      //             this.payoutsList.reset();
      //           }
      //         })
      //     }
      //   })
      this.futureDays = null;
      this.payout = _.clone(event.item);
      this.openedModal = this.dialogs.modal(this.futurePayoutModal, { size: 'md' });
      var self = this;
      this.openedModal.result.then(function() {
        self.payout = {};
      }).catch(function(e) {
        self.payout = {};
      })
    }
  }

  showInfo(payout) {
    this.payout = payout;
    this.openedModal = this.dialogs.modal(this.infoModal, { size: 'md' });
    var self = this;
    this.openedModal.result.then(function() {
      self.payout = {};
    }).catch(function(e) {
      self.payout = {};
    })
  }
  submitPayout() {
    this.openedModal = this.dialogs.modal(this.submitPayoutModal, { size: 'lg' });
    var self = this;
    this.payout.issuedOn = Utils.dateToNgbDate(this.payout.issuedOn);
    this.payout.paidOn = Utils.dateToNgbDate(this.payout.paidOn);
    this.openedModal.result.then(function() {
      self.payout = {};
    }).catch(function(e) {
      self.payout = {};
    })
  }

  pettyCashAccounts: any;
  selectedPettyCashAccount: any;
  debitCardAccounts: any;
  selectedDebitCardAccount: any;
  paymentModeChanged() {
    console.log("paymentModeChanged :: paymentMode : ", this.payout.paymentMode)
    if (this.payout.paymentMode == 'Cheque') {
      this.payoutForm.addControl('issuedOn', new FormControl('', [Validators.required]));
      this.payoutForm.addControl('chequeNo', new FormControl('', [Validators.required]));
      this.payoutForm.removeControl('paidOn');
      this.payoutForm.removeControl('utr');
      this.payoutForm.addControl('paidOn', new FormControl(''));
      this.payoutForm.addControl('utr', new FormControl(''));
      delete this.payout.utr;
      delete this.payout.paidOn;
    } else {
      this.payoutForm.removeControl('issuedOn');
      this.payoutForm.removeControl('chequeNo');

      this.payoutForm.addControl('paidOn', new FormControl('', [Validators.required]));
      if (this.payout.paymentMode == 'Cash' || this.payout.paymentMode == 'Card') {
        this.payoutForm.removeControl('utr');
      } else {
        this.payoutForm.addControl('utr', new FormControl('', [Validators.required]));
      }
    }
    if (this.payout.paymentMode == 'PettyCash') {
      this.payoutForm.removeControl('utr');
      this.payoutForm.addControl('pettyCashAccountId', new FormControl('', [Validators.required]));
    } else {
      this.payoutForm.removeControl('pettyCashAccountId');
    }
    if (this.payout.paymentMode == 'CardPayment') {
      this.payoutForm.removeControl('utr');
      this.payoutForm.addControl('debitCardAccountId', new FormControl('', [Validators.required]));
    } else {
      this.payoutForm.removeControl('debitCardAccountId');
    }
    this.payoutForm.updateValueAndValidity();

    if (this.payout.paymentMode == 'PettyCash' && !this.pettyCashAccounts) {
      this.adminService.listPettyCashAccounts({ filters: { active: 1 } }).subscribe(res => {
        this.pettyCashAccounts = res['data'];
      })
    }
    if (this.payout.paymentMode == 'CardPayment' && !this.debitCardAccounts) {
      this.adminService.listDebitCardAccounts({ filters: { active: 1 } }).subscribe(res => {
        this.debitCardAccounts = res['data'];
      })
    }
  }


  futureDays: any;
  updateFuturePayoutDate() {
    this.payout.futurePayoutDate = Utils.dateToNgbDate(moment().add(this.futureDays, 'days').toDate());
  }
  saveFuturePayoutDate() {
    this.loading = true;
    this.accountsService.savePayout({
      id: this.payout.id,
      futurePayoutDate: Utils.ngbDateToMoment(this.payout.futurePayoutDate).toDate(),
      status: 'FuturePayout'
    }).subscribe(res => {
      if (res['data']) {
        this.futureDays = null;
        this.loading = false;
        this.openedModal.close();
        this.payoutsList.reset();
        this.getPayoutsByStatus();
      }
    })
  }


  openVendorPaymentModal() {
    this.loading = false;
    this.openedModal = this.dialogs.modal(this.vendorPaymentModal, { size: 'xlg' });
    var self = this;
    this.vendorPurchaseOrders = [];
    this.selectedVendor = null;
    this.selectedVendors = [];
    this.openedModal.result.then(function() {
      self.payout = {};
    }).catch(function(e) {
      self.payout = {};
    })
  }

  vendorControl = new FormControl([]);
  vendorReleaseAmountControl = new FormControl();
  autocompleteVendors: any = [];
  selectedVendors: any = [];
  onVendorSearch(text: any) {
    var data = { filters: { search: text, status: 'Empanelled', active: 1 } }
    return this.service.listVendors(data).pipe(take(1)).subscribe(
      res => {
        this.autocompleteVendors = res['data'];
      })
  }

  selectedVendor: any;
  vendorPaymentTerms: any = [];
  selectedPaymentTerm: any;
  vendorReleaseAmount: any = 0;
  vendorSelected(event) {
    console.log("Vendor Selected :: ", event);
    this.selectedVendor = event;
    this.listVendorPendingMilestones();
  }

  vendorPurchaseOrders: any = [];
  listVendorPendingMilestones() {
    this.loading = true;
    this.service.listVendorPendingMilestones({ vendorId: this.selectedVendor.id }).subscribe(res => {
      if (res['data']) {
        this.vendorPurchaseOrders = res['data'];
      }
      this.loading = false;
    })
  }

  updateReleaseAmounts() {
    var self = this;
    var amountToRelease = this.vendorReleaseAmount;
    _.each(this.vendorPurchaseOrders, function(p) {
      if (amountToRelease > 0) {
        if (amountToRelease > p.confirmedAmount) {
          p.releaseAmount = p.confirmedAmount;
        } else {
          p.releaseAmount = amountToRelease;
        }
        amountToRelease = amountToRelease - p.releaseAmount;
      } else {
        p.releaseAmount = 0;
      }
    })
  }

  confirmVendorMilestoneApprovals() {
    var pos = _.filter(this.vendorPurchaseOrders, function(p) { return p.releaseAmount && p.releaseAmount > 0; })
    var releaseAmount = _.sumBy(pos, 'releaseAmount');
    if (releaseAmount > 0) {
      this.loading = true;
      this.service.confirmVendorMilestoneApprovals({ pos: pos }).subscribe(res => {
        if (res['data']) {
          this.dialogs.success(this.selectedVendor.name + " " + pos.length + "  payouts are approved for Payouts .!")
          this.payoutsList.reset();
          this.vendorPurchaseOrders = [];
          this.selectedVendor = null;
          this.selectedVendors = [];
        }
        this.loading = false;
      })
    } else {
      this.dialogs.msg("Please make sure to have release amounts for each PO", "error");
    }
  }

}
