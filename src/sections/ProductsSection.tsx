import React from 'react';
import { ProductCard } from '../components/ProductCard';
import { products } from '../data/products';
import { Product } from '../types';

interface ProductsSectionProps {
  addToCart: (product: Product) => void;
  onViewProductDetails: (product: Product) => void;
}

export const ProductsSection: React.FC<ProductsSectionProps> = ({ 
  addToCart,
  onViewProductDetails
}) => {
  return (
    <div className="pt-24 pb-16 min-h-screen">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl md:text-4xl font-bold mb-10 text-center text-pink-600">
          Our Crochets
        </h1>
        
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-8">
          {products.map((product, index) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onAddToCart={addToCart}
              onViewDetails={() => onViewProductDetails(product)}
              className="opacity-0 animate-fadeInUp"
              // style={{ animationDelay: `${index * 0.1}s`, animationFillMode: 'forwards' }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
