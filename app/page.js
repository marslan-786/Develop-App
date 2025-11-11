import { head } from "@vercel/blob";
import HomePageClient from "./HomePageClient";

// --- تبدیلی 1: 'force-dynamic' کو ہٹا دیا گیا ---
// اب یہ پیج کیشنگ استعمال کرے گا اور صرف سگنل ملنے پر اپ ڈیٹ ہوگا۔
// export const dynamic = "force-dynamic"; 

async function getBlobData() {
  const defaultSettings = { websiteTitle: "Ilyas Mobile Mall" };
  let settings = defaultSettings;
  let products = [];
  let logoUrl = "/placeholder-logo.png";
  let bannerUrl = "";

  // 1. لوگو چیک کریں
  try {
    const logoBlob = await head("logo.png", { cache: 'no-store' });
    logoUrl = logoBlob.url;
  } catch {}

  // 2. بینر چیک کریں
  try {
    const bannerBlob = await head("background.png", { cache: 'no-store' });
    bannerUrl = bannerBlob.url;
  } catch {}

  // 3. سیٹنگز (ٹائٹل، واٹس ایپ) حاصل کریں
  try {
    const settingsBlob = await head("settings.json", { cache: 'no-store' });
    
    // --- ✅ تبدیلی 2: یہاں سگنل وصول کرنے والا کوڈ لگایا ہے ---
    const response = await fetch(settingsBlob.url, { 
      next: { tags: ['settings'] } // <--- یہ لائن سب سے اہم ہے!
    });
    // -------------------------------------------------------

    if (response.ok) {
      const text = await response.text();
      if (text) settings = JSON.parse(text);
    }
  } catch {}

  // 4. پروڈکٹس حاصل کریں
  try {
    const dataBlob = await head("data.json", { cache: 'no-store' });
    
    // پروڈکٹس کو فی الحال 'no-store' پر رکھیں تاکہ وہ فوراً نظر آئیں
    // جب آپ پروڈکٹ API میں بھی revalidateTag لگا لیں تو اسے بھی tags: ['products'] کر دیجئے گا
    const response = await fetch(dataBlob.url, { cache: 'no-store' });
    
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
