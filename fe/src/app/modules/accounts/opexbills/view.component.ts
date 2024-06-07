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
import { UploadService } from 'src/app/shared/services/upload.service';

import { Utils } from 'src/app/shared/utils';
import * as _ from 'lodash';
import * as moment from 'moment';

declare let $: any;

@Component({
  selector: 'accounts-opex-bills',
  templateUrl: './view.component.html'
})
export class OpexBillsComponent implements OnInit, AfterViewInit {
  searchControl: FormControl = new FormControl();
  form: FormGroup;
  providerForm: FormGroup;
  portalPaidForm: FormGroup;

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
  months: any = [];
  currentMonth: any = {};


  @ViewChild('opexBillModal') opexBillModal: any;
  isHq: any = 0;
  constructor(private dialogs: DialogsService, private service: AdminService, private route: ActivatedRoute,
    public accountsService: AccountsService, public uploadService: UploadService) {
    this.isHq = parseInt(this.route.snapshot.params['ho']);
  }

  providerTypes: any = ['Company', 'GovernmentFirm', 'Individual'];
  paymentModes: any = ['Online', 'BankTransfer', 'Cash'];

  ngAfterViewInit() { }

  ngOnInit() {
    this.searchControl.valueChanges
      .pipe(debounceTime(200))
      .subscribe(value => {
        this.officesFilters.search = value;
        this.loadBuildings();
      });

    this.form = new FormGroup({
      // opexTypeId: new FormControl("", Validators.required),
      officeId: new FormControl(""),
      serviceProviderId: new FormControl("", Validators.required),
      billDate: new FormControl("", Validators.required),
      amount: new FormControl("", Validators.required)
    });
    this.portalPaidForm = new FormGroup({
      utr: new FormControl("", Validators.required),
      paidDate: new FormControl("", Validators.required),
      notes: new FormControl("")
    });

    this.providerForm = new FormGroup({
      name: new FormControl("", Validators.required),
      address: new FormControl("", Validators.required),
      paymentMode: new FormControl("", Validators.required),
      type: new FormControl("", Validators.required)
    });

    var startMonth = moment("2019-04-01");
    var endMonth = moment().endOf('month');
    startMonth = endMonth.clone().add(-8, 'months');
    while (startMonth.isSameOrBefore(endMonth)) {
      this.months.push({
        title: startMonth.clone().format("MMM, YY"),
        month: startMonth.clone().format("M"),
        startDate: startMonth.clone().startOf('month'),
        endDate: startMonth.clone().endOf('month'),
      })
      startMonth.add(1, 'month');
    }
    this.currentMonth = this.months[this.months.length - 1];

    if (this.isHq) {
      this.selectedBuilding = { id: -1, name: "Head Office" };
      this.loadBuildingOpexBills(this.selectedBuilding, null, null);
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
        // this.buildings = [{ id: -1, name: "Head Office" }];
        // this.buildings = this.buildings.concat(buildings);
        if (buildings.length) {
          this.buildings = buildings;
          this.loadBuildingOpexBills(this.buildings[0], null, true);
        } else {
          this.loadBuildingOpexBills(null, null, true);
        }
        this.loading = false;
      }, error => {

      });
  }

  opexCategoryPayments: any = [];
  opexCategories: any = [];
  loadBuildingOpexBills(building?, month?, reload?) {
    console.log("OpexBills ::: loadBuildingOpexBills :: called ... ");
    if (building) {
      this.selectedBuilding = building;
      if (!building.months) {
        building.months = [];
        _.each(this.months, function(m) {
          building.months.push(_.clone(m));
        })
      }
    } else {
      building = this.selectedBuilding;
    }
    if (month) {
      this.currentMonth = _.clone(month);
    } else if (!month && building) {
      month = _.find(building.months, { month: this.currentMonth.month });
    }
    if (!month.opexCategoryBills || reload) {
      this.loading = true;
      this.officesFilters.cabinId = null;
      this.accountsService.listOpexBills({
        filters: {
          search: this.officesFilters.search,
          buildingId: this.selectedBuilding.id,
          dateFrom: month && month.startDate.format("YYYY-MM-DD HH:mm:ss"),
          dateTo: month && month.endDate.format("YYYY-MM-DD HH:mm:ss"),
        }
      }).pipe(take(1)).subscribe(
        res => {
          var opexBills = res['data'];

          var opexCategoryBills = _(opexBills)
            .groupBy(x => x.opexCategory)
            .map((value, key) => ({
              name: key,
              bills: value
            }))
            .value();

          _.each(opexCategoryBills, function(opexCategoryBill) {
            var officeBills = _(opexCategoryBill.bills)
              .groupBy(x => x.office)
              .map((value, key) => ({
                name: key,
                bills: value
              }))
              .value();
            opexCategoryBill.officeBills = officeBills;
            delete opexCategoryBill.bills;
            opexCategoryBill.bills = 0;
            opexCategoryBill.billsAmount = 0;

            _.each(opexCategoryBill.officeBills, function(officeBill) {
              var opexTypeBills = _(officeBill.bills)
                .filter(object => object.opexType != null)
                .groupBy(x => x.opexType)
                .map((value, key) => ({
                  name: key,
                  bills: value
                }))
                .value();
              officeBill.opexTypeBills = opexTypeBills;
              delete officeBill.bills;
              _.each(opexTypeBills, function(bill) {
                opexCategoryBill.bills = opexCategoryBill.bills + bill.bills.length;
                opexCategoryBill.billsAmount = opexCategoryBill.billsAmount + _.sumBy(bill.bills, 'amount');
                if (bill.bills.length) {
                  opexCategoryBill.serviceProviderId = bill.bills[0].serviceProviderId;
                  if (!opexCategoryBill.serviceProviderId) {
                    opexCategoryBill.bill = bill.bills[0];
                  }
                }
              })
            })
          })
          opexCategoryBills = _.orderBy(opexCategoryBills, 'name');
          console.log("opexCategoryBills ::: ", opexCategoryBills);
          month.opexCategoryBills = opexCategoryBills;
          this.loading = false;
        }, error => {

        });
    }
  }

  openedModal: any;
  opexBill: any;
  selectedServiceProvider: any;
  serviceProvider: any = {};
  serviceProviders: any = [];
  openOpexBillModal(payment) {
    this.selectedServiceProvider = null;
    this.serviceProviders = [];
    this.serviceProvider = null;
    this.opexCategory = null;
    this.opexType = null;
    this.opexItem = null;

    payment.billDate = Utils.dateToNgbDate(payment.billDate);
    this.service.listOffices({ filters: { buildingId: this.selectedBuilding.id } })
      .pipe(take(1)).subscribe(res => {
        this.offices = res['data'];
      })
    if (payment.opexTypeId) {
      this.service.listServiceProviders({ filters: { opexTypeId: payment.opexTypeId } })
        .pipe(take(1)).subscribe(res => {
          this.serviceProviders = res['data'];

          if (payment.serviceProviderId) {
            this.selectedServiceProvider = _.find(this.serviceProviders, { id: payment.serviceProviderId });
          }
        })
    } else {
      var data = { office: 1 };
      if (this.selectedBuilding.id > 0) {
        data.office = 0;
      }
      this.accountsService.getOpexCategories(data)
        .pipe(take(1)).subscribe(res => {
          this.opexCategories = res['data'];
        })
    }
    if (payment.effectiveFrom) {
      payment.effectiveFrom = Utils.dateToNgbDate(payment.effectiveFrom);
    }

    this.opexBill = _.clone(payment);
    this.openedModal = this.dialogs.modal(this.opexBillModal, { size: 'lg' });
    var self = this;
    this.openedModal.result.then(function() {
      self.opexBill = {};
    }).catch(function(e) {
      self.opexBill = {};
    })
  }

  onOpexTypeSelected() {
    if (this.opexType || this.opexItem) {
      this.service.listServiceProviders({ filters: { opexTypeId: this.opexItem ? this.opexItem.id : this.opexType.id } })
        .pipe(take(1)).subscribe(res => {
          this.serviceProviders = res['data'];
          this.selectedServiceProvider = null;
          this.opexBill.serviceProviderId = null;
        })
    }
  }

  onServiceProviderSelected() {
    if (this.selectedServiceProvider) {
      this.opexBill.serviceProviderId = this.selectedServiceProvider.id;
      this.opexBill.paymentMode = this.selectedServiceProvider.paymentMode;
    }
  }

  opexCategory: any;
  opexType: any;
  opexItem: any;
  save() {
    console.log("OpexBillsComponent ::: save :: opexBill ", this.opexBill);
    this.loading = true;
    var self = this;
    var opexBill = _.clone(this.opexBill);
    opexBill.buildingId = this.selectedBuilding.id;
    if (opexBill.billDate) {
      opexBill.billDate = Utils.ngbDateToMoment(opexBill.billDate).format("YYYY-MM-DD");
    }
    if (opexBill.paidOn) {
      opexBill.paidOn = Utils.ngbDateToMoment(opexBill.paidOn).format("YYYY-MM-DD");
    }

    if (opexBill.office && opexBill.office.id) {
      opexBill.officeId = opexBill.office.id;
    }
    if (!opexBill.opexTypeId) {
      opexBill.opexTypeId = this.opexItem ? this.opexItem.id : this.opexType.id
    }
    if (!opexBill.opexTypeId) {
      this.dialogs.error("Please select respective OpexType for this Bill")
      return;
    }

    if (opexBill.amountType == 'Variable' && opexBill.amount < opexBill.maxCharge && opexBill.amount > opexBill.minCharge) {
      opexBill.approvalRequired = false;
    }

    if (opexBill.opexPaymentId && !opexBill.approvalRequired && opexBill.paymentMode == 'BankTransfer' && opexBill.imageId) {
      opexBill.processPayout = true;
    }
    this.accountsService.saveOpexBill(opexBill).pipe(take(1)).subscribe(
      res => {
        self.dialogs.success("OpexBill of Rs.'" + opexBill.amount + "' for " + this.selectedServiceProvider.name + " is saved successfully ");
        self.loading = false;
        self.opexBill = null;
        this.serviceProviders = [];
        this.loadBuildingOpexBills(this.selectedBuilding, null, true);
        this.openedModal.close();
      }, error => {
        self.dialogs.error(error, 'Error while saving')
      }
    )
  }

  newProviderForm: any = false;
  saveProvider() {
    console.log("OpexBillsComponent ::: saveProvider :: serviceProvider ", this.serviceProvider);
    this.loading = true;
    var self = this;
    var serviceProvider = _.clone(this.serviceProvider);
    serviceProvider.opexTypeId = this.opexItem ? this.opexItem.id : this.opexType.id;
    this.service.saveServiceProvider(serviceProvider).pipe(take(1)).subscribe(
      res => {
        self.dialogs.success("ServiceProvider '" + serviceProvider.name + "' is saved successfully ");
        self.loading = false;
        self.serviceProvider = {};
        this.newProviderForm = false;
        this.serviceProviders.push(res['data']);
        this.selectedServiceProvider = res['data'];
        this.opexBill.serviceProviderId = this.selectedServiceProvider.id;
      }, error => {
        self.dialogs.error(error, 'Error while saving')
      }
    )
  }

  opexBillImageFile: any;
  opexBillImageFileChange(event) {
    this.opexBillImageFile = event.target.files[0];
  }

  opexBillImageUploadResponse: any = { status: '', message: '', filePath: '' };
  opexBillImageFileError: any;

  uploadOpexBillImage() {
    const formData = new FormData();
    formData.append('file', this.opexBillImageFile);

    this.loading = true;
    this.uploadService.upload(formData).subscribe(
      (res) => {
        this.opexBillImageUploadResponse = res;
        if (res.file) {
          console.log("OpexBill ::: billuploaded :: opexBill : ", this.opexBill);
          this.loading = false;
          this.opexBill.image = res;
          this.opexBill.imageId = res.id;
          this.opexBillImageFile = null;
          var data = {
            id: this.opexBill.id,
            billDate: Utils.ngbDateToMoment(this.opexBill.billDate).format("YYYY-MM-DD"),
            imageId: this.opexBill.imageId,
            paymentMode: this.opexBill.paymentMode,
            approvalRequired: this.opexBill.approvalRequired,
            info: "Bill of " + this.opexBill.providerName + " towards " + (this.opexBill.office ? this.opexBill.office : this.opexBill.building) + " of " + Utils.ngbDateToMoment(this.opexBill.billDate).format("MMM, YYYY"),
            billUploaded: true
          }

          this.accountsService.saveOpexBill(data).subscribe(
            res => {
              console.log("OpexBill ::: billuploaded :: ", res['data']);
              this.opexBill.id = res['data']['id'];
              this.opexBill.status = res['data']['status'];
              this.opexBill.indexNo = res['data']['indexNo'];
            })
        }
      },
      (err) => this.opexBillImageFileError = err
    );
  }

  markAsPaid() {
    this.loading = true;
    var data = {
      id: this.opexBill.id,
      utr: this.opexBill.utr,
      notes: this.opexBill.notes,
      paidOn: Utils.ngbDateToMoment(this.opexBill.paidOn).format("YYYY-MM-DD"),
      status: "Paid"
    }
    this.accountsService.saveOpexBill(data).subscribe(
      res => {
        this.loading = false;
        console.log("OpexBill ::: billuploaded :: ", res['data']);
        this.opexBill.status = res['data']['status'];
        this.openedModal.close();
        this.loadBuildingOpexBills(this.selectedBuilding, null, true);
      })
  }

  approveBill(bill) {
    this.loading = true;
    var towards = bill.office ? bill.office : bill.building;
    if (bill.buildingId < 0) {
      towards = "HeadOffice";
    }
    var data = {
      id: bill.id,
      prepaid: data.status == 'PrePaid' ? true : false,
      status: 'Approved',
      paymentMode: bill.paymentMode,
      approvalRequired: bill.approvalRequired,
      info: "Bill of " + bill.providerName + " towards " + towards + " of " + Utils.ngbDateToMoment(bill.billDate).format("MMM, YYYY"),
      // processPayout: bill.paymentMode == 'BankTransfer' ? true : false
      processPayout: true
    }
    this.accountsService.saveOpexBill(data).subscribe(
      res => {
        this.loading = false;
        console.log("OpexBill ::: approveBill :: ", res['data']);
        bill.status = res['data']['status'];
      })
  }

  raiseBills() {
    this.loading = true;
    this.accountsService.raiseOpexBills({}).pipe(take(1)).subscribe(
      res => {
        if (res['data']) {
          // this.dialogs.success("Recurring OpexBills are updated to till date. ");
          this.dialogs.success(res['data']);
          this.loadBuildingOpexBills(this.selectedBuilding, null, true);
        } else {
          this.dialogs.error(res['error']);
        }
        this.loading = false;
      },
      error => {
        this.dialogs.error(error, 'Error while saving')
      }
    )
  }

  onServiceProviderPaymentModeChanged() {
    if (this.serviceProvider.paymentMode == 'BankTransfer') {
      this.serviceProvider.hasContact = true;

      var validators = [Validators.required, Validators.minLength(8)];
      this.providerForm.addControl('bankAccountNumber', new FormControl('', validators));
      validators = [Validators.required, Validators.minLength(8)];
      this.providerForm.addControl('bankIfscCode', new FormControl('', validators));
      validators = [Validators.required, Validators.minLength(8)];
      this.providerForm.addControl('accountHolderName', new FormControl('', validators));

      validators = [Validators.required, Validators.minLength(5)];
      this.providerForm.addControl('contactName', new FormControl('', validators));
      validators = [Validators.required, Validators.email];
      this.providerForm.addControl('contactEmail', new FormControl('', validators));
      validators = [Validators.required, Validators.pattern('^[6,7,8,9][0-9]{9}$')];
      this.providerForm.addControl('contactPhone', new FormControl('', validators));
    } else {
      this.providerForm.removeControl('bankAccountNumber');
      this.providerForm.removeControl('bankIfscCode');
      this.providerForm.removeControl('accountHolderName');
      this.providerForm.removeControl('contactName');
      this.providerForm.removeControl('contactEmail');
      this.providerForm.removeControl('contactPhone');
    }
    this.providerForm.updateValueAndValidity();
  }
}
