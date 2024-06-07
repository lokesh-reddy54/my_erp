import { Component, OnInit, ViewChild, NgModule } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { debounceTime, take } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from "@angular/common/http";
import { DialogsService } from 'src/app/shared/services/dialogs.services';
import { DataLayerService } from 'src/app/shared/services/data-layer.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { LeadsService } from 'src/app/shared/services/leads.service';
import { SocketService } from 'src/app/shared/services/socket.service';
import { Helpers } from '../../../helpers';
import * as _ from 'lodash';
import * as moment from 'moment';

@Component({
  selector: 'lead-view',
  templateUrl: './lead.component.html'
})
export class LeadViewComponent implements OnInit {

  searchControl: FormControl = new FormControl();

  scheduleCallForm: FormGroup;
  commentForm: FormGroup;
  visitForm: FormGroup;
  deadForm: FormGroup;
  contractForm: FormGroup;

  propositionsConfig: any = {};
  scheduleCallsConfig: any = {};
  scheduleVisitsConfig: any = {};
  commentsConfig: any = {};
  emailsConfig: any = {};

  id: any = 1;
  user: any = {};
  @ViewChild('scheduleCallModal') scheduleCallModal: any;
  @ViewChild('scheduleVisitModal') scheduleVisitModal: any;
  @ViewChild('deadModal') deadModal: any;
  @ViewChild('commentModal') commentModal: any;
  @ViewChild('contractModal') contractModal: any;
  @ViewChild('showContractsModal') showContractsModal: any;
  @ViewChild('quotesModal') quotesModal: any;
  @ViewChild('pricesModal') pricesModal: any;
  @ViewChild('propositionsList') propositionsList: any;
  @ViewChild('scheduleCallsList') scheduleCallsList: any;
  @ViewChild('scheduleVisitsList') scheduleVisitsList: any;
  @ViewChild('commentsList') commentsList: any;
  @ViewChild('emailsList') emailsList: any;

  lead: any = { client: {}, contract: {} };
  creditsHistory: any = {};
  deposit: any = 0;
  invoiceAmount: any = 0;
  paidAmount: any = 0;
  dueAmount: any = 0;
  loading: boolean = false;

  viewObservable: Observable<any[]>;
  invoiceTypes: any = [];
  paymentTypes: any = [];
  departments: any = [];
  deadReasons: any = [];
  quotes: any = [];
  selectedProposition: any = {};
  prices: any = [];
  selectedQuote: any = {};

  constructor(private route: ActivatedRoute, private dialogs: DialogsService, private service: LeadsService,
    private commonService: CommonService, private socketService: SocketService) {
    this.paymentTypes = this.commonService.values.paymentTypes;
    this.deadReasons = this.commonService.values.leadDeadReasons;
    this.id = this.route.snapshot.params['id']
  }

