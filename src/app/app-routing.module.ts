import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthRoutingModule } from './modules/auth/auth-routing.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { MainLayoutModule } from './modules/main-layout/main-layout.module';
import { MenuModule } from './modules/menu/menu.module';
import { OrdersModule } from './modules/orders/orders.module';
import { ShitfModule } from './modules/shitf/shitf.module';
import { TablesModule } from './modules/tables/tables.module';

const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forRoot(routes),
    AuthRoutingModule,
    DashboardModule,
    MainLayoutModule,
    MenuModule,
    OrdersModule,
    ShitfModule,
    TablesModule,
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
