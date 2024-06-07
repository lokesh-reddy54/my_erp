import { Component, OnInit, ViewChild } from '@angular/core';
import { ProductService } from 'src/app/shared/services/product.service';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { debounceTime , take} from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HttpClient } from "@angular/common/http";
import { DialogsService } from 'src/app/shared/services/dialogs.services';
import { AdminService } from 'src/app/shared/services/admin.service';
import { Helpers } from '../../../helpers';
import * as _ from 'lodash';

@Component({
  selector: 'admin-facilities',
  templateUrl: './facilities.component.html'
})
export class AdminFacilitiesComponent implements OnInit {
  form: FormGroup;
  facilityForm: FormGroup;

  setFilters: any = {};
  selectedFacilty: any;
  selectedFacilitySet: any;
  facility: any = {};
  facilitySet: any = {};
  location: any = {};
  facilityConfig: any = {};
  facilitySetConfig: any = {};
  locationConfig: any = {};
  @ViewChild('facilityModal') facilityModal: any;
  @ViewChild('facilitySetModal') facilitySetModal: any;
  @ViewChild('assignFacilitySetModal') assignFacilitySetModal: any;
  @ViewChild('facilityList') facilityList: any;
  @ViewChild('facilitySetList') facilitySetList: any;

  items: any = [];
  selectedItem: any = {};
  loading: boolean = false;
  noResults: boolean = false;
  offset: number = 0;
  limit: number = 20;
  facilityFilters: any = {};
  facilitySetFilters: any = {};
  locationFilters: any = {};

  facilitiesObservable: Observable<any[]>;

  constructor(private dialogs: DialogsService, private service: AdminService) { }

  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl("", Validators.required),
    });
    this.facilityForm = new FormGroup({
      name: new FormControl("", Validators.required),
    });

    // this.facilitySearch.valueChanges
    //   .pipe(debounceTime(200))
    //   .pipe(take(1)).subscribe(value => {
    //     this.facilitySetFilters.search = value;
    //   });

    this.facilityConfig = {
      columns: [
        { label: 'Name', field: 'name', type: 'text', styleClass: 'w-50', sortable: true },
        { label: 'Active', field: 'active', type: 'boolean', styleClass: 'w-5' },
      ],
      actions: [
        { icon: 'i-Pen-5', hint: 'Edit', code: 'editFacilty', style: 'info' }
      ],
      options: {
        debounceDelay: 500,
        actionStyleClass: 'w-25 icons-td',
      }
    }
    this.facilitySetConfig = {
      columns: [
        { label: 'Name', field: 'name', type: 'text', styleClass: 'w-50', sortable: true },
        { label: 'Active', field: 'active', type: 'boolean', styleClass: 'w-5' },
      ],
      actions: [
        { icon: 'i-Blinklist', hint: 'Assign Facilities', code: 'assignFacilities', style: 'primary' },
        { icon: 'i-Pen-5', hint: 'Edit', code: 'editFacilitySet', style: 'info' }
      ],
      options: {
        debounceDelay: 500,
        actionStyleClass: 'w-25 icons-td',
      }
    }
  }

  openedModal: any;
  openFacilityModal() {
    this.loading = false;
    this.openedModal = this.dialogs.modal(this.facilityModal, { size: 'md' });
    var self = this;
    this.openedModal.result.then(function() {
      self.facility = {};
    }).catch(function(e) {
      self.facility = {};
    })
  }
  openFacilitySetModal() {
    this.loading = false;
    this.openedModal = this.dialogs.modal(this.facilitySetModal, { size: 'md' });
    var self = this;
    this.openedModal.result.then(function() {
      self.facilitySet = {};
    }).catch(function(e) {
      self.facilitySet = {};
    })
  }
  openAssignFacilitySetModal() {
    this.loading = false;
    this.openedModal = this.dialogs.modal(this.assignFacilitySetModal, { size: 'lg' });
    var self = this;
    this.openedModal.result.then(function() {
      self.facilitySetList.reset();
    }).catch(function(e) {
      self.facilitySetList.reset();
    })
  }

  saveFacility() {
    console.log("LocationsComponent ::: save :: facility ", this.facility);
    this.loading = true;
    let self = this;
    this.service.saveFacility(this.facility).pipe(take(1)).subscribe(
      res => {
        self.dialogs.success("Location '" + this.facility.name + "' is saved successfully ");
        this.loading = false;
        self.facilityList.reset();
        this.openedModal.close();
      },
      error => {
        self.dialogs.error(error, 'Error while saving')
      }
    )
  }
  saveFacilitySet() {
    console.log("LocationsComponent ::: save :: facilitySet ", this.facilitySet);
    this.loading = true;
    let self = this;
    this.service.saveFacilitySet(this.facilitySet).pipe(take(1)).subscribe(
      res => {
        self.dialogs.success("Location '" + this.facilitySet.name + "' is saved successfully ");
        this.loading = false;
        self.facilitySetList.reset();
        this.openedModal.close();
      },
      error => {
        self.dialogs.error(error, 'Error while saving')
      }
    )
  }

  facilitiesList = [];
  assignedFacilities = [];
  unassignedFacilities = [];
  action(event) {
    console.log("LocationsComponent ::: action :: event ", event);
    if (event.action == 'editFacilty') {
      this.facility = _.clone(event.item);
      this.openFacilityModal();
    } else if (event.action == 'editFacilitySet') {
      this.facilitySet = _.clone(event.item);
      this.openFacilitySetModal();
    } else if (event.action == 'assignFacilities') {
      if (this.selectedFacilitySet) {
        this.selectedFacilitySet.selected = false;
      }
      this.selectedFacilitySet = event.item;
      event.item.selected = true;
      var data = {
        filters: { active: 1 }
      }
      this.assignedFacilities = event.item.facilities;
      this.service.listFacilities(data).pipe(take(1)).subscribe(
        res => {
          this.facilitiesList = res['data']
          var assignedIds = _.map(this.assignedFacilities, "id");
          this.unassignedFacilities = _.remove(this.facilitiesList, function(f) {
            return assignedIds.indexOf(f.id) == -1;
          })
        })
      this.openAssignFacilitySetModal();
    }
  }

  assign(facility) {
    this.loading = true;
    var data = {
      add: 1,
      setId: this.selectedFacilitySet.id,
      facilityId: facility.id
    }
    this.service.updateFacilitySetFacilities(data).pipe(take(1)).subscribe(
      res => {
        this.assignedFacilities.push(facility);
         this.unassignedFacilities = _.reject(this.unassignedFacilities, { id: facility.id });
        this.loading = false;
      })
  }

  unassign(facility) {
    this.loading = true;
    var data = {
      remove: 1,
      setId: this.selectedFacilitySet.id,
      facilityId: facility.id
    }
    this.service.updateFacilitySetFacilities(data).pipe(take(1)).subscribe(
      res => {
        this.unassignedFacilities.push(facility);
         this.assignedFacilities = _.reject(this.assignedFacilities, { id: facility.id });
        this.loading = false;
      })
  }


}
