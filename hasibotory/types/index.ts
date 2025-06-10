
export interface Product {
    name: string;
  }
  
  export interface SelectedProduct {
    name: string;
    quantity: number;
    isSelected: boolean;
  }
  
  export interface ProductListResponse {
    products: Product[];
    total: number;
    page: number;
    totalPages: number;
  }