import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxEchartsModule } from 'ngx-echarts';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgBootstrapFormValidationModule } from 'ng-bootstrap-form-validation';
import { NgSelectModule } from '@ng-select/ng-select';
import { ToastrModule } from 'ngx-toastr';
import { LaddaModule } from 'angular2-ladda';
import { AgmCoreModule } from '@agm/core';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { SharedPipesModule } from 'src/app/shared/pipes/shared-pipes.module';
import { SharedComponentsModule } from 'src/app/shared/components/shared-components.module';
import { SharedDirectivesModule } from 'src/app/shared/directives/shared-directives.module';
import { MobileRoutingModule } from './mobile-routing.module';

import { BookingsListComponent } from './bookings/list.component';
import { ClientTicketListComponent } from './tickets/list.component';
import { ClientTicketViewComponent } from './ticket/ticket.component';
import { ResoureBookingsListComponent } from './resource-bookings/list.component';
import { BookingViewComponent } from './booking/booking.component';
import { MobileDashboardComponent } from './dashboard/dashboard.component';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		AgmCoreModule,
		ReactiveFormsModule,
		NgxPaginationModule,
		NgxDatatableModule,
		NgSelectModule,
		NgBootstrapFormValidationModule,
		LaddaModule.forRoot({ style: 'expand-left' }),
		NgbModule,
		ToastrModule,
		PerfectScrollbarModule,
		NgxEchartsModule,
		SharedPipesModule,
		SharedDirectivesModule,
		SharedComponentsModule,
		MobileRoutingModule
	],
	declarations: [BookingViewComponent, ResoureBookingsListComponent, BookingsListComponent,
			MobileDashboardComponent, ClientTicketListComponent, ClientTicketViewComponent],
	entryComponents: []
})
export class MobileModule { }
