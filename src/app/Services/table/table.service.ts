import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/app/Environments/environment';
import { Table } from 'src/app/Interfaces/Tables';

@Injectable({
  providedIn: 'root'
})
export class TableService {

  private apiUrl = ` ${environment.apiRootUrl}/`;
  private selectedTable: Table | null = null;
  private selectedTableSource = new BehaviorSubject<Table | null>(this.selectedTable);
  selectedTable$ = this.selectedTableSource.asObservable();

  constructor(private http: HttpClient) {
    // Check local storage for an existing selected table
    const storedTable = localStorage.getItem('selectedTable');
    if (storedTable) {
      this.selectedTable = JSON.parse(storedTable);
      this.selectedTableSource.next(this.selectedTable);
    }
  }

  getTables(searchTerm?: string) {
    const searchQuery = searchTerm ? `?search=${searchTerm}` : '';
    return this.http.get<Table[]>(`${this.apiUrl}tables${searchQuery}`);
  }
  

  setSelectedTable(table: Table) {
    this.selectedTable = table;
    this.selectedTableSource.next(this.selectedTable);

    // Store the selected table in local storage
    // localStorage.setItem('selectedTable', JSON.stringify(this.selectedTable));
  }

  getSelectedTable(): Table | null {
    return this.selectedTable;
  }

  clearSelectedTable() {
    this.selectedTable = null;
    this.selectedTableSource.next(this.selectedTable);

    // Remove the selected table from local storage
    // localStorage.removeItem('selectedTable');
  }

  markTableAsOccupied(tableId: number) {
    // Make a PUT request to mark the table as occupied using the provided endpoint
    return this.http.put(`${this.apiUrl}tables/${tableId}/occupy`, null);
  }
  markTableAsFree(tableId: number) {
    // Make a PUT request to mark the table as free using the provided endpoint
    return this.http.put(`${this.apiUrl}tables/${tableId}/vacate`, null);
  }
}
