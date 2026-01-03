// "use client";
// import { useState, useEffect } from 'react';
// import API from '@/lib/api-client';
// import { useSearchParams } from 'next/navigation';
// import { ShoppingBag, X, Minus, Plus, ShoppingCart } from 'lucide-react';

// export default function ShopPage() {
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const searchParams = useSearchParams();
  
//   // Read the search query from the URL header
//   const searchQuery = searchParams.get('q') || '';
  
//   const [selectedProduct, setSelectedProduct] = useState(null);
//   const [quantity, setQuantity] = useState(1);
//   const [ordering, setOrdering] = useState(false);

//   const fetchProducts = () => {
//     setLoading(true);
//     API.get('/products')
//       .then(res => setProducts(res.data))
//       .catch(err => console.error(err))
//       .finally(() => setLoading(false));
//   };

//   useEffect(() => {
//     fetchProducts();
//   }, []);

//   // Filter based on URL search query
//   const filteredProducts = products.filter(product => 
//     product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//     product.category.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   const confirmPurchase = async () => {
//     if (!selectedProduct) return;
//     setOrdering(true);
//     try {
//       await API.post('/orders', { productId: selectedProduct._id, quantity });
//       alert("Order placed successfully!");
//       setSelectedProduct(null);
//       fetchProducts();
//     } catch (err) {
//       alert(err.response?.data?.message || "Order failed");
//     } finally {
//       setOrdering(false);
//     }
//   };

//   if (loading && products.length === 0) return <div className="text-center py-20 font-bold text-gray-400">Loading catalog...</div>;

//   return (
//     <div>
//       {/* Shop Header Info */}
//       <div className="mb-8">
//         <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tight">
//           {searchQuery ? `Search results for: "${searchQuery}"` : "Catalog"}
//         </h1>
//         <p className="text-gray-500">{filteredProducts.length} items available</p>
//       </div>
      
//       {/* Product Grid */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
//         {filteredProducts.map((product) => (
//           <div key={product._id} className="group bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300">
//             <div className="aspect-[4/5] bg-gray-50 relative overflow-hidden">
//               <img src={product.imageUrl} alt={product.name} className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500" />
//               <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-black text-gray-900 shadow-sm">
//                 ${product.price}
//               </div>
//             </div>
            
//             <div className="p-5 space-y-3">
//               <div>
//                 <span className="text-[10px] font-black text-green-600 uppercase tracking-widest">{product.category}</span>
//                 <h3 className="font-bold text-gray-900 text-lg line-clamp-1">{product.name}</h3>
//               </div>
              
//               <div className="flex items-center justify-between text-xs text-gray-400">
//                 <span>In Stock: {product.stock}</span>
//               </div>

//               <button 
//                 onClick={() => { setSelectedProduct(product); setQuantity(1); }}
//                 disabled={product.stock <= 0}
//                 className="w-full py-3 bg-gray-900 text-white rounded-xl font-bold text-sm hover:bg-green-600 transition-colors disabled:bg-gray-100 disabled:text-gray-400"
//               >
//                 {product.stock > 0 ? "ADD TO CART" : "OUT OF STOCK"}
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* --- CONFIRMATION MODAL --- */}
//       {selectedProduct && (
//         <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
//           <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden">
//             <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
//               <h3 className="text-lg font-black text-gray-900 uppercase">Review Your Order</h3>
//               <button onClick={() => setSelectedProduct(null)} className="p-2 hover:bg-gray-200 rounded-full transition">
//                 <X size={20} />
//               </button>
//             </div>

//             <div className="p-8 space-y-6">
//               <div className="flex gap-6">
//                 <div className="w-24 h-24 bg-gray-100 rounded-2xl overflow-hidden shadow-inner">
//                   <img src={selectedProduct.imageUrl} className="w-full h-full object-cover" />
//                 </div>
//                 <div className="flex flex-col justify-center">
//                   <h4 className="font-black text-xl text-gray-900">{selectedProduct.name}</h4>
//                   <p className="text-green-600 font-bold text-lg">${selectedProduct.price}</p>
//                 </div>
//               </div>

