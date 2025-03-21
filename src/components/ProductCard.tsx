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
        className="h-64 overflow-hidden relative cursor-pointer"
        onClick={onViewDetails}
      >
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover transition-all hover:scale-105"
        />
        <div className="absolute top-4 right-4">
          <button 
            className="bg-white/80 hover:bg-white p-2 rounded-full text-pink-500 hover:text-red-500 transition-colors"
            onClick={(e) => {
              e.stopPropagation(); // Prevent triggering the parent's onClick
            }}
          >
            <Heart size={20} />
          </button>
        </div>
      </div>
      <div className="p-5">
        <div 
          className="cursor-pointer"
          onClick={onViewDetails}
        >
          <div className="text-xs font-medium text-pink-500 mb-1">{product.category}</div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">{product.name}</h3>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-lg font-bold text-pink-700">${product.price}</span>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(product);
            }}
            className="bg-pink-100 hover:bg-pink-200 text-pink-700 px-3 py-1 rounded-full text-sm font-medium transition-colors flex items-center"
          >
            <ShoppingCart size={14} className="mr-1" />
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};