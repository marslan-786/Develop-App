"use client"; 

import { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // <-- روٹر کو امپورٹ کریں

// --- Icon Components (ویسے ہی) ---
function IconSettings() { /* ... */ }
function IconSearch() { /* ... */ }
function IconPlus() { /* ... */ }
function IconClose() { /* ... */ }
// (یہاں آئیکنز کا مکمل کوڈ ہے تاکہ کوئی غلطی نہ ہو)
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

// --- پروڈکٹ لسٹ آئٹم (اپ ڈیٹ شدہ) ---
function ProductListItem({ product, passwordQuery, onDelete }) {
  const cacheBustedImageUrl = `${product.imageUrl}?v=${new Date().getTime()}`;
  const sessionQuery = `?password=${passwordQuery}`;

  return (
    <div className="flex items-center gap-4 p-3 bg-white rounded-lg shadow-sm border">
      <div className="flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border">
        <Image
          src={cacheBustedImageUrl}
          alt={product.name}
          width={64}
          height={64}
          className="object-cover"
          unoptimized
        />
      </div>
      <div className="flex-grow min-w-0">
        <h3 className="font-semibold truncate">{product.name}</h3>
        <p className="text-sm text-gray-600 truncate">{product.detail || `PKR ${product.price}`}</p>
      </div>
      <div className="flex-shrink-0 flex gap-2">
        {/* --- یہ ہے حل 1: ایڈٹ بٹن (اب یہ لنک ہے) --- */}
        <Link 
          href={`/admin/edit-product/${product.id}${sessionQuery}`}
          className="p-2 text-blue-600 bg-blue-100 rounded-full hover:bg-blue-200"
        >
          {/* Edit Icon */}
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
          </svg>
        </Link>
        {/* --- یہ ہے حل 2: ڈیلیٹ بٹن (اب یہ onClick کو کال کرتا ہے) --- */}
        <button 
          onClick={() => onDelete(product.id)}
          className="p-2 text-red-600 bg-red-100 rounded-full hover:bg-red-200"
        >
          {/* Delete Icon */}
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12.548 0A48.094 48.094 0 0 1 6.7 5.397m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
          </svg>
        </button>
      </div>
    </div>
  );
}

// --- مین ڈیش بورڈ کلائنٹ کمپوننٹ (اپ ڈیٹ شدہ) ---
export default function AdminDashboardClient({ initialProducts, logoUrl, passwordQuery }) {
  const sessionQuery = `?password=${passwordQuery}`;
  const router = useRouter(); // <-- روٹر کو یہاں استعمال کریں
  
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [message, setMessage] = useState(''); // <-- میسج کے لیے اسٹیٹ
  const [loadingProductId, setLoadingProductId] = useState(null); // <-- لوڈنگ اسٹیٹ

  const cacheBustedLogoSrc = `${logoUrl}?v=${new Date().getTime()}`;

  const filteredProducts = useMemo(() => {
    if (!initialProducts) return [];
    return initialProducts.filter(product => {
      const matchesSearch = searchTerm
        ? (product.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
           product.brand?.toLowerCase().includes(searchTerm.toLowerCase()))
        : true;
      return matchesSearch;
    });
  }, [initialProducts, searchTerm]);

  // --- یہ ہے حل 3: ڈیلیٹ فنکشن ---
  const handleDelete = async (productId) => {
    // کنفرمیشن پوچھیں
    if (!window.confirm('Are you sure you want to delete this product? This cannot be undone.')) {
      return;
    }

    setLoadingProductId(productId); // (Optional: لوڈنگ دکھائیں)
    setMessage('');

    try {
      const res = await fetch(`/api/products/delete${sessionQuery}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: productId }),
      });

      if (!res.ok) {
        throw new Error('Failed to delete product.');
      }

      setMessage('Product deleted successfully!');
      
      // پیج کو ریفریش کریں تاکہ سرور سے نئی لسٹ آئے
      router.refresh(); 

    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoadingProductId(null); // (Optional: لوڈنگ ہٹائیں)
    }
  };

  return (
    <div className="relative min-h-screen bg-gray-50 pb-20">
      {/* --- ہیڈر (ویسا ہی) --- */}
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
      
      {/* --- سرچ بار (ویسا ہی) --- */}
      {isSearchOpen && (
        <div className="sticky top-[73px] z-10 p-4 bg-gray-50 border-b">
          <div className="relative">
            <input
              type="text"
              placeholder="Search products by name or brand..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 pr-10 border rounded-lg shadow-sm"
              autoFocus
            />
            <button onClick={() => setIsSearchOpen(false)} className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-700">
              <IconClose />
            </button>
          </div>
        </div>
      )}

      {/* --- پروڈکٹ لسٹ (اپ ڈیٹ شدہ) --- */}
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-2">Manage Products</h2>
        
        {/* میسج ایریا */}
        {message && (
          <p className={`text-sm mb-2 ${message.startsWith('Error') ? 'text-red-600' : 'text-green-600'}`}>
            {message}
          </p>
        )}

        {filteredProducts && filteredProducts.length > 0 ? (
          <div className="space-y-3">
            {filteredProducts.map((product) => (
              <ProductListItem 
                key={product.id} 
                product={product} 
                passwordQuery={passwordQuery}
                onDelete={handleDelete} // <-- ڈیلیٹ فنکشن پاس کریں
              />
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-400 mt-10">
            {/* ... (ویسا ہی) ... */}
          </div>
        )}
      </div>

      {/* --- فلوٹنگ '+' بٹن (ویسا ہی) --- */}
      <Link
        href={`/admin/add-product${sessionQuery}`}
        className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-transform hover:scale-105"
      >
        <IconPlus />
      </Link>
    </div>
  );
}
