import { Component, OnInit } from '@angular/core';
import { Category } from 'src/app/Interfaces/categories';
import { MenuService } from 'src/app/Services/menu.service';

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.scss']
})
export class MainMenuComponent implements OnInit {
  categories:Category[]=[];
  constructor(
    private menuService: MenuService,
  ){}
  ngOnInit(): void {
    this.getAllCategoriesAndProducts();
  }

  getAllCategoriesAndProducts(){
    this.menuService.getCategories().subscribe((data:any) =>{
      this.categories=data;
      console.log('Categories',this.categories)
    });
  }

}
