

"use client";
import { useState } from 'react';
import { setCookie } from 'nookies';
import API from '@/lib/api-client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Store, User, Mail, Lock } from 'lucide-react'; // Added icons for better UI

export default function SignupPage() {
  // Added 'storeName' to initial state
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'client', storeName: '' });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await API.post('/auth/register', formData);
      setCookie(null, 'token', data.token, { maxAge: 30 * 24 * 60 * 60, path: '/' });
      setCookie(null, 'role', data.role, { maxAge: 30 * 24 * 60 * 60, path: '/' });
      
      if (data.role === 'admin') router.push('/dashboard');
      else router.push('/shop');
      
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-extrabold text-gray-900">Create Account</h2>
        <p className="text-sm text-gray-500 mt-2">Join the modern e-commerce ecosystem</p>
      </div>

      <form onSubmit={handleSignup} className="space-y-5">
        <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
            <div className="relative">
              <input 
                type="text" 
                placeholder="John Doe" 
                className="w-full pl-10 p-3 border border-gray-300 rounded-lg text-gray-900 bg-white placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all shadow-sm"
                onChange={(e) => setFormData({...formData, name: e.target.value})} 
                required 
              />
              <User size={18} className="absolute left-3 top-3.5 text-gray-400" />
            </div>
        </div>

        <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
            <div className="relative">
              <input 
                type="email" 
                placeholder="john@example.com" 
                className="w-full pl-10 p-3 border border-gray-300 rounded-lg text-gray-900 bg-white placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all shadow-sm"
                onChange={(e) => setFormData({...formData, email: e.target.value})} 
                required 
              />
              <Mail size={18} className="absolute left-3 top-3.5 text-gray-400" />
            </div>
        </div>

        <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
            <div className="relative">
              <input 
                type="password" 
                placeholder="••••••••" 
                className="w-full pl-10 p-3 border border-gray-300 rounded-lg text-gray-900 bg-white placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all shadow-sm"
                onChange={(e) => setFormData({...formData, password: e.target.value})} 
                required 
              />
              <Lock size={18} className="absolute left-3 top-3.5 text-gray-400" />
            </div>
        </div>
        
        {/* Role Selector */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">I am a...</label>
          <div className="grid grid-cols-2 gap-3">
            <button 
              type="button" 
              onClick={() => setFormData({...formData, role: 'client'})}
              className={`py-3 rounded-lg text-sm font-bold border transition-all ${
                formData.role === 'client' 
                  ? 'bg-gray-900 text-white border-gray-900 shadow-md' 
                  : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'
              }`}
            >
              Customer
            </button>
            <button 
              type="button" 
              onClick={() => setFormData({...formData, role: 'admin'})}
              className={`py-3 rounded-lg text-sm font-bold border transition-all ${
                formData.role === 'admin' 
                  ? 'bg-gray-900 text-white border-gray-900 shadow-md' 
                  : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'
              }`}
            >
              Store Owner
            </button>
          </div>
        </div>

        {/* --- NEW: STORE NAME INPUT (Conditional) --- */}
        {formData.role === 'admin' && (
          <div className="animate-in fade-in slide-in-from-top-2 duration-300 bg-green-50 p-4 rounded-xl border border-green-100">
              <label className="block text-sm font-bold text-green-800 mb-1">Store Name</label>
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="e.g. Nike Outlet" 
                  className="w-full pl-10 p-3 border border-green-200 rounded-lg text-gray-900 bg-white focus:ring-2 focus:ring-green-500 outline-none"
                  onChange={(e) => setFormData({...formData, storeName: e.target.value})} 
                  required 
                />
                <Store size={18} className="absolute left-3 top-3.5 text-green-600" />
              </div>
              <p className="text-xs text-green-600 mt-2 font-medium">
                This will create a dedicated workspace for your shop.
              </p>
          </div>
        )}

        <button 
          type="submit" 
          disabled={loading}
          className="w-full py-3.5 bg-green-600 text-white rounded-lg font-bold text-lg hover:bg-green-700 hover:shadow-lg transform active:scale-95 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? 'Creating Account...' : 'Sign Up'}
        </button>
      </form>

      <div className="text-center">
        <p className="text-sm text-gray-600">
          Already have an account?{' '}
          <Link href="/login" className="text-green-600 font-bold hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}