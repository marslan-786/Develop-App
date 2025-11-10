"use client";

import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import FileUploader from './FileUploader.js'; // <-- نیا امپورٹ

// بیک (Back) آئیکن
function IconArrowLeft() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
    </svg>
  );
}

// --- 'FileUploader' کمپوننٹ یہاں سے ہٹا دیا گیا ہے ---

export default function SettingsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const passwordQuery = searchParams.get('password');

  const [websiteTitle, setWebsiteTitle] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [logoFile, setLogoFile] = useState(null);
  const [bannerFile, setBannerFile] = useState(null); 
  
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  // 'handleSubmit' فنکشن بالکل ویسا ہی رہے گا
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    
    if (!websiteTitle && !newPassword && !whatsappNumber && !logoFile && !bannerFile) {
      setMessage('Error: No changes detected.');
      setIsLoading(false);
      return;
    }

    try {
      if (logoFile) {
        const uploadRes = await fetch(
          `/api/upload?filename=logo.png&password=${passwordQuery}`,
          { method: 'POST', body: logoFile }
        );
        if (!uploadRes.ok) throw new Error('Logo upload failed');
      }

      if (bannerFile) {
        const uploadRes = await fetch(
          `/api/upload?filename=background.png&password=${passwordQuery}`, 
          { method: 'POST', body: bannerFile }
        );
        if (!uploadRes.ok) throw new Error('Banner upload failed');
      }

      if (websiteTitle || newPassword || whatsappNumber) {
        const settingsRes = await fetch(
          `/api/settings?password=${passwordQuery}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ websiteTitle, newPassword, whatsappNumber }),
          }
        );
        if (!settingsRes.ok) throw new Error('Settings save failed');
      }
      
      setMessage('Settings saved successfully!');
      setWebsiteTitle('');
      setNewPassword('');
      setWhatsappNumber('');
      setLogoFile(null);
      setBannerFile(null); 
      
      router.refresh(); 

    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 min-h-screen bg-gray-50">
      <header className="flex items-center gap-4 mb-6">
        <button 
          onClick={() => router.back()} 
          className="p-2 rounded-full hover:bg-gray-200"
        >
          <IconArrowLeft />
        </button>
        <h1 className="text-xl font-bold">Admin Settings</h1>
      </header>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto">
        
        {/* --- ڈریگ اینڈ ڈراپ اپ لوڈرز --- */}
        <FileUploader 
          title="Change Website Logo"
          onFileSelect={(file) => setLogoFile(file)}
        />
        {logoFile && <p className="text-sm text-green-600">Logo selected: {logoFile.name}</p>}

        <FileUploader 
          title="Change Website Banner"
          onFileSelect={(file) => setBannerFile(file)}
        />
        {bannerFile && <p className="text-sm text-green-600">Banner selected: {bannerFile.name}</p>}


        {/* (باقی فارم فیلڈز ویسی ہی رہیں گی) */}
        <div>
          <label htmlFor="websiteTitle" className="block text-sm font-medium text-gray-700">Change Website Title</label>
          <input
            type="text"
            id="websiteTitle"
            value={websiteTitle}
            onChange={(e) => setWebsiteTitle(e.target.value)}
            placeholder="Enter new website title"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          />
        </div>

        <div>
          <label htmlFor="whatsappNumber" className="block text-sm font-medium text-gray-700">
            Change WhatsApp Number
          </label>
          <input
            type="text"
            id="whatsappNumber"
            value={whatsappNumber}
            onChange={(e) => setWhatsappNumber(e.target.value)}
            placeholder="923001234567"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          />
          <p className="text-xs text-gray-500 mt-1">Use country code (e.g., 92) without + or 00.</p>
        </div>

        <div>
          <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">Change Admin Login Password</label>
          <input
            type="password"
            id="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter new admin password"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          />
          <p className="text-xs text-gray-500 mt-1">This will change the login password (password.json).</p>
        </div>

        {/* سیو بٹن */}
        <div>
          <button
            type="submit"
            disabled={isLoading || (!websiteTitle && !newPassword && !logoFile && !bannerFile && !whatsappNumber)}
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400"
          >
            {isLoading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

        {/* میسج ایریا */}
        {message && (
          <p className={`text-sm ${message.startsWith('Error') ? 'text-red-600' : 'text-green-600'}`}>
            {message}
          </p>
        )}
      </form>
    </div>
  );
}
