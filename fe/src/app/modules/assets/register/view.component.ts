import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { debounceTime, take } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HttpClient } from "@angular/common/http";

import { environment } from 'src/environments/environment';
import { Utils } from 'src/app/shared/utils';
import { CommonService } from 'src/app/shared/services/common.service';
import { DialogsService } from 'src/app/shared/services/dialogs.services';
import { AdminService } from 'src/app/shared/services/admin.service';
import { PurchasesService } from 'src/app/shared/services/purchases.service';
import { AssetsService } from 'src/app/shared/services/assets.service';
import { UploadService } from 'src/app/shared/services/upload.service';
import * as _ from 'lodash';
import * as moment from 'moment';

declare let $: any;

@Component({
  selector: 'assets-list',
  templateUrl: './view.component.html'
})
export class AssetsListComponent implements OnInit, AfterViewInit {
  searchControl: FormControl = new FormControl();
  loading: any = false;
  cabinsLoading: any = false;
  countries: any = [];
  selectedCountry: any;
  cities: any = [];
  selectedCity: any;
  locations: any = [];
  selectedLocation: any;

  assetsFilters: any = {};

  @ViewChild('newAssetsModal') newAssetsModal: any;
  @ViewChild('assignmentModal') assignmentModal: any;
  @ViewChild('movementModal') movementModal: any;
  @ViewChild('serviceProviderModal') serviceProviderModal: any;
  @ViewChild('warrentyModal') warrentyModal: any;
  @ViewChild('viewItemModal') viewItemModal: any;
  @ViewChild('viewAssetsModal') viewAssetsModal: any;
  @ViewChild('storesModal') storesModal: any;

  serviceProviderForm: FormGroup;
  warrentyForm: FormGroup;
  storeForm: FormGroup;

  constructor(private dialogs: DialogsService, private adminService: AdminService,
    public service: AssetsService, public purchasesService: PurchasesService, private uploadService: UploadService) {
  }

  ngAfterViewInit() { }

  ngOnInit() {
    this.searchControl.valueChanges
      .pipe(debounceTime(200))
      .pipe(take(1)).subscribe(value => {
        this.assetsFilters.search = value;
        this.loadBuildings();
      });

    this.warrentyForm = new FormGroup({
      purchasedDate: new FormControl("", Validators.required),
      warrentyPeriod: new FormControl("", Validators.required),
      expiryDate: new FormControl("", Validators.required),
    });

    this.storeForm = new FormGroup({
      name: new FormControl("", Validators.required),
      address: new FormControl("", Validators.required),
    });

    this.serviceProviderForm = new FormGroup({
      name: new FormControl("", Validators.required),
      phone: new FormControl("", Validators.compose([
        Validators.required,
        Validators.pattern('^[6,7,8,9][0-9]{9}$')
      ])),
      email: new FormControl("", Validators.compose([
        Validators.required,
        Validators.email
      ])),
      landline: new FormControl(""),
    });

    this.adminService.listCountries({ filters: { active: 1 }, offset: 0, limit: 100 }).pipe(take(1)).subscribe(
      res => {
        this.countries = res['data'];
        this.selectedCountry = res['data'][0];
        this.onCountrySelected();
      });
  }

  onCountrySelected() {
    this.adminService.listCities({ filters: { countryId: this.selectedCountry.id, active: 1 }, offset: 0, limit: 100 }).pipe(take(1)).subscribe(
      res => {
        this.cities = res['data'];
        this.selectedCity = null;
        this.selectedLocation = null;
        this.selectedCity = res['data'][0];
        this.onCitySelected();
      });
  }
  onCitySelected() {
    this.adminService.listLocations({ filters: { cityId: this.selectedCity.id, active: 1 }, offset: 0, limit: 100 }).pipe(take(1)).subscribe(
      res => {
        this.locations = res['data'];
        this.selectedLocation = null;
        this.selectedLocation = res['data'][0];
        this.getViewData();
      });
  }

