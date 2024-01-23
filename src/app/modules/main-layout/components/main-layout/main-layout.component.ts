import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppModule } from 'src/app/app.module';

@Component({
  selector: 'app-main-layout',
  standalone:true,
  imports:[CommonModule,RouterModule],
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent {

}
