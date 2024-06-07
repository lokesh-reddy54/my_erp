import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthLayoutComponent } from './shared/components/layouts/auth-layout/auth-layout.component';
import { AuthGaurd } from './shared/services/auth.gaurd';
import { BlankLayoutComponent } from './shared/components/layouts/blank-layout/blank-layout.component';
import { SelfCareLayoutComponent } from './shared/components/layouts/selfcare-layout/selfcare-layout.component';
import { ClientLayoutComponent } from './shared/components/layouts/client-layout/client-layout.component';
import { MobileLayoutComponent } from './shared/components/layouts/mobile-layout/mobile-layout.component';
import { AdminLayoutSidebarCompactComponent } from './shared/components/layouts/admin-layout-sidebar-compact/admin-layout-sidebar-compact.component';
import { AdminLayoutSidebarLargeComponent } from './shared/components/layouts/admin-layout-sidebar-large/admin-layout-sidebar-large.component';

const adminRoutes: Routes = [
  {
    path: 'dashboards',
    loadChildren: './modules/dashboards/dashboard.module#DashboardModule'
  },
  {
    path: 'workbenches',
    loadChildren: './modules/workbenches/workbenches.module#WorkBenchesModule'
  },
  {
    path: 'admin',
    loadChildren: './modules/admin/admin.module#AdminModule'
    // loadChildren: () => import('./modules/admin/admin.module').then(mod => mod.AdminModule)
  },
  {
    path: 'bookings',
    loadChildren: './modules/bookings/bookings.module#BookingsModule'
    // loadChildren: () => import('./modules/bookings/bookings.module').then(mod => mod.BookingsModule)
  },
  {
    path: 'leads',
    loadChildren: './modules/leads/leads.module#LeadsModule'
    // loadChildren: () => import('./modules/leads/leads.module').then(mod => mod.LeadsModule)
  },
  {
    path: 'support',
    loadChildren: './modules/support/support.module#SupportModule'
    // loadChildren: () => import('./modules/support/support.module').then(mod => mod.SupportModule)
  },
  {
    path: 'accounts',
    loadChildren: './modules/accounts/accounts.module#AccountsModule'
    // loadChildren: () => import('./modules/accounts/accounts.module').then(mod => mod.AccountsModule)
  },
  {
    path: 'purchases',
    loadChildren: './modules/purchases/purchases.module#PurchasesModule'
    // loadChildren: () => import('./modules/purchases/purchases.module').then(mod => mod.PurchasesModule)
  }, {
    path: 'assets',
    loadChildren: './modules/assets/assets.module#AssetsModule'
    // loadChildren: () => import('./modules/assets/assets.module').then(mod => mod.AssetsModule)
  },
];

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboards/main',
    // redirectTo: 'others/404',
    pathMatch: 'full'
  },
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      {
        path: 'sessions',
        loadChildren: './modules/sessions/sessions.module#SessionsModule'
         // loadChildren: () => import('./modules/sessions/sessions.module').then(mod => mod.SessionsModule)
      }
    ]
  },
  {
    path: '',
    component: BlankLayoutComponent,
    children: [
      {
        path: 'others',
        loadChildren: './modules/others/others.module#OthersModule'
         // loadChildren: () => import('./modules/others/others.module').then(mod => mod.OthersModule)
      }
    ]
  },
  {
    path: '',
    component: SelfCareLayoutComponent,
    children: [
      {
        path: 'selfcare',
        loadChildren: './modules/selfcare/selfcare.module#SelfCareModule'
         // loadChildren: () => import('./modules/selfcare/selfcare.module').then(mod => mod.SelfCareModule)
      }
    ]
  },
  {
    path: '',
    component: AdminLayoutSidebarLargeComponent,
    canActivate: [AuthGaurd],
    children: adminRoutes
  },
  {
    path: '',
    component: ClientLayoutComponent,
    canActivate: [AuthGaurd],
    children: [{
      path: 'client',
      loadChildren: './modules/client/client.module#ClientModule'
         // loadChildren: () => import('./modules/client/client.module').then(mod => mod.ClientModule)
    }]
  },
  {
    path: '',
    component: MobileLayoutComponent,
    canActivate: [AuthGaurd],
    children: [{
      path: 'mobile',
      loadChildren: './modules/mobile/mobile.module#MobileModule'
         // loadChildren: () => import('./modules/client/client.module').then(mod => mod.ClientModule)
    }]
  },
  {
    path: '**',
    redirectTo: 'others/404'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
