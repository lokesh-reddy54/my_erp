import { Component, OnInit, ViewChild } from '@angular/core';
import { ProductService } from 'src/app/shared/services/product.service';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { debounceTime, take } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HttpClient } from "@angular/common/http";
import { DialogsService } from 'src/app/shared/services/dialogs.services';
import { AccountsService } from 'src/app/shared/services/accounts.service';
import { AdminService } from 'src/app/shared/services/admin.service';
import { Helpers } from '../../../helpers';
import { Utils } from 'src/app/shared/utils';
import * as _ from 'lodash';

@Component({
  selector: 'admin-servicepayments',
  templateUrl: './list.component.html'
})
export class AccountsServicePaymentsComponent implements OnInit {
  searchControl: FormControl = new FormControl();
  form: FormGroup;

  servicePayment: any = {};
  config: any = {};
  @ViewChild('list') list: any;
  @ViewChild('servicePaymentModal') servicePaymentModal: any;

  openedModal: any;
  items: any = [];
  selectedItem: any = {};
  loading: boolean = false;
  noResults: boolean = false;
  offset: number = 0;
  limit: number = 20;
  filter: any = {};

  servicePaymentsObservable: Observable<any[]>;

  constructor(private dialogs: DialogsService, private service: AccountsService, private adminService: AdminService) { }

  ngOnInit() {
    this.form = new FormGroup({
      serviceId: new FormControl("", Validators.required),
      officeId: new FormControl("", Validators.required),
      serviceProviderId: new FormControl("", Validators.required),
      minCharge: new FormControl("", Validators.required),
      maxCharge: new FormControl("", Validators.required),
      effectiveFrom: new FormControl("", Validators.required),
      amountType: new FormControl("", Validators.required),
      amount: new FormControl("", Validators.required),
      gst: new FormControl(""),
      tds: new FormControl(""),
      invoiceStartDay: new FormControl("", Validators.required),
      invoiceDay: new FormControl("", Validators.required),
      invoiceDueDay: new FormControl("", Validators.required),
      invoiceFrequency: new FormControl("", Validators.required),
      remindBeforeDays: new FormControl("", Validators.required),
      portalUserName: new FormControl(""),
      portalPassword: new FormControl(""),
      portalUrl: new FormControl(""),
      bankAccountNumber: new FormControl(""),
      bankIfscCode: new FormControl(""),
      bankAccountName: new FormControl(""),
      contactName: new FormControl(""),
      contactEmail: new FormControl(""),
      contactPhone: new FormControl(""),
    });

    this.searchControl.valueChanges
      .pipe(debounceTime(200))
      .pipe(take(1)).subscribe(value => {
        this.filter.search = value;
      });

    this.config = {
      columns: [
        { label: 'Office', field: 'office.name', type: 'text', styleClass: 'w-15', sortable: true },
        { label: 'Service', field: 'service.name', type: 'text', styleClass: 'w-15', sortable: true },
        { label: 'Provider', field: 'serviceProvider.name', type: 'text', styleClass: 'w-15', sortable: true },
        { label: 'Amount', field: 'amount', type: 'inr', styleClass: 'w-5', sortable: true },
        { label: 'From', field: 'effectiveFrom', type: 'date', styleClass: 'w-10 text-center', sortable: true },
        { label: 'BillDay', field: 'invoiceDay', type: 'text', styleClass: 'w-5 text-center', sortable: true },
        { label: 'DueDay', field: 'invoiceDueDay', type: 'text', styleClass: 'w-5 text-center', sortable: true },
        // { label: 'Frequency', field: 'frequency', type: 'text', styleClass: 'w-10 text-center', sortable: true },
        { label: 'Status', field: 'status', type: 'text', styleClass: 'w-5 text-center', sortable: true },
        { label: 'AutoPay', field: 'autoPay', type: 'boolean', styleClass: 'w-5 text-center', sortable: true },
        { label: 'Added On', field: 'date', type: 'date', styleClass: 'w-10 text-center', sortable: true },
      ],
      actions: [
        { icon: 'i-Pen-5', hint: 'Edit', code: 'edit', style: 'info' },
        { icon: 'fa fa-check', hint: 'Approve', code: 'approve', style: 'primary', condition: { label: 'status', value: 'Draft' } }
      ],
      options: {
        debounceDelay: 500,
        actionStyleClass: 'w-10 icons-td text-center',
      }
    }
  }

