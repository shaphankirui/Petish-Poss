import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashbordMainComponent } from './components/dashbord-main/dashbord-main.component';

const routes: Routes = [
  {
    path: '', // This should be an empty path as it's already part of the parent route in AppRoutingModule
    component: DashbordMainComponent,
    children: [
      { path: '', component: DashbordMainComponent }, // Route for MainMenuComponent within MLayoutComponent
      // Add more child routes here if needed for other components within MLayoutComponent
    ]
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
