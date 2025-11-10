// --- app/layout.js ---
// (یہ فائل اب ہمیشہ desktop view رکھے گی اور responsive نہیں رہے گی)

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
    <html lang="en" dir="ltr">
      <head>
        {/* ✅ یہ لائن بہت اہم ہے: یہ viewport fix کر دیتی ہے */}
        <meta
          name="viewport"
          content="width=1200, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />

        {/* ✅ Google Ads Script */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1963262096178695"
          crossOrigin="anonymous"
          strategy="lazyOnload"
        />
      </head>

      <body className={`${inter.className} bg-gray-900`}>
        {/* ✅ پورا صفحہ desktop width پر fix */}
        <div className="max-w-full mx-auto bg-gray-800 min-h-screen overflow-x-hidden">
          {children}
        </div>
      </body>
    </html>
  );
}
