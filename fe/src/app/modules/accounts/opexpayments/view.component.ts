import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { ProductService } from 'src/app/shared/services/product.service';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { debounceTime, take } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { HttpClient } from "@angular/common/http";

import { environment } from 'src/environments/environment';
import { CommonService } from 'src/app/shared/services/common.service';
import { DialogsService } from 'src/app/shared/services/dialogs.services';
import { AdminService } from 'src/app/shared/services/admin.service';
import { AccountsService } from 'src/app/shared/services/accounts.service';
import { PurchasesService } from 'src/app/shared/services/purchases.service';

import { Utils } from 'src/app/shared/utils';
import * as _ from 'lodash';

declare let $: any;

@Component({
  selector: 'accounts-opex-payments',
  templateUrl: './view.component.html'
})
export class OpexPaymentsComponent implements OnInit, AfterViewInit {
  searchControl: FormControl = new FormControl();
  form: FormGroup;
  providerForm: FormGroup;

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

  providerTypes: any = ['Company', 'GovernmentFirm', 'Individual'];
  paymentModes: any = [{ label: 'Provider Portal', name: 'Online' },
  { name: 'BankTransfer', label: 'Bank Transfer' },
  { label: 'Other Mode', name: 'Other ' }];


  @ViewChild('opexPaymentModal') opexPaymentModal: any;
  isHq: any = 0;
  constructor(private dialogs: DialogsService, private service: AdminService, private route: ActivatedRoute,
    public accountsService: AccountsService, public purchasesService: PurchasesService) {
    this.isHq = parseInt(this.route.snapshot.params['ho']);
  }

  ngAfterViewInit() { }

