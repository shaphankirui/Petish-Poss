import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { Observable, Subscription, catchError, of } from 'rxjs';
import { environment } from 'src/app/Environments/environment';
import { Shift } from 'src/app/Interfaces/Shift';
import { Table } from 'src/app/Interfaces/Tables';
import { UserInterface } from 'src/app/Interfaces/auth.interface';
import { Category } from 'src/app/Interfaces/categories';
import { product } from 'src/app/Interfaces/products';
import { OrderCommunicationService } from 'src/app/Services/OrderCommunication/order-communication.service';
import { SearchService } from 'src/app/Services/Search/search.service';
import { ShiftService } from 'src/app/Services/Shift/shift.service';
import { AuthService } from 'src/app/Services/auth/auth.service';
import { MenuService } from 'src/app/Services/menu.service';
import { TableService } from 'src/app/Services/table/table.service';
import { UserService } from 'src/app/Services/user/user.service';

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.scss'],
})
export class MainMenuComponent implements OnInit {
  subTotal: number = 0;
  total: number = 0;
  categories: Category[] = [];
  activeCategory: Category | null = null;
  selectedProducts: product[] = [];
  selectedProductsToPrint: any[] = [];
  productTotals: number[] = [];
  currentUser$: Observable<UserInterface | null> | undefined;
  selectedTable: Table | null = null;
  selectedTableId: number | null = null;
  shift: Shift | null = null;
  query: string = '';
  colors = ['#CFDDDB', '#E4CDED', '#C2DBE9', '#E4CDED', '#F1C8D0', '#C9CAEF'];
  private searchQuerySubscription: Subscription | undefined;
  filteredProducts: any[] = [];
  selectedCategory: any = null;
  loggedinUser: string = '';
  comments: string = '';
  advancedOrderId: number | null = null;
  orderIdToPrint: any;
  totalToPrint: any;
  clicked: boolean = false;

  constructor(
    private menuService: MenuService,
    private orderCommunicationService: OrderCommunicationService,
    private http: HttpClient,
    private searchService: SearchService,
    private userService: UserService,
    private authService: AuthService,
    private tableService: TableService,
    private toast: HotToastService,
    private shiftApi: ShiftService,
    private route: ActivatedRoute,
    private router: Router,
    private notificationService: HotToastService
  ) {
    this.categories = [];
    this.assignColorsToCategories(); // Call the method to assign colors
    this.loadCategoriesAndSetFirstCategory();
  }

  ngOnInit() {
    this.loadCategoriesAndSetFirstCategory();
    console.log('Current Route:', this.route.snapshot);
    this.route.params.subscribe((params) => {
      // Retrieve the order ID from the route parameters
      const orderIdFromRoute = +params['orderId'];

      // Use the order ID from the route parameters if it's a valid number
      if (!isNaN(orderIdFromRoute)) {
        this.advancedOrderId = orderIdFromRoute;
      } else {
        // Retrieve the order ID from the OrderCommunicationService
        this.advancedOrderId = this.orderCommunicationService.getOrderId();
      }

      // Log the order ID for debugging purposes
      console.log('Order IDdddddddddddd:', this.advancedOrderId);
    });

    // this.setupTableSubscription();
    this.subscribeToShiftName();
    this.selectedTable = this.tableService.getSelectedTable();
    this.selectedTableId = this.selectedTable!.id;
    console.log('selected table', this.selectedTableId);
    this.currentUser$ = this.userService.getCurrentUser();
    this.subscribeToSearchQueryChanges();
  }

  loadCategoriesAndSetFirstCategory() {
    this.menuService.getCategories().subscribe((data: any) => {
      this.categories = data.map((category: any) => ({
        ...category,
        products: category.products
          .filter((product: any) => !product.deleted)
          .map((product: any) => ({
            ...product,
            specification: JSON.parse(product.specification), // Parse the specification string into an array
          })),
      }));
      this.activeCategory = this.categories[0];
      console.log('Categories', this.categories);
      this.categories.forEach((category) => {
        category.num_products = category.products.length;
      });
      this.assignColorsToCategories();
    });
  }

