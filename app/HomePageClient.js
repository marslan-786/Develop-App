"use client"; 

import { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';

// --- Icon Components (ویسے ہی) ---
function IconMenu() { /* ... */ }
function IconSearch() { /* ... */ }
function IconClose() { /* ... */ }
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


// --- Header Component (اپ ڈیٹ شدہ) ---
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
        
        {/* --- یہ ہے حل 1: اینیمیٹڈ ٹائٹل --- */}
        <h1 className="text-xl font-bold whitespace-nowrap animated-gradient-text">
          {title}
        </h1>
        {/* --- حل ختم --- */}

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

// --- Product Card Component (اپ ڈیٹ شدہ) ---
function ProductCard({ product }) {
  const cacheBustedImageUrl = `${product.imageUrl || "/placeholder-image.png"}?v=${new Date().getTime()}`;

  return (
    // --- یہ ہے حل 2: اینیمیشن ---
    // 'transition-transform' اور 'hover:scale-105' کلاسز شامل کی ہیں
    <div className="border rounded-lg overflow-hidden shadow-sm bg-white flex flex-col transition-transform duration-200 hover:scale-105 hover:shadow-lg">
      <div className="w-full h-40 relative">
        <Image 
          src={cacheBustedImageUrl} 
          alt={product.name} 
          layout="fill" 
          className="object-cover" 
          unoptimized 
        />
      </div>
      <div className="p-3 flex-grow flex flex-col">
        {/* --- یہ ہے حل 1: کٹا ہوا ٹیکسٹ ---
            'truncate' (جو ٹیکسٹ کو کاٹتا ہے) کو 'break-words' سے بدل دیا ہے
            اور 'min-h-[4rem]' شامل کیا ہے تاکہ نام کو دو لائنوں کی جگہ مل سکے
        --- */}
        <h3 className="text-lg font-semibold break-words min-h-[4rem]">{product.name}</h3>
        <p className="text-sm text-gray-600 truncate mt-1">{product.detail}</p>
        <p className="text-lg font-bold text-blue-600 mt-2">PKR {product.price}</p>
        
        {/* --- یہ ہے حل 2: اینیمیٹڈ بٹن --- */}
        <Link 
          href={`/product/${product.id}`}
          className="mt-3 w-full text-center text-white py-2 rounded-lg text-sm font-medium transition-all duration-300 animated-gradient-button"
        >
          View Details
        </Link>
        {/* --- حل ختم --- */}
      </div>
    </div>
  );
}

// ... (باقی تمام کوڈ 'Sidebar', 'SearchBar', 'HomePageClient' ویسا ہی رہے گا) ...

// --- Sidebar Component (ویسا ہی) ---
function Sidebar({ isOpen, onClose, brands, selectedBrand, onSelectBrand }) {
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
    <div className="sticky top-[73px] z-10 p-4 bg-gray-50 border-b">
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


// --- مین کلائنٹ کمپوننٹ (ویسا ہی) ---
export default function HomePageClient({ initialProducts, settings, logoUrl }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBrand, setSelectedBrand] = useState(null);

  const uniqueBrands = useMemo(() => {
    if (!initialProducts) return [];
    const brands = initialProducts.map(p => p.brand); 
    return [...new Set(brands.filter(b => b))]; 
  }, [initialProducts]);

  const filteredProducts = useMemo(() => {
    if (!initialProducts) return [];
    
    return initialProducts.filter(product => {
      const matchesBrand = selectedBrand ? product.brand === selectedBrand : true;
      const matchesSearch = searchTerm
        ? (product.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
           product.brand?.toLowerCase().includes(searchTerm.toLowerCase()))
        : true;
      return matchesBrand && matchesSearch;
    });
  }, [initialProducts, searchTerm, selectedBrand]);

  return (
    <main>
      <AppHeader 
        title={settings.websiteTitle} 
        logoSrc={logoUrl} 
        onMenuClick={() => {
          setIsMenuOpen(true);
          setIsSearchOpen(false);
        }}
        onSearchClick={() => {
          setIsSearchOpen(prev => !prev);
          setIsMenuOpen(false);
        }}
      />
      
      <Sidebar 
        isOpen={isMenuOpen} 
        onClose={() => setIsMenuOpen(false)} 
        brands={uniqueBrands}
        selectedBrand={selectedBrand}
        onSelectBrand={(brand) => {
          setSelectedBrand(brand);
          setIsMenuOpen(false);
        }}
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
            {filteredProducts.map((product) => (
              <ProductCard key={product.id || product.name} product={product} />
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
