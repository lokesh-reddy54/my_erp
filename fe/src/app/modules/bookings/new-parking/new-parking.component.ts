import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { ProductService } from 'src/app/shared/services/product.service';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, take, map, tap, switchMap, filter } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

import { Utils } from 'src/app/shared/utils';
import { CommonService } from 'src/app/shared/services/common.service';
import { AdminService } from 'src/app/shared/services/admin.service';
import { BookingsService } from 'src/app/shared/services/bookings.service';
import * as _ from 'lodash';
import * as moment from "moment";

@Component({
  selector: 'app-new-parking',
  styles: ['agm-map { height: 300px;}'],
  templateUrl: './new-parking.component.html'
})
export class ParkingComponent implements OnInit {
  searchControl: FormControl = new FormControl();
  form: FormGroup;
  deskTypes: any = [];
  filter: any = {};
  countries: any = [];
  cities: any = [];
  locations: any = [];
  buildings: any = [];
  offices: any = [];

  newBooking: any = {};
  booking: any = {
    // desks: 1,
    // startDate: new Date(),
  };
  client: any = {};
  contract: any = {
    // type: "HotDesk",
    status: 'Draft',
    term: 'LongTerm',
    discount: 0
  };
  selectedCountry: any;
  selectedCity: any;
  selectedLocation: any;
  selectedBuilding: any;
  selectedOfficeId: any;
  selectedDeskType: any;
  selectedOfficeType: any;
  selectedOfficeServices: any = [];
  loading: any = false;
  searching: any = false;
  clientSearch: any;

  typeAheadFormatter = (result: any) => result['company'] || result['name'];
  description: any;

