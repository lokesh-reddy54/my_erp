import { Component, OnInit, ViewChild, NgModule } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { debounceTime, take } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { FileUploader } from 'ng2-file-upload';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from "@angular/common/http";
import { DialogsService } from 'src/app/shared/services/dialogs.services';
import { DataLayerService } from 'src/app/shared/services/data-layer.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { AdminService } from 'src/app/shared/services/admin.service';
import { PurchasesService } from 'src/app/shared/services/purchases.service';
import { UploadService } from 'src/app/shared/services/upload.service';
import { Helpers } from '../../../helpers';
import { Utils } from 'src/app/shared/utils';

import * as _ from 'lodash';
import * as moment from 'moment';

@Component({
  selector: 'purchaseorder-view',
  templateUrl: './view.component.html'
})
export class PurchaseOrderViewComponent implements OnInit {
  skuControl = new FormControl([]);
  searchControl: FormControl = new FormControl();

  declineForm: FormGroup;
  statusForm: FormGroup;
  workOrderForm: FormGroup;
  taxInvoiceForm: FormGroup;

  purchaseItemsFilters: any = {};
  purchaseItemsConfig: any = {};

  milestonesFilters: any = {};
  milestonesConfig: any = {};

  statusesFilters: any = {};
  statusesConfig: any = {};

  id: any = 1;
  user: any = {};
  taxInvoice: any = {};

  @ViewChild('purchaseItemsList') purchaseItemsList: any;
  @ViewChild('milestonesList') milestonesList: any;
  @ViewChild('statusesList') statusesList: any;

  @ViewChild('duedatesModal') duedatesModal: any;
  @ViewChild('milestonesModal') milestonesModal: any;
  @ViewChild('declineModal') declineModal: any;
  @ViewChild('itemStatusModal') itemStatusModal: any;
  @ViewChild('itemDeliveryModal') itemDeliveryModal: any;
  @ViewChild('statusImagesModal') statusImagesModal: any;
  @ViewChild('taxInvoiceModal') taxInvoiceModal: any;
  @ViewChild('gstModal') gstModal: any;

  purchaseOrder: any = { vendor: {}, building: {}, workOrder: {} };
  loading: boolean = false;

  constructor(private route: ActivatedRoute, private dialogs: DialogsService, private service: PurchasesService,
    private commonService: CommonService, private adminService: AdminService, private uploadService: UploadService) {
    this.id = this.route.snapshot.params['id'];
    this.purchaseItemsFilters = { purchaseOrderId: this.id, status: 'Ordered' };
    this.milestonesFilters = { purchaseOrderId: this.id, notIn: ['Archived'] };
  }

  ngOnInit() {
    var user = localStorage.getItem("cwo_user");
    if (user && user != '') {
      this.user = JSON.parse(user);
    }
    this.workOrderForm = new FormGroup({});
    this.declineForm = new FormGroup({
      comments: new FormControl("", Validators.required)
    });
    this.statusForm = new FormGroup({
      description: new FormControl("", Validators.required),
      milestoneId: new FormControl(""),
    });
    this.taxInvoiceForm = new FormGroup({
      amount: new FormControl("", Validators.required),
      taxableAmount: new FormControl("", Validators.required),
      gstAmount: new FormControl("", Validators.required),
      tdsAmount: new FormControl("", Validators.required),
      invoiceNo: new FormControl("", Validators.required),
      invoiceDate: new FormControl("", Validators.required),
      invoiceDueDate: new FormControl(""),
    });

    this.purchaseItemsConfig = {
      columns: [
        { label: 'Category', field: 'sku.category.name', type: 'text', styleClass: 'w-10', sortable: true },
        { label: 'Type', field: 'sku.type.name', type: 'text', styleClass: 'w-10', sortable: true },
        { label: 'Item', field: 'sku.name', type: 'text', styleClass: 'w-15', sortable: true },
        { label: 'Date', field: 'dateFrom', type: 'date', styleClass: 'w-10', sortable: true },
        { label: 'UnitPrice', field: 'unitPrice', type: 'inr', styleClass: 'w-5 text-center', sortable: true },
        { label: 'Units', field: 'units', type: 'text', styleClass: 'w-5 text-center', sortable: true },
        { label: 'TaxableAmount', field: 'taxableAmount', type: 'inr', styleClass: 'w-10 text-right', sortable: true },
        { label: 'GST', field: 'gst', type: 'inr', styleClass: 'w-5 text-right', sortable: true },
        { label: 'TDS', field: 'tds', type: 'inr', styleClass: 'w-5 text-right', sortable: true },
        { label: 'Total', field: 'amount', type: 'inr', styleClass: 'w-5 text-right', sortable: true },
        { label: 'Status', field: 'status', type: 'text', styleClass: 'w-5 text-center', sortable: true },
        // { label: 'PaymentTerm', field: 'paymentTerm.tagName', type: 'text', styleClass: 'w-20 text-center', sortable: true },
      ],
      actions: [
        { icon: 'fa fa-flash', hint: 'Status Updates', code: 'updateItemStatus', style: 'info' },
        // { icon: 'fa fa-search', hint: 'View', code: 'viewVendorContact', style: 'info' }
        { icon: 'fa fa-truck', hint: 'Mark Delivered', code: 'markAsDelivered', style: 'primary', condition: { label: 'isAsset', value: '1' } }
      ],
      options: {
        debounceDelay: 0,
        actionStyleClass: 'w-5 icons-td text-center',
      }
    }

    this.milestonesConfig = {
      columns: [
        // { label: 'Item', field: 'purchaseItem.sku.name', type: 'text', styleClass: 'w-20', sortable: true },
        { label: 'Term', field: 'name', type: 'text', styleClass: 'w-20 text-left', sortable: true },
        { label: 'TDS', field: 'tds', type: 'inr', styleClass: 'w-5 text-right', sortable: true },
        { label: 'Amount', field: 'amount', type: 'inr', tooltip: 'paymentMode', styleClass: 'w-10 text-right', sortable: true },
        { label: 'Status', field: 'status', type: 'text', tooltip: 'utr', styleClass: 'w-10 text-center', sortable: true },
        { label: 'ReleasedOn', field: 'releasedOn', tooltip: 'releasedBy', type: 'date', styleClass: 'w-10', sortable: true },
        // { label: 'ApprovedBy', field: 'approvedBy', type: 'text', styleClass: 'w-10', sortable: true, tooltip: 'approvedOn' },
        { label: 'ApprovedOn', field: 'approvedOn', tooltip: 'approvedBy', type: 'date', styleClass: 'w-10 text-center', sortable: true },
        // { label: 'PaidBy', field: 'paidBy', type: 'text', styleClass: 'w-10', sortable: true, tooltip: 'paidOn' },
        { label: 'PaidOn', field: 'paidOn', tooltip: 'paidBy', type: 'date', styleClass: 'w-10 text-center', sortable: true },
        { label: 'Expected', field: 'expectedDate', type: 'date', styleClass: 'w-10 text-center', sortable: true },
        // { label: 'Actual', field: 'actualDate', type: 'date', styleClass: 'w-10 text-center', sortable: true },
      ],
      actions: [
        // { icon: 'fa fa-check', hint: 'Approve Payment', code: 'approvePayment', style: 'info', condition: { label: 'status', value: 'Released' } },
      ],
      options: {
        debounceDelay: 0,
        actionStyleClass: 'w-5 icons-td text-center',
      }
    }

    if (this.commonService.checkAccess("purchases:approvePaymentMileStone")) {
      this.milestonesConfig.actions.push({ icon: 'fa fa-check', hint: 'Approve Payment', code: 'approvePayment', style: 'info', condition: { label: 'status', value: 'Released' } });
    }

    this.statusesConfig = {
      columns: [
        { label: 'Status', field: 'description', type: 'text', styleClass: 'w-50', sortable: true },
        // { label: 'Payment', field: 'mileStone', type: 'boolean', styleClass: 'w-10 text-center', sortable: true },
        { label: 'Payment', field: 'mileStone.amount', type: 'inr', styleClass: 'w-10 text-right', sortable: true },
        { label: 'Images', field: 'images.length', type: 'text', styleClass: 'w-10 text-center', sortable: true },
        { label: 'By', field: 'updatedBy', type: 'text', styleClass: 'w-15', sortable: true },
        { label: 'Date', field: 'updated', type: 'date', styleClass: 'w-10 text-center', sortable: true },
      ],
      actions: [
        { icon: 'fa fa-search', hint: 'View Images', code: 'viewStatusImages', style: 'info' },
      ],
      options: {
        debounceDelay: 0,
        actionStyleClass: 'w-5 icons-td text-center',
      }
    }

    this.getPurchaseOrder();
    this.loadPurchaseItems();
  }

