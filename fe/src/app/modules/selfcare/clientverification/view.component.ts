import { Component, OnInit, ViewChild } from '@angular/core';
import { ProductService } from 'src/app/shared/services/product.service';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { debounceTime, take } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from "@angular/common/http";
import { DialogsService } from 'src/app/shared/services/dialogs.services';
import { CommonService } from 'src/app/shared/services/common.service';
import { BookingsService } from 'src/app/shared/services/bookings.service';
import { SelfcareService } from 'src/app/shared/services/selfcare.service';
import { PgClientService } from 'src/app/shared/services/pgclient.service';
import { Helpers } from '../../../helpers';
import { environment } from "../../../../environments/environment";
import * as _ from 'lodash';
import * as moment from 'moment';

@Component({
  selector: 'selfcare-employee-verification',
  templateUrl: './view.component.html'
})
export class ClientVerificationComponent implements OnInit {
  id: any = "";
  loading: any = false;
  data: any = { client: {} };
  skusConfig: any = {};
  clientEmployees: any = {};
  clientForm: FormGroup;
  client: any ={}; 

  form: FormGroup;

  @ViewChild('rejectedModal') rejectedModal: any;
  @ViewChild("clientModal") clientModal: any;

  constructor(private route: ActivatedRoute, private dialogs: DialogsService,
    private service: SelfcareService, private bookingsService: BookingsService,
    private bookingservice: BookingsService,
    private commonService: CommonService,) {
    this.id = this.route.snapshot.params['id'];
  }

  ngOnInit() {
    this.getInitData();

    this.form = new FormGroup({
      name: new FormControl("", Validators.required),
      email: new FormControl("", Validators.required),
      phone: new FormControl("", Validators.required),
      password: new FormControl(""),
      confirmPassword: new FormControl(""),
    });

    this.clientForm = new FormGroup({
      company: new FormControl("", Validators.required),
      name: new FormControl("", Validators.required),
      email: new FormControl("", Validators.required),
      phone: new FormControl("", Validators.required),
      address: new FormControl(""),
      gstNo: new FormControl(""),
      panNo: new FormControl(""),
      stateCode: new FormControl(""),
      website: new FormControl(""),
    });

    this.skusConfig = {
      columns: [
        { label: 'Name', field: 'name', type: 'text', styleClass: 'w-20', sortable: true },
        { label: 'Email', field: 'email', type: 'text', styleClass: 'w-20', sortable: true },
        { label: 'Phone', field: 'phone', type: 'text', styleClass: 'w-15', sortable: true },
        { label: 'Contact Type', field: 'contactPurposes', type: 'text', styleClass: 'w-35' },
        { label: 'Verified', field: 'verified', type: 'boolean', styleClass: 'w-5' },
        { label: 'Active', field: 'active', type: 'boolean', styleClass: 'w-5' },
      ],
      actions: [
      ],
      options: {
        debounceDelay: 500,
        actionStyleClass: 'w-10 icons-td',
      }
    }
  }

  getInitData() {
    this.service.getInitData(this.id).pipe(take(1)).subscribe(
      res => {
        var data = res['data'];
        this.data = data;
        this.clientEmployees = data.client.employees;
        this.client = data.client;
      })
  }

  otp: any;
  otpSent: any = false;
  requestOTP() {
    var data = {
      phone: this.data.phone,
      context: "ClientVerification"
    }
    this.loading = true;
    this.service.requestOTP(data).pipe(take(1)).subscribe(
      (res) => {
        if (res['data']) {
          this.otpSent = true;
          this.dialogs.success("An OTP has sent to your mobile " + this.data.phone + ". Please verify OTP request. ")
        } else if (res['error']) {
          this.dialogs.error(res['error'])
        }
        this.loading = false;
      })
  }

  confirm() {
    var self = this;
    var data = {
      phone: this.data.phone,
      context: "EmployeeVerification",
      otp: this.otp
    }
    this.loading = true;
    this.service.verifyOTP(data).pipe(take(1)).subscribe(
      (res) => {
        if (res['data']) {
          self.dialogs.confirm("Are you sure to verify '" + this.data.phone + "' as your Contact Number ? ", "Accept Contact Details")
            .then(function(event) {
              if (event.value) {
                var data: any = _.clone(self.data);
                data.verified = true;
                data.active = true;
                self.loading = true;
                self.bookingsService.saveEmployee(data).pipe(take(1)).subscribe(
                  (res) => {
                    if (res['data']) {
                      self.data.verified = true;
                      self.dialogs.msg("Contact Details are verified successfully .. !! ")
                    }
                    self.loading = false;
                  })
              }
            })
        } else {
          self.dialogs.error(res['error']);
          self.loading = false;
        }
      })
  }  

  saveEmployee() {
    var self = this;
    var data = {
      id:this.data.id,
      password: this.data.password
    }
    this.loading = true;
    this.bookingsService.saveEmployee(data).pipe(take(1)).subscribe(
      (res) => {
        if (res['data']) {
          self.dialogs.msg("Password is updated successfully .. !! ")
        }
        self.loading = false;
      })
  }

openedModal: any ={};

editClient() {
    this.client = _.clone(this.data.client);
    this.openedModal = this.dialogs.modal(this.clientModal, { size: "lg" });
    var self = this;
    this.openedModal.result
      .then(function () {
        self.client = {};
        self.loading = false;
        self.clientForm.reset();
      })
      .catch(function (e) {
        self.client = {};
        self.loading = false;
        self.clientForm.reset();
      });
  }

saveClient() {
    let self = this;
    this.loading = true;
    var client = _.clone(this.client);
    client.bookingId = this.data.id;
    this.bookingservice
      .saveClient(client)
      .pipe(take(1))
      .subscribe(
        (res) => {
          self.dialogs.success("Client is updated successfully ");
          self.loading = false;
          this.openedModal.dismiss();
          // self.getBooking();
        },
        (error) => {
          self.dialogs.error(error, "Error while saving");
        }
      );
  }
  // saveEmployees() {
  //   let self = this;
  //   this.loading = true;
  //   var employee = _.clone(this.employee);
  //   console.log("employee :: ", employee)
  //   employee.clientId = this.booking.clientId;
  //   // employee.department = this.employee.department.department;
  //   employee.contactPurposes = _.map(
  //     this.employee.contactPurposes,
  //     "type"
  //   ).join(", ");
  //   this.service
  //     .saveEmployee(employee)
  //     .pipe(take(1))
  //     .subscribe(
  //       (res) => {
  //         self.dialogs.success("Employee is saved successfully ");
  //         self.loading = false;
  //         this.openedModal.dismiss();
  //         this.loadEmployees();
  //       },
  //       (error) => {
  //         self.dialogs.error(error, "Error while saving");
  //       }
  //     );
  // }  



}

