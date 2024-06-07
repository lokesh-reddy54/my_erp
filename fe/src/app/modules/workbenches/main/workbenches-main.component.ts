import { Component, OnInit } from '@angular/core';
import { EChartOption } from 'echarts';
import { Router, NavigationEnd } from '@angular/router';
import { echartStyles } from '../../../shared/echart-styles';
import * as _ from 'lodash';
import { debounceTime, take } from 'rxjs/operators';
import { Helpers } from "src/app/helpers";
import { ReportsService } from 'src/app/shared/services/reports.service';

@Component({
  selector: 'app-workbenches-main',
  templateUrl: './workbenches-main.component.html'
})
export class WorkBenchMainComponent implements OnInit {
  constructor(public router: Router, private service: ReportsService) {
    var user = JSON.parse(localStorage.getItem("cwo_user"));
    var userType = 'admin';
    if (user.clientId) {
      this.router.navigateByUrl('/dashboards/client');
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

  workbenches: any = {};
  getDashboard() {
    this.loading = true;
    var data: any = {}
    this.service.getUserDashboards(data).pipe(take(1)).subscribe(
      res => {
        var user = JSON.parse(localStorage.getItem('cwo_user'));

        this.activeBookings = res['data']['activeBookings'];
        var contractPendingBookings = res['data']['contractPendingBookings'];
        var status = null;
        if (user.roles) {
          if (Helpers.checkAccess("bookings:approveContract")) {
            status = "Draft";
          } else if (Helpers.checkAccess("bookings:confirmContract")) {
            status = "Approved";
          }
        }
        console.log("DashboardComponent ::: getUserDashboards :: contract status : " + status);
        if (status) {
          this.contractPendingBookings = _.filter(contractPendingBookings, function(b) {
            return b.contract.status == status;
          });
        } else {
          this.contractPendingBookings = contractPendingBookings;
        }

        this.futureContracts = res['data']['futureContracts'];
        this.exits = res['data']['exits'];
        this.overAllAr = res['data']['overAllAr'];
        var totals: any = {};
        totals.building = 'Total';
        totals.activeDue = _.sumBy(this.overAllAr, 'activeDue');
        totals.inActiveDue = _.sumBy(this.overAllAr, 'inActiveDue');
        this.overAllAr.push(totals);
        this.totalDue = totals.activeDue + totals.inActiveDue;

        this.monthlyInvoices = res['data']['monthlyInvoices'];
        var totals: any = {};
        totals.building = 'Total';
        totals.sd = _.sumBy(this.monthlyInvoices, 'sd');
        totals.rents = _.sumBy(this.monthlyInvoices, 'rents');
        totals.others = _.sumBy(this.monthlyInvoices, 'others');
        totals.totals = _.sumBy(this.monthlyInvoices, 'total');
        this.monthlyInvoices.push(totals);
        this.totalInvoiced = totals.totals;

        this.loading = false;
      }, error => {

      });


    data.workbenches = ['deskBookings', 'resourceBookings', 'moveIns', 'exits', 'payIns', 
                        'payOuts', 'visits', 'support', 'renewals', 'purchaseCapex'];
    this.service.getWorkBenches(data).pipe(take(1)).subscribe(
      res => {
        this.workbenches = res['data'];

        // this.initDeskBookingsPieChart(this.workbenches.deskBookings);
        // this.initResourcesBookingsPieChart(this.workbenches.resourceBookings);
        // this.initMoveInsChartPie(this.workbenches.moveIns);
        // this.initExitsPieChart(this.workbenches.exits);
        // this.initRefundsPieChart(this.workbenches.exits);
        // this.initWorkOrdersChart(this.workbenches.workOrders);
        // this.initPurchaseOrdersChart(this.workbenches.purchaseOrders);
        // this.initSupportChart(this.workbenches.support);
      });
  }

  deskBookingsChartPie: EChartOption;
  initDeskBookingsPieChart(bookingsData) {
    this.deskBookingsChartPie = {
      color: ['#263db5', '#82a0df', '#f9f93e', '#1bea03', '#f0ae1a', '#ff0202'],
      tooltip: {
        show: true,
        backgroundColor: 'rgba(0, 0, 0, .8)'
      },

      xAxis: [{
        axisLine: {
          show: false
        },
        splitLine: {
          show: false
        }
      }],
      yAxis: [{
        axisLine: {
          show: false
        },
        splitLine: {
          show: false
        }
      }],
      series: [{
        name: 'Bookings by Status',
        type: 'pie',
        radius: '75%',
        center: ['50%', '50%'],
        data: [
          { value: bookingsData.reserved.length, name: 'New' },
          { value: bookingsData.pendingSalesApproval.length, name: 'Pending Sales Approvals' },
          { value: bookingsData.pendingAccountsApproval.length, name: 'Pending Accounts Approvals' },
          { value: bookingsData.pendingSignedAgreements.length, name: 'Pending Agreement Signs' },
          { value: bookingsData.pendingActives.length, name: 'Pending Actives' }
        ],
        itemStyle: {
          emphasis: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
      ]
    };
  }

  resourceBookingsChartPie: EChartOption;
  initResourcesBookingsPieChart(bookingsData) {
    this.resourceBookingsChartPie = {
      ...echartStyles.defaultOptions, ...{
        legend: {
          show: true,
          bottom: 0,
        },
        series: [{
          type: 'pie',
          ...echartStyles.pieRing,

          label: echartStyles.pieLabelCenterHover,
          data: [{
            name: 'Paid',
            value: bookingsData.paid.length,
            itemStyle: {
              color: '#663399',
            }
          }, {
            name: 'Pending',
            value: bookingsData.pending.length,
            itemStyle: {
              color: '#ced4da',
            }
          }]
        }]
      }
    };
  }

  moveInsChartPie: EChartOption;
  initMoveInsChartPie(data) {
    this.moveInsChartPie = {
      ...echartStyles.defaultOptions, ...{
        legend: {
          show: true,
          bottom: 0,
        },
        series: [{
          type: 'pie',
          ...echartStyles.pieRing,

          label: echartStyles.pieLabelCenterHover,
          data: [{
            name: 'UpComing',
            value: data.futureMoveIns.length,
            itemStyle: {
              color: '#663399',
            }
          }, {
            name: 'Missed',
            value: data.missedMoveIns.length,
            itemStyle: {
              color: '#ced4da',
            }
          }]
        }]
      }
    };
  }

  exitsChartPie: EChartOption;
  initExitsPieChart(data) {
    this.exitsChartPie = {
      ...echartStyles.defaultOptions, ...{
        legend: {
          show: true,
          bottom: 0,
        },
        series: [{
          type: 'pie',
          ...echartStyles.pieRing,

          label: echartStyles.pieLabelCenterHover,
          data: [{
            name: 'UpComing',
            value: data.upcomingExits.length,
            itemStyle: {
              color: '#663399',
            }
          }, {
            name: 'Missed',
            value: data.missedExits.length,
            itemStyle: {
              color: '#ced4da',
            }
          }]
        }]
      }
    };
  }

  refundsChartPie: EChartOption;
  initRefundsPieChart(data) {
    this.refundsChartPie = {
      color: ['#263db5', '#82a0df', '#f9f93e', '#1bea03', '#f0ae1a', '#ff0202'],
      tooltip: {
        show: true,
        backgroundColor: 'rgba(0, 0, 0, .8)'
      },

      xAxis: [{
        axisLine: {
          show: false
        },
        splitLine: {
          show: false
        }
      }],
      yAxis: [{
        axisLine: {
          show: false
        },
        splitLine: {
          show: false
        }
      }],
      series: [{
        name: 'Exits by Status',
        type: 'pie',
        radius: '75%',
        center: ['50%', '50%'],
        data: [
          { value: data.pendingApprovals.length, name: 'Pending Approvals' },
          { value: data.pendingAcceptance.length, name: 'Pending Client Acceptances' },
          { value: data.pendingRefunds.length, name: 'Pending Refunds' }
        ],
        itemStyle: {
          emphasis: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
      ]
    };
  }

  workOrdersChartPie: EChartOption;
  initWorkOrdersChart(data) {
    this.workOrdersChartPie = {
      color: ['#263db5', '#82a0df', '#f9f93e', '#1bea03', '#f0ae1a', '#ff0202'],
      tooltip: {
        show: true,
        backgroundColor: 'rgba(0, 0, 0, .8)'
      },

      xAxis: [{
        axisLine: {
          show: false
        },
        splitLine: {
          show: false
        }
      }],
      yAxis: [{
        axisLine: {
          show: false
        },
        splitLine: {
          show: false
        }
      }],
      series: [{
        name: 'WorkOrders by Status',
        type: 'pie',
        radius: '75%',
        center: ['50%', '50%'],
        data: [
          { value: data.draft.length, name: 'Drafts' },
          { value: data.pendingApproval.length, name: 'Pending Approvals' },
          { value: data.pendingVendorConfirmation.length, name: 'Pending Vendor Confirmations' }
        ],
        itemStyle: {
          emphasis: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
      ]
    };
  }

  purchaseOrdersChartPie: EChartOption;
  initPurchaseOrdersChart(data) {
    this.purchaseOrdersChartPie = {
      color: ['#263db5', '#82a0df', '#f9f93e', '#1bea03', '#f0ae1a', '#ff0202'],
      tooltip: {
        show: true,
        backgroundColor: 'rgba(0, 0, 0, .8)'
      },

      xAxis: [{
        axisLine: {
          show: false
        },
        splitLine: {
          show: false
        }
      }],
      yAxis: [{
        axisLine: {
          show: false
        },
        splitLine: {
          show: false
        }
      }],
      series: [{
        name: 'Purchase Orders by Status',
        type: 'pie',
        radius: '75%',
        center: ['50%', '50%'],
        data: [
          { value: data.pendingStarted.length, name: 'Drafts' },
          { value: data.pendingProformaInvoice.length, name: 'Pending Approvals' },
          { value: data.pendingMilestonesRelease.length, name: 'Pending MileStone Releases' },
          { value: data.pendingMilestonesApprovals.length, name: 'Pending MileStone Approvals' }
        ],
        itemStyle: {
          emphasis: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
      ]
    };
  }

  supportChartPie: EChartOption;
  initSupportChart(data) {
    this.supportChartPie = {
      color: ['#263db5', '#82a0df', '#f9f93e', '#1bea03', '#f0ae1a', '#ff0202'],
      tooltip: {
        show: true,
        backgroundColor: 'rgba(0, 0, 0, .8)'
      },

      xAxis: [{
        axisLine: {
          show: false
        },
        splitLine: {
          show: false
        }
      }],
      yAxis: [{
        axisLine: {
          show: false
        },
        splitLine: {
          show: false
        }
      }],
      series: [{
        name: 'Purchase Orders by Status',
        type: 'pie',
        radius: '75%',
        center: ['50%', '50%'],
        data: [
          { value: data.new.length, name: 'New' },
          { value: data.unattended.length, name: 'UnAttended' },
          { value: data.yetToResolve.length, name: 'YetTo Resolve' },
          { value: data.yetToClosed.length, name: 'YetTo Closed' },
          { value: data.slaViolated.length, name: 'SLA Violated' }
        ],
        itemStyle: {
          emphasis: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
      ]
    };
  }

}
