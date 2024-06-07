import { Component, OnInit, ViewChild } from '@angular/core';
import { ProductService } from 'src/app/shared/services/product.service';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { debounceTime, take } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { HttpClient } from "@angular/common/http";
import { DialogsService } from 'src/app/shared/services/dialogs.services';
import { AdminService } from 'src/app/shared/services/admin.service';
import { PurchasesService } from 'src/app/shared/services/purchases.service';
import { ReportsService } from 'src/app/shared/services/reports.service';
import { Helpers } from '../../../helpers';
import * as _ from 'lodash';
import * as moment from 'moment';

@Component({
  selector: 'accounts-po-list',
  templateUrl: './list.component.html'
})
export class AccountsPOsListComponent implements OnInit {
  searchControl: FormControl = new FormControl();
  vendorControl: FormControl = new FormControl("");
  skuControl: FormControl = new FormControl("");
  selectBuildingControl: FormControl = new FormControl([]);

  workOrderForm: FormGroup;
  purchaseOrderForm: FormGroup;
  vendorPaymentTermForm: FormGroup;

  vendor: any = { contact: {} };
  purchaseItem: any = {};
  purchaseOrder: any = {};
  config: any = {};
  @ViewChild('list') list: any;
  @ViewChild('purchaseOrderModal') purchaseOrderModal: any;

  openedModal: any;
  items: any = [];
  selectedItem: any = {};
  loading: boolean = false;
  noResults: boolean = false;
  offset: number = 0;
  limit: number = 20;
  filter: any = { statuses: ['Raised', 'Started'], isOpex: 1 };

  vendorsObservable: Observable<any[]>;
  isHq: any = 0;
  user: any = {};
  constructor(public router: Router, private dialogs: DialogsService,
    private route: ActivatedRoute, private service: PurchasesService,
    private reportService: ReportsService, private adminService: AdminService) {
    this.isHq = parseInt(this.route.snapshot.params['ho']);
  }

  ngOnInit() {
    var user = localStorage.getItem("cwo_user");
    if (user) {
      this.user = JSON.parse(user);
    }
    this.workOrderForm = new FormGroup({});
    this.purchaseOrderForm = new FormGroup({
      units: new FormControl(""),
      unitPrice: new FormControl(""),
      deliveryCharges: new FormControl(""),
      additionalCharges: new FormControl(""),
      additionalChargesNote: new FormControl(""),
    });

    this.vendorPaymentTermForm = new FormGroup({
      name: new FormControl("", Validators.required),
      onAdvance: new FormControl("", Validators.required),
      onDelivery: new FormControl("", Validators.required),
      onFinish: new FormControl("", Validators.required),
      inProgress: new FormControl("", Validators.required),
      afterFinish: new FormControl("", Validators.required),
    });

    this.searchControl.valueChanges
      .pipe(debounceTime(200))
      .subscribe(value => {
        this.filter.search = value;
        this.resetList();
      });

    this.config = {
      columns: [
        { label: 'Building', field: 'building.name', type: 'text', styleClass: 'w-10', sortable: true },
        { label: 'Vendor', field: 'vendor.name', type: 'text', styleClass: 'w-30', sortable: true },
        { label: 'RefNo', field: 'refNo', type: 'text', styleClass: 'w-10 text-left', sortable: true },
        { label: 'Approved By', field: 'approvedBy', type: 'text', styleClass: 'w-10 text-left', sortable: true },
        { label: 'Raised On', field: 'date', type: 'date', styleClass: 'w-10 text-right', sortable: true },
        { label: 'Amount', field: 'amount', type: 'inr', styleClass: 'w-10 text-right', sortable: true },
        { label: 'Status', field: 'status', type: 'text', styleClass: 'w-10 text-center', sortable: true },
      ],
      actions: [
        // { icon: 'i-Pen-5', hint: 'Edit', code: 'edit', style: 'info' },
        { icon: 'i-Dollar-Sign', hint: 'Toogle Opex', code: 'markOpex', style: 'info' },
        { icon: 'i-Magnifi-Glass1', hint: 'View', code: 'view', style: 'info' },
      ],
      options: {
        debounceDelay: 500,
        actionStyleClass: 'w-10 icons-td text-center',
      }
    }

    this.loadBuildingPurchaseOrders();
    this.getPurchaseOrdersByStatus();
  }

