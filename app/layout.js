import "./globals.css";
import { Inter } from "next/font/google";
import Script from 'next/script'; 
import { head } from '@vercel/blob'; // <-- Blob کو امپورٹ کریں

const inter = Inter({ subsets: ["latin"] });

// --- یہ ہے حل 4: ڈائنامک ٹائٹل اور آئیکن ---
export async function generateMetadata() {
  let settings = { websiteTitle: "Ilyas Mobile Mall" }; // ڈیفالٹ
  let logoUrl = "/placeholder-logo.png"; // ڈیفالٹ

  try {
    // سیٹنگز سے ٹائٹل حاصل کریں
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
    // --- یہ ہے حل 6: لوگو پاتھ ---
    // لوگو پاتھ سے آئیکن حاصل کریں
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
  };
}
// --- حل ختم ---

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
        <div className="max-w-6xl mx-auto bg-gray-800 min-h-screen shadow-lg">
          {children}
        </div>
      </body>
    </html>
  );
}
