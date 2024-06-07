import { Component, OnInit, ViewChild, NgModule } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { debounceTime, take } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from "@angular/common/http";
import { DialogsService } from 'src/app/shared/services/dialogs.services';
import { DataLayerService } from 'src/app/shared/services/data-layer.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { AdminService } from 'src/app/shared/services/admin.service';
import { PurchasesService } from 'src/app/shared/services/purchases.service';
import { AccountsService } from 'src/app/shared/services/accounts.service';
import { UploadService } from 'src/app/shared/services/upload.service';
import { Helpers } from '../../../helpers';
import * as _ from 'lodash';
import * as moment from 'moment';

@Component({
  selector: 'vendor-view',
  templateUrl: './view.component.html'
})
export class VendorViewComponent implements OnInit {
  selectedSku = new FormControl([]);
  searchControl: FormControl = new FormControl();

  vendorContactForm: FormGroup;
  vendorBankAccountForm: FormGroup;
  vendorPaymentTermForm: FormGroup;
  vendorSkuForm: FormGroup;

  vendorContactsFilters: any = {};
  vendorBankAccountsFilters: any = {};
  vendorPaymentTermsFilters: any = {};
  vendorSkusFilters: any = { skus: true };
  vendorServicesFilters: any = { opexTypes: true };
  vendorHOServicesFilters: any = { opexTypes: true, office: 1 };
  vendorPaymentsFilters: any = {};
  vendorWorkOrdersFilters: any = {};
  vendorPurchaseOrdersFilters: any = {};

  vendorContactsConfig: any = {};
  vendorBankAccountsConfig: any = {};
  vendorPaymentTermsConfig: any = {};
  vendorSkusConfig: any = {};
  vendorPaymentsConfig: any = {};
  vendorWorkOrdersConfig: any = {};
  vendorPurchaseOrdersConfig: any = {};

  id: any = 1;
  user: any = {};

  @ViewChild('vendorContactsList') vendorContactsList: any;
  @ViewChild('vendorBankAccountsList') vendorBankAccountsList: any;
  @ViewChild('vendorPaymentTermsList') vendorPaymentTermsList: any;
  @ViewChild('vendorSkusList') vendorSkusList: any;
  @ViewChild('vendorPaymentsList') vendorPaymentsList: any;
  @ViewChild('vendorWorkOrdersList') vendorWorkOrdersList: any;
  @ViewChild('vendorPurchaseOrdersList') vendorPurchaseOrdersList: any;

  @ViewChild('rejectedMessageModal') rejectedMessageModal: any;
  @ViewChild('vendorContactModal') vendorContactModal: any;
  @ViewChild('vendorBankAccountModal') vendorBankAccountModal: any;
  @ViewChild('vendorPaymentTermModal') vendorPaymentTermModal: any;
  @ViewChild('vendorSkuModal') vendorSkuModal: any;
  @ViewChild('expensesModal') expensesModal: any;

  vendor: any = { contact: {} };
  loading: boolean = false;

  viewObservable: Observable<any[]>;
  vendorContactPurposes: any = [];
  vendorContactDesignations: any = [];

  constructor(private route: ActivatedRoute, private dialogs: DialogsService, private service: PurchasesService, private accountsService: AccountsService,
    private commonService: CommonService, private adminService: AdminService, private uploadService: UploadService) {

    this.vendorContactPurposes = this.commonService.values.vendorContactPurposes;
    this.vendorContactDesignations = this.commonService.values.vendorContactDesignations;
    this.id = this.route.snapshot.params['id'];
    this.vendorContactsFilters = { vendorId: this.id };
    this.vendorBankAccountsFilters = { vendorId: this.id };
    this.vendorPaymentTermsFilters = { vendorId: this.id };
    this.vendorSkusFilters.vendorId = parseInt(this.id);
    this.vendorServicesFilters.vendorId = parseInt(this.id);
    this.vendorHOServicesFilters.vendorId = parseInt(this.id);
    this.vendorPaymentsFilters = { vendorId: this.id };
    this.vendorWorkOrdersFilters = { vendorId: this.id };
    this.vendorPurchaseOrdersFilters = { vendorId: this.id };
  }

