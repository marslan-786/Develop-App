"use client"; 

import { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion'; // اینیمیشن کے لیے

// --- Icon Components (صرف ایک بار ڈیفائن کیے گئے) ---
function IconFilter() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 7.963.648a.75.75 0 0 1 .488.901l-1.118 4.473a.75.75 0 0 0 .14.54l3.175 3.174a.75.75 0 0 1-.53 1.28H4.218a.75.75 0 0 1-.53-1.28l3.175-3.174a.75.75 0 0 0 .14-.54L5.89 4.55a.75.75 0 0 1 .488-.901A47.384 47.384 0 0 1 12 3Z" />
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


// --- Header Component (ویسا ہی) ---
function AppHeader({ title, logoSrc, onMenuClick, onSearchClick }) {
  const cacheBustedLogoSrc = `${logoSrc}?v=${new Date().getTime()}`;
  return (
    <header className="sticky top-0 z-20 flex items-center justify-between p-4 bg-white shadow-md">
      <button onClick={onMenuClick} className="p-2 rounded-full hover:bg-gray-100">
        <IconMenu />
      </button>
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-200 flex-shrink-0">
          <Image src={cacheBustedLogoSrc} alt="Logo" width={40} height={40} className="object-cover" priority unoptimized />
        </div>
        <h1 className="text-xl font-bold whitespace-nowrap animated-gradient-text">{title}</h1>
        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-200 flex-shrink-0">
          <Image src={cacheBustedLogoSrc} alt="Logo" width={40} height={40} className="object-cover" priority unoptimized />
        </div>
      </div>
      <button onClick={onSearchClick} className="p-2 rounded-full hover:bg-gray-100">
        <IconSearch />
      </button>
    </header>
  );
}

// --- فلٹر ببلز (Bubbles) کمپوننٹ (ویسا ہی) ---
const filters = [
  { id: 'all', label: 'All' },
  { id: 'low-range', label: 'Low Range (< 20k)' },
  { id: 'gaming', label: 'Gaming' },
  { id: 'pta', label: 'PTA Approved' },
  { id: 'non-pta', label: 'Non-PTA' },
];

function FilterBubbles({ activeFilter, onFilterChange }) {
  return (
    <div className="sticky top-[73px] z-10 p-4 bg-white/80 backdrop-blur-sm border-b">
      <div className="flex items-center gap-2 overflow-x-auto">
        {filters.map(filter => (
          <button
            key={filter.id}
            onClick={() => onFilterChange(filter.id)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors
              ${activeFilter === filter.id 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }
            `}
          >
            {filter.label}
          </button>
        ))}
        <button 
          onClick={() => alert('Advanced Filter (Price Range) coming soon!')}
          className="p-2 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200"
        >
          <IconFilter />
        </button>
      </div>
    </div>
  );
}
// --- (فلٹر ببلز ختم) ---


// --- Product Card Component (مکمل اپ گریڈ شدہ) ---
function ProductCard({ product, index, style }) { // <-- 'style' prop لیں
  const cacheBustedImageUrl = `${product.imageUrl || "/placeholder-image.png"}?v=${new Date().getTime()}`;

  // --- یہ ہے حل 1: کراس اوور اینیمیشن ---
  const animationVariants = {
    hidden: { 
      opacity: 0, 
      // جو لیفٹ (index 0) پر ہے وہ رائٹ (100) سے آئے گا
      // جو رائٹ (index 1) پر ہے وہ لیفٹ (-100) سے آئے گا
      x: index % 2 === 0 ? 100 : -100 
    },
    visible: { 
      opacity: 1, 
      x: 0 
    },
  };
  // --- حل ختم ---

  return (
    <motion.div
      // --- یہ ہے حل 2: کارڈ کا رنگ ---
      // 'bg-white' کو ہٹا دیا گیا ہے اور 'style.bg' (بیک گراؤنڈ) کو شامل کیا گیا ہے
      className={`border rounded-lg overflow-hidden shadow-sm flex flex-col ${style.bg}`}
      variants={animationVariants}
      initial="hidden"
      whileInView="visible"
      // --- یہ ہے حل 3: اینیمیشن ہر بار ---
      // 'once: true' کو 'once: false' سے بدل دیا گیا ہے (یا مکمل ہٹا دیں)
      viewport={{ once: false, amount: 0.3 }}
      // --- حل ختم ---
      transition={{ duration: 0.5 }}
    >
      <div className="w-full h-40 relative">
        <Image 
          src={cacheBustedImageUrl} 
          alt={product.name} 
          layout="fill" 
          className="object-cover" 
          unoptimized 
        />
      </div>
      
      {/* --- یہ ہے حل 2 (جاری): ٹیکسٹ کا رنگ ---
          'bg-white' کو ہٹا دیا گیا ہے اور 'style.text' (ٹیکسٹ کا رنگ) شامل کیا گیا ہے
      --- */}
      <div className={`p-3 flex-grow flex flex-col ${style.text}`}>
        <h3 className="text-lg font-semibold break-words min-h-[4rem]">{product.name}</h3>
        <p className="text-sm opacity-80 truncate mt-1">{product.detail}</p>
        <p className="text-lg font-bold mt-2">PKR {product.price}</p>
        
        {/* اینیمیٹڈ بٹن (یہ اب رنگین بیک گراؤنڈ پر بھی اچھا لگے گا) */}
        <Link 
          href={`/product/${product.id}`}
          className="mt-3 w-full text-center text-white py-2 rounded-lg text-sm font-medium transition-all duration-300 animated-gradient-button"
        >
          View Details
        </Link>
      </div>
    </motion.div>
  );
}

// --- Sidebar Component (ویسا ہی) ---
function Sidebar({ isOpen, onClose, brands, selectedBrand, onSelectBrand }) {
  // ... (پہلے جیسا کوڈ) ...
  return (
    <>
      {isOpen && <div className="fixed inset-0 z-30 bg-black/50" onClick={onClose}></div>}
      <div className={`fixed top-0 left-0 z-40 w-64 h-full bg-white shadow-lg transition-transform ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="font-bold text-lg">Filter by Brand</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100">
            <IconClose />
          </button>
        </div>
        <nav className="p-4">
          <ul>
            <li key="all-brands">
              <button 
                onClick={() => onSelectBrand(null)} 
                className={`w-full text-left p-2 rounded-lg mb-1 ${!selectedBrand ? 'bg-blue-100 text-blue-700 font-semibold' : 'hover:bg-gray-100'}`}
              >
                All Brands
              </button>
            </li>
            {brands.map((brand) => (
              <li key={brand}>
                <button 
                  onClick={() => onSelectBrand(brand)} 
                  className={`w-full text-left p-2 rounded-lg mb-1 ${selectedBrand === brand ? 'bg-blue-100 text-blue-700 font-semibold' : 'hover:bg-gray-100'}`}
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
    <div className="sticky top-[149px] z-10 p-4 bg-gray-50 border-b">
      <div className="relative">
        <input
          type="text"
          placeholder="Search products by name or brand..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 pr-10 border rounded-lg shadow-sm"
          autoFocus
        />
        <button onClick={onClose} className="absolute right-2 top-1.2 -translate-y-1.2 p-1 text-gray-400 hover:text-gray-700">
          <IconClose />
        </button>
      </div>
    </div>
  );
}


// --- اپ ڈیٹ شدہ: مین کلائنٹ کمپوننٹ ---
export default function HomePageClient({ initialProducts, settings, logoUrl }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [quickFilter, setQuickFilter] = useState('all');

  // --- یہ ہے حل 4: کارڈز کے لیے نئی کلر پیلیٹ ---
  // (اسکرین شاٹ سے متاثر ہو کر)
  const cardStyles = [
    { bg: 'bg-red-500', text: 'text-white' }, // سرخ
    { bg: 'bg-gray-800', text: 'text-white' }, // کالا
    { bg: 'bg-yellow-400', text: 'text-gray-800' }, // پیلا
    { bg: 'bg-blue-500', text: 'text-white' }, // نیلا
    { bg: 'bg-green-500', text: 'text-white' }, // سبز
    { bg: 'bg-indigo-600', text: 'text-white' }  // جامنی
  ];
  // --- حل ختم ---

  const uniqueBrands = useMemo(() => {
    if (!initialProducts) return [];
    const brands = initialProducts.map(p => p.brand); 
    return [...new Set(brands.filter(b => b))]; 
  }, [initialProducts]);

  // اپ ڈیٹ شدہ: فلٹر کی مکمل لاجک
  const filteredProducts = useMemo(() => {
    if (!initialProducts) return [];
    
    return initialProducts.filter(product => {
      const matchesBrand = selectedBrand ? product.brand === selectedBrand : true;
      const matchesSearch = searchTerm
        ? (product.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
           product.brand?.toLowerCase().includes(searchTerm.toLowerCase()))
        : true;
        
      let matchesQuickFilter = true;
      if (quickFilter === 'low-range') {
        const price = parseFloat(product.price.replace(/,/g, ''));
        matchesQuickFilter = price < 20000;
      } else if (quickFilter === 'gaming') {
        matchesQuickFilter = (product.detail?.toLowerCase().includes('gaming') || product.name?.toLowerCase().includes('gaming'));
      } else if (quickFilter === 'pta') {
        matchesQuickFilter = (product.condition?.toLowerCase().includes('pta approved') || product.detail?.toLowerCase().includes('pta approved'));
      } else if (quickFilter === 'non-pta') {
        matchesQuickFilter = (product.condition?.toLowerCase().includes('non-pta') || product.detail?.toLowerCase().includes('non-pta'));
      }

      return matchesBrand && matchesSearch && matchesQuickFilter;
    });
  }, [initialProducts, searchTerm, selectedBrand, quickFilter]);

  return (
    <main>
      <AppHeader 
        title={settings.websiteTitle} 
        logoSrc={logoUrl} 
        onMenuClick={() => { setIsMenuOpen(true); setIsSearchOpen(false); }}
        onSearchClick={() => { setIsSearchOpen(prev => !prev); setIsMenuOpen(false); }}
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
        onFilterChange={setQuickFilter} 
      />

      <SearchBar
        isSearchOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      <div className="p-4">
        {filteredProducts && filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 gap-4">
            {filteredProducts.map((product, index) => (
              <ProductCard 
                key={product.id || product.name} 
                product={product} 
                index={index}
                // --- یہ ہے حل 4 (جاری): کلر اسٹائل کو پاس کریں ---
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
