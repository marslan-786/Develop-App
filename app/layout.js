// --- 1. app/layout.js ---
// (اس فائل کو responsive رہنا چاہیے)

import "./globals.css";
import { Inter } from "next/font/google";
import Script from 'next/script'; 
import { head } from '@vercel/blob'; 

const inter = Inter({ subsets: ["latin"] });

export async function generateMetadata() {
  let settings = { websiteTitle: "Ilyas Mobile Mall" };
  let logoUrl = "/placeholder-logo.png";

  try {
    const settingsBlob = await head('settings.json', { cache: 'no-store' });
    const settingsResponse = await fetch(settingsBlob.url, { cache: 'no-store' });
    if (settingsResponse.ok) {
      const textData = await settingsResponse.text();
      if (textData) settings = JSON.parse(textData);
    }
  } catch (e) { /* ... */ }

  try {
    const logoBlob = await head('logo.png', { cache: 'no-store' });
    logoUrl = logoBlob.url;
  } catch (e) { /* ... */ }

  return {
    title: settings.websiteTitle || "Ilyas Mobile Mall",
    description: "Your one-stop mobile shop.",
    icons: {
      icon: logoUrl,
      apple: logoUrl,
    },
    // یہاں سے viewport ہٹا دیا گیا ہے تاکہ یہ دوسرے پیجز کو خراب نہ کرے
  };
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" dir="ltr">
      <head>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1963262096178695" 
          crossOrigin="anonymous"
          strategy="lazyOnload" 
        />
      </head>
      
      <body className={`${inter.className} bg-gray-900`}>
        {/* یہ max-w-full رہے گا */}
        <div className="max-w-full mx-auto bg-gray-800 min-h-screen">
          {children}
        </div>
      </body>
    </html>
  );
}
