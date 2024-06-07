import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { ProductService } from 'src/app/shared/services/product.service';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { debounceTime,take } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HttpClient } from "@angular/common/http";

import { environment } from 'src/environments/environment';
import { CommonService } from 'src/app/shared/services/common.service';
import { DialogsService } from 'src/app/shared/services/dialogs.services';
import { AdminService } from 'src/app/shared/services/admin.service';
import { ReportsService } from 'src/app/shared/services/reports.service';
import * as _ from 'lodash';

declare let $: any;

@Component({
  selector: 'bookings-reports-inventory',
  templateUrl: './view.component.html'
})
export class BookingsAvailablityReportComponent implements OnInit, AfterViewInit {
  searchControl: FormControl = new FormControl();
  loading: any = false;
  cabinsLoading: any = false;
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
  cabins: any = [];
  selectedCabin: any;
  desks: any = [];
  selectedDesk: any;

  officesFilters: any = {};
  cabinsFilters: any = {};

  constructor(private dialogs: DialogsService, private service: AdminService, public reportsService: ReportsService) {
  }

  ngAfterViewInit() { }

  ngOnInit() {
    this.searchControl.valueChanges
      .pipe(debounceTime(200))
      .pipe(take(1)).subscribe(value => {
        this.officesFilters.search = value;
        this.loadBuildings();
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
    this.service.listLocations({ filters: { cityId: this.selectedCity.id, active: 1 }, offset: 0, limit: 100 }).pipe(take(1)).subscribe(
      res => {
        this.locations = res['data'];
        this.selectedLocation = {};
        // this.selectedLocation = res['data'][0];
        this.officesFilters = {
          countryId: this.selectedCountry.id,
          cityId: this.selectedCity.id,
          locationId: this.selectedLocation.id,
        }
        this.loadBuildings();
      });
  }

  loadBuildings() {
    this.loading = true;
    this.officesFilters.cabinId = null;
    this.reportsService.getAvailability(this.officesFilters).pipe(take(1)).subscribe(
      res => {
        var buildings = res['data'];
        _.each(buildings, function(o) {
          o.available = parseInt(o.available);
        })
        buildings = _.orderBy(buildings, ['name'], ['asc']);
        this.buildings = buildings;
        this.loading = false;
      }, error => {

      });
  }

  loadOffices(building) {
    this.loading = true;
    if (this.selectedBuilding && this.selectedBuilding.selected) {
      this.selectedBuilding.selected = false;
    }
    this.selectedBuilding = building;
    this.selectedBuilding.selected = true;
    this.officesFilters.buildingId = building.buildingId;
    this.officesFilters.officeId = null;
    this.officesFilters.cabinId = null;
    this.reportsService.getAvailability(this.officesFilters).pipe(take(1)).subscribe(
      res => {
        var offices = res['data'];
        _.each(offices, function(o) {
          o.available = parseInt(o.available);
        })
        offices = _.orderBy(offices, ['name'], ['asc']);
        this.offices = offices;
        this.loading = false;
      }, error => {

      });
  }

  loadCabins(office) {
    if (this.selectedOffice && this.selectedOffice.selected) {
      this.selectedOffice.selected = false;
    }
    this.selectedOffice = office;
    this.selectedOffice.selected = true;
    if (!this.selectedOffice.cabins) {
      this.cabinsLoading = true;
      this.officesFilters.cabinId = null;
      this.officesFilters.officeId = office.id;
      this.reportsService.getAvailability(this.officesFilters).pipe(take(1)).subscribe(
        res => {
          var cabins = res['data'];
          _.each(cabins, function(o) {
            o.available = parseInt(o.available);
          })
          cabins = _.orderBy(cabins, ['name'], ['asc']);
          this.selectedOffice.cabins = cabins;
          this.cabinsLoading = false;
          console.log("selected cabins :: ", this.selectedOffice.cabins)
        }, error => {

        });
    } else {
      this.officesFilters.officeId = office.id;
    }
  }

  loadDesks(cabin) {
    this.selectedCabin = cabin;
    if (!this.selectedCabin.clients) {
      this.cabinsLoading = true;
      this.officesFilters.cabinId = cabin.cabinId;
      this.reportsService.getAvailability(this.officesFilters).pipe(take(1)).subscribe(
        res => {
          var desks = res['data'];
          desks = _(desks)
            .groupBy(x => x.client)
            .map((value, key) => ({ client: key, bookingId: value[0]['bookingId'], desks: value }))
            .value();
          this.selectedCabin.clients = desks;
          this.cabinsLoading = false;
        }, error => {

        });
    }
  }

}
