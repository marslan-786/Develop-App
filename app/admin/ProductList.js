import { head } from '@vercel/blob';
import AdminProductListClient from './AdminProductListClient.js'; // <-- ایک اور نئی کلائنٹ فائل

// --- یہ سرور کمپوننٹ صرف ڈیٹا لاتا ہے ---
export default async function ProductList() {
  
  // 1. پروڈکٹس کی لسٹ حاصل کریں (یہ سست کام ہے)
  let products = [];
  try {
    const dataBlob = await head('data.json', { cache: 'no-store' });
    const dataResponse = await fetch(dataBlob.url, { cache: 'no-store' });
    
    if (dataResponse.ok) {
      const textData = await dataResponse.text();
      if (textData) products = JSON.parse(textData);
    }
  } catch (error) {
    console.warn("Admin Panel: Could not fetch products.", error.message);
  }
  
  // 2. ڈیٹا کو کلائنٹ کمپوننٹ کو پاس کریں
  return (
    <AdminProductListClient initialProducts={products} />
  );
}
