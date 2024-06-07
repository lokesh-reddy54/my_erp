import { Component, OnInit, ViewChild } from '@angular/core';
import { ProductService } from 'src/app/shared/services/product.service';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { debounceTime, take } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Router, NavigationEnd } from '@angular/router';
import { HttpClient } from "@angular/common/http";
import { DialogsService } from 'src/app/shared/services/dialogs.services';
import { AdminService } from 'src/app/shared/services/admin.service';
import { PurchasesService } from 'src/app/shared/services/purchases.service';
import { ReportsService } from 'src/app/shared/services/reports.service';
import { Helpers } from '../../../helpers';
import * as _ from 'lodash';
import * as moment from 'moment';

@Component({
  selector: 'purchaseorder-list',
  templateUrl: './list.component.html'
})
export class PurchaseOrdersListComponent implements OnInit {
  searchControl: FormControl = new FormControl();
  vendorControl: FormControl = new FormControl("");
  skuControl: FormControl = new FormControl("");

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
  filter: any = { statuses: ['Raised', 'Started'], isOpex: '0' };

  vendorsObservable: Observable<any[]>;

  constructor(public router: Router, private dialogs: DialogsService, private service: PurchasesService,
    private reportService: ReportsService, private adminService: AdminService) { }

  ngOnInit() {
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
    this.initRaisedDatePicker();
  }

  initRaisedDatePicker() {
    var self = this;
    var picker: any = $('#daterangepicker');
    picker.val(null);
    picker.daterangepicker({
      opens: 'left',
      autoUpdateInput: false,
      ranges: {
        'Clear': [null, null],
        'Today': [moment(), moment()],
        'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
        'Last 7 Days': [moment().subtract(6, 'days'), moment()],
        'Last 30 Days': [moment().subtract(29, 'days'), moment()],
        'This Month': [moment().startOf('month'), moment().endOf('month')],
        'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
      }
    }, function(start, end, label) {
      console.log("A new date selection was made: " + label);
      if (start && end) {
        self.filter.dateFrom = start.format('YYYY-MM-DD');
        self.filter.dateTo = end.format('YYYY-MM-DD');
      } else {
        self.filter.dateFrom = null;
        self.filter.dateTo = null;
        setTimeout(function() {
          $(this).val("");
        }, 500)
      }
      self.resetList();
    });
    picker.on('apply.daterangepicker', function(ev, picker) {
      // $(this).val(picker.startDate.format('MMM DD') + ' - ' + picker.endDate.format('MMM DD'));
      if (picker.startDate.isValid() && picker.endDate.isValid()) {
        $(this).val(picker.startDate.format('MMM DD') + ' - ' + picker.endDate.format('MMM DD'));
      } else {
        $(this).val('');
        self.filter.dateFrom = null;
        self.filter.dateTo = null;
        setTimeout(function() {
          self.resetList();
          self.initRaisedDatePicker();
        }, 200)
      }
    });
    picker.on('cancel.daterangepicker', function(ev, picker) {
      $(this).val('');
      self.filter.dateFrom = null;
      self.filter.dateTo = null;
      self.resetList();
    });
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
    console.log("VendorsComponent ::: action :: event ", event);
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
    window.open("#/purchases/purchaseorder/" + po.id, '_blank');
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

      var data = { filters: this.filter, limit: this.limit, offset: this.offset, sortBy: this.sortBy, sortOrder: this.sortOrder };
      this.service.listPurchaseOrders(data)
        .pipe(take(1)).subscribe((res) => {
          console.log("PurchaseOrders :: loadMore : res : ", res);
          if (res['data']) {
            var data = res['data'];

            _.each(data, function(d) {
              if (!d.paidAmount) {
                if (moment(d.date).isBefore(moment().add(-30, 'days'))) {
                  d.raisedMarker = 'bg-danger text-white';
                  d.redPo = true;
                } else {
                  if (moment(d.date).isBefore(moment().add(-15, 'days'))) {
                    d.raisedMarker = 'bg-warning';
                    d.yellowPo = true;
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

  moreFilters: any = false;
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
      dateFrom: this.filter.dateFrom,
      dateTo: this.filter.dateTo,
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
      dateFrom: this.filter.dateFrom,
      dateTo: this.filter.dateTo,
      buildingId: this.selectedBuilding ? this.selectedBuilding.id : null,
      isOpex: this.filter.isOpex || 0
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

  deliveryCharges: any = 0;
  additionalChargesNote: any;
  additionalCharges: any = 0;
  raisePurchaseOrder() {
    console.log("PurchaseComponent ::: raisePurchaseOrder :: purchaseOrder ", this.selectedItems);
    this.loading = true;
    var self = this;
    var data = {
      raisePurchaseOrder: true,
      vendorId: this.selectedVendors[0].id,
      buildingId: this.selectedBuildings[0].id,
      items: this.selectedItems,
      deliveryCharges: this.deliveryCharges,
      additionalCharges: this.additionalCharges,
      additionalChargesNote: this.additionalChargesNote,
    }
    this.service.raisePurchaseOrder(data).pipe(take(1)).subscribe(
      res => {
        self.dialogs.success("Purchase order for " + this.selectedVendors[0].name + " have raised successfully ");
        self.loading = false;
        self.list.reset();
        this.openedModal.close();
        this.selectedItems = [];
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

  @ViewChild('helpNotesModal') helpNotesModal: any;
  openHelpNotes() {
    this.openedModal = this.dialogs.modal(this.helpNotesModal, {});
  }

}
