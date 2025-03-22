export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  images?: string[]; // Added this field for multiple images
}

export interface CartItem extends Product {
  quantity: number;
}
