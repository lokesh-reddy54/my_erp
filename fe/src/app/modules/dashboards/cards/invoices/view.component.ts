import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { ProductService } from 'src/app/shared/services/product.service';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from "@angular/common/http";
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, take } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import { CommonService } from 'src/app/shared/services/common.service';
import { DialogsService } from 'src/app/shared/services/dialogs.services';
import { ReportsService } from 'src/app/shared/services/reports.service';
import { DashboardsService } from 'src/app/shared/services/dashboards.services';
import * as _ from 'lodash';

declare let $: any;

@Component({
  selector: 'invoices-cards',
  templateUrl: './view.component.html'
})
export class InvoicesCardsComponent implements OnInit, AfterViewInit {
  searchControl: FormControl = new FormControl();
  loading: any = false;

  constructor(private dialogs: DialogsService, public reportsService: ReportsService, private service: DashboardsService) {
  }

  ngOnInit() {
    this.searchControl.valueChanges
      .pipe(debounceTime(200))
      .pipe(take(1))
      .subscribe(value => {
      });
  }

  ngAfterViewInit() {
    this.loadData();
  }

  data: any = {};
  filters: any = {};
  projects: any = [];
  sprojects: any = [];
  cats: any = [];
  scats: any = [];
  types: any = [];
  stypes: any = [];
  loadData() {
    this.loading = true;
    this.service.getAccountsCards({ filters: this.filters }).pipe(take(1)).subscribe(
      res => {
        if (res['data']) {
          this.data = res['data'];
        }
        this.loading = false;
      }, error => {

      });
  }

  items:any = [];
  currentCard:any;
  openedModal:any;
  @ViewChild('creditEntriesModal') creditEntriesModal: any;
  @ViewChild('debitEntriesModal') debitEntriesModal: any;
  @ViewChild('billsInBillsQueueModal') billsInBillsQueueModal: any;
  @ViewChild('billsModal') billsModal: any;
  @ViewChild('dueAmountModal') dueAmountModal: any;
  @ViewChild('totalARAmountModal') totalARAmountModal: any;
  @ViewChild('gstModal') gstModal: any;
  @ViewChild('tdsDueModal') tdsDueModal: any;
  @ViewChild('highTdsDueClientsModal') highTdsDueClientsModal: any;
  openCardList(data, title) {
    data.title = title;
    console.log("AccountsCards ::: openCardList :: data : ", data);
    if(data.type){
    this.currentCard =data;
    if(data.type == 'creditSuspenses' || data.type=='nonRevenue' || data.type == 'creditNonAttributed'){
      this.openedModal = this.dialogs.modal(this.creditEntriesModal, { size: 'lg' });      
    } else if(data.type == 'debitSuspenses' || data.type=='nonExpense' || data.type == 'debitNonAttributed'){
      this.openedModal = this.dialogs.modal(this.debitEntriesModal, { size: 'lg' });      
    } else if(data.type == 'buildingBills' || data.type=='buildingRecurringBills' || data.type == 'hoBills' || data.type == 'hoRecurringBills' || data.type == 'projectBills'){
      this.openedModal = this.dialogs.modal(this.billsModal, { size: 'lg' });      
    }else if(data.type == 'billsInBillsQueue'){
      this.openedModal = this.dialogs.modal(this.billsInBillsQueueModal, { size: 'lg' });      
    }else if(data.type == 'totalARAmount'){
      this.openedModal = this.dialogs.modal(this.totalARAmountModal, { size: 'lg' });      
    }else if(data.type == 'tdsDue'){
      this.openedModal = this.dialogs.modal(this.tdsDueModal, { size: 'lg' });      
    }else if(data.type == 'highTdsDueClients'){
      this.openedModal = this.dialogs.modal(this.highTdsDueClientsModal, { size: 'lg' });      
    }else if(data.type == 'dueAmount' || data.type == 'payableAmount'){
      this.openedModal = this.dialogs.modal(this.dueAmountModal, { size: 'lg' });      
    }else if(data.type == 'noPOSInvoices' || data.type == 'gstPostedPendingPOs' || data.type == 'noBillsInvoices'
         || data.type == 'gstPostedPendingBills' || data.type == 'gstrVerificationPendingBills' || data.type == 'gstrVerificationPendingPOs'){
      this.openedModal = this.dialogs.modal(this.gstModal, { size: 'lg' });      
    }
    this.items = [];
    this.loading = true;
    this.service.getAccountsCardsList({ type: data.type, fromDate: data.fromDate, toDate: data.toDate }).pipe(take(1)).subscribe(
      res => {
        if (res['data']) {
          this.items = res['data'];
        }
        this.loading = false;
      }, error => {

      });
  }
  }


}
