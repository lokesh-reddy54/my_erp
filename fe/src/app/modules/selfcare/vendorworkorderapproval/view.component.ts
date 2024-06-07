import { Component, OnInit, ViewChild } from '@angular/core';
import { ProductService } from 'src/app/shared/services/product.service';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { debounceTime, take } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from "@angular/common/http";
import { DialogsService } from 'src/app/shared/services/dialogs.services';
import { CommonService } from 'src/app/shared/services/common.service';
import { PurchasesService } from 'src/app/shared/services/purchases.service';
import { SelfcareService } from 'src/app/shared/services/selfcare.service';
import { PgClientService } from 'src/app/shared/services/pgclient.service';
import { Helpers } from '../../../helpers';
import { environment } from "../../../../environments/environment";
import * as _ from 'lodash';
import * as moment from 'moment';

@Component({
  selector: 'selfcare-vendorworkorderapproval',
  templateUrl: './view.component.html'
})
export class VendorWorkOrderApprovalComponent implements OnInit {
  id: any = "";
  loading: any = false;
  workOrder: any;
  workItem: any;
  deliveryCharges: any;
  additionalCharges: any;
  additionalChargesNote: any;

  rejectedForm: FormGroup;

  workItemsFilters: any = {};
  workItemsConfig: any = {};

  @ViewChild('workItemsList') workItemsList: any;
  @ViewChild('rejectedModal') rejectedModal: any;
  
  deadReasons: any = ['Out of Stock', 'Price not Matching', 'Out of Service', 'Other', 'Lack of Team']
  constructor(private route: ActivatedRoute, private dialogs: DialogsService,
    private service: SelfcareService, private commonService: CommonService, private purchasesService: PurchasesService) {
    this.id = this.route.snapshot.params['id'];
  }

  ngOnInit() {
    document.title = "Vendor Work Order Approval Request";
    this.getInitData();

    this.rejectedForm = new FormGroup({
      vendorRejectedReason: new FormControl("", Validators.required),
      comments: new FormControl(""),
    });

    this.workItemsConfig = {
      columns: [
        { label: 'Category', field: 'sku.category.name', type: 'text', styleClass: 'w-10', sortable: true },
        { label: 'Type', field: 'sku.type.name', type: 'text', styleClass: 'w-10', sortable: true },
        { label: 'Item', field: 'sku.name', type: 'text', styleClass: 'w-20', sortable: true },
        { label: 'UnitPrice', field: 'unitPrice', type: 'inr', styleClass: 'w-5', sortable: true },
        { label: 'Quantity', field: 'units', type: 'text', styleClass: 'w-5 text-center', sortable: true },
        { label: 'GST', field: 'gst', type: 'inr', styleClass: 'w-10 text-center', sortable: true },
        { label: 'Total', field: 'totalAmount', type: 'inr', styleClass: 'w-10 text-center', sortable: true },
        { label: 'Discount', field: 'totalDiscount', type: 'inr', styleClass: 'w-10 text-center', sortable: true },
        { label: 'Status', field: 'vendorAcceptanceStatus', type: 'text', styleClass: 'w-10 text-center', sortable: true },
      ],
      actions: [
        { icon: 'fa fa-check', hint: 'Accept Item', code: 'acceptWorkItem', style: 'info', condition: { label: 'vendorAcceptanceStatus', value: 'Waiting' } },
        { icon: 'fa fa-times', hint: 'Reject Item', code: 'rejectWorkItem', style: 'danger', condition: { label: 'vendorAcceptanceStatus', value: 'Waiting' } },
        { icon: 'fa fa-search', hint: 'View Rejected Message', code: 'viewRejectedMessage', style: 'info', condition: { label: 'vendorAcceptanceStatus', value: 'Rejected' } }
      ],
      options: {
        debounceDelay: 0,
        actionStyleClass: 'w-10 icons-td text-center',
      }
    }
  }

  getInitData() {
    this.service.getInitData(this.id).pipe(take(1)).subscribe(
      res => {
        var data = res['data'];
        this.workOrder = data;

        if (data.deliveryCharges) {
          this.hasDeliveryCharge = true;
          this.deliveryCharges = data.deliveryCharges;
        }

        if (data.additionalCharges) {
          this.hasAdditionalCharge = true;
          this.additionalCharges = data.additionalCharges;
          this.additionalChargesNote = data.additionalChargesNote;
        }

        this.workItemsFilters = { workOrderId: this.workOrder.id, statuses: [
          'Approved'
        ] };

        if (data.company) {
          document.title = data.company.name + " - " + "Vendor WorkOrder Acceptance";
        }
      })
  }

  action(event) {
    console.log("LocationsComponent ::: action :: event ", event);
    if (event.action == 'acceptWorkItem') {
      var workItem = event.item;
      workItem.vendorAcceptanceStatus = "Accepted";
      this.checkWorkItems();
    } else if (event.action == 'rejectWorkItem') {
      this.workItem = event.item;
      this.vendorRejectedReason = this.workItem.vendorRejectedReason;
      this.vendorRejectedComments = this.workItem.vendorRejectedComments;
      this.openRejectMessage();
    } else if (event.action == 'viewRejectedMessage') {
      this.workItem = _.clone(event.item);
      this.vendorRejectedReason = this.workItem.vendorRejectedReason;
      this.vendorRejectedComments = this.workItem.vendorRejectedComments;
      this.openRejectMessage();
    }
  }

