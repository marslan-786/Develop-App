import "./globals.css";
import { Inter } from "next/font/google";
import Script from 'next/script'; // AdSense اسکرپٹ کے لیے

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
      
      <head>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1963262096178695" 
          crossOrigin="anonymous"
          strategy="lazyOnload" 
        />
      </head>
      
      {/* --- یہ ہے حل: ڈارک موڈ ---
          'bg-gray-100' کو 'bg-gray-900' سے بدل دیا ہے (باہر کا بیک گراؤنڈ)
      --- */}
      <body className={`${inter.className} bg-gray-900`}>
        {/* 'bg-white' کو 'bg-gray-800' سے بدل دیا ہے (اندر کا بیک گراؤنڈ) */}
        <div className="max-w-md mx-auto bg-gray-800 min-h-screen shadow-lg">
          {children}
        </div>
      </body>
    </html>
  );
}
