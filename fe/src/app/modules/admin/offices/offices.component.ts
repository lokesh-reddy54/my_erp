import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { ProductService } from 'src/app/shared/services/product.service';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { debounceTime, take } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { FileUploader } from 'ng2-file-upload';
import { HttpClient } from "@angular/common/http";

import { environment } from 'src/environments/environment';
import { CommonService } from 'src/app/shared/services/common.service';
import { DialogsService } from 'src/app/shared/services/dialogs.services';
import { AdminService } from 'src/app/shared/services/admin.service';
import { UploadService } from 'src/app/shared/services/upload.service';
import { BookingsService } from 'src/app/shared/services/bookings.service';
import { Helpers } from '../../../helpers';
import { Utils } from '../../../shared/utils';
import * as _ from 'lodash';

declare let $: any;
declare let SVG: any;

@Component({
  selector: 'admin-offices',
  templateUrl: './offices.component.html'
})
export class AdminOfficesComponent implements OnInit, AfterViewInit {
  @ViewChild('buildingContactsList') buildingContactsList: any;
  @ViewChild('officesList') officesList: any;
  @ViewChild('cabinsList') cabinsList: any;
  @ViewChild('desksList') desksList: any;
  @ViewChild('resourcesList') resourcesList: any;
  @ViewChild('parkingLotList') parkingLotList: any;
  @ViewChild('parkingSpotList') parkingSpotList: any;

  @ViewChild('resourceImagesModal') resourceImagesModal: any;
  @ViewChild('resourceModal') resourceModal: any;
  @ViewChild('buildingsMapModal') buildingsMapModal: any;
  @ViewChild('buildingModal') buildingModal: any;
  @ViewChild('officeModal') officeModal: any;
  @ViewChild('LotsModal') LotsModal: any;
  @ViewChild('floorModal') floorModal: any;
  @ViewChild('cabinModal') cabinModal: any;
  @ViewChild('deskModal') deskModal: any;
  @ViewChild('parkingSpotModal') parkingSpotModal: any;
  @ViewChild('parkingLotModal') parkingLotModal: any;
  @ViewChild('amcItemModal') amcItemModal: any;
  @ViewChild('buildingContactModal') buildingContactModal: any;
  @ViewChild('buildingContractUpdateModal') buildingContractUpdateModal: any;

  resourceForm: FormGroup;
  buildingContractUpdateForm: FormGroup;
  buildingContractForm: FormGroup;
  buildingContactForm: FormGroup;
  buildingForm: FormGroup;
  officeForm: FormGroup;
  floorForm: FormGroup;
  cabinForm: FormGroup;
  deskForm: FormGroup;
  parkingSpotsForm: FormGroup;
  amcItemForm: FormGroup;
  contractTermForm: FormGroup;
  buildingAmcForm: FormGroup;

  officeStatuses: any = [];
  parkingTypes: any = []
  deskSizes: any = [];
  lotTypes: any = [];
  deskTypes: any = [];
  cabinDeskTypes: any = [];
  cabinDeskSizes: any = [];
  resourceTypes: any = [];

  building: any = {};
  office: any = {};
  resource: any = {};
  floor: any = {};
  cabin: any = {};
  desk: any = {};
  parkingLots: any = {};
  parkingSpots: any = {};
  selectedOffice: any = {};
  selectedFloor: any = {};
  selectedCabin: any = {};
  selectedDesk: any = {};

  buildingContactsConfig: any = {};
  resourceConfig: any = {};
  floorConfig: any = {};
  cabinConfig: any = {};
  ParkingLotConfig: any = {};
  deskConfig: any = {};
  amcItemConfig: any = {};
  parkingLotConfig: any = {};
  parkingSlotConfig: any = {};

  countries: any = [];
  selectedCountry: any = {};
  cities: any = [];
  selectedCity: any = {};
  locations: any = [];
  selectedLocation: any = {};
  buildings: any = [];
  selectedBuilding: any = {};

  ParkingLots: any = {};
  selectedParkingLot: any = {};

  pricings: any = [];
  facilitySets: any = [];
  offices: any = [];
  items: any = [];
  loading: boolean = false;
  noResults: boolean = false;
  offset: number = 0;
  limit: number = 20;
  minDate: any = new Date();

  buildingContactsFilters: any = {};
  officeFilters: any = {};
  lotFilters: any = {};
  resourceFilters: any = {};
  floorFilters: any = {};
  cabinFilters: any = {};
  deskFilters: any = {};
  parkingLotFilters: any = {};
  parkingSlotFilters: any = {};

  constructor(private dialogs: DialogsService, private service: AdminService, private bookingsService: BookingsService,
    private uploadService: UploadService, public commonService: CommonService) {
    this.officeStatuses = this.commonService.values.officeStatuses;
    this.parkingTypes = this.commonService.values.parkingTypes;
    this.deskSizes = this.commonService.values.deskSizes;
    this.lotTypes = this.commonService.values.lotTypes;
    this.deskTypes = this.commonService.values.deskTypes;
    this.cabinDeskTypes = this.commonService.values.deskTypes;
    this.resourceTypes = this.commonService.values.resourceTypes;
  }

  ngAfterViewInit() {
    // $("#openOfficeModal").click();
  }

  ngOnInit() {

    this.contractTermForm = new FormGroup({
      term: new FormControl("", Validators.required),
      info: new FormControl("", Validators.required),
    });
    this.buildingAmcForm = new FormGroup({
      amcItemId: new FormControl("", Validators.required),
      responsibility: new FormControl("", Validators.required),
      notes: new FormControl("", Validators.required),
    });

    this.amcItemConfig = {
      columns: [
        { label: 'Name', field: 'name', type: 'text', styleClass: 'w-70', sortable: true },
        { label: 'Active', field: 'active', type: 'boolean', styleClass: 'w-20', sortable: true },
      ],
      actions: [
        { icon: 'i-Pen-5', hint: 'Edit', code: 'editAmcItem', style: 'info' }
      ],
      options: {
        debounceDelay: 500,
        actionStyleClass: 'w-10 icons-td center',
      }
    }

    this.floorConfig = {
      columns: [
        { label: 'Name', field: 'name', type: 'text', styleClass: 'w-40', sortable: true },
        { label: 'Cabins', field: 'name', type: 'text', styleClass: 'w-20', sortable: true },
      ],
      actions: [
        { icon: 'i-Blinklist', hint: 'List', code: 'listCabins', style: 'primary' },
        { icon: 'i-Pen-5', hint: 'Edit', code: 'editFloor', style: 'info' }
      ],
      options: {
        debounceDelay: 500,
        actionStyleClass: 'w-40 icons-td center',
      }
    }

    this.cabinConfig = {
      columns: [
        { label: 'Name', field: 'name', type: 'text', styleClass: 'w-40', sortable: true },
        { label: 'Desk Type', field: 'deskType', type: 'text', styleClass: 'w-20', sortable: true },
        { label: 'Desk Size', field: 'deskSize', type: 'text', styleClass: 'w-20', sortable: true },
        // { label: 'Desks', field: 'deskc', type: 'text', styleClass: 'w-10', sortable: true },
      ],
      actions: [
        { icon: 'i-Blinklist', hint: 'List', code: 'listDesks', style: 'primary' },
        { icon: 'i-Pen-5', hint: 'Edit', code: 'editCabin', style: 'info' }
      ],
      options: {
        debounceDelay: 500,
        actionStyleClass: 'w-20 icons-td center',
      }
    }
    this.ParkingLotConfig = {
      columns: [
        { label: 'Name', field: 'name', type: 'text', styleClass: 'w-30', sortable: true },
        { label: 'Type', field: 'productType', type: 'text', styleClass: 'w-30', sortable: true },
        { label: 'Size', field: 'size', type: 'text', styleClass: 'w-15', sortable: true },
        // { label: 'Desks', field: 'deskc', type: 'text', styleClass: 'w-10', sortable: true },
      ],
      actions: [
        { icon: 'i-Split-Vertical', hint: 'List Spots', code: 'listParkingSpots', style: 'primary' },
        { icon: 'i-Pen-5', hint: 'Edit', code: 'editParkingLot', style: 'info' }
      ],
      options: {
        debounceDelay: 500,
        actionStyleClass: 'w-25 icons-td center',
      }
    }
    this.parkingSlotConfig = {
      columns: [
        { label: 'Name', field: 'name', type: 'text', styleClass: 'w-80', sortable: true },
      ],
      actions: [
        { icon: 'i-Pen-5', hint: 'Edit', code: 'editParkingSpot', style: 'info' }
      ],
      options: {
        debounceDelay: 500,
        actionStyleClass: 'w-15 icons-td center',
      }
    }    
    this.deskConfig = {
      columns: [
        { label: 'Name', field: 'name', type: 'text', styleClass: 'w-80', sortable: true },
      ],
      actions: [
        { icon: 'i-Pen-5', hint: 'Edit', code: 'editDesk', style: 'info' }
      ],
      options: {
        debounceDelay: 500,
        actionStyleClass: 'w-15 icons-td center',
      }
    }
    this.buildingContactsConfig = {
      columns: [
        { label: 'Name', field: 'name', type: 'text', styleClass: 'w-20', sortable: true },
        { label: 'Email', field: 'email', type: 'text', styleClass: 'w-20', sortable: true },
        { label: 'Phone', field: 'phone', type: 'text', styleClass: 'w-10', sortable: true },
        { label: 'Purposes', field: 'purposes', type: 'text', styleClass: 'w-40', sortable: true },
      ],
      actions: [
        { icon: 'i-Pen-5', hint: 'Edit', code: 'editContact', style: 'info' }
      ],
      options: {
        debounceDelay: 500,
        actionStyleClass: 'w-10 icons-td center',
      }
    }
    this.resourceConfig = {
      columns: [
        { label: 'Name', field: 'name', type: 'text', styleClass: 'w-40', sortable: true },
        { label: 'Type', field: 'type', type: 'text', styleClass: 'w-20', sortable: true },
        { label: 'Price', field: 'price', type: 'inr', styleClass: 'w-15', sortable: true },
        { label: 'Active', field: 'status', type: 'boolean', styleClass: 'w-10', sortable: true },
      ],
      actions: [
        { icon: 'i-Pen-5', hint: 'Edit', code: 'editResource', style: 'info' }
      ],
      options: {
        debounceDelay: 500,
        actionStyleClass: 'w-15 icons-td center',
      }
    }

    this.buildingForm = new FormGroup({
      name: new FormControl("", Validators.required),
      webUrl: new FormControl(""),
      googlelocation: new FormControl(""),
      description: new FormControl(""),
      street: new FormControl(""),
      landmark: new FormControl(""),
      address: new FormControl(""),
      lat: new FormControl(""),
      lng: new FormControl(""),
      size: new FormControl(""),
      floors: new FormControl(""),
      buildupArea: new FormControl(""),
      sqftPrice: new FormControl(""),
      avgDeskPrice: new FormControl(""),
      carpetArea: new FormControl(""),
      chargeableArea: new FormControl(""),
      rentFreeDays: new FormControl(""),
      handover: new FormControl(""),
      expectedLive: new FormControl(""),
    });
    this.officeForm = new FormGroup({
      name: new FormControl("", Validators.required)
    });
    this.floorForm = new FormGroup({
      name: new FormControl("", Validators.required)
    });
    this.cabinForm = new FormGroup({
      name: new FormControl("", Validators.required),
      area: new FormControl("", Validators.required),
    });
    this.deskForm = new FormGroup({
      name: new FormControl("", Validators.required),
      count: new FormControl(""),
    });
    this.parkingSpotsForm = new FormGroup({
      name: new FormControl("", Validators.required),
      count: new FormControl(""),
    });
    this.amcItemForm = new FormGroup({
      name: new FormControl("", Validators.required)
    });
    this.buildingContractForm = new FormGroup({
      expectedSqftPrice: new FormControl("", Validators.required),
      expectedRent: new FormControl("", Validators.required),
      expectedDeposit: new FormControl("", Validators.required),
      expectedMaintenancePrice: new FormControl(""),
      expectedHandover: new FormControl(""),
      negotiableSqftPrice: new FormControl(""),
      negotiableRent: new FormControl(""),
      negotiableDeposit: new FormControl(""),
      negotiableMaintenancePrice: new FormControl(""),
      negotiableHandover: new FormControl(""),
    });
    this.buildingContractUpdateForm = new FormGroup({
      expectedSqftPrice: new FormControl("", Validators.required),
      expectedRent: new FormControl("", Validators.required),
      expectedDeposit: new FormControl("", Validators.required),
      expectedMaintenancePrice: new FormControl(""),
      expectedHandover: new FormControl(""),
      negotiatedSqftPrice: new FormControl("", Validators.required),
      negotiatedRent: new FormControl(", Validators.required"),
      negotiatedDeposit: new FormControl("", Validators.required),
      negotiatedMaintenancePrice: new FormControl(""),
      negotiatedHandover: new FormControl(""),
      comments: new FormControl(""),
    });
    this.buildingContactForm = new FormGroup({
      name: new FormControl("", Validators.required),
      phone: new FormControl("", Validators.compose([
        Validators.required,
        Validators.pattern('^[6,7,8,9][0-9]{9}$')
      ])),
      email: new FormControl("", Validators.compose([
        // Validators.required,
        Validators.email
      ])),
    });
    this.resourceForm = new FormGroup({
      name: new FormControl("", Validators.required),
      type: new FormControl("", Validators.required),
      subUnitType: new FormControl("", Validators.required),
      subUnits: new FormControl("", Validators.required),
      style: new FormControl("", Validators.required),
      facilities: new FormControl("", Validators.required),
      price: new FormControl("", Validators.required),
      description: new FormControl("")
    });

    this.service.listFacilitySets({ filters: { active: 1 }, offset: 0, limit: 100 }).pipe(take(1)).subscribe(
      res => {
        var facilitySets = res['data'];
        var self = this;
        _.each(facilitySets, function(f) {
          var facilities = _.map(f.facilities, 'name');
          self.facilitySets.push({ id: f.id, label: f.name + " - " + facilities.join(",") });
        })
      }, error => {

      });

    this.service.listCountries({ filters: { active: 1 }, offset: 0, limit: 100 }).pipe(take(1)).subscribe(
      res => {
        this.countries = res['data'];
        this.selectedCountry = res['data'][0];
        this.onCountrySelected();
      });
  }
  onCountrySelected() {
    this.service.listCities({ filters: { countryId: this.selectedCountry.id, active: 1 }, offset: 0, limit: 100 }).pipe(take(1)).subscribe(
      res => {
        this.cities = res['data'];
        this.selectedCity = {};
        this.selectedLocation = {};
        this.selectedCity = res['data'][0];
        this.onCitySelected();
      });
  }

