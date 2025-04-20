import React from 'react';
import { Heart, ChevronLeft } from 'lucide-react';
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
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center mb-8">
            <button
              onClick={() => setActiveSection('products')}
              className="flex items-center text-pink-700 hover:text-red-500 transition-colors"
            >
              <ChevronLeft size={20} />
              <span className="ml-1">Continue Shopping</span>
            </button>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-6 border-b border-pink-100">
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-pink-600 to-red-500 bg-clip-text text-transparent">
                Your Favorites
              </h1>
            </div>
            
            {favoriteProducts.length > 0 ? (
              <div className="p-6">
                <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
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
              </div>
            ) : (
              <div className="py-16 text-center">
                <div className="w-20 h-20 mx-auto mb-4 flex items-center justify-center rounded-full bg-pink-50">
                  <Heart size={32} className="text-pink-400" />
                </div>
                <h2 className="text-xl font-medium text-gray-800 mb-2">Your favorites list is empty</h2>
                <p className="text-gray-500 mb-6">Looks like you haven't added any favorites yet.</p>
                <button
                  onClick={() => setActiveSection('products')}
                  className="bg-gradient-to-r from-pink-500 to-red-400 hover:from-pink-600 hover:to-red-500 text-white px-6 py-2 rounded-full font-medium transition-all"
                >
                  Start Shopping
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
