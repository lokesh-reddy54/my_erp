import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxEchartsModule } from 'ngx-echarts';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgxPaginationModule } from 'ngx-pagination';
import { ToastrModule } from 'ngx-toastr';
import { LaddaModule } from 'angular2-ladda';

import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { NgBootstrapFormValidationModule } from 'ng-bootstrap-form-validation';
import { NgSelectModule } from '@ng-select/ng-select';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { SharedComponentsModule } from 'src/app/shared/components/shared-components.module';
import { SharedDirectivesModule } from 'src/app/shared/directives/shared-directives.module';
import { SharedPipesModule } from 'src/app/shared/pipes/shared-pipes.module';
import { SupportRoutingModule } from './support-routing.module';

import { TicketListComponent } from './list/list.component';
import { TicketViewComponent } from './view/ticket.component';
import { SupportCalendarComponent } from './calendar/calendar.component';
import { SupportReportsComponent } from './reports/view.component';
import { SupportConfigurationComponent } from './configuration/configuration.component';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		NgxPaginationModule,
		NgxDatatableModule,
		NgSelectModule,
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
		SupportRoutingModule
	],
	declarations: [TicketListComponent, TicketViewComponent, SupportReportsComponent,
					SupportConfigurationComponent, SupportCalendarComponent],
	exports:[],
	entryComponents: []
})
export class SupportModule { }