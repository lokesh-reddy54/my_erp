import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxEchartsModule } from 'ngx-echarts';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { NgxPaginationModule } from 'ngx-pagination';
import { ToastrModule } from 'ngx-toastr';
import { LaddaModule } from 'angular2-ladda';
import { TagInputModule } from 'ngx-chips';

import { NgBootstrapFormValidationModule } from 'ng-bootstrap-form-validation';
import { NgSelectModule } from '@ng-select/ng-select';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { SharedComponentsModule } from 'src/app/shared/components/shared-components.module';
import { SharedDirectivesModule } from 'src/app/shared/directives/shared-directives.module';
import { SharedPipesModule } from 'src/app/shared/pipes/shared-pipes.module';
import { SupportRoutingModule } from './accounts-routing.module';

import { OpexsComponent } from './opex/view.component';
import { OpexPaymentsComponent } from './opexpayments/view.component';
import { OpexBillsComponent } from './opexbills/view.component';
import { AccountsBillsQueueComponent } from './billsqueue/list.component';
import { AccountsPayoutComponent } from './payouts/payouts.component';
import { AccountsPayoutEntriesComponent } from './payoutentries/view.component';
import { AccountsPayinEntriesComponent } from './payinentries/view.component';
import { AccountsPOsListComponent } from './purchaseorders/list.component';
import { AccountsBillsListComponent } from './billslist/list.component';
import { AccountPaymentsComponent } from './payments/payments.component';
import { AccountsInvoiceServicesComponent } from './invoiceservices/list.component';
import { AccountsServicePaymentsComponent } from './servicepayments/list.component';
import { AccountsServiceBillsComponent } from './servicebills/list.component';
import { AccountsServiceProvidersComponent } from './serviceproviders/list.component';
import { AccountsExpensesReportComponent } from './reports/expenses/view.component';
import { AccountsARReportComponent } from './reports/ar/view.component';
import { AccountsOpexReportComponent } from './reports/opex/view.component';
import { AccountsRevenueReportComponent } from './reports/revenue/view.component';
import { AccountsTDSARReportComponent } from './reports/tds-ar/view.component';
import { AccountsCashFlowsReportComponent } from './reports/cashflows/view.component';
import { AccountsLiabilityReportComponent } from './reports/liability/view.component';
import { AccountsReportProductsListComponent } from './reports/productslist/view.component';
import { AccountsRevenueInvoicesReportComponent } from './reports/revenueinvoices/view.component';
import { AccountsReportsInvoicesListComponent } from './reports/invoiceslist/view.component';
import { AccountsCustomersListReportComponent } from './reports/customerslist/view.component';
import { AccountsVendorsListReportComponent } from './reports/vendorslist/view.component';
import { AccountsReportsBillsListComponent } from './reports/billslist/view.component';
import { AccountsReportsTdeDueClientsComponent } from './reports/tdsdueclients/view.component';

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
		NgbModule,
		ToastrModule,
		PerfectScrollbarModule,
		NgxEchartsModule,
		NgxChartsModule,
		TagInputModule,
		SharedComponentsModule,
		SharedDirectivesModule,
		SharedPipesModule,
		SupportRoutingModule
	],
	declarations: [OpexsComponent, OpexPaymentsComponent, OpexBillsComponent, AccountsPayoutComponent, AccountPaymentsComponent, AccountsInvoiceServicesComponent, AccountsARReportComponent,
		AccountsServicePaymentsComponent, AccountsServiceBillsComponent, AccountsExpensesReportComponent, AccountsServiceProvidersComponent, AccountsBillsQueueComponent,
		AccountsRevenueReportComponent, AccountsLiabilityReportComponent, AccountsOpexReportComponent, AccountsPOsListComponent, AccountsPayinEntriesComponent, AccountsRevenueInvoicesReportComponent,
		AccountsTDSARReportComponent, AccountsCashFlowsReportComponent, AccountsPayoutEntriesComponent, AccountsBillsListComponent, AccountsReportProductsListComponent,
		AccountsReportsInvoicesListComponent, AccountsCustomersListReportComponent, AccountsVendorsListReportComponent, AccountsReportsBillsListComponent, AccountsReportsTdeDueClientsComponent],
	exports: [],
	entryComponents: []
})
export class AccountsModule { }
