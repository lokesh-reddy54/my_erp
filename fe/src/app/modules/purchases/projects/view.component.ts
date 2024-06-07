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
import { ReportsService } from 'src/app/shared/services/reports.service';
import { AssetsService } from 'src/app/shared/services/assets.service';
import { Utils } from 'src/app/shared/utils';

import { Helpers } from '../../../helpers';
import * as _ from 'lodash';
import * as moment from 'moment';

@Component({
  selector: 'project-view',
  templateUrl: './view.component.html'
})
export class ProjectViewComponent implements OnInit {
  skuControl = new FormControl([]);
  vendorControl = new FormControl([]);
  searchControl: FormControl = new FormControl();
  workOrderSearchControl: FormControl = new FormControl();
  purchaseOrderSearchControl: FormControl = new FormControl();
  billsSearchControl: FormControl = new FormControl();
  workOrderForm: FormGroup;
  vendorPaymentTermForm: FormGroup;

  billForm: FormGroup;
  payoutForm: FormGroup;
  vendorForm: FormGroup;
  portalPaidForm: FormGroup;

  billsFilters: any = { statuses: ['Raised', 'Approved', 'Paid', 'Draft'] };
  purchaseOrdersFilters: any = { statuses: ['Raised', 'Started', 'Closed'] };
  purchaseOrdersConfig: any = {};

  purchaseItemsFilters: any = {};
  purchaseItemsConfig: any = {};

  workOrdersFilters: any = { statuses: ['Raised', 'Approved', 'PORaised'] };
  workOrdersConfig: any = {};

  statusesFilters: any = {};
  statusesConfig: any = {};

  id: any = 1;
  user: any = {};

  @ViewChild('purchaseItemsList') purchaseItemsList: any;
  @ViewChild('purchaseOrdersList') purchaseOrdersList: any;
  @ViewChild('workOrdersList') workOrdersList: any;
  @ViewChild('workOrderModal') workOrderModal: any;
  @ViewChild('billItemsModal') billItemsModal: any;
  @ViewChild('itemDeliveryModal') itemDeliveryModal: any;
  @ViewChild('vendorPaymentTermModal') vendorPaymentTermModal: any;

  project: any = { vendor: {}, building: {}, workOrder: {} };
  loading: boolean = false;

  constructor(private route: ActivatedRoute, public router: Router, private dialogs: DialogsService, private service: PurchasesService,
    private reportService: ReportsService, private commonService: CommonService, private assetsService: AssetsService,
    private adminService: AdminService, private uploadService: UploadService) {
    this.id = parseInt(this.route.snapshot.params['id']);
    this.purchaseOrdersFilters.projectId = this.id;
    this.workOrdersFilters.projectId = this.id;
    this.purchaseItemsFilters = { projectId: this.id, status: 'Ordered', notDelivered: true };
  }

