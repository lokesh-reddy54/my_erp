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
import { LeadsRoutingModule } from './leads-routing.module';

import { CalendarComponent } from './calendar/calendar.component';
import { LeadsListComponent } from './list/list.component';
import { LeadViewComponent } from './view/lead.component';

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
		LeadsRoutingModule
	],
	declarations: [LeadsListComponent, LeadViewComponent, CalendarComponent],
	exports:[],
	entryComponents: []
})
export class LeadsModule { }
