import React, { useEffect, useRef } from "react";
import { Menu, X, ShoppingCart } from "lucide-react";

interface HeaderProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  scrolled: boolean;
  getTotalItems: () => number;
}

export const Header: React.FC<HeaderProps> = ({
  activeSection,
  setActiveSection,
  mobileMenuOpen,
  setMobileMenuOpen,
  scrolled,
  getTotalItems,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

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
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo with Glitter Effect */}
        <div
          onClick={() => setActiveSection("home")}
          className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-600 cursor-pointer animate-glitter"
        >
          uzucrochets
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {["home", "products"].map((section) => (
            <button
              key={section}
              onClick={() => setActiveSection(section)}
              className={`${
                activeSection === section ? "text-red-500" : "text-pink-700"
              } hover:text-red-400 font-medium transition`}
            >
              {section.charAt(0).toUpperCase() + section.slice(1)}
            </button>
          ))}
          {/* Cart Button */}
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

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center space-x-4">
          {/* Mobile Cart */}
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
          {/* Mobile Menu Toggle */}
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
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div
          ref={menuRef}
          className="md:hidden bg-white/95 py-4 shadow-lg animate-fadeIn fixed top-[65px] left-0 w-full"
        >
          <div className="container mx-auto px-4 flex flex-col space-y-4">
            {["home", "products"].map((section) => (
              <button
                key={section}
                onClick={() => {
                  setActiveSection(section);
                  setMobileMenuOpen(false);
                }}
                className={`${
                  activeSection === section ? "text-red-500" : "text-pink-700"
                } text-lg font-medium text-left py-2`}
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
        `}
      </style>
    </header>
  );
};
