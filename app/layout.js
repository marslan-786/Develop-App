import "./globals.css";
import { Inter } from "next/font/google";
import Script from 'next/script'; 
import { head } from '@vercel/blob'; 

const inter = Inter({ subsets: ["latin"] });

// --- ڈائنامک ٹائٹل اور آئیکن ---
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
  } catch (e) {}

  try {
    const logoBlob = await head('logo.png', { cache: 'no-store' });
    logoUrl = logoBlob.url;
  } catch (e) {}

  return {
    title: settings.websiteTitle || "Ilyas Mobile Mall",
    description: "Your one-stop mobile shop.",
    icons: {
      icon: logoUrl,
      apple: logoUrl,
    },
    viewport: 'width=1200, user-scalable=no, maximum-scale=1', // ✅ ہمیشہ ڈیسک ٹاپ
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
      
      <body className="bg-gray-900">
        <div className="w-[1200px] mx-auto bg-gray-800 min-h-screen shadow-lg overflow-x-auto">
          {children}
        </div>
      </body>
    </html>
  );
}
