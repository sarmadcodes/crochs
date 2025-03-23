import React, { useEffect, useRef, useState } from "react";
import { Menu, X, ShoppingCart, Search } from "lucide-react";
import { SearchBar } from "./SearchBar";
import { Product } from "../types";

interface HeaderProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  scrolled: boolean;
  getTotalItems: () => number;
  products: Product[];
  onSelectProduct: (product: Product) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeSection,
  setActiveSection,
  mobileMenuOpen,
  setMobileMenuOpen,
  scrolled,
  getTotalItems,
  products,
  onSelectProduct
}) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [mobileSearchActive, setMobileSearchActive] = useState(false);

  // Focus input when search becomes active
  useEffect(() => {
    if (mobileSearchActive && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  }, [mobileSearchActive]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (mobileMenuOpen && menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [mobileMenuOpen, setMobileMenuOpen]);

  return (
    <header
      className={`fixed top-0 w-full transition-all duration-500 z-50 ${
        scrolled ? "bg-white/90 shadow-md" : "bg-white"
      }`}
    >
      {/* Mobile Search Bar (Full Width) - Only show when search is active */}
      {mobileSearchActive && (
        <div className="md:hidden w-full bg-white py-3 px-4 animate-fadeIn flex items-center">
          <SearchBar 
            products={products} 
            onSelectProduct={(product) => {
              onSelectProduct(product);
              setMobileSearchActive(false);
            }}
            inputRef={searchInputRef}
            autoFocus={true}
            // className="flex-grow"
          />
          <button
            onClick={() => setMobileSearchActive(false)}
            className="ml-2 text-pink-700"
          >
            <X size={20} />
          </button>
        </div>
      )}
      
      {/* Only show the main header when search is not active on mobile */}
      {(!mobileSearchActive || window.innerWidth >= 768) && (
        <div className="container mx-auto px-4 py-4 flex items-center">
          {/* Mobile Layout - Three columns with equal width for perfect centering */}
          <div className="md:hidden w-full grid grid-cols-3 items-center">
            {/* Left Column - Hamburger */}
            <div className="flex justify-start">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setMobileMenuOpen(!mobileMenuOpen);
                }}
                className="text-pink-700"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
            
            {/* Center Column - Logo */}
            <div className="flex justify-center">
              <div
                onClick={() => setActiveSection("home")}
                className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-600 cursor-pointer animate-glitter transition-all duration-300 text-2xl"
              >
                uzucrochets
              </div>
            </div>
            
            {/* Right Column - Search & Cart */}
            <div className="flex justify-end items-center space-x-3">
              <button
                onClick={() => setMobileSearchActive(true)}
                className="text-pink-700 p-2"
              >
                <Search size={20} />
              </button>
              
              <div className="relative">
                <button
                  onClick={() => setActiveSection("cart")}
                  className={`${
                    activeSection === "cart"
                      ? "bg-gradient-to-r from-red-500 to-red-600"
                      : "bg-gradient-to-r from-pink-500 to-red-400 hover:from-pink-600 hover:to-red-500"
                  } text-white p-2 rounded-full transition-all transform hover:scale-105 relative`}
                >
                  <ShoppingCart size={20} />
                  {getTotalItems() > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {getTotalItems()}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden md:flex w-full justify-between items-center">
            {/* Logo */}
            <div
              onClick={() => setActiveSection("home")}
              className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-600 cursor-pointer animate-glitter transition-all duration-300 text-2xl"
            >
              uzucrochets
            </div>

            {/* Desktop Navigation */}
            <nav className="flex items-center space-x-6">
              {["home", "crochets"].map((section) => (
                <button
                  key={section}
                  onClick={() => setActiveSection(section === "crochets" ? "products" : section)}
                  className={`${
                    (section === "crochets" && activeSection === "products") || activeSection === section
                      ? "text-red-500" 
                      : "text-pink-700"
                  } hover:text-red-400 font-medium transition`}
                >
                  {section.charAt(0).toUpperCase() + section.slice(1)}
                </button>
              ))}
              
              {/* Desktop Search */}
              <SearchBar 
                products={products} 
                onSelectProduct={onSelectProduct} 
              />
              
              {/* Desktop Cart Button */}
              <div className="relative">
                <button
                  onClick={() => setActiveSection("cart")}
                  className={`${
                    activeSection === "cart"
                      ? "bg-gradient-to-r from-red-500 to-red-600"
                      : "bg-gradient-to-r from-pink-500 to-red-400 hover:from-pink-600 hover:to-red-500"
                  } text-white p-2 rounded-full transition-all transform hover:scale-105 relative`}
                >
                  <ShoppingCart size={20} />
                  {getTotalItems() > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {getTotalItems()}
                    </span>
                  )}
                </button>
              </div>
            </nav>
          </div>
        </div>
      )}

      {/* Mobile Menu */}
      {mobileMenuOpen && !mobileSearchActive && (
        <div
          ref={menuRef}
          className="md:hidden bg-white/95 py-4 shadow-lg animate-fadeIn fixed top-[65px] left-0 w-full"
        >
          <div className="container mx-auto px-4 flex flex-col space-y-4">
            {["home", "crochets"].map((section) => (
              <button
                key={section}
                onClick={() => {
                  setActiveSection(section === "crochets" ? "products" : section);
                  setMobileMenuOpen(false);
                }}
                className={`${
                  (section === "crochets" && activeSection === "products") || activeSection === section
                    ? "text-red-500" 
                    : "text-pink-700"
                } text-lg font-medium text-left py-2 hover:text-red-400 transition`}
              >
                {section.charAt(0).toUpperCase() + section.slice(1)}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Glitter Animation */}
      <style>
        {`
          @keyframes glitter {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }

          .animate-glitter {
            background-size: 300% 300%;
            animation: glitter 2.5s infinite linear;
            background-image: linear-gradient(45deg, 
              #ff3366, /* Bright Red-Pink */ 
              #ff66b2, /* Deep Pink */ 
              #cc33ff, /* Purple */ 
              #ff66b2, /* Deep Pink */ 
              #ff3366 /* Bright Red-Pink */
            );
          }

          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }

          .animate-fadeIn {
            animation: fadeIn 0.3s ease-in-out;
          }
        `}
      </style>
    </header>
  );
};
