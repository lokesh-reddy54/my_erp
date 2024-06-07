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
import { UploadService } from 'src/app/shared/services/upload.service';
import { Helpers } from '../../../helpers';
import * as _ from 'lodash';
import * as moment from 'moment';

@Component({
  selector: 'workorder-view',
  templateUrl: './view.component.html'
})
export class WorkOrderViewComponent implements OnInit {
  selectedSku = new FormControl([]);
  searchControl: FormControl = new FormControl();

  declineForm: FormGroup;

  workItemsFilters: any = {};
  workItemsConfig: any = {};

  id: any = 1;
  user: any = {};

  @ViewChild('workItemsList') workItemsList: any;

  @ViewChild('declineModal') declineModal: any;
  @ViewChild('paymentTermsModal') paymentTermsModal: any;

  workOrder: any = { vendor: {}, building: {}, paymentTerm: {} };
  loading: boolean = false;

  constructor(private route: ActivatedRoute, private dialogs: DialogsService, private service: PurchasesService,
    private commonService: CommonService, private adminService: AdminService, private uploadService: UploadService) {
    this.id = this.route.snapshot.params['id'];
    this.workItemsFilters = { workOrderId: this.id };
  }

  ngOnInit() {
    this.declineForm = new FormGroup({
      comments: new FormControl("", Validators.required)
    });

    this.workItemsConfig = {
      columns: [
        { label: 'Category', field: 'sku.category.name', type: 'text', styleClass: 'w-15', sortable: true },
        { label: 'Type', field: 'sku.type.name', type: 'text', styleClass: 'w-15', sortable: true },
        { label: 'Item', field: 'sku.name', type: 'text', styleClass: 'w-20', sortable: true },
        { label: 'UnitPrice', field: 'unitPrice', type: 'inr', styleClass: 'w-5 text-right', sortable: true },
        { label: 'Quantity', field: 'units', type: 'text', styleClass: 'w-5 text-center', sortable: true },
        { label: 'GST', field: 'gst', type: 'inr', styleClass: 'w-10  text-right', sortable: true },
        { label: 'Total', field: 'totalAmount', type: 'inr', styleClass: 'w-10  text-right', sortable: true },
        // { label: 'Discount', field: 'totalDiscount', type: 'inr', styleClass: 'w-10 text-center', sortable: true },
        { label: 'Status', field: 'status', type: 'text', styleClass: 'w-10 text-center', sortable: true },
      ],
      actions: [
        { icon: 'fa fa-check', hint: 'Approve Item', code: 'approveWorkItem', style: 'info', condition: { label: 'status', value: 'Draft' } },
        { icon: 'fa fa-times', hint: 'Decline Item', code: 'declineWorkItem', style: 'danger', condition: { label: 'status', value: 'Draft' } },
        { icon: 'fa fa-search', hint: 'View Declined Message', code: 'viewDeclinedMessage', style: 'info', condition: { label: 'status', value: 'Declined' } }
      ],
      options: {
        debounceDelay: 0,
        actionStyleClass: 'w-10 icons-td text-center',
      }
    }

    this.getWorkOrder();
  }

  getWorkOrder() {
    this.loading = true;
    this.service.getWorkOrder(this.id).pipe(take(1)).subscribe(
      res => {
        if (res['data']) {
          this.workOrder = res['data'];
        } else {
          this.dialogs.error("WorkOrder not exist with given ID", 'No WorkOrder')
        }
        this.loading = false;
      },
      error => {
        this.dialogs.error(error, 'Error while saving')
      }
    )
  }

  openedModal: any;
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