//               <div className="p-4 bg-gray-50 rounded-2xl flex items-center justify-between border border-gray-200">
//                 <span className="font-bold text-gray-600 uppercase text-xs">Quantity</span>
//                 <div className="flex items-center gap-5">
//                   <button onClick={() => quantity > 1 && setQuantity(q => q - 1)} className="w-10 h-10 rounded-xl bg-white shadow-sm border border-gray-200 flex items-center justify-center hover:bg-gray-100"><Minus size={16} /></button>
//                   <span className="font-black text-xl">{quantity}</span>
//                   <button onClick={() => quantity < selectedProduct.stock && setQuantity(q => q + 1)} className="w-10 h-10 rounded-xl bg-white shadow-sm border border-gray-200 flex items-center justify-center hover:bg-gray-100"><Plus size={16} /></button>
//                 </div>
//               </div>

//               <div className="flex justify-between items-center p-4 bg-green-50 rounded-2xl border border-green-100">
//                 <span className="font-bold text-green-800 text-sm uppercase">Order Total</span>
//                 <span className="text-2xl font-black text-green-900">${(selectedProduct.price * quantity).toFixed(2)}</span>
//               </div>
//             </div>

//             <div className="p-8 pt-0 flex gap-4">
//               <button onClick={confirmPurchase} disabled={ordering} className="flex-1 py-4 bg-gray-900 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-green-600 transition shadow-xl flex justify-center items-center gap-3">
//                 <ShoppingCart size={18} />
//                 {ordering ? 'Confirming...' : 'Place Order'}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }



"use client";
import { useState, useEffect } from 'react';
import API from '@/lib/api-client';
import { useSearchParams } from 'next/navigation';
import { X, Minus, Plus, CreditCard, Lock, CheckCircle, Loader2 } from 'lucide-react';

