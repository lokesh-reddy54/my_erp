import { Component, OnInit, ViewChild } from '@angular/core';
import { ProductService } from 'src/app/shared/services/product.service';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { debounceTime, take } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HttpClient } from "@angular/common/http";
import { DialogsService } from 'src/app/shared/services/dialogs.services';
import { PurchasesService } from 'src/app/shared/services/purchases.service';
import { Helpers } from '../../../helpers';
import { Utils } from 'src/app/shared/utils';
import * as _ from 'lodash';

@Component({
  selector: 'purchases-compliance-terms',
  templateUrl: './view.component.html'
})
export class PurchasesComplianceTermsComponent implements OnInit {
  form: FormGroup;

  items: any = [];
  selectedItem: any = {};
  loading: boolean = false;
  noResults: boolean = false;
  offset: number = 0;
  limit: number = 20;

  @ViewChild('gstTermsModal') gstTermsModal: any;
  @ViewChild('tdsTermsModal') tdsTermsModal: any;

  constructor(private dialogs: DialogsService, private service: PurchasesService) { }

  years: any = [{ label: '2020-21', year: 2020 }, { label: '2021-22', year: 2021 }, { label: '2022-23', year: 2022 }];
  currentTdsYear: any;
  currentGstYear: any;
  tdsComplianceTerms: any = [];
  gstComplianceTerms: any = [];

  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl("", Validators.required),
      dateFrom: new FormControl("", Validators.required),
      dateTo: new FormControl("", Validators.required),
      dueDate: new FormControl("", Validators.required),
    });

    this.currentTdsYear = this.years[0];
    this.currentGstYear = this.years[0];
    this.listVendorTdsComplianceTerms();
    this.listVendorGstComplianceTerms();
  }

  listVendorTdsComplianceTerms() {
    this.service.listVendorTdsComplianceTerms({ year: this.currentTdsYear.year }).pipe(take(1))
      .subscribe(res => {
        if (res['data']) {
          this.tdsComplianceTerms = res['data'];
        }
      })
  }
  listVendorGstComplianceTerms() {
    this.service.listVendorGstComplianceTerms({ year: this.currentGstYear.year }).pipe(take(1))
      .subscribe(res => {
        if (res['data']) {
          this.gstComplianceTerms = res['data'];
        }
      })
  }

  openedModal: any;
  updatingGstTerms: any = [];
  gstTerm: any = {};
  updateGstTerms() {
    this.updatingGstTerms = _.clone(this.gstComplianceTerms);
    this.openedModal = this.dialogs.modal(this.gstTermsModal, { size: 'lg', backdrop: 'static' });
  }

  updatingTdsTerms: any = [];
  tdsTerm: any = {};
  updateTdsTerms() {
    this.updatingTdsTerms = _.clone(this.tdsComplianceTerms);
    this.openedModal = this.dialogs.modal(this.tdsTermsModal, { size: 'lg', backdrop: 'static' });
  }

  addGstTerm() {
    var term: any = {};
    term.term = _.clone(this.gstTerm.term);
    term.dateFrom = Utils.ngbDateToMoment(this.gstTerm.dateFrom).format("YYYY-MM-DD");
    term.dateTo = Utils.ngbDateToMoment(this.gstTerm.dateTo).format("YYYY-MM-DD");
    term.dueDate = Utils.ngbDateToMoment(this.gstTerm.dueDate).format("YYYY-MM-DD");
    this.updatingGstTerms.push(term);
    this.gstTerm = {};
    this.form.reset();
  }
  removeGstTerm(term) {
    this.updatingGstTerms = _.reject(this.updatingGstTerms, { term: term.term });
  }

  saveGstTerms() {
    console.log("ComplianceTermsComponent ::: save :: updatingGstTerms ", this.updatingGstTerms);
    this.loading = true;
    let self = this;
    this.service.saveGstComplianceTerm({ year: this.currentGstYear.year, terms: this.updatingGstTerms }).pipe(take(1)).subscribe(
      res => {
        self.dialogs.success("GST Terms for " + this.currentGstYear.label + " is saved.");
        this.listVendorGstComplianceTerms();
        this.openedModal.close();
        this.gstTerm = {};
        this.loading = false;
      },
      error => {
        self.dialogs.error(error, 'Error while saving')
      }
    )
  }

  addTdsTerm() {
    var term: any = {};
    term.term = _.clone(this.tdsTerm.term);
    term.dateFrom = Utils.ngbDateToMoment(this.tdsTerm.dateFrom).format("YYYY-MM-DD");
    term.dateTo = Utils.ngbDateToMoment(this.tdsTerm.dateTo).format("YYYY-MM-DD");
    term.dueDate = Utils.ngbDateToMoment(this.tdsTerm.dueDate).format("YYYY-MM-DD");
    this.updatingTdsTerms.push(term);
    this.tdsTerm = {};
    this.form.reset();
  }
  removeTdsTerm(term) {
    this.updatingTdsTerms = _.reject(this.updatingTdsTerms, { term: term.term });
  }

  saveTdsTerms() {
    console.log("ComplianceTermsComponent ::: save :: updatingTdsTerms ", this.updatingTdsTerms);
    this.loading = true;
    let self = this;
    this.service.saveTdsComplianceTerm({ year: this.currentTdsYear.year, terms: this.updatingTdsTerms }).pipe(take(1)).subscribe(
      res => {
        self.dialogs.success("TDS Terms for " + this.currentTdsYear.label + " is saved.");
        this.listVendorTdsComplianceTerms();
        this.openedModal.close();
        this.gstTerm = {};
        this.loading = false;
      },
      error => {
        self.dialogs.error(error, 'Error while saving')
      }
    )
  }

}
