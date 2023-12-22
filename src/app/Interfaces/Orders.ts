import { Items } from "./Items";

export interface Orders {
  id: number;
  OrderItems: Items[];
  TableName: string;
  Items: any;
  Total: any;
  ShiftID: number;      // Add ShiftID
  Time: string;        // Add Time
  Served_by: string;   // Add Served_by
  showDeleteIcon: boolean;

}