  ngOnInit() {
    this.searchControl.valueChanges
      .pipe(debounceTime(200))
      .subscribe(value => {
        this.officesFilters.search = value;
        this.loadBuildings();
      });

    if (this.isHq) {
      this.selectedBuilding = { id: -1, name: "Head Office" };
      this.loadBuildingOpexPayments(this.selectedBuilding);
    } else {
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

    this.form = new FormGroup({
      // opexTypeId: new FormControl("", Validators.required),
      officeId: new FormControl(""),
      vendorId: new FormControl("", Validators.required),
      minCharge: new FormControl(""),
      maxCharge: new FormControl(""),
      effectiveFrom: new FormControl("", Validators.required),
      amountType: new FormControl("", Validators.required),
      amount: new FormControl(""),
      gst: new FormControl(""),
      tds: new FormControl(""),
      invoiceStartDay: new FormControl("", Validators.required),
      invoiceDay: new FormControl("", Validators.required),
      invoiceDueDay: new FormControl("", Validators.required),
      invoiceFrequency: new FormControl("", Validators.required),
      remindBeforeDays: new FormControl("", Validators.required),
      portalAccountId: new FormControl(""),
      portalUserName: new FormControl(""),
      portalPassword: new FormControl(""),
      portalUrl: new FormControl(""),
      additionalPaymentInfo: new FormControl(""),
      bankAccountNumber: new FormControl(""),
      bankIfscCode: new FormControl(""),
      bankAccountName: new FormControl(""),
      contactName: new FormControl(""),
      contactEmail: new FormControl(""),
      contactPhone: new FormControl(""),
    });

    this.providerForm = new FormGroup({
      name: new FormControl("", Validators.required),
      address: new FormControl("", Validators.required),
      paymentMode: new FormControl("", Validators.required),
      type: new FormControl("", Validators.required),
      contactName: new FormControl(""),
      contactEmail: new FormControl(""),
      contactPhone: new FormControl(""),
    });
  }

  onCountrySelected() {
    this.service.listCities({ filters: { countryId: this.selectedCountry.id, active: 1 }, offset: 0, limit: 100 }).pipe(take(1)).subscribe(
      res => {
        this.cities = res['data'];
        this.selectedCity = null;
        this.selectedLocation = null;
        this.selectedCity = res['data'][0];
        this.officesFilters = {
          countryId: this.selectedCountry.id,
        }
        this.onCitySelected();
      });
  }
  onCitySelected() {
    if (this.selectedCity) {

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
    } else {
      this.officesFilters = {
        countryId: this.selectedCountry.id
      }
      this.loadBuildings();
    }
  }
  onLocationSelected() {
    if (this.selectedLocation) {
      this.service.listLocations({ filters: { locationId: this.selectedLocation.id, active: 1 }, offset: 0, limit: 100 }).pipe(take(1)).subscribe(
        res => {
          this.officesFilters = {
            countryId: this.selectedCountry.id,
            cityId: this.selectedCity.id,
            locationId: this.selectedLocation.id,
          }
          this.loadBuildings();
        });
    } else {
      this.officesFilters = {
        countryId: this.selectedCountry.id,
        cityId: this.selectedCity.id,
      }
      this.loadBuildings();
    }
  }

  loadBuildings() {
    this.loading = true;
    this.officesFilters.cabinId = null;
    this.officesFilters.statuses = ['Live'];
    this.service.listBuildings({ filters: this.officesFilters }).pipe(take(1)).subscribe(
      res => {
        var buildings = res['data'];
        if (buildings.length) {
          this.buildings = buildings;
          this.loadBuildingOpexPayments(this.buildings[0]);
        } else {
          this.loadBuildingOpexPayments(this.selectedBuilding);
        }
        this.loading = false;
      }, error => {

      });
  }

  opexCategoryPayments: any = [];
  opexCategories: any = [];
  loadBuildingOpexPayments(building) {
    this.selectedBuilding = building;
    this.loading = true;
    this.officesFilters.cabinId = null;
    this.accountsService.listOpexPayments({
      filters: {
        search: this.officesFilters.search,
        buildingId: this.selectedBuilding.id
      }
    }).pipe(take(1)).subscribe(
        res => {
          var opexPayments = res['data']['payments'];
          this.opexCategories = res['data']['opexCategories'];
          var opexCategoryPayments = _(opexPayments)
            .groupBy(x => x.opexCategory)
            .map((value, key) => ({
              name: key,
              payments: value
            }))
            .value();

          _.each(opexCategoryPayments, function(opexCategoryPayment) {
            var officePayments = _(opexCategoryPayment.payments)
              .groupBy(x => x.office)
              .map((value, key) => ({
                name: key,
                payments: value
              }))
              .value();
            opexCategoryPayment.officePayments = officePayments;
            delete opexCategoryPayment.payments;
            opexCategoryPayment.payments = 0;

            _.each(opexCategoryPayment.officePayments, function(officePayment) {
              var opexTypePayments = _(officePayment.payments)
                .filter(object => object.opexType != null)
                .groupBy(x => x.opexType)
                .map((value, key) => ({
                  name: key,
                  payments: value
                }))
                .value();
              officePayment.opexTypePayments = opexTypePayments;
              delete officePayment.payments;
              _.each(opexTypePayments, function(payment) {
                opexCategoryPayment.payments = opexCategoryPayment.payments + payment.payments.length;
                if (payment.payments.length) {
                  opexCategoryPayment.vendorId = payment.payments[0].vendorId;
                  if (!opexCategoryPayment.vendorId) {
                    opexCategoryPayment.payment = payment.payments[0];
                  }
                }
              })
            })
          })

          opexCategoryPayments = _.orderBy(opexCategoryPayments, ['name'], ['asc']);
          this.opexCategoryPayments = opexCategoryPayments;
          console.log("opexCategoryPayments ::: ", opexCategoryPayments);
          this.loading = false;
        }, error => {

        });
  }

  openedModal: any;
  opexPayment: any;
  selectedVendor: any;
  vendors: any = [];
  openOpexPaymentModal(payment) {
    console.log("openOpexPaymentModal :: payment : ", payment);
    this.selectedVendor = null;
    this.vendors = [];
    this.vendor = null;
    this.opexCategory = null;
    this.opexType = null;
    this.opexItem = null;

    this.service.listOffices({ filters: { buildingId: this.selectedBuilding.id } })
      .pipe(take(1)).subscribe(res => {
        this.offices = res['data'];
      })
    if (payment.opexTypeId) {
      this.purchasesService.listVendors({ filters: { opexTypeId: payment.opexTypeId } })
        .pipe(take(1)).subscribe(res => {
          this.vendors = res['data'];

          if (payment.vendorId) {
            this.selectedVendor = _.find(this.vendors, { id: payment.vendorId });
            this.onVendorSelected();
          }
        })
    } else {
      this.accountsService.getOpexCategories({
        // office: this.isHq 
      })
        .pipe(take(1)).subscribe(res => {
          this.opexCategories = res['data'];
        })
    }
    if (payment.effectiveFrom) {
      payment.effectiveFrom = Utils.dateToNgbDate(payment.effectiveFrom);
    }

    this.opexPayment = _.clone(payment);
    this.openedModal = this.dialogs.modal(this.opexPaymentModal, { size: 'lg' });
    var self = this;
    this.openedModal.result.then(function(res) {
      self.form.reset();
    }).catch(function(e) {
      self.form.reset();
    })
  }

  onOpexTypeSelected() {
    if (this.opexType || this.opexItem) {
      this.selectedVendor = null;
      this.purchasesService.listVendors({ filters: { opexTypeId: this.opexItem ? this.opexItem.id : this.opexType.id } })
        .pipe(take(1)).subscribe(res => {
          this.vendors = res['data'];
        })
    }
  }
  onVendorSelected() {
    if (this.selectedVendor) {
      this.opexPayment.vendorId = this.selectedVendor.id;
      this.opexPayment.paymentMode = this.selectedVendor.paymentMode;
      if (this.selectedVendor.portal) {
        this.opexPayment.portalUrl = this.selectedVendor.portal.webUrl;
        this.opexPayment.additionalPaymentInfo = this.selectedVendor.portal.info;
        this.opexPayment.portalAccountId = this.selectedVendor.portal.accountId;
        this.opexPayment.portalUserName = this.selectedVendor.portal.username;
        this.opexPayment.portalPassword = this.selectedVendor.portal.password;
      } else if (this.opexPayment.paymentMode == 'Other' && !this.opexPayment.portalPaymentInfo) {

      }
    }
  }

  vendor: any = {};
  opexCategory: any;
  opexType: any;
  opexItem: any;
  save() {
    console.log("ServicePaymentsComponent ::: save :: opexPayment ", this.opexPayment);
    if (this.opexPayment.paymentMode == 'Online') {
      if (!this.opexPayment.portalUrl || !this.opexPayment.portalUserName || !this.opexPayment.portalPassword) {
        this.dialogs.error("Please enter valid online payment portal details");
        return false;
      }
    }
    if (this.opexPayment.paymentMode == 'BankTransfer' && this.selectedVendor && !this.selectedVendor.bankAccount) {
      this.dialogs.error("Please enter configure BankAccount for Service Provider");
      return false;
    }

    this.loading = true;
    var self = this;
    var opexPayment = _.clone(this.opexPayment);
    opexPayment.buildingId = this.selectedBuilding.id;
    if (opexPayment.office) {
      opexPayment.officeId = opexPayment.office.id;
    }
    if (!opexPayment.opexTypeId) {
      opexPayment.opexTypeId = this.opexItem ? this.opexItem.id : this.opexType.id
    }
    if (!opexPayment.benificiaryId) {
      opexPayment.effectiveFrom = Utils.ngbDateToMoment(opexPayment.effectiveFrom).format("YYYY-MM-DD");
    }

    this.accountsService.saveOpexPayment(opexPayment).pipe(take(1)).subscribe(
      res => {
        if (res['data']) {
          self.dialogs.success("ServicePayment of '" + this.selectedVendor.name + "' is saved successfully ");
          self.loading = false;
          self.selectedCity = null;
          self.opexPayment = null;
          this.vendors = [];
          this.loadBuildingOpexPayments(this.selectedBuilding);
          this.openedModal.close();

          this.selectedVendor = {};
          this.opexPayment = {};
          this.form.reset();
          this.vendor = {};
          this.providerForm.reset();
        } else if (res['error']) {
          self.dialogs.error(res['error'], 'Error while saving')
        }
      }, error => {
        self.dialogs.error(error, 'Error while saving')
      }
    )
  }

  approvePayment(aprroveLoading) {
    var data = {
      id: this.opexPayment.id,
      status: 'Approved'
    }
    aprroveLoading = true;
    this.accountsService.saveOpexPayment(data).pipe(take(1)).subscribe(
      res => {
        this.dialogs.success("ServicePayment of '" + this.selectedVendor.name + "' is approved successfully ");
        this.opexPayment.status = 'Approved';
        aprroveLoading = false;
        this.openedModal.close(true);
        this.loadBuildingOpexPayments(this.selectedBuilding);
      }, error => {
        this.dialogs.error(error, 'Error while saving')
      }
    )
  }
  declinePayment(declineLoading) {
    var data = {
      id: this.opexPayment.id,
      status: 'Declined'
    }
    declineLoading = true;
    this.accountsService.saveOpexPayment(data).pipe(take(1)).subscribe(
      res => {
        this.dialogs.success("ServicePayment of '" + this.selectedVendor.name + "' is approved successfully ");
        this.opexPayment.status = 'Approved';
        declineLoading = false;
        this.openedModal.close(true);

        this.loadBuildingOpexPayments(this.selectedBuilding);
      }, error => {
        this.dialogs.error(error, 'Error while saving')
      }
    )
  }

}
