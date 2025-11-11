"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

// --- Icons (ویسے ہی) ---
function IconWhatsApp() { /* ... (کوڈ ویسا ہی) ... */ }
function IconMenu() { /* ... (کوڈ ویسا ہی) ... */ }
function IconSearch() { /* ... (کوڈ ویسا ہی) ... */ }
function IconClose() { /* ... (کوڈ ویسا ہی) ... */ }

// --- ✅ تبدیلی 1: نیا 'Time Ago' فنکشن ---
/**
 * تاریخ کو "کتنی دیر پہلے" میں تبدیل کرتا ہے
 * @param {string} dateString 'YYYY-MM-DD HH:MM:SS' فارمیٹ میں
 */
function formatTimeAgo(dateString) {
  if (!dateString) return null;
  
  // 'YYYY-MM-DD HH:MM:SS' کو 'YYYY-MM-DDTHH:MM:SS' میں تبدیل کریں
  // تاکہ تمام براؤزر اسے سمجھ سکیں
  const isoDateString = dateString.replace(' ', 'T');
  const date = new Date(isoDateString);
  
  // اگر تاریخ درست نہیں ہے
  if (isNaN(date.getTime())) {
    console.error("Invalid date string provided:", dateString);
    return null;
  }

  const now = new Date();
  const seconds = Math.round((now.getTime() - date.getTime()) / 1000);
  
  if (seconds < 0) return "just now"; // اگر وقت میں تھوڑا فرق ہو
  if (seconds < 60) return `${seconds} sec ago`;
  
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;
  
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;
  
  const days = Math.round(hours / 24);
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;

  // اگر 7 دن سے پرانا ہے تو تاریخ دکھائیں
  return date.toLocaleDateString('en-PK', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}
// --- تبدیلی 1 ختم ---


// --- Header (ویسا ہی) ---
function AppHeader({ title, logoUrl, whatsappNumber, onMenuClick, onSearchClick }) {
  // ... (کوڈ ویسا ہی) ...
}

// --- Hero Banner (ویسا ہی) ---
function HeroBanner({ bannerUrl }) {
  // ... (کوڈ ویسا ہی) ...
}

// --- Filters (ویسے ہی) ---
const filters = [
  { id: "low-range", label: "Low Range" },
  { id: "pta", label: "PTA Approved" },
  { id: "gaming", label: "Gaming" },
];
function FilterBubbles({ activeFilter, onFilterChange }) {
  // ... (کوڈ ویسا ہی) ...
}


// --- ✅ تبدیلی 2: پروڈکٹ کارڈ اپ ڈیٹ ---
function ProductCard({ product, index, style, animationVariant }) {
  const img = product.imageUrl || "/placeholder-image.png";
  
  const shortDetail = product.detail 
    ? product.detail.substring(0, 50) + (product.detail.length > 50 ? "..." : "")
    : "";
    
  // 'Time Ago' کو کال کریں
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
        
        {/* قیمت کا مارجن کم کیا */}
        <p className="font-bold text-lg mb-1">PKR {product.price}</p>
        
        {/* 'Time Ago' ٹیکسٹ شامل کیا */}
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
// --- تبدیلی 2 ختم ---


// --- Sidebar (ویسے ہی) ---
function Sidebar({ isOpen, onClose, brands, selectedBrand, onSelectBrand }) {
  // ... (کوڈ ویسا ہی) ...
}

// --- SearchBar (ویسے ہی) ---
function SearchBar({ isSearchOpen, onClose, searchTerm, onSearchChange }) {
  // ... (کوڈ ویسا ہی) ...
}

// --- Floating WhatsApp (ویسے ہی) ---
function FloatingWhatsAppButton({ whatsappNumber }) {
  // ... (کوڈ ویسا ہی) ...
}

// --- Main Client Component ---
export default function HomePageClient({ initialProducts, settings, logoUrl, bannerUrl }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [quickFilter, setQuickFilter] = useState("all");

  const brands = useMemo(() => {
    const all = initialProducts.map((p) => p.brand).filter(Boolean);
    return [...new Set(all)];
  }, [initialProducts]);

  const handleFilterChange = (id) => {
    setQuickFilter((prev) => (prev === id ? "all" : id));
  };

  // --- ✅ تبدیلی 3: پروڈکٹس کو سارٹ (Sort) کرنا ---
  const filtered = useMemo(() => {
    return initialProducts
      // 1. پہلے تاریخ کے حساب سے سارٹ کریں (نیا سب سے پہلے)
      .sort((a, b) => {
        // اگر 'uploadTime' موجود نہیں ہے تو اسے آخر میں بھیج دیں
        const timeA = a.uploadTime || '';
        const timeB = b.uploadTime || '';
        // localeCompare سٹرنگ کو صحیح طریقے سے compare کرے گا
        // b کو a سے compare کرنے پر descending order (نیا پہلے) آئے گا
        return timeB.localeCompare(timeA);
      })
      // 2. پھر فلٹر کریں
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
  // --- تبدیلی 3 ختم ---

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
              <ProductCard
                key={p.id || p.name}
                product={p}
                index={i}
                style={styles[i % styles.length]}
                animationVariant={anim[i % anim.length]}
              />
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-400 mt-20">No products found.</div>
        )}
      </div>
      
      <FloatingWhatsAppButton whatsappNumber={settings.whatsappNumber} />
    </main>
  );
}
