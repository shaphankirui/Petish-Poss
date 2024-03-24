import { Injectable } from '@angular/core';
import { UserInterface } from '../Interfaces/auth.interface';
import { Category } from '../Interfaces/categories';
import { product } from '../Interfaces/products';

@Injectable({
  providedIn: 'root'
})
export class ProductIDService {
  constructor() { }

  productData: product | null = null;
  categoryData: Category | null = null;
  userData: UserInterface | null = null;


  setProductData(product: product) {
    this.productData = product;
  }

  getProductData(): product | null {
    return this.productData;
  }
  getCategoryData(): Category | null {
    return this.categoryData;
  }

  setCategoryData(category: Category) {
    this.categoryData = category;
  }

  getUserData(): UserInterface | null {
    return this.userData;
  }
  setUserData(user: UserInterface) {
    this.userData = user;
  }
}
