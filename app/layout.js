import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Ilyas Mobile Mall",
  description: "Your one-stop mobile shop.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" dir="ltr">
      <body className={`${inter.className} bg-gray-100`}>
        {/* This container simulates the phone screen on a desktop.
          On a real mobile phone, it will be full-width by default.
          The 'max-w-md' (max-width: 28rem) ensures it looks like a mobile app.
        */}
        <div className="max-w-md mx-auto bg-white min-h-screen shadow-lg">
          {children}
        </div>
      </body>
    </html>
  );
}
