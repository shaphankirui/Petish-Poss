import { SelectedOrder } from "./SelectedOrder";

export interface product {
  selectedSpecification: string;
  specification: any;
  deleted: any;
is_service: any;
  quantityToAdd: any;
  category_id: any;
  Items:string;
price: any;
name: any;
id:any;  // Allow both number and string for id
product_name: string;
  product_price: string;
  product_quantity: any;
  buying_price: any;
  selectedItems?: number;
  selectedOrder: SelectedOrder[];
  showDeleteIcon: boolean;
}
