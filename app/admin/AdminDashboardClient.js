"use client"; 

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

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
function IconClose() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
    </svg>
  );
}
// --- (آئیکنز ختم) ---

// --- مین ڈیش بورڈ کلائنٹ کمپوننٹ (اپ ڈیٹ شدہ) ---
// 'initialProducts' کو ہٹا دیا گیا ہے اور '{children}' کو شامل کیا گیا ہے
export default function AdminDashboardClient({ logoUrl, passwordQuery, children }) {
  const sessionQuery = `?password=${passwordQuery}`;
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  // 'searchTerm' اور 'handleDelete' وغیرہ کو ProductList کمپوننٹ میں منتقل کر دیا گیا ہے
  
  const cacheBustedLogoSrc = `${logoUrl}?v=${new Date().getTime()}`;

  return (
    <div className="relative min-h-screen bg-gray-50 pb-20">
      {/* --- ہیڈر (یہ فوراً لوڈ ہو گا) --- */}
      <header className="sticky top-0 z-10 flex items-center justify-between p-4 bg-white shadow-md">
        <Link href={`/admin/settings${sessionQuery}`} className="p-2 rounded-full hover:bg-gray-100">
          <IconSettings />
        </Link>
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-200">
            <Image src={cacheBustedLogoSrc} alt="Logo" width={40} height={40} className="object-cover" priority unoptimized />
          </div>
          <h1 className="text-xl font-bold whitespace-nowrap">Admin Panel</h1>
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-200">
            <Image src={cacheBustedLogoSrc} alt="Logo" width={40} height={40} className="object-cover" priority unoptimized />
          </div>
        </div>
        <button onClick={() => setIsSearchOpen(prev => !prev)} className="p-2 rounded-full hover:bg-gray-100">
          <IconSearch />
        </button>
      </header>
      
      {/* سرچ بار کو بھی 'ProductList' میں منتقل کر دیا گیا ہے */}

      {/* --- یہ ہے حل 1 (جاری) --- */}
      {/* پروڈکٹ لسٹ (جو سست ہے) یہاں رینڈر ہو گی جب وہ تیار ہو گی */}
      {children}
      {/* --- حل ختم --- */}


      {/* --- فلوٹنگ '+' بٹن (یہ فوراً لوڈ ہو گا) --- */}
      <Link
        href={`/admin/add-product${sessionQuery}`}
        className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-transform hover:scale-105"
      >
        <IconPlus />
      </Link>
    </div>
  );
}