  ngOnInit() {
    this.vendorContactForm = new FormGroup({
      name: new FormControl("", Validators.required),
      phone: new FormControl("", Validators.compose([
        Validators.required,
        Validators.pattern('^[6,7,8,9][0-9]{9}$')
      ])),
      // email: new FormControl("", Validators.compose([
      //   Validators.required,
      //   Validators.email
      // ])), 
      email: new FormControl(""),
      designation: new FormControl(""),
    });

    this.vendorBankAccountForm = new FormGroup({
      bankName: new FormControl("", Validators.required),
      accountNumber: new FormControl("", Validators.required),
      benificiaryName: new FormControl("", Validators.required),
      ifscCode: new FormControl("", Validators.required),
      bankBranch: new FormControl("", Validators.required),
    });

    this.vendorSkuForm = new FormGroup({
      // skuId: new FormControl("", Validators.required),
      paymentTermId: new FormControl("", Validators.required)
    });

    this.vendorPaymentTermForm = new FormGroup({
      name: new FormControl("", Validators.required),
      onAdvance: new FormControl("", Validators.required),
      onDelivery: new FormControl("", Validators.required),
      onFinish: new FormControl("", Validators.required),
      inProgress: new FormControl("", Validators.required),
      afterFinish: new FormControl("", Validators.required),
    });

    this.vendorContactsConfig = {
      columns: [
        { label: 'Name', field: 'name', type: 'text', styleClass: 'w-20', sortable: true },
        { label: 'Phone', field: 'phone', type: 'text', styleClass: 'w-10', sortable: true },
        { label: 'Email', field: 'email', type: 'text', styleClass: 'w-20', sortable: true },
        { label: 'Designation', field: 'designation', type: 'text', styleClass: 'w-20', sortable: true },
        { label: 'Active', field: 'active', type: 'boolean', styleClass: 'w-5 text-center', sortable: true },
        { label: 'Verified', field: 'verified', type: 'boolean', styleClass: 'w-5 text-center', sortable: true },
        { label: 'AddedOn', field: 'date', type: 'date', styleClass: 'w-10 text-center', sortable: true },
      ],
      actions: [
        { icon: 'fa fa-pencil', hint: 'Edit Contact', code: 'editVendorContact', style: 'info' },
        // { icon: 'fa fa-refresh', hint: 'Resend Verification Mail', code: 'resendVerificationMail', style: 'info' },
        // { icon: 'fa fa-search', hint: 'View', code: 'viewVendorContact', style: 'info' }
      ],
      options: {
        debounceDelay: 0,
        actionStyleClass: 'w-5 icons-td text-center',
      }
    }
    this.vendorBankAccountsConfig = {
      columns: [
        { label: 'Bank Name', field: 'bankName', type: 'text', styleClass: 'w-15', sortable: true },
        { label: 'Benificiary', field: 'benificiaryName', type: 'text', styleClass: 'w-15', sortable: true },
        { label: 'Account Number', field: 'accountNumber', type: 'text', styleClass: 'w-15', sortable: true },
        { label: 'IFSC Code', field: 'ifscCode', type: 'text', styleClass: 'w-10', sortable: true },
        { label: 'Bank Branch', field: 'bankBranch', type: 'text', styleClass: 'w-15', sortable: true },
        { label: 'Active', field: 'active', type: 'boolean', styleClass: 'w-5 text-center', sortable: true },
        { label: 'Verified', field: 'verified', type: 'boolean', styleClass: 'w-5 text-center', sortable: true },
        { label: 'AddedOn', field: 'date', type: 'date', styleClass: 'w-10 text-center', sortable: true },
      ],
      actions: [
        { icon: 'fa fa-pencil', hint: 'Edit BankAccount', code: 'editVendorBankAccount', style: 'info' },
        // { icon: 'fa fa-search', hint: 'View', code: 'viewVendorContact', style: 'info' }
      ],
      options: {
        debounceDelay: 0,
        actionStyleClass: 'w-5 icons-td text-center',
      }
    }
    this.vendorPaymentTermsConfig = {
      columns: [
        { label: 'Name', field: 'name', type: 'text', styleClass: 'w-20', sortable: true },
        { label: 'OnAdvance(%)', field: 'onAdvance', type: 'text', styleClass: 'w-10 text-center', sortable: true },
        { label: 'OnDelivery(%)', field: 'onDelivery', type: 'text', styleClass: 'w-10 text-center', sortable: true },
        { label: 'InProgress(%)', field: 'inProgress', type: 'text', styleClass: 'w-10 text-center', sortable: true },
        { label: 'OnFinish(%)', field: 'onFinish', type: 'text', styleClass: 'w-10 text-center', sortable: true },
        { label: 'AfterFinish(%)', field: 'afterFinish', type: 'text', styleClass: 'w-10 text-center', sortable: true },
        { label: 'Active', field: 'active', type: 'boolean', styleClass: 'w-5 text-center', sortable: true },
        // { label: 'Accepted', field: 'verified', type: 'boolean', styleClass: 'w-5 text-center', sortable: true },
        // { label: 'AddedOn', field: 'date', type: 'date', styleClass: 'w-10 text-center', sortable: true },
      ],
      actions: [
        { icon: 'fa fa-pencil', hint: 'Edit PaymentTerm', code: 'editVendorPaymentTerm', style: 'info' },
        // { icon: 'fa fa-search', hint: 'View', code: 'viewVendorContact', style: 'info' }
      ],
      options: {
        debounceDelay: 0,
        actionStyleClass: 'w-5 icons-td text-center',
      }
    }
    this.vendorSkusConfig = {
      columns: [
        { label: 'Category', field: 'category', type: 'text', styleClass: 'w-15', sortable: true },
        { label: 'Type', field: 'type', type: 'text', styleClass: 'w-15', sortable: true },
        { label: 'Item', field: 'sku', type: 'text', styleClass: 'w-20', sortable: true },
        { label: 'Min Price', field: 'minPrice', type: 'text', styleClass: 'w-10', sortable: true },
        { label: 'Max Price', field: 'maxPrice', type: 'text', styleClass: 'w-10', sortable: true },
        { label: 'Active', field: 'active', type: 'boolean', styleClass: 'w-5 text-center', sortable: true },
        { label: 'Status', field: 'status', type: 'text', styleClass: 'w-5 text-center', sortable: true },
        { label: 'AddedOn', field: 'date', type: 'date', styleClass: 'w-10 text-center', sortable: true },
      ],
      actions: [
        { icon: 'fa fa-pencil', hint: 'Edit Item Pricing', code: 'editVendorSku', style: 'info', condition: { label: 'status', not: 'Rejected' } },
        { icon: 'fa fa-search', hint: 'View Reject Message', code: 'viewRejectedMessage', style: 'info', condition: { label: 'status', value: 'Rejected' } }
      ],
      options: {
        debounceDelay: 0,
        actionStyleClass: 'w-5 icons-td text-center',
      }
    }
    this.vendorPaymentsConfig = {
      columns: [
        { label: 'Project/Building', field: 'purchaseOrder.project.title', ifNull: 'purchaseOrder.building.name', ifValueNull: "HO", type: 'text', styleClass: 'w-25', sortable: true },
        { label: 'PO RefNo', field: 'purchaseOrder.refNo', type: 'text', styleClass: 'w-15', sortable: true },
        { label: 'MileStone', field: 'name', type: 'text', styleClass: 'w-30', sortable: true },
        { label: 'Amount', field: 'amount', type: 'inr', styleClass: 'w-10 text-right', sortable: true },
        { label: 'Status', field: 'status', type: 'text', styleClass: 'w-5 text-center', sortable: true },
        { label: 'Date', field: 'paidOn', type: 'date', styleClass: 'w-10 text-center', sortable: true },
      ],
      actions: [
        { icon: 'fa fa-search', hint: 'View PO', code: 'viewPaymentPO', style: 'info' }
      ],
      options: {
        debounceDelay: 0,
        actionStyleClass: 'w-5 icons-td text-center',
      }
    }
    this.vendorWorkOrdersConfig = {
      columns: [
        { label: 'Project', field: 'project.title', type: 'text', styleClass: 'w-40', sortable: true },
        { label: 'RefNo', field: 'refNo', type: 'text', styleClass: 'w-15 text-center', sortable: true },
        { label: 'ProposedBy', field: 'proposedBy', type: 'text', styleClass: 'w-10 text-center', sortable: true },
        { label: 'ProposedOn', field: 'proposedOn', type: 'date', styleClass: 'w-10 text-center', sortable: true },
        { label: 'Budget', field: 'budget', type: 'inr', styleClass: 'w-10 text-center', sortable: true },
        { label: 'Status', field: 'status', type: 'text', styleClass: 'w-10 text-center', sortable: true },
      ],
      actions: [
        { icon: 'i-Magnifi-Glass1', hint: 'View', code: 'viewWorkOrder', style: 'info' },
      ],
      options: {
        debounceDelay: 500,
        actionStyleClass: 'w-5 icons-td text-center',
      }
    }
    this.vendorPurchaseOrdersConfig = {
      columns: [
        { label: 'Project/Building', field: 'project.title', ifNull: 'building.name', ifValueNull: "HO", type: 'text', styleClass: 'w-40', sortable: true },
        { label: 'RefNo', field: 'refNo', type: 'text', styleClass: 'w-15 text-left', sortable: true },
        { label: 'Approved By', field: 'approvedBy', type: 'text', styleClass: 'w-10 text-left', sortable: true },
        { label: 'Raised On', field: 'date', type: 'date', styleClass: 'w-10 text-right', sortable: true },
        { label: 'Amount', field: 'amount', type: 'inr', styleClass: 'w-10 text-right', sortable: true },
        { label: 'Status', field: 'status', type: 'text', styleClass: 'w-10 text-center', sortable: true },
      ],
      actions: [
        { icon: 'i-Magnifi-Glass1', hint: 'View', code: 'viewPurchaseOrder', style: 'info' },
      ],
      options: {
        debounceDelay: 500,
        actionStyleClass: 'w-5 icons-td text-center',
      }
    }

    this.getVendor();
  }

