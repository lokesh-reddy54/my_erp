import { Component, OnInit, ViewChild } from '@angular/core';
import { ProductService } from 'src/app/shared/services/product.service';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { debounceTime, take} from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HttpClient } from "@angular/common/http";
import { DialogsService } from 'src/app/shared/services/dialogs.services';
import { Helpers } from '../../../helpers';
import * as _ from 'lodash';

@Component({
  selector: 'admin-sms',
  templateUrl: './sms.component.html',
  styleUrls: ['./sms.component.scss']
})
export class AdminSMSComponent implements OnInit {
  searchControl: FormControl = new FormControl();
  form: FormGroup;

  sms: any = {};
  roles: any = ['Admin', 'BookingExecutive', 'SupportExecutive', 'SalesExecutive', 'OperationsExecutive', 'AccountsExecutive'];
  config: any = {};
  @ViewChild('list') list: any;

  items: any = [];
  selectedItem: any = {};
  loading: boolean = false;
  noResults: boolean = false;
  offset: number = 0;
  limit: number = 20;
  filter: any = {};

  smssObservable: Observable<any[]>;

  constructor(private dialogs: DialogsService, private httpClient: HttpClient, private fb: FormBuilder) { }

  ngOnInit() {
    this.form = new FormGroup({
      sms: new FormControl("", Validators.required),
      phone: new FormControl("", Validators.compose([
        Validators.required,
        Validators.pattern('^[6,7,8,9][0-9]{9}$')
      ]))
    });

    this.searchControl.valueChanges
      .pipe(debounceTime(200))
      .pipe(take(1)).subscribe(value => {
        this.filter.search = value;
      });

    this.config = {
      columns: [
        { label: 'SMS', field: 'name', type: 'text', styleClass: 'w-50', sortable: true },
        { label: 'Name', field: 'name', type: 'text', styleClass: 'w-10', sortable: true },
        { label: 'Phone', field: 'phone', type: 'text', styleClass: 'w-10 text-center', sortable: true },
        { label: 'Status', field: 'phone', type: 'text', styleClass: 'w-10 text-center', sortable: true },
        { label: 'SentOn', field: 'added', type: 'date', styleClass: 'w-10 text-center', sortable: true },
      ],
      actions: [
        { icon: 'i-Pen-5', hint: 'View', code: 'view', style: 'info' },
      ],
      options: {
        actionStyleClass: 'w-10 icons-td',
      }
    }
  }

  openedModal: any;
  viewSMS(content) {
    this.openedModal = this.dialogs.modal(content, { size: 'lg' });
    var self = this;
    this.openedModal.result.then(function() {
      self.sms = {};
    }).catch(function(e) {
      self.sms = {};
    })
  }

  openSMSModal(content) {
    this.openedModal = this.dialogs.modal(content, { size: 'lg' });
    var self = this;
    this.openedModal.result.then(function() {
      self.sms = {};
    }).catch(function(e) {
      self.sms = {};
    })
  }

  save() {
    console.log("SMSsComponent ::: save :: sms ", this.sms);
    this.loading = true;
    var self = this;
    setTimeout(function() {
      self.loading = false;
      self.dialogs.success('Toastr success!', 'Toastr title');
    }, 5000);
    // let self = this;
    // self.dialogs.loading('modal-sms', true);
    // this.service.saveSMS(this.sms).pipe(take(1)).subscribe(
    //   res => {
    //     self.dialogs.success("SMS '" + this.sms.name + "' is saved successfully ");
    //     self.dialogs.loading('modal-sms', false);
    //     self.dialogs.hideModal('modal-sms');
    //     self.list.reset();
    //   },
    //   error => {
    //     self.dialogs.error(error, 'Error while saving')
    //   }
    // )
  }

  action(event) {
    console.log("SMSsComponent ::: action :: event ", event);
    if (event.action == 'view') {
      this.viewSMS(_.clone(event.item));
    }
  }

}
