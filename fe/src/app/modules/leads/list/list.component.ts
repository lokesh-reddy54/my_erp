import { Component, OnInit, ViewChild } from '@angular/core';
import { ProductService } from 'src/app/shared/services/product.service';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { debounceTime, take } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HttpClient } from "@angular/common/http";
import { DialogsService } from 'src/app/shared/services/dialogs.services';
import { DataLayerService } from 'src/app/shared/services/data-layer.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { LeadsService } from 'src/app/shared/services/leads.service';

import { Helpers } from '../../../helpers';
import * as _ from 'lodash';
import * as moment from 'moment';
import * as $ from 'jquery';

@Component({
  selector: 'leads-list',
  templateUrl: './list.component.html'
})
export class LeadsListComponent implements OnInit {
  searchControl: FormControl = new FormControl();
  lead: any = {};
  @ViewChild('list') list: any;
  @ViewChild('newLeadModal') newLeadModal: any;

  leadForm: FormGroup;

  items: any = [];
  selectedItem: any = {};
  loading: boolean = false;
  noResults: boolean = false;
  offset: number = 0;
  limit: number = 20;
  filter: any = {};
  deskTypes: any = [];
  leadSources: any = [];

  listObservable: Observable<any[]>;

  constructor(private dialogs: DialogsService, private service: LeadsService, private commonService: CommonService) { }

  ngOnInit() {
    this.deskTypes = this.commonService.values.deskTypes;
    this.leadSources = this.commonService.values.leadSources;
    this.searchControl.valueChanges
      .pipe(debounceTime(200))
      .pipe(take(1)).subscribe(value => {
        this.filter.search = value;
      });

    this.leadForm = new FormGroup({
      company: new FormControl("", Validators.required),
      name: new FormControl("", Validators.required),
      phone: new FormControl("", Validators.compose([
        Validators.required,
        Validators.pattern('^[6,7,8,9][0-9]{9}$')
      ])),
      email: new FormControl("", Validators.compose([
        Validators.required,
        Validators.email
      ])),
      source: new FormControl("", Validators.required),
      attribute: new FormControl("", Validators.required),
      desks: new FormControl("", Validators.required),
      deskType: new FormControl("", Validators.required),
      price: new FormControl("", Validators.required),
      date: new FormControl("", Validators.required),
      googlelocation: new FormControl("", Validators.required),
    });

    // this.newLead();
  }

  openedModal: any;
  newLead() {
    var self = this;
    this.openedModal = this.dialogs.modal(this.newLeadModal, { size: 'lg' });
    this.openedModal.result.then(function() {
      self.lead = {};
      self.loading = false;
      self.leadForm.reset();
    }).catch(function(e) {
      self.lead = {};
      self.loading = false;
      self.leadForm.reset();
    })
  }

  loadMore() {
    console.log("loadmore :: ");
    if (!this.loading) {
      this.loading = true;
      var data = { filters: this.filter, limit: this.limit, offset: this.offset };
      this.service.listLeads(data)
        .pipe(take(1)).subscribe((res) => {
          console.log("LeadList :: loadMore : res : ", res);
          if (res['data']) {
            this.items = this.items.concat(res['data']);
            this.loading = false;
            if (res['data'].length >= this.limit) {
              this.offset = this.offset + this.limit;
            }
          } else {
            this.dialogs.error(res['error'], "Error")
          }
        });
    }
  }

  getGooglePlaceAddress($event){
    console.log("getGooglePlaceAddress :: ", $event);
    this.lead.lat = $event.latitude;
    this.lead.lng = $event.longitude;
  }

  saveLead(){
    let self = this;
    this.loading = true;
    var lead = _.clone(this.lead);
    lead.startDate = moment(this.lead.date).toDate();
    lead.deskType = this.lead.deskType.type;
    lead.source = this.lead.source.source;
    lead.attribute = this.lead.attribute.attribute;
    lead.location = $("#googleplace").val();
    this.service.saveLead(lead).pipe(take(1)).subscribe(
      res => {
        self.dialogs.success("Lead '" + this.lead.companyName + "' saved successfully ");
        self.loading = false;
        this.openedModal.dismiss();
        self.resetList();
      },
      error => {
        self.dialogs.error(error, 'Error while saving')
      }
    )
  }

  resetList() {
    this.items = [];
    this.offset = 0;
    this.limit = 20;
    this.loadMore();
  }
}
