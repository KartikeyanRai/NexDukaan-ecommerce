
import Navbar from '@/components/Navbar';

// You can now safely export metadata if you want (Optional)
export const metadata = {
  title: 'NexDukaan Shop',
  description: 'Your favorite local e-commerce store',
};

export default function ClientLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* The Navbar handles all the client-side hooks */}
      <Navbar />
      
      {/* The children (pages) are rendered below */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}