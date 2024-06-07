import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxEchartsModule } from 'ngx-echarts';
import { SharedComponentsModule } from 'src/app/shared/components/shared-components.module';

import { CalendarComponent } from './calendar/calendar.component';
import { ResourcesCalendarComponent } from './resources-calendar/calendar.component';
import { BookingsListComponent } from './list/list.component';
import { BookingViewComponent } from './view/booking.component';
import { ResoureBookingsListComponent } from './resource-bookings/list.component';
import { BookingsAvailablityReportComponent } from './reports/availability/view.component';
import { BookingsProductsReportComponent } from './reports/products/view.component';
import { BookingContractRenewalsComponent } from './contract-renewals/view.component';
import { BookingNotificationComponent } from './notifications/view.component';
import { ParkingListComponent } from './parking-list/parking-list.component';
import { ParkingViewComponent } from './view-parking/view-parking.component';
import { InvoicesComponent } from './invoives/invoice.component';
import { InvoiceSummaryComponent } from './reports/invoice-summary/view.component';

const routes: Routes = [
  {
    path: 'list',
    component: BookingsListComponent
  },{
    path: 'view/:id',
    component: BookingViewComponent
  },
  {
    path: 'parking/:id',
    component: ParkingViewComponent
  },
  {
    path: 'resourceBookings',
    component: ResoureBookingsListComponent
  }, {
    path: 'schedules',
    component: CalendarComponent
  }, {
    path: 'invoices',
    component: InvoicesComponent
  }, {
    path: 'inv-sum',
    component: InvoiceSummaryComponent
  }, {
    path: 'rcalendar',
    component: ResourcesCalendarComponent
  }, {
    path: 'availability',
    component: BookingsAvailablityReportComponent
  }, {
    path: 'products',
    component: BookingsProductsReportComponent
  }, {
    path: 'contract-renewals',
    component: BookingContractRenewalsComponent
  }, {
    path: 'notifications',
    component: BookingNotificationComponent
  }, {
    path: 'parking',
    component: ParkingListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BookingRoutingModule { }
