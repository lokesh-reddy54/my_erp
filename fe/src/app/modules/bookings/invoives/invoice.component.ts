import { Component, OnInit, ViewChild, ChangeDetectorRef } from "@angular/core";
import {
  FormControl,
  FormBuilder,
  FormGroup,
  Validators,
} from "@angular/forms";
import { debounceTime, take } from "rxjs/operators";
import { Observable } from "rxjs";
import { ActivatedRoute, Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { DialogsService } from "src/app/shared/services/dialogs.services";
import { DataLayerService } from "src/app/shared/services/data-layer.service";
import { CommonService } from "src/app/shared/services/common.service";
import { BookingsService } from "src/app/shared/services/bookings.service";
import { UploadService } from "src/app/shared/services/upload.service";
import { AccountsService } from "src/app/shared/services/accounts.service";
import { ReportsService } from 'src/app/shared/services/reports.service';
import { Helpers } from "../../../helpers";
import { Utils } from "src/app/shared/utils";
import * as _ from "lodash";
import * as moment from "moment";
import * as json2csv  from 'json2csv';


@Component({
  selector: "invoices-view",
  templateUrl: "./invoice.component.html",
})

export class InvoicesComponent implements OnInit {
  searchControl: FormControl = new FormControl();
  form: FormGroup;
  invoiceForm: FormGroup;
  paymentForm: FormGroup;

  id: any = 1;
  @ViewChild("viewEmailModal") viewEmailModal: any;
  @ViewChild("invoiceModal") invoiceModal: any;
 

  booking: any = { client: {}, contract: {} };
  filter: any = {};
  deposit: any = 0;
  invoiceAmount: any = 0;
  paidAmount: any = 0;
  dueAmount: any = 0;
  extraAmount: any = 0;
  liabilityClearedAmount: any = 0;
  loading: boolean = false;

  selectedDeskType: any;

  viewObservable: Observable<any[]>;
  invoiceTypes: any = [];
  invoiceServices: any = [];
  paymentTypes: any = [];
  departments: any = [];
  contactPurposes: any = [];
  offset: number;
  limit: number;
  totalBuildingWiseBookings: number;

  constructor(
    private ref: ChangeDetectorRef,
    private route: ActivatedRoute,
    private dialogs: DialogsService,
    private service: BookingsService,
    private commonService: CommonService,
    private uploadService: UploadService,
    private accountsService: AccountsService,
    private reports: ReportsService
  ) {
    this.invoiceTypes = this.commonService.values.invoiceTypes;
    this.paymentTypes = this.commonService.values.paymentTypes;
    this.departments = this.commonService.values.departments;
    this.contactPurposes = this.commonService.values.contactPurposes;
    this.id = this.route.snapshot.params["id"];
  }

  user: any = {};
  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem("cwo_user"));
    this.filter.search = '';
      this.searchControl.valueChanges
      .pipe(debounceTime(200))
      .subscribe(value => {
        console.log("Search Value :: ", value)
        this.filter.search = value;
        this.resetList();
      });

    this.form = new FormGroup({
      name: new FormControl("", Validators.required),
      phone: new FormControl(
        "",
        Validators.compose([
          Validators.required,
          Validators.pattern("^[6,7,8,9][0-9]{9}$"),
        ])
      ),
      email: new FormControl(
        "",
        Validators.compose([Validators.required, Validators.email])
      ),
      username: new FormControl(
        "",
        Validators.compose([
          Validators.maxLength(100),
          Validators.minLength(3),
          Validators.required,
        ])
      ),
      password: new FormControl(
        "",
        Validators.compose([
          Validators.maxLength(20),
          Validators.minLength(3),
          Validators.required,
        ])
      ),
    });
    this.invoiceForm = new FormGroup({
      type: new FormControl("", Validators.required),
      date: new FormControl("", Validators.required),
      dueDate: new FormControl("", Validators.required),
      amount: new FormControl("", Validators.required),
      description: new FormControl("", Validators.required),
      remarks: new FormControl("", Validators.required),
    });
    this.paymentForm = new FormGroup({
      type: new FormControl("", Validators.required),
      date: new FormControl("", Validators.required),
      amount: new FormControl("", Validators.required),
      utr: new FormControl("", Validators.required),
      comments: new FormControl(""),
    });


    this.filter.startDate = moment().startOf('month');
    this.filter.endDate = moment().add(1, 'months').endOf('month');
    var self = this;
    var picker: any = $('#daterangepicker');
    picker.daterangepicker({
      opens: 'left',
      startDate: this.filter.startDate,
      endDate: this.filter.endDate,
      ranges: {
        // 'Today': [moment(), moment()],
        // 'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
        // 'Last 7 Days': [moment().subtract(6, 'days'), moment()],
        'Last 30 Days': [moment().subtract(29, 'days'), moment()],
        'This Month': [moment().startOf('month'), moment().endOf('month')],
        'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
      }
    }, function(start, end, label) {
      console.log("A new date selection was made: " + label);
      self.filter.startDate = start.format('YYYY-MM-DD');
      self.filter.endDate = end.format('YYYY-MM-DD');
      self.resetList();
    });    

    this.loadInvoices();
  }


  invoices = [];
  loadInvoices() {
    console.log("loadInvoices :: ");
    this.service
      .getAllInvoices(this.filter)
      .pipe(take(1))
      .subscribe((res) => {
        this.invoices = res["data"];
        this.loading = false;
        this.deposit = _.sumBy(
          _.filter(this.invoices, function (i) {
            return (
              i.isLiability == 1 &&
              i.isCancelled == 0 &&
              i.isLiabilityCleared == 0
            );
          }),
          "amount"
        );
        this.invoiceAmount = _.sumBy(
          _.filter(this.invoices, function (i) {
            return i.isLiability == 0 && i.isCancelled == 0;
          }),
          "amount"
        );
        this.liabilityClearedAmount = _.sumBy(
          _.filter(this.invoices, function (i) {
            return i.isLiabilityCleared == 1 && i.isCancelled == 0;
          }),
          "amount"
        );
        this.dueAmount = _.sumBy(
          _.filter(this.invoices, function (i) {
            return i.isCancelled == 0;
          }),
          "due"
        );

        // this.loadPayments();
      });
  }

  paymentsList = [];
  allPaymentsList = [];
  liabilityPaid: any = false;
  showCancelled: any = false;
  toRefund: any = 0;
  // showCancelledPayments(showCancelled?: any) {
  //   if (!showCancelled) {
  //     this.paymentsList = _.filter(this.allPaymentsList, { cancelled: 0 });
  //   } else {
  //     this.paymentsList = _.filter(this.allPaymentsList, { cancelled: 1 });
  //   }
  // }
  // loadPayments(showCancelled?: any) {
  //   this.service
  //     .getPayments(this.id)
  //     .pipe(take(1))
  //     .subscribe((res) => {
  //       this.allPaymentsList = res["data"];
  //       this.paymentsList = _.filter(this.allPaymentsList, { cancelled: 0 });
  //       this.loading = false;

  //       console.log("loadAllPayments :: " + this.allPaymentsList);

  //       this.paidAmount = _.sumBy(this.paymentsList, "amount");
  //       if (this.deposit && this.paidAmount >= this.deposit) {
  //         this.liabilityPaid = true;
  //         this.paidAmount = this.paidAmount - this.deposit;
  //       }
  //       this.extraAmount = this.paidAmount - this.invoiceAmount;
  //       if (
  //         this.liabilityClearedAmount > 0 &&
  //         this.paidAmount > this.invoiceAmount
  //       ) {
  //         this.toRefund = this.paidAmount - this.invoiceAmount;
  //       }

  //       if ( this.booking.exitRequest &&
  //         (!this.booking.exitRequest.fcpStatus || this.booking.exitRequest.fcpStatus == "Rejected")
  //       ) 
  //       {
  //         this.calculateExitCharges();
  //       }
  //     });
  // }

  resetList() {
    this.offset = 0;
    this.limit = 20;
    this.loadInvoices();
    // if (this.moreFilters) {
    //   this.loadBuildingBookings();
    // }
  }

  openedModal: any;

  invoice: any = {};
  openInvoiceModal() {
    this.openedModal = this.dialogs.modal(this.invoiceModal, { size: "md" });
    var self = this;
    this.accountsService
      .listInvoiceServices({ filters: { status: "Published" }, limit: 100 })
      .pipe(take(1))
      .subscribe((res) => {
        if (res["data"]) {
          this.invoiceServices = res["data"];
        } else {
          this.dialogs.error(res["error"]);
        }
        this.loading = false;
      });
    this.openedModal.result
      .then(function () {
        self.invoice = {};
        self.loading = false;
        self.invoiceForm.reset();
      })
      .catch(function (e) {
        self.invoice = {};
        self.loading = false;
        self.invoiceForm.reset();
      });
  }

  updateInvoiceName() {
    if (this.invoice.type && this.invoice.date) {
      if (this.invoice.type.monthly) {
        this.invoice.name =
          this.invoice.type.name +
          " for " +
          moment(this.invoice.date).format("MMM YYYY");
      } else {
        this.invoice.name = this.invoice.type.name;
      }
    }
  }
  saveInvoice() {
    let self = this;
    this.loading = true;
    var invoice = _.clone(this.invoice);
    invoice.bookingId = this.id;
    invoice.date = Utils.ngbDateToMoment(this.invoice.date)
      .add(9, "hours")
      .toDate();
    invoice.dueDate = Utils.ngbDateToMoment(this.invoice.dueDate)
      .add(9, "hours")
      .toDate();
    invoice.startDate = Utils.ngbDateToMoment(this.invoice.date)
      .startOf("month")
      .add(9, "hours")
      .toDate();
    invoice.endDate = Utils.ngbDateToMoment(this.invoice.date)
      .endOf("month")
      .add(9, "hours")
      .toDate();
    // invoice.invoiceServiceId = this.invoice.invoiceService.id;
    this.invoice.invoiceService = _.find(this.invoiceServices, {
      id: invoice.invoiceServiceId,
    });
    invoice.type = this.invoice.invoiceService.type;
    invoice.name = this.invoice.invoiceService.name;
    invoice.isLiability = this.invoice.invoiceService.isLiability;
    delete invoice.booking;
    this.service
      .saveInvoice(invoice)
      .pipe(take(1))
      .subscribe(
        (res) => {
          self.dialogs.success(
            "Invoice '" + invoice.name + "' saved successfully "
          );
          self.loading = false;
          this.openedModal.dismiss();
          self.loadInvoices();
        },
        (error) => {
          self.dialogs.error(error, "Error while saving");
        }
      );
  }
  // payment: any = {};
  // openPaymentModal() {
  //   if (this.booking.contract.status != "Confirmed") {
  //     this.dialogs.msg(
  //       "Please confirm the contract of this booking to add payment to this booking..",
  //       "error"
  //     );
  //     return;
  //   }
  //   this.openedModal = this.dialogs.modal(this.paymentModal, { size: "md" });
  //   var self = this;
  //   this.openedModal.result
  //     .then(function () {
  //       self.payment = {};
  //       self.paymentForm.reset();
  //       self.loading = false;
  //     })
  //     .catch(function (e) {
  //       self.payment = {};
  //       self.paymentForm.reset();
  //       self.loading = false;
  //     });
  // }
  // savePayment() {
  //   let self = this;
  //   this.loading = true;
  //   var payment = _.clone(this.payment);
  //   payment.bookingId = this.id;
  //   payment.date = Utils.ngbDateToDate(this.payment.date);
  //   payment.type = this.payment.type.type;
  //   this.service
  //     .savePayment(payment)
  //     .pipe(take(1))
  //     .subscribe(
  //       (res) => {
  //         self.dialogs.success("Payment is saved successfully ");
  //         self.loading = false;
  //         this.openedModal.dismiss();
  //         this.loadInvoices();
  //       },
  //       (error) => {
  //         self.dialogs.error(error, "Error while saving");
  //       }
  //     );
  // }
  // openPaymentsList() {
  //   this.openedModal = this.dialogs.modal(this.paymentsListModal, {
  //     size: "lg",
  //   });
  //   this.openedModal.result.then(function () {}).catch(function (e) {});
  // }



  isCancellable(item) {
    return item.status != "Cancelled";
  }

  sendInvoice(item: any) {
    console.log("sendInvoice :: item :: ", item)
    let client = '';
    let employees = "";
    if(item.booking.client){
      client = item.booking.client.email;
      console.log("client :: client :--:", client)
      if(item.booking.client.employees.length){
        item.booking.client.employees.forEach(e => {
          employees += e.email + ", ";
          console.log("employees :: employees :--:", employees)
      })
      }
    }
    console.log("client :: client ::", client)
    console.log("employees :: employees ::", employees)
    var self = this;
    this.dialogs.confirm(`Send Invoice to :: ${client +", "+ employees}` , 'Confirm')
      .then(event => {
        if (event.value) {
          this.loading = true;
          this.service
            .sendInvoice(item.id)
            .pipe(take(1))
            .subscribe(
              (res) => {
                if (res["data"]) {
                  this.dialogs.success(
                    "Invoice is sent to client mail successfully "
                  );
                } else if (res["error"]) {
                  this.dialogs.error(res["error"]);
                }
                this.loading = false;
              },
              (error) => {
                this.loading = false;
                this.dialogs.error(error, "Error while saving");
              }
            );
        } 
        // else {
        //   self.dialogs.msg("Don't Send Invoice", "Yes")
        // }
      })

  }

  isInvoiceCorrect(item: any) {
    console.log("updateInvoiceStatus :: item :: ", item)

    let dialogsText = ""
    if(item.booking.client){
      dialogsText = "<br>Client: "+item.booking.client.name+ "<br> | Taxable Amount: "+ item.taxableAmount
      +"\n | GST: "+item.gst+"\n | TDS: "+ item.tds+"\n | Total: "+ item.amount;
    }

    let data = {
      id: item.id,
      isCorrect: 1
    }

    var self = this;
    this.dialogs.confirm(`Check Invoice :: ${dialogsText}` , 'Confirm')
      .then(event => {
        if (event.value) {
          this.loading = true;
          this.service
            .updateInvoiceStatus(data)
            .pipe(take(1))
            .subscribe(
              (res) => {
                if (res["data"]) {
                  this.dialogs.success(
                    "Invoice is Status Updated Successfully "
                  );
                } else if (res["error"]) {
                  this.dialogs.error(res["error"]);
                }
                this.loading = false;
              },
              (error) => {
                this.loading = false;
                this.dialogs.error(error, "Error while saving");
              }
            );
        } 
        // else {
        //   self.dialogs.msg("Don't Send Invoice", "Yes")
        // }
      })

  }

  isInvoiceSent(item: any) {
    console.log("updateInvoiceStatus :: item :: ", item)
    let data = {
      id: item.id,
      isSent: 1
    }

    var self = this;
    this.dialogs.confirm(`Invoice Sent Status Successfully` , 'Confirm')
      .then(event => {
        if (event.value) {
          this.loading = true;
          this.service
            .updateInvoiceStatus(data)
            .pipe(take(1))
            .subscribe(
              (res) => {
                if (res["data"]) {
                  this.dialogs.success(
                    "Invoice is sent to client mail successfully "
                  );
                } else if (res["error"]) {
                  this.dialogs.error(res["error"]);
                }
                this.loading = false;
              },
              (error) => {
                this.loading = false;
                this.dialogs.error(error, "Error while saving");
              }
            );
        } 
        // else {
        //   self.dialogs.msg("Don't Send Invoice", "Yes")
        // }
      })

  }

  cancelInvoice(item: any) {
    if (moment(item.date).isBefore(moment().startOf("month"))) {
      this.dialogs.error(
        "Cant cancel this invoice as this is previous months invoice"
      );
      return;
    }
    var self = this;
    this.dialogs
      .prompt(
        "Please specify reason for cancelling Invoice of amount Rs." +
          item.amount
      )
      .then((result) => {
        if (result.value) {
          self.loading = true;
          item.cancelledReason = result.value;
          self.service
            .cancelInvoice(item)
            .pipe(take(1))
            .subscribe(
              (res) => {
                if (res["data"]) {
                  self.dialogs.success("Invoice is cancelled successfully ");
                  self.loading = false;
                  self.loadInvoices();
                } else if (res["error"]) {
                  self.dialogs.error(res["error"]);
                }
              },
              (error) => {
                self.dialogs.error(error, "Error while saving");
              }
            );
        }
      });
  }

  editInvoice(item) {
    if (moment(item.date).isBefore(moment().startOf("month").add(-60, 'days'))) {
      this.dialogs.error(
        "Cant edit this invoice as this is previous months invoice"
      );
      return;
    }
    this.invoice = _.clone(item);
    this.invoice.date = {
      year: moment(item.date).year(),
      month: moment(item.date).month() + 1,
      day: moment(item.date).date(),
    };
    this.invoice.dueDate = {
      year: moment(item.dueDate).year(),
      month: moment(item.dueDate).month() + 1,
      day: moment(item.dueDate).date(),
    };
    this.openInvoiceModal();

    // this.openedModal = this.dialogs.modal(this.invoiceModal, { size: 'md' });
    // var self = this;
    // this.openedModal.result.then(function() {
    //   self.invoice = {};
    //   self.loading = false;
    //   self.invoiceForm.reset();
    // }).catch(function(e) {
    //   self.invoice = {};
    //   self.loading = false;
    //   self.invoiceForm.reset();
    // })
  }
  save() {
    console.log("UsersComponent ::: save :: user ");
    this.loading = true;
    var self = this;
    setTimeout(function () {
      self.loading = false;
      self.dialogs.success("Toastr success!", "Toastr title");
    }, 5000);
  }

  comment: any;
  savingComment: any = false;
  addComment() {
    this.comment = { exitRequestId: this.booking.exitRequest.id };
  }
  saveComment() {
    this.comment.status = "Published";
    var comment = _.clone(this.comment);
    this.savingComment = true;
    this.service
      .saveExitComment(comment)
      .pipe(take(1))
      .subscribe((res) => {
        if (res["data"]) {
          this.dialogs.success("Other comment charge is saved .. !");
          this.booking.exitRequest.comments.push(res["data"]);
          this.comment = null;
        } else {
          this.dialogs.error(res["error"]);
        }
        this.savingComment = false;
      });
  }
  deleteComment(comment) {
    comment.status = "Archived";
    this.savingComment = true;
    this.service
      .saveExitComment(comment)
      .pipe(take(1))
      .subscribe((res) => {
        this.booking.exitRequest.comments = _.without(
          this.booking.exitRequest.comments,
          comment
        );
        this.savingComment = false;
      });
  }





  // checkForAccess(element) {
    // return Helpers.checkAccess(element);
  // }

  email: any;
  action(event) {
    console.log("BookingsComponent ::: action :: event ", event);
    if (event.action == "view") {
      var email = _.clone(event.item);
      var regex = /<head>*<\/head>/g;
      email.body = email.body.replace(regex, "");
      this.email = email;
      this.openedModal = this.dialogs.modal(this.viewEmailModal, {
        size: "lg",
        backdrop: "static",
      });
    }
  }
  selectedBuilding: any = {};
  buildingBookings: any = [];
  bodyfilter: any = { statuses: ['New', 'Booked', "Active"], excludeStatuses: ['Cancelled', 'Settled'], deskType: ['PrivateOffice', 'EnterpriseOffice'], };
  loadBuildingBookings() {
    this.reports.loadBuildingBookings(this.bodyfilter)
      .subscribe(res => {
        this.totalBuildingWiseBookings=0;
        this.buildingBookings = res['data'];
        for (let i = 0; i < res['data'].length; i++) {  //loop through the array
          this.totalBuildingWiseBookings += res['data'][i].count;  //Do the math!
          console.log(
            this.totalBuildingWiseBookings
          );
        }
        

      })
  }

  downloadFile() {

    let invoicedata= [];

    for (const i of this.invoices) {
      console.log(i);
      let pdffile='';
      let building = "";
      let floor = '';
      let company = '';
      let item = '';
      let client = '';
      let gstNo = '';
      let panNo = '';
      let employees = "";
      let parkingpdf = '';
      let contractType = '';
      let contractTerm = '';
      let clientphone ='';

      if(i.booking.client){
        client = i.booking.client.email;
        clientphone = i.booking.client.phone;
        gstNo = i.booking.client.gstNo;
        panNo = i.booking.client.panNo;
        console.log("client :: client :--:", client)
        if(i.booking.client.employees.length){
          i.booking.client.employees.forEach(e => {
            employees += e.email + ", ";
            console.log("employees :: employees :--:", employees)
        })
        }
      }
      if(i.pdf){
        pdffile = i.pdf.file;
      }
      if(i.parkingPdf){
        parkingpdf = i.parkingPdf.file;
      }
      if(i.booking){
        if(i.booking.office){
          building = i.booking.office.building.name;
          floor = i.booking.office.name;
        }
        company = i.booking.client.company;
        if(i.booking.contract){
          contractType = i.booking.contract.deskType;
          contractTerm = i.booking.contract.term;
        }
      }
      if(i.items){
        item = i.items[0].item;
      }
      invoicedata.push({
        ID: i.id,
        BID:i.bookingId,
        Building: building,
        Floor: floor,
        Type: contractType,
        Term: contractTerm,
        company: company,
        Kind: i.type,
        RefNo: i.refNo,
        TaxableAmount: i.taxableAmount,
        GST: i.gst,
        TDS: i.tds,
        Total:i.amount,
        Desc: item,
        Remarks: i.remarks,
        // isCorrect: i.isCorrect,
        isSent: i.isSent,
        sendInvoice: i.booking.sendInvoice,
        cancelledReason: i.cancelledReason,
        Pdf: pdffile,
        Parking: parkingpdf,
        GSTNo: gstNo,
        PANno: panNo,
        PrimaryMail: client,
        Phone: clientphone,
        SecondaryMails: employees,
      });
    }

    let arrHeader = ["name", "age", "country", "phone"];
    let csvData = JSON.stringify(invoicedata);

    // try {
    //   const opts = {};
    //   const parser = new Parser(opts);
    //   const csvData = parser.parse(invoicedata);
    //   console.log(csvData);
    // } catch (err) {
    //   console.error(err);
    // }

    csvData = json2csv.parse(invoicedata)
    let blob = new Blob(['\ufeff' + csvData], { type: 'text/csv;charset=utf-8;' });
    let dwldLink = document.createElement("a");
    let url = URL.createObjectURL(blob);
    let isSafariBrowser = navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1;
    if (isSafariBrowser) {  //if Safari open in new window to save file with random filename.
      dwldLink.setAttribute("target", "_blank");
    }
    dwldLink.setAttribute("href", url);
    dwldLink.setAttribute("download", "invoices.csv");
    dwldLink.style.visibility = "hidden";
    document.body.appendChild(dwldLink);
    dwldLink.click();
    document.body.removeChild(dwldLink);
  }

  parkingInvoiceFile: any;
  companyRegistrationFileChange(event) {
    this.parkingInvoiceFile = event.target.files[0];
  }  
  parkingInvoiceUploadResponse: any = {
    status: "",
    message: "",
    filePath: "",
  };
  companyRegistrationFileError: any;
  uploadParkingInvoiceFile() {
    const formData = new FormData();
    formData.append("file", this.parkingInvoiceFile);
    this.loading = true;
    this.uploadService.upload(formData).subscribe(
      (res) => {
        this.parkingInvoiceUploadResponse = res;
        if (res.file) {
          this.loading = false;
          this.booking.client.companyRegistration = res;
          // this.client.companyRegistrationId = res.id;
          this.service
            .saveClient({
              id: this.booking.client.id,
              parkingPdfId: res.id,
            })
            .pipe(take(1))
            .subscribe((res) =>
              this.dialogs.success(
                "Parking invoice uploaded successfully..!!"
              )
            );
        }
      },
      (err) => (this.companyRegistrationFileError = err)
    );
  }

}


