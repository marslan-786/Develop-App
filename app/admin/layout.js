import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

// --- یہ ہے حل 3: ایڈمن پینل کے لیے موبائل ویو پورٹ ---
export const metadata = {
  // یہ root layout کے 'width=1200' کو اوور رائٹ (overwrite) کر دے گا
  // اور ایڈمن پینل کو واپس موبائل فرینڈلی بنا دے گا
  viewport: 'width=device-width, initial-scale=1',
};
// --- حل ختم ---

export default function AdminLayout({ children }) {
  return (
    // یہ ایڈمن پینل کو واپس ہلکے (light) رنگ اور موبائل سائز میں لے آئے گا
    <div className={`${inter.className} bg-gray-100`}>
      <div className="max-w-md mx-auto bg-white min-h-screen shadow-lg">
        {children}
      </div>
    </div>
  );
}