  getPurchaseOrder() {
    this.loading = true;
    this.service.getPurchaseOrder(this.id).pipe(take(1)).subscribe(
      res => {
        if (res['data']) {
          this.purchaseOrder = res['data'];
          if (!this.mileStones) {
            this.listPurchaseOrderMilestones();
          }
          this.getVendorTdsDeductions();

          this.purchaseOrder.gst = _.sumBy(this.purchaseOrder.items, 'gst');
          this.purchaseOrder.invoiceGst = _.sumBy(this.purchaseOrder.invoices, 'gst');
          if (!this.purchaseOrder.invoices.length || (this.purchaseOrder.items.length && this.purchaseOrder.invoiceGst < this.purchaseOrder.gst - 10)) {
            this.purchaseOrder.needInvoice = true;
          }
        } else {
          this.dialogs.error("PurchaseOrder not exist with given ID", 'No PurchaseOrder')
        }
        this.loading = false;
      },
      error => {
        this.dialogs.error(error, 'Error while saving')
      }
    )
  }

  regeneratePurchaseOrder() {
    this.loading = true;
    this.service.regeneratePurchaseOrder(this.purchaseOrder.id).pipe(take(1)).subscribe(
      res => {
        if (res['data']) {
          this.purchaseOrder['pdf'] = res['data'];
        }
        this.loading = false;
      },
      error => {
        this.dialogs.error(error, 'Error while saving')
      }
    )
  }

  openedModal: any;
  editingPOMileStones: any = [];
  editHistory: any = [];
  editingPO: any = {};
  openEditMilestones() {
    this.editingPO.amount = _.clone(this.purchaseOrder.amount);
    this.editingPO.deliveryCharges = _.clone(this.purchaseOrder.deliveryCharges);
    this.editingPO.additionalCharges = _.clone(this.purchaseOrder.additionalCharges);
    var poMilestones = this.milestonesList.getItems();
    this.editingPOMileStones = _.clone(poMilestones);
    var editHistory = _.clone(this.purchaseOrder.editHistory);
    if (!editHistory) {
      editHistory = "[]";
    }
    this.editHistory = JSON.parse(editHistory);
    console.log("openEditMilestones ::: editingPOMileStones : ", this.editingPOMileStones);
    this.openedModal = this.dialogs.modal(this.milestonesModal, { size: 'lg' });
    var self = this;
    this.openedModal.result.then(function() {
      self.loading = false;
    }).catch(function(e) {
      self.loading = false;
    })
  }

