import React, { useState } from 'react';
import { ArrowLeft, Check, Upload } from 'lucide-react';
import { CartItem } from '../types';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db, storage } from '../Firebase'; // Assuming you have firebase config
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

interface CheckoutFormProps {
  cart: CartItem[];
  getTotalPrice: () => number;
  setActiveSection: (section: string) => void;
  clearCart: () => void; // You'll need to implement this in your app
}

type PaymentMethod = 'cod' | 'bank';

interface OrderFormData {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  paymentMethod: PaymentMethod;
  paymentScreenshot: File | null;
}

export const CheckoutForm: React.FC<CheckoutFormProps> = ({
  cart,
  getTotalPrice,
  setActiveSection,
  clearCart
}) => {
  const [formData, setFormData] = useState<OrderFormData>({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    paymentMethod: 'cod',
    paymentScreenshot: null
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, paymentScreenshot: e.target.files![0] }));
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Validate form
      if (!formData.fullName || !formData.email || !formData.phone || !formData.address) {
        throw new Error('Please fill all required fields');
      }
      
      if (formData.paymentMethod === 'bank' && !formData.paymentScreenshot) {
        throw new Error('Please upload payment screenshot for bank transfer');
      }
      
      // Upload payment screenshot if bank transfer
      let paymentScreenshotUrl = null;
      if (formData.paymentMethod === 'bank' && formData.paymentScreenshot) {
        const storageRef = ref(storage, `payment-screenshots/${Date.now()}-${formData.paymentScreenshot.name}`);
        const uploadResult = await uploadBytes(storageRef, formData.paymentScreenshot);
        paymentScreenshotUrl = await getDownloadURL(uploadResult.ref);
      }
      
      // Create order object
      const orderData = {
        customer: {
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address
        },
        items: cart.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          totalPrice: item.price * item.quantity
        })),
        payment: {
          method: formData.paymentMethod,
          screenshotUrl: paymentScreenshotUrl,
          total: getTotalPrice() + 5 // Including $5 shipping
        },
        status: 'pending',
        createdAt: Timestamp.now()
      };
      
      // Save to Firestore
      await addDoc(collection(db, 'orders'), orderData);
      
      // Clear cart and show success
      clearCart();
      setOrderPlaced(true);
      
      // Reset form
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        address: '',
        paymentMethod: 'cod',
        paymentScreenshot: null
      });
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (orderPlaced) {
    return (
      <div className="pt-24 pb-16 min-h-screen">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden p-8 text-center">
              <div className="w-20 h-20 mx-auto mb-6 flex items-center justify-center rounded-full bg-green-100">
                <Check size={32} className="text-green-500" />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">Order Placed Successfully!</h1>
              <p className="text-gray-600 mb-8">
                Thank you for your order. We've sent a confirmation email with all the details.
              </p>
              <button 
                onClick={() => setActiveSection('home')}
                className="bg-gradient-to-r from-pink-500 to-red-400 hover:from-pink-600 hover:to-red-500 text-white px-8 py-3 rounded-full font-medium transition-all"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="pt-24 pb-16 min-h-screen">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center mb-8">
            <button 
              onClick={() => setActiveSection('cart')}
              className="flex items-center text-pink-700 hover:text-red-500 transition-colors"
            >
              <ArrowLeft size={20} />
              <span className="ml-1">Back to Cart</span>
            </button>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-6 border-b border-pink-100">
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-pink-600 to-red-500 bg-clip-text text-transparent">
                Checkout
              </h1>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Customer Information</h2>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-300 focus:border-pink-500 outline-none transition"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-300 focus:border-pink-500 outline-none transition"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-300 focus:border-pink-500 outline-none transition"
                    required
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Shipping Address *</label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-300 focus:border-pink-500 outline-none transition"
                    required
                  ></textarea>
                </div>
                
                <div className="md:col-span-2 mt-4">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Payment Method</h2>
                </div>
                
                <div className="md:col-span-2">
                  <div className="flex flex-col space-y-3">
                    <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-pink-50 transition">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cod"
                        checked={formData.paymentMethod === 'cod'}
                        onChange={handleInputChange}
                        className="w-5 h-5 text-pink-600 focus:ring-pink-500"
                      />
                      <span className="ml-3">
                        <span className="block text-gray-800 font-medium">Cash on Delivery</span>
                        <span className="block text-gray-500 text-sm">Pay when you receive your order</span>
                      </span>
                    </label>
                    
                    <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-pink-50 transition">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="bank"
                        checked={formData.paymentMethod === 'bank'}
                        onChange={handleInputChange}
                        className="w-5 h-5 text-pink-600 focus:ring-pink-500"
                      />
                      <span className="ml-3">
                        <span className="block text-gray-800 font-medium">Bank Transfer</span>
                        <span className="block text-gray-500 text-sm">Make a payment to our bank account</span>
                      </span>
                    </label>
                  </div>
                </div>
                
                {formData.paymentMethod === 'bank' && (
                  <div className="md:col-span-2 mt-2">
                    <div className="bg-blue-50 p-4 rounded-lg mb-4">
                      <h3 className="font-medium text-blue-800 mb-2">Bank Account Details:</h3>
                      <p className="text-blue-700">Bank Name: Example Bank</p>
                      <p className="text-blue-700">Account Number: 1234567890</p>
                      <p className="text-blue-700">Account Name: Your Store Name</p>
                    </div>
                    
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Upload Payment Screenshot *
                    </label>
                    <div className="border-2 border-dashed border-gray-300 p-6 rounded-lg text-center">
                      <input
                        type="file"
                        id="paymentScreenshot"
                        name="paymentScreenshot"
                        onChange={handleFileChange}
                        accept="image/*"
                        className="hidden"
                      />
                      <label
                        htmlFor="paymentScreenshot"
                        className="flex flex-col items-center justify-center cursor-pointer"
                      >
                        <Upload size={28} className="text-gray-400 mb-2" />
                        {formData.paymentScreenshot ? (
                          <span className="text-sm text-gray-800 font-medium">
                            {formData.paymentScreenshot.name}
                          </span>
                        ) : (
                          <>
                            <span className="text-sm font-medium text-gray-700">
                              Click to upload payment proof
                            </span>
                            <span className="text-xs text-gray-500 mt-1">
                              PNG, JPG up to 5MB
                            </span>
                          </>
                        )}
                      </label>
                    </div>
                  </div>
                )}
                
                <div className="md:col-span-2 mt-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Order Summary</h2>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="space-y-2 mb-4">
                      {cart.map(item => (
                        <div key={item.id} className="flex justify-between">
                          <span className="text-gray-700">
                            {item.name} × {item.quantity}
                          </span>
                          <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="border-t border-gray-200 pt-4">
                      <div className="flex justify-between text-gray-700">
                        <span>Subtotal</span>
                        <span>${getTotalPrice().toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-gray-700 mt-2">
                        <span>Shipping</span>
                        <span>$5.00</span>
                      </div>
                      <div className="flex justify-between text-xl font-bold mt-4 text-gray-800">
                        <span>Total</span>
                        <span>${(getTotalPrice() + 5).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {error && (
                  <div className="md:col-span-2 bg-red-50 text-red-600 p-4 rounded-lg">
                    {error}
                  </div>
                )}
                
                <div className="md:col-span-2 mt-6">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-pink-500 to-red-400 hover:from-pink-600 hover:to-red-500 text-white py-4 rounded-lg font-medium transition-all disabled:opacity-70"
                  >
                    {isSubmitting ? 'Processing...' : 'Place Order'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
