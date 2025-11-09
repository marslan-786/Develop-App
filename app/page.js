import { head } from '@vercel/blob';
import HomePageClient from './HomePageClient';

// Vercel کو بتاتا ہے کہ اس پیج کو کیش نہ کرے
export const dynamic = 'force-dynamic'; 

// --- ڈیٹا Fetch کرنے کا فنکشن (صاف کیا ہوا ورژن) ---
async function getBlobData() {
  const defaultSettings = {
    websiteTitle: "Ilyas Mobile Mall",
  };
  let settings = defaultSettings;
  let products = [];
  let logoUrl = "/placeholder-logo.png"; // ڈیفالٹ فال بیک

  // 1. سیٹنگز Fetch کریں
  try {
    const settingsBlob = await head('settings.json', { cache: 'no-store' });
    const settingsResponse = await fetch(settingsBlob.url, { cache: 'no-store' });
    
    if (settingsResponse.ok) {
      const fetchedSettings = await settingsResponse.json();
      settings.websiteTitle = fetchedSettings.websiteTitle || defaultSettings.websiteTitle;
    } else {
      throw new Error('Failed to fetch settings');
    }
  } catch (error) {
    console.warn("Could not fetch 'settings.json'. Using default title.", error.message);
  }

  // 2. لوگو Fetch کریں
  try {
    const logoBlob = await head('logo.png', { cache: 'no-store' });
    logoUrl = logoBlob.url;
  } catch (error) {
    console.warn("Could not fetch 'logo.png'. Using placeholder.", error.message);
  }

  // 3. پروڈکٹس Fetch کریں
  try {
    const dataBlob = await head('data.json', { cache: 'no-store' });
    const dataResponse = await fetch(dataBlob.url, { cache: 'no-store' });

    if (dataResponse.ok) {
      products = await dataResponse.json();
    } else {
      throw new Error('Failed to fetch product data');
    }
  } catch (error) {
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
