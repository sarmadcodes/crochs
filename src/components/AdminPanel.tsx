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
import { db } from '../Firebase';
import { 
  RefreshCw, 
  Eye, 
  Edit, 
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
  LogOut
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
}

interface Payment {
  method: 'cod' | 'bank';
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

// Simple Login Component
const AdminLogin: React.FC<{ onLogin: () => void }> = ({ onLogin }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // You can change this password as needed
  const ADMIN_PASSWORD = 'admin123';

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Simulate a brief loading time for better UX
    setTimeout(() => {
      if (password === ADMIN_PASSWORD) {
        // Store login status in memory instead of localStorage
        onLogin();
      } else {
        setError('Invalid password. Please try again.');
      }
      setLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-red-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-pink-100 rounded-full mb-4">
            <Lock className="text-pink-600" size={32} />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Admin Login</h1>
          <p className="text-gray-600">Enter your password to access the admin panel</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-300 focus:border-pink-500 outline-none"
              placeholder="Enter admin password"
              required
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-pink-600 to-red-500 text-white py-3 px-4 rounded-lg hover:from-pink-700 hover:to-red-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <>
                <RefreshCw className="animate-spin mr-2" size={20} />
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Default password: <code className="bg-gray-100 px-2 py-1 rounded">admin123</code></p>
        </div>
      </div>
    </div>
  );
};

export const AdminPanel: React.FC<AdminPanelProps> = ({ setActiveSection }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [updating, setUpdating] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Initialize login state and fetch orders
  useEffect(() => {
    setIsLoggedIn(true); // Auto-login for this session
    fetchOrders();
  }, []);

  // Fetch orders function with better error handling
  const fetchOrders = async () => {
    try {
      setLoading(isInitialLoad);
      setError(null);
      
      const ordersRef = collection(db, 'orders');
      const q = query(ordersRef, orderBy('createdAt', 'desc'));
      
      // Use getDocs for a one-time fetch first
      const snapshot = await getDocs(q);
      const ordersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Order[];
      
      setOrders(ordersData);
      setIsInitialLoad(false);
      setLoading(false);
      
      // Then set up real-time listener
      const unsubscribe = onSnapshot(
        q, 
        (snapshot) => {
          try {
            const updatedOrdersData = snapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
            })) as Order[];
            
            setOrders(updatedOrdersData);
            setError(null);
          } catch (err) {
            console.error('Error processing real-time orders data:', err);
            setError('Error processing orders data');
          }
        }, 
        (error) => {
          console.error('Real-time listener error:', error);
          setError('Connection to database lost. Data may not be up to date.');
        }
      );

      // Return cleanup function
      return unsubscribe;

    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Failed to fetch orders. Please check your connection and try again.');
      setLoading(false);
      setIsInitialLoad(false);
    }
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setOrders([]);
    setSelectedOrder(null);
    setActiveSection('home');
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    setUpdating(orderId);
    try {
      await updateDoc(doc(db, 'orders', orderId), { 
        status: newStatus,
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Error updating order:', error);
      alert('Failed to update order status. Please try again.');
    } finally {
      setUpdating(null);
    }
  };

  const deleteOrder = async (orderId: string) => {
    if (window.confirm('Are you sure you want to delete this order? This action cannot be undone.')) {
      try {
        await deleteDoc(doc(db, 'orders', orderId));
        if (selectedOrder?.id === orderId) {
          setSelectedOrder(null);
        }
      } catch (error) {
        console.error('Error deleting order:', error);
        alert('Failed to delete order. Please try again.');
      }
    }
  };

  const retryFetch = () => {
    setError(null);
    fetchOrders();
  };

  const manualRefresh = () => {
    setError(null);
    fetchOrders();
  };

  const filteredOrders = orders.filter(order => {
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    const matchesSearch = searchTerm === '' || 
      order.customer?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
      return 'Invalid date';
    }
  };

  const getTotalRevenue = () => {
    return orders
      .filter(order => order.status !== 'cancelled')
      .reduce((total, order) => total + (order.payment?.total || 0), 0);
  };

  const getOrderStats = () => {
    const stats = {
      total: orders.length,
      pending: orders.filter(o => o.status === 'pending').length,
      confirmed: orders.filter(o => o.status === 'confirmed').length,
      shipped: orders.filter(o => o.status === 'shipped').length,
      delivered: orders.filter(o => o.status === 'delivered').length,
      cancelled: orders.filter(o => o.status === 'cancelled').length,
    };
    return stats;
  };

  // Show login screen if not logged in
  if (!isLoggedIn) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  if (loading && isInitialLoad) {
    return (
      <div className="pt-24 pb-16 min-h-screen">
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
    <div className="pt-24 pb-16 min-h-screen bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <button 
              onClick={() => setActiveSection('home')}
              className="flex items-center text-pink-700 hover:text-red-500 transition-colors mr-4"
            >
              <ArrowLeft size={20} />
              <span className="ml-1">Back to Home</span>
            </button>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-red-500 bg-clip-text text-transparent">
              Admin Panel
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={manualRefresh}
              className="flex items-center px-4 py-2 text-gray-600 hover:text-pink-600 transition-colors border border-gray-300 rounded-lg hover:border-pink-300"
              title="Refresh Orders"
            >
              <RefreshCw size={20} className="mr-2" />
              Refresh
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center px-4 py-2 text-gray-600 hover:text-red-600 transition-colors"
            >
              <LogOut size={20} className="mr-2" />
              Logout
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center justify-between">
            <span>{error}</span>
            <button
              onClick={retryFetch}
              className="flex items-center px-3 py-1 bg-red-100 hover:bg-red-200 rounded text-sm transition-colors"
            >
              <RefreshCw size={16} className="mr-1" />
              Retry
            </button>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Orders</p>
                <p className="text-2xl font-bold text-gray-800">{getOrderStats().total}</p>
              </div>
              <Package className="text-pink-500" size={32} />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-800">${getTotalRevenue().toFixed(2)}</p>
              </div>
              <DollarSign className="text-green-500" size={32} />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Pending Orders</p>
                <p className="text-2xl font-bold text-yellow-600">{getOrderStats().pending}</p>
              </div>
              <Clock className="text-yellow-500" size={32} />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Delivered Orders</p>
                <p className="text-2xl font-bold text-green-600">{getOrderStats().delivered}</p>
              </div>
              <CheckCircle className="text-green-500" size={32} />
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search by customer name, email, or order ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-300 focus:border-pink-500 outline-none"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Filter size={20} className="text-gray-500" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-300 focus:border-pink-500 outline-none"
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

        {/* Orders Table */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left p-4 font-medium text-gray-700">Order ID</th>
                  <th className="text-left p-4 font-medium text-gray-700">Customer</th>
                  <th className="text-left p-4 font-medium text-gray-700">Items</th>
                  <th className="text-left p-4 font-medium text-gray-700">Total</th>
                  <th className="text-left p-4 font-medium text-gray-700">Payment</th>
                  <th className="text-left p-4 font-medium text-gray-700">Status</th>
                  <th className="text-left p-4 font-medium text-gray-700">Date</th>
                  <th className="text-left p-4 font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center p-8 text-gray-500">
                      {orders.length === 0 ? 'No orders found' : 'No orders match your filters'}
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr key={order.id} className="border-b hover:bg-gray-50">
                      <td className="p-4">
                        <span className="font-mono text-sm text-gray-600">
                          #{order.id.slice(-8)}
                        </span>
                      </td>
                      <td className="p-4">
                        <div>
                          <p className="font-medium text-gray-800">{order.customer?.fullName || 'N/A'}</p>
                          <p className="text-sm text-gray-600">{order.customer?.email || 'N/A'}</p>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="text-sm text-gray-600">
                          {order.items?.length || 0} item{(order.items?.length || 0) !== 1 ? 's' : ''}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="font-medium text-gray-800">
                          ${(order.payment?.total || 0).toFixed(2)}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          order.payment?.method === 'cod' 
                            ? 'bg-orange-100 text-orange-800' 
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {order.payment?.method === 'cod' ? 'COD' : 'Bank Transfer'}
                        </span>
                      </td>
                      <td className="p-4">
                        <select
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                          disabled={updating === order.id}
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)} ${
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
                      <td className="p-4">
                        <span className="text-sm text-gray-600">
                          {formatDate(order.createdAt)}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => deleteOrder(order.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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

        {/* Order Details Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-800">
                    Order Details #{selectedOrder.id.slice(-8)}
                  </h2>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <XCircle size={24} />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Customer Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                      <User size={20} className="mr-2" />
                      Customer Information
                    </h3>
                    <div className="space-y-2">
                      <p><strong>Name:</strong> {selectedOrder.customer?.fullName || 'N/A'}</p>
                      <p className="flex items-center">
                        <Mail size={16} className="mr-2" />
                        {selectedOrder.customer?.email || 'N/A'}
                      </p>
                      <p className="flex items-center">
                        <Phone size={16} className="mr-2" />
                        {selectedOrder.customer?.phone || 'N/A'}
                      </p>
                      <p className="flex items-start">
                        <MapPin size={16} className="mr-2 mt-1" />
                        {selectedOrder.customer?.address || 'N/A'}
                      </p>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                      <Package size={20} className="mr-2" />
                      Order Information
                    </h3>
                    <div className="space-y-2">
                      <p><strong>Order ID:</strong> {selectedOrder.id}</p>
                      <p className="flex items-center">
                        <Calendar size={16} className="mr-2" />
                        {formatDate(selectedOrder.createdAt)}
                      </p>
                      <p className="flex items-center">
                        {getStatusIcon(selectedOrder.status)}
                        <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedOrder.status)}`}>
                          {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Payment Info */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                    <CreditCard size={20} className="mr-2" />
                    Payment Information
                  </h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <p><strong>Method:</strong> {selectedOrder.payment?.method === 'cod' ? 'Cash on Delivery' : 'Bank Transfer'}</p>
                      <p><strong>Total Amount:</strong> ${(selectedOrder.payment?.total || 0).toFixed(2)}</p>
                    </div>
                    {selectedOrder.payment?.screenshotUrl && (
                      <a
                        href={selectedOrder.payment.screenshotUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Download size={16} className="mr-2" />
                        View Payment Proof
                      </a>
                    )}
                  </div>
                </div>

                {/* Order Items */}
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3">Order Items</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full border border-gray-200 rounded-lg">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="text-left p-3 border-b">Product</th>
                          <th className="text-left p-3 border-b">Price</th>
                          <th className="text-left p-3 border-b">Quantity</th>
                          <th className="text-left p-3 border-b">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(selectedOrder.items || []).map((item, index) => (
                          <tr key={index} className="border-b last:border-b-0">
                            <td className="p-3">{item.name || 'N/A'}</td>
                            <td className="p-3">${(item.price || 0).toFixed(2)}</td>
                            <td className="p-3">{item.quantity || 0}</td>
                            <td className="p-3 font-medium">${(item.totalPrice || 0).toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
