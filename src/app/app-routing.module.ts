import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MLayoutComponent } from './layout/MainLayout/m-layout/m-layout.component';

const routes: Routes = [
  {
    path: '',
    component: MLayoutComponent,
    children: [
      { path: 'dashboard', loadChildren: () => import('./modules/dashboard/dashboard.module').then(m => m.DashboardModule) },
      // Load the MenuModule with an additional 'menu' path
      { path: 'menu', loadChildren: () => import('./modules/menu/menu.module').then(m => m.MenuModule) },
      { path: 'orders', loadChildren: () => import('./modules/orders/orders.module').then(m => m.OrdersModule) },
      { path: 'admin', loadChildren: () => import('./modules/admin/admin.module').then(m => m.AdminModule) },
      // Add more routes as needed
    ]
  },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' }, // Redirect to the default route
  // { path: '**', redirectTo: 'dashboard' }, 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