  ngOnInit() {
    this.commentForm = new FormGroup({
      comment: new FormControl("", Validators.required)
    });

    this.scheduleCallForm = new FormGroup({
      date: new FormControl("", Validators.required),
      time: new FormControl("", Validators.required),
      comment: new FormControl("")
    });
    this.visitForm = new FormGroup({
      date: new FormControl("", Validators.required),
      time: new FormControl("", Validators.required),
      comment: new FormControl("")
    });
    this.deadForm = new FormGroup({
      reason: new FormControl("", Validators.required),
      comment: new FormControl("", Validators.required)
    });
    this.contractForm = new FormGroup({
      security: new FormControl("", Validators.required),
      token: new FormControl("", Validators.required),
      lockinPenaltyType: new FormControl("", Validators.required),
      lockInPenalty: new FormControl("", Validators.required),
      noticePeriod: new FormControl("", Validators.required),
      noticePeriodViolationType: new FormControl("", Validators.required),
      noticePeriodViolation: new FormControl("", Validators.required),
    });

    this.propositionsConfig = {
      columns: [
        { label: 'Office', field: 'office', type: 'text', styleClass: 'w-20', sortable: true },
        { label: 'Address', field: 'location', type: 'text', styleClass: 'w-20', sortable: true },
        { label: 'Desks', field: 'desksAvailable', type: 'text', styleClass: 'w-5 text-center', sortable: true },
        { label: 'Status', field: 'status', type: 'text', styleClass: 'w-10 text-center', sortable: true },
        { label: 'Commented', field: 'isCommented', type: 'text', styleClass: 'w-10 text-center', sortable: true },
        { label: 'Visit', field: 'visit', type: 'text', styleClass: 'w-10 text-center' },
        { label: 'Interested', field: 'isInterested', type: 'text', styleClass: 'w-10 text-center' },
      ],
      actions: [
        { icon: 'fa fa-comment', hint: 'Show Comment', code: 'showComment', style: 'info' },
        { icon: 'fa fa-thumbs-up', hint: 'Interest Shown', code: 'interestShown', style: 'info' },
        { icon: 'fa fa-calendar', hint: 'Schedule Visit', code: 'scheduleVisit', style: 'info' }
      ],
      options: {
        debounceDelay: 500,
        actionStyleClass: 'w-15 icons-td text-center',
      }
    }
    this.scheduleCallsConfig = {
      columns: [
        { label: 'Type', field: 'type', type: 'text', styleClass: 'w-10', sortable: true },
        { label: 'From', field: 'from', type: 'text', styleClass: 'w-10', sortable: true },
        { label: 'To', field: 'to', type: 'text', styleClass: 'w-10', sortable: true },
        { label: 'Status', field: 'status', type: 'text', styleClass: 'w-5', sortable: true },
        { label: 'Started', field: 'started', type: 'date', styleClass: 'w-10', sortable: true },
        { label: 'Duration', field: 'duration', type: 'number', styleClass: 'w-5', sortable: true },
        { label: 'Comment', field: 'commnt', type: 'text', styleClass: 'w-5', sortable: true },
      ],
      actions: [
        { icon: 'fa fa-refresh', hint: 'Reschedule Call', code: 'rescheduleCall', style: 'info' },
        { icon: 'fa fa-phone', hint: 'Call Now', code: 'callNow', style: 'info' }
      ],
      options: {
        debounceDelay: 500,
        actionStyleClass: 'w-10 icons-td text-center',
      }
    }
    this.scheduleVisitsConfig = {
      columns: [
        { label: 'Office', field: 'office', type: 'text', styleClass: 'w-15', sortable: true },
        { label: 'Address', field: 'location', type: 'text', styleClass: 'w-25', sortable: true },
        { label: 'Status', field: 'status', type: 'text', styleClass: 'w-10', sortable: true },
        { label: 'DateTime', field: 'date', type: 'date', styleClass: 'w-10', sortable: true },
        { label: 'Comment', field: 'comment', type: 'text', styleClass: 'w-25', sortable: true },
      ],
      actions: [
        { icon: 'fa fa-refresh', hint: 'Reschedule Visit', code: 'rescheduleVisit', style: 'info' },
        { icon: 'fa fa-check', hint: 'Mark Visited', code: 'markVisited', style: 'info' }
      ],
      options: {
        debounceDelay: 500,
        actionStyleClass: 'w-10 icons-td text-center',
      }
    }
    this.commentsConfig = {
      columns: [
        { label: 'Comment', field: 'comment', type: 'text', styleClass: 'w-80', sortable: true },
        { label: 'DateTime', field: 'date', type: 'date', styleClass: 'w-10', sortable: true },
      ],
      actions: [
        { icon: 'fa fa-pencil', hint: 'Edit Comment', code: 'editComment', style: 'info' }
      ],
      options: {
        debounceDelay: 500,
        actionStyleClass: 'w-10 icons-td text-center',
      }
    }
    this.emailsConfig = {
      columns: [
        { label: 'Subject', field: 'subject', type: 'text', styleClass: 'w-80', sortable: true },
        { label: 'DateTime', field: 'date', type: 'date', styleClass: 'w-10', sortable: true },
      ],
      actions: [
        { icon: 'fa fa-refresh', hint: 'Resend', code: 'resendMail', style: 'info' }
      ],
      options: {
        debounceDelay: 500,
        actionStyleClass: 'w-10 icons-td text-center',
      }
    }


    this.getLead();
    this.getLeadPropositions();
    this.getLeadCalls();
    this.getLeadVisits();
  }

