import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainMenuComponent } from './components/main-menu/main-menu.component';
import { MLayoutComponent } from 'src/app/layout/MainLayout/m-layout/m-layout.component';

const routes: Routes = [
  {
    path: '', // This should be an empty path as it's already part of the parent route in AppRoutingModule
    component: MainMenuComponent,
    children: [
      { path: 'menuu', component: MainMenuComponent }, // Route for MainMenuComponent within MLayoutComponent
      // Add more child routes here if needed for other components within MLayoutComponent
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MenuRoutingModule { }
