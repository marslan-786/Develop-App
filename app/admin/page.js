import { head } from '@vercel/blob';
import { isValidPassword } from '../../lib/auth.js'; // پاتھ چیک کریں
import AdminDashboardClient from './AdminDashboardClient.js'; // ہمارا نیا کلائنٹ کمپوننٹ
import Link from 'next/link';

// Vercel کو بتاتا ہے کہ اس پیج کو کیش نہ کرے
export const dynamic = 'force-dynamic';

// --- لاگ ان پیج (اس میں کوئی تبدیلی نہیں) ---
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

// --- مین پیج (جو فیصلہ کرتا ہے کہ کیا دکھانا ہے) ---
export default async function AdminPage({ searchParams }) {
  
  const passwordQuery = searchParams.password;
  
  // 1. پاس ورڈ چیک کریں
  if (await isValidPassword(passwordQuery)) {
    
    // --- پاس ورڈ ٹھیک ہے: ڈیش بورڈ دکھائیں ---
    
    // 2. لوگو URL حاصل کریں (کیش بسٹر کے ساتھ)
    let logoUrl = "https://hnt5qthrn2hkqfn9.public.blob.vercel-storage.com/logo.png";
    try {
      const logoBlob = await head('logo.png', { cache: 'no-store' });
      logoUrl = logoBlob.url; 
    } catch (error) {
      console.warn("Admin Panel: Could not fetch 'logo.png'. Using hardcoded fallback.");
    }

    // 3. پروڈکٹس کی لسٹ حاصل کریں
    let products = [];
    try {
      const dataBlob = await head('data.json', { cache: 'no-store' });
      const dataResponse = await fetch(dataBlob.url, { cache: 'no-store' });
      if (dataResponse.ok) {
        const textData = await dataResponse.text();
        if (textData) products = JSON.parse(textData);
      }
    } catch (error) {
      console.warn("Admin Panel: Could not fetch products.", error.message);
    }
    
    // 4. تمام ڈیٹا کلائنٹ کمپوننٹ کو پاس کریں
    return (
      <AdminDashboardClient 
        initialProducts={products} 
        logoUrl={logoUrl} 
        passwordQuery={passwordQuery} 
      />
    );
    
  } else {
    // --- پاس ورڈ غلط ہے: لاگ ان پیج دکھائیں ---
    return <LoginPage />;
  }
}