  viewType: any = "Buildings";
  statuses: any = ['New', 'InUse'];
  getViewData() {
    this.assets = null;
    this.projectAssets = [];
    this.buildingAssets = [];
    this.statuses = ['New', 'InUse'];
    if (this.viewType == "Projects") {
      this.selectedProject = null;
      this.loadProjects();
    } else if (this.viewType == "Buildings") {
      this.statuses = ['New', 'InUse'];
      this.selectedBuilding = null;
      this.selectedBuildings = [];
      this.loadBuildings();
    } else if (this.viewType == "Stores") {
      this.statuses = ['InStore'];
      this.selectedStore = null;
      this.loadStores();
    } else if (this.viewType == "Trashed") {
      this.getTrashedAssets();
    }
    this.assets = null;
  }

  projects: any = [];
  selectedProject: any;
  loadProjects() {
    if (!this.projects.length) {
      this.loading = true;
      this.purchasesService.listProjects({
        filters: {
          locationId: this.selectedLocation.id,
          search: this.assetsFilters.search,
          // status: this.statuses
        }
      }).subscribe(res => {
        this.loading = false;
        this.projects = res['data'];
        // this.selectedProject = this.projects[9];
        // this.getProjectAssets();
      })
    }
  }
  buildings: any = [];
  selectedBuilding: any;
  selectedBuildings: any = [];
  loadBuildings() {
    this.loading = true;
    this.adminService.listBuildings({
      filters: {
        locationId: this.selectedLocation ? this.selectedLocation.id : null,
        search: this.assetsFilters.search,
        // status: this.statuses
      }
    }).subscribe(res => {
      this.loading = false;
      this.buildings = res['data'];
      this.selectedBuildings = [this.buildings[5]];
      this.getBuildingAssets();
    })
  }

  stores: any = [];
  selectedStore: any;
  loadStores() {
    if (!this.stores.length) {
      this.loading = true;
      this.service.listStores({
        filters: {
          locationId: this.selectedLocation.id
        }
      }).subscribe(res => {
        this.loading = false;
        this.stores = res['data'];
      })
    }
  }

  projectAssets: any = [];
  getProjectAssets() {
    if (this.selectedProject) {
      this.loading = true;
      this.service.listProjectAssets({ projectId: this.selectedProject.id, statuses: this.statuses })
        .subscribe(res => {
          this.assets = null;
          this.projectAssets = res['data'];
          this.loading = false;
        })
    } else {
      this.buildingAssets = [];
    }
  }
  buildingAssets: any = [];
  skuAssets: any = [];
  getBuildingAssets() {
    this.loading = true;
    var buildingIds = _.map(this.selectedBuildings, 'id');
    this.service.listAssetsRegistry({ buildingIds: buildingIds, statuses: this.statuses })
      .subscribe(res => {
        this.assets = null;
        var data = res['data'];
        var categories = _(data)
          .filter(object => object.category != null)
          .groupBy(x => x.category)
          .map((value, key) => ({
            name: key,
            types: value
          }))
          .value();

        _.each(categories, function(cat) {
          var types = _(cat.types)
            .filter(object => object.type != null)
            .groupBy(x => x.type)
            .map((value, key) => ({
              name: key,
              skus: value
            }))
            .value();
            cat.types = types;
        });
        console.log("AssetsRegisterComponent :::  getBuildingAssets :: categories : ", categories);
        this.skuAssets = categories;
        this.loading = false;
      })
  }
  getStoreAssets() {
    if (this.selectedStore) {
      this.loading = true;
      this.service.listStoreAssets({ storeId: this.selectedStore.id, statuses: this.statuses, search: this.assetsFilters.search })
        .subscribe(res => {
          this.assets = null;
          this.buildingAssets = res['data'];
          this.loading = false;
        })
    } else {
      this.buildingAssets = [];
    }
  }
  getTrashedAssets() {
    this.loading = true;
    this.statuses = ["Trashed"];
    this.service.listBuildingAssets({ statuses: this.statuses, search: this.assetsFilters.search })
      .subscribe(res => {
        this.assets = null;
        this.buildingAssets = res['data'];
        this.loading = false;
      })
  }
  currentAsset: any;
  getAssets(item) {
    this.loading = true;
    this.currentAsset = item;
    var id = item.assigned || item.id;
    this.service.getAssets({ id: id, statuses: this.statuses })
      .subscribe(res => {
        if (res['data']) {
          this.assets = res['data'];
        }
        this.checkSelection();
        this.selectAll(this.selectedAll);
        this.loading = false;
      })
  }

