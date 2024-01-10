import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { MainMenuComponent } from '../menu/components/main-menu/main-menu.component';

const routes: Routes = [
  {
    path: '', // This should be an empty path as it's already part of the parent route in AppRoutingModule
    component: LoginComponent,
    children: [
      { path: 'login', component: LoginComponent }, // Route for MainMenuComponent within MLayoutComponent
      // Add more child routes here if needed for other components within MLayoutComponent
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
