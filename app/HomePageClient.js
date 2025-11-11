"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

// --- Icons (ویسے ہی) ---
function IconWhatsApp() {
  return (
    <svg viewBox="0 0 448 512" fill="currentColor" className="w-12 h-12">
      <path d="M380.9 97.1C339 55.1 283.2 32..."/>
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

// --- Header (ویسے ہی) ---
function AppHeader({ title, logoUrl, whatsappNumber, onMenuClick, onSearchClick }) {
  const cacheBustedLogoSrc = `${logoUrl}?v=${new Date().getTime()}`;
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

// --- Hero Banner (ویسے ہی) ---
function HeroBanner({ bannerUrl }) {
  if (!bannerUrl) return null;
  const cacheUrl = `${bannerUrl}?v=${new Date().getTime()}`;
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

// --- Filters (ویسے ہی) ---
const filters = [
  { id: "low-range", label: "Low Range" },
  { id: "pta", label: "PTA Approved" },
  { id: "gaming", label: "Gaming" },
];
function FilterBubbles({ activeFilter, onFilterChange }) {
  return (
    <div className="sticky top-[73px] z-10 p-4 bg-gray-900/80 border-b border-gray-700">
      <div className="flex items-center justify-center gap-3">
        {filters.map((f) => (
          <button
            key={f.id}
            onClick={() => onFilterChange(f.id)}
            className={`px-5 py-2 rounded-full text-sm font-medium ${
              activeFilter === f.id
                ? "animated-gradient-button text-white"
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

// --- پروڈکٹ کارڈ کا نیا ڈیزائن ---
function ProductCard({ product, index, style, animationVariant }) {
  const img = `${product.imageUrl || "/placeholder-image.png"}?v=${new Date().getTime()}`;
  
  // تفصیل کو مختصر کرنے کے لیے (اگر موجود ہے)
  const shortDetail = product.detail 
    ? product.detail.substring(0, 50) + (product.detail.length > 50 ? "..." : "")
    : ""; // 50 حروف کی حد

  return (
    <motion.div
      className={`rounded-lg overflow-hidden shadow-lg flex flex-col ${style.bg}`}
      variants={animationVariant}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8, delay: (index % 2) * 0.1 }} // (index % 3) کو (index % 2) کر دیا
    >
      {/* 1. تصویر */}
      <div className="w-full h-48 md:h-56 relative">
        <Image src={img} alt={product.name} fill className="object-cover" unoptimized />
      </div>

      {/* 2. مواد (نیا ڈیزائن) */}
      <div className={`p-4 flex flex-col flex-grow ${style.text}`}>
        {/* نام */}
        <h3 className="text-xl font-semibold mb-2 h-14 overflow-hidden">
          {product.name}
        </h3>
        
        {/* تفصیل (اگر موجود ہے) */}
        {shortDetail && (
          <p className="text-sm opacity-80 mb-3 h-10 overflow-hidden">
            {shortDetail}
          </p>
        )}

        {/* قیمت */}
        <p className="font-bold text-lg mb-4">PKR {product.price}</p>

        {/* بٹن (نیچے رکھنے کے لیے 'mt-auto') */}
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

// --- Sidebar (ویسے ہی) ---
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

// --- SearchBar (ویسے ہی) ---
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

// --- Floating WhatsApp (ویسے ہی, z-50 کے ساتھ) ---
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
      className="fixed bottom-6 right-6 z-50 p-6 bg-green-500 text-white rounded-full shadow-lg hover:scale-110 transition-transform whatsapp-float"
    >
      <IconWhatsApp />
    </a>
  );
}

// --- Main Client Component ---
export default function HomePageClient({ initialProducts, settings, logoUrl, bannerUrl }) {
  // --- ✅ فکس: یہاں سے اضافی '=' ہٹا دیا گیا ہے ---
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [quickFilter, setQuickFilter] = useState("all");

  const brands = useMemo(() => {
    const all = initialProducts.map((p) => p.brand).filter(Boolean);
    return [...new Set(all)];
  }, [initialProducts]);

  const filtered = useMemo(() => {
    return initialProducts.filter((p) => {
      const matchBrand = selectedBrand ? p.brand === selectedBrand : true;
      const matchSearch =
        !searchTerm ||
        p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.brand?.toLowerCase().includes(searchTerm.toLowerCase());
      return matchBrand && matchSearch;
    });
  }, [initialProducts, selectedBrand, searchTerm]);

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
      <FilterBubbles activeFilter={quickFilter} onFilterChange={setQuickFilter} />
      <SearchBar
        isSearchOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      {/* --- نیا Responsive گرڈ --- */}
      <div className="p-4 md:p-8"> {/* موبائل پر کم پیڈنگ، ڈیسک ٹاپ پر زیادہ */}
        {filtered.length ? (
          // موبائل پر 2، میڈیم پر 3، لارج پر 4 کالم
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
      {/* --- فکس ختم --- */}
      
      <FloatingWhatsAppButton whatsappNumber={settings.whatsappNumber} />
    </main>
  );
}