  openNewAssets() {
    this.openedModal = this.dialogs.modal(this.newAssetsModal, { size: 'lg', backdrop: 'static' });
  }

  newAssets: any = {};
  selectedVendor: any;
  selectedSku = new FormControl([]);
  selectedSkus: any = [];
  autocompleteSkus: any = [];
  onSKuSearch(text: any) {
    var data = { filters: { search: text, isAsset: 1 } }
    return this.purchasesService.searchSkus(data).pipe(take(1)).subscribe(
      res => {
        this.autocompleteSkus = res['data'];
      })
  }

  vendors: any = [];
  searchVendorSkus() {
    console.log("SearchVendorSkus :: selectedSkus : ", this.selectedSkus);
    if (this.selectedSkus.length) {
      this.loading = true;
      var data = { skuId: this.selectedSkus[0].skuId, quantity: 1 };
      this.purchasesService.searchVendorSkus(data).pipe(take(1)).subscribe(
        res => {
          console.log("SearchVendorSkus :: res : ", res['data']);
          this.loading = false;
          this.vendors = res['data'];
          this.selectedVendor = null;
          this.newAssets = {};
          if (!this.vendors.length) {
            this.dialogs.warning("No Vendor found registered for " + this.selectedSkus[0]['sku']);
          }
        })
    }
  }

  addTo: any;
  saveNewAssets() {
    var data: any = {
      skuId: this.selectedSkus[0].skuId,
      name: this.selectedSkus[0].sku,
      skuCatId: this.selectedSkus[0].skuCatId,
      count: this.newAssets.count,
      vendorId: this.selectedVendor ? this.selectedVendor.vendorId : null,
      addTo: this.addTo,
      price: this.newAssets.unitPrice
    }
    if (this.addTo == "ToBuilding") {
      data.buildingId = this.selectedBuilding ? this.selectedBuilding.id : null;
    } else if (this.addTo == "ToStore") {
      data.storeId = this.selectedStore ? this.selectedStore.id : null;
    }
    this.service.createAssetItems(data).subscribe(res => {
      if (this.addTo == "ToBuilding") {
        this.viewType = "Buildings";
        this.getBuildingAssets();
      } else {
        this.viewType = "Stores";
        this.getStoreAssets();
      }
      this.selectedSkus = [];
      this.selectedVendor = null;
      this.newAssets = {};
      this.addTo = null;
    })
  }

  assets: any;
  createAssets(item) {
    this.loading = true;
    item.projectId = this.selectedProject.id;
    item.buildingId = this.selectedProject.buildingId;
    this.service.createAssetItems(item).subscribe(res => {
      if (res['data']) {
        item.assigned = res['data'].id;
        item.selected = true;
        this.getAssets(item);
      }
      this.loading = false;
    })
  }

  openedModal: any;
  warrenty: any = {};
  addWarrenty(assets) {
    this.openedModal = this.dialogs.modal(this.warrentyModal, { size: 'sm', backdrop: 'static' });
    var self = this;
    this.openedModal.result.then(function() {
      self.warrenty = {};
    }).catch(function(e) {
      self.warrenty = {};
    })
  }
  updateExipiryDate() {
    if (this.warrenty.purchasedDate && this.warrenty.warrentyPeriod) {
      var expiryDate = Utils.ngbDateToMoment(this.warrenty.purchasedDate).add(this.warrenty.warrentyPeriod, 'months').toDate();
      this.warrenty.expiryDate = Utils.dateToNgbDate(expiryDate);
    }
  }
  saveWarrenty() {
    var warrenty = _.clone(this.warrenty);
    warrenty.purchasedDate = Utils.ngbDateToDate(this.warrenty.purchasedDate);
    warrenty.expiryDate = Utils.ngbDateToDate(this.warrenty.expiryDate);
    warrenty.assetId = this.assets.id;
    this.loading = true;
    this.service.saveAssetWarrenty(warrenty).subscribe(res => {
      if (res['data']) {
        this.assets.warrenty = res['data'];
        this.openedModal.close();
        this.warrentyForm.reset();
      }
      this.loading = false;
    })
  }

