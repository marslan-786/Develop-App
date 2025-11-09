import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

// --- یہ ہے حل! ---
// ہم 'metadata' آبجیکٹ کو اپ ڈیٹ کر رہے ہیں
export const metadata = {
  title: "Ilyas Mobile Mall",
  description: "Your one-stop mobile shop.",
  icons: {
    icon: "https://hnt5qthrn2hkqfn9.public.blob.vercel-storage.com/logo.png", // براؤزر ٹیب کے لیے
    apple: "https://hnt5qthrn2hkqfn9.public.blob.vercel-storage.com/logo.png", // ایپل ڈیوائسز (iPhone/iPad) کے لیے
  },
};
// --- حل ختم ---

export default function RootLayout({ children }) {
  return (
    <html lang="en" dir="ltr">
      <body className={`${inter.className} bg-gray-100`}>
        <div className="max-w-md mx-auto bg-white min-h-screen shadow-lg">
          {children}
        </div>
      </body>
    </html>
  );
}
