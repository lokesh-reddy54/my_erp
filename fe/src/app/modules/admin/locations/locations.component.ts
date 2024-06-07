import { Component, OnInit, ViewChild } from '@angular/core';
import { ProductService } from 'src/app/shared/services/product.service';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { debounceTime, take } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HttpClient } from "@angular/common/http";
import { DialogsService } from 'src/app/shared/services/dialogs.services';
import { AdminService } from 'src/app/shared/services/admin.service';
import { Helpers } from '../../../helpers';
import * as _ from 'lodash';

@Component({
  selector: 'admin-locations',
  templateUrl: './locations.component.html'
})
export class AdminLocationsComponent implements OnInit {
  citySearch: FormControl = new FormControl();
  locationSearch: FormControl = new FormControl();
  form: FormGroup;
  countryForm: FormGroup;
  locationForm: FormGroup;

  selectedCountry: any;
  selectedCity: any;
  country: any = {};
  city: any = {};
  location: any = {};
  roles: any = ['Admin', 'BookingExecutive', 'SupportExecutive', 'SalesExecutive', 'OperationsExecutive', 'AccountsExecutive'];
  countryConfig: any = {};
  cityConfig: any = {};
  locationConfig: any = {};
  @ViewChild('countryModal') countryModal: any;
  @ViewChild('cityModal') cityModal: any;
  @ViewChild('locationModal') locationModal: any;
  @ViewChild('countryList') countryList: any;
  @ViewChild('cityList') cityList: any;
  @ViewChild('locationList') locationList: any;

  items: any = [];
  selectedItem: any = {};
  loading: boolean = false;
  noResults: boolean = false;
  offset: number = 0;
  limit: number = 20;
  countryFilters: any = {};
  cityFilters: any = {};
  locationFilters: any = {};

  locationsObservable: Observable<any[]>;

