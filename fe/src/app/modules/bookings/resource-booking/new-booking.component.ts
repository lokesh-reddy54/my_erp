import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbTypeaheadConfig } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, map, tap, switchMap, filter } from 'rxjs/operators';
import { HttpClient } from "@angular/common/http";
import { NgImageSliderModule } from 'ng-image-slider';

import { CommonService } from 'src/app/shared/services/common.service';
import { AdminService } from 'src/app/shared/services/admin.service';
import { BookingsService } from 'src/app/shared/services/bookings.service';
import { Helpers } from '../../../helpers';
import { Utils } from 'src/app/shared/utils';
import { environment } from 'src/environments/environment';
import * as _ from 'lodash';
import * as moment from 'moment';

declare let lightGallery;

@Component({
  selector: 'resource-new-booking',
  templateUrl: './new-booking.component.html'
})
export class ResourceBookingComponent implements OnInit {
  searchControl: FormControl = new FormControl();
  form: FormGroup;
  resourceTypes: any = [];
  filter: any = {};
  countries: any = [];
  cities: any = [];
  locations: any = [];
  offices: any = [];
  resources: any = [];

  bookingId: any = null;
  officeId: any = null;
  locationId: any = null;
  resource: any = {};
  newResourceBooking: any = {};
  selectedCountry: any = {};
  selectedCity: any = {};
  selectedLocation: any = {};
  selectedOffice: any = {};
  loading: any = false;
  searching: any = false;
  inSameBuilding: any = false;
  clientSide: any = false;
  search: any = {};
  client: any = {};
  clientSearch: any;
  searchInput: any;

  typeAheadFormatter = (result: any) => result['company'] || result['name'];

  constructor(private ref: ChangeDetectorRef, public activeModal: NgbActiveModal, private service: BookingsService,
    private adminService: AdminService, private commonService: CommonService, private typeaheadConfig: NgbTypeaheadConfig) {
    // this.typeaheadConfig.showHint = true;
  }

  bookings: any = [];


  ngOnInit() {

    this.form = new FormGroup({
      name: new FormControl("", Validators.required),
      company: new FormControl("", Validators.required),
      phone: new FormControl("", Validators.compose([
        Validators.required,
        Validators.pattern('^[6,7,8,9][0-9]{9}$')
      ])),
      email: new FormControl("", Validators.compose([
        Validators.required,
        Validators.email
      ])),
      address: new FormControl(""),
      website: new FormControl(""),
      gstNo: new FormControl(""),
      panNo: new FormControl(""),
    });


    this.resourceTypes = this.commonService.values.resourceTypes;
    console.log("ResourceBookingCOmponent ::: searchResources :: bookingId : " + this.bookingId);

    this.adminService.listCountries({ filters: { active: 1 }, offset: 0, limit: 100 }).subscribe(
      res => {
        this.countries = res['data'];
        this.selectedCountry = res['data'][0] || {};
        this.onCountrySelected();
      });

    // this.searchResources();
    if (!this.client) {
      this.client = {};
    }
    if (this.bookingId) {
      // this.inSameBuilding = true;
    }

    if (this.bookingId instanceof Array) {
      this.bookings = _.clone(this.bookingId);
      this.bookingId = null;
    }

    if (!this.client.id) {
      this.clientSearch = (text$: Observable<string>) =>
        text$.pipe(
          debounceTime(300),
          distinctUntilChanged(),
          filter(term => term.length >= 3),
          tap(() => this.searching = true),
          switchMap(term =>
            this.service.listClients({ filters: { search: term } }).pipe(
              catchError(() => {
                return of([]);
              }))
          ),
          tap(() => this.searching = false)
        )
    } else {
      this.onClientChanged();
    }
  }

  validClient = false;
  onClientChanged() {
    var flag = true;
    if (!this.client.name || this.client.name == '') {
      flag = false;
    } else if (!this.client.company || this.client.company == '') {
      flag = false;
    } else if (!this.client.email || this.client.email == '') {
      flag = false;
    } else if (!this.client.phone || this.client.phone == '') {
      // flag = false; 
    }
    this.validClient = flag;
    if (flag) {
      this.search = { type: this.resourceTypes[0] };
    } else {
      this.search = {};
    }
  }

