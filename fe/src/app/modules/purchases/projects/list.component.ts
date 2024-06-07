import { Component, OnInit, ViewChild } from '@angular/core';
import { ProductService } from 'src/app/shared/services/product.service';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { debounceTime, take } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Router, NavigationEnd } from '@angular/router';
import { HttpClient } from "@angular/common/http";
import { DialogsService } from 'src/app/shared/services/dialogs.services';
import { AdminService } from 'src/app/shared/services/admin.service';
import { PurchasesService } from 'src/app/shared/services/purchases.service';
import { BookingsService } from 'src/app/shared/services/bookings.service';
import { ReportsService } from 'src/app/shared/services/reports.service';

import { Helpers } from '../../../helpers';
import * as _ from 'lodash';

@Component({
  selector: 'projects-list',
  templateUrl: './list.component.html'
})
export class ProjectsListComponent implements OnInit {
  selectedSku = new FormControl([]);
  searchControl: FormControl = new FormControl();
  projectForm: FormGroup;

  project: any = { contact: {} };
  config: any = {};
  @ViewChild('list') list: any;
  @ViewChild('projectModal') projectModal: any;

  openedModal: any;
  items: any = [];
  selectedItem: any = {};
  loading: boolean = false;
  noResults: boolean = false;
  offset: number = 0;
  limit: number = 20;
  filter: any = { statuses: ['Draft', 'InProgress'] };
  buildings: any = [];
  offices: any = [];
  bookings: any = [];
  purposes: any = ['Uplift', 'Client Customization', 'Tenant Change Upkeep', 'First Time Handover'];
  // statuses: any = ['Active', 'InActive', 'InProgress', 'Closed', 'OnHold', 'Deferred', 'Rejected'];
  statuses: any = ['Draft', 'InProgress', 'OnHold', 'Closed', 'Deferred'];

  constructor(public router: Router, private dialogs: DialogsService, private service: PurchasesService,
    private adminService: AdminService, private reportService: ReportsService, private bookingService: BookingsService) { }

  ngOnInit() {
    this.projectForm = new FormGroup({
      buildingId: new FormControl(""),
      officeId: new FormControl(""),
      bookingId: new FormControl(""),
      purpose: new FormControl("", Validators.required),
      subPurpose: new FormControl(""),
      estimatedBudget: new FormControl(""),
      status: new FormControl("", Validators.required),
      notes: new FormControl(""),
    });

    this.searchControl.valueChanges
      .pipe(debounceTime(200))
      .subscribe(value => {
        this.filter.search = value;
        this.resetList();
      });

    this.config = {
      columns: [
        { label: 'Building', field: 'building.name', type: 'text', styleClass: 'w-10', sortable: true },
        { label: 'Floor', field: 'office.name', type: 'text', styleClass: 'w-10', sortable: true },
        { label: 'Client', field: 'booking.client.company', type: 'text', styleClass: 'w-20', sortable: true },
        { label: 'Purpose', field: 'purpose', type: 'text', styleClass: 'w-15', sortable: true },
        { label: 'RefNo', field: 'refNo', type: 'text', styleClass: 'fs-10 w-10 text-right', sortable: true },
        { label: 'ProposedBy', field: 'proposedBy', type: 'text', styleClass: 'w-10 text-right', sortable: true },
        { label: 'ProposedOn', field: 'date', type: 'date', styleClass: 'w-10 text-right', sortable: true },
        { label: 'Budget', field: 'estimatedBudget', type: 'inr', styleClass: 'w-10 text-right', sortable: true },
        { label: 'Status', field: 'status', type: 'text', styleClass: 'w-5 text-right btn-sm', sortable: true },
      ],
      actions: [
        { icon: 'i-Pen-5', hint: 'Edit', code: 'edit', style: 'info' },
        { icon: 'i-Magnifi-Glass1', hint: 'View', code: 'view', style: 'info' },
      ],
      options: {
        debounceDelay: 500,
        actionStyleClass: 'w-10 icons-td text-center',
      }
    }

    this.resetList();
  }

