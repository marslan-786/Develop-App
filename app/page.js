// app/page.js

import { head } from "@vercel/blob";
import HomePageClient from "./HomePageClient";
import { kv } from '@vercel/kv'; // <-- ✅ 1. KV کو امپورٹ کریں

// --- ✅ 2. وزٹ کو ٹریک کرنے کا فنکشن ---
async function trackVisit() {
  try {
    // موجودہ تاریخ (PKT) حاصل کریں
    const today = new Date().toLocaleString('sv-SE', { 
      timeZone: 'Asia/Karachi' 
    }).split(' ')[0]; // 'YYYY-MM-DD'
    
    const dailyVisitsKey = `visits:${today}`;

    // 1. آج کے وزٹ میں 1 جمع کریں
    await kv.incr(dailyVisitsKey);
    // 2. ٹوٹل وزٹ میں 1 جمع کریں
    await kv.incr('total_visitors');
    
    // پرانی تاریخوں کا ڈیٹا 2 دن بعد خود بخود ڈیلیٹ کر دیں
    await kv.expire(dailyVisitsKey, 60 * 60 * 24 * 2); // 2 دن

  } catch (error) {
    console.error("KV Error (trackVisit):", error.message);
  }
}
// --- --- ---

// --- ایڈ سیٹنگز لوڈ کرنے کا فنکشن ---
async function getAdSettings() {
  try {
    const blob = await head('ads.json', { cache: 'no-store' });
    const response = await fetch(blob.url, {
      cache: 'no-store' // <-- کیش کے بغیر
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
    const response = await fetch(dataBlob.url, { cache: "no-store" });
    if (response.ok) {
      const text = await response.text();
      if (text) products = JSON.parse(text);
    }
  } catch {}

  return { settings, products, logoUrl, bannerUrl };
}

export default async function HomePage() {
  // --- ✅ 3. ہر پیج لوڈ پر فنکشن کو کال کریں ---
  trackVisit(); 
  // --- --- ---

  // باقی کوڈ ویسا ہی رہے گا
  const { settings, products, logoUrl, bannerUrl } = await getBlobData();
  const adSettings = await getAdSettings();

  return (
    <HomePageClient
      initialProducts={products}
      settings={settings}
      logoUrl={logoUrl}
      bannerUrl={bannerUrl}
      adSettings={adSettings} 
    />
  );
}
