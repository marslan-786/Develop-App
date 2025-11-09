// ... (export const dynamic = 'force-dynamic'; اور import HomePageClient ویسے ہی رہیں گے) ...

// --- ڈیٹا Fetch کرنے کا فنکشن (نیا، ہارڈ کوڈڈ لوگو URL کے ساتھ) ---
async function getBlobData() {
  const defaultSettings = {
    websiteTitle: "Ilyas Mobile Mall",
  };
  let settings = defaultSettings;
  let products = [];
  
  // --- یہ ہے حل! ---
  // لوگو URL کو براہ راست (hardcode) سیٹ کر دیں
  const logoUrl = "https://hnt5qthrn2hkqfn9.public.blob.vercel-storage.com/logo.png";
  // --- حل ختم ---

  // 1. سیٹنگز Fetch کریں (no-store کے ساتھ)
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

  // 2. لوگو Fetch کرنے کی اب ضرورت نہیں!

  // 3. پروڈکٹس Fetch کریں (no-store کے ساتھ)
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

  // فنکشن سے ڈیٹا اور ہارڈ کوڈڈ لوگو URL واپس بھیجیں
  return { settings, products, logoUrl };
}

// ... (باقی فائل 'export default async function HomePage()...' ویسی ہی رہے گی) ...
