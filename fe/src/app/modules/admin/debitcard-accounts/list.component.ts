import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { debounceTime, take } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HttpClient } from "@angular/common/http";
import { DialogsService } from 'src/app/shared/services/dialogs.services';
import { CommonService } from 'src/app/shared/services/common.service';
import { AdminService } from 'src/app/shared/services/admin.service';
import { Helpers } from '../../../helpers';
import * as _ from 'lodash';

@Component({
  selector: 'admin-list-debitcard-accounts',
  templateUrl: './list.component.html'
})
export class AdminDebitCardAccountsComponent implements OnInit {
  searchControl: FormControl = new FormControl();
  userControl: FormControl = new FormControl("");
  form: FormGroup;

  account: any = {};
  config: any = {};
  @ViewChild('list') list: any;
  @ViewChild('accountModal') accountModal: any;

  openedModal: any;
  items: any = [];
  selectedUser: any = {};
  loading: boolean = false;
  noResults: boolean = false;
  offset: number = 0;
  limit: number = 20;
  filter: any = {};

  constructor(private dialogs: DialogsService, private service: AdminService, private commonService: CommonService) {
  }

  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl("", Validators.required),
      cardId: new FormControl("", Validators.required),
    });

    this.searchControl.valueChanges
      .pipe(debounceTime(200))
      .subscribe(value => {
        this.filter.search = value;
      });

    this.config = {
      columns: [
        { label: 'CardName', field: 'name', type: 'text', styleClass: 'w-15', sortable: true },
        { label: 'CardID', field: 'cardId', type: 'text', styleClass: 'w-10', sortable: true },
        { label: 'Provider', field: 'provider', type: 'text', styleClass: 'w-15', sortable: true },
        { label: 'Users', field: 'users', type: 'text', styleClass: 'w-30', sortable: true },
        { label: 'Added On', field: 'addedOn', type: 'date', styleClass: 'w-10 text-center', sortable: true },
        { label: 'Added By', field: 'addedBy', type: 'text', styleClass: 'w-10 text-center', sortable: true },
        { label: 'Active', field: 'active', type: 'boolean', styleClass: 'w-5 text-center', sortable: true },
      ],
      actions: [
        { icon: 'i-Pen-5', hint: 'Edit', code: 'edit', style: 'info' },
        // { icon: 'i-Folder-Trash', hint: 'Delete', code: 'delete', style: 'danger' }
      ],
      options: {
        debounceDelay: 500,
        actionStyleClass: 'w-5 icons-td text-center',
      }
    }
  }

  openAccountModal() {
    this.openedModal = this.dialogs.modal(this.accountModal, { size: 'lg', backdrop: 'static' });
    var self = this;
    this.openedModal.result.then(function() {
      self.account = {};
    }).catch(function(e) {
      self.account = {};
    })
  }

  autocompleteServiceProviders: any = [];
  selectedServiceProviders: any = [];
  selectedServiceProvider: any;
  onServiceProviderSearch(text: any) {
    var data = { filters: { search: text, active: 1 } }
    return this.service.listServiceProviders(data).pipe(take(1)).subscribe(
      res => {
        this.autocompleteServiceProviders = res['data'];
      })
  }
  serviceProviderSelected(event) {
    console.log("ServiceProvider Selected :: ", event);
    this.selectedServiceProvider = event;
    this.account.serviceProviderId = event.id;
  }

  autocompleteUsers: any = [];
  selectedUsers: any = [];
  onUserSearch(text: any) {
    var data = { filters: { search: text, active: 1 } }
    return this.service.listUsers(data).pipe(take(1)).subscribe(
      res => {
        this.autocompleteUsers = res['data'];
      })
  }
  userSelected(event) {
    console.log("User Selected :: ", event);
    this.selectedUser = event;
    this.saveAccountUser({ debitCardAccountId: this.account.id, userId: event.id });
  }

  save() {
    console.log("UsersComponent ::: save :: account ", this.account);
    this.loading = true;
    var self = this;
    var account = _.clone(this.account);
    this.service.saveDebitCardAccount(account).pipe(take(1)).subscribe(
      res => {
        if (res['data']) {
          this.account = res['data'];
          self.dialogs.success("DebitCard Account '" + this.account.name + "' is saved successfully ");
          self.loading = false;
          self.list.reset();
          // this.openedModal.close();
        }
      },
      error => {
        self.dialogs.error(error, 'Error while saving')
      }
    )
  }

  saveAccountUser(userAccount) {
    this.service.saveDebitCardAccountUser(userAccount).subscribe(res => {
      if (res['data'] && res['data']['active']) {
        this.dialogs.success("User '" + this.selectedUser.name + "' is added to DebitCard Account");
        if (!this.account.accountUsers) {
          this.account.accountUsers = [];
        }
        if (!this.account.accountUsers.length) {
          this.account.accountUsers = [];
        }
        this.account.accountUsers.push({ user: this.selectedUser });
        this.selectedUsers = [];
      } else if (res['data'] && !res['data']['active']) {
        this.dialogs.success("User '" + userAccount.user.name + "' is removed from DebitCard Account");
        this.account.accountUsers = _.reject(this.account.accountUsers, { id: userAccount.id });
        this.selectedUsers = [];
      }
      this.list.reset();
    })
  }

  action(event) {
    console.log("UsersComponent ::: action :: event ", event);
    if (event.action == 'edit') {
      var account = _.clone(event.item);
      this.account = account;
      this.openAccountModal();
    }
  }

}
