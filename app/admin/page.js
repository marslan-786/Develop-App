import Link from 'next/link';
import Image from 'next/image';
import { head } from '@vercel/blob';

// --- Icon Components (صرف ایک بار ڈیفائن کیے گئے) ---
function IconSettings() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0M3.75 18H7.5m3-6h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0M3.75 12H7.5" />
    </svg>
  );
}
function IconSearch() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
    </svg>
  );
}
function IconPlus() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
  );
}
// --- (آئیکنز ختم) ---


// --- 1. لاگ ان پیج ---
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
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
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

// --- 2. ایڈمن ڈیش بورڈ ---
function AdminDashboard({ logoUrl, passwordQuery }) {
  const sessionQuery = `?password=${passwordQuery}`;

  return (
    <div className="relative min-h-screen bg-gray-50 pb-20">
      {/* --- ہیڈر --- */}
      <header className="sticky top-0 z-10 flex items-center justify-between p-4 bg-white shadow-md">
        <Link href={`/admin/settings${sessionQuery}`} className="p-2 rounded-full hover:bg-gray-100">
          <IconSettings />
        </Link>
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-200">
            <Image src={logoUrl} alt="Logo" width={40} height={40} className="object-cover" />
          </div>
          <h1 className="text-xl font-bold whitespace-nowrap">Admin Panel</h1>
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-200">
            <Image src={logoUrl} alt="Logo" width={40} height={40} className="object-cover" />
          </div>
        </div>
        <button className="p-2 rounded-full hover:bg-gray-100">
          <IconSearch />
        </button>
      </header>

      {/* --- پروڈکٹ لسٹ (ابھی خالی) --- */}
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-2">Manage Products</h2>
        <div className="text-center text-gray-400 mt-10">
          <p>No products added yet.</p>
          <p className="text-sm">Use the '+' button below to add your first product.</p>
        </div>
      </div>

      {/* --- فلوٹنگ '+' بٹن --- */}
      <Link
        href={`/admin/add-product${sessionQuery}`}
        className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-transform hover:scale-105"
      >
        <IconPlus />
      </Link>
    </div>
  );
}

// --- 3. ہائبرڈ پاس ورڈ چیکر فنکشن ---
async function isValidPassword(enteredPassword) {
  if (!enteredPassword) {
    return false;
  }

  // 1. ماسٹر پاس ورڈ (Vercel Environment سے) چیک کریں
  const masterPassword = process.env.ADMIN_PASSWORD;
  if (enteredPassword === masterPassword) {
    return true; // لاگ ان کامیاب
  }

  // 2. لاگ ان پاس ورڈ (Vercel Blob سے) چیک کریں
  try {
    const blob = await head('password.json');
    const response = await fetch(blob.url);
    if (!response.ok) {
      throw new Error('Blob password not found or unreadable');
    }
    
    const data = await response.json();
    const blobPassword = data.password; // { "password": "..." }

    if (enteredPassword === blobPassword) {
      return true; // لاگ ان کامیاب
    }
  } catch (error) {
    // اگر password.json موجود نہیں ہے تو یہ ایرر آئے گا، جو ٹھیک ہے
    console.warn("Could not check blob password:", error.message);
  }

  // 3. اگر دونوں پاس ورڈ میچ نہیں ہوئے
  return false;
}

// --- مین پیج (جو فیصلہ کرتا ہے کہ کیا دکھانا ہے) ---
export default async function AdminPage({ searchParams }) {
  
  // URL سے پاس ورڈ پڑھیں
  const passwordQuery = searchParams.password;
  
  // ہمارے نئے ہائبرڈ فنکشن سے چیک کریں
  if (await isValidPassword(passwordQuery)) {
    
    // --- پاس ورڈ ٹھیک ہے: ڈیش بورڈ دکھائیں ---
    
    // لوگو URL حاصل کریں (ہوم پیج کی طرح)
    let logoUrl = "/placeholder-logo.png"; // فال بیک
    try {
      const logoBlob = await head('logo.png');
      logoUrl = logoBlob.url;
    } catch (error) {
      console.warn("Admin Panel: Could not fetch 'logo.png'.");
    }

    // پاس ورڈ کو URL میں رکھیں تاکہ سیشن قائم رہے
    return <AdminDashboard logoUrl={logoUrl} passwordQuery={passwordQuery} />;
    
  } else {
    
    // --- پاس ورڈ غلط ہے: لاگ ان پیج دکھائیں ---
    return <LoginPage />;
  }
}
