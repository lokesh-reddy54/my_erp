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
  selector: 'workorder-list',
  templateUrl: './list.component.html'
})
export class WorkOrdersListComponent implements OnInit {
  selectedSku = new FormControl([]);
  selectedBuilding:any;
  searchControl: FormControl = new FormControl();
  workOrderForm: FormGroup;

  workOrder: any = { contact: {} };
  config: any = {};
  @ViewChild('list') list: any;
  @ViewChild('workOrderModal') workOrderModal: any;

  openedModal: any;
  items: any = [];
  selectedItem: any = {};
  loading: boolean = false;
  noResults: boolean = false;
  offset: number = 0;
  limit: number = 20;
  filter: any = { statuses: ['Raised', 'Approved', 'PORaised'] };

  workOrdersObservable: Observable<any[]>;

  constructor(public router: Router, private dialogs: DialogsService, private service: PurchasesService,
    private reportService: ReportsService, private adminService: AdminService) { }

  ngOnInit() {

    this.workOrderForm = new FormGroup({
      // skuId: new FormControl("", Validators.required)
    });

    this.searchControl.valueChanges
      .pipe(debounceTime(200))
      .subscribe(value => {
        this.filter.search = value;
        this.resetList();
      });

    this.config = {
      columns: [
        { label: 'Building', field: 'building.name', type: 'text', styleClass: 'w-20', sortable: true },
        { label: 'Vendor', field: 'vendor.name', type: 'text', styleClass: 'w-20', sortable: true },
        { label: 'RefNo', field: 'refNo', type: 'text', styleClass: 'w-10 text-center', sortable: true },
        { label: 'ProposedBy', field: 'proposedBy', type: 'text', styleClass: 'w-10 text-center', sortable: true },
        { label: 'ProposedOn', field: 'proposedOn', type: 'date', styleClass: 'w-10 text-center', sortable: true },
        { label: 'Budget', field: 'budget', type: 'inr', styleClass: 'w-10 text-center', sortable: true },
        { label: 'Status', field: 'status', type: 'text', styleClass: 'w-10 text-center', sortable: true },
      ],
      actions: [
        // { icon: 'i-Pen-5', hint: 'Edit', code: 'edit', style: 'info' },
        { icon: 'i-Magnifi-Glass1', hint: 'View', code: 'view', style: 'info' },
      ],
      options: {
        debounceDelay: 500,
        actionStyleClass: 'w-10 icons-td text-center',
      }
    }

    this.loadBuildingWorkOrders();
    this.getWorkOrdersByStatus();
  }

  openWorkOrderModal() {
    this.openedModal = this.dialogs.modal(this.workOrderModal, { size: 'lg', backdrop: 'static' });
    var self = this;
    this.openedModal.result.then(function() {
      self.workOrder = {};
      self.selectedBuildings = [];
      self.selectedSkus = [];
    }).catch(function(e) {
      self.workOrder = {};
      self.selectedBuildings = [];
      self.selectedSkus = [];
    })
  }

  action(event) {
    console.log("WorkOrdersComponent ::: action :: event ", event);
    if (event.action == 'edit') {
      var workOrder = _.clone(event.item);
      this.workOrder = workOrder;
      this.openWorkOrderModal();
    } else if (event.action == 'view') {
      this.router.navigateByUrl('/purchases/workorder/' + event.item.id);
    }
  }