  openExpectedDatesModal() {
    this.openedModal = this.dialogs.modal(this.paymentTermsModal, { size: 'md' });
    var self = this;
    if (!this.workOrder.expectedDates) {
      console.log("!this.workOrder.expectedDates", this.workOrder.expectedDates)
      this.getMilestones();
    } else {
      console.log("Before Parsing::", this.workOrder.expectedDates);
      this.milestones = JSON.parse(this.workOrder.expectedDates);
      console.log("After Parsing :: ", this.milestones)
    }
    this.openedModal.result.then(function() {
      self.loading = false;
    }).catch(function(e) {
      self.loading = false;
    })
  }

  workItem: any = {};
  saveWorkItem() {
    console.log("WorkOrderViewComponent ::: saveWorkOrderContact :: workItem : ", this.workItem);
    this.service.saveWorkItem(this.workItem).pipe(take(1)).subscribe(
      res => {
        this.dialogs.success("WorkOrder Sku is saved successfully ");
        this.loading = false;
        this.workItemsList.reset();
        this.openedModal && this.openedModal.dismiss();
      },
      error => {
        this.dialogs.error(error, 'Error while saving')
      }
    )
  }

  autocompleteSkus: any = [];
  onSKuSearch(text: any) {
    var data = { filters: { search: text } }
    return this.service.searchSkus(data).pipe(take(1)).subscribe(
      res => {
        this.autocompleteSkus = res['data'];
      })
  }

  action(event) {
    console.log("LocationsComponent ::: action :: event ", event);
    if (event.action == 'approveWorkItem') {
      var workItem = _.clone(event.item);
      var item = {
        id: workItem.id,
        workOrderId: workItem.workOrderId,
        status: 'Approved'
      }
      this.approveDeclineWorkItem(item);
    } else if (event.action == 'declineWorkItem') {
      this.workItem = _.clone(event.item);
      this.openDeclineMessage();
    } else if (event.action == 'viewDeclinedMessage') {
      this.workItem = _.clone(event.item);
      this.openDeclineMessage();
    }
  }

  declinedComments: any;
  declineWorkItem() {
    var self = this;
    this.dialogs.confirm("Are you to decline " + this.workItem.sku.name + " ? ", "Decline WorkItem")
      .then(flag => {
        var item = {
          id: self.workItem.id,
          workOrderId: self.workItem.workOrderId,
          status: 'Declined',
          declinedComments: self.declinedComments
        }
        self.approveDeclineWorkItem(item);
      })
  }

  approveDeclineWorkItem(item) {
    console.log("WorkOrderViewComponent ::: approveDeclineWorkItem :: workItem : ", item);
    this.loading = true;
    this.service.approveDeclineWorkItem(item).pipe(take(1)).subscribe(
      res => {
        this.dialogs.success("WorkItem is " + item.status + " successfully ");
        this.loading = false;
        this.getWorkOrder();
        this.workItemsList.reset();
        this.openedModal && this.openedModal.dismiss();
      },
      error => {
        this.dialogs.error(error, 'Error while saving')
      }
    )
  }

  saveDates() {
    var self = this;
    if (this.workOrder.status == 'Raised') {
      this.dialogs.confirm("Are you sure to Approve and request vendor for Acceptance ").then(event => {
        if (event.value) {
          self.openedModal.close();
          self.requestVendorApproval();
        }
      })
    } else {
      this.dialogs.confirm("Are you sure to Update Milestone expected completion dates .?").then(event => {
        if (event.value) {
          self.loading = true;
          var data = {
            id: self.workOrder.id,
            expectedDates: JSON.stringify(self.milestones)
          }
          self.service.saveWorkOrder(data).subscribe(res => {
            self.openedModal.close();
            self.workOrder.expectedDates = data.expectedDates;
            self.dialogs.success("Milestone expected completion dates are updated.")
          })
        }
      })
    }
  }
  expectedDates: any = [];
  requestVendorApproval() {
    var data = {
      workOrderId: this.id,
      additionalChargesNote: this.workOrder.additionalChargesNote,
      deliveryCharges: this.workOrder.deliveryCharges,
      additionalCharges: this.workOrder.additionalCharges,
      expectedDates: JSON.stringify(this.milestones)
    }
    console.log("WorkOrderViewComponent ::: requestVendorApproval :: data ", data);
    this.loading = true;
    this.service.requestVendorApproval(data).pipe(take(1)).subscribe(
      res => {
        this.dialogs.success("Approval request sent to Vendor successfully ");
        this.getWorkOrder();
        this.loading = false;
      },
      error => {
        this.dialogs.error(error, 'Error while saving')
      }
    )
  }

