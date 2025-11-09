import { head } from '@vercel/blob';
import Image from 'next/image';
import Link from 'next/link';

// Vercel کو بتاتا ہے کہ اس پیج کو کیش نہ کرے
export const dynamic = 'force-dynamic'; 

// --- سرور پر ڈیٹا لانے والا فنکشن ---
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

// --- بیک (Back) آئیکن ---
function IconArrowLeft() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
    </svg>
  );
}

// --- یوٹیوب ویڈیو ایمبیڈ (Embed) کمپوننٹ ---
function YouTubeEmbed({ videoLink }) {
  if (!videoLink) return null;

  try {
    const url = new URL(videoLink);
    let videoId = url.searchParams.get('v'); // https://www.youtube.com/watch?v=...
    if (!videoId) {
      videoId = url.pathname.split('/').pop(); // https://youtu.be/...
    }

    if (!videoId) return <p className="text-red-500">Invalid YouTube URL</p>;

    return (
      <div className="aspect-w-16 aspect-h-9 w-full overflow-hidden rounded-lg border">
        <iframe
          src={`https://www.youtube.com/embed/${videoId}`}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full"
        ></iframe>
      </div>
    );
  } catch (error) {
    return <p className="text-red-500">Invalid Video Link</p>;
  }
}

// --- واٹس ایپ بٹن (کلائنٹ کمپوننٹ) ---
// اس کے لیے ہمیں ایک چھوٹی کلائنٹ فائل بنانی ہوگی
"use client";
import { useState } from 'react'; // صرف اس حصے کے لیے "use client"

function WhatsAppButton({ product }) {
  // --- یہاں اپنا واٹس ایپ نمبر سیٹ کریں ---
  const WHATSAPP_NUMBER = "923001234567"; // مثال: 923001234567 (کنٹری کوڈ کے ساتھ)

  const [isLoading, setIsLoading] = useState(false);

  const handleClick = () => {
    setIsLoading(true);
    // واٹس ایپ میسج تیار کریں
    const message = `
Hello, I am interested in this mobile phone:
*Model:* ${product.name}
*Condition:* ${product.condition}
*Price:* PKR ${product.price}
*Link:* ${window.location.href}
    `;
    
    // واٹس ایپ لنک بنائیں
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    
    // صارف کو واٹس ایپ پر بھیجیں
    window.location.href = whatsappUrl;
  };

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className="w-full py-3 bg-green-500 text-white text-lg font-bold rounded-lg shadow-md hover:bg-green-600 transition-colors disabled:bg-gray-400"
    >
      {isLoading ? 'Redirecting...' : 'Buy on WhatsApp'}
    </button>
  );
}
// --- کلائنٹ کمپوننٹ ختم ---


// --- مین پروڈکٹ ڈیٹیل پیج (سرور کمپوننٹ) ---
export default async function ProductDetailPage({ params }) {
  const productId = params.id;
  const product = await getProductById(productId);

  // اگر پروڈکٹ نہ ملے تو ایرر دکھائیں
  if (!product) {
    return (
      <div className="p-4 min-h-screen bg-gray-50">
        <header className="flex items-center gap-4 mb-6">
          <Link href="/" className="p-2 rounded-full hover:bg-gray-200">
            <IconArrowLeft />
          </Link>
          <h1 className="text-xl font-bold text-red-600">Error</h1>
        </header>
        <p className="text-center text-red-600">Product not found.</p>
      </div>
    );
  }

  // اگر پروڈکٹ مل جائے تو ڈیٹیلز دکھائیں
  return (
    <main className="bg-white">
      {/* ہیڈر کے ساتھ بیک بٹن */}
      <header className="sticky top-0 z-10 flex items-center gap-4 p-4 bg-white shadow-md">
        <Link href="/" className="p-2 rounded-full hover:bg-gray-100">
          <IconArrowLeft />
        </Link>
        {/* کٹا ہوا ٹیکسٹ ٹھیک کرنے کے لیے 'truncate' کی جگہ 'break-words' */}
        <h1 className="text-xl font-bold break-words">{product.name}</h1>
      </header>

      {/* پروڈکٹ کی تفصیلات */}
      <div className="p-4 space-y-4">
        {/* تصویر */}
        <div className="w-full h-64 relative rounded-lg overflow-hidden border">
          <Image
            src={`${product.imageUrl}?v=${new Date().getTime()}`}
            alt={product.name}
            layout="fill"
            className="object-cover"
            unoptimized
            priority
          />
        </div>

        {/* یوٹیوب ویڈیو (اگر موجود ہو) */}
        <YouTubeEmbed videoLink={product.videoLink} />

        {/* تفصیلات */}
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">{product.name}</h2>
          <p className="text-2xl font-bold text-blue-600">PKR {product.price}</p>
          <p className="text-md text-gray-700">
            <strong>Condition:</strong> {product.condition || 'N/A'}
          </p>
          {/* 'whitespace-pre-wrap' تاکہ لائن بریکس کام کریں */}
          <p className="text-md text-gray-700 whitespace-pre-wrap">
            <strong>Details:</strong><br />
            {product.detail || 'No details available.'}
          </p>
        </div>

        {/* واٹس ایپ بٹن */}
        <div className="pt-4">
          <WhatsAppButton product={product} />
        </div>
      </div>
    </main>
  );
}
