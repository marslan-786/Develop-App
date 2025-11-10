// --- app/page.js ---
// (Viewport fix, desktop container)

import { head } from "@vercel/blob";
import HomePageClient from "./HomePageClient";

export const dynamic = "force-dynamic";

// ✅ Fix viewport metadata
export const metadata = {
  viewport: { width: 1200 },
};

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

  return (
    <div className="max-w-[1200px] mx-auto bg-gray-900 min-h-screen">
      <HomePageClient
        initialProducts={products}
        settings={settings}
        logoUrl={logoUrl}
        bannerUrl={bannerUrl}
      />
    </div>
  );
}