  viewWO(wo) {
    this.router.navigateByUrl('/purchases/workorder/' + wo.id);
  }
  markOpex(wo) {
    this.service.saveWorkOrder({ id: wo.id, isOpex: !wo.isOpex }).subscribe(res => {
      if (res['data']) {
        this.dialogs.success("WO for " + wo.vendor.name + " of " + wo.building.name + " is marked as OpEx");
        this.resetList();
      }
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

  loadMore() {
    console.log("loadmore :: ");
    if (!this.loading && !this.noResults) {
      this.loading = true;

      var data = { filters: this.filter, limit: this.limit, offset: this.offset, sortBy: this.sortBy, sortOrder: this.sortOrder };
      this.service.listWorkOrders(data)
        .pipe(take(1)).subscribe((res) => {
          console.log("WorkOrders :: loadMore : res : ", res);
          if (res['data']) {
            var data = res['data'];

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

  moreFilters: any = true;
  resetList() {
    this.items = [];
    this.offset = 0;
    this.limit = 20;
    this.noResults = false;
    this.loadMore();
    if (this.moreFilters) {
      this.loadBuildingWorkOrders();
      this.getWorkOrdersByStatus();
    }
  }


  selectedFilterBuilding: any = {};
  buildingWorkOrders: any = [];
  wosByStatuses: any = [];
  loadBuildingWorkOrders() {
    this.reportService.loadBuildingWorkOrders({
      statuses: this.filter.statuses,
      isOpex: this.filter.isOpex || 0
    }).subscribe(res => {
      this.buildingWorkOrders = res['data'];
    })
  }

  totalWorkOrdersCount: any = 0;
  getWorkOrdersByStatus() {
    this.reportService.getWorkOrdersByStatus({
      statuses: this.filter.statuses,
      buildingIds: this.filter.buildingIds,
      buildingId: this.selectedBuilding ? this.selectedBuilding.id : null,
      isOpex: this.filter.isOpex || 0
    }).subscribe(res => {
      this.wosByStatuses = res['data'];
      this.totalWorkOrdersCount = _.sumBy(this.wosByStatuses, 'count');
    })
  }

  autocompleteBuildings: any = [];
  selectedBuildings: any = [];
  onBuildingSearch(text: any) {
    var data = { filters: { name: text } }
    return this.adminService.listBuildings(data).pipe(take(1)).subscribe(
      res => {
        this.autocompleteBuildings = res['data'];
      })
  }

  vendorWorkOrders: any = [];
  selectedSkus: any = [];
  autocompleteSkus: any = [];
  onSKuSearch(text: any) {
    var data = { filters: { search: text } }
    return this.service.searchSkus(data).pipe(take(1)).subscribe(
      res => {
        this.autocompleteSkus = res['data'];
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
    this.service.raiseWorkOrders({ buildingId: this.selectedBuildings[0].id, items: this.selectedItems }).pipe(take(1)).subscribe(
      res => {
        self.dialogs.success(res['data'] + " work orders have raised successfully ");
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

  removeSelectedItem(item) {
    this.selectedItems = _.without(this.selectedItems, item);
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


  @ViewChild('assignModal') assignModal: any;
  projectsToAssign:any = [];
  openProjectAssignModal(item?) {
    console.log("openProjectAssignModal :: PO : ", item);
    this.currentWorkOrder = item;
    this.openedModal = this.dialogs.modal(this.assignModal, { size: 'md', backdrop: 'static' });
    var self = this;
    this.projectsToAssign = [];
    this.openedModal.result.then(function(project) {
      console.log("openProjectAssignModal :: project : ", project);
      if (project) {
        item.projectId = item.id;
        item.title = item.title;
      }
    }).catch(function(e) {
    })

    this.service.listProjects({ filters: { buildingId: item.buildingId } }).subscribe(res => {
      this.projectsToAssign = res['data'];
    })
  }

  currentWorkOrder: any;
  assignedProject: any;
  assignProject() {
    this.loading = true;
    this.service.saveWorkOrder({ id: this.currentWorkOrder.id, projectId: this.assignedProject.id })
      .subscribe(res => {
        this.dialogs.success("PO is assigned to " + this.assignedProject.title);
        this.openedModal.close(this.assignedProject);
        this.assignedProject = null;
        this.currentWorkOrder = null;
        this.loading = false;
      })
  }

  @ViewChild('helpNotesModal') helpNotesModal: any;
  openHelpNotes(){
     this.openedModal = this.dialogs.modal(this.helpNotesModal, {});
  }

}
