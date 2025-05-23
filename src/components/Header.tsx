import React, { useEffect, useRef, useState } from "react";
import { Menu, X, ShoppingCart, Search, Heart, Settings } from "lucide-react";
import { SearchBar } from "./SearchBar";
import { Product } from "../types";

interface HeaderProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (isOpen: boolean) => void;
  scrolled: boolean;
  getTotalItems: () => number;
  products: Product[];
  onSelectProduct: (product: Product) => void;
  favorites: number[];
}

export const Header: React.FC<HeaderProps> = ({
  activeSection,
  setActiveSection,
  mobileMenuOpen,
  setMobileMenuOpen,
  scrolled,
  getTotalItems,
  products,
  onSelectProduct,
  favorites
}) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [mobileSearchActive, setMobileSearchActive] = useState(false);
  const [showAdminAccess, setShowAdminAccess] = useState(false);

  // Admin access toggle with secret pattern - triple click on logo
  const logoClickCount = useRef(0);
  const logoClickTimer = useRef<NodeJS.Timeout | null>(null);

  const handleLogoClick = () => {
    setActiveSection("home");
    
    // Admin access logic - track triple clicks
    logoClickCount.current += 1;
    
    if (logoClickTimer.current) {
      clearTimeout(logoClickTimer.current);
    }
    
    logoClickTimer.current = setTimeout(() => {
      if (logoClickCount.current >= 3) {
        setShowAdminAccess(prev => !prev);
      }
      logoClickCount.current = 0;
    }, 500);
  };

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

  // Admin access key combination (Shift + A)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.shiftKey && e.key === 'A') {
        setShowAdminAccess(prev => !prev);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <header
      className={`fixed top-0 w-full transition-all duration-500 z-50 ${
        scrolled ? "bg-white/90 shadow-md" : "bg-white"
      }`}
    >
      {/* Mobile Search Bar (Full Width) - Only show when search is active */}
      {mobileSearchActive && (
        <div className="md:hidden w-full bg-white py-3 px-4 animate-slideDown flex items-center">
          <SearchBar 
            products={products} 
            onSelectProduct={(product) => {
              onSelectProduct(product);
              setMobileSearchActive(false);
            }}
            inputRef={searchInputRef}
            autoFocus={true}
          />
          <button
            onClick={() => setMobileSearchActive(false)}
            className="ml-2 text-pink-700 hover:text-red-600 transition-colors duration-300 transform hover:rotate-90"
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
            {/* Left Column - Hamburger and Favorites */}
            <div className="flex justify-start items-center space-x-4">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setMobileMenuOpen(!mobileMenuOpen);
                }}
                className="text-pink-700 transition-transform duration-300 transform hover:scale-110"
              >
                {mobileMenuOpen ? <X size={24} className="animate-rotateIn" /> : <Menu size={24} className="animate-pulse-subtle" />}
              </button>
              
              <button
                onClick={() => setActiveSection("favorites")}
                className={`${
                  activeSection === "favorites"
                  ? "text-pink-500"
                  : "text-pink-700"
                } transition-all transform hover:scale-110 active:scale-95 relative`}
              >
                <Heart size={20} />
                {favorites.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center animate-popup">
                    {favorites.length}
                  </span>
                )}
              </button>
            </div>
            
            {/* Center Column - Logo */}
            <div className="flex justify-center">
              <div
                onClick={handleLogoClick}
                className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-600 cursor-pointer animate-glitter transition-all duration-300 text-2xl"
              >
                crochets
              </div>
            </div>
            
            {/* Right Column - Search & Cart */}
            <div className="flex justify-end items-center space-x-4">
              <button
                onClick={() => setMobileSearchActive(true)}
                className="text-pink-700 transition-transform duration-300 transform hover:scale-110"
              >
                <Search size={20} />
              </button>
              
              <button
                onClick={() => setActiveSection("cart")}
                className={`${
                  activeSection === "cart"
                    ? "text-pink-500"
                    : "text-pink-700"
                } transition-all transform hover:scale-110 active:scale-95 relative`}
              >
                <ShoppingCart size={20} />
                {getTotalItems() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center animate-popup">
                    {getTotalItems()}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden md:flex w-full justify-between items-center">
            {/* Logo */}
            <div
              onClick={handleLogoClick}
              className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-600 cursor-pointer animate-glitter transition-all duration-300 text-2xl"
            >
              crochets
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
                  } hover:text-red-400 font-medium transition-all duration-300 transform hover:scale-105`}
                >
                  {section.charAt(0).toUpperCase() + section.slice(1)}
                </button>
              ))}
              
              {/* Desktop Search */}
              <SearchBar 
                products={products} 
                onSelectProduct={onSelectProduct} 
              />
              
              {/* Desktop Favorites Button - Keep the gradient background for desktop */}
              <div className="relative">
                <button
                  onClick={() => setActiveSection("favorites")}
                  className={`${
                    activeSection === "favorites"
                    ? "bg-gradient-to-r from-red-500 to-red-600"
                    : "bg-gradient-to-r from-pink-500 to-red-400 hover:from-pink-600 hover:to-red-500"
                } text-white p-2 rounded-full transition-all transform hover:scale-110 active:scale-95 relative`}
                >
                  <Heart size={20} className={favorites.length > 0 ? "animate-pulse-subtle" : ""} />
                  {favorites.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-popup">
                      {favorites.length}
                    </span>
                  )}
                </button>
              </div>
              
              {/* Desktop Cart Button - Keep the gradient background for desktop */}
              <div className="relative">
                <button
                  onClick={() => setActiveSection("cart")}
                  className={`${
                    activeSection === "cart"
                      ? "bg-gradient-to-r from-red-500 to-red-600"
                      : "bg-gradient-to-r from-pink-500 to-red-400 hover:from-pink-600 hover:to-red-500"
                  } text-white p-2 rounded-full transition-all transform hover:scale-110 active:scale-95 relative`}
                >
                  <ShoppingCart size={20} className={getTotalItems() > 0 ? "animate-wiggle" : ""} />
                  {getTotalItems() > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-popup">
                      {getTotalItems()}
                    </span>
                  )}
                </button>
              </div>
              
              {/* Admin button - only visible when admin access is shown */}
              {showAdminAccess && (
                <button
                  onClick={() => setActiveSection("admin")}
                  className={`${
                    activeSection === "admin"
                      ? "bg-gradient-to-r from-gray-700 to-gray-900"
                      : "bg-gradient-to-r from-gray-500 to-gray-700 hover:from-gray-600 hover:to-gray-800"
                  } text-white p-2 rounded-full transition-all transform hover:scale-110 active:scale-95 relative animate-fadeIn`}
                  title="Admin Panel"
                >
                  <Settings size={20} />
                </button>
              )}
            </nav>
          </div>
        </div>
      )}

      {/* Mobile Menu */}
      {mobileMenuOpen && !mobileSearchActive && (
        <div
          ref={menuRef}
          className="md:hidden bg-white/95 py-4 shadow-lg animate-slideDown fixed top-[65px] left-0 w-full"
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
                } text-lg font-medium text-left py-2 hover:text-red-400 transition-all duration-300 transform hover:translate-x-2`}
              >
                {section.charAt(0).toUpperCase() + section.slice(1)}
              </button>
            ))}
            
            {/* Admin access in mobile menu - only visible when admin access is shown */}
            {showAdminAccess && (
              <button
                key="admin"
                onClick={() => {
                  setActiveSection("admin");
                  setMobileMenuOpen(false);
                }}
                className={`${
                  activeSection === "admin"
                    ? "text-gray-800" 
                    : "text-gray-600"
                } text-lg font-medium text-left py-2 hover:text-gray-800 transition-all duration-300 transform hover:translate-x-2 animate-fadeIn flex items-center`}
              >
                <Settings size={16} className="mr-2" />
                Admin
              </button>
            )}
          </div>
        </div>
      )}

      {/* Animations */}
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
          
          @keyframes slideDown {
            from { 
              opacity: 0;
              transform: translateY(-10px);
            }
            to { 
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          .animate-slideDown {
            animation: slideDown 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          }
          
          @keyframes rotateIn {
            from {
              transform: rotate(-90deg);
              opacity: 0;
            }
            to {
              transform: rotate(0);
              opacity: 1;
            }
          }
          
          .animate-rotateIn {
            animation: rotateIn 0.3s ease-out;
          }
          
          @keyframes wiggle {
            0%, 100% { transform: rotate(0deg); }
            25% { transform: rotate(-10deg); }
            75% { transform: rotate(10deg); }
          }
          
          .animate-wiggle {
            animation: wiggle 0.5s ease-in-out;
            animation-iteration-count: 1;
          }
          
          @keyframes popup {
            0% { 
              transform: scale(0);
              opacity: 0;
            }
            80% {
              transform: scale(1.2);
            }
            100% { 
              transform: scale(1);
              opacity: 1;
            }
          }
          
          .animate-popup {
            animation: popup 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          }
          
          @keyframes bounce-subtle {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-2px); }
          }
          
          .animate-bounce-subtle {
            animation: bounce-subtle 2s infinite ease-in-out;
          }
          
          @keyframes pulse-subtle {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
          }
          
          .animate-pulse-subtle {
            animation: pulse-subtle 2s infinite ease-in-out;
          }
        `}
      </style>
    </header>
  );
};
