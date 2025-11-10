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
function AppHeader({ title, onMenuClick, onSearchClick }) {
  return (
    <header className="sticky top-0 z-20 flex items-center justify-between p-4 bg-gray-900 shadow-md border-b border-gray-700">
      <div className="flex items-center gap-4">
        <button onClick={onMenuClick} className="p-2 rounded-full text-gray-300 hover:bg-gray-700">
          <IconMenu />
        </button>
        <span className="text-xl font-bold text-white">{title}</span>
      </div>
      <div className="flex items-center gap-4">
        <button onClick={onSearchClick} className="p-2 rounded-full text-gray-300 hover:bg-gray-700">
          <IconSearch />
        </button>
        {/* آپ بعد میں کارٹ اور یوزر آئیکن یہاں شامل کر سکتے ہیں */}
      </div>
    </header>
  );
}
// --- (نیا ہیڈر ختم) ---

// --- 2. نیا ہیرو بینر (Hero Banner) ---
function HeroBanner({ bannerUrl, title, settings }) {
  const cacheBustedBannerUrl = `${bannerUrl}?v=${new Date().getTime()}`;
  return (
    <div className="w-full h-64 bg-gray-700 relative flex items-center justify-start p-10">
      {/* بینر امیج */}
      <Image 
        src={cacheBustedBannerUrl} 
        layout="fill" 
        objectFit="cover" 
        alt="Banner" 
        className="opacity-30" // تصویر کو مدھم (dim) کیا
        unoptimized
        priority
      />
      
      {/* بینر ٹیکسٹ (آپ کی ریکوائرمنٹ کے مطابق) */}
      <div className="z-10 text-white space-y-2">
        <h2 className="text-4xl font-bold">{title}</h2>
        <p className="text-lg">{settings.address || 'Your Address Here'}</p>
        <p className="text-lg">{settings.whatsappNumber || 'Your Phone Number Here'}</p>
      </div>
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
      <div className="flex items-center gap-3">
        {filters.map(filter => (
          <button
            key={filter.id}
            // --- 4. نئی ٹاگل (Toggle) لاجک ---
            onClick={() => onFilterChange(filter.id)}
            className={`px-5 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors
              ${activeFilter === filter.id 
                ? 'bg-pink-600 text-white' // ایکٹیو (Active)
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
function ProductCard({ product, index, style }) {
  const cacheBustedImageUrl = `${product.imageUrl || "/placeholder-image.png"}?v=${new Date().getTime()}`;

  // --- 6. نئی اینیمیشن لاجک (3 کالم کے لیے) ---
  const animationVariants = {
    hidden: { 
      opacity: 0, 
      // کالم 0 (لیفٹ) رائٹ سے آئے گا
      // کالم 1 (مڈل) نیچے سے آئے گا
      // کالم 2 (رائٹ) لیفٹ سے آئے گا
      x: index % 3 === 0 ? 100 : (index % 3 === 1 ? 0 : -100),
      y: index % 3 === 1 ? 50 : 0
    },
    visible: { 
      opacity: 1, 
      x: 0,
      y: 0 
    },
  };
  // --- حل ختم ---

  return (
    <motion.div
      // --- 7. کارڈ کا رنگ ---
      className={`rounded-lg overflow-hidden shadow-lg flex flex-col ${style.bg}`}
      variants={animationVariants}
      initial="hidden"
      whileInView="visible"
      // --- اینیمیشن ہر بار ---
      viewport={{ once: false, amount: 0.3 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <div className="w-full h-56 relative"> {/* تصویر کا سائز بڑا کیا */}
        <Image 
          src={cacheBustedImageUrl} 
          alt={product.name} 
          layout="fill" 
          className="object-cover" 
          unoptimized 
        />
      </div>
      
      {/* --- 8. ٹیکسٹ کا رنگ --- */}
      <div className={`p-4 flex-grow flex flex-col ${style.text}`}>
        <h3 className="text-xl font-semibold break-words min-h-[3.5rem]">{product.name}</h3>
        <p className="text-md opacity-80 truncate mt-1">PKR {product.price}</p>
        
        {/* بٹن اسٹائل (اسکرین شاٹ جیسا) */}
        <Link 
          href={`/product/${product.id}`}
          className={`mt-4 w-auto self-start px-4 py-1.5 rounded-lg text-sm font-medium ${style.button} transition-all duration-300`}
        >
          View Product
        </Link>
      </div>
    </motion.div>
  );
}
// --- (کارڈ ختم) ---


// --- Sidebar Component (ڈارک موڈ کے لیے اپ ڈیٹ شدہ) ---
function Sidebar({ isOpen, onClose, brands, selectedBrand, onSelectBrand }) {
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

// --- SearchBar Component (ڈارک موڈ کے لیے اپ ڈیٹ شدہ) ---
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


// --- 9. اپ ڈیٹ شدہ: مین کلائنٹ کمپوننٹ ---
export default function HomePageClient({ initialProducts, settings, logoUrl, bannerUrl }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [quickFilter, setQuickFilter] = useState('all'); // 'all' کا مطلب ہے کوئی فلٹر نہیں

  // --- 10. کارڈز کے لیے نئی کلر پیلیٹ (اسکرین شاٹ جیسی) ---
  const cardStyles = [
    { bg: 'bg-blue-600', text: 'text-white', button: 'bg-white/20 text-white hover:bg-white/30' }, 
    { bg: 'bg-pink-600', text: 'text-white', button: 'bg-white/20 text-white hover:bg-white/30' }, 
    { bg: 'bg-lime-500', text: 'text-gray-900', button: 'bg-gray-900/20 text-gray-900 hover:bg-gray-900/30' },
  ];
  // --- حل ختم ---

  const uniqueBrands = useMemo(() => {
    if (!initialProducts) return [];
    const brands = initialProducts.map(p => p.brand); 
    return [...new Set(brands.filter(b => b))]; 
  }, [initialProducts]);

  // --- 11. نئی فلٹر لاجک (ببل ٹاگل کے ساتھ) ---
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
        title="softlink.pk" // <-- ٹائٹل آپ کی مرضی کے مطابق
        onMenuClick={() => { setIsMenuOpen(true); setIsSearchOpen(false); }}
        onSearchClick={() => { setIsSearchOpen(prev => !prev); setIsMenuOpen(false); }}
      />
      
      <HeroBanner 
        bannerUrl={bannerUrl} 
        title={settings.websiteTitle || "Ilyas Mobile Mall"}
        settings={settings} // <-- ایڈریس اور فون نمبر کے لیے
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

      <div className="p-4 md:p-8">
        {filteredProducts && filteredProducts.length > 0 ? (
          // --- 12. گرڈ کو 3 کالم میں تبدیل کیا ---
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredProducts.map((product, index) => (
              <ProductCard 
                key={product.id || product.name} 
                product={product} 
                index={index}
                style={cardStyles[index % cardStyles.length]}
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
