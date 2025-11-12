import { head } from '@vercel/blob';
import Link from 'next/link';
import { Suspense } from 'react';
import { isValidAdsPassword } from '../../lib/ads-auth.js'; 
import AdsPanelClient from './AdsPanelClient'; 
import { kv } from '@vercel/kv';

export const dynamic = 'force-dynamic';

// --- لاگ ان پیج ---
function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
      <div className="w-full max-w-xs p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-xl font-bold text-center mb-4">Ads Panel Login</h1>
        <form method="GET" action="/ads" className="space-y-4">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            Login
          </button>
        </form>
        <Link href="/" className="block text-center text-sm text-blue-500 hover:underline mt-4">
          ← Go back to Home
        </Link>
      </div>
    </div>
  );
}

// --- ڈیٹا لوڈ کرنے کا فنکشن ---
async function loadData() {
  let settings = {};
  let withdrawals = [];
  let todayVisitors = 0;
  let totalVisitors = 0;

  // 1. سیٹنگز لوڈ کریں
  try {
    const blob = await head('ads.json', { cache: 'no-store' });
    const response = await fetch(blob.url, { cache: 'no-store' });
    if (response.ok) {
      const text = await response.text();
      if (text) settings = JSON.parse(text);
    }
  } catch (e) {}

  // 2. ودڈرا ریکویسٹس لوڈ کریں
  try {
    const wBlob = await head('withdrawals.json', { cache: 'no-store' });
    const wRes = await fetch(wBlob.url, { cache: 'no-store' });
    if (wRes.ok) {
      const text = await wRes.text();
      if (text) withdrawals = JSON.parse(text);
    }
  } catch (e) {}
  
  // 3. وزٹرز لوڈ کریں
  try {
    const today = new Date().toLocaleString('sv-SE', { timeZone: 'Asia/Karachi' }).split(' ')[0];
    [todayVisitors, totalVisitors] = await Promise.all([
      kv.get(`visits:${today}`),
      kv.get('total_visitors')
    ]);
  } catch (e) {}
  
  return { 
    initialSettings: settings, 
    withdrawals: withdrawals || [], // <-- ✅ ودڈرا لسٹ بھیجیں
    todayVisitors: todayVisitors || 0, 
    totalVisitors: totalVisitors || 0  
  };
}

function AdSettingsLoading() {
  return <div className="p-4 text-center text-gray-400">Loading ad panel...</div>;
}

// --- مین پیج ---
export default async function AdsPage({ searchParams }) {
  const passwordQuery = searchParams.password;

  if (await isValidAdsPassword(passwordQuery)) {
    const { initialSettings, withdrawals, todayVisitors, totalVisitors } = await loadData();
    
    return (
      <Suspense fallback={<AdSettingsLoading />}>
        <AdsPanelClient 
          initialSettings={initialSettings} 
          initialWithdrawals={withdrawals} // <-- ✅ پاس کریں
          passwordQuery={passwordQuery}
          todayVisitors={todayVisitors}
          totalVisitors={totalVisitors}
        />
      </Suspense>
    );
  } else {
    return <LoginPage />;
  }
}
