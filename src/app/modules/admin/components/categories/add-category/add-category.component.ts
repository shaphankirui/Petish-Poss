import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { environment } from 'src/app/Environments/environment';

@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.scss']
})
export class AddCategoryComponent {
  private apiUrl = `${environment.apiRootUrl}/categories`;
  categoryName: string = '';
  categoryIcon: File | null = null;

  constructor(private http: HttpClient) {}

  onSubmit() {
    const categoryData = {
      category_name: this.categoryName,
      icon: this.categoryIcon,
    }
    console.log('Category data', categoryData);
    this.http.post(`${this.apiUrl}`, categoryData).subscribe(
      (response: any) => {
        console.log('Category created successfully', response);
        // Reset the form or handle success as needed
        this.categoryName = '';
        this.categoryIcon = null;
      },
      (error) => {
        console.error('Error creating category', error);
        // Handle errors, e.g., display an error message to the user
      }
    );
  }

  onFileSelected(event: any) {
    this.categoryIcon = event.target.files[0];
  }
}
