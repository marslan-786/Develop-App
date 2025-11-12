import "./globals.css";
import { Inter } from "next/font/google";
import Script from "next/script";
import { head } from "@vercel/blob";

const inter = Inter({ subsets: ["latin"] });

async function getAdSettings() {
  try {
    const blob = await head('ads.json', { cache: 'no-store' });
    const response = await fetch(blob.url, { cache: 'no-store' });
    if (response.ok) {
      const text = await response.text();
      if (text) return JSON.parse(text);
    }
  } catch (e) {}
  return { googleSiteVerification: null, adsenseClientId: null, masterAdsEnabled: false };
}

// --- ✅ فکس 1: Viewport کو الگ export کریں ---
export const viewport = {
  width: "device-width",
  initialScale: 1,
};

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
  } catch (e) {}

  try {
    const logoBlob = await head("logo.png", { cache: "no-store" });
    const logoTimestamp = settings.logoLastUpdated || Date.now();
    logoUrl = `${logoBlob.url}?v=${logoTimestamp}`;
  } catch (e) {}

  return {
    title: settings.websiteTitle || "Ilyas Mobile Mall",
    description: "Your one-stop mobile shop.",
    icons: {
      icon: logoUrl,
      apple: logoUrl,
    },
    // ❌ یہاں سے viewport ہٹا دیا گیا ہے
  };
}

export default async function RootLayout({ children }) {
  const adSettings = await getAdSettings();

  return (
    <html lang="en">
      <head>
        {adSettings.googleSiteVerification && (
          <meta name="google-site-verification" content={adSettings.googleSiteVerification} />
        )}
        {adSettings.adsenseClientId && (
          <meta name="google-adsense-account" content={adSettings.adsenseClientId} />
        )}
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
