import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxEchartsModule } from 'ngx-echarts';
import { SharedComponentsModule } from 'src/app/shared/components/shared-components.module';

import { AdminCompanyComponent } from './company/view.component';
import { AdminClientCompaniesComponent } from './clientcompanies/view.component';
import { AdminUsersComponent } from './users/users.component';
import { AdminOfficesComponent } from './offices/offices.component';
import { AdminPropertiesComponent } from './property-contracting/properties.component';
import { AdminLocationsComponent } from './locations/locations.component';
import { AdminFacilitiesComponent } from './facilities/facilities.component';
import { MailsComponent } from './mails/mails.component';
import { AdminSMSComponent } from './sms/sms.component';
import { AdminExternalSystemsComponent } from './externalsystems/externalsystems.component';
import { AdminHelpNotesComponent } from './helpnotes/view.component';
import { AdminSchedulerComponent } from './scheduler/view.component';
import { AdminPettyCashAccountsComponent } from './pettycash-accounts/list.component';
import { AdminDebitCardAccountsComponent } from './debitcard-accounts/list.component';
import { ChatComponent } from './chat/chat/chat.component';


const routes: Routes = [
  {
    path: 'chat',
    component: ChatComponent
  },{
    path: 'company',
    component: AdminCompanyComponent
  }, {
    path: 'clientcompanies',
    component: AdminClientCompaniesComponent
  },{
    path: 'users',
    component: AdminUsersComponent
  }, {
    path: 'offices',
    component: AdminOfficesComponent
  }, {
    path: 'properties',
    component: AdminPropertiesComponent
  }, {
    path: 'locations',
    component: AdminLocationsComponent
  }, {
    path: 'facilities',
    component: AdminFacilitiesComponent
  }, {
    path: 'externalsystems',
    component: AdminExternalSystemsComponent
  }, {
    path: 'mails',
    component: MailsComponent
  }, {
    path: 'sms',
    component: AdminSMSComponent
  }, {
    path: 'helpnotes',
    component: AdminHelpNotesComponent
  }, {
    path: 'scheduler',
    component: AdminSchedulerComponent
  }, {
    path: 'pettycashaccounts',
    component: AdminPettyCashAccountsComponent
  }, {
    path: 'debitcardaccounts',
    component: AdminDebitCardAccountsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