  selectedLocations: any = [];
  onCitySelected() {
    this.service.listLocations({ filters: { cityId: this.selectedCity.id, active: 1 }, offset: 0, limit: 100 }).pipe(take(1)).subscribe(
      res => {
        this.locations = res['data'];
        this.selectedLocation = {};
        this.selectedLocations = [];
        this.selectedLocations.push(res['data'][0].id);
        this.loadMoreBuildings();
      });
  }

  mapBuildings: any = [];
  loadAllBuildings() {
    this.service.listBuildings({ filters: {}, offset: 0, limit: 200 }).pipe(take(1)).subscribe(
      res => {
        var mapBuildings = res['data'];
        this.mapBuildings = _.orderBy(mapBuildings, ['name', 'asc']);
        this.renderMap();
      }, error => { });
    this.officeFilters = {};
    this.cabinFilters = {};
    this.deskFilters = {};
  }

  loadMoreBuildings() {
    if (this.selectedLocations && this.selectedLocations.length) {
      this.service.listBuildings({ filters: { locationIds: this.selectedLocations }, offset: 0, limit: 200 }).pipe(take(1)).subscribe(
        res => {
          this.buildings = res['data'];
          console.log("loadMoreBuildings :: data : ", res['data']);
          // var self = this;
          // setTimeout(function() {
          //   self.building = self.buildings[0];
          //   self.activeBuildingModalTab = "2";
          //   self.openBuildingModal();
          // }, 100)
        }, error => {

        });
    }
    // this.officeFilters = {};
    this.cabinFilters = {};
    this.deskFilters = {};
  }
  loadMoreOffices() {
    if (this.selectedBuilding && this.selectedBuilding.id) {
      this.service.listOffices({ filters: { buildingId: this.selectedBuilding.id }, offset: 0, limit: 20 })
                  .pipe(take(1)).subscribe(
        res => {
          this.offices = res['data'];
        }, error => {

        });
    }
    // this.cabinFilters = {};
    this.deskFilters = {};
  }
  loadMoreSpots() {
    if (this.selectedBuilding && this.selectedBuilding.id) {
      this.service.listOffices({ filters: { buildingId: this.selectedBuilding.id }, offset: 0, limit: 20 })
                  .pipe(take(1)).subscribe(
        res => {
          this.offices = res['data'];
        }, error => {

        });
    }
    // this.cabinFilters = {};
    this.deskFilters = {};
  }
  loadMoreParkingLots() {
    if (this.selectedBuilding && this.selectedBuilding.id) {
      this.service.listParkingLots({ filters: { buildingId: this.selectedBuilding.id }, offset: 0, limit: 20 }).pipe(take(1)).subscribe(
        res => {
          this.ParkingLots = res['data'];
        }, error => {

        });
    }
    // this.cabinFilters = {};
    this.deskFilters = {};
  }
  action(event) {
    console.log("OfficesComponent ::: action :: event ", event);

    //------------ Edit Office ---------//
    if (event.action == 'editOffice') {
      this.office = _.clone(event.item);
      if (this.office.deskTypes) {
        this.office.deskTypes = this.office.deskTypes.split(",");
      } else {
        this.office.deskTypes = [];
      }
      if (this.office.allowedDeskSizes) {
        this.office.allowedDeskSizes = this.office.allowedDeskSizes.split(",");
      } else {
        this.office.allowedDeskSizes = [];
      }
      if (this.office.pricings) {
        this.pricings = _.filter(this.office.pricings, { active: 1 });
      }
      if (this.office.expectedLive) {
        this.office.expectedLive = Utils.dateToNgbDate(this.office.expectedLive);
      }
      if (this.office.rentStarted) {
        this.office.rentStarted = Utils.dateToNgbDate(this.office.rentStarted);
      }

      this.pricings.push({});
      this.openOfficeModal();
    } 

        //------------ Edit Office ---------//
        if (event.action == 'editLot') {
          this.office = _.clone(event.item);
          if (this.office.deskTypes) {
            this.office.deskTypes = this.office.deskTypes.split(",");
          } else {
            this.office.deskTypes = [];
          }
          if (this.office.allowedDeskSizes) {
            this.office.allowedDeskSizes = this.office.allowedDeskSizes.split(",");
          } else {
            this.office.allowedDeskSizes = [];
          }
          if (this.office.pricings) {
            this.pricings = _.filter(this.office.pricings, { active: 1 });
          }
          if (this.office.expectedLive) {
            this.office.expectedLive = Utils.dateToNgbDate(this.office.expectedLive);
          }
          if (this.office.rentStarted) {
            this.office.rentStarted = Utils.dateToNgbDate(this.office.rentStarted);
          }
    
          this.pricings.push({});
          this.openLotModal();
        } 

    //------------ List Offices ---------//
    else if (event.action == 'listOffices') {
      if (this.selectedBuilding) { this.selectedBuilding.selected = false; }
      //cabinFilters.officeId||resourceFilters.officeId ? 'col-3':'col-9'" class="p-1" 
      //*ngIf="officeFilters.buildingId">
      event.item.selected = true;
      this.selectedBuilding = (event.item);
      this.officeFilters.buildingId = event.item.id;
      this.lotFilters = {}
      this.parkingLotFilters = {};
      this.parkingSlotFilters = {}
      this.cabinFilters = {};
      this.deskFilters = {};
      this.loadMoreOffices();
    }

        //------------ List Spots ---------//
    else if (event.action == 'listLots') {
      if (this.selectedBuilding) { this.selectedBuilding.selected = false; }
      //cabinFilters.officeId||resourceFilters.officeId ? 'col-3':'col-9'" class="p-1" 
      //*ngIf="officeFilters.buildingId">
      event.item.selected = true;
      this.selectedBuilding = (event.item);
      this.officeFilters.buildingId = event.item.id;
      this.lotFilters.buildingId = event.item.id;
      this.parkingLotFilters = {};
      this.parkingSlotFilters = {}
      this.cabinFilters = {};
      this.deskFilters = {};
      this.loadMoreSpots();
    }

    //------------ List Parking Lots ---------//
    else if (event.action == 'listParkingLots') {
      if (this.selectedBuilding) { this.selectedBuilding.selected = false; }

      event.item.selected = true;
      this.selectedBuilding = (event.item);
      this.parkingLotFilters.buildingId = event.item.id;
      console.log("this.parkingLotFilters.buildingId ::", this.parkingLotFilters.buildingId)
      this.officeFilters = {};
      this.deskFilters = {};
      this.loadMoreParkingLots();
    } 

    //------------ List Parking Slots ---------//
    else if (event.action == 'listParkingSpots') {
      if (this.selectedParkingLot) { this.selectedParkingLot.selected = false;  }

      event.item.selected = true;
      this.selectedParkingLot = (event.item);
      this.parkingSlotFilters.parkingLotId = event.item.id;
    } 

    //------------ Edit Building ---------//
    else if (event.action == 'editBuilding') {
      this.building = _.clone(event.item);
      this.openBuildingModal();
    } 

    //------------ List Cabins ---------//
    else if (event.action == 'listCabins') {
      if (this.selectedOffice) {
        this.selectedOffice.selected = false;
      }
      event.item.selected = true;
      this.selectedOffice = (event.item);
      this.cabinFilters.officeId = event.item.id;
      this.resourceFilters = {};
      this.deskFilters = {};
    } 

    //------------ List Resources ---------//
    else if (event.action == 'listResources') {
      if (this.selectedOffice) {
        this.selectedOffice.selected = false;
      }
      event.item.selected = true;
      this.selectedOffice = (event.item);
      this.resourceFilters.officeId = event.item.id;
      this.cabinFilters = {};
      this.deskFilters = {};
    } 

    //------------ Edit Cabin ---------//
    else if (event.action == 'editCabin') {
      this.cabin = _.clone(event.item);
      this.openCabinModal();
    } 

    //------------ List Desks ---------//
    else if (event.action == 'listDesks') {
      if (this.selectedCabin) {
        this.selectedCabin.selected = false;
      }
      event.item.selected = true;
      this.selectedCabin = (event.item);
      this.deskFilters.cabinId = event.item.id;
    } 

    //------------ Edit Desk ---------//
    else if (event.action == 'editDesk') {
      this.desk = _.clone(event.item);
      this.openDeskModal();
    } 
    else if (event.action == 'editParkingLot') {
      this.parkingLots = _.clone(event.item);
      this.openParkingLotModal();
    } 
    else if (event.action == 'editParkingSpot') {
      this.parkingSpots = _.clone(event.item);
      this.openParkingSpotModal();
    } 
    //------------ Edit Resource ---------//
    else if (event.action == 'editResource') {
      this.resource = _.clone(event.item);
      this.openResourceModal();
    } 

    //------------ Edit Contact ---------//
    else if (event.action == 'editContact') {
      this.contact = _.clone(event.item);
      this.openBuildingContactModal();
    }
  }

