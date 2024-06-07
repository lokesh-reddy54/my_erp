import { Component, OnInit, ViewChild } from '@angular/core';
import { ProductService } from 'src/app/shared/services/product.service';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { debounceTime, take } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HttpClient } from "@angular/common/http";
import { DialogsService } from 'src/app/shared/services/dialogs.services';
import { AdminService } from 'src/app/shared/services/admin.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { Helpers } from '../../../helpers';
import * as _ from 'lodash';

@Component({
  selector: 'admin-clientcompanies',
  templateUrl: './view.component.html'
})
export class AdminClientCompaniesComponent implements OnInit {
  companyForm: FormGroup;
  contactForm: FormGroup;
  userForm: FormGroup;
  listConfig: any = {};
  @ViewChild('companiesList') companiesList: any;
  @ViewChild('contactModal') contactModal: any;
  @ViewChild('userModal') userModal: any;
  @ViewChild('companyModal') companyModal: any;

  companies: any = [];
  items: any = [];
  selectedItem: any;
  loading: boolean = false;
  constructor(private dialogs: DialogsService, private service: AdminService, private commonService: CommonService) {

  }

  ngOnInit() {
    this.companyForm = new FormGroup({
      name: new FormControl("", Validators.required),
      tradeName: new FormControl("", Validators.required),
      shortName: new FormControl("", Validators.required),
      address: new FormControl("", Validators.required),
      city: new FormControl("", Validators.required),
      state: new FormControl("", Validators.required),
      phone: new FormControl("", Validators.required),
      email: new FormControl("", Validators.required),
      website: new FormControl("", Validators.required),
      erpDomain: new FormControl("", Validators.required),
    });

    this.contactForm = new FormGroup({
      name: new FormControl("", Validators.required),
      designation: new FormControl("", Validators.required),
      contactPurposes: new FormControl("", Validators.required),
      email: new FormControl("", Validators.compose([
        Validators.required,
        Validators.email
      ])),
      phone: new FormControl("", Validators.compose([
        Validators.required,
        Validators.pattern('^[6,7,8,9][0-9]{9}$')
      ]))
    });

    this.userForm = new FormGroup({
      name: new FormControl("", Validators.required),
      password: new FormControl("", Validators.required),
      email: new FormControl("", Validators.compose([
        Validators.required,
        Validators.email
      ])),
      phone: new FormControl("", Validators.compose([
        Validators.required,
        Validators.pattern('^[6,7,8,9][0-9]{9}$')
      ]))
    });

    this.listConfig = {
      columns: [
        { label: 'Name', field: 'name', type: 'text', styleClass: 'w-50', sortable: true },
        { label: 'Active', field: 'active', type: 'boolean', styleClass: 'w-5' },
      ],
      actions: [
        { icon: 'i-Pen-5', hint: 'Edit', code: 'editCompany', style: 'info' }
      ],
      options: {
        debounceDelay: 500,
        actionStyleClass: 'w-25 icons-td',
      }
    }

    this.loadCompanies();
  }

  loadCompanies() {
    this.service.listCompanies({ filters: {} }).pipe(take(1)).subscribe(
      res => {
        this.companies = res['data'];
        var selectedCompany;
        if (!this.selectedCompany.id) {
          selectedCompany = this.companies[0];
        } else if (this.selectedCompany) {
          selectedCompany = _.find(this.companies, { id: this.selectedCompany.id })
        }
        this.selectCompany(selectedCompany);
      })
  }

  selectedCompany: any = {};
  selectCompany(company) {
    if (company.modules && typeof company.modules === 'string') {
      company.modules = JSON.parse(company.modules)
    } else if (!company.modules) {
      company.modules = { bookings: false, accounts: false, purchases: false, support: false, assets: false, leads: false };
    }
    this.selectedCompany = company;
  }

  action(event) {
    console.log("ExternalSystemsComponent ::: action :: event ", event);
    if (event.action == 'editCompany') {
      this.selectCompany(event.item)
    }
  }

