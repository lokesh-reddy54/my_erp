import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WorkBenchMainComponent } from './main/workbenches-main.component';
import { WorkBenchAccountsComponent } from './accounts/workbenches-main.component';
import { WorkBenchBuildingOpsComponent } from './buildingops/workbenches-main.component';
import { WorkBenchBusinessOpsComponent } from './businessops/workbenches-main.component';
import { WorkBenchProjectsComponent } from './projects/workbenches-main.component';
import { WorkBenchPurchasesComponent } from './purchases/workbenches-main.component';
import { WorkBenchSalesComponent } from './sales/workbenches-main.component';
import { WorkBenchSupportComponent } from './support/workbenches-main.component';

const routes: Routes = [
  {
    path: 'main',
    component: WorkBenchMainComponent
  }, {
    path: 'accounts',
    component: WorkBenchAccountsComponent
  }, {
    path: 'buildingops',
    component: WorkBenchBuildingOpsComponent
  }, {
    path: 'businessops',
    component: WorkBenchBusinessOpsComponent
  }, {
    path: 'purchases',
    component: WorkBenchPurchasesComponent
  }, {
    path: 'sales',
    component: WorkBenchSalesComponent
  }, {
    path: 'support',
    component: WorkBenchSupportComponent
  }, {
    path: 'projects',
    component: WorkBenchProjectsComponent
  }, {
    path: 'hmt',
    component: WorkBenchMainComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkBenchesRoutingModule { }
