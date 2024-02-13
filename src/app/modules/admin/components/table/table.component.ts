import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { Table } from 'src/app/Interfaces/Tables';
import { SearchService } from 'src/app/Services/Search/search.service';
import { TableService } from 'src/app/Services/table/table.service';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent {
  tables: any[] = []; // Define your table data structure
  private searchQuerySubscription: Subscription | undefined;


  constructor(private tableService: TableService,     private searchService: SearchService
    ) {} // Replace with your actual service

  ngOnInit(): void {
    this.fetchTables();

    this.searchQuerySubscription = this.searchService.searchQuery$.subscribe((query: string) => {
      console.log('Received search query:', query); // Added console log here
      this.fetchTables(query); // Fetch tables based on the emitted search query
    });
  }

  fetchTables(searchTerm?: string) {
    this.tableService.getTables(searchTerm).subscribe((data: any) => {
      this.tables = data.map((table: any) => ({
        ...table,
        isOccupied: table.Is_occupied === 1 // Convert 1 to true, 0 to false
      }));
      console.log('Tables Data', this.tables);
    });
  }

  ngOnDestroy(): void {
    this.searchQuerySubscription?.unsubscribe(); // Unsubscribe to prevent memory leaks
  }
  

  selectTable(table: Table ) {
    this.tableService.setSelectedTable(table);
  }

}
