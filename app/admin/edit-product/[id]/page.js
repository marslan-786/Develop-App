import { head } from '@vercel/blob';
import Link from 'next/link';
import EditProductForm from './EditProductForm'; // ہمارا نیا کلائنٹ کمپوننٹ
import { isValidPassword } from '../../../../lib/auth.js'; // سرور-سائیڈ auth چیک

// Vercel کو بتاتا ہے کہ اس پیج کو کیش نہ کرے
export const dynamic = 'force-dynamic';

// یہ فنکشن اب سرور پر چلے گا
async function getProductById(productId) {
  try {
    const dataBlob = await head('data.json', { cache: 'no-store' });
    const dataResponse = await fetch(dataBlob.url, { cache: 'no-store' });
    if (!dataResponse.ok) throw new Error('Could not fetch data.json');
    
    const textData = await dataResponse.text();
    if (!textData) throw new Error('data.json is empty');
    
    const products = JSON.parse(textData);
    // یہ ہے اصل لاجک
    const product = products.find(p => p.id === productId); 
    if (!product) throw new Error('Product not found in data.json');
    
    return product;
  } catch (error) {
    console.error("Failed to get product:", error);
    return null;
  }
}

// بیک (Back) آئیکن
function IconArrowLeft() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
    </svg>
  );
}

// یہ اب ایک Server Component ہے
export default async function EditProductPage({ params, searchParams }) {
  const passwordQuery = searchParams.password;
  const productId = params.id; // URL سے [id] حاصل کریں

  // --- سیکیورٹی چیک ---
  if (!(await isValidPassword(passwordQuery))) {
    return (
      <div className="p-4 min-h-screen bg-gray-50 text-center">
        <h1 className="text-xl font-bold text-red-600">Unauthorized</h1>
        <p>You do not have permission to view this page.</p>
        <Link href="/admin" className="text-blue-500 underline mt-4">Go to Login</Link>
      </div>
    );
  }

  // --- سرور پر ڈیٹا Fetch کرنا ---
  const product = await getProductById(productId);

  // --- پیج رینڈر کریں ---
  return (
    <div className="p-4 min-h-screen bg-gray-50">
      <header className="flex items-center gap-4 mb-6">
        <Link href={`/admin?password=${passwordQuery}`} className="p-2 rounded-full hover:bg-gray-200">
          <IconArrowLeft />
        </Link>
        <h1 className="text-xl font-bold">Edit Product</h1>
      </header>

      {product ? (
        // ڈیٹا کو کلائنٹ کمپوننٹ (فارم) میں پاس کریں
        <EditProductForm 
          initialProduct={product} 
          passwordQuery={passwordQuery} 
        />
      ) : (
        // اگر getProductById ناکام ہو
        <div className="text-center text-red-600">
          <p>Error: Product not found. It might have been deleted.</p>
        </div>
      )}
    </div>
  );
}