  saveBuilding() {
    console.log("OfficesComponent ::: save :: building ", this.building);
    this.loading = true;
    let self = this;
    this.building.locationId = this.selectedLocation[0].id;
    console.log("OfficesComponent ::: save :: building :: this.selectedLocation", this.selectedLocation);
    var building = _.clone(this.building);
    building.size = building.length + "x" + building.width;
    building.handover = Utils.ngbDateToDate(this.building.handover);
    building.expectedLive = Utils.ngbDateToDate(this.building.expectedLive);
    this.service.saveBuilding(building).pipe(take(1)).subscribe(
      res => {
        self.dialogs.success("Office '" + this.building.name + "' is saved successfully ");
        this.loading = false;
        self.loadMoreBuildings();
        this.openedModal.close();
      },
      error => {
        self.dialogs.error(error, 'Error while saving')
      }
    )
  }

  saveOffice() {
    console.log("OfficesComponent ::: save :: office ", this.office);
    this.loading = true;
    let self = this;
    var office = _.clone(this.office);
    office.buildingId = this.selectedBuilding.id;
    office.deskTypes = office.deskTypes.join(",");
    office.allowedDeskSizes = office.allowedDeskSizes.length ? office.allowedDeskSizes.join(",") : "";
    office.expectedLive = Utils.ngbDateToDate(office.expectedLive);
    office.rentStarted = Utils.ngbDateToDate(office.rentStarted);
    this.service.saveOffice(office).pipe(take(1)).subscribe(
      res => {
        self.dialogs.success("Office '" + this.office.name + "' is saved successfully ");
        this.loading = false;
        self.loadMoreOffices();
        this.openedModal.close();
      },
      error => {
        self.dialogs.error(error, 'Error while saving')
      }
    )
  }

  saveSpot() {
    console.log("OfficesComponent ::: save :: office ", this.office);
    this.loading = true;
    let self = this;
    var office = _.clone(this.office);
    office.buildingId = this.selectedBuilding.id;
    office.deskTypes = office.deskTypes.join(",");
    office.allowedDeskSizes = office.allowedDeskSizes.length ? office.allowedDeskSizes.join(",") : "";
    office.expectedLive = Utils.ngbDateToDate(office.expectedLive);
    office.rentStarted = Utils.ngbDateToDate(office.rentStarted);
    this.service.saveOffice(office).pipe(take(1)).subscribe(
      res => {
        self.dialogs.success("Spot '" + this.office.name + "' is saved successfully ");
        this.loading = false;
        self.loadMoreSpots();
        this.openedModal.close();
      },
      error => {
        self.dialogs.error(error, 'Error while saving')
      }
    )
  }

  getGooglePlaceAddress($event) {
    console.log("getGooglePlaceAddress :: ", $event);
    this.building.address = $("#googleplace").val();
    this.building.lat = $event.latitude;
    this.building.lng = $event.longitude;
  }

  saveFloor() {
    console.log("OfficesComponent ::: save :: floor ", this.floor);
    this.loading = true;
    let self = this;
    // this.service.saveLocation(this.location).pipe(take(1)).subscribe(
    //   res => {
    //     self.dialogs.success("Location '" + this.location.name + "' is saved successfully ");
    //     self.cityList.reset();
    //   },
    //   error => {
    //     self.dialogs.error(error, 'Error while saving')
    //   }
    // )
  }

  saveBuildingContract(approved?) { }

