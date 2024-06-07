import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxEchartsModule } from 'ngx-echarts';
import { SharedComponentsModule } from 'src/app/shared/components/shared-components.module';

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
import { PurchasesComplianceTermsComponent } from './compliance-terms/view.component';
import { BillsListComponent } from './bills/list.component';
import { PurchaseOrderViewComponent } from './purchaseorders/view.component';
import { ProjectViewComponent } from './projects/view.component';
import { ProjectsListComponent } from './projects/list.component';
import { PurchasesPayoutComponent } from './payouts/view.component';
import { PurchasesBuildingWisePayablesComponent } from './reports/buildingwise-payables/view.component';
import { PurchasesProjectWisePayablesComponent } from './reports/projectwise-payables/view.component';
import { PurchasesBuildingWiseSkusComponent } from './reports/buildingwise-skus/view.component';


const routes: Routes = [
	{
		path: 'skus',
		component: PurchasesSkusComponent
	},{
		path: 'skuslist',
		component: PurchasesSkusListComponent
	},{
		path: 'skuunits',
		component: PurchasesSkuUnitsComponent
	},{
		path: 'compliance-terms',
		component: PurchasesComplianceTermsComponent
	},{
		path: 'vendors',
		component: VendorsListComponent
	}, {
		path: 'payouts',
		component: PurchasesPayoutComponent
	}, {
		path: 'tds-compliance',
		component: TdsComplianceComponent
	}, {
		path: 'gst-compliance',
		component: GstComplianceComponent
	}, {
		path: 'vendor/:id',
		component: VendorViewComponent
	}, {
		path: 'workorders',
		component: WorkOrdersListComponent
	}, {
		path: 'workorder/:id',
		component: WorkOrderViewComponent
	}, {
		path: 'purchaseorders',
		component: PurchaseOrdersListComponent
	}, {
		path: 'projectbills',
		component: BillsListComponent
	}, {
		path: 'purchaseorder/:id',
		component: PurchaseOrderViewComponent
	}, {
		path: 'project/:id',
		component: ProjectViewComponent
	}, {
		path: 'projects',
		component: ProjectsListComponent
	}, {
		path: 'reports/buildingwise-payables',
		component: PurchasesBuildingWisePayablesComponent
	},{
		path: 'reports/projectwise-payables',
		component: PurchasesProjectWisePayablesComponent
	},{
		path: 'reports/buildingwise-skus',
		component: PurchasesBuildingWiseSkusComponent
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class PurchasesRoutingModule { }