  listDueDates() {
    var poMilestones = this.mileStones;
    this.editingPOMileStones = [];
    var self = this;

    var diffDays = 0;
    var lastMilestone;
    _.each(poMilestones, function(milestone) {
      if (lastMilestone && lastMilestone.status != 'Draft' && (milestone.status == 'Confirmed' || milestone.status == 'Completed')) {
        milestone.canApprove = true;
      } else if (!lastMilestone && milestone.status == 'Confirmed') {
        milestone.canApprove = true;
      } else if (!lastMilestone || (lastMilestone && lastMilestone.status != 'Draft')) {
        milestone.canMarkComplete = true;
      }
      var m = _.clone(milestone);
      if (m.expectedDate) {
        m.expected = _.clone(m.expectedDate);
        m.expectedDate = Utils.dateToNgbDate(m.expectedDate);
      }
      if (m.actualDate) {
        m.actual = _.clone(m.actualDate);
        m.actualDate = Utils.dateToNgbDate(m.actualDate);
      }
      self.editingPOMileStones.push(m);
      lastMilestone = milestone;
    });

    if (self.dueDateCrossedMileStone) {
      if (moment(self.dueDateCrossedMileStone.expectedDate).isBefore(moment())) {
        diffDays = moment().diff(moment(self.dueDateCrossedMileStone.expectedDate), 'days');
      }
      if (diffDays > 0) {
        this.dialogs.confirm("There is a delay is milestone completion by " + diffDays + " days. Would you like to forward the same delay to next milestones .?")
          .then(event => {
            if (event.value) {
              self.editingPOMileStones = [];
              var flag = false;
              _.each(poMilestones, function(milestone) {
                var m = _.clone(milestone);
                if (flag) {
                  if (m.expectedDate) {
                    m.expectedDate = moment(m.expectedDate).add(diffDays, 'days').toDate();
                  }
                }
                if (m.expectedDate) {
                  m.expectedDate = Utils.dateToNgbDate(m.expectedDate);
                }
                if (m.actualDate) {
                  m.actualDate = Utils.dateToNgbDate(m.actualDate);
                }
                if (self.dueDateCrossedMileStone.id == milestone.id) {
                  flag = true;
                }
                self.editingPOMileStones.push(m);
              });
            }
            self.dueDateCrossedMileStone = null;
          })
      }
    }
  }
  openDueDates() {
    console.log("openEditMilestones ::: editingPOMileStones : ", this.editingPOMileStones);
    this.openedModal = this.dialogs.modal(this.duedatesModal, { size: 'lg' });
    var self = this;
    this.openedModal.result.then(function() {
      self.loading = false;
    }).catch(function(e) {
      self.loading = false;
    })
  }

  calculateUpdatedBudget() {
    var amount = _.sumBy(this.editingPOMileStones, 'amount');
    var tds = _.sumBy(this.editingPOMileStones, 'tds');
    this.editingPO.amount = amount;
  }
  updateAmounts() {
    this.loading = true;
    this.editHistory.push({ name: this.user.name, amount: this.editingPO.amount, date: moment().format("YYYY-MM-DD HH:mm") })
    var data = {
      id: this.purchaseOrder.id,
      amount: this.editingPO.amount,
      deliveryCharges: this.editingPO.deliveryCharges,
      additionalCharges: this.editingPO.additionalCharges,
      editHistory: JSON.stringify(this.editHistory)
    }
    this.service.savePurchaseOrder(data).subscribe(res => {
      console.log("EditingPO :: res : ", res);
    })
    var self = this;
    var editableMileStones = _.filter(self.editingPOMileStones, function(m) {
      return m.status == 'Draft' || m.status == 'Released';
    })
    var updated = 0;
    _.each(editableMileStones, function(m) {
      var mileStone: any = {
        id: m.id,
        purchaseOrderId: self.purchaseOrder.id,
        status: m.status,
        name: m.name,
        tds: m.tds,
        amount: m.amount
      }
      if (!m.id) {
        mileStone.paymentMode = self.editingPOMileStones[0].paymentMode;
      }
      self.service.savePurchaseOrderMilestone(mileStone).subscribe(res => {
        updated++;
        if (updated == editableMileStones.length) {
          self.loading = false;
          self.dialogs.success("PO amounts are updated");
          self.openedModal.close();
          self.getPurchaseOrder();
          self.milestonesList.reset();
        }
      });
    })
  }

  updateDueDates() {
    this.loading = true;
    var self = this;
    var updated = 0;
    _.each(this.editingPOMileStones, function(m) {
      var mileStone: any = {
        id: m.id,
      }
      if (m.expectedDate) {
        mileStone.expectedDate = Utils.ngbDateToMoment(m.expectedDate).add(10, 'hours').toDate();
      }
      if (m.actualDate) {
        mileStone.actualDate = Utils.ngbDateToMoment(m.actualDate).add(10, 'hours').toDate();
      }
      self.service.savePurchaseOrderMilestone(mileStone).subscribe(res => {
        updated++;
        if (updated == self.editingPOMileStones.length) {
          self.loading = false;
          self.dialogs.success("MileStone due dates are updated");
          self.openedModal.close();
          self.getPurchaseOrder();
          self.listPurchaseOrderMilestones();
        }
      });
    })
  }

  openDeclineMessage() {
    this.openedModal = this.dialogs.modal(this.declineModal, { size: 'md' });
    var self = this;
    this.openedModal.result.then(function() {
      self.loading = false;
      self.declineForm.reset();
    }).catch(function(e) {
      self.loading = false;
      self.declineForm.reset();
    })
  }

  purchaseItem: any = {};
  savePurchaseItemStatus() {
    this.loading = true;
    var status: any = {
      purchaseItemId: this.purchaseItem.id,
      description: this.status.description,
    }
    if (this.status.releasePayment) {
      status.mileStoneId = this.pendingMileStones[0] ? this.pendingMileStones[0].id : null
    }

    console.log("PurchaseOrderViewComponent ::: savePurchaseItemStatus :: purchaseItemStatus : ", status);
    this.service.savePurchaseItemStatus(status).pipe(take(1)).subscribe(
      res => {
        this.dialogs.success("Item status is saved successfully ");
        this.loading = false;
        this.loadItemStatuses();
        this.listPurchaseOrderMilestones();
        this.statusForm.reset();
        this.status = {};
      },
      error => {
        this.dialogs.error(error, 'Error while saving')
      }
    )
  }

