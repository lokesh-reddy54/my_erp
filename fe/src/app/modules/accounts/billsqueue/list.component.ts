import { Component, OnInit, ViewChild } from '@angular/core';
import { ProductService } from 'src/app/shared/services/product.service';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { debounceTime, take } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { HttpClient } from "@angular/common/http";
import { DialogsService } from 'src/app/shared/services/dialogs.services';
import { AdminService } from 'src/app/shared/services/admin.service';
import { AccountsService } from 'src/app/shared/services/accounts.service';
import { PurchasesService } from 'src/app/shared/services/purchases.service';
import { ReportsService } from 'src/app/shared/services/reports.service';
import { UploadService } from 'src/app/shared/services/upload.service';
import { Helpers } from '../../../helpers';
import { Utils } from 'src/app/shared/utils';

import * as _ from 'lodash';
import * as moment from 'moment';

@Component({
  selector: 'accounts-bills-queue',
  templateUrl: './list.component.html'
})
export class AccountsBillsQueueComponent implements OnInit {
  searchControl: FormControl = new FormControl();
  vendorControl: FormControl = new FormControl("");
  skuControl: FormControl = new FormControl("");

  form: FormGroup;
  providerForm: FormGroup;
  portalPaidForm: FormGroup;
  vendorForm: FormGroup;

  providerTypes: any = ['Company', 'GovernmentFirm', 'Individual'];
  paymentModes: any = ['Online', 'BankTransfer', 'Cash'];

  vendor: any = { contact: {} };
  purchaseItem: any = {};
  purchaseOrder: any = {};
  config: any = {};
  @ViewChild('list') list: any;
  @ViewChild('billModal') billModal: any;

  items: any = [];
  selectedItem: any = {};
  loading: boolean = false;
  noResults: boolean = false;
  offset: number = 0;
  limit: number = 20;
  filter: any = { statuses: ['Draft', 'New', 'Raised'] };

  vendorsObservable: Observable<any[]>;
  isHq: any = 0;
  constructor(public router: Router, private dialogs: DialogsService,
    private route: ActivatedRoute, private service: AccountsService, private uploadService: UploadService,
    private reportService: ReportsService, private adminService: AdminService, private purchasesService: PurchasesService) {
  }

