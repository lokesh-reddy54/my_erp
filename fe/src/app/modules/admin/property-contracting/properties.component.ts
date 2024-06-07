import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { ProductService } from 'src/app/shared/services/product.service';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { debounceTime, take } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { FileUploader } from 'ng2-file-upload';
import { HttpClient } from "@angular/common/http";
// import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation } from 'ngx-gallery';
import { Options, ChangeContext, PointerType, LabelType } from 'ng5-slider';

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

@Component({
  selector: 'admin-properties',
  templateUrl: './properties.component.html'
})
export class AdminPropertiesComponent implements OnInit, AfterViewInit {
  @ViewChild('propertiesMapModal') propertiesMapModal: any;
  @ViewChild('propertyModal') propertyModal: any;
  @ViewChild('propertyMapModal') propertyMapModal: any;
  @ViewChild('propertyGalleryModal') propertyGalleryModal: any;

  propertyContractTargetForm: FormGroup;
  propertyContractUpdateForm: FormGroup;
  propertyContractForm: FormGroup;
  propertyContactForm: FormGroup;
  propertyForm: FormGroup;
  propertyBasicInfoForm: FormGroup;

  officeStatuses: any = [];
  property: any = {};

  countries: any = [];
  selectedCountry: any = {};
  cities: any = [];
  selectedCity: any = {};
  locations: any = [];
  selectedLocation: any = {};
  properties: any = [];
  selectedProperty: any = {};

  sqftMinValue: number = 5000;
  sqFtMaxValue: number = 100000;
  sqftSliderOptions: Options = {
    floor: 1000,
    ceil: 50000,
    translate: (value: number, label: LabelType): string => {
      switch (label) {
        case LabelType.Low:
          return '<b>Min :</b> ' + value + " SqFt";
        case LabelType.High:
          return '<b>Max:</b> ' + value + " SqFt";
        default:
          return value + " SqFt";
      }
    }
  };

  items: any = [];
  moreFilters: boolean = false;
  loading: boolean = false;
  noResults: boolean = false;
  offset: number = 0;
  limit: number = 20;
  minDate: any = new Date();

  propertyContactsFilters: any = {};

  constructor(private dialogs: DialogsService, private service: AdminService, private bookingsService: BookingsService,
    private uploadService: UploadService, public commonService: CommonService) {
    this.officeStatuses = ['New', 'UnderConsideration', 'Negotiating', 'TermsAgreed', 'Contracting', 'AgreementSigned']
  }

  ngAfterViewInit() {
    // $("#openPropertyModal").click();
  }

