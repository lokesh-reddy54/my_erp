import { Component, OnInit, ViewChild } from '@angular/core';
import { ProductService } from 'src/app/shared/services/product.service';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { debounceTime, take } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HttpClient } from "@angular/common/http";
import { DialogsService } from 'src/app/shared/services/dialogs.services';
import { BookingsService } from 'src/app/shared/services/bookings.service';
import { Utils } from 'src/app/shared/utils';
import { Helpers } from '../../../helpers';
import * as _ from 'lodash';
import * as moment from 'moment';

@Component({
  selector: 'bookings-contract-renewals',
  templateUrl: './view.component.html'
})
export class BookingContractRenewalsComponent implements OnInit {
  searchControl: FormControl = new FormControl();
  form: FormGroup;

  loading: boolean = false;
  contract: any = {};
  filter: any = {};
  config: any = {};
  @ViewChild('list') list: any;
  @ViewChild('contractModal') contractModal: any;

  openedModal: any;

  constructor(private dialogs: DialogsService, private service: BookingsService) { }

  ngOnInit() {
    this.form = new FormGroup({
      rent: new FormControl("", Validators.required),
      effectiveFrom: new FormControl("", Validators.required),
    });

    this.searchControl.valueChanges
      .pipe(debounceTime(200))
      .pipe(take(1)).subscribe(value => {
        this.filter.search = value;
      });

    this.config = {
      columns: [
        { label: 'Company', field: 'company', type: 'link', linkField: 'bookingid', linkPrefix: '/company/', styleClass: 'w-40', sortable: true },
        { label: 'Booking Date', field: 'started', type: 'date', styleClass: 'w-10', sortable: true },
        { label: 'Current Contract', field: 'kind', type: 'link', styleClass: 'w-10', sortable: true },
        { label: 'Contract date', field: 'effectiveDate', type: 'date', styleClass: 'w-10', sortable: true },
        { label: 'Renewal date', field: 'newEffectiveDate', type: 'date', styleClass: 'w-10 text-center', sortable: true },
        { label: 'Current Rent', field: 'rent', type: 'inr', styleClass: 'w-10 text-right', sortable: true },
        { label: 'New Rent', field: 'newRent', type: 'inr', styleClass: 'w-10 text-right', sortable: true },
      ],
      actions: [
        { icon: 'fa fa-refresh', hint: 'Renew Contract', code: 'renew', style: 'info' },
      ],
      options: {
        debounceDelay: 500,
        actionStyleClass: 'w-10 icons-td text-center',
      }
    }

    this.filter.startDate = moment().add(-1, 'months').startOf('month');
    this.filter.endDate = moment().add(1, 'months').endOf('month');
    var self = this;
    var picker: any = $('#daterangepicker');
    picker.daterangepicker({
      opens: 'left',
      startDate: this.filter.startDate,
      endDate: this.filter.endDate,
      ranges: {
        // 'Today': [moment(), moment()],
        // 'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
        // 'Last 7 Days': [moment().subtract(6, 'days'), moment()],
        'Last 30 Days': [moment().subtract(29, 'days'), moment()],
        'This Month': [moment().startOf('month'), moment().endOf('month')],
        'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
      }
    }, function(start, end, label) {
      console.log("A new date selection was made: " + label);
      self.filter.startDate = start.format('YYYY-MM-DD');
      self.filter.endDate = end.format('YYYY-MM-DD');
    });
  }

  openContractModal() {
    this.openedModal = this.dialogs.modal(this.contractModal, { size: 'md', backdrop: 'static' });
    var self = this;
    this.openedModal.result.then(function() {
      self.contract = {};
    }).catch(function(e) {
      self.contract = {};
    })
  }

  save() {
    console.log("BookingContractRenewalsComponent ::: save :: contract ", this.contract);
    this.loading = true;
    var self = this;
    var contract = _.clone(this.contract);
    contract.newEffectiveDate = Utils.ngbDateToDate(contract.newEffectiveDate);
    this.service.renewContract(contract).pipe(take(1)).subscribe(
      res => {
        self.dialogs.success("Contract for '" + this.contract.company + "' is renewed successfully ");
        self.loading = false;
        self.list.reset();
        this.openedModal.close();
      },
      error => {
        self.dialogs.error(error, 'Error while saving')
      }
    )
  }

  action(event) {
    console.log("BookingContractRenewalsComponent ::: action :: event ", event);
    if (event.action == 'renew') {
      var contract = _.clone(event.item);
      contract.newEffectiveDate = Utils.dateToNgbDate(contract.newEffectiveDate);
      console.log("BookingContractRenewalsComponent ::: action :: contract ", contract);
      this.contract = contract;
      this.openContractModal();
    }
  }


}