  showContactForm: boolean = false;
  saveBuildingContact() {
    console.log("OfficesComponent ::: save :: contact ", this.contact);
    this.loading = true;
    let self = this;
    this.contact.buildingId = this.building.id;
    var contact = _.clone(this.contact);
    // contact.purposes = contact.purposes.join(",");
    contact.purposes = [];
    if (this.contact.owner) {
      contact.purposes.push('Owner');
    }
    if (this.contact.writer) {
      contact.purposes.push('Writer');
    }
    if (this.contact.contractor) {
      contact.purposes.push('Contractor');
    }
    contact.purposes = contact.purposes.join(",");
    this.service.saveBuildingContact(contact).pipe(take(1)).subscribe(
      res => {
        self.dialogs.success("Contact '" + this.contact.name + "' is saved successfully ");
        this.loading = false;
        this.buildingContacts = null;
        this.getBuildingContacts();
        this.showContactForm = false;
        this.contact = {};
        this.buildingContactForm.reset();
      },
      error => {
        self.dialogs.error(error, 'Error while saving')
      }
    )
  }
  showNegotiationForm: boolean = false;
  saveBuildingContractUpdate() {
    console.log("OfficesComponent ::: saveBuildingContractUpdate :: buildingContractUpdate ", this.buildingContractUpdate);
    this.loading = true;
    let self = this;
    this.buildingContractUpdate.buildingId = this.building.id;
    this.buildingContractUpdate.buildingContractId = this.buildingContract.id;
    var buildingContractUpdate = _.clone(this.buildingContractUpdate);
    buildingContractUpdate.expectedHandover = Utils.ngbDateToDate(buildingContractUpdate.expectedHandover);
    buildingContractUpdate.negotiatedHandover = Utils.ngbDateToDate(buildingContractUpdate.negotiatedHandover);
    this.service.saveBuildingContractUpdate(buildingContractUpdate).pipe(take(1)).subscribe(
      res => {
        self.dialogs.success("Contract Update is added successfully ");
        this.buildingNegotiations = null;
        this.buildingContract = {};
        this.buildingContractUpdateForm.reset();
        this.showNegotiationForm = false;
        this.getBuildingNegotiations();
      }, error => {
        self.dialogs.error(error, 'Error while saving')
      }
    )
  }
  updateBuildingRent(type) {
    if (type == 'owner' && this.buildingContractUpdate.expectedSqftPrice) {
      if (this.buildingContractUpdate.carpetAreaPricing && this.building.carpetArea) {
        this.buildingContractUpdate.expectedRent = this.building.carpetArea * this.buildingContractUpdate.expectedSqftPrice;
      } else if (this.building.buildupArea) {
        this.buildingContractUpdate.expectedRent = this.building.buildupArea * this.buildingContractUpdate.expectedSqftPrice;
      }
    } else if (type == 'team' && this.buildingContractUpdate.negotiatedSqftPrice) {
      if (this.buildingContractUpdate.carpetAreaPricing && this.building.carpetArea) {
        this.buildingContractUpdate.negotiatedRent = this.building.carpetArea * this.buildingContractUpdate.negotiatedSqftPrice;
      } else if (this.building.buildupArea) {
        this.buildingContractUpdate.negotiatedRent = this.building.buildupArea * this.buildingContractUpdate.negotiatedSqftPrice;
      }
    }
  }

  updateBuildingSqFtPrice(type) {
    if (type == 'owner' && this.buildingContractUpdate.expectedRent) {
      if (this.buildingContractUpdate.carpetAreaPricing && this.building.carpetArea) {
        this.buildingContractUpdate.expectedSqftPrice = this.buildingContractUpdate.expectedRent / this.building.carpetArea;
      } else if (this.building.buildupArea) {
        this.buildingContractUpdate.expectedSqftPrice = this.buildingContractUpdate.expectedRent / this.building.buildupArea;
      }
    } else if (type == 'team' && this.buildingContractUpdate.negotiatedRent) {
      if (this.buildingContractUpdate.carpetAreaPricing && this.building.carpetArea) {
        this.buildingContractUpdate.negotiatedSqftPrice = this.buildingContractUpdate.negotiatedRent / this.building.carpetArea;
      } else if (this.building.buildupArea) {
        this.buildingContractUpdate.negotiatedSqftPrice = this.buildingContractUpdate.negotiatedRent / this.building.buildupArea;
      }
    }
  }

  saveResource() {
    console.log("OfficesComponent ::: save :: resource ", this.resource);
    this.loading = true;
    let self = this;
    this.resource.officeId = this.selectedOffice.id;
    var resource = _.clone(this.resource);
    resource.facilities = resource.facilities.join(",");
    resource.type = resource.type.type;
    this.service.saveResource(resource).pipe(take(1)).subscribe(
      res => {
        self.dialogs.success("Resource '" + this.resource.name + "' is saved successfully ");
        this.loading = false;
        this.resourcesList.reset();
        this.openedModal.close();
      },
      error => {
        self.dialogs.error(error, 'Error while saving')
      }
    )
  }
  saveCabin() {
    console.log("OfficesComponent ::: save :: cabin ", this.cabin);
    this.loading = true;
    let self = this;
    this.cabin.officeId = this.selectedOffice.id;
    this.service.saveCabin(this.cabin).pipe(take(1)).subscribe(
      res => {
        self.dialogs.success("Cabin '" + this.cabin.name + "' is saved successfully ");
        this.loading = false;
        this.cabinsList.reset();
        this.openedModal.close();
      },
      error => {
        self.dialogs.error(error, 'Error while saving')
      }
    )
  }
  saveDesk() {
    console.log("OfficesComponent ::: save :: desk ", this.desk);
    this.loading = true;
    let self = this;
    this.desk.cabinId = this.selectedCabin.id;
    this.service.saveDesk(this.desk).pipe(take(1)).subscribe(
      res => {
        self.dialogs.success("Desk '" + this.desk.name + "' is saved successfully ");
        self.desksList.reset();
        this.loading = false;
        this.openedModal.close();
      },
      error => {
        self.dialogs.error(error, 'Error while saving')
      }
    )
  }
  saveParkingLot() {
    console.log("OfficesComponent ::: save :: cabin ", this.parkingLots);
    this.loading = true;
    let self = this;
    this.parkingLots.buildingId = this.selectedBuilding.id;
    this.service.saveParkingLot(this.parkingLots).pipe(take(1)).subscribe(
      res => {
        self.dialogs.success("Cabin '" + this.parkingLots.name + "' is saved successfully ");
        this.loading = false;
        //this.parkingLotList.reset();
        this.openedModal.close();
      },
      error => {
        self.dialogs.error(error, 'Error while saving')
      }
    )
  }
  saveParkingSpot() {
    console.log("saveParkingSpot ::: save :: Spot ", this.parkingSpots);
    this.loading = true;
    let self = this;
    this.parkingSpots.parkingLotId = this.selectedParkingLot.id;
    this.service.saveParkingSpots(this.parkingSpots).pipe(take(1)).subscribe(
      res => {
        self.dialogs.success("Desk '" + this.parkingSpots.name + "' is saved successfully ");
        //self.parkingSpotList.reset();
        this.loading = false;
        this.openedModal.close();
      },
      error => {
        self.dialogs.error(error, 'Error while saving')
      }
    )
  }
  saveOfficePricing(price) {
    console.log("addPrice : ", price);
    this.loading = true;
    let self = this;
    price.officeId = this.office.id;
    price.active = 1;
    this.service.saveOfficePricing(price).pipe(take(1)).subscribe(
      res => {
        self.dialogs.success("Pricing is saved successfully ");
        this.loading = false;
        if (!price.id) {
          this.pricings.push({});
        }
        price.id = res['data']['id'];
      },
      error => {
        self.dialogs.error(error, 'Error while saving')
      }
    )
  }
  removePricing(price) {
    console.log("addPrice : ", price);
    this.loading = true;
    let self = this;
    this.service.saveOfficePricing({ id: price.id, active: 0 }).pipe(take(1)).subscribe(
      res => {
        self.dialogs.success("Pricing is archived successfully ");
        this.loading = false;
        this.pricings = _.without(this.pricings, price);
      },
      error => {
        self.dialogs.error(error, 'Error while saving')
      }
    )
  }

