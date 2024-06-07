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
import { Utils } from "src/app/shared/utils";
import { DialogsService } from "src/app/shared/services/dialogs.services";
import { CommonService } from "src/app/shared/services/common.service";
import { AccountsService } from "src/app/shared/services/accounts.service";
import { AdminService } from "src/app/shared/services/admin.service";
import { PurchasesService } from "src/app/shared/services/purchases.service";
import { Helpers } from "../../../helpers";
import * as _ from "lodash";
import * as moment from "moment";
import readXlsxFile from "read-excel-file";
import { parseExcelDate } from "read-excel-file";

@Component({
  selector: "accounts-payout-entries",
  templateUrl: "./view.component.html",
})
export class AccountsPayoutEntriesComponent implements OnInit {
  payoutForm: FormGroup;

  selectedPayout: any;
  payout: any = {};
  payoutConfig: any = {};
  payoutsFilters: any = { paymentMode: "BankTransfer", notAttributed: true };

  @ViewChild("payoutsList") payoutsList: any;
  @ViewChild("infoModal") infoModal: any;
  @ViewChild("entryModal") entryModal: any;
  @ViewChild("importModal") importModal: any;
  @ViewChild("pettyCashModal") pettyCashModal: any;
  @ViewChild("debitCardModal") debitCardModal: any;
  @ViewChild("billReasonModal") billReasonModal: any;
  search: any = new FormControl("");
  vendorSearchControl: any = new FormControl("");
  amountSearchControl: any = new FormControl("");
  items: any = [];
  selectedItem: any = {};
  filters: any = {};
  loading: boolean = false;
  noResults: boolean = false;
  offset: number = 0;
  limit: number = 20;

  constructor(
    private dialogs: DialogsService,
    private purchasesService: PurchasesService,
    private service: AccountsService,
    private adminService: AdminService,
    private commonService: CommonService
  ) {}

