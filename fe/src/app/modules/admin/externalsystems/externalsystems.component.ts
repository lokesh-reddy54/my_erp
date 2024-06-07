import { Component, OnInit, ViewChild } from '@angular/core';
import { ProductService } from 'src/app/shared/services/product.service';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { debounceTime, take } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HttpClient } from "@angular/common/http";
import { DialogsService } from 'src/app/shared/services/dialogs.services';
import { AdminService } from 'src/app/shared/services/admin.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { Helpers } from '../../../helpers';
import * as _ from 'lodash';

@Component({
  selector: 'admin-externalsystems',
  templateUrl: './externalsystems.component.html'
})
export class AdminExternalSystemsComponent implements OnInit {
  outboundMailForm: FormGroup;
  inboundMailForm: FormGroup;
  paymentGatewayForm: FormGroup;
  payOutGatewayForm: FormGroup;
  smsGatewayForm: FormGroup;
  pushNotificationsForm: FormGroup;
  whatsappForm: FormGroup;

  outboundMailConfig: any = {};
  inboundMailConfig: any = {};
  paymentGatewayConfig: any = {};
  payoutGatewayConfig: any = {};
  smsGatewayConfig: any = {};
  pushNotificationsConfig: any = {};
  whatsappConfig: any = {};

  @ViewChild('outboundMailModal') outboundMailModal: any;
  @ViewChild('inboundMailModal') inboundMailModal: any;
  @ViewChild('paymentGatewayModal') paymentGatewayModal: any;
  @ViewChild('payOutGatewayModal') payOutGatewayModal: any;
  @ViewChild('smsGatewayModal') smsGatewayModal: any;
  @ViewChild('pushNotificationsModal') pushNotificationsModal: any;
  @ViewChild('whatsappModal') whatsappModal: any;

  @ViewChild('outboundMailsList') outboundMailsList: any;
  @ViewChild('inboundMailsList') inboundMailsList: any;
  @ViewChild('paymentGatwaysList') paymentGatwaysList: any;
  @ViewChild('smsGatwaysList') smsGatwaysList: any;
  @ViewChild('payOutGatwaysList') payOutGatwaysList: any;
  @ViewChild('pushNotificationsList') pushNotificationsList: any;
  @ViewChild('whatsappList') whatsappList: any;

  systems: any = [];
  items: any = [];
  selectedItem: any;
  loading: boolean = false;
  externalSystem: any = {};
  externalSystemTypes: any = {};

  constructor(private dialogs: DialogsService, private service: AdminService, private commonService: CommonService) {
    this.externalSystemTypes = this.commonService.values.externalSystems;
  }

