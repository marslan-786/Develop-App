// app/admin/AdminDashboardClient.js

"use client";

import Image from 'next/image';
import Link from 'next/link';

// --- یہ ہے آپ کا نیا ایڈمن ہیڈر ---
// یہ 'logoUrl', 'bannerUrl' اور 'children' (3 بٹن) وصول کرے گا
export default function AdminDashboardClient({ logoUrl, bannerUrl, passwordQuery, children }) {
  
  return (
    <div>
      {/* --- نیا ہیڈر: بائیں اور دائیں لوگو --- */}
      <header className="sticky top-0 z-10 flex items-center justify-between p-4 bg-white border-b">
        
        {/* 1. بائیں طرف کا لوگو */}
        <div className="w-8 h-8 rounded-full overflow-hidden border">
          <Image src={logoUrl} alt="Logo" width={32} height={32} unoptimized />
        </div>
        
        {/* 2. درمیان میں ٹائٹل */}
        <span className="text-xl font-bold">Admin Panel</span>
        
        {/* 3. دائیں طرف کا لوگو */}
        <div className="w-8 h-8 rounded-full overflow-hidden border">
          <Image src={logoUrl} alt="Logo" width={32} height={32} unoptimized />
        </div>
        
      </header>
      {/* --- ہیڈر ختم --- */}


      <main>
        {/* --- 4. بینر (بٹnوں سے اوپر) --- */}
        {bannerUrl && (
          <div className="w-full h-36 md:h-48 relative">
            <Image 
              src={bannerUrl} 
              alt="Admin Banner" 
              fill 
              className="object-cover" 
              unoptimized 
            />
          </div>
        )}
        {/* --- بینر ختم --- */}

        
        {/* 5. یہاں آپ کا مواد (یعنی 3 بٹن والا مینو) نظر آئے گا */}
        <div className="p-4">
          {children}
        </div>
      </main>
    </div>
  );
}
