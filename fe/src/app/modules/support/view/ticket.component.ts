import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { debounceTime, take } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from "@angular/common/http";
import { DialogsService } from 'src/app/shared/services/dialogs.services';
import { DataLayerService } from 'src/app/shared/services/data-layer.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { SupportService } from 'src/app/shared/services/support.service';
import { UploadService } from 'src/app/shared/services/upload.service';
import { Helpers } from '../../../helpers';
import * as _ from 'lodash';
import * as moment from 'moment';

@Component({
  selector: 'ticket-view',
  templateUrl: './ticket.component.html'
})
export class TicketViewComponent implements OnInit {

  searchControl: FormControl = new FormControl();

  messageForm: FormGroup;

  messagesConfig: any = {};
  slasConfig: any = {};
  callsConfig: any = {};
  emailsConfig: any = {};

  id: any = 1;
  user: any = {};
  @ViewChild('viewEmailModal') viewEmailModal: any;
  @ViewChild('viewMessageModal') viewMessageModal: any;
  @ViewChild('messageModal') messageModal: any;
  @ViewChild('assignModal') assignModal: any;
  @ViewChild('messagesList') messagesList: any;
  @ViewChild('slasList') slasList: any;
  @ViewChild('callsList') callsList: any;
  @ViewChild('mailsList') mailsList: any;

  ticket: any = { attachments: [], booking: { client: {} }, slas: [], messages: [] };
  creditsHistory: any = {};
  loading: boolean = false;

  viewObservable: Observable<any[]>;
  invoiceTypes: any = [];
  paymentTypes: any = [];
  departments: any = [];

  constructor(private route: ActivatedRoute, private dialogs: DialogsService, private service: SupportService,
    private commonService: CommonService, private uploadService: UploadService) {
    this.paymentTypes = this.commonService.values.paymentTypes;
    this.id = this.route.snapshot.params['id'];
    var user = localStorage.getItem("cwo_user");
    if (user && user != '') {
      this.user = JSON.parse(user);
    }
  }

  ngOnInit() {
    this.messageForm = new FormGroup({
      comment: new FormControl("", Validators.required),
      attachment: new FormControl("")
    });

    this.messagesConfig = {
      columns: [
        { label: 'Message', field: 'reply', type: 'text', styleClass: 'w-55', sortable: true },
        { label: 'From', field: 'from', type: 'text', styleClass: 'w-10', sortable: true },
        { label: 'By', field: 'by', type: 'text', styleClass: 'w-15', sortable: true },
        { label: 'DateTime', field: 'date', type: 'dateTime', styleClass: 'w-15', sortable: true },
      ],
      actions: [
        { icon: 'fa fa-search', hint: 'View Message', code: 'viewMessage', style: 'info' }
      ],
      options: {
        debounceDelay: 500,
        actionStyleClass: 'w-5 icons-td text-center',
      }
    }
    this.slasConfig = {
      columns: [
        { label: 'Comment', field: 'comment', type: 'text', styleClass: 'w-80', sortable: true },
        { label: 'DateTime', field: 'date', type: 'dateTime', styleClass: 'w-10', sortable: true },
      ],
      actions: [
        { icon: 'fa fa-pencil', hint: 'Edit Comment', code: 'editComment', style: 'info' }
      ],
      options: {
        debounceDelay: 500,
        actionStyleClass: 'w-10 icons-td text-center',
      }
    }
    this.callsConfig = {
      columns: [
        { label: 'Type', field: 'type', type: 'text', styleClass: 'w-10 text-center', sortable: true },
        { label: 'From', field: 'from', type: 'text', styleClass: 'w-20 text-center', sortable: true },
        { label: 'To', field: 'to', type: 'text', styleClass: 'w-20 text-center', sortable: true },
        { label: 'Started', field: 'started', type: 'dateTime', styleClass: 'w-20 text-center', sortable: true },
        { label: 'Duration', field: 'duration', type: 'text', styleClass: 'w-10 text-center', sortable: true },
        { label: 'Status', field: 'duration', type: 'text', styleClass: 'w-10 text-center', sortable: true },
      ],
      actions: [
        { icon: 'fa fa-phone', hint: 'Call ', code: 'callBack', style: 'info' }
      ],
      options: {
        debounceDelay: 500,
        actionStyleClass: 'w-10 icons-td text-center',
      }
    }
    this.emailsConfig = {
      columns: [
        { label: 'Subject', field: 'subject', type: 'text', styleClass: 'w-60', sortable: true },
        { label: 'Receivers', field: 'receivers', type: 'text', styleClass: 'w-25', sortable: true },
        { label: 'DateTime', field: 'date', type: 'dateTime', styleClass: 'w-10', sortable: true },
      ],
      actions: [
        // { icon: 'fa fa-refresh', hint: 'Resend Mail', code: 'resendMail', style: 'info' },
        { icon: 'i-Magnifi-Glass1', hint: 'View Mail', code: 'viewMail', style: 'info' },
      ],
      options: {
        debounceDelay: 500,
        actionStyleClass: 'w-5 icons-td text-center',
      }
    }

    this.getTicket();
  }