  getVendor() {
    this.loading = true;
    this.service.getVendor(this.id).pipe(take(1)).subscribe(
      res => {
        if (res['data']) {
          this.vendor = res['data'];
        } else {
          this.dialogs.error("Vendor not exist with given ID", 'No Vendor')
        }
        this.loading = false;
      },
      error => {
        this.dialogs.error(error, 'Error while saving')
      }
    )
  }

  openedModal: any;
  openVendorContact(vendorContact?: any) {
    this.vendorContact = vendorContact;
    this.openedModal = this.dialogs.modal(this.vendorContactModal, { size: 'lg' });
    var self = this;
    this.openedModal.result.then(function() {
      self.vendorContact = {};
      self.loading = false;
      self.vendorContactForm.reset();
    }).catch(function(e) {
      self.vendorContact = {};
      self.loading = false;
      self.vendorContactForm.reset();
    })
  }
  vendorContact: any = {};
  saveVendorContact() {
    console.log("LeadCOmponent ::: saveVendorContact :: vendorContact : ", this.vendorContact);
    this.vendorContact.vendorId = this.id;
    this.service.saveVendorContact(this.vendorContact).pipe(take(1)).subscribe(
      res => {
        this.dialogs.success("Vendor Contact is saved successfully ");
        this.loading = false;
        this.vendorContactsList.reset();
        this.openedModal && this.openedModal.dismiss();
      },
      error => {
        this.dialogs.error(error, 'Error while saving')
      }
    )
  }