  services: any = [];
  listServices() {
    this.loading = true;
    this.adminService.listServiceProviderServices({ filters: { active: 1 } })
      .pipe(take(1)).subscribe(res => {
        if (res['data']) {
          this.services = res['data'];
        } else {
          this.dialogs.error(res['error']);
        }
        this.loading = false;
      })
  }

  selectedServiceProvider: any;
  serviceProviders: any = [];
  listServiceProviders() {
    if (this.servicePayment.serviceId) {
      this.loading = true;
      this.adminService.listServiceProviders({ filters: { serviceId: this.servicePayment.serviceId, typeSearch: true } })
        .pipe(take(1)).subscribe(res => {
          if (res['data']) {
            this.servicePayment.serviceProviderId = null;
            this.serviceProviders = res['data'];
          } else {
            this.dialogs.error(res['error']);
          }
          this.loading = false;
        })
    }
  }
  onServiceProviderSelected() {
    if (this.selectedServiceProvider) {
      this.servicePayment.serviceProviderId = this.selectedServiceProvider.id;
      this.servicePayment.paymentMode = this.selectedServiceProvider.paymentMode;
    }
  }
  cities: any = [];
  listCities() {
    this.loading = true;
    this.adminService.listCities({ filters: { active: 1 } })
      .pipe(take(1)).subscribe(res => {
        if (res['data']) {
          this.cities = res['data'];
        } else {
          this.dialogs.error(res['error']);
        }
        this.loading = false;
      })
  }

  selectedCity: any = null;
  offices: any = [];
  searchOffices() {
    this.offices = [];
    this.servicePayment.officeId = null;
    if (this.selectedCity) {
      this.loading = true;
      this.adminService.listOffices({ filters: { cityId: this.selectedCity.id, typeSearch: true }, limit: 100 })
        .pipe(take(1)).subscribe(res => {
          if (res['data']) {
            this.offices = res['data'];
          } else {
            this.dialogs.error(res['error']);
          }
          this.loading = false;
        })
    }
  }

  openServicePaymentModal() {
    this.listCities();
    this.listServices();
    this.openedModal = this.dialogs.modal(this.servicePaymentModal, { size: 'lg' });
    var self = this;
    this.openedModal.result.then(function() {
      self.servicePayment = {};
    }).catch(function(e) {
      self.servicePayment = {};
    })
  }

  save() {
    console.log("ServicePaymentsComponent ::: save :: servicePayment ", this.servicePayment);
    this.loading = true;
    var self = this;
    var servicePayment = _.clone(this.servicePayment);
    if (servicePayment.office) {
      servicePayment.officeId = servicePayment.office.id;
    }
    if (!servicePayment.benificiaryId) {
      servicePayment.effectiveFrom = Utils.ngbDateToDate(servicePayment.effectiveFrom);
      servicePayment.invoiceStartDay = Utils.ngbDateToDate(servicePayment.invoiceStartDay);
      servicePayment.invoiceDay = Utils.ngbDateToDate(servicePayment.invoiceDay);
      servicePayment.invoiceDueDay = Utils.ngbDateToDate(servicePayment.invoiceDueDay);
    }

    this.service.saveServicePayment(servicePayment).pipe(take(1)).subscribe(
      res => {
        self.dialogs.success("ServicePayment for '" + this.servicePayment.office.name + "' is saved successfully ");
        self.loading = false;
        self.selectedCity = null;
        self.servicePayment = {};
        this.selectedServiceProvider = null;
        this.serviceProviders = [];
        self.list.reset();
        this.openedModal.close();
      },
      error => {
        self.dialogs.error(error, 'Error while saving')
      }
    )
  }

  action(event) {
    console.log("ServicePaymentsComponent ::: action :: event ", event);
    if (event.action == 'edit') {
      var servicePayment = _.clone(event.item);
      this.servicePayment = servicePayment;
      this.openServicePaymentModal();
    } else if (event.action == 'approve') {
      var servicePayment = _.clone(event.item);
      servicePayment.approved = true;
      this.servicePayment = servicePayment;
      this.save();
    }
  }

}
