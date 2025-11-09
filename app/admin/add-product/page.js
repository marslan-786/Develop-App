"use client"; // <-- یہ بہت اہم ہے

import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

// بیک (Back) آئیکن
function IconArrowLeft() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
    </svg>
  );
}

export default function AddProductPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const passwordQuery = searchParams.get('password'); // URL سے سیشن پاس ورڈ

  // فارم کی تمام فیلڈز کے لیے اسٹیٹ
  const [imageFile, setImageFile] = useState(null);
  const [videoLink, setVideoLink] = useState('');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [details, setDetails] = useState('');
  const [condition, setCondition] = useState('');
  const [price, setPrice] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  // فارم جمع کروانے کا فنکشن
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageFile || !brand || !model || !price) {
      setMessage('Error: Image, Brand, Model, and Price are required.');
      return;
    }
    
    setIsLoading(true);
    setMessage('');

    try {
      // --- مرحلہ 1: تصویر اپ لوڈ کریں ---
      // تصویر کے لیے ایک منفرد نام بنائیں
      const imageName = `product-${Date.now()}.${imageFile.name.split('.').pop()}`;
      
      const uploadRes = await fetch(
        `/api/upload?filename=${imageName}&password=${passwordQuery}`,
        {
          method: 'POST',
          body: imageFile,
        }
      );
      if (!uploadRes.ok) throw new Error('Image upload failed');
      
      const blob = await uploadRes.json();
      const imageUrl = blob.url; // اپ لوڈ کی گئی تصویر کا URL

      // --- مرحلہ 2: تمام ڈیٹا کو 'data.json' میں سیو کریں ---
      const productData = {
        id: '', // API خود ID بنائے گی
        name: `${brand} ${model}`, // نام خود بخود برانڈ اور ماڈل سے بن جائے گا
        brand,
        model,
        detail: details,
        condition,
        price,
        videoLink,
        imageUrl, // تصویر کا URL
      };

      const productRes = await fetch(
        `/api/products?password=${passwordQuery}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(productData),
        }
      );
      if (!productRes.ok) throw new Error('Failed to save product data.');

      setMessage('Product added successfully! Redirecting...');
      
      // کامیابی کے بعد، 2 سیکنڈ انتظار کریں اور ایڈمن ڈیش بورڈ پر واپس جائیں
      setTimeout(() => {
        router.push(`/admin?password=${passwordQuery}`);
      }, 2000);

    } catch (error) {
      setMessage(`Error: ${error.message}`);
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 min-h-screen bg-gray-50">
      {/* ہیڈر کے ساتھ بیک بٹن */}
      <header className="flex items-center gap-4 mb-6">
        <button 
          onClick={() => router.back()} 
          className="p-2 rounded-full hover:bg-gray-200"
        >
          <IconArrowLeft />
        </button>
        <h1 className="text-xl font-bold">Add New Product</h1>
      </header>

      {/* پروڈکٹ فارم */}
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
        
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Product Image (Required)
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files[0])}
            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            required
          />
        </div>

        <div>
          <label htmlFor="brand" className="block text-sm font-medium text-gray-700">
            Brand (e.g., Samsung) (Required)
          </label>
          <input
            type="text" id="brand" value={brand}
            onChange={(e) => setBrand(e.target.value)}
            placeholder="Samsung"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            required
          />
        </div>

        <div>
          <label htmlFor="model" className="block text-sm font-medium text-gray-700">
            Model (e.g., Galaxy S24 Ultra) (Required)
          </label>
          <input
            type="text" id="model" value={model}
            onChange={(e) => setModel(e.target.value)}
            placeholder="Galaxy S24 Ultra"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            required
          />
        </div>

        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700">
            Price (PKR) (Required)
          </label>
          <input
            type="number" id="price" value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="350000"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            required
          />
        </div>

        <div>
          <label htmlFor="condition" className="block text-sm font-medium text-gray-700">
            Condition (e.g., 10/10, PTA Approved)
          </label>
          <input
            type="text" id="condition" value={condition}
            onChange={(e) => setCondition(e.target.value)}
            placeholder="10/10, PTA Approved, Box Opened"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          />
        </div>

        <div>
          <label htmlFor="details" className="block text-sm font-medium text-gray-700">
            Details (e.g., Specs, 12GB RAM, 512GB)
          </label>
          <textarea
            id="details" value={details}
            onChange={(e) => setDetails(e.target.value)}
            rows="3"
            placeholder="12GB RAM, 512GB Storage, Snapdragon 8 Gen 3"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          ></textarea>
        </div>
        
        <div>
          <label htmlFor="videoLink" className="block text-sm font-medium text-gray-700">
            YouTube Video Link (Optional)
          </label>
          <input
            type="text" id="videoLink" value={videoLink}
            onChange={(e) => setVideoLink(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=..."
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          />
        </div>

        {/* سیو بٹن */}
        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400"
          >
            {isLoading ? 'Saving...' : 'Save Product'}
          </button>
        </div>

        {/* میسج ایریا */}
        {message && (
          <p className={`text-sm ${message.startsWith('Error') ? 'text-red-600' : 'text-green-600'}`}>
            {message}
          </p>
        )}
      </form>
    </div>
  );
}
