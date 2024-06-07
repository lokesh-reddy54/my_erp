import { Component, OnInit, ViewChild } from '@angular/core';
import { ProductService } from 'src/app/shared/services/product.service';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { debounceTime, take } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from "@angular/common/http";
import { DialogsService } from 'src/app/shared/services/dialogs.services';
import { CommonService } from 'src/app/shared/services/common.service';
import { PurchasesService } from 'src/app/shared/services/purchases.service';
import { SelfcareService } from 'src/app/shared/services/selfcare.service';
import { PgClientService } from 'src/app/shared/services/pgclient.service';
import { Helpers } from '../../../helpers';
import { environment } from "../../../../environments/environment";
import * as _ from 'lodash';
import * as moment from 'moment';

@Component({
  selector: 'selfcare-vendor-verification',
  templateUrl: './view.component.html'
})
export class VendorVerificationComponent implements OnInit {
  id: any = "";
  loading: any = false;
  data: any = { contact: {} };

  form: FormGroup;

  @ViewChild('rejectedModal') rejectedModal: any;

  constructor(private route: ActivatedRoute, private dialogs: DialogsService,
    private service: SelfcareService, private purchasesService: PurchasesService) {
    this.id = this.route.snapshot.params['id'];
  }

  ngOnInit() {
    this.getInitData();

    this.form = new FormGroup({
      name: new FormControl("", Validators.required),
      email: new FormControl("", Validators.required),
      phone: new FormControl("", Validators.required)
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
      phone: this.data.contact.phone,
      context: "VendorVerfication"
    }
    this.loading = true;
    this.service.requestOTP(data).pipe(take(1)).subscribe(
      (res) => {
        if (res['data']) {
          this.otpSent = true;
          this.dialogs.success("An OTP has sent to your mobile " + this.data.contact.phone + ". Please verify OTP request. ")
        } else if (res['error']) {
          this.dialogs.error(res['error'])
        }
        this.loading = false;
      })
  }

  confirm() {
    var self = this;
    var data = {
      phone: this.data.contact.phone,
      context: "VendorVerfication",
      otp: this.otp
    }
    this.loading = true;
    this.service.verifyOTP(data).pipe(take(1)).subscribe(
      (res) => {
        if (res['data']) {
          self.dialogs.confirm("Are you sure to verify '" + this.data.contact.phone + "' as your Contact Number ? ", "Accept Contact Details")
            .then(function(event) {
              if (event.value) {
                var data: any = _.clone(self.data.contact);
                data.verified = true;
                data.active = true;
                self.loading = true;
                self.purchasesService.saveVendorContact(data).pipe(take(1)).subscribe(
                  (res) => {
                    if (res['data']) {
                      self.data.contact = data;
                      self.dialogs.msg("Vendor Contact Details are verified successfully .. !! ")
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
}
