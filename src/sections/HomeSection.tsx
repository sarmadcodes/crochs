import React, { useState, useRef } from 'react';
import { Heart, ShoppingBag, ChevronLeft, ChevronRight } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { products } from '../data/products';
import { Product } from '../types';

interface HomeSectionProps {
  setActiveSection: (section: string) => void;
  addToCart: (product: Product) => void;
  onViewProductDetails?: (product: Product) => void;
}

export const HomeSection: React.FC<HomeSectionProps> = ({
  setActiveSection,
  addToCart,
  onViewProductDetails
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % products.slice(0, 3).length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + products.slice(0, 3).length) % products.slice(0, 3).length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current - touchEndX.current > 50) {
      nextSlide();
    } else if (touchEndX.current - touchStartX.current > 50) {
      prevSlide();
    }
  };

  return (
    <div className="pt-12 md:pt-16">
      <section className="min-h-[70vh] md:min-h-[80vh] flex flex-col justify-center items-center text-center px-4 relative overflow-hidden">
        <div className="z-10 max-w-3xl mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 md:mb-4 leading-tight bg-gradient-to-r from-pink-600 to-red-500 bg-clip-text text-transparent animate-fadeInUp">
            Handmade Crochet Creations with Love
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-pink-800 mb-4 md:mb-6 animate-fadeInUp px-2">
            Each piece is carefully crafted to bring warmth and joy to your home
          </p>
          <button
            onClick={() => setActiveSection('products')}
            className="bg-gradient-to-r from-pink-500 to-red-400 hover:from-pink-600 hover:to-red-500 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-full font-medium transition-all transform hover:scale-105 flex items-center mx-auto"
          >
            <ShoppingBag size={16} className="mr-2" />
            Shop Now
          </button>
        </div>
      </section>

      {/* Featured Section with Slider for Mobile */}
      <section className="home-featured-section py-10 md:py-16 px-4 bg-gradient-to-b from-pink-100 to-white">
        <div className="container mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12">
            <span className="bg-gradient-to-r from-pink-600 to-red-500 bg-clip-text text-transparent">Featured Creations</span>
          </h2>

          {/* Mobile Slider */}
          <div 
            className="relative sm:hidden w-full h-[4in] overflow-hidden"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div className="flex transition-transform ease-in-out duration-300" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
              {products.slice(0, 3).map((product) => (
                <div key={product.id} className="w-full flex-shrink-0 px-2 h-[4in]">
                  <ProductCard
                    product={product}
                    onAddToCart={addToCart}
                    onViewDetails={() => onViewProductDetails ? onViewProductDetails(product) : setActiveSection('products')}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Dots Navigation with Arrows Below */}
          <div className="flex justify-center items-center mt-4 sm:hidden">
            <button className="p-2 bg-white rounded-full shadow-md" onClick={prevSlide}>
              <ChevronLeft size={20} />
            </button>
            <div className="flex mx-2">
              {products.slice(0, 3).map((_, index) => (
                <button key={index} className={`w-3 h-3 mx-1 rounded-full ${currentIndex === index ? 'bg-pink-500' : 'bg-gray-300'}`} onClick={() => setCurrentIndex(index)}></button>
              ))}
            </div>
            <button className="p-2 bg-white rounded-full shadow-md" onClick={nextSlide}>
              <ChevronRight size={20} />
            </button>
          </div>

          {/* Desktop Grid */}
          <div className="hidden sm:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
            {products.slice(0, 3).map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={addToCart}
                onViewDetails={() => onViewProductDetails ? onViewProductDetails(product) : setActiveSection('products')}
                isFeature={true}
                className="home-featured-card"
              />
            ))}
          </div>

          <div className="text-center mt-8 md:mt-12">
            <button
              onClick={() => setActiveSection('products')}
              className="border-2 border-pink-500 text-pink-600 hover:bg-pink-50 px-4 sm:px-6 py-2 rounded-full font-medium transition-colors"
            >
              View All Products
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
