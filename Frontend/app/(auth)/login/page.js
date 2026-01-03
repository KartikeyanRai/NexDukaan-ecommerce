"use client";
import { useState } from 'react';
import { setCookie } from 'nookies';
import API from '@/lib/api-client';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await API.post('/auth/login', { email, password });
      
      setCookie(null, 'token', data.token, { maxAge: 30 * 24 * 60 * 60, path: '/' });
      setCookie(null, 'role', data.role, { maxAge: 30 * 24 * 60 * 60, path: '/' });
      
      window.location.href = data.role === 'admin' ? '/dashboard' : '/shop';
    } catch (err) { 
      alert(err.response?.data?.message || "Invalid Credentials"); 
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-extrabold text-gray-900">Welcome Back</h2>
        <p className="text-sm text-gray-500 mt-2">Sign in to your account</p>
      </div>

      <form onSubmit={handleLogin} className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
          <input 
            type="email" 
            placeholder="admin@example.com" 
            className="w-full p-3 border border-gray-300 rounded-lg text-gray-900 bg-white placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all shadow-sm"
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="block text-sm font-semibold text-gray-700">Password</label>
            <a href="#" className="text-xs text-green-600 font-bold hover:underline">Forgot password?</a>
          </div>
          <input 
            type="password" 
            placeholder="••••••••" 
            className="w-full p-3 border border-gray-300 rounded-lg text-gray-900 bg-white placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all shadow-sm"
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full py-3.5 bg-gray-900 text-white rounded-lg font-bold text-lg hover:bg-black hover:shadow-lg transform active:scale-95 transition-all disabled:opacity-70"
        >
          {loading ? 'Signing In...' : 'Sign In'}
        </button>
      </form>

      <div className="text-center">
        <p className="text-sm text-gray-600">
          Don't have an account?{' '}
          <Link href="/signup" className="text-green-600 font-bold hover:underline">
            Create Account
          </Link>
        </p>
      </div>
    </div>
  );
}