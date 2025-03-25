import React from "react";
import { Instagram, Facebook, Twitter, Linkedin } from "lucide-react";

export const Footer: React.FC = () => {
  const socialLinks = [
    { 
      icon: Instagram, 
      href: "https://www.instagram.com/crochets/", 
      label: "Instagram" 
    },
    { 
      icon: Facebook, 
      href: "https://www.facebook.com/crochets", 
      label: "Facebook" 
    },
    { 
      icon: Twitter, 
      href: "https://www.twitter.com/crochets", 
      label: "Twitter" 
    },
    { 
      icon: Linkedin, 
      href: "https://www.linkedin.com/company/crochets", 
      label: "LinkedIn" 
    }
  ];

  return (
    <footer className="bg-gradient-to-r from-pink-500 to-red-400 text-white py-5 md:py-8">
      <div className="container mx-auto px-4">
        {/* Social Media Icons Section */}
        <div className="flex flex-wrap justify-center items-center mb-4 space-x-4 sm:space-x-6">
          {socialLinks.map((social) => (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-pink-200 transition"
              aria-label={`Follow us on ${social.label}`}
            >
              <social.icon size={20} />
            </a>
          ))}
        </div>

        {/* Copyright and Developer Section */}
        <div className="border-t border-pink-300 pt-4 text-center text-pink-100 text-xs">
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-2">
            <p className="text-center">© 2025 crochets</p>
            <span className="hidden sm:inline">•</span>
            <p className="text-center">
              Developed by{" "}
              <a
                href="https://www.instagram.com/sarmad0/"
                className="text-white hover:text-pink-200 transition"
                target="_blank"
                rel="noopener noreferrer"
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

export default Footer;