  getLead() {
    this.service.getLead(this.id).pipe(take(1)).subscribe(
      res => {
        this.lead = res['data'];
      },
      error => {
        this.dialogs.error(error, 'Error while saving')
      }
    )
  }
  leadPropositions: any = [];
  getLeadPropositions() {
    this.service.getLeadPropositions(this.id).pipe(take(1)).subscribe(
      res => {
        this.leadPropositions = res['data'];
      },
      error => {
        this.dialogs.error(error, 'Error while saving')
      }
    )
  }

  leadCalls: any = [];
  getLeadCalls() {
    this.service.getLeadCalls(this.id).pipe(take(1)).subscribe(
      res => {
        this.leadCalls = res['data'];
      },
      error => {
        this.dialogs.error(error, 'Error while saving')
      }
    )
  }
  leadVisits: any = [];
  getLeadVisits() {
    this.service.getLeadVisits(this.id).pipe(take(1)).subscribe(
      res => {
        this.leadVisits = res['data'];
      },
      error => {
        this.dialogs.error(error, 'Error while saving')
      }
    )
  }

  openedModal: any;
  openScheduleCall(call?: any) {
    if (call) {
      this.schedule = call;
      this.schedule.date = {
        year: moment(call.started).year(),
        month: moment(call.started).month(),
        day: moment(call.started).date()
      }
      this.schedule.time = moment(call.started).format("HH:mm");
    }
    this.openedModal = this.dialogs.modal(this.scheduleCallModal, { size: 'md' });
    var self = this;
    this.openedModal.result.then(function() {
      self.schedule = {};
      self.loading = false;
      self.scheduleCallForm.reset();
    }).catch(function(e) {
      self.schedule = {};
      self.loading = false;
      self.scheduleCallForm.reset();
    })
  }

  schedule: any = {};
  saveLeadCall(call?: any) {
    console.log("LeadCOmponent ::: saveLeadCall :: call : ", call);
    var schedule: any = {};
    if (call) {
      this.schedule.id = call.id;
      schedule.id = call.id;
      schedule.id = call.id;
      schedule.status = call.status;
    } else {
      schedule.id = this.schedule.id;
    }
    let self = this;
    this.loading = true;
    if (!this.schedule.id) {
      schedule.leadId = this.id;
      schedule.from = this.user.phone || "7799374474";
      schedule.to = this.lead.phone || "7799374474";
      schedule.type = "OutBound";
      schedule.status = "Scheduled";
    }
    schedule.commentId = this.schedule.commentId;
    schedule.comment = this.schedule.comment;
    schedule.started = this.schedule.date && this.toDate(this.schedule.date) + " " + this.schedule.time;
    this.service.saveLeadCall(schedule).pipe(take(1)).subscribe(
      res => {
        self.dialogs.success("Scheduled call is saved successfully ");
        self.loading = false;
        this.getLeadCalls();
        this.openedModal && this.openedModal.dismiss();
      },
      error => {
        self.dialogs.error(error, 'Error while saving')
      }
    )
  }

  callNow(call) {
    var user: any = localStorage.getItem("cwo_user");
    if (user && user != "") {
      user = JSON.parse(user);
      this.socketService.callNow({ from: user.phone, to: call.to })
    }
  }

