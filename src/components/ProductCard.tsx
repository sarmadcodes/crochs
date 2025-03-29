import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onViewDetails: () => void;
  className?: string;
  isFeature?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  onAddToCart, 
  onViewDetails,
  className = '',
  isFeature = false
}) => {
  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden transition-all hover:shadow-xl transform hover:-translate-y-1 h-full flex flex-col ${className}`}>
      <div 
        className={`${isFeature ? 'h-48 sm:h-56 md:h-72' : 'h-40 sm:h-48 md:h-64'} overflow-hidden relative cursor-pointer`}
        onClick={onViewDetails}
      >
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover transition-all hover:scale-105"
        />
      </div>
      <div className="p-2 sm:p-3 md:p-5 flex flex-col flex-1">
        <div 
          className="cursor-pointer mb-3 flex-1"
          onClick={onViewDetails}
        >
          <div className="text-xs font-medium text-pink-500 mb-0.5 md:mb-1">{product.category}</div>
          <h3 className="text-sm md:text-lg font-semibold text-gray-800 truncate">{product.name}</h3>
        </div>
        <div className="flex justify-between items-center mt-auto">
          <span className="text-base md:text-lg font-bold text-pink-700">${product.price}</span>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(product);
            }}
            className={`
              ${isFeature 
                ? 'bg-pink-100 hover:bg-pink-200 text-pink-700 px-3 py-1.5 sm:px-4 sm:py-2 md:px-6 md:py-3 rounded-full text-sm md:text-base font-medium transition-colors flex items-center' 
                : 'bg-pink-100 hover:bg-pink-200 text-pink-700 px-2 py-0.5 sm:px-3 sm:py-1 md:px-5 md:py-2 rounded-full text-xs sm:text-sm md:text-base font-medium transition-colors flex items-center'
              }
            `}
          >
            <ShoppingCart size={isFeature ? 14 : 12} className="mr-1 md:mr-2 md:w-5 md:h-5" />
            <span className="md:font-semibold">Add to cart</span>
          </button>
        </div>
      </div>
    </div>
  );
};
