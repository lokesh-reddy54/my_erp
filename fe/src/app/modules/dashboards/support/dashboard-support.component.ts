import { Component, OnInit } from '@angular/core';
import { EChartOption } from 'echarts';
import { Router, NavigationEnd } from '@angular/router';
import { echartStyles } from '../../../shared/echart-styles';
import * as _ from 'lodash';
import { debounceTime, take } from 'rxjs/operators';
import { Helpers } from "src/app/helpers";
import { ReportsService } from 'src/app/shared/services/reports.service';

@Component({
  selector: 'app-dashboard-support',
  templateUrl: './dashboard-support.component.html'
})
export class DashboadSupportComponent implements OnInit {
  constructor(public router: Router, private service: ReportsService) {
    var user = JSON.parse(localStorage.getItem("cwo_user"));
    var userType = 'admin';
    if (user.clientId) {
      this.router.navigateByUrl('/client/dashboard');
    }
  }

  ngOnInit() {
    var user = JSON.parse(localStorage.getItem('cwo_user'));
    if (user.roles && !user.roles.dashboards.enable) {
      return;
    }
    this.getDashboard();
  }

  loading: boolean = false;
  contractPendingBookings: any = [];
  overAllAr: any = [];
  futureContracts: any = [];
  exits: any = [];
  monthlyInvoices: any = [];
  totalDue: any = 0;
  totalInvoiced: any = 0;
  activeBookings: any = 0;
  buildingTickets: any = [];
  buildingRfcs: any = [];

  workbenches: any = {};
  ticketTotals: any = { new: 0, attended: 0, internalReply: 0, clientReply: 0, resolved: 0, closed: 0, total: 0 };
  rfcTotals: any = { total: 0 };
  getDashboard() {
    this.loading = true;
    var data: any = {}
    this.service.getTicketsByStatus({ buildingWise: true })
      .subscribe(res => {
        var self = this;
        var data = res['data'];
        var _buildings = _.uniq(_.map(data, 'name'));
        var buildings = [];
        _.each(_buildings, function(b) {
          var building: any = { name: b };
          building.new = _.sumBy(_.filter(data, { name: b, status: 'New' }), 'count');
          building.attended = _.sumBy(_.filter(data, { name: b, status: 'Attended' }), 'count');
          // building.clientReply = _.sumBy(_.filter(data, { name: b, status: 'AwaitingClientReply' }),'count');
          building.internalReply = _.sumBy(_.filter(data, { name: b, status: 'AwaitingInternalReply' }), 'count');
          // building.resolved = _.sumBy(_.filter(data, { name: b, status: 'Resolved' }),'count');
          building.total = building.new + building.attended + building.internalReply;

          self.ticketTotals.new = self.ticketTotals.new + building.new;
          self.ticketTotals.attended = self.ticketTotals.attended + building.attended;
          self.ticketTotals.internalReply = self.ticketTotals.internalReply + building.internalReply;
          // self.ticketTotals.clientReply = self.ticketTotals.clientReply + building.clientReply;
          // self.ticketTotals.resolved = self.ticketTotals.resolved + building.resolved;
          self.ticketTotals.total = self.ticketTotals.total + building.total;

          buildings.push(building);
        })

        this.buildingTickets = buildings;
        this.loading = false;
      })


    this.service.getTicketsByStatus({ buildingWise: true, setAside: 1 })
      .subscribe(res => {
        var self = this;
        var data = res['data'];
        var _buildings = _.uniq(_.map(data, 'name'));
        var buildings = [];
        _.each(_buildings, function(b) {
          var building: any = { name: b };
          building.total = _.sumBy(_.filter(data, { name: b }), 'count');

          self.rfcTotals.total = self.rfcTotals.total + building.total;
          buildings.push(building);
        })

        this.buildingRfcs = buildings;
      })

    data.workbenches = ['support'];
    this.service.getWorkBenches(data).pipe(take(1)).subscribe(
      res => {
        this.workbenches = res['data'];
      });
  }


}