  filterCategories() {
    if (this.query.trim() === '') {
      this.loadCategoriesAndSetFirstCategory(); // Load all categories if the query is empty
    } else {
      const lowercaseQuery = this.query.toLowerCase();
      this.menuService.getCategories().subscribe((data: any) => {
        this.categories = data
          .map((category: any) => ({
            ...category,
            products: category.products
              .filter((product: any) =>
                product.product_name.toLowerCase().includes(lowercaseQuery)
              )
              .filter((product: any) => !product.deleted),
          }))
          .filter(
            (category: any) =>
              category.category_name.toLowerCase().includes(lowercaseQuery) ||
              category.products.length > 0 // Filter categories with matching products
          );
        console.log('Filtered Categories', this.categories);
        this.assignColorsToCategories();
      });
    }
  }

  assignColorsToCategories() {
    const numCategories = this.categories.length;
    console.log('category len for colors', numCategories);
    for (let i = 0; i < numCategories; i++) {
      const colorIndex = i < this.colors.length ? i : i % this.colors.length;
      this.categories[i].color = this.colors[colorIndex];
    }
  }
  displayProductsByCategory(category: Category) {
    const products = category.products;
    // console.log('Products for category:', category.category_name);
    products.forEach((product, index) => {
      // console.log(`Product ${index + 1}:`, product);
    });
  }

  setActiveCategory(category: Category) {
    if (!this.selectedTable) {
      this.toast.info('Select Table First');
      this.router.navigate(['/admin/tables']);
      return;
    }
    this.activeCategory = category;
    // this.query='';
    // console.log('Active Category',this.activeCategory)
  }

  categoryProducts(category_id: number) {
    this.filteredProducts = this.categories.flatMap((category) =>
      category.products.filter(
        (product) =>
          product.product_name
            .toLowerCase()
            .includes(this.query.toLowerCase()) &&
          product.category_id === category_id &&
          !product.deleted
      )
    );
    console.log('selected category productsddddd,', this.filteredProducts);
    this.filteredProducts.filter(
      (product: any) => product.category_id === category_id && !product.deleted
    );
    console.log('selected category products,', this.filteredProducts);
  }

  incrementItem(product: product) {
    console.log('advancedOrderIdddddd', this.advancedOrderId);
    console.log('selectedTable', this.selectedTable);

    // if the selected table is false or advance order > 0 return
    if (this.selectedTable || this.advancedOrderId) {
      // Check if the product is a service (not countable)
      if (product.is_service) {
        // For service products, allow incrementing even if it's zero
        product.selectedItems = (product.selectedItems || 0) + 1;
        this.addToSelectedProducts(product);
        console.log('SELECTED ITEMS', this.selectedProducts);

        // Update selectedProductsToPrint after modifying selectedProducts
        this.selectedProductsToPrint = [...this.selectedProducts]; // Sync the arrays
        console.log(
          'Products selected for printing',
          this.selectedProductsToPrint
        );
      } else {
        // For countable products
        if (product.product_quantity && Number(product.product_quantity) > 0) {
          // Check if quantity is less than 5
          if (Number(product.product_quantity) <= 5) {
            this.notificationService.info(
              'Running low on ' + product.product_name
            );
          }

          product.selectedItems = (product.selectedItems || 0) + 1;
          product.product_quantity = String(
            Number(product.product_quantity) - 1
          );
          this.addToSelectedProducts(product);
          console.log('SELECTED ITEMS', this.selectedProducts);

          // Check if quantity is zero
          if (Number(product.product_quantity) === 0) {
            this.notificationService.error(
              'Sorry, this product is out of stock'
            );
          }

          // Update selectedProductsToPrint after modifying selectedProducts
          this.selectedProductsToPrint = [...this.selectedProducts]; // Sync the arrays
          console.log(
            'Products selected for printing',
            this.selectedProductsToPrint
          );
        } else {
          this.notificationService.error('Sorry, this product is out of stock');
        }
      }
    } else {
      this.toast.info('Select Table First');
      return;
    }
  }

