import { head } from "@vercel/blob";
import HomePageClient from "./HomePageClient";

// 'force-dynamic' کو ہٹا دیا گیا ہے

async function getBlobData() {
  const defaultSettings = { websiteTitle: "Ilyas Mobile Mall" };
  let settings = defaultSettings;
  let products = [];
  let logoUrl = "/placeholder-logo.png";
  let bannerUrl = "";

  // --- ❌ 'cacheBuster' کو یہاں سے ہٹا دیا گیا ہے ---
  // const cacheBuster = `?v=${Date.now()}`;

  // 3. سیٹنگز سب سے پہلے حاصل کریں (تاکہ ہمارے پاس ٹائم اسٹیمپس ہوں)
  try {
    const settingsBlob = await head("settings.json", { cache: "no-store" });
    const response = await fetch(settingsBlob.url, { 
      next: { tags: ['settings'] } // <--- یہ ٹیگ بالکل ٹھیک ہے
    });
    if (response.ok) {
      const text = await response.text();
      if (text) settings = JSON.parse(text);
    }
  } catch {}

  // 1. لوگو چیک کریں (سیٹنگز کے بعد)
  try {
    const logoBlob = await head("logo.png", { cache: "no-store" });
    
    // --- ✅ مخصوص ٹائم اسٹیمپ استعمال کریں ---
    // اگر 'logoLastUpdated' موجود ہے تو وہ، ورنہ موجودہ وقت
    const logoTimestamp = settings.logoLastUpdated || Date.now();
    logoUrl = `${logoBlob.url}?v=${logoTimestamp}`; 
  } catch {}

  // 2. بینر چیک کریں (سیٹنگز کے بعد)
  try {
    const bannerBlob = await head("background.png", { cache: "no-store" });
    
    // --- ✅ مخصوص ٹائم اسٹیمپ استعمال کریں ---
    const bannerTimestamp = settings.bannerLastUpdated || Date.now();
    bannerUrl = `${bannerBlob.url}?v=${bannerTimestamp}`;
  } catch {}

  // 4. پروڈکٹس حاصل کریں (یہ ویسا ہی رہے گا)
  try {
    const dataBlob = await head("data.json", { cache: "no-store" });
    const response = await fetch(dataBlob.url, { cache: "no-store" });
    if (response.ok) {
      const text = await response.text();
      if (text) products = JSON.parse(text);
    }
  } catch {}

  return { settings, products, logoUrl, bannerUrl };
}

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