  ngOnInit() {
    this.searchControl.valueChanges
      .pipe(debounceTime(200))
      .subscribe(value => {
        this.filter.search = value;
        this.resetList();
      });

    this.form = new FormGroup({
      // opexTypeId: new FormControl("", Validators.required),
      buildingId: new FormControl(""),
      officeId: new FormControl(""),
      serviceProviderId: new FormControl(""),
      billDate: new FormControl("", Validators.required),
      billDueDate: new FormControl(""),
      paymentType: new FormControl("", Validators.required),
      amount: new FormControl("", Validators.required)
    });
    this.portalPaidForm = new FormGroup({
      utr: new FormControl("", Validators.required),
      paidDate: new FormControl("", Validators.required),
      notes: new FormControl("")
    });

    this.providerForm = new FormGroup({
      name: new FormControl("", Validators.required),
      address: new FormControl("", Validators.required),
      description: new FormControl(""),
      paymentMode: new FormControl("", Validators.required),
      type: new FormControl("", Validators.required)
    });
    this.vendorForm = new FormGroup({
      name: new FormControl("", Validators.required),
      address: new FormControl("", Validators.required),
      paymentMode: new FormControl("", Validators.required),
      type: new FormControl("", Validators.required)
    });

    this.loadBuildingBills();
    this.getBillsByStatus();
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
        }, 100)
      }
    });
    picker.on('cancel.daterangepicker', function(ev, picker) {
      $(this).val('');
      self.filter.dateFrom = null;
      self.filter.dateTo = null;
      self.resetList();
    });
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

  action(event) {
    console.log("AccountsBillsListComponent ::: action :: event ", event);
    if (event.action == 'edit') {
      this.openBillModal(_.clone(event.item));
    } else if (event.action == 'view') {
      this.viewBill(event.item);
    }
  }

  viewBill(bill) {
    this.bill = _.clone(bill);
  }

  loadMore() {
    console.log("loadmore :: ");
    if (!this.loading && !this.noResults) {
      this.loading = true;
      // this.filter.isHq = this.isHq;
      var data = { filters: this.filter, limit: this.limit, offset: this.offset, sortBy: this.sortBy, sortOrder: this.sortOrder };
      this.service.listBillsQueue(data)
        .pipe(take(1)).subscribe((res) => {
          console.log("Bills :: loadMore : res : ", res);
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

  moreFilters: any = true;
  resetList() {
    this.items = [];
    this.offset = 0;
    this.limit = 20;
    this.noResults = false;
    this.loadMore();
    if (this.moreFilters) {
      this.loadBuildingBills();
      this.getBillsByStatus();
    }
  }

  selectedBuilding: any = {};
  buildingBills: any = [];
  billsByStatuses: any = [];
  loadBuildingBills() {
    this.reportService.loadBuildingBillsQueue({
      statuses: this.filter.statuses,
      noImages: this.filter.noImages,
      noPostingData: this.filter.noPostingData
    }).subscribe(res => {
      this.buildingBills = res['data'];
    })
  }

  totalBillsCount: any = 0;
  yellowBills: any = 0;
  redBills: any = 0;
  getBillsByStatus() {
    this.reportService.getBillsQueueByStatus({
      statuses: this.filter.statuses,
      buildingId: this.selectedBuilding ? this.selectedBuilding.id : null
    }).subscribe(res => {
      this.billsByStatuses = res['data']['statuses'];
      this.totalBillsCount = _.sumBy(this.billsByStatuses, 'count');
    })
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
    // this.items = _.orderBy(_.clone(this.items), _sort[col], this.sortOrder);
    this.resetList();
  }

  openedModal: any;
  bill: any;
  selectedServiceProvider: any;
  serviceProvider: any = {};
  serviceProviders: any = [];
  opexCategories: any = [];
  buildings: any = [];
  offices: any = [];

  skuCategories: any = [];
  skuTypes: any = [];
  skuItems: any = [];
  vendors: any = [];
  projects: any = [];
  skuCategory: any;
  skuType: any;
  skuItem: any;
  selectedVendor: any;
  openBillModal(payment) {
    this.selectedServiceProvider = null;
    this.selectedVendors = [];
    this.serviceProviders = [];
    this.vendors = [];
    this.projects = [];
    this.opexCategory = null;
    this.opexItem = null;

    this.skuCategory = null;
    this.skuType = null;
    this.skuItem = null;
    this.selectedVendor = null;

    if (payment.serviceProviderId) {
      this.selectedServiceProvider = {
        id: payment.serviceProviderId,
        name: payment.providerName
      }
      payment.serviceProviderText = null;
    }
    if (payment.vendorId) {
      this.selectedVendor = {
        id: payment.vendorId,
        name: payment.providerName
      }
    }
    if (payment.billDate) {
      payment.billDate = Utils.dateToNgbDate(payment.billDate);
    }
    if (payment.billDueDate) {
      payment.billDueDate = Utils.dateToNgbDate(payment.billDueDate);
    }
    this.bill = _.clone(payment);
    this.getPostingData();
    this.slab = { gst: 0, igst: 0, cgst: 0, sgst: 0, tds: 0 };
    if (!this.bill.gstSlabs) {
      this.bill.gstSlabs = [];
    }
    this.openedModal = this.dialogs.modal(this.billModal, { size: 'lg' });
    var self = this;
    this.openedModal.result.then(function() {
      self.bill = {};
      self.opexCategory = null;
      self.opexType = null;
      self.opexItem = null;
    }).catch(function(e) {
      self.bill = {};
      self.opexCategory = null;
      self.opexType = null;
      self.opexItem = null;
    })
  }

  getPostingData() {
    var payment = this.bill;
    if (this.bill.id && this.bill.billType) {
      this.service.saveBillsQueue({ id: this.bill.id, billType: this.bill.billType }).subscribe();
    }
    if (this.bill.billType != 'Capex') {
      this.adminService.listBuildings({ filters: { statuses: ['Live'] } })
        .pipe(take(1)).subscribe(res => {
          this.buildings = res['data'];
        })
      this.isHq = this.bill.billType == 'HOOpex' ? true : false;
      this.service.getOpexCategories({ office: this.isHq })
        .pipe(take(1)).subscribe(res => {
          this.opexCategories = res['data'];

          if (payment.opexCategoryId) {
            this.opexCategory = _.find(this.opexCategories, { id: payment.opexCategoryId });
            if (payment.opexType) {
              this.opexType = _.find(this.opexCategory.types, { name: payment.opexType });
              if (this.opexType) {
                this.opexItem = _.find(this.opexType.items, { id: payment.opexTypeId });
              }
            } else {
              this.opexType = _.find(this.opexCategory.types, { id: payment.opexTypeId });
            }
          }
        })
    } else {
      this.purchasesService.listCategories({})
        .pipe(take(1)).subscribe(res => {
          this.skuCategories = res['data'];
        })

      this.purchasesService.listProjects({ filters: {} })
        .pipe(take(1)).subscribe(res => {
          this.projects = res['data'];
          if (this.bill.projectId) {
            this.bill.project = _.find(this.projects, { id: this.bill.projectId });
          }
        })
    }
  }

  onSkuCategorySelected() {
    this.purchasesService.listTypes({ filters: { catId: this.skuCategory.id } })
      .pipe(take(1)).subscribe(res => {
        this.skuType = null;
        this.skuItem = null;
        this.skuTypes = res['data'];
      })
  }
  onSkuTypeSelected() {
    if (!this.skuItem) {
      this.purchasesService.listSkus({ filters: { typeId: this.skuType.id } })
        .pipe(take(1)).subscribe(res => {
          this.skuItems = res['data'];
        })
    }
    if (this.skuType || this.skuItem) {
      var filters: any = { skuTypeId: this.skuType.id };
      if (this.skuItem) {
        filters.skuId = this.skuItem.id;
      }
      this.purchasesService.listServiceVendors({ filters: filters })
        .pipe(take(1)).subscribe(res => {
          this.vendors = res['data'];
          this.bill.vendorId = null;
        })
    }
  }

  onBuildingSelected() {
    if (this.bill && this.bill.building) {
      this.adminService.listOffices({ filters: { buildingId: this.bill.building.id } })
        .pipe(take(1)).subscribe(res => {
          this.offices = res['data'];
          if (this.bill.officeId) {
            this.bill.office = _.find(this.offices, { id: this.bill.officeId });
          }
        })
    }
  }
  onOpexTypeSelected() {
    // if (this.opexType || this.opexItem) {
    //   this.adminService.listServiceProviders({ filters: { opexTypeId: this.opexItem ? this.opexItem.id : this.opexType.id } })
    //     .pipe(take(1)).subscribe(res => {
    //       this.serviceProviders = res['data'];
    //       this.selectedServiceProvider = null;
    //       this.bill.serviceProviderId = null;
    //     })
    // }
  }

  autocompleteServiceProviders: any = [];
  selectedServiceProviders: any = [];
  onServiceProviderSearch(text: any) {
    this.bill.serviceProviderText = text;
    var data = { filters: { search: text, active: 1 } }
    return this.adminService.listServiceProviders(data).pipe(take(1)).subscribe(
      res => {
        this.autocompleteServiceProviders = res['data'];
      })
  }

  serviceProviderSelected(event) {
    console.log("serviceProviderSelected ::: event :: ", event);
    this.selectedServiceProvider = event;
    if (this.selectedServiceProvider) {
      this.bill.serviceProviderId = this.selectedServiceProvider.id;
      this.bill.paymentMode = this.selectedServiceProvider.paymentMode;
      this.bill.serviceProvider = null;


    }
  }

  autocompleteVendors: any = [];
  selectedVendors: any = [];
  onVendorSearch(text: any) {
    var data = { filters: { search: text, status: 'Empanelled', active: 1 } }
    return this.purchasesService.listVendors(data).pipe(take(1)).subscribe(
      res => {
        this.autocompleteVendors = res['data'];
      })
  }
  vendorSelected(event) {
    console.log("Vendor Selected :: ", event);
    this.selectedVendor = event;
  }

  opexCategory: any;
  opexType: any;
  opexItem: any;
  save() {
    console.log("OpexBillsComponent ::: save :: bill ", this.bill);
    this.loading = true;
    var self = this;
    var bill = _.clone(this.bill);
    if (bill.billDate) {
      bill.billDate = Utils.ngbDateToMoment(bill.billDate).format("YYYY-MM-DD");
    }
    if (bill.billDueDate) {
      bill.billDueDate = Utils.ngbDateToMoment(bill.billDueDate).format("YYYY-MM-DD");
    }
    if (bill.paidOn) {
      bill.paidOn = Utils.ngbDateToMoment(bill.paidOn).format("YYYY-MM-DD");
    }

    if (bill.building && bill.building.id) {
      bill.buildingId = bill.building.id;
    } else if (this.isHq) {
      bill.buildingId = -1;
    }
    if (bill.office && bill.office.id) {
      bill.officeId = bill.office.id;
    }
    if (bill.project) {
      bill.projectId = bill.project.id;
      bill.buildingId = bill.project.buildingId;
    }
    if (this.opexType && !bill.opexTypeId) {
      bill.opexTypeId = this.opexItem ? this.opexItem.id : this.opexType.id;
    }
    if (this.opexType && !bill.opexTypeId) {
      bill.opexTypeId = this.opexItem ? this.opexItem.id : this.opexType.id;
    }
    if (bill.image) {
      bill.imageId = bill.image.id;
    }
    if (this.selectedVendor) {
      bill.vendorId = this.selectedVendor.id;
    }
    if (!bill.status) {
      bill.status = "Draft";
    }
    if (bill.imageId && bill.amount && bill.billDate && bill.status == 'Draft') {
      bill.status = "New";
    }
    if (this.bill.gstSlabs && this.bill.gstSlabs.length) {
      bill.gst = _.sumBy(this.bill.gstSlabs, 'gst');
    } else {
      bill.gst = null;
    }
    this.service.saveBillsQueue(bill).pipe(take(1)).subscribe(
      res => {
        if (this.selectedServiceProvider) {
          msg = "Bill of Rs.'" + bill.amount + "' for " + this.selectedServiceProvider.name + " is saved successfully ";
        }
        self.loading = false;
        bill = res['data'];
        if (bill.status == 'Raised') {
          self.mapBillsQueue(bill);
        } else {
          this.openedModal.close();
          this.resetList();
          var msg = "Bill of Rs.'" + bill.amount + "' is saved successfully ";
          self.dialogs.success(msg);
        }
        this.serviceProviders = [];
        this.selectedServiceProviders = [];
      }, error => {
        self.dialogs.error(error, 'Error while saving')
      }
    )
  }

  mapBillsQueue(bill?) {
    if (bill) {
      this.bill = bill;
    }
    this.loading = true;
    this.service.mapBillsQueue({ id: this.bill.id, billType: this.bill.billType }).pipe(take(1))
      .subscribe(res => {
        this.bill.status = 'Mapped';
        this.openedModal && this.openedModal.close();

        var msg = "Bill of Rs.'" + bill.amount + "' is mapped successfully ";
        this.dialogs.success(msg);
        this.loading = false;
        this.resetList();
      })
  }

  archieveBill(bill?) {
    var self = this;
    this.dialogs.prompt("Are you sure to Archieve this bill .? If so, mention your reason").then(result => {
      if (result.value) {
        var data = {
          id: bill.id,
          status: "Archieved",
          notes: result.value
        }
        self.loading = true;
        self.service.saveBillsQueue(data).pipe(take(1))
          .subscribe(res => {
            self.loading = false;
            self.resetList();
          })
      }
    })
  }
  unarchieveBill(bill?) {
    var self = this;
    this.dialogs.confirm("Are you sure to Un-Archieve this bill .? ").then(result => {
      if (result.value) {
        var data = {
          id: bill.id,
          status: "Draft",
          notes: ""
        }
        self.loading = true;
        self.service.saveBillsQueue(data).pipe(take(1))
          .subscribe(res => {
            self.loading = false;
            self.resetList();
          })
      }
    })
  }

  newProviderForm: any = false;
  saveProvider() {
    console.log("OpexBillsComponent ::: saveProvider :: serviceProvider ", this.serviceProvider);
    this.loading = true;
    var self = this;
    this.serviceProvider.name = Utils.toTitleCase(this.serviceProvider.name);
    var serviceProvider = _.clone(this.serviceProvider);
    // serviceProvider.opexTypeId = this.opexItem ? this.opexItem.id : this.opexType.id;
    this.adminService.saveServiceProvider(serviceProvider).pipe(take(1)).subscribe(
      res => {
        self.dialogs.success("ServiceProvider '" + serviceProvider.name + "' is saved successfully ");
        self.loading = false;
        self.serviceProvider = {};
        this.newProviderForm = false;
        this.serviceProviders.push(res['data']);
        this.selectedServiceProvider = res['data'];
        this.bill.serviceProviderId = this.selectedServiceProvider.id;
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
      },
      (err) => this.billImageFileError = err
    );
  }

  approveBill(bill) {
    this.loading = true;
    var data = {
      id: bill.id,
      status: 'Approved',
      paymentMode: bill.paymentMode,
      approvalRequired: bill.approvalRequired,
      info: "Bill of " + bill.providerName + " towards " + (bill.office ? bill.office : bill.building) + " of " + Utils.ngbDateToMoment(bill.billDate).format("MMM, YYYY"),
      processPayout: bill.paymentMode == 'BankTransfer' ? true : false
    }
    this.service.saveOpexBill(data).subscribe(
      res => {
        this.loading = false;
        console.log("OpexBill ::: approveBill :: ", res['data']);
        bill.status = res['data']['status'];
      })
  }

  onServiceProviderPaymentModeChanged() {
    if (this.serviceProvider.paymentMode == 'BankTransfer') {
      this.serviceProvider.hasContact = true;

      var validators = [Validators.required, Validators.minLength(8)];
      this.providerForm.addControl('bankAccountNumber', new FormControl('', validators));
      validators = [Validators.required, Validators.minLength(8)];
      this.providerForm.addControl('bankIfscCode', new FormControl('', validators));
      validators = [Validators.required, Validators.minLength(8)];
      this.providerForm.addControl('accountHolderName', new FormControl('', validators));

      validators = [Validators.required, Validators.minLength(5)];
      this.providerForm.addControl('contactName', new FormControl('', validators));
      validators = [Validators.required, Validators.email];
      this.providerForm.addControl('contactEmail', new FormControl('', validators));
      validators = [Validators.required, Validators.pattern('^[6,7,8,9][0-9]{9}$')];
      this.providerForm.addControl('contactPhone', new FormControl('', validators));

    } else if (this.serviceProvider.paymentMode == 'Online') {
      validators = [Validators.required];
      this.providerForm.addControl('portalUrl', new FormControl('', validators));
      validators = [Validators.required];
      this.providerForm.addControl('portalUserName', new FormControl('', validators));
      validators = [Validators.required];
      this.providerForm.addControl('portalPassword', new FormControl('', validators));

    } else {
      this.providerForm.removeControl('portalUrl');
      this.providerForm.removeControl('portalUserName');
      this.providerForm.removeControl('portalPassword');
      this.providerForm.removeControl('bankAccountNumber');
      this.providerForm.removeControl('bankIfscCode');
      this.providerForm.removeControl('accountHolderName');
      this.providerForm.removeControl('contactName');
      this.providerForm.removeControl('contactEmail');
      this.providerForm.removeControl('contactPhone');
    }
    this.providerForm.updateValueAndValidity();
  }

  recurringBillSuggestions: any = [];
  isRecurringBill: any = false;
  getRecurringBillSuggestions() {
    if (this.isRecurringBill) {
      var data: any = {
        buildingId: this.bill.buildingId,
        vendorId: this.selectedVendor ? this.selectedVendor.id : null,
        projectId: this.bill.project ? this.bill.project.id : null,
        billDate: Utils.ngbDateToMoment(this.bill.billDate).add(10, 'hours').toDate()
      }
      if (this.bill.billType == 'Capex') {
        delete data.buildingId;
      } else {
        delete data.projectId;
      }
      this.service.getRecurringBillSuggestions(data).pipe(take(1))
        .subscribe(res => {
          if (res['data']) {
            this.recurringBillSuggestions = res['data'];
          }
        })
    }
  }

  mapImageToBill(suggestion) {
    var data: any = {
      purchaseOrderId: suggestion.id,
      amount: suggestion.amount,
      invoiceDate: suggestion.billDate,
      docId: this.bill.image.id
    }
    this.loading = true;
    this.service.mapImageToBill(data).pipe(take(1)).subscribe(res => {
      if (res['data']) {
        data = {
          id: this.bill.id,
          status: "Archieved",
          notes: "Bill Image mapped to auto generated Recurring Bill"
        }
        if (this.bill.billType == 'Capex') {
          data.notes = "Bill Image mapped to PO Invoice"
        }
        this.service.saveBillsQueue(data).pipe(take(1))
          .subscribe(res => {
            this.loading = false;
            this.resetList();
            this.openedModal.close();
          })
      } else {
        this.loading = false;
      }
    })
  }

  slab: any = {};

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
          this.bill.gstFileId = res.id;
          this.bill.gstFile = res;
          this.gstFile = null;
        }
      },
      (err) => this.gstFileError = err
    );
  }

  updateSlabGST() {
    this.slab.gst = this.slab.igst;
    if (!this.slab.gst) {
      this.slab.gst = this.slab.sgst + this.slab.cgst;
    }
  }

  addGstSlab() {
    this.bill.gstSlabs.push(_.clone(this.slab));
    this.slab = { gst: 0, igst: 0, cgst: 0, sgst: 0, tds: 0 };
  }

  removeGstSlab(slab) {
    this.bill.gstSlabs = _.without(this.bill.gstSlabs, slab);
  }

}
