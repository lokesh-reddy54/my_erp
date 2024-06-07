import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { ProductService } from 'src/app/shared/services/product.service';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from "@angular/common/http";
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, take } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import { CommonService } from 'src/app/shared/services/common.service';
import { DialogsService } from 'src/app/shared/services/dialogs.services';
import { AdminService } from 'src/app/shared/services/admin.service';
import { ReportsService } from 'src/app/shared/services/reports.service';
import * as _ from 'lodash';

declare let $: any;

@Component({
  selector: 'accounts-reports-ar',
  templateUrl: './view.component.html'
})
export class AccountsARReportComponent implements OnInit, AfterViewInit {
  searchControl: FormControl = new FormControl();
  commentsSearchControl: FormControl = new FormControl();
  loading: any = false;
  countries: any = [];
  selectedCountry: any;
  cities: any = [];
  selectedCity: any;
  locations: any = [];
  selectedLocation: any;
  buildings: any = [];
  selectedBuilding: any;
  offices: any = [];
  selectedOffice: any;
  totalDue: any = 0;

  officesFilters: any = {};
  commentsConfig: any = {};
  commentsFilter: any = {};
  commentForm: FormGroup;
  @ViewChild('commentsModal') commentsModal: any;

  constructor(private dialogs: DialogsService, private service: AdminService, public reportsService: ReportsService) {
  }

  ngAfterViewInit() { }

  ngOnInit() {
    this.commentForm = new FormGroup({
      comments: new FormControl("", Validators.required)
    });

    this.searchControl.valueChanges
      .pipe(debounceTime(200))
      .pipe(take(1)).subscribe(value => {
        this.officesFilters.search = value;
        this.loadBuildings();
      });

    this.commentsSearchUpdate.pipe(
      debounceTime(500),
      distinctUntilChanged())
      .pipe(take(1)).subscribe(value => {
        console.log("commentsSearchUpdate :: value:" + value);
        this.listARComments(value);
      });

    this.service.listCountries({ filters: { active: 1 }, offset: 0, limit: 100 }).pipe(take(1)).subscribe(
      res => {
        this.countries = res['data'];
        this.selectedCountry = res['data'][0];
        this.officesFilters = {
          countryId: this.selectedCountry.id
        }
        this.onCountrySelected();
      });
  }

  onCountrySelected() {
    this.service.listCities({ filters: { countryId: this.selectedCountry.id, active: 1 }, offset: 0, limit: 100 }).pipe(take(1)).subscribe(
      res => {
        this.cities = res['data'];
        this.selectedCity = null;
        this.selectedLocation = null;
        // this.selectedCity = res['data'][0];
        this.officesFilters = {
          countryId: this.selectedCountry.id
        }
        this.loadBuildings();
      });
  }
  onCitySelected() {
    this.service.listLocations({ filters: { cityId: this.selectedCity.id, active: 1 }, offset: 0, limit: 100 }).pipe(take(1)).subscribe(
      res => {
        this.locations = res['data'];
        this.selectedLocation = null;
        // this.selectedLocation = res['data'][0];
        this.officesFilters = {
          countryId: this.selectedCountry.id,
          cityId: this.selectedCity.id,
        }
        this.loadBuildings();
      });
  }
  onLocationSelected() {
    this.officesFilters = {
      countryId: this.selectedCountry.id,
      cityId: this.selectedCity.id,
      locationId: this.selectedLocation.id
    }
    this.loadBuildings();
  }

  loadBuildings() {
    var user: any = localStorage.getItem('cwo_user');
    if (user && user != '') {
      user = JSON.parse(user);
      if (user.geoTags) {
        if (user.geoTags.buildingIds && user.geoTags.buildingIds.length) {
          this.officesFilters.buildingIds = user.geoTags.buildingIds;
        } else if (user.geoTags.locationIds && user.geoTags.locationIds.length) {
          this.officesFilters.locationIds = user.geoTags.locationIds;
        } else if (user.geoTags.cityIds && user.geoTags.cityIds.length) {
          this.officesFilters.cityIds = user.geoTags.cityIds;
        }
      }
    }
    this.reportsService.getAR(this.officesFilters).pipe(take(1)).subscribe(
      res => {
        var buildings = res['data'];
        _.each(buildings, function(o) {
          o.due = parseInt(o.due);
        })
        this.totalDue = _.sumBy(buildings, 'due');
        buildings = _.orderBy(buildings, ['name'], ['asc']);
        this.buildings = buildings;
      }, error => {

      });
  }

