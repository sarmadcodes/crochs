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
      
      {/* Featured Section with Enhanced Mobile Slider */}
      <section className="home-featured-section py-10 md:py-16 px-4 bg-gradient-to-b from-pink-100 to-white relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-16 h-16 md:w-32 md:h-32 bg-pink-200 rounded-full opacity-40 -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-24 h-24 md:w-48 md:h-48 bg-red-100 rounded-full opacity-50 translate-x-1/3 translate-y-1/3"></div>
        
        <div className="container mx-auto relative z-10 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12 relative inline-block">
            <span className="bg-gradient-to-r from-pink-600 to-red-500 bg-clip-text text-transparent">Featured Creations</span>
            <span className="block w-full h-1 bg-gradient-to-r from-pink-500 to-red-400 mt-3 md:mt-4 rounded-full"></span>
            <span className="absolute -right-3 -top-3 w-8 h-8 bg-pink-100 rounded-full opacity-70 animate-pulse"></span>
          </h2>
          
          {/* Mobile Slider (visible only on mobile) */}
          <div className="block md:hidden relative">
            <Swiper
              modules={[Pagination, Navigation, A11y, EffectCoverflow, Autoplay]}
              effect="coverflow"
              coverflowEffect={{
                rotate: 30,
                stretch: 0,
                depth: 100,
                modifier: 1,
                slideShadows: true
              }}
              spaceBetween={0}
              slidesPerView={1.2}
              centeredSlides={false}
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
                  <ProductCard
                    product={product}
                    onAddToCart={addToCart}
                    onViewDetails={() => onViewProductDetails ? onViewProductDetails(product) : setActiveSection('products')}
                    isFeature={true}
                    className="home-featured-card text-left"
                  />
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Navigation Container */}
            <div className="flex items-center justify-center mt-4">
              {/* Previous Navigation Arrow */}
              <button className="swiper-featured-prev bg-gradient-to-r from-pink-500 to-red-400 hover:from-pink-600 hover:to-red-500 text-white rounded-full p-2 shadow-md transition-all transform hover:scale-110 hover:rotate-12">
                <ChevronLeft size={24}/>
              </button>

              {/* Pagination Dots */}
              <div className="swiper-featured-pagination flex items-center justify-center mx-4"></div>

              {/* Next Navigation Arrow */}
              <button className="swiper-featured-next bg-gradient-to-r from-pink-500 to-red-400 hover:from-pink-600 hover:to-red-500 text-white rounded-full p-2 shadow-md transition-all transform hover:scale-110 hover:rotate-12">
                <ChevronRight size={24} />
              </button>
            </div>
          </div>

          {/* Desktop Grid (hidden on mobile) - Left aligned products */}
          <div className="hidden md:grid home-featured-grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
            {products.slice(0, 3).map((product, index) => (
              <div 
                key={product.id} 
                className="transform transition-all duration-700" 
                style={{ 
                  transitionDelay: `${index * 150}ms`,
                  animation: `fadeInUp 0.8s ease-out ${index * 0.2}s both`
                }}
              >
                <ProductCard
                  product={product}
                  onAddToCart={addToCart}
                  onViewDetails={() => onViewProductDetails ? onViewProductDetails(product) : setActiveSection('products')}
                  isFeature={true}
                  className="home-featured-card hover:shadow-xl transition-shadow duration-300 text-left"
                />
              </div>
            ))}
          </div>
          
          <div className="text-center mt-8 md:mt-12">
            <button
              onClick={() => setActiveSection('products')}
              className="border-2 border-pink-500 text-pink-600 hover:bg-pink-50 px-6 sm:px-8 py-2 sm:py-3 rounded-full font-medium transition-all hover:shadow-md hover:scale-105"
            >
              View All Products
            </button>
          </div>
        </div>
      </section>

      {/* Enhanced Reviews Section */}
      <section className="home-reviews-section py-12 md:py-20 px-4 bg-gradient-to-b from-white to-pink-50 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-1/4 left-0 w-32 h-32 bg-pink-100 rounded-full opacity-60 -translate-x-1/2"></div>
        <div className="absolute bottom-1/4 right-0 w-40 h-40 bg-red-50 rounded-full opacity-70 translate-x-1/2"></div>
        <div className="absolute top-3/4 left-1/4 w-16 h-16 bg-pink-200 rounded-full opacity-40"></div>
        
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