  openScheduleVisit(prop?: any) {
    this.proposition = prop;
    if (prop.date) {
      this.visit.id = prop.id;
      this.visit.commentId = prop.commentId;
      this.visit.comment = prop.comment;
      this.visit.date = {
        year: moment(prop.date).year(),
        month: moment(prop.date).month(),
        day: moment(prop.date).date()
      }
      this.visit.time = moment(prop.date).format("HH:mm");
    }
    this.openedModal = this.dialogs.modal(this.scheduleVisitModal, { size: 'md' });
    var self = this;
    this.openedModal.result.then(function() {
      self.visit = {};
      self.loading = false;
      self.visitForm.reset();
    }).catch(function(e) {
      self.visit = {};
      self.loading = false;
      self.visitForm.reset();
    })
  }

  proposition: any = {};
  visit: any = {};
  saveLeadVisit(_visit?: any) {
    let self = this;
    this.loading = true;
    var visit: any = {};
    if (_visit) {
      this.visit.id = _visit.id;
      visit.id = _visit.id;
      visit.status = _visit.status;
    } else {
      visit.id = this.visit.id;
    }
    if (!this.visit.id) {
      visit.leadId = this.id;
      visit.officeId = this.proposition.officeId;
      visit.status = "Scheduled";
      visit.propositionId = this.proposition.id;
    }
    visit.commentId = this.visit.commentId;
    visit.comment = this.visit.comment;
    visit.date = this.visit.date && this.toDate(this.visit.date) + " " + this.visit.time;
    this.service.saveLeadVisit(visit).pipe(take(1)).subscribe(
      res => {
        self.dialogs.success("Scheduled visit is saved successfully ");
        self.loading = false;
        this.openedModal && this.openedModal.dismiss();
        this.getLeadPropositions();
        this.getLeadVisits();
      },
      error => {
        self.dialogs.error(error, 'Error while saving')
      }
    )
  }

  editPropositionsMail() {

  }

  saveLeadProposition(prop) {
    let self = this;
    this.loading = true;
    this.service.saveLeadProposition(prop).pipe(take(1)).subscribe(
      res => {
        self.dialogs.success("Proposition updated successfully ");
        self.loading = false;
        this.openedModal && this.openedModal.dismiss();
        this.getLeadPropositions();
      },
      error => {
        self.dialogs.error(error, 'Error while saving')
      }
    )
  }

  openLeadComment(propId?: any) {
    this.comment.leadPropositionId = propId;
    this.openedModal = this.dialogs.modal(this.commentModal, { size: 'md' });
    var self = this;
    this.openedModal.result.then(function() {
      self.comment = {};
      self.loading = false;
      self.commentForm.reset();
    }).catch(function(e) {
      self.comment = {};
      self.loading = false;
      self.commentForm.reset();
    })
  }

  dead: any = {};
  openDeadReason() {
    this.openedModal = this.dialogs.modal(this.deadModal, { size: 'md' });
    var self = this;
    this.openedModal.result.then(function() {
      self.dead = {};
      self.loading = false;
      self.deadForm.reset();
    }).catch(function(e) {
      self.dead = {};
      self.loading = false;
      self.commentForm.reset();
    })
  }
  saveDeadReason() {
    console.log("LeadCOmponent ::: saveDeadReason :: this.dead : ", this.dead);
    var lead: any = {};
    lead.id = this.id;
    lead.status = "Dead";
    lead.info = this.dead.reason.name;
    this.saveLeadComment();
    var self = this;
    this.service.saveLead(lead).pipe(take(1)).subscribe(
      res => {
        self.dialogs.success("Lead is marked as Dead");
        self.loading = false;
        this.getLead();
        this.openedModal && this.openedModal.dismiss();
      },
      error => {
        self.dialogs.error(error, 'Error while saving')
      }
    )
  }
  viewComment(comment) {
    this.comment.disabled = true;
    this.commentForm.get('comment').disable();
    this.comment.comment = comment;
    this.openedModal = this.dialogs.modal(this.commentModal, { size: 'md' });
    var self = this;
    this.openedModal.result.then(function() {
      self.comment = {};
      self.loading = false;
      self.commentForm.reset();
    }).catch(function(e) {
      self.comment = {};
      self.loading = false;
      self.commentForm.reset();
    })
  }

