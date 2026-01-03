"use client";
import { useState, useEffect, use } from 'react'; // 'use' is needed for Next.js 13+ params
import API from '@/lib/api-client';
import { useRouter } from 'next/navigation';
import { ChevronRight, UploadCloud, Check } from 'lucide-react';

// Reusable Input Component (Same as Add Form)
const InputGroup = ({ label, type="text", placeholder, value, onChange }) => (
  <div className="mb-4">
      <label className="block text-sm font-semibold text-gray-700 mb-1">{label}</label>
      <input 
          type={type} 
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="w-full p-3 border border-gray-300 rounded-lg text-gray-900 bg-white placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
      />
  </div>
);

export default function EditProductPage({ params }) {
  // Unwrap params using React.use()
  const { id } = use(params);
  
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name: '', price: '', stock: '', category: '', description: '', imageUrl: '' });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const router = useRouter();

  // 1. Fetch Existing Data
  useEffect(() => {
    API.get(`/products/${id}`)
      .then(res => setForm(res.data))
      .catch(err => {
        alert("Failed to load product");
        router.push('/dashboard/products');
      })
      .finally(() => setFetching(false));
  }, [id, router]);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if(!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_PRESET); 
    
    setLoading(true);
    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, {
        method: 'POST', body: formData
      });
      const data = await res.json();
      setForm(prev => ({ ...prev, imageUrl: data.secure_url }));
    } catch(err) {
      alert("Image upload failed");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
        await API.put(`/products/${id}`, form);
        alert("Product updated successfully!");
        router.push('/dashboard/products');
    } catch (err) {
        alert("Failed to update product");
    }
  };

  if (fetching) return <div className="text-center py-20 font-bold text-gray-400">Loading Product Details...</div>;

  return (
    <div className="max-w-3xl mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
        <div className="text-sm font-medium text-gray-500">Step {step} of 3</div>
      </div>

      {/* Progress Bar */}
      <div className="flex mb-8 gap-2">
        {[1, 2, 3].map(s => (
          <div key={s} className={`h-2 flex-1 rounded-full transition-all ${step >= s ? 'bg-blue-600' : 'bg-gray-200'}`} />
        ))}
      </div>

      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
        {step === 1 && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900 border-b pb-2">Basic Information</h2>
            
            <InputGroup 
                label="Product Name" 
                value={form.name} 
                onChange={e => setForm({...form, name: e.target.value})} 
            />
            
            <InputGroup 
                label="Category" 
                value={form.category} 
                onChange={e => setForm({...form, category: e.target.value})} 
            />
            
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
                <textarea 
                    rows={4}
                    value={form.description || ''}
                    className="w-full p-3 border border-gray-300 rounded-lg text-gray-900 bg-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none"
                    onChange={e => setForm({...form, description: e.target.value})}
                />
            </div>
            
            <button onClick={() => setStep(2)} className="w-full py-3 bg-gray-900 text-white rounded-lg font-bold hover:bg-black flex items-center justify-center gap-2">
              Next Step <ChevronRight size={18}/>
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900 border-b pb-2">Inventory & Pricing</h2>
            <div className="grid grid-cols-2 gap-6">
                <InputGroup 
                    type="number" 
                    label="Price ($)" 
                    value={form.price} 
                    onChange={e => setForm({...form, price: e.target.value})} 
                />
                <InputGroup 
                    type="number" 
                    label="Stock Quantity" 
                    value={form.stock} 
                    onChange={e => setForm({...form, stock: e.target.value})} 
                />
            </div>
            <div className="flex gap-4">
              <button onClick={() => setStep(1)} className="flex-1 py-3 border border-gray-300 text-gray-700 font-bold rounded-lg hover:bg-gray-50">Back</button>
              <button onClick={() => setStep(3)} className="flex-1 py-3 bg-gray-900 text-white font-bold rounded-lg hover:bg-black">Next Step</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900 border-b pb-2">Update Image</h2>
            
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-10 text-center hover:bg-gray-50 transition cursor-pointer relative">
                <input type="file" onChange={handleUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                <div className="flex flex-col items-center">
                    {form.imageUrl ? (
                        <>
                           <img src={form.imageUrl} className="h-48 object-contain mb-4 rounded-md shadow-sm" alt="Preview" />
                           <p className="text-green-600 font-bold flex items-center gap-2"><Check size={18} /> Image Loaded</p>
                           <p className="text-xs text-gray-400 mt-1">Click to replace</p>
                        </>
                    ) : (
                        <UploadCloud size={48} className="text-gray-400 mb-4" />
                    )}
                </div>
            </div>

            <div className="flex gap-4 mt-6">
              <button onClick={() => setStep(2)} className="flex-1 py-3 border border-gray-300 text-gray-700 font-bold rounded-lg hover:bg-gray-50">Back</button>
              <button onClick={handleUpdate} disabled={loading} className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 shadow-lg disabled:opacity-50">
                Save Changes
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}