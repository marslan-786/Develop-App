"use client";

import { useState, useEffect } from 'react';

// --- Icons ---
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
function IconPlus() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
  );
}


// --- Toggle and Input Components ---
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
      <input type="text" value={value} onChange={onChange} placeholder="e.g., 4c0336286f80f3898e1d34f70c813597" className="mt-1 block w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md shadow-sm" />
    </div>
  );
}

function VisitorStats({ today, total }) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg shadow-sm text-center">
        {/* ✅ English Label */}
        <div className="text-sm font-medium text-blue-600">Today's Visitors</div>
        <div className="text-3xl font-bold text-blue-900">{today}</div>
      </div>
      <div className="p-4 bg-green-50 border border-green-200 rounded-lg shadow-sm text-center">
        {/* ✅ English Label */}
        <div className="text-sm font-medium text-green-600">Total Visitors</div>
        <div className="text-3xl font-bold text-green-900">{total}</div>
      </div>
    </div>
  );
}

// --- WithdrawalsModal Component ---
function WithdrawalsModal({ requests, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white w-full max-w-md rounded-xl shadow-2xl overflow-hidden max-h-[80vh] flex flex-col">
        <div className="p-4 border-b flex justify-between items-center bg-gray-50">
          {/* ✅ English Label */}
          <h2 className="font-bold text-lg text-gray-800">Withdrawal Requests</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded-full"><IconClose /></button>
        </div>
        
        <div className="overflow-y-auto p-4 space-y-3">
          {requests.length === 0 ? (
            // ✅ English Label
            <p className="text-center text-gray-500 py-10">No pending requests.</p>
          ) : (
            requests.map((req) => (
              <div key={req.id} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                <div className="flex justify-between mb-2">
                  <span className="font-bold text-lg text-blue-600">${req.amount}</span>
                  <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">{req.status}</span>
                </div>
                <div className="text-sm space-y-1 text-gray-700">
                  {/* ✅ English Labels */}
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
  const [adsenseClientId, setAdsenseClientId] = useState('');
  const [masterAdsEnabled, setMasterAdsEnabled] = useState(false);
  const [earning, setEarning] = useState('');

  const [showHomepageBannerAd, setShowHomepageBannerAd] = useState(false);
  const [homepageBannerAdKey, setHomepageBannerAdKey] = useState(''); 
  
  const [showHomepagePopupAd, setShowHomepagePopupAd] = useState(false);
  const [homepagePopupAdKey, setHomepagePopupAdKey] = useState(''); 
  
  const [showProductInterstitialAd, setShowProductInterstitialAd] = useState(false);
  const [productInterstitialAdKey, setProductInterstitialAdKey] = useState(''); 
  
  const [showHomepageInFeedAds, setShowHomepageInFeedAds] = useState(false);
  const [homepageInFeedAdKeys, setHomepageInFeedAdKeys] = useState(['']); // Start with one empty input

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  
  const [showWithdrawals, setShowWithdrawals] = useState(false); // Modal State

  // --- Effects ---
  useEffect(() => {
    setAdsenseClientId(initialSettings.adsenseClientId || '');
    setMasterAdsEnabled(initialSettings.masterAdsEnabled || false);
    setEarning(initialSettings.earning || ''); 

    setShowHomepageBannerAd(initialSettings.showHomepageBannerAd || false);
    setHomepageBannerAdKey(initialSettings.homepageBannerAdKey || '');
    
    setShowHomepagePopupAd(initialSettings.showHomepagePopupAd || false);
    setHomepagePopupAdKey(initialSettings.homepagePopupAdKey || '');
    
    setShowProductInterstitialAd(initialSettings.showProductInterstitialAd || false);
    setProductInterstitialAdKey(initialSettings.productInterstitialAdKey || '');

    setShowHomepageInFeedAds(initialSettings.showHomepageInFeedAds || false);
    setHomepageInFeedAdKeys(
      initialSettings.homepageInFeedAdKeys?.length > 0 
        ? initialSettings.homepageInFeedAdKeys 
        : [''] // If empty, show one input
    );
    
  }, [initialSettings]);

  // --- Count pending requests ---
  const pendingRequestsCount = initialWithdrawals.filter(req => req.status === 'Pending').length;

  // --- Helper functions for In-Feed Keys ---
  
  // To change a key in the array
  const handleInFeedKeyChange = (index, value) => {
    const newKeys = [...homepageInFeedAdKeys];
    newKeys[index] = value;
    setHomepageInFeedAdKeys(newKeys);
  };

  // To add a new input
  const addInFeedKey = () => {
    setHomepageInFeedAdKeys([...homepageInFeedAdKeys, '']);
  };

  // To remove an input
  const removeInFeedKey = (indexToRemove) => {
    if (homepageInFeedAdKeys.length > 1) {
      setHomepageInFeedAdKeys(homepageInFeedAdKeys.filter((_, index) => index !== indexToRemove));
    } else {
      setHomepageInFeedAdKeys(['']); // Just clear the last one
    }
  };

  // --- Save Function ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    // ✅ English Message
    setMessage('Saving settings...');
    
    const settingsToSave = {
      adsenseClientId, masterAdsEnabled, earning, 
      showHomepageBannerAd, homepageBannerAdKey,
      showHomepagePopupAd, homepagePopupAdKey,
      showProductInterstitialAd, productInterstitialAdKey,
      showHomepageInFeedAds,
      // Filter out empty keys before saving
      homepageInFeedAdKeys: homepageInFeedAdKeys.filter(key => key.trim() !== ''),
    };

    try {
      const res = await fetch(`/api/ads?password=${passwordQuery}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settingsToSave),
      });
      // ✅ English Message
      if (!res.ok) throw new Error('Failed to save settings.');
      // ✅ English Message
      setMessage('Ad settings saved successfully!');
    } catch (error) {
      // ✅ English Message
      setMessage(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-6">
      
      {/* --- Header with Bell Icon --- */}
      <header className="flex items-center justify-between p-4 bg-white border-b -mx-4 -mt-4 shadow-sm sticky top-0 z-10">
         {/* ✅ English Label */}
         <h1 className="text-xl font-bold text-gray-800">Ads Manager</h1>
         
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

      {/* --- 2. Fund Transfer (Earning Input) --- */}
      <div className="p-5 bg-gradient-to-r from-green-50 to-white border border-green-200 rounded-xl shadow-sm">
        {/* ✅ English Labels */}
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

      {/* --- 3. Google Config --- */}
      <div className="p-4 bg-white rounded-lg shadow-sm border">
        {/* ✅ English Labels */}
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
        </div>
      </div>

      {/* --- 4. Ad Units Control --- */}
      <div className="space-y-3">
        {/* ✅ English Labels */}
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
        <AdSlotInput label="Ad Key:" value={homepageBannerAdKey} onChange={(e) => setHomepageBannerAdKey(e.target.value)} />
        
        
        {/* --- In-Feed Ads Section --- */}
        <ToggleSwitch 
          label="Home: In-Feed Ads"
          isEnabled={showHomepageInFeedAds}
          onToggle={() => setShowHomepageInFeedAds(!showHomepageInFeedAds)}
        />
        <div className="pl-4 pr-4 pb-3 -mt-2 bg-white rounded-b-lg border-b border-l border-r space-y-2">
          {homepageInFeedAdKeys.map((key, index) => (
            <div key={index} className="flex items-center space-x-2">
              <input 
                type="text" 
                value={key} 
                onChange={(e) => handleInFeedKeyChange(index, e.target.value)} 
                // ✅ English Placeholder
                placeholder={`Ad Key #${index + 1}`}
                className="mt-1 block w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md shadow-sm" 
              />
              <button
                type="button"
                onClick={() => removeInFeedKey(index)}
                className="p-1.5 text-red-500 hover:bg-red-100 rounded-full"
              >
                <IconClose />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addInFeedKey}
            className="mt-2 flex items-center space-x-1 px-3 py-1.5 text-sm text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100"
          >
            <IconPlus />
            {/* ✅ English Label */}
            <span>Add New Key</span>
          </button>
        </div>
        {/* --- End --- */}
        

        <ToggleSwitch 
          label="Home: Popup Ad"
          isEnabled={showHomepagePopupAd}
          onToggle={() => setShowHomepagePopupAd(!showHomepagePopupAd)}
        />
        <AdSlotInput label="Ad Key:" value={homepagePopupAdKey} onChange={(e) => setHomepagePopupAdKey(e.target.value)} />

        <ToggleSwitch 
          label="Product: Interstitial Ad"
          isEnabled={showProductInterstitialAd}
          onToggle={() => setShowProductInterstitialAd(!showProductInterstitialAd)}
        />
        <AdSlotInput label="Ad Key:" value={productInterstitialAdKey} onChange={(e) => setProductInterstitialAdKey(e.target.value)} />
      </div>

      {/* --- Save Button --- */}
      <div className="pt-4">
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3.5 px-4 border border-transparent rounded-xl shadow-md text-lg font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 transition-all"
        >
          {/* ✅ English Labels */}
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
