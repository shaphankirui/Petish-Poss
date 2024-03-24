import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AdminRoutingModule } from './admin-routing.module';
import { AddProductComponent } from './components/products/add-product/add-product.component';
import { AddCategoryComponent } from './components/categories/add-category/add-category.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableComponent } from './components/table/table.component';
import { ShiftsComponent } from './components/shifts/shifts.component';
import { ShowProductsComponent } from './components/products/show-products/show-products.component';
import { ShowCategoriesComponent } from './components/categories/add-category/show-categories/show-categories.component';
import { InventoryComponent } from './components/inventory/inventory/inventory.component';



@NgModule({
  declarations: [
    DashboardComponent,
    AddProductComponent,
    AddCategoryComponent,
    TableComponent,
    ShiftsComponent,
    ShowProductsComponent,
    ShowCategoriesComponent,
    InventoryComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class AdminModule { }