  openVendorBankAccount(vendorBankAccount?: any) {
    this.vendorBankAccount = vendorBankAccount;
    this.openedModal = this.dialogs.modal(this.vendorBankAccountModal, { size: 'md' });
    var self = this;
    this.openedModal.result.then(function() {
      self.vendorBankAccount = {};
      self.loading = false;
      self.vendorBankAccountForm.reset();
    }).catch(function(e) {
      self.vendorBankAccount = {};
      self.loading = false;
      self.vendorBankAccountForm.reset();
    })
  }
  vendorBankAccount: any = {};

  saveVendorBankAccount() {
    this.loading = true;
    console.log("LeadCOmponent ::: saveVendorContact :: vendorBankAccount : ", this.vendorBankAccount);
    this.vendorBankAccount.vendorId = this.id;
    this.service.saveVendorBankAccount(this.vendorBankAccount).pipe(take(1)).subscribe(
      res => {
        this.dialogs.success("Vendor BankAccount is saved successfully ");
        this.loading = false;
        this.vendorBankAccountsList.reset();
        this.openedModal && this.openedModal.dismiss();
      },
      error => {
        this.dialogs.error(error, 'Error while saving')
      }
    )
  }

  validPaymentTerm: any = false;
  openVendorPaymentTerm(vendorPaymentTerm?: any) {
    this.vendorPaymentTerm = vendorPaymentTerm;
    try {
      if (vendorPaymentTerm.inProgressStages) {
        this.inProgressStages = JSON.parse(vendorPaymentTerm.inProgressStages);
      }
    } catch (e) { }
    try {
      if (vendorPaymentTerm.afterFinishStages) {
        this.afterFinishStages = JSON.parse(vendorPaymentTerm.afterFinishStages);
      }
    } catch (e) { }
    this.openedModal = this.dialogs.modal(this.vendorPaymentTermModal, { size: 'md' });
    this.checkPaymentTermValidity();
    var self = this;
    this.openedModal.result.then(function() {
      self.vendorPaymentTerm = {};
      self.loading = false;
      self.validPaymentTerm = false;
      self.vendorPaymentTermForm.reset();
    }).catch(function(e) {
      self.vendorPaymentTerm = {};
      self.loading = false;
      self.validPaymentTerm = false;
      self.vendorPaymentTermForm.reset();
    })
  }

