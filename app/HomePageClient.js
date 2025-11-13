"use client";

// 'useRef' کو یہاں شامل کیا گیا ہے
import { useState, useMemo, useEffect, Fragment, useRef } from "react"; 
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useSearchParams } from 'next/navigation';

// --- Icons (ویسے ہی) ---
function IconWhatsApp() {
  return (
    <svg viewBox="0 0 448 512" fill="currentColor" className="w-8 h-8">
      <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zM223.9 439.6c-33.8 0-66.7-9.3-95.3-26.3l-6.7-4-70.8 18.6L77.6 363l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5c0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
    </svg>
  );
}
function IconMenu() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
    </svg>
  );
}
function IconSearch() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
    </svg>
  );
}
function IconClose() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
    </svg>
  );
}

function formatTimeAgo(dateString) {
  if (!dateString) return null;
  const isoDateString = dateString.replace(' ', 'T');
  const date = new Date(isoDateString);
  if (isNaN(date.getTime())) return null;
  const now = new Date();
  const seconds = Math.round((now.getTime() - date.getTime()) / 1000);
  if (seconds < 0) return "just now";
  if (seconds < 60) return `${seconds} sec ago`;
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;
  const days = Math.round(hours / 24);
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  return date.toLocaleDateString('en-PK', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}

function AppHeader({ title, logoUrl, whatsappNumber, onMenuClick, onSearchClick }) {
  const cacheBustedLogoSrc = logoUrl;
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    "Hello, I am interested in your products."
  )}`;
  return (
    <header className="sticky top-0 z-20 flex items-center justify-between p-4 bg-gray-900 border-b border-gray-700">
      <div className="flex items-center gap-4">
        <button onClick={onMenuClick} className="p-2 rounded-full text-gray-300 hover:bg-gray-700">
          <IconMenu />
        </button>
        <span className="text-xl font-bold text-white animated-gradient-text">{title}</span>
      </div>
      <div className="flex items-center gap-4">
        <button onClick={onSearchClick} className="p-2 rounded-full text-gray-300 hover:bg-gray-700">
          <IconSearch />
        </button>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-600 flex-shrink-0 hover:scale-110 transition-transform"
        >
          <Image src={cacheBustedLogoSrc} alt="Logo" width={40} height={40} unoptimized priority />
        </a>
      </div>
    </header>
  );
}

// --- وہ جامد (static) ایڈز ٹیرا کوڈ جو یہاں تھا اسے ہٹا دیا گیا ہے ---
            
function HeroBanner({ bannerUrl }) {
  if (!bannerUrl) return null;
  const cacheUrl = bannerUrl;
  return (
    <div className="w-full">
      <Image
        src={cacheUrl}
        width={1200}
        height={400}
        alt="Banner"
        className="w-full object-cover"
        unoptimized
        priority
      />
    </div>
  );
}

function FilterBubbles({ activeFilter, onFilterChange }) {
  const filters = [
    { id: "low-range", label: "Low Range" },
    { id: "pta", label: "PTA Approved" },
    { id: "gaming", label: "Gaming" },
  ];
  return (
    <div className="sticky top-[73px] z-10 p-4 bg-gray-900/80 border-b border-gray-700">
      <div className="flex items-center justify-center gap-3">
        {filters.map((f) => (
          <button
            key={f.id}
            onClick={() => onFilterChange(f.id)}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              activeFilter === f.id
                ? "bg-blue-600 text-white shadow-lg"
                : "bg-gray-700 text-gray-200 hover:bg-gray-600"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function ProductCard({ product, index, style, animationVariant }) {
  const img = product.imageUrl || "/placeholder-image.png";
  const shortDetail = product.detail 
    ? product.detail.substring(0, 50) + (product.detail.length > 50 ? "..." : "")
    : "";
  const timeAgo = formatTimeAgo(product.uploadTime);
  return (
    <motion.div
      className={`rounded-lg overflow-hidden shadow-lg flex flex-col ${style.bg}`}
      variants={animationVariant}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8, delay: (index % 2) * 0.1 }}
    >
      <div className="w-full h-48 md:h-56 relative">
        <Image src={img} alt={product.name} fill className="object-cover" unoptimized />
      </div>
      <div className={`p-4 flex flex-col flex-grow ${style.text}`}>
        <h3 className="text-xl font-semibold mb-2 h-14 overflow-hidden">
          {product.name}
        </h3>
        {shortDetail && (
          <p className="text-sm opacity-80 mb-3 h-10 overflow-hidden">
            {shortDetail}
          </p>
        )}
        <p className="font-bold text-lg mb-1">PKR {product.price}</p>
        {timeAgo && (
          <p className="text-xs opacity-70 mb-4">{timeAgo}</p>
        )}
        <div className="mt-auto">
          <Link
            href={`/product/${product.id}`}
            className={`block w-full text-center px-3 py-2 rounded-md text-sm font-medium ${style.button}`}
          >
            View Product
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

function Sidebar({ isOpen, onClose, brands, selectedBrand, onSelectBrand }) {
  return (
    <>
      {isOpen && <div className="fixed inset-0 z-30 bg-black/50" onClick={onClose}></div>}
      <div
        className={`fixed top-0 left-0 z-40 w-64 h-full bg-gray-800 transition-transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-between p-4 border-b border-gray-700">
          <h2 className="font-bold text-white">Filter by Brand</h2>
          <button onClick={onClose} className="p-2 text-gray-300 hover:bg-gray-700 rounded-full">
            <IconClose />
          </button>
        </div>
        <nav className="p-4">
          <button
            onClick={() => onSelectBrand(null)}
            className={`w-full text-left p-2 rounded-lg mb-1 ${
              !selectedBrand ? "bg-blue-600 text-white" : "text-gray-300 hover:bg-gray-700"
            }`}
          >
            All Brands
          </button>
          {brands.map((brand) => (
            <button
              key={brand}
              onClick={() => onSelectBrand(brand)}
              className={`w-full text-left p-2 rounded-lg mb-1 ${
                selectedBrand === brand ? "bg-blue-600 text-white" : "text-gray-300 hover:bg-gray-700"
              }`}
            >
              {brand}
            </button>
          ))}
        </nav>
      </div>
    </>
  );
}

