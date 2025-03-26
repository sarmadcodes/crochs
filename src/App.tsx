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

// Define the history state type
interface HistoryState {
  section: string;
  productId?: number;
  prevSection?: string;
}

const App: React.FC = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartNotification, setCartNotification] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const mainRef = useRef<HTMLElement>(null);

  // Add history state management
  useEffect(() => {
    // Handle initial load
    const path = window.location.pathname;
    if (path.includes('/product/')) {
      const productId = parseInt(path.split('/product/')[1]);
      const product = products.find(p => p.id === productId);
      if (product) {
        setSelectedProduct(product);
        setActiveSection('product-details');
      }
    } else if (path.includes('/cart')) {
      setActiveSection('cart');
    } else if (path.includes('/products')) {
      setActiveSection('products');
    } else {
      setActiveSection('home');
    }
    
    // Listen for popstate (back/forward browser buttons)
    const handlePopState = (event: PopStateEvent) => {
      const state = event.state as HistoryState | null;
      
      if (state) {
        setActiveSection(state.section);
        if (state.productId) {
          const product = products.find(p => p.id === state.productId);
          setSelectedProduct(product || null);
        } else {
          setSelectedProduct(null);
        }
      } else {
        // Default to home if no state
        setActiveSection('home');
        setSelectedProduct(null);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Update browser history when activeSection changes
  useEffect(() => {
    let url = '/';
    let title = 'Crochet Shop';
    const state: HistoryState = { section: activeSection };

    if (activeSection === 'products') {
      url = '/products';
      title = 'Our Products | Crochet Shop';
    } else if (activeSection === 'cart') {
      url = '/cart';
      title = 'Shopping Cart | Crochet Shop';
    } else if (activeSection === 'product-details' && selectedProduct) {
      url = `/product/${selectedProduct.id}`;
      title = `${selectedProduct.name} | Crochet Shop`;
      state.productId = selectedProduct.id;
      
      // Store previous section to go back to
      const currentState = window.history.state as HistoryState | null;
      if (currentState && currentState.section !== 'product-details') {
        state.prevSection = currentState.section;
      }
    }

    // Only push a new state if we're not handling a popstate event
    const currentState = window.history.state as HistoryState | null;
    if (!currentState || currentState.section !== activeSection) {
      window.history.pushState(state, title, url);
    }
  }, [activeSection, selectedProduct]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setScrolled(scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll to top when section changes
  useEffect(() => {
    window.scrollTo(0, 0);
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
    // Use browser history to go back if available
    const state = window.history.state as HistoryState | null;
    if (state && state.prevSection) {
      window.history.back();
    } else {
      setActiveSection('products');
      setSelectedProduct(null);
    }
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
            goBack={() => setActiveSection('home')} // Added this line
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