  inProgressStages: any = [];
  afterFinishStages: any = [];
  checkPaymentTermValidity() {
    var total = (this.vendorPaymentTerm.onAdvance || 0) + (this.vendorPaymentTerm.onDelivery || 0) + (this.vendorPaymentTerm.onFinish || 0) +
      (this.vendorPaymentTerm.inProgress || 0) + (this.vendorPaymentTerm.afterFinish || 0);
    if (total == 100) {
      this.validPaymentTerm = true;
    } else {
      this.validPaymentTerm = false;
    }

    if (this.vendorPaymentTerm.inProgress > 0 && this.inProgressStages.length == 0) {
      this.inProgressStages.push({ payment: this.vendorPaymentTerm.inProgress, workProgress: 100 });
      this.inProgressStages.push({ payment: this.vendorPaymentTerm.inProgress, workProgress: 0 });
      this.inProgressStages.push({ payment: 0, workProgress: 0 });

    } else if (!this.vendorPaymentTerm.inProgress && this.inProgressStages.length) {
      this.inProgressStages = [];
    }
    if (this.vendorPaymentTerm.afterFinish > 0 && this.afterFinishStages.length == 0) {
      this.afterFinishStages.push({ payment: 100, days: 30 });
      this.afterFinishStages.push({ payment: 0, days: 0 });
      this.afterFinishStages.push({ payment: 0, days: 0 });
    } else if (!this.vendorPaymentTerm.afterFinish && this.afterFinishStages.length) {
      this.afterFinishStages = [];
    }
  }

  vendorPaymentTerm: any = {};
  saveVendorPaymentTerm() {
    console.log("LeadCOmponent ::: saveVendorContact :: vendorPaymentTerm : ", this.vendorPaymentTerm);
    this.vendorPaymentTerm.vendorId = this.id;
    var vendorPaymentTerm = _.clone(this.vendorPaymentTerm);
    vendorPaymentTerm.inProgressStages = JSON.stringify(this.inProgressStages);
    vendorPaymentTerm.afterFinishStages = JSON.stringify(this.afterFinishStages);
    this.service.saveVendorPaymentTerm(vendorPaymentTerm).pipe(take(1)).subscribe(
      res => {
        this.dialogs.success("Vendor PaymentTerm is saved successfully ");
        this.loading = false;
        this.vendorPaymentTermsList.reset();
        this.openedModal && this.openedModal.dismiss();
      },
      error => {
        this.dialogs.error(error, 'Error while saving')
      }
    )
  }
  sendVendorVerificationMail() {
    this.loading = true;
    this.service.sendVendorVerificationMail(this.vendor.id).pipe(take(1)).subscribe(
      res => {
        this.dialogs.success("Vendor Verification mail has sent successfully ");
        this.loading = false;
      },
      error => {
        this.dialogs.error(error, 'Error while saving')
      }
    )
  }

