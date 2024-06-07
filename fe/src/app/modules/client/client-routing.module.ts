import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxEchartsModule } from 'ngx-echarts';
import { SharedComponentsModule } from 'src/app/shared/components/shared-components.module';

import { ExitRequestsComponent } from './exits/list.component';
import { ClientExitStatementComponent } from './exitstatement/view.component';
import { ResoureBookingsListComponent } from './resource-bookings/list.component';
import { BookingsListComponent } from './bookings/list.component';
import { BookingViewComponent } from './booking/booking.component';
import { ClientTicketListComponent } from './tickets/list.component';
import { ClientTicketViewComponent } from './ticket/ticket.component';
import { ClientVisitsComponent } from './visits/list.component';
import { CreditsComponent } from './credits/view.component';
import { ClientVisitorsComponent } from './visitors/list.component';
import { ClientSubscriptionsComponent } from './subscriptions/list.component';
import { ClientDashboardComponent } from './dashboard/dashboard-client.component';
import { ClientEmployeesViewComponent } from './employees/employees.component';

const routes: Routes = [
	{
		path: 'dashboard',
		component: ClientDashboardComponent
	}, {
		path: 'visits',
		component: ClientVisitsComponent
	}, {
		path: 'visitors',
		component: ClientVisitorsComponent
	}, {
		path: 'subscriptions',
		component: ClientSubscriptionsComponent
	}, {
		path: 'employees/:id',
		component: ClientEmployeesViewComponent
	}, {
		path: 'bookings',
		component: BookingsListComponent
	}, {
		path: 'credits/:id',
		component: CreditsComponent
	}, {
		path: 'booking/:id',
		component: BookingViewComponent
	}, {
		path: 'booking/:id/:tab',
		component: BookingViewComponent
	}, {
		path: 'exit-requests',
		component: ExitRequestsComponent
	}, {
		path: 'exit/:id',
		component: ClientExitStatementComponent
	}, {
		path: 'tickets/:setAside',
		component: ClientTicketListComponent
	},{
		path: 'rfcs/:setAside',
		component: ClientTicketListComponent
	}, {
		path: 'ticket/:id',
		component: ClientTicketViewComponent
	}, {
		path: 'resource-bookings',
		component: ResoureBookingsListComponent
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class ClientRoutingModule { }
