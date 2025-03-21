import React from 'react';
import { ShoppingCart } from 'lucide-react';

interface CartNotificationProps {
  show: boolean;
  totalItems: number;
  onViewCart: () => void;
}

export const CartNotification: React.FC<CartNotificationProps> = ({ show, totalItems, onViewCart }) => {
  if (!show) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-4 z-50 animate-fadeIn">
      <div className="flex items-center">
        <div className="bg-green-100 rounded-full p-2 mr-3">
          <ShoppingCart size={20} className="text-green-500" />
        </div>
        <div>
          <div className="font-medium text-gray-800">Item added to cart!</div>
          <div className="text-sm text-gray-500">
            You have {totalItems} {totalItems === 1 ? 'item' : 'items'} in your cart
          </div>
        </div>
        <button 
          onClick={onViewCart}
          className="ml-4 bg-pink-100 hover:bg-pink-200 text-pink-700 px-3 py-1 rounded-full text-xs font-medium"
        >
          View Cart
        </button>
      </div>
    </div>
  );
};