  openPurchaseOrderModal() {
    this.openedModal = this.dialogs.modal(this.purchaseOrderModal, { size: 'lg', backdrop: 'static' });
    var self = this;
    this.openedModal.result.then(function() {
      self.selectedVendors = [];
      self.selectedBuildings = [];
      self.selectedSkus = [];
      self.selectedItems = [];
    }).catch(function(e) {
      self.selectedVendors = [];
      self.selectedBuildings = [];
      self.selectedSkus = [];
      self.selectedItems = [];
    })
  }

  action(event) {
    console.log("AccountsPOsListComponent ::: action :: event ", event);
    if (event.action == 'edit') {
      var vendor = _.clone(event.item);
      this.vendor = vendor;
      this.openPurchaseOrderModal();
    } else if (event.action == 'view') {
      this.router.navigateByUrl('/purchases/purchaseorder/' + event.item.id);
    } else if (event.action == 'markOpex') {
      this.service.savePurchaseOrder({ id: event.item.id, isOpex: !event.item.isOpex }).subscribe(res => {
        if (res['data']) {
          this.dialogs.success("PO for " + event.item.vendor.name + " of " + event.item.building.name + " is marked as OpEx");
          this.list.reset();
        }
      })
    }
  }

  viewPO(po) {
    // this.router.navigateByUrl('/purchases/purchaseorder/' + po.id);
    window.open("#//purchases/purchaseorder/" + po.id, "_blank");
  }
  markOpex(po) {
    this.service.savePurchaseOrder({ id: po.id, isOpex: !po.isOpex }).subscribe(res => {
      if (res['data']) {
        this.dialogs.success("PO for " + po.vendor.name + " of " + po.building.name + " is marked as OpEx");
        this.resetList();
      }
    })
  }

  loadMore() {
    console.log("loadmore :: ");
    if (!this.loading && !this.noResults) {
      this.loading = true;

      if (this.isHq) {
        // this.filter.buildingId = -1;
        this.filter.isHq = 1;
      } else {
        this.filter.isHq = 0;
      }
      var data = { filters: this.filter, limit: this.limit, offset: this.offset, sortBy: this.sortBy, sortOrder: this.sortOrder };
      this.service.listPurchaseOrders(data)
        .pipe(take(1)).subscribe((res) => {
          console.log("PurchaseOrders :: loadMore : res : ", res);
          if (res['data']) {
            var data = res['data'];

            _.each(data, function(d) {
              if (!d.paidAmount) {
                if (moment(d.date).isBefore(moment().add(-30, 'days'))) {
                  d.raisedMarker = 'bg-danger';
                } else {
                  if (moment(d.date).isBefore(moment().add(-15, 'days'))) {
                    d.raisedMarker = 'bg-warning';
                  }
                }
              }
            })
            this.items = this.items.concat(data);
            this.loading = false;
            if (res['data'].length >= this.limit) {
              this.offset = this.offset + this.limit;
            } else {
              this.noResults = true;
            }
          } else {
            this.dialogs.error(res['error'], "Error")
          }
        });
    }
  }

  updatePOStatus(po) {
    var data: any = {
      id: po.id,
      status: po.status
    }
    this.service.savePurchaseOrder(data)
      .pipe(take(1)).subscribe((res) => {
        this.dialogs.success("Status updated !!")
      });
  }

  moreFilters: any = true;
  resetList() {
    this.items = [];
    this.offset = 0;
    this.limit = 20;
    this.noResults = false;
    this.loadMore();
    if (this.moreFilters) {
      this.loadBuildingPurchaseOrders();
      this.getPurchaseOrdersByStatus();
    }
  }

  selectedBuilding: any = {};
  buildingPurchaseOrders: any = [];
  posByStatuses: any = [];
  loadBuildingPurchaseOrders() {
    this.reportService.loadBuildingPurchaseOrders({
      statuses: this.filter.statuses,
      isOpex: this.filter.isOpex || 0
    }).subscribe(res => {
      this.buildingPurchaseOrders = res['data'];
    })
  }