  getTicket() {
    this.loading = true;
    this.service.getTicket(this.id).pipe(take(1)).subscribe(
      res => {
        if (res['data']) {
          this.ticket = res['data'];
          this.ticket.messages = this.ticket.messages.reverse();
        } else {
          this.dialogs.error(res['error'], 'Error ')
        }
        this.loading = false;
      },
      error => {
        this.dialogs.error(error, 'Error while saving')
      }
    )
  }

  openedModal: any;
  managerUsers: any = [];
  departmentManagers: any = [];
  getDepartmentManagers(department) {
    this.clearOldSelections();
    this.message.department = department;

    this.departmentManagers = _.filter(this.managerUsers, function(u) {
      return u.role.indexOf(department) > -1;
    })
    console.log("getDepartmentManagers :: departmentManagers : ", this.departmentManagers);
  }

  clearOldSelections() {
    this.message.toUser = null;
    this.message.user = null;
    this.message.userId = null;
    this.message.department = null;

    if (this.message.to == "InternalTeam") {
      this.message.userId = this.ticket.assignedTo;
      this.message.user = this.ticket.assigned.name;
      this.message.department = "InternalTeam";
    }
  }

  openMessageModal() {
    var data = {
      supportLevel: this.ticket.ticketContext.supportLevel,
      assigneeType: this.ticket.ticketContext.assigneeType,
    }
    this.service.getSupportUsers(data)
      .pipe(take(1)).subscribe(res => {
        console.log("Support Users : ", res['data']);
        var supportUsers = res['data'];
        supportUsers = _.reject(supportUsers, { id: this.user.id });
        this.supportUsers = supportUsers;
      });

    this.service.getManagerUsers(data)
      .pipe(take(1)).subscribe(res => {
        console.log("Manager Users : ", res['data']);
        this.managerUsers = res['data'];
      });

    if (this.isSupportManager()) {
      this.message.to = "InternalTeam";
      this.message.from = "Manager";
      this.message.userId = this.ticket.assignedTo;
      this.message.user = this.ticket.assigned && this.ticket.assigned.name;
    } else if (this.user.managerRoles.length) {
      this.message.from = this.user.managerRoles[0];
      this.message.to = "Manager";
    } else {
      this.message.to = "Manager";
      this.message.from = "Internal";
    }

    this.openedModal = this.dialogs.modal(this.messageModal, { size: 'md' });
    var self = this;
    this.openedModal.result.then(function() {
      self.message = {};
      self.loading = false;
      self.messageForm.reset();
    }).catch(function(e) {
      self.message = {};
      self.loading = false;
      self.messageForm.reset();
    })
  }

  openViewMessageModal() {
    this.openedModal = this.dialogs.modal(this.viewMessageModal, { size: 'md' });
    var self = this;

    this.service.saveTicketMessage({ id: this.message.id, ticketId: this.ticket.id, read: 1 }).subscribe(res => {
      this.message.read = 1;
    });

    this.openedModal.result.then(function() {
      self.message = {};
    }).catch(function(e) {
      self.message = {};
    })
  }

  supportUsers: any = [];
  openAssignTicket(reassign?: any) {
    var data = {
      supportLevel: this.ticket.ticketContext.supportLevel,
      assigneeType: this.ticket.ticketContext.assigneeType,
    }
    this.assignedTo = null;
    this.service.getSupportUsers(data)
      .pipe(take(1)).subscribe(res => {
        console.log("Support Users : ", res['data']);
        var supportUsers = res['data'];
        if (reassign) {
          supportUsers = _.reject(supportUsers, { id: this.ticket.assignedTo });
        }
        this.supportUsers = supportUsers;
      });

    this.openedModal = this.dialogs.modal(this.assignModal, { size: 'md' });
    var self = this;
    this.openedModal.result.then(function() {
      // self.message = {};
    }).catch(function(e) {
      // self.message = {};
    })
  }

