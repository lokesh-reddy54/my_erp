import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { ProductService } from 'src/app/shared/services/product.service';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { debounceTime, take } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HttpClient } from "@angular/common/http";

import { Helpers } from 'src/app/helpers';
import { environment } from 'src/environments/environment';
import { CommonService } from 'src/app/shared/services/common.service';
import { DialogsService } from 'src/app/shared/services/dialogs.services';
import { AdminService } from 'src/app/shared/services/admin.service';
import { ReportsService } from 'src/app/shared/services/reports.service';
import { SupportService } from 'src/app/shared/services/support.service';

import * as _ from 'lodash';
import * as moment from 'moment';

@Component({
  selector: 'support-reports',
  templateUrl: './view.component.html'
})
export class SupportReportsComponent implements OnInit, AfterViewInit {
  trackById = Helpers.trackById;

  searchControl: FormControl = new FormControl();
  loading: any = false;
  filters: any = {};

  constructor(private dialogs: DialogsService, private service: AdminService,
    public reportsService: ReportsService, private supportService: SupportService) {
  }

  ngAfterViewInit() { }

  ngOnInit() {
    this.searchControl.valueChanges
      .pipe(debounceTime(200))
      .subscribe(value => {
        this.filters.search = value;
        this.loadData();
      });
    this.loadData();
  }

  data: any;
  loadData() {
    this.loading = true;
    this.filters.fromDate = moment().startOf('month').add(-5, 'month');
    this.filters.toDate = moment().endOf('month');
    this.reportsService.getSupportReport(this.filters)
      .pipe(take(1))
      .subscribe(
        res => {
          this.loading = false;
          var data = res['data'];
          this.data = data;
          this.changeView();
        }, error => {

        });
  }

  buildings: any = [];
  selectedBuilding: any;
  buildingWise: any = false;
  reportType: any = 'Category';

  categories: any = [];
  colWidth: any = 10;

  changeView() {
    if (this.reportType == 'Monthly') {
      if (!this.buildingWise) {
        this.selectedBuilding = null;
      }
      this.generateMonthlyReport();
    } else if (this.reportType == 'Category') {
      this.generateCategoryReport();
    } else if (this.reportType == 'Assignee') {
      this.generateAssigneeReport();
    } else if (this.reportType == 'Client') {
      this.generateClientReport();
    }
  }

  totals: any = { new: 0, attended: 0, internalReply: 0, clientReply: 0, resolved: 0, closed: 0, total: 0 };
  generateCategoryReport() {
    this.totals = { new: 0, attended: 0, internalReply: 0, clientReply: 0, resolved: 0, closed: 0, total: 0 };
    var self = this;
    var data = this.data;

    var categories = _(data)
      .filter(object => object.category != null)
      .groupBy(x => x.category)
      .map((value, key) => ({
        name: key,
        tickets: value
      }))
      .value();

    _.each(categories, function(cat) {
      cat.new = _.filter(cat.tickets, { status: 'New' }).length;
      cat.attended = _.filter(cat.tickets, { status: 'Attended' }).length;
      cat.internalReply = _.filter(cat.tickets, { status: 'AwaitingInternalReply' }).length;
      cat.clientReply = _.filter(cat.tickets, { status: 'AwaitingClientReply' }).length;
      cat.resolved = _.filter(cat.tickets, { status: 'Resolved' }).length;
      cat.closed = _.filter(cat.tickets, { status: 'Closed' }).length;
      cat.total = (cat.new || 0) + (cat.attended || 0) + (cat.internalReply || 0) + (cat.clientReply || 0) + (cat.resolved || 0) + (cat.closed || 0);

      var subCategories = _(cat.tickets)
        .filter(object => object.subCategory != null)
        .groupBy(x => x.subCategory)
        .map((value, key) => ({
          name: key,
          tickets: value
        }))
        .value();

      _.each(subCategories, function(scat) {
        scat.cat = cat.name;
        scat.new = _.filter(scat.tickets, { status: 'New' }).length;
        scat.attended = _.filter(scat.tickets, { status: 'Attended' }).length;
        scat.internalReply = _.filter(scat.tickets, { status: 'AwaitingInternalReply' }).length;
        scat.clientReply = _.filter(scat.tickets, { status: 'AwaitingClientReply' }).length;
        scat.resolved = _.filter(scat.tickets, { status: 'Resolved' }).length;
        scat.closed = _.filter(scat.tickets, { status: 'Closed' }).length;
        scat.total = (scat.new || 0) + (scat.attended || 0) + (scat.internalReply || 0) + (scat.clientReply || 0) + (scat.resolved || 0) + (scat.closed || 0);

        var contexts = _(scat.tickets)
          .filter(object => object.context != null)
          .groupBy(x => x.context)
          .map((value, key) => ({
            name: key,
            tickets: value
          }))
          .value();

        _.each(contexts, function(context) {
          context.cat = cat.name;
          context.new = _.filter(context.tickets, { status: 'New' }).length;
          context.attended = _.filter(context.tickets, { status: 'Attended' }).length;
          context.internalReply = _.filter(context.tickets, { status: 'AwaitingInternalReply' }).length;
          context.clientReply = _.filter(context.tickets, { status: 'AwaitingClientReply' }).length;
          context.resolved = _.filter(context.tickets, { status: 'Resolved' }).length;
          context.closed = _.filter(context.tickets, { status: 'Closed' }).length;
          context.total = (context.new || 0) + (context.attended || 0) + (context.internalReply || 0) + (context.clientReply || 0) + (context.resolved || 0) + (context.closed || 0);

          delete context.tickets
        });

        scat.contexts = contexts;
        delete scat.tickets;
      })
      cat.subCategories = subCategories;

      self.totals.new = self.totals.new + cat.new;
      self.totals.attended = self.totals.attended + cat.attended;
      self.totals.internalReply = self.totals.internalReply + cat.internalReply;
      self.totals.clientReply = self.totals.clientReply + cat.clientReply;
      self.totals.resolved = self.totals.resolved + cat.resolved;
      self.totals.closed = self.totals.closed + cat.closed;
      self.totals.total = self.totals.total + cat.total;
      delete cat.tickets;
    })

    this.categories = categories;
    console.log("Support Report :: generateCategoryReport : categories : ", this.categories);
  }

