// app/ads/AdsPanelClient.js

"use client";

import { useState, useEffect } from 'react';

// ایک کسٹم ٹوگل سوئچ کمپوننٹ
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

export default function AdsPanelClient({ initialSettings, passwordQuery }) {
  
  // تمام فیلڈز کے لیے اسٹیٹ
  const [googleSiteVerification, setGoogleSiteVerification] = useState('');
  const [adsenseClientId, setAdsenseClientId] = useState('');
  const [masterAdsEnabled, setMasterAdsEnabled] = useState(false);
  const [showHomepageBannerAd, setShowHomepageBannerAd] = useState(false);
  const [showHomepageInFeedAds, setShowHomepageInFeedAds] = useState(false);
  const [showHomepagePopupAd, setShowHomepagePopupAd] = useState(false);
  const [showProductInterstitialAd, setShowProductInterstitialAd] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  // سرور سے آئی سیٹنگز کو اسٹیٹ میں ڈالنا
  useEffect(() => {
    setGoogleSiteVerification(initialSettings.googleSiteVerification || '');
    setAdsenseClientId(initialSettings.adsenseClientId || '');
    setMasterAdsEnabled(initialSettings.masterAdsEnabled || false);
    setShowHomepageBannerAd(initialSettings.showHomepageBannerAd || false);
    setShowHomepageInFeedAds(initialSettings.showHomepageInFeedAds || false);
    setShowHomepagePopupAd(initialSettings.showHomepagePopupAd || false);
    setShowProductInterstitialAd(initialSettings.showProductInterstitialAd || false);
  }, [initialSettings]);

  // سیو کرنے کا فنکشن
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('Saving...');

    const settingsToSave = {
      googleSiteVerification,
      adsenseClientId,
      masterAdsEnabled,
      showHomepageBannerAd,
      showHomepageInFeedAds,
      showHomepagePopupAd,
      showProductInterstitialAd
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
              placeholder="Paste your verification code here"
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
              placeholder="ca-pub-1234567890"
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
        <ToggleSwitch 
          label="Home: Ad below Banner"
          isEnabled={showHomepageBannerAd}
          onToggle={() => setShowHomepageBannerAd(!showHomepageBannerAd)}
        />
        <ToggleSwitch 
          label="Home: Ads in Product Feed"
          isEnabled={showHomepageInFeedAds}
          onToggle={() => setShowHomepageInFeedAds(!showHomepageInFeedAds)}
        />
        <ToggleSwitch 
          label="Home: Top-Right Popup Ad"
          isEnabled={showHomepagePopupAd}
          onToggle={() => setShowHomepagePopupAd(!showHomepagePopupAd)}
        />
        <ToggleSwitch 
          label="Product Page: Interstitial Ad"
          isEnabled={showProductInterstitialAd}
          onToggle={() => setShowProductInterstitialAd(!showProductInterstitialAd)}
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
                
