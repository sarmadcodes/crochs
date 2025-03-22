import React from "react";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-r from-pink-500 to-red-400 text-white py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left">
          {/* Brand Section */}
          <div className="mb-6 md:mb-0">
            <h2 className="text-2xl font-bold">Uzucrochets</h2>
            <p className="text-pink-100 mt-1">Handmade with love</p>
          </div>
          
          {/* Social Media Links */}
          <div className="flex flex-wrap justify-center md:justify-start space-x-6">
            <a href="https://www.instagram.com/uzucrochets/" className="text-white hover:text-pink-200 transition font-medium">
              Our Instagram
            </a>
            
          </div>
        </div>
        
        {/* Copyright Section */}
        <div className="border-t border-pink-300 mt-6 pt-4 text-center text-pink-100 text-sm">
          <div className="flex flex-wrap justify-center items-center gap-2">
            <p>© 2025 Uzucrochets. All rights reserved.</p>
            <span className="hidden md:inline">•</span>
            {/* Developer Attribution */}
            <p className="flex items-center">
              Developed by{" "}
              <a 
                href="https://www.instagram.com/sarmad0/" 
                className="inline-flex items-center ml-1 text-white hover:text-pink-200 transition"
              >
                <svg 
                  className="w-4 h-4 mr-1" 
                  fill="currentColor" 
                  viewBox="0 0 24 24" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                sarmad0
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
