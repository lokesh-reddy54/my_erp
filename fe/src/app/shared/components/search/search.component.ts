import { Component, OnInit } from '@angular/core';
import { DataLayerService } from '../../services/data-layer.service';
import { Observable, combineLatest } from 'rxjs';
import { CanActivate, Router } from '@angular/router';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { startWith, debounceTime, switchMap, map } from 'rxjs/operators';
import { SharedAnimations } from '../../animations/shared-animations';
import { SearchService } from '../../services/search.service';
import { CommonService } from '../../services/common.service';
import { LeadsService } from '../../services/leads.service';
import { DialogsService } from '../../services/dialogs.services';

import * as _ from 'lodash';
import * as moment from 'moment';
import * as $ from 'jquery';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  animations: [SharedAnimations]
})
export class SearchComponent implements OnInit {
  results$: Observable<any[]>;
  searchControl: FormControl = new FormControl('');
  searchResult: any;
  booking: any = {}
  lead: any = {}
  loading: any = false;
  leadForm: FormGroup;
  deskTypes: any = [];
  leadSources: any = [];
  user: any = {};

  constructor(public searchService: SearchService, private commonService: CommonService,
    private leadsService: LeadsService, private dialogs: DialogsService, private router: Router) {
    this.user = JSON.parse(localStorage.getItem("cwo_user"));
  }

  ngOnInit() {
    this.deskTypes = this.commonService.values.deskTypes;
    this.leadSources = this.commonService.values.leadSources;
    console.log("SearchComponent :: onInit : ", this.searchService.callData);
    var self = this;

    if (!this.searchService.callData || !this.searchService.callData.from) {
      this.searchControl.valueChanges
        .pipe(debounceTime(200))
        .subscribe(value => {
          this.loading = true;
          this.globalSearch(value);
        });
    } else {
      setTimeout(function() {
        self.globalSearch(self.searchService.callData.from);
      }, 1000);
    }

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
  }

  close() {
    this.searchControl.setValue(null);
    this.searchService.callData = null;
    this.searchService.searchOpen = false;
  }

  globalSearch(search) {
    if (search && search != "") {
      this.searchService.globalSearch(search)
        .subscribe(
          res => {
            if (res['data']) {
              this.searchResult = res['data'];
              this.booking = this.searchResult.booking || {};
              this.lead = this.searchResult.lead || {};
              this.loading = false;
            }
          })
    } else {
      this.loading = false;
      this.searchResult = {};
    }
  }


  getGooglePlaceAddress($event) {
    console.log("getGooglePlaceAddress :: ", $event);
    this.lead.lat = $event.latitude;
    this.lead.lng = $event.longitude;
  }

  saveLead() {
    let self = this;
    this.loading = true;
    var lead = _.clone(this.lead);
    lead.startDate = moment(this.lead.date).toDate();
    lead.deskType = this.lead.deskType.type;
    lead.source = this.lead.source.source;
    lead.attribute = this.lead.attribute.attribute;
    lead.location = $("#googleplace").val();
    this.leadsService.saveLead(lead).subscribe(
      res => {
        self.loading = false;
        if (res['data']) {
          console.log("NewLead ::: ", res['data']);
          self.dialogs.success("Lead '" + this.lead.company + "' saved successfully ");
          this.leadForm.reset();
          this.router.navigateByUrl('/leads/view/' + res['data']['id']);
          this.searchService.searchOpen = false;
        } else {
          self.dialogs.error(res['error']);
        }
      },
      error => {
        self.dialogs.error(error, 'Error while saving')
      }
    )
  }


}
