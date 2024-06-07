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

declare let $: any;

@Component({
  selector: 'accounts-bills-list',
  templateUrl: './list.component.html'
})
export class AccountsBillsListComponent implements OnInit {
  searchControl: FormControl = new FormControl();
  vendorControl: FormControl = new FormControl("");
  skuControl: FormControl = new FormControl("");

  form: FormGroup;
  providerForm: FormGroup;
  portalPaidForm: FormGroup;

  providerTypes: any = ['Company', 'GovernmentFirm', 'Individual'];
  paymentModes: any = ['Online', 'BankTransfer', 'Cash'];

  vendor: any = { contact: {} };
  purchaseItem: any = {};
  purchaseOrder: any = {};
  config: any = {};
  @ViewChild('list') list: any;
  @ViewChild('opexBillModal') opexBillModal: any;

  items: any = [];
  selectedItem: any = {};
  loading: boolean = false;
  noResults: boolean = false;
  offset: number = 0;
  limit: number = 20;
  filter: any = { statuses: ['Draft', 'New', 'Raised', 'PrePaid'] };

  vendorsObservable: Observable<any[]>;
  isHq: any = 0;
  constructor(public router: Router, private dialogs: DialogsService, private purchasesService: PurchasesService,
    private route: ActivatedRoute, private service: AccountsService, private uploadService: UploadService,
    private reportService: ReportsService, private adminService: AdminService) {
    this.isHq = parseInt(this.route.snapshot.params['ho']);
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

    this.loadBuildingBills();
    this.getBillsByStatus();

    this.initRaisedDatePicker();
    this.initAccountedDatePicker();
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
        self.resetList();
        setTimeout(function() {
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

  initAccountedDatePicker() {
    var self = this;
    var apicker: any = $('#adaterangepicker');
    apicker.val(null);
    apicker.daterangepicker({
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
      console.log("Accounted date selection was made: " + label);
      if (start && end) {
        self.filter.accountedFrom = start.format('YYYY-MM-DD');
        self.filter.accountedTo = end.format('YYYY-MM-DD');
      } else {
        self.filter.accountedFrom = null;
        self.filter.accountedTo = null;
        setTimeout(function() {
          $(this).val("");
        }, 500)
      }
      self.resetList();
    });
    apicker.on('apply.daterangepicker', function(ev, picker) {
      if (picker.startDate.isValid() && picker.endDate.isValid()) {
        $(this).val(picker.startDate.format('MMM DD') + ' - ' + picker.endDate.format('MMM DD'));
      } else {
        self.filter.accountedFrom = null;
        self.filter.accountedTo = null;
        self.resetList();
        setTimeout(function() {
          self.initAccountedDatePicker();
        }, 100)
      }
    });
    apicker.on('cancel.daterangepicker', function(ev, apicker) {
      $(this).val('');
      self.filter.accountedFrom = null;
      self.filter.accountedTo = null;
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
    this.opexBill = _.clone(bill);
  }

  loadMore() {
    console.log("loadmore :: ");
    if (!this.noResults) {
      this.loading = true;
      this.filter.isHq = this.isHq;
      var data = { filters: this.filter, limit: this.limit, offset: this.offset, sortBy: this.sortBy, sortOrder: this.sortOrder };
      this.service.listOpexBills(data)
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
    this.reportService.loadBuildingBills({
      statuses: this.filter.statuses,
      isHq: this.isHq,
      search: this.filter.search,
      dateFrom: this.filter.dateFrom,
      dateTo: this.filter.dateTo,
      accountedFrom: this.filter.accountedFrom,
      accountedTo: this.filter.accountedTo,
      // noImages: this.filter.noImages,
      // noPostingData: this.filter.noPostingData
    }).subscribe(res => {
      this.buildingBills = res['data'];
    })
  }

  totalBillsCount: any = 0;
  yellowBills: any = 0;
  redBills: any = 0;
  getBillsByStatus() {
    this.reportService.getBillsByStatus({
      statuses: this.filter.statuses,
      isHq: this.isHq,
      search: this.filter.search,
      dateFrom: this.filter.dateFrom,
      dateTo: this.filter.dateTo,
      accountedFrom: this.filter.accountedFrom,
      accountedTo: this.filter.accountedTo,
      buildingId: this.selectedBuilding ? this.selectedBuilding.id : null,
      noImages: this.filter.noImages,
      noPostingData: this.filter.noPostingData
    }).subscribe(res => {
      this.billsByStatuses = res['data']['statuses'];
      // this.redBills = res['data']['redBills'][0]['count'];
      // this.yellowBills = res['data']['yellowBills'][0]['count'];
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
    this.resetList();
  }

  openedModal: any;
  opexBill: any;
  selectedServiceProvider: any;
  serviceProvider: any = {};
  serviceProviders: any = [];
  opexCategories: any = [];
  buildings: any = [];
  offices: any = [];
  billItems: any = [];
  billMonths: any = [];
  billItemMonths: any = 0;
  openBillModal(payment) {
    this.selectedServiceProvider = null;
    this.serviceProviders = [];
    this.opexCategory = null;
    this.opexItem = null;
    this.selectedVendor = null;
    this.selectedVendors = [];

    if (!this.billMonths.length) {
      for (var i = 0; i < 12; i++) {
        this.billMonths.push({ id: i, name: moment().month(i).format("MMMM") })
      }
    }
    this.service.listBillItems({ purchaseOrderId: payment.id }).subscribe(res => {
      if (res['data']) {
        var billItems = res['data'];
        _.each(billItems, function(item) {
          if (item.dateFrom) {
            item.month = moment(item.dateFrom).month();
            item.year = moment(item.dateFrom).year();
          } else {
            // item.month = moment().month();
            // item.year = moment().year();
          }
        });
        this.billItems = billItems;
        this.billItemMonths = this.billItems.length;
      }
    })
    payment.billDate = Utils.dateToNgbDate(payment.billDate);
    payment.billDueDate = Utils.dateToNgbDate(payment.billDueDate);
    if (!this.isHq) {
      this.adminService.listBuildings({ filters: { statuses: ['Live'] } })
        .pipe(take(1)).subscribe(res => {
          this.buildings = res['data'];
          if (payment.buildingId) {
            this.opexBill.building = _.find(this.buildings, { id: payment.buildingId })
          }
        })
    }
    var data = { office: this.isHq };
    this.service.getOpexCategories(data)
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
    // if (payment.opexTypeId) {
    //   this.adminService.listServiceProviders({ filters: { opexTypeId: payment.opexTypeId } })
    //     .pipe(take(1)).subscribe(res => {
    //       this.serviceProviders = res['data'];
    //       if (payment.serviceProviderId) {
    //         this.selectedServiceProvider = _.find(this.serviceProviders, { id: payment.serviceProviderId });
    //       }
    //     })
    // }
    if (payment.serviceProviderId) {
      this.selectedServiceProvider = {
        id: payment.serviceProviderId,
        name: payment.providerName
      }
      this.selectedVendor = this.selectedServiceProvider;
      payment.serviceProviderText = null;
    }
    if (payment.effectiveFrom) {
      payment.effectiveFrom = Utils.dateToNgbDate(payment.effectiveFrom);
    }
    this.opexBill = _.clone(payment);
    this.openedModal = this.dialogs.modal(this.opexBillModal, { size: 'lg' });
    var self = this;
    this.openedModal.result.then(function() {
      self.opexBill = {};
      self.opexCategory = null;
      self.opexType = null;
      self.opexItem = null;
    }).catch(function(e) {
      self.opexBill = {};
      self.opexCategory = null;
      self.opexType = null;
      self.opexItem = null;
    })
  }
  updateBillItemMonths() {
    if (this.billItemMonths > this.billItems.length) {
      for (var i = 0; i < this.billItemMonths - this.billItems.length; i++) {
        this.billItems.push({ taxableAmount: 0, amount: 0, month: moment().month(), year: moment().year() });
      }
    } else if (this.billItemMonths < this.billItems.length) {
      this.billItems.splice(this.billItemMonths, this.billItems.length - this.billItemMonths);
    }
  }

  onBuildingSelected() {
    if (this.opexBill && this.opexBill.building) {
      this.adminService.listOffices({ filters: { buildingId: this.opexBill.building.id } })
        .pipe(take(1)).subscribe(res => {
          this.offices = res['data'];
          if (this.opexBill.officeId) {
            this.opexBill.office = _.find(this.offices, { id: this.opexBill.officeId });
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
    //       this.opexBill.serviceProviderId = null;
    //     })
    // }
  }

  autocompleteServiceProviders: any = [];
  selectedServiceProviders: any = [];
  onServiceProviderSearch(text: any) {
    this.opexBill.serviceProviderText = text;
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
      this.opexBill.serviceProviderId = this.selectedServiceProvider.id;
      this.opexBill.paymentMode = this.selectedServiceProvider.paymentMode;
      this.opexBill.serviceProvider = null;


    }
  }

  autocompleteVendors: any = [];
  selectedVendors: any = [];
  selectedVendor: any;
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
    console.log("OpexBillsComponent ::: save :: opexBill ", this.opexBill);
    var self = this;
    var totalItemsAmount = _.sumBy(this.billItems, "amount");
    if (totalItemsAmount != this.opexBill.amount) {
      var itemsTds = _.sumBy(this.billItems, "tds");
      if (totalItemsAmount + itemsTds == this.opexBill.amount) {
        // 
      } else {
        this.dialogs.error("Bill amount and total MonthBills amount is not matching.")
        return;
      }
    }
    var wrongBillItem;
    var billItems = [];
    _.each(this.billItems, function(item) {
      if (item.taxableAmount && item.amount && item.month > -1 && item.year) {
        if (item.taxableAmount + (item.gst || 0) - (item.tds || 0) != item.amount) {
          wrongBillItem = item;
          return false;
        } else {
          item.units = 1;
          item.purchaseOrderId = self.opexBill.id;
          item.opexTypeId = self.opexBill.opexTypeId;
          item.dateFrom = item.year + "-" + (item.month + 1) + "-01";
          item.dateTo = moment(item.dateFrom).endOf('month').format("YYYY-MM-DD");
          billItems.push(item);
        }
      }
    })
    if (wrongBillItem) {
      this.dialogs.msg("Bill for " + moment().month(wrongBillItem.month).format("MMMM") + " is not matching, please correct and submit again.", 'error')
      return;
    }
    this.loading = true;
    var opexBill = _.clone(this.opexBill);
    if (this.selectedVendor) {
      opexBill.vendorId = this.selectedVendor.id;
    }
    opexBill.buildingId = this.selectedBuilding.id;
    if (opexBill.billDate) {
      opexBill.billDate = Utils.ngbDateToMoment(opexBill.billDate).format("YYYY-MM-DD");
    }
    if (opexBill.billDueDate) {
      opexBill.billDueDate = Utils.ngbDateToMoment(opexBill.billDueDate).format("YYYY-MM-DD");
    }
    if (opexBill.paidOn) {
      opexBill.paidOn = Utils.ngbDateToMoment(opexBill.paidOn).format("YYYY-MM-DD");
    }

    if (opexBill.building && opexBill.building.id) {
      opexBill.buildingId = opexBill.building.id;
    } else if (this.isHq) {
      opexBill.buildingId = -1;
    }
    if (opexBill.office && opexBill.office.id) {
      opexBill.officeId = opexBill.office.id;
    }
    if (this.opexType && !opexBill.opexTypeId) {
      opexBill.opexTypeId = this.opexItem ? this.opexItem.id : this.opexType.id;
    }
    // if (!opexBill.opexTypeId) {
    //   this.dialogs.error("Please select respective OpexType for this Bill")
    //   return;
    // }

    if (opexBill.amountType == 'Variable' && opexBill.amount < opexBill.maxCharge && opexBill.amount > opexBill.minCharge) {
      opexBill.approvalRequired = false;
    }

    if (opexBill.opexPaymentId && !opexBill.approvalRequired && opexBill.imageId) {
      opexBill.processPayout = true;
    }
    opexBill.items = billItems;
    this.service.saveOpexBill(opexBill).pipe(take(1)).subscribe(
      res => {
        var msg = "Expense Bill of Rs.'" + opexBill.amount + "' is saved successfully ";
        if (this.selectedServiceProvider) {
          msg = "Expense Bill of Rs.'" + opexBill.amount + "' for " + this.selectedServiceProvider.name + " is saved successfully ";
        }
        self.dialogs.success(msg);
        self.loading = false;
        self.opexBill = null;
        this.serviceProviders = [];
        this.openedModal.close();
        this.resetList();
      }, error => {
        self.dialogs.error(error, 'Error while saving')
      }
    )
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
        this.opexBill.serviceProviderId = this.selectedServiceProvider.id;
      }, error => {
        self.dialogs.error(error, 'Error while saving')
      }
    )
  }

  opexBillImageFile: any;
  opexBillImageFileChange(event) {
    this.opexBillImageFile = event.target.files[0];
  }

  opexBillImageUploadResponse: any = { status: '', message: '', filePath: '' };
  opexBillImageFileError: any;

  uploadOpexBillImage() {
    const formData = new FormData();
    formData.append('file', this.opexBillImageFile);

    this.loading = true;
    this.uploadService.upload(formData).subscribe(
      (res) => {
        this.opexBillImageUploadResponse = res;
        if (res.file) {
          console.log("OpexBill ::: billuploaded :: opexBill : ", this.opexBill);
          this.loading = false;
          this.opexBill.image = res;
          this.opexBill.imageId = res.id;
          this.opexBillImageFile = null;
          var data = {
            id: this.opexBill.id,
            billDate: Utils.ngbDateToMoment(this.opexBill.billDate).format("YYYY-MM-DD"),
            taxInvoiceId: this.opexBill.taxInvoiceId,
            imageId: this.opexBill.imageId,
            paymentMode: this.opexBill.paymentMode,
            approvalRequired: this.opexBill.approvalRequired,
            info: "Bill of " + this.opexBill.providerName + " towards " + (this.opexBill.office ? this.opexBill.office : this.opexBill.building) + " of " + Utils.ngbDateToMoment(this.opexBill.billDate).format("MMM, YYYY"),
            billUploaded: true
          }
          this.service.saveOpexBill(data).subscribe(
            res => {
              console.log("OpexBill ::: billuploaded :: ", res['data']);
              this.opexBill.id = res['data']['id'];
              this.opexBill.taxInvoiceId = res['data']['taxInvoiceId'];
              this.opexBill.status = res['data']['status'];
              this.opexBill.indexNo = res['data']['indexNo'];
            })
        }
      },
      (err) => this.opexBillImageFileError = err
    );
  }

  approveBill(bill) {
    this.loading = true;
    var towards = bill.office ? bill.office : bill.building;
    if (bill.buildingId < 0) {
      towards = "HeadOffice";
    }
    var data = {
      id: bill.id,
      status: bill.status == 'PrePaid' ? 'PrePaid' : 'Approved',
      paymentMode: bill.paymentMode,
      approvalRequired: bill.approvalRequired,
      info: "Bill of " + bill.providerName + " towards " + towards + " of " + Utils.ngbDateToMoment(bill.billDate).format("MMM, YYYY"),
      // processPayout: bill.paymentMode == 'BankTransfer' ? true : false
      processPayout: true
    }
    this.service.saveOpexBill(data).subscribe(
      res => {
        this.loading = false;
        console.log("OpexBill ::: approveBill :: ", res['data']);
        bill.status = res['data']['status'];
      })
  }

  deleteBill(bill) {
    var self = this;
    this.dialogs.prompt("Please mention your reason to Cancel this bill.").then(event => {
      if (event.value) {
        self.loading = true;
        var data = {
          id: bill.id,
          status: 'Deleted',
          deletedReason: event.value
        }
        self.service.saveOpexBill(data).subscribe(
          res => {
            self.loading = false;
            console.log("OpexBill ::: approveBill :: ", res['data']);
            bill.status = res['data']['status'];
            self.dialogs.success("Bill of amount Rs." + bill.amount + " is cancelled successfully")
          })
      }
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
          this.opexBill.gstFileId = res.id;
          this.opexBill.gstFile = res;
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
    this.opexBill.gstSlabs.push(_.clone(this.slab));
    this.slab = { gst: 0, igst: 0, cgst: 0, sgst: 0, tds: 0 };
  }

  removeGstSlab(slab) {
    this.opexBill.gstSlabs = _.without(this.opexBill.gstSlabs, slab);
  }
}
