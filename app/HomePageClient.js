"use client"; 

import { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion'; // <-- 1. اینیمیشن کے لیے امپورٹ

// --- Icon Components (ویسے ہی) ---
function IconMenu() { /* ... */ }
function IconSearch() { /* ... */ }
function IconClose() { /* ... */ }
function IconFilter() { // <-- فلٹر کے لیے نیا آئیکن
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 7.963.648a.75.75 0 0 1 .488.901l-1.118 4.473a.75.75 0 0 0 .14.54l3.175 3.174a.75.75 0 0 1-.53 1.28H4.218a.75.75 0 0 1-.53-1.28l3.175-3.174a.75.75 0 0 0 .14-.54L5.89 4.55a.75.75 0 0 1 .488-.901A47.384 47.384 0 0 1 12 3Z" />
    </svg>
  );
}
// (یہاں آئیکنز کا مکمل کوڈ ہے تاکہ کوئی غلطی نہ ہو)
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

// --- 2. نیا: فلٹر ببلز (Bubbles) کمپوننٹ ---
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
        {/* 3. نیا: ایڈوانس فلٹر بٹن */}
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


// --- 4. اپ ڈیٹ شدہ: Product Card Component ---
// (اینیمیشن اور مختلف رنگوں کے ساتھ)
function ProductCard({ product, index, colorClass }) {
  const cacheBustedImageUrl = `${product.imageUrl || "/placeholder-image.png"}?v=${new Date().getTime()}`;

  // 5. اسکرول اینیمیشن کی سیٹنگز
  const animationVariants = {
    hidden: { 
      opacity: 0, 
      x: index % 2 === 0 ? -100 : 100 // 0, 2, 4... بائیں سے; 1, 3, 5... دائیں سے
    },
    visible: { 
      opacity: 1, 
      x: 0 
    },
  };

  return (
    <motion.div
      className={`border rounded-lg overflow-hidden shadow-sm flex flex-col ${colorClass}`} // <-- 6. کارڈ کا رنگ
      variants={animationVariants}
      initial="hidden"
      whileInView="visible" // <-- جب اسکرول کر کے یہاں پہنچیں
      viewport={{ once: true, amount: 0.3 }} // <-- 30% نظر آنے پر اینیمیٹ ہو
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
      <div className="p-3 flex-grow flex flex-col bg-white">
        <h3 className="text-lg font-semibold break-words min-h-[4rem]">{product.name}</h3>
        <p className="text-sm text-gray-600 truncate mt-1">{product.detail}</p>
        <p className="text-lg font-bold text-blue-600 mt-2">PKR {product.price}</p>
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
    <div className="sticky top-[149px] z-10 p-4 bg-gray-50 border-b"> {/* ٹاپ پوزیشن اپ ڈیٹ کی */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search products by name or brand..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 pr-10 border rounded-lg shadow-sm"
          autoFocus
        />
        <button onClick={onClose} className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-700">
          <IconClose />
        </button>
      </div>
    </div>
  );
}


// --- 7. اپ ڈیٹ شدہ: مین کلائنٹ کمپوننٹ ---
export default function HomePageClient({ initialProducts, settings, logoUrl }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [quickFilter, setQuickFilter] = useState('all'); // <-- 8. ببلز کے لیے نئی اسٹیٹ

  // 9. کارڈز کے لیے مختلف رنگ
  const cardColors = ['bg-blue-50', 'bg-green-50', 'bg-yellow-50', 'bg-red-50', 'bg-purple-50', 'bg-indigo-50'];

  const uniqueBrands = useMemo(() => {
    if (!initialProducts) return [];
    const brands = initialProducts.map(p => p.brand); 
    return [...new Set(brands.filter(b => b))]; 
  }, [initialProducts]);

  // 10. اپ ڈیٹ شدہ: فلٹر کی مکمل لاجک
  const filteredProducts = useMemo(() => {
    if (!initialProducts) return [];
    
    return initialProducts.filter(product => {
      // 1. برانڈ فلٹر (سائیڈ مینیو سے)
      const matchesBrand = selectedBrand ? product.brand === selectedBrand : true;
      
      // 2. سرچ فلٹر
      const matchesSearch = searchTerm
        ? (product.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
           product.brand?.toLowerCase().includes(searchTerm.toLowerCase()))
        : true;
        
      // 3. ببل فلٹر
      let matchesQuickFilter = true;
      if (quickFilter === 'low-range') {
        const price = parseFloat(product.price.replace(/,/g, ''));
        matchesQuickFilter = price < 20000;
      } else if (quickFilter === 'gaming') {
        matchesQuickFilter = product.detail?.toLowerCase().includes('gaming');
      } else if (quickFilter === 'pta') {
        matchesQuickFilter = product.condition?.toLowerCase().includes('pta approved');
      } else if (quickFilter === 'non-pta') {
        matchesQuickFilter = product.condition?.toLowerCase().includes('non-pta');
      }

      return matchesBrand && matchesSearch && matchesQuickFilter;
    });
  }, [initialProducts, searchTerm, selectedBrand, quickFilter]); // <-- quickFilter کو شامل کریں

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

      {/* ببلز کو یہاں شامل کریں */}
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
            {filteredProducts.map((product, index) => ( // <-- 'index' کو یہاں حاصل کریں
              <ProductCard 
                key={product.id || product.name} 
                product={product} 
                index={index} // <-- اینیمیشن کے لیے index پاس کریں
                colorClass={cardColors[index % cardColors.length]} // <-- رنگ پاس کریں
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
