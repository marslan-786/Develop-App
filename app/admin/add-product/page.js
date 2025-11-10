"use client"; 

import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import FileUploader from '../FileUploader.js'; 

function IconArrowLeft() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
    </svg>
  );
}

// --- یہ ہے حل 2: اپ لوڈ فنکشن (الگ سے) ---
async function performUpload(productData, imageFile, passwordQuery) {
  try {
    // 1. تصویر اپ لوڈ کریں
    const imageName = `product-${Date.now()}.${imageFile.name.split('.').pop()}`;
    const uploadRes = await fetch(
      `/api/upload?filename=${imageName}&password=${passwordQuery}`,
      { method: 'POST', body: imageFile }
    );
    if (!uploadRes.ok) throw new Error('Image upload failed');
    
    const blob = await uploadRes.json();
    productData.imageUrl = blob.url; // <-- imageUrl کو اپ ڈیٹ کریں

    // 2. پروڈکٹ ڈیٹا سیو کریں
    const productRes = await fetch(
      `/api/products?password=${passwordQuery}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      }
    );
    if (!productRes.ok) throw new Error('Failed to save product data.');
    
    // کامیابی! (ہم یہاں نوٹیفکیشن دکھا سکتے ہیں، لیکن ابھی کے لیے کچھ نہیں)
    console.log("Product saved successfully in background:", productData.name);

  } catch (error) {
    // اگر فیل ہو
    console.error("Background upload failed:", error.message);
    // ہم صارف کو ایک نوٹیفکیشن بھیج سکتے ہیں
  }
}
// --- حل ختم ---


export default function AddProductPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const passwordQuery = searchParams.get('password'); 

  const [imageFile, setImageFile] = useState(null);
  const [videoLink, setVideoLink] = useState('');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [details, setDetails] = useState('');
  const [condition, setCondition] = useState('');
  const [price, setPrice] = useState('');
  
  const [isLoading, setIsLoading] = useState(false); // یہ اب صرف چند ملی سیکنڈ کے لیے 'true' ہو گا
  const [message, setMessage] = useState('');

  // فارم ری سیٹ فنکشن
  const resetForm = () => {
    setImageFile(null);
    setVideoLink('');
    setBrand('');
    setModel('');
    setDetails('');
    setCondition('');
    setPrice('');
    // نوٹ: 'message' کو ری سیٹ نہ کریں
  };

  // --- یہ ہے حل 2 (جاری): اپ ڈیٹ شدہ handleSubmit ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!imageFile || !brand || !model || !price) {
      setMessage('Error: Image, Brand, Model, and Price are required.');
      return;
    }
    
    setIsLoading(true); // <-- 1. لوڈنگ شروع
    setMessage('Starting upload...'); // 2. میسج دکھائیں

    // 3. ڈیٹا تیار کریں
    const productData = {
      id: '',
      name: `${brand} ${model}`,
      brand, model, details, condition, price, videoLink,
      imageUrl: '', // یہ 'performUpload' میں سیٹ ہو گا
    };

    // 4. اپ لوڈ کو بیک گراؤنڈ میں "Fire-and-Forget" کریں
    performUpload(productData, imageFile, passwordQuery);

    // 5. UI کو فوراً ری سیٹ اور ان بلاک کریں
    resetForm();
    setMessage('Upload started in background! You can add another product.');
    setIsLoading(false); // <-- 6. لوڈنگ فوراً ختم
    
    // 'router.push' کو ہٹا دیا گیا ہے تاکہ آپ اسی پیج پر رہ سکیں
  };
  // --- حل ختم ---

  return (
    <div className="p-4 min-h-screen bg-gray-50">
      <header className="flex items-center gap-4 mb-6">
        <button 
          onClick={() => router.back()} 
          className="p-2 rounded-full hover:bg-gray-200"
        >
          <IconArrowLeft />
        </button>
        <h1 className="text-xl font-bold">Add New Product</h1>
      </header>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
        
        <FileUploader 
          title="Product Image (Required)"
          onFileSelect={(file) => setImageFile(file)}
        />
        {imageFile && <p className="text-sm text-green-600">Image selected: {imageFile.name}</p>}
        {/* (باقی فارم ویسا ہی) */}
        <div>
          <label htmlFor="brand" className="block text-sm font-medium text-gray-700">Brand (Required)</label>
          <input
            type="text" id="brand" value={brand}
            onChange={(e) => setBrand(e.target.value)}
            placeholder="Samsung"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            required
          />
        </div>
        <div>
          <label htmlFor="model" className="block text-sm font-medium text-gray-700">Model (Required)</label>
          <input
            type="text" id="model" value={model}
            onChange={(e) => setModel(e.target.value)}
            placeholder="Galaxy S24 Ultra"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            required
          />
        </div>
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price (PKR) (Required)</label>
          <input
            type="number" id="price" value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="350000"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            required
          />
        </div>
        <div>
          <label htmlFor="condition" className="block text-sm font-medium text-gray-700">Condition</label>
          <input
            type="text" id="condition" value={condition}
            onChange={(e) => setCondition(e.target.value)}
            placeholder="10/10, PTA Approved"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          />
        </div>
        <div>
          <label htmlFor="details" className="block text-sm font-medium text-gray-700">Details</label>
          <textarea
            id="details" value={details}
            onChange={(e) => setDetails(e.target.value)}
            rows="3"
            placeholder="12GB RAM, 512GB Storage"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          ></textarea>
        </div>
        <div>
          <label htmlFor="videoLink" className="block text-sm font-medium text-gray-700">YouTube Video Link (Optional)</label>
          <input
            type="text" id="videoLink" value={videoLink}
            onChange={(e) => setVideoLink(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=..."
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          />
        </div>

        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400"
          >
            {isLoading ? 'Starting upload...' : 'Save Product'}
          </button>
        </div>

        {message && (
          <p className={`text-sm ${message.startsWith('Error') ? 'text-red-600' : 'text-green-600'}`}>
            {message}
          </p>
        )}
      </form>
    </div>
  );
}
