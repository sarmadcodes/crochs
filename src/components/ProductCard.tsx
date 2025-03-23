import React from 'react';
import { Heart, ShoppingCart } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onViewDetails: () => void;
  className?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  onAddToCart, 
  onViewDetails,
  className = '' 
}) => {
  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden transition-all hover:shadow-xl transform hover:-translate-y-1 ${className}`}>
      <div 
        className="h-40 sm:h-48 md:h-64 overflow-hidden relative cursor-pointer"
        onClick={onViewDetails}
      >
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover transition-all hover:scale-105"
        />
      </div>
      <div className="p-2 sm:p-3 md:p-5">
        <div 
          className="cursor-pointer mb-3"
          onClick={onViewDetails}
        >
          <div className="text-xs font-medium text-pink-500 mb-0.5 md:mb-1">{product.category}</div>
          <h3 className="text-sm md:text-lg font-semibold text-gray-800 truncate">{product.name}</h3>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-base md:text-lg font-bold text-pink-700">${product.price}</span>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(product);
            }}
            className="bg-pink-100 hover:bg-pink-200 text-pink-700 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm font-medium transition-colors flex items-center"
          >
            <ShoppingCart size={12} className="mr-1" />
            Add
          </button>
        </div>
      </div>
    </div>
  );
};
