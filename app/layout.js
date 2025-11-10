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
    
    // --- تبدیلی 1: 'viewport' کو اس آبجیکٹ سے بدل دیا گیا ہے ---
    viewport: {
      width: 1200,
    },
    // --- تبدیلی ختم ---
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
        {/* --- تبدیلی 2: 'max-w-full' کو 'max-w-6xl' سے بدل دیا گیا ہے --- */}
        <div className="max-w-6xl mx-auto bg-gray-800 min-h-screen">
          {children}
        </div>
        {/* --- تبدیلی ختم --- */}
      </body>
    </html>
  );
}