  ngOnInit() {
    this.search.valueChanges.pipe(debounceTime(200)).subscribe((value) => {
      this.payoutsFilters.search = value;
    });

    this.vendorSearchControl.valueChanges
      .pipe(debounceTime(200))
      .subscribe((value) => {
        this.vendorSearch = value;
        this.getDebitSuggestions();
      });

    this.amountSearchControl.valueChanges
      .pipe(debounceTime(200))
      .subscribe((value) => {
        this.amountSearch = value;
        this.getDebitSuggestions();
      });
    this.getPayoutEntriesByStatus();

    this.payoutForm = new FormGroup({
      paidOn: new FormControl("", Validators.required),
      amount: new FormControl("", Validators.required),
      narration: new FormControl("", Validators.required),
    });
    var actions: any = [
      {
        icon: "fa fa-info",
        hint: "Show Entry",
        style: "info",
        code: "showInfo",
        condition: { label: "attributed", value: 1 },
      },
      // { icon: 'fa fa-pencil', hint: 'Edit Entry', code: 'editPayout', style: 'info', condition: { label: 'attributed', not: 1 }, and: { label: 'nonExpense', not: 1 } },
      // { icon: 'fa fa-check', hint: 'Attribute Entry', code: 'attributeEntry', style: 'primary', condition: { label: 'attributed', not: 1 }, also: { label: 'paymentMode', value: 'BankTransfer' }, and: { label: 'nonExpense', not: 1 } },
      // { icon: 'fa fa-check', hint: 'Attribute Entry', code: 'attributeEntry', style: 'primary', condition: { label: 'attributed', not: 1 }, also: { label: 'paymentMode', value: 'CardPayment' }, and: { label: 'nonExpense', not: 1 } },
      // { icon: 'fa fa-times', hint: 'DeAttribute Entry', code: 'deattributeEntry', style: 'danger', condition: { label: 'attributed', value: 1 }, role: 'accounts.deattributeDeditEntry' },
      // { icon: 'fa fa-times', hint: 'DeAttribute Entry', code: 'deattributeEntry', style: 'danger', condition: { label: 'nonExpense', value: 1 }, and: { label: 'attributed', not: 1 }, role: 'accounts.deattributeDeditEntry' },
    ];
    if (this.commonService.checkAccess("accounts:editDebitEntry")) {
      actions.push({
        icon: "fa fa-pencil",
        hint: "Edit Entry",
        code: "editPayout",
        style: "info",
        condition: { label: "attributed", not: 1 },
        and: { label: "nonExpense", not: 1 },
      });
    }
    if (this.commonService.checkAccess("accounts:attributeDebitEntry")) {
      actions.push({
        icon: "fa fa-check",
        hint: "Attribute Entry",
        code: "attributeEntry",
        style: "primary",
        condition: { label: "attributed", not: 1 },
        also: { label: "paymentMode", value: "BankTransfer" },
        and: { label: "nonExpense", not: 1 },
      });
      actions.push({
        icon: "fa fa-check",
        hint: "Attribute Entry",
        code: "attributeEntry",
        style: "primary",
        condition: { label: "attributed", not: 1 },
        also: { label: "paymentMode", value: "CardPayment" },
        and: { label: "nonExpense", not: 1 },
      });
    }
    if (this.commonService.checkAccess("accounts:deattributeDebitEntry")) {
      actions.push({
        icon: "fa fa-times",
        hint: "DeAttribute Entry",
        code: "deattributeEntry",
        style: "danger",
        condition: { label: "attributed", value: 1 },
        role: "accounts.deattributeDeditEntry",
      });
      actions.push({
        icon: "fa fa-times",
        hint: "DeAttribute Entry",
        code: "deattributeEntry",
        style: "danger",
        condition: { label: "nonExpense", value: 1 },
        and: { label: "attributed", not: 1 },
        role: "accounts.deattributeDeditEntry",
      });
    }
    this.payoutConfig = {
      columns: [
        {
          label: "Amount",
          field: "amount",
          type: "inr",
          styleClass: "w-10 text-right",
          sortable: true,
        },
        {
          label: "DebitedOn",
          field: "paidOn",
          tooltip: "paidBy",
          type: "date",
          styleClass: "w-10 text-center",
          sortable: true,
        },
        {
          label: "Status",
          field: "status",
          type: "text",
          styleClass: "w-10 text-center",
          sortable: true,
          lightRed: "notAttributed",
          warning: "suspense",
          tooltip: "reason",
        },
        {
          label: "UTR",
          field: "utr",
          type: "text",
          styleClass: "w-20 text-left",
          sortable: true,
        },
        {
          label: "Narration",
          field: "narration",
          type: "text",
          styleClass: "w-20 text-left",
          sortable: true,
        },
        {
          label: "Attribution / Info",
          field: "info",
          type: "url",
          styleClass: "w-20 text-left",
          url: "billFile",
          sortable: true,
        },
        // { label: 'AddedOn', field: 'addedOn', tooltip: 'addedBy', type: 'date', styleClass: 'w-10 text-center', sortable: true },
      ],
      actions: actions,
      options: {
        debounceDelay: 500,
        actionStyleClass: "w-10 icons-td text-center",
      },
    };

    // this.payoutsFilters.startDate = moment().add(-1, 'months').startOf('month');
    // this.payoutsFilters.endDate = moment().endOf('month');
    var self = this;
    var picker: any = $("#daterangepicker");
    picker.daterangepicker(
      {
        opens: "left",
        autoUpdateInput: false,
        // startDate: this.payinsFilters.startDate,
        // endDate: this.payinsFilters.endDate,
        ranges: {
          Today: [moment(), moment()],
          Yesterday: [
            moment().subtract(1, "days"),
            moment().subtract(1, "days"),
          ],
          "Last 7 Days": [moment().subtract(6, "days"), moment()],
          "Last 30 Days": [moment().subtract(29, "days"), moment()],
          "This Month": [moment().startOf("month"), moment().endOf("month")],
          "Last Month": [
            moment().subtract(1, "month").startOf("month"),
            moment().subtract(1, "month").endOf("month"),
          ],
        },
      },
      function (start, end, label) {
        console.log("A new date selection was made: " + label);
        self.payoutsFilters.startDate = start.format("YYYY-MM-DD");
        self.payoutsFilters.endDate = end.format("YYYY-MM-DD");
      }
    );
    picker.on("apply.daterangepicker", function (ev, picker) {
      $(this).val(
        picker.startDate.format("MM/DD/YYYY") +
          " - " +
          picker.endDate.format("MM/DD/YYYY")
      );
    });
    picker.on("cancel.daterangepicker", function (ev, picker) {
      $(this).val("");
      self.payoutsFilters.startDate = null;
      self.payoutsFilters.endDate = null;
    });
  }
  clearDates() {
    $("#daterangepicker").val("");
    this.payoutsFilters.startDate = null;
    this.payoutsFilters.endDate = null;
    this.payoutsList.reset();
  }
  openedModal: any;
  savePayout() {
    console.log("PayoutEntryComponent ::: save :: payout ", this.payout);
    this.loading = true;
    let self = this;
    var data: any = {
      id: this.payout.id,
      amount: this.payout.amount,
      info: this.payout.info,
      nonExpense: this.payout.nonExpense,
      suspense: this.payout.suspense,
      salary: this.payout.salary,
      paymentMode: this.payout.paymentMode,
      utr: this.payout.utr,
      narration: this.payout.narration,
      paidOn: Utils.ngbDateToDate(this.payout.paidOn),
    };
    if (data.paymentMode == "Cheque") {
      data.issuedOn = Utils.ngbDateToDate(this.payout.issuedOn);
      data.chequeNo = this.payout.chequeNo;
    }
    console.log("PayoutEntryComponent ::: save :: payout data ", data);
    this.loading = false;
    this.service
      .savePayoutEntry(data)
      .pipe(take(1))
      .subscribe(
        (res) => {
          if (res["data"]) {
            self.dialogs.success(
              "PayoutEntry of Rs. " + this.payout.amount + "  is updated. "
            );
            this.loading = false;
            self.payoutsList.reset();
            self.payoutForm.reset();
            self.openedModal.close();
            this.getPayoutEntriesByStatus();
          } else {
            self.dialogs.error(res["error"], "Error while saving");
          }
        },
        (error) => {
          self.dialogs.error(error, "Error while saving");
        }
      );
  }

