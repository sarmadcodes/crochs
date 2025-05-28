import React from 'react';
import { ShoppingCart, Heart } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onViewDetails: () => void;
  className?: string;
  isFeature?: boolean;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  onAddToCart, 
  onViewDetails,
  className = '',
  isFeature = false,
  isFavorite = false,
  onToggleFavorite
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
        {onToggleFavorite && (
          <button 
            onClick={(e) => { 
              e.stopPropagation(); 
              onToggleFavorite(); 
            }} 
            className={`absolute top-2 right-2 p-2 rounded-full transition-all duration-300 ${isFavorite ? 'bg-pink-500 text-white' : 'bg-white/80 hover:bg-white text-pink-500 hover:text-pink-600'}`} 
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart size={16} fill={isFavorite ? "white" : "none"} className={isFavorite ? "animate-heartBeat" : ""} />
          </button>
        )}
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
          <span className="text-base md:text-lg font-bold text-pink-700">Rs {product.price}.00</span>
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

/* Add this to your CSS file or styled-components */
/* 
@keyframes heartBeat {
  0% { transform: scale(1); }
  15% { transform: scale(1.3); }
  30% { transform: scale(1); }
  45% { transform: scale(1.3); }
  60% { transform: scale(1); }
  100% { transform: scale(1); }
}

.animate-heartBeat {
  animation: heartBeat 1s ease-in-out;
}
*/