  startPO() {
    this.loading = true;
    var data: any = {
      id: this.purchaseOrder.id,
      status: 'Started',
      startedOn: new Date()
    }
    console.log("PurchaseOrderViewComponent ::: savePurchaseItemStatus :: startPO : ", data);
    this.service.savePurchaseOrder(data).pipe(take(1)).subscribe(
      res => {
        this.dialogs.success("Purchase Order is marked as Started ");
        this.loading = false;
        this.getPurchaseOrder();
      },
      error => {
        this.dialogs.error(error, 'Error while saving')
      }
    )
  }

  newStatus() {
    this.statusForm.reset();
    this.status.form = true;
  }

  action(event) {
    console.log("LocationsComponent ::: action :: event ", event);
    if (event.action == 'declinePurchaseItem') {
      this.purchaseItem = _.clone(event.item);
      this.openDeclineMessage();
    } else if (event.action == 'updateItemStatus') {
      this.purchaseItem = _.clone(event.item);
      this.openItemStatus();
    } else if (event.action == 'markAsDelivered') {
      this.purchaseItem = _.clone(event.item);
      this.openItemDeliveries();
    } else if (event.action == 'approvePayment') {
      var mileStone = _.clone(event.item);
      this.approveMileStone(mileStone);
    }
  }

  updateItemStatus(item) {
    this.purchaseItem = _.clone(item);
    this.openItemStatus();
  }
  markAsDelivered(item) {
    this.purchaseItem = _.clone(item);
    this.openItemDeliveries();
  }

  dueDateCrossedMileStone: any;
  markMilestoneCompleted(mileStone) {
    var self = this;
    this.dialogs.confirm("Are you sure to mark this MileStone as Completed .?")
      .then(event => {
        if (event.value) {
          self.loading = true;
          var status: any = {
            purchaseItemId: self.purchaseOrder.items[0].id,
            description: "",
            mileStoneId: mileStone.id
          }
          console.log("PurchaseOrderViewComponent ::: requestReleaseMilestone :: purchaseItemStatus : ", status);
          self.service.savePurchaseItemStatus(status).pipe(take(1)).subscribe(
            res => {
              self.dialogs.success("MileStone is marked as Completed successfully .! ");
              self.loading = false;
              self.listPurchaseOrderMilestones();
              if (moment(mileStone.expectedDate).isBefore(moment())) {
                // this.openDueDates();
                self.dueDateCrossedMileStone = mileStone;
              }
            },
            error => {
              self.dialogs.error(error, 'Error while saving')
            }
          )
        } else {
          // self.dialogs.error("Please mention status update to release payment", 'Update required')
        }
      })
  }
  confirmMilestoneCompleted(mileStone) {
    var self = this;
    this.dialogs.confirm("Are you sure to confirm this MileStone as Completed .?").then(event => {
      if (event.value) {
        self.loading = true;
        var data: any = {
          id: mileStone.id,
          status: 'Confirmed'
        }
        self.service.savePurchaseOrderMilestone(data).pipe(take(1)).subscribe(
          res => {
            if (res['data']) {
              self.loading = false;
              self.listPurchaseOrderMilestones();
              self.dialogs.success("MileStone is confirmed as Completed .!");
            } else if (res['error']) {
              self.dialogs.msg(res['error'], 'error');
            }
          })
      }
    })
  }
  approvePartialMileStone(mileStone) {
    var self = this;
    this.dialogs.prompt("Please enter partial amount to release payment .", 'Confirm Amount')
      .then(event => {
        if (event.value) {
          if (event.value > mileStone.amount) {
            self.dialogs.msg("Partial amount cant be greater than milestone amount", "error");
          } else {
            self.approveMileStone(mileStone, event.value);
          }
        } else {
          self.dialogs.msg("Please mention partial amount to release payment", "error")
        }
      })
  }

  approveMileStone(mileStone, partialAmount?) {
    mileStone = _.clone(mileStone);
    if (!this.purchaseOrder.proformaInvoice.file && !this.purchaseOrder.taxInvoice.file) {
      this.dialogs.msg("Please upload proforma invoice to make any of the payments", 'error');
      return;
    }
    var data: any = {
      id: mileStone.id,
      status: 'Approved',
      approved: true,
      partialAmount: parseInt(partialAmount)
    }
    if (partialAmount) {
      mileStone.amount = parseInt(partialAmount);
    }
    var paid = _.sumBy(_.filter(this.mileStones, { status: 'Paid' }), 'amount');
    if (paid + mileStone.amount > this.purchaseOrder.amount * 0.7) {
      if (!this.purchaseOrder.taxInvoice.file) {
        this.dialogs.msg("We need Tax Invoice to release payment of 70% of budget. Please upload Tax Invoice to make this payment", 'error');
        return;
      }
    }
    var gst = _.sumBy(this.purchaseOrder.items, 'gst');
    if (paid + mileStone.amount > this.purchaseOrder.amount - gst) {
      var poGst = 0;
      _.each(this.purchaseOrder.invoices, function(i) {
        if (i.gstFile) {
          poGst = poGst + i.gst;
        }
      })
      if (poGst < gst - 10) {
        this.dialogs.msg("We need GSTR-2 to release GST payment. Please upload Tax Invoice GST file along with GSTR-2 to make this payment", 'error');
        return;
      }
    }
    this.loading = true;
    this.service.savePurchaseOrderMilestone(data).pipe(take(1)).subscribe(
      res => {
        if (res['data']) {
          this.loading = false;
          this.listPurchaseOrderMilestones();
          this.dialogs.success("MileStone is approved for payment");
        } else if (res['error']) {
          this.dialogs.msg(res['error'], 'error');
        }
      })
  }
  status: any = {};
  mileStones: any;
  purchaseItems: any = [];
  purchaseItemStatuses: any = [];
  loadPurchaseItems() {
    this.loading = true;
    this.service.listPurchaseItems({ filters: { purchaseOrderId: this.id } })
      .subscribe(res => {
        this.purchaseItems = res['data'];
        this.loading = false;
      })
  }
  loadItemStatuses() {
    this.loading = true;
    this.service.listPurchaseItemStatuses({ filters: { purchaseItemId: this.purchaseItem.id } })
      .subscribe(res => {
        this.purchaseItemStatuses = res['data'];
        this.loading = false;
      })
  }

