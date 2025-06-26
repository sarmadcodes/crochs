import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { CartNotification } from './components/CartNotification';
import { HomeSection } from './sections/HomeSection';
import { ProductsSection } from './sections/ProductsSection';
import { CartSection } from './sections/CartSection';
import { CheckoutForm } from './sections/CheckoutForm';
import { FavoritesSection } from './components/FavoritesSection';
import { ProductDetailsPage } from './components/ProductDetailsPage';
import { AdminPanel } from './components/AdminPanel';

import { Product, CartItem } from './types';
import { products } from './data/products';
import './styles/animations.css';

// Define the history state type
interface HistoryState {
  section: string;
  productId?: number;
  prevSection?: string;
}

// Loading Screen Component
const LoadingScreen: React.FC = () => {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => {
        if (prev === '...') return '';
        return prev + '.';
      });
    }, 300);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 bg-white/20 flex items-center justify-center z-50">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mb-4"></div>
        <div className="text-pink-700 text-lg font-medium drop-shadow-md">
          Loading{dots}
        </div>
      </div>
    </div>
  );
};

// Smaller PageUpButton component
const PageUpButton: React.FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-6 right-6 bg-pink-600 hover:bg-pink-700 text-white rounded-full p-2 shadow-lg transition-all duration-300 z-40 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12 pointer-events-none'
      }`}
      aria-label="Scroll to top"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-4 w-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 15l7-7 7 7"
        />
      </svg>
    </button>
  );
};



const App: React.FC = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [cartNotification, setCartNotification] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const mainRef = useRef<HTMLElement>(null);
  
  // Initialize cart from localStorage (using React state instead)
  const [cart, setCart] = useState<CartItem[]>([]);

  // Initialize favorites from localStorage (using React state instead)
  const [favorites, setFavorites] = useState<number[]>([]);

  // Loading function for page transitions
  const showLoadingAndNavigate = (newSection: string, callback?: () => void) => {
    setIsLoading(true);
    
    // Random loading time between 800ms and 1500ms for realism
    const loadingTime = Math.random() * 200 + 300;
    
    setTimeout(() => {
      if (callback) {
        callback();
      }
      setActiveSection(newSection);
      setIsLoading(false);
    }, loadingTime);
  };

  // Modified navigation functions with loading
  const navigateToSection = (section: string) => {
    if (section === activeSection) return;
    showLoadingAndNavigate(section);
  };

  // Add history state management
  useEffect(() => {
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
    } else if (path.includes('/checkout')) {
      setActiveSection('checkout');
    } else if (path.includes('/products')) {
      setActiveSection('products');
    } else if (path.includes('/favorites')) {
      setActiveSection('favorites');
    } else if (path.includes('/admin')) {
      setActiveSection('admin');
    } else if (path.includes('/admin-setup')) {
      setActiveSection('admin-setup');
    } else {
      setActiveSection('home');
    }
    
    const handlePopState = (event: PopStateEvent) => {
      const state = event.state as HistoryState | null;
      
      if (state) {
        showLoadingAndNavigate(state.section, () => {
          if (state.productId) {
            const product = products.find(p => p.id === state.productId);
            setSelectedProduct(product || null);
          } else {
            setSelectedProduct(null);
          }
        });
      } else {
        showLoadingAndNavigate('home', () => {
          setSelectedProduct(null);
        });
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
    } else if (activeSection === 'checkout') {
      url = '/checkout';
      title = 'Checkout | Crochet Shop';
    } else if (activeSection === 'favorites') {
      url = '/favorites';
      title = 'My Favorites | Crochet Shop';
    } else if (activeSection === 'product-details' && selectedProduct) {
      url = `/product/${selectedProduct.id}`;
      title = `${selectedProduct.name} | Crochet Shop`;
      state.productId = selectedProduct.id;
      
      const currentState = window.history.state as HistoryState | null;
      if (currentState && currentState.section !== 'product-details') {
        state.prevSection = currentState.section;
      }
    } else if (activeSection === 'admin') {
      url = '/admin';
      title = 'Admin Panel | Crochet Shop';
    } else if (activeSection === 'admin-setup') {
      url = '/admin-setup';
      title = 'Admin Setup | Crochet Shop';
    }

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
    if (!isLoading) {
      window.scrollTo(0, 0);
    }
  }, [activeSection, isLoading]);

  const addToCart = (product: Product) => {
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
      const updatedCart = cart.map(item => 
        item.id === product.id 
          ? { ...item, quantity: item.quantity + 1 } 
          : item
      );
      setCart(updatedCart);
    } else {
      const updatedCart = [...cart, { ...product, quantity: 1 }];
      setCart(updatedCart);
    }
    
    setCartNotification(true);
    setTimeout(() => {
      setCartNotification(false);
    }, 3000);
  };

  const removeFromCart = (productId: number) => {
    const updatedCart = cart.filter(item => item.id !== productId);
    setCart(updatedCart);
  };

  const updateQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
      return;
    }
    
    const updatedCart = cart.map(item => 
      item.id === productId 
        ? { ...item, quantity: newQuantity } 
        : item
    );
    setCart(updatedCart);
  };

  const toggleFavorite = (productId: number) => {
    setFavorites(prevFavorites => {
      if (prevFavorites.includes(productId)) {
        return prevFavorites.filter(id => id !== productId);
      } else {
        return [...prevFavorites, productId];
      }
    });
  };

  const isProductFavorite = (productId: number) => {
    return favorites.includes(productId);
  };

  const viewProductDetails = (product: Product) => {
    showLoadingAndNavigate('product-details', () => {
      setSelectedProduct(product);
    });
  };

  const goBackToProducts = () => {
    const state = window.history.state as HistoryState | null;
    if (state && state.prevSection) {
      window.history.back();
    } else {
      showLoadingAndNavigate('products', () => {
        setSelectedProduct(null);
      });
    }
  };

  const goToCart = () => {
    navigateToSection('cart');
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const clearCart = () => {
    setCart([]);
  };

  // Show loading screen during transitions
  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-pink-100">
      <Header
        activeSection={activeSection}
        setActiveSection={navigateToSection}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        scrolled={scrolled}
        getTotalItems={getTotalItems}
        products={products}
        onSelectProduct={viewProductDetails}
        favorites={favorites}
      />
  
      <main ref={mainRef} className="flex-grow">
        {activeSection === 'home' && (
          <HomeSection 
            setActiveSection={navigateToSection}
            addToCart={addToCart}
            onViewProductDetails={viewProductDetails}
          />
        )}
        
        {activeSection === 'products' && (
          <ProductsSection 
            addToCart={addToCart} 
            onViewProductDetails={viewProductDetails}
            goBack={() => navigateToSection('home')}
            favorites={favorites}
            toggleFavorite={toggleFavorite}
          />
        )}
  
        {activeSection === 'product-details' && (
          <ProductDetailsPage 
            product={selectedProduct}
            addToCart={addToCart}
            goBack={goBackToProducts}
            goToCart={goToCart}
            isFavorite={selectedProduct ? isProductFavorite(selectedProduct.id) : false}
            toggleFavorite={() => selectedProduct && toggleFavorite(selectedProduct.id)}
          />
        )}
  
        {activeSection === 'cart' && (
          <CartSection 
            cart={cart}
            setActiveSection={navigateToSection}
            updateQuantity={updateQuantity}
            removeFromCart={removeFromCart}
            getTotalItems={getTotalItems}
            getTotalPrice={getTotalPrice}
          />
        )}

        {activeSection === 'checkout' && (
          <CheckoutForm
            cart={cart}
            getTotalPrice={getTotalPrice}
            setActiveSection={navigateToSection}
            clearCart={clearCart}
          />
        )}

        {activeSection === 'favorites' && (
          <FavoritesSection 
            favorites={favorites}
            products={products}
            setActiveSection={navigateToSection}
            toggleFavorite={toggleFavorite}
            addToCart={addToCart}
            onViewProductDetails={viewProductDetails}
          />
        )}

        {activeSection === 'admin' && (
          <AdminPanel setActiveSection={navigateToSection} />
        )}
        
      </main>
  
      <CartNotification 
        show={cartNotification}
        totalItems={getTotalItems()}
        onViewCart={() => navigateToSection('cart')}
      />
  
      <Footer />
      
      <PageUpButton />
    </div>
  );
};

export default App;