  ngOnInit() {
    var user = localStorage.getItem("cwo_user");
    if (user && user != '') {
      this.user = JSON.parse(user);
    }

    this.workOrderSearchControl.valueChanges
      .pipe(debounceTime(200))
      .subscribe(value => {
        this.workOrdersFilters.search = value;
        this.resetWorkOrdersList();
      });

    this.purchaseOrderSearchControl.valueChanges
      .pipe(debounceTime(200))
      .subscribe(value => {
        this.purchaseOrdersFilters.search = value;
        this.resetPurchaseOrdersList();
      });

    this.billsSearchControl.valueChanges
      .pipe(debounceTime(200))
      .subscribe(value => {
        this.billsFilters.search = value;
        this.resetBillsList();
      });

    this.billForm = new FormGroup({
      // skuTypeId: new FormControl("", Validators.required),
      vendorId: new FormControl("", Validators.required),
      billDate: new FormControl("", Validators.required),
      dueDate: new FormControl(""),
      paidDate: new FormControl(""),
      amount: new FormControl("", Validators.required),
      tds: new FormControl(""),
    });

    this.payoutForm = new FormGroup({
      paymentMode: new FormControl("", Validators.required),
      utr: new FormControl("", Validators.required)
    })
    this.portalPaidForm = new FormGroup({
      utr: new FormControl("", Validators.required),
      paidDate: new FormControl("", Validators.required),
      notes: new FormControl("")
    });

    this.vendorForm = new FormGroup({
      name: new FormControl("", Validators.required),
      address: new FormControl("", Validators.required),
      paymentMode: new FormControl("", Validators.required),
      type: new FormControl("", Validators.required)
    });

    this.workOrderForm = new FormGroup({
      // skuId: new FormControl("", Validators.required)
    });
    this.vendorPaymentTermForm = new FormGroup({
      name: new FormControl("", Validators.required),
      onAdvance: new FormControl("", Validators.required),
      onDelivery: new FormControl("", Validators.required),
      onFinish: new FormControl("", Validators.required),
      inProgress: new FormControl("", Validators.required),
      afterFinish: new FormControl("", Validators.required),
    });

    this.purchaseItemsConfig = {
      columns: [
        { label: 'Category', field: 'sku.category.name', type: 'text', styleClass: 'w-10', sortable: true },
        { label: 'Type', field: 'sku.type.name', type: 'text', styleClass: 'w-10', sortable: true },
        { label: 'Item', field: 'sku.name', type: 'text', styleClass: 'w-35', sortable: true },
        { label: 'Units', field: 'units', type: 'text', styleClass: 'w-5 text-center', sortable: true },
        { label: 'UnitPrice', field: 'unitPrice', type: 'inr', styleClass: 'w-10 text-center', sortable: true },
        { label: 'GST', field: 'gst', type: 'inr', styleClass: 'w-10 text-center', sortable: true },
        { label: 'Total', field: 'amount', type: 'inr', styleClass: 'w-10 text-center', sortable: true },
        { label: 'Delivered', field: 'delivered', type: 'boolean', styleClass: 'w-5 text-center', sortable: true }
      ],
      actions: [
        { icon: 'fa fa-truck', hint: 'Mark Delivered', code: 'markAsDelivered', style: 'primary', condition: { label: 'isAsset', value: '1' } }
      ],
      options: {
        debounceDelay: 0,
        actionStyleClass: 'w-5 icons-td text-center',
      }
    }

    this.purchaseOrdersConfig = {
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
        { icon: 'i-Dollar-Sign', hint: 'Toogle Opex', code: 'markPOOpex', style: 'info' },
        { icon: 'i-Magnifi-Glass1', hint: 'View', code: 'viewPO', style: 'info' },
      ],
      options: {
        debounceDelay: 500,
        actionStyleClass: 'w-10 icons-td text-center',
      }
    }

    this.workOrdersConfig = {
      columns: [
        { label: 'Vendor', field: 'vendor.name', type: 'text', styleClass: 'w-30', sortable: true },
        { label: 'RefNo', field: 'refNo', type: 'text', styleClass: 'w-20 text-center', sortable: true },
        { label: 'ProposedBy', field: 'proposedBy', type: 'text', styleClass: 'w-10 text-left', sortable: true },
        { label: 'ProposedOn', field: 'proposedOn', type: 'date', styleClass: 'w-10 text-left', sortable: true },
        { label: 'Budget', field: 'budget', type: 'inr', styleClass: 'w-10 text-right', sortable: true },
        { label: 'Status', field: 'status', type: 'text', styleClass: 'w-10 text-center', sortable: true },
      ],
      actions: [
        // { icon: 'i-Pen-5', hint: 'Edit', code: 'edit', style: 'info' },
        { icon: 'i-Magnifi-Glass1', hint: 'View', code: 'viewWO', style: 'info' },
      ],
      options: {
        debounceDelay: 500,
        actionStyleClass: 'w-10 icons-td text-center',
      }
    }