  ngOnInit() {
    this.outboundMailForm = new FormGroup({
      name: new FormControl("", Validators.required),
      host: new FormControl("", Validators.required),
      port: new FormControl("", Validators.required),
      senderName: new FormControl("", Validators.required),
      senderEmail: new FormControl("", Validators.required),
      password: new FormControl("", Validators.required),
    });
    this.inboundMailForm = new FormGroup({
      name: new FormControl("", Validators.required),
      host: new FormControl("", Validators.required),
      port: new FormControl("", Validators.required),
      user: new FormControl("", Validators.required),
      password: new FormControl("", Validators.required),
    });
    this.paymentGatewayForm = new FormGroup({
      name: new FormControl("", Validators.required),
      apikey: new FormControl("", Validators.required),
      secret: new FormControl("", Validators.required),
      service: new FormControl("", Validators.required),
      pgCharge: new FormControl("", Validators.required),
    });
    this.payOutGatewayForm = new FormGroup({
      name: new FormControl("", Validators.required),
      apikey: new FormControl("", Validators.required),
      secret: new FormControl("", Validators.required),
    });
    this.pushNotificationsForm = new FormGroup({
      name: new FormControl("", Validators.required),
      apikey: new FormControl("", Validators.required),
      authToken: new FormControl("", Validators.required),
    });
    this.whatsappForm = new FormGroup({
      name: new FormControl("", Validators.required),
      apikey: new FormControl("", Validators.required),
      authToken: new FormControl("", Validators.required),
    });
    this.smsGatewayForm = new FormGroup({
      name: new FormControl("", Validators.required),
    });


    this.outboundMailConfig = {
      columns: [
        { label: 'Name', field: 'name', type: 'text', styleClass: 'w-50', sortable: true },
        { label: 'Active', field: 'active', type: 'boolean', styleClass: 'w-5' },
      ],
      actions: [
        { icon: 'i-Pen-5', hint: 'Edit', code: 'editOutboundMail', style: 'info' }
      ],
      options: {
        debounceDelay: 500,
        actionStyleClass: 'w-25 icons-td',
      }
    }
    this.inboundMailConfig = {
      columns: [
        { label: 'Name', field: 'name', type: 'text', styleClass: 'w-50', sortable: true },
        { label: 'Active', field: 'active', type: 'boolean', styleClass: 'w-5' },
      ],
      actions: [
        { icon: 'i-Pen-5', hint: 'Edit', code: 'editInboundMail', style: 'info' }
      ],
      options: {
        debounceDelay: 500,
        actionStyleClass: 'w-25 icons-td',
      }
    }
    this.paymentGatewayConfig = {
      columns: [
        { label: 'Name', field: 'name', type: 'text', styleClass: 'w-50', sortable: true },
        { label: 'Active', field: 'active', type: 'boolean', styleClass: 'w-5' },
      ],
      actions: [
        { icon: 'i-Pen-5', hint: 'Edit', code: 'editPaymentGateway', style: 'info' }
      ],
      options: {
        debounceDelay: 500,
        actionStyleClass: 'w-25 icons-td',
      }
    }
    this.payoutGatewayConfig = {
      columns: [
        { label: 'Name', field: 'name', type: 'text', styleClass: 'w-50', sortable: true },
        { label: 'Active', field: 'active', type: 'boolean', styleClass: 'w-5' },
      ],
      actions: [
        { icon: 'i-Pen-5', hint: 'Edit', code: 'editPayoutGateway', style: 'info' }
      ],
      options: {
        debounceDelay: 500,
        actionStyleClass: 'w-25 icons-td',
      }
    }
    this.smsGatewayConfig = {
      columns: [
        { label: 'Name', field: 'name', type: 'text', styleClass: 'w-50', sortable: true },
        { label: 'Active', field: 'active', type: 'boolean', styleClass: 'w-5' },
      ],
      actions: [
        { icon: 'i-Pen-5', hint: 'Edit', code: 'editSMSGateway', style: 'info' }
      ],
      options: {
        debounceDelay: 500,
        actionStyleClass: 'w-25 icons-td',
      }
    }
    this.pushNotificationsConfig = {
      columns: [
        { label: 'Name', field: 'name', type: 'text', styleClass: 'w-50', sortable: true },
        { label: 'Active', field: 'active', type: 'boolean', styleClass: 'w-5' },
      ],
      actions: [
        { icon: 'i-Pen-5', hint: 'Edit', code: 'editPushNotification', style: 'info' }
      ],
      options: {
        debounceDelay: 500,
        actionStyleClass: 'w-25 icons-td',
      }
    }
    this.whatsappConfig = {
      columns: [
        { label: 'Name', field: 'name', type: 'text', styleClass: 'w-50', sortable: true },
        { label: 'Active', field: 'active', type: 'boolean', styleClass: 'w-5' },
      ],
      actions: [
        { icon: 'i-Pen-5', hint: 'Edit', code: 'editPushNotification', style: 'info' }
      ],
      options: {
        debounceDelay: 500,
        actionStyleClass: 'w-25 icons-td',
      }
    }

    this.loadSystems();
  }

  loadSystems() {
    this.service.listExternalSystems({ filters: {} }).pipe(take(1)).subscribe(
      res => {
        this.systems = res['data'];
        if (!this.selectedSystemType) {
          this.selectedSystemType = this.externalSystemTypes[0]['type'];
        }
        this.selectSystem(this.selectedSystemType);

        var self = this;
        setTimeout(function(){
          self.outboundMailsList && self.outboundMailsList.reset();
          self.inboundMailsList && self.inboundMailsList.reset();
          self.paymentGatwaysList && self.paymentGatwaysList.reset();
          self.payOutGatwaysList && self.payOutGatwaysList.reset();
          self.smsGatwaysList && self.smsGatwaysList.reset();
          self.pushNotificationsList && self.pushNotificationsList.reset();
        }, 250)
      })
  }

  selectedSystemType: any;
  selectSystem(type) {
    this.items = _.filter(this.systems, { type: type });
    this.selectedSystemType = type;
  }

