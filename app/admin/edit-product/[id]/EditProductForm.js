"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

// یہ کمپوننٹ سرور سے 'initialProduct' کو prop کے طور پر لیتا ہے
export default function EditProductForm({ initialProduct, passwordQuery }) {
  const router = useRouter();

  // فارم کی تمام فیلڈز کے لیے اسٹیٹ
  const [videoLink, setVideoLink] = useState('');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [details, setDetails] = useState('');
  const [condition, setCondition] = useState('');
  const [price, setPrice] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  // useEffect اب صرف اسٹیٹ کو سیٹ کرنے کے لیے استعمال ہو گا
  useEffect(() => {
    if (initialProduct) {
      setBrand(initialProduct.brand);
      setModel(initialProduct.model);
      setDetails(initialProduct.detail || '');
      setCondition(initialProduct.condition || '');
      setPrice(initialProduct.price);
      setVideoLink(initialProduct.videoLink || '');
    }
  }, [initialProduct]); // یہ صرف ایک بار چلے گا

  // فارم جمع کروانے کا فنکشن (یہ پہلے جیسا ہی ہے)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!brand || !model || !price) {
      setMessage('Error: Brand, Model, and Price are required.');
      return;
    }
    
    setIsLoading(true);
    setMessage('');

    try {
      const updatedData = {
        ...initialProduct, // پرانی ID اور imageUrl کو برقرار رکھیں
        name: `${brand} ${model}`,
        brand,
        model,
        detail: details,
        condition,
        price,
        videoLink,
      };

      const productRes = await fetch(
        `/api/products/update?password=${passwordQuery}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedData),
        }
      );
      if (!productRes.ok) throw new Error('Failed to update product data.');

      setMessage('Product updated successfully! Redirecting...');
      
      setTimeout(() => {
        router.push(`/admin?password=${passwordQuery}`);
      }, 2000);

    } catch (error) {
      setMessage(`Error: ${error.message}`);
      setIsLoading(false);
    }
  };

  // --- مین ایڈٹ فارم ---
  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
      
      {/* امیج دکھائیں */}
      <div className="w-full h-40 relative rounded-lg overflow-hidden border">
         <Image 
           src={`${initialProduct.imageUrl}?v=${new Date().getTime()}`} 
           alt={initialProduct.name} 
           layout="fill" 
           className="object-cover" 
           unoptimized 
         />
      </div>
      <p className="text-xs text-gray-500 mt-1">To change the image, please delete this product and add a new one.</p>

      {/* باقی فارم فیلڈز */}
      <div>
        <label htmlFor="brand" className="block text-sm font-medium text-gray-700">Brand (Required)</label>
        <input
          type="text" id="brand" value={brand}
          onChange={(e) => setBrand(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          required
        />
      </div>

      <div>
        <label htmlFor="model" className="block text-sm font-medium text-gray-700">Model (Required)</label>
        <input
          type="text" id="model" value={model}
          onChange={(e) => setModel(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          required
        />
      </div>

      <div>
        <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price (PKR) (Required)</label>
        <input
          type="number" id="price" value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          required
        />
      </div>

      <div>
        <label htmlFor="condition" className="block text-sm font-medium text-gray-700">Condition</label>
        <input
          type="text" id="condition" value={condition}
          onChange={(e) => setCondition(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
        />
      </div>

      <div>
        <label htmlFor="details" className="block text-sm font-medium text-gray-700">Details</label>
        <textarea
          id="details" value={details}
          onChange={(e) => setDetails(e.target.value)}
          rows="3"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
        ></textarea>
      </div>
      
      <div>
        <label htmlFor="videoLink" className="block text-sm font-medium text-gray-700">YouTube Video Link (Optional)</label>
        <input
          type="text" id="videoLink" value={videoLink}
          onChange={(e) => setVideoLink(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
        />
      </div>

      <div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400"
        >
          {isLoading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {message && (
        <p className={`text-sm ${message.startsWith('Error') ? 'text-red-600' : 'text-green-600'}`}>
          {message}
        </p>
      )}
    </form>
  );
}