function SearchBar({ isSearchOpen, onClose, searchTerm, onSearchChange }) {
  if (!isSearchOpen) return null;
  return (
    <div className="sticky top-[141px] z-10 p-4 bg-gray-800 border-b border-gray-700">
      <div className="relative">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full p-2 pr-10 bg-gray-700 text-white border border-gray-600 rounded-lg"
          autoFocus
        />
        <button
          onClick={onClose}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200"
        >
          <IconClose />
        </button>
      </div>
    </div>
  );
}

function FloatingWhatsAppButton({ whatsappNumber }) {
  if (!whatsappNumber) return null;
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    "Hello, I am interested in your products."
  )}`;
  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 p-4 bg-green-500 text-white rounded-full shadow-lg hover:scale-110 transition-transform whatsapp-float"
    >
      <IconWhatsApp />
    </a>
  );
}

// --- ✅✅✅ نیا ایڈز ٹیرا کمپوننٹ ---
function AdsterraAdComponent({ adKey }) {
  const adContainerRef = useRef(null);

  useEffect(() => {
    // اگر 'adKey' (یعنی Slot ID) موجود نہیں ہے، تو کچھ نہ کریں
    if (!adKey || !adContainerRef.current) {
      return;
    }

    // پچھلا اشتہار صاف کریں (اگر کوئی ہو)
    adContainerRef.current.innerHTML = '';

    // 1. کنفگ اسکرپٹ بنائیں
    const configScript = document.createElement('script');
    configScript.type = 'text/javascript';
    // نوٹ: ایڈز ٹیرا کے کچھ ایڈ فارمیٹس (جیسے پاپ انڈر) کو 'format', 'height', 'width' کی ضرورت نہیں ہوتی،
    // لیکن بینر کے لیے یہ بہتر ہے۔ ایڈز ٹیرا خود ہی اسے ایڈجسٹ کر لیتا ہے۔
    configScript.innerHTML = `
      atOptions = {
        'key' : '${adKey}',
        'format' : 'iframe',
        'height' : 60,
        'width' : 468,
        'params' : {}
      };
    `;

    // 2. لوڈر اسکرپٹ بنائیں
    const loaderScript = document.createElement('script');
    loaderScript.type = 'text/javascript';
    loaderScript.src = `//www.highperformanceformat.com/${adKey}/invoke.js`;
    loaderScript.async = true;

    // 3. دونوں اسکرپٹس کو کنٹینر میں ڈالیں
    adContainerRef.current.appendChild(configScript);
    adContainerRef.current.appendChild(loaderScript);

    // 4. کلین اپ فنکشن: جب کمپوننٹ ان ماؤنٹ ہو تو اسکرپٹس ہٹا دیں
    return () => {
      if (adContainerRef.current) {
        adContainerRef.current.innerHTML = '';
      }
    };
  }, [adKey]); // یہ useEffect تب چلے گا جب adKey تبدیل ہوگا

  // یہ وہ 'div' ہے جس کے اندر ایڈز ٹیرا کا اشتہار لوڈ ہوگا
  return (
    <div 
      ref={adContainerRef} 
      className="w-full flex justify-center items-center overflow-hidden my-4"
    >
      {/* Adsterra Ad will load here */}
    </div>
  );
}


// --- ✅✅✅ پاپ اپ کمپوننٹ کو بھی اپ ڈیٹ کر دیا گیا ہے ---
function PopupAd({ adKey, onClose }) {
  return (
    <div className="fixed top-4 right-4 z-[999] w-72 bg-gray-800 shadow-2xl border border-gray-700 rounded-lg">
      <button 
        onClick={onClose} 
        className="absolute -top-2 -right-2 p-1 bg-gray-900 text-white rounded-full shadow-lg"
      >
        <IconClose />
      </button>
      <div className="p-2">
        {/* یہ اب نئے کمپوننٹ کو کال کر رہا ہے */}
        <AdsterraAdComponent adKey={adKey} />
      </div>
    </div>
  );
}


