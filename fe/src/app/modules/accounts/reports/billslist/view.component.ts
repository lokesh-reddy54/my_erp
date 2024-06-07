
import { Component, OnInit, ViewChild } from '@angular/core';
import { ProductService } from 'src/app/shared/services/product.service';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { debounceTime, take } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HttpClient } from "@angular/common/http";
import { Utils } from 'src/app/shared/utils';
import { DialogsService } from 'src/app/shared/services/dialogs.services';
import { CommonService } from 'src/app/shared/services/common.service';
import { AccountsService } from 'src/app/shared/services/accounts.service';
import { AdminService } from 'src/app/shared/services/admin.service';
import { PurchasesService } from 'src/app/shared/services/purchases.service';
import { ReportsService } from 'src/app/shared/services/reports.service';
import { Helpers } from '../../../../helpers';
import * as _ from 'lodash';
import { environment } from 'src/environments/environment';
import * as moment from 'moment';
import readXlsxFile from 'read-excel-file';
import { parseExcelDate } from 'read-excel-file';

@Component({
  selector: 'accounts-reports-billslist',
  templateUrl: './view.component.html'
})
export class AccountsReportsBillsListComponent implements OnInit {
  billsCount: any = 0;
  billsFilters: any = {};
  billsConfig: any = {};
  search: any = new FormControl('');
  searchVendor = null;
  items: any = [];
  loading: boolean = false;
  noResults: boolean = false;
  offset: number = 0;
  limit: number = 20;

  constructor(private dialogs: DialogsService, private service: ReportsService,
    private adminService: AdminService, private commonService: CommonService) {
  }

  ngOnInit() {
    this.search.valueChanges
      .pipe(debounceTime(200))
      .subscribe(value => {
        this.billsFilters.search = value;
        this.loadData();
      });

    this.billsFilters.fromDate = moment().startOf('month').format('YYYY-MM-DD');
    this.billsFilters.toDate = moment().endOf('month').format('YYYY-MM-DD');
    var ranges = {
      'This Month': [moment().startOf('month'), moment().endOf('month')],
      'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
    }
    for (var i = 2; i < 10; i++) {
      var date = moment().subtract(i, 'month').startOf('month');
      ranges[date.format('MMM') + ' ' + date.format('YY') + "' Month"] = [moment().subtract(i, 'month').startOf('month'), moment().subtract(i, 'month').endOf('month')]
    }
    var self = this;
    var picker: any = $('#daterangepicker');
    picker.daterangepicker({
      opens: 'left',
      autoUpdateInput: false,
      // fromDate: this.billsFilters.fromDate,
      // toDate: this.billsFilters.toDate,
      ranges: ranges
    }, function(start, end, label) {
      console.log("A new date selection was made: " + label);
      self.billsFilters.fromDate = start.format('YYYY-MM-DD');
      self.billsFilters.toDate = end.format('YYYY-MM-DD');
    });
    picker.on('apply.daterangepicker', function(ev, picker) {
      $(this).val(picker.startDate.format('DD/MM/YYYY') + ' - ' + picker.endDate.format('DD/MM/YYYY'));
      self.loadData();
    });
    picker.on('cancel.daterangepicker', function(ev, picker) {
      $(this).val('');
      self.billsFilters.fromDate = null;
      self.billsFilters.toDate = null;
      self.loadData();
    });
    picker.val(moment(self.billsFilters.fromDate).format('DD/MM/YYYY') + ' - ' + moment(self.billsFilters.toDate).format('DD/MM/YYYY'));


    this.loadData();
  }

  data: any;
  buildingBills: any = [];
  hoBills: any = [];
  capexPos: any = [];
  capexBills: any = [];
  opexPos: any = [];
  loadData() {
    this.loading = true;
    this.service.getExpenseBills(this.billsFilters)
      .pipe(take(1))
      .subscribe(
        res => {
          if (res['data']) {
            var data = res['data'];
            this.buildingBills = data.buildingBills;
            this.hoBills = data.hoBills;
            this.capexPos = data.capexPos;
            this.capexBills = data.capexBills;
            this.opexPos = data.opexPos;

            this.billsCount = this.buildingBills.length + this.hoBills.length + this.capexBills.length + this.opexPos.length + this.capexPos.length;
          }
          this.loading = false;
        }, error => {

        });
  }


  downloadBills() {
    var user = JSON.parse(localStorage.getItem("cwo_user"));
    var companyId = user && user.companyId ? user.companyId : 1;
    var splits = this.billsFilters.fromDate.split("-");
    var month = [splits[0], splits[1]].join("-");
    var url = environment.host + ":" + environment.port + "/v1/internal/reports/downloadBills/" + companyId + "/" + month
    window.open(url, "_blank");
  }

  sort: any = { name: { asc: true } }
  sortBy(col) {
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
    var data = _.clone(this.capexBills);
    this.capexBills = _.orderBy(data, [col], [sortType]);
    data = _.clone(this.capexPos);
    this.capexPos = _.orderBy(data, [col], [sortType]);
    data = _.clone(this.buildingBills);
    this.buildingBills = _.orderBy(data, [col], [sortType]);
    data = _.clone(this.hoBills);
    this.hoBills = _.orderBy(data, [col], [sortType]);
    data = _.clone(this.opexPos);
    this.opexPos = _.orderBy(data, [col], [sortType]);
  }
}
