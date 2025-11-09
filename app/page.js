import { head } from '@vercel/blob';
import HomePageClient from './HomePageClient';

// Vercel کو بتاتا ہے کہ اس پیج کو کیش نہ کرے
export const dynamic = 'force-dynamic'; 

// --- ڈیٹا Fetch کرنے کا فنکشن (no-store کے ساتھ) ---
async function getBlobData() {
  const defaultSettings = { websiteTitle: "Ilyas Mobile Mall" };
  let settings = defaultSettings;
  let products = [];
  const logoUrl = "https://hnt5qthrn2hkqfn9.public.blob.vercel-storage.com/logo.png";

  // 1. سیٹنگز Fetch کریں
  try {
    const settingsBlob = await head('settings.json', { cache: 'no-store' });
    const settingsResponse = await fetch(settingsBlob.url, { cache: 'no-store' });
    if (settingsResponse.ok) {
      const textData = await settingsResponse.text();
      if (textData) settings = JSON.parse(textData);
    } else {
      throw new Error('Failed to fetch settings');
    }
  } catch (error) {
    console.warn("Could not fetch 'settings.json'.", error.message);
  }

  // 2. پروڈکٹس Fetch کریں
  try {
    const dataBlob = await head('data.json', { cache: 'no-store' });
    const dataResponse = await fetch(dataBlob.url, { cache: 'no-store' });
    if (dataResponse.ok) {
      const textData = await dataResponse.text();
      if (textData) products = JSON.parse(textData);
    } else {
      throw new Error('Failed to fetch product data');
    }
  } catch (error) {
    console.warn("Could not fetch 'data.json'.", error.message);
  }

  return { settings, products, logoUrl };
}

// --- مین ہوم پیج (Server Component) ---
export default async function HomePage() {
  const { settings, products, logoUrl } = await getBlobData();
  return (
    <HomePageClient 
      initialProducts={products} 
      settings={settings} 
      logoUrl={logoUrl} 
    />
  );
}
