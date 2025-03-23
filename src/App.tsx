import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { CartNotification } from './components/CartNotification';
import { HomeSection } from './sections/HomeSection';
import { ProductsSection } from './sections/ProductsSection';
import { CartSection } from './sections/CartSection';
import { ProductDetailsPage } from './components/ProductDetailsPage';
import { Product, CartItem } from './types';
import { products } from './data/products'; // Import products directly
import './styles/animations.css';

const App: React.FC = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartNotification, setCartNotification] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setScrolled(scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Add this new effect to scroll to top when section changes
  useEffect(() => {
    window.scrollTo(0, 0);
    // Alternative method if the above doesn't work well:
    // mainRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [activeSection]);

  const addToCart = (product: Product) => {
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
      setCart(cart.map(item => 
        item.id === product.id 
          ? { ...item, quantity: item.quantity + 1 } 
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
    
    setCartNotification(true);
    setTimeout(() => {
      setCartNotification(false);
    }, 3000);
  };

  const removeFromCart = (productId: number) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
      return;
    }
    
    setCart(cart.map(item => 
      item.id === productId 
        ? { ...item, quantity: newQuantity } 
        : item
    ));
  };

  const viewProductDetails = (product: Product) => {
    setSelectedProduct(product);
    setActiveSection('product-details');
  };

  const goBackToProducts = () => {
    setActiveSection('products');
    setSelectedProduct(null);
  };

  const goToCart = () => {
    setActiveSection('cart');
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  return (
    <div className="flex flex-col min-h-screen bg-pink-100">
      <Header 
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        scrolled={scrolled}
        getTotalItems={getTotalItems}
        products={products}
        onSelectProduct={viewProductDetails}
      />
  
      {/* This ensures the main content grows and pushes the footer down */}
      <main ref={mainRef} className="flex-grow">
        {activeSection === 'home' && (
          <HomeSection 
            setActiveSection={setActiveSection}
            addToCart={addToCart}
            onViewProductDetails={viewProductDetails}
          />
        )}
        
        {activeSection === 'products' && (
          <ProductsSection 
            addToCart={addToCart} 
            onViewProductDetails={viewProductDetails}
          />
        )}
  
        {activeSection === 'product-details' && (
          <ProductDetailsPage 
            product={selectedProduct}
            addToCart={addToCart}
            goBack={goBackToProducts}
            goToCart={goToCart}
          />
        )}
  
        {activeSection === 'cart' && (
          <CartSection 
            cart={cart}
            setActiveSection={setActiveSection}
            updateQuantity={updateQuantity}
            removeFromCart={removeFromCart}
            getTotalItems={getTotalItems}
            getTotalPrice={getTotalPrice}
          />
        )}
      </main>
  
      <CartNotification 
        show={cartNotification}
        totalItems={getTotalItems()}
        onViewCart={() => setActiveSection('cart')}
      />
  
      <Footer />
    </div>
  );
  
};

export default App;