  constructor(private ref: ChangeDetectorRef, public activeModal: NgbActiveModal, private commonService: CommonService,
    private service: BookingsService, private adminService: AdminService, private toastr: ToastrService) {
    this.deskTypes = this.commonService.values.deskTypes
  }

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
      security: new FormControl("", Validators.required),
      token: new FormControl("", Validators.required),
      lockin: new FormControl("", Validators.required),
      lockinPenaltyType: new FormControl("", Validators.required),
      lockInPenalty: new FormControl("", Validators.required),
      noticePeriod: new FormControl("", Validators.required),
      noticePeriodViolationType: new FormControl("", Validators.required),
      noticePeriodViolation: new FormControl("", Validators.required),
    });

    this.searchControl.valueChanges
      .pipe(debounceTime(200))
      .pipe(take(1)).subscribe(value => {
        this.filter.search = value;
      });

    this.adminService.listCountries({ filters: { active: 1 }, offset: 0, limit: 100 }).pipe(take(1)).subscribe(
      res => {
        this.countries = res['data'];
        this.selectedCountry = res['data'][0] || {};
        this.onCountrySelected();
      });

    // this.searchParking();
    console.log("NewBookingComponenet ::: contract : ", this.contract);
    console.log("NewBookingComponenet ::: client : ", this.client);
    this.totalBookingPrice = this.contract.rent;

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
  }

  onCountrySelected() {
    if (this.selectedCountry) {
      this.adminService.listCities({ filters: { countryId: this.selectedCountry.id, active: 1 }, offset: 0, limit: 100 }).pipe(take(1)).subscribe(
        res => {
          this.cities = res['data'];
          this.selectedCity = null;
          // this.selectedCity = res['data'][0] || {};
        });
    } else {
      this.selectedCity = null;
    }
    this.offices = [];
  }

  onCitySelected() {
    if (this.selectedCity) {
      this.adminService.listLocations({ filters: { cityId: this.selectedCity.id, active: 1 }, offset: 0, limit: 100 }).pipe(take(1)).subscribe(
        res => {
          this.locations = res['data'];
          this.selectedLocation = null;
          // this.selectedLocation = res['data'][4] || {};

          this.searchParking();
        });
    } else {
      this.selectedLocation = null;
    }
    this.offices = [];
  }

  contractType: any = {};
  minDate: any;
  searchParking() {
    this.buildings = [];
    this.offices = [];
    this.selectedBuilding = null;
    var minDate = moment(Utils.ngbDateToDate(this.booking.startDate)).toDate();
    this.minDate = Utils.dateToNgbDate(minDate);
    this.totalBookingPrice = 0;
    if (!this.selectedCity) {
      return;
    }
    var deskTypes = [this.selectedDeskType.type];
    // if (this.contract.type == "HotDesk") {
    //   deskTypes = ["HotDesk", "FixedDesk"];
    // } else if (this.contract.type == "FixedDesk") {
    //   deskTypes = ["FixedDesk", "PrivateOffice"];
    // } else if (this.contract.type == "PrivateOffice") {
    //   deskTypes = ["PrivateOffice", "ManagedOffice"];
    // }
    var data = {
      "cityId": this.selectedCity && this.selectedCity.id,
      "locationId": this.selectedLocation && this.selectedLocation.id,
      "officeId": this.selectedOfficeId,
      "deskTypes": deskTypes,
      "isPrivate": this.contract.isPrivate,
      "startDate": Utils.ngbDateToDate(this.booking.startDate),
      "desks": this.booking.desks || 1,
      "hideSold": false
    }
    this.loading = true;
    this.service.searchParking(data).pipe(take(1)).subscribe(
      res => {
        console.log("searchParking :: offices : ", res['data']);
        if (res['data']) {
          this.buildings = res['data'];
          this.renderMap();

          console.log(" Parking Buildings ::: ",this.buildings)
        }
        this.loading = false;
      }, error => {

      });
  }

  updateInclusions() {
    if (this.selectedOfficeType && this.selectedOfficeType.inclusions && this.selectedOfficeType.inclusions.length) {
      var officeServices = _.clone(this.selectedOfficeType.inclusions).pop();
      if (officeServices.services) {
        this.selectedOfficeServices = officeServices.services;
        _.each(this.selectedOfficeServices, function(s) {
          s.selected = s.default;
        })
      } else {
        this.selectedOfficeServices = [];
      }
    }
  }

  sqftArea: any = 0;
  selectCabin(office, cabin) {
    if (cabin.totalArea - cabin.usedArea > 10) {
      cabin.selected = !cabin.selected;
      if (cabin.selected) {
        this.selectedCabins.push(cabin);
        this.selectedOffices.push({ officeId: office.id, office: office.name });
      } else {
        this.selectedCabins = _.without(this.selectedCabins, cabin);
        this.selectedOffices = _.reject(this.selectedOffices, { officeId: office.id });
      }
    }
  }

  selectedOffices = [];
  selectedCabins = [];
  selectedDesks = [];
  desks = [];
  totalBookingPrice: any = 0;
  selectDesk(desk) {
    var allDesksSelected = false;
    if (desk.status == "Available" || true) {
      var selectedDesks = _.filter(this.selectedDesks, { selected: true });
      if (selectedDesks.length >= this.booking.desks) {
        selectedDesks[0].selected = false;
      }
      var selectedDesk = _.find(this.selectedDesks, { id: desk.id });
      if (selectedDesk) {
        selectedDesk.selected = !selectedDesk.selected;
      } else {
        desk.selected = !desk.selected;
        if (desk.selected) {
          this.selectedDesks.push(desk);
        }
      }
    }
    this.updateSelectedDesks();
  }

  updateSelectedDesks() {
    console.log("updateSelectedDesks :: updateSelectedDesks ::", this.selectedDesks)
    var allDesksSelected = false;
    var selectedDesks = _.filter(this.selectedDesks, { selected: true });
    this.desks = selectedDesks;
    if (selectedDesks.length >= this.booking.desks) {
      allDesksSelected = true;
    }

    this.selectedOffices = [];
    this.selectedCabins = [];
    var selectedCabins = [];
    var self = this;
    if (allDesksSelected) {
      var selectedCabinIds = _.uniq(_.map(selectedDesks, "parkingLotId"));
      console.log("selectedCabinIds",selectedCabinIds)
      _.each(self.offices, function(o) {
        var cabins = _.filter(o.cabins, function(c) {
          return selectedCabinIds.indexOf(parseInt(c.id)) >= 0;
        })
        _.each(cabins, function(c) {
          var pricings = _.filter(o.pricings, { deskType: c.deskType });
          c.pricings = pricings;
          c.officeId = o.id;
          c.office = o.name;
        })
        selectedCabins = selectedCabins.concat(cabins);
      })
      _.each(selectedCabins, function(c) {
        self.desks = _.filter(self.selectedDesks, function(d) {
          return d.selected && d.cabinId == parseInt(c.id)
        });
        self.selectedCabins.push({
          id: c.id,
          officeId: c.officeId,
          office: c.office,
          name: c.name,
          desks: self.desks,
          desksCount: self.desks.length,
          deskType: c.deskType,
          pricings: c.pricings,
        })
      })
      console.log("selectedCabins : ", self.selectedCabins);
      if (self.selectedCabins.length) {
        var offices = _(self.selectedCabins)
          .groupBy(x => x.officeId)
          .map((value, key) => ({ officeId: key, office: value[0].office, cabins: value }))
          .value();
        _.each(offices, function(o) {
          var cabins = _(o.cabins)
            .groupBy(x => x.deskType)
            .map((value, key) => ({ deskType: key, pricings: value[0].pricings, cabins: value }))
            .value();
          _.each(cabins, function(c) {
            var desksCount = _.sumBy(c.cabins, "desksCount");
            var cnames = _.map(c.cabins, "name").join(", ");
            c.desksCount = desksCount;
            c.names = cnames;
          })
          o.cabins = cabins;
        });
        this.selectedOffices = offices;
        console.log("selectedOffices : ", self.selectedOffices);
      }
    }
  }

  selectHotDesks(office, cabin) {
    if (this.selectedDeskType.type == "HotDesk") {
      _.each(this.offices, function(o) {
        _.each(o.cabins, function(c) {
          c.selected = false;
        })
      })
      cabin.selected = true;
      var self = this;
      this.desks = [];
      var i = 0;
      _.each(cabin.desks, function(d) {
        if (d.status == 'Available' && i < self.booking.desks) {
          self.desks.push(d);
          i++;
        }
      })

      var pricings = _.filter(office.pricings, { deskType: cabin.deskType });
      var _cabin = {
        names: cabin.name,
        desks: self.desks,
        desksCount: self.desks.length,
        deskType: cabin.deskType,
        value: cabin.value,
        pricings: pricings
      }
      this.selectedOffices = [{ officeId: office.id, office: office.name, cabins: [_cabin] }];
      console.log("selectHotDesks ::: selectedOffices :: ", this.selectedOffices);
    }
  }

  updateBookingPrice() {
    var self = this;
    self.desks = [];
    this.totalBookingPrice = 0;
    _.each(this.selectedOffices, function(o) {
      _.each(o.cabins, function(c) {
        if (c.value) {
          c.price = c.value.split(",")[0];
          c.facilitySetId = c.value.split(",")[1];
          if (c.price && c.price > 0) {
            self.totalBookingPrice = self.totalBookingPrice + (c.price * c.desksCount);
            if (c.cabins) {
              _.each(c.cabins, function(cabin) {
                _.each(cabin.desks, function(d) {
                  self.desks.push({
                    id: d.id,
                    facilitySetId: c.facilitySetId,
                    price: c.price
                  })
                })
              })
            } else {
              var desks = [];
              _.each(self.desks, function(d) {
                desks.push({
                  id: d.id,
                  facilitySetId: c.facilitySetId,
                  price: c.price
                })
              })
              self.desks = desks;
            }
          }
        }
      })
    })
    if (self.contract.term == 'ShortTerm') {
      var rent = 0;
      var noOfDays = moment(self.booking.endDate).diff(moment(self.booking.startDate), 'days') + 1;
      var rentPerDay = self.totalBookingPrice / moment(self.booking.startDate).daysInMonth();
      var rent = rentPerDay * noOfDays;
      self.totalBookingPrice = Math.round(rent);

      this.contract.security = 0;
      this.contract.token = 0;
      this.contract.lockIn = 0;
      this.contract.lockInPenalty = 0;
      this.contract.lockInPenaltyType = 'Fixed';
      this.contract.noticePeriod = 0;
      this.contract.noticePeriodViolation = 0;
      this.contract.noticePeriodViolationType = 'Fixed';
    }
    setTimeout(function() {
      self.ref.detectChanges();
    }, 500)
  }

  save() {
    console.log("this.selectedOffices :::: ", this.selectedOffices)
    var officeId, offices = _.uniq(_.map(this.selectedOffices, "office")).join(", ");
    // if (this.totalBookingPrice) {
    //   this.contract.rent = this.totalBookingPrice - (this.contract.discount || 0);
    //   officeId = this.selectedOffices[0]['officeId'];
    //   // this.sqftArea = _.sumBy(this.selectedCabins,"totalArea");
    // } else {
    //   officeId = this.selectedCabins[0]['officeId'];
    //   this.sqftArea = _.sumBy(this.selectedCabins, "totalArea");
    //   this.contract.isSqftRent = 1;
    //   this.contract.sqFt = this.sqftArea;
    //   this.contract.sqFtPrice = this.contract.rent / this.sqftArea;
    // }
      // console.log(" testing :: testing :: testing::  ",this.selectedOffices[0]);
    // if(this.selectedOffices[0]['officeId']){
    //   officeId = this.selectedOffices[0]['officeId'];
    //   console.log("hgfdghwsdfhqgw-out ::::: ",this.selectedOffices[0]['officeId']);
    // }

    this.contract.deskType = this.selectedDeskType.type;
    this.contract.frequency = this.contract.frequency || 'Monthly';
    this.contract.officeType = this.selectedOfficeType ? this.selectedOfficeType.type : null;
    this.contract.note = this.contract.description;
    console.log("Save Booking :: client ", this.client);
    console.log("Save Booking :: contract ", this.contract);
    console.log("Save Booking :: booking ", this.booking);
    console.log("Save Booking :: desks ", this.desks);
    console.log("Save Booking :: officeId ", officeId);
    var ended = Utils.ngbDateToMoment(this.booking.endDate);
    var data = {
      // offices: offices,
      // officeId: officeId,
      locationId: this.selectedLocation ? this.selectedLocation.id : this.selectedBuilding.locationId,
      started: Utils.ngbDateToMoment(this.booking.startDate).format("YYYY-MM-DD"),
      ended: ended ? ended.add(9, 'hours').format("YYYY-MM-DD") : null,
      client: this.client,
      contract: this.contract,
      Lots: this.selectedCabins.length || 1,
      selectedLots: this.selectedCabins,
      ParkingSpots: this.desks,
      sqftArea: this.sqftArea,
    }
    console.log("Booking data : ", data);
    this.loading = true;
    this.service.createParkingBooking(data).pipe(take(1)).subscribe(
      res => {
        console.log("createBooking :: res data : ", res['data']);
        if (res['data']) {
          this.newBooking = res['data'];
        } else {
          this.toastr.error(res['error'], 'Error', { timeOut: 3000, closeButton: true, progressBar: true });
        }
        this.activeModal.close(res['data']);
        this.loading = false;
      }, error => {
        this.loading = false
      });
  }

  lat: any;
  lng: any;
  minLat: any; maxLat: any; minLng: any; maxLng: any;
  selectedMarker;
  markers = [];

  max(coordType: 'lat' | 'lng'): number {
    return Math.max(...this.markers.map(marker => marker[coordType])) + 0.00100;
  }

  min(coordType: 'lat' | 'lng'): number {
    return Math.min(...this.markers.map(marker => marker[coordType])) - 0.00100;
  }

  markerOut(marker) {
    marker.animation = null;
  }

  markerOver(marker) {
    marker.animation = "BOUNCE";
  }

  isMapReady: boolean = false;
  renderMap() {
    var self = this;
    var index = 1;
    this.markers = [];
    _.each(this.buildings, function(b) {
      self.markers.push({
        fillColor: '#EC407A',
        label: {
          color: 'white',
          text: index + "",
          fontWeight: 'bold',
          fontSize: '14px',
        },
        animation: '',
        lat: b.lat,
        lng: b.lng,
        alpha: 1
      })
      index++;
    })

    this.minLat = this.min('lat');
    this.maxLat = this.max('lat');
    this.minLng = this.min('lng');
    this.maxLng = this.max('lng');

    this.lat = (this.minLat + this.maxLat) / 2;
    this.lng = (this.minLng + this.maxLng) / 2;
    console.log("markers : ", this.markers);
    console.log("lat lng : ", this.lat, this.lng);
    this.isMapReady = true;
  }

  hoverBuilding(building, hover) {
    var marker = _.find(this.markers, { lat: building.lat, lng: building.lng });
    if (hover) {
      building.selected = true;
      marker.animation = 'BOUNCE';
    } else {
      building.selected = false;
      marker.animation = '';
    }
  }

  selectAllDesks(cabin, flag) {
    var self = this;
    console.log("Cabins :: ", cabin)
    _.each(cabin.parkingSpots, function(d) {
      if (d.status == 'Available' || true) {
        d.selected = flag;
        self.selectedDesks = _.without(self.selectedDesks, d);
        if (flag) {
          self.selectedDesks.push(d);
        }
        cabin.selectedAll = flag;
      }
    })
    this.updateSelectedDesks();
  }
}