  listPurchaseOrderMilestones() {
    this.loading = true;
    this.service.listPurchaseOrderMilestones({ filters: { purchaseOrderId: this.purchaseOrder.id, notIn: ['Archived'] } })
      .subscribe(res => {
        this.mileStones = res['data'];
        this.listDueDates();
        if (this.dueDateCrossedMileStone) {
          this.openDueDates();
        }
        this.loading = false;
      })
  }

  delivery: any = {};
  openItemDeliveries() {
    var self = this;
    this.delivery = null;
    if (this.purchaseItem.deliveries) {
      var quantity = _.sumBy(this.purchaseItem.deliveries, "quantity");
      if (quantity < this.purchaseItem.units) {
        this.delivery = {}
      }
    }
    this.openedModal = this.dialogs.modal(this.itemDeliveryModal, { size: 'md' });
    var self = this;
    this.openedModal.result.then(function() {
      self.loading = false;
    }).catch(function(e) {
      self.loading = false;
    })
  }
  savePurchaseItemDelivery() {
    var data: any = {
      projectId: this.purchaseOrder.projectId,
      purchaseOrderId: this.purchaseOrder.id,
      skuCatId: this.purchaseItem.sku.catId,
      skuId: this.purchaseItem.sku.id,
      name: this.purchaseItem.sku.name,
      purchaseItemId: this.purchaseItem.id,
      vendorId: this.purchaseOrder.vendorId,
      quantity: this.delivery.quantity,
      code: this.purchaseItem.sku.type.code + "/" + this.purchaseItem.sku.code,
      price: this.purchaseItem.unitPrice,
      count: this.delivery.quantity
    };
    var quantity = _.sumBy(this.purchaseItem.deliveries, "quantity");
    quantity = quantity + data.quantity;
    if (quantity == this.purchaseItem.units) {
      data.delivered = 1;
    } else if (quantity > this.purchaseItem.units) {
      this.dialogs.error("Quantity received so far is crossing ordered items count, please check ... ")
      return;
    }
    if (this.delivery.releasePayment) {
      data.mileStoneId = this.mileStones[0] ? this.mileStones[0].id : null
    }
    this.service.savePurchaseItemDelivery(data).subscribe(res => {
      if (res['data']) {
        var delivery = res['data'];
        delivery.quantity = parseInt(delivery.quantity);
        this.purchaseItem.deliveries.push(delivery);
        this.delivery = {};
        if (data.delivered) {
          this.delivery = null;
        }
        this.purchaseItemsList.reset();
      }
    })
  }

  openItemStatus() {
    var self = this;
    this.purchaseItemStatuses = [];
    this.loadItemStatuses();

    this.openedModal = this.dialogs.modal(this.itemStatusModal, { size: 'lg' });
    var self = this;
    this.openedModal.result.then(function() {
      self.loading = false;
      self.statusForm.reset();
      self.status = {};
    }).catch(function(e) {
      self.loading = false;
      self.statusForm.reset();
      self.status = {};
    })
  }

  pendingMileStones: any = [];
  showMilestones() {
    this.pendingMileStones = _.filter(this.mileStones, function(m) {
      return m.status == 'Draft'
    })
  }

  statusImages: any = [];
  loadItemStatusImages(id) {
    this.service.listPurchaseStatusImages({ filters: { vendorPurchaseItemStatusId: id } })
      .subscribe(res => {
        this.statusImages = res['data'];
      })
  }

  openStatusImagesModal(id) {
    var self = this;
    this.uploader = new FileUploader({
      url: Helpers.composeEnvUrl() + "statusImageUploads/" + id,
    });
    this.loadItemStatusImages(id);
    this.uploader.onCompleteAll = () => {
      console.log('openStatusImagesModal :: onCompleteAll : ');
      self.loadItemStatusImages(id);
    };

    this.openedModal = this.dialogs.modal(this.statusImagesModal, { size: 'xlg' });
    var self = this;
    this.openedModal.result.then(function() {
      self.loading = false;
    }).catch(function(e) {
      self.loading = false;
    })
  }

  proformaInvoiceFile: any;
  proformaInvoiceFileChange(event) {
    this.proformaInvoiceFile = event.target.files[0];
  }
  proformaInvoiceUploadResponse: any = { status: '', message: '', filePath: '' };
  proformaInvoiceFileError: any;
  uploadProformaInvoiceFile() {
    const formData = new FormData();
    formData.append('file', this.proformaInvoiceFile);

    this.loading = true;
    this.uploadService.upload(formData).subscribe(
      (res) => {
        this.proformaInvoiceUploadResponse = res;
        if (res.file) {
          this.loading = false;
          this.purchaseOrder.proformaInvoice = res;
          this.service.savePurchaseOrder({ id: this.purchaseOrder.id, proformaInvoiceId: res.id })
            .subscribe(res => this.dialogs.success("Proforma Invoice uploaded successfully..!!"))
        }
      },
      (err) => this.proformaInvoiceFileError = err
    );
  }