  constructor(private dialogs: DialogsService, private service: AdminService) { }

  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl("", Validators.required),
    });
    this.countryForm = new FormGroup({
      name: new FormControl("", Validators.required),
    });
    this.locationForm = new FormGroup({
      name: new FormControl("", Validators.required),
      lat: new FormControl(""),
      lng: new FormControl(""),
    });

    this.citySearch.valueChanges
      .pipe(debounceTime(200))
      .pipe(take(1)).subscribe(value => {
        this.cityFilters.search = value;
      });
    this.locationSearch.valueChanges
      .pipe(debounceTime(200))
      .pipe(take(1)).subscribe(value => {
        this.locationFilters.search = value;
      });

    this.countryConfig = {
      columns: [
        { label: 'Name', field: 'name', type: 'text', styleClass: 'w-50', sortable: true },
        // { label: 'Cities', field: 'citiec', type: 'text', styleClass: 'w-10'},
        { label: 'Active', field: 'active', type: 'boolean', styleClass: 'w-5' },
      ],
      actions: [
        { icon: 'i-Blinklist', hint: 'Select', code: 'listCities', style: 'primary' },
        { icon: 'i-Pen-5', hint: 'Edit', code: 'editCountry', style: 'info' }
      ],
      options: {
        debounceDelay: 500,
        actionStyleClass: 'w-25 icons-td',
      }
    }
    this.cityConfig = {
      columns: [
        { label: 'Name', field: 'name', type: 'text', styleClass: 'w-50', sortable: true },
        // { label: 'Locations', field: 'locationc', type: 'text', styleClass: 'w-10'},
        { label: 'Active', field: 'active', type: 'boolean', styleClass: 'w-5' },
      ],
      actions: [
        { icon: 'i-Blinklist', hint: 'Select', code: 'listLocations', style: 'primary' },
        { icon: 'i-Pen-5', hint: 'Edit', code: 'editCity', style: 'info' }
      ],
      options: {
        debounceDelay: 500,
        actionStyleClass: 'w-25 icons-td',
      }
    }
    this.locationConfig = {
      columns: [
        { label: 'Name', field: 'name', type: 'text', styleClass: 'w-40', sortable: true },
        { label: 'Latitude', field: 'lat', type: 'text', styleClass: 'w-20', sortable: true },
        { label: 'Longitude', field: 'lng', type: 'text', styleClass: 'w-20', sortable: true },
        { label: 'Active', field: 'active', type: 'boolean', styleClass: 'w-5' },
      ],
      actions: [
        { icon: 'i-Pen-5', hint: 'Edit', code: 'editLocation', style: 'info' }
      ],
      options: {
        debounceDelay: 500,
        actionStyleClass: 'w-10 icons-td',
      }
    }
  }

  openedModal: any;
  openCountryModal() {
    this.loading = false;
    this.openedModal = this.dialogs.modal(this.countryModal, { size: 'md', backdrop: 'static' });
    var self = this;
    this.openedModal.result.then(function() {
      self.country = {};
    }).catch(function(e) {
      self.country = {};
    })
  }
  openCityModal() {
    this.loading = false;
    this.openedModal = this.dialogs.modal(this.cityModal, { size: 'md', backdrop: 'static' });
    var self = this;
    this.openedModal.result.then(function() {
      self.city = {};
    }).catch(function(e) {
      self.city = {};
    })
  }
  openLocationModal() {
    this.loading = false;
    this.openedModal = this.dialogs.modal(this.locationModal, { size: 'md', backdrop: 'static' });
    var self = this;
    this.openedModal.result.then(function() {
      self.location = {};
    }).catch(function(e) {
      self.location = {};
    })
  }

  saveCountry() {
    console.log("LocationsComponent ::: save :: country ", this.country);
    this.loading = true;
    let self = this;
    this.service.saveCountry(this.country).pipe(take(1)).subscribe(
      res => {
        self.dialogs.success("Location '" + this.country.name + "' is saved successfully ");
        this.loading = false;
        self.countryList.reset();
        this.openedModal.close();
      },
      error => {
        self.dialogs.error(error, 'Error while saving')
      }
    )
  }
  saveCity() {
    console.log("LocationsComponent ::: save :: city ", this.city);
    this.loading = true;
    let self = this;
    this.city.countryId = this.selectedCountry.id;
    this.service.saveCity(this.city).pipe(take(1)).subscribe(
      res => {
        self.dialogs.success("Location '" + this.city.name + "' is saved successfully ");
        this.loading = false;
        self.cityList.reset();
        this.openedModal.close();
      },
      error => {
        self.dialogs.error(error, 'Error while saving')
      }
    )
  }

  saveLocation() {
    console.log("LocationsComponent ::: save :: location ", this.location);
    this.loading = true;
    let self = this;
    this.location.cityId = this.selectedCity.id;
    this.service.saveLocation(this.location).pipe(take(1)).subscribe(
      res => {
        self.dialogs.success("Location '" + this.location.name + "' is saved successfully ");
        this.loading = false;
        self.locationList.reset();
        this.openedModal.close();
      },
      error => {
        self.dialogs.error(error, 'Error while saving')
      }
    )
  }

  action(event) {
    console.log("LocationsComponent ::: action :: event ", event);
    if (event.action == 'editCountry') {
      this.country = _.clone(event.item);
      this.openCountryModal();
    } else if (event.action == 'listCities') {
      if (this.selectedCountry) {
        this.selectedCountry.selected = false;
      }
      this.selectedCountry = event.item;
      event.item.selected = true;
      this.locationFilters = {};
      this.cityFilters.countryId = event.item.id;
    } else if (event.action == 'editCity') {
      this.city = _.clone(event.item);
      this.openCityModal();
    } else if (event.action == 'listLocations') {
      if (this.selectedCity) {
        this.selectedCity.selected = false;
      }
      this.selectedCity = event.item;
      event.item.selected = true;
      this.locationFilters.cityId = event.item.id;
    } else if (event.action == 'editLocation') {
      this.location = _.clone(event.item);
      this.openLocationModal();
    }
  }


}
