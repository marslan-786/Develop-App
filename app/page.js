import Image from 'next/image';

// --- Placeholder product data ---
// Later, this data will come from our data.json file on Vercel Blob.
const mockProducts = [
  {
    id: 1,
    name: 'Samsung Galaxy S24 Ultra',
    detail: '12GB RAM, 512GB Storage',
    price: '350,000',
    imageUrl: '/placeholder-image.png', // Placeholder path
  },
  {
    id: 2,
    name: 'iPhone 15 Pro Max',
    detail: '8GB RAM, 256GB Storage',
    price: '420,000',
    imageUrl: '/placeholder-image.png', // Placeholder path
  },
  {
    id: 3,
    name: 'Google Pixel 8 Pro',
    detail: '12GB RAM, 256GB Storage',
    price: '280,000',
    imageUrl: '/placeholder-image.png', // Placeholder path
  },
  {
    id: 4,
    name: 'Oppo Find X7 Ultra',
    detail: '16GB RAM, 512GB Storage',
    price: '290,000',
    imageUrl: '/placeholder-image.png', // Placeholder path
  },
];

// --- Reusable Icon Components ---
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

// --- Reusable Header Component ---
function AppHeader({ title, logoSrc }) {
  return (
    <header className="sticky top-0 z-10 flex items-center justify-between p-4 bg-white shadow-md">
      {/* Left Icon (Menu) */}
      <button className="p-2 rounded-full hover:bg-gray-100">
        <IconMenu />
      </button>

      {/* Center Logo and Title */}
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-200 flex-shrink-0">
          <Image
            src={logoSrc}
            alt="Logo"
            width={40}
            height={40}
            className="object-cover"
            onError={(e) => e.currentTarget.src = "/placeholder-logo.png"}
          />
        </div>
        
        <h1 className="text-xl font-bold whitespace-nowrap">{title}</h1>
        
        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-200 flex-shrink-0">
          <Image
            src={logoSrc}
            alt="Logo"
            width={40}
            height={40}
            className="object-cover"
            onError={(e) => e.currentTarget.src = "/placeholder-logo.png"}
          />
        </div>
      </div>

      {/* Right Icon (Search) */}
      <button className="p-2 rounded-full hover:bg-gray-100">
        <IconSearch />
      </button>
    </header>
  );
}

// --- Reusable Product Card Component ---
function ProductCard({ product }) {
  return (
    <div className="border rounded-lg overflow-hidden shadow-sm bg-white flex flex-col">
      <div className="w-full h-40 relative">
        <Image
          src={product.imageUrl}
          alt={product.name}
          layout="fill"
          className="object-cover"
          onError={(e) => e.currentTarget.src = "/placeholder-image.png"}
        />
      </div>
      <div className="p-3 flex-grow flex flex-col">
        <h3 className="text-lg font-semibold truncate">{product.name}</h3>
        <p className="text-sm text-gray-600 truncate mt-1">{product.detail}</p>
        <p className="text-lg font-bold text-blue-600 mt-2">PKR {product.price}</p>
        <button className="mt-3 w-full bg-blue-500 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors">
          View Details
        </button>
      </div>
    </div>
  );
}

// --- Main Home Page ---
export default function HomePage() {
  const websiteTitle = "Ilyas Mobile Mall"; // This will come from settings later
  const logoPath = "/logo.png"; // This will also come from settings

  return (
    <main>
      {/* --- Main Header --- */}
      <AppHeader title={websiteTitle} logoSrc={logoPath} />

      {/* --- Product Grid --- */}
      <div className="p-4">
        <div className="grid grid-cols-2 gap-4">
          {mockProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
      
      {/* --- Admin Panel Link (Temporary) --- */}
      <div className="p-4 text-center">
        <a href="/admin" className="text-blue-500 underline">
          Go to Admin Panel (Temporary Link)
        </a>
      </div>
    </main>
  );
    }
              
