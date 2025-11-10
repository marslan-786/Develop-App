"use client"; 

import { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion'; // اینیمیشن کے لیے

// --- Icon Components (صرف ایک بار ڈیفائن کیے گئے) ---
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
// --- (آئیکنز ختم) ---


// --- 1. نیا ہیڈر (اسکرین شاٹ کے مطابق) ---
function AppHeader({ title, logoUrl, whatsappNumber, onMenuClick, onSearchClick }) {
  const cacheBustedLogoSrc = `${logoUrl}?v=${new Date().getTime()}`;
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Hello, I am interested in your products.')}`;

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between p-4 bg-gray-900 shadow-md border-b border-gray-700">
      {/* لیفٹ سائیڈ */}
      <div className="flex items-center gap-4">
        <button onClick={onMenuClick} className="p-2 rounded-full text-gray-300 hover:bg-gray-700">
          <IconMenu />
        </button>
        {/* ویب سائٹ کا ٹائٹل */}
        <span className="text-xl font-bold text-white whitespace-nowrap">{title}</span>
      </div>
      
      {/* رائٹ سائیڈ */}
      <div className="flex items-center gap-4">
        <button onClick={onSearchClick} className="p-2 rounded-full text-gray-300 hover:bg-gray-700">
          <IconSearch />
        </button>
        {/* واٹس ایپ پر کلک ہونے والا لوگو */}
        <a 
          href={whatsappUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-600 flex-shrink-0 transition-transform hover:scale-110"
        >
          <Image src={cacheBustedLogoSrc} alt="Logo" width={40} height={40} className="object-cover" priority unoptimized />
        </a>
      </div>
    </header>
  );
}
// --- (نیا ہیڈر ختم) ---

// --- 2. نیا ہیرو بینر (Hero Banner) ---
function HeroBanner({ bannerUrl }) {
  const cacheBustedBannerUrl = `${bannerUrl}?v=${new Date().getTime()}`;
  if (!bannerUrl) return null; // اگر بینر اپ لوڈ نہ ہو تو کچھ نہ دکھائیں

  return (
    <div className="w-full relative">
      {/* 'h-auto' تصویر کو اس کے اصل سائز میں دکھائے گا */}
      <Image 
        src={cacheBustedBannerUrl} 
        width={1200} // ڈیسک ٹاپ کے لیے ایک بڑی ڈیفالٹ چوڑائی
        height={400} // ڈیسک ٹاپ کے لیے ایک ڈیفالٹ اونچائی
        alt="Banner" 
        className="w-full h-auto object-cover" // <-- حل
        unoptimized
        priority
      />
    </div>
  );
}
// --- (بینر ختم) ---


// --- 3. نئے فلٹر ببلز (Bubbles) ---
const filters = [
  { id: 'low-range', label: 'Low Range' },
  { id: 'pta', label: 'PTA Approved' },
  { id: 'gaming', label: 'Gaming' },
];

function FilterBubbles({ activeFilter, onFilterChange }) {
  return (
    <div className="sticky top-[73px] z-10 p-4 bg-gray-900/80 backdrop-blur-sm border-b border-gray-700">
      {/* 'justify-center' انہیں درمیان میں لے آئے گا */}
      <div className="flex items-center justify-center gap-3">
        {filters.map(filter => (
          <button
            key={filter.id}
            // --- 4. نئی ٹاگل (Toggle) لاجک ---
            onClick={() => onFilterChange(filter.id)}
            className={`px-5 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors
              ${activeFilter === filter.id 
                ? 'bg-pink-600 text-white' // ایکٹیو (Active) - اسکرین شاٹ جیسا
                : 'bg-gray-700 text-gray-200 hover:bg-gray-600' // ان-ایکٹیو
              }
            `}
          >
            {filter.label}
          </button>
        ))}
      </div>
    </div>
  );
}
// --- (فلٹر ببلز ختم) ---


// --- 5. Product Card Component (مکمل اپ گریڈ شدہ) ---
function ProductCard({ product, index, style, animationVariant }) {
  const cacheBustedImageUrl = `${product.imageUrl || "/placeholder-image.png"}?v=${new Date().getTime()}`;

  return (
    <motion.div
      className={`rounded-lg overflow-hidden shadow-lg flex flex-col ${style.bg}`}
      variants={animationVariant} // <-- ہر کارڈ کی منفرد اینیمیشن
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }} // <-- صرف ایک بار لوڈ پر
      transition={{ duration: 0.8, delay: (index % 3) * 0.1 }} // <-- 0.8 سیکنڈ، تھوڑے وقفے کے ساتھ
    >
      <div className="w-full h-56 relative"> {/* تصویر کا سائز */}
        <Image 
          src={cacheBustedImageUrl} 
          alt={product.name} 
          layout="fill" 
          className="object-cover" 
          unoptimized 
        />
      </div>
      
      <div className={`p-4 flex-grow flex flex-col ${style.text}`}>
        <h3 className="text-xl font-semibold break-words min-h-[3.5rem]">{product.name}</h3>
        
        {/* --- 6. نیا کارڈ لے آؤٹ (اسکرین شاٹ جیسا) --- */}
        <div className="flex justify-between items-center mt-2">
          <p className="text-md opacity-80 font-bold">PKR {product.price}</p>
          <Link 
            href={`/product/${product.id}`}
            className={`px-3 py-1 rounded-md text-xs font-medium ${style.button} transition-all duration-300`}
          >
            View Product
          </Link>
        </div>
        {/* --- حل ختم --- */}
      </div>
    </motion.div>
  );
}
// --- (کارڈ ختم) ---


