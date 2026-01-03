
export const dynamic = 'force-dynamic';
"use client";
import { useEffect, useState } from 'react';
import API from '@/lib/api-client';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, PieChart, Pie, Cell, Legend 
} from 'recharts';
import { PieChart as PieIcon, Activity, Layers, Target } from 'lucide-react';

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState({ 
    categories: [], 
    kpi: { activeCategories: 0, fulfillmentRate: 0, avgOrderValue: 0 } 
  });
  const [salesTrend, setSalesTrend] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // FIX: Added timestamp to force fresh fetch
    const t = Date.now();
    
    Promise.all([
      API.get(`/admin/stats?_t=${t}`),      
      API.get(`/admin/analytics?_t=${t}`)  
    ]).then(([statsRes, analyticsRes]) => {
      // Safety checks in case data is missing
      setSalesTrend(statsRes.data?.salesChart || []);
      setAnalytics(analyticsRes.data || { categories: [], kpi: {} });
    }).catch(err => console.error("Analytics Error:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex h-96 items-center justify-center">
        <div className="text-center animate-pulse">
            <div className="h-8 w-8 bg-blue-500 rounded-full mx-auto mb-4 animate-bounce"></div>
            <p className="font-bold text-gray-400">Calculating Metrics...</p>
        </div>
    </div>
  );

  return (
    <div className="space-y-8 pb-12">
      <header>
        <h1 className="text-3xl font-black text-gray-900 tracking-tight uppercase">Advanced Analytics</h1>
        <p className="text-gray-500 font-medium">Deep dive into your inventory distribution and sales velocity.</p>
      </header>

      {/* --- REAL DATA ANALYTICS GRID --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Metric 1 */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <Layers className="text-blue-600 mb-2" size={20} />
          <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Active Categories</p>
          <h3 className="text-3xl font-black text-gray-900">
            {analytics.kpi?.activeCategories || 0}
          </h3>
          <p className="text-xs text-gray-400 mt-1">Unique product types</p>
        </div>

        {/* Metric 2 */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <Target className="text-emerald-600 mb-2" size={20} />
          <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Fulfillment Rate</p>
          <h3 className="text-3xl font-black text-gray-900">
            {analytics.kpi?.fulfillmentRate || 0}%
          </h3>
          <p className="text-xs text-gray-400 mt-1">Based on paid orders</p>
        </div>

        {/* Metric 3 */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <Activity className="text-orange-600 mb-2" size={20} />
          <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Avg. Order Value</p>
          <h3 className="text-3xl font-black text-gray-900">
            ${analytics.kpi?.avgOrderValue || 0}
          </h3>
          <p className="text-xs text-gray-400 mt-1">Revenue per transaction</p>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sales Area Chart */}
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <h3 className="font-black text-gray-900 uppercase text-sm tracking-tighter mb-8 flex items-center gap-2">
            <Activity size={18} className="text-emerald-500" /> Revenue Growth Velocity
          </h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesTrend}>
                <defs>
                  <linearGradient id="colorAmt" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)'}} 
                />
                <Area type="monotone" dataKey="amount" stroke="#10b981" fillOpacity={1} fill="url(#colorAmt)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Pie Chart */}
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <h3 className="font-black text-gray-900 uppercase text-sm tracking-tighter mb-8 flex items-center gap-2">
            <PieIcon size={18} className="text-blue-500" /> Stock by Category
          </h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={analytics.categories || []}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {(analytics.categories || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend iconType="circle" wrapperStyle={{paddingTop: '20px'}} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}