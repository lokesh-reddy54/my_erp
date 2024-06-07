import { Component, OnInit } from '@angular/core';
import { EChartOption } from 'echarts';
import { Router, NavigationEnd } from '@angular/router';
import { echartStyles } from '../../../shared/echart-styles';
import * as _ from 'lodash';
import { debounceTime, take } from 'rxjs/operators';
import { Helpers } from "src/app/helpers";
import { ReportsService } from 'src/app/shared/services/reports.service';

@Component({
 selector: 'app-dashboard-client',
 templateUrl: './dashboard-client.component.html'
})
export class DashboardClientComponent implements OnInit {
 user: any;
 constructor(public router: Router, private service: ReportsService) {
   this.user = JSON.parse(localStorage.getItem("cwo_user"));
   if (!this.user.clientId) {
     this.router.navigateByUrl('/dashboards/main');
   }
 }

 ngOnInit() {
   console.log("DashboardClientComponent :: onInit .. !!!");
   this.getDashboard();
 }

 loading: boolean = false;
 myBookings: any = [];
 futureContracts: any = [];
 exits: any = [];
 pendingInvoices: any = [];
 totalDue: any = 0;
 openedTickets: any = 0;
 todaysVisits: any = 0;
 activeBookings: any = 0;
 getDashboard() {
   this.loading = true;
   var data = { clientId: this.user.clientId }
   this.service.getClientDashboards(data).pipe(take(1)).subscribe(
     res => {
       if (res['data']) {
         var dashboards = res['data'];
         this.myBookings = dashboards.myBookings;
         this.futureContracts = dashboards.futureContracts;
         this.exits = dashboards.exits;
         this.todaysVisits = dashboards.todaysVisits;
         this.activeBookings = dashboards.myBookings.length;
         this.totalDue = _.sumBy(dashboards.pendingInvoices, 'due');
         this.openedTickets = dashboards.openedTickets;
         this.pendingInvoices = dashboards.pendingInvoices;
       }
       this.loading = false;
     }, error => {

     });
 }


  viewBooking(){

  }
  viewInvoices(){

  }
  viewEmployees(){

  }
  raiseTicket(){
    
  }
  newResourceBooking() {
  }

  payNow(){

  }

}