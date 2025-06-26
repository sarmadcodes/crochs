import React, { useState } from 'react';
import { ArrowLeft, ChevronDown } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { products } from '../data/products';
import { Product } from '../types';

interface ProductsSectionProps {
  addToCart: (product: Product) => void;
  onViewProductDetails: (product: Product) => void;
  goBack: () => void;
  favorites: number[];
  toggleFavorite: (productId: number) => void;
}

export const ProductsSection: React.FC<ProductsSectionProps> = ({ 
  addToCart,
  onViewProductDetails,
  goBack
}) => {
  const [sortOption, setSortOption] = useState('default');
  const [showSortOptions, setShowSortOptions] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  
  // Hardcoded categories
  const categories = ['all', 'Keychains', 'Bouquets', 'Plush'];

  // Filter and sort products
  const getFilteredAndSortedProducts = () => {
    let filteredProducts = activeCategory === 'all' 
      ? products 
      : products.filter(product => product.category === activeCategory);

    switch (sortOption) {
      case 'price-low-high':
        return [...filteredProducts].sort((a, b) => a.price - b.price);
      case 'price-high-low':
        return [...filteredProducts].sort((a, b) => b.price - a.price);
      default:
        return filteredProducts;
    }
  };
  
  const filteredAndSortedProducts = getFilteredAndSortedProducts();
  
  return (
    <div className="products-section pt-36 pb-16 min-h-screen">
      <div className="container mx-auto px-3">
        {/* <h1 className="text-3xl md:text-4xl font-bold mb-8 md:mb-12 text-center text-pink-600">
          Our Crochets
          <span className="block w-16 md:w-24 h-1 bg-gradient-to-r from-pink-500 to-red-400 mx-auto mt-3 md:mt-2"></span>
        </h1>  */}
        
        {/* Sort and Back to Home Container */}
        <div className="products-sort-container flex flex-col sm:flex-row justify-between items-center mb-8 relative mt-6 md:mt-2 space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-4 w-full sm:w-auto justify-between sm:justify-start">
            {/* Back to Home Button */}
            <button 
              onClick={goBack}
              className="flex items-center text-sm bg-white text-pink-600 px-4 py-2 rounded-lg shadow-sm border border-pink-200 hover:bg-pink-50 transition-colors font-medium"
            >
              <ArrowLeft size={16} className="mr-2" />
              <span>Back to Home</span>
            </button>

            {/* Sort dropdown */}
            <div className="relative">
              <button 
                className="products-sort-button flex items-center text-sm bg-white text-pink-600 px-4 py-2 rounded-lg shadow-sm border border-pink-200 hover:bg-pink-50 transition-colors font-medium"
                onClick={() => setShowSortOptions(!showSortOptions)}
              >
                <span>Sort by: {sortOption === 'default' ? 'Featured' : 
                  sortOption === 'price-low-high' ? 'Price: Low to High' : 
                  'Price: High to Low'}</span>
                <ChevronDown size={16} className="ml-2 text-pink-600" />
              </button>
              
              {showSortOptions && (
                <div className="products-sort-dropdown absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg z-10 py-1 border border-gray-200">
                  <button 
                    className={`block px-4 py-2 text-sm w-full text-left hover:bg-gray-100 ${sortOption === 'default' ? 'font-medium text-pink-600' : ''}`}
                    onClick={() => {
                      setSortOption('default');
                      setShowSortOptions(false);
                    }}
                  >
                    Featured
                  </button>
                  <button 
                    className={`block px-4 py-2 text-sm w-full text-left hover:bg-gray-100 ${sortOption === 'price-low-high' ? 'font-medium text-pink-600' : ''}`}
                    onClick={() => {
                      setSortOption('price-low-high');
                      setShowSortOptions(false);
                    }}
                  >
                    Price: Low to High
                  </button>
                  <button 
                    className={`block px-4 py-2 text-sm w-full text-left hover:bg-gray-100 ${sortOption === 'price-high-low' ? 'font-medium text-pink-600' : ''}`}
                    onClick={() => {
                      setSortOption('price-high-low');
                      setShowSortOptions(false);
                    }}
                  >
                    Price: High to Low
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="category-filter flex justify-center space-x-4 md:space-x-8 mb-8">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`pb-1 text-sm md:text-base uppercase tracking-wider transition-colors ${
                activeCategory === category 
                  ? 'text-pink-600 border-b-2 border-pink-600 font-semibold' 
                  : 'text-gray-500 hover:text-pink-400'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
        
        <div className="products-grid grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-8">
          {filteredAndSortedProducts.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onAddToCart={addToCart}
              onViewDetails={() => onViewProductDetails(product)}
              className="products-card opacity-0 animate-fadeInUp"
            />
          ))}
        </div>

        {/* No Products Message */}
        {filteredAndSortedProducts.length === 0 && (
          <div className="text-center text-gray-500 mt-8">
            No products found in this category.
          </div>
        )}
      </div>
    </div>
  );
};
