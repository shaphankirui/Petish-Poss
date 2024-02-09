import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { environment } from 'src/app/Environments/environment';
import { MenuService } from 'src/app/Services/menu.service';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss'],
})
export class AddProductComponent implements OnInit {
  private apiUrl = `${environment.apiRootUrl}/categories`;
  productName: string = '';
  productPrice: number = 0;
  productQuantity: number = 0;
  selectedCategory: number = 0;
  categories: any[] = [];
  is_service: boolean = false;
  specificationArray: string | null = null;

  constructor(
    private http: HttpClient,
    private categoryService: MenuService,
    private toast: HotToastService,
    private router: Router
  ) {}

  ngOnInit() {
    this.categoryService.getCategories().subscribe((response: any) => {
      this.categories = response;
    });
  }

  onSubmit() {
    if (this.selectedCategory === 0) {
      console.error('Please select a category.');
      return;
    }

    let productQuantityToSend = this.is_service ? 0 : this.productQuantity;

    const productData = {
      product_name: this.productName,
      product_price: this.productPrice,
      product_quantity: productQuantityToSend,
      category_id: this.selectedCategory,
      is_service: this.is_service,
      specification:
        this.specificationArray?.split(',').map((spec) => spec.trim()) || null,
    };
    console.log('Product to be created details', productData);

    const url = `${this.apiUrl}/${this.selectedCategory}/products`;

    this.http.post(url, productData).subscribe(
      (response: any) => {
        this.toast.success('Product created successfully', response);
        this.resetForm();
        this.router.navigate(['/admin']);
      },
      (error) => {
        this.toast.error('Error creating product', error);
      }
    );
  }

  private resetForm() {
    this.productName = '';
    this.productPrice = 0;
    this.productQuantity = 0;
    this.selectedCategory = 0;
    this.is_service = false;
    this.specificationArray = '';
  }
}