  comment: any = {};
  saveLeadComment() {
    let self = this;
    this.loading = true;
    this.comment.leadId = this.id;
    this.service.saveLeadComment(this.comment).pipe(take(1)).subscribe(
      res => {
        self.dialogs.success("Lead Comment is saved successfully ");
        self.loading = false;
        this.openedModal.dismiss();
        if (this.comment.leadPropositionId) {
          this.getLeadPropositions();
        }
        this.commentsList && this.commentsList.reset();
      },
      error => {
        self.dialogs.error(error, 'Error while saving')
      }
    )
  }

  updatingAvailability;
  updatePropositions() {
    this.updatingAvailability = true;
    this.service.updateLeadPropositions(this.lead.id).pipe(take(1)).subscribe(
      res => {
        this.dialogs.success("Lead propositions updated successfully ");
        this.updatingAvailability = false;
        this.getLeadPropositions();
      },
      error => {
        this.dialogs.error(error, 'Error while saving')
      }
    )
  }

  sendingLeadPropositions;
  sendLeadPropositions() {
    this.sendingLeadPropositions = true;
    this.service.sendLeadPropositions(this.lead.id).pipe(take(1)).subscribe(
      res => {
        if (res['data']) {
          this.dialogs.success("Lead propositions are mailed successfully ");
        } else {
          this.dialogs.error(res['error']);
        }
        this.sendingLeadPropositions = false;
      },
      error => {
        this.dialogs.error(error, 'Error while saving')
      }
    )
  }

  action(event) {
    console.log("LocationsComponent ::: action :: event ", event);
    if (event.action == 'scheduleVisit') {
      this.proposition = _.clone(event.item);
      this.openScheduleVisit();
    } else if (event.action == 'listCities') {

    }
  }

  toDate(obj) {
    var date = moment(obj.year + "-" + obj.month + "-" + obj.day, "YYYY-MM-DD").format("YYYY-MM-DD");
    return date;
  }

  viewPropositionQuotes(prop) {
    this.selectedProposition = prop;
    this.loading = true;
    this.quotes = [];
    this.prices = [];
    this.service.getPropositionQuotes(prop.id)
      .pipe(take(1)).subscribe(res => {
        if (res['data']) {
          this.quotes = res['data'];
        } else {
          this.dialogs.error(res['error']);
        }
        this.loading = false;
      });
    this.openedModal = this.dialogs.modal(this.quotesModal, { size: 'lg' });
  }
  viewPrices(quote) {
    console.log("viewPrices :: quote : ", quote);
    this.selectedQuote = quote;
    this.prices = quote.prices;
    this.openedModal = this.dialogs.modal(this.pricesModal, { size: 'lg' });
  }

  createQuote: any = false;
  createPropositionQuote(name) {
    this.loading = true;
    var data = {
      propositionId: this.selectedProposition.id,
      officeId: this.selectedProposition.officeId,
      deskType: this.lead.deskType,
      desks: this.lead.desks,
      name: name
    }
    this.service.createPropositionQuote(data)
      .pipe(take(1)).subscribe(res => {
        this.loading = false;
        this.createQuote = false;
        if (res['data']) {
          this.quotes.push(res['data']);

        } else {
          this.dialogs.error(res['error']);
        }
      });
  }