  loadMore() {
    console.log("loadmore :: ");
    if (!this.loading && !this.noResults) {
      this.loading = true;
      var data = { filters: this.filter, limit: this.limit, offset: this.offset };
      this.service.listProjects(data)
        .pipe(take(1)).subscribe((res) => {
          console.log("ProjectsList :: loadMore : res : ", res);
          if (res['data']) {
            var data = res['data'];
            this.items = this.items.concat(data);
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

  moreFilters: any = true;
  resetList() {
    this.items = [];
    this.offset = 0;
    this.limit = 20;
    this.noResults = false;
    this.loadMore();
    if (this.moreFilters) {
      this.loadBuildingProjects();
      this.getProjectsByStatus();
    }
  }

  selectedBuilding: any = {};
  buildingProjects: any = [];
  projectsByStatuses: any = [];
  loadBuildingProjects() {
    this.reportService.loadBuildingProjects({
      statuses: this.filter.statuses
    }).subscribe(res => {
      this.buildingProjects = res['data'];
    })
  }

  totalProjectsCount: any = 0;
  getProjectsByStatus() {
    this.reportService.getProjectsByStatus({
      statuses: this.filter.statuses,
      buildingIds: this.filter.buildingIds
    }).subscribe(res => {
      this.projectsByStatuses = res['data'];
      console.log("Projects ::: getProjectsByStatus ::  statuses : ", this.projectsByStatuses);
      this.totalProjectsCount = _.sumBy(this.projectsByStatuses, 'count');
    })
  }

  openProjectModal(item?) {
    if (item) {
      this.project = _.clone(item);
    }
    this.openedModal = this.dialogs.modal(this.projectModal, { size: 'lg', backdrop: 'static' });
    var self = this;
    this.openedModal.result.then(function() {
      self.project = {};
      self.selectedBuilding = {};
      self.offices = [];
      self.bookings = [];
    }).catch(function(e) {
      self.project = {};
      self.selectedBuilding = {};
      self.offices = [];
      self.bookings = [];
    })

    this.adminService.listBuildings({}).subscribe(res => {
      this.buildings = res['data'];
    })
  }

  action(event) {
    console.log("ProjectsComponent ::: action :: event ", event);
    if (event.action == 'edit') {
      var project = _.clone(event.item);
      this.project = project;
      this.openProjectModal();
    } else if (event.action == 'view') {
      this.router.navigateByUrl('/purchases/project/' + event.item.id);
    }
  }

  autocompleteBuildings: any = [];
  onBuildingSearch(text: any) {
    var data = { filters: { name: text } }
    return this.adminService.listBuildings(data).pipe(take(1)).subscribe(
      res => {
        this.autocompleteBuildings = res['data'];
      })
  }

  onBuildingSelected() {
    this.loading = true;
    this.adminService.listOffices({ filters: { buildingId: this.project.buildingId } })
      .subscribe(res => {
        this.loading = false;
        this.offices = res['data'];
      })
  }

  onOfficeSelected() {
    this.loading = true;
    this.bookingService.listBookings({ filters: { statuses: ['Active', 'Booked', 'New'], officeId: this.project.officeId } })
      .subscribe(res => {
        this.loading = false;
        var bookings = res['data'];
        console.log("onOfficeSelected :: data : ", bookings);
        var self = this;
        this.bookings = [];
        _.each(bookings, function(b) {
          self.bookings.push({
            id: b.id,
            name: b.client.company
          })
        })

        console.log("onOfficeSelected :: Bookings : ", this.bookings);
      })
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

  saveProject() {
    this.loading = true;

    var project = _.clone(this.project);
    if (project.id) {
      project.title = this.project.building.name;
      if (this.project.office) {
        project.title = project.title + "-F" + this.project.office.name.split(" ")[0];
      }
      if (this.project.booking && this.project.booking.client) {
        project.title = project.title + "-" + this.project.booking.client.company.split(" ")[0];
      }
    } else {
      var building = _.find(this.buildings, { id: project.buildingId });
      if (building) {
        project.title = building.name;
      }
      if (project.officeId) {
        var office = _.find(this.offices, { id: project.officeId });
        if (office) {
          project.title = project.title = project.title + "-F" + office.name.split(" ")[0];
        }
      }
      if (project.bookingId) {
        var booking = _.find(this.bookings, { id: project.bookingId });
        if (booking) {
          project.title = project.title = project.title + "-" + booking.name.split(" ")[0];
        }
      }
    }
    if (this.project.subPurpose) {
      project.title = project.title + "-" + this.project.subPurpose.split(" ").join("-");
    } else {
      project.title = project.title + "-" + this.project.purpose.split(" ").join("-");
    }
    this.service.saveProject(project)
      .subscribe(res => {
        this.project = res['data'];
        this.openedModal.close();
        this.loading = false;
        this.resetList();
      }, err => {
        this.loading = false;
      })
  }

  @ViewChild('helpNotesModal') helpNotesModal: any;
  openHelpNotes() {
    this.openedModal = this.dialogs.modal(this.helpNotesModal, {});
  }

}