  loadOffices(building) {
    if (this.selectedBuilding && this.selectedBuilding.selected) {
      this.selectedBuilding.selected = false;
    }
    this.selectedBuilding = building;
    this.selectedBuilding.selected = true;
    this.officesFilters.buildingId = building.buildingId;
    this.officesFilters.officeId = null;
    this.reportsService.getAR(this.officesFilters).pipe(take(1)).subscribe(
      res => {
        var offices = res['data'];
        _.each(offices, function(o) {
          o.due = parseInt(o.due);
        })
        offices = _.orderBy(offices, ['name'], ['asc']);
        this.offices = offices;
      }, error => {

      });
  }

  loadBookings(office) {
    if (this.selectedOffice && this.selectedOffice.selected) {
      this.selectedOffice.selected = false;
    }
    this.selectedOffice = office;
    this.selectedOffice.selected = true;
    if (!this.selectedOffice.bookings) {
      this.officesFilters.officeId = office.officeId;
      this.loading = true;
      this.reportsService.getAR(this.officesFilters).pipe(take(1)).subscribe(
        res => {
          var bookings = res['data'];
          _.each(bookings, function(o) {
            o.due = parseInt(o.due);
          })
          bookings = _.orderBy(bookings, ['name'], ['asc']);
          this.selectedOffice.bookings = bookings;
          console.log("selected bookings :: ", this.selectedOffice.bookings)
          this.loading = false;
        }, error => {

        });
    }
  }

  openedModal: any;
  comment: any = {};
  openARComments(booking?) {
    console.log("openARComments : called ");
    if (booking) {
      this.comment.bookingId = booking.bookingId;
      this.comment.amount = booking.due;
      this.commentsFilter.bookingId = booking.bookingId;
    }
    this.commentsOffset = 0;
    this.comments = [];
    this.listARComments();
    this.openedModal = this.dialogs.modal(this.commentsModal, { size: 'lg' });
    var self = this;
    this.openedModal.result.then(function() {
      self.comment = {};
      self.commentsFilter = {};
    }).catch(function(e) {
      self.comment = {};
      self.commentsFilter = {};
    })
  }

  commentsOffset: any = 0;
  comments: any = [];
  commentsSearch: any;
  commentsSearchUpdate = new Subject<string>();
  listARComments(value?) {
    console.log("listARComments : called ");
    if (value) {
      console.log("comments search control :: value : " + value);
      this.commentsFilter.search = value;
      this.commentsOffset = 0;
      this.comments = [];
    }
    this.loading = true;
    this.reportsService.listArCallHistory({
      filters: this.commentsFilter,
      offset: this.commentsOffset,
      limit: 20
    }).pipe(take(1)).subscribe(
      res => {
        this.loading = false;
        if (res['data'].length) {
          this.commentsOffset = this.commentsOffset + 20;
          this.comments = this.comments.concat(res['data']);
        }
      },
      error => {
        this.dialogs.error(error, 'Error while saving')
      }
    )
  }

  saveComment() {
    let self = this;
    this.loading = true;
    var comment = _.clone(this.comment);
    this.reportsService.saveArCallHistory(comment).pipe(take(1)).subscribe(
      res => {
        self.dialogs.success("Payment is saved successfully ");
        self.loading = false;
        this.commentForm.reset();
        this.commentsOffset = 0;
        this.comments = [];
        this.listARComments();
      },
      error => {
        self.dialogs.error(error, 'Error while saving')
      }
    )
  }


}
