import { head } from '@vercel/blob';
import { isValidPassword } from '../../lib/auth.js'; 
import AdminDashboardClient from './AdminDashboardClient.js'; 
import Link from 'next/link';
import { kv } from '@vercel/kv';

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

// --- بٹنوں کے لیے رنگین آئیکنز ---
function IconAdd() {
  return (
    <div className="p-3 bg-blue-100 rounded-full text-blue-600">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>
    </div>
  );
}
function IconManage() {
  return (
    <div className="p-3 bg-green-100 rounded-full text-green-600">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
        <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
      </svg>
    </div>
  );
}
function IconSettings() {
  return (
    <div className="p-3 bg-gray-100 rounded-full text-gray-600">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0M3.75 18H7.5m3-6h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0M3.75 12H7.5" />
      </svg>
    </div>
  );
}

// --- وزٹر Stats دکھانے کا کمپوننٹ ---
function VisitorStats({ today, total }) {
  return (
    <div className="mt-8 grid grid-cols-2 gap-4">
      <div className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-blue-50 to-white border border-blue-100 rounded-2xl shadow-sm text-center">
        <div className="text-sm font-medium text-blue-500 uppercase tracking-wide mb-1">Today</div>
        <div className="text-4xl font-bold text-blue-900">{today}</div>
        <div className="text-xs text-blue-400 mt-1">Visitors</div>
      </div>
      <div className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-green-50 to-white border border-green-100 rounded-2xl shadow-sm text-center">
        <div className="text-sm font-medium text-green-500 uppercase tracking-wide mb-1">Total</div>
        <div className="text-4xl font-bold text-green-900">{total}</div>
        <div className="text-xs text-green-400 mt-1">Visitors</div>
      </div>
    </div>
  );
}

// --- ڈیٹا لوڈ کرنے کا فنکشن ---
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
    const today = new Date().toLocaleString('sv-SE', { timeZone: 'Asia/Karachi' }).split(' ')[0];
    [todayVisitors, totalVisitors] = await Promise.all([
      kv.get(`visits:${today}`),
      kv.get('total_visitors')
    ]);
  } catch (error) {
    console.error("Admin KV Error:", error.message);
  }
  
  try {
    const adsBlob = await head('ads.json', { cache: 'no-store' });
    const response = await fetch(adsBlob.url, { cache: 'no-store' });
    if (response.ok) {
      const adsSettings = await response.json();
      if (adsSettings.earning) {
        earning = adsSettings.earning;
      }
    }
  } catch (error) {}

  return { logoUrl, earning, todayVisitors: todayVisitors || 0, totalVisitors: totalVisitors || 0 };
}


// --- مین پیج ---
export default async function AdminPage({ searchParams }) {
  
  const passwordQuery = searchParams.password;
  
  if (await isValidPassword(passwordQuery)) {
    const { logoUrl, earning, todayVisitors, totalVisitors } = await loadData();

    return (
      <AdminDashboardClient 
        logoUrl={logoUrl} 
        earning={earning}
        passwordQuery={passwordQuery} 
      >
        {/* --- مین سینٹرڈ کنٹینر --- */}
        <div className="max-w-lg mx-auto py-8 px-4 flex flex-col justify-center min-h-[60vh]">
          
          {/* بٹنوں کی لسٹ */}
          <div className="space-y-4 w-full">
            <Link 
              href={`/admin/add-product?password=${passwordQuery}`}
              className="flex items-center gap-5 p-4 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md hover:border-blue-200 transition-all group"
            >
              <IconAdd />
              <div>
                <h2 className="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition-colors">Add New Product</h2>
                <p className="text-sm text-gray-500">Click here to upload a new item.</p>
              </div>
            </Link>
            
            <Link 
              href={`/admin/manage-products?password=${passwordQuery}`}
              className="flex items-center gap-5 p-4 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md hover:border-green-200 transition-all group"
            >
              <IconManage />
              <div>
                <h2 className="text-lg font-bold text-gray-800 group-hover:text-green-600 transition-colors">Manage Products</h2>
                <p className="text-sm text-gray-500">View, edit, or delete items.</p>
              </div>
            </Link>
            
            <Link 
              href={`/admin/settings?password=${passwordQuery}`}
              className="flex items-center gap-5 p-4 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md hover:border-gray-200 transition-all group"
            >
              <IconSettings />
              <div>
                <h2 className="text-lg font-bold text-gray-800 group-hover:text-gray-600 transition-colors">Admin Settings</h2>
                <p className="text-sm text-gray-500">Change title, logo, or password.</p>
              </div>
            </Link>
          </div>
          
          {/* وزٹر کاؤنٹر */}
          <VisitorStats today={todayVisitors} total={totalVisitors} />
          
        </div>
      </AdminDashboardClient>
    );
    
  } else {
    return <LoginPage />;
  }
}
