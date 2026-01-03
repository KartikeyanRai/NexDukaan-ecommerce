export const dynamic = 'force-dynamic';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center">
      <div className="text-center space-y-6 max-w-3xl px-4">
        <h1 className="text-6xl font-black text-gray-900 leading-tight">
          Everything you need to <span className="text-green-600">sell online.</span>
        </h1>
        <p className="text-xl text-gray-500">
          Manage your inventory, track sales, or shop the collection.
        </p>
        
        {/* Admin / Owner Actions */}
        <div className="pt-8 space-y-4">
          <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider">For Store Owners</p>
          <div className="flex gap-4 justify-center">
            <Link 
              href="/login" 
              className="px-8 py-3 bg-white text-gray-900 border-2 border-gray-200 rounded-lg font-bold hover:border-gray-900 hover:bg-gray-50 transition"
            >
              Log In
            </Link>
            <Link 
              href="/signup" 
              className="px-8 py-3 bg-gray-900 text-white border-2 border-gray-900 rounded-lg font-bold hover:bg-gray-800 transition shadow-lg"
            >
              Create Account
            </Link>
          </div>
        </div>

        {/* Divider */}
        <div className="relative py-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="bg-white px-2 text-sm text-gray-500">OR</span>
          </div>
        </div>

        {/* Customer Actions */}
        <div className="space-y-4">
           <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider">For Customers</p>
           <Link 
             href="/shop" 
             className="inline-block px-10 py-4 bg-green-600 text-white rounded-full font-bold text-lg hover:bg-green-700 hover:shadow-xl transition transform hover:-translate-y-1"
           >
             🛍️ Browse Shop & Buy
           </Link>
        </div>

      </div>
    </div>
  );
}