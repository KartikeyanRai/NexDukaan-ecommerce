


"use client";
import Link from 'next/link';
import { destroyCookie } from 'nookies';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, LogOut, ShoppingBag, Package } from 'lucide-react'; // Added Package icon

export default function ClientLayout({ children }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSearch = searchParams.get('q') || '';

  const handleLogout = () => {
    destroyCookie(null, 'token');
    destroyCookie(null, 'role');
    router.push('/login');
  };

  const handleSearch = (term) => {
    const params = new URLSearchParams(searchParams);
    if (term) params.set('q', term);
    else params.delete('q');
    router.replace(`/shop?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 px-4 md:px-8 py-3 flex flex-col md:flex-row justify-between items-center sticky top-0 z-50 gap-4">
        
        {/* Logo & Links */}
        <div className="flex items-center gap-8 w-full md:w-auto">
          <Link href="/shop" className="text-xl font-black tracking-tighter flex items-center gap-2">
            <div className="bg-green-600 border-3 border-gray-900 text-white p-1 rounded">
              <ShoppingBag size={20} />
            </div>
            <span className='text-gray-900'>NEX</span><span className="text-green-600">DUKAAN</span>
          </Link>
          
          <div className="hidden md:flex gap-6">
            <Link href="/shop" className="text-sm font-bold text-gray-600 hover:text-green-600 transition">
              Browse Products
            </Link>
            {/* NEW LINK ADDED HERE */}
            <Link href="/orders" className="text-sm font-bold text-gray-600 hover:text-green-600 transition">
              My Orders
            </Link>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-1/3">
          <input 
            type="text" 
            placeholder="Search for products..." 
            defaultValue={currentSearch}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-100 border-transparent border focus:bg-white focus:border-green-500 rounded-full text-sm text-gray-900 outline-none transition-all"
          />
          <Search className="absolute left-3.5 top-2.5 text-gray-400" size={16} />
        </div>

        {/* User Actions */}
        <div className="flex items-center gap-4 w-full md:w-auto justify-end">
          {/* Mobile Only Link */}
          <Link href="/orders" className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
             <Package size={20} />
          </Link>
          
          <button 
            onClick={handleLogout} 
            className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-gray-700 hover:bg-gray-100 rounded-lg transition"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </nav>

      <main className="p-4 md:p-8 max-w-7xl mx-auto">
        {children}
      </main>
    </div>
  );
}