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
import * as _ from 'lodash';

@Component({
  selector: 'accounts-reports-productslist',
  templateUrl: './view.component.html'
})
export class AccountsReportProductsListComponent implements OnInit, AfterViewInit {
  trackById = Helpers.trackById;

  searchControl: FormControl = new FormControl();
  loading: any = false;
  filters: any = {};

  constructor(private dialogs: DialogsService, private service: AdminService, public reportsService: ReportsService) {
  }

  ngAfterViewInit() { }

  ngOnInit() {
    this.searchControl.valueChanges
      .pipe(debounceTime(200))
      .subscribe(value => {
        this.filters.search = value;
      });
    this.loadData();
  }

  data: any;
  loadData() {
    this.reportsService.listProducts(this.filters)
      .pipe(take(1))
      .subscribe(
        res => {
          this.data = res['data'];
        }, error => {

        });
  }
}
