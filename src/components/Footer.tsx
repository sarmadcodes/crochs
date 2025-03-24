import React from "react";
import { Instagram } from "lucide-react"; // Import the Instagram icon from lucide-react

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-r from-pink-500 to-red-400 text-white py-3 md:py-4">
      <div className="container mx-auto px-4">
        <div className="flex justify-center mb-2">
          {/* Social Media Icon with Text - Now centered as the main element */}
          <a 
            href="#" 
            className="text-white hover:text-pink-200 transition flex items-center"
            aria-label="Follow us on Instagram"
          >
            <Instagram size={20} />
            <span className="ml-2">crochets</span>
          </a>
        </div>
        
        {/* Copyright Section - Simplified */}
        <div className="border-t border-pink-300 pt-2 text-center text-pink-100 text-xs">
          <div className="flex flex-wrap justify-center items-center gap-1">
            <p>© 2025 crochets <span>•</span> all copyright reserved </p>
            <span>•</span>
            <p>
              Developed by{" "}
              <a
                href="https://www.instagram.com/sarmad0/"
                className="text-white hover:text-pink-200 transition"
              >
                sarmad0
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
