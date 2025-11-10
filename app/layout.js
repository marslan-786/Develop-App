import "./globals.css";
import { Inter } from "next/font/google";
import Script from 'next/script'; // <-- 1. Script کو امپورٹ کریں

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Ilyas Mobile Mall",
  description: "Your one-stop mobile shop.",
  icons: {
    icon: "https://hnt5qthrn2hkqfn9.public.blob.vercel-storage.com/logo.png",
    apple: "https://hnt5qthrn2hkqfn9.public.blob.vercel-storage.com/logo.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" dir="ltr">
      
      {/* --- یہ ہے حل --- */}
      <head>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1963262096178695" // <-- 2. آپ کا AdSense کوڈ
          crossOrigin="anonymous"
          strategy="lazyOnload" // <-- 3. تاکہ یہ پیج کی اسپیڈ پر اثر نہ ڈالے
        />
      </head>
      {/* --- حل ختم --- */}
      
      <body className={`${inter.className} bg-gray-100`}>
        <div className="max-w-md mx-auto bg-white min-h-screen shadow-lg">
          {children}
        </div>
      </body>
    </html>
  );
}
