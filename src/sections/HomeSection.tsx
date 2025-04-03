import React from 'react';
import { ShoppingBag, ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation, A11y } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
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
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden group transform transition-all hover:scale-105 max-w-[300px] mx-auto">
      <div className="w-full aspect-square overflow-hidden relative">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover absolute inset-0 group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300"></div>
      </div>
      <div className="p-4">
        <div className="flex justify-center text-yellow-400 mb-2">
          {[...Array(rating)].map((_, i) => (
            <Star key={i} size={16} fill="currentColor" className="mx-0.5" />
          ))}
        </div>
        <h4 className="font-semibold text-pink-800 text-center mb-2">{name}</h4>
        <p className="text-gray-600 text-center text-sm italic line-clamp-3">"{text}"</p>
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
                renderBullet: function (className) {
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
            <div className="flex items-center justify-center mt-4">
              {/* Previous Navigation Arrow */}
              <button className="swiper-custom-prev bg-gradient-to-r from-pink-500 to-red-400 hover:from-pink-600 hover:to-red-500 text-white rounded-full p-2 shadow-md transition-all transform hover:scale-105">
                <ChevronLeft size={24}/>
              </button>

              {/* Pagination Dots */}
              <div className="swiper-pink-pagination flex items-center justify-center mx-4 "></div>

              {/* Next Navigation Arrow */}
              <button className="swiper-custom-next bg-gradient-to-r from-pink-500 to-red-400 hover:from-pink-600 hover:to-red-500 text-white rounded-full p-2 shadow-md transition-all transform hover:scale-105">
                <ChevronRight size={24} />
              </button>
            </div>
          </div>

          {/* Desktop Grid (hidden on mobile) */}
          <div className="hidden md:grid home-featured-grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
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

      {/* Reviews Section */}
<section className="home-reviews-section py-10 md:py-16 px-4 bg-gradient-to-b from-white to-pink-50">
  <div className="container mx-auto">
    <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12 relative">
      <span className="bg-gradient-to-r from-pink-600 to-red-500 bg-clip-text text-transparent">Customer Reviews</span>
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
                renderBullet: function (className) {
                  return '<span class="' + className + '"></span>';
                }
              }}
              navigation={{
                prevEl: '.swiper-custom-prev',
                nextEl: '.swiper-custom-next'
              }}
              className="featured-mobile-slider"
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
        <button className="swiper-custom-prev bg-gradient-to-r from-pink-500 to-red-400 hover:from-pink-600 hover:to-red-500 text-white rounded-full p-2 shadow-md transition-all transform hover:scale-105">
          <ChevronLeft size={24}/>
        </button>
        
        {/* Pagination Dots */}
        <div className="swiper-pink-pagination flex items-center justify-center mx-4"></div>
        
        {/* Next Navigation Arrow */}
        <button className="swiper-custom-next bg-gradient-to-r from-pink-500 to-red-400 hover:from-pink-600 hover:to-red-500 text-white rounded-full p-2 shadow-md transition-all transform hover:scale-105">
          <ChevronRight size={24} />
        </button>
      </div>
    </div>

    {/* Desktop Grid (hidden on mobile) */}
    <div className="hidden md:grid home-reviews-grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
      {reviews.map((review) => (
        <ReviewCard key={review.id} {...review} />
      ))}
    </div>
  </div>
</section>
    </div>
  );
};  