  message: any = {};
  saveTicketMessage() {
    let self = this;
    this.loading = true;
    var message: any = {};
    if (!this.message.id) {
      message.ticketId = this.id;
      message.from = this.message.from || "Internal";
      message.by = this.user.name;
      message.to = this.message.department || this.message.to;
      message.user = this.message.user;
      message.userId = this.message.userId;
      message.fromUserId = this.user.id;

      if (!message.userId) {
        if (message.from == "Internal") {
          var myMessages = _.filter(this.ticket.messages, { from: "Manager" });
          if (myMessages.length) {
            myMessages = myMessages.reverse();
            message.userId = myMessages[0]['fromUserId'];
            message.user = myMessages[0]['by'];
          }
        } else {
          var myDepartment = this.user.managerRoles && this.user.managerRoles[0];
          if (myDepartment) {
            var myMessages = _.filter(this.ticket.messages, { to: myDepartment });
            if (myMessages.length) {
              myMessages = myMessages.reverse();
              message.userId = myMessages[0]['fromUserId'];
              message.user = myMessages[0]['by'];
            }
          }
        }
      }

      if (message.to == 'Client') {
        if (this.ticket.clientEmployee) {
          message.user = this.ticket.clientEmployee.name;
        } else {
          message.user = this.ticket.booking.client.name;
        }
      }

      // if(this.isSupportManager() && message.userId != this.ticket.assignedTo){
      //   this.service.saveTicket({id: this.ticket.id, assignedTo : message.userId})
      //     .subscribe(res=> {})
      // }
    }
    message.reply = this.message.reply;
    if (this.message.attachment && this.message.attachment.id) {
      message.docId = this.message.attachment.id;
    }
    this.service.saveTicketMessage(message).pipe(take(1)).subscribe(
      res => {
        self.dialogs.success("Ticket message is send successfully ");
        self.loading = false;
        this.getTicket();
        this.openedModal.dismiss();
      },
      error => {
        self.dialogs.error(error, 'Error while saving')
      }
    )
  }

  assignedTo: any;
  assignTicket() {
    let self = this;
    if (this.assignedTo) {
      this.loading = true;
      var data: any = {
        id: this.ticket.id,
        reassign: true,
        assignedTo: this.assignedTo
      };
      this.service.saveTicket(data).pipe(take(1)).subscribe(
        res => {
          self.dialogs.success("Ticket is assigned successfully ");
          self.loading = false;
          this.openedModal.dismiss();
          this.getTicket();
        },
        error => {
          self.dialogs.error(error, 'Error while saving')
        }
      )
    }
  }

  autoAssignTicket() {
    let self = this;
    this.loading = true;
    this.service.assignTicket(this.ticket.id).pipe(take(1)).subscribe(
      res => {
        self.loading = false;
        if (res['data']) {
          self.dialogs.success("Ticket is auto assigned successfully ");
          this.getTicket();
        } else if (res['error']) {
          self.dialogs.error(res['error']);
        }
        this.openedModal.dismiss();
      },
      error => {
        self.dialogs.error(error, 'Error while saving')
      }
    )
  }

  email: any;
  action(event) {
    console.log("TicketViewComponent ::: action :: event ", event);
    if (event.action == 'viewMessage') {
      this.message = _.clone(event.item);
      this.openViewMessageModal();
    } else if (event.action == 'viewMail') {
      var email = _.clone(event.item);
      var regex = /<head>*<\/head>/g;
      email.body = email.body.replace(regex, "");
      this.email = email;
      this.openedModal = this.dialogs.modal(this.viewEmailModal, { size: 'lg', backdrop: 'static' });
    }
  }

  changeStatus(status) {
    var self = this;
    var data: any = {
      id: this.id,
      statusChange: true,
      status: status
    }
    if (status == 'Attended') {
      data.attended = moment().toDate();
    }
    if (status == 'Resolved') {
      data.resolved = moment().toDate();
    }
    if (status == 'Closed') {
      data.closed = moment().toDate();
    }
    this.service.saveTicket(data).pipe(take(1)).subscribe(
      res => {
        self.dialogs.success("Ticket updated successfully ");
        self.getTicket();
      },
      error => {
        self.dialogs.error(error, 'Error while saving')
      }
    )
  }

  isSupportManager() {
    return !this.user.roles || this.user.managerRoles.indexOf("SUPPORT") > -1
  }

  messageAttachmentFile: any;
  messageAttachmentFileChange(event) {
    this.messageAttachmentFile = event.target.files[0];
  }

  messageAttachmentUploadResponse: any = { status: '', message: '', filePath: '' };
  messageAttachmentFileError: any;

  uploadMessageAttachmentFile() {
    const formData = new FormData();
    formData.append('file', this.messageAttachmentFile);

    this.loading = true;
    this.uploadService.upload(formData).subscribe(
      (res) => {
        this.messageAttachmentUploadResponse = res;
        if (res.file) {
          this.loading = false;
          this.message.docId = res.id;
          this.message.attachment = res;
          this.messageAttachmentFile = null;
        }
      },
      (err) => this.messageAttachmentFileError = err
    );
  }
}