  isForm: any = false;
  action(event) {
    console.log("PayoutEntryComponent ::: action :: event ", event);
    this.payout = _.clone(event.item);
    if (event.action == "editPayout") {
      this.isForm = true;
      this.openEntryModal();
    } else if (event.action == "showInfo") {
      this.showInfo(_.clone(event.item));
    } else if (event.action == "attributeEntry") {
      this.isForm = false;
      this.getDebitSuggestions();
      this.openEntryModal(event.item);
    } else if (event.action == "deattributeEntry") {
      this.deattributeEntry(event.item);
    }
  }

  deattributeEntry(entry) {
    let self = this;
    this.dialogs
      .confirm(
        "Are you sure to deattribute amount of Rs." +
          this.payout.amount +
          " for " +
          this.payout.info
      )
      .then((event) => {
        if (event.value) {
          self.loading = true;
          var payout: any = {
            id: self.payout.id,
            status: "Debited",
            attributed: null,
            suspense: null,
            salary: null,
            noBill: null,
            linked: null,
            reason: null,
            nonExpense: null,
            info: null,
            payoutPaymentId: null,
            pettyCashAccountId: null,
            debitCardAccountId: null,
            toPayoutGateway: null,
          };
          self.service.savePayoutEntry(payout).subscribe((res) => {
            if (res["data"]) {
              entry.attributed = 0;
              entry.suspense = 0;
              entry.nonRevenue = 0;
              self.loading = false;
              self.payoutsList.reset();
              self.dialogs.success("PayOut entry is attributed successfully.");
              self.getPayoutEntriesByStatus();
              if (entry.payoutPaymentId) {
                self.service
                  .savePayout({ id: entry.payoutPaymentId, linked: 0 })
                  .subscribe();
              }
            }
            self.loading = false;
          });
        }
      });
  }

