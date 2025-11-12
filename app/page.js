import { head } from "@vercel/blob";
import HomePageClient from "./HomePageClient";
import { Suspense } from "react"; // --- ✅ سسپنس امپورٹ کریں ---

async function getAdSettings() {
  try {
    const blob = await head('ads.json', { cache: 'no-store' });
    const response = await fetch(blob.url, { cache: 'no-store' });
    if (response.ok) {
      const text = await response.text();
      if (text) return JSON.parse(text);
    }
  } catch (e) {}
  return { masterAdsEnabled: false };
}

async function getBlobData() {
  const defaultSettings = { websiteTitle: "Ilyas Mobile Mall" };
  let settings = defaultSettings;
  let products = [];
  let logoUrl = "/placeholder-logo.png";
  let bannerUrl = "";

  try {
    const settingsBlob = await head("settings.json", { cache: "no-store" });
    const response = await fetch(settingsBlob.url, { next: { tags: ['settings'] } });
    if (response.ok) {
      const text = await response.text();
      if (text) settings = JSON.parse(text);
    }
  } catch {}

  try {
    const logoBlob = await head("logo.png", { cache: "no-store" });
    const logoTimestamp = settings.logoLastUpdated || Date.now();
    logoUrl = `${logoBlob.url}?v=${logoTimestamp}`; 
  } catch {}

  try {
    const bannerBlob = await head("background.png", { cache: "no-store" });
    const bannerTimestamp = settings.bannerLastUpdated || Date.now();
    bannerUrl = `${bannerBlob.url}?v=${bannerTimestamp}`;
  } catch {}

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

// --- لوڈنگ fallback ---
function HomeLoader() {
  return <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">Loading...</div>;
}

export default async function HomePage() {
  const { settings, products, logoUrl, bannerUrl } = await getBlobData();
  const adSettings = await getAdSettings();

  return (
    // --- ✅ فکس 2: سسپنس باؤنڈری شامل کی گئی ---
    <Suspense fallback={<HomeLoader />}>
      <HomePageClient
        initialProducts={products}
        settings={settings}
        logoUrl={logoUrl}
        bannerUrl={bannerUrl}
        adSettings={adSettings} 
      />
    </Suspense>
  );
}
