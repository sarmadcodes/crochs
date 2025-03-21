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
            <a href="#" className="text-white hover:text-pink-200 transition">
              Instagram
            </a>
            <a href="#" className="text-white hover:text-pink-200 transition">
              Pinterest
            </a>
            <a href="#" className="text-white hover:text-pink-200 transition">
              Etsy
            </a>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="border-t border-pink-300 mt-6 pt-4 text-center text-pink-100 text-sm">
          <p>© 2025 Uzucrochets. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
