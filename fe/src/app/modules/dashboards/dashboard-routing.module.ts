import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboadMainComponent } from './main/dashboad-main.component';
// import { DashboardClientComponent } from './client/dashboard-client.component';
// import { DashboadSupportComponent } from './support/dashboard-support.component';
import { AccountsDashboardComponent } from './accounts/view.component';
import { AccountsCardsComponent } from './cards/accounts/view.component';
import { InvoicesCardsComponent } from './cards/invoices/view.component';

const routes: Routes = [
  {
    path: 'main',
    component: DashboadMainComponent
  }, {
    path: 'accounts',
    component: AccountsDashboardComponent
  }, {
    path: 'cards/accounts',
    component: AccountsCardsComponent
  },
  {
    path: 'cards/invoices',
    component: InvoicesCardsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