  serviceProvider: any = {};
  vendorServiceProviders: any = [];
  addServiceProvider(assets) {
    this.openedModal = this.dialogs.modal(this.serviceProviderModal, { size: 'md', backdrop: 'static' });
    this.service.listAssetServiceProviders({ filters: { vendorId: this.assets.vendorId } }).subscribe(res => {
      if (res['data']) {
        this.vendorServiceProviders = res['data'];
      }
    })
    var self = this;
    this.openedModal.result.then(function() {
      self.serviceProvider = {};
    }).catch(function(e) {
      self.serviceProvider = {};
    })
  }
  setServiceProvider() {
    var data: any = { id: this.assets.id }
    if (this.assets.assetServiceProviderId) {
      data.assetServiceProviderId = this.assets.assetServiceProviderId;
    }
    this.service.saveAsset(data).subscribe(res => {
      if (res['data']) {
        var serviceProvider = _.find(this.vendorServiceProviders, { id: this.assets.assetServiceProviderId });
        if (serviceProvider) {
          this.dialogs.success("Added " + serviceProvider.name + " is set successfully .! ");
        } else {
          this.dialogs.success("Removed ServiceProvider .!!");
        }
        this.assets.serviceProvider = serviceProvider;
      }
    });
  }
  newServiceProvider: any = false;
  saveServiceProvider(flag?) {
    var serviceProvider = _.clone(this.serviceProvider);
    serviceProvider.vendorId = this.assets.vendorId;
    this.loading = true;
    this.service.saveAssetServiceProvider(serviceProvider).subscribe(res => {
      if (res['data']) {
        this.assets.serviceProvider = res['data'];
        this.vendorServiceProviders.push(res['data']);
        if (flag) {
          this.service.saveAsset({ id: this.assets.id, assetServiceProviderId: res['data']['id'] }).subscribe();
          this.openedModal.close();
        } else {
          this.repairServiceProviderId = res['data']['id'];
        }
        this.serviceProviderForm.reset();
        this.serviceProvider = {};
        this.newServiceProvider = false;
      }
      this.loading = false;
    })
  }
  removeServiceProvider() {
    this.service.saveAsset({ id: this.assets.id, assetServiceProviderId: null }).subscribe(res => {
      this.assets.serviceProvider = null;
    });
  }

