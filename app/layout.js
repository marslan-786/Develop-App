// --- 1. app/layout.js(مکمل فکس شدہ - Responsive) ---

import "./globals.css";
import { Inter } from "next/font/google";
import Script from "next/script";
import { head } from "@vercel/blob";

const inter = Inter({ subsets: ["latin"] });

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

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* یہاں سے دستی <meta name="viewport"...> ٹیگ ہٹا دیا گیا ہے */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1963262096178695"
          crossOrigin="anonymous"
          strategy="lazyOnload"
        />
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
