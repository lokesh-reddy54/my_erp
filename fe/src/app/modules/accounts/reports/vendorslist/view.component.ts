import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { ProductService } from 'src/app/shared/services/product.service';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { debounceTime, take } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HttpClient } from "@angular/common/http";

import { Helpers } from 'src/app/helpers';
import { environment } from 'src/environments/environment';
import { CommonService } from 'src/app/shared/services/common.service';
import { DialogsService } from 'src/app/shared/services/dialogs.services';
import { AdminService } from 'src/app/shared/services/admin.service';
import { ReportsService } from 'src/app/shared/services/reports.service';
import { PurchasesService } from 'src/app/shared/services/purchases.service';
import * as _ from 'lodash';
import * as moment from 'moment';

@Component({
  selector: 'accounts-reports-vendorslist',
  templateUrl: './view.component.html'
})
export class AccountsVendorsListReportComponent implements OnInit, AfterViewInit {
  trackById = Helpers.trackById;

  searchControl: FormControl = new FormControl();
  loading: any = false;
  filters: any = { statuses: [] };
  searchClient: any;
  // filters: any = { statuses:['Booked','Active','Exiting','Exited']};

  constructor(private dialogs: DialogsService, private service: AdminService,
    private purchasesService: PurchasesService, public reportsService: ReportsService) {
  }

  ngAfterViewInit() { }

  ngOnInit() {
    this.searchControl.valueChanges
      .pipe(debounceTime(200))
      .subscribe(value => {
        this.filters.search = value;
        this.searchClient = value;
      });

    this.loadData();
  }

  data: any;
  vendors: any = [];
  providers: any = [];
  loadData() {
    this.loading = true;
    this.filters.search = this.searchClient;
    this.reportsService.listVendors(this.filters)
      .pipe(take(1))
      .subscribe(
        res => {
          var data = res['data'];
          this.vendors = data.vendors;
          this.providers = data.providers;
          this.loading = false;
        }, error => {

        });
  }

  vendorLedgerAdded(vendor) {
    var self = this;
    this.dialogs.confirm("Are you sure that you have added new Vendor in Account Books for " + vendor.name + " ?")
      .then(event => {
        if (event.value) {
          self.loading = true;
          self.purchasesService.saveVendor({ id: vendor.vendorId, itLedgerAdded: 1 }).subscribe(res => {
            if (res['data']) {
              vendor.itLedgerAdded = 1;
              self.dialogs.success("Vendor " + vendor.name + " ledger has registered.");
              self.loading = false;
            }
          })
        }
      })
  }
  providerLedgerAdded(provider) {
    var self = this;
    this.dialogs.confirm("Are you sure that you have added new ServiceProvider in Account Books for " + provider.name + " ?")
      .then(event => {
        if (event.value) {
          self.loading = true;
          self.service.saveServiceProvider({ id: provider.providerId, itLedgerAdded: 1 }).subscribe(res => {
            if (res['data']) {
              provider.itLedgerAdded = 1;
              self.dialogs.success("ServiceProvider " + provider.name + " ledger has registered.");
              self.loading = false;
            }
          })
        }
      })
  }

  vendorsSort: any = { name: { asc: true } }
  sortVendorsBy(col) {
    var vendorsSort = _.clone(this.vendorsSort);
    var _vendorsSort = {};
    var vendorsSortType = 'asc';
    if (vendorsSort[col] && vendorsSort[col].asc) {
      vendorsSort[col].asc = false;
      vendorsSort[col].desc = true;
      vendorsSortType = 'desc';
      this.vendorsSort = vendorsSort;
    } else {
      _vendorsSort[col] = { asc: true };
      this.vendorsSort = _vendorsSort;
    }
    var data = _.clone(this.vendors);
    this.vendors = _.orderBy(data, [col], [vendorsSortType]);
  }

  sort: any = { name: { asc: true } }
  sortProvidersBy(col) {
    var sort = _.clone(this.sort);
    var _sort = {};
    var sortType = 'asc';
    if (sort[col] && sort[col].asc) {
      sort[col].asc = false;
      sort[col].desc = true;
      sortType = 'desc';
      this.sort = sort;
    } else {
      _sort[col] = { asc: true };
      this.sort = _sort;
    }
    var data = _.clone(this.providers);
    this.providers = _.orderBy(data, [col], [sortType]);
  }

}
