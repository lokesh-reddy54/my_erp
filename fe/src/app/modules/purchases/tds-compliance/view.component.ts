import { Component, OnInit, ViewChild } from '@angular/core';
import { ProductService } from 'src/app/shared/services/product.service';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { debounceTime, take } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HttpClient } from "@angular/common/http";
import { Utils } from 'src/app/shared/utils';
import { DialogsService } from 'src/app/shared/services/dialogs.services';
import { UploadService } from 'src/app/shared/services/upload.service';
import { AccountsService } from 'src/app/shared/services/accounts.service';
import { PurchasesService } from 'src/app/shared/services/purchases.service';
import { AdminService } from 'src/app/shared/services/admin.service';
import { Helpers } from '../../../helpers';
import * as _ from 'lodash';
import * as moment from 'moment';

@Component({
  selector: 'purchases-tds-compliance',
  templateUrl: './view.component.html'
})
export class TdsComplianceComponent implements OnInit {
  @ViewChild('invoicesModal') invoicesModal: any;

  search: any = new FormControl('');
  items: any = [];
  selectedItem: any = {};
  filters: any = {};
  loading: boolean = false;
  noResults: boolean = false;
  offset: number = 0;
  limit: number = 20;

  constructor(private dialogs: DialogsService, private service: PurchasesService, private accountsService: AccountsService,
    private adminService: AdminService, private uploadService: UploadService) {
  }

  ngOnInit() {
    this.search.valueChanges
      .pipe(debounceTime(200))
      .subscribe(value => {
        this.filters.search = value;
        this.resetList();
      });
    this.loadMore();
    var year = moment().year();
    var month = moment().month();
    if (month < 3) {
      this.year = year - 1;
    } else {
      this.year = year
    }
    this.filters.dateFrom = moment().add(-1,'months').startOf('month').format("YYYY-MM-DD");
    this.filters.dateTo = moment().add(-1,'months').endOf('month').format("YYYY-MM-DD");
    this.filters.notPaid = true;

    this.service.listVendorTdsComplianceTerms({ year: this.year }).subscribe(res => {
      if (res['data']) {
        this.complianceTerms = res['data'];
        this.initDatePicker();
      }
    })
  }

  complianceTerms: any = [];
  year: any;
  initDatePicker() {
    var ranges = {
      'Clear': [null, null],
    }
    for (var i = 0; i < this.complianceTerms.length; i++) {
      var term = this.complianceTerms[i];
      ranges[moment(term.dateFrom).format("MMM YYYY")] = [moment(term.dateFrom).startOf('month'), moment(term.dateTo).endOf('month')]
    }

    var self = this;
    var picker: any = $('#daterangepicker');
    picker.val(moment().add(-1,'months').startOf("month").format("MMM DD") + " - " + moment().add(-1,'months').endOf("month").format("MMM DD"));
    picker.daterangepicker({
      opens: 'left',
      autoUpdateInput: false,
      ranges: ranges
    }, function(start, end, label) {
      console.log("A new date selection was made: " + label);
      if (start && end) {
        self.filters.dateFrom = start.format('YYYY-MM-DD');
        self.filters.dateTo = end.format('YYYY-MM-DD');
      } else {
        self.filters.dateFrom = null;
        self.filters.dateTo = null;
        setTimeout(function() {
          $(this).val("");
        }, 500)
      }
      self.resetList();
    });
    picker.on('apply.daterangepicker', function(ev, picker) {
      // $(this).val(picker.startDate.format('MMM DD') + ' - ' + picker.endDate.format('MMM DD'));
      if (picker.startDate.isValid() && picker.endDate.isValid()) {
        $(this).val(picker.startDate.format('MMM DD') + ' - ' + picker.endDate.format('MMM DD'));
      } else {
        $(this).val('');
        self.filters.dateFrom = null;
        self.filters.dateTo = null;
        self.resetList();
        setTimeout(function() {
          self.initDatePicker();
        }, 100)
      }
    });
    picker.on('cancel.daterangepicker', function(ev, picker) {
      $(this).val('');
      self.filters.dateFrom = null;
      self.filters.dateTo = null;
      self.resetList();
    });
  }

