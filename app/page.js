// app/page.js

import { head } from "@vercel/blob";
import HomePageClient from "./HomePageClient";

// 'force-dynamic' کو ہٹا دیا گیا ہے

// --- ✅ ایڈ سیٹنگز لوڈ کرنے کا فنکشن (یہاں بھی) ---
async function getAdSettings() {
  try {
    const blob = await head('ads.json', { cache: 'no-store' });
    const response = await fetch(blob.url, {
      next: { tags: ['ads'] } // <-- 'ads' ٹیگ استعمال کریں
    });
    if (response.ok) {
      const text = await response.text();
      if (text) return JSON.parse(text);
    }
  } catch (e) {}
  return { masterAdsEnabled: false }; // ڈیفالٹ
}

// --- پرانا فنکشن (ویسا ہی) ---
async function getBlobData() {
  // ... (آپ کا پرانا کوڈ جو settings.json, logo.png, background.png لوڈ کرتا ہے)
  // ... (اس میں کوئی تبدیلی نہیں کرنی)
  
  const defaultSettings = { websiteTitle: "Ilyas Mobile Mall" };
  let settings = defaultSettings;
  let products = [];
  let logoUrl = "/placeholder-logo.png";
  let bannerUrl = "";

  // 3. سیٹنگز سب سے پہلے حاصل کریں
  try {
    const settingsBlob = await head("settings.json", { cache: "no-store" });
    const response = await fetch(settingsBlob.url, { 
      next: { tags: ['settings'] } 
    });
    if (response.ok) {
      const text = await response.text();
      if (text) settings = JSON.parse(text);
    }
  } catch {}

  // 1. لوگو چیک کریں
  try {
    const logoBlob = await head("logo.png", { cache: "no-store" });
    const logoTimestamp = settings.logoLastUpdated || Date.now();
    logoUrl = `${logoBlob.url}?v=${logoTimestamp}`; 
  } catch {}

  // 2. بینر چیک کریں
  try {
    const bannerBlob = await head("background.png", { cache: "no-store" });
    const bannerTimestamp = settings.bannerLastUpdated || Date.now();
    bannerUrl = `${bannerBlob.url}?v=${bannerTimestamp}`;
  } catch {}

  // 4. پروڈکٹس حاصل کریں
  try {
    const dataBlob = await head("data.json", { cache: "no-store" });
    const response = await fetch(dataBlob.url, { cache: "no-store" }); // (اسے بھی بعد میں 'products' ٹیگ دے دیں)
    if (response.ok) {
      const text = await response.text();
      if (text) products = JSON.parse(text);
    }
  } catch {}

  return { settings, products, logoUrl, bannerUrl };
}

export default async function HomePage() {
  // 1. پرانا ڈیٹا لوڈ کریں
  const { settings, products, logoUrl, bannerUrl } = await getBlobData();
  
  // 2. --- ✅ نیا: ایڈ سیٹنگز بھی لوڈ کریں ---
  const adSettings = await getAdSettings();

  return (
    <HomePageClient
      initialProducts={products}
      settings={settings}
      logoUrl={logoUrl}
      bannerUrl={bannerUrl}
      adSettings={adSettings} // <-- ✅ ایڈ سیٹنگز کو کلائنٹ کو پاس کریں
    />
  );
}
