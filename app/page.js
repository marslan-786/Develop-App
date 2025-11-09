import Image from 'next/image';
import Link from 'next/link';
import { head } from '@vercel/blob'; // Vercel Blob سے 'head' کو import کریں

// --- ڈیٹا Fetch کرنے کا فنکشن (یہ سرور پر چلے گا) ---
async function getBlobData() {
  const defaultSettings = {
    websiteTitle: "Ilyas Mobile Mall", // ڈیفالٹ ٹائٹل
  };
  
  let settings = defaultSettings;
  let products = [];
  let logoUrl = "/placeholder-logo.png"; // ڈیفالٹ فال بیک لوگو

  try {
    // 1. settings.json کو fetch کریں (صرف ٹائٹل کے لیے)
    const settingsBlob = await head('settings.json');
    const settingsResponse = await fetch(settingsBlob.url);
    if (!settingsResponse.ok) {
      throw new Error('Failed to fetch settings');
    }
    const fetchedSettings = await settingsResponse.json();
    // اگر Blob میں ٹائٹل موجود ہے تو وہ استعمال کریں، ورنہ ڈیفالٹ
    settings.websiteTitle = fetchedSettings.websiteTitle || defaultSettings.websiteTitle;

  } catch (error) {
    // اگر 'settings.json' نہیں ملتی تو کنسول پر وارننگ دیں
    console.warn("Could not fetch 'settings.json'. Using default title.", error.message);
  }

  try {
    // 2. 'logo.png' پاتھ سے براہ راست URL حاصل کریں
    // یہ ہمیشہ Blob سے تازہ ترین لوگو کا URL اٹھائے گا
    const logoBlob = await head('logo.png');
    logoUrl = logoBlob.url; 

  } catch (error) {
    // اگر 'logo.png' نہیں ملتی تو کنسول پر وارننگ دیں
    console.warn("Could not fetch 'logo.png'. Using placeholder.", error.message);
  }

  try {
    // 3. data.json کو fetch کریں (پروڈکٹس کے لیے)
    const dataBlob = await head('data.json');
    const dataResponse = await fetch(dataBlob.url);
    if (!dataResponse.ok) {
      throw new Error('Failed to fetch product data');
    }
    products = await dataResponse.json();

  } catch (error) {
    // اگر 'data.json' نہیں ملتی تو کنسول پر وارننگ دیں
    console.warn("Could not fetch 'data.json'. Showing no products.", error.message);
  }

  // آبجیکٹ میں سارا ڈیٹا واپس بھیجیں
  return { settings, products, logoUrl };
}

// --- Icon Components (ان میں کوئی تبدیلی نہیں) ---
function IconMenu() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
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

// --- Header Component ---
function AppHeader({ title, logoSrc }) {
  return (
    <header className="sticky top-0 z-10 flex items-center justify-between p-4 bg-white shadow-md">
      <button className="p-2 rounded-full hover:bg-gray-100">
        <IconMenu />
      </button>

      <div className="flex items-center gap-2">
        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-200 flex-shrink-0">
          <Image
            src={logoSrc}
            alt="Logo"
            width={40}
            height={40}
            className="object-cover"
            priority // لوگو کو جلدی لوڈ کریں
            onError={(e) => { e.currentTarget.src = "/placeholder-logo.png"; e.currentTarget.onerror = null; }}
          />
        </div>
        
        <h1 className="text-xl font-bold whitespace-nowrap">{title}</h1>
        
        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-200 flex-shrink-0">
          <Image
            src={logoSrc}
            alt="Logo"
            width={40}
            height={40}
            className="object-cover"
            priority
            onError={(e) => { e.currentTarget.src = "/placeholder-logo.png"; e.currentTarget.onerror = null; }}
          />
        </div>
      </div>

      <button className="p-2 rounded-full hover:bg-gray-100">
        <IconSearch />
      </button>
    </header>
  );
}

// --- Product Card Component ---
function ProductCard({ product }) {
  return (
    <div className="border rounded-lg overflow-hidden shadow-sm bg-white flex flex-col">
      <div className="w-full h-40 relative">
        <Image
          src={product.imageUrl || "/placeholder-image.png"}
          alt={product.name}
          layout="fill"
          className="object-cover"
          onError={(e) => { e.currentTarget.src = "/placeholder-image.png"; e.currentTarget.onerror = null; }}
        />
      </div>
      <div className="p-3 flex-grow flex flex-col">
        <h3 className="text-lg font-semibold truncate">{product.name}</h3>
        <p className="text-sm text-gray-600 truncate mt-1">{product.detail}</p>
        <p className="text-lg font-bold text-blue-600 mt-2">PKR {product.price}</p>
        {/* بعد میں ہم اسے <Link href={`/product/${product.id}`}> میں تبدیل کریں گے */}
        <button className="mt-3 w-full bg-blue-500 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors">
          View Details
        </button>
      </div>
    </div>
  );
}

// --- Main Home Page (Async Component) ---
export default async function HomePage() {
  
  // سرور پر ڈیٹا fetch کریں
  const { settings, products, logoUrl } = await getBlobData();

  return (
    <main>
      <AppHeader title={settings.websiteTitle} logoSrc={logoUrl} />

      <div className="p-4">
        {/* --- Product Grid --- */}
        {products && products.length > 0 ? (
          <div className="grid grid-cols-2 gap-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          // اگر کوئی پروڈکٹ نہیں ہے تو یہ پیغام دکھائیں
          <div className="text-center text-gray-500 mt-20">
            <p>No products found.</p>
            <p className="text-sm mt-2">Check back later or visit our admin panel to add products.</p>
          </div>
        )}
      </div>
      
      {/* --- Admin Panel Link --- */}
      <div className="p-4 text-center">
        <Link href="/admin" className="text-blue-500 underline">
          Go to Admin Panel
        </Link>
      </div>
    </main>
  );
}
