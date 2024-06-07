import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FileUploadModule } from 'ng2-file-upload';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxEchartsModule } from 'ngx-echarts';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgBootstrapFormValidationModule } from 'ng-bootstrap-form-validation';
import { NgSelectModule } from '@ng-select/ng-select';
import { ToastrModule } from 'ngx-toastr';
import { TagInputModule } from 'ngx-chips';
import { LaddaModule } from 'angular2-ladda';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { SharedPipesModule } from 'src/app/shared/pipes/shared-pipes.module';
import { SharedComponentsModule } from 'src/app/shared/components/shared-components.module';
import { SharedDirectivesModule } from 'src/app/shared/directives/shared-directives.module';
import { PurchasesRoutingModule } from './purchases-routing.module';

import { PurchasesSkusComponent } from './skus/view.component';
import { PurchasesSkusListComponent } from './skuslist/view.component';
import { PurchasesSkuUnitsComponent } from './skuunits/view.component';
import { VendorsListComponent } from './vendors/list.component';
import { TdsComplianceComponent } from './tds-compliance/view.component';
import { GstComplianceComponent } from './gst-compliance/view.component';
import { VendorViewComponent } from './vendors/view.component';
import { WorkOrdersListComponent } from './workorders/list.component';
import { WorkOrderViewComponent } from './workorders/view.component';
import { PurchaseOrdersListComponent } from './purchaseorders/list.component';
import { PurchaseOrderViewComponent } from './purchaseorders/view.component';
import { PurchasesComplianceTermsComponent } from './compliance-terms/view.component';
import { BillsListComponent } from './bills/list.component';
import { ProjectsListComponent } from './projects/list.component';
import { PurchasesPayoutComponent } from './payouts/view.component';
import { ProjectViewComponent } from './projects/view.component';
import { PurchasesBuildingWisePayablesComponent } from './reports/buildingwise-payables/view.component';
import { PurchasesProjectWisePayablesComponent } from './reports/projectwise-payables/view.component';
import { PurchasesBuildingWiseSkusComponent } from './reports/buildingwise-skus/view.component';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		NgxPaginationModule,
		NgxDatatableModule,
		NgSelectModule,
		FileUploadModule,
		NgBootstrapFormValidationModule,
		LaddaModule.forRoot({ style: 'expand-left' }),
		CalendarModule.forRoot({
			provide: DateAdapter,
			useFactory: adapterFactory
		}),
		NgbModule,
		ToastrModule,
		TagInputModule,
		PerfectScrollbarModule,
		NgxEchartsModule,
		SharedPipesModule,
		SharedDirectivesModule,
		SharedComponentsModule,
		PurchasesRoutingModule
	],
	declarations: [PurchasesSkusComponent, VendorsListComponent, VendorViewComponent, BillsListComponent, PurchasesBuildingWiseSkusComponent, PurchasesPayoutComponent,
		WorkOrdersListComponent, WorkOrderViewComponent, PurchaseOrdersListComponent, PurchaseOrderViewComponent, PurchasesSkuUnitsComponent, PurchasesSkusListComponent,PurchasesComplianceTermsComponent,
		ProjectsListComponent, PurchasesBuildingWisePayablesComponent, ProjectViewComponent, PurchasesProjectWisePayablesComponent, TdsComplianceComponent, GstComplianceComponent],
	entryComponents: []
})
export class PurchasesModule { }
