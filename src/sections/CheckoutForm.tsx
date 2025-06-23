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

type PaymentMethod = 'cod' | 'sadapay' | 'easypaisa' | 'bank';

interface OrderFormData {
  fullName: string;
  email: string;
  phone: string;
  houseNumber: string;
  streetNumber: string;
  areaDetail: string;
  sectorBlock: string;
  city: string;
  postalCode: string;
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
    houseNumber: '',
    streetNumber: '',
    areaDetail: '',
    sectorBlock: '',
    city: '',
    postalCode: '',
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
  
  const getPaymentDetails = () => {
    switch (formData.paymentMethod) {
      case 'sadapay':
        return {
          title: 'SadaPay Account Details:',
          details: [
            'SadaPay Number: +92 300 1234567',
            'Account Name: Your Store Name',
            'Send payment and upload screenshot'
          ]
        };
      case 'easypaisa':
        return {
          title: 'EasyPaisa Account Details:',
          details: [
            'EasyPaisa Number: +92 300 1234567',
            'Account Name: Your Store Name',
            'Send payment and upload screenshot'
          ]
        };
      case 'bank':
        return {
          title: 'Bank Account Details:',
          details: [
            'Bank Name: Meezan Bank',
            'Account Number: 1234567890123456',
            'Account Title: Your Store Name',
            'IBAN: PK12MEZN0001234567890123'
          ]
        };
      default:
        return null;
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Validate form
      if (!formData.fullName || !formData.email || !formData.phone || !formData.houseNumber || !formData.streetNumber || !formData.areaDetail || !formData.sectorBlock || !formData.city) {
        throw new Error('Please fill all required fields');
      }
      
      // Validate Pakistani phone number format
      const phoneRegex = /^(\+92|0)?3[0-9]{2}[0-9]{7}$/;
      if (!phoneRegex.test(formData.phone.replace(/\s+/g, ''))) {
        throw new Error('Please enter a valid Pakistani mobile number (e.g., 03001234567)');
      }
      
      if (['sadapay', 'easypaisa', 'bank'].includes(formData.paymentMethod) && !formData.paymentScreenshot) {
        throw new Error('Please upload payment screenshot for online payment');
      }
      
      // Upload payment screenshot if online payment
      let paymentScreenshotUrl = null;
      if (['sadapay', 'easypaisa', 'bank'].includes(formData.paymentMethod) && formData.paymentScreenshot) {
        const storageRef = ref(storage, `payment-screenshots/${Date.now()}-${formData.paymentScreenshot.name}`);
        const uploadResult = await uploadBytes(storageRef, formData.paymentScreenshot);
        paymentScreenshotUrl = await getDownloadURL(uploadResult.ref);
      }
      
      // Construct complete address from individual fields
      const completeAddress = [
        `House # ${formData.houseNumber}`,
        `Street # ${formData.streetNumber}`,
        formData.areaDetail,
        formData.sectorBlock
      ].filter(Boolean).join(', ');
      
      // Create order object
      const orderData = {
        customer: {
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          address: completeAddress,
          city: formData.city,
          postalCode: formData.postalCode || 'Not provided'
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
          total: getTotalPrice() + 200 // Including Rs. 200 shipping
        },
        status: 'pending',
        createdAt: Timestamp.now()
      };
      
      // Save to Firestore
      await addDoc(collection(db, 'orders'), orderData);
      
      // Clear cart and show success
      clearCart();
      setOrderPlaced(true);
      
      // Scroll to top to show success message
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      // Reset form
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        houseNumber: '',
        streetNumber: '',
        areaDetail: '',
        sectorBlock: '',
        city: '',
        postalCode: '',
        paymentMethod: 'cod',
        paymentScreenshot: null
      });
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      // Scroll to error message
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (orderPlaced) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-8 text-center animate-fade-in">
          <div className="w-20 h-20 mx-auto mb-6 flex items-center justify-center rounded-full bg-green-100">
            <Check size={32} className="text-green-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Order Placed Successfully!</h1>
          <p className="text-gray-600 mb-8">
            Thank you for your order. We've sent a confirmation email with all the details.
          </p>
          <button 
            onClick={() => {
              setOrderPlaced(false);
              setActiveSection('home');
            }}
            className="bg-gradient-to-r from-pink-500 to-red-400 hover:from-pink-600 hover:to-red-500 text-white px-8 py-3 rounded-full font-medium transition-all"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="pt-36 pb-16 min-h-screen">
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
                    placeholder="Ahmad Ali"
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
                    placeholder="ahmad@example.com"
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
                    placeholder="03001234567"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">Pakistani mobile number format</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-300 focus:border-pink-500 outline-none transition"
                    placeholder="Karachi"
                    required
                  />
                </div>
                