  ngOnInit() {
    // this.searchControl.valueChanges
    //   .pipe(debounceTime(200))
    //   .pipe(take(1)).subscribe(value => {
    //     this.filter.search = value;
    //   });
    // this.resourceSearch.valueChanges
    //   .pipe(debounceTime(200))
    //   .pipe(take(1)).subscribe(value => {
    //     this.resourceFilters.search = value;
    //   });

    this.propertyBasicInfoForm = new FormGroup({
      name: new FormControl("", Validators.required),
      street: new FormControl(""),
      landmark: new FormControl(""),
      address: new FormControl(""),
      lat: new FormControl(""),
      lng: new FormControl(""),
    });
    this.propertyForm = new FormGroup({
      size: new FormControl(""),
      floors: new FormControl(""),
      buildupArea: new FormControl(""),
      carpetArea: new FormControl(""),
      quarter: new FormControl(""),
      priority: new FormControl(""),
    });
    this.propertyContractForm = new FormGroup({
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
    this.propertyContractUpdateForm = new FormGroup({
      expectedSqftPrice: new FormControl("", Validators.required),
      expectedRent: new FormControl("", Validators.required),
      expectedDeposit: new FormControl("", Validators.required),
      expectedMaintenancePrice: new FormControl(""),
      expectedHandover: new FormControl("", Validators.required),
      expectedRentFree: new FormControl("", Validators.required),
      negotiatedSqftPrice: new FormControl("", Validators.required),
      negotiatedRent: new FormControl(", Validators.required"),
      negotiatedDeposit: new FormControl("", Validators.required),
      negotiatedMaintenancePrice: new FormControl(""),
      negotiatedHandover: new FormControl("", Validators.required),
      negotiatedRentFree: new FormControl("", Validators.required),
      comments: new FormControl(""),
    });
    this.propertyContractTargetForm = new FormGroup({
      targetedSqftPrice: new FormControl("", Validators.required),
      targetedRent: new FormControl("", Validators.required),
      targetedDeposit: new FormControl("", Validators.required),
      targetedRentFree: new FormControl("", Validators.required),
      comments: new FormControl(""),
    });
    this.propertyContactForm = new FormGroup({
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
        this.loadMoreProperties();
      });
  }

  mapProperties: any = [];
  loadAllProperties() {
    this.service.listBuildingProperties({ filters: {}, offset: 0, limit: 200 }).pipe(take(1)).subscribe(
      res => {
        var mapProperties = res['data'];
        this.mapProperties = _.orderBy(mapProperties, ['name', 'asc']);

        var currentStreets = _.map(_.filter(mapProperties, function(i) { return i.street != null }), 'street');
        // console.log("currentStreets :: ", currentStreets);
        if (currentStreets.length) {
          this.currentStreets = _.uniq(currentStreets);
        } else {
          this.currentStreets = [];
        }
        this.currentLandmarks = _.uniq(_.map(_.filter(mapProperties, function(i) { return i.landmark != null }), 'landmark'));
        console.log("currentLandmarks :: ", this.currentLandmarks);

        this.renderMap();
      }, error => { });
  }

  selectedStatuses: any = [];
  filters: any = {};
  loadMoreProperties() {
    if (this.selectedLocations && this.selectedLocations.length) {
      this.filters.locationIds = this.selectedLocations;
      this.service.listBuildingProperties({ filters: this.filters, offset: 0, limit: 200 }).pipe(take(1)).subscribe(
        res => {
          this.properties = res['data'];
          console.log("loadMoreProperties :: data : ", res['data']);

          // this.showPropertyContracts(this.properties[0]);
        }, error => {

        });
    }
  }

  saveProperty(property?) {
    if (property) {
      this.property = property;
    }
    console.log("PropertiesComponent ::: save :: property ", this.property);
    this.loading = true;
    let self = this;
    var property = _.clone(this.property);
    property.status = property.status || 'New';
    property.size = property.length + "x" + property.width;
    // property.handover = Utils.ngbDateToDate(this.property.handover);
    // property.expectedLive = Utils.ngbDateToDate(this.property.expectedLive);
    this.service.saveBuildingProperty(property).pipe(take(1)).subscribe(
      res => {
        self.dialogs.success("Property '" + this.property.name + "' is saved successfully ");
        this.loading = false;
        if (!this.property.id) {
          this.property = res['data'];
        }
        self.loadMoreProperties();
        this.loadPropertyImages();
      },
      error => {
        self.dialogs.error(error, 'Error while saving')
      }
    )
  }
  shortlistProperty(property?) {
    this.loading = true;
    let self = this;
    property = _.clone(property);
    property.shortlisted = !property.shortlisted;
    this.service.saveBuildingProperty(property).pipe(take(1)).subscribe(
      res => {
        self.dialogs.success("Property '" + property.name + "' is updated successfully ");
        this.loading = false;
      },
      error => {
        self.dialogs.error(error, 'Error while saving')
      }
    )
  }
  updateProperty(property?) {
    this.loading = true;
    let self = this;
    property = _.clone(property);
    this.service.saveBuildingProperty(property).pipe(take(1)).subscribe(
      res => {
        self.dialogs.success("Property '" + property.name + "' is updated successfully ");
        this.loading = false;
      },
      error => {
        self.dialogs.error(error, 'Error while saving')
      }
    )
  }

  savePropertyContract(approved?) {
    console.log("PropertiesComponent ::: save :: contact ", this.propertyContract);
    this.loading = true;
    let self = this;
    this.propertyContract.propertyId = this.property.id;
    var propertyContract = _.clone(this.propertyContract);
    if (!propertyContract.status) {
      propertyContract.status = 'Draft';
    } else if (approved) {
      propertyContract.status = 'Approved';
    }
    propertyContract.expectedHandover = Utils.ngbDateToDate(propertyContract.expectedHandover);
    propertyContract.negotiableHandover = Utils.ngbDateToDate(propertyContract.negotiableHandover);
    this.service.savePropertyContract(propertyContract).pipe(take(1)).subscribe(
      res => {
        if (approved) {
          self.dialogs.success("Property Contract is approved successfully ");
        } else {
          self.dialogs.success("Property Contract is saved successfully ");
        }
        this.propertyContract = res['data'];
        this.propertyContract.expectedHandover = Utils.dateToNgbDate(this.propertyContract.expectedHandover);
        this.propertyContract.negotiableHandover = Utils.dateToNgbDate(this.propertyContract.negotiableHandover);

        this.loading = false;
      },
      error => {
        self.dialogs.error(error, 'Error while saving')
      }
    )
  }

  showContactForm: boolean = false;
  savePropertyContact(contact?) {
    if (contact) {
      this.contact = contact;
    }
    console.log("PropertiesComponent ::: save :: contact ", this.contact);
    this.loading = true;
    let self = this;
    this.contact.propertyId = this.property.id;
    var contact = _.clone(this.contact);
    // contact.purposes = contact.purposes.join(",");
    var purposes = [];
    if (this.contact.owner) {
      purposes.push('Owner');
    }
    if (this.contact.writer) {
      purposes.push('Writer');
    }
    if (this.contact.contractor) {
      purposes.push('Contractor');
    }
    if (purposes.length) {
      contact.purposes = purposes.join(",");
    }
    this.service.savePropertyContact(contact).pipe(take(1)).subscribe(
      res => {
        self.dialogs.success("Contact '" + this.contact.name + "' is saved successfully ");
        this.loading = false;
        this.propertyContacts = null;
        this.getPropertyContacts();
        this.showContactForm = false;
        this.contact = {};
        this.propertyContactForm.reset();
      },
      error => {
        self.dialogs.error(error, 'Error while saving')
      }
    )
  }
  showNegotiationForm: boolean = false;
  showTargetForm: boolean = false;
  savePropertyContractUpdate() {
    console.log("PropertiesComponent ::: savePropertyContractUpdate :: propertyContractUpdate ", this.propertyContractUpdate);
    this.loading = true;
    let self = this;
    this.propertyContractUpdate.propertyId = this.property.id;
    this.propertyContractUpdate.propertyContractId = this.propertyContract.id;
    var propertyContractUpdate = _.clone(this.propertyContractUpdate);
    propertyContractUpdate.expectedHandover = Utils.ngbDateToDate(propertyContractUpdate.expectedHandover);
    propertyContractUpdate.negotiatedHandover = Utils.ngbDateToDate(propertyContractUpdate.negotiatedHandover);
    propertyContractUpdate.targetedHandover = Utils.ngbDateToDate(propertyContractUpdate.targetedHandover);
    this.service.savePropertyContractNegotiation(propertyContractUpdate).pipe(take(1)).subscribe(
      res => {
        self.dialogs.success("Contract Update is added successfully ");
        this.propertyNegotiations = null;
        this.propertyContractUpdate = {};
        this.propertyContractTargetForm.reset();
        this.propertyContractUpdateForm.reset();
        this.showNegotiationForm = false;
        this.showTargetForm = false;
        this.getPropertyNegotiations();
      }, error => {
        self.dialogs.error(error, 'Error while saving')
      }
    )
  }
  updatePropertyRent(type) {
    if (type == 'owner' && this.propertyContractUpdate.expectedSqftPrice) {
      if (this.propertyContractUpdate.carpetAreaPricing && this.property.carpetArea) {
        this.propertyContractUpdate.expectedRent = this.property.carpetArea * this.propertyContractUpdate.expectedSqftPrice;
      } else if (this.property.buildupArea) {
        this.propertyContractUpdate.expectedRent = this.property.buildupArea * this.propertyContractUpdate.expectedSqftPrice;
      }
    } else if (type == 'team' && this.propertyContractUpdate.negotiatedSqftPrice) {
      if (this.propertyContractUpdate.carpetAreaPricing && this.property.carpetArea) {
        this.propertyContractUpdate.negotiatedRent = this.property.carpetArea * this.propertyContractUpdate.negotiatedSqftPrice;
      } else if (this.property.buildupArea) {
        this.propertyContractUpdate.negotiatedRent = this.property.buildupArea * this.propertyContractUpdate.negotiatedSqftPrice;
      }
    }
  }
  updatePropertySqFtPrice(type) {
    if (type == 'owner' && this.propertyContractUpdate.expectedRent) {
      if (this.propertyContractUpdate.carpetAreaPricing && this.property.carpetArea) {
        this.propertyContractUpdate.expectedSqftPrice = this.propertyContractUpdate.expectedRent / this.property.carpetArea;
      } else if (this.property.buildupArea) {
        this.propertyContractUpdate.expectedSqftPrice = this.propertyContractUpdate.expectedRent / this.property.buildupArea;
      }
    } else if (type == 'team' && this.propertyContractUpdate.negotiatedRent) {
      if (this.propertyContractUpdate.carpetAreaPricing && this.property.carpetArea) {
        this.propertyContractUpdate.negotiatedSqftPrice = this.propertyContractUpdate.negotiatedRent / this.property.carpetArea;
      } else if (this.property.buildupArea) {
        this.propertyContractUpdate.negotiatedSqftPrice = this.propertyContractUpdate.negotiatedRent / this.property.buildupArea;
      }
    }
  }

  lat: any;
  lng: any;
  minLat: any; maxLat: any; minLng: any; maxLng: any;
  selectedMarker;
  markers = [];
  // mapFilters: any = { minSqft: 1000, maxSqft: 15000 };
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
  filteredProperties: any = [];
  renderMap() {
    var self = this;
    var index = 1;
    this.markers = [];
    var filteredProperties = _.filter(this.mapProperties, function(b) {
      var flag = true;
      if (self.mapFilters.statuses && self.mapFilters.statuses.length) {
        flag = false;
        var _b = self.mapFilters.statuses.indexOf(b.status);
        if (_b > -1) {
          flag = true;
        }
      } else if (self.mapFilters.street) {
        flag = b.street == self.mapFilters.street;
      } else if (self.mapFilters.landmark) {
        flag = b.landmark == self.mapFilters.landmark;
      } else if (self.mapFilters.minSqft && self.mapFilters.maxSqft) {
        flag = b.carpetArea >= self.mapFilters.minSqft && b.carpetArea <= self.mapFilters.maxSqft
      }
      return flag;
    })
    this.filteredProperties = filteredProperties;
    _.each(filteredProperties, function(b) {
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
    var self = this;
    setTimeout(function() {
      self.makeAsCenter(self.markers[0]);
    }, 1000)
  }

  hoverProperty(property, hover) {
    var marker = _.find(this.markers, { lat: property.lat, lng: property.lng });
    if (marker && property) {
      if (this.selectedMapProperty && this.selectedProperty.id != property.id) {
        this.selectedMapProperty.selected = false;
      }
      if (hover) {
        property.selected = true;
        marker.animation = 'BOUNCE';
      } else {
        property.selected = false;
        marker.animation = '';
      }
    }
  }

  makeAsCenter(property) {
    this.lat = property.lat;
    this.lng = property.lng;
  }
  showPropertyContracts(property) {
    this.property = property;
    this.activePropertyModalTab = "3";
    this.openPropertyModal(property);
  }
  selectedMapProperty: any;
  scrollToProperty(marker) {
    console.log("scrollToProperty ::: marker : ", marker);
    const element = document.getElementById("map-property-" + marker.label.text);
    if (element) {
      element.scrollIntoView({ block: 'center', behavior: 'smooth' });

      var index = parseInt(marker.label.text) - 1;
      if (this.selectedMapProperty) {
        this.selectedMapProperty.selected = false;
      }
      this.filteredProperties[index].selected = true;
      this.selectedMapProperty = this.filteredProperties[index];
    }
  }
  openedModal: any;
  currentStreets: any = [];
  currentLandmarks: any = [];
  openPropertiesMapModal() {
    this.openedModal = this.dialogs.modal(this.propertiesMapModal, { size: 'xlg' });
    var self = this;
    this.loadAllProperties();
    this.openedModal.result.then(function() {
      self.property = {};
    }).catch(function(e) {
      self.property = {};
    })
  }
  activePropertyModalTab: any = "0";
  propertyContract: any = {};
  propertyImages: any;

  openPropertyModal(property?) {
    this.property = property || {};
    this.openedModal = this.dialogs.modal(this.propertyModal, { size: 'xlg' });
    // this.property.handover = Utils.dateToNgbDate(this.property.handover);
    // this.property.expectedLive = Utils.dateToNgbDate(this.property.expectedLive);
    if (this.property.size) {
      var sizes = this.property.size.split("x");
      this.property.length = sizes[0];
      this.property.width = sizes[1];
    }
    this.propertyImages = null;
    this.getPropertyContacts();
    this.getPropertyNegotiations();
    this.loadPropertyImages();
    var self = this;
    this.openedModal.result.then(function() {
      self.property = {};
    }).catch(function(e) {
      self.property = {};
    })
  }

  contact: any = {};
  propertyContractUpdate: any = {};

  loadPropertyImages() {
    var self = this;
    this.listPropertyImages();
    this.uploader = new FileUploader({
      url: Helpers.composeEnvUrl() + "propertyImageUploads/" + this.property.id,
    });
    this.uploader.onCompleteAll = () => {
      console.log('openPropertyImagesModal :: onCompleteAll : ');
      this.listPropertyImages();
    };
  }

  listPropertyImages() {
    this.service.listPropertyImages({ filters: { propertyId: this.property.id } })
      .subscribe(res => {
        var propertyImages = res['data'];
        this.propertyImages = [];
        var self = this;
        _.each(propertyImages, function(f) {
          self.propertyImages.push({
            image: f.file,
            thumbImage: f.file, title: '', alt: '',
            updated: f['building_property_images'].updated,
            updatedBy: f['building_property_images'].updatedBy,
          });
        })
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

  propertyContacts: any;
  getPropertyContacts() {
    var self = this;
    this.service.listPropertyContacts({ filters: { propertyId: this.property.id }, offset: 0, limit: 100 })
      .pipe(take(1)).subscribe(res => {
        this.propertyContacts = res['data'];
      })
  }

  propertyNegotiations: any;
  getPropertyNegotiations() {
    var self = this;
    this.loading = true;
    this.service.listPropertyContractUpdates({ filters: { propertyId: this.property.id }, offset: 0, limit: 100 })
      .pipe(take(1)).subscribe(res => {
        this.propertyNegotiations = res['data'];
        this.loading = false;
      })
  }


  propertyMarker: any;
  galleryOptions: any;
  galleryImages: any;
  
  // galleryOptions: NgxGalleryOptions[];
  // galleryImages: NgxGalleryImage[];
  openPropertyGalleryModal(property?) {
    this.property = property;
    // this.galleryOptions = [{
    //   width: '100%',
    //   height: '100%',
    //   thumbnailsColumns: 5,
    //   imageAnimation: NgxGalleryAnimation.Slide
    // }, {
    //   breakpoint: 800,
    //   width: '100%',
    //   height: '600px',
    //   imagePercent: 80,
    //   thumbnailsPercent: 20,
    //   thumbnailsMargin: 20,
    //   thumbnailMargin: 20
    // }, {
    //   breakpoint: 400,
    //   preview: false
    // }];
    this.openedModal = this.dialogs.modal(this.propertyGalleryModal, { size: 'lg' });

    this.service.listPropertyImages({ filters: { propertyId: this.property.id } })
      .subscribe(res => {
        var propertyImages = res['data'];

        this.galleryImages = [];
        var self = this;
        _.each(propertyImages, function(i) {
          self.galleryImages.push({
            small: i.file,
            medium: i.file,
            big: i.file
          });
        })

      })
  }

  openPropertyMapModal(property?) {
    this.property = property;
    this.openedModal = this.dialogs.modal(this.propertyMapModal, { size: 'xlg' });

    this.propertyMarker = {
      fillColor: '#EC407A',
      label: {
        color: 'white',
        text: this.property.name,
        fontWeight: 'bold',
        fontSize: '14px',
      },
      animation: '',
      lat: this.property.lat,
      lng: this.property.lng,
      alpha: 1
    }
    this.markers = [this.propertyMarker];
    this.lat = this.property.lat;
    this.lng = this.property.lng;
    this.isMapReady = true;
    var self = this;
    this.openedModal.result.then(function() {
      self.property = {};
    }).catch(function(e) {
      self.property = {};
    })
  }


  sqftAreaImageFile: any;
  sqftAreaImageFileChange(event) {
    this.sqftAreaImageFile = event.target.files[0];
  }

  sqftAreaImageUploadResponse: any = { status: '', message: '', filePath: '' };
  sqftAreaImageFileError: any;

  uploadSqftAreaImageFile() {
    const formData = new FormData();
    formData.append('file', this.sqftAreaImageFile);

    this.loading = true;
    this.uploadService.upload(formData).subscribe(
      (res) => {
        this.sqftAreaImageUploadResponse = res;
        if (res.file) {
          this.loading = false;
          this.property.sqftAreaImage = res.file;
          this.sqftAreaImageFile = null;
          this.service.saveBuildingProperty({ id: this.property.id, sqftAreaImage: res.file })
            .pipe(take(1)).subscribe(res => this.dialogs.success("SqFT Area Math is uploaded successfully..!!"))
        }
      },
      (err) => this.sqftAreaImageFileError = err
    );
  }
}