  taxInvoiceFile: any;
  taxInvoiceFileChange(event) {
    this.taxInvoiceFile = event.target.files[0];
  }
  taxInvoiceUploadResponse: any = { status: '', message: '', filePath: '' };
  taxInvoiceFileError: any;
  uploadTaxInvoiceFile() {
    const formData = new FormData();
    formData.append('file', this.taxInvoiceFile);

    this.loading = true;
    this.uploadService.upload(formData).subscribe(
      (res) => {
        this.taxInvoiceUploadResponse = res;
        if (res.file) {
          this.loading = false;
          this.taxInvoiceFile = null;
          this.taxInvoice.file = res;
          this.taxInvoiceFile = null;
          // this.service.savePurchaseOrder({ id: this.purchaseOrder.id, taxInvoiceId: res.id })
          //   .subscribe(res => this.dialogs.success("Proforma Invoice uploaded successfully..!!"))
        }
      },
      (err) => this.taxInvoiceFileError = err
    );
  }

  gstFile: any;
  gstFileChange(event) {
    this.gstFile = event.target.files[0];
  }
  gstUploadResponse: any = { status: '', message: '', filePath: '' };
  gstFileError: any;
  uploadGSTFile() {
    const formData = new FormData();
    formData.append('file', this.gstFile);

    this.loading = true;
    this.uploadService.upload(formData).subscribe(
      (res) => {
        this.gstUploadResponse = res;
        if (res.file) {
          this.loading = false;
          this.taxInvoice.gstFileId = res.id;
          this.taxInvoice.gstFile = res;
          this.gstFile = null;
        }
      },
      (err) => this.gstFileError = err
    );
  }

  newInvoice: any = false;
  saveTaxInvoice() {
    var data = _.clone(this.taxInvoice);
    data.purchaseOrderId = this.purchaseOrder.id;
    data.docId = this.taxInvoice.file.id;
    data.invoiceDate = Utils.ngbDateToDate(data.invoiceDate);
    data.invoiceDueDate = Utils.ngbDateToDate(data.invoiceDueDate);

    if (data.taxableAmount + data.gst - data.tds != data.amount) {
      this.dialogs.msg("TaxableAmount + GST - TDS is not matching with Invoice Amount. Please check and correct.", "error")
      return;
    }

    if (this.taxInvoice.gstSlabs.length && this.purchaseOrder.items.length) {
      // this.purchaseOrder.invoiceGst = _.sumBy(this.purchaseOrder.invoices, "gst");
      var otherInvoices = _.reject(this.purchaseOrder.invoices, { id: data.id });
      var otherInvoicesGst = _.sumBy(otherInvoices, "gst");
      this.purchaseOrder.invoiceGst = otherInvoicesGst + data.gst;
      if (_.sumBy(this.purchaseOrder.items, "gst") > 0) {
        if (this.purchaseOrder.invoiceGst < this.purchaseOrder.gst - 10) {
          var self = this;
          this.dialogs.confirm("Invoices GST is lesser than Items GST. Are you expecting one more TaxInvoice .?")
            .then(event => {
              if (event.value) {
                self.confirmTaxInvoiceUpdate(data);
              } else {
                self.dialogs.msg("GST of Invoices is lesser than GST of ordered Items. Please check and correct.", "error")
              }
              self.loading = false;
            })
        } else if (this.purchaseOrder.invoiceGst > this.purchaseOrder.gst + 10) {
          this.dialogs.msg("GST of Invoices is greater than GST of ordered Items. Please check and correct.", "error")
        } else {
          this.confirmTaxInvoiceUpdate(data);
        }
      } else {
        this.confirmTaxInvoiceUpdate(data);
      }
    } else {
      this.confirmTaxInvoiceUpdate(data);
    }
  }
  confirmTaxInvoiceUpdate(data) {
    this.loading = true;
    this.service.savePurchaseOrderInvoice(data)
      .subscribe(res => {
        if (res['data']) {
          if (!this.taxInvoice.id) {
            this.taxInvoice.id = res['data']['id'];
          }
          this.dialogs.success("Tax Invoice is added successfully..!!");
          this.getPurchaseOrder();
          this.openedModal.close();
        }
        this.loading = false;
      })
  }
  saveGst() {
    var data: any = _.clone(this.taxInvoice);
    data.purchaseOrderId = this.purchaseOrder.id;
    data.gst = _.sumBy(this.taxInvoice.gstSlabs, 'gst');
    data.igst = _.sumBy(this.taxInvoice.gstSlabs, 'igst');
    data.sgst = _.sumBy(this.taxInvoice.gstSlabs, 'sgst');
    data.cgst = _.sumBy(this.taxInvoice.gstSlabs, 'cgst');
    data.tds = _.sumBy(this.taxInvoice.gstSlabs, 'tds');

    if (data.gst < this.taxInvoice.gst) {
      this.dialogs.msg("Invoice GST is greater than GST slabs total GST. Please check and correct.", "error")
      return;
    } else if (data.gst > this.taxInvoice.gst) {
      this.dialogs.msg("Invoice GST is lesser than GST slabs total GST. Please check and correct.", "error")
      return;
    }
    this.updateTaxInvoiceGstSlabs();
  }
  updateTaxInvoiceGstSlabs() {
    var self = this;
    console.log("updateTaxInvoiceGstSlabs :: taxInvoice : ", this.taxInvoice);
    _.each(this.taxInvoice.gstSlabs, function(slab) {
      slab.purchaseOrderInvoiceId = self.taxInvoice.id;
    })
    this.service.savePurchaseOrderInvoiceGsts({ gstSlabs: this.taxInvoice.gstSlabs }).pipe(take(1)).subscribe(res => {
      this.dialogs.success("Tax Invoice GST slabs are added successfully..!!");
      this.getPurchaseOrder();
      this.openedModal.close();
    })
  }
  gstSlabs: any = [];
  slab: any = {};
  openGstModal(invoice?) {
    console.log("openGstModal :: invoice : ", invoice);
    if (!invoice) {
      this.taxInvoice = { gstSlabs: [] };
    } else {
      this.taxInvoice = _.clone(invoice);
    }
    if (!this.taxInvoice.invoiceNo) {
      this.taxInvoice.invoiceNo = this.taxInvoice.billNo;
    }
    this.slab = { gst: 0, igst: 0, cgst: 0, sgst: 0, tds: 0 };

    this.openedModal = this.dialogs.modal(this.gstModal, { size: 'lg' });
    var self = this;
    this.openedModal.result.then(function() {
      self.loading = false;
    }).catch(function(e) {
      self.loading = false;
    })
  }
  openTaxInvoiceModal(invoice?) {
    console.log("openTaxInvoiceModal :: invoice : ", invoice);
    if (!invoice) {
      this.taxInvoice = { gstSlabs: [] };
    } else {
      this.taxInvoice = _.clone(invoice);
      this.taxInvoice.invoiceDate = Utils.dateToNgbDate(this.taxInvoice.invoiceDate);
      this.taxInvoice.invoiceDueDate = Utils.dateToNgbDate(this.taxInvoice.invoiceDueDate);
    }
    if (!this.taxInvoice.invoiceNo) {
      this.taxInvoice.invoiceNo = this.taxInvoice.billNo;
    }
    this.slab = { gst: 0, igst: 0, cgst: 0, sgst: 0, tds: 0 };

    this.openedModal = this.dialogs.modal(this.taxInvoiceModal, { size: 'lg' });
    var self = this;
    this.openedModal.result.then(function() {
      self.loading = false;
    }).catch(function(e) {
      self.loading = false;
    })
  }

