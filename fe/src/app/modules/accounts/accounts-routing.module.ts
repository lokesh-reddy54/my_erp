import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxEchartsModule } from 'ngx-echarts';
import { SharedComponentsModule } from 'src/app/shared/components/shared-components.module';

import { OpexsComponent } from './opex/view.component';
import { OpexPaymentsComponent } from './opexpayments/view.component';
import { OpexBillsComponent } from './opexbills/view.component';
import { AccountsPayoutComponent } from './payouts/payouts.component';
import { AccountsPOsListComponent } from './purchaseorders/list.component';
import { AccountsBillsListComponent } from './billslist/list.component';
import { AccountsBillsQueueComponent } from './billsqueue/list.component';
import { AccountsPayoutEntriesComponent } from './payoutentries/view.component';
import { AccountsPayinEntriesComponent } from './payinentries/view.component';
import { AccountPaymentsComponent } from './payments/payments.component';
import { AccountsInvoiceServicesComponent } from './invoiceservices/list.component';
import { AccountsServiceProvidersComponent } from './serviceproviders/list.component';
import { AccountsServicePaymentsComponent } from './servicepayments/list.component';
import { AccountsServiceBillsComponent } from './servicebills/list.component';
import { AccountsExpensesReportComponent } from './reports/expenses/view.component';
import { AccountsARReportComponent } from './reports/ar/view.component';
import { AccountsRevenueReportComponent } from './reports/revenue/view.component';
import { AccountsOpexReportComponent } from './reports/opex/view.component';
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

const routes: Routes = [
	{
		path: 'opex/:ho',
		component: OpexsComponent
	},{
		path: 'hoopex/:ho',
		component: OpexsComponent
	}, {
		path: 'opexpayments/:ho',
		component: OpexPaymentsComponent
	},{
		path: 'hoopexpayments/:ho',
		component: OpexPaymentsComponent
	}, {
		path: 'opexbills/:ho',
		component: OpexBillsComponent
	},  {
		path: 'hoopexbills/:ho',
		component: OpexBillsComponent
	}, {
		path: 'billsqueue',
		component: AccountsBillsQueueComponent
	}, {
		path: 'billslist/:ho',
		component: AccountsBillsListComponent
	},{
		path: 'hobillslist/:ho',
		component: AccountsBillsListComponent
	}, {
		path: 'expensepos/:ho',
		component: AccountsPOsListComponent
	},  {
		path: 'hoexpensepos/:ho',
		component: AccountsPOsListComponent
	}, {
		path: 'payouts',
		component: AccountsPayoutComponent
	}, {
		path: 'payoutentries',
		component: AccountsPayoutEntriesComponent
	},{
		path: 'payinentries',
		component: AccountsPayinEntriesComponent
	}, {
		path: 'payments',
		component: AccountPaymentsComponent
	}, {
		path: 'invoiceservices',
		component: AccountsInvoiceServicesComponent
	}, {
		path: 'servicepayments',
		component: AccountsServicePaymentsComponent
	},{
		path: 'serviceproviders',
		component: AccountsServiceProvidersComponent
	}, {
		path: 'servicebills',
		component: AccountsServiceBillsComponent
	}, {
		path: 'reports/expenses/:ho',
		component: AccountsExpensesReportComponent
	}, {
		path: 'reports/ar',
		component: AccountsARReportComponent
	}, {
		path: 'reports/revenue',
		component: AccountsRevenueReportComponent
	}, {
		path: 'reports/opex/:ho',
		component: AccountsOpexReportComponent
	}, {
		path: 'reports/cashflows',
		component: AccountsCashFlowsReportComponent
	}, {
		path: 'reports/liability',
		component: AccountsLiabilityReportComponent
	}, {
		path: 'reports/tdsar',
		component: AccountsTDSARReportComponent
	}, {
		path: 'reports/productslist',
		component: AccountsReportProductsListComponent
	}, {
		path: 'reports/revenueinvoices',
		component: AccountsRevenueInvoicesReportComponent
	}, {
		path: 'reports/invoiceslist',
		component: AccountsReportsInvoicesListComponent
	}, {
		path: 'reports/customerslist',
		component: AccountsCustomersListReportComponent
	}, {
		path: 'reports/billslist',
		component: AccountsReportsBillsListComponent
	}, {
		path: 'reports/vendorslist',
		component: AccountsVendorsListReportComponent
	}, {
		path: 'reports/tdsdueclients',
		component: AccountsReportsTdeDueClientsComponent
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class SupportRoutingModule { }