  statuses: any = [];
  totalPayins: any = [];
  notAttributed: any = 0;
  suspense: any = 0;
  nonExpense: any = 0;
  linked: any = 0;
  salary: any = 0;
  noBill: any = 0;
  credited: any = 0;
  debited: any = 0;
  attributedPayouts: any = 0;
  getPayoutEntriesByStatus() {
    this.service
      .getPayoutEntriesByStatus({
        paymentMode: this.payoutsFilters.paymentMode,
        pettyCashAccountId: this.payoutsFilters.pettyCashAccountId,
        debitCardAccountId: this.payoutsFilters.debitCardAccountId,
      })
      .subscribe((res) => {
        this.statuses = res["data"]["statuses"];
        this.totalPayins = _.sumBy(this.statuses, "count");
        this.attributedPayouts = _.sumBy(
          _.filter(this.statuses, { status: "Attributed" }),
          "count"
        );
        this.noBill = res["data"]["noBill"];
        this.salary = res["data"]["salary"];
        this.linked = res["data"]["linked"];
        this.notAttributed = res["data"]["notAttributed"];
        this.nonExpense = res["data"]["nonExpense"];
        this.suspense = res["data"]["suspense"];
        this.credited = res["data"]["credited"];
        this.debited = res["data"]["debited"];
      });
  }

  showInfo(payout) {
    this.payout = payout;
    this.service
      .getPayoutEntry({ id: payout.id })
      .pipe(take(1))
      .subscribe((res) => {
        if (res["data"]) {
          this.payout.purchaseOrder = res["data"]["purchaseOrder"];
          this.payout.bill = res["data"]["bill"];
          this.payout.noBill = res["data"]["noBill"];
          this.payout.pettyCashAccount = res["data"]["pettyCashAccount"];
          this.payout.debitCardAccount = res["data"]["debitCardAccount"];
        }
      });
    this.openedModal = this.dialogs.modal(this.infoModal, { size: "md" });
    var self = this;
    this.openedModal.result
      .then(function () {
        self.payout = {};
      })
      .catch(function (e) {
        self.payout = {};
      });
  }

  openEntryModal(entry?) {
    this.searches = [];
    this.suggestions = [];
    this.cheques = [];
    this.vendorSearch = null;
    this.amountSearch = null;
    this.selectedPayout = null;

    if (!this.payout.type) {
      this.payout.type = "VendorPayment";
    }
    if (this.payout.paymentMode == "BankTransfer") {
      this.payoutForm.addControl(
        "utr",
        new FormControl("", [Validators.required])
      );
    } else {
      this.payoutForm.removeControl("utr");
    }
    if (this.payout.paymentMode == "Cheque") {
      this.payoutForm.addControl(
        "chequeNo",
        new FormControl("", [Validators.required])
      );
    } else {
      this.payoutForm.removeControl("chequeNo");
    }
    this.openedModal = this.dialogs.modal(this.entryModal, {
      size: "lg",
      keyboard: false,
    });
    var self = this;
    if (this.isForm) {
      this.payout.paidOn = Utils.dateToNgbDate(this.payout.paidOn);
    }
    if (!this.payout) {
      this.payout = {};
    }
    this.openedModal.result.then(function () {
      self.payout = {};
      self.payoutForm.reset();
      self.isForm = false;
    });
  }

  suggestions: any = [];
  searches: any = [];
  cheques: any = [];
  vendorSearch: any;
  amountSearch: any;
  getDebitSuggestions() {
    this.service
      .getDebitSuggestions({
        amount: this.amountSearch || this.payout.amount,
        paymentMode: this.payout.paymentMode,
        search: this.vendorSearch,
      })
      .subscribe((res) => {
        if (res["data"]) {
          this.searches = res["data"]["searches"];
          this.suggestions = res["data"]["suggestions"];
          this.cheques = res["data"]["cheques"];
        }
      });
  }

