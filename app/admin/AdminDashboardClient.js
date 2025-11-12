"use client";

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

function IconDollar() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182.553-.44 1.253-.659 2.003-.659 1.1 0 2.15.362 2.923 1.018M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    </svg>
  );
}

export default function AdminDashboardClient({ logoUrl, bannerUrl, earning = "0.00", passwordQuery, children }) {
  const router = useRouter();
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);

  const handleWithdrawClick = () => {
    // نئے پیج پر لے جائیں
    router.push(`/admin/withdraw?password=${passwordQuery}`);
  };

  return (
    <div className="relative bg-gray-50 min-h-screen">
      {/* --- ہیڈر --- */}
      <header className="sticky top-0 z-20 flex items-center justify-between p-4 bg-white border-b shadow-sm">
        
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-200">
            <Image src={logoUrl} alt="Logo" width={40} height={40} unoptimized className="object-cover" />
          </div>
        </div>
        
        <span className="text-lg md:text-xl font-bold text-gray-800 absolute left-1/2 transform -translate-x-1/2">
          Admin Panel
        </span>
        
        <div className="relative">
          <button 
            onClick={() => setIsWithdrawOpen(!isWithdrawOpen)}
            className="flex items-center gap-2 px-3 py-1.5 bg-green-50 border border-green-200 rounded-full hover:bg-green-100 transition-colors"
          >
            <div className="text-green-600">
              <IconDollar />
            </div>
            <span className="font-bold text-green-800 text-sm md:text-base">
              ${earning}
            </span>
          </button>

          {isWithdrawOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-xl z-30 overflow-hidden">
              <div className="p-4 text-center border-b bg-gray-50">
                <p className="text-xs text-gray-500 uppercase tracking-wider">Available Balance</p>
                <p className="font-bold text-green-600 text-xl mt-1">${earning}</p>
              </div>
              <button 
                className="w-full py-3 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                onClick={handleWithdrawClick} 
              >
                Withdraw Funds
              </button>
            </div>
          )}
        </div>
        
      </header>

      <main>
        {bannerUrl && (
          <div className="w-full h-40 md:h-56 relative">
            <Image 
              src={bannerUrl} 
              alt="Admin Banner" 
              fill 
              className="object-cover" 
              unoptimized 
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-50/80"></div>
          </div>
        )}

        <div className="p-4 relative z-10 -mt-10">
           <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden min-h-[70vh]">
              {children}
           </div>
        </div>
      </main>
    </div>
  );
}
