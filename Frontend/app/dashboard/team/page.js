"use client";
import { useState } from 'react';
import API from '@/lib/api-client';
import { UserPlus, Mail, Lock, User, CheckCircle, AlertCircle, ShieldCheck } from 'lucide-react';

export default function AddTeamMemberPage() {
  // Added 'currentPassword' to state
  const [formData, setFormData] = useState({ name: '', email: '', password: '', currentPassword: '' });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      await API.post('/auth/add-admin', formData);
      setStatus({ type: 'success', message: `Successfully authorized ${formData.name} as a co-owner!` });
      setFormData({ name: '', email: '', password: '', currentPassword: '' }); 
    } catch (err) {
      setStatus({ type: 'error', message: err.response?.data?.message || "Authorization failed" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gray-900 p-6 text-white text-center">
          <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-3 text-green-400">
            <UserPlus size={24} />
          </div>
          <h2 className="text-2xl font-black tracking-tight">Add Co-Owner</h2>
          <p className="text-green-400 text-sm mt-1">Grant full store access to a partner</p>
        </div>

        {/* Form */}
        <div className="p-8">
          {status.message && (
            <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${status.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
              {status.type === 'success' ? <CheckCircle size={20}/> : <AlertCircle size={20}/>}
              <p className="font-bold text-sm">{status.message}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* NEW MEMBER DETAILS */}
            <div className="space-y-4">
                <h3 className="text-sm font-bold text-gray-900 border-b pb-2 mb-4">1. New Member Details</h3>
                
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Full Name</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full pl-10 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 ring-blue-500 outline-none transition text-gray-600"
                      placeholder="Partner Name"
                      required
                    />
                    <User size={18} className="absolute left-3 top-3.5 text-gray-400"/>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Email Address</label>
                  <div className="relative">
                    <input 
                      type="email" 
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full pl-10 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 ring-blue-500 outline-none transition text-gray-600"
                      placeholder="partner@store.com"
                      required
                    />
                    <Mail size={18} className="absolute left-3 top-3.5 text-gray-400"/>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Set Password</label>
                  <div className="relative">
                    <input 
                      type="password" 
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      className="w-full pl-10 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 ring-blue-500 outline-none transition text-gray-600"
                      placeholder="New user's password"
                      required
                    />
                    <Lock size={18} className="absolute left-3 top-3.5 text-gray-400"/>
                  </div>
                </div>
            </div>

            {/* SECURITY CONFIRMATION */}
            <div className="pt-4 mt-6">
                <h3 className="text-sm font-bold text-red-600 border-b border-red-100 pb-2 mb-4 flex items-center gap-2">
                    <ShieldCheck size={16}/> 2. Security Verification
                </h3>
                <div className="bg-red-50 p-4 rounded-xl border border-red-100">
                    <label className="block text-xs font-bold text-red-800 uppercase tracking-widest mb-1">Your Current Password</label>
                    <div className="relative">
                        <input 
                        type="password" 
                        value={formData.currentPassword}
                        onChange={(e) => setFormData({...formData, currentPassword: e.target.value})}
                        className="w-full pl-10 p-3 bg-white border border-red-200 rounded-lg focus:ring-2 ring-red-500 outline-none transition placeholder-red-300 text-red-900"
                        placeholder="Confirm it's you"
                        required
                        />
                        <Lock size={18} className="absolute left-3 top-3.5 text-red-400"/>
                    </div>
                    <p className="text-xs text-red-500 mt-2">Required to prevent unauthorized access additions.</p>
                </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-4 bg-gray-900 text-white font-bold rounded-xl hover:bg-black transition shadow-lg disabled:opacity-70 mt-4"
            >
              {loading ? 'Verifying & Adding...' : 'Authorize New Admin'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}