  currentAssetItem: any;
  assetBuilding: any;
  assetOffice: any;
  assetCabin: any;
  assetDesk: any;
  openAssignAssetItem(item) {
    this.currentAssetItem = item;
    this.openedModal = this.dialogs.modal(this.assignmentModal, { size: 'sm', backdrop: 'static' });

    this.assetBuilding = { id: this.currentAssetItem.assignment.buildingId };
    this.loading = true;
    this.adminService.listOffices({ filters: { buildingId: this.currentAssetItem.assignment.buildingId } })
      .subscribe(res => {
        this.loading = false;
        this.offices = res['data'];
        if (this.selectedProject.officeId) {
          this.assetOffice = _.find(this.offices, { id: this.selectedProject.officeId });
          this.onAssetOfficeSelected();
        }
      })
  }
  offices: any = [];
  cabins: any = [];
  onAssetOfficeSelected() {
    if (this.assetOffice) {
      this.loading = true;
      this.adminService.listCabins({ filters: { officeId: this.assetOffice.id } })
        .subscribe(res => {
          this.loading = false;
          this.cabins = res['data'];
        })
    } else {
      this.assetCabin = null;
      this.assetDesk = null;
    }
  }
  desks: any = [];
  onAssetCabinSelected() {
    if (this.assetCabin) {
      this.loading = true;
      this.adminService.listDesks({ filters: { cabinId: this.assetCabin.id } })
        .subscribe(res => {
          this.loading = false;
          this.desks = res['data'];
        })
    } else {
      this.assetDesk = null;
    }
  }
  assignItems() {
    this.loading = true;
    var items = [];
    if (this.selection) {
      var selectedItems = _.filter(this.assets.items, { selected: true });
      _.each(selectedItems, function(i) {
        var item = {
          id: i.id,
          assignmentId: i.assignment.id
        }
        items.push(item);
      })
    } else {
      var item = {
        id: this.currentAssetItem.id,
        assignmentId: this.currentAssetItem.assignment.id
      }
      items.push(item);
    }
    this.service.assignAssetItems({
      items: items,
      buildingId: this.assetBuilding.id,
      officeId: this.assetOffice ? this.assetOffice.id : null,
      cabinId: this.assetCabin ? this.assetCabin.id : null,
      deskId: this.assetDesk ? this.assetDesk.id : null,
    }).subscribe(res => {
      this.loading = false;
      if (res['data']) {
        this.getAssets(this.currentAsset);
        this.openedModal.close();
      }
    })
  }

  openMoveAssetItem(item) {
    this.currentAssetItem = item;
    this.moveTo = null;
    this.assetBuilding = null;
    this.selectedStore = null;
    this.repairServiceProviderId = null;
    this.openedModal = this.dialogs.modal(this.movementModal, { size: 'md', backdrop: 'static' });
  }
  moveTo: any;
  repairServiceProviderId: any;
  onMoveToChanged() {
    if (this.moveTo == "ToBuilding") {
      this.adminService.listBuildings({ filters: { locationId: this.selectedLocation.id } }).subscribe(res => {
        this.buildings = res['data'];
      })
    } else if (this.moveTo == "ToRepair") {
      this.service.listAssetServiceProviders({ filters: { vendorId: this.assets.vendorId } }).subscribe(res => {
        if (res['data']) {
          this.vendorServiceProviders = res['data'];
        }
      })
    } else if (this.moveTo == "ToStore") {
      this.service.listStores({ filters: { locationId: this.selectedLocation.id } }).subscribe(res => {
        if (res['data']) {
          this.stores = res['data'];
        }
      })
    }
  }
  confirmItemsMovement() {
    var items = [];
    if (this.selection) {
      var selectedItems = _.filter(this.assets.items, { selected: true });
      _.each(selectedItems, function(i) {
        var item = {
          id: i.id
        }
        items.push(item);
      })
    } else {
      var item = {
        id: this.currentAssetItem.id,
      }
      items.push(item);
    }
    if (this.assetBuilding || this.selectedStore || this.repairServiceProviderId || this.moveTo == 'ToTrash' || this.moveTo == 'SetAside') {
      this.loading = true;
      this.service.assignAssetItems({
        items: items,
        moveTo: this.moveTo,
        buildingId: this.assetBuilding ? this.assetBuilding.id : null,
        storeId: this.selectedStore ? this.selectedStore.id : null,
        assetServiceProviderId: this.repairServiceProviderId
      }).subscribe(res => {
        this.loading = false;
        if (res['data']) {
          this.getAssets(this.currentAsset);
          this.openedModal.close();
        }
      })
    } else {
      this.dialogs.error("Please select valid data.")
    }
  }

