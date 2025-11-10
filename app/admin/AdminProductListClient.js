"use client"; 

import { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation'; // <-- روٹر اور searchParams

// --- Icon Components (ویسے ہی) ---
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
// --- (آئیکنز ختم) ---

// --- پروڈکٹ لسٹ آئٹم (ویسا ہی) ---
function ProductListItem({ product, passwordQuery, onDelete, isDeleting }) {
  // ✅ صحیح کوڈ (کیشنگ کے لیے)
  const cacheBustedImageUrl = product.imageUrl;
  const sessionQuery = `?password=${passwordQuery}`;

  return (
    <div className={`flex items-center gap-4 p-3 bg-white rounded-lg shadow-sm border ${isDeleting ? 'opacity-50' : ''}`}>
      <div className="flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border">
        <Image src={cacheBustedImageUrl} alt={product.name} width={64} height={64} className="object-cover" unoptimized />
      </div>
      <div className="flex-grow min-w-0">
        <h3 className="font-semibold truncate">{product.name}</h3>
        <p className="text-sm text-gray-600 truncate">{product.detail || `PKR ${product.price}`}</p>
      </div>
      <div className="flex-shrink-0 flex gap-2">
        <Link 
          href={`/admin/edit-product/${product.id}${sessionQuery}`}
          className="p-2 text-blue-600 bg-blue-100 rounded-full hover:bg-blue-200"
        >
          {/* Edit Icon */}
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
          </svg>
        </Link>
        <button 
          onClick={() => onDelete(product.id)}
          disabled={isDeleting} 
          className="p-2 text-red-600 bg-red-100 rounded-full hover:bg-red-200 disabled:opacity-50"
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

// --- مین پروڈکٹ لسٹ کلائنٹ کمپوننٹ ---
export default function AdminProductListClient({ initialProducts }) {
  const router = useRouter(); 
  const searchParams = useSearchParams();
  const passwordQuery = searchParams.get('password');
  const sessionQuery = `?password=${passwordQuery}`;
  
  const [products, setProducts] = useState(initialProducts); 
  const [isSearchOpen, setIsSearchOpen] = useState(false); // <-- سرچ اب یہاں ہے
  const [searchTerm, setSearchTerm] = useState('');
  const [message, setMessage] = useState(''); 
  const [loadingProductId, setLoadingProductId] = useState(null); 

  const filteredProducts = useMemo(() => {
    if (!products) return []; 
    return products.filter(product => { 
      const matchesSearch = searchTerm
        ? (product.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
           product.brand?.toLowerCase().includes(searchTerm.toLowerCase()))
        : true;
      return matchesSearch;
    });
  }, [products, searchTerm]); 

  // Optimistic Delete فنکشن (ویسا ہی)
  const handleDelete = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }
    const oldProducts = products; 
    setLoadingProductId(productId);
    setMessage('Deleting...');
    setProducts(prevProducts => prevProducts.filter(p => p.id !== productId));
    try {
      const res = await fetch(`/api/products/delete${sessionQuery}`, {
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
      {isSearchOpen && (
        <div className="sticky top-[73px] z-10 p-4 bg-gray-50 border-b">
          <div className="relative">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 pr-10 border rounded-lg shadow-sm"
              autoFocus
            />
            <button onClick={() => setIsSearchOpen(false)} className="absolute right-2 top-1/2 -translate-y-1/2 p-1">
              <IconClose />
            </button>
          </div>
        </div>
      )}
      
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-2">Manage Products</h2>
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
                onDelete={handleDelete}
                isDeleting={loadingProductId === product.id}
              />
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-400 mt-10">
            {searchTerm ? 'No products match search.' : 'No products added yet.'}
          </div>
        )}
      </div>
    </>
  );
}
