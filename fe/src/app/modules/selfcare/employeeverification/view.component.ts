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
export class EmployeeVerificationComponent implements OnInit {
  id: any = "";
  loading: any = false;
  data: any = { client: {} };

  form: FormGroup;

  @ViewChild('rejectedModal') rejectedModal: any;

  constructor(private route: ActivatedRoute, private dialogs: DialogsService,
    private service: SelfcareService, private bookingsService: BookingsService) {
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
  }

  getInitData() {
    this.service.getInitData(this.id).pipe(take(1)).subscribe(
      res => {
        var data = res['data'];
        this.data = data;
      })
  }

  otp: any;
  otpSent: any = false;
  requestOTP() {
    var data = {
      phone: this.data.phone,
      context: "EmployeeVerification"
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
}
