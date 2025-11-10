// --- 2. app/page.js ---
// (یہ فائل viewport اور max-width سیٹ کرے گی)

import { head } from '@vercel/blob';
import HomePageClient from './HomePageClient';

// --- حل 1: ہوم پیج کا Viewport 1200px ---
export const metadata = {
  viewport: {
    width: 1200,
  },
};
// --- حل ختم ---


export const dynamic = 'force-dynamic'; 

async function getBlobData() {
  const defaultSettings = { websiteTitle: "Ilyas Mobile Mall" };
  let settings = defaultSettings;
  let products = [];
  
  let logoUrl = "/placeholder-logo.png"; 
  try {
    const logoBlob = await head('logo.png', { cache: 'no-store' });
    logoUrl = logoBlob.url;
  } catch (error) {
    console.warn("page.js: Could not fetch 'logo.png'.");
  }
  
  let bannerUrl = "";
  try {
    const bannerBlob = await head('background.png', { cache: 'no-store' });
    bannerUrl = bannerBlob.url;
  } catch (error) {
    console.warn("page.js: Could not fetch 'background.png'.", error.message);
  }

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


// --- مین ہوم پیج ---
export default async function HomePage() {
  const { settings, products, logoUrl, bannerUrl } = await getBlobData();
  
  // --- حل 2: 'max-w-6xl' کنٹینر کو یہاں واپس لائیں ---
  return (
    <div className="max-w-6xl mx-auto"> 
      {/* یہ کلاس صرف ہوم پیج پر لاگو ہو گی */}
      <HomePageClient 
        initialProducts={products} 
        settings={settings} 
        logoUrl={logoUrl}
        bannerUrl={bannerUrl}
      />
    </div>
  );
  // --- حل ختم ---
}