  loadMore() {
    if (!this.loading && !this.noResults) {
      this.loading = true;

      var data = { filters: this.filters, limit: this.limit, offset: this.offset, sortBy: this.sortBy, sortOrder: this.sortOrder };
      this.service.listVendorTdsPayments(data)
        .pipe(take(1)).subscribe((res) => {
          console.log("PurchaseOrders :: loadMore : res : ", res);
          if (res['data']) {
            var data = res['data'];

            this.items = this.items.concat(data);
            this.loading = false;
            if (res['data'].length >= this.limit) {
              this.offset = this.offset + this.limit;
            } else {
              this.noResults = true;
            }
          } else {
            this.dialogs.error(res['error'], "Error")
          }
        });
    }
  }

  moreFilters: any = true;
  resetList() {
    this.items = [];
    this.offset = 0;
    this.limit = 20;
    this.noResults = false;
    this.loadMore();
  }
  invoicesTds: any = 0;
  viewInvoices(item) {
    this.selectedItem = _.clone(item);
    this.tdsPayment.tdsFile = null;
    
    var data = {
      vendorId: this.selectedItem.vendorId,
      dateFrom: this.filters.dateFrom,
      dateTo: this.filters.dateTo,
    }
    this.service.getVendorTdsPayments(data).subscribe(res => {
      if (res['data']) {
        this.invoices = res['data'];
        this.invoicesTds = _.sumBy(this.invoices, 'tds');
      }
    })
    this.openedModal = this.dialogs.modal(this.invoicesModal, { size: 'lg' })
  }

  invoices: any = [];
  tdsPayment: any = {};
  openedModal: any;
  saveTdsPayment() {
    var data: any = _.clone(this.tdsPayment);

    if (this.invoicesTds < this.tdsPayment.amount) {
      this.dialogs.msg("Entered TDS is greater than invoices total TDS. Please check and correct.", "error")
      return;
    } else if (this.invoicesTds > this.tdsPayment.amount) {
      this.dialogs.msg("Entered TDS is lesser than invoices total TDS. Please check and correct.", "error")
      return;
    }

    var self = this;
    var complianceTerm = _.find(this.complianceTerms, function(c){
      return moment(c.dateFrom).format("YYYY-MM-DD") == moment(self.filters.dateFrom).format("YYYY-MM-DD");
    })
    data.vendorId = this.selectedItem.vendorId;
    data.complianceTermId = complianceTerm.id;
    data.date = Utils.ngbDateToMoment(this.tdsPayment.date).format("YYYY-MM-DD");
    delete data.tdsFile;

    this.loading = true;
    this.service.saveVendorTdsPayment(data).subscribe(res => {
      if (res['data']) {
        this.dialogs.msg("Vendor TDS payment is updated");
        this.resetList();
        this.openedModal.close();
      }
    })
  }

  tdsFile: any;
  tdsFileChange(event) {
    this.tdsFile = event.target.files[0];
  }
  tdsUploadResponse: any = { status: '', message: '', filePath: '' };
  tdsFileError: any;
  uploadTdsFile() {
    const formData = new FormData();
    formData.append('file', this.tdsFile);

    this.loading = true;
    this.uploadService.upload(formData).subscribe(
      (res) => {
        this.tdsUploadResponse = res;
        if (res.file) {
          this.loading = false;
          this.tdsPayment.tdsFileId = res.id;
          this.tdsPayment.tdsFile = res;
          this.tdsFile = null;
        }
      },
      (err) => this.tdsFileError = err
    );
  }

  sort: any = {};
  sortBy: any;
  sortOrder: any;
  sortColBy(col) {
    var sort = _.clone(this.sort);
    var _sort = {};
    var sortType = 'asc';
    if (sort[col] && sort[col].asc) {
      sort[col].asc = false;
      sort[col].desc = true;
      sortType = 'desc';
      this.sort = sort;
      this.sortOrder = 'desc';
    } else {
      _sort[col] = { asc: true };
      this.sort = _sort;
      this.sortOrder = 'asc';
    }
    this.sortBy = col;
    this.resetList();
  }


}