  linkToCheque(cheque) {
    var data = {
      id: cheque.id,
      linked: 1,
    };
    this.service.savePayoutEntry(data).subscribe((res) => {
      this.service
        .savePayoutEntry({ id: this.payout.id, linkedId: cheque.id })
        .subscribe((res) => {
          this.dialogs.success("Cheque is linked successfully .");
        });
    });
  }

  selectedVendor: any;
  selectedProvider: any;
  confirmAttribution() {
    let self = this;
    this.dialogs
      .confirm(
        "Are you sure to attribute amount of Rs." +
          this.payout.amount +
          " to " +
          (this.selectedPayout.vendor || this.payout.type)
      )
      .then((event) => {
        if (event.value) {
          self.loading = true;
          var payout: any = {
            id: this.payout.id,
            status: "Attributed",
            attributed: 1,
            suspense: 0,
            amount: this.payout.amount,
            amountSearch: this.amountSearch,
            info: this.selectedPayout.info + (this.selectedPayout.title || ""),
            payoutPaymentId: this.selectedPayout.id,
          };
          this.service.savePayoutEntry(payout).subscribe((res) => {
            if (res["data"]) {
              this.payout.attributed = 1;
              this.payout.suspense = 0;
              this.payout.nonRevenue = 0;
              this.loading = false;
              this.payoutsList.reset();
              this.openedModal.close();
              this.dialogs.success("PayOut entry is attributed successfully.");
              if (!this.amountSearch) {
                this.service
                  .savePayout({ id: this.selectedPayout.id, linked: 1 })
                  .subscribe();
              }
              this.getPayoutEntriesByStatus();
            } else {
              this.dialogs.error(res["error"]);
            }
            self.loading = false;
          });
        }
      });
  }

  openImport() {
    var self = this;
    this.openedModal = this.dialogs.modal(this.importModal, { size: "xlg" });
    this.openedModal.result
      .then(function () {
        self.importRows = [];
        self.payoutsList.reset();
        this.getPayoutEntriesByStatus();
      })
      .catch(function (e) {
        self.importRows = [];
        self.payoutsList.reset();
      });
  }

  importRows: any = [];
  onImportFileChange(event) {
    var self = this;
    this.loading = true;
    if (this.payoutsFilters.paymentMode == "BankTransfer") {
      readXlsxFile(event.target.files[0], { sheet: 1 }).then((rows) => {
        rows.shift();
        _.each(rows, function (r) {
          var date = r[0];
          // console.log("row date : ", parseExcelDate(date));
          self.importRows.push({
            date: parseExcelDate(date),
            narration: r[1],
            utr: r[2],
            amount: r[3],
          });
        });
      });
    } else if (this.payoutsFilters.paymentMode == "CardPayment") {
      readXlsxFile(event.target.files[0]).then((rows) => {
        var cards: any = {};
        rows.shift();
        for (var i = 0; i < rows.length; i++) {
          var r = rows[i];
          var date = r[0];
          date = date.replace("IST", "");
          const convertTime = moment(date, "DD MMM,YYYY hh:mm AA").format(
            "YYYY-MM-DD HH:mm:ss"
          );
          date = new Date(convertTime);
          // console.log("row date : ", moment(date, "DD MMM,YYYY hh:mm AA"));
          // if (cards[r[9]] != 'Wallet Load Credit' && cards[r[9]] != 'Reversal') {
          var debitCardAccountId = cards[r[7]];
          if (!debitCardAccountId) {
            var debitCardAccount = _.find(self.debitCardAccounts, {
              cardId: r[7],
            });
            if (debitCardAccount) {
              debitCardAccountId = debitCardAccount.id;
            }
          }
          self.importRows.push({
            debitCardAccountId: debitCardAccountId,
            date: date,
            amount: r[19],
            utr: r[10],
            narration: r[12],
          });
          // }
        }
      });
    }
    self.loading = false;
  }
  onPassBookImportFileChange(event) {
    var self = this;
    readXlsxFile(event.target.files[0]).then((rows) => {
      console.log("onPassBookImportFileChange rows : ", rows);
      for (var i = 13; i < rows.length; i++) {
        var r = rows[i];
        // var date = r[0];
        // date = date.replace("IST", "");
        // const convertTime = moment(date, "DD MMM,YYYY hh:mm AA").format("YYYY-MM-DD HH:mm:ss");
        // date = new Date(convertTime)
        // console.log("row date : ", moment(date, "DD MMM,YYYY hh:mm AA"));
        if (r[1] == "Organisation Withdraw Money") {
          var date = r[0];
          console.log("row date : ", parseExcelDate(date));
          self.importRows.push({
            date: parseExcelDate(date),
            amount: r[5],
            utr: r[4],
            narration: r[1],
          });
        }
      }
    });
  }

