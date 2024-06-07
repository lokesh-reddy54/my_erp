import { Component, OnInit, ViewChild } from '@angular/core';
import { ProductService } from 'src/app/shared/services/product.service';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { debounceTime, take } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HttpClient } from "@angular/common/http";
import { DialogsService } from 'src/app/shared/services/dialogs.services';
import { AdminService } from 'src/app/shared/services/admin.service';
import { AccountsService } from 'src/app/shared/services/accounts.service';
import { Helpers } from '../../../helpers';
import { Utils } from 'src/app/shared/utils';
import * as _ from 'lodash';

@Component({
  selector: 'accounts-serviceproviders',
  templateUrl: './list.component.html'
})
export class AccountsServiceProvidersComponent implements OnInit {
  searchControl: FormControl = new FormControl();
  form: FormGroup;
  serviceForm: FormGroup;

  serviceProvider: any = {};
  roles: any = ['Admin', 'BookingExecutive', 'SupportExecutive', 'SalesExecutive', 'OperationsExecutive', 'AccountsExecutive'];
  config: any = {};
  @ViewChild('list') list: any;
  @ViewChild('serviceProviderModal') serviceProviderModal: any;
  @ViewChild('servicesModal') servicesModal: any;

  openedModal: any;
  items: any = [];
  selectedItem: any = {};
  loading: boolean = false;
  noResults: boolean = false;
  offset: number = 0;
  limit: number = 20;
  filter: any = {active: true};

  serviceProvidersObservable: Observable<any[]>;

  constructor(private dialogs: DialogsService, private service: AdminService, private accountsService: AccountsService) { }