  generateAssigneeReport() {
    this.totals = { new: 0, attended: 0, internalReply: 0, clientReply: 0, resolved: 0, closed: 0, total: 0 };

    var self = this;
    var data = this.data;

    var assignees = _(data)
      .filter(object => object.assignedTo != null)
      .groupBy(x => x.assignedTo)
      .map((value, key) => ({
        name: key,
        tickets: value
      }))
      .value();

    _.each(assignees, function(cat) {
      cat.new = _.filter(cat.tickets, { status: 'New' }).length;
      cat.attended = _.filter(cat.tickets, { status: 'Attended' }).length;
      cat.internalReply = _.filter(cat.tickets, { status: 'AwaitingInternalReply' }).length;
      cat.clientReply = _.filter(cat.tickets, { status: 'AwaitingClientReply' }).length;
      cat.resolved = _.filter(cat.tickets, { status: 'Resolved' }).length;
      cat.closed = _.filter(cat.tickets, { status: 'closed' }).length;
      cat.total = (cat.new || 0) + (cat.attended || 0) + (cat.internalReply || 0) + (cat.clientReply || 0) + (cat.resolved || 0) + (cat.closed || 0);

      self.totals.new = self.totals.new + cat.new;
      self.totals.attended = self.totals.attended + cat.attended;
      self.totals.internalReply = self.totals.internalReply + cat.internalReply;
      self.totals.clientReply = self.totals.clientReply + cat.clientReply;
      self.totals.resolved = self.totals.resolved + cat.resolved;
      self.totals.closed = self.totals.closed + cat.closed;
      self.totals.total = self.totals.total + cat.total;
      delete cat.tickets;
    })

    assignees = _.orderBy(assignees, 'name')
    this.assignees = assignees;
    console.log("Support Report :: generateAssigneeReport : assignees : ", this.assignees);
  }

  generateClientReport() {
    this.totals = { new: 0, attended: 0, internalReply: 0, clientReply: 0, resolved: 0, closed: 0, total: 0 };

    var self = this;
    var data = this.data;

    var _clients = _(data)
      .filter(object => object.client != null)
      .groupBy(x => x.client)
      .map((value, key) => ({
        name: key,
        tickets: value,
        bookingId: value[0].bookingId
      }))
      .value();

    var clients = [];
    _.each(_clients, function(client) {
      client.new = _.filter(client.tickets, { status: 'New' }).length;
      client.attended = _.filter(client.tickets, { status: 'Attended' }).length;
      client.internalReply = _.filter(client.tickets, { status: 'AwaitingInternalReply' }).length;
      client.clientReply = _.filter(client.tickets, { status: 'AwaitingClientReply' }).length;
      client.resolved = _.filter(client.tickets, { status: 'Resolved' }).length;
      client.closed = _.filter(client.tickets, { status: 'closed' }).length;
      client.total = (client.new || 0) + (client.attended || 0) + (client.internalReply || 0) + (client.clientReply || 0) + (client.resolved || 0) + (client.closed || 0);

      if (client.total) {
        clients.push(client);

        self.totals.new = self.totals.new + client.new;
        self.totals.attended = self.totals.attended + client.attended;
        self.totals.internalReply = self.totals.internalReply + client.internalReply;
        self.totals.clientReply = self.totals.clientReply + client.clientReply;
        self.totals.resolved = self.totals.resolved + client.resolved;
        self.totals.closed = self.totals.closed + client.closed;
        self.totals.total = self.totals.total + client.total;
      }
      delete client.tickets;
    })

    clients = _.orderBy(clients, 'name')
    this.clients = clients;
    console.log("Support Report :: generateAssigneeReport : clients : ", this.clients);
  }