  saveCompany() {
    console.log("ExternalSystemsComponent ::: save :: company ", this.selectedCompany);
    this.loading = true;
    let self = this;
    var data = _.clone(this.selectedCompany);
    if (data.modules) {
      data.modules = JSON.stringify(data.modules);
    }
    this.service.saveCompany(data).pipe(take(1)).subscribe(
      res => {
        if (res['data']) {
          this.selectedCompany.id = res['data']['id'];
          self.dialogs.success("'" + this.selectedCompany.name + "' is saved successfully ");
          this.loading = false;
          this.loadCompanies();
          if (this.openedModal) {
            this.openedModal.close();
          }
        }
      },
      error => {
        self.dialogs.error(error, 'Error while saving')
      }
    )
  }

  contact: any = {};
  openedModal: any;
  contactPurposes: any = [];
  openContactModal(contact?) {
    this.contactPurposes = this.commonService.values.contactPurposes;
    if (contact) {
      this.contact = _.clone(contact);
    }
    if (this.contact && this.contact.contactPurposes) {
      this.contact.contactPurposes = this.contact.contactPurposes.split(", ");
    }
    this.openedModal = this.dialogs.modal(this.contactModal, { size: 'md' });
    var self = this;
    this.openedModal.result.then(function() {
      self.contact = {};
      self.loading = false;
      self.contactForm.reset();
    }).catch(function(e) {
      self.contact = {};
      self.loading = false;
      self.contactForm.reset();
    })
  }
  saveContact() {
    let self = this;
    this.loading = true;
    var contact = _.clone(this.contact);
    contact.companyId = this.selectedCompany.id;
    contact.contactPurposes = _.map(this.contact.contactPurposes, "type").join(", ");
    this.service.saveCompanyContact(contact).pipe(take(1)).subscribe(
      res => {
        self.dialogs.success("Client Company Contact is saved successfully ");
        self.loading = false;
        this.openedModal.dismiss();
        this.loadCompanies();
      },
      error => {
        self.dialogs.error(error, 'Error while saving')
      }
    )
  }

  user:any = {};
  openUserModal(user?) {
    if (user) {
      this.user = _.clone(user);
    }
    this.openedModal = this.dialogs.modal(this.userModal, { size: 'md' });
    var self = this;
    this.openedModal.result.then(function() {
      self.user = {};
      self.loading = false;
      self.userForm.reset();
    }).catch(function(e) {
      self.user = {};
      self.loading = false;
      self.contactForm.reset();
    })
  }
  saveUser() {
    let self = this;
    this.loading = true;
    var user = _.clone(this.user);
    user.companyId = this.selectedCompany.id;
    user.active = 1;   
    this.service.saveUser(user).pipe(take(1)).subscribe(
      res => {
        self.dialogs.success("Client Company User is saved successfully ");
        self.loading = false;
        this.openedModal.dismiss();
        this.loadCompanies();
      },
      error => {
        self.dialogs.error(error, 'Error while saving')
      }
    )
  }

  updateModule(mod) {
    var self = this;
    var modd = mod.charAt(0).toUpperCase() + mod.slice(1);
    var msg = "Are you sure to enable " + modd + " .?";
    if (this.selectedCompany.modules[mod]) {
      msg = "Are you sure to disable " + modd + " .?";
    }
    this.dialogs.confirm(msg).then((event) => {
      if (event.value) {
        self.selectedCompany.modules[mod] = !self.selectedCompany.modules[mod];
        self.saveCompany();
      }
    })
  }
  openCompanyModal() {
    this.selectedCompany = {}
    this.openedModal = this.dialogs.modal(this.companyModal, { size: 'md' });
    var self = this;
    this.openedModal.result.then(function() {
      self.selectedCompany = {};
      self.loading = false;
      self.companyForm.reset();
    }).catch(function(e) {
      self.selectedCompany = {};
      self.loading = false;
      self.companyForm.reset();
    })
  }
}
