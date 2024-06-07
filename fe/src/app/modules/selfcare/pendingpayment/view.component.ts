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
  selector: 'selfcare-pendingpayment',
  templateUrl: './view.component.html'
})
export class PendingPaymentComponent implements OnInit {
  paymentForm: FormGroup;
  urn: any = {};
  id: any = "";
  loading: any = false;
  booking: any;

  constructor(private route: ActivatedRoute, private dialogs: DialogsService, private pgService: PgClientService,
    private service: SelfcareService, private commonService: CommonService, private bookingsService: BookingsService) {
    this.id = this.route.snapshot.params['id'];

    this.pgService.initialize(environment.test ? 'TEST' : 'PROD', Helpers.composeEnvUrl());
  }

  ngOnInit() {
    this.getInitData();

    this.paymentForm = new FormGroup({
      date: new FormControl(""),
      amount: new FormControl("", Validators.required),
      utr: new FormControl("", Validators.required),
    });
  }

  pgRate:any;
  getInitData() {
    this.service.getInitData(this.id).pipe(take(1)).subscribe(
      res => {
        var data = res['data'];
        this.booking = data;
        if(data.pgConfig){
        this.pgRate = parseFloat(this.booking.pgConfig.pgCharge); 
        }
        this.urn.bookingId = data.id;
        this.booking.due = _.sumBy(this.booking.invoices, "due");
        this.booking.onlinePayment = Math.round(this.booking.due * (1 + (this.pgRate / 100)));

        document.title = data.company.name + " - " + "Pay Pending Payment";
      })
  }

  urnSubmitted: any = false;
  saveUrnPayment() {
    this.loading = true;
    this.urn.status = "Submitted";
    this.bookingsService.saveUrnPayment(this.urn).pipe(take(1)).subscribe(
      res => {
        this.loading = false;
        this.urnSubmitted = true;
        this.booking.due = this.booking.due - this.urn.amount;
      })
  }

  payNow() {
    var self = this;
    this.loading = true;
    var data = {
      orderId: this.booking.refNo,
      bookingId: this.booking.id,
      currency: 'INR',
      amount: this.booking.onlinePayment,
      merchant: {
        name: this.booking.company.name,
        image: this.booking.company.logo
      },
      customer: {
        firstName: this.booking.client.name,
        lastName: '',
        phoneCountryCode: '+91',
        phone: this.booking.client.phone,
        email: this.booking.client.email
      }
    }
    this.pgService.makePaymentRequest(data).then(function(response) {
      console.log("handleSuccessfulPayment SuccessCallback ::: response :: ", response);
      self.loading = false;
      self.getInitData();
    }).catch(function(err) {
      console.log("handleSuccessfulPayment SuccessCallback ::: error :: ", err);
      self.loading = false;
    })
  }

}