  allItemsActed: any = false;
  workItemsLoaded() {
    var items = this.workItemsList.getItems();
    var draftItems = _.filter(items, { status: 'Draft' });
    if (!draftItems.length) {
      this.allItemsActed = true;
    }
  }

  raisePurchaseOrder() {
    var _items = this.workItemsList.getItems();
    var items = [];
    var dsta = this.getMilestones();
    this.getMilestonesWithExpectedDates();
    console.log("raisePurchaseOrder :: getMilestones:: ", this.milestones)
    var raisePurchaseOrder = true;
    _.each(_items, function(i) {
      items.push({
        id: i.id,
        vendorAcceptanceStatus: 'Accepted'
      })
    })
    var title = "Raise Purchase Order";
    var msg = "Are you sure to Proceed to Raise Purchase Order ? ";
    var data: any = {
      workOrderId: this.workOrder.id,
      items: items,
      milestones: this.milestones,
      raisePurchaseOrder: raisePurchaseOrder
    };
    if (this.workOrder.deliveryCharges) {
      data.deliveryCharges = this.workOrder.deliveryCharges;
    }
    if (this.workOrder.additionalCharges) {
      data.additionalCharges = this.workOrder.additionalCharges;
      data.additionalChargesNote = this.workOrder.additionalChargesNote;
    }
    console.log("raisePurchaseOrder :: data : ", data);
    var self = this;
    if(!this.milestones){
      this.dialogs.error('error', 'Milestone dates are missing')
    }
    else {
    this.dialogs.confirm(msg, title)
      .then(function(event) {
        if (event.value) {
          self.loading = true;
          self.service.raisePurchaseOrder(data).pipe(take(1)).subscribe(
            res => {
              self.loading = false;
              self.dialogs.success("Purchase Order raised successfully ..!");
              self.getWorkOrder();
            })
        }
      })
    }
  }

  getMilestonesWithExpectedDates() {
    if (this.workOrder.expectedDates) {
      this.milestones = JSON.parse(this.workOrder.expectedDates);
      console.log("this.workOrder.expectedDates", this.milestones)
      this.allExpectedDatesAdded = true;
    } else {
      this.getMilestones();
      console.log("this.getMilestones()",this.getMilestones())
    }
  }

