import { Component, OnInit, ViewChild } from '@angular/core';
import { ProductService } from 'src/app/shared/services/product.service';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { debounceTime, take } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from "@angular/common/http";
import { DialogsService } from 'src/app/shared/services/dialogs.services';
import { CommonService } from 'src/app/shared/services/common.service';
import { SelfcareService } from 'src/app/shared/services/selfcare.service';
import { BookingsService } from 'src/app/shared/services/bookings.service';
import { Helpers } from '../../../helpers';
import * as _ from 'lodash';
import * as moment from 'moment';

declare let window;

@Component({
  selector: 'client-exitstatement',
  templateUrl: './view.component.html'
})
export class ClientExitStatementComponent implements OnInit {
  form: FormGroup;

  id: any = "";
  loading: any = false;
  booking: any;

  constructor(private route: ActivatedRoute, private dialogs: DialogsService, 
    private service: SelfcareService, private commonService: CommonService, private bookingsService : BookingsService) {
    this.id = this.route.snapshot.params['id'];
  }

  ngOnInit() {
    this.form = new FormGroup({
      benificiaryName: new FormControl("", Validators.required),
      accountNumber: new FormControl("", Validators.required),
      ifscCode: new FormControl("", Validators.required),
    });

    this.bookingsService.getBooking(this.id).pipe(take(1)).subscribe(
      res => {
        var data = res['data'];
        this.booking = data;
        this.calculateExitCharges();
      })
  }


  exitCalculations: any = { earlyExitCharge: { charge: 0 }, noticePeriodPenality: { charge: 0 } }
  calculateExitCharges() {
    var requestedDate = moment(this.booking.exitRequest.requestedDate);
    var exitDate = moment(this.booking.exitRequest.exitDate);
    var startedDate = moment(this.booking.started);
    var requestedBeforeDays = exitDate.diff(requestedDate, 'days') + 1;
    var stayDuration = exitDate.diff(startedDate, 'days');
    this.exitCalculations.requestedBeforeDays = requestedBeforeDays;
    this.exitCalculations.stayDuration = stayDuration;

    this.exitCalculations.noticePeriodPenality.requestedBeforeDays = requestedBeforeDays;
    this.exitCalculations.noticePeriodPenality.stayDuration = stayDuration;

    this.exitCalculations.noticePeriodPenality.noticePeriod = (this.booking.contract.noticePeriod * 30) + " days";

    if (this.booking.contract.noticePeriod * 30 > requestedBeforeDays) {
      this.exitCalculations.noticePeriodPenality.statement = "Notice Period penality will apply as exit is requested before agreed NoticePeriod of " + (this.booking.contract.noticePeriod * 30) + " days as per contract."
      this.exitCalculations.noticePeriodPenality.period = (this.booking.contract.noticePeriod * 30) + " days";
      var charge: any = 0;
      if (this.booking.contract.noticePeriodViolationType == "Fixed") {
        this.exitCalculations.noticePeriodPenality.penality = "Fixed amount of Rs. " + this.booking.contract.noticePeriodViolation;
        charge = this.booking.contract.noticePeriodViolation;
      } else {
        this.exitCalculations.noticePeriodPenality.penality = this.booking.contract.noticePeriodViolation + " month(s) rent on prorata basis";
        charge = ((this.booking.contract.noticePeriodViolation * this.booking.contract.rent) / (this.booking.contract.noticePeriod * 30)) * requestedBeforeDays;
      }
      this.exitCalculations.noticePeriodPenality.charge = charge;

    } else {
      this.exitCalculations.noticePeriodPenality.statement = "Notice Period penality wont apply as exit is requested after agreed NoticePeriod of " + (this.booking.contract.noticePeriod * 30) + " days as per contract."
    }

    this.exitCalculations.earlyExitCharge.lockIn = (this.booking.contract.lockIn * 30) + " days";
    if (this.booking.contract.lockIn * 30 > stayDuration) {
      this.exitCalculations.earlyExitCharge.statement = "Early Exit Charge will apply as exit is requested before agreed LockIn period of " + (this.booking.contract.lockIn * 30) + " days as per contract."
      this.exitCalculations.earlyExitCharge.period = (this.booking.contract.lockIn * 30) + " days";
      var charge: any = 0;
      if (this.booking.contract.lockInPenaltyType == "Fixed") {
        this.exitCalculations.earlyExitCharge.penality = "Fixed amount of Rs. " + this.booking.contract.lockInPenalty;
        charge = this.booking.contract.lockInPenalty;
      } else {
        this.exitCalculations.earlyExitCharge.penality = this.booking.contract.lockInPenalty + " month(s) rent on prorata basis";
        charge = ((this.booking.contract.lockInPenalty * this.booking.contract.rent) / (this.booking.contract.lockIn * 30)) * ((this.booking.contract.lockIn * 30) - stayDuration);
      }
      this.exitCalculations.earlyExitCharge.charge = charge;

    } else {
      this.exitCalculations.earlyExitCharge.statement = "Early Exit charge wont apply as exit is requested after LockIn period of " + (this.booking.contract.lockIn * 30) + " days as per contract."
    }

  }

  acceptFinalStatement() {
    var self = this;
    this.dialogs.confirm("Are you sure to Accept Final Statement .. ?")
      .then(function(event) {
        if (event.value) {
          self.loading = true;
          var data = {
            exitRequestId: self.booking.exitRequest.id,
            clientId: self.booking.client.id,
            accountNumber: self.booking.client.accountNumber || '',
            ifscCode: self.booking.client.ifscCode || '',
            companyId: self.booking.companyId,
          }
          self.service.acceptFinalStatement(data).pipe(take(1)).subscribe(
            res => {
              if (res['data']) {
                self.dialogs.success("Final Statement is accepted successfully .. !");
                self.booking.exitRequest = res['data'];
              } else {
                self.dialogs.error(res['error']);
              }
              self.loading = false;
            })
        }
      })
  }


}