  savePayoutRow(row) {
    let self = this;
    var data: any = {
      id: row.id,
      amount: row.amount,
      debitCardAccountId: row.debitCardAccountId,
      paymentMode: this.payoutsFilters.paymentMode,
      utr: row.utr,
      narration: row.narration,
      paidOn: Utils.ngbDateToDate(row.date),
      duplicateCheck: true,
    };
    console.log("PayoutEntryComponent ::: save :: payout data ", data);
    this.loading = false;
    this.service
      .savePayoutEntry(data)
      .pipe(take(1))
      .subscribe(
        (res) => {
          if (res["data"]) {
            row.id = res["data"]["id"];
            self.dialogs.success(
              "PayoutEntry of Rs. " + row.amount + " is updated. "
            );
            this.loading = false;
          } else {
            self.dialogs.error(res["error"], "Error while saving");
          }
        },
        (error) => {
          self.dialogs.error(error, "Error while saving");
        }
      );
  }

  confirmImport() {
    var self = this;
    _.each(this.importRows, function (row) {
      if (!row.id) {
        self.savePayoutRow(row);
      }
    });
  }

  loadPettyCashAccounts() {
    if (!this.pettyCashAccounts) {
      this.adminService
        .listPettyCashAccounts({ filters: { active: 1 } })
        .subscribe((res) => {
          this.pettyCashAccounts = res["data"];
        });
    }
  }
  pettyCashAccounts: any;
  selectedPettyCashAccount: any;
  creditToPettyCash() {
    this.loadPettyCashAccounts();
    var self = this;
    this.selectedPettyCashAccount = null;
    this.openedModal = this.dialogs.modal(this.pettyCashModal, { size: "md" });
  }

  confirmCreditToPettyCash() {
    var self = this;
    this.dialogs
      .confirm(
        "Are you sure to credit Rs." +
          this.payout.amount +
          " to " +
          this.selectedPettyCashAccount.name +
          " ?"
      )
      .then((event) => {
        if (event.value) {
          self.service
            .savePayoutEntry({
              id: this.payout.id,
              status: "Attributed",
              attributed: 1,
              info:
                "Credited to " +
                this.selectedPettyCashAccount.name +
                " PettyCash",
              pettyCashAccountId: this.selectedPettyCashAccount.id,
            })
            .subscribe((res) => {
              this.payout.info =
                "Credited to " +
                this.selectedPettyCashAccount.name +
                " PettyCash";
              this.payout.attributed = 1;
              this.payout.status = "Attributed";
              self.dialogs.success("Successfully credited to PettyCash");
              self.payoutsList.reset();
              self.openedModal.close();
            });
        }
      });
  }

