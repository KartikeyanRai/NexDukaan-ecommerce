"use client";

import { useState } from 'react';
import { destroyCookie } from 'nookies';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, LogOut, Package } from 'lucide-react';
import Link from 'next/link';

export default function Navbar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('q') || '');

  const handleLogout = () => {
    destroyCookie(null, 'token');
    destroyCookie(null, 'role');
    router.replace('/login');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/shop?q=${encodeURIComponent(search)}`);
    }
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* --- LOGO SECTION (Updated) --- */}
          <Link href="/shop" className="flex items-center gap-3 group">
            {/* Same premium style as Sidebar: White bg, rounded, shadow glow */}
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center overflow-hidden shadow-[0_0_10px_rgba(34,197,94,0.3)] border border-gray-100 transition-transform group-hover:scale-105">
              <img 
                src="/app-icon.png" 
                alt="NexDukaan Logo" 
                className="w-full h-full object-cover" 
              />
            </div>
            <span className="font-bold text-xl text-green-500 tracking-tight">
              NexDukaan
            </span>
          </Link>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden md:flex items-center bg-gray-100 rounded-xl px-4 py-2 w-96 transition-all focus-within:ring-2 focus-within:ring-green-500/20 focus-within:bg-white border border-transparent focus-within:border-green-200">
            <Search size={18} className="text-gray-400 mr-2" />
            <input 
              type="text"
              placeholder="Search for products..."
              className="bg-transparent border-none outline-none text-sm w-full text-gray-700 placeholder-gray-400"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </form>

          {/* Right Icons */}
          <div className="flex items-center gap-6">
            <Link href="/orders" className="text-gray-500 hover:text-green-600 flex flex-col items-center text-[10px] font-medium gap-1 transition-colors">
              <Package size={22} />
              <span>Orders</span>
            </Link>
            
            <button onClick={handleLogout} className="text-gray-400 hover:text-red-500 flex flex-col items-center text-[10px] font-medium gap-1 transition-colors">
              <LogOut size={22} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}