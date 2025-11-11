// app/ads/page.js

import { head } from '@vercel/blob';
import Link from 'next/link';
import { Suspense } from 'react';
import { isValidAdsPassword } from '../../lib/ads-auth.js'; // <-- نیا آتھ
import AdsPanelClient from './AdsPanelClient'; // <-- یہ فائل ہم آگے بنائیں گے

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

// --- سیٹنگز لوڈ کرنا ---
async function loadAdSettings() {
  let settings = {};
  try {
    const blob = await head('ads.json', { cache: 'no-store' });
    const response = await fetch(blob.url, { cache: 'no-store' });
    if (response.ok) {
      const text = await response.text();
      if (text) settings = JSON.parse(text);
    }
  } catch (e) {}
  return settings;
}

// --- لوڈنگ ---
function AdSettingsLoading() {
  return <div className="p-4 text-center text-gray-400">Loading ad settings...</div>;
}

// --- مین پیج ---
export default async function AdsPage({ searchParams }) {
  const passwordQuery = searchParams.password;

  if (await isValidAdsPassword(passwordQuery)) {
    // --- پاس ورڈ ٹھیک ہے ---
    const initialSettings = await loadAdSettings();
    
    return (
      <Suspense fallback={<AdSettingsLoading />}>
        <AdsPanelClient 
          initialSettings={initialSettings} 
          passwordQuery={passwordQuery} 
        />
      </Suspense>
    );
  } else {
    // --- پاس ورڈ غلط ہے ---
    return <LoginPage />;
  }
}