  clientSelected(event) {
    console.log("Client Selected :: event : ", event);
    this.client = event.item;
    this.onClientChanged();
  }

  onCountrySelected() {
    this.adminService.listCities({ filters: { countryId: this.selectedCountry.id, active: 1 }, offset: 0, limit: 100 }).subscribe(
      res => {
        this.cities = res['data'];
        this.selectedCity = {};
        this.selectedCity = res['data'][0] || {};
        this.onCitySelected();
      });
  }

  onCitySelected() {
    this.adminService.listLocations({ filters: { cityId: this.selectedCity.id, active: 1 }, offset: 0, limit: 100 }).subscribe(
      res => {
        this.locations = res['data'];
        this.selectedLocation = null;
        this.searchResources();
        // this.selectedLocation = res['data'][4] || {};
      });
  }

  onLocationSelected() {
    this.searchResources();
    // this.adminService.listOffices({ filters: { locationId: this.selectedLocation.id, active: 1 }, offset: 0, limit: 100 }).subscribe(
    //   res => {
    //     this.offices = res['data'];
    //     this.selectedOffice = {};
    //     // this.selectedLocation = res['data'][4] || {};
    //   });
  }

  searchResources() {
    if (this.search.forDate && this.search.bookingType=='Hourly') {
      var FromDate = Utils.ngbDateToMoment(this.search.forDate).format("YYYY-MM-DD");
      var ToDate = Utils.ngbDateToMoment(this.search.forDate).format("YYYY-MM-DD");
      var data: any = {
        type: this.search.type.type,
        style: this.search.style,
        subUnitType: this.search.subUnitType,
        subUnits: this.search.subUnits,
        facilities: this.search.facilities,
        officeId: this.inSameBuilding ? this.officeId : null,
        cityId: this.selectedCity ? this.selectedCity.id : null,
        locationId: this.selectedLocation ? this.selectedLocation.id : null,
        // date: date
        fromDate: FromDate,
        toDate: ToDate
      }
      this.service.searchResources(data).subscribe(res => {
        this.resources = res['data'];
        this.updateSlots();
      });
    }
    else if (this.search.forDate && this.search.toDate) {
      var FromDate = Utils.ngbDateToMoment(this.search.forDate).format("YYYY-MM-DD");
      var ToDate = Utils.ngbDateToMoment(this.search.toDate).format("YYYY-MM-DD");
      var data: any = {
        type: this.search.type.type,
        style: this.search.style,
        subUnitType: this.search.subUnitType,
        subUnits: this.search.subUnits,
        facilities: this.search.facilities,
        officeId: this.inSameBuilding ? this.officeId : null,
        cityId: this.selectedCity ? this.selectedCity.id : null,
        locationId: this.selectedLocation ? this.selectedLocation.id : null,
        // date: date
        fromDate: FromDate,
        toDate: ToDate
      }
      this.service.searchResources(data).subscribe(res => {
        this.resources = res['data'];
        this.updateSlots();
      });
    }
  }

