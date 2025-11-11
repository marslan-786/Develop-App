// --- 1. app/layout.js (مکمل فائنل فکس - Ads کے ساتھ) ---

import "./globals.css";
import { Inter } from "next/font/google";
import Script from "next/script";
import { head } from "@vercel/blob";

const inter = Inter({ subsets: ["latin"] });

// --- ایڈ سیٹنگز لوڈ کرنا (یہ بالکل ٹھیک ہے) ---
async function getAdSettings() {
  try {
    const blob = await head('ads.json', { cache: 'no-store' });
    const response = await fetch(blob.url, {
      cache: 'no-store' // <-- یہ کیش کو بند رکھتا ہے
    });
    
    if (response.ok) {
      const text = await response.text();
      if (text) return JSON.parse(text);
    }
  } catch (e) {}
  
  return { 
    googleSiteVerification: null, 
    adsenseClientId: null, 
    masterAdsEnabled: false 
  };
}
// --- --- ---


export async function generateMetadata() {
  let settings = { websiteTitle: "Ilyas Mobile Mall" };
  let logoUrl = "/placeholder-logo.png";

  try {
    const settingsBlob = await head("settings.json", { cache: "no-store" });
    const settingsResponse = await fetch(settingsBlob.url, { cache: "no-store" });
    if (settingsResponse.ok) {
      const textData = await settingsResponse.text();
      if (textData) settings = JSON.parse(textData);
    }
  } catch (e) {
    console.warn("layout.js: Could not fetch 'settings.json'.");
  }

  try {
    const logoBlob = await head("logo.png", { cache: "no-store" });
    logoUrl = logoBlob.url;
  } catch (e) {
    console.warn("layout.js: Could not fetch 'logo.png'.");
  }

  return {
    title: settings.websiteTitle || "Ilyas Mobile Mall",
    description: "Your one-stop mobile shop.",
    icons: {
      icon: logoUrl,
      apple: logoUrl,
    },
    viewport: {
      width: "device-width",
      initialScale: 1,
    },
  };
}

export default async function RootLayout({ children }) {
  
  const adSettings = await getAdSettings();

  return (
    <html lang="en">
      <head>
        
        {/* --- ✅ گوگل اسنیپ کوڈ انجیکشن (اپ ڈیٹ شدہ) --- */}

        {/* 1. پہلا ویری فکیشن طریقہ (اگر آپ نے پہلے خانے میں کچھ ڈالا) */}
        {adSettings.googleSiteVerification && (
          <meta 
            name="google-site-verification" 
            content={adSettings.googleSiteVerification} 
          />
        )}
        
        {/* 2. دوسرا ویری فکیشن طریقہ (جو گوگل اب مانگ رہا ہے) */}
        {/* یہ 'AdSense Client ID' والے خانے سے ca-pub-... اٹھائے گا */}
        {adSettings.adsenseClientId && (
          <meta 
            name="google-adsense-account" 
            content={adSettings.adsenseClientId} 
          />
        )}
        
        {/* 3. گوگل ایڈسینس اسکرپٹ (ایڈز دکھانے کے لیے) */}
        {adSettings.masterAdsEnabled && adSettings.adsenseClientId && (
          <Script 
            async 
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adSettings.adsenseClientId}`}
            crossOrigin="anonymous"
            strategy="lazyOnload" 
          />
        )}
        
        {/* --- --- --- */}
      </head>

      <body className={`${inter.className} bg-gray-900`}>
        <div className="max-w-full mx-auto bg-gray-800 min-h-screen">
          {children}
        </div>
      </body>
    </html>
  );
}