export default function ShopPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('q') || '';
  
  // Modal States
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [paymentStep, setPaymentStep] = useState('review'); 

  useEffect(() => {
    setLoading(true);
    API.get('/products')
      .then(res => setProducts(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // --- FIXED HANDLE PAYMENT ---
  const handlePayment = async (e) => {
    e.preventDefault();
    setPaymentStep('processing');

    try {
      // Calls the NEW checkout route
      await API.post('/orders/checkout', { 
        productId: selectedProduct._id, 
        quantity: quantity
      });

      setPaymentStep('success');
      
      setTimeout(() => {
        setSelectedProduct(null);
        setPaymentStep('review');
        // Refresh products to update stock on the page
        API.get('/products').then(res => setProducts(res.data));
      }, 2000);

    } catch (err) {
      alert(err.response?.data?.message || "Transaction Failed");
      setPaymentStep('payment');
    }
  };

  const closeModal = () => {
    setSelectedProduct(null);
    setPaymentStep('review');
    setQuantity(1);
  };

  if (loading) return <div className="text-center py-20 font-bold text-gray-400">Loading catalog...</div>;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tight">
          {searchQuery ? `Search: "${searchQuery}"` : "Catalog"}
        </h1>
        <p className="text-gray-500">{filteredProducts.length} items available</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {filteredProducts.map((product) => (
          <div key={product._id} className="group bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300">
            <div className="aspect-[4/5] bg-gray-50 relative overflow-hidden">
              <img src={product.imageUrl} alt={product.name} className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500" />
              {product.stock <= 0 && <div className="absolute inset-0 bg-white/60 flex items-center justify-center"><span className="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase">Sold Out</span></div>}
            </div>
            
            <div className="p-5 space-y-3">
              <div>
                <span className="text-[10px] font-black text-green-600 uppercase tracking-widest">{product.category}</span>
                <h3 className="font-bold text-gray-900 text-lg line-clamp-1">{product.name}</h3>
                <span className="font-bold text-gray-900">${product.price}</span>
              </div>
              
              <button 
                onClick={() => { setSelectedProduct(product); setQuantity(1); }}
                disabled={product.stock <= 0}
                className="w-full py-3 bg-gray-900 text-white rounded-xl font-bold text-sm hover:bg-green-600 transition-colors disabled:bg-gray-100 disabled:text-gray-400"
              >
                {product.stock > 0 ? "BUY NOW" : "OUT OF STOCK"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedProduct && (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden relative min-h-[400px] flex flex-col">
            
            {paymentStep === 'review' && (
              <>
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                  <h3 className="text-lg font-black text-gray-900 uppercase">Review Order</h3>
                  <button onClick={closeModal}><X size={20} className="text-gray-400 hover:text-black"/></button>
                </div>
                <div className="p-8 space-y-6 flex-1">
                  <div className="flex gap-4">
                    <img src={selectedProduct.imageUrl} className="w-20 h-20 rounded-lg object-cover bg-gray-100"/>
                    <div>
                      <h4 className="font-bold text-gray-900">{selectedProduct.name}</h4>
                      <p className="text-green-600 font-bold">${selectedProduct.price}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between bg-gray-50 p-3 rounded-xl border">
                    <span className="text-sm font-bold text-gray-500">Quantity</span>
                    <div className="flex items-center gap-3">
                      <button onClick={() => quantity > 1 && setQuantity(q => q - 1)} className="w-8 h-8 bg-white border rounded-lg flex items-center justify-center"><Minus size={14}/></button>
                      <span className="font-bold">{quantity}</span>
                      <button onClick={() => quantity < selectedProduct.stock && setQuantity(q => q + 1)} className="w-8 h-8 bg-white border rounded-lg flex items-center justify-center"><Plus size={14}/></button>
                    </div>
                  </div>
                  <div className="flex justify-between text-lg font-black text-gray-900 pt-4 border-t">
                    <span>Total</span>
                    <span>${(selectedProduct.price * quantity).toFixed(2)}</span>
                  </div>
                </div>
                <div className="p-6 pt-0">
                  <button onClick={() => setPaymentStep('payment')} className="w-full py-4 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition">
                    Proceed to Payment
                  </button>
                </div>
              </>
            )}

            {paymentStep === 'payment' && (
              <form onSubmit={handlePayment} className="flex flex-col h-full">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                  <h3 className="text-lg font-black text-gray-900 uppercase flex items-center gap-2">
                    <Lock size={16} className="text-green-600"/> Secure Payment
                  </h3>
                  <button type="button" onClick={() => setPaymentStep('review')} className="text-sm font-bold text-gray-500 hover:underline">Back</button>
                </div>
                <div className="p-8 space-y-4 flex-1">
                  <div className="bg-blue-50 p-4 rounded-xl text-sm text-blue-700 mb-4 border border-blue-100">
                    <p className="font-bold">Test Mode Enabled</p>
                    <p>Enter any random details. No money will be deducted.</p>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Card Number</label>
                    <div className="relative">
                      <input type="text" placeholder="0000 0000 0000 0000" className="w-full p-3 pl-10 border rounded-lg font-mono text-gray-700 outline-none focus:ring-2 ring-blue-500" required />
                      <CreditCard className="absolute left-3 top-3.5 text-gray-400" size={18} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Expiry</label>
                      <input type="text" placeholder="MM/YY" className="w-full p-3 border rounded-lg font-mono text-gray-700 outline-none focus:ring-2 ring-blue-500" required />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase mb-1">CVV</label>
                      <input type="password" placeholder="123" className="w-full p-3 border rounded-lg font-mono text-gray-700 outline-none focus:ring-2 ring-blue-500" required />
                    </div>
                  </div>
                </div>
                <div className="p-6 pt-0">
                  <button type="submit" className="w-full py-4 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 shadow-lg transition">
                    Pay ${(selectedProduct.price * quantity).toFixed(2)}
                  </button>
                </div>
              </form>
            )}

            {paymentStep === 'processing' && (
              <div className="flex flex-col items-center justify-center h-[500px] text-center p-8">
                <Loader2 size={64} className="text-blue-600 animate-spin mb-6" />
                <h3 className="text-xl font-bold text-gray-900">Processing Transaction...</h3>
                <p className="text-gray-500 mt-2">Please do not close this window.</p>
              </div>
            )}

            {paymentStep === 'success' && (
              <div className="flex flex-col items-center justify-center h-[500px] text-center p-8">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 animate-in zoom-in duration-300">
                  <CheckCircle size={40} className="text-green-600" />
                </div>
                <h3 className="text-2xl font-black text-gray-900">Payment Successful!</h3>
                <p className="text-gray-500 mt-2">Your order has been placed successfully.</p>
                <p className="text-xs text-gray-400 mt-8">Redirecting...</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}