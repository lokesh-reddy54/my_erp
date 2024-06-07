import { Component, OnInit, ViewChild } from '@angular/core';
import { ProductService } from 'src/app/shared/services/product.service';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { debounceTime, take } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Router, NavigationEnd } from '@angular/router';
import { HttpClient } from "@angular/common/http";
import { DialogsService } from 'src/app/shared/services/dialogs.services';
import { AdminService } from 'src/app/shared/services/admin.service';
import { PurchasesService } from 'src/app/shared/services/purchases.service';
import { Helpers } from '../../../helpers';
import * as _ from 'lodash';

@Component({
  selector: 'vendor-list',
  templateUrl: './list.component.html'
})
export class VendorsListComponent implements OnInit {
  searchControl: FormControl = new FormControl();
  form: FormGroup;

  vendor: any = { contact: {} };
  config: any = {};
  @ViewChild('list') list: any;
  @ViewChild('vendorModal') vendorModal: any;

  openedModal: any;
  items: any = [];
  selectedItem: any = {};
  loading: boolean = false;
  noResults: boolean = false;
  offset: number = 0;
  limit: number = 20;
  filter: any = { statuses: ['Empanelled'], active: 1 };

  vendorsObservable: Observable<any[]>;
  vendorStats: any = {};

  constructor(public router: Router, private dialogs: DialogsService, private service: PurchasesService, private adminService: AdminService) { }

  ngOnInit() {
    this.form = new FormGroup({
      contactTitle: new FormControl("", Validators.required),
      contactName: new FormControl("", Validators.required),
      contactPhone: new FormControl("", Validators.required),
      contactEmail: new FormControl("", Validators.required),
      name: new FormControl("", Validators.required),
      vendorType: new FormControl("", Validators.required),
      active: new FormControl("", Validators.required),
      hasGst: new FormControl(""),
      address: new FormControl("", Validators.required),
      gst: new FormControl(""),
      cin: new FormControl(""),
      pan: new FormControl(""),
      msme: new FormControl(""),
      description: new FormControl(""),
      paymentMode: new FormControl("", Validators.required),
    });

    this.searchControl.valueChanges
      .pipe(debounceTime(200))
      .subscribe(value => {
        this.filter.search = value;
      });

    this.config = {
      columns: [
        { label: 'Name', field: 'name', type: 'text', styleClass: 'w-20', tooltip: 'description', sortable: true },
        { label: 'Contact', field: 'contact.name', type: 'text', styleClass: 'w-20', sortable: true },
        { label: 'Phone', field: 'contact.phone', type: 'text', styleClass: 'w-10 text-center', sortable: true },
        // { label: 'RefNo', field: 'refNo', type: 'text', styleClass: 'w-10 text-center', sortable: true },
        { label: 'Status', field: 'status', type: 'text', styleClass: 'w-10 text-center', sortable: true },
        // { label: 'Registered', field: 'date', type: 'date', styleClass: 'w-10 text-center', sortable: true },
        { label: 'OrgType', field: 'vendorType', type: 'text', styleClass: 'w-15 text-center', sortable: true },
        { label: 'HasGst', field: 'hasGst', type: 'boolean', styleClass: 'w-5 text-center', sortable: true },
      ],
      actions: [
        { icon: 'i-Pen-5', hint: 'Edit', code: 'edit', style: 'info' },
        { icon: 'i-Magnifi-Glass1', hint: 'View', code: 'view', style: 'info' },
      ],
      options: {
        debounceDelay: 500,
        actionStyleClass: 'w-10 icons-td text-center',
      }
    }

    this.service.getVendorStats({}).pipe(take(1)).subscribe(res => {
      if (res['data']) {
        this.vendorStats = res['data'];
      }
    })
  }

  openVendorModal(content) {
    this.openedModal = this.dialogs.modal(content, { size: 'lg', backdrop: 'static' });
    var self = this;
    this.openedModal.result.then(function() {
      self.vendor = { contact: {} };
    }).catch(function(e) {
      self.vendor = { contact: {} };
    })
  }

  save() {
    console.log("VendorsComponent ::: save :: vendor ", this.vendor);
    this.loading = true;
    var self = this;
    var vendor = _.clone(this.vendor);
    this.service.saveVendor(vendor).pipe(take(1)).subscribe(
      res => {
        self.dialogs.success("Vendor '" + this.vendor.name + "' is saved successfully ");
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
    console.log("VendorsComponent ::: action :: event ", event);
    if (event.action == 'edit') {
      var vendor = _.clone(event.item);
      this.vendor = vendor;
      this.openVendorModal(this.vendorModal);
    } else if (event.action == 'view') {
      this.router.navigateByUrl('/purchases/vendor/' + event.item.id);
    }
  }

  
  @ViewChild('helpNotesModal') helpNotesModal: any;
  openHelpNotes(){
     this.openedModal = this.dialogs.modal(this.helpNotesModal, {});
  }
}
