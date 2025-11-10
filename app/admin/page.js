import { head } from '@vercel/blob';
import { isValidPassword } from '../../lib/auth.js'; 
import AdminDashboardClient from './AdminDashboardClient.js'; 
import Link from 'next/link';
import { Suspense } from 'react'; // <-- Suspense کو امپورٹ کریں
import ProductList from './ProductList.js'; // <-- ہماری نئی پروڈکٹ لسٹ

export const dynamic = 'force-dynamic';

// --- لاگ ان پیج (ویسا ہی) ---
function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
      <div className="w-full max-w-xs p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-xl font-bold text-center mb-4">Admin Panel Login</h1>
        <form method="GET" action="/admin" className="space-y-4">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            Login
          </button>
        </form>
        <Link href="/" className="block text-center text-sm text-blue-500 hover:underline mt-4">
          ← Go back to Home
        </Link>
      </div>
    </div>
  );
}

// --- پروڈکٹ لسٹ کے لیے لوڈنگ (Loading) انڈیکیٹر ---
function ProductsLoading() {
  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-2">Manage Products</h2>
      <div className="text-center text-gray-400 mt-10">
        <p>Loading products...</p>
      </div>
    </div>
  );
}

// --- مین پیج ---
export default async function AdminPage({ searchParams }) {
  
  const passwordQuery = searchParams.password;
  
  if (await isValidPassword(passwordQuery)) {
    // --- پاس ورڈ ٹھیک ہے ---
    
    // 1. لوگو URL (تیز) کو فوراً لوڈ کریں
    let logoUrl = "https://hnt5qthrn2hkqfn9.public.blob.vercel-storage.com/logo.png";
    try {
      const logoBlob = await head('logo.png', { cache: 'no-store' });
      logoUrl = logoBlob.url; 
    } catch (error) { /* ... */ }

    // 2. پروڈکٹ لسٹ (سست) کو لوڈ نہ کریں
    
    return (
      <AdminDashboardClient 
        logoUrl={logoUrl} 
        passwordQuery={passwordQuery} 
      >
        {/* --- یہ ہے حل 1 --- */}
        {/* یہ شیل (Shell) کو فوراً دکھائے گا اور 'ProductList' کا انتظار کرے گا */}
        <Suspense fallback={<ProductsLoading />}>
          <ProductList />
        </Suspense>
        {/* --- حل ختم --- */}
      </AdminDashboardClient>
    );
    
  } else {
    // --- پاس ورڈ غلط ہے ---
    return <LoginPage />;
  }
}
