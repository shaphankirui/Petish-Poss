import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Category } from 'src/app/Interfaces/categories';
import { product } from 'src/app/Interfaces/products';
import { SearchService } from 'src/app/Services/Search/search.service';
import { MenuService } from 'src/app/Services/menu.service';
import { ProductIDService } from 'src/app/Services/product-id.service';

@Component({
  selector: 'app-show-products',
  templateUrl: './show-products.component.html',
  styleUrls: ['./show-products.component.scss']
})
export class ShowProductsComponent implements OnInit {
  product: product | null = null;
  categories:Category[]=[];
    // Declare a property to store the edited product data
editedProduct: any = {};

// Properties to handle modal display
showModal: boolean = false;

filteredCategories: Category[] = []; // For filtered categories after search
private searchQuerySubscription: Subscription | undefined;
query: string = ''; // For search query
TotalProducts=0;

currentPage: number = 1;
  pageSize: number = 1;
  totalProducts: number = 0;
  paginatedCategories: Category[] = [];


  constructor(private menuService: MenuService,private searchService: SearchService,private router: Router,private productIdService:ProductIDService){}
ngOnInit(): void {
  this.loadCategoriesAndSetFirstCategory()
  this.subscribeToSearchQueryChanges(); // Initialize subscription

 
}
  


loadCategoriesAndSetFirstCategory() {
  this.menuService.getCategories().subscribe((data: any) => {
    // Assuming 'data' is an array of categories fetched from the server
    this.categories = data;
    this.paginateCategories();
    this.calculateTotalProducts(); // Calculate total products after loading categories
    this.filterCategories(); // Initially display all or filtered categories based on the query
  });
}

filterCategories() {
  if (this.query.trim() === '') {
    this.filteredCategories = [...this.categories];
  } else {
    const lowercaseQuery = this.query.toLowerCase();
    this.filteredCategories = this.categories
      .map((category) => ({
        ...category,
        products: category.products.filter((product) =>
          product.product_name.toLowerCase().includes(lowercaseQuery)
        )
      }))
      .filter((category) => category.products.length > 0);
  }
  this.paginateCategories(); // Update paginated categories after filtering
  console.log('Filtered Categories', this.filteredCategories);
}

calculateTotalProducts() {
  this.TotalProducts = this.categories.reduce(
    (total, category) => total + category.products.length,
    0
  );
}
paginateCategories() {
  const startIndex = (this.currentPage - 1) * this.pageSize;
  const endIndex = startIndex + this.pageSize;
  this.paginatedCategories = this.filteredCategories.slice(startIndex, endIndex);
  console.log('paginated categoris',this.paginatedCategories)
}
calculateTotalPages(): number {
    return Math.ceil(this.totalProducts / this.pageSize);
  }

onPageChange(page: number) {
  this.currentPage = page;
  this.paginateCategories();
}
  deleteProduct(id: number,category_id:number): void {
    if (confirm('Are you sure you want to delete this Product?')) {
      this.menuService.deleteproduct(id,category_id).subscribe(
        (response: any) => {
          // Handle success, update UI or take necessary actions
          console.log('Product soft deleted:', response);
          this.loadCategoriesAndSetFirstCategory()
        },
        (error: any) => {
          // Handle error
          console.error('Error deleting product:', error);
        }
      );
    }
  }

  navigateToEdit(product: product) {
    this.productIdService.setProductData(product); // Set the product data in the service
    this.router.navigate(['/admin/edit-product']);
    console.log("Product sent",this.product)

  }

  ngOnDestroy(): void {
    this.unsubscribeFromSearchQueryChanges();
  }

  subscribeToSearchQueryChanges() {
    this.searchQuerySubscription = this.searchService.searchQuery$.subscribe((query: string) => {
      this.query = query;
      console.log('Search input changed:', this.query);
      this.loadCategoriesAndSetFirstCategory(); // Trigger reloading categories based on the new search query
    });
  }

 

    // Function to filter categories based on the search query
  

    // Function to perform live search while typing
    onSearchInputChange() {
      this.filterCategories();
    }
    unsubscribeFromSearchQueryChanges() {
      if (this.searchQuerySubscription) {
        this.searchQuerySubscription.unsubscribe();
      }
    }
    onInputChange() {
      this.searchService.updateSearchQuery(this.query);
    }

}
