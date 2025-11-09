import { head } from '@vercel/blob';
import Image from 'next/image';
import Link from 'next/link';
import WhatsAppButton from './WhatsAppButton.js'; // ہمارا کلائنٹ کمپوننٹ

export const dynamic = 'force-dynamic'; 

// --- سرور پر ڈیٹا لانے والا فنکشن (ویسا ہی) ---
async function getPageData(productId) {
  let product = null;
  let whatsappNumber = "923001234567"; 

  try {
    // 1. پروڈکٹ حاصل کریں
    const dataBlob = await head('data.json', { cache: 'no-store' });
    const dataResponse = await fetch(dataBlob.url, { cache: 'no-store' });
    if (dataResponse.ok) {
      const textData = await dataResponse.text();
      if (textData) {
        const products = JSON.parse(textData);
        product = products.find(p => p.id === productId); 
      }
    }
    if (!product) throw new Error('Product not found');
    
    // 2. سیٹنگز (واٹس ایپ نمبر کے لیے) حاصل کریں
    const settingsBlob = await head('settings.json', { cache: 'no-store' });
    const settingsResponse = await fetch(settingsBlob.url, { cache: 'no-store' });
    if (settingsResponse.ok) {
      const settingsText = await settingsResponse.text();
      if(settingsText) {
        const settings = JSON.parse(settingsText);
        if (settings.whatsappNumber) {
          whatsappNumber = settings.whatsappNumber; 
        }
      }
    }
  } catch (error) {
    console.error("Failed to get page data:", error);
    if (!product) return { product: null, whatsappNumber: null };
  }
  
  return { product, whatsappNumber };
}

// --- بیک (Back) آئیکن (ویسا ہی) ---
function IconArrowLeft() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
    </svg>
  );
}

// --- یوٹیوب ویڈیو ایمبیڈ (Embed) کمپوننٹ (اپ ڈیٹ شدہ) ---
function YouTubeEmbed({ videoLink }) {
  if (!videoLink) return null;

  let videoId = null;
  let isShort = false;

  try {
    const url = new URL(videoLink);
    
    // --- یہ ہے حل 3: یوٹیوب شارٹس کا پتا لگانا ---
    if (url.pathname.includes('/shorts/')) {
      isShort = true;
      videoId = url.pathname.split('/shorts/').pop();
    } else if (url.searchParams.get('v')) {
      videoId = url.searchParams.get('v'); // عام ویڈیو
    } else {
      videoId = url.pathname.split('/').pop(); // youtu.be/...
    }
    // --- حل ختم ---

    if (!videoId) return <p className="text-red-500">Invalid YouTube URL</p>;

    // شارٹ ویڈیو کے لیے 9:16 اور عام کے لیے 16:9 اسپیکٹ ریشو
    const aspectRatioClass = isShort ? "aspect-[9/16] max-w-xs mx-auto" : "aspect-[16/9]";

    return (
      <div className={`${aspectRatioClass} w-full overflow-hidden rounded-lg border`}>
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


// --- مین پروڈکٹ ڈیٹیل پیج (سرور کمپوننٹ) ---
export default async function ProductDetailPage({ params }) {
  const productId = params.id;
  const { product, whatsappNumber } = await getPageData(productId);

  if (!product) {
    // ... (ایرر پیج ویسا ہی) ...
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

  return (
    <main className="bg-white">
      {/* ہیڈر (ویسا ہی) */}
      <header className="sticky top-0 z-10 flex items-center gap-4 p-4 bg-white shadow-md">
        <Link href="/" className="p-2 rounded-full hover:bg-gray-100">
          <IconArrowLeft />
        </Link>
        <h1 className="text-xl font-bold break-words">{product.name}</h1>
      </header>

      {/* پروڈکٹ کی تفصیلات */}
      <div className="p-4 space-y-4">
        {/* --- یہ ہے حل 4: تصویر کو بڑا کرنا --- */}
        {/* 'h-64' کو 'h-80' (80% viewport height) سے بدل دیا گیا ہے */}
        <div className="w-full h-80 relative rounded-lg overflow-hidden border">
          <Image
            src={`${product.imageUrl}?v=${new Date().getTime()}`}
            alt={product.name}
            layout="fill"
            className="object-cover"
            unoptimized
            priority
          />
        </div>

        {/* یوٹیوب ویڈیو (یہ اب خود ایڈجسٹ ہو گا) */}
        <YouTubeEmbed videoLink={product.videoLink} />

        {/* تفصیلات (ویسی ہی) */}
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">{product.name}</h2>
          <p className="text-2xl font-bold text-blue-600">PKR {product.price}</p>
          <p className="text-md text-gray-700">
            <strong>Condition:</strong> {product.condition || 'N/A'}
          </p>
          <p className="text-md text-gray-700 whitespace-pre-wrap">
            <strong>Details:</strong><br />
            {product.detail || 'No details available.'}
          </p>
        </div>

        {/* واٹس ایپ بٹن (ویسا ہی) */}
        <div className="pt-4">
          <WhatsAppButton product={product} whatsappNumber={whatsappNumber} />
        </div>
      </div>
    </main>
  );
}
