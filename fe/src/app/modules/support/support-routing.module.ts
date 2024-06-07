import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxEchartsModule } from 'ngx-echarts';
import { SharedComponentsModule } from 'src/app/shared/components/shared-components.module';

import { TicketListComponent } from './list/list.component';
import { TicketViewComponent } from './view/ticket.component';
import { SupportCalendarComponent } from './calendar/calendar.component';
import { SupportReportsComponent } from './reports/view.component';
import { SupportConfigurationComponent } from './configuration/configuration.component';

const routes: Routes = [
  {
    path: 'list',
		component: TicketListComponent
  }, {
    path: 'view/:id',
		component: TicketViewComponent
  }, {
    path: 'calendar',
    component: SupportCalendarComponent
  }, {
		path: 'configuration',
    component: SupportConfigurationComponent
  }, {
    path: 'reports',
    component: SupportReportsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SupportRoutingModule { }
