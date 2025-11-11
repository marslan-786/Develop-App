// app/admin/manage-products/page.js

import { head } from '@vercel/blob';
import Link from 'next/link';
import { Suspense } from 'react';
import AdminProductListClient from './AdminProductListClient'; // یہ فائل ہم اگلے مرحلے میں بنائیں گے

export const dynamic = 'force-dynamic';

// --- پروڈکٹ لسٹ (سرور) ---
async function ProductList() {
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
  
  return (
    <AdminProductListClient initialProducts={products} />
  );
}

// --- پروڈکٹ لسٹ کے لیے لوڈنگ (Loading) انڈیکیٹر ---
function ProductsLoading() {
  return (
    <div className="p-4">
      <div className="text-center text-gray-400 mt-20">
        <p>Loading products...</p>
      </div>
    </div>
  );
}

// --- آئیکنز ---
function IconArrowLeft() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
    </svg>
  );
}

// --- یہ ہے نیا "Manage Products" پیج ---
export default async function ManageProductsPage({ searchParams }) {
  const passwordQuery = searchParams.password;
  
  // (نوٹ: اس پیج کو پروٹیکٹ کرنے کے لیے آپ isValidPassword() بھی استعمال کر سکتے ہیں)
  
  return (
    <div>
      {/* یہ اس پیج کا اپنا ہیڈر ہے */}
      <header className="sticky top-0 z-10 flex items-center justify-between p-4 bg-white border-b">
        <Link 
          href={`/admin?password=${passwordQuery}`}
          className="p-2 rounded-full hover:bg-gray-100"
        >
          <IconArrowLeft />
        </Link>
        <h1 className="text-xl font-bold">Manage Products</h1>
        {/* سرچ بٹن کلائنٹ کمپوننٹ میں ہے تاکہ وہ state کو ٹوگل کر سکے */}
        <div></div> {/* یہ جگہ خالی ہے تاکہ ٹائٹل درمیان میں رہے */}
      </header>

      {/* پروڈکٹ لسٹ کلائنٹ کمپوننٹ میں لوڈ ہو گی */}
      <Suspense fallback={<ProductsLoading />}>
        <ProductList />
      </Suspense>
    </div>
  );
}