// --- Sidebar Component (ویسا ہی) ---
function Sidebar({ isOpen, onClose, brands, selectedBrand, onSelectBrand }) {
  // ... (پہلے جیسا کوڈ) ...
  return (
    <>
      {isOpen && <div className="fixed inset-0 z-30 bg-black/50" onClick={onClose}></div>}
      <div className={`fixed top-0 left-0 z-40 w-64 h-full bg-gray-800 shadow-lg transition-transform ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h2 className="font-bold text-lg text-white">Filter by Brand</h2>
          <button onClick={onClose} className="p-2 rounded-full text-gray-300 hover:bg-gray-700">
            <IconClose />
          </button>
        </div>
        <nav className="p-4">
          <ul>
            <li key="all-brands">
              <button 
                onClick={() => onSelectBrand(null)} 
                className={`w-full text-left p-2 rounded-lg mb-1 ${!selectedBrand ? 'bg-blue-600 text-white font-semibold' : 'text-gray-300 hover:bg-gray-700'}`}
              >
                All Brands
              </button>
            </li>
            {brands.map((brand) => (
              <li key={brand}>
                <button 
                  onClick={() => onSelectBrand(brand)} 
                  className={`w-full text-left p-2 rounded-lg mb-1 ${selectedBrand === brand ? 'bg-blue-600 text-white font-semibold' : 'text-gray-300 hover:bg-gray-700'}`}
                >
                  {brand}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
}

// --- SearchBar Component (ویسا ہی) ---
function SearchBar({ isSearchOpen, onClose, searchTerm, onSearchChange }) {
  if (!isSearchOpen) return null;
  return (
    <div className="sticky top-[141px] z-10 p-4 bg-gray-800 border-b border-gray-700">
      <div className="relative">
        <input
          type="text"
          placeholder="Search products by name or brand..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 pr-10 bg-gray-700 text-white border border-gray-600 rounded-lg shadow-sm"
          autoFocus
        />
        <button onClick={onClose} className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-200">
          <IconClose />
        </button>
      </div>
    </div>
  );
}


// --- 7. اپ ڈیٹ شدہ: مین کلائنٹ کمپوننٹ ---
export default function HomePageClient({ initialProducts, settings, logoUrl, bannerUrl }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [quickFilter, setQuickFilter] = useState('all'); // 'all' کا مطلب ہے کوئی فلٹر نہیں

  // --- 8. کارڈز کے لیے نئی کلر پیلیٹ (اسکرین شاٹ جیسی) ---
  const cardStyles = [
    { bg: 'bg-blue-600', text: 'text-white', button: 'bg-white/90 text-blue-600 hover:bg-white' }, 
    { bg: 'bg-pink-600', text: 'text-white', button: 'bg-white/90 text-pink-600 hover:bg-white' }, 
    { bg: 'bg-lime-500', text: 'text-gray-900', button: 'bg-gray-900/90 text-lime-500 hover:bg-black' },
  ];
  // --- حل ختم ---

  // --- 9. ہر کارڈ کے لیے منفرد اینیمیشنز ---
  const animationVariants = [
    // لیفٹ سے
    { hidden: { opacity: 0, x: -100 }, visible: { opacity: 1, x: 0 } },
    // نیچے سے
    { hidden: { opacity: 0, y: 100 }, visible: { opacity: 1, y: 0 } },
    // رائٹ سے
    { hidden: { opacity: 0, x: 100 }, visible: { opacity: 1, x: 0 } },
  ];
  // --- حل ختم ---

  const uniqueBrands = useMemo(() => {
    if (!initialProducts) return [];
    const brands = initialProducts.map(p => p.brand); 
    return [...new Set(brands.filter(b => b))]; 
  }, [initialProducts]);

  // --- 10. نئی فلٹر لاجک (ببل ٹاگل کے ساتھ) ---
  const handleFilterChange = (id) => {
    setQuickFilter(prev => (prev === id ? 'all' : id));
  };

  const filteredProducts = useMemo(() => {
    if (!initialProducts) return [];
    
    return initialProducts.filter(product => {
      const matchesBrand = selectedBrand ? product.brand === selectedBrand : true;
      const matchesSearch = searchTerm
        ? (product.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
           product.brand?.toLowerCase().includes(searchTerm.toLowerCase()))
        : true;
        
      let matchesQuickFilter = true;
      if (quickFilter !== 'all') { // اگر فلٹر 'all' نہیں ہے
        if (quickFilter === 'low-range') {
          const price = parseFloat(product.price.replace(/,/g, ''));
          matchesQuickFilter = price < 20000;
        } else if (quickFilter === 'gaming') {
          matchesQuickFilter = (product.detail?.toLowerCase().includes('gaming') || product.name?.toLowerCase().includes('gaming'));
        } else if (quickFilter === 'pta') {
          matchesQuickFilter = (product.condition?.toLowerCase().includes('pta approved') || product.detail?.toLowerCase().includes('pta approved'));
        }
      }

      return matchesBrand && matchesSearch && matchesQuickFilter;
    });
  }, [initialProducts, searchTerm, selectedBrand, quickFilter]);
  // --- حل ختم ---

  return (
    <main>
      <AppHeader 
        title={settings.websiteTitle || "softlink.pk"} // سیٹنگز سے ٹائٹل لے گا
        logoUrl={logoUrl}
        whatsappNumber={settings.whatsappNumber} // واٹس ایپ لنک کے لیے
        onMenuClick={() => { setIsMenuOpen(true); setIsSearchOpen(false); }}
        onSearchClick={() => { setIsSearchOpen(prev => !prev); setIsMenuOpen(false); }}
      />
      
      <HeroBanner 
        bannerUrl={bannerUrl}
      />

      <Sidebar 
        isOpen={isMenuOpen} 
        onClose={() => setIsMenuOpen(false)} 
        brands={uniqueBrands}
        selectedBrand={selectedBrand}
        onSelectBrand={(brand) => { setSelectedBrand(brand); setIsMenuOpen(false); }}
      />

      <FilterBubbles 
        activeFilter={quickFilter} 
        onFilterChange={handleFilterChange} // <-- نئی ٹاگل لاجک
      />

      <SearchBar
        isSearchOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      {/* --- 11. گرڈ کو 3 کالم میں تبدیل کیا --- */}
      <div className="p-4 md:p-8">
        {filteredProducts && filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredProducts.map((product, index) => (
              <ProductCard 
                key={product.id || product.name} 
                product={product} 
                index={index}
                style={cardStyles[index % cardStyles.length]} // <-- کلر اسٹائل
                animationVariant={animationVariants[index % animationVariants.length]} // <-- اینیمیشن اسٹائل
              />
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 mt-20">
            <p>No products found.</p>
            {initialProducts?.length > 0 && (
              <p className="text-sm mt-2">Try adjusting your search or filters.</p>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
