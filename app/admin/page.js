// app/admin/page.js

import { head } from '@vercel/blob';
import { isValidPassword } from '../../lib/auth.js'; 
import AdminDashboardClient from './AdminDashboardClient.js'; // یہ ویسے ہی رہے گا
import Link from 'next/link';

export const dynamic = 'force-dynamic';

// --- لاگ ان پیج (ویسا ہی) ---
function LoginPage() {
  // ... (یہاں آپ کا لاگ ان فارم والا سارا کوڈ ویسے ہی رہے گا)
  // ... (میں اسے مختصر رکھنے کے لیے ہٹا رہا ہوں)
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

// --- نئے ڈیش بورڈ بٹن کے آئیکنز ---
function IconAdd() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
  );
}
function IconManage() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
      <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
    </svg>
  );
}
function IconSettings() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0M3.75 18H7.5m3-6h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0M3.75 12H7.5" />
    </svg>
  );
}

// --- مین پیج ---
export default async function AdminPage({ searchParams }) {
  
  const passwordQuery = searchParams.password;
  
  if (await isValidPassword(passwordQuery)) {
    // --- پاس ورڈ ٹھیک ہے ---
    
    // لوگو URL (تیز) کو فوراً لوڈ کریں
    let logoUrl = "https://hnt5qthrn2hkqfn9.public.blob.vercel-storage.com/logo.png";
    try {
      const logoBlob = await head('logo.png', { cache: 'no-store' });
      logoUrl = logoBlob.url; 
    } catch (error) { /* ... */ }

    // پروڈکٹ لسٹ (سست) کو یہاں سے ہٹا دیا گیا ہے
    
    return (
      <AdminDashboardClient 
        logoUrl={logoUrl} 
        passwordQuery={passwordQuery} 
      >
        {/* --- یہ ہے آپ کا نیا 3-بٹن والا ڈیش بورڈ --- */}
        <div className="p-4 space-y-4 mt-4">
          <Link 
            href={`/admin/add-product?password=${passwordQuery}`}
            className="flex items-center gap-4 p-5 bg-blue-50 border border-blue-200 rounded-lg shadow-sm hover:bg-blue-100 transition-all"
          >
            <IconAdd className="text-blue-600" />
            <div>
              <h2 className="text-lg font-semibold text-blue-800">Add New Product</h2>
              <p className="text-sm text-blue-600">Click here to upload a new item.</p>
            </div>
          </Link>
          
          <Link 
            href={`/admin/manage-products?password=${passwordQuery}`}
            className="flex items-center gap-4 p-5 bg-green-50 border border-green-200 rounded-lg shadow-sm hover:bg-green-100 transition-all"
          >
            <IconManage className="text-green-600" />
            <div>
              <h2 className="text-lg font-semibold text-green-800">Manage Products</h2>
              <p className="text-sm text-green-600">View, edit, or delete existing items.</p>
            </div>
          </Link>
          
          <Link 
            href={`/admin/settings?password=${passwordQuery}`}
            className="flex items-center gap-4 p-5 bg-gray-50 border border-gray-200 rounded-lg shadow-sm hover:bg-gray-100 transition-all"
          >
            <IconSettings className="text-gray-600" />
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Admin Settings</h2>
              <p className="text-sm text-gray-600">Change title, logo, or password.</p>
            </div>
          </Link>
        </div>
        {/* --- نیا ڈیش بورڈ ختم --- */}
      </AdminDashboardClient>
    );
    
  } else {
    // --- پاس ورڈ غلط ہے ---
    return <LoginPage />;
  }
}
