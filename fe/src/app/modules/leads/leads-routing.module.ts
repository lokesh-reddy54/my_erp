import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxEchartsModule } from 'ngx-echarts';
import { SharedComponentsModule } from 'src/app/shared/components/shared-components.module';

import { CalendarComponent } from './calendar/calendar.component';
import { LeadsListComponent } from './list/list.component';
import { LeadViewComponent } from './view/lead.component';


const routes: Routes = [
	{
		path: 'list',
		component: LeadsListComponent
	}, {
		path: 'view/:id',
		component: LeadViewComponent
	}, {
		path: 'visits',
		component: CalendarComponent
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class LeadsRoutingModule { }
