import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxEchartsModule } from 'ngx-echarts';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgxPaginationModule } from 'ngx-pagination';
import { ToastrModule } from 'ngx-toastr';
import { TagInputModule } from 'ngx-chips';
import { LaddaModule } from 'angular2-ladda';
import { AgmCoreModule } from '@agm/core';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { NgBootstrapFormValidationModule } from 'ng-bootstrap-form-validation';
import { NgSelectModule } from '@ng-select/ng-select';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { SharedComponentsModule } from 'src/app/shared/components/shared-components.module';
import { SharedDirectivesModule } from 'src/app/shared/directives/shared-directives.module';
import { SharedPipesModule } from 'src/app/shared/pipes/shared-pipes.module';
import { BookingRoutingModule } from './bookings-routing.module';

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

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		NgxPaginationModule,
		NgxDatatableModule,
		NgSelectModule,
		AgmCoreModule,
		TagInputModule,
		NgBootstrapFormValidationModule,
		LaddaModule.forRoot({ style: 'expand-left' }),
		CalendarModule.forRoot({
			provide: DateAdapter,
			useFactory: adapterFactory
		}),
		NgbModule,
		ToastrModule,
		PerfectScrollbarModule,
		NgxEchartsModule,
		SharedComponentsModule,
		SharedDirectivesModule,
		SharedPipesModule,
		BookingRoutingModule
	],
	declarations: [BookingsListComponent, BookingViewComponent, ResoureBookingsListComponent, BookingsProductsReportComponent,
		CalendarComponent, BookingsAvailablityReportComponent, BookingContractRenewalsComponent, BookingNotificationComponent, 
		ParkingListComponent, ParkingViewComponent, InvoicesComponent, InvoiceSummaryComponent, ResourcesCalendarComponent],
	exports: [],
	entryComponents: []
})
export class BookingsModule { }
