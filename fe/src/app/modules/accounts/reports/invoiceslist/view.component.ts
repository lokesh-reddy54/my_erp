
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
import { BookingsService } from 'src/app/shared/services/bookings.service';
import { Helpers } from '../../../../helpers';
import * as _ from 'lodash';
import { environment } from 'src/environments/environment';
import * as moment from 'moment';
import readXlsxFile from 'read-excel-file';
import { parseExcelDate } from 'read-excel-file';

@Component({
  selector: 'accounts-reports-invoiceslist',
  templateUrl: './view.component.html'
})
export class AccountsReportsInvoicesListComponent implements OnInit {
  selectedBooking: FormControl = new FormControl("");

  invoicesCount: any = 0;
  invoicesFilters: any = { cancelled: 0 };
  invoicesConfig: any = {};
  cancelledConfig: any = {};
  search: any = new FormControl('');
  items: any = [];
  selectedItem: any = {};
  filters: any = {};
  loading: boolean = false;
  noResults: boolean = false;
  offset: number = 0;
  limit: number = 20;

  constructor(private dialogs: DialogsService, private purchasesService: PurchasesService, private bookingsService: BookingsService,
    private service: AccountsService, private adminService: AdminService, private commonService: CommonService) {
  }

  ngOnInit() {
    this.search.valueChanges
      .pipe(debounceTime(200))
      .subscribe(value => {
        this.invoicesFilters.search = value;
      });

    this.invoicesConfig = {
      columns: [
        { label: 'Client', field: 'client', type: 'text', styleClass: 'w-30 text-left word-break', sortable: true },
        { label: 'Booking RefNo', field: 'bookingRefNo', type: 'link', href: '#/bookings/view/', id: 'bookingId', styleClass: 'w-15 word-break', sortable: true },
        { label: 'Invoice RefNo', field: 'refNo', type: 'url', url: 'file', styleClass: 'w-15 word-break', sortable: true },
        { label: 'InvoiceDate', field: 'date', type: 'date', styleClass: 'w-10 text-center', sortable: true },
        { label: 'Amount', field: 'amount', type: 'inr', styleClass: 'w-10 text-right', sortable: true },
        { label: 'DueDate', field: 'dueDate', type: 'date', styleClass: 'w-10 text-center', sortable: true },
        { label: '', field: '', type: '', styleClass: 'w-5 text-right' },
      ],
      actions: [
        // { icon: 'fa fa-check', hint: 'Added Ledger', code: 'openPO', style: 'info', condition: { label: 'purchaseOrderId', not: 'poid' } },
        // { icon: 'fa fa-search', hint: 'View Bill', code: 'viewBill', style: 'info', condition: { label: 'providerBillId', not: 'billid' } },
      ],
      options: {
        debounceDelay: 500,
        actionStyleClass: 'w-10 icons-td text-center',
      }
    }

    this.cancelledConfig = {
      columns: [
        { label: 'Client', field: 'client', type: 'text', styleClass: 'w-30 text-left', sortable: true },
        { label: 'Booking RefNo', field: 'bookingRefNo', type: 'link', href: '#/bookings/view/', id: 'bookingId', styleClass: 'w-10', sortable: true },
        { label: 'Invoice RefNo', field: 'refNo', type: 'url', url: 'file', styleClass: 'w-10', sortable: true },
        { label: 'InvoiceDate', field: 'date', type: 'date', styleClass: 'w-10 text-center', sortable: true },
        { label: 'Amount', field: 'amount', type: 'inr', styleClass: 'w-10 text-right', sortable: true },
        { label: 'Reason', field: 'cancelledReason', type: 'text', styleClass: 'w-30', sortable: true },
      ],
      actions: [
        // { icon: 'fa fa-check', hint: 'Added Ledger', code: 'openPO', style: 'info', condition: { label: 'purchaseOrderId', not: 'poid' } },
        // { icon: 'fa fa-search', hint: 'View Bill', code: 'viewBill', style: 'info', condition: { label: 'providerBillId', not: 'billid' } },
      ],
      options: {
        debounceDelay: 500,
        actionStyleClass: 'w-10 icons-td text-center',
      }
    }

    this.invoicesFilters.fromDate = moment().startOf('month').format('YYYY-MM-DD');
    this.invoicesFilters.toDate = moment().endOf('month').format('YYYY-MM-DD');
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
      // fromDate: this.invoicesFilters.fromDate,
      // toDate: this.invoicesFilters.toDate,
      ranges: ranges
    }, function(start, end, label) {
      console.log("A new date selection was made: " + label);
      self.invoicesFilters.fromDate = start.format('YYYY-MM-DD');
      self.invoicesFilters.toDate = end.format('YYYY-MM-DD');
    });
    picker.on('apply.daterangepicker', function(ev, picker) {
      $(this).val(picker.startDate.format('DD/MM/YYYY') + ' - ' + picker.endDate.format('DD/MM/YYYY'));
    });
    picker.on('cancel.daterangepicker', function(ev, picker) {
      $(this).val('');
      self.invoicesFilters.fromDate = null;
      self.invoicesFilters.toDate = null;
    });
    picker.val(moment(self.invoicesFilters.fromDate).format('DD/MM/YYYY') + ' - ' + moment(self.invoicesFilters.toDate).format('DD/MM/YYYY'));
  }

  downloadInvoices() {
    var user = JSON.parse(localStorage.getItem("cwo_user"));
    var companyId = user && user.companyId ? user.companyId : 1;
    var splits = this.invoicesFilters.fromDate.split("-");
    var month = [splits[0], splits[1]].join("-");
    var url = environment.host + ":" + environment.port + "/v1/internal/reports/downloadInvoices/" + companyId + "/" + month
    window.open(url, "_blank");
  }

}
