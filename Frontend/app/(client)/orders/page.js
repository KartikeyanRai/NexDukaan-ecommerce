"use client";
import { useEffect, useState } from 'react';
import API from '@/lib/api-client';
import { Package, Calendar, Clock, CheckCircle, XCircle, Truck } from 'lucide-react';

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/orders/my-orders')
      .then(res => setOrders(res.data))
      .catch(err => console.error("Failed to load orders", err))
      .finally(() => setLoading(false));
  }, []);

  // Helper to get status color/icon
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Processing':
        return <span className="flex items-center gap-1 text-orange-600 bg-orange-50 px-3 py-1 rounded-full text-xs font-bold uppercase"><Clock size={14}/> Processing</span>;
        
      case 'Shipped':
        return <span className="flex items-center gap-1 text-blue-600 bg-blue-50 px-3 py-1 rounded-full text-xs font-bold uppercase"><Truck size={14}/> Shipped</span>;
      case 'Cancelled':
        return <span className="flex items-center gap-1 text-red-600 bg-red-50 px-3 py-1 rounded-full text-xs font-bold uppercase"><XCircle size={14}/> Cancelled</span>;
      default:
        return <span className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full text-xs font-bold uppercase"><CheckCircle size={14}/> Delivered</span>;
    }
  };

  if (loading) return <div className="text-center py-20 font-bold text-gray-400">Loading your history...</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-900">Order History</h1>
        <p className="text-gray-500">Track your past purchases and status.</p>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
          <Package size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-bold text-gray-900">No orders yet</h3>
          <p className="text-gray-500 mb-6">Looks like you haven't bought anything yet.</p>
          <a href="/shop" className="px-6 py-3 bg-gray-900 text-white rounded-lg font-bold hover:bg-black transition">
            Start Shopping
          </a>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition">
              {/* Order Header */}
              <div className="bg-gray-50 px-6 py-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-100">
                <div className="flex flex-col">
                   <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Order Placed</span>
                   <span className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                     <Calendar size={14} className="text-gray-400"/>
                     {new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                   </span>
                </div>
                <div className="flex flex-col">
                   <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Amount</span>
                   <span className="text-sm font-black text-gray-900">${order.totalAmount?.toFixed(2)}</span>
                </div>
                <div className="flex flex-col items-end">
                   <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Order # {order._id.slice(-6)}</span>
                   {getStatusBadge(order.status)}
                </div>
              </div>

              {/* Order Items */}
              <div className="p-6">
                 <div className="flex gap-4 items-center">
                    {/* Product Image */}
                    <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden shrink-0 border border-gray-200">
                       {order.product?.imageUrl ? (
                         <img src={order.product.imageUrl} alt="Product" className="w-full h-full object-cover" />
                       ) : (
                         <div className="w-full h-full flex items-center justify-center text-gray-400"><Package size={20}/></div>
                       )}
                    </div>
                    
                    {/* Product Details */}
                    <div className="flex-1">
                       <h4 className="font-bold text-gray-900 text-lg">
                         {order.product ? order.product.name : <span className="text-red-500 italic">Product Discontinued</span>}
                       </h4>
                       <p className="text-sm text-gray-500">Quantity: {order.quantity}</p>
                    </div>

                    {/* Price Calculation */}
                    <div className="text-right">
                       <p className="font-bold text-green-600">${order.product?.price}</p>
                       <p className="text-xs text-gray-400">per unit</p>
                    </div>
                 </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}