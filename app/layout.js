// --- 1. app/layout.js (مکمل فکس شدہ) ---

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
  };
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* --- فکس 1: یہاں سے بگ والا <meta name="viewport"...> ٹیگ ہٹا دیا گیا ہے --- */}

        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1963262096178695"
          crossOrigin="anonymous"
          strategy="lazyOnload"
        />
      </head>

      <body className={`${inter.className} bg-gray-900`}>
        {/* یہ max-w-full ٹھیک ہے، تاکہ ایڈمن پیج responsive رہے */}
        <div className="max-w-full mx-auto bg-gray-800 min-h-screen overflow-x-hidden relative">
          {children}

          {/* --- فکس 2: یہاں سے بگ والی 'enforceZoom' اسکرپٹ ہٹا دی گئی ہے --- */}
          
          {/* --- فکس 3: یہاں سے بگ والا (اضافی) واٹس ایپ بٹن ہٹا دیا گیا ہے --- */}
        </div>
      </body>
    </html>
  );
}
