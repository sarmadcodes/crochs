import React, { useState, useEffect, useCallback } from 'react';
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
  AlertCircle
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

export const AdminPanel: React.FC<AdminPanelProps> = ({ setActiveSection }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [updating, setUpdating] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // Function to fetch orders directly from Firestore
  const fetchOrders = useCallback(async () => {
    try {
      setError(null);
      console.log('Attempting to fetch orders from Firestore...');
      
      const ordersRef = collection(db, 'orders');
      const q = query(ordersRef, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      
      console.log('Raw snapshot:', snapshot);
      console.log('Snapshot docs length:', snapshot.docs.length);
      
      const ordersData = snapshot.docs.map(doc => {
        const data = doc.data();
        console.log('Document data:', { id: doc.id, ...data });
        return {
          id: doc.id,
          ...data
        };
      }) as Order[];
      
      console.log('Processed orders data:', ordersData);
      setOrders(ordersData);
      console.log(`Successfully fetched ${ordersData.length} orders from database`);
      
      if (ordersData.length === 0) {
        console.log('No orders found in database');
      }
      
    } catch (error) {
      console.error('Error fetching orders:', error);
      console.error('Error details:', {
        name: error?.name,
        message: error?.message,
        code: error?.code
      });
      setError(`Failed to fetch orders: ${error?.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Manual refresh function
  const handleRefresh = async () => {
    console.log('Manual refresh triggered');
    setRefreshing(true);
    setLoading(true);
    await fetchOrders();
  };

  // Effect for initial load and setting up real-time listener
  useEffect(() => {
    let unsubscribe: (() => void) | null = null;
    let isMounted = true;

    const initializeData = async () => {
      console.log('Initializing admin panel data...');
      
      // Always fetch orders first
      await fetchOrders();

      // Set up real-time listener only if component is still mounted
      if (isMounted) {
        try {
          console.log('Setting up real-time listener...');
          const ordersRef = collection(db, 'orders');
          const q = query(ordersRef, orderBy('createdAt', 'desc'));
          
          unsubscribe = onSnapshot(q, 
            (snapshot) => {
              if (!isMounted) return;
              
              console.log('Real-time update received');
              const ordersData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
              })) as Order[];
              
              console.log(`Real-time update: ${ordersData.length} orders`);
              setOrders(ordersData);
              setError(null);
            }, 
            (error) => {
              if (!isMounted) return;
              
              console.error('Real-time listener error:', error);
              setError(`Real-time sync error: ${error.message}`);
              
              // Fallback to manual fetch on listener error
              console.log('Falling back to manual fetch due to listener error');
              fetchOrders();
            }
          );
          
          console.log('Real-time listener set up successfully');
          
        } catch (error) {
          console.error('Error setting up real-time listener:', error);
          console.log('Continuing without real-time updates');
        }
      }
    };

    initializeData();

    // Cleanup function
    return () => {
      console.log('Cleaning up admin panel...');
      isMounted = false;
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []); // Remove fetchOrders from dependency array to prevent infinite loop

  // Auto-retry on error
  useEffect(() => {
    if (error && orders.length === 0 && !loading) {
      console.log('Auto-retry triggered due to error with no orders');
      const retryTimer = setTimeout(() => {
        console.log('Retrying to fetch orders after error...');
        fetchOrders();
      }, 3000);

      return () => clearTimeout(retryTimer);
    }
  }, [error, orders.length, loading, fetchOrders]);

  // Force refresh every 30 seconds as backup
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (!refreshing && !loading) {
        console.log('Periodic refresh check...');
        fetchOrders();
      }
    }, 30000); // 30 seconds

    return () => clearInterval(intervalId);
  }, [fetchOrders, refreshing, loading]);

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    setUpdating(orderId);
    try {
      console.log(`Updating order ${orderId} status to ${newStatus}`);
      await updateDoc(doc(db, 'orders', orderId), { 
        status: newStatus,
        updatedAt: Timestamp.now()
      });
      
      // Update local state immediately for better UX
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId 
            ? { ...order, status: newStatus as Order['status'] }
            : order
        )
      );
      
      console.log(`Successfully updated order ${orderId} status`);
    } catch (error) {
      console.error('Error updating order:', error);
      alert('Failed to update order status');
      // Refresh orders to get the correct state
      fetchOrders();
    } finally {
      setUpdating(null);
    }
  };

  const deleteOrder = async (orderId: string) => {
    if (window.confirm('Are you sure you want to delete this order? This action cannot be undone.')) {
      try {
        console.log(`Deleting order ${orderId}`);
        await deleteDoc(doc(db, 'orders', orderId));
        
        // Update local state immediately
        setOrders(prevOrders => prevOrders.filter(order => order.id !== orderId));
        
        if (selectedOrder?.id === orderId) {
          setSelectedOrder(null);
        }
        
        console.log(`Successfully deleted order ${orderId}`);
      } catch (error) {
        console.error('Error deleting order:', error);
        alert('Failed to delete order');
        // Refresh orders to get the correct state
        fetchOrders();
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

  if (loading) {
    return (
      <div className="pt-24 pb-16 min-h-screen">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center h-64">
            <RefreshCw className="animate-spin mr-2" size={24} />
            <span>Loading orders from database...</span>
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
          
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`mr-2 ${refreshing ? 'animate-spin' : ''}`} size={16} />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>

        {/* Debug Info (remove in production) */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="text-sm text-blue-800">
            <p><strong>Debug Info:</strong></p>
            <p>Orders in state: {orders.length}</p>
            <p>Loading: {loading.toString()}</p>
            <p>Error: {error || 'None'}</p>
            <p>Filtered orders: {filteredOrders.length}</p>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <AlertCircle className="text-red-500 mr-2" size={20} />
              <div>
                <p className="text-red-800 font-medium">Error loading orders</p>
                <p className="text-red-600 text-sm">{error}</p>
                <button
                  onClick={fetchOrders}
                  className="text-red-700 underline text-sm mt-1 hover:no-underline"
                >
                  Try again
                </button>
              </div>
            </div>
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
                      {orders.length === 0 ? (
                        <div>
                          <p>No orders found in database</p>
                          <button
                            onClick={fetchOrders}
                            className="text-pink-600 hover:text-pink-700 underline mt-2"
                          >
                            Refresh to check again
                          </button>
                        </div>
                      ) : (
                        'No orders match your filters'
                      )}
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
                          {order.createdAt ? formatDate(order.createdAt) : 'N/A'}
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
                        {selectedOrder.createdAt ? formatDate(selectedOrder.createdAt) : 'N/A'}
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