  updateSlabGST() {
    this.slab.gst = this.slab.igst;
    if (!this.slab.gst) {
      this.slab.gst = this.slab.sgst + this.slab.cgst;
    }
  }

  addGstSlab() {
    this.taxInvoice.gstSlabs.push(_.clone(this.slab));
    this.slab = { gst: 0, igst: 0, cgst: 0, sgst: 0, tds: 0 };
  }

  removeGstSlab(slab) {
    this.taxInvoice.gstSlabs = _.without(this.taxInvoice.gstSlabs, slab);
  }


  public uploader: FileUploader;
  public hasBaseDropZoneOver: boolean = false;
  public hasAnotherDropZoneOver: boolean = false;

  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  public fileOverAnother(e: any): void {
    this.hasAnotherDropZoneOver = e;
  }


  @ViewChild('editPOModal') editPOModal: any;
  workOrder: any = {};
  woType: any;
  selectedSku: any = {};
  editPO() {
    var self = this;
    var po = this.purchaseOrder;
    this.service.prepareEditPO(po.id)
      .subscribe(res => {
        var data = res['data'];
        delete data.id;
        this.selectedItems = [];

        _.each(data.items, function(i) {
          var item = {
            skuId: i.skuId,
            skuGst: i.sku ? i.sku.gst : 0,
            description: i.sku ? i.sku.description : "",
            skuName: i.sku ? i.sku.name + ", " + i.sku.type.name + ", " + i.sku.category.name : "",
            units: i.units,
            unitPrice: i.unitPrice || i.taxableAmount,
            taxableAmount: i.taxableAmount,
            amount: i.amount,
            paymentTermId: data.paymentTermId
          }
          self.selectedItems.push(item);
        })

        if (this.purchaseOrder.isBill && !this.purchaseOrder.isOpex) {
          var itemsAmount = _.sumBy(data.items, "amount");
          if (itemsAmount < this.purchaseOrder.amount) {
            var amount = this.purchaseOrder.amount - itemsAmount;
            var item = {
              skuId: 9999,
              skuGst: 0,
              description: "NonAsset Purchase",
              skuName: "NonAsset Purchase",
              units: 1,
              unitPrice: amount,
              taxableAmount: amount,
              amount: amount,
            }
            self.selectedItems.push(item);
          }
        }
        this.workOrder = data;
      })
    this.openedModal = this.dialogs.modal(this.editPOModal, { size: 'lg', backdrop: 'static', keyboard: false });
    var self = this;
    this.openedModal.result.then(function() {
      self.workOrder = {};
      self.selectedSkus = [];
      self.selectedItems = [];
    }).catch(function(e) {
      self.workOrder = {};
      self.selectedSkus = [];
      self.selectedItems = [];
    })
  }

  vendorWorkOrders: any = [];
  selectedSkus: any = [];
  autocompleteSkus: any = [];
  showNewVendorSku: any = false;
  lookingNewVendorSku: any = false;
  onSkuSearch(text: any) {
    var data: any = { filters: { search: text } }
    if (!this.lookingNewVendorSku) {
      data.filters.vendorId = this.purchaseOrder.vendorId;
    }
    return this.service.searchSkus(data).pipe(take(1)).subscribe(
      res => {
        this.autocompleteSkus = res['data'];
        if (!this.autocompleteSkus.length) {
          this.showNewVendorSku = true;
        } else {
          this.showNewVendorSku = false;
        }
      })
  }

