import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxEchartsModule } from 'ngx-echarts';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { SharedComponentsModule } from 'src/app/shared/components/shared-components.module';
import { SharedDirectivesModule } from 'src/app/shared/directives/shared-directives.module';
import { SharedPipesModule } from 'src/app/shared/pipes/shared-pipes.module';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboadMainComponent } from './main/dashboad-main.component';
import { DashboadSupportComponent } from './support/dashboard-support.component';
import { DashboardClientComponent } from './client/dashboard-client.component';
import { AccountsDashboardComponent } from './accounts/view.component';
import { AccountsCardsComponent } from './cards/accounts/view.component';
import { InvoicesCardsComponent } from './cards/invoices/view.component';

@NgModule({
	imports: [
		CommonModule,
		NgSelectModule,
		FormsModule,
		SharedComponentsModule,
		SharedPipesModule,
		SharedDirectivesModule,
		NgxEchartsModule,
		NgxDatatableModule,
		NgxChartsModule,
		NgbModule,
		DashboardRoutingModule
	],
	declarations: [DashboadMainComponent, DashboardClientComponent, DashboadSupportComponent, 
			AccountsDashboardComponent, AccountsCardsComponent, InvoicesCardsComponent, ]
})
export class DashboardModule { }