  hasPendingSkuAcceptance: any = false;
  onSkuPricingsUpdates() {
    var skus = this.vendorSkusList.getItems();
    var pendingSkus = _.filter(skus, { status: 'Draft' });
    this.hasPendingSkuAcceptance = pendingSkus.length ? true : false;
  }
  sendVendorSKUsPricingMail() {
    this.loading = true;
    this.service.sendVendorSKUsPricingMail({ vendorId: this.vendor.id }).pipe(take(1)).subscribe(
      res => {
        this.dialogs.success("Vendor SKU Price Acceptance mail has sent successfully ");
        this.loading = false;
      },
      error => {
        this.dialogs.error(error, 'Error while saving')
      }
    )
  }

  finishPaymentPricing(paymentTerm) {
    this.paymentTerms.push({ prices: [{ minQty: 1 }] });
    this.priceAdded = true;
    paymentTerm.done = true;
    paymentTerm.prices.pop();
    this.vendorPaymentTerms = _.without(this.vendorPaymentTerms, paymentTerm.paymentTerm)
  }

  deletePricing(paymentTerm) {
    this.paymentTerms = _.without(this.paymentTerms, paymentTerm);
    if (this.paymentTerms.length == 0) {
      this.paymentTerms = [{ prices: [{ minQty: 1 }] }];
    }
    this.vendorPaymentTerms.push(paymentTerm.paymentTerm);
  }

  priceAdded: any = false;
  selectedSkus: any = [];
  vendorPaymentTerms: any = [];
  allVendorPaymentTerms: any = [];
  paymentTerms: any = [{ prices: [{ minQty: 1 }] }];
  openVendorSku() {
    this.service.listVendorPaymentTerms({ filters: { vendorId: this.id } }).pipe(take(1)).subscribe(
      res => {
        var terms = res['data'];
        var self = this;
        self.vendorPaymentTerms = [];

        _.each(terms, function(t) {
          self.vendorPaymentTerms.push({ id: t.id, name: t.name })
        })
        this.allVendorPaymentTerms = this.vendorPaymentTerms;

        _.each(this.paymentTerms, function(p) {
          if (p.paymentTermId) {
            p.paymentTerm = _.find(self.allVendorPaymentTerms, { id: parseInt(p.paymentTermId) });
            p.done = true;
          }
        })
      })

    this.openedModal = this.dialogs.modal(this.vendorSkuModal, { size: 'lg' });
    var self = this;
    this.openedModal.result.then(function() {
      self.loading = false;
      self.priceAdded = false;
      self.selectedSkus = [];
      self.paymentTerms = [{ prices: [{ minQty: 1 }] }];
    }).catch(function(e) {
      self.loading = false;
      self.priceAdded = false;
      self.selectedSkus = [];
      self.paymentTerms = [{ prices: [{ minQty: 1 }] }];
    })
  }

  vendorSku: any = {};
  saveVendorSku() {
    var pricings = [];
    _.each(this.paymentTerms, function(pt) {
      if (pt.paymentTerm) {
        _.each(pt.prices, function(p) {
          pricings.push({
            id: p.id,
            paymentTermId: pt.paymentTerm.id,
            minQty: p.minQty,
            maxQty: p.maxQty,
            price: p.price,
            active: 1
          })
        })
      }
    })
    var vendorSku = {
      id: this.vendorSku.id,
      vendorId: this.id,
      skuId: this.selectedSkus[0].skuId,
      minPrice: _.minBy(pricings, 'price').price,
      maxPrice: _.maxBy(pricings, 'price').price,
      active: this.selectedSkus[0].active,
      pricings: pricings
    }
    console.log("LeadCOmponent ::: saveVendorContact :: vendorSku : ", vendorSku);
    this.loading = true;
    this.service.saveVendorSku(vendorSku).pipe(take(1)).subscribe(
      res => {
        this.dialogs.success("Vendor Sku is saved successfully ");
        this.loading = false;
        this.vendorSkusList.reset();
        this.openedModal && this.openedModal.dismiss();
      },
      error => {
        this.dialogs.error(error, 'Error while saving')
      }
    )
  }

  autocompleteSkus: any = [];
  onSKuSearch(text: any) {
    if (text != "") {
      var data = { filters: { search: text, typesearch: true } }
      return this.service.searchSkus(data).pipe(take(1)).subscribe(
        res => {
          this.autocompleteSkus = res['data'];
        })
    }
  }

