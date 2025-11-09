import { head } from '@vercel/blob';
import HomePageClient from './HomePageClient'; // ہمارے کلائنٹ کمپوننٹ کو امپورٹ کریں

// --- یہ ہے حل! ---
// Vercel کو بتاتا ہے کہ اس پیج کو کیش نہ کرے اور ہمیشہ تازہ ڈیٹا لائے
export const dynamic = 'force-dynamic'; 
// --- حل ختم ---


// --- ڈیٹا Fetch کرنے کا فنکشن (یہ بالکل پہلے جیسا ہی ہے) ---
async function getBlobData() {
  const defaultSettings = {
    websiteTitle: "Ilyas Mobile Mall",
  };
  let settings = defaultSettings;
  let products = [];
  let logoUrl = "/placeholder-logo.png"; // ڈیفالٹ فال بیک

  try {
    const settingsBlob = await head('settings.json');
    const settingsResponse = await fetch(settingsBlob.url);
    if (!settingsResponse.ok) throw new Error('Failed to fetch settings');
    const fetchedSettings = await settingsResponse.json();
    settings.websiteTitle = fetchedSettings.websiteTitle || defaultSettings.websiteTitle;
  } catch (error) {
    console.warn("Could not fetch 'settings.json'. Using default title.", error.message);
  }

  try {
    const logoBlob = await head('logo.png');
    logoUrl = logoBlob.url;
  } catch (error) {
    console.warn("Could not fetch 'logo.png'. Using placeholder.", error.message);
  }

  try {
    const dataBlob = await head('data.json');
    const dataResponse = await fetch(dataBlob.url);
    if (!dataResponse.ok) throw new Error('Failed to fetch product data');
    products = await dataResponse.json();
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
