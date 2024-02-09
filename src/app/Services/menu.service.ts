import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../Environments/environment';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private apiUrl = `${environment.apiRootUrl}/categories`;


  constructor(private http:HttpClient) { }
  getCategories(): Observable<any>  {
    const url = `${this.apiUrl}`;
    return this.http.get(url); 
   }
   getFilteredCategories(query: string): Observable<any> {
    const url = `${this.apiUrl}/search?query=${query}`;

    return this.http.get<any>(url);
  }
  addCategory(categoryData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}`, categoryData, httpOptions);
  }

  updateCategory(id: number, categoryData: any): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
  
    return this.http.put(url, categoryData, httpOptions)
      .pipe(
        catchError((error: any) => {
          // Handle error (log, display message, etc.)
          return throwError(error);
        })
      );
  }
  

  deleteCategory(id: number): Observable<any> {
    const updatedCategoryData = {
      deleted: true // Assuming 'deleted' is the field that represents the soft delete state
      // Other fields could be added based on your requirements
    };
  
    return this.http.put(`${this.apiUrl}/${id}`, updatedCategoryData);
  }
  

  updateProduct(categoryId: number, productId: number, productData: any): Observable<any> {
    const url = `${this.apiUrl}/${categoryId}/products/${productId}`;
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    return this.http.put(url, productData, httpOptions)
      .pipe(
        catchError((error: any) => {
          // Handle error (log, display message, etc.)
          return throwError(error);
        })
      );
  }

  deleteproduct(id: number,category_id:number): Observable<any> {
    const updatedProductData = {
      deleted: true // Assuming 'deleted' is the field that represents the soft delete state
      // Other fields could be added based on your requirements
    };
  
    return this.http.put(`${this.apiUrl}/${category_id}/products/${id}`, updatedProductData);
  }
  
  getAllUsers(token:string,):Observable<any>{
    return this.http.post(environment.apiRootUrl, {_org_code:'nbdem', _jwttoken:token, _cloud_function_run:'point_of_sale', _get_pos_products_list:1}, httpOptions)
  }

 
  postSelectedItemsToBackend(selectedItems: any[], total: number, tableName: string) {
    const orderData = {
      TableName: tableName,
      OrderNo: '1',
      Items: selectedItems,
      Total: total
    };

    return this.http.post( ` ${environment.apiRootUrl}/orders`, orderData);
  }

  getPostedOrders(): Observable<any> {
    const url = ` ${environment.apiRootUrl}/orders`;

    return this.http.get<any>(url);
  }
  getVoidedOrders(): Observable<any> {
    const url = ` ${environment.apiRootUrl}/orders/deleted`;

    return this.http.get<any>(url);
  }
  getOrderDetailsById(orderId: number): Observable<any> {
    const url = ` ${environment.apiRootUrl}/orders/${orderId}`    
    return this.http.get(url);
  }

  // deleteOrder(orderId: number): Observable<void> {
  //   const url = ` ${environment.apiRootUrl}/orders/${orderId}`;
  //   return this.http.delete<void>(url);
  // }
  updateOrder(orderId: number, orderData: any): Observable<any> {
    const url = ` ${environment.apiRootUrl}/orders/${orderId}`;
    return this.http.put(url, orderData, httpOptions);
  }
  deleteOrder(orderId: number): Observable<void> {
    const url = ` ${environment.apiRootUrl}/orders/${orderId}`;
    return this.http.delete<void>(url);
  }





  

  getCategoryProductCount(categoryId: number): Observable<number> {
    const url = `${this.apiUrl}/${categoryId}/products`; // Adjust the URL based on your Laravel routes
    return this.http.get<number>(url);
  }

  getCategoryWithProducts(categoryId: number): Observable<any> {
    const url = `${this.apiUrl}/${categoryId}/products`;

    return this.http.get<any>(url);
  }
}