  loadDebitCardAccounts() {
    if (!this.debitCardAccounts) {
      this.adminService
        .listDebitCardAccounts({ filters: { active: 1 } })
        .subscribe((res) => {
          this.debitCardAccounts = res["data"];
        });
    }
  }
  debitCardAccounts: any;
  selectedDebitCardAccount: any;
  creditToDebitCard() {
    this.loadDebitCardAccounts();
    var self = this;
    this.selectedDebitCardAccount = null;
    this.openedModal = this.dialogs.modal(this.debitCardModal, { size: "md" });
  }
  confirmCreditToDebitCard() {
    var self = this;
    this.dialogs
      .confirm(
        "Are you sure to credit Rs." +
          this.payout.amount +
          " DebitCard Account ?"
      )
      .then((event) => {
        if (event.value) {
          self.service
            .savePayoutEntry({
              id: this.payout.id,
              status: "Attributed",
              attributed: 1,
              info: "Credited to DebitCard Accounts",
              debitCardAccountId: -1,
              // debitCardAccountId: this.selectedDebitCardAccount.id
            })
            .subscribe((res) => {
              this.payout.info = "Credited to DebitCard Accounts";
              this.payout.attributed = 1;
              this.payout.status = "Attributed";
              self.dialogs.success("Successfully credited to DebitCard");
              self.payoutsList.reset();
              self.openedModal.close();
            });
        }
      });
  }
  creditToPG() {
    var self = this;
    this.dialogs
      .confirm(
        "Are you sure to credit Rs." +
          this.payout.amount +
          " PayoutGateway Account ?"
      )
      .then((event) => {
        if (event.value) {
          self.service
            .savePayoutEntry({
              id: this.payout.id,
              status: "Attributed",
              attributed: 1,
              info: "Credited to PayoutGateway Account",
              toPayoutGateway: 1,
            })
            .subscribe((res) => {
              this.payout.info = "Credited to PayoutGateway Accounts";
              this.payout.attributed = 1;
              this.payout.status = "Attributed";
              self.dialogs.success("Successfully credited to PayoutGateway");
              self.payoutsList.reset();
              self.openedModal.close();
            });
        }
      });
  }

  reasonModal: any;
  opexCategories: any = [];
  opexCategory: any;
  opexType: any;
  opexItem: any;
  buildings: any = [];
  selectedBuilding: any;
  openBillReason() {
    var self = this;
    this.reasonModal = this.dialogs.modal(this.billReasonModal, { size: "md" });
    this.reasonModal.result
      .then(function () {
        self.payoutsList.reset();
        self.getPayoutEntriesByStatus();
      })
      .catch(function (e) {
        // self.payoutsList.reset();
      });
  }

  onHOSelected() {
    var isHO = parseInt(this.payout.isHO);
    if (isHO) {
      this.selectedBuilding = null;
    }
    this.service
      .getOpexCategories({ office: isHO })
      .pipe(take(1))
      .subscribe((res) => {
        this.opexCategories = res["data"];
      });
    if (!this.buildings.length && !isHO) {
      this.adminService
        .listBuildings({ active: 1, status: "Live" })
        .pipe(take(1))
        .subscribe((res) => {
          this.buildings = res["data"];
        });
    }
    this.opexCategory = null;
    this.opexType = null;
    this.opexItem = null;
  }

  onOpexTypeSelected() {
    this.payout.reason = null;
    if (this.opexType) {
      this.payout.reason =
        this.opexCategory.name + " / " + this.opexType.name + " Bill";
      this.payout.opexTypeId = this.opexType.id;
    }
    if (this.opexItem) {
      this.payout.reason =
        this.opexCategory.name +
        " / " +
        this.opexType.name +
        " / " +
        this.opexItem.name +
        " Bill";
      this.payout.opexTypeId = this.opexItem.id;
    }
    if (this.selectedBuilding) {
      this.payout.buildingId = this.selectedBuilding.id;
      this.payout.reason =
        this.selectedBuilding.name + " / " + this.payout.reason;
    } else {
      this.payout.buildingId = -1;
      this.payout.reason = "HO / " + this.payout.reason;
    }
    this.payout.attributed = 1;
    this.payout.status = "Attributed";
  }

  confirmReason() {
    this.loading = false;
    var self = this;
    var data = _.clone(this.payout);
    this.service
      .savePayoutEntry(data)
      .pipe(take(1))
      .subscribe(
        (res) => {
          if (res["data"]) {
            this.dialogs.success(
              "PayoutEntry of Rs. " + data.amount + " is updated. "
            );
            this.loading = false;
            this.reasonModal.close();
            this.openedModal.close();
          } else {
            this.dialogs.error(res["error"], "Error while saving");
          }
        },
        (error) => {
          this.dialogs.error(error, "Error while saving");
        }
      );
  }
}
