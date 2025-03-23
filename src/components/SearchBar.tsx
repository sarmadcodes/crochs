import React, { useState, useRef, RefObject } from "react";
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
  const defaultInputRef = useRef<HTMLInputElement>(null);
  
  // Use provided inputRef or default to our local one
  const actualInputRef = inputRef || defaultInputRef;

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative w-full md:w-64">
      <div className="relative">
        <input
          ref={actualInputRef}
          type="text"
          placeholder="Search crochets..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setShowResults(e.target.value.length > 0);
          }}
          onFocus={() => setShowResults(searchTerm.length > 0)}
          onBlur={() => setTimeout(() => setShowResults(false), 200)}
          autoFocus={autoFocus}
          className="w-full pl-10 pr-4 py-2 text-sm border border-pink-300 rounded-full focus:outline-none focus:ring-2 focus:ring-pink-400 transition-all"
        />
        <div className="absolute left-3 top-2.5 text-pink-500">
          <Search size={16} />
        </div>
      </div>
      
      {showResults && filteredProducts.length > 0 && (
        <div className="absolute z-50 mt-1 w-full bg-white rounded-lg shadow-lg max-h-60 overflow-auto">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              onClick={() => {
                onSelectProduct(product);
                setSearchTerm("");
                setShowResults(false);
              }}
              className="p-2 hover:bg-pink-50 cursor-pointer border-b border-pink-100 last:border-b-0 flex items-center"
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
    </div>
  );
};
