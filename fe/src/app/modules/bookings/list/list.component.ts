import { Component, OnInit, ViewChild } from '@angular/core';
import { ProductService } from 'src/app/shared/services/product.service';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { debounceTime, take } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HttpClient } from "@angular/common/http";
import { DialogsService } from 'src/app/shared/services/dialogs.services';
import { DataLayerService } from 'src/app/shared/services/data-layer.service';
import { BookingsService } from 'src/app/shared/services/bookings.service';
import { ReportsService } from 'src/app/shared/services/reports.service';

import { Helpers } from '../../../helpers';
import * as _ from 'lodash';

@Component({
  selector: 'bookings-list',
  templateUrl: './list.component.html'
})
export class BookingsListComponent implements OnInit {
  searchControl: FormControl = new FormControl();
  booking: any = {};
  @ViewChild('list') list: any;

  items: any = [];
  selectedItem: any = {};
  moreFilters: boolean = false;
  loading: boolean = false;
  noResults: boolean = false;
  offset: number = 0;
  limit: number = 20;
  filter: any = { statuses: ['New', 'Booked', "Active"], excludeStatuses: ['Cancelled', 'Settled'], deskType: ['PrivateOffice', 'EnterpriseOffice'], contractKind: [], contractTerm: ['LongTerm'] };
  user: any;
  listObservable: Observable<any[]>;
  totalBuildingWiseBookings:number=0;

  constructor(private dialogs: DialogsService, private service: BookingsService, private reports: ReportsService) { }

  ngOnInit() {
    var user = localStorage.getItem('cwo_user');
    if (user && user != '') {
      this.user = JSON.parse(user);
      if (this.user.geoTags) {
        if (this.user.geoTags.buildingIds && this.user.geoTags.buildingIds.length) {
          this.filter.buildingIds = this.user.geoTags.buildingIds;
        } else if (this.user.geoTags.locationIds && this.user.geoTags.locationIds.length) {
          this.filter.locationIds = this.user.geoTags.locationIds;
        } else if (this.user.geoTags.cityIds && this.user.geoTags.cityIds.length) {
          this.filter.cityIds = this.user.geoTags.cityIds;
        }
      }
    }
    this.searchControl.valueChanges
      .pipe(debounceTime(200))
      .subscribe(value => {
        console.log("Search Value :: ", value)
        this.filter.statuses = [];
        this.filter.search = value;
        this.resetList();
      });

    // this.newBooking();
  }

  newBooking() {
    var self = this;
    var dialog = this.dialogs.newBooking();
    dialog.result.then(function(data) {
      if (data) {
        self.dialogs.success("New booking is successful .. !", data.client.name)
        self.resetList();
      }
    })
  }

  loadMore() {
    console.log("loadmore :: ");
    if (!this.loading && !this.noResults) {
      this.loading = true;
      var data = { filters: this.filter, limit: this.limit, offset: this.offset };
      this.service.listBookings(data)
        .pipe(take(1)).subscribe((res) => {
          console.log("BookingList :: loadMore : res : ", res);
          if (res['data']) {
            this.items = this.items.concat(res['data']);
            this.loading = false;
            if (res['data'].length >= this.limit) {
              this.offset = this.offset + this.limit;
            } else {
              this.noResults = true;
            }
          } else {
            this.dialogs.error(res['error'], "Error")
          }
        });
    }
  }

  resetList() {
    this.offset = 0;
    this.limit = 20;
    this.items = [];
    this.noResults = false;
    this.loadMore();
    if (this.moreFilters) {
      this.loadBuildingBookings();
    }
  }

  selectBuilding(building) {
    if (building.id != this.selectedBuilding.id) {
      this.selectedBuilding = building;
    this.filter.buildingIds = [building.id];
    } else {
      this.selectedBuilding = {};
      this.filter.buildingIds = [];
    }
    this.resetList();
  }

  selectedBuilding: any = {};
  buildingBookings: any = [];
  loadBuildingBookings() {
    this.reports.loadBuildingBookings({ statuses: this.filter.statuses, excludes: this.filter.excludeStatuses, deskType: this.filter.deskType, contractKind: this.filter.contractKind, contractTerm: this.filter.contractTerm })
      .subscribe(res => {
        this.totalBuildingWiseBookings=0;
        this.buildingBookings = res['data'];
        for (let i = 0; i < res['data'].length; i++) {  //loop through the array
          this.totalBuildingWiseBookings += res['data'][i].count;  //Do the math!
          console.log(
            this.totalBuildingWiseBookings
          );
        }
        

      })
  }

}
