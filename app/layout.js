// app/layout.js

import "./globals.css";
import { Inter } from "next/font/google";
import Script from "next/script";
import { head } from "@vercel/blob";

const inter = Inter({ subsets: ["latin"] });

// --- ✅ نیا فنکشن: ایڈ سیٹنگز لوڈ کرنا ---
async function getAdSettings() {
  try {
    const blob = await head('ads.json', { cache: 'no-store' });
    
    // --- ✅ تبدیلی یہاں ہے ---
    // ہم نے 'tags' کو 'no-store' سے بدل دیا ہے
    // تاکہ یہ فائل کبھی کیش نہ ہو
    const response = await fetch(blob.url, {
      cache: 'no-store' 
    });
    // --- --- ---
    
    if (response.ok) {
      const text = await response.text();
      if (text) return JSON.parse(text);
    }
  } catch (e) {
    // اگر فائل نہیں ملتی تو کوئی مسئلہ نہیں
  }
  // ڈیفالٹ ویلیو اگر کچھ نہ ملے
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
  
  // ایڈ سیٹنگز لوڈ کریں (اب یہ ہمیشہ تازہ ترین ہوں گی)
  const adSettings = await getAdSettings();

  return (
    <html lang="en">
      <head>
        {/* 1. گوگل ویری فکیشن کوڈ */}
        {adSettings.googleSiteVerification && (
          <meta 
            name="google-site-verification" 
            content={adSettings.googleSiteVerification} 
          />
        )}
        
        {/* 2. گوگل ایڈسینس اسکرپٹ (صرف اگر ایڈز 'On' ہوں) */}
        {adSettings.masterAdsEnabled && adSettings.adsenseClientId && (
          <Script 
            async 
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adSettings.adsenseClientId}`}
            crossOrigin="anonymous"
            strategy="lazyOnload" 
          />
        )}
      </head>

      <body className={`${inter.className} bg-gray-900`}>
        <div className="max-w-full mx-auto bg-gray-800 min-h-screen">
          {children}
        </div>
      </body>
    </html>
  );
}
