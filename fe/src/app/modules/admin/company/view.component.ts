import { Component, OnInit, ViewChild } from "@angular/core";
import { ProductService } from "src/app/shared/services/product.service";
import {
  FormControl,
  FormBuilder,
  FormGroup,
  Validators,
} from "@angular/forms";
import { debounceTime, take } from "rxjs/operators";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { DialogsService } from "src/app/shared/services/dialogs.services";
import { AdminService } from "src/app/shared/services/admin.service";
import { CommonService } from "src/app/shared/services/common.service";
import { Helpers } from "../../../helpers";
import * as _ from "lodash";

@Component({
  selector: "admin-company",
  templateUrl: "./view.component.html",
})
export class AdminCompanyComponent implements OnInit {
  companyForm: FormGroup;

  loading: boolean = false;
  user: any = {};
  company: any = {};
  roles: any = [];
  role: any = {
    json: {
      dashboards: {},
      admin: {},
      bookings: {},
      leads: {},
      accounts: {},
      purchases: {},
      support: {},
    },
  };

  rolesConfig: any = {};
  @ViewChild("rolesList") rolesList: any;

  constructor(
    private dialogs: DialogsService,
    private service: AdminService,
    private commonService: CommonService
  ) {}

  ngOnInit() {
    this.companyForm = new FormGroup({
      name: new FormControl("", Validators.required),
      tradeName: new FormControl("", Validators.required),
      shortName: new FormControl("", Validators.required),
      address: new FormControl("", Validators.required),
      city: new FormControl("", Validators.required),
      state: new FormControl("", Validators.required),
      phone: new FormControl("", Validators.required),
      email: new FormControl("", Validators.required),
      website: new FormControl("", Validators.required),
      logo: new FormControl("", Validators.required),
      squareLogo: new FormControl("", Validators.required),
      gstNo: new FormControl("", Validators.required),
      panNo: new FormControl("", Validators.required),
      cin: new FormControl("", Validators.required),
      stateCode: new FormControl("", Validators.required),
      bankName: new FormControl("", Validators.required),
      ifscCode: new FormControl("", Validators.required),
      branchName: new FormControl("", Validators.required),
      accountNumber: new FormControl("", Validators.required),
      accountName: new FormControl("", Validators.required),
      supportEmail: new FormControl("", Validators.required),
      supportPhone: new FormControl("", Validators.required),
      erpDomain: new FormControl("", Validators.required),
      primaryColor: new FormControl(""),
      accentColor: new FormControl(""),
    });

    var domain = window.location.hostname;
    var user = window.localStorage.getItem("cwo_user");
    this.user = user && JSON.parse(user);

    this.service
      .listCompanies({ filters: { id: this.user.companyId } })
      .pipe(take(1))
      .subscribe((res) => {
        this.company = res["data"][0];
      });

    this.rolesConfig = {
      columns: [
        {
          label: "Name",
          field: "name",
          type: "text",
          styleClass: "w-70",
          sortable: true,
        },
      ],
      actions: [
        { icon: "i-Pen-5", hint: "Edit", code: "editRole", style: "info" },
        {
          icon: "fa fa-trash",
          hint: "Delete",
          code: "deleteRole",
          style: "danger",
        },
      ],
      options: {
        debounceDelay: 500,
        actionStyleClass: "w-30 icons-td text-center",
      },
    };
  }

  saveCompany() {
    console.log("CompanyComponent ::: save :: saveCompany ", this.company);
    this.loading = true;
    let self = this;
    this.service
      .saveCompany(this.company)
      .pipe(take(1))
      .subscribe(
        (res) => {
          self.dialogs.success(
            "'" + this.company.name + "' is saved successfully "
          );
          this.loading = false;
        },
        (error) => {
          self.dialogs.error(error, "Error while saving");
        }
      );
  }

  selectedItem: any;
  action(event) {
    console.log("CompanyComponent ::: action :: event ", event);
    if (event.action == "deleteRole") {
      var role = _.clone(event.item);
      this.role = role;
      var self = this;
      this.dialogs
        .confirm(
          "Are you sure to delete '" + role.name + "' Role ?",
          "Delete Role"
        )
        .then((flag) => {
          if (flag) {
            self.saveRole(false);
          }
        });
    } else if (event.action == "editRole") {
      if (this.selectedItem) {
        this.selectedItem.lightSelected = false;
      }
      this.selectedItem = event.item;
      this.selectedItem.lightSelected = true;
      var role = _.clone(event.item);
      role.form = true;
      if (role.json && role.json != "") {
        role.json = JSON.parse(role.json);
        if (!role.json.workbenches) {
          role.json.workbenches = {};
        }
      } else {
        role.json = {
          admin: {},
          dashboards: {},
          workbenches: {},
          bookings: {},
          leads: {},
          accounts: {},
          purchases: {},
          support: {},
          assets: {},
        };
      }
      this.role = role;
    }
  }

  newRole() {
    this.role = {
      json: {
        admin: {},
        dashboards: {},
        workbenches: {},
        bookings: {},
        leads: {},
        accounts: {},
        purchases: {},
        support: {},
        assets: {},
      },
    };
    this.role.form = true;
  }

  saveRole(active?: any) {
    var role = {
      id: this.role.id,
      name: this.role.name,
      isGeoSpecific: this.role.isGeoSpecific,
      isSupport: this.role.isSupport,
      json: JSON.stringify(this.role.json),
      active: active,
    };
    this.loading = true;
    this.service
      .saveRole(role)
      .pipe(take(1))
      .subscribe((res) => {
        this.role.id = res["data"]["id"];
        this.loading = false;
        this.role.form = false;
        this.role = {};
        this.rolesList.reset();
      });
  }
}
