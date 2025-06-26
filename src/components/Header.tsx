import React, { useEffect, useRef, useState } from "react";
import { Menu, X, ShoppingCart, Search, Heart, Settings, Phone } from "lucide-react";
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

  // Announcement slider state
  const [currentAnnouncementIndex, setCurrentAnnouncementIndex] = useState(0);
  const announcements = [
    "🎉 Welcome to Our Crochet Store!",
    "✨ Free Shipping on Orders Over 2000PKR",
    "🧶 abhi ayen abhi payen",
    "💖 20% Off on Valentine's Special Items",
    "🌟 Handcrafted with Love Just for You"
  ];

  // Auto-rotate announcements
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAnnouncementIndex((prev) => 
        (prev + 1) % announcements.length
      );
    }, 4000); // Change every 4 seconds

    return () => clearInterval(interval);
  }, [announcements.length]);

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

  // Social Media Icons (as SVG components for better control)
  const InstagramIcon = () => (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
  );

  const TikTokIcon = () => (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
    </svg>
  );

  const FacebookIcon = () => (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  );

  const WhatsAppIcon = () => (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.893 3.488"/>
    </svg>
  );

  return (
    <>
      {/* Announcement Strip with Phone and Social Media - Desktop Only */}
      <div className="w-full bg-gradient-to-r from-pink-500 to-pink-600 text-white py-2 px-4 fixed top-0 z-50 overflow-hidden">
        <div className="relative h-6 flex items-center">
          {/* Phone Number - Left Side - Desktop Only */}
          <div className="hidden lg:flex items-center space-x-2 absolute left-0 z-10">
            <Phone size={14} />
            <a 
              href="tel:+923313103442" 
              className="text-white hover:text-pink-200 transition-colors duration-300 text-sm font-medium"
              title="Call us"
            >
              Call us: +92 331 310 3442
            </a>
          </div>

          {/* Announcements - Center - Full width on mobile, with padding on desktop */}
          <div className="flex-1 flex items-center justify-center px-4 lg:px-32">
            {announcements.map((announcement, index) => (
              <div
                key={index}
                className={`absolute inset-0 flex items-center justify-center text-sm md:text-base font-medium transition-all duration-700 transform ${
                  index === currentAnnouncementIndex
                    ? 'opacity-100 translate-x-0'
                    : index < currentAnnouncementIndex
                    ? 'opacity-0 -translate-x-full'
                    : 'opacity-0 translate-x-full'
                }`}
              >
                {announcement}
              </div>
            ))}
          </div>

          {/* Social Media Icons - Right Side - Desktop Only */}
          <div className="hidden lg:flex items-center space-x-3 absolute right-0 z-10">
            <a 
              href="https://instagram.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-white hover:text-pink-200 transition-colors duration-300 transform hover:scale-110"
              title="Follow us on Instagram"
            >
              <InstagramIcon />
            </a>
            <a 
              href="https://tiktok.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-white hover:text-pink-200 transition-colors duration-300 transform hover:scale-110"
              title="Follow us on TikTok"
            >
              <TikTokIcon />
            </a>
            <a 
              href="https://facebook.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-white hover:text-pink-200 transition-colors duration-300 transform hover:scale-110"
              title="Follow us on Facebook"
            >
              <FacebookIcon />
            </a>
            <a 
              href="https://wa.me/923313103442" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-white hover:text-pink-200 transition-colors duration-300 transform hover:scale-110"
              title="Chat with us on WhatsApp"
            >
              <WhatsAppIcon />
            </a>
          </div>
        </div>
      </div>

      <header
        className={`fixed top-8 w-full transition-all duration-500 z-40 ${
          scrolled 
            ? "bg-white/25 shadow-lg border-b border-gray-200/30" 
            : "bg-white"
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
          <div className="container mx-auto px-4 py-6 flex items-center">
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

            {/* Desktop Layout - Three sections: Left Nav, Center Logo, Right Actions */}
            <div className="hidden md:flex w-full items-center">
              {/* Left Section - Navigation */}
              <div className="flex items-center space-x-6 flex-1">
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
              </div>

              {/* Center Section - Logo */}
              <div className="flex justify-center flex-1">
                <div
                  onClick={handleLogoClick}
                  className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-600 cursor-pointer animate-glitter transition-all duration-300 text-2xl"
                >
                  crochets
                </div>
              </div>

              {/* Right Section - Search, Favorites, Cart, Admin */}
              <div className="flex items-center space-x-4 flex-1 justify-end">
                {/* Desktop Search */}
                <SearchBar 
                  products={products} 
                  onSelectProduct={onSelectProduct} 
                />
                
                {/* Desktop Favorites Button */}
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
                
                {/* Desktop Cart Button */}
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
              </div>
            </div>
          </div>
        )}

        {/* Mobile Menu */}
        {mobileMenuOpen && !mobileSearchActive && (
          <div
            ref={menuRef}
            className="md:hidden bg-white py-4 shadow-lg animate-slideDown fixed top-[105px] left-0 w-full border-b border-gray-200/30"
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

              {/* Mobile Social Media Links */}
              <div className="pt-4 border-t border-pink-200/30">
                
                <div className="flex items-center space-x-4">
                  
                </div>
              </div>
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
            
          `}
        </style>
      </header>
    </>
  );
};