  totalPurchaseOrdersCount: any = 0;
  yellowPos: any = 0;
  redPos: any = 0;
  getPurchaseOrdersByStatus() {
    this.reportService.getPurchaseOrdersByStatus({
      statuses: this.filter.statuses,
      buildingId: this.selectedBuilding.id,
      isOpex: this.filter.isOpex || 0,
      isHq: this.isHq
    }).subscribe(res => {
      this.posByStatuses = res['data']['statuses'];
      this.redPos = res['data']['redPos'][0]['count'];
      this.yellowPos = res['data']['yellowPos'][0]['count'];
      this.totalPurchaseOrdersCount = _.sumBy(this.posByStatuses, 'count');
    })
  }

  selectBuilding(building) {
    if (!this.selectedBuilding || this.selectedBuilding.id != building.id) {
      this.selectedBuilding = building;
      this.filter.buildingId = building.id;
    } else {
      this.selectedBuilding = null;
      this.filter.buildingId = null;
    }
    this.resetList();
  }

  autocompleteBuildings: any = [];
  selectedBuildings: any = [];
  onBuildingSearch(text: any) {
    var data = { filters: { search: text, typeSearch: true } }
    return this.adminService.listBuildings(data).pipe(take(1)).subscribe(
      res => {
        this.autocompleteBuildings = res['data'];
      })
  }

  autocompleteVendors: any = [];
  selectedVendors: any = [];
  vendorPaymentTerms: any = [{ id: 1, name: '223232 23234 2342' }];
  paymentTerm: any;
  onVendorSearch(text: any) {
    var data = { filters: { search: text, typeSearch: true } }
    return this.service.listVendors(data).pipe(take(1)).subscribe(
      res => {
        this.autocompleteVendors = res['data'];
      })
  }
  onVendorSelected() {
    if (this.selectedVendors.length) {
      this.selectedVendor = this.selectedVendors[0];
      var data = { filters: { vendorId: this.selectedVendor.id } }
      return this.service.listVendorPaymentTerms(data).pipe(take(1)).subscribe(
        res => {
          this.vendorPaymentTerms = res['data'];
        })
    }
  }

  vendorWorkOrders: any = [];
  selectedSkus: any = [];
  autocompleteSkus: any = [];
  onSkuSearch(text: any) {
    var data = { filters: { search: text, vendorId: this.selectedVendor.id } }
    return this.service.searchSkus(data).pipe(take(1)).subscribe(
      res => {
        this.autocompleteSkus = res['data'];
      })
  }

  selectedItems: any = [];
  addPurchaseItem() {
    this.selectedItems.push({
      status: "Ordered",
      skuId: this.selectedSkus[0].skuId,
      skuName: this.selectedSkus[0].sku,
      description: this.selectedSkus[0].sku + ", " + this.selectedSkus[0].type + ", " + this.selectedSkus[0].category,
      vendorId: this.selectedVendors[0].id,
      vendor: this.selectedVendors[0].name,
      paymentTermId: this.paymentTerm.id,
      paymentTerm: this.paymentTerm.name,
      paymentTermTag: this.paymentTerm.tagName,
      units: this.purchaseItem.units,
      unitPrice: this.purchaseItem.unitPrice,
      taxableAmount: (this.purchaseItem.units * this.purchaseItem.unitPrice),
      gst: (this.purchaseItem.units * this.purchaseItem.unitPrice) * ((this.selectedSkus[0].gst || 18) / 100),
      amount: (this.purchaseItem.units * this.purchaseItem.unitPrice) * ((100 + (this.selectedSkus[0].gst || 18)) / 100)
    });
    this.dialogs.success("SKU '" + this.selectedSkus[0].sku + "' is added to purchase order list");

    this.selectedSkus = [];
    this.purchaseItem = {};
  }

  milestones: any = [];
  getMilestones(items) {
    var self = this;
    this.milestones = [];
    var cost = _.sumBy(items, 'amount');
    var paymentTerm = this.paymentTerm;
    var term: any;
    var lastTerm: any;

    if (!paymentTerm) {
      term = {
        onFinish: true,
        name: "Full Payment ",
        amount: cost
      }
      this.milestones.push(term);
      lastTerm = term;
    } else {
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
    }

    var lastTermName = lastTerm.name + " + GST ";
    var lastTermAmount = lastTerm.amount + _.sumBy(items, 'gst');
    if (this.additionalCharges) {
      lastTermName = lastTermName + " + Additional charges ";
      lastTermAmount = lastTermAmount + this.additionalCharges;
    }
    if (this.deliveryCharges) {
      lastTermName = lastTermName + " + Delivery charges ";
      lastTermAmount = lastTermAmount + this.deliveryCharges;
    }
    this.milestones[this.milestones.length - 1].name = lastTermName;
    this.milestones[this.milestones.length - 1].amount = lastTermAmount;

    return this.milestones;
  }

