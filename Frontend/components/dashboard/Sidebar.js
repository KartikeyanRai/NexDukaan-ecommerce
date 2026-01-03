// "use client";
// import Link from 'next/link';
// import { usePathname } from 'next/navigation';
// import { LayoutDashboard, ShoppingBag,ShoppingCart, Package, BarChart3, Users, UserPlus, LogOut } from 'lucide-react';
// import { destroyCookie } from 'nookies';


// const menuItems = [
//   { name: 'Home', icon: LayoutDashboard, href: '/dashboard' },
//   { name: 'Orders', icon: ShoppingBag, href: '/dashboard/orders' },
//   { name: 'Products', icon: Package, href: '/dashboard/products' },
//   { name: 'Analytics', icon: BarChart3, href: '/dashboard/analytics' },
//   { name: 'Add Admin', icon: UserPlus, href: '/dashboard/team' },
// ];

// export default function Sidebar() {
//   const pathname = usePathname();


//   const handleLogout = () => {
//     destroyCookie(null, 'token');
//     destroyCookie(null, 'role');
//     window.location.href = '/';
//   };

//   return (
//     <aside className="w-64 bg-[#1a1c23] text-gray-400 flex flex-col border-r border-gray-800">
      
//       <div className="p-6 text-white font-bold text-xl flex items-center gap-3">
//         {/* Changes:
//             1. w-12 h-12: Increased size from w-10 (40px) to w-12 (48px)
//             2. p-0: Removed padding so image fills the box
//         */}
//         <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center overflow-hidden shadow-[0_0_15px_rgba(34,197,94,0.4)]">
//           <img 
//             src="/app-icon.png" 
//             alt="NexDukaan Logo" 
//             // object-cover forces the image to fill the entire container area
//             className="w-full h-full object-cover" 
//           />
//         </div>
        
//         {/* App Name */}
//         <span className="tracking-tight text-gray-100">
//           NexDukaan
//         </span>
//       </div>

//       <nav className="flex-1 px-4 space-y-1">
//         {menuItems.map((item) => {
//           const isActive = pathname === item.href;
//           return (
//             <Link key={item.name} href={item.href}
//               className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
//                 isActive ? 'bg-green-600 text-white shadow-lg' : 'hover:bg-gray-800 hover:text-white'
//               }`}>
//               <item.icon size={20} />
//               <span className="font-medium">{item.name}</span>
//             </Link>
//           );
//         })}
//       </nav>
//       <button onClick={handleLogout} className="p-6 flex items-center gap-3 hover:text-red-400 border-t border-gray-800">
//         <LogOut size={20} /> Logout
//       </button>
//     </aside>
//   );
// }

"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { LayoutDashboard, Package, ShoppingCart, Users, LogOut, ChevronRight, BarChart3 } from 'lucide-react';
import { destroyCookie } from 'nookies';

export default function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Responsive: Auto-collapse on smaller screens (tablet/mobile)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsCollapsed(true);
      } else {
        setIsCollapsed(false);
      }
    };

    // Set initial state
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    destroyCookie(null, 'token');
    destroyCookie(null, 'role');
    window.location.href = '/';
  };

  const links = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Products', href: '/dashboard/products', icon: Package },
    { name: 'Orders', href: '/dashboard/orders', icon: ShoppingCart },
    { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
    { name: 'Team Access', href: '/dashboard/team', icon: Users },
  ];

  return (
    <aside 
      className={`h-screen bg-gray-900 text-white flex flex-col justify-between sticky top-0 transition-all duration-300 ease-in-out z-50 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      <div>
        {/* LOGO HEADER - CLICK TO TOGGLE */}
        <div 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-4 flex items-center gap-3 cursor-pointer hover:bg-gray-800 transition-colors border-b border-gray-800 h-20 overflow-hidden relative group"
          title={isCollapsed ? "Click to Expand" : "Click to Collapse"}
        >
          {/* Icon Container */}
          <div className={`shrink-0 w-12 h-12 bg-white rounded-xl flex items-center justify-center overflow-hidden shadow-[0_0_15px_rgba(34,197,94,0.4)] transition-transform duration-300 ${isCollapsed ? 'scale-90' : 'scale-100'}`}>
            <img 
              src="/app-icon.png" 
              alt="NexDukaan Logo" 
              className="w-full h-full object-cover" 
            />
          </div>
          
          {/* App Name & Toggle Hint */}
          <div className={`transition-opacity duration-300 flex flex-col justify-center ${isCollapsed ? 'opacity-0 w-0 hidden' : 'opacity-100 w-auto'}`}>
            <span className="font-semibold text-3xl tracking-tight text-gray-100 margin-10 whitespace-nowrap">
              NexDukaan
            </span>
             {/* Subtle hint that appears on hover when expanded */}
             <span className="text-[10px] text-gray-500 font-medium uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">
               {isCollapsed ? '' : ''}
             </span>
          </div>
        </div>

        {/* NAVIGATION LINKS */}
        <nav className="mt-6 px-3 space-y-2">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            
            return (
              <Link 
                key={link.name} 
                href={link.href}
                onClick={() => setIsCollapsed(false)} // Auto-expand when a link is clicked
                className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all group relative ${
                  isActive 
                    ? 'bg-green-600 text-white shadow-lg shadow-green-900/20' 
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                } ${isCollapsed ? 'justify-center' : ''}`}
              >
                <Icon size={22} className={`shrink-0 transition-transform duration-300 ${isCollapsed && isActive ? 'scale-110' : ''}`} />
                
                {/* Text Label */}
                <span className={`font-medium whitespace-nowrap transition-all duration-300 origin-left ${
                  isCollapsed ? 'w-0 opacity-0 overflow-hidden absolute' : 'w-auto opacity-100'
                }`}>
                  {link.name}
                </span>

                {/* Tooltip for Collapsed Mode */}
                {isCollapsed && (
                  <div className="absolute left-full ml-4 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none shadow-xl border border-gray-700">
                    {link.name}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* FOOTER / LOGOUT */}
      <div className="p-4 border-t border-gray-800">
        <button onClick={handleLogout}
          className={`flex items-center gap-3 w-full px-3 py-3 text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-lg transition-all ${isCollapsed ? 'justify-center' : ''}`}
        >
          <LogOut size={20} className="shrink-0" />
          <span className={`font-medium whitespace-nowrap transition-all duration-300 ${
            isCollapsed ? 'w-0 opacity-0 overflow-hidden' : 'w-auto opacity-100'
          }`}>
            Sign Out
          </span>
        </button>
      </div>
    </aside>
  );
}