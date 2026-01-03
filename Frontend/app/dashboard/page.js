"use client";
import { useEffect, useState } from 'react';
import API from '@/lib/api-client';
import { DollarSign, Package, ShoppingCart, TrendingUp, BarChart3, LineChart as LineIcon } from 'lucide-react';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, 
  CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';

export default function DashboardOverview() {
  const [data, setData] = useState({
    revenue: 0, orders: 0, products: 0, 
    salesChart: [], inventoryChart: []  // ,growth: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // FIX: Added timestamp to prevent caching of old admin data
    API.get(`/admin/stats?_t=${Date.now()}`)
      .then(res => setData(res.data))
      .catch(err => console.error("Dashboard Sync Error:", err))
      .finally(() => setLoading(false));
  }, []);

  const metrics = [
    { label: 'Total Revenue', value: `$${data.revenue?.toLocaleString() || 0}`, icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Orders', value: data.orders, icon: ShoppingCart, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Products', value: data.products, icon: Package, color: 'text-violet-600', bg: 'bg-violet-50' },
    // { label: 'Growth', value: `+${data.growth}%`, icon: TrendingUp, color: 'text-orange-600', bg: 'bg-orange-50' },
  ];

  if (loading) return (
    <div className="flex h-96 items-center justify-center">
        <div className="text-center animate-pulse">
            <div className="h-8 w-8 bg-green-500 rounded-full mx-auto mb-4 animate-bounce"></div>
            <p className="font-bold text-gray-400">Syncing Store Data...</p>
        </div>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header>
        <h1 className="text-3xl font-black text-gray-900 tracking-tight uppercase">Performance Overview</h1>
        <p className="text-gray-500 font-medium">Real-time data for your specific store.</p>
      </header>
      
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((card, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 transition-all hover:shadow-md hover:border-gray-200">
            <div className={`p-4 rounded-xl ${card.bg} ${card.color}`}>
              <card.icon size={24} />
            </div>
            <div>
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest">{card.label}</p>
              <h3 className="text-2xl font-black text-gray-900">{card.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Sales Line Chart */}
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2 mb-8">
            <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg"><LineIcon size={20}/></div>
            <h3 className="font-black text-gray-900 uppercase text-sm tracking-tighter">Revenue Trends (Last 7 Days)</h3>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.salesChart}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} 
                />
                <Line type="monotone" dataKey="amount" stroke="#10b981" strokeWidth={4} dot={{ r: 6, fill: '#10b981', strokeWidth: 3, stroke: '#fff' }} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Inventory Bar Chart */}
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2 mb-8">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><BarChart3 size={20}/></div>
            <h3 className="font-black text-gray-900 uppercase text-sm tracking-tighter">Inventory Levels (By Product)</h3>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.inventoryChart}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '16px', border: 'none'}} />
                <Bar dataKey="stock" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}