"use client"; 

import { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion'; 

// --- Icon Components (اپ ڈیٹ شدہ واٹس ایپ آئیکن) ---
function IconWhatsApp() {
  return (
    // --- یہ ہے حل 2: بڑا آئیکن ---
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor" className="w-10 h-10"> 
    {/* سائز 'w-8 h-8' سے 'w-10 h-10' کر دیا گیا ہے */}
    {/* --- حل ختم --- */}
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
// --- (آئیکنز ختم) ---

// --- ہیڈر ---
function AppHeader({ title, logoUrl, whatsappNumber, onMenuClick, onSearchClick }) {
  const cacheBustedLogoSrc = `${logoUrl}?v=${new Date().getTime()}`;
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Hello, I am interested in your products.')}`;

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between p-4 bg-gray-900 shadow-md border-b border-gray-700">
      <div className="flex items-center gap-4">
        <button onClick={onMenuClick} className="p-2 rounded-full text-gray-300 hover:bg-gray-700">
          <IconMenu />
        </button>
        <span className="text-xl font-bold text-white whitespace-nowrap animated-gradient-text">
          {title}
        </span>
      </div>
      <div className="flex items-center gap-4">
        <button onClick={onSearchClick} className="p-2 rounded-full text-gray-300 hover:bg-gray-700">
          <IconSearch />
        </button>
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
// --- (ہیڈر ختم) ---

// --- ہیرو بینر ---
function HeroBanner({ bannerUrl }) {
  const cacheBustedBannerUrl = `${bannerUrl}?v=${new Date().getTime()}`;
  if (!bannerUrl) return null; 

  return (
    <div className="w-full relative">
      <Image 
        src={cacheBustedBannerUrl} 
        width={1200}
        height={400} 
        alt="Banner" 
        className="w-full h-auto object-cover" 
        unoptimized
        priority
      />
    </div>
  );
}
// --- (بینر ختم) ---


// --- فلٹر ببلز ---
const filters = [
  { id: 'low-range', label: 'Low Range' },
  { id: 'pta', label: 'PTA Approved' },
  { id: 'gaming', label: 'Gaming' },
];

function FilterBubbles({ activeFilter, onFilterChange }) {
  return (
    <div className="sticky top-[73px] z-10 p-4 bg-gray-900/80 backdrop-blur-sm border-b border-gray-700">
      <div className="flex items-center justify-center gap-3">
        {filters.map(filter => (
          <button
            key={filter.id}
            onClick={() => onFilterChange(filter.id)}
            className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300
              ${activeFilter === filter.id 
                ? 'animated-gradient-button text-white shadow-lg' // ایکٹیو (Active)
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


// --- Product Card ---
function ProductCard({ product, index, style, animationVariant }) {
  const cacheBustedImageUrl = `${product.imageUrl || "/placeholder-image.png"}?v=${new Date().getTime()}`;
  return (
    <motion.div
      className={`rounded-lg overflow-hidden shadow-lg flex flex-col ${style.bg}`}
      variants={animationVariant} 
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8, delay: (index % 3) * 0.1 }}
    >
      <div className="w-full h-56 relative">
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
        <div className="flex justify-between items-center mt-2">
          <p className="text-md opacity-80 font-bold">PKR {product.price}</p>
          <Link 
            href={`/product/${product.id}`}
            className={`px-3 py-1 rounded-md text-xs font-medium ${style.button} transition-all duration-300`}
          >
            View Product
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
// --- (کارڈ ختم) ---


// --- Sidebar Component ---
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

// --- SearchBar Component ---
function SearchBar({ isSearchOpen, onClose, searchTerm, onSearchChange }) {
  if (!isSearchOpen) return null;
  return (
    <div className="sticky top-[141px] z-10 p-4 bg-gray-800 border-b border-gray-700">
      <div className="relative">
        <input
          type="text"
          placeholder="Search products by name or brand..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
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

// --- فلوٹنگ واٹس ایپ بٹن (اپ ڈیٹ شدہ) ---
function FloatingWhatsAppButton({ whatsappNumber }) {
  if (!whatsappNumber) return null;
  
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Hello, I am interested in your products.')}`;
  
  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      // --- یہ ہے حل 2: بڑا بٹن ---
      className="fixed bottom-6 right-6 z-20 p-5 bg-green-500 text-white rounded-full shadow-lg transition-transform hover:scale-110"
      // 'p-4' کو 'p-5' کر دیا گیا ہے
      // --- حل ختم ---
    >
      <IconWhatsApp />
    </a>
  );
}


// --- مین کلائنٹ کمپوننٹ ---
export default function HomePageClient({ initialProducts, settings, logoUrl, bannerUrl }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [quickFilter, setQuickFilter] = useState('all'); 

  const cardStyles = [
    { bg: 'bg-blue-600', text: 'text-white', button: 'bg-white/90 text-blue-600 hover:bg-white' }, 
    { bg: 'bg-pink-600', text: 'text-white', button: 'bg-white/90 text-pink-600 hover:bg-white' }, 
    { bg: 'bg-lime-500', text: 'text-gray-900', button: 'bg-gray-900/90 text-lime-500 hover:bg-black' },
  ];

  const animationVariants = [
    { hidden: { opacity: 0, x: -100 }, visible: { opacity: 1, x: 0 } },
    { hidden: { opacity: 0, y: 100 }, visible: { opacity: 1, y: 0 } },
    { hidden: { opacity: 0, x: 100 }, visible: { opacity: 1, x: 0 } },
  ];

  const uniqueBrands = useMemo(() => {
    if (!initialProducts) return [];
    const brands = initialProducts.map(p => p.brand); 
    return [...new Set(brands.filter(b => b))]; 
  }, [initialProducts]);

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
      if (quickFilter !== 'all') {
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

  return (
    <main>
      <AppHeader 
        title={settings.websiteTitle || "softlink.pk"} 
        logoUrl={logoUrl}
        whatsappNumber={settings.whatsappNumber}
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
        onFilterChange={handleFilterChange} 
      />

      <SearchBar
        isSearchOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      <div className="p-4 md:p-8">
        {filteredProducts && filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredProducts.map((product, index) => (
              <ProductCard 
                key={product.id || product.name} 
                product={product} 
                index={index}
                style={cardStyles[index % cardStyles.length]}
                animationVariant={animationVariants[index % animationVariants.length]}
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
      
      <FloatingWhatsAppButton whatsappNumber={settings.whatsappNumber} />
    </main>
  );
}