    this.getProject();
    // this.openWorkOrderModal();
    this.getWorkOrdersByStatus();
    this.resetPurchaseOrdersList();
    this.getBillsByStatus();
  }

  dueAmount: any = 0;
  upcomingAmount: any = 0;
  getProject() {
    this.loading = true;
    this.service.getProject(this.id).pipe(take(1)).subscribe(
      res => {
        if (res['data']) {
          this.project = res['data'];

          this.upcomingAmount = _.sumBy(this.project.upcomingMilestones, 'amount');
          this.dueAmount = _.sumBy(this.project.dueMilestones, 'amount');
        } else {
          this.dialogs.error("Project not exist with given ID", 'No Project')
        }
        this.loading = false;
      },
      error => {
        this.dialogs.error(error, 'Error while saving')
      }
    )
  }

  resetWorkOrdersList() {
    // this.workOrdersList.reset();
    this.workOrders = [];
    this.workOrdersOffset = 0;
    this.workOrdersLimit = 20;
    this.noWOResults = false;
    this.loadMoreWorkOrders();
    this.getWorkOrdersByStatus();
  }
  workOrders: any = [];
  workOrdersOffset: any = 0;
  workOrdersLimit: any = 20;
  noWOResults: any = false;
  loadMoreWorkOrders() {
    console.log("loadmore :: ");
    if (!this.loading && !this.noWOResults) {
      this.loading = true;
      this.workOrdersFilters.projectId = this.project.id;

      var data = {
        filters: this.workOrdersFilters, limit: this.workOrdersLimit,
        offset: this.workOrdersOffset,
        sortBy: this.workOrdersSortBy,
        sortOrder: this.workOrdersSortOrder
      };
      this.service.listWorkOrders(data)
        .pipe(take(1)).subscribe((res) => {
          console.log("Projects :: loadMoreWorkOrders : res : ", res);
          if (res['data']) {
            var data = res['data'];
            this.workOrders = this.workOrders.concat(data);
            this.loading = false;
            if (res['data'].length >= this.workOrdersLimit) {
              this.workOrdersOffset = this.workOrdersOffset + this.workOrdersLimit;
            } else {
              this.noWOResults = true;
            }
          } else {
            this.dialogs.error(res['error'], "Error")
          }
        });
    }
  }
  updateWOStatus(wo) {
    var data: any = {
      id: wo.id,
      status: wo.status
    }
    this.service.saveWorkOrder(data)
      .pipe(take(1)).subscribe((res) => {
        this.dialogs.success("Status updated !!")
      });
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
  resetPurchaseOrdersList() {
    // this.purchaseOrdersList.reset();
    this.purchaseOrders = [];
    this.purchaseOrdersOffset = 0;
    this.purchaseOrdersLimit = 20;
    this.noPOResults = false;
    this.loadMorePurchaseOrders();
    this.getPurchaseOrdersByStatus();
  }

  purchaseOrders: any = [];
  purchaseOrdersOffset: any = 0;
  purchaseOrdersLimit: any = 20;
  noPOResults: any = false;
  loadMorePurchaseOrders() {
    console.log("loadmore :: ");
    if (!this.loading && !this.noPOResults) {
      this.loading = true;
      this.purchaseOrdersFilters.projectId = this.project.id;
      var data = {
        filters: this.purchaseOrdersFilters, limit: this.purchaseOrdersLimit,
        offset: this.purchaseOrdersOffset,
        sortBy: this.purchaseOrdersSortBy,
        sortOrder: this.purchaseOrdersSortOrder
      };
      this.service.listPurchaseOrders(data)
        .pipe(take(1)).subscribe((res) => {
          console.log("PurchaseOrders :: loadMore : res : ", res);
          if (res['data']) {
            var data = res['data'];
            this.purchaseOrders = this.purchaseOrders.concat(data);
            this.loading = false;
            if (res['data'].length >= this.purchaseOrdersLimit) {
              this.purchaseOrdersOffset = this.purchaseOrdersOffset + this.purchaseOrdersLimit;
            } else {
              this.noPOResults = true;
            }
          } else {
            this.dialogs.error(res['error'], "Error")
          }
        });
    }
  }

  viewPO(po) {
    // this.router.navigateByUrl('/purchases/purchaseorder/' + po.id);
    window.open('#/purchases/purchaseorder/' + po.id, "_blank");
  }
  viewWO(po) {
    // this.router.navigateByUrl('/purchases/purchaseorder/' + po.id);
    window.open('#/purchases/workorder/' + po.id, "_blank");
  }
  markOpex(po) {
    this.service.savePurchaseOrder({ id: po.id, isOpex: !po.isOpex }).subscribe(res => {
      if (res['data']) {
        this.dialogs.success("PO for " + po.vendor.name + " of " + po.building.name + " is marked as OpEx");
        this.resetPurchaseOrdersList();
      }
    })
  }

  resetBillsList() {
    this.bills = [];
    this.billsOffset = 0;
    this.billsLimit = 20;
    this.noBillResults = false;
    this.loadMoreBills();
    this.getBillsByStatus();
  }

  bills: any = [];
  billsOffset: any = 0;
  billsLimit: any = 20;
  noBillResults: any = false;
  loadMoreBills() {
    if (!this.loading && !this.noBillResults) {
      this.loading = true;
      this.billsFilters.isBill = 1;
      this.billsFilters.projectId = this.project.id;
      var data = {
        filters: this.billsFilters,
        limit: this.billsLimit,
        offset: this.billsOffset,
        sortBy: this.billsSortBy,
        sortOrder: this.billsSortOrder
      };
      this.service.listPurchaseOrders(data)
        .pipe(take(1)).subscribe((res) => {
          console.log("PurchaseOrders :: loadMoreBills : res : ", res);
          if (res['data']) {
            var data = res['data'];
            this.bills = this.bills.concat(data);
            this.loading = false;
            if (res['data'].length >= this.billsLimit) {
              this.billsOffset = this.billsOffset + this.billsLimit;
            } else {
              this.noBillResults = true;
            }
          } else {
            this.dialogs.error(res['error'], "Error")
          }
        });
    }
  }

  totalWorkOrdersCount: any = 0;
  wosByStatuses: any = [];
  getWorkOrdersByStatus() {
    this.reportService.getWorkOrdersByStatus({
      projectId: this.id,
      statuses: this.workOrdersFilters.statuses,
      isOpex: this.workOrdersFilters.isOpex || 0
    }).subscribe(res => {
      this.wosByStatuses = res['data'];
      this.totalWorkOrdersCount = _.sumBy(this.wosByStatuses, 'count');
    })
  }

  totalPurchaseOrdersCount: any = 0;
  posByStatuses: any = [];
  getPurchaseOrdersByStatus() {
    this.reportService.getPurchaseOrdersByStatus({
      projectId: this.id,
      statuses: this.purchaseOrdersFilters.statuses,
      isOpex: this.purchaseOrdersFilters.isOpex || 0
    }).subscribe(res => {
      this.posByStatuses = res['data']['statuses'];
      this.totalPurchaseOrdersCount = _.sumBy(this.posByStatuses, 'count');
    })
  }

  totalBillsCount: any = 0;
  billsByStatuses: any = [];
  getBillsByStatus() {
    this.reportService.getPurchaseOrdersByStatus({
      projectId: this.id,
      statuses: this.billsFilters.statuses,
      isOpex: 0,
      isBill: 1
    }).subscribe(res => {
      this.billsByStatuses = res['data']['statuses'];
      this.totalBillsCount = _.sumBy(this.billsByStatuses, 'count');
    })
  }

  action(event) {
    console.log("VendorsComponent ::: action :: event ", event);
    if (event.action == 'viewPO') {
      window.open('#/purchases/purchaseorder/' + event.item.id, '_blank');
    } else if (event.action == 'viewWO') {
      window.open('#/purchases/workorder/' + event.item.id, '_blank');
    } else if (event.action == 'markPOOpex') {
      this.service.savePurchaseOrder({ id: event.item.id, isOpex: !event.item.isOpex }).subscribe(res => {
        if (res['data']) {
          this.dialogs.success("PO for " + event.item.vendor.name + " of " + event.item.building.name + " is marked as OpEx");
          // this.purchaseOrdersList.reset();
          this.resetPurchaseOrdersList();
        }
      })
    } else if (event.action == 'markAsDelivered') {
      this.purchaseItem = _.clone(event.item);
      this.openItemDeliveries();
    }
  }

  purchaseItem: any = {};
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
  mileStones: any = [];
  listPurchaseOrderMilestones() {
    if (this.delivery.releasePayment) {
      this.loading = true;
      this.service.listPurchaseOrderMilestones({ filters: { purchaseOrderId: this.purchaseItem.purchaseOrderId, status: 'Draft' } })
        .subscribe(res => {
          this.mileStones = res['data'];
          this.loading = false;
        })
    }
  }

  savePurchaseItemDelivery() {
    var data: any = {
      projectId: this.purchaseItem.purchaseOrder.projectId,
      purchaseOrderId: this.purchaseItem.purchaseOrderId,
      skuCatId: this.purchaseItem.sku.catId,
      skuId: this.purchaseItem.sku.id,
      name: this.purchaseItem.sku.name,
      purchaseItemId: this.purchaseItem.id,
      vendorId: this.purchaseItem.purchaseOrder.vendorId,
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

  openedModal: any;
  workOrder: any = {};
  // woType: any = "PreAgreedPO";
  woType: any;
  isOpex: any = '0';
  type: any;
  openWorkOrderModal() {
    this.openedModal = this.dialogs.modal(this.workOrderModal, { size: 'lg', backdrop: 'static', keyboard: false });
    var self = this;
    this.openedModal.result.then(function() {
      self.workOrder = {};
      self.selectedSkus = [];
    }).catch(function(e) {
      self.workOrder = {};
      self.selectedSkus = [];
    })
  }

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
  vendorSelected(event) {
    console.log("Vendor Selected :: ", event);
    this.selectedVendor = event;
    this.getVendorPaymentTerms();
  }

  getVendorPaymentTerms() {
    this.service.listVendorPaymentTerms({ filters: { vendorId: this.selectedVendor.id, active: 1 } })
      .subscribe(res => {
        var vendorPaymentTerms = res['data'];
        _.each(vendorPaymentTerms, function(pt) {
          pt.name = pt.name + " " + pt.tagName;
        })
        this.vendorPaymentTerms = vendorPaymentTerms;
      })
  }

  selectedSku: any;
  skuSelected() {
    this.selectedSku = _.clone(this.selectedSkus[0]);
  }

  addItem() {
    var sku = _.clone(this.selectedSkus[0]);
    console.log("PurchaseComponnet ::: addItem :: sku item : ", sku);
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

    this.showNewVendorSku = false;
    this.lookingNewVendorSku = false;
  }

  vendorWorkOrders: any = [];
  selectedSkus: any = [];
  autocompleteSkus: any = [];
  showNewVendorSku: any = false;
  lookingNewVendorSku: any = false;
  onSKuSearch(text: any) {
    var data: any = { filters: { search: text } };
    if (this.selectedVendor && !this.lookingNewVendorSku) {
      data.filters.vendorId = this.selectedVendor.id;
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

  vendors: any = [];
  searchVendorSkus() {
    this.loading = true;
    var data = { skuId: this.selectedSkus[0].skuId, quantity: this.selectedSkus[0].quantity };
    this.service.searchVendorSkus(data).pipe(take(1)).subscribe(
      res => {
        console.log("SearchVendorSkus :: res : ", res['data']);
        this.loading = false;
        this.vendors = res['data'];
        if (!this.vendors.length) {
          this.dialogs.warning("No Vendors found serving " + this.selectedSkus[0]['sku']);
        }
      })
  }

  selectedItems: any = [];
  selectVendorPrice(paymentTerm, pricing) {
    var skuGst = 0;
    if (paymentTerm.vendorHasGST) {
      skuGst = this.selectedSkus[0].gst;
    }
    this.selectedItems.push({
      skuId: paymentTerm.skuId,
      skuName: paymentTerm.skuName,
      skuGst: skuGst,
      description: paymentTerm.skuName + ", " + this.selectedSkus[0].type + ", " + this.selectedSkus[0].category,
      vendorId: paymentTerm.vendorId,
      vendor: paymentTerm.vendorName,
      paymentTermId: paymentTerm.id,
      paymentTerm: paymentTerm.name,
      paymentTermTag: paymentTerm.tagName,
      minQty: pricing.minQty,
      maxQty: pricing.maxQty,
      quantity: this.selectedSkus[0]['quantity'],
      price: pricing.price
    });
    this.dialogs.success("SKU '" + paymentTerm.skuName + "' is added to work order list");

    this.vendors = [];
    this.selectedSkus = [];
  }

  raiseWorkOrders() {
    console.log("WorkOrdersComponent ::: raiseWorkOrders :: workOrder ", this.selectedItems);
    this.loading = true;
    var self = this;
    this.service.raiseWorkOrders({
      projectId: this.project.id,
      buildingId: this.project.buildingId,
      isOpex: this.isOpex,
      type: this.type,
      items: this.selectedItems,
      deliveryStoreId: this.selectedStore ? this.selectedStore.id : null
    }).pipe(take(1)).subscribe(
      res => {
        self.dialogs.success(res['data'] + " work orders have raised successfully ");
        self.loading = false;
        this.openedModal.close();
        this.selectedItems = [];
        this.woType = null;
        this.woType = null;
        this.selectedVendor = null;
        this.resetWorkOrdersList();
      },
      error => {
        self.dialogs.error(error, 'Error while saving')
      }
    )
  }

  removeSelectedItem(item) {
    this.selectedItems = _.without(this.selectedItems, item);
  }


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
      this.inProgressStages.push({ payment: this.vendorPaymentTerm.inProgress, workProgress: 100 });
      this.inProgressStages.push({ payment: 0, workProgress: 0 });
      this.inProgressStages.push({ payment: 0, workProgress: 0 });
    } else if (!this.vendorPaymentTerm.inProgress && this.inProgressStages.length) {
      this.inProgressStages = [];
    }
    if (this.vendorPaymentTerm.afterFinish > 0 && this.afterFinishStages.length == 0) {
      this.afterFinishStages.push({ payment: this.vendorPaymentTerm.afterFinish, days: 30 });
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


  purchaseOrdersSort: any = {};
  purchaseOrdersSortBy: any;
  purchaseOrdersSortOrder: any;
  purchaseOrdersSortColBy(col) {
    var sort = _.clone(this.purchaseOrdersSort);
    var _sort = {};
    var sortType = 'asc';
    if (sort[col] && sort[col].asc) {
      sort[col].asc = false;
      sort[col].desc = true;
      sortType = 'desc';
      this.purchaseOrdersSort = sort;
      this.purchaseOrdersSortOrder = 'desc';
    } else {
      _sort[col] = { asc: true };
      this.purchaseOrdersSort = _sort;
      this.purchaseOrdersSortOrder = 'asc';
    }
    this.purchaseOrdersSortBy = col;
    this.resetPurchaseOrdersList();
  }

  workOrdersSort: any = {};
  workOrdersSortBy: any;
  workOrdersSortOrder: any;
  workOrdersSortColBy(col) {
    var sort = _.clone(this.workOrdersSort);
    var _sort = {};
    var sortType = 'asc';
    if (sort[col] && sort[col].asc) {
      sort[col].asc = false;
      sort[col].desc = true;
      sortType = 'desc';
      this.workOrdersSort = sort;
      this.workOrdersSortOrder = 'desc';
    } else {
      _sort[col] = { asc: true };
      this.workOrdersSort = _sort;
      this.workOrdersSortOrder = 'asc';
    }
    this.workOrdersSortBy = col;
    this.resetWorkOrdersList();
  }

  billsSort: any = {};
  billsSortBy: any;
  billsSortOrder: any;
  billsSortColBy(col) {
    var sort = _.clone(this.billsSort);
    var _sort = {};
    var sortType = 'asc';
    if (sort[col] && sort[col].asc) {
      sort[col].asc = false;
      sort[col].desc = true;
      sortType = 'desc';
      this.billsSort = sort;
      this.billsSortOrder = 'desc';
    } else {
      _sort[col] = { asc: true };
      this.billsSort = _sort;
      this.billsSortOrder = 'asc';
    }
    this.billsSortBy = col;
    this.resetBillsList();
  }

  @ViewChild('repeatPOModal') repeatPOModal: any;
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
    this.openedModal = this.dialogs.modal(this.repeatPOModal, { size: 'lg', backdrop: 'static', keyboard: false });
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


  skuCategories: any = [];
  skuTypes: any = [];
  skuItems: any = [];
  payout: any = {};
  @ViewChild('billModal') billModal: any;
  bill: any = {};
  openBillModal(isPaid) {
    this.skuCategory = null;
    this.skuType = null;
    this.skuItem = null;
    this.selectedVendor = null;
    this.bill = {};
    this.billImageFile = null;
    this.bill.isPaid = isPaid;
    // if (isPaid) {
    //   var validators = [Validators.required];
    //   this.billForm.addControl('paidDate', new FormControl('', validators));
    // } else {
    //   this.billForm.removeControl('paidDate');
    // }

    this.service.listCategories({})
      .pipe(take(1)).subscribe(res => {
        this.skuCategories = res['data'];
      })
    this.openedModal = this.dialogs.modal(this.billModal, { size: 'lg', backdrop: 'static', keyboard: false });
  }
  onSkuCategorySelected() {
    this.service.listTypes({ filters: { catId: this.skuCategory.id } })
      .pipe(take(1)).subscribe(res => {
        this.skuType = null;
        this.skuItem = null;
        this.skuTypes = res['data'];
      })
  }

  onSkuTypeSelected() {
    if (!this.skuItem) {
      this.service.listSkus({ filters: { typeId: this.skuType.id } })
        .pipe(take(1)).subscribe(res => {
          this.skuItems = res['data'];
        })
    }
    if (this.skuType || this.skuItem) {
      var filters: any = { skuTypeId: this.skuType.id };
      if (this.skuItem) {
        filters.skuId = this.skuItem.id;
      }
      this.service.listServiceVendors({ filters: filters })
        .pipe(take(1)).subscribe(res => {
          this.vendors = res['data'];
          this.selectedVendor = null;
          this.bill.vendorId = null;
        })
    }
  }

  onServiceVendorSelected() {
    if (this.selectedVendor) {
      this.bill.vendorId = this.selectedVendor.id;
      this.bill.paymentMode = this.selectedVendor.paymentMode;
      this.bill.name = this.project.title + " : " + this.selectedVendor.name + "'s Bill";
      this.newVendorForm = false;
    }
  }

  skuCategory: any;
  skuType: any;
  skuItem: any;
  saveBill() {
    console.log("ProjectsComponent ::: saveBill :: bill ", this.bill);
    this.loading = true;
    var self = this;
    var bill = _.clone(this.bill);
    bill.projectId = this.project.id;
    bill.buildingId = this.project.buildingId;
    bill.vendorId = this.selectedVendor.id;
    bill.vendorBankAccountId = this.selectedVendor.bankAccounts && this.selectedVendor.bankAccounts.length ? this.selectedVendor.bankAccounts[0].id : null;

    if (bill.billDate) {
      bill.date = Utils.ngbDateToMoment(bill.billDate).format("YYYY-MM-DD");
    }
    if (bill.dueDate) {
      bill.dueDate = Utils.ngbDateToMoment(bill.dueDate).format("YYYY-MM-DD");
    }
    if (bill.paidOn) {
      bill.paidOn = Utils.ngbDateToMoment(bill.paidOn).format("YYYY-MM-DD");
    }
    bill.vendor = this.selectedVendor;
    var payout = _.clone(this.payout);
    if (payout.issuedOn) {
      payout.issuedOn = Utils.ngbDateToDate(payout.issuedOn);
    }
    bill.payout = payout;
    bill.approvalRequired = false;
    if (!bill.isPaid && bill.paymentMode == 'BankTransfer' && bill.imageId) {
      bill.processPayout = true;
    }
    this.service.saveProjectBill(bill).pipe(take(1)).subscribe(
      res => {
        self.dialogs.success("Project Bill of Rs.'" + bill.amount + "' for " + this.selectedVendor.name + " is saved successfully ");
        self.loading = false;
        self.bill = null;
        this.vendors = [];
        this.resetBillsList();
        this.openedModal.close();
      }, error => {
        self.dialogs.error(error, 'Error while saving')
      }
    )
  }

  editBill(po) {
    this.bill = _.clone(po);
    this.bill.isPaid = true;
    this.vendors = [{ vendorId: po.vendorId, name: po.vendor.name }]
    this.selectedVendor = this.bill.vendor;
    this.bill.billDate = Utils.dateToNgbDate(po.date);
    if (this.bill.milestone && this.bill.milestone.paidOn) {
      this.bill.paidOn = Utils.dateToNgbDate(po.milestone.paidOn);
    }
    console.log("editBill :: bill : ", this.bill);
    this.openedModal = this.dialogs.modal(this.billModal, { size: 'lg', backdrop: 'static', keyboard: false });
  }

  newVendorForm: any = false;
  vendor: any = {};
  saveVendor() {
    console.log("ProjectsComponent ::: saveVendor :: vendor ", this.vendor);
    this.loading = true;
    var self = this;
    var vendor = _.clone(this.vendor);
    vendor.skuTypeId = this.skuType ? this.skuType.id : null;
    vendor.skuItemId = this.skuItem ? this.skuItem.id : null;
    this.service.saveServiceVendor(vendor).pipe(take(1)).subscribe(
      res => {
        if (res['data']) {
          self.dialogs.success("Vendor '" + vendor.name + "' is saved successfully ");
          self.loading = false;
          self.vendor = {};
          this.newVendorForm = false;
          this.vendors.push(res['data']);
          this.selectedVendor = res['data'];
          this.bill.vendorId = this.selectedVendor.id;
        } else {
          self.dialogs.error(res['error'], 'Error')
        }
      }, error => {
        self.dialogs.error(error, 'Error while saving')
      }
    )
  }

  billImageFile: any;
  billImageFileChange(event) {
    this.billImageFile = event.target.files[0];
  }
  billImageUploadResponse: any = { status: '', message: '', filePath: '' };
  billImageFileError: any;
  uploadOpexBillImage() {
    const formData = new FormData();
    formData.append('file', this.billImageFile);

    this.loading = true;
    this.uploadService.upload(formData).subscribe(
      (res) => {
        this.billImageUploadResponse = res;
        if (res.file) {
          console.log("OpexBill ::: billuploaded :: bill : ", this.bill);
          this.loading = false;
          this.bill.image = res;
          this.bill.imageId = res.id;
          this.billImageFile = null;
        }
      }, (err) => this.billImageFileError = err
    );
  }

  markAsPaid() {
    this.loading = true;
    var data = {
      id: this.bill.id,
      utr: this.bill.utr,
      notes: this.bill.notes,
      paidOn: Utils.ngbDateToMoment(this.bill.paidOn).format("YYYY-MM-DD"),
      status: "Paid"
    }
    this.service.saveBill(data).subscribe(
      res => {
        this.loading = false;
        console.log("OpexBill ::: billuploaded :: ", res['data']);
        this.bill.status = res['data']['status'];
        this.openedModal.close();
        this.resetBillsList();
      })
  }

  approveBill(bill) {
    var self = this;
    this.loading = true;
    this.dialogs.confirm("Do you want to Approve this Bill to process payment .. ?", "Bill Approval")
      .then((event) => {
        if (event.value) {
          var data = {
            id: bill.milestone.id,
            status: 'Approved',
            approved: true
          }
          self.service.savePurchaseOrderMilestone(data).subscribe(
            res => {
              this.loading = false;
              if (res['data']) {
                console.log("ProjectsComponent ::: savePurchaseOrderMilestone :: ", res['data']);
                bill.status = 'Approved';
                this.resetBillsList();
                this.dialogs.success("Bill for towards " + bill.vendor.name + " of Rs." + bill.amount + " is approved ..!")
              } else {
                self.dialogs.error(res['error'], "Error");
              }
            })
        }
      })
  }

  onVendorPaymentModeChanged() {
    if (this.vendor.paymentMode == 'BankTransfer') {
      this.vendor.hasContact = true;

      var validators = [Validators.required, Validators.minLength(3)];
      this.vendorForm.addControl('bankAccountNumber', new FormControl('', validators));
      validators = [Validators.required, Validators.minLength(3)];
      this.vendorForm.addControl('bankIfscCode', new FormControl('', validators));
      validators = [Validators.required, Validators.minLength(3)];
      this.vendorForm.addControl('accountHolderName', new FormControl('', validators));

      validators = [Validators.required, Validators.minLength(3)];
      this.vendorForm.addControl('contactName', new FormControl('', validators));
      validators = [Validators.required, Validators.email];
      this.vendorForm.addControl('contactEmail', new FormControl('', validators));
      validators = [Validators.required, Validators.pattern('^[6,7,8,9][0-9]{9}$')];
      this.vendorForm.addControl('contactPhone', new FormControl('', validators));
    } else {
      this.vendor.hasContact = false;

      this.vendorForm.removeControl('bankAccountNumber');
      this.vendorForm.removeControl('bankIfscCode');
      this.vendorForm.removeControl('accountHolderName');
      this.vendorForm.removeControl('contactName');
      this.vendorForm.removeControl('contactEmail');
      this.vendorForm.removeControl('contactPhone');
    }
    this.vendorForm.updateValueAndValidity();
  }

  onVendorSelected() {
    if (this.selectedVendor) {
      this.bill.vendorId = this.selectedVendor.id;
      this.bill.paymentMode = this.selectedVendor.paymentMode;
    }
  }

  paymentModeChanged() {
    // console.log("paymentModeChanged :: paymentMode : ", this.payout.paymentMode)
    if (this.payout.paymentMode == 'Cheque') {
      this.payoutForm.addControl('issuedOn', new FormControl('', [Validators.required]));
      this.payoutForm.addControl('chequeNo', new FormControl('', [Validators.required]));
      this.payoutForm.removeControl('utr');
      this.payoutForm.addControl('utr', new FormControl(''));
      delete this.payout.utr;
    } else {
      this.payoutForm.removeControl('issuedOn');
      this.payoutForm.removeControl('chequeNo');
      if (this.payout.paymentMode == 'Cash') {
        this.payoutForm.removeControl('utr');
      } else {
        this.payoutForm.addControl('utr', new FormControl('', [Validators.required]));
      }
    }
    this.payoutForm.updateValueAndValidity();
  }
  deliverToStore: any = false;
  stores: any = [];
  selectedStore: any;
  listStores() {
    if (this.deliverToStore && !this.stores.length) {
      this.assetsService.listStores({}).subscribe(res => {
        this.stores = res['data'];
      })
    }
  }

  viewBillItems(po) {
    this.selectedVendor = {
      id: po.vendorId
    }
    this.bill = _.clone(po);
    this.loading = true;
    this.service.listPurchaseItems({ filters: { purchaseOrderId: po.id, status: "Ordered" } })
      .subscribe(res => {
        this.selectedItems = res['data'];
        var amount = _.sumBy(this.selectedItems, "amount");
        if (amount >= this.bill.amount) {
          this.bill.status = "Paid";
        }
        this.loading = false;
      })
    this.openedModal = this.dialogs.modal(this.billItemsModal, { size: 'lg', backdrop: 'static', keyboard: false });
  }

  addBillItem() {
    var sku = _.clone(this.selectedSkus[0]);
    console.log("PurchaseComponnet ::: addItem :: sku item : ", sku);
    var taxableAmount = sku.price * sku.quantity;
    var gst = taxableAmount * (sku.gst / 100);
    var amount = taxableAmount + gst;
    var item = {
      purchaseOrderId: this.bill.id,
      skuId: sku.skuId,
      skuGst: sku.gst,
      description: sku.description,
      skuName: sku.sku + ", " + sku.type + ", " + sku.category,
      quantity: sku.quantity,
      units: sku.quantity,
      price: sku.price,
      unitPrice: sku.price,
      taxableAmount: taxableAmount,
      gst: gst,
      amount: amount,
      status: "Ordered",
      vendorId: this.selectedVendor.id
    }
    this.loading = true;
    this.service.savePurchaseItem(item).subscribe(res => {
      this.selectedItems.push(item);
      this.selectedSkus = [];

      if (this.selectedSku.price != sku.price) {
        this.service.updateVendorSkuLastPrice(item).subscribe();
      }
      this.showNewVendorSku = false;
      this.lookingNewVendorSku = false;
      this.loading = false;
    })
  }

  removeBillItem(item) {
    this.service.deletePurchaseItem(item).subscribe(res => {
      this.selectedItems = _.without(this.selectedItems, item);
    })
  }

}
