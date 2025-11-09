import { head } from '@vercel/blob';
import HomePageClient from './HomePageClient';

// Vercel کو بتاتا ہے کہ اس پیج کو کیش نہ کرے
export const dynamic = 'force-dynamic'; 

// --- ڈیٹا Fetch کرنے کا فنکشن (بالکل صاف) ---
async function getBlobData() {
  const defaultSettings = {
    websiteTitle: "Ilyas Mobile Mall",
  };
  let settings = defaultSettings;
  let products = [];
  
  // لوگو URL کو براہ راست (hardcode) سیٹ کر دیں
  const logoUrl = "https://hnt5qthrn2hkqfn9.public.blob.vercel-storage.com/logo.png";

  // 1. سیٹنگز Fetch کریں
  try {
    const settingsBlob = await head('settings.json', { cache: 'no-store' });
    const settingsResponse = await fetch(settingsBlob.url, { cache: 'no-store' });
    
    if (settingsResponse.ok) {
      const fetchedSettings = await settingsResponse.json();
      settings.websiteTitle = fetchedSettings.websiteTitle || defaultSettings.websiteTitle;
    } else {
      // ایرر پھینکیں تاکہ catch بلاک میں جائے
      throw new Error('Failed to fetch settings');
    }
  } catch (error) { // <-- [صحیح سینٹیکس]
    console.warn("Could not fetch 'settings.json'. Using default title.", error.message);
  }

  // 2. پروڈکٹس Fetch کریں
  try {
    const dataBlob = await head('data.json', { cache: 'no-store' });
    const dataResponse = await fetch(dataBlob.url, { cache: 'no-store' });

    if (dataResponse.ok) {
      products = await dataResponse.json();
    } else {
      // ایرر پھینکیں تاکہ catch بلاک میں جائے
      throw new Error('Failed to fetch product data');
    }
  } catch (error) { // <-- [صحیح سینٹیکس]
    console.warn("Could not fetch 'data.json'. Showing no products.", error.message);
  }

  return { settings, products, logoUrl };
}


// --- مین ہوم پیج (Server Component) ---
export default async function HomePage() {
  
  // 1. سرور پر تازہ ڈیٹا fetch کریں
  const { settings, products, logoUrl } = await getBlobData();

  // 2. سارا ڈیٹا کلائنٹ کمپوننٹ کو پاس کریں
  return (
    <HomePageClient 
      initialProducts={products} 
      settings={settings} 
      logoUrl={logoUrl} 
    />
  );
}
