import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxEchartsModule } from 'ngx-echarts';
import { SharedComponentsModule } from 'src/app/shared/components/shared-components.module';

import { AcceptFinalStatementComponent } from './acceptfinalstatement/view.component';
import { PendingPaymentComponent } from './pendingpayment/view.component';
import { VendorWorkOrderApprovalComponent } from './vendorworkorderapproval/view.component';
import { VendorVerificationComponent } from './vendorverification/view.component';
import { VendorSkuApprovalComponent } from './vendorskuapproval/view.component';
import { EmployeeVerificationComponent } from './employeeverification/view.component';
import { ClientVerificationComponent } from './clientverification/view.component';
import { VendorBankAccountVerificationComponent } from './vendor-bankaccount-verification/view.component';

const routes: Routes = [{
		path: 'accept-final-statement/:id',
		component: AcceptFinalStatementComponent
	}, {
		path: 'pending-payment/:id',
		component: PendingPaymentComponent
	}, {
		path: 'vendor-workorder-approval/:id',
		component: VendorWorkOrderApprovalComponent
	}, {
		path: 'vendor-verification/:id',
		component: VendorVerificationComponent
	}, {
		path: 'employee-verification/:id',
		component: EmployeeVerificationComponent
	}, {
		path: 'vendor-bankaccount-verification/:id',
		component: VendorBankAccountVerificationComponent
	}, {
		path: 'vendor-bankaccount-request/:id',
		component: VendorBankAccountVerificationComponent
	}, {
		path: 'vendor-sku-verification/:id',
		component: VendorSkuApprovalComponent
	}, {
		path: 'client-verification/:id',
		component: ClientVerificationComponent
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class SelfcareRoutingModule { }
