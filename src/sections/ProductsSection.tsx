import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
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
  const [sortOption, setSortOption] = useState('default');
  const [showSortOptions, setShowSortOptions] = useState(false);
  
  // Sort products based on selected option
  const getSortedProducts = () => {
    switch (sortOption) {
      case 'price-low-high':
        return [...products].sort((a, b) => a.price - b.price);
      case 'price-high-low':
        return [...products].sort((a, b) => b.price - a.price);
      case 'name-a-z':
        return [...products].sort((a, b) => a.name.localeCompare(b.name));
      case 'name-z-a':
        return [...products].sort((a, b) => b.name.localeCompare(a.name));
      default:
        return products;
    }
  };
  
  const sortedProducts = getSortedProducts();
  
  return (
    <div className="pt-24 pb-16 min-h-screen">
      <div className="container mx-auto px-3">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center text-pink-600">
          Our Crochets
        </h1>
        
        {/* Sort dropdown */}
        <div className="flex justify-end mb-6 relative">
          <div className="relative">
            <button 
              className="flex items-center text-sm bg-white px-3 py-1.5 rounded-lg shadow-sm border border-gray-200 hover:bg-gray-50"
              onClick={() => setShowSortOptions(!showSortOptions)}
            >
              <span>Sort by: {sortOption === 'default' ? 'Featured' : 
                sortOption === 'price-low-high' ? 'Price: Low to High' : 
                sortOption === 'price-high-low' ? 'Price: High to Low' :
                sortOption === 'name-a-z' ? 'Name: A to Z' :
                'Name: Z to A'}</span>
              <ChevronDown size={16} className="ml-2" />
            </button>
            
            {showSortOptions && (
              <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg z-10 py-1 border border-gray-200">
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
                <button 
                  className={`block px-4 py-2 text-sm w-full text-left hover:bg-gray-100 ${sortOption === 'name-a-z' ? 'font-medium text-pink-600' : ''}`}
                  onClick={() => {
                    setSortOption('name-a-z');
                    setShowSortOptions(false);
                  }}
                >
                  Name: A to Z
                </button>
                <button 
                  className={`block px-4 py-2 text-sm w-full text-left hover:bg-gray-100 ${sortOption === 'name-z-a' ? 'font-medium text-pink-600' : ''}`}
                  onClick={() => {
                    setSortOption('name-z-a');
                    setShowSortOptions(false);
                  }}
                >
                  Name: Z to A
                </button>
              </div>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-8">
          {sortedProducts.map((product, index) => (
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
