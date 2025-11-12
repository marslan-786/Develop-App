// app/ads/AdsPanelClient.js

"use client";

import { useState, useEffect } from 'react';

// --- ٹوگل سوئچ ---
function ToggleSwitch({ label, isEnabled, onToggle }) {
  return (
    <label className="flex items-center justify-between cursor-pointer p-4 bg-white rounded-lg shadow-sm border">
      <span className="font-medium text-gray-700">{label}</span>
      <div
        className={`relative w-11 h-6 rounded-full transition-colors ${
          isEnabled ? 'bg-blue-600' : 'bg-gray-200'
        }`}
      >
        <span
          className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform ${
            isEnabled ? 'transform translate-x-5' : ''
          }`}
        ></span>
      </div>
      <input type="checkbox" className="sr-only" checked={isEnabled} onChange={onToggle} />
    </label>
  );
}

// --- سلاٹ ID ان پٹ ---
function AdSlotInput({ label, value, onChange }) {
  return (
    <div className="pl-4 pr-4 pb-3 -mt-2 bg-white rounded-b-lg border-b border-l border-r">
      <label className="block text-xs font-medium text-gray-500">{label}</label>
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder="e.g., 1234567890"
        className="mt-1 block w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md shadow-sm"
      />
    </div>
  );
}

// --- ✅ 1. نیا وزٹر Stats کمپوننٹ ---
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


export default function AdsPanelClient({ 
  initialSettings, 
  passwordQuery,
  todayVisitors,  // <-- ✅ 2. نئے props وصول کریں
  totalVisitors   // <-- ✅ 2. نئے props وصول کریں
}) {
  
  // (آپ کی تمام پرانی اسٹیٹ ... 'googleSiteVerification', 'adsenseClientId' ... ویسے ہی رہیں گی)
  const [googleSiteVerification, setGoogleSiteVerification] = useState('');
  const [adsenseClientId, setAdsenseClientId] = useState('');
  const [masterAdsEnabled, setMasterAdsEnabled] = useState(false);
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

  // (useEffect ... ویسا ہی رہے گا)
  useEffect(() => {
    setGoogleSiteVerification(initialSettings.googleSiteVerification || '');
    setAdsenseClientId(initialSettings.adsenseClientId || '');
    setMasterAdsEnabled(initialSettings.masterAdsEnabled || false);
    setShowHomepageBannerAd(initialSettings.showHomepageBannerAd || false);
    setHomepageBannerSlotId(initialSettings.homepageBannerSlotId || '');
    setShowHomepageInFeedAds(initialSettings.showHomepageInFeedAds || false);
    setHomepageInFeedSlotId(initialSettings.homepageInFeedSlotId || '');
    setShowHomepagePopupAd(initialSettings.showHomepagePopupAd || false);
    setHomepagePopupSlotId(initialSettings.homepagePopupSlotId || '');
    setShowProductInterstitialAd(initialSettings.showProductInterstitialAd || false);
    setProductInterstitialSlotId(initialSettings.productInterstitialSlotId || '');
  }, [initialSettings]);

  // (handleSubmit ... ویسا ہی رہے گا)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('Saving...');
    const settingsToSave = {
      googleSiteVerification, adsenseClientId, masterAdsEnabled,
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
      
      <header className="p-4 bg-white border-b -mx-4 -mt-4">
         <h1 className="text-xl font-bold text-center">Manage Website Ads</h1>
      </header>
      
      {/* --- ✅ 3. نیا Stats سیکشن --- */}
      <VisitorStats today={todayVisitors} total={totalVisitors} />
      {/* --- --- --- */}

      {/* --- سیکشن 1: گوگل اسنیپ کوڈز --- */}
      <div className="p-4 bg-white rounded-lg shadow-sm border">
        <h2 className="text-lg font-semibold mb-3">Google Snippets</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="verification" className="block text-sm font-medium text-gray-700">
              1. Google Site Verification Code
            </label>
            <input
              type="text"
              id="verification"
              value={googleSiteVerification}
              onChange={(e) => setGoogleSiteVerification(e.target.value)}
              placeholder="(Optional) e.g., ABC123XYZ..."
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <div>
            <label htmlFor="adsenseId" className="block text-sm font-medium text-gray-700">
              2. AdSense Client ID
            </label>
            <input
              type="text"
              id="adsenseId"
              value={adsenseClientId}
              onChange={(e) => setAdsenseClientId(e.target.value)}
              placeholder="e.g., ca-pub-1234567890"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            />
          </div>
        </div>
      </div>

      {/* --- سیکشن 2: ایڈ مینجمنٹ --- */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold mb-2">Ad Management Toggles</h2>
        
        <ToggleSwitch 
          label="Master: Enable All Ads"
          isEnabled={masterAdsEnabled}
          onToggle={() => setMasterAdsEnabled(!masterAdsEnabled)}
        />
        <hr/>
        
        {/* --- ہوم پیج بینر ایڈ --- */}
        <ToggleSwitch 
          label="Home: Ad below Banner"
          isEnabled={showHomepageBannerAd}
          onToggle={() => setShowHomepageBannerAd(!showHomepageBannerAd)}
        />
        <AdSlotInput
          label="Ad Slot ID (Banner):"
          value={homepageBannerSlotId}
          onChange={(e) => setHomepageBannerSlotId(e.target.value)}
        />
        
        {/* --- ہوم پیج ان-فیڈ ایڈ --- */}
        <ToggleSwitch 
          label="Home: Ads in Product Feed"
          isEnabled={showHomepageInFeedAds}
          onToggle={() => setShowHomepageInFeedAds(!showHomepageInFeedAds)}
        />
        <AdSlotInput
          label="Ad Slot ID (In-Feed):"
          value={homepageInFeedSlotId}
          onChange={(e) => setHomepageInFeedSlotId(e.target.value)}
        />

        {/* --- ہوم پیج پوپ اپ ایڈ --- */}
        <ToggleSwitch 
          label="Home: Top-Right Popup Ad"
          isEnabled={showHomepagePopupAd}
          onToggle={() => setShowHomepagePopupAd(!showHomepagePopupAd)}
        />
        <AdSlotInput
          label="Ad Slot ID (Popup):"
          value={homepagePopupSlotId}
          onChange={(e) => setHomepagePopupSlotId(e.target.value)}
        />

        {/* --- پروڈکٹ پیج ایڈ --- */}
        <ToggleSwitch 
          label="Product Page: Interstitial Ad"
          isEnabled={showProductInterstitialAd}
          onToggle={() => setShowProductInterstitialAd(!showProductInterstitialAd)}
        />
        <AdSlotInput
          label="Ad Slot ID (Interstitial):"
          value={productInterstitialSlotId}
          onChange={(e) => setProductInterstitialSlotId(e.target.value)}
        />
      </div>

      {/* --- سیو بٹن --- */}
      <div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-md font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400"
        >
          {isLoading ? 'Saving...' : 'Save Ad Settings'}
        </button>
        {message && (
          <p className={`text-sm mt-3 text-center ${message.startsWith('Error') ? 'text-red-600' : 'text-green-600'}`}>
            {message}
          </p>
        )}
      </div>
    </form>
  );
}