  decrementItem(product: product) {
    if (!this.selectedTable || this.advancedOrderId) {
      this.notificationService.error('Select Table First');
      return;
    }

    if (product.selectedItems && product.selectedItems > 0) {
      product.selectedItems -= 1;
      if (product.product_quantity) {
        product.product_quantity = String(Number(product.product_quantity) + 1);
      }

      // If the item reaches zero selectedItems, remove it
      if (product.selectedItems === 0) {
        this.removeFromSelectedProducts(product);
      } else {
        // Update the existing item's selectedItems
        this.updateSelectedProducts(product);
        // console.log('SELECTED ITEMS', this.selectedProducts);
      }

      // Update selectedProductsToPrint after modifying selectedProducts
      this.selectedProductsToPrint = [...this.selectedProducts]; // Sync the arrays
      console.log(
        'Products selected for printing',
        this.selectedProductsToPrint
      );
    } else {
      // this.notificationService.showError('Select Table First');
    }
  }

  updateSelectedProducts(product: product) {
    const index = this.selectedProducts.findIndex((p) => p.id === product.id);

    if (index !== -1) {
      // Update the selectedItems for the existing product
      this.selectedProducts[index].selectedItems = product.selectedItems;
      const totalPrice =
        parseFloat(product.product_price) * (product.selectedItems || 0) || 0;
      this.productTotals[index] = totalPrice;
    }
  }

  removeFromSelectedProducts(product: product) {
    const index = this.selectedProducts.findIndex((p) => p.id === product.id);

    if (index !== -1) {
      this.selectedProducts.splice(index, 1);
      this.productTotals.splice(index, 1);
    }
  }

  addToSelectedProducts(product: product) {
    // Check if the product is already in the array
    const index = this.selectedProducts.findIndex((p) => p.id === product.id);

    const totalPrice =
      parseFloat(product.product_price) * (product.selectedItems || 0) || 0;

    if (index !== -1) {
      // If the product is already in the array, update its selectedItems
      this.selectedProducts[index].selectedItems = product.selectedItems;
      // Update the total for this product in the productTotals array
      this.productTotals[index] = totalPrice;
    } else {
      // If the product is not in the array, add it
      this.selectedProducts.push(product);
      // Add the total for this new product to the productTotals array
      this.productTotals.push(totalPrice);
    }

    this.selectedProductsToPrint = [...this.selectedProducts]; // Update selectedProductsToPrint
    console.log('Products selected for printing', this.selectedProductsToPrint);
  }

  get selectedProductsTotal(): number {
    return this.selectedProducts.reduce((total, product) => {
      const price = parseFloat(product.product_price);
      const quantity = product.selectedItems || 0;
      return total + price * quantity;
    }, 0);
  }

  calculateTotalPrice(): number {
    let total = 0;
    for (let i = 0; i < this.selectedProducts.length; i++) {
      total += this.productTotals[i];
    }
    return total;
  }

  deleteItem(receiptItem: any) {
    // Set the quantity to 0
    receiptItem.selectedItems = 0;

    // Remove the deleted item from selectedProducts
    const index = this.selectedProducts.findIndex(
      (p) => p.id === receiptItem.id
    );
    if (index !== -1) {
      this.selectedProducts.splice(index, 1);
    }
  }

  resetSelectedItems() {
    this.selectedProducts.forEach((product) => {
      product.selectedItems = 0;
    });
    console.log('selected prooooo', this.selectedProducts);
  }

  decreaseOrDecreaseOrder() {
    // Your implementation for decreasing or increasing orders
  }