  rejectedMessage;
  action(event) {
    console.log("LocationsComponent ::: action :: event ", event);
    if (event.action == 'editVendorContact') {
      this.vendorContact = _.clone(event.item);
      this.openVendorContact(this.vendorContact);

    } if (event.action == 'resendVerificationMail') {
      this.vendorContact = _.clone(event.item);
      this.openVendorContact(this.vendorContact);

    } else if (event.action == 'editVendorBankAccount') {
      this.vendorBankAccount = _.clone(event.item);
      this.openVendorBankAccount(this.vendorBankAccount);

    } else if (event.action == 'viewRejectedMessage') {
      this.rejectedMessage = event.item.rejectedMessage;
      this.dialogs.modal(this.rejectedMessageModal, { size: 'md' });

    } else if (event.action == 'viewPaymentPO') {
      window.open("#/purchases/purchaseorder/" + event.item.purchaseOrder.id, '_blank');

    } else if (event.action == 'viewPurchaseOrder') {
      window.open("#/purchases/purchaseorder/" + event.item.id, '_blank');
      
    } else if (event.action == 'editVendorPaymentTerm') {
      this.vendorPaymentTerm = _.clone(event.item);
      this.openVendorPaymentTerm(this.vendorPaymentTerm);
    } else if (event.action == 'editVendorSku') {
      var vendorSku = _.clone(event.item);
      this.vendorSku = vendorSku;
      this.priceAdded = true;
      this.selectedSkus = [{
        id: vendorSku.id,
        skuId: vendorSku.skuId,
        sku: vendorSku.sku.name,
        category: vendorSku.sku.category.name,
        type: vendorSku.sku.type.name,
        active: vendorSku.active
      }];
      this.paymentTerms = [{ prices: [{ minQty: 1 }] }];
      var pricings = [];
      _.each(vendorSku.pricings, function(p) {
        var price = {
          id: p.id,
          vendorSkuId: p.vendorskuId,
          paymentTermId: p.paymentTermId,
          minQty: p.minQty,
          maxQty: p.maxQty,
          price: p.price,
        };
        pricings.push(price);
      })
      pricings = _(pricings)
        .groupBy(x => x.paymentTermId)
        .map((value, key) => ({ paymentTermId: key, prices: value }))
        .value();

      var self = this;
      this.paymentTerms = pricings;
      this.openVendorSku();
    }
  }

  opexCategories: any = [];
  isHo: any = false;
  opexCategory: any;
  opexType: any;
  opexItem: any;
  openVendorServices(ho?) {
    this.isHo = ho;
    this.opexCategory = null;
    this.opexType = null;
    this.opexItem = null;
    var data = { office: ho };
    this.accountsService.getOpexCategories(data)
      .pipe(take(1)).subscribe(res => {
        this.opexCategories = res['data'];
      })
    this.openedModal = this.dialogs.modal(this.expensesModal, { size: 'md' });
  }

  saveVendorService() {
    var vendorSku = {
      vendorId: this.id,
      opexTypeId: this.opexType.id,
      active: 1,
      status:"Approved"
    }
    if (this.opexItem) {
      vendorSku.opexTypeId = this.opexItem.id;
    }
    console.log("VendorsComponent ::: saveVendorService :: vendorSku : ", vendorSku);
    this.loading = true;
    this.service.saveVendorSku(vendorSku).pipe(take(1)).subscribe(
      res => {
        this.dialogs.success("Vendor Service is saved successfully ");
        this.loading = false;
        this.vendorSkusList.reset();
        this.openedModal && this.openedModal.dismiss();
      },
      error => {
        this.dialogs.error(error, 'Error while saving')
      }
    )
  }


  idProofFile: any;
  idProofFileChange(event) {
    this.idProofFile = event.target.files[0];
  }
  idProofUploadResponse: any = { status: '', message: '', filePath: '' };
  idProofFileError: any;
  uploadIdProofFile() {
    const formData = new FormData();
    formData.append('file', this.idProofFile);

    this.loading = true;
    this.uploadService.upload(formData).subscribe(
      (res) => {
        this.idProofUploadResponse = res;
        if (res.file) {
          this.loading = false;
          this.vendorContact.idProof = res;
          this.vendorContact.idProofId = res.id;
          this.dialogs.success("ID Proof uploaded successfully..!!")
        }
      },
      (err) => this.idProofFileError = err
    );
  }

