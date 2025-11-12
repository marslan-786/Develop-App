"use client";

// --- ✅ 'useEffect' اور 'Fragment' امپورٹ کیے گئے ---
import { useState, useMemo, useEffect, Fragment } from "react"; 
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

// --- (سارے آئیکنز ... IconWhatsApp, IconMenu, وغیرہ ... ویسے ہی رہیں گے) ---
function IconWhatsApp() { /* ... (کوڈ ویسا ہی) ... */ }
function IconMenu() { /* ... (کوڈ ویسا ہی) ... */ }
function IconSearch() { /* ... (کوڈ ویسا ہی) ... */ }
function IconClose() { /* ... (کوڈ ویسا ہی) ... */ }

// --- ('Time Ago' فنکشن ... ویسا ہی رہے گا) ---
function formatTimeAgo(dateString) { /* ... (کوڈ ویسا ہی) ... */ }

// --- (Header, HeroBanner, FilterBubbles, ProductCard, Sidebar, SearchBar ... ویسے ہی رہیں گے) ---
function AppHeader({ title, logoUrl, whatsappNumber, onMenuClick, onSearchClick }) { /* ... (کوڈ ویسا ہی) ... */ }
function HeroBanner({ bannerUrl }) { /* ... (کوڈ ویسا ہی) ... */ }
function FilterBubbles({ activeFilter, onFilterChange }) { /* ... (کوڈ ویسا ہی) ... */ }
function ProductCard({ product, index, style, animationVariant }) { /* ... (کوڈ ویسا ہی) ... */ }
function Sidebar({ isOpen, onClose, brands, selectedBrand, onSelectBrand }) { /* ... (کوڈ ویسا ہی) ... */ }
function SearchBar({ isSearchOpen, onClose, searchTerm, onSearchChange }) { /* ... (کوڈ ویسا ہی) ... */ }
function FloatingWhatsAppButton({ whatsappNumber }) { /* ... (کوڈ ویسا ہی) ... */ }

// --- (AdComponent, PopupAd ... ویسے ہی رہیں گے) ---
function AdComponent({ adClientId, adSlotId }) { /* ... (کوڈ ویسا ہی) ... */ }
function PopupAd({ adClientId, adSlotId, onClose }) { /* ... (کوڈ ویسا ہی) ... */ }