  postSelectedItemsToBackend() {
    this.clicked = true;
    if (this.selectedProducts.length === 0) {
      this.notificationService.error('Select items to place an order');
      this.clicked = false;
      return;
    }

    this.shiftApi.currentShift$.subscribe((shift: Shift | null) => {
      if (!shift) {
        this.notificationService.error('Start Shift First');
        this.clicked = false;
        return;
      }

      this.authService.getCurrentUser().subscribe((user) => {
        const servedBy = 'username';
        this.loggedinUser = 'user';
        // this.loggedinUser=user.name;

        const itemsToUpdateQuantity = this.selectedProducts.map((product) => ({
          categoryId: product.category_id, // Assuming you have categoryId in your product object
          productId: product.id,
          productData: {
            product_quantity: product.product_quantity,
          },
        }));

        itemsToUpdateQuantity.forEach((item) => {
          this.menuService
            .updateProduct(item.categoryId, item.productId, item.productData)
            .subscribe(
              () => {
                // Successfully updated product quantity
              },
              (error) => {
                console.error('Error updating product quantity:', error);
                this.notificationService.error(
                  'Failed To Update Product Quantity'
                );
              }
            );
        });

        const itemsToSend = this.selectedProducts.map((product) => ({
          name: `${product.product_name} ${
            product.selectedSpecification || ''
          }`, // Concatenate name and specification
          id: product.id,
          category_id: product.category_id,
          price: product.product_price,
          selectedItems: product.selectedItems || 0,
          specification: product.specification,
        }));

        console.log('Items send to printo server', itemsToSend);

        const order = {
          TableName: this.selectedTable?.name || 'Table 1',
          ShiftID: shift.id,
          Items: itemsToSend,
          Total: this.calculateTotalPrice(),
          // Served_by: servedBy,
          Served_by: 'Shaphan',
          paymentMode: 'Cash',
          amountPaid: 0,
          comments: this.comments,
          Cash_paid: '0',
          Mpesa_paid: '0',
          Bank_paid: '0',
          Voucher_amount: 0,
          Complimentary_amount: 0,
        };

        this.http
          .post(`${environment.apiRootUrl}/orders`, order)
          .pipe(
            catchError((error) => {
              console.error('Error posting order:', error);
              return of(null);
            })
          )
          .subscribe((response: any) => {
            if (response) {
              this.orderIdToPrint = response.id;
              this.totalToPrint = response.Total;
              console.log('Order posted id response', this.orderIdToPrint);
              this.clearSelectedItems();
              this.notificationService.success('Order Posted');
              this.postDataToPrint(this.selectedProductsToPrint);
              this.clicked = false;

              // console.log('Table marked as occupied', this.selectedTable);

              if (this.selectedTableId) {
                // console.log('Table marked as occupied', this.selectedTableId);

                this.tableService
                  .markTableAsOccupied(this.selectedTableId)
                  .subscribe(() => {
                    // console.log('Table marked as occupied');
                    // You can perform additional actions or update UI here
                  });
              } else {
                console.log('Failed to mark the table cleared', Error);
              }

              // this.printOrder(order);
            } else {
              this.notificationService.error('Failed To Post Order');
            }
          });
      });
    });
  }

