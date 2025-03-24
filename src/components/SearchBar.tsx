import React, { useState, useRef, RefObject, useEffect } from "react";
import { Search } from "lucide-react";
import { Product } from "../types";

interface SearchBarProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  inputRef?: RefObject<HTMLInputElement>;
  autoFocus?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  products,
  onSelectProduct,
  inputRef,
  autoFocus = false
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const defaultInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  
  // Use provided inputRef or default to our local one
  const actualInputRef = inputRef || defaultInputRef;

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // For desktop: toggle expanded state on click
  const toggleExpanded = () => {
    if (window.innerWidth >= 768) {
      setIsExpanded(!isExpanded);
      if (!isExpanded) {
        setTimeout(() => actualInputRef.current?.focus(), 300);
      }
    }
  };

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current && 
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setShowResults(false);
        if (window.innerWidth >= 768) {
          setIsExpanded(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div 
      className="relative w-full md:w-auto" 
      ref={searchContainerRef}
    >
      <div className={`relative flex items-center ${isExpanded ? 'md:w-64' : 'md:w-10'} transition-all duration-300`}>
        {/* Desktop view: Collapsible search */}
        <div 
          className={`hidden md:flex items-center rounded-full border border-pink-300 overflow-hidden transition-all duration-300 ${
            isExpanded ? 'pl-10 pr-4 py-2 w-full' : 'w-10 h-10 justify-center bg-pink-50 hover:bg-pink-100'
          }`}
          onClick={!isExpanded ? toggleExpanded : undefined}
        >
          <div className={`${isExpanded ? 'absolute left-3' : ''} text-pink-500 transition-all duration-300`}>
            <Search size={16} className={isExpanded ? '' : 'animate-bounce-subtle'} />
          </div>
          
          <input
            ref={isExpanded ? actualInputRef : null}
            type="text"
            placeholder="Search Crochets..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setShowResults(e.target.value.length > 0);
            }}
            onFocus={() => setShowResults(searchTerm.length > 0)}
            className={`${
              isExpanded ? 'w-full opacity-100' : 'w-0 opacity-0'
            } focus:outline-none transition-all duration-300 text-sm bg-transparent`}
          />
          
          {isExpanded && searchTerm && (
            <button
              onClick={() => {
                setSearchTerm("");
                setShowResults(false);
                actualInputRef.current?.focus();
              }}
              className="text-pink-400 hover:text-pink-600 ml-1 transition-colors animate-fadeIn"
            >
              <X size={14} />
            </button>
          )}
        </div>
        
        {/* Mobile view: Full width search bar */}
        <div className="md:hidden relative w-full">
          <input
            ref={actualInputRef}
            type="text"
            placeholder="Search Crochets..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setShowResults(e.target.value.length > 0);
            }}
            onFocus={() => setShowResults(searchTerm.length > 0)}
            autoFocus={autoFocus}
            className="w-full pl-10 pr-4 py-2 text-sm border border-pink-300 rounded-full focus:outline-none focus:ring-2 focus:ring-pink-400 transition-all"
          />
          <div className="absolute left-3 top-2.5 text-pink-500">
            <Search size={16} />
          </div>
          
          {searchTerm && (
            <button
              onClick={() => {
                setSearchTerm("");
                setShowResults(false);
                actualInputRef.current?.focus();
              }}
              className="absolute right-3 top-2.5 text-pink-400 hover:text-pink-600 transition-colors"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>
      
      {showResults && filteredProducts.length > 0 && (
        <div className="absolute z-50 mt-1 w-full bg-white rounded-lg shadow-lg max-h-60 overflow-auto animate-growDown">
          {filteredProducts.map((product, index) => (
            <div
              key={product.id}
              onClick={() => {
                onSelectProduct(product);
                setSearchTerm("");
                setShowResults(false);
                if (window.innerWidth >= 768) {
                  setIsExpanded(false);
                }
              }}
              className={`p-2 hover:bg-pink-50 cursor-pointer border-b border-pink-100 last:border-b-0 flex items-center animate-fadeIn`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* Thumbnail image */}
              <div className="flex-shrink-0 mr-2">
                {product.image ? (
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-10 h-10 object-cover rounded"
                  />
                ) : (
                  <div className="w-10 h-10 bg-pink-100 rounded flex items-center justify-center">
                    <span className="text-pink-500 text-xs">No img</span>
                  </div>
                )}
              </div>
              <div>
                <div className="font-medium text-pink-800">{product.name}</div>
                <div className="text-xs text-pink-600">${product.price.toFixed(2)}</div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Additional animations */}
      <style>
        {`
          @keyframes growDown {
            0% {
              opacity: 0;
              transform: scaleY(0);
              transform-origin: top;
            }
            100% {
              opacity: 1;
              transform: scaleY(1);
              transform-origin: top;
            }
          }
          
          .animate-growDown {
            animation: growDown 0.3s ease-in-out forwards;
          }
          
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          
          .animate-fadeIn {
            animation: fadeIn 0.3s ease-in-out forwards;
          }
          
          @keyframes bounce-subtle {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-2px); }
          }
          
          .animate-bounce-subtle {
            animation: bounce-subtle 2s infinite ease-in-out;
          }
        `}
      </style>
    </div>
  );
};

// Add the X icon component
const X = ({ size }: { size: number }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);
