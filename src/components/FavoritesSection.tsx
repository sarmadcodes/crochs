import React from 'react';
import { Heart, ArrowLeft } from 'lucide-react';
import { Product } from '../types';
import { ProductCard } from '../components/ProductCard';

interface FavoritesSectionProps {
  favorites: number[];
  products: Product[];
  setActiveSection: (section: string) => void;
  toggleFavorite: (productId: number) => void;
  addToCart: (product: Product) => void;
  onViewProductDetails: (product: Product) => void;
}

export const FavoritesSection: React.FC<FavoritesSectionProps> = ({
  favorites,
  products,
  setActiveSection,
  toggleFavorite,
  addToCart,
  onViewProductDetails
}) => {
  // Filter products that are in favorites
  const favoriteProducts = products.filter(product => favorites.includes(product.id));
  
  return (
    <div className="pt-24 md:pt-32 pb-16 min-h-screen">
      <div className="container mx-auto px-4">
        {/* Back button - with additional margin-top to move it away from header */}
        <div className="mt-4 sm:mt-6 mb-4">
          <button
            onClick={() => setActiveSection('products')}
            className="flex items-center text-sm bg-white text-pink-600 px-3 py-2 rounded-lg shadow-sm border border-pink-200 hover:bg-pink-50 transition-colors font-medium"
          >
            <ArrowLeft size={16} className="mr-1" />
            <span>Back to Products</span>
          </button>
        </div>
        
        {/* Title - positioned below back button */}
        <h1 className="text-2xl md:text-3xl font-bold text-pink-700 mb-8">
          My Favorites
        </h1>
        
        {favoriteProducts.length > 0 ? (
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {favoriteProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={() => addToCart(product)}
                onViewDetails={() => onViewProductDetails(product)}
                isFavorite={true}
                onToggleFavorite={() => toggleFavorite(product.id)}
              />
            ))}
          </div>
        ) : (
          <div className="mt-8 md:mt-12 text-center">
            <div className="bg-white rounded-lg shadow-md p-6 md:p-8 max-w-md mx-auto">
              <Heart size={40} className="text-pink-300 mx-auto mb-4" />
              <h2 className="text-lg md:text-xl font-semibold text-gray-700 mb-2">Your favorites list is empty</h2>
              <p className="text-gray-600 mb-6">Start adding products you love to your favorites</p>
              <button
                onClick={() => setActiveSection('products')}
                className="bg-pink-500 text-white px-5 py-2 md:px-6 md:py-3 rounded-lg font-medium hover:bg-pink-600 transition-colors"
              >
                Browse Products
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
