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
import { CommonService } from "src/app/shared/services/common.service";
import { AccountsService } from "src/app/shared/services/accounts.service";
import { Helpers } from "../../../helpers";
import * as _ from "lodash";

@Component({
  selector: "accounts-invoice-services",
  templateUrl: "./list.component.html",
})
export class AccountsInvoiceServicesComponent implements OnInit {
  serviceForm: FormGroup;

  selectedPayout: any = {};
  service: any = {};
  listConfig: any = {};

  @ViewChild("invoiceServicesList") invoiceServicesList: any;
  @ViewChild("serviceModal") serviceModal: any;

  search: any = new FormControl("");
  serviceCategories: any = [
    "Security",
    "CoWorkingOffice",
    "PrivateOffice",
    "OfficeSpace",
    "Other",
  ];
  serviceTypes: any = [
    "Deposit",
    "CabinRent",
    "ExtraDeskCharges",
    "DedicatedDeskSpace",
    "ExtraDeskCharges",
    "ExpansionDeskRent",
    "Penalty",
    "AssetDamageCharges",
    "OtherExitDeductions",
    "EarlyMoveOutCharge",
    "NoticePeriodPenaltyCharges",
    "ExitCharge",
    "PGCharges",
    "CreditCharge",
  ];
  items: any = [];
  selectedItem: any = {};
  filters: any = { statuses: ["Published"] };
  loading: boolean = false;
  noResults: boolean = false;
  offset: number = 0;
  limit: number = 20;

  constructor(
    private dialogs: DialogsService,
    private accountsService: AccountsService,
    private commonService: CommonService
  ) {}

  ngOnInit() {
    this.search.valueChanges.pipe(debounceTime(200)).subscribe((value) => {
      this.filters.search = value;
    });

    this.serviceForm = new FormGroup({
      name: new FormControl("", Validators.required),
      category: new FormControl("", Validators.required),
      type: new FormControl("", Validators.required),
      hasTds: new FormControl(false, Validators.required),
      hasGst: new FormControl(true, Validators.required),
      inclusive: new FormControl(false, Validators.required),
      igst: new FormControl("", Validators.required),
      sgst: new FormControl("", Validators.required),
      cgst: new FormControl("", Validators.required),
    });
    var actions: any = [
      // { icon: 'i-Pen-5', hint: 'Edit', code: 'editService', style: 'info' },
      // { icon: 'fa fa-times', hint: 'Archive', code: 'archiveService', style: 'danger' },
    ];
    if (this.commonService.checkAccess("accounts.editRevenueCode")) {
      actions.push({
        icon: "i-Pen-5",
        hint: "Edit",
        code: "editService",
        style: "info",
      });
    }
    if (this.commonService.checkAccess("accounts.archieveRevenueCode")) {
      actions.push({
        icon: "fa fa-times",
        hint: "Archive",
        code: "archiveService",
        style: "danger",
      });
    }
    this.listConfig = {
      columns: [
        {
          label: "Category",
          field: "category",
          type: "text",
          styleClass: "w-15 word-break",
          sortable: true,
        },
        {
          label: "Type",
          field: "type",
          type: "text",
          styleClass: "w-15  word-break",
          sortable: true,
        },
        {
          label: "Description",
          field: "name",
          type: "text",
          styleClass: "w-25  word-break",
          sortable: true,
        },
        {
          label: "Status",
          field: "status",
          type: "text",
          styleClass: "w-10",
          sortable: true,
        },
        // { label: 'HasTds', field: 'hasTds', type: 'boolean', styleClass: 'w-5 text-center' },
        {
          label: "HasGst",
          field: "hasGst",
          type: "boolean",
          styleClass: "w-5 text-center",
          sortable: true,
        },
        {
          label: "IGST",
          field: "igst",
          type: "percent",
          styleClass: "w-5 text-center",
          sortable: true,
        },
        {
          label: "CGST",
          field: "cgst",
          type: "percent",
          styleClass: "w-5 text-center",
          sortable: true,
        },
        {
          label: "SGST",
          field: "sgst",
          type: "percent",
          styleClass: "w-5 text-center",
          sortable: true,
        },
        {
          label: "GST Inclusive",
          field: "inclusive",
          type: "boolean",
          styleClass: "w-5 text-center",
          sortable: true,
        },
      ],
      actions: actions,
      options: {
        debounceDelay: 500,
        actionStyleClass: "w-10 icons-td text-center",
      },
    };
  }

  openedModal: any;
  openServiceModal() {
    this.loading = false;
    this.openedModal = this.dialogs.modal(this.serviceModal, { size: "md" });
    var self = this;
    this.openedModal.result
      .then(function () {
        self.service = {};
      })
      .catch(function (e) {
        self.service = {};
      });
  }

  save() {
    console.log("PayoutComponent ::: save :: service ", this.service);
    this.loading = true;
    let self = this;
    this.service.status = "Published";
    this.accountsService
      .saveInvoiceService(this.service)
      .pipe(take(1))
      .subscribe(
        (res) => {
          self.dialogs.success(
            "Invoice Service '" + this.service.name + "' is saved successfully "
          );
          this.loading = false;
          self.invoiceServicesList.reset();
          this.openedModal.close();
        },
        (error) => {
          self.dialogs.error(error, "Error while saving");
        }
      );
  }

  action(event) {
    console.log("PayoutComponent ::: action :: event ", event);
    if (event.action == "editService") {
      this.service = _.clone(event.item);
      this.openServiceModal();
    }
    if (event.action == "archiveService") {
      var item = _.clone(event.item);
      this.dialogs
        .confirm("Are you sure to Archive " + item.name + " ?")
        .then((event) => {
          if (event.value) {
            item.status = "Archieved";
            this.accountsService
              .saveInvoiceService(item)
              .pipe(take(1))
              .subscribe((res) => {
                if (res["data"]) {
                  this.invoiceServicesList.reset();
                  this.dialogs.success(item.name + " is Archieved.");
                }
              });
          }
        });
    }
  }
}
