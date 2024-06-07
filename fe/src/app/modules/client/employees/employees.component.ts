import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { debounceTime, take } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from "@angular/common/http";
import { DialogsService } from 'src/app/shared/services/dialogs.services';
import { DataLayerService } from 'src/app/shared/services/data-layer.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { BookingsService } from 'src/app/shared/services/bookings.service';
import { UploadService } from 'src/app/shared/services/upload.service';
import { AccountsService } from 'src/app/shared/services/accounts.service';
import { PgClientService } from 'src/app/shared/services/pgclient.service';
import { Helpers } from '../../../helpers';
import { Utils } from 'src/app/shared/utils';
import * as _ from 'lodash';
import * as moment from 'moment';
import { environment } from "src/environments/environment";

@Component({
  selector: 'client-employees-view',
  templateUrl: './employees.component.html'
})
export class ClientEmployeesViewComponent implements OnInit {

  searchControl: FormControl = new FormControl();
  employeeForm: FormGroup;
  mailsListFilter: any = {};

  id: any = 1;
  @ViewChild('employeeModal') employeeModal: any;

  booking: any = { client: {}, contract: {} };
  loading: boolean = false;

  viewObservable: Observable<any[]>;
  departments: any = [];
  contactPurposes: any = [];

  constructor(private ref: ChangeDetectorRef, private route: ActivatedRoute, private dialogs: DialogsService,
    private pgService: PgClientService, private uploadService: UploadService, private accountsService: AccountsService,
    private service: BookingsService, private commonService: CommonService) {
   this.departments = this.commonService.values.departments;
    this.contactPurposes = this.commonService.values.contactPurposes;
    this.id = this.route.snapshot.params['id'];
  }

  user: any = {};
  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem("cwo_user"));

    this.employeeForm = new FormGroup({
      name: new FormControl("", Validators.required),
      // department: new FormControl("", Validators.required),
      contactPurposes: new FormControl("", Validators.required),
      password: new FormControl(""),
      email: new FormControl("", Validators.compose([
        Validators.required,
        Validators.email
      ])),
      phone: new FormControl("", Validators.compose([
        Validators.required,
        Validators.pattern('^[6,7,8,9][0-9]{9}$')
      ]))
    });

    this.getBooking();
  }

  getBooking() {
    this.loading = true;
    this.service.getBooking(this.id).pipe(take(1)).subscribe(
      res => {
        this.booking = res['data'];
        this.loadEmployees();
        this.loading = false;
      },
      error => {
        this.dialogs.error(error, 'Error while saving')
      }
    )
  }

  employees = [];
  loadEmployees() {
    console.log("loadEmployees :: ");
    this.service.getEmployees(this.booking.clientId)
      .pipe(take(1)).subscribe(res => {
        this.employees = res['data'];
        this.loading = false;
      });
  }

  openedModal: any;
  contract: any = {};
  employee: any = {};

  openEmployeeModal(employee?) {
    if (employee) {
      this.employee = _.clone(employee);
    }
    if (this.employee && this.employee.contactPurposes) {
      this.employee.contactPurposes = this.employee.contactPurposes.split(", ");
    }
    this.openedModal = this.dialogs.modal(this.employeeModal, { size: 'md' });
    var self = this;
    this.openedModal.result.then(function() {
      self.employee = {};
      self.loading = false;
      self.employeeForm.reset();
    }).catch(function(e) {
      self.employee = {};
      self.loading = false;
    })
  }
  saveEmployee() {
    let self = this;
    this.loading = true;
    var employee = _.clone(this.employee);
    employee.clientId = this.booking.clientId;
    // employee.department = this.employee.department.department;
    employee.contactPurposes = _.map(this.employee.contactPurposes, "type").join(", ");
    this.service.saveEmployee(employee).pipe(take(1)).subscribe(
      res => {
        self.dialogs.success("Employee is saved successfully ");
        self.loading = false;
        this.openedModal.dismiss();
        this.loadEmployees();
      },
      error => {
        self.dialogs.error(error, 'Error while saving')
      }
    )
  }
}