  openedModal: any;
  vendorRejectedComments: any;
  vendorRejectedReason: any;
  openRejectMessage() {
    this.openedModal = this.dialogs.modal(this.rejectedModal, { size: 'md' });
    var self = this;
    this.openedModal.result.then(function() {
      self.loading = false;
    }).catch(function(e) {
      self.loading = false;
    })
  }

  rejectWorkItem() {
    var self = this;
    this.dialogs.confirm("Are you sure to reject " + this.workItem.sku.name + " ? ", "Reject WorkItem")
      .then(flag => {
        if (flag) {
          self.workItem.vendorRejectedComments = self.vendorRejectedComments;
          self.workItem.vendorAcceptanceStatus = "Rejected";
          self.workItem.vendorRejectedReason = self.vendorRejectedReason;
          self.openedModal && self.openedModal.dismiss();
          self.checkWorkItems();
        }
      })
  }

  submitted: any = false;
  hasDeliveryCharge: any = false;
  hasAdditionalCharge: any = false;
  raisePurchaseOrder() {
    var _items = this.workItemsList.getItems();
    var items = [];
    var raisePurchaseOrder = false;
    _.each(_items, function(i) {
      items.push({
        id: i.id,
        vendorAcceptanceStatus: i.vendorAcceptanceStatus,
        vendorRejectedReason: i.vendorRejectedReason,
        vendorRejectedComments: i.vendorRejectedComments
      })
      if (i.vendorAcceptanceStatus == 'Accepted') {
        raisePurchaseOrder = true;
      }
    })
    var title = "Raise Purchase Order";
    var msg = "Are you sure to Proceed to Raise Purchase Order ? ";
    if (this.allRejected) {
      title = "Reject Work Order";
      msg = "Are you sure to Proceed to Reject Work Order ? ";
    }
    var data: any = {
      workOrderId: this.workOrder.id,
      items: items,
      milestones: this.milestones,
      raisePurchaseOrder: raisePurchaseOrder
    };
    if (this.hasDeliveryCharge) {
      data.deliveryCharges = this.deliveryCharges;
    }
    if (this.hasAdditionalCharge) {
      data.additionalCharges = this.additionalCharges;
      data.additionalChargesNote = this.additionalChargesNote;
    }
    var self = this;
    this.dialogs.confirm(msg, title)
      .then(function(event) {
        if (event.value) {
          self.loading = true;
          self.purchasesService.raisePurchaseOrder(data).pipe(take(1)).subscribe(
            res => {
              self.loading = false;
              self.allItemsActed = false;
              self.allRejected = false;
              self.submitted = true;
              if (raisePurchaseOrder) {
                self.getInitData();
                self.dialogs.success("Purchase Order raised successfully ..!")
              } else {
                self.dialogs.success("Work Order is rejected  ..!")
              }
            })
        }
      })
  }

  allItemsActed: any = false;
  allRejected: any = false;
  checkWorkItems() {
    var items = this.workItemsList.getItems();
    var draftItems = _.filter(items, { vendorAcceptanceStatus: 'Waiting' });
    if (!draftItems.length) {
      this.allItemsActed = true;
    }
    var rejectedItems = _.filter(items, { vendorAcceptanceStatus: 'Rejected' });
    if (items.length == rejectedItems.length) {
      this.allItemsActed = false;
      this.allRejected = true;
    }

    if (this.allItemsActed) {
      if (this.workOrder.expectedDates) {
        this.milestones = JSON.parse(this.workOrder.expectedDates);
        console.log("this.workOrder.expectedDates", this.milestones)
        this.allExpectedDatesAdded = true;
      } else {
        this.getMilestones();
        console.log("WorkOrder Milestones Expected Dates :::: ", this.workOrder)
        console.log("this.getMilestones()",this.getMilestones())
      }
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
      console.log("this.getMilestones()+++++", this.milestones)
    }

    var lastTermName = lastTerm.name + " + GST ";
    var lastTermAmount = lastTerm.amount + _.sumBy(items, 'gst');
    if (this.hasAdditionalCharge) {
      lastTermName = lastTermName + " + Additional charges ";
      lastTermAmount = lastTermAmount + this.additionalCharges;
    }
    if (this.hasDeliveryCharge) {
      lastTermName = lastTermName + " + Delivery charges ";
      lastTermAmount = lastTermAmount + this.deliveryCharges;
    }
    this.milestones[this.milestones.length - 1].name = lastTermName;
    this.milestones[this.milestones.length - 1].amount = lastTermAmount;
  }

  allExpectedDatesAdded: any = true;
  expectedDateChanged() {
    var flag = true;
    _.each(this.milestones, function(m) {
      if (!m.expectedDate) {
        flag = false;
      }
    })
    this.allExpectedDatesAdded = flag;
  }

  
}
