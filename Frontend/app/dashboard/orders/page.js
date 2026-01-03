"use client";
import { useEffect, useState } from 'react';
import API from '@/lib/api-client';
import { Eye, CheckCircle, Clock } from 'lucide-react';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    API.get('/orders/admin').then(res => setOrders(res.data)).catch(() => {});
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Customer Orders</h1>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-4 font-semibold text-gray-600">Order ID</th>
              <th className="px-6 py-4 font-semibold text-gray-600">Customer</th>
              <th className="px-6 py-4 font-semibold text-gray-600">Product</th>
              <th className="px-6 py-4 font-semibold text-gray-600">Total</th>
              <th className="px-6 py-4 font-semibold text-gray-600">Status</th>
              <th className="px-6 py-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {orders.length > 0 ? orders.map((order) => (
              <tr key={order._id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 font-mono text-xs text-blue-600">#{order._id.slice(-6)}</td>
                <td className="px-6 py-4 text-gray-700">{order.customerName}</td>
                <td className="px-6 py-4 text-gray-700">{order.items[0].productName}</td>
                <td className="px-6 py-4 font-bold">${order.totalAmount}</td>
                <td className="px-6 py-4">
                  <span className={`flex items-center gap-1 w-fit px-2 py-1 rounded text-xs font-bold ${
                    order.status === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {order.status === 'Paid' ? <CheckCircle size={12}/> : <Clock size={12}/>}
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-gray-400 hover:text-black transition"><Eye size={18}/></button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="6" className="text-center py-10 text-gray-400">No orders found. Start selling to see data!</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}