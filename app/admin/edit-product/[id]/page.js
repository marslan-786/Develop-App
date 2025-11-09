"use client";

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter, useParams } from 'next/navigation';
import { head } from '@vercel/blob';

// بیک (Back) آئیکن
function IconArrowLeft() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
    </svg>
  );
}

// یہ فنکشن سرور سے ڈیٹا لانے کے لیے صرف کلائنٹ پر چلے گا
async function getProductById(productId) {
  try {
    const dataBlob = await head('data.json', { cache: 'no-store' });
    const dataResponse = await fetch(dataBlob.url, { cache: 'no-store' });
    if (!dataResponse.ok) throw new Error('Could not fetch data.json');
    
    const textData = await dataResponse.text();
    if (!textData) throw new Error('data.json is empty');
    
    const products = JSON.parse(textData);
    const product = products.find(p => p.id === productId);
    if (!product) throw new Error('Product not found');
    
    return product;
  } catch (error) {
    console.error("Failed to get product:", error);
    return null;
  }
}


export default function EditProductPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams(); // URL سے [id] حاصل کرنے کے لیے
  
  const passwordQuery = searchParams.get('password');
  const productId = params.id; // پروڈکٹ ID

  // فارم کی تمام فیلڈز کے لیے اسٹیٹ
  const [product, setProduct] = useState(null);
  const [videoLink, setVideoLink] = useState('');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [details, setDetails] = useState('');
  const [condition, setCondition] = useState('');
  const [price, setPrice] = useState('');
  // نوٹ: امیج کو ایڈٹ نہیں کیا جا سکتا، صرف ڈیٹیلز
  
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState('');

  // --- useEffect: پیج لوڈ ہونے پر پروڈکٹ کا ڈیٹا لائیں ---
  useEffect(() => {
    if (productId) {
      getProductById(productId)
        .then(data => {
          if (data) {
            setProduct(data);
            setBrand(data.brand);
            setModel(data.model);
            setDetails(data.detail || '');
            setCondition(data.condition || '');
            setPrice(data.price);
            setVideoLink(data.videoLink || '');
          } else {
            setMessage('Error: Product not found.');
          }
          setIsLoading(false);
        });
    }
  }, [productId]); // یہ صرف ایک بار چلے گا جب productId ملے گا

  // فارم جمع کروانے کا فنکشن (اپ ڈیٹ کے لیے)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!brand || !model || !price) {
      setMessage('Error: Brand, Model, and Price are required.');
      return;
    }
    
    setIsLoading(true);
    setMessage('');

    try {
      // --- مرحلہ 1: اپ ڈیٹ شدہ ڈیٹا کو API کو بھیجیں ---
      const updatedData = {
        ...product, // پرانی ID اور imageUrl کو برقرار رکھیں
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

  // --- لوڈنگ یا ایرر اسٹیٹس ---
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="text-lg font-medium text-gray-500">
          Loading Product Details...
        </div>
      </div>
    );
  }
  
  if (!product) {
     return (
      <div className="p-4 min-h-screen bg-gray-50">
         <header className="flex items-center gap-4 mb-6">
          <button onClick={() => router.back()} className="p-2 rounded-full hover:bg-gray-200">
            <IconArrowLeft />
          </button>
          <h1 className="text-xl font-bold text-red-600">Error</h1>
        </header>
        <p className="text-center text-red-600">{message || 'Product could not be loaded.'}</p>
      </div>
    );
  }

  // --- مین ایڈٹ فارم ---
  return (
    <div className="p-4 min-h-screen bg-gray-50">
      <header className="flex items-center gap-4 mb-6">
        <button 
          onClick={() => router.back()} 
          className="p-2 rounded-full hover:bg-gray-200"
        >
          <IconArrowLeft />
        </button>
        <h1 className="text-xl font-bold">Edit Product</h1>
      </header>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
        
        {/* امیج دکھائیں (لیکن ایڈٹ نہ کریں) */}
        <div className="w-full h-40 relative rounded-lg overflow-hidden border">
           <Image 
             src={`${product.imageUrl}?v=${new Date().getTime()}`} 
             alt={product.name} 
             layout="fill" 
             className="object-cover" 
             unoptimized 
           />
        </div>
        <p className="text-xs text-gray-500 mt-1">To change the image, please delete this product and add a new one.</p>


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
    </div>
  );
}
