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
    <div className="pt-24 pb-16 min-h-screen">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <button 
            onClick={() => setActiveSection('products')}
            className="flex items-center text-sm bg-white text-pink-600 px-4 py-2 rounded-lg shadow-sm border border-pink-200 hover:bg-pink-50 transition-colors font-medium"
          >
            <ArrowLeft size={18} className="mr-2" />
            <span>Back to Products</span>
          </button>
          <h1 className="text-2xl md:text-3xl font-bold text-center text-pink-700">
            My Favorites
          </h1>
          <div className="w-32"></div> {/* Empty div for balance */}
        </div>

        {favoriteProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
          <div className="mt-12 text-center">
            <div className="bg-white rounded-lg shadow-md p-8 max-w-md mx-auto">
              <Heart size={48} className="text-pink-300 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-700 mb-2">Your favorites list is empty</h2>
              <p className="text-gray-600 mb-6">Start adding products you love to your favorites</p>
              <button
                onClick={() => setActiveSection('products')}
                className="bg-pink-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-pink-600 transition-colors"
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