  openedModal: any;
  openOutboundMailModal() {
    if (!this.selectedItem) {
      this.selectedItem = { config: {} };
    }
    this.openedModal = this.dialogs.modal(this.outboundMailModal, { size: 'md' });
    var self = this;
    this.openedModal.result.then(res => {
      self.selectedItem = null;
    }).catch(err => {
      self.selectedItem = null;
    })
  }
  openInboundMailModal() {
    if (!this.selectedItem) {
      this.selectedItem = { config: {} };
    }
    this.openedModal = this.dialogs.modal(this.inboundMailModal, { size: 'md' });
    var self = this;
    this.openedModal.result.then(res => {
      self.selectedItem = null;
    }).catch(err => {
      self.selectedItem = null;
    })
  }
  openPaymentGatewayModal() {
    if (!this.selectedItem) {
      this.selectedItem = { config: {} };
    }
    this.openedModal = this.dialogs.modal(this.paymentGatewayModal, { size: 'md' });
    var self = this;
    this.openedModal.result.then(res => {
      self.selectedItem = null;
    }).catch(err => {
      self.selectedItem = null;
    })
  }
  openPayOutGatewayModal() {
    if (!this.selectedItem) {
      this.selectedItem = { config: {} };
    }
    this.openedModal = this.dialogs.modal(this.payOutGatewayModal, { size: 'md' });
    var self = this;
    this.openedModal.result.then(res => {
      self.selectedItem = null;
    }).catch(err => {
      self.selectedItem = null;
    })
  }
  openSMSGatewayModal() {
    if (!this.selectedItem) {
      this.selectedItem = { config: {} };
    }
    this.openedModal = this.dialogs.modal(this.smsGatewayModal, { size: 'md' });
    var self = this;
    this.openedModal.result.then(res => {
      self.selectedItem = null;
    }).catch(err => {
      self.selectedItem = null;
    })
  }
  openPushNotificationsModal() {
    if (!this.selectedItem) {
      this.selectedItem = { config: {} };
    }
    this.openedModal = this.dialogs.modal(this.pushNotificationsModal, { size: 'md' });
    var self = this;
    this.openedModal.result.then(res => {
      self.selectedItem = null;
    }).catch(err => {
      self.selectedItem = null;
    })
  }
  openWhatsAppModal() {
    if (!this.selectedItem) {
      this.selectedItem = { config: {} };
    }
    this.openedModal = this.dialogs.modal(this.whatsappModal, { size: 'md' });
    var self = this;
    this.openedModal.result.then(res => {
      self.selectedItem = null;
    }).catch(err => {
      self.selectedItem = null;
    })
  }

  saveExternalSystem() {
    console.log("ExternalSystemsComponent ::: save :: externalSystem ", this.selectedItem);
    this.loading = true;
    let self = this;
    var data = _.clone(this.selectedItem);
    data.type = this.selectedSystemType;
    data.config = JSON.stringify(data.config);
    this.service.saveExternalSystem(data).pipe(take(1)).subscribe(
      res => {
        self.dialogs.success("'" + this.selectedItem.name + "' is saved successfully ");
        this.loading = false;
        this.openedModal.close();
        this.loadSystems();
      },
      error => {
        self.dialogs.error(error, 'Error while saving')
      }
    )
  }

  action(event) {
    console.log("ExternalSystemsComponent ::: action :: event ", event);
    if (event.action == 'editOutboundMail') {
      this.selectedItem = _.clone(event.item);
      if (this.selectedItem.config != "") {
        this.selectedItem.config = JSON.parse(this.selectedItem.config);
      } else {
        this.selectedItem.config = {}
      }
      this.openOutboundMailModal();
    } else if (event.action == 'editInboundMail') {
      this.selectedItem = _.clone(event.item);
      if (this.selectedItem.config != "") {
        this.selectedItem.config = JSON.parse(this.selectedItem.config);
      } else {
        this.selectedItem.config = {}
      }
      this.openInboundMailModal();
    } else if (event.action == 'editPaymentGateway') {
      this.selectedItem = _.clone(event.item);
      if (this.selectedItem.config != "") {
        this.selectedItem.config = JSON.parse(this.selectedItem.config);
      } else {
        this.selectedItem.config = {}
      }
      this.openPaymentGatewayModal();
    } else if (event.action == 'editPayoutGateway') {
      this.selectedItem = _.clone(event.item);
      if (this.selectedItem.config != "") {
        this.selectedItem.config = JSON.parse(this.selectedItem.config);
      } else {
        this.selectedItem.config = {}
      }
      this.openPayOutGatewayModal();
    } else if (event.action == 'editSMSGateway') {
      this.selectedItem = _.clone(event.item);
      if (this.selectedItem.config != "") {
        this.selectedItem.config = JSON.parse(this.selectedItem.config);
      } else {
        this.selectedItem.config = {}
      }
      this.openSMSGatewayModal();
    } else if (event.action == 'editPushNotification') {
      this.selectedItem = _.clone(event.item);
      if (this.selectedItem.config != "") {
        this.selectedItem.config = JSON.parse(this.selectedItem.config);
      } else {
        this.selectedItem.config = {}
      }
      this.openPushNotificationsModal();
    } else if (event.action == 'editWhatsApp') {
      this.selectedItem = _.clone(event.item);
      if (this.selectedItem.config != "") {
        this.selectedItem.config = JSON.parse(this.selectedItem.config);
      } else {
        this.selectedItem.config = {}
      }
      this.openWhatsAppModal();
    }
  }


}
