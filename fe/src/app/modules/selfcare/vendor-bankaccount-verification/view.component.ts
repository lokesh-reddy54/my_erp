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
  selector: 'selfcare-vendorbankaccountapproval',
  templateUrl: './view.component.html'
})
export class VendorBankAccountVerificationComponent implements OnInit {
  id: any = "";
  loading: any = false;
  data: any = { bankAccount: {} };
  user: any;

  form: FormGroup;

  @ViewChild('rejectedModal') rejectedModal: any;

  constructor(private route: ActivatedRoute, private dialogs: DialogsService,
    private service: SelfcareService, private purchasesService: PurchasesService) {
    this.id = this.route.snapshot.params['id'];
    var user = localStorage.getItem('cwo_user');
    if (user && user != '') {
      this.user = JSON.parse(user);
    }
  }

  ngOnInit() {
    this.getInitData();

    this.form = new FormGroup({
      benificiaryName: new FormControl("", Validators.required),
      accountNumber: new FormControl("", Validators.required),
      ifscCode: new FormControl("", Validators.required),
      bankName: new FormControl("", Validators.required),
      bankBranch: new FormControl("", Validators.required),
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
      phone: this.data.vendor.contact.phone,
      context: "VendorBankVerfication"
    }
    this.loading = true;
    this.service.requestOTP(data).pipe(take(1)).subscribe(
      (res) => {
        if (res['data']) {
          this.otpSent = true;
          this.dialogs.success("An OTP has sent to your mobile " + this.data.vendor.contact.phone + ". Please verify OTP request. ")
        } else if (res['error']) {
          this.dialogs.error(res['error'])
        }
        this.loading = false;
      })
  }

  confirm() {
    var self = this;
    var data = {
      phone: this.data.vendor.contact.phone,
      context: "VendorBankVerfication",
      otp: this.otp
    }
    this.loading = true;
    this.service.verifyOTP(data).pipe(take(1)).subscribe(
      (res) => {
        if (res['data']) {
          self.dialogs.confirm("Are you sure to Accept '" + this.data.bankAccount.accountNumber + "' as your Account Number ? ", "Accept Bank Details")
        .then(function(event) {
          if (event.value) {
                var data: any = _.clone(self.data.bankAccount);
                data.verified = true;
                data.active = true;
                self.loading = true;
                self.purchasesService.saveVendorBankAccount(data).pipe(take(1)).subscribe(
                  (res) => {
                    if (res['data']) {
                      self.data.bankAccount = data;
                      self.dialogs.msg("Bank Account Details are verified successfully .. !! ")
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
