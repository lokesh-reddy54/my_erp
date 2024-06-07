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
  selector: 'booking-notifications',
  templateUrl: './view.component.html'
})
export class BookingNotificationComponent implements OnInit {
  searchControl: FormControl = new FormControl();
  to = new FormControl([]);
  form: FormGroup;

  notification: any = {};
  statuses: any = ['Reserved', 'Booked', 'Active', 'Exiting', 'TDSHolded', 'Exited', 'Settled'];
  config: any = {};
  @ViewChild('list') list: any;
  @ViewChild('notificationModal') notificationModal: any;
  @ViewChild('viewNotificationModal') viewNotificationModal: any;

  openedModal: any;
  items: any = [];
  selectedItem: any = {};
  loading: boolean = false;
  noResults: boolean = false;
  offset: number = 0;
  limit: number = 20;
  filter: any = {};

  notificationsObservable: Observable<any[]>;

  countries: any = [];
  selectedCountry: any = {};
  cities: any = [];
  selectedCity: any = {};
  locations: any = [];
  selectedLocation: any = {};
  buildings: any = [];
  selectedBuilding: any;
  selectedBuildings: any = [];
  offices: any = [];
  selectedOffice: any;

  constructor(private dialogs: DialogsService, private service: AdminService) { }

  ngOnInit() {
    this.form = new FormGroup({
      subject: new FormControl("", Validators.required)
    });

    this.searchControl.valueChanges
      .pipe(debounceTime(200))
      .subscribe(value => {
        this.filter.search = value;
      });

    this.config = {
      columns: [
        { label: 'Subject', field: 'subject', type: 'text', styleClass: 'w-35', sortable: true },
        { label: 'Receivers', field: 'receivers', type: 'text', styleClass: 'w-40', sortable: true },
        { label: 'Status', field: 'status', type: 'text', styleClass: 'w-5', sortable: true },
        { label: 'Created', field: 'date', type: 'dateTime', styleClass: 'w-15 text-center', sortable: true },
      ],
      actions: [
        { icon: 'i-Pen-5', hint: 'Edit', code: 'edit', style: 'info', condition: { label: 'status', value: 'Draft' } },
        { icon: 'i-Magnifi-Glass1', hint: 'View', code: 'view', style: 'info', condition: { label: 'status', value: 'Published' } },
      ],
      options: {
        debounceDelay: 500,
        actionStyleClass: 'w-5 icons-td text-center',
      }
    }
  }

  openNotificationModal() {
    this.service.listCountries({ filters: { active: 1 }, offset: 0, limit: 100 }).pipe(take(1)).subscribe(
      res => {
        this.countries = res['data'];
        this.selectedCountry = res['data'][0];
        this.onCountrySelected();
      });

    this.openedModal = this.dialogs.modal(this.notificationModal, { size: 'lg', backdrop: 'static' });
    var self = this;
    this.openedModal.result.then(function() {
      self.notification = {};
    }).catch(function(e) {
      self.notification = {};
    })
  }

  viewNotification(notification) {
    this.service.getNotification(notification.id).pipe(take(1)).subscribe(
      res => {
        this.notification = res['data'];
      });
    this.openedModal = this.dialogs.modal(this.viewNotificationModal, { size: 'lg', backdrop: 'static' });
    var self = this;
    this.openedModal.result.then(function() {
      self.notification = {};
    }).catch(function(e) {
      self.notification = {};
    })
  }

  save() {
    console.log("NotificationsComponent ::: save :: notification ", this.notification);
    this.loading = true;
    var self = this;
    var notification = _.clone(this.notification);
    notification.body = $(".fr-element").html();
    notification.status = "Draft";
    this.service.saveNotification(notification).pipe(take(1)).subscribe(
      res => {
        self.dialogs.success("Notification '" + this.notification.subject + "' is saved successfully ");
        self.loading = false;
        self.list.reset();
        this.openedModal.close();
      },
      error => {
        self.dialogs.error(error, 'Error while saving')
      }
    )
  }

