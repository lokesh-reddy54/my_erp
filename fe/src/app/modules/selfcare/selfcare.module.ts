import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LaddaModule } from 'angular2-ladda';
import { NgBootstrapFormValidationModule } from 'ng-bootstrap-form-validation';
import { NgSelectModule } from '@ng-select/ng-select';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { SharedComponentsModule } from 'src/app/shared/components/shared-components.module';
import { SharedDirectivesModule } from 'src/app/shared/directives/shared-directives.module';
import { SharedPipesModule } from 'src/app/shared/pipes/shared-pipes.module';
import { SelfcareRoutingModule } from './selfcare-routing.module';

import { AcceptFinalStatementComponent } from './acceptfinalstatement/view.component';
import { PendingPaymentComponent } from './pendingpayment/view.component';
import { VendorWorkOrderApprovalComponent } from './vendorworkorderapproval/view.component';
import { VendorVerificationComponent } from './vendorverification/view.component';
import { EmployeeVerificationComponent } from './employeeverification/view.component';
import { VendorSkuApprovalComponent } from './vendorskuapproval/view.component';
import { VendorBankAccountVerificationComponent } from './vendor-bankaccount-verification/view.component';
import { ClientVerificationComponent } from './clientverification/view.component';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		NgSelectModule,
		NgBootstrapFormValidationModule,
		LaddaModule.forRoot({ style: 'expand-left' }),
		NgbModule,
		PerfectScrollbarModule,
		SharedComponentsModule,
		SharedDirectivesModule,
		SharedPipesModule,
		SelfcareRoutingModule
	],
	declarations: [AcceptFinalStatementComponent, PendingPaymentComponent, VendorWorkOrderApprovalComponent,
		EmployeeVerificationComponent, VendorVerificationComponent, VendorSkuApprovalComponent, VendorBankAccountVerificationComponent, ClientVerificationComponent],
	exports:[],
	entryComponents: []
})
export class SelfCareModule { }