  providerTypes: any = ['Company', 'GovernmentFirm', 'Individual'];
  paymentModes: any = [{label:'Provider Portal', name:'Online'},{name: 'BankTransfer',label:'Bank Transfer'},{name: 'Other',label:'Other Mode'}];

  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl("", Validators.required),
      // serviceId: new FormControl("", Validators.required),
      opexTypeId: new FormControl("", Validators.required),
      type: new FormControl("", Validators.required),
      paymentMode: new FormControl("", Validators.required),
      address: new FormControl("", Validators.required),
      description: new FormControl(""),
    });

    this.serviceForm = new FormGroup({
      name: new FormControl("", Validators.required)
    });

    this.searchControl.valueChanges
      .pipe(debounceTime(200))
      .subscribe(value => {
        this.filter.search = value;
      });

    this.config = {
      columns: [
        { label: 'Name', field: 'name', type: 'text', styleClass: 'w-30', sortable: true },
        // { label: 'Service', field: 'service.name', type: 'text', styleClass: 'w-15', sortable: true },
        { label: 'Expense Type', field: 'opexItem', type: 'text', styleClass: 'w-30', sortable: true },
        { label: 'Type', field: 'type', type: 'text', styleClass: 'w-10', sortable: true },
        { label: 'Payment', field: 'paymentMode', type: 'text', styleClass: 'w-10', sortable: true },
        { label: 'Added On', field: 'date', type: 'date', styleClass: 'w-10 text-center', sortable: true },
        // { label: 'Contact', field: 'hasContact', type: 'boolean', styleClass: 'w-5 text-center', sortable: true },
        // { label: 'GST', field: 'hasGst', type: 'boolean', styleClass: 'w-5 text-center', sortable: true },
        // { label: 'TDS', field: 'hasTds', type: 'boolean', styleClass: 'w-5 text-center', sortable: true },
        // { label: 'Active', field: 'active', type: 'boolean', styleClass: 'w-5 text-center', sortable: true }
        // { label: 'OnHold', field: 'isPaymentHolded', type: 'boolean', styleClass: 'w-5 text-center', sortable: true }
      ],
      actions: [
        { icon: 'i-Pen-5', hint: 'Edit', code: 'edit', style: 'info' }
      ],
      options: {
        debounceDelay: 500,
        actionStyleClass: 'w-10 icons-td text-center',
      }
    }

    // this.listServices();
    this.getOpexCategories();
  }

  services: any = [];
  listServices() {
    this.loading = true;
    this.service.listServiceProviderServices({ filters: { active: 1 } })
      .pipe(take(1)).subscribe(res => {
        if (res['data']) {
          this.services = res['data'];
          this.loading = false;
          this.providerService.form = false;
        } else {
          this.dialogs.error(res['error']);
        }
      })
  }

  opexCategory: any;
  opexType: any;
  opexItem: any;
  opexCategories: any = [];
  getOpexCategories() {
    this.loading = true;
    this.accountsService.getOpexCategories({ filters: { active: 1 } })
      .pipe(take(1)).subscribe(res => {
        if (res['data']) {
          this.opexCategories = res['data'];
          this.loading = false;
        } else {
          this.dialogs.error(res['error']);
        }
      })
  }

  providerService: any = {};
  openServicesModal() {
    this.openedModal = this.dialogs.modal(this.servicesModal, { size: 'lg' });
    var self = this;
    this.openedModal.result.then(function() {
      self.serviceProvider = {};
    }).catch(function(e) {
      self.serviceProvider = {};
    })
  }

  openServiceProviderModal() {
    if (this.serviceProvider.opexCategoryId) {
      this.opexCategory = _.find(this.opexCategories, { id: this.serviceProvider.opexCategoryId });

      if (this.opexCategory && this.opexCategory.types && this.opexCategory.types.length) {
        this.opexType = _.find(this.opexCategory.types, { id: this.serviceProvider.opexTypeId });
      }

      if (this.opexType && this.opexType.items && this.opexType.items.length) {
        this.opexItem = _.find(this.opexType.items, { id: this.serviceProvider.opexItemId });
      }
    }
    this.openedModal = this.dialogs.modal(this.serviceProviderModal, { size: 'lg' });
    var self = this;
    this.openedModal.result.then(function() {
      self.serviceProvider = {};
    }).catch(function(e) {
      self.serviceProvider = {};
    })
  }

  save() {
    console.log("ServiceProvidersComponent ::: save :: serviceProvider ", this.serviceProvider);
    this.loading = true;
    var self = this;
    var serviceProvider = _.clone(this.serviceProvider);
    if (this.opexItem) {
      serviceProvider.opexTypeId = this.opexItem.id;
    } else if (this.opexType) {
      serviceProvider.opexTypeId = this.opexType.id;
    }
    serviceProvider.name = Utils.toTitleCase(serviceProvider.name);
    this.service.saveServiceProvider(serviceProvider).pipe(take(1)).subscribe(
      res => {
        self.dialogs.success("ServiceProvider '" + this.serviceProvider.name + "' is saved successfully ");
        self.loading = false;
        this.serviceProvider = res['data'];
        self.list.reset();
      },
      error => {
        self.dialogs.error(error, 'Error while saving')
      }
    )
  }

  addProviderBankAccount() {
    this.loading = true;
    var serviceProvider = _.clone(this.serviceProvider);
    serviceProvider.newBankAccount = true;
    this.service.saveServiceProvider(serviceProvider).pipe(take(1)).subscribe(
      res => {
        this.dialogs.success("ServiceProvider BankAccount is saved successfully ");
        this.serviceProvider.bankAccount = res['data']['bankAccount'];
        this.loading = false;
        this.list.reset();
      },
      error => {
        this.dialogs.error(error, 'Error while saving')
      }
    )
  }
  addProviderPortal() {
    this.loading = true;
    var serviceProvider = _.clone(this.serviceProvider);
    serviceProvider.newPortal = true;
    this.service.saveServiceProvider(serviceProvider).pipe(take(1)).subscribe(
      res => {
        this.dialogs.success("ServiceProvider Portal is saved successfully ");
        this.serviceProvider.portal = res['data']['portal'];
        this.loading = false;
        this.list.reset();
      },
      error => {
        this.dialogs.error(error, 'Error while saving')
      }
    )
  }
  addProviderContact() {
    this.loading = true;
    var serviceProvider = _.clone(this.serviceProvider);
    serviceProvider.newContact = true;
    this.service.saveServiceProvider(serviceProvider).pipe(take(1)).subscribe(
      res => {
        this.dialogs.success("ServiceProvider Contact is saved successfully ");
        this.serviceProvider.providerContact = res['data']['providerContact'];
        this.loading = false;
        this.list.reset();
      },
      error => {
        this.dialogs.error(error, 'Error while saving')
      }
    )
  }
  deleteProviderContact() {
    this.loading = true;
    var serviceProvider = _.clone(this.serviceProvider);
    serviceProvider.deleteContact = true;
    this.service.saveServiceProvider(serviceProvider).pipe(take(1)).subscribe(
      res => {
        this.dialogs.success("ServiceProvider Contact is delete successfully ");
        delete this.serviceProvider.providerContact;
        this.loading = false;
        this.list.reset();
      },
      error => {
        this.dialogs.error(error, 'Error while saving')
      }
    )
  }
  deleteProviderPortal() {
    this.loading = true;
    var serviceProvider = _.clone(this.serviceProvider);
    serviceProvider.deletePortal = true;
    this.service.saveServiceProvider(serviceProvider).pipe(take(1)).subscribe(
      res => {
        this.dialogs.success("ServiceProvider Portal is deleted successfully ");
        delete this.serviceProvider.portal;
        this.loading = false;
        this.list.reset();
      },
      error => {
        this.dialogs.error(error, 'Error while saving')
      }
    )
  }
  deleteProviderBankAccount() {
    this.loading = true;
    var serviceProvider = _.clone(this.serviceProvider);
    serviceProvider.deleteBankAccount = true;
    this.service.saveServiceProvider(serviceProvider).pipe(take(1)).subscribe(
      res => {
        this.dialogs.success("ServiceProvider BankAccount is deleted successfully ");
        delete this.serviceProvider.bankAccount;
        this.loading = false;
        this.list.reset();
      },
      error => {
        this.dialogs.error(error, 'Error while saving')
      }
    )
  }

  editService(service) {
    this.providerService = _.clone(service);
    this.providerService.form = true;
  }

  saveService() {
    console.log("ServiceProvidersComponent ::: saveService :: providerService ", this.providerService);
    this.loading = true;
    var self = this;
    var providerService = _.clone(this.providerService);
    this.service.saveServiceProviderService(providerService).pipe(take(1)).subscribe(
      res => {
        self.dialogs.success("ServiceProvider '" + this.providerService.name + "' is saved successfully ");
        this.listServices();
      },
      error => {
        self.dialogs.error(error, 'Error while saving')
      }
    )
  }

  action(event) {
    console.log("ServiceProvidersComponent ::: action :: event ", event);
    if (event.action == 'edit') {
      var serviceProvider = _.clone(event.item);
      this.serviceProvider = serviceProvider;
      this.openServiceProviderModal();
    }
  }

}
