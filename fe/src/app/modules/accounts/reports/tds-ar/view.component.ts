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
import { BookingsService } from 'src/app/shared/services/bookings.service';
import { UploadService } from 'src/app/shared/services/upload.service';
import * as _ from 'lodash';
import * as moment from 'moment';

declare let $: any;

@Component({
  selector: 'accounts-reports-tds-ar',
  templateUrl: './view.component.html'
})
export class AccountsTDSARReportComponent implements OnInit, AfterViewInit {
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
  quarters: any = [];
  selectedQuarter: any;
  selectedOffice: any;
  totalDue: any = 0;

  officesFilters: any = {};
  commentsConfig: any = {};
  commentsFilter: any = {};
  commentForm: FormGroup;
  tdsForm: FormGroup;
  @ViewChild('tdsModal') tdsModal: any;
  @ViewChild('commentsModal') commentsModal: any;

  constructor(private dialogs: DialogsService, private service: AdminService,
    public reportsService: ReportsService, private uploadService: UploadService, private bookingsService: BookingsService) {
  }

  ngAfterViewInit() { }

  ngOnInit() {
    this.commentForm = new FormGroup({
      comments: new FormControl("", Validators.required)
    });
    this.tdsForm = new FormGroup({
      amount: new FormControl("", Validators.required)
    });

    this.searchControl.valueChanges
      .pipe(debounceTime(200))
      .subscribe(value => {
        this.officesFilters.search = value;
        this.loadBuildings();
      });

    this.commentsSearchUpdate.pipe(
      debounceTime(500),
      distinctUntilChanged())
      .subscribe(value => {
        console.log("commentsSearchUpdate :: value:" + value);
        this.listARComments(value);
      });

    this.service.listCountries({ filters: { active: 1 }, offset: 0, limit: 100 })
      .pipe(take(1)).subscribe(
        res => {
          this.countries = res['data'];
          this.selectedCountry = res['data'][0];
          this.officesFilters.countryId = this.selectedCountry.id;
          this.onCountrySelected();
        });

    this.quarters.push({ label: moment().add(-1, 'years').year() + ' 1st Quarter', start: moment().add(-1, 'years').month(3).startOf('month'), end: moment().add(-1, 'years').month(5).endOf('month') })
    this.quarters.push({ label: moment().add(-1, 'years').year() + ' 2nd Quarter', start: moment().add(-1, 'years').month(6).startOf('month'), end: moment().add(-1, 'years').month(8).endOf('month') })
    this.quarters.push({ label: moment().add(-1, 'years').year() + ' 3rd Quarter', start: moment().add(-1, 'years').month(9).startOf('month'), end: moment().add(-1, 'years').month(11).endOf('month') })
    this.quarters.push({ label: moment().add(-1, 'years').year() + ' 4th Quarter', start: moment().month(0).startOf('month'), end: moment().month(2).endOf('month') })
    this.quarters.push({ label: moment().year() + ' 1st Quarter', start: moment().month(3).startOf('month'), end: moment().month(5).endOf('month') })
    this.quarters.push({ label: moment().year() + ' 2nd Quarter', start: moment().month(6).startOf('month'), end: moment().month(8).endOf('month') })
    this.quarters.push({ label: moment().year() + ' 3rd Quarter', start: moment().month(9).startOf('month'), end: moment().month(11).endOf('month') })
    this.quarters.push({ label: moment().year() + ' 4th Quarter', start: moment().month(0).startOf('month').add('years', 1), end: moment().month(2).endOf('month').add('years', 1) })
    this.quarters.push({ label: 'Custom Dates', custom: true })

    var self = this;
    console.log("Quarters :: ", this.quarters);
    _.each(this.quarters, function(q) {
      if (q.start && q.start.isBefore(moment()) && q.end && q.end.isAfter(moment())) {
        self.selectedQuarter = q;
        // self.onQuarterSelected();
      } else if (q.start && q.start.isAfter(moment())) {
        q.disabled = true;
      }
    })
  }

  onQuarterSelected() {
    if (this.selectedQuarter.custom) {
      var self = this;
      setTimeout(function() {
        var picker: any = $('#daterangepicker');
        picker.daterangepicker({
          opens: 'left',
          autoUpdateInput: false,
          // startDate: this.payinsFilters.startDate,
          // endDate: this.payinsFilters.endDate,
          ranges: {
            'This Year': [moment().startOf('year'), moment().endOf('year')]
          }
        }, function(start, end, label) {
          console.log("A new date selection was made: " + label);
          self.officesFilters.fromDate = start.format('YYYY-MM-DD');
          self.officesFilters.toDate = end.format('YYYY-MM-DD');
          self.loadBuildings();
        });
        picker.on('apply.daterangepicker', function(ev, picker) {
          $(this).val(picker.startDate.format('MM/DD/YYYY') + ' - ' + picker.endDate.format('MM/DD/YYYY'));
        });
        picker.on('cancel.daterangepicker', function(ev, picker) {
          $(this).val('');
          self.officesFilters.fromDate = null;
          self.officesFilters.toDate = null;
          self.loadBuildings();
        });
      }, 1000);
    } else {
      this.officesFilters.fromDate = this.selectedQuarter.start.add(9, 'hours');
      this.officesFilters.toDate = this.selectedQuarter.end;
      this.loadBuildings();
    }
  }

