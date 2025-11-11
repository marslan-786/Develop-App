// --- 1. app/layout.js (مکمل فکس شدہ - Ads کے ساتھ) ---

import "./globals.css";
import { Inter } from "next/font/google";
import Script from "next/script";
import { head } from "@vercel/blob";

const inter = Inter({ subsets: ["latin"] });

// --- ✅ نیا فنکشن: ایڈ سیٹنگز لوڈ کرنا ---
async function getAdSettings() {
  try {
    // 1. 'ads.json' فائل کو تلاش کریں
    const blob = await head('ads.json', { cache: 'no-store' });
    
    // 2. اسے fetch کریں اور 'ads' کا ٹیگ استعمال کریں
    const response = await fetch(blob.url, {
      next: { tags: ['ads'] } // <-- یہ 'ads' سگنل کا انتظار کرے گا
    });
    
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
    
    // --- فکس 1: Viewport کو واپس Responsive (device-width) پر سیٹ کیا گیا ہے ---
    viewport: {
      width: "device-width",
      initialScale: 1,
    },
    // --- فکس ختم ---
  };
}

export default async function RootLayout({ children }) {
  
  // --- ✅ تبدیلی: ایڈ سیٹنگز لوڈ کریں ---
  const adSettings = await getAdSettings();

  return (
    <html lang="en">
      <head>
        {/* آپ کا پرانا ہارڈ کوڈڈ اسکرپٹ یہاں سے ہٹا دیا گیا ہے */}

        {/* --- ✅ یہ ہے آپ کا گوگل اسنیپ کوڈ انجیکشن --- */}
        
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
            strategy="lazyOnload" // <-- 'lazyOnload' بہترین ہے
          />
        )}
        
        {/* --- --- --- */}
      </head>

      <body className={`${inter.className} bg-gray-900`}>
        {/* --- فکس 2: کنٹینر کو 'max-w-full' (Responsive) پر سیٹ کیا گیا ہے --- */}
        <div className="max-w-full mx-auto bg-gray-800 min-h-screen">
          {children}
        </div>
        {/* --- فکس ختم --- */}
      </body>
    </html>
  );
}
