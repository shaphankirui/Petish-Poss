import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MenuRoutingModule } from './menu-routing.module';
import { MainMenuComponent } from './components/main-menu/main-menu.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    MainMenuComponent
  ],
  imports: [
    CommonModule,
    MenuRoutingModule,
    FormsModule,
  ]
})
export class MenuModule { }
