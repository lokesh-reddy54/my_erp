import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { debounceTime, take } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HttpClient } from "@angular/common/http";
import { DialogsService } from 'src/app/shared/services/dialogs.services';
import { CommonService } from 'src/app/shared/services/common.service';
import { AdminService } from 'src/app/shared/services/admin.service';
import { Helpers } from '../../../helpers';
import * as _ from 'lodash';

@Component({
  selector: 'admin-users',
  templateUrl: './users.component.html'
})
export class AdminUsersComponent implements OnInit {
  searchControl: FormControl = new FormControl();
  form: FormGroup;

  user: any = {};
  // roles: any = ['Admin', 'BookingExecutive', 'SupportExecutive', 'SalesExecutive', 'OperationsExecutive', 'AccountsExecutive'];
  config: any = {};
  @ViewChild('list') list: any;
  @ViewChild('userModal') userModal: any;

  openedModal: any;
  items: any = [];
  selectedItem: any = {};
  loading: boolean = false;
  noResults: boolean = false;
  offset: number = 0;
  limit: number = 30;
  filter: any = {};

  usersObservable: Observable<any[]>;

  assigneeTypes: any = [];
  supportLevels: any = [];

  constructor(private dialogs: DialogsService, private service: AdminService, private commonService: CommonService) {
    this.assigneeTypes = this.commonService.values.ticketAssigneeTypes;
    this.supportLevels = this.commonService.values.ticketSupportLevels;
  }
  
  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl("", Validators.required),
      phone: new FormControl("", Validators.compose([
        Validators.required,
        Validators.pattern('^[6,7,8,9][0-9]{9}$')
      ])),
      email: new FormControl("", Validators.compose([
        Validators.required,
        Validators.email
      ])),
      password: new FormControl("", Validators.compose([
        Validators.maxLength(20),
        Validators.minLength(3),
        Validators.required
      ]))
    });

    this.searchControl.valueChanges
      .pipe(debounceTime(200))
      .subscribe(value => {
        this.filter.search = value;
      });

    this.config = {
      columns: [
        { label: 'Name', field: 'name', type: 'text', styleClass: 'w-20', sortable: true },
        // { label: 'UserName', field: 'username', type: 'text', styleClass: 'w-10', sortable: true },
        { label: 'Email', field: 'email', type: 'text', styleClass: 'w-20', sortable: true },
        { label: 'Phone', field: 'phone', type: 'text', styleClass: 'w-10', sortable: true },
        { label: 'Roles', field: 'roles', type: 'text', styleClass: 'w-25', sortable: true },
        { label: 'Created', field: 'added', type: 'date', styleClass: 'w-10 text-center', sortable: true },
        { label: 'Active', field: 'active', type: 'boolean', styleClass: 'w-5 text-center', sortable: true },
        // { label: 'Last Login', field: 'lastLogin', type: 'dateTime', styleClass: 'w-20 text-center', sortable: true },
      ],
      actions: [
        { icon: 'i-Pen-5', hint: 'Edit', code: 'edit', style: 'info' },
        { icon: 'i-Folder-Trash', hint: 'Delete', code: 'delete', style: 'danger' }
      ],
      options: {
        debounceDelay: 500,
        actionStyleClass: 'w-10 icons-td text-center',
      }
    }
  }

  roles: any = [];
  openUserModal(content) {
    this.userRoles = [];
    this.citiesWithBuildings = [];
    this.cities = [];
    this.locations = [];
    this.buildings = [];

    this.service.listRoles({}).pipe(take(1)).subscribe(
      res => {
        this.roles = res['data'];
        var self = this;
        _.each(this.user.userRoles, function(role) {
          var _role: any = { roleId: role.id, name: role.name, isGeoSpecific: role.isGeoSpecific, isSupport: role.isSupport };
          if (role.isGeoSpecific) {
            if (role['user_roles'] && role['user_roles'].cityIds) {
              _role.cityIds = role['user_roles'].cityIds.split(",");
            }
            if (role['user_roles'] && role['user_roles'].locationIds) {
              _role.locationIds = role['user_roles'].locationIds.split(",");
            }
            if (role['user_roles'] && role['user_roles'].buildingIds) {
              _role.buildingIds = role['user_roles'].buildingIds.split(",");
            }
          }
          if (role.isSupport) {
            if (role['user_roles'].assigneeTypes && role['user_roles'].assigneeTypes != '') {
              _role.assigneeTypes = role['user_roles'].assigneeTypes.split(",");
            }
            _role.supportLevel = role['user_roles'].supportLevel;
          }
          if (role.isSupport || role.isGeoSpecific) {
            self.userRoles.push(_role);
          }
        })

        if (this.userRoles.length) {
          this.service.getCitiesWithBuildings({})
            .subscribe(res => {
              if (res['data']) {
                this.citiesWithBuildings = res['data'];
                _.each(this.userRoles, function(role) {
                  self.updateRoleSelections(role);
                })
              }
            })
        }
      })
    console.log("UserRoles :: ", this.user.userRoles);
    this.openedModal = this.dialogs.modal(content, { size: 'lg', backdrop: 'static' });
    var self = this;
    this.openedModal.result.then(function() {
      self.user = {};
    }).catch(function(e) {
      self.user = {};
    })
  }

  save() {
    console.log("UsersComponent ::: save :: user ", this.user);
    this.loading = true;
    var self = this;
    var user = _.clone(this.user);
    user.roles = [];
    _.each(user.userRoles, function(role) {
      if (role) {
        user.roles.push(role.name);
      }
    })
    user.roles = user.roles.join(", ");
    _.each(user.userRoles, function(role) {
      var userRole = role['user_roles'];
      if (userRole) {
        if (role.isGeoSpecific) {
          role.cityIds = role.cityIds ? role.cityIds : userRole.cityIds;
          role.locationIds = role.locationIds ? role.locationIds : userRole.locationIds;
          role.buildingIds = role.buildingIds ? role.buildingIds : userRole.buildingIds;
        }
        if (role.isSupport) {
          role.assigneeTypes = role.assigneeTypes && role.assigneeTypes.length ? role.assigneeTypes : userRole.assigneeTypes;
          role.supportLevel = role.supportLevel ? role.supportLevel : userRole.supportLevel;
        }
      }
    })
    this.service.saveUser(user).pipe(take(1)).subscribe(
      res => {
        self.dialogs.success("User '" + this.user.name + "' is saved successfully ");
        self.loading = false;
        self.list.reset();
        this.openedModal.close();
      },
      error => {
        self.dialogs.error(error, 'Error while saving')
      }
    )
  }

  action(event) {
    console.log("UsersComponent ::: action :: event ", event);
    if (event.action == 'edit') {
      var user = _.clone(event.item);
      user.roles = user.roles ? user.roles.split(",") : [];
      this.user = user;
      this.openUserModal(this.userModal);
    } else if (event.action == 'delete') {
      this.delete(_.clone(event.item));
    }
  }

  delete(item) {
    if (item.id) {
      let self = this;
      this.dialogs.confirm("Are you sure to delete User '" + item.name + "'?")
        .then(function(event) {
          console.log("UsersComponent ::: delete :: swal event ", event);
          if (event.value) {
            self.loading = true;
            self.service.deleteUser(item.id).pipe(take(1)).subscribe(
              res => {
                self.dialogs.success("User '" + item.name + "' is deleted successfully ")
                self.loading = false;
                self.list.reset();
              },
              error => {
                self.dialogs.error(error, 'Error while deleting')
              }
            )
          } else if (event.dismiss) {
            self.dialogs.warning('User deletion action is cancelled  ')
          }
        })
    }
  }

  isSupportUser: any = false;
  userRoles: any = [];
  citiesWithBuildings: any = [];
  cities: any = [];
  locations: any = [];
  buildings: any = [];

  onRoleAdded(item) {
    console.log("UserComponents ::: onRoleAdded :: item : ", item);
    if (item.isGeoSpecific) {
      this.userRoles.push({
        roleId: item.id, name: item.name,
        isGeoSpecific: item.isGeoSpecific,
        isSupport: item.isSupport, isProcessed: true
      });

      if (this.citiesWithBuildings.length == 0) {
        this.service.getCitiesWithBuildings({})
          .subscribe(res => {
            if (res['data']) {
              this.citiesWithBuildings = res['data'];
            }
          })
      }
    }
  }

  onRoleRemoved(item) {
    console.log("UserComponents ::: onRoleRemoved :: item : ", item.value);
    if (item.value.isGeoSpecific) {
      this.userRoles = _.reject(this.userRoles, { roleId: item.value.id });
    }
  }

  onCitySelected(role) {
    this.locations = [];
    var self = this;
    _.each(role.cityIds, function(cityId) {
      var city = _.find(self.citiesWithBuildings, { id: cityId });
      self.locations = self.locations.concat(city.locations);
    })
    var _role = _.find(this.user.userRoles, { id: role.roleId });
    _role.cityIds = role.cityIds.join(",");
  }

  onLocationSelected(role) {
    this.buildings = [];
    var self = this;
    _.each(role.locationIds, function(locationId) {
      var location = _.find(self.locations, { id: locationId });
      self.buildings = self.buildings.concat(location.buildings);
    })
    var _role = _.find(this.user.userRoles, { id: role.roleId });
    _role.locationIds = role.locationIds.join(",");
  }

  onBuildingSelected(role) {
    var _role = _.find(this.user.userRoles, { id: role.roleId });
    _role.buildingIds = role.buildingIds.join(",");
  }

  onSupportLevelSelected(role) {
    var _role = _.find(this.user.userRoles, { id: role.roleId });
    _role.supportLevel = role.supportLevel;
  }

  onAssigneeTypeSelected(role) {
    var _role = _.find(this.user.userRoles, { id: role.roleId });
    if (role.assigneeTypes && role.assigneeTypes.length) {
      _role.assigneeTypes = role.assigneeTypes.join(",");
    } else {
      _role.assigneeTypes = null;
    }
  }

  updateRoleSelections(role) {
    var self = this;
    this.locations = [];
    this.buildings = [];
    var cityIds = [];
    var locationIds = [];
    var buildingIds = [];

    _.each(role.cityIds, function(cityId) {
      cityId = parseInt(cityId);
      cityIds.push(cityId);
      var city = _.find(self.citiesWithBuildings, { id: cityId });
      if (city) {
        self.locations = self.locations.concat(city.locations);
      }
    })
    _.each(role.locationIds, function(locationId) {
      locationId = parseInt(locationId);
      locationIds.push(locationId);
      var location = _.find(self.locations, { id: locationId });
      if (location) {
        self.buildings = self.buildings.concat(location.buildings);
      }
    })
    _.each(role.buildingIds, function(buildingId) {
      buildingId = parseInt(buildingId);
      buildingIds.push(buildingId);
    });

    role.cityIds = cityIds;
    role.locationIds = locationIds;
    role.buildingIds = buildingIds;
  }
}
