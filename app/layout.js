import "./globals.css";
import { Inter } from "next/font/google";
import Script from 'next/script'; 
import { head } from '@vercel/blob'; 

const inter = Inter({ subsets: ["latin"] });

// --- ڈائنامک ٹائٹل اور آئیکن ---
export async function generateMetadata() {
  let settings = { websiteTitle: "Ilyas Mobile Mall" }; // ڈیفالٹ
  let logoUrl = "/placeholder-logo.png"; // ڈیفالٹ

  try {
    const settingsBlob = await head('settings.json', { cache: 'no-store' });
    const settingsResponse = await fetch(settingsBlob.url, { cache: 'no-store' });
    if (settingsResponse.ok) {
      const textData = await settingsResponse.text();
      if (textData) settings = JSON.parse(textData);
    }
  } catch (e) {
    console.warn("layout.js: Could not fetch settings.json for metadata");
  }

  try {
    const logoBlob = await head('logo.png', { cache: 'no-store' });
    logoUrl = logoBlob.url;
  } catch (e) {
     console.warn("layout.js: Could not fetch logo.png for metadata");
  }

  return {
    title: settings.websiteTitle || "Ilyas Mobile Mall",
    description: "Your one-stop mobile shop.",
    icons: {
      icon: logoUrl,
      apple: logoUrl,
    },
    // --- یہ ہے حل 1: ڈیسک ٹاپ ویو پورٹ ---
    // یہ براؤزر کو 1200px چوڑائی پر رینڈر کرنے پر مجبور کرے گا
    viewport: 'width=1200, initial-scale=1',
    // --- حل ختم ---
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
        {/* 'max-w-6xl' (ڈیسک ٹاپ سائز) پہلے سے سیٹ ہے */}
        <div className="max-w-6xl mx-auto bg-gray-800 min-h-screen shadow-lg">
          {children}
        </div>
      </body>
    </html>
  );
}
