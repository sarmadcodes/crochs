import React from 'react';
import { Heart, ShoppingBag, ChevronLeft, ChevronRight } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation, A11y } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
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
  return (
    <div className="pt-12 md:pt-16">
      <section className="min-h-[70vh] md:min-h-[80vh] flex flex-col justify-center items-center text-center px-4 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full flex justify-between overflow-hidden opacity-20">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="animate-float"
              style={{
                position: 'absolute',
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${5 + Math.random() * 10}s`
              }}
            >
              <Heart
                size={10 + Math.random() * 20}
                className={Math.random() > 0.5 ? "text-pink-500" : "text-red-500"}
              />
            </div>
          ))}
        </div>
        
        <div className="z-10 max-w-3xl mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 md:mb-4 leading-tight bg-gradient-to-r from-pink-600 to-red-500 bg-clip-text text-transparent animate-fadeInUp">
            Handmade Crochet Creations with Love
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-pink-800 mb-4 md:mb-6 animate-fadeInUp px-2" style={{ animationDelay: "0.2s" }}>
            Each piece is carefully crafted to bring warmth and joy to your home
          </p>
          <div className="animate-fadeInUp" style={{ animationDelay: "0.4s" }}>
            <button
              onClick={() => setActiveSection('products')}
              className="bg-gradient-to-r from-pink-500 to-red-400 hover:from-pink-600 hover:to-red-500 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-full font-medium transition-all transform hover:scale-105 flex items-center mx-auto"
            >
              <ShoppingBag size={16} className="mr-2" />
              Shop Now
            </button>
          </div>
        </div>
      </section>
      
      {/* Featured Section with Mobile Slider */}
      <section className="home-featured-section py-10 md:py-16 px-4 bg-gradient-to-b from-pink-100 to-white">
        <div className="container mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12 relative">
            <span className="bg-gradient-to-r from-pink-600 to-red-500 bg-clip-text text-transparent">Featured Creations</span>
            <span className="block w-16 md:w-24 h-1 bg-gradient-to-r from-pink-500 to-red-400 mx-auto mt-3 md:mt-4"></span>
          </h2>
          
          {/* Mobile Slider (visible only on mobile) */}
          <div className="block md:hidden relative">
            <Swiper
              modules={[Pagination, Navigation, A11y]}
              spaceBetween={16}
              slidesPerView={1.1}
              centeredSlides={true}
              pagination={{ 
                clickable: true,
                el: '.swiper-custom-pagination',
                renderBullet: function (index, className) {
                  return '<span class="' + className + '"></span>';
                }
              }}
              navigation={{
                prevEl: '.swiper-custom-prev',
                nextEl: '.swiper-custom-next'
              }}
              className="featured-mobile-slider"
            >
              {products.slice(0, 3).map((product) => (
                <SwiperSlide key={product.id} className="pb-10">
                  <ProductCard
                    product={product}
                    onAddToCart={addToCart}
                    onViewDetails={() => onViewProductDetails ? onViewProductDetails(product) : setActiveSection('products')}
                    isFeature={true}
                    className="home-featured-card"
                  />
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Navigation Container */}
            <div className="flex items-center justify-center mt-4 space-x-4">
              {/* Previous Navigation Arrow */}
              <button className="swiper-custom-prev bg-pink-500/30 hover:bg-pink-500/50 rounded-full p-1">
                <ChevronLeft className="text-white" size={30} />
              </button>

              
              

              {/* Next Navigation Arrow */}
              <button className="swiper-custom-next bg-pink-500/30 hover:bg-pink-500/50 rounded-full p-1">
                <ChevronRight className="text-white" size={30} />
              </button>
            </div>
          </div>

          {/* Desktop Grid (hidden on mobile) */}
          <div className="hidden md:grid home-featured-grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
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
