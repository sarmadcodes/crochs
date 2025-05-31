import React from 'react';
import { ChevronLeft, ShoppingBag, Trash2 } from 'lucide-react';
import { CartItem } from '../types';

interface CartSectionProps {
  cart: CartItem[];
  setActiveSection: (section: string) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  removeFromCart: (productId: number) => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const CartSection: React.FC<CartSectionProps> = ({
  cart,
  setActiveSection,
  updateQuantity,
  removeFromCart,
  getTotalItems,
  getTotalPrice
}) => {
  return (
    <div className="pt-24 pb-16 min-h-screen">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center mb-8">
            <button 
              onClick={() => setActiveSection(cart.length > 0 ? 'products' : 'home')}
              className="flex items-center text-pink-700 hover:text-red-500 transition-colors"
            >
              <ChevronLeft size={20} />
              <span className="ml-1">Continue Shopping</span>
            </button>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-6 border-b border-pink-100">
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-pink-600 to-red-500 bg-clip-text text-transparent">
                Your Shopping Cart
              </h1>
            </div>
            
            {cart.length === 0 ? (
              <div className="py-16 text-center">
                <div className="w-20 h-20 mx-auto mb-4 flex items-center justify-center rounded-full bg-pink-50">
                  <ShoppingBag size={32} className="text-pink-400" />
                </div>
                <h2 className="text-xl font-medium text-gray-800 mb-2">Your cart is empty</h2>
                <p className="text-gray-500 mb-6">Looks like you haven't added anything to your cart yet.</p>
                <button 
                  onClick={() => setActiveSection('products')}
                  className="bg-gradient-to-r from-pink-500 to-red-400 hover:from-pink-600 hover:to-red-500 text-white px-6 py-2 rounded-full font-medium transition-all"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              <>
                <div className="p-6">
                  <div className="hidden md:grid md:grid-cols-12 text-sm font-medium text-gray-500 mb-4">
                    <div className="md:col-span-6">Product</div>
                    <div className="md:col-span-2 text-center">Price</div>
                    <div className="md:col-span-2 text-center">Quantity</div>
                    <div className="md:col-span-2 text-center">Total</div>
                  </div>
                  
                  <div className="space-y-6">
                    {cart.map(item => (
                      <div key={item.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 py-4 border-b border-gray-100">
                        <div className="md:col-span-6">
                          <div className="flex">
                            <div className="w-20 h-20 rounded overflow-hidden">
                              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="ml-4 flex flex-col justify-center">
                              <h3 className="font-medium text-gray-800">{item.name}</h3>
                              <div className="text-xs text-pink-500">{item.category}</div>
                              <div className="md:hidden mt-1 text-sm text-gray-800">Rs {item.price}</div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="md:col-span-2 flex items-center justify-center">
                          <div className="hidden md:block font-medium text-gray-800">
                            Rs {item.price}
                          </div>
                        </div>
                        
                        <div className="md:col-span-2 flex items-center justify-center">
                          <div className="flex items-center border border-gray-200 rounded-lg">
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-red-500"
                            >
                              -
                            </button>
                            <span className="w-10 text-center">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-green-500"
                            >
                              +
                            </button>
                          </div>
                        </div>
                        
                        <div className="md:col-span-2 flex items-center justify-between md:justify-center">
                          <div className="font-medium text-gray-800">
                            Rs {(item.price * item.quantity).toFixed(2)}
                          </div>
                          <button 
                            onClick={() => removeFromCart(item.id)}
                            className="text-gray-400 hover:text-red-500 md:ml-4"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="p-6 bg-pink-50">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:order-2">
                      <div className="bg-white p-5 rounded-lg shadow-sm space-y-4">
                        <h3 className="text-lg font-medium text-gray-800 pb-3 border-b border-gray-100">Order Summary</h3>
                        
                        <div className="flex justify-between">
                          <span className="text-gray-600">Subtotal ({getTotalItems()} items)</span>
                          <span className="font-medium">Rs {getTotalPrice().toFixed(2)}</span>
                        </div>
                        
                        <div className="flex justify-between">
                          <span className="text-gray-600">Shipping</span>
                          <span className="font-medium">Rs 200.00</span>
                        </div>
                        
                        <div className="pt-3 border-t border-gray-100">
                          <div className="flex justify-between text-lg font-medium">
                            <span>Total</span>
                            <span className="text-pink-700">Rs {(getTotalPrice() + 200).toFixed(2)}</span>
                          </div>
                        </div>
                        
                        <button 
                          onClick={() => setActiveSection('checkout')}
                          className="w-full bg-gradient-to-r from-pink-500 to-red-400 hover:from-pink-600 hover:to-red-500 text-white py-3 rounded-md font-medium transition-all mt-3">
                          Proceed to Checkout
                        </button>
                      </div>
                    </div>
                    
                    <div>
                      <div className="bg-white p-5 rounded-lg shadow-sm">
  <h3 className="text-lg font-medium text-gray-800 mb-4">We Accept</h3>
  <div className="flex space-x-3">
    <a  target="_blank" rel="noopener noreferrer" className="w-12 h-8 bg-gray-50 rounded border border-gray-200 hover:bg-gray-100 hover:border-gray-300 transition-all duration-200 flex items-center justify-center">
      <img src="https://platform.vox.com/wp-content/uploads/sites/2/chorus/uploads/chorus_asset/file/13674554/Mastercard_logo.jpg?quality=90&strip=all&crop=0,16.666666666667,100,66.666666666667" alt="Mastercard" className="w-20 h-13 object-contain" />
    </a>
    <a  target="_blank" rel="noopener noreferrer" className="w-12 h-8 bg-gray-50 rounded border border-gray-200 hover:bg-gray-100 hover:border-gray-300 transition-all duration-200 flex items-center justify-center">
      <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS0B7JoiqLbyOh1fa0QS8cFuL_6dShzxz5LUA&s" alt="SadaPay" className="w-20 h-13 object-contain" />
    </a>
    <a  target="_blank" rel="noopener noreferrer" className="w-12 h-8 bg-gray-50 rounded border border-gray-200 hover:bg-gray-100 hover:border-gray-300 transition-all duration-200 flex items-center justify-center">
      <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQO57H7SUpRm3rEMqjutE3j0dJVo0R3dsc39QWuEa3bH8wf7QjUJ8IDhAifEb3j-A8uTAo&usqp=CAU" alt="EasyPaisa" className="w-20 h-13 object-contain" />
    </a>
    <a  target="_blank" rel="noopener noreferrer" className="w-12 h-8 bg-gray-50 rounded border border-gray-200 hover:bg-gray-100 hover:border-gray-300 transition-all duration-200 flex items-center justify-center">
      <img src="https://seeklogo.com/images/B/bank-transfer-logo-291DE7CDB2-seeklogo.com.png" alt="Bank Transfer" className="w-20 h-13 object-contain" />
    </a>
  </div>
</div>
                      
                      <div className="bg-white p-5 rounded-lg shadow-sm mt-4">
                        <h3 className="text-lg font-medium text-gray-800 mb-4">Need Help?</h3>
                        <p className="text-gray-600 text-sm">Have questions or need assistance with your order?</p>
                        <button className="mt-3 text-pink-600 hover:text-red-500 text-sm font-medium flex items-center">
                          Contact Support <ChevronLeft size={16} className="ml-1 transform rotate-180" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
