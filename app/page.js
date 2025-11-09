// ... (export const dynamic = 'force-dynamic'; اور import HomePageClient ویسے ہی رہیں گے) ...

// --- ڈیٹا Fetch کرنے کا فنکشن (نیا، ایگریسو 'no-cache' ورژن) ---
async function getBlobData() {
  const defaultSettings = {
    websiteTitle: "Ilyas Mobile Mall",
  };
  let settings = defaultSettings;
  let products = [];
  let logoUrl = "/placeholder-logo.png"; 

  try {
    // --- حل 1: سیٹنگز کے لیے 'no-store' ---
    const settingsBlob = await head('settings.json', { cache: 'no-store' });
    const settingsResponse = await fetch(settingsBlob.url, { cache: 'no-store' });
    
    if (!settingsResponse.ok) throw new Error('Failed to fetch settings');
    const fetchedSettings = await settingsResponse.json();
    settings.websiteTitle = fetchedSettings.websiteTitle || defaultSettings.websiteTitle;
  } catch (error) {
    console.warn("Could not fetch 'settings.json'.", error.message);
  }

  try {
    // --- حل 2: لوگو کے لیے 'no-store' ---
    const logoBlob = await head('logo.png', { cache: 'no-store' });
    logoUrl = logoBlob.url;
  } catch (error) {
    console.warn("Could not fetch 'logo.png'.", error.message);
  }

  try {
    // --- حل 3: پروڈکٹس کے لیے 'no-store' ---
    const dataBlob = await head('data.json', { cache: 'no-store' });
    const dataResponse = await fetch(dataBlob.url, { cache: 'no-store' });
    
    if (!dataResponse.ok) throw new Error('Failed to fetch product data');
    products = await dataResponse.json();
  } catch (error)
 {
    console.warn("Could not fetch 'data.json'.", error.message);
  }

  return { settings, products, logoUrl };
}

// ... (باقی فائل 'export default async function HomePage()...' ویسی ہی رہے گی) ...
