import { head } from '@vercel/blob';
import HomePageClient from './HomePageClient';

export const dynamic = 'force-dynamic'; 

// --- ڈیٹا Fetch کرنے کا فنکشن (اپ ڈیٹ شدہ) ---
async function getBlobData() {
  const defaultSettings = { websiteTitle: "Ilyas Mobile Mall" };
  let settings = defaultSettings;
  let products = [];
  
  // --- یہ ہے حل 6: لوگو پاتھ ---
  let logoUrl = "/placeholder-logo.png"; // ڈیفالٹ
  try {
    const logoBlob = await head('logo.png', { cache: 'no-store' });
    logoUrl = logoBlob.url;
  } catch (error) {
    console.warn("page.js: Could not fetch 'logo.png'.");
  }
  // --- حل ختم ---
  
  let bannerUrl = "";
  try {
    const bannerBlob = await head('background.png', { cache: 'no-store' });
    bannerUrl = bannerBlob.url;
  } catch (error) {
    console.warn("page.js: Could not fetch 'background.png'.", error.message);
  }

  // سیٹنگز Fetch کریں
  try {
    const settingsBlob = await head('settings.json', { cache: 'no-store' });
    const settingsResponse = await fetch(settingsBlob.url, { cache: 'no-store' });
    if (settingsResponse.ok) {
      const textData = await settingsResponse.text();
      if (textData) settings = JSON.parse(textData);
    }
  } catch (error) {
    console.warn("page.js: Could not fetch 'settings.json'.", error.message);
  }

  // پروڈکٹس Fetch کریں
  try {
    const dataBlob = await head('data.json', { cache: 'no-store' });
    const dataResponse = await fetch(dataBlob.url, { cache: 'no-store' });
    if (dataResponse.ok) {
      const textData = await dataResponse.text();
      if (textData) products = JSON.parse(textData);
    }
  } catch (error) {
    console.warn("page.js: Could not fetch 'data.json'.", error.message);
  }

  return { settings, products, logoUrl, bannerUrl };
}


// --- مین ہوم پیج (Server Component) ---
export default async function HomePage() {
  const { settings, products, logoUrl, bannerUrl } = await getBlobData();
  return (
    <HomePageClient 
      initialProducts={products} 
      settings={settings} 
      logoUrl={logoUrl}
      bannerUrl={bannerUrl}
    />
  );
}
