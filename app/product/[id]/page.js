import { head } from '@vercel/blob';
import Image from 'next/image';
import Link from 'next/link';
import WhatsAppButton from './WhatsAppButton.js'; // <-- نیا امپورٹ

export const dynamic = 'force-dynamic'; 

// --- سرور پر ڈیٹا لانے والا فنکشن ---
async function getPageData(productId) {
  let product = null;
  let whatsappNumber = "923001234567"; // ڈیفالٹ فال بیک نمبر

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
          whatsappNumber = settings.whatsappNumber; // <-- نمبر کو اپ ڈیٹ کریں
        }
      }
    }
  } catch (error) {
    console.error("Failed to get page data:", error);
    if (!product) return { product: null, whatsappNumber: null };
  }
  
  return { product, whatsappNumber };
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
    let videoId = url.searchParams.get('v');
    if (!videoId) videoId = url.pathname.split('/').pop();
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

// --- واٹس ایپ بٹن کا فنکشن یہاں سے ہٹا دیا گیا ہے ---


// --- مین پروڈکٹ ڈیٹیل پیج (سرور کمپوننٹ) ---
export default async function ProductDetailPage({ params }) {
  const productId = params.id;
  const { product, whatsappNumber } = await getPageData(productId);

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
          <p className="text-md text-gray-700 whitespace-pre-wrap">
            <strong>Details:</strong><br />
            {product.detail || 'No details available.'}
          </p>
        </div>

        {/* واٹس ایپ بٹن */}
        <div className="pt-4">
          <WhatsAppButton product={product} whatsappNumber={whatsappNumber} />
        </div>
      </div>
    </main>
  );
}
