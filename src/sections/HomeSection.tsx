import React, { useEffect, useState } from 'react';
import { ShoppingBag, ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation, A11y, EffectCoverflow, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-coverflow';
import { ProductCard } from '../components/ProductCard';
import { products } from '../data/products';
import { Product } from '../types';

// Review interface and data
interface Review {
  id: number;
  name: string;
  image: string;
  rating: number;
  text: string;
}

const reviews: Review[] = [
  {
    id: 1,
    name: "sarms",
    image: "https://i.pinimg.com/736x/8f/85/87/8f8587df52d364a4109a675399eedcc8.jpg",
    rating: 5,
    text: "Absolutely in love with my crochet blanket! The craftsmanship is exceptional, and it adds such warmth to my living room."
  },
  {
    id: 2,
    name: "samosa",
    image: "https://i.pinimg.com/736x/8f/85/87/8f8587df52d364a4109a675399eedcc8.jpg",
    rating: 5,
    text: "Kya mast cheez banayi hai.The attention to detail is remarkable, and each piece feels unique."
  },
  {
    id: 3,
    name: "pakora",
    image: "https://i.pinimg.com/736x/8f/85/87/8f8587df52d364a4109a675399eedcc8.jpg",
    rating: 5,
    text: "I've purchased multiple items, and each one is more beautiful than the last. Highly recommend these crochet creations!"
  },
];

// Review Card Component
const ReviewCard: React.FC<Review> = ({ name, image, rating, text }) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const timeout = setTimeout(() => setIsVisible(true), 300);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className={`bg-white rounded-2xl shadow-lg overflow-hidden group transform transition-all duration-500 hover:scale-105 hover:shadow-xl max-w-[320px] mx-auto ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <div className="relative">
        <div className="w-full aspect-square overflow-hidden relative">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover absolute inset-0 group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
        
        <div className="absolute top-4 right-4 bg-pink-500 text-white rounded-full p-2 shadow-md transform -rotate-12 group-hover:rotate-0 transition-all duration-300">
          <Quote size={18} />
        </div>
      </div>
      
      <div className="p-6 bg-gradient-to-br from-white to-pink-50">
        <div className="flex justify-center text-yellow-400 mb-3">
          {[...Array(rating)].map((_, i) => (
            <Star key={i} size={18} fill="currentColor" className="mx-0.5 transform group-hover:scale-110 transition-transform duration-300" />
          ))}
        </div>
        <h4 className="font-bold text-pink-800 text-center mb-2 text-lg">{name}</h4>
        <p className="text-gray-600 text-center text-sm italic line-clamp-3 leading-relaxed">"{text}"</p>
        
        <div className="w-12 h-1 bg-gradient-to-r from-pink-400 to-red-300 mx-auto mt-4 rounded-full transform origin-left group-hover:scale-x-150 transition-transform duration-300"></div>
      </div>
    </div>
  );
};

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
      
      {/* Featured Section with Enhanced Mobile Slider - Now with Square Layout on Desktop */}
      <section className="home-featured-section py-12 md:py-20 px-4 bg-gradient-to-b from-pink-100 to-white relative overflow-hidden">
       
        
        <div className="container mx-auto relative z-10">
          <div className="flex flex-col items-center mb-12">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-4 relative">
              <span className="bg-gradient-to-r from-pink-600 to-red-500 bg-clip-text text-transparent">Featured Creations</span>
            </h2>
            <p className="text-gray-600 max-w-2xl text-center mb-4">Discover our most loved handmade creations</p>
            <div className="w-24 h-1 bg-gradient-to-r from-pink-500 to-red-400 rounded-full"></div>
          </div>
          
          {/* Mobile Slider (visible only on mobile) - NO CHANGES HERE */}
          <div className="block md:hidden relative">
            <Swiper
              modules={[Pagination, Navigation, A11y, EffectCoverflow, Autoplay]}
              effect="coverflow"
              coverflowEffect={{
                rotate: 20,
                stretch: 0,
                depth: 200,
                modifier: 1,
                slideShadows: true
              }}
              spaceBetween={10}
              slidesPerView={1.1}
              centeredSlides={true}
              loop={true}
              autoplay={{
                delay: 5000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true
              }}
              pagination={{ 
                clickable: true,
                el: '.swiper-featured-pagination',
                bulletActiveClass: 'swiper-pagination-bullet-active-pink',
                bulletClass: 'swiper-pagination-bullet-pink',
              }}
              navigation={{
                prevEl: '.swiper-featured-prev',
                nextEl: '.swiper-featured-next'
              }}
              className="featured-mobile-slider py-8"
            >
              {products.slice(0, 3).map((product) => (
                <SwiperSlide key={product.id} className="pb-10">
                  <div className="max-w-[320px] mx-auto">
                    <ProductCard
                      product={product}
                      onAddToCart={addToCart}
                      onViewDetails={() => onViewProductDetails ? onViewProductDetails(product) : setActiveSection('products')}
                      isFeature={true}
                      className="home-featured-card text-left"
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Navigation Container */}
            <div className="flex items-center justify-center mt-4">
              {/* Previous Navigation Arrow */}
              <button className="swiper-featured-prev bg-gradient-to-r from-pink-500 to-red-400 hover:from-pink-600 hover:to-red-500 text-white rounded-full p-2 shadow-md transition-all transform hover:scale-110 hover:-rotate-12">
                <ChevronLeft size={24}/>
              </button>

              {/* Pagination Dots */}
              <div className="swiper-featured-pagination flex items-center justify-center mx-4"></div>

              {/* Next Navigation Arrow */}
              <button className="swiper-featured-next bg-gradient-to-r from-pink-500 to-red-400 hover:from-pink-600 hover:to-red-500 text-white rounded-full p-2 shadow-md transition-all transform hover:scale-110 hover:-rotate-12">
                <ChevronRight size={24} />
              </button>
            </div>
          </div>

          {/* Desktop Grid (hidden on mobile) - UPDATED FOR SQUARE CARDS */}
          <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
            {products.slice(0, 3).map((product, index) => (
              <div 
                key={product.id} 
                className="transform transition-all duration-700 flex justify-center" 
                style={{ 
                  transitionDelay: `${index * 150}ms`,
                  animation: `fadeInUp 0.8s ease-out ${index * 0.2}s both`
                }}
              >
                <div className="w-full aspect-square">
                  <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all hover:shadow-xl transform hover:-translate-y-1 h-full flex flex-col home-featured-card">
                    <div className="aspect-square overflow-hidden relative cursor-pointer" onClick={() => onViewProductDetails ? onViewProductDetails(product) : setActiveSection('products')}>
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover transition-all hover:scale-105"
                      />
                    </div>
                    <div className="p-4 flex flex-col flex-1">
                      <div className="cursor-pointer mb-3 flex-1" onClick={() => onViewProductDetails ? onViewProductDetails(product) : setActiveSection('products')}>
                        <div className="text-xs font-medium text-pink-500 mb-1">{product.category}</div>
                        <h3 className="text-lg font-semibold text-gray-800 truncate">{product.name}</h3>
                      </div>
                      <div className="flex justify-between items-center mt-auto">
                        <span className="text-lg font-bold text-pink-700">${product.price}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            addToCart(product);
                          }}
                          className="bg-pink-100 hover:bg-pink-200 text-pink-700 px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center"
                        >
                          <ShoppingBag size={14} className="mr-2" />
                          <span className="font-semibold">Add to cart</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-10 md:mt-16">
            <button
              onClick={() => setActiveSection('products')}
              className="inline-flex items-center border-2 border-pink-500 text-pink-600 hover:bg-pink-50 px-6 sm:px-8 py-2 sm:py-3 rounded-full font-medium transition-all hover:shadow-md hover:scale-105 group"
            >
              <span>View All Products</span>
              <ChevronRight size={16} className="ml-2 transform group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* Enhanced Reviews Section - NO CHANGES HERE */}
      <section className="home-reviews-section py-12 md:py-20 px-4 bg-gradient-to-b from-white to-pink-50 relative overflow-hidden">
       
        
        
        <div className="container mx-auto relative z-10">
          <div className="flex flex-col items-center mb-12">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center mb-4 relative">
              <span className="bg-gradient-to-r from-pink-600 to-red-500 bg-clip-text text-transparent">What Our Customers Say</span>
            </h2>
            <p className="text-gray-600 max-w-2xl text-center mb-4">Hear from those who've experienced the warmth and joy of our handmade creations</p>
            <div className="w-24 h-1 bg-gradient-to-r from-pink-500 to-red-400 rounded-full"></div>
          </div>
          
          {/* Mobile Slider (visible only on mobile) */}
          <div className="block md:hidden relative">
            <Swiper
              modules={[Pagination, Navigation, A11y, EffectCoverflow, Autoplay]}
              effect="coverflow"
              coverflowEffect={{
                rotate: 20,
                stretch: 0,
                depth: 200,
                modifier: 1,
                slideShadows: true
              }}
              spaceBetween={10}
              slidesPerView={1.1}
              centeredSlides={true}
              loop={true}
              autoplay={{
                delay: 4000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true
              }}
              pagination={{ 
                clickable: true,
                el: '.swiper-reviews-pagination',
                bulletActiveClass: 'swiper-pagination-bullet-active-pink',
                bulletClass: 'swiper-pagination-bullet-pink',
              }}
              navigation={{
                prevEl: '.swiper-reviews-prev',
                nextEl: '.swiper-reviews-next'
              }}
              className="reviews-mobile-slider py-8"
            >
              {reviews.map((review) => (
                <SwiperSlide key={review.id} className="pb-10">
                  <ReviewCard {...review} />
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Navigation Container */}
            <div className="flex items-center justify-center mt-4">
              {/* Previous Navigation Arrow */}
              <button className="swiper-reviews-prev bg-gradient-to-r from-pink-500 to-red-400 hover:from-pink-600 hover:to-red-500 text-white rounded-full p-2 shadow-md transition-all transform hover:scale-110 hover:-rotate-12">
                <ChevronLeft size={24}/>
              </button>
              
              {/* Pagination Dots */}
              <div className="swiper-reviews-pagination flex items-center justify-center mx-4"></div>
              
              {/* Next Navigation Arrow */}
              <button className="swiper-reviews-next bg-gradient-to-r from-pink-500 to-red-400 hover:from-pink-600 hover:to-red-500 text-white rounded-full p-2 shadow-md transition-all transform hover:scale-110 hover:-rotate-12">
                <ChevronRight size={24} />
              </button>
            </div>
          </div>

          {/* Desktop Grid with staggered animation (hidden on mobile) */}
          <div className="hidden md:grid home-reviews-grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
            {reviews.map((review, index) => (
              <div 
                key={review.id} 
                className="transform transition-all duration-700"
                style={{ 
                  transitionDelay: `${index * 200}ms`,
                  animation: `fadeInUp 0.8s ease-out ${index * 0.3}s both`
                }}
              >
                <ReviewCard {...review} />
              </div>
            ))}
          </div>
          
          {/* Optional: Add a "See More Reviews" button */}
          <div className="text-center mt-10 md:mt-16">
            <button className="inline-flex items-center bg-white border-2 border-pink-400 text-pink-600 hover:bg-pink-50 px-6 py-3 rounded-full font-medium transition-all hover:shadow-md hover:scale-105 group">
              <span>See More Reviews</span>
              <ChevronRight size={16} className="ml-2 transform group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>
      
      {/* Add custom styles for pagination */}
      <style >{`
        /* Custom pagination styles */
        .swiper-pagination-bullet {
          width: 10px;
          height: 10px;
          background-color: rgba(236, 72, 153, 0.3); /* Pink-500 with opacity */
          opacity: 1;
        }
        
        .swiper-pagination-bullet-active {
          background-color: rgb(236, 72, 153); /* Pink-500 */
          transform: scale(1.2);
        }
        
        .swiper-pagination-bullet-pink {
          width: 10px;
          height: 10px;
          background-color: rgba(236, 72, 153, 0.3); /* Pink-500 with opacity */
          opacity: 1;
        }
        
        .swiper-pagination-bullet-active-pink {
          background-color: rgb(236, 72, 153); /* Pink-500 */
          transform: scale(1.2);
        }
        
        .swiper-featured-pagination .swiper-pagination-bullet,
        .swiper-reviews-pagination .swiper-pagination-bullet {
          width: 10px;
          height: 10px;
          background-color: rgba(236, 72, 153, 0.3); /* Pink-500 with opacity */
          opacity: 1;
        }
        
        .swiper-featured-pagination .swiper-pagination-bullet-active,
        .swiper-reviews-pagination .swiper-pagination-bullet-active {
          background-color: rgb(236, 72, 153); /* Pink-500 */
          transform: scale(1.2);
        }
      `}</style>
    </div>
  );
};