                <div className="md:col-span-2 mt-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Address Details</h3>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">House Number *</label>
                  <input
                    type="text"
                    name="houseNumber"
                    value={formData.houseNumber}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-300 focus:border-pink-500 outline-none transition"
                    placeholder="123"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Street Number *</label>
                  <input
                    type="text"
                    name="streetNumber"
                    value={formData.streetNumber}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-300 focus:border-pink-500 outline-none transition"
                    placeholder="456"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Area Detail *</label>
                  <input
                    type="text"
                    name="areaDetail"
                    value={formData.areaDetail}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-300 focus:border-pink-500 outline-none transition"
                    placeholder="Gulshan-e-Iqbal"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sector/Block *</label>
                  <input
                    type="text"
                    name="sectorBlock"
                    value={formData.sectorBlock}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-300 focus:border-pink-500 outline-none transition"
                    placeholder="Block 13-A"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
                  <input
                    type="text"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-300 focus:border-pink-500 outline-none transition"
                    placeholder="75400 (Optional)"
                  />
                  <p className="text-xs text-gray-500 mt-1">Optional field</p>
                </div>
                
                <div className="md:col-span-2 mt-4">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">Payment Method</h2>
                </div>
                
                <div className="md:col-span-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
                        value="sadapay"
                        checked={formData.paymentMethod === 'sadapay'}
                        onChange={handleInputChange}
                        className="w-5 h-5 text-pink-600 focus:ring-pink-500"
                      />
                      <span className="ml-3">
                        <span className="block text-gray-800 font-medium">SadaPay</span>
                        <span className="block text-gray-500 text-sm">Online payment</span>
                      </span>
                    </label>
                    
                    <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-pink-50 transition">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="easypaisa"
                        checked={formData.paymentMethod === 'easypaisa'}
                        onChange={handleInputChange}
                        className="w-5 h-5 text-pink-600 focus:ring-pink-500"
                      />
                      <span className="ml-3">
                        <span className="block text-gray-800 font-medium">EasyPaisa</span>
                        <span className="block text-gray-500 text-sm">Online payment</span>
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
                        <span className="block text-gray-500 text-sm">Transfer to bank account</span>
                      </span>
                    </label>
                  </div>
                </div>
                
                {['sadapay', 'easypaisa', 'bank'].includes(formData.paymentMethod) && (
                  <div className="md:col-span-2 mt-2">
                    {(() => {
                      const paymentDetails = getPaymentDetails();
                      return paymentDetails ? (
                        <div className="bg-blue-50 p-4 rounded-lg mb-4">
                          <h3 className="font-medium text-blue-800 mb-2">{paymentDetails.title}</h3>
                          {paymentDetails.details.map((detail, index) => (
                            <p key={index} className="text-blue-700">{detail}</p>
                          ))}
                        </div>
                      ) : null;
                    })()}
                    
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
                          <span className="font-medium">Rs. {(item.price * item.quantity).toFixed(0)}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="border-t border-gray-200 pt-4">
                      <div className="flex justify-between text-gray-700">
                        <span>Subtotal</span>
                        <span>Rs. {getTotalPrice().toFixed(0)}</span>
                      </div>
                      <div className="flex justify-between text-gray-700 mt-2">
                        <span>Shipping</span>
                        <span>Rs. 200</span>
                      </div>
                      <div className="flex justify-between text-xl font-bold mt-4 text-gray-800">
                        <span>Total</span>
                        <span>Rs. {(getTotalPrice() + 200).toFixed(0)}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {error && (
                  <div className="md:col-span-2 bg-red-50 text-red-600 p-4 rounded-lg border border-red-200">
                    <strong>Error:</strong> {error}
                  </div>
                )}
                
                <div className="md:col-span-2 mt-6">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-pink-500 to-red-400 hover:from-pink-600 hover:to-red-500 text-white py-4 rounded-lg font-medium transition-all disabled:opacity-70 disabled:cursor-not-allowed"
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
