import React, { useState } from 'react';
import { ArrowLeft, Heart, ShoppingCart, ChevronLeft, ChevronRight } from 'lucide-react';
import { Product } from '../types';

// Extended product type with multiple images
interface ExtendedProduct extends Product {
  images?: string[]; // Optional array of image URLs
}

interface ProductDetailsPageProps {
  product: ExtendedProduct | null;
  addToCart: (product: Product) => void;
  goBack: () => void;
  goToCart: () => void;
}

export const ProductDetailsPage: React.FC<ProductDetailsPageProps> = ({ 
  product, 
  addToCart, 
  goBack,
  goToCart 
}) => {
  // State to track the current image index
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!product) {
    return (
      <div className="pt-24 pb-16 min-h-screen">
        <div className="container mx-auto px-4 text-center">
          <p>Product not found</p>
          <button 
            onClick={goBack}
            className="mt-4 bg-pink-500 text-white py-2 px-4 rounded hover:bg-pink-600 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Create an array of images - use the default image if no images array is provided
  const productImages = product.images && product.images.length > 0 
    ? product.images 
    : [product.image];

  // Function to handle "Buy Now" action
  const handleBuyNow = () => {
    addToCart(product);
    goToCart();
  };

  // Functions to navigate between images
  const goToPreviousImage = () => {
    setCurrentImageIndex(prev => 
      prev === 0 ? productImages.length - 1 : prev - 1
    );
  };

  const goToNextImage = () => {
    setCurrentImageIndex(prev => 
      prev === productImages.length - 1 ? 0 : prev + 1
    );
  };

  // Function to directly go to a specific image
  const goToImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  // Handle back button click safely
  const handleBackClick = (e: React.MouseEvent) => {
    e.preventDefault();
    goBack();
  };

  return (
    <div className="pt-24 pb-16 min-h-screen">
      <div className="container mx-auto px-4">
        <button 
          onClick={handleBackClick}
          className="flex items-center text-pink-600 mb-8 hover:text-pink-700 transition-colors"
        >
          <ArrowLeft size={18} className="mr-2" />
          <span>Back to Products</span>
        </button>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="md:flex">
            {/* Product Image Gallery */}
            <div className="md:w-1/2">
              <div className="h-96 md:h-full overflow-hidden relative">
                {/* Main image */}
                <img 
                  src={productImages[currentImageIndex]} 
                  alt={`${product.name} - View ${currentImageIndex + 1}`} 
                  className="w-full h-full object-cover"
                />
                
                {/* Navigation arrows - only show if there are multiple images */}
                {productImages.length > 1 && (
                  <>
                    <button 
                      onClick={goToPreviousImage}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-70 p-2 rounded-full hover:bg-opacity-100 transition-all"
                      aria-label="Previous image"
                    >
                      <ChevronLeft size={24} className="text-gray-800" />
                    </button>
                    <button 
                      onClick={goToNextImage}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-70 p-2 rounded-full hover:bg-opacity-100 transition-all"
                      aria-label="Next image"
                    >
                      <ChevronRight size={24} className="text-gray-800" />
                    </button>
                  </>
                )}
                
                {/* Thumbnail navigation */}
                {productImages.length > 1 && (
                  <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
                    {productImages.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => goToImage(index)}
                        className={`w-3 h-3 rounded-full transition-all ${
                          index === currentImageIndex 
                            ? 'bg-pink-600 scale-110' 
                            : 'bg-white bg-opacity-70 hover:bg-opacity-100'
                        }`}
                        aria-label={`View image ${index + 1}`}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Thumbnail strip */}
              {productImages.length > 1 && (
                <div className="flex mt-4 mx-4 overflow-x-auto pb-2">
                  {productImages.map((img, index) => (
                    <div 
                      key={index}
                      onClick={() => goToImage(index)}
                      className={`cursor-pointer flex-shrink-0 w-20 h-20 mr-2 rounded-md overflow-hidden border-2 transition-all ${
                        index === currentImageIndex 
                          ? 'border-pink-500' 
                          : 'border-transparent hover:border-pink-300'
                      }`}
                    >
                      <img 
                        src={img} 
                        alt={`${product.name} thumbnail ${index + 1}`} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Product Information */}
            <div className="md:w-1/2 p-6 md:p-8">
              <div className="text-sm font-medium text-pink-500 mb-2">{product.category}</div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">{product.name}</h1>
              
              <div className="text-2xl font-bold text-pink-700 mb-6">${product.price}</div>
              
              <div className="border-t border-gray-200 pt-6 mb-6">
                <p className="text-gray-600 mb-4">
                  Handcrafted with love and attention to detail. Each item is unique and made with high-quality materials.
                </p>
                <ul className="text-gray-600 mb-6">
                  <li className="mb-2">• Ethically sourced materials</li>
                  <li className="mb-2">• Made to order</li>
                  <li className="mb-2">• Carefully packaged</li>
                  <li>• Shipped within 3-5 business days</li>
                </ul>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => addToCart(product)}
                  className="bg-pink-100 hover:bg-pink-200 text-pink-700 py-3 px-6 rounded-lg text-sm font-medium transition-colors flex items-center justify-center"
                >
                  <ShoppingCart size={18} className="mr-2" />
                  Add to Cart
                </button>
                <button 
                  onClick={handleBuyNow}
                  className="bg-pink-600 hover:bg-pink-700 text-white py-3 px-6 rounded-lg text-sm font-medium transition-colors"
                >
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