  publish() {
    console.log("NotificationsComponent ::: publish :: notification ", this.notification);
    this.loading = true;
    var self = this;
    var notification = _.clone(this.notification);
    notification.body = $(".fr-element").html();
    notification.status = "Published";

    if (this.selectedCity && this.selectedCity.id) {
      notification.city = this.selectedCity;
    }
    if (this.selectedLocation && this.selectedLocation.id) {
      notification.locations = this.selectedLocation;
    }
    if (this.selectedBuilding && this.selectedBuilding.id) {
      notification.building = this.selectedBuilding;
    }
    if (this.selectedBuildings.length) {
      notification.buildingIds = this.selectedBuildings;
    }
    if (this.selectedOffice && this.selectedOffice.id) {
      notification.office = this.selectedOffice;
    }
    notification.statuses = [];
    if (notification.new) {
      notification.statuses.push("'New'");
    }
    if (notification.booked) {
      notification.statuses.push("'Booked'");
    }
    if (notification.active) {
      notification.statuses.push("'Active'");
    }
    if (notification.exiting) {
      notification.statuses.push("'Exiting'");
    }
    if (notification.exited) {
      notification.statuses.push("'Exited'");
    }
    if (notification.tdsHolded) {
      notification.statuses.push("'TDSHolded'");
    }
    if (notification.settled) {
      notification.statuses.push("'Settled'");
    }
    if (notification.clients && notification.clients.length) {
      notification.clientIds = _.map(notification.clients, 'id');
    }
    this.service.publishNotification(notification).pipe(take(1)).subscribe(
      res => {
        self.loading = false;
        if (res['data']) {
          self.dialogs.msg("Notification  is sent to " + res['data'] + " clients  successfully ");
          self.list.reset();
          this.openedModal.close();
        } else if (res['error']) {
          self.dialogs.error(res['error'])
        }
      },
      error => {
        self.dialogs.error(error, 'Error while saving')
        self.loading = false;
      }
    )
  }

  action(event) {
    console.log("NotificationsComponent ::: action :: event ", event);
    if (event.action == 'edit') {
      var notification = _.clone(event.item);
      this.notification = notification;
      this.openNotificationModal();
    } else if (event.action == 'view') {
      this.viewNotification(event.item);
    }
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

  onCitySelected() {
    this.service.listLocations({ filters: { cityId: this.selectedCity.id, active: 1 }, offset: 0, limit: 100 }).pipe(take(1)).subscribe(
      res => {
        this.locations = res['data'];
        this.selectedLocation = {};
        this.selectedLocation = res['data'][0];
        this.onLocationSelected();
      });
  }

  onLocationSelected() {
    if (this.selectedLocation && this.selectedLocation.id) {
      this.service.listBuildings({ filters: { locationId: this.selectedLocation.id,statuses:['Live'] }, offset: 0, limit: 100 }).pipe(take(1)).subscribe(
        res => {
          this.buildings = res['data'];
          this.selectedBuilding = res['data'];
        }, error => {

        });
    }
  }
  onBuildingSelected() {
    console.log("before if", this.selectedBuilding);
    if (this.selectedBuilding) {
      console.log("after if");
      this.service.listOffices({ filters: { buildingId: this.selectedBuilding.id }, offset: 0, limit: 20 }).pipe(take(1)).subscribe(
        res => {
          this.offices = res['data'];
        }, error => {

        });
    }
  }

  autocompleteEmails: any = [];
  onTextChange(text: any) {
    // if (text != "") {
    var data = { filters: { search: text } }
    return this.service.listClients(data).pipe(take(1)).subscribe(
      res => {
        this.autocompleteEmails = res['data'];
      })
    // }
  }

  searchUsers(text: any) {
    // if (text != "") {
    var data = { filters: { search: text } }
    return this.service.listUsers(data).pipe(take(1)).subscribe(
      res => {
        this.autocompleteEmails = res['data'];
      })
    // }
  }

}
