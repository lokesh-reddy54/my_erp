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
  selector: 'selfcare-vendorskuapproval',
  templateUrl: './view.component.html'
})
export class VendorSkuApprovalComponent implements OnInit {
  id: any = "";
  loading: any = false;
  data: any;
  user: any;

  rejectedForm: FormGroup;

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

    this.rejectedForm = new FormGroup({
      comments: new FormControl(""),
    });
  }

  getInitData() {
    this.service.getInitData(this.id).pipe(take(1)).subscribe(
      res => {
        var data = res['data'];
        this.data = data;
      })
  }

  openedModal: any;
  vendorRejectedComments: any;
  vendorRejectedReason: any;
  sku: any;
  openRejectMessage(_sku) {
    this.sku = _sku;
    this.openedModal = this.dialogs.modal(this.rejectedModal, { size: 'md' });
    var self = this;
    this.openedModal.result.then(function() {
      self.loading = false;
    }).catch(function(e) {
      self.loading = false;
    })
  }

  rejectSKUPricing() {
    var self = this;
    this.dialogs.confirm("Are you sure to reject " + this.sku.sku.name + " pricings ? ", "Reject SKU Price")
      .then(function(event) {
        if (event.value) {
          var data: any = {
            id: self.sku.vendorSkuId,
            rejected: true
          }
          data.rejectedMessage = self.vendorRejectedComments;
          data.status = "Rejected";

          self.loading = true;
          self.purchasesService.saveVendorSku(data).pipe(take(1)).subscribe(
            (res) => {
              if (res['data']) {
                self.sku.status = "Rejected";
                self.sku.rejectedMessage = self.vendorRejectedComments;
                self.dialogs.success("SKU pricing is rejected successfully ")
              }
              self.loading = false;
              self.openedModal && self.openedModal.dismiss();
            })
        }
      })
  }

  acceptSku(sku) {
    var self = this;
    this.dialogs.confirm("Are you sure to Accept " + sku.sku.name + " pricings ? ", "Accept SKU Price")
      .then(function(event) {
        if (event.value) {
          var data: any = {
            id: sku.vendorSkuId,
            accepted: true,
            status: "Accepted",
            rejectedMessage: null
          }

          self.loading = true;
          self.purchasesService.saveVendorSku(data).pipe(take(1)).subscribe(
            (res) => {
              if (res['data']) {
                sku.status = "Accepted";
                self.dialogs.success("SKU pricing is accepted successfully ")
              }
              self.loading = false;
              self.openedModal && self.openedModal.dismiss();
            })
        }
      })
  }

}
