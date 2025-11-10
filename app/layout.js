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
        {/* Force Desktop Zoom-Out */}
        <meta
          name="viewport"
          content="width=1200, initial-scale=0.75, maximum-scale=0.75, user-scalable=no"
        />

        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1963262096178695"
          crossOrigin="anonymous"
          strategy="lazyOnload"
        />
      </head>

      <body className={`${inter.className} bg-gray-900`}>
        <div className="max-w-full mx-auto bg-gray-800 min-h-screen overflow-x-hidden relative">
          {children}

          {/* --- Force zoom-out on reload --- */}
          <script
            dangerouslySetInnerHTML={{
              __html: `
                function enforceZoom() {
                  document.documentElement.style.zoom = '0.8';
                  document.body.style.zoom = '0.8';
                  document.body.style.width = '1200px';
                }
                window.addEventListener('load', enforceZoom);
                window.addEventListener('pageshow', enforceZoom);
              `,
            }}
          />

          {/* ✅ WhatsApp floating button (bottom-right) */}
          <a
            href="https://wa.me/923001234567"
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-lg flex items-center justify-center z-50 transition-all duration-300 whatsapp-float"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 24 24"
              className="w-6 h-6"
            >
              <path d="M12.04 2.003c-5.523 0-10.002 4.48-10.002 10.004 0 1.763.462 3.49 1.341 5.02l-1.418 5.172 5.308-1.395a9.96 9.96 0 004.77 1.206c5.524 0 10.004-4.48 10.004-10.003 0-5.523-4.48-10.004-10.003-10.004zm5.705 14.724c-.24.675-1.403 1.29-1.93 1.347-.495.053-1.11.075-1.784-.11-.41-.108-.94-.304-1.619-.591-2.854-1.183-4.71-3.94-4.857-4.126-.141-.184-1.16-1.54-1.16-2.938 0-1.398.737-2.087 1.002-2.376.264-.29.577-.363.77-.363.192 0 .385.002.553.01.177.008.413-.066.646.494.24.578.815 1.998.888 2.14.07.142.118.308.021.492-.097.184-.147.308-.29.474-.141.165-.298.37-.426.497-.142.14-.289.294-.124.58.165.29.734 1.21 1.576 1.96 1.086.97 2.006 1.27 2.296 1.412.29.142.458.118.63-.071.165-.183.727-.847.923-1.137.193-.29.389-.241.65-.142.264.099 1.666.786 1.954.929.289.142.48.213.552.33.072.118.072.684-.168 1.36z" />
            </svg>
          </a>
        </div>
      </body>
    </html>
  );
}
