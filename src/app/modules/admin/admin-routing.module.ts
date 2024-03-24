// admin-routing.module.ts

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AddProductComponent } from './components/products/add-product/add-product.component';
import { AddCategoryComponent } from './components/categories/add-category/add-category.component';
import { TableComponent } from './components/table/table.component';
import { ShiftsComponent } from './components/shifts/shifts.component';
import { ShowProductsComponent } from './components/products/show-products/show-products.component';
import { ShowCategoriesComponent } from './components/categories/add-category/show-categories/show-categories.component';
import { InventoryComponent } from './components/inventory/inventory/inventory.component';

const routes: Routes = [
    {
      path: '', // Remove the path here as it's already part of the parent route in AppRoutingModule
      component: DashboardComponent,
    },
    {
      path: 'add_product', // Remove the path here as it's already part of the parent route in AppRoutingModule
      component: AddProductComponent,
    },
    {
      path: 'show_products', // Remove the path here as it's already part of the parent route in AppRoutingModule
      component: ShowProductsComponent,
    },
    {
      path: 'add_category', // Remove the path here as it's already part of the parent route in AppRoutingModule
      component: AddCategoryComponent,
    },
    {
      path: 'show_categories', // Remove the path here as it's already part of the parent route in AppRoutingModule
      component: ShowCategoriesComponent,
    },
    {
      path: 'inventory', // Remove the path here as it's already part of the parent route in AppRoutingModule
      component: InventoryComponent,
    },
    {
      path: 'tables', // Remove the path here as it's already part of the parent route in AppRoutingModule
      component: TableComponent,
    },
    {
      path: 'shift', // Remove the path here as it's already part of the parent route in AppRoutingModule
      component: ShiftsComponent,
    },
    // Add more child routes here if needed for other components within MLayoutComponent
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
