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
  selector: 'purchases-gst-compliance',
  templateUrl: './view.component.html'
})
export class GstComplianceComponent implements OnInit {
  payoutForm: FormGroup;
  rejectForm: FormGroup;
  paymentForm: FormGroup;

  selectedPayout: any = {};
  payout: any = {};
  invoicesConfig: any = {};
  invoicesFilters: any = { statuses: ["Pending", "MisMatched"] };

  @ViewChild('invoicesList') invoicesList: any;
  @ViewChild('gstModal') gstModal: any;

  search: any = new FormControl('');
  items: any = [];
  complianceTerms: any = [];
  selectedItem: any = {};
  filters: any = {};
  loading: boolean = false;
  noResults: boolean = false;
  offset: number = 0;
  limit: number = 20;
  year:any;

  constructor(private dialogs: DialogsService, private service: PurchasesService, private accountsService: AccountsService,
    private adminService: AdminService, private uploadService: UploadService) {
  }

  ngOnInit() {
    this.search.valueChanges
      .pipe(debounceTime(200))
      .subscribe(value => {
        this.invoicesFilters.search = value;
        this.resetList();
      });

    this.getPayoutsByStatus();
    this.loadMore();

    var year:any = moment().year();
    var month = moment().month();
    if (month < 3) {
      this.year = year - 1;
    } else {
      this.year = year
    }
    this.service.listVendorGstComplianceTerms({ year: this.year }).subscribe(res => {
      if (res['data']) {
        this.complianceTerms = res['data'];
        this.initRaisedDatePicker();
      }
    })
  }

  initRaisedDatePicker() {
    var self = this;
    var picker: any = $('#daterangepicker');
    var ranges = {
      'Clear': [null, null],
    }
    for (var i = 0; i < this.complianceTerms.length; i++) {
      var term = this.complianceTerms[i];
      ranges[moment(term.dateFrom).format("MMM YYYY")] = [moment(term.dateFrom).startOf('month'), moment(term.dateTo).endOf('month')]
    }

    picker.val(null);
    picker.daterangepicker({
      opens: 'left',
      autoUpdateInput: false,
      ranges: ranges
    }, function(start, end, label) {
      console.log("A new date selection was made: " + label);
      if (start && end) {
        self.invoicesFilters.dateFrom = start.format('YYYY-MM-DD');
        self.invoicesFilters.dateTo = end.format('YYYY-MM-DD');
      } else {
        self.invoicesFilters.dateFrom = null;
        self.invoicesFilters.dateTo = null;
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
        self.invoicesFilters.dateFrom = null;
        self.invoicesFilters.dateTo = null;
        self.resetList();
        setTimeout(function() {
          self.initRaisedDatePicker();
        }, 100)
      }
    });
    picker.on('cancel.daterangepicker', function(ev, picker) {
      $(this).val('');
      self.invoicesFilters.dateFrom = null;
      self.invoicesFilters.dateTo = null;
      self.resetList();
    });
  }

