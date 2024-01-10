import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { MainLayoutComponent } from './modules/main-layout/components/main-layout/main-layout.component';
import { AuthLayoutComponent } from './layout/AuthLayout/auth-layout/auth-layout.component';
import { MLayoutComponent } from './layout/MainLayout/m-layout/m-layout.component';

@NgModule({
  declarations: [
    AppComponent,
    AuthLayoutComponent,
    MLayoutComponent,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    MainLayoutComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
