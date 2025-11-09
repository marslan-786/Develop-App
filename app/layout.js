import "./globals.css";
import { Inter } from "next/font/google";

// آپ یہاں کوئی بھی اردو فونٹ (جیسے Noto Nastaliq Urdu) استعمال کر سکتے ہیں
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Ilyas Mobile Mall",
  description: "Mobile Shop",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ur" dir="rtl">
      <body className={inter.className}>
        {/* یہ وہ جگہ ہے جہاں آپ کے تمام پیج نظر آئیں گے */}
        <div className="max-w-md mx-auto bg-white min-h-screen shadow-lg">
          {children}
        </div>
      </body>
    </html>
  );
}