  deliveryCharges: any = 0;
  additionalChargesNote: any;
  additionalCharges: any = 0;
  raisePurchaseOrder() {
    console.log("PurchaseComponent ::: raisePurchaseOrder :: purchaseOrder ", this.selectedItems);
    this.loading = true;
    var self = this;
    var data: any = {
      raisePurchaseOrder: true,
      isOpex: 1,
      executive: this.user.id,
      vendorId: this.selectedVendors[0].id,
      buildingId: this.selectedBuildings[0].id,
      items: this.selectedItems,
      deliveryCharges: this.deliveryCharges,
      additionalCharges: this.additionalCharges,
      additionalChargesNote: this.additionalChargesNote,
    }
    data.milestones = this.getMilestones(data.items);
    this.service.raisePurchaseOrder(data).pipe(take(1)).subscribe(
      res => {
        if (res['data']) {
          self.dialogs.success("Purchase order for " + this.selectedVendors[0].name + " have raised successfully ");
          this.resetList();
          this.openedModal.close();
          this.selectedItems = [];
        } else {
          this.dialogs.error(res['error']);
        }
        self.loading = false;
      },
      error => {
        self.dialogs.error(error, 'Error while saving')
      }
    )
  }

  @ViewChild('workOrderModal') workOrderModal: any;
  workOrder: any = {};
  woType: any;
  currentPo: any = {};
  repeatPO(po) {
    var self = this;
    this.currentPo = po;
    console.log("Repeat PO : ", po);
    this.service.prepareRepeatPO(po.workOrderId)
      .subscribe(res => {
        var data = res['data'];
        delete data.id;
        this.selectedVendor = data.vendor;
        this.getVendorPaymentTerms();
        this.selectedItems = [];

        _.each(data.items, function(i) {
          var item = {
            skuId: i.skuId,
            skuGst: i.sku.gst,
            description: i.sku.description,
            skuName: i.sku.name + ", " + i.sku.type.name + ", " + i.sku.category.name,
            quantity: i.units,
            price: i.unitPrice,
            vendorId: self.selectedVendor.id
          }
          self.selectedItems.push(item);
        })
        this.workOrder = data;
      })
    this.openedModal = this.dialogs.modal(this.workOrderModal, { size: 'lg', backdrop: 'static', keyboard: false });
    var self = this;
    this.openedModal.result.then(function() {
      self.workOrder = {};
      self.selectedSkus = [];
      self.selectedItems = [];
      self.selectedVendor = {};
      self.selectedPaymentTerm = {};
    }).catch(function(e) {
      self.workOrder = {};
      self.selectedSkus = [];
      self.selectedItems = [];
      self.selectedVendor = {};
      self.selectedPaymentTerm = {};
    })
  }

  selectedPaymentTerm: any;
  selectedVendor: any;
  vendorSelected(event) {
    console.log("Vendor Selected :: ", event);
    this.selectedVendor = event;
    this.getVendorPaymentTerms();
  }

  getVendorPaymentTerms() {
    this.service.listVendorPaymentTerms({ filters: { vendorId: this.selectedVendor.id } })
      .subscribe(res => {
        var vendorPaymentTerms = res['data'];
        _.each(vendorPaymentTerms, function(pt) {
          pt.name = pt.name + " " + pt.tagName;
        })
        this.vendorPaymentTerms = vendorPaymentTerms;

        this.selectedPaymentTerm = _.find(vendorPaymentTerms, { id: this.workOrder.paymentTermId });
      })
  }

  selectedSku: any;
  skuSelected() {
    this.selectedSku = _.clone(this.selectedSkus[0]);
  }

