import React, { useState, useEffect } from 'react'; 
import { 
  collection, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc,
  query,
  orderBy,
  onSnapshot,
  Timestamp 
} from 'firebase/firestore';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { db, auth } from '../Firebase';
import { 
  RefreshCw, 
  Eye, 
  Trash2, 
  Package, 
  DollarSign, 
  User, 
  Calendar,
  Phone,
  Mail,
  MapPin,
  CreditCard,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  ArrowLeft,
  Download,
  Search,
  Filter,
  Lock,
  LogOut,
  Shield,
  Menu,
  ChevronDown
} from 'lucide-react';

interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  totalPrice: number;
}

interface Customer {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
}

interface Payment {
  method: 'cod' | 'sadapay' | 'easypaisa' | 'bank';
  total: number;
  screenshotUrl?: string;
}

interface Order {
  id: string;
  customer: Customer;
  items: OrderItem[];
  payment: Payment;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: Timestamp;
}

interface AdminPanelProps {
  setActiveSection: (section: string) => void;
}

const AdminLogin: React.FC<{ onLogin: () => void }> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await signInWithEmailAndPassword(auth, email, password);
      onLogin();
    } catch (error) {
      console.error('Login error:', error);
      setError('Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-red-50 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-sm sm:p-8">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-pink-500 to-red-500 rounded-full mb-3">
            <Shield className="text-white" size={24} />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-pink-600 to-red-500 bg-clip-text text-transparent">
            Admin Login
          </h1>
          <p className="text-gray-600 mt-2 text-sm sm:text-base">
            Please sign in to access the admin panel
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-300 focus:border-pink-500 outline-none text-sm sm:text-base"
                placeholder="Enter email"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-300 focus:border-pink-500 outline-none text-sm sm:text-base"
                placeholder="Enter password"
                required
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-2 px-4 rounded-lg text-white font-medium transition-colors text-sm sm:text-base ${
              isLoading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600'
            }`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <RefreshCw className="animate-spin mr-2" size={18} />
                Signing in...
              </div>
            ) : (
              'Sign In'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export const AdminPanel: React.FC<AdminPanelProps> = ({ setActiveSection }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [updating, setUpdating] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);
    });
    return unsubscribe;
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setIsLoggedIn(false);
      setOrders([]);
      setSelectedOrder(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const ordersRef = collection(db, 'orders');
      const q = query(ordersRef, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      
      const ordersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Order[];
      
      setOrders(ordersData);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError('Failed to load orders. Please try refreshing.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isLoggedIn) return;

    let unsubscribe: (() => void) | null = null;

    const setupOrdersListener = () => {
      try {
        const ordersRef = collection(db, 'orders');
        const q = query(ordersRef, orderBy('createdAt', 'desc'));
        
        unsubscribe = onSnapshot(q, (snapshot) => {
          try {
            const ordersData = snapshot.docs.map(doc => {
              const data = doc.data();
              return {
                id: doc.id,
                ...data,
                createdAt: data.createdAt instanceof Timestamp ? data.createdAt : Timestamp.now()
              };
            }) as Order[];
            
            setOrders(ordersData);
            setLoading(false);
            setError(null);
          } catch (err) {
            console.error('Error processing orders snapshot:', err);
            setError('Error processing orders data.');
            setLoading(false);
          }
        }, (error) => {
          console.error('Error in orders listener:', error);
          setError('Connection error. Trying to fetch manually...');
          fetchOrders();
        });

      } catch (error) {
        console.error('Error setting up listener:', error);
        fetchOrders();
      }
    };

    setupOrdersListener();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [isLoggedIn]);

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    setUpdating(orderId);
    try {
      await updateDoc(doc(db, 'orders', orderId), { 
        status: newStatus,
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Error updating order:', error);
      alert('Failed to update order status.');
    } finally {
      setUpdating(null);
    }
  };

  const deleteOrder = async (orderId: string) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      try {
        await deleteDoc(doc(db, 'orders', orderId));
        if (selectedOrder?.id === orderId) {
          setSelectedOrder(null);
        }
      } catch (error) {
        console.error('Error deleting order:', error);
        alert('Failed to delete order.');
      }
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    const matchesSearch = searchTerm === '' || 
      order.customer.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'confirmed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'shipped': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'delivered': return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock size={16} />;
      case 'confirmed': return <CheckCircle size={16} />;
      case 'shipped': return <Truck size={16} />;
      case 'delivered': return <Package size={16} />;
      case 'cancelled': return <XCircle size={16} />;
      default: return <Clock size={16} />;
    }
  };

  const formatDate = (timestamp: Timestamp) => {
    try {
      return timestamp.toDate().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid Date';
    }
  };

  const getTotalRevenue = () => {
    return orders
      .filter(order => order.status !== 'cancelled')
      .reduce((total, order) => total + (order.payment?.total || 0), 0);
  };

  const getOrderStats = () => {
    return {
      total: orders.length,
      pending: orders.filter(o => o.status === 'pending').length,
      confirmed: orders.filter(o => o.status === 'confirmed').length,
      shipped: orders.filter(o => o.status === 'shipped').length,
      delivered: orders.filter(o => o.status === 'delivered').length,
      cancelled: orders.filter(o => o.status === 'cancelled').length,
    };
  };

  const handleRefresh = () => {
    fetchOrders();
  };

  if (!isLoggedIn) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  if (loading) {
    return (
      <div className="pt-20 pb-16 min-h-screen">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center h-64">
            <RefreshCw className="animate-spin mr-2" size={24} />
            <span>Loading orders...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 pb-16 min-h-screen bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between py-4 px-4 bg-white shadow-sm fixed top-0 left-0 right-0 z-40">
          <button 
            onClick={() => setActiveSection('home')}
            className="flex items-center text-pink-700"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-bold bg-gradient-to-r from-pink-600 to-red-500 bg-clip-text text-transparent">
            Admin Panel
          </h1>
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1 text-gray-700"
          >
            <Menu size={24} />
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden fixed top-16 right-4 bg-white shadow-lg rounded-lg z-50 p-4 w-64">
            <div className="flex flex-col space-y-3">
              <button
                onClick={handleRefresh}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg"
                disabled={loading}
              >
                <RefreshCw size={16} className={`mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg"
              >
                <LogOut size={16} className="mr-2" />
                Logout
              </button>
            </div>
          </div>
        )}

        {/* Desktop Header */}
        <div className="hidden md:flex items-center justify-between mb-6 mt-6">
          <div className="flex items-center">
            <button 
              onClick={() => setActiveSection('home')}
              className="flex items-center text-pink-700 hover:text-red-500 mr-4"
            >
              <ArrowLeft size={20} />
              <span className="ml-1">Back to Home</span>
            </button>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-red-500 bg-clip-text text-transparent">
              Admin Panel
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={handleRefresh}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              disabled={loading}
            >
              <RefreshCw size={16} className={`mr-2 ${loading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              <LogOut size={16} className="mr-2" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            <p>{error}</p>
            <button 
              onClick={handleRefresh}
              className="mt-2 text-red-800 underline hover:no-underline"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Stats Cards - Responsive Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Total Orders</p>
                <p className="text-lg sm:text-xl font-bold text-gray-800">{getOrderStats().total}</p>
              </div>
              <Package className="text-pink-500" size={24} />
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Total Revenue</p>
                <p className="text-lg sm:text-xl font-bold text-gray-800">Rs {getTotalRevenue().toFixed(2)}</p>
              </div>
              <DollarSign className="text-green-500" size={24} />
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Pending</p>
                <p className="text-lg sm:text-xl font-bold text-yellow-600">{getOrderStats().pending}</p>
              </div>
              <Clock className="text-yellow-500" size={24} />
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Delivered</p>
                <p className="text-lg sm:text-xl font-bold text-green-600">{getOrderStats().delivered}</p>
              </div>
              <CheckCircle className="text-green-500" size={24} />
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border mb-6">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-300 focus:border-pink-500 outline-none"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Filter size={18} className="text-gray-500 hidden sm:block" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full sm:w-auto px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-300 focus:border-pink-500 outline-none"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        {/* Orders - Table for desktop, Cards for mobile */}
        <div className="hidden md:block bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left p-3 text-sm font-medium text-gray-700">Order ID</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-700">Customer</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-700">Total</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-700">Status</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-700">Date</th>
                  <th className="text-left p-3 text-sm font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center p-6 text-gray-500">
                      {orders.length === 0 ? 'No orders found' : 'No matching orders'}
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr key={order.id} className="border-b hover:bg-gray-50">
                      <td className="p-3">
                        <span className="font-mono text-xs text-gray-600">
                          #{order.id.slice(-6)}
                        </span>
                      </td>
                      <td className="p-3">
                        <div>
                          <p className="text-sm font-medium text-gray-800 truncate max-w-[160px]">{order.customer?.fullName || 'N/A'}</p>
                          <p className="text-xs text-gray-600 truncate max-w-[160px]">{order.customer?.email || 'N/A'}</p>
                        </div>
                      </td>
                      <td className="p-3">
                        <span className="text-sm text-gray-800">
                          Rs {(order.payment?.total || 0).toFixed(2)}
                        </span>
                      </td>
                      <td className="p-3">
                        <select
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                          disabled={updating === order.id}
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)} ${
                            updating === order.id ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                          }`}
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className="p-3">
                        <span className="text-xs text-gray-600">
                          {formatDate(order.createdAt)}
                        </span>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"
                            title="View Details"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => deleteOrder(order.id)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"
                            title="Delete Order"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile Orders List */}
        <div className="md:hidden space-y-3">
          {filteredOrders.length === 0 ? (
            <div className="bg-white p-6 rounded-lg shadow-sm border text-center text-gray-500">
              {orders.length === 0 ? 'No orders found' : 'No matching orders'}
            </div>
          ) : (
            filteredOrders.map((order) => (
              <div key={order.id} className="bg-white p-4 rounded-lg shadow-sm border">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-gray-800">#{order.id.slice(-6)}</p>
                    <p className="text-sm text-gray-600">{order.customer?.fullName || 'N/A'}</p>
                  </div>
                  <span className="text-sm font-medium">
                    Rs {(order.payment?.total || 0).toFixed(2)}
                  </span>
                </div>
                
                <div className="mt-3 flex items-center justify-between">
                  <select
                    value={order.status}
                    onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                    disabled={updating === order.id}
                    className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(order.status)} ${
                      updating === order.id ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                    }`}
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                  
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="p-1 text-blue-600 hover:bg-blue-50 rounded-lg"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      onClick={() => deleteOrder(order.id)}
                      className="p-1 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Order Details Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-4 border-b sticky top-0 bg-white z-10">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-gray-800">
                    Order #{selectedOrder.id.slice(-8)}
                  </h2>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="p-1 hover:bg-gray-100 rounded-lg"
                  >
                    <XCircle size={20} />
                  </button>
                </div>
              </div>

              <div className="p-4 space-y-4">
                {/* Customer Info */}
                <div className="grid grid-cols-1 gap-4">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <h3 className="font-semibold text-gray-800 mb-2 flex items-center text-sm">
                      <User size={16} className="mr-2" />
                      Customer Information
                    </h3>
                    <div className="space-y-1 text-sm">
                      <p><strong>Name:</strong> {selectedOrder.customer?.fullName || 'N/A'}</p>
                      <p className="flex items-center">
                        <Mail size={14} className="mr-2" />
                        {selectedOrder.customer?.email || 'N/A'}
                      </p>
                      <p className="flex items-center">
                        <Phone size={14} className="mr-2" />
                        {selectedOrder.customer?.phone || 'N/A'}
                      </p>
                      <p><strong>City:</strong> {selectedOrder.customer?.city || 'N/A'}</p>
                      <p><strong>Postal Code:</strong> {selectedOrder.customer?.postalCode || 'N/A'}</p>
                      <p className="flex items-start">
                        <MapPin size={14} className="mr-2 mt-0.5" />
                        <span>{selectedOrder.customer?.address || 'N/A'}</span>
                      </p>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-3 rounded-lg">
                    <h3 className="font-semibold text-gray-800 mb-2 flex items-center text-sm">
                      <Package size={16} className="mr-2" />
                      Order Information
                    </h3>
                    <div className="space-y-1 text-sm">
                      <p><strong>Order ID:</strong> {selectedOrder.id}</p>
                      <p className="flex items-center">
                        <Calendar size={14} className="mr-2" />
                        {formatDate(selectedOrder.createdAt)}
                      </p>
                      <p className="flex items-center">
                        {getStatusIcon(selectedOrder.status)}
                        <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedOrder.status)}`}>
                          {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Payment Info */}
                <div className="bg-gray-50 p-3 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-2 flex items-center text-sm">
                    <CreditCard size={16} className="mr-2" />
                    Payment Information
                  </h3>
                  <div className="grid grid-cols-1 gap-3 text-sm">
                    <div>
                      <p><strong>Method:</strong> {(() => {
                        switch(selectedOrder.payment?.method) {
                          case 'cod': return 'Cash on Delivery';
                          case 'sadapay': return 'SadaPay';
                          case 'easypaisa': return 'EasyPaisa';
                          case 'bank': return 'Bank Transfer';
                          default: return selectedOrder.payment?.method || 'N/A';
                        }
                      })()}</p>
                      <p><strong>Subtotal:</strong> Rs. {((selectedOrder.payment?.total || 0) - 250).toFixed(2)}</p>
                      <p><strong>Shipping:</strong> Rs. 250</p>
                      <p className="font-medium"><strong>Total Amount:</strong> Rs. {(selectedOrder.payment?.total || 0).toFixed(2)}</p>
                    </div>
                    
                    {selectedOrder.payment?.screenshotUrl && (
                      <div className="flex justify-center">
                        <a
                          href={selectedOrder.payment.screenshotUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs"
                        >
                          <Download size={14} className="mr-1.5" />
                          View Payment Proof
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                {/* Order Items */}
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2 text-sm">Order Items</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full border border-gray-200 rounded-lg text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="text-left p-2 border-b">Product</th>
                          <th className="text-left p-2 border-b">Price</th>
                          <th className="text-left p-2 border-b">Qty</th>
                          <th className="text-left p-2 border-b">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedOrder.items?.map((item, index) => (
                          <tr key={index} className="border-b last:border-b-0">
                            <td className="p-2">{item.name || 'N/A'}</td>
                            <td className="p-2">Rs. {(item.price || 0).toFixed(2)}</td>
                            <td className="p-2">{item.quantity || 0}</td>
                            <td className="p-2 font-medium">Rs. {((item.price || 0) * (item.quantity || 0)).toFixed(2)}</td>
                          </tr>
                        )) || (
                          <tr>
                            <td colSpan={4} className="p-2 text-center text-gray-500">No items found</td>
                          </tr>
                        )}
                      </tbody>
                      <tfoot className="bg-gray-50">
                        <tr>
                          <td colSpan={3} className="p-2 text-right font-medium">Order Total:</td>
                          <td className="p-2 font-bold">Rs. {(selectedOrder.payment?.total || 0).toFixed(2)}</td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>

                {/* Close Button */}
                <div className="flex justify-end pt-3">
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="px-3 py-1.5 border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-50"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