  milestones: any = [];
  getMilestones() {
    var self = this;
    this.milestones = [];
    var items = this.workItemsList.getItems();
    var cost = _.sumBy(items, 'cost');
    var paymentTerm = this.workOrder.paymentTerm;
    var term: any;
    var lastTerm: any;

    if (paymentTerm.onAdvance) {
      term = {
        onAdvance: true,
        name: 'As Advance, payment of ' + paymentTerm.onAdvance + "%",
        amount: cost * (paymentTerm.onAdvance / 100)
      }
      this.milestones.push(term);
      lastTerm = term;
    }
    if (paymentTerm.onDelivery) {
      term = {
        onDelivery: true,
        name: 'On Delivery, payment of ' + paymentTerm.onDelivery + "%",
        amount: cost * (paymentTerm.onDelivery / 100)
      }
      this.milestones.push(term);
      lastTerm = term;
    }
    if (paymentTerm.inProgress) {
      var inProgressStages = [{ payment: paymentTerm.inProgress, paymentLabel: paymentTerm.inProgress, workProgress: 100 }];
      if (paymentTerm.inProgressStages) {
        inProgressStages = JSON.parse(paymentTerm.inProgressStages);
      }
      var actualStages = [];
      for (var i = 0; i < inProgressStages.length; i++) {
        var stage: any = inProgressStages[i];
        if (stage.payment > 0) {
          var stageAmount = cost * (stage.payment / 100);
          term = {
            inProgress: true,
            stage: i,
            name: 'In Progress, payment of ' + (stage.paymentLabel || stage.payment) + "% after " + stage.workProgress + "% of work done",
            amount: stageAmount,
          }
          actualStages.push(term);
        }
      }
      if (actualStages.length > 1) {
        _.each(actualStages, function(t) {
          self.milestones.push(t);
          lastTerm = t;
        })
      } else {
        term = {
          inProgress: true,
          stage: i,
          name: 'In Progress, payment of ' + paymentTerm.inProgress + "% after 100% of work done",
          amount: stageAmount,
        }
        this.milestones.push(term);
        lastTerm = term;
      }
    }
    if (paymentTerm.onFinish) {
      term = {
        onFinish: true,
        name: 'On Finish, payment of ' + paymentTerm.onFinish + "%",
        amount: cost * (paymentTerm.onFinish / 100)
      }
      this.milestones.push(term);
      lastTerm = term;
    }
    if (paymentTerm.afterFinish) {
      var afterFinishStages = [{ payment: paymentTerm.afterFinish, paymentLabel: paymentTerm.afterFinish, days: 10 }];
      if (paymentTerm.afterFinishStages) {
        afterFinishStages = JSON.parse(paymentTerm.afterFinishStages);
      }
      var actualStages = [];
      for (var i = 0; i < afterFinishStages.length; i++) {
        var stage: any = afterFinishStages[i];
        if (stage.payment > 0) {
          var stageAmount = cost * (stage.payment / 100);
          term = {
            afterFinish: true,
            stage: i,
            name: 'After Finish, payment of ' + (stage.paymentLabel || stage.payment) + "% after " + stage.days + " days",
            amount: stageAmount,
          }
          actualStages.push(term);
          lastTerm = term;
        }
      }
      if (actualStages.length > 1) {
        _.each(actualStages, function(t) {
          self.milestones.push(t);
          lastTerm = t;
        })
      } else {
        term = {
          afterFinish: true,
          name: 'After Finish, payment of ' + paymentTerm.afterFinish + "% after " + afterFinishStages[0]['days'] + " days ",
          amount: cost * (paymentTerm.afterFinish / 100)
        }
        this.milestones.push(term);
        lastTerm = term;
      }
    }
    console.log("Milestones:: ", this.milestones);

    var lastTermName = lastTerm.name + " + GST ";
    var lastTermAmount = lastTerm.amount + _.sumBy(items, 'gst');
    if (this.workOrder.additionalCharges) {
      lastTermName = lastTermName + " + Additional charges ";
      lastTermAmount = lastTermAmount + this.workOrder.additionalCharges;
    }
    if (this.workOrder.deliveryCharges) {
      lastTermName = lastTermName + " + Delivery charges ";
      lastTermAmount = lastTermAmount + this.workOrder.deliveryCharges;
    }
    this.milestones[this.milestones.length - 1].name = lastTermName;
    this.milestones[this.milestones.length - 1].amount = lastTermAmount;
  }
  allExpectedDatesAdded: any = false;
  expectedDateChanged() {
    var flag = true;
    var self =this;
    var lastMilestone;
    _.each(this.milestones, function(m) {
      if (!m.expectedDate) {
        flag = false;
      }
      if(lastMilestone && m.expectedDate && moment(lastMilestone.expectedDate).isAfter(moment(m.expectedDate))){
        flag = false;
        m.expectedDate = null;    
        self.dialogs.error("Expected date of " + m.name + " should be after " + lastMilestone.name + " expected date")
      }
      lastMilestone = m;
    })
    this.allExpectedDatesAdded = flag;
  }
}