  buildingAmcs: any = [];
  amcItems: any = [];
  listBuildingAmcs() {
    this.service.listBuildingAmcs({ filters: { buildingId: this.building.id } })
      .subscribe(res => {
        this.buildingAmcs = res['data'];
      })
    this.listBuildingAmcItems();
  }
  listBuildingAmcItems() {
    this.service.listBuildingAmcItems({ filters: {} })
      .subscribe(res => {
        this.amcItems = res['data'];
      })
  }

  saveAmcItem(item?) {
    if (item) {
      this.amcItem = item;
    }
    console.log("OfficesComponent ::: saveAmcItem ", this.amcItem);
    this.loading = true;
    let self = this;
    this.amcItem.buildingId = this.selectedBuilding.id;
    this.service.saveBuildingAmcItem(this.amcItem).pipe(take(1)).subscribe(
      res => {
        this.amcItem = {};
        self.dialogs.success("AMC Item '" + this.amcItem.name + "' is saved successfully ");
        self.listBuildingAmcItems();
        this.loading = false;
      },
      error => {
        self.dialogs.error(error, 'Error while saving')
      }
    )
  }
  buildingAmc: any;
  saveBuildingAmc(item?) {
    var data = _.clone(this.buildingAmc);
    if (item) {
      data = item;
    } else {
      data.active = 1;
    }
    data.buildingId = this.building.id;
    this.service.saveBuildingAmc(data).subscribe(res => {
      if (!data.id) {
        this.buildingAmcs.push(res['data']);
        this.dialogs.success("Added Building AMC");
      } else {
        this.dialogs.success("Updated Building AMC");
      }
      this.listBuildingAmcs();
      this.buildingAmc = null;
    })
  }

  buildingContractTerms: any = [];
  getBuildingContractTerms() {
    this.service.getBuildingContractTerms(this.building.id).subscribe(res => {
      if (res['data']) {
        this.building.agreement = res['data'].agreement;
        this.buildingContractTerms = res['data'].terms;
      }
    })
  }

  agreementFile: any;
  agreementFileChange(event) {
    this.agreementFile = event.target.files[0];
  }
  agreementUploadResponse: any = { status: '', message: '', filePath: '' };
  agreementFileError: any;
  uploadAgreementFile() {
    const formData = new FormData();
    formData.append('file', this.agreementFile);
    this.loading = true;
    this.uploadService.upload(formData).subscribe(
      (res) => {
        this.agreementUploadResponse = res;
        if (res.file) {
          this.loading = false;
          this.building.agreement = res;
          this.building.agreementId = res.id;
          this.agreementFile = null;
          this.service.saveBuilding({id: this.building.id, agreementId: res.id}).subscribe(res=>{
            this.dialogs.success("Onwer agreement is uploaded successfully ..!")
          });
        }
      },
      (err) => this.agreementFileError = err
    );
  }


  contractTerm: any;
  termImageFile: any;
  termImageFileChange(event) {
    this.termImageFile = event.target.files[0];
  }
  termImageUploadResponse: any = { status: '', message: '', filePath: '' };
  termImageFileError: any;
  uploadTermImageFile() {
    const formData = new FormData();
    formData.append('file', this.termImageFile);
    this.loading = true;
    this.uploadService.upload(formData).subscribe(
      (res) => {
        this.termImageUploadResponse = res;
        if (res.file) {
          this.loading = false;
          this.contractTerm.image = res.link;
          this.termImageFile = null;
        }
      },
      (err) => this.termImageFileError = err
    );
  }
  saveContractTerm(item?) {
    var data = _.clone(this.contractTerm);
    if (item) {
      data = item;
    } else {
      data.status = 'Published';
    }
    data.buildingId = this.building.id;
    this.service.saveBuildingContractTerm(data).subscribe(res => {
      if (data.status == "Archived") {
        this.buildingContractTerms = _.reject(this.buildingContractTerms, { id: data.id });
      } else {
        if (!data.id) {
          this.buildingContractTerms.push(res['data']);
          this.dialogs.success("Added new Contract Term");
        } else {
          this.dialogs.success("Updated Contract Term");
        }
      }
      this.contractTerm = null;
    })
  }


