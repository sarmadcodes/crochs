import React from 'react';
import { ArrowLeft, Heart, ShoppingCart } from 'lucide-react';
import { Product } from '../types';

interface ProductDetailsPageProps {
  product: Product | null;
  addToCart: (product: Product) => void;
  goBack: () => void;
  goToCart: () => void; // New prop to navigate to cart/checkout
}

export const ProductDetailsPage: React.FC<ProductDetailsPageProps> = ({ 
  product, 
  addToCart, 
  goBack,
  goToCart 
}) => {
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

  // Function to handle "Buy Now" action
  const handleBuyNow = () => {
    addToCart(product); // First add to cart
    goToCart(); // Then navigate to cart/checkout
  };

  return (
    <div className="pt-24 pb-16 min-h-screen">
      <div className="container mx-auto px-4">
        <button 
          onClick={goBack}
          className="flex items-center text-pink-600 mb-8 hover:text-pink-700 transition-colors"
        >
          <ArrowLeft size={18} className="mr-2" />
          <span>Back to Products</span>
        </button>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="md:flex">
            {/* Product Image */}
            <div className="md:w-1/2">
              <div className="h-96 md:h-full overflow-hidden relative">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4">
                  <button className="bg-white/80 hover:bg-white p-3 rounded-full text-pink-500 hover:text-red-500 transition-colors">
                    <Heart size={24} />
                  </button>
                </div>
              </div>
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