// --- Main Client Component (اپ ڈیٹ شدہ) ---
export default function HomePageClient({ 
  initialProducts, 
  settings, 
  logoUrl, 
  bannerUrl, 
  adSettings
}) {
  
  // --- (تمام پرانی اسٹیٹس ... isMenuOpen, isSearchOpen, وغیرہ ... ویسے ہی رہیں گی) ---
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [quickFilter, setQuickFilter] = useState("all");
  const [showPopup, setShowPopup] = useState(false);

  // --- ✅ 1. نیا وزٹر کاؤنٹ لاجک ---
  useEffect(() => {
    // 6 گھنٹے کا وقت (ملی سیکنڈز میں)
    const SIX_HOURS_IN_MS = 6 * 60 * 60 * 1000;
    const storageKey = 'visitor_counted_timestamp';
    
    // براؤزر کی لوکل اسٹوریج سے پرانا ٹائم اسٹیمپ حاصل کریں
    const lastVisit = localStorage.getItem(storageKey);
    const now = Date.now();

    // چیک کریں: اگر ٹائم اسٹیمپ موجود نہیں ہے، یا 6 گھنٹے سے پرانا ہے
    if (!lastVisit || (now - parseInt(lastVisit) > SIX_HOURS_IN_MS)) {
      
      // 1. نئے وزٹ کو گننے کے لیے API کو کال کریں
      // (ہمیں جواب کا انتظار نہیں کرنا، بس سگنل بھیجنا ہے)
      fetch('/api/track-visit', { method: 'POST' });
      
      // 2. براؤزر میں نیا ٹائم اسٹیمپ سیو کریں
      localStorage.setItem(storageKey, now.toString());
      console.log('New visit counted.');
      
    } else {
      // 6 گھنٹے ابھی پورے نہیں ہوئے، گنتی نہ کرو
      console.log('Returning visitor. Not counting.');
    }
  }, []); // <-- یہ صرف ایک بار (پیج لوڈ پر) چلے گا
  
  // --- ✅ 2. پوپ اپ ایڈ کا لاجک (یہ پہلے سے موجود تھا) ---
  useEffect(() => {
    if (adSettings?.masterAdsEnabled && adSettings?.showHomepagePopupAd) {
      const timer = setTimeout(() => {
        setShowPopup(true);
      }, 5000); 
      return () => clearTimeout(timer);
    }
  }, [adSettings]);

  // --- (باقی تمام useMemo اور فنکشنز ... ویسے ہی رہیں گے) ---
  const brands = useMemo(() => { /* ... (کوڈ ویسا ہی) ... */ }, [initialProducts]);
  const handleFilterChange = (id) => { /* ... (کوڈ ویسا ہی) ... */ };
  const filtered = useMemo(() => { /* ... (کوڈ ویسا ہی) ... */ }, [initialProducts, selectedBrand, searchTerm, quickFilter]);
  const styles = [ /* ... (کوڈ ویسا ہی) ... */ ];
  const anim = [ /* ... (کوڈ ویسا ہی) ... */ ];

  // --- (ایڈز دکھانے کا لاجک ... ویسا ہی رہے گا) ---
  const showAds = adSettings?.masterAdsEnabled;
  const showBannerAd = showAds && adSettings?.showHomepageBannerAd;
  const showInFeedAds = showAds && adSettings?.showHomepageInFeedAds;
  const clientId = adSettings?.adsenseClientId;

  return (
    <main>
      {/* --- (سارا JSX ... AppHeader, HeroBanner, AdComponent, Sidebar ... ویسا ہی رہے گا) --- */}
      
      <AppHeader
        title={settings.websiteTitle}
        logoUrl={logoUrl}
        whatsappNumber={settings.whatsappNumber}
        onMenuClick={() => setIsMenuOpen(true)}
        onSearchClick={() => setIsSearchOpen((v) => !v)}
      />
      
      <HeroBanner bannerUrl={bannerUrl} />
      
      {showBannerAd && (
        <div className="p-4">
          <AdComponent 
            adClientId={clientId}
            adSlotId={adSettings.homepageBannerSlotId} 
          />
        </div>
      )}

      <Sidebar
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        brands={brands}
        selectedBrand={selectedBrand}
        onSelectBrand={(b) => {
          setSelectedBrand(b);
          setIsMenuOpen(false);
        }}
      />
      <FilterBubbles activeFilter={quickFilter} onFilterChange={handleFilterChange} />
      <SearchBar
        isSearchOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      <div className="p-4 md:p-8">
        {filtered.length ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            
            {filtered.map((p, i) => (
              <Fragment key={p.id || p.name}>
                <ProductCard
                  product={p}
                  index={i}
                  style={styles[i % styles.length]}
                  animationVariant={anim[i % anim.length]}
                />
                
                {showInFeedAds && (i % 2 === 1) && (
                  <div className="col-span-2 md:col-span-3 lg:col-span-4 p-2" key={`ad-${i}`}>
                    <AdComponent 
                      adClientId={clientId}
                      adSlotId={adSettings.homepageInFeedSlotId} 
                    />
                  </div>
                )}
              </Fragment>
            ))}

          </div>
        ) : (
          <div className="text-center text-gray-400 mt-20">No products found.</div>
        )}
      </div>
      
      {showPopup && (
        <PopupAd 
          adClientId={clientId}
          adSlotId={adSettings.homepagePopupSlotId}
          onClose={() => setShowPopup(false)} 
        />
      )}
      
      <FloatingWhatsAppButton whatsappNumber={settings.whatsappNumber} />
    </main>
  );
}
