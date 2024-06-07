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
  selector: 'admin-servicebills',
  templateUrl: './list.component.html'
})
export class AccountsServiceBillsComponent implements OnInit {
  searchControl: FormControl = new FormControl();
  form: FormGroup;

  serviceBill: any = {};
  config: any = {};
  @ViewChild('list') list: any;

  items: any = [];
  selectedItem: any = {};
  loading: boolean = false;
  noResults: boolean = false;
  offset: number = 0;
  limit: number = 20;
  filter: any = {};

  constructor(private dialogs: DialogsService, private service: AccountsService, private adminService: AdminService) { }

  ngOnInit() {
    this.searchControl.valueChanges
      .pipe(debounceTime(200))
      .pipe(take(1)).subscribe(value => {
        this.filter.search = value;
      });

    this.config = {
      columns: [
        { label: 'Office', field: 'servicePayment.office.name', type: 'text', styleClass: 'w-10', sortable: true },
        { label: 'Service', field: 'servicePayment.service.name', type: 'text', styleClass: 'w-10', sortable: true },
        { label: 'Provider', field: 'servicePayment.serviceProvider.name', type: 'text', styleClass: 'w-15', sortable: true },
        { label: 'Amount', field: 'amount', type: 'inr', styleClass: 'w-5', sortable: true },
        { label: 'From', field: 'dateFrom', type: 'date', styleClass: 'w-10 text-center', sortable: true },
        { label: 'To', field: 'dateTo', type: 'date', styleClass: 'w-10 text-center', sortable: true },
        { label: 'BillDate', field: 'billDate', type: 'date', styleClass: 'w-10 text-center', sortable: true },
        { label: 'DueDate', field: 'billDueDate', type: 'date', styleClass: 'w-10 text-center', sortable: true },
        { label: 'Status', field: 'status', type: 'text', styleClass: 'w-5 text-center', sortable: true },
        { label: 'PaidOn', field: 'paidOn', type: 'date', styleClass: 'w-10 text-center', sortable: true },
      ],
      actions: [
        { icon: 'fa fa-check', hint: 'Approve', code: 'approve', style: 'info', condition: { label: 'status', value: 'New' } },
        { icon: 'fa fa-dollar', hint: 'Process Payout', code: 'processPayout', style: 'primary', condition: { label: 'status', value: 'Approved' } }
      ],
      options: {
        debounceDelay: 500,
        actionStyleClass: 'w-5 icons-td text-center',
      }
    }
  }

  save() {
    console.log("ServiceBillsComponent ::: save :: serviceBill ", this.serviceBill);
    this.loading = true;
    var self = this;
    var serviceBill = _.clone(this.serviceBill);
    this.service.saveServiceBill(serviceBill).pipe(take(1)).subscribe(
      res => {
        if (res['data']) {
          self.dialogs.success("ServiceBill for '" + this.serviceBill.servicePayment.office.name + "' is updated successfully ");
          self.list.reset();
        } else if(res['error']){
          // self.dialogs.error(res['error']);
        }
        self.loading = false;
      },
      error => {
        self.loading = false;
        self.dialogs.error(error, 'Error while saving')
      }
    )
  }

  raiseBills() {
    this.loading = true;
    this.service.raiseServiceBills({}).pipe(take(1)).subscribe(
      res => {
        if (res['data']) {
          this.dialogs.success("ServiceBills are updated to till date. ");
          this.list.reset();
        } else {
          this.dialogs.error(res['error']);
        }
        this.loading = false;
      },
      error => {
        this.dialogs.error(error, 'Error while saving')
      }
    )
  }

  action(event) {
    console.log("ServiceBillsComponent ::: action :: event ", event);
    if (event.action == 'edit') {
      var serviceBill = _.clone(event.item);
      this.serviceBill = serviceBill;
    } else if (event.action == 'approve') {
      var serviceBill = _.clone(event.item);
      serviceBill.approved = true;
      this.serviceBill = serviceBill;
      this.save();
    } else if (event.action == 'processPayout') {
      var serviceBill = _.clone(event.item);
      serviceBill.processPayout = true;
      this.serviceBill = serviceBill;
      this.save();
    }
  }

}