  addressProofFile: any;
  addressProofFileChange(event) {
    this.addressProofFile = event.target.files[0];
  }
  addressProofUploadResponse: any = { status: '', message: '', filePath: '' };
  addressProofFileError: any;
  uploadAddressProofFile() {
    const formData = new FormData();
    formData.append('file', this.addressProofFile);

    this.loading = true;
    this.uploadService.upload(formData).subscribe(
      (res) => {
        this.addressProofUploadResponse = res;
        if (res.file) {
          this.loading = false;
          this.vendorContact.addressProof = res;
          this.vendorContact.addressProofId = res.id;
          this.dialogs.success("Address Proof uploaded successfully..!!")
        }
      },
      (err) => this.addressProofFileError = err
    );
  }


  gstFile: any;
  gstFileChange(event) {
    this.gstFile = event.target.files[0];
  }
  gstUploadResponse: any = { status: '', message: '', filePath: '' };
  gstFileError: any;
  uploadGstFile() {
    const formData = new FormData();
    formData.append('file', this.gstFile);
    this.loading = true;
    this.uploadService.upload(formData).subscribe(
      (res) => {
        this.gstUploadResponse = res;
        if (res.file) {
          this.loading = false;
          this.vendor.gstFile = res;
          this.vendor.gstId = res.id;
          this.service.saveVendor({ id: this.vendor.id, gstId: res.id })
            .pipe(take(1)).subscribe(res => this.dialogs.success("GST uploaded successfully..!!"))
        }
      },
      (err) => this.gstFileError = err
    );
  }

  panFile: any;
  panFileChange(event) {
    this.panFile = event.target.files[0];
  }
  panUploadResponse: any = { status: '', message: '', filePath: '' };
  panFileError: any;
  uploadPanFile() {
    const formData = new FormData();
    formData.append('file', this.panFile);
    this.loading = true;
    this.uploadService.upload(formData).subscribe(
      (res) => {
        this.panUploadResponse = res;
        if (res.file) {
          this.loading = false;
          this.vendor.panFile = res;
          this.vendor.panId = res.id;
          this.service.saveVendor({ id: this.vendor.id, panId: res.id })
            .pipe(take(1)).subscribe(res => this.dialogs.success("GST uploaded successfully..!!"))
        }
      },
      (err) => this.panFileError = err
    );
  }

  cinFile: any;
  cinFileChange(event) {
    this.cinFile = event.target.files[0];
  }
  cinUploadResponse: any = { status: '', message: '', filePath: '' };
  cinFileError: any;
  uploadCinFile() {
    const formData = new FormData();
    formData.append('file', this.cinFile);
    this.loading = true;
    this.uploadService.upload(formData).subscribe(
      (res) => {
        this.cinUploadResponse = res;
        if (res.file) {
          this.loading = false;
          this.vendor.cinFile = res;
          this.vendor.cinId = res.id;
          this.service.saveVendor({ id: this.vendor.id, cinId: res.id })
            .pipe(take(1)).subscribe(res => this.dialogs.success("GST uploaded successfully..!!"))
        }
      },
      (err) => this.cinFileError = err
    );
  }

  msmeFile: any;
  msmeFileChange(event) {
    this.msmeFile = event.target.files[0];
  }
  msmeUploadResponse: any = { status: '', message: '', filePath: '' };
  msmeFileError: any;
  uploadMsmeFile() {
    const formData = new FormData();
    formData.append('file', this.msmeFile);
    this.loading = true;
    this.uploadService.upload(formData).subscribe(
      (res) => {
        this.msmeUploadResponse = res;
        if (res.file) {
          this.loading = false;
          this.vendor.msmeFile = res;
          this.vendor.msmeId = res.id;
          this.service.saveVendor({ id: this.vendor.id, msmeId: res.id })
            .pipe(take(1)).subscribe(res => this.dialogs.success("GST uploaded successfully..!!"))
        }
      },
      (err) => this.msmeFileError = err
    );
  }

  @ViewChild('helpNotesModal') helpNotesModal: any;
  openHelpNotes(){
     this.openedModal = this.dialogs.modal(this.helpNotesModal, {});
  }

}