  lat: any;
  lng: any;
  minLat: any; maxLat: any; minLng: any; maxLng: any;
  selectedMarker;
  markers = [];
  mapFilters: any = {};

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
  filteredBuildings: any = [];
  renderMap() {
    var self = this;
    var index = 1;
    this.markers = [];
    var filteredBuildings = _.filter(this.mapBuildings, function(b) {
      var flag = true;
      if (self.mapFilters.statuses && self.mapFilters.statuses.length) {
        flag = false;
        var _b = self.mapFilters.statuses.indexOf(b.status);
        if (_b > -1) {
          flag = true;
        }
      }
      return flag;
    })
    this.filteredBuildings = filteredBuildings;
    _.each(filteredBuildings, function(b) {
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
    if (marker && building) {
      if (this.selectedMapBuilding && this.selectedBuilding.id != building.id) {
        this.selectedMapBuilding.selected = false;
      }
      if (hover) {
        building.selected = true;
        marker.animation = 'BOUNCE';
      } else {
        building.selected = false;
        marker.animation = '';
      }
    }
  }

  makeAsCenter(building) {
    this.lat = building.lat;
    this.lng = building.lng;
  }
  showBuildingContracts(building) {
    this.building = building;
    this.activeBuildingModalTab = "2";
    this.openBuildingModal();
  }
  selectedMapBuilding: any;
  scrollToBuilding(marker) {
    console.log("scrollToBuilding ::: marker : ", marker);
    const element = document.getElementById("map-building-" + marker.label.text);
    if (element) {
      element.scrollIntoView({ block: 'center', behavior: 'smooth' });

      var index = parseInt(marker.label.text) - 1;
      if (this.selectedMapBuilding) {
        this.selectedMapBuilding.selected = false;
      }
      this.filteredBuildings[index].selected = true;
      this.selectedMapBuilding = this.filteredBuildings[index];
    }
  }
  openedModal: any;
  openBuildingsMapModal() {
    this.openedModal = this.dialogs.modal(this.buildingsMapModal, { size: 'xlg' });
    var self = this;
    this.loadAllBuildings();
    this.openedModal.result.then(function() {
      self.building = {};
    }).catch(function(e) {
      self.building = {};
    })
  }
  activeBuildingModalTab: any = "0";
  buildingContract: any = {};
  buildingImages: any = [];

  openBuildingModal() {
    this.openedModal = this.dialogs.modal(this.buildingModal, { size: 'lg' });
    this.building.handover = Utils.dateToNgbDate(this.building.handover);
    this.building.expectedLive = Utils.dateToNgbDate(this.building.expectedLive);
    var sizes = this.building.size.split("x");
    this.building.length = sizes[0];
    this.building.width = sizes[1];
    this.buildingServices = null;
    this.buildingContactsFilters.buildingId = this.building.id;

    this.service.getBuildingContract(this.building.id)
      .subscribe(res => {
        // this.buildingContract = res['data']['contract'];
        var buildingImages = res['data']['images'];
        this.buildingImages = [];
        var self = this;
        _.each(buildingImages, function(f) {
          self.buildingImages.push({
            image: f.file, thumbImage: f.file, title: '', alt: '',
            updated: f['building_images'].updated, updatedBy: f['building_images'].updatedBy
          });
        })
      })
    var self = this;
    this.openedModal.result.then(function() {
      self.building = {};
      // self.loadMoreOffices();
    }).catch(function(e) {
      // self.loadMoreOffices();
      self.building = {};
    })
  }

  contact: any = {};
  buildingContractUpdate: any = {};
  openNewContractUpdate() {
    this.openedModal = this.dialogs.modal(this.buildingContractUpdateModal, { size: 'lg' });
    var self = this;
    this.openedModal.result.then(function() {
      self.buildingContractUpdate = {};
    }).catch(function(e) {
      self.buildingContractUpdate = {};
    })
  }
  openBuildingContactModal() {
    this.openedModal = this.dialogs.modal(this.buildingContactModal, { size: 'lg' });
    var self = this;
    this.openedModal.result.then(function() {
      self.contact = {};
    }).catch(function(e) {
      self.contact = {};
    })
  }
  openOfficeModal() {
    this.openedModal = this.dialogs.modal(this.officeModal, { size: 'xlg' });
    var self = this;
    this.openedModal.result.then(function() {
      self.office = {};
      self.loadMoreOffices();
    }).catch(function(e) {
      self.loadMoreOffices();
      self.office = {};
    })
  }
  openLotModal() {
    this.openedModal = this.dialogs.modal(this.LotsModal, { size: 'xlg' });
    var self = this;
    this.openedModal.result.then(function() {
      self.office = {};
      self.loadMoreSpots();
    }).catch(function(e) {
      self.loadMoreSpots();
      self.office = {};
    })
  }

  openFloorModal() {
    this.openedModal = this.dialogs.modal(this.floorModal, { size: null });
    var self = this;
    this.openedModal.result.then(function() {
      self.floor = {};
    }).catch(function(e) {
      self.floor = {};
    })
  }

  openCabinModal() {
    this.cabinDeskTypes = _.clone(this.selectedOffice).deskTypes.split(",");
    this.cabinDeskSizes = _.clone(this.selectedOffice).allowedDeskSizes.split(",");
    this.openedModal = this.dialogs.modal(this.cabinModal, { size: null });
    var self = this;
    this.openedModal.result.then(function() {
      self.cabin = {};
    }).catch(function(e) {
      self.cabin = {};
    })
  }
  // openParkingLotModal() {
  //   // this.cabinDeskTypes = _.clone(this.selectedOffice).deskTypes.split(",");
  //   // this.cabinDeskSizes = _.clone(this.selectedOffice).allowedDeskSizes.split(",");
  //   this.openedModal = this.dialogs.modal(this.cabinModal, { size: null });
  //   var self = this;
  //   this.openedModal.result.then(function() {
  //     self.cabin = {};
  //   }).catch(function(e) {
  //     self.cabin = {};
  //   })
  // }
  openDeskModal() {
    this.openedModal = this.dialogs.modal(this.deskModal, { size: null });
    var self = this;
    this.openedModal.result.then(function() {
      self.desk = {};
    }).catch(function(e) {
      self.desk = {};
    })
  }
  openParkingSpotModal() {
    this.openedModal = this.dialogs.modal(this.parkingSpotModal, { size: null });
    var self = this;
    this.openedModal.result.then(function() {
      self.parkingSpots = {};
    }).catch(function(e) {
      self.parkingSpots = {};
    })
  }
  openParkingLotModal() {
    this.openedModal = this.dialogs.modal(this.parkingLotModal, { size: null });
    var self = this;
    this.openedModal.result.then(function() {
      self.parkingLots = {};
    }).catch(function(e) {
      self.parkingLots = {};
    })
  }

  amcItem: any = {};
  openAmcItemModal() {
    this.openedModal = this.dialogs.modal(this.amcItemModal, { size: null });
    var self = this;
    this.openedModal.result.then(function() {
      self.amcItem = {};
    }).catch(function(e) {
      self.amcItem = {};
    })
  }

  calculateResourcePrice() {
    if (this.resource.subUnits && this.resource.paxPrice) {
      this.resource.price = Math.round(this.resource.paxPrice * this.resource.subUnits);
    }
  }

  openResourceModal() {
    this.bookingsService.getBuildingMeetingRoomPaxPrice(this.resource.officeId)
      .subscribe(res => {
        if (res['data']) {
          this.resource.paxPrice = res['data'];
        }
      })

    var resource = _.clone(this.resource);
    if (resource.facilities) {
      resource.facilities = resource.facilities.split(",");
    }
    if (resource.type) {
      resource.type = _.find(this.resourceTypes, { type: resource.type });
    }
    this.resource = resource;

    this.openedModal = this.dialogs.modal(this.resourceModal, { size: null });
    var self = this;
    this.openedModal.result.then(function() {
      self.resource = {};
    }).catch(function(e) {
      self.resource = {};
    })
  }

  getFacilitySetLabel(price) {
    var facilitySet = _.find(this.facilitySets, { id: price.facilitySetId });
    return facilitySet ? facilitySet.label : '';
  }

  initPlan() {
    // console.log("SVG : ", SVG);
    var canvas = new SVG('drawing').size('100%', '100%');

    var poly2 = canvas.polygon().draw({ snapToGrid: 5 }).attr('stroke-width', 1).attr('fill', 'none');
    poly2.on('drawstart', function(e) {
      document.addEventListener('keydown', function(e) {
        if (e.keyCode == 13) {
          poly2.draw('done');
          poly2.attr({ fill: '#f06' });
          poly2.off('drawstart');
          poly2.selectize({ deepSelect: true }).resize();
        }
      });
    });

    poly2.on('drawstop', function() {
      // remove listener
    });
  }

  userGuideFile: any;
  userGuideFileChange(event) {
    this.userGuideFile = event.target.files[0];
  }

  userGuideUploadResponse: any = { status: '', message: '', filePath: '' };
  userGuideFileError: any;

  uploadUserGuideFile() {
    const formData = new FormData();
    formData.append('file', this.userGuideFile);

    this.loading = true;
    this.uploadService.upload(formData).subscribe(
      (res) => {
        this.userGuideUploadResponse = res;
        if (res.file) {
          this.loading = false;
          this.resource.userGuide = res;
          this.resource.userGuideId = res.id;
          if (this.resource.id) {
            this.service.saveResource({ id: this.resource.id, userGuideId: res.id })
              .pipe(take(1)).subscribe(res => this.dialogs.success("User Guide uploaded successfully..!!"))
          } else {
            this.dialogs.success("User Guide uploaded successfully..!!")
          }
        }
      },
      (err) => this.userGuideFileError = err
    );
  }

  resourceImages: any = [];
  loadResourceImages(id) {
    this.service.listResourceImages({ filters: { resourceId: id } })
      .subscribe(res => {
        this.resourceImages = res['data'];
      })
  }

  loadBuildingImages() {
    var self = this;
    this.uploader = new FileUploader({
      url: Helpers.composeEnvUrl() + "buildingImageUploads/" + this.building.id,
    });
    this.uploader.onCompleteAll = () => {
      console.log('openBuildingImagesModal :: onCompleteAll : ');
      self.service.getBuildingContract(this.building.id)
        .subscribe(res => {
          var buildingImages = res['data']['images'];
          this.buildingImages = [];
          var self = this;
          _.each(buildingImages, function(f) {
            self.buildingImages.push({ image: f.file, thumbImage: f.file, title: '', alt: '' });
          })
        })
    };
  }
  openResourceImagesModal(id) {
    var self = this;
    this.uploader = new FileUploader({
      url: Helpers.composeEnvUrl() + "resourceImageUploads/" + id,
    });
    this.uploader.onCompleteAll = () => {
      console.log('openResourceImagesModal :: onCompleteAll : ');
      self.loadResourceImages(id);
    };
    this.loadResourceImages(id);

    this.openedModal = this.dialogs.modal(this.resourceImagesModal, { size: 'xlg' });
    var self = this;
    this.openedModal.result.then(function() {
      self.loading = false;
    }).catch(function(e) {
      self.loading = false;
    })
  }

  public uploader: FileUploader;
  public hasBaseDropZoneOver: boolean = false;
  public hasAnotherDropZoneOver: boolean = false;

  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  public fileOverAnother(e: any): void {
    this.hasAnotherDropZoneOver = e;
  }

  buildingServices: any;
  getBuildingServices() {
    var self = this;
    if (!this.buildingServices) {
      this.service.getBuildingServices(this.building.id)
        .pipe(take(1)).subscribe(res => {
          var buildingServices = res['data'];
          this.buildingServices = [];
          var ticketAssigneeTypes = _.filter(this.commonService.values.ticketAssigneeTypes, { buildingLevel: 1 })
          _.each(ticketAssigneeTypes, function(serviceType) {
            var service = _.find(buildingServices, { serviceCode: serviceType.type });
            if (service) {
              service.name = serviceType.name;
              self.buildingServices.push(service);
            } else {
              self.buildingServices.push(_.clone(serviceType));
            }
          })
        })

      this.service.listUsers({ filters: { isSupport: true } })
        .pipe(take(1)).subscribe(res => {
          this.supportUsers = res['data'];
        })
    }
  }

  buildingContacts: any;
  getBuildingContacts() {
    var self = this;
    if (!this.buildingContacts) {
      this.service.listBuildingContacts({ filters: { buildingId: this.building.id }, offset: 0, limit: 100 })
        .pipe(take(1)).subscribe(res => {
          this.buildingContacts = res['data'];
        })
    }
  }

  buildingNegotiations: any;
  getBuildingNegotiations() { }

  selectService(service) {
    var self = this;
    this.assigneeUsers = [];
    _.each(this.supportUsers, function(user) {
      var supportFlag = true;
      _.each(user.userRoles, function(role) {
        if (role.isSupport && role['user_roles'].assigneeType == service.serviceCode) {
          var assignedUser = _.find(service.assignees, { userId: user.id });
          if (!assignedUser) {
            self.assigneeUsers.push({ id: user.id, name: user.name, phone: user.phone })
          }
        }
      })
    })
  }

  saveService(service) {
    this.loading = true;
    service.buildingId = this.building.id;
    service.serviceCode = service.type;
    this.service.saveBuildingService(service)
      .pipe(take(1)).subscribe(res => {
        this.loading = false;
        if (res['data']) {
          service.id = res['data'].id;
        }
      })
  }

  supportUsers: any = [];
  assigneeUsers: any = [];
  assignee: any;
  assignUser(service) {
    this.loading = true;
    var data = {
      buildingServiceId: service.id,
      userId: this.assignee.id,
      active: 1
    }
    this.service.saveBuildingServiceAssignee(data)
      .pipe(take(1)).subscribe(res => {
        this.loading = false;
        if (res['data']) {
          service.assignees.push({ user: this.assignee });
          service.assignees = _.uniqBy(service.assignees, "id");
          this.assigneeUsers = _.reject(this.assigneeUsers, { id: this.assignee.id });

          this.assignee = null;
        }
      })
  }

  removeAssignee(service, user) {
    var self = this;
    this.loading = true;
    var data = {
      buildingServiceId: service.id,
      userId: user.id,
      active: 0
    }
    this.service.saveBuildingServiceAssignee(data)
      .pipe(take(1)).subscribe(res => {
        this.loading = false;
        if (res['data']) {
          service.assignees = _.reject(service.assignees, function(a) { return a.user.id == user.id });

          this.assigneeUsers.push(user);
          service.assignees = _.uniqBy(service.assignees, "id");
        }
      })
  }
}
