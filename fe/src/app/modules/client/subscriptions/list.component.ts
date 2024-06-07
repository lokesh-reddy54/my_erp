import { Component, OnInit, ViewChild } from '@angular/core';
import { ProductService } from 'src/app/shared/services/product.service';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { debounceTime, take } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HttpClient } from "@angular/common/http";
import { DialogsService } from 'src/app/shared/services/dialogs.services';
import { ClientService } from 'src/app/shared/services/client.service';
import { Helpers } from '../../../helpers';
import * as _ from 'lodash';

@Component({
  selector: 'client-subscriptions',
  templateUrl: './list.component.html'
})
export class ClientSubscriptionsComponent implements OnInit {
  searchControl: FormControl = new FormControl();
  form: FormGroup;

  subscription: any = {};
  config: any = {};
  @ViewChild('list') list: any;
  @ViewChild('subscriptionModal') subscriptionModal: any;

  openedModal: any;
  items: any = [];
  selectedItem: any = {};
  loading: boolean = false;
  noResults: boolean = false;
  offset: number = 0;
  limit: number = 20;
  filter: any = {};

  subscriptionsObservable: Observable<any[]>;

  constructor(private dialogs: DialogsService, private service: ClientService) { }

  ngOnInit() {
    this.searchControl.valueChanges
      .pipe(debounceTime(200))
      .pipe(take(1)).subscribe(value => {
        this.filter.search = value;
      });

    this.config = {
      columns: [
        { label: 'Name', field: 'name', type: 'text', styleClass: 'w-15', sortable: true },
        { label: 'Phone', field: 'phone', type: 'text', styleClass: 'w-10', sortable: true },
        { label: 'Email', field: 'email', type: 'text', styleClass: 'w-20', sortable: true },
        { label: 'OnDesktop', field: 'desktopSubscription', type: 'boolean', styleClass: 'w-10', sortable: true },
        { label: 'OnAndroid', field: 'androidSubscription', type: 'boolean', styleClass: 'w-10', sortable: true },
        { label: 'Date', field: 'date', type: 'date', styleClass: 'w-10 text-center', sortable: true }
      ],
      actions: [
        // { icon: 'i-Magnifi-Glass1', hint: 'View Notification', code: 'view', style: 'info' },
      ],
      options: {
        debounceDelay: 500,
        actionStyleClass: 'w-5 icons-td text-center',
      }
    }
  }

  openUserModal(content) {
    this.openedModal = this.dialogs.modal(content, { size: 'lg', backdrop: 'static' });
    var self = this;
    this.openedModal.result.then(function() {
      self.subscription = {};
    }).catch(function(e) {
      self.subscription = {};
    })
  }

  action(event) {
    console.log("UsersComponent ::: action :: event ", event);
    if (event.action == 'view') {
      var subscription = _.clone(event.item);
      this.subscription = subscription;
      this.openUserModal(this.subscriptionModal);
    }
  }

}
