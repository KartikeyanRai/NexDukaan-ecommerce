"use client";
import { useEffect, useState } from 'react';
import API from '@/lib/api-client';
import { Store, User } from 'lucide-react';

export default function Topbar() {
  const [storeName, setStoreName] = useState("Loading...");
  const [adminName, setAdminName] = useState("");

  useEffect(() => {
    // Fetch the profile to get the dynamic store name
    API.get('/auth/profile')
      .then(res => {
        // If the user has a store, show its name. Otherwise show a default.
        setStoreName(res.data.store?.name || "Dashboard");
        setAdminName(res.data.name);
      })
      .catch(err => console.error("Failed to load profile"));
  }, []);

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-10">
      {/* LEFT SIDE: Store Name (Replaces Search Bar) */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-green-100 rounded-lg text-green-700">
          <Store size={20} />
        </div>
        <div>
          <h2 className="font-black text-gray-900 text-lg tracking-tight leading-none">
            {storeName}
          </h2>
          <span className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">
            Store Admin Panel
          </span>
        </div>
      </div>

      {/* RIGHT SIDE: Admin Profile */}
      <div className="flex items-center gap-4">
        <div className="text-right hidden sm:block">
          <p className="text-sm font-bold text-gray-900">{adminName}</p>
          <p className="text-xs text-green-600 font-medium">● Active</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-600 font-bold">
          <User size={20} />
        </div>
      </div>
    </header>
  );
}