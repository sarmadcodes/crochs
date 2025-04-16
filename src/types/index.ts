export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  description?: string;
  images?: string[];
}

export interface CartItem extends Product {
  quantity: number;
}

export interface FavoritesState {
  items: number[]; // Array of product IDs
}