  selectedItems: any = [];
  deliveryCharges: any = 0;
  additionalChargesNote: any;
  additionalCharges: any = 0;
  raisePurchaseOrder() {
    console.log("PurchaseComponent ::: raisePurchaseOrder :: purchaseOrder ", this.selectedItems);
    this.loading = true;
    var self = this;
    var data = {
      items: this.selectedItems
    }
    this.service.raisePurchaseOrder(data).pipe(take(1)).subscribe(
      res => {
        self.dialogs.success("Purchase order is updated successfully ");
        self.loading = false;
        this.openedModal.close();
        this.selectedItems = [];
      },
      error => {
        self.dialogs.error(error, 'Error while saving')
      }
    )
  }

  skuSelected() {
    this.selectedSku = _.clone(this.selectedSkus[0]);
  }

  addItem() {
    var sku = _.clone(this.selectedSkus[0]);
    console.log("PurchaseComponent ::: addItem :: sku item : ", sku);
    var item = {
      vendorId: this.purchaseOrder.vendorId,
      price: sku.price,
      skuId: sku.skuId,
      skuGst: sku.gst,
      description: sku.description,
      skuName: sku.sku + ", " + sku.type + ", " + sku.category,
      units: sku.quantity,
      unitPrice: sku.price,
      taxableAmount: sku.taxableAmount,
      amount: sku.amount
    }
    this.selectedItems.push(item);
    this.selectedSkus = [];

    if (this.selectedSku.price != sku.price) {
      this.service.updateVendorSkuLastPrice(item).subscribe();
    }
    this.showNewVendorSku = false;
    this.lookingNewVendorSku = false;
  }

  removeSelectedItem(item) {
    this.selectedItems = _.without(this.selectedItems, item);
    if (this.purchaseOrder.isBill && !this.purchaseOrder.isOpex) {
      var itemsAmount = _.sumBy(this.selectedItems, "amount");
      if (itemsAmount < this.purchaseOrder.amount) {
        var amount = this.purchaseOrder.amount - itemsAmount;
        var _item = {
          id: 9999,
          skuId: 9999,
          gst: 0,
          description: "NonAsset Purchase",
          sku: "Item",
          type: "Purchase",
          category: "NonAsset",
          quantity: 1,
          price: amount,
          taxableAmount: amount,
          amount: amount,
        }
        this.selectedSkus.push(_item);
      }
    }
  }

  updatePurchaseOrder() {
    console.log("PurchaseComponent ::: updatePurchaseOrder :: workOrder ", this.selectedItems);
    this.loading = true;
    var self = this;

    this.service.updatePurchaseOrder({
      id: this.purchaseOrder.id,
      items: this.selectedItems
    }).pipe(take(1)).subscribe(
      res => {
        if (res['data']) {
          self.dialogs.success(" PurchaseOrder is updated successfully ");
          this.openedModal.close();
          this.selectedItems = [];
          this.getPurchaseOrder();
          this.purchaseItemsList.reset();
        } else if (res['error']) {
          this.dialogs.error(res['error']);
        }
        self.loading = false;
      },
      error => {
        self.dialogs.error(error, 'Error while saving')
      }
    )
  }

  tillLastPoServiceCharges: any = 0;
  poServiceCharges: any = 0;
  previousTdsDeduction: any = 0;
  tdsDeduction: any = 0;
  tdsDeducted: any = 0;

  getVendorTdsDeductions() {
    this.service.getVendorServiceSkus({ vendorId: this.purchaseOrder.vendorId })
      .subscribe(res => {
        var self = this;
        var items = res['data'];
        console.log("getVendorServiceSkus :: items : ", items);
        var oldPoItems = _.filter(items, function(i) {
          return i.purchaseOrderId != self.id
        })
        this.tillLastPoServiceCharges = _.sumBy(oldPoItems, "taxableAmount");

        var poItems = _.filter(items, function(i) {
          return i.purchaseOrderId == self.id
        })
        this.poServiceCharges = _.sumBy(poItems, "taxableAmount");

        this.tdsDeduction = 0;
        _.each(poItems, function(i) {
          i.tds = i.taxableAmount * (i.skuTdsPercent / 100);
          self.tdsDeduction = self.tdsDeduction + i.tds;
        })
      })

    this.service.getVendorTdsDeductions({ vendorId: this.purchaseOrder.vendorId })
      .subscribe(res => {
        var items = res['data'];
        var self = this;
        this.previousTdsDeduction = _.sumBy(_.filter(items, function(i) {
          return i.purchaseOrderId != self.id
        }), "tdsDeducted");

        this.tdsDeducted = _.sumBy(_.filter(items, function(i) {
          return i.purchaseOrderId == self.id
        }), "tdsDeducted");
      })
  }
  deductTDS() {
    var self = this;
    var financialYear = "";
    var year = moment().year();
    var month = moment().month();
    if (month < 3) {
      financialYear = (year - 1) + "-" + (year % 100);
    } else {
      financialYear = year + "-" + ((year + 1) % 100);
    }

    this.dialogs.confirm("Are you sure to proceed with TDS deduction for this PO .?").then(event => {
      if (event.value) {
        var milestones = this.milestonesList.getItems();
        var lastMilestone = milestones[milestones.length - 1];

        var milestone = {
          id: lastMilestone.id,
          purchaseOrderId: this.purchaseOrder.id,
          name: lastMilestone.name.replace(" - TDS", "") + " - TDS",
          tds: self.tdsDeduction,
          amount: lastMilestone.amount - self.tdsDeduction
        }
        self.service.savePurchaseOrderMilestone(milestone).subscribe(res => {
          self.milestonesList.reset();
          self.dialogs.success("TDS deducted for last milestone.")
        });

        var data = {
          vendorId: self.purchaseOrder.vendorId,
          year: financialYear,
          milestoneId: lastMilestone.id,
          tdsDeducted: self.tdsDeduction,
          tdsPercent: 2,
          status: 'Draft',
          date: new Date()
        }
        self.service.deductTDS(data).subscribe(res => {
          self.tdsDeducted = self.tdsDeduction;
        })
      }
    })
  }
}


