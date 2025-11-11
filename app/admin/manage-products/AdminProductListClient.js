// app/admin/manage-products/AdminProductListClient.js

"use client"; 

import { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

// --- آئیکنز ---
function IconSearch() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
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
function IconEdit() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
    </svg>
  );
}
function IconDelete() {
   return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12.548 0A48.094 48.094 0 0 1 6.7 5.397m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
    </svg>
  );
}

// --- وہی 'Time Ago' فنکشن جو ہم نے ہوم پیج کے لیے بنایا تھا ---
function formatTimeAgo(dateString) {
  if (!dateString) return null;
  const isoDateString = dateString.replace(' ', 'T');
  const date = new Date(isoDateString);
  if (isNaN(date.getTime())) return null;

  const now = new Date();
  const seconds = Math.round((now.getTime() - date.getTime()) / 1000);
  
  if (seconds < 0) return "just now";
  if (seconds < 60) return `${seconds} sec ago`;
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;
  const days = Math.round(hours / 24);
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  return date.toLocaleDateString('en-PK', { day: 'numeric', month: 'short' });
}


// --- یہ ہے نیا پروڈکٹ کارڈ ڈیزائن ---
function AdminProductCard({ product, passwordQuery, onDelete, isDeleting }) {
  const cacheBustedImageUrl = product.imageUrl;
  const sessionQuery = `?password=${passwordQuery}`;
  const timeAgo = formatTimeAgo(product.uploadTime);
  
  return (
    <div className={`rounded-lg overflow-hidden shadow-md border flex flex-col ${isDeleting ? 'opacity-40' : 'bg-white'}`}>
      <div className="w-full h-40 relative">
        <Image src={cacheBustedImageUrl} alt={product.name} fill className="object-cover" unoptimized />
      </div>
      <div className="p-3 flex flex-col flex-grow">
        <h3 className="text-md font-semibold mb-1 h-12 overflow-hidden">
          {product.name}
        </h3>
        <p className="text-sm text-gray-600 mb-2 h-10 overflow-hidden">
          {product.detail || "No details provided."}
        </p>
        <p className="font-bold text-lg mb-1">PKR {product.price}</p>
        {timeAgo && (
          <p className="text-xs text-gray-500 mb-3">{timeAgo}</p>
        )}
        
        <div className="mt-auto grid grid-cols-2 gap-2">
          <Link
            href={`/admin/edit-product/${product.id}${sessionQuery}`}
            className="flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-medium bg-blue-100 text-blue-700 hover:bg-blue-200"
          >
            <IconEdit />
            Edit
          </Link>
          <button
            onClick={() => onDelete(product.id)}
            disabled={isDeleting}
            className="flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-medium bg-red-100 text-red-700 hover:bg-red-200 disabled:opacity-50"
          >
            <IconDelete />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}


// --- مین پروڈکٹ لسٹ کلائنٹ کمپوننٹ (نئے ڈیزائن کے ساتھ) ---
export default function AdminProductListClient({ initialProducts }) {
  const router = useRouter(); 
  const searchParams = useSearchParams();
  const passwordQuery = searchParams.get('password');
  
  const [products, setProducts] = useState(initialProducts); 
  const [isSearchOpen, setIsSearchOpen] = useState(false); // سرچ اب یہاں ہے
  const [searchTerm, setSearchTerm] = useState('');
  const [message, setMessage] = useState(''); 
  const [loadingProductId, setLoadingProductId] = useState(null); 

  // فلٹر شدہ پروڈکٹس (وہی لاجک)
  const filteredProducts = useMemo(() => {
    if (!products) return []; 
    // نئے پروڈکٹ سب سے پہلے
    const sorted = [...products].sort((a, b) => (b.uploadTime || '').localeCompare(a.uploadTime || ''));
    
    return sorted.filter(product => { 
      const matchesSearch = searchTerm
        ? (product.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
           product.brand?.toLowerCase().includes(searchTerm.toLowerCase()))
        : true;
      return matchesSearch;
    });
  }, [products, searchTerm]); 

  // ڈیلیٹ فنکشن (وہی لاجک)
  const handleDelete = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }
    const oldProducts = products; 
    setLoadingProductId(productId);
    setMessage('Deleting...');
    setProducts(prevProducts => prevProducts.filter(p => p.id !== productId));
    try {
      const res = await fetch(`/api/products/delete?password=${passwordQuery}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: productId }),
      });
      if (!res.ok) throw new Error('Failed to delete product from server.');
      setMessage('Product deleted successfully!');
    } catch (error) {
      setMessage(`Error: ${error.message}. Reverting changes.`);
      setProducts(oldProducts); 
    } finally {
      setLoadingProductId(null); 
    }
  };

  return (
    <>
      {/* سرچ بار (پیج کے ہیڈر کے نیچے) */}
      <div className="sticky top-[73px] z-10 p-4 bg-gray-50 border-b">
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
             <IconSearch />
          </span>
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 pl-10 border rounded-lg shadow-sm"
          />
        </div>
      </div>
      
      {/* نیا 2-کالم گرڈ لے آؤٹ */}
      <div className="p-4">
        {message && (
          <p className={`text-sm mb-2 ${message.startsWith('Error') ? 'text-red-600' : 'text-green-600'}`}>
            {message}
          </p>
        )}
        {filteredProducts && filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 gap-4">
            {filteredProducts.map((product) => (
              <AdminProductCard 
                key={product.id} 
                product={product} 
                passwordQuery={passwordQuery}
                onDelete={handleDelete}
                isDeleting={loadingProductId === product.id}
              />
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-400 mt-20">
            {searchTerm ? 'No products match search.' : 'No products added yet.'}
          </div>
        )}
      </div>
    </>
  );
}
