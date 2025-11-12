// app/admin/page.js

import { head } from '@vercel/blob';
import { isValidPassword } from '../../lib/auth.js'; 
import AdminDashboardClient from './AdminDashboardClient.js'; 
import Link from 'next/link';
import { kv } from '@vercel/kv'; // <-- ✅ 1. KV کو امپورٹ کریں

export const dynamic = 'force-dynamic';

// --- لاگ ان پیج (ویسا ہی) ---
function LoginPage() {
  // ... (آپ کا لاگ ان فارم والا سارا کوڈ یہاں آئے گا)
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

// --- نئے ڈیش بورڈ بٹن کے آئیکنز (ویسے ہی) ---
function IconAdd() { /* ... (کوڈ ویسا ہی) ... */ }
function IconManage() { /* ... (کوڈ ویسا ہی) ... */ }
function IconSettings() { /* ... (کوڈ ویسا ہی) ... */ }

// --- ✅ 2. وزٹر Stats دکھانے کا کمپوننٹ ---
function VisitorStats({ today, total }) {
  return (
    <div className="mt-6 grid grid-cols-2 gap-4">
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg shadow-sm text-center">
        <div className="text-sm font-medium text-blue-600">Today's Visitors</div>
        <div className="text-3xl font-bold text-blue-900">{today}</div>
      </div>
      <div className="p-4 bg-green-50 border border-green-200 rounded-lg shadow-sm text-center">
        <div className="text-sm font-medium text-green-600">Total Visitors</div>
        <div className="text-3xl font-bold text-green-900">{total}</div>
      </div>
    </div>
  );
}

// --- ✅ 3. ڈیٹا لوڈ کرنے کا نیا فنکشن ---
async function loadData() {
  let logoUrl = "https://hnt5qthrn2hkqfn9.public.blob.vercel-storage.com/logo.png";
  let earning = "0.00";
  let todayVisitors = 0;
  let totalVisitors = 0;

  try {
    const logoBlob = await head('logo.png', { cache: 'no-store' });
    logoUrl = logoBlob.url; 
  } catch (error) {}

  try {
    // KV سے وزٹر کاؤنٹ حاصل کریں
    const today = new Date().toLocaleString('sv-SE', { 
      timeZone: 'Asia/Karachi' 
    }).split(' ')[0];
    
    [todayVisitors, totalVisitors] = await Promise.all([
      kv.get(`visits:${today}`),
      kv.get('total_visitors')
    ]);
  } catch (error) {
    console.error("Admin KV Error:", error.message);
  }
  
  try {
    // ads.json سے ارننگ حاصل کریں (اگر موجود ہے)
    const adsBlob = await head('ads.json', { cache: 'no-store' });
    const response = await fetch(adsBlob.url, { cache: 'no-store' });
    if (response.ok) {
      const adsSettings = await response.json();
      if (adsSettings.earning) {
        earning = adsSettings.earning;
      }
    }
  } catch (error) {}

  return {
    logoUrl,
    earning,
    todayVisitors: todayVisitors || 0,
    totalVisitors: totalVisitors || 0,
  };
}


// --- مین پیج (اپ ڈیٹ شدہ) ---
export default async function AdminPage({ searchParams }) {
  
  const passwordQuery = searchParams.password;
  
  if (await isValidPassword(passwordQuery)) {
    // --- پاس ورڈ ٹھیک ہے ---
    
    // --- ✅ 4. نیا ڈیٹا لوڈ کریں ---
    const { logoUrl, earning, todayVisitors, totalVisitors } = await loadData();

    return (
      <AdminDashboardClient 
        logoUrl={logoUrl} 
        earning={earning} // <-- ✅ ارننگ کو ہیڈر میں بھیجیں
        passwordQuery={passwordQuery} 
      >
        {/* --- یہ ہے آپ کا نیا 3-بٹن والا ڈیش بورڈ --- */}
        <div className="p-4 mt-4">
          <div className="space-y-4">
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
          
          {/* --- ✅ 5. وزٹر کاؤنٹر یہاں دکھائیں --- */}
          <VisitorStats today={todayVisitors} total={totalVisitors} />
          
        </div>
        {/* --- نیا ڈیش بورڈ ختم --- */}
      </AdminDashboardClient>
    );
    
  } else {
    // --- پاس ورڈ غلط ہے ---
    return <LoginPage />;
  }
}
