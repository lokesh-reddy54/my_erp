import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxEchartsModule } from 'ngx-echarts';
import { SharedComponentsModule } from 'src/app/shared/components/shared-components.module';

import { ResoureBookingsListComponent } from './resource-bookings/list.component';
import { BookingsListComponent } from './bookings/list.component';
import { BookingViewComponent } from './booking/booking.component';
import { ClientTicketListComponent } from './tickets/list.component';
import { ClientTicketViewComponent } from './ticket/ticket.component';
import { MobileDashboardComponent } from './dashboard/dashboard.component';

const routes: Routes = [
	{
		path: 'dashboard',
		component: MobileDashboardComponent
	}, {
		path: 'bookings',
		component: BookingsListComponent
	}, {
		path: 'booking/:id',
		component: BookingViewComponent
	}, {
		path: 'booking/:id/:tab',
		component: BookingViewComponent
	},  {
		path: 'tickets/:setAside',
		component: ClientTicketListComponent
	}, {
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
export class MobileRoutingModule { }
