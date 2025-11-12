import { head } from '@vercel/blob';
import { isValidPassword } from '../../../lib/auth.js';
import WithdrawPageClient from './WithdrawPageClient.js';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

function IconArrowLeft() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
    </svg>
  );
}

export default async function WithdrawPage({ searchParams }) {
  const passwordQuery = searchParams.password;

  if (!(await isValidPassword(passwordQuery))) {
    return (
      <div className="p-4 text-center text-red-600">
        Unauthorized access. Please login again.
      </div>
    );
  }

  // ارننگ لوڈ کریں
  let earning = "0.00";
  try {
    const adsBlob = await head('ads.json', { cache: 'no-store' });
    const response = await fetch(adsBlob.url, { cache: 'no-store' });
    if (response.ok) {
      const adsSettings = await response.json();
      earning = adsSettings.earning || "0.00";
    }
  } catch (error) {}

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-10 flex items-center gap-4 p-4 bg-white border-b shadow-sm">
        <Link 
          href={`/admin?password=${passwordQuery}`}
          className="p-2 rounded-full hover:bg-gray-100 text-gray-600"
        >
          <IconArrowLeft />
        </Link>
        <h1 className="text-xl font-bold text-gray-800">Withdraw Funds</h1>
      </header>

      <div className="max-w-md mx-auto p-4">
        <WithdrawPageClient earning={earning} passwordQuery={passwordQuery} />
      </div>
    </div>
  );
}