  duplicate: any;
  copyQuote(quote) {
    this.createQuote = true;
    this.duplicate = _.clone(quote);
    this.duplicate.name = 'Quote Revision ' + (this.quotes.length + 1);
  }
  copyPropositionQuote(quote) {
    this.loading = true;
    this.service.copyPropositionQuote(quote)
      .pipe(take(1)).subscribe(res => {
        this.loading = false;
        this.createQuote = false;
        if (res['data']) {
          this.quotes.push(res['data']);
          this.duplicate = null;
        } else {
          this.dialogs.error(res['error']);
        }
      });
  }
  savePriceQuote(price) {
    this.loading = true;
    this.service.savePriceQuote(price)
      .pipe(take(1)).subscribe(res => {
        this.loading = false;
        if (res['data']) {
          this.dialogs.success("Price quote updated ..!!")
        } else {
          this.dialogs.error(res['error']);
        }
      });
  }
  sendQuotationMail(quote) {
    this.loading = true;
    var data = {
      quoteId: quote.id,
      propositionId: this.selectedProposition.id
    }
    this.service.sendQuotationMail(data)
      .pipe(take(1)).subscribe(res => {
        this.loading = false;
        if (res['data']) {
          quote.status = "MailSent";
          this.dialogs.success("Price Quotation is sent  successfully ..!!")
        } else {
          this.dialogs.error(res['error']);
        }
      });
  }

  contract: any;
  selectedPrice: any = [];
  openContract(price) {
    this.selectedPrice = price;
    this.contract = {
      priceId: price.id,
      type: this.lead.deskType,
      rent: price.price,
      lockIn: price.lockIn
    }
    this.openedModal = this.dialogs.modal(this.contractModal, { size: 'md' });
  }

  contracts: any = [];
  showContracts(price) {
    this.selectedPrice = price;
    this.contracts = price.contracts;
    this.openedModal = this.dialogs.modal(this.showContractsModal, { size: 'xlg' });
  }

  savePriceContract(confirm) {
    this.loading = true;
    this.contract.propositionId = this.selectedProposition.id;
    this.contract.status = 'Confirmed';
    this.contract.deskType = this.lead.deskType;
    this.service.savePriceContract(this.contract)
      .pipe(take(1)).subscribe(res => {
        if (res['data']) {
          this.dialogs.success("Proposition Contract sent successfully ..!!")
          this.openedModal.close();
          if (!this.selectedPrice.contracts) {
            this.selectedPrice.contracts = [];
          }
          var contract = res['data'];
          contract.sentOn = new Date();
          this.selectedPrice.contracts.push(contract);
          this.getLead();
        } else {
          this.dialogs.error(res['error']);
        }
        this.loading = false;
      });
  }

  openMail(mailId) {

  }

  createBooking(contract) {
    var self = this;
    var dialog = this.dialogs.newBooking();
    contract.term = 'LongTerm';
    contract.rent = this.selectedPrice.price;
    contract.facilitySetId = this.selectedPrice.facilitySetId;
    dialog.componentInstance.contract = contract;
    var client = {
      leadId: this.lead.id,
      name: this.lead.name,
      phone: this.lead.phone,
      email: this.lead.email,
      company: this.lead.companyName,
      address: this.lead.address,
    }
    var booking = {
      startDate: this.lead.startDate,
      desks: this.lead.desks,
    }
    dialog.componentInstance.facilities = this.selectedPrice.facilities;
    dialog.componentInstance.totalBookingPrice = this.selectedPrice.price;
    dialog.componentInstance.booking = booking;
    dialog.componentInstance.client = client;
    dialog.componentInstance.selectedLocation = { id: this.selectedProposition.locationId };
    dialog.componentInstance.selectedOfficeId = this.selectedProposition.officeId;

    dialog.result.then(function(data) {
      console.log("LeadComponent ::: createBooking : data : ", data);
      if (data.id) {
        dialog.close(data);
        self.dialogs.success("Booking created successfully ... !!");
        self.service.saveLead({ info: "Booking Created", id: self.lead.id })
          .pipe(take(1)).subscribe(res => {
            self.getLead();
            setTimeout(function() {
              // window.location.reload();
            }, 3000);
          })
      }
    }).catch(function(e) {

    })
  }


}
