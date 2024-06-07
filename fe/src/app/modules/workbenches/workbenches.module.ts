import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxEchartsModule } from 'ngx-echarts';
import { SharedComponentsModule } from 'src/app/shared/components/shared-components.module';
import { SharedDirectivesModule } from 'src/app/shared/directives/shared-directives.module';
import { SharedPipesModule } from 'src/app/shared/pipes/shared-pipes.module';

import { WorkBenchesRoutingModule } from './workbenches-routing.module';
import { WorkBenchMainComponent } from './main/workbenches-main.component';
import { WorkBenchAccountsComponent } from './accounts/workbenches-main.component';
import { WorkBenchBuildingOpsComponent } from './buildingops/workbenches-main.component';
import { WorkBenchBusinessOpsComponent } from './businessops/workbenches-main.component';
import { WorkBenchProjectsComponent } from './projects/workbenches-main.component';
import { WorkBenchPurchasesComponent } from './purchases/workbenches-main.component';
import { WorkBenchSalesComponent } from './sales/workbenches-main.component';
import { WorkBenchSupportComponent } from './support/workbenches-main.component';

@NgModule({
	imports: [
		CommonModule,
		SharedComponentsModule,
		SharedPipesModule,
		SharedDirectivesModule,
		NgxEchartsModule,
		NgxDatatableModule,
		NgbModule,
		WorkBenchesRoutingModule
	],
	declarations: [WorkBenchMainComponent, WorkBenchAccountsComponent, WorkBenchBuildingOpsComponent, WorkBenchBusinessOpsComponent,
	WorkBenchProjectsComponent, WorkBenchPurchasesComponent, WorkBenchSalesComponent, WorkBenchSupportComponent]
})
export class WorkBenchesModule { }