  warrentyFile: any = {};
  openViewAssetItem(item) {
    this.currentAssetItem = item;
    this.service.getAssetItem(item.id).subscribe(res => {
      var assignments = [];
      var movements = [];
      var item = res['data'];
      if (item) {
        _.each(item.assignments, function(a) {
          if (a.buildingId) {
            var assignedTo = a.building ? a.building.name : null;
            if (a.office) {
              assignedTo = assignedTo + ", " + a.office.name;
            }
            if (a.cabin) {
              assignedTo = assignedTo + ", " + a.cabin.name;
            }
            if (a.desk) {
              assignedTo = assignedTo + ", " + a.desk.name;
            }
            assignments.push({
              assignedTo: assignedTo,
              assignedBy: a.assignedBy,
              assignedOn: a.assignedOn,
            })
          }
          if (a.movement) {
            movements.push({
              purpose: a.movement.purpose,
              date: a.movement.date,
              building: a.movement.building ? a.movement.building.name : null,
              store: a.movement.store ? a.movement.store.name : null,
              serviceProvider: a.movement.serviceProvider ? a.movement.serviceProvider.name : null,
            })
          }
        })
      }
      this.currentAssetItem.assignments = assignments;
      this.currentAssetItem.movements = movements;
    })
    this.openedModal = this.dialogs.modal(this.viewItemModal, { size: 'lg', backdrop: 'static' });
  }

  warrentyFileImageFile: any;
  warrentyFileImageFileChange(event) {
    this.warrentyFileImageFile = event.target.files[0];
  }

  warrentyFileImageUploadResponse: any = { status: '', message: '', filePath: '' };
  warrentyFileImageFileError: any;
  uploadOpexBillImage() {
    const formData = new FormData();
    formData.append('file', this.warrentyFileImageFile);

    this.loading = true;
    this.uploadService.upload(formData).subscribe(
      (res) => {
        this.warrentyFileImageUploadResponse = res;
        if (res.file) {
          console.log("OpexBill ::: billuploaded :: warrentyFile : ", this.warrentyFile);
          this.loading = false;
          this.warrentyFile.image = res;
          this.warrentyFile.imageId = res.id;
          this.warrentyFileImageFile = null;
        }
      },
      (err) => this.warrentyFileImageFileError = err
    );
  }
  saveAssetItemWarrentyNo() {
    this.service.saveAssetItem({ id: this.currentAssetItem.id, warrentyNo: this.currentAssetItem.warrentyNo })
      .subscribe(res => {
        this.dialogs.success("Asset Item is updated .!");
        this.openedModal.close();
      });
  }

  editAssets() {
    this.currentAsset = _.clone(this.assets);
    this.openedModal = this.dialogs.modal(this.viewAssetsModal, { size: 'sm', backdrop: 'static' });
  }
  saveAsset() {
    this.loading = true;
    this.service.saveAsset({
      id: this.currentAsset.id,
      manufacturer: this.currentAsset.manufacturer,
      modelName: this.currentAsset.modelName
    }).subscribe(res => {
      this.assets.manufacturer = this.currentAsset.manufacturer;
      this.assets.modelName = this.currentAsset.modelName;
      this.openedModal.close();
      this.loading = false;
    });
  }

  selection: any = false;
  checkSelection() {
    var self = this;
    _.each(this.assets.items, function(i) {
      i.selection = self.selection;
    })
  }

  selectedAll: any = false;
  selectAll(flag?) {
    if (flag) {
      this.selectedAll = true;
    } else {
      this.selectedAll = false;
    }
    var self = this;
    _.each(this.assets.items, function(i) {
      i.selected = self.selectedAll;
    })
  }

  storeManagers: any = [];
  openStoresView() {
    this.openedModal = this.dialogs.modal(this.storesModal, { size: 'lg', backdrop: 'static' });
    this.service.listStoreManagers({}).subscribe(res => {
      if (res['data']) {
        this.storeManagers = res['data'];
      }
    })
  }

  store: any;
  newStore: any = false;
  saveStore() {
    var store = _.clone(this.store);
    store.locationId = this.selectedLocation.id;
    this.loading = true;
    this.service.saveStore(store).subscribe(res => {
      if (res['data']) {
        this.newStore = false;
        this.loadStores();
      }
      this.loading = false;
    })
  }
}