  addItem() {
    var sku = _.clone(this.selectedSkus[0]);
    console.log("PurchaseComponent ::: addItem :: sku item : ", sku);
    var item = {
      skuId: sku.skuId,
      skuGst: sku.gst,
      description: sku.description,
      skuName: sku.sku + ", " + sku.type + ", " + sku.category,
      quantity: sku.quantity,
      price: sku.price,
      vendorId: this.selectedVendor.id,
      paymentTermId: this.selectedPaymentTerm.id
    }
    this.selectedItems.push(item);
    this.selectedSkus = [];

    if (this.selectedSku.price != sku.price) {
      this.service.updateVendorSkuLastPrice(item).subscribe();
    }
  }

  removeSelectedItem(item) {
    this.selectedItems = _.without(this.selectedItems, item);
  }

  raiseWorkOrders() {
    console.log("PurchaseComponent ::: raiseWorkOrders :: workOrder ", this.selectedItems);
    this.loading = true;
    var self = this;

    _.each(this.selectedItems, function(i) {
      i.vendorId = self.selectedVendor.id;
      i.paymentTermId = self.selectedPaymentTerm.id
    });

    this.service.raiseWorkOrders({
      projectId: this.currentPo.projectId,
      buildingId: this.currentPo.buildingId,
      items: this.selectedItems
    }).pipe(take(1)).subscribe(
      res => {
        self.dialogs.success(res['data'] + " work orders have raised successfully ");
        self.loading = false;
        this.openedModal.close();
        this.selectedItems = [];
        this.woType = null;
        this.woType = null;
        this.selectedVendor = null;
      },
      error => {
        self.dialogs.error(error, 'Error while saving')
      }
    )
  }


  @ViewChild('vendorPaymentTermModal') vendorPaymentTermModal: any;
  validPaymentTerm: any = false;
  openVendorPaymentTerm(vendorPaymentTerm?: any) {
    this.vendorPaymentTerm = { onAdvance: 0, onDelivery: 0, onFinish: 0, inProgress: 0, afterFinish: 0 };
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
    }).catch(function(e) {
      self.vendorPaymentTerm = {};
      self.loading = false;
      self.validPaymentTerm = false;
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
      this.inProgressStages.push({ payment: 0, workProgress: 100 });
      this.inProgressStages.push({ payment: 0, workProgress: 0 });
      this.inProgressStages.push({ payment: 0, workProgress: 0 });
    } else if (!this.vendorPaymentTerm.inProgress && this.inProgressStages.length) {
      this.inProgressStages = [];
    }
    if (this.vendorPaymentTerm.afterFinish > 0 && this.afterFinishStages.length == 0) {
      this.afterFinishStages.push({ payment: 0, days: 30 });
      this.afterFinishStages.push({ payment: 0, days: 0 });
      this.afterFinishStages.push({ payment: 0, days: 0 });
    } else if (!this.vendorPaymentTerm.afterFinish && this.afterFinishStages.length) {
      this.afterFinishStages = [];
    }
  }

  vendorPaymentTerm: any = {};
  saveVendorPaymentTerm() {
    console.log("LeadCOmponent ::: saveVendorContact :: vendorPaymentTerm : ", this.vendorPaymentTerm);
    this.vendorPaymentTerm.vendorId = this.selectedVendor.id;
    var vendorPaymentTerm = _.clone(this.vendorPaymentTerm);
    vendorPaymentTerm.inProgressStages = JSON.stringify(this.inProgressStages);
    vendorPaymentTerm.afterFinishStages = JSON.stringify(this.afterFinishStages);
    this.service.saveVendorPaymentTerm(vendorPaymentTerm).pipe(take(1)).subscribe(
      res => {
        this.dialogs.success("Vendor PaymentTerm is saved successfully ");
        this.loading = false;
        this.openedModal && this.openedModal.dismiss();
        this.getVendorPaymentTerms();
        this.selectedPaymentTerm = res['data'];
      },
      error => {
        this.dialogs.error(error, 'Error while saving')
      }
    )
  }


  sort: any = {};
  sortBy: any;
  sortOrder: any;
  sortColBy(col) {
    var sort = _.clone(this.sort);
    var _sort = {};
    var sortType = 'asc';
    if (sort[col] && sort[col].asc) {
      sort[col].asc = false;
      sort[col].desc = true;
      sortType = 'desc';
      this.sort = sort;
      this.sortOrder = 'desc';
    } else {
      _sort[col] = { asc: true };
      this.sort = _sort;
      this.sortOrder = 'asc';
    }
    this.sortBy = col;
    this.resetList();
  }


}