  loadMore() {
    if (!this.loading && !this.noResults) {
      this.loading = true;

      var data = { filters: this.invoicesFilters, limit: this.limit, offset: this.offset, sortBy: this.sortBy, sortOrder: this.sortOrder };
      this.service.listPurchaseOrderInvoices(data)
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

  statuses: any = [];
  totalPayouts: any = 0;
  getPayoutsByStatus() {
    this.accountsService.getPayoutsByStatus({
      paymentModes: this.invoicesFilters.paymentModes,
      types: this.invoicesFilters.types
    }).subscribe(res => {
      this.statuses = res['data']['statuses'];
      this.totalPayouts = _.sumBy(this.statuses, 'count');
    })
  }

  gstSlabs: any = [];
  slab: any = {};
  taxInvoice: any = {};
  openedModal: any;

  editGSTSlabs(invoice?, viewOnly?) {
    console.log("openTaxInvoiceModal :: invoice : ", invoice);
    this.taxInvoice = _.clone(invoice);
    if (viewOnly) {
      this.taxInvoice.viewOnly = true;
    }
    this.slab = { gst: 0, igst: 0, cgst: 0, sgst: 0, tds: 0 };
    if (!this.taxInvoice.gstSlabs) {
      this.taxInvoice.gstSlabs = [];
      this.taxInvoice.verificationSlabs = [];
      this.service.getPurchaseOrderInvoiceGsts(invoice.id).subscribe(res => {
        if (res['data'] && res['data'].gstSlabs) {
          var slabs = res['data'].gstSlabs;
          this.taxInvoice.gstFile = res['data'].gstFile;
          this.taxInvoice.gstSlabs = _.filter(slabs, { isVerification: 0 });
          this.taxInvoice.verificationSlabs = _.filter(slabs, { isVerification: 1 })
        }
      })
    }
    this.openedModal = this.dialogs.modal(this.gstModal, { size: 'lg' });
    var self = this;
    this.openedModal.result.then(function() {
      self.loading = false;
    }).catch(function(e) {
      self.loading = false;
    })
  }

  updateSlabGST() {
    this.slab.gst = this.slab.igst;
    if (!this.slab.gst) {
      this.slab.gst = this.slab.sgst + this.slab.cgst;
    }
  }

  addGstSlab() {
    this.taxInvoice.verificationSlabs.push(_.clone(this.slab));
    this.slab = { gst: 0, igst: 0, cgst: 0, sgst: 0, tds: 0 };
  }

  removeGstSlab(slab) {
    this.taxInvoice.verificationSlabs = _.without(this.taxInvoice.verificationSlabs, slab);
  }

  saveGst() {
    var data: any = _.clone(this.taxInvoice);
    data.gst = _.sumBy(this.taxInvoice.verificationSlabs, 'gst');

    if (data.gst < this.taxInvoice.gst) {
      this.dialogs.msg("Invoice GST is greater than GST slabs total GST. Please check and correct.", "error")
      return;
    } else if (data.gst > this.taxInvoice.gst) {
      this.dialogs.msg("Invoice GST is lesser than GST slabs total GST. Please check and correct.", "error")
      return;
    }

    var slabs = this.taxInvoice.gstSlabs;
    var verifiedSlabs = 0;
    for (var i = 0; i < this.taxInvoice.verificationSlabs.length; i++) {
      var slab = this.taxInvoice.verificationSlabs[i];
      var currentSlab = _.find(slabs, { slab: parseInt(slab.slab) });
      if (currentSlab && currentSlab.gst == slab.gst) {
        verifiedSlabs++;
      } else {
        this.dialogs.msg("Posted GST slab is not matching with entered GST slab " + slab.slab + "%. Please check and correct.", "error")
        return;
      }
    }
    if (slabs.length != verifiedSlabs) {
      this.dialogs.msg("Posted GST slabs are mismatching with provided slabs. Please check and correct.", "error")
      return;
    }
    this.updateTaxInvoiceGstSlabs();
  }

  updateTaxInvoiceGstSlabs() {
    var self = this;
    console.log("updateTaxInvoiceGstSlabs :: taxInvoice : ", this.taxInvoice);
    _.each(this.taxInvoice.verificationSlabs, function(slab) {
      slab.isVerification = 1;
      slab.purchaseOrderInvoiceId = self.taxInvoice.id;
    })
    this.service.savePurchaseOrderInvoiceGsts({
      id: this.taxInvoice.id,
      gstVerificationStatus: 'Verified',
      gstFileId: this.taxInvoice.gstFileId,
      gstSlabs: this.taxInvoice.verificationSlabs
    }).pipe(take(1)).subscribe(res => {
      this.dialogs.success("Tax Invoice GST slabs for verification are submitted successfully..!!");
      this.resetList();
      this.openedModal.close();
    })
  }

  gstFile: any;
  gstFileChange(event) {
    this.gstFile = event.target.files[0];
  }
  gstUploadResponse: any = { status: '', message: '', filePath: '' };
  gstFileError: any;
  uploadTaxInvoiceGSTFile() {
    const formData = new FormData();
    formData.append('file', this.gstFile);

    this.loading = true;
    this.uploadService.upload(formData).subscribe(
      (res) => {
        this.gstUploadResponse = res;
        if (res.file) {
          this.loading = false;
          this.taxInvoice.gstFileId = res.id;
          this.taxInvoice.gstFile = res;
          this.gstFile = null;
        }
      },
      (err) => this.gstFileError = err
    );
  }

  viewPO(item) {
    window.open("#/purchases/purchaseorder/" + item.purchaseOrderId, '_blank');
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
