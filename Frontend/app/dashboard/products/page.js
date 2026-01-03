"use client";
import { useEffect, useState } from 'react';
import API from '@/lib/api-client';
import Link from 'next/link';
// Added 'AlertTriangle' for the warning icon
import { Edit, Trash2, Plus, Download, AlertTriangle, Search } from 'lucide-react';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // CONFIGURATION: Change this number to set your alert limit
  const LOW_STOCK_THRESHOLD = 5;

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = () => {
    API.get('/products/dashboard')
      .then(res => setProducts(res.data))
      .catch(err => alert("Failed to fetch products"))
      .finally(() => setLoading(false));
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      await API.delete(`/products/${id}`);
      setProducts(products.filter(p => p._id !== id));
    } catch (err) {
      alert("Delete failed");
    }
  };

  const handleExport = async () => {
    try {
      const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];

      // const response = await fetch('http://localhost:5000/api/products/export/csv', {
      //   headers: { 'Authorization': `Bearer ${token}` }
      // });

      const API_URL = process.env.NEXT_PUBLIC_API_URL; 

      const response = await fetch(`${API_URL}/products/export/csv`, {
          headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Export failed');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `inventory_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      alert("Failed to download CSV");
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="p-8 text-center text-gray-400 font-bold">Loading Inventory...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Products</h1>
          <p className="text-gray-500">Manage your inventory & stock</p>
        </div>
        
        <div className="flex gap-3">
          <button 
            onClick={handleExport}
            className="flex items-center gap-2 px-5 py-3 bg-white border border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition shadow-sm"
          >
            <Download size={18} />
            Export CSV
          </button>

          <Link href="/dashboard/products/new">
            <button className="flex items-center gap-2 px-5 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition shadow-xl">
              <Plus size={18} />
              Add Product
            </button>
          </Link>
        </div>
      </div>

      <div className="relative">
        <input 
          type="text" 
          placeholder="Search products..." 
          className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition"
          onChange={(e) => setSearch(e.target.value)}
        />
        <Search className="absolute left-3 top-3.5 text-gray-400" size={18} />
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-widest border-b border-gray-100">
              <th className="p-4 font-bold">Product</th>
              <th className="p-4 font-bold">Category</th>
              <th className="p-4 font-bold">Price</th>
              <th className="p-4 font-bold">Stock</th>
              <th className="p-4 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredProducts.map((product) => (
              <tr key={product._id} className="hover:bg-gray-50/50 transition">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden shrink-0 border border-gray-200">
                      {product.imageUrl && <img src={product.imageUrl} className="w-full h-full object-cover" />}
                    </div>
                    <span className="font-bold text-gray-900">{product.name}</span>
                  </div>
                </td>
                <td className="p-4 text-sm text-gray-500">{product.category}</td>
                <td className="p-4 font-bold text-gray-900">${product.price}</td>
                
                {/* --- STOCK ALERT LOGIC HERE --- */}
                <td className="p-4">
                  {product.stock <= LOW_STOCK_THRESHOLD ? (
                    <div className="flex items-center gap-2 text-red-600 bg-red-50 px-3 py-1 rounded-full w-fit border border-red-100 animate-pulse">
                      <AlertTriangle size={14} />
                      <span className="text-xs font-bold">{product.stock} (Low)</span>
                    </div>
                  ) : (
                    <span className="text-gray-600 font-medium ml-2">{product.stock}</span>
                  )}
                </td>

                <td className="p-4 text-right flex justify-end gap-2">
                  <Link href={`/dashboard/products/edit/${product._id}`}>
                    <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition">
                      <Edit size={18} />
                    </button>
                  </Link>
                  <button 
                    onClick={() => handleDelete(product._id)} 
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredProducts.length === 0 && (
          <div className="p-8 text-center text-gray-400">No products found.</div>
        )}
      </div>
    </div>
  );
}