  updateSlots() {
    // this.resource.startTime = "2019-05-22 12:00:00";
    // this.resource.duration = "60";
    this.selectedResource.amount = null;
    if (this.search.duration || this.search.bookingType != 'Hourly') {
      var date = Utils.ngbDateToMoment(this.search.forDate).format("YYYY-MM-DD");
      if(this.search.bookingType != 'Hourly'){
        var toDate = Utils.ngbDateToMoment(this.search.toDate).format("YYYY-MM-DD");
      }

      var from = moment(date + " " + this.search.startTime);
      var to = moment(date + " " + this.search.startTime).add(this.search.duration, 'minutes');
      var bookingType = this.search.bookingType;

      if(bookingType != 'Hourly'){
        from = moment(date + " " + '00:00');
        to = moment(toDate + " " + '23:59');
        console.log("Booking for days is running :: ", from, to)
      }
      var self = this;
      var dayStart = from.clone().startOf('day');
      var startTime = from.clone().diff(dayStart, "minutes");
      var endTime = to.clone().diff(dayStart, "minutes");

      _.each(this.resources, function(r) {
        console.log("_from ::", startTime, "_to :: ", endTime)
        var slots = [];
        var lastSlot = "00:00";
        _.each(r.slots, function(s) {
          var _from = moment(date + " " + s.from).diff(dayStart, "minutes");
          var _to = moment(date + " " + s.to).diff(dayStart, "minutes");
          if ((_from <= startTime && _to > startTime) && (_from <= endTime && _to > endTime)) {
            console.log("COKJKGGIAG---00000.00", s)
            if (s.available) {
              console.log("COKJKGGIAG---00000", s)
              slots.push({ from: s.from, to: from.format("YYYY-MM-DD HH:mm"), available: 1 });
              slots.push({ from: from.clone().format("YYYY-MM-DD HH:mm"), to: to.format("YYYY-MM-DD HH:mm"), current: 1 });
              slots.push({ from: to.clone().format("YYYY-MM-DD HH:mm"), to: s.to, available: 1 });
            
              // slots.push({ from: from.clone().add(1, 'minutes').format("HH:mm"), to: to.format("HH:mm"), current: 1 });
              // slots.push({ from: to.clone().add(1, 'minutes').format("HH:mm"), to: s.to, available: 1 });
            } else {
              console.log("COKJKGGIAG---00001", s)
              slots.push(s);
            }
          } else {
            console.log("COKJKGGIAG---00002", s)
            if(bookingType != 'Hourly' && s.available==1 && s.from=='00:00' && s.to=='23:59'){
              slots.push({ from: from.format("YYYY-MM-DD HH:mm"), to: to.format("YYYY-MM-DD HH:mm"), current: 1 });
            }
            else {slots.push(s);}
          }
        })
        r.nslots = slots;
      })
    } else {
      _.each(this.resources, function(r) {
        r.nslots = r.slots;
      });
    }
  }

  selectedSlot;
  selectedResource: any = {};
  selectSlot(slot, resource) {
    console.log("selectSlot :: slot ::", slot)
    console.log("selectSlot :: resource ::", resource)
    
    if (this.selectedSlot) {
      this.selectedSlot.selected = false;
    }
    this.selectedSlot = slot;
    this.selectedSlot.selected = true;
    this.selectedResource.resourceType = this.search.type.type;
    this.selectedResource.name = resource.name + " " + this.search.type.name + ", " + resource.office;
    this.selectedResource.resourceId = resource.resourceId;
    this.selectedResource.officeId = resource.officeId;
    // this.search.startTime = moment(date + " " + slot.from).toDate();
    var evt = this.search.forDate;
    var date = this.search.forDate ? moment(evt.year + "-" + (evt.month) + "-" + evt.day).format("YYYY-MM-DD") : "2019-05-22";
    this.selectedResource.from = moment(slot.from).format("YYYY-MM-DD HH:mm");
    this.selectedResource.to = moment(slot.to).format("YYYY-MM-DD HH:mm");
    this.selectedResource.status = "Pending";
    if (!this.search.duration) {
      this.search.duration = 60;
    }
    var price = (resource.price / 60) * this.search.duration;
    this.selectedResource.amount = Math.round(price);
    this.selectedResource.clientId = this.client.id;
    this.client.phone = this.client.phone ? this.client.phone : this.searchInput;
    this.selectedResource.client = this.client;
    this.selectedResource.parentBookingId = this.bookingId || (this.client ? this.client.booking.id : null);

    console.log("this.selectedResource :: this.selectedResource :: ", this.selectedResource)
  }

  save() {
    this.loading = true;
    console.log("Save :: this.selectedResource :: ", this.selectedResource)
    this.service.createResourceBooking(this.selectedResource).subscribe(
      res => {
        console.log("createBooking :: res data : ", res['data']);
        this.newResourceBooking = res['data'];
        this.newResourceBooking.client = this.client;
        this.activeModal.close(this.newResourceBooking);
        this.loading = false;
      }, error => {

      });
  }
}
