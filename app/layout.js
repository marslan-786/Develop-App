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
      
      {/* --- یہ ہے حل: ڈیسک ٹاپ لے آؤٹ --- */}
      {/* 1. باہر کا بیک گراؤنڈ گہرا گرے ہے */}
      <body className={`${inter.className} bg-gray-900`}>
        {/* 2. 'max-w-md' (موبائل) کو 'max-w-6xl' (ڈیسک ٹاپ) سے بدل دیا ہے */}
        <div className="max-w-6xl mx-auto bg-gray-800 min-h-screen shadow-lg">
          {children}
        </div>
      </body>
      {/* --- حل ختم --- */}
    </html>
  );
}