  onCountrySelected() {
    this.service.listCities({ filters: { countryId: this.selectedCountry.id, active: 1 }, offset: 0, limit: 100 }).pipe(take(1)).subscribe(
      res => {
        this.cities = res['data'];
        this.selectedCity = null;
        this.selectedLocation = null;
        this.officesFilters.countryId = this.selectedCountry.id
        this.onQuarterSelected();
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
      locationId: this.selectedLocation ?this.selectedLocation.id : null
    }
    this.loadBuildings();
  }

  sendTDSARNotifications() {
    this.loading = true;
    this.reportsService.sendTDSARNotifications(this.officesFilters).pipe(take(1)).subscribe(
      res => {
        this.loading = false;
        var bookings = res['data'];
        console.log("ReportsComponent ::: sendTDSARNotifications :: bookings : ", bookings);
        this.dialogs.success("TDS Due Notifications send to " + bookings + " clients ");
      }, error => {

      });
  }

  loadBuildings() {
    this.reportsService.getTDSAR(this.officesFilters).pipe(take(1)).subscribe(
      res => {
        var buildings = res['data'];
        this.totalDue = _.sumBy(buildings, 'tdsDue');
        buildings = _.orderBy(buildings, ['tdsDue'], ['desc']);
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
    this.reportsService.getTDSAR(this.officesFilters).pipe(take(1)).subscribe(
      res => {
        var offices = res['data'];
        offices = _.orderBy(offices, ['tdsDue'], ['desc']);
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
      this.reportsService.getTDSAR(this.officesFilters).pipe(take(1)).subscribe(
        res => {
          var bookings = res['data'];
          bookings = _.orderBy(bookings, ['tdsDue'], ['desc']);
          this.selectedOffice.bookings = bookings;
          console.log("selected bookings :: ", this.selectedOffice.bookings)
          this.loading = false;
        }, error => {

        });
    }
  }

  selectedBooking: any = {};
  invoices: any = [];
  openBookingTDS(booking?) {
    console.log("openBookingTDS : called ");
    this.selectedBooking = booking;
    this.invoices = [];
    this.officesFilters.bookingId = booking.bookingId;
    this.reportsService.getTDSAR(this.officesFilters).pipe(take(1)).subscribe(
      res => {
        if (res['data']) {
          this.invoices = res['data'];
          this.loading = false;
        } else {
          this.dialogs.error(res['error']);
        }
      }, error => {

      });

    this.openedModal = this.dialogs.modal(this.tdsModal, { size: 'lg' });
    var self = this;
    this.openedModal.result.then(function() {
      self.comment = {};
      self.commentsFilter = {};
    }).catch(function(e) {
      self.comment = {};
      self.commentsFilter = {};
    })
  }

  tdsPaidAmount: any = 0;
  tdsExtraPaid: any = 0;
  updateInvoiceTdsPaid() {
    var amount = this.tdsPaidAmount;
    _.each(this.invoices, function(i) {
      if (amount > i.tds) {
        i.tdsPaid = i.tds;
        amount = amount - i.tdsPaid
      } else if (amount > 0) {
        i.tdsPaid = amount;
        amount = 0;
      }
    })
    if (amount > 0) {
      this.tdsExtraPaid = amount;
      // this.dialogs.warning("Please check why client has paid Rs." + amount + " more TDS.");
    }
  }

  tdsFormFile: any;
  tdsUploadedForm: any;
  tdsFormFileChange(event) {
    this.tdsFormFile = event.target.files[0];
  }

  tdsFormUploadResponse: any = { status: '', message: '', filePath: '' };
  tdsFormFileError: any;

  uploadTdsFormFile() {
    const formData = new FormData();
    formData.append('file', this.tdsFormFile);

    this.loading = true;
    this.uploadService.upload(formData).subscribe(
      (res) => {
        this.tdsFormUploadResponse = res;
        if (res.file) {
          this.loading = false;
          this.tdsUploadedForm = res;
        }
      },
      (err) => this.tdsFormFileError = err
    );
  }

  submitTdsForm() {
    var self = this;
    var count = this.invoices.length;
    var index = 1;
    this.dialogs.confirm("Are you sure to Submit attached Form16A for this quarter .. ? ")
      .then(event => {
        if (event.value) {
          self.loading = true;
          _.each(self.invoices, function(i) {
            i.tdsForm = self.tdsUploadedForm.id;
            i.tdsSubmitted = true;
            self.bookingsService.saveInvoice(i)
              .pipe(take(1))
              .subscribe(res => {
                index++;
                if (index == count) {
                  self.dialogs.msg("Form 16A of amount Rs." + self.tdsPaidAmount + " is submitted for " + count + " invoices of " + self.selectedQuarter.label);
                  self.loading = false;
                }
              })
          })
        }
      })
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
