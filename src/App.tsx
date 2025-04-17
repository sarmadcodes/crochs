import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { CartNotification } from './components/CartNotification';
import { HomeSection } from './sections/HomeSection';
import { ProductsSection } from './sections/ProductsSection';
import { CartSection } from './sections/CartSection';
import { CheckoutForm } from './sections/CheckoutForm'; // Import the new CheckoutForm component
import { FavoritesSection } from './components/FavoritesSection';
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

// New PageUpButton component
const PageUpButton: React.FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show button when page is scrolled down 300px
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
      className={`fixed bottom-6 right-6 bg-pink-600 hover:bg-pink-700 text-white rounded-full p-3 shadow-lg transition-all duration-300 z-50 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12 pointer-events-none'
      }`}
      aria-label="Scroll to top"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
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

const CART_STORAGE_KEY = 'crochet_shop_cart';
const FAVORITES_STORAGE_KEY = 'crochet_shop_favorites';

const App: React.FC = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [cartNotification, setCartNotification] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const mainRef = useRef<HTMLElement>(null);
  
  // Initialize cart from localStorage
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
      return [];
    }
  });

  // Initialize favorites from localStorage
  const [favorites, setFavorites] = useState<number[]>(() => {
    try {
      const savedFavorites = localStorage.getItem(FAVORITES_STORAGE_KEY);
      return savedFavorites ? JSON.parse(savedFavorites) : [];
    } catch (error) {
      console.error('Error loading favorites from localStorage:', error);
      return [];
    }
  });

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }, [cart]);

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
    } catch (error) {
      console.error('Error saving favorites to localStorage:', error);
    }
  }, [favorites]);

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
    } else if (path.includes('/checkout')) {
      setActiveSection('checkout');
    } else if (path.includes('/products')) {
      setActiveSection('products');
    } else if (path.includes('/favorites')) {
      setActiveSection('favorites');
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

  // Function to clear the cart after successful order
  const clearCart = () => {
    setCart([]);
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify([]));
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
        favorites={favorites}
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
            goBack={() => setActiveSection('home')}
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
            setActiveSection={setActiveSection}
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
            setActiveSection={setActiveSection}
            clearCart={clearCart}
          />
        )}

        {activeSection === 'favorites' && (
          <FavoritesSection 
            favorites={favorites}
            products={products}
            setActiveSection={setActiveSection}
            toggleFavorite={toggleFavorite}
            addToCart={addToCart}
            onViewProductDetails={viewProductDetails}
          />
        )}
      </main>
  
      <CartNotification 
        show={cartNotification}
        totalItems={getTotalItems()}
        onViewCart={() => setActiveSection('cart')}
      />
  
      <Footer />
      
      <PageUpButton />
    </div>
  );
};

export default App;