  postAvanceOrderToBackend() {
    if (this.selectedProducts.length === 0) {
      this.notificationService.error('Select items to place an order');
      return;
    }

    this.shiftApi.currentShift$.subscribe((shift: Shift | null) => {
      if (!shift) {
        this.notificationService.error('Start Shift First');
        return;
      }

      this.authService.getCurrentUser().subscribe((user) => {
        if (user) {
          const servedBy = user.username;
          this.loggedinUser = user.name;

          const itemsToUpdateQuantity = this.selectedProducts.map(
            (product) => ({
              categoryId: product.category_id, // Assuming you have categoryId in your product object
              productId: product.id,
              productData: {
                product_quantity: product.product_quantity,
              },
            })
          );

          itemsToUpdateQuantity.forEach((item) => {
            this.menuService
              .updateProduct(item.categoryId, item.productId, item.productData)
              .subscribe(
                () => {
                  // Successfully updated product quantity
                },
                (error) => {
                  console.error('Error updating product quantity:', error);
                  this.notificationService.error(
                    'Failed To Update Product Quantity'
                  );
                }
              );
          });

          const itemsToSend = this.selectedProducts.map((product) => ({
            name: `${product.product_name} ${
              product.selectedSpecification || ''
            }`, // Concatenate name and specification
            id: product.id,
            category_id: product.category_id,
            price: product.product_price,
            selectedItems: product.selectedItems || 0,
            specification: product.specification,
          }));
          const itemsJson = JSON.stringify(itemsToSend);

          console.log('Items send to printo server', itemsJson);

          const order = {
            shift_id: String(shift.id),
            items: itemsJson,
            Total: this.calculateTotalPrice(),
            waiters_name: servedBy,
            paymentMode: 'Cash',
            amountPaid: 0,
            comments: this.comments,
            Cash_paid: '0',
            Mpesa_paid: '0',
            Bank_paid: '0',
            Voucher_amount: 0,
            Complimentary_amount: 0,
          };
          console.log('order to advance table', order);

          this.http
            .put(
              `${environment.apiRootUrl}/advanced-orders/${this.advancedOrderId}`,
              order
            )
            .pipe(
              catchError((error) => {
                console.error('Error posting order:', error);
                return of(null);
              })
            )
            .subscribe((response) => {
              if (response) {
                this.clearSelectedItems();
                this.notificationService.success(
                  'Advanced Order  Posted Successfully'
                );
                this.postDataToPrint(this.selectedProductsToPrint);
                this.router.navigate(['/orders/show_advaced_orders']);
                // this.logoutUser();
                // console.log('Table marked as occupied', this.selectedTable);

                // this.printOrder(order);
              } else {
                this.notificationService.error('Failed To Post Order');
              }
            });
        } else {
          this.notificationService.error('User information not found');
        }
      });
    });
  }

  postDataToPrint(selectedProductsToPrint: any) {
    const url = 'http://localhost/C-POS-Printer-API/public/api/receipts';
    // const url = 'http://127.0.0.1:8000/api/receipts';
    // const url = 'http://127.0.0.1:8000/api/receipts';
    console.log('items received for printing', selectedProductsToPrint);
    const itemsToSend = this.selectedProductsToPrint.map((product) => ({
      name: product.product_name,
      id: product.id,
      price: product.product_price,
      selectedItems: product.selectedItems, // Ensure selectedItems is properly updated
    }));

    const servedBy = this.loggedinUser;

    const data = {
      table_name: this.selectedTable?.name || 'Table 1',
      served_by: servedBy,
      items: JSON.stringify(itemsToSend),
      total: this.totalToPrint,
      time: new Date().toISOString(),
      organization_name: 'Demo',
      till_number: '1234567890',
      order_id: this.orderIdToPrint,
    };

    console.log('data send to print', data);

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    this.http.post(url, data, { headers }).subscribe(
      (response) => {
        console.log('Data posted successfully!', response);
        // Handle success response here
        this.resetSelectedItems();
        this.logoutUser();
      },
      (error) => {
        console.error('Error posting data:', error);
        // Handle error response here
      }
    );
  }

  clearSelectedItems() {
    this.selectedProducts = [];
    this.productTotals = [];
    this.selectedTable = null;
  }
  selectTable(table: Table) {
    // Store the selected table in local storage
    this.tableService.setSelectedTable(table);
  }
  private subscribeToShiftName() {
    this.shiftApi.currentShift$.subscribe((shift) => {
      this.shift = shift;
      // console.log('Current shift::',shift)
    });
  }

  subscribeToSearchQueryChanges() {
    this.searchQuerySubscription = this.searchService.searchQuery$.subscribe(
      (query: string) => {
        this.query = query;
        console.log('Search input changed:', this.query);
        this.loadCategoriesAndSetFirstCategory(); // Trigger reloading categories based on the new search query
      }
    );
  }
  onSearchInputChange() {
    this.filterCategories();
  }
  unsubscribeFromSearchQueryChanges() {
    if (this.searchQuerySubscription) {
      this.searchQuerySubscription.unsubscribe();
    }
  }
  onInputChange() {
    if (this.query) {
      this.filteredProducts = this.categories.flatMap((category) =>
        category.products.filter((product) =>
          product.product_name.toLowerCase().includes(this.query.toLowerCase())
        )
      );
      console.log('searched products', this.filteredProducts);
    }
  }

  logoutUser(): void {
    this.authService.logout();
  }
}
