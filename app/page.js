// --- 2. app/page.js (مکمل فکس شدہ - Responsive) ---

import { head } from "@vercel/blob";
import HomePageClient from "./HomePageClient";

export const dynamic = "force-dynamic";

// --- فکس 3: یہاں سے 'metadata' (viewport) آبجیکٹ ہٹا دیا گیا ہے ---
// (تاکہ یہ layout.js کی responsive سیٹنگ استعمال کرے)
// --- فکس ختم ---

async function getBlobData() {
  const defaultSettings = { websiteTitle: "Ilyas Mobile Mall" };
  let settings = defaultSettings;
  let products = [];
  let logoUrl = "/placeholder-logo.png";
  let bannerUrl = "";

  try {
    const logoBlob = await head("logo.png", { cache: "no-store" });
    logoUrl = logoBlob.url;
  } catch {}

  try {
    const bannerBlob = await head("background.png", { cache: "no-store" });
    bannerUrl = bannerBlob.url;
  } catch {}

  try {
    const settingsBlob = await head("settings.json", { cache: "no-store" });
    const response = await fetch(settingsBlob.url, { cache: "no-store" });
    if (response.ok) {
      const text = await response.text();
      if (text) settings = JSON.parse(text);
    }
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

export default async function HomePage() {
  const { settings, products, logoUrl, bannerUrl } = await getBlobData();

  // --- فکس 4: یہاں سے 'max-w-[1200px]' والا div ہٹا دیا گیا ہے ---
  return (
    <HomePageClient
      initialProducts={products}
      settings={settings}
      logoUrl={logoUrl}
      bannerUrl={bannerUrl}
    />
  );
  // --- فکس ختم ---
}