  assignees: any = [];
  clients: any = [];
  months: any = [];
  generateMonthlyReport() {
    var self = this;
    var data = this.data;

    if (this.buildingWise) {
      var buildings = _.orderBy(data, ['buildingId'], ['asc'])
      this.buildings = _.uniq(_.map(buildings, 'building'));
      if (!this.selectedBuilding) {
        this.selectedBuilding = this.buildings[0];
      }
      data = _.filter(data, { building: this.selectedBuilding });
    }

    var _months = _.clone(_.uniq(_.map(data, 'month')));
    var months = [];
    _.each(_months, function(m) {
      months.push({ name: m, totals: { t: 0, n: 0, a: 0, r: 0, c: 0 } });
    })
    this.months = _.clone(months);
    this.months.push({ name: "Total", totals: { t: 0, n: 0, a: 0, r: 0, c: 0 } });
    this.colWidth = 60 / (this.months.length);

    var assignees = _(data)
      .groupBy(x => x.assignedTo)
      .map((value, key) => ({
        name: key,
        tickets: value
      }))
      .value();

    _.each(assignees, function(assignee) {
      var categories = _(assignee.tickets)
        .filter(object => object.category != null)
        .groupBy(x => x.category)
        .map((value, key) => ({
          name: key,
          tickets: value
        }))
        .value();
      assignee.categories = categories;
      assignee.count = 0;
      assignee.ticketsAmount = 0;
      delete assignee.tickets;

      _.each(assignee.categories, function(category) {
        assignee.count = assignee.count + category.tickets.length;
        assignee.ticketsAmount = assignee.ticketsAmount + _.sumBy(category.tickets, 'amount');

        var subCategories = _(category.tickets)
          .filter(object => object.subCategory != null)
          .groupBy(x => x.subCategory)
          .map((value, key) => ({
            name: key,
            tickets: value
          }))
          .value();
        category.subCategories = subCategories;
        delete category.tickets;

        _.each(category.subCategories, function(subCategory) {
          var contexts = _(subCategory.tickets)
            .filter(object => object.context != null)
            .groupBy(x => x.context)
            .map((value, key) => ({
              name: key,
              tickets: value
            }))
            .value();
          subCategory.contexts = contexts;
          delete subCategory.tickets;

          _.each(subCategory.contexts, function(context) {
            context.values = [];
            context.totals = { t: 0, n: 0, a: 0, r: 0, c: 0 };
            _.each(_months, function(m) {
              var tickets = _.filter(context.tickets, { month: m });
              var values: any = {};
              values.t = tickets.length;
              values.n = _.filter(tickets, { status: 'New' }).length;
              values.a = _.filter(tickets, { status: 'Attended' }).length;
              values.r = _.filter(tickets, { status: 'Resolved' }).length;
              values.c = _.filter(tickets, { status: 'Closed' }).length;

              context.values.push(values);
              context.totals.t = context.totals.t + values.t;
              context.totals.n = context.totals.n + values.n;
              context.totals.a = context.totals.a + values.a;
              context.totals.r = context.totals.r + values.r;
              context.totals.c = context.totals.c + values.c;

              var rm = _.find(self.months, { name: m });
              rm.totals.t = rm.totals.t + values.t;
              rm.totals.n = rm.totals.n + values.n;
              rm.totals.a = rm.totals.a + values.a;
              rm.totals.r = rm.totals.r + values.r;
              rm.totals.c = rm.totals.c + values.c;
            })
            context.values.push(context.totals);
            delete context.tickets;
          })
        })
      })
    })

    console.log("assignees ::: ", assignees);
    console.log("assignees ::: this.months ", this.months);
    var totalValues = { t: 0, n: 0, a: 0, r: 0, c: 0 };
    _.each(this.months, function(rm) {
      totalValues.t = rm.totals.t + totalValues.t;
      totalValues.n = rm.totals.n + totalValues.n;
      totalValues.a = rm.totals.a + totalValues.a;
      totalValues.r = rm.totals.r + totalValues.r;
      totalValues.c = rm.totals.c + totalValues.c;
    })
    this.months[this.months.length - 1]['totals'] = totalValues;
    this.assignees = assignees;
  }

  selectedSubCategory: any;
  toogleCategory(cat) {
    cat.opened = !cat.opened;
    if (this.selectedSubCategory && this.selectedSubCategory.cat == cat.name) {
      this.selectedSubCategory = null;
    }
  }



  @ViewChild('ticketsModal') ticketsModal: any;
  openedModal: any;
  ticketsTitle: any;
  ticketsList: any = [];
  openTickets(title, filters) {
    this.ticketsTitle = title;
    this.loading = true;
    filters.setAside = 0;
    filters.excludeStatuses = ['Closed'];
    this.supportService.listTickets({ filters: filters })
      .subscribe(res => {
        if (res['data']) {
          this.ticketsList = res['data'];
        }
        this.loading = false;
      })
    this.openedModal = this.dialogs.modal(this.ticketsModal, { size: 'xlg', backdrop: 'static' });
  }
}