// --- Main Client Component (اپ ڈیٹ شدہ) ---
export default function HomePageClient({ 
  initialProducts, 
  settings, 
  logoUrl, 
  bannerUrl, 
  adSettings
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [quickFilter, setQuickFilter] = useState("all");
  
  const [showPopup, setShowPopup] = useState(false);
  
  const searchParams = useSearchParams();

  // --- ٹریکنگ کا فکسڈ لاجک (Session Lock) ---
  useEffect(() => {
    const adminPassword = searchParams.get('password');
    if (adminPassword) return;
    const sessionKey = 'session_visit_tracked';
    if (sessionStorage.getItem(sessionKey)) {
      console.log("Visit already tracked for this session.");
      return;
    }
    fetch('/api/track-visit', { method: 'POST' });
    sessionStorage.setItem(sessionKey, 'true');
  }, [searchParams]);
  // --- --- ---


  useEffect(() => {
    if (adSettings?.masterAdsEnabled && adSettings?.showHomepagePopupAd) {
      const timer = setTimeout(() => {
        setShowPopup(true);
      }, 5000); 
      return () => clearTimeout(timer);
    }
  }, [adSettings]);


  const brands = useMemo(() => {
    const all = initialProducts.map((p) => p.brand).filter(Boolean);
    return [...new Set(all)];
  }, [initialProducts]);

  const handleFilterChange = (id) => {
    setQuickFilter((prev) => (prev === id ? "all" : id));
  };

  const filtered = useMemo(() => {
    return initialProducts
      .sort((a, b) => {
        const timeA = a.uploadTime || '';
        const timeB = b.uploadTime || '';
        return timeB.localeCompare(timeA);
      })
      .filter((p) => {
        const matchBrand = selectedBrand ? p.brand === selectedBrand : true;
        const matchSearch =
          !searchTerm ||
          p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.brand?.toLowerCase().includes(searchTerm.toLowerCase());
        
        let matchesQuickFilter = true;
        if (quickFilter !== 'all') {
          if (quickFilter === 'low-range') {
            const price = parseFloat(String(p.price).replace(/,/g, ''));
            matchesQuickFilter = price < 20000;
          } else if (quickFilter === 'pta') {
            matchesQuickFilter = 
              p.name?.toLowerCase().includes('pta') ||
              p.detail?.toLowerCase().includes('pta') ||
              p.condition?.toLowerCase().includes('pta');
          } else if (quickFilter === 'gaming') {
            matchesQuickFilter = 
              p.name?.toLowerCase().includes('gaming') ||
              p.detail?.toLowerCase().includes('gaming');
          }
        }
        return matchBrand && matchSearch && matchesQuickFilter;
      });
  }, [initialProducts, selectedBrand, searchTerm, quickFilter]);

  const styles = [
    { bg: "bg-blue-600", text: "text-white", button: "bg-white/90 text-blue-600 hover:bg-white" },
    { bg: "bg-pink-600", text: "text-white", button: "bg-white/90 text-pink-600 hover:bg-white" },
    { bg: "bg-lime-500", text: "text-gray-900", button: "bg-gray-900/90 text-lime-500 hover:bg-black" },
  ];

  const anim = [
    { hidden: { opacity: 0, x: -100 }, visible: { opacity: 1, x: 0 } },
    { hidden: { opacity: 0, y: 100 }, visible: { opacity: 1, y: 0 } },
    { hidden: { opacity: 0, x: 100 }, visible: { opacity: 1, x: 0 } },
  ];

  const showAds = adSettings?.masterAdsEnabled;
  const showBannerAd = showAds && adSettings?.showHomepageBannerAd;
  const showInFeedAds = showAds && adSettings?.showHomepageInFeedAds;
  
  // 'clientId' کی اب ضرورت نہیں، لیکن اسے چھوڑ دیتے ہیں تاکہ کوئی ایرر نہ آئے۔
  // const clientId = adSettings?.adsenseClientId; 

  return (
    <main>
      <AppHeader
        title={settings.websiteTitle}
        logoUrl={logoUrl}
        whatsappNumber={settings.whatsappNumber}
        onMenuClick={() => setIsMenuOpen(true)}
        onSearchClick={() => setIsSearchOpen((v) => !v)}
      />
      
      <HeroBanner bannerUrl={bannerUrl} />
      
      {showBannerAd && (
        // --- ✅✅✅ کال اپ ڈیٹ ہو گئی ---
        <AdsterraAdComponent 
          adKey={adSettings.homepageBannerSlotId} 
        />
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
                  <div className="col-span-2 md:col-span-3 lg:col-span-4" key={`ad-${i}`}>
                    {/* --- ✅✅✅ کال اپ ڈیٹ ہو گئی --- */}
                    <AdsterraAdComponent 
                      adKey={adSettings.homepageInFeedSlotId} 
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
        // --- ✅✅✅ کال اپ ڈیٹ ہو گئی ---
        <PopupAd 
          adKey={adSettings.homepagePopupSlotId}
          onClose={() => setShowPopup(false)} 
        />
      )}
      
      <FloatingWhatsAppButton whatsappNumber={settings.whatsappNumber} />
    </main>
  );
}

