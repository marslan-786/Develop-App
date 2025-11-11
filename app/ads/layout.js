// app/ads/layout.js
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

// ایڈ پینل کے لیے موبائل ویو پورٹ
export const metadata = {
  title: 'Ads Management',
  viewport: 'width=device-width, initial-scale=1',
};

export default function AdsLayout({ children }) {
  return (
    // ہلکا (light) رنگ اور موبائل سائز
    <div className={`${inter.className} bg-gray-100`}>
      <div className="max-w-md mx-auto bg-white min-h-screen shadow-lg">
        {children}
      </div>
    </div>
  );
}
