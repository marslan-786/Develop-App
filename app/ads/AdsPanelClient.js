"use client";

import { useState, useEffect } from 'react';

// --- آئیکنز ---
function IconBell() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
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

// --- ٹوگل اور ان پٹ کمپوننٹس ---
function ToggleSwitch({ label, isEnabled, onToggle }) {
  return (
    <label className="flex items-center justify-between cursor-pointer p-4 bg-white rounded-lg shadow-sm border">
      <span className="font-medium text-gray-700">{label}</span>
      <div className={`relative w-11 h-6 rounded-full transition-colors ${isEnabled ? 'bg-blue-600' : 'bg-gray-200'}`}>
        <span className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform ${isEnabled ? 'transform translate-x-5' : ''}`}></span>
      </div>
      <input type="checkbox" className="sr-only" checked={isEnabled} onChange={onToggle} />
    </label>
  );
}

function AdSlotInput({ label, value, onChange }) {
  return (
    <div className="pl-4 pr-4 pb-3 -mt-2 bg-white rounded-b-lg border-b border-l border-r">
      <label className="block text-xs font-medium text-gray-500">{label}</label>
      <input type="text" value={value} onChange={onChange} placeholder="e.g., 1234567890" className="mt-1 block w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md shadow-sm" />
    </div>
  );
}

function VisitorStats({ today, total }) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg shadow-sm text-center">
        <div className="text-sm font-medium text-blue-600">Today's Visitors</div>
        <div className="text-3xl font-bold text-blue-900">{today}</div>
      </div>
      <div className="p-4 bg-green-50 border border-green-200 rounded-lg shadow-sm text-center">
        <div className="text-sm font-medium text-green-600">Total Visitors</div>
        <div className="text-3xl font-bold text-green-900">{total}</div>
      </div>
    </div>
  );
}

// --- ودڈرا ریکویسٹ لسٹ (پوپ اپ) ---
function WithdrawalsModal({ requests, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white w-full max-w-md rounded-xl shadow-2xl overflow-hidden max-h-[80vh] flex flex-col">
        <div className="p-4 border-b flex justify-between items-center bg-gray-50">
          <h2 className="font-bold text-lg text-gray-800">Withdrawal Requests</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded-full"><IconClose /></button>
        </div>
        
        <div className="overflow-y-auto p-4 space-y-3">
          {requests.length === 0 ? (
            <p className="text-center text-gray-500 py-10">No pending requests.</p>
          ) : (
            requests.map((req) => (
              <div key={req.id} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                <div className="flex justify-between mb-2">
                  <span className="font-bold text-lg text-blue-600">${req.amount}</span>
                  <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">{req.status}</span>
                </div>
                <div className="text-sm space-y-1 text-gray-700">
                  <p><strong>Method:</strong> {req.method}</p>
                  <p><strong>Account:</strong> {req.accountNumber}</p>
                  <p><strong>Title:</strong> {req.accountTitle}</p>
                  <p className="text-xs text-gray-400 mt-2">{req.date}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}


export default function AdsPanelClient({ 
  initialSettings, 
  initialWithdrawals,
  passwordQuery,
  todayVisitors,  
  totalVisitors   
}) {
  
  // --- States ---
  const [googleSiteVerification, setGoogleSiteVerification] = useState('');
  const [adsenseClientId, setAdsenseClientId] = useState('');
  const [masterAdsEnabled, setMasterAdsEnabled] = useState(false);
  const [earning, setEarning] = useState(''); // <-- ✅ Earning State

  const [showHomepageBannerAd, setShowHomepageBannerAd] = useState(false);
  const [homepageBannerSlotId, setHomepageBannerSlotId] = useState(''); 
  const [showHomepageInFeedAds, setShowHomepageInFeedAds] = useState(false);
  const [homepageInFeedSlotId, setHomepageInFeedSlotId] = useState(''); 
  const [showHomepagePopupAd, setShowHomepagePopupAd] = useState(false);
  const [homepagePopupSlotId, setHomepagePopupSlotId] = useState(''); 
  const [showProductInterstitialAd, setShowProductInterstitialAd] = useState(false);
  const [productInterstitialSlotId, setProductInterstitialSlotId] = useState(''); 
  
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  
  const [showWithdrawals, setShowWithdrawals] = useState(false); // Modal State

  // --- Effects ---
  useEffect(() => {
    setGoogleSiteVerification(initialSettings.googleSiteVerification || '');
    setAdsenseClientId(initialSettings.adsenseClientId || '');
    setMasterAdsEnabled(initialSettings.masterAdsEnabled || false);
    setEarning(initialSettings.earning || ''); // <-- Load Earning

    setShowHomepageBannerAd(initialSettings.showHomepageBannerAd || false);
    setHomepageBannerSlotId(initialSettings.homepageBannerSlotId || '');
    setShowHomepageInFeedAds(initialSettings.showHomepageInFeedAds || false);
    setHomepageInFeedSlotId(initialSettings.homepageInFeedSlotId || '');
    setShowHomepagePopupAd(initialSettings.showHomepagePopupAd || false);
    setHomepagePopupSlotId(initialSettings.homepagePopupSlotId || '');
    setShowProductInterstitialAd(initialSettings.showProductInterstitialAd || false);
    setProductInterstitialSlotId(initialSettings.productInterstitialSlotId || '');
  }, [initialSettings]);

  // --- پینڈنگ ریکویسٹس گنیں ---
  const pendingRequestsCount = initialWithdrawals.filter(req => req.status === 'Pending').length;

  // --- Save Function ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('Saving...');
    
    const settingsToSave = {
      googleSiteVerification, adsenseClientId, masterAdsEnabled, earning, // <-- Save Earning
      showHomepageBannerAd, homepageBannerSlotId,
      showHomepageInFeedAds, homepageInFeedSlotId,
      showHomepagePopupAd, homepagePopupSlotId,
      showProductInterstitialAd, productInterstitialSlotId
    };

    try {
      const res = await fetch(`/api/ads?password=${passwordQuery}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settingsToSave),
      });
      if (!res.ok) throw new Error('Failed to save settings.');
      setMessage('Ads settings saved successfully!');
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-6">
      
      {/* --- ہیڈر مع بیل آئیکن --- */}
      <header className="flex items-center justify-between p-4 bg-white border-b -mx-4 -mt-4 shadow-sm sticky top-0 z-10">
         <h1 className="text-xl font-bold text-gray-800">Ads Manager</h1>
         
         {/* Bell Icon */}
         <button 
           type="button"
           onClick={() => setShowWithdrawals(true)}
           className="relative p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
         >
           <IconBell />
           {pendingRequestsCount > 0 && (
             <span className="absolute top-0 right-0 flex h-4 w-4">
               <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
               <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 text-[10px] text-white justify-center items-center">
                 {pendingRequestsCount}
               </span>
             </span>
           )}
         </button>
      </header>
      
      {/* --- 1. Visitor Stats --- */}
      <VisitorStats today={todayVisitors} total={totalVisitors} />

      {/* --- 2. فنڈ ٹرانسفر (Earning Input) --- */}
      <div className="p-5 bg-gradient-to-r from-green-50 to-white border border-green-200 rounded-xl shadow-sm">
        <h2 className="text-lg font-bold text-green-800 mb-2">Admin Funds</h2>
        <div>
          <label className="block text-sm font-medium text-green-700 mb-1">Send Fund to Admin Panel ($)</label>
          <input
            type="number"
            step="0.01"
            value={earning}
            onChange={(e) => setEarning(e.target.value)}
            placeholder="0.00"
            className="w-full px-4 py-2 text-lg font-bold text-green-800 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500"
          />
          <p className="text-xs text-green-600 mt-1">This amount will appear on the Admin Panel header.</p>
        </div>
      </div>

      {/* --- 3. Google Snippets --- */}
      <div className="p-4 bg-white rounded-lg shadow-sm border">
        <h2 className="text-lg font-semibold mb-3">Google Config</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">AdSense Client ID</label>
            <input
              type="text"
              value={adsenseClientId}
              onChange={(e) => setAdsenseClientId(e.target.value)}
              placeholder="ca-pub-xxxxxxxxxxxxxxxx"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            />
          </div>
          {/* Google Verification Code field removed as requested/not needed */}
        </div>
      </div>

      {/* --- 4. Ad Management --- */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold mb-2">Ad Units Control</h2>
        
        <ToggleSwitch 
          label="Master: Enable All Ads"
          isEnabled={masterAdsEnabled}
          onToggle={() => setMasterAdsEnabled(!masterAdsEnabled)}
        />
        <hr className="border-gray-200"/>
        
        <ToggleSwitch 
          label="Home: Banner Ad"
          isEnabled={showHomepageBannerAd}
          onToggle={() => setShowHomepageBannerAd(!showHomepageBannerAd)}
        />
        <AdSlotInput label="Slot ID:" value={homepageBannerSlotId} onChange={(e) => setHomepageBannerSlotId(e.target.value)} />
        
        <ToggleSwitch 
          label="Home: In-Feed Ads"
          isEnabled={showHomepageInFeedAds}
          onToggle={() => setShowHomepageInFeedAds(!showHomepageInFeedAds)}
        />
        <AdSlotInput label="Slot ID:" value={homepageInFeedSlotId} onChange={(e) => setHomepageInFeedSlotId(e.target.value)} />

        <ToggleSwitch 
          label="Home: Popup Ad"
          isEnabled={showHomepagePopupAd}
          onToggle={() => setShowHomepagePopupAd(!showHomepagePopupAd)}
        />
        <AdSlotInput label="Slot ID:" value={homepagePopupSlotId} onChange={(e) => setHomepagePopupSlotId(e.target.value)} />

        <ToggleSwitch 
          label="Product: Interstitial Ad"
          isEnabled={showProductInterstitialAd}
          onToggle={() => setShowProductInterstitialAd(!showProductInterstitialAd)}
        />
        <AdSlotInput label="Slot ID:" value={productInterstitialSlotId} onChange={(e) => setProductInterstitialSlotId(e.target.value)} />
      </div>

      {/* --- Save Button --- */}
      <div className="pt-4">
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3.5 px-4 border border-transparent rounded-xl shadow-md text-lg font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 transition-all"
        >
          {isLoading ? 'Saving Changes...' : 'Save All Settings'}
        </button>
        {message && (
          <div className={`mt-4 p-3 rounded-lg text-center text-sm font-medium ${message.startsWith('Error') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
            {message}
          </div>
        )}
      </div>

      {/* --- Withdrawals Modal --- */}
      {showWithdrawals && (
        <WithdrawalsModal 
          requests={initialWithdrawals} 
          onClose={() => setShowWithdrawals(false)} 
        />
      )}

    </form>
  );
}
