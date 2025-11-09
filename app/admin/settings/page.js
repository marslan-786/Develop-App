"use client";

import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

// بیک (Back) آئیکن
function IconArrowLeft() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
    </svg>
  );
}

export default function SettingsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const passwordQuery = searchParams.get('password');

  // فارم فیلڈز کے لیے اسٹیٹ
  const [websiteTitle, setWebsiteTitle] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [logoFile, setLogoFile] = useState(null);
  // --- یہ ہے حل 3: واٹس ایپ نمبر کے لیے اسٹیٹ ---
  const [whatsappNumber, setWhatsappNumber] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  // فارم جمع کروانے کا فنکشن
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      // 1. لوگو اپ لوڈ (اگر موجود ہو)
      if (logoFile) {
        const uploadRes = await fetch(
          `/api/upload?filename=logo.png&password=${passwordQuery}`,
          { method: 'POST', body: logoFile }
        );
        if (!uploadRes.ok) throw new Error('Logo upload failed');
      }

      // 2. ٹائٹل، پاس ورڈ، یا واٹس ایپ نمبر اپ ڈیٹ کریں
      if (websiteTitle || newPassword || whatsappNumber) {
        const settingsRes = await fetch(
          `/api/settings?password=${passwordQuery}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            // --- یہ ہے حل 4: واٹس ایپ نمبر کو API کو بھیجیں ---
            body: JSON.stringify({ websiteTitle, newPassword, whatsappNumber }),
          }
        );
        if (!settingsRes.ok) throw new Error('Settings save failed');
      }
      
      setMessage('Settings saved successfully!');
      // تمام فیلڈز کو خالی کریں
      setWebsiteTitle('');
      setNewPassword('');
      setWhatsappNumber(''); // <-- حل 5
      setLogoFile(null);
      e.target.reset(); // فائل ان پٹ کو ری سیٹ کریں
      
      router.refresh(); 

    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 min-h-screen bg-gray-50">
      {/* ہیڈر کے ساتھ بیک بٹن */}
      <header className="flex items-center gap-4 mb-6">
        <button 
          onClick={() => router.back()} 
          className="p-2 rounded-full hover:bg-gray-200"
        >
          <IconArrowLeft />
        </button>
        <h1 className="text-xl font-bold">Admin Settings</h1>
      </header>

      {/* سیٹنگز فارم */}
      <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto">
        
        {/* 1. چینج لوگو */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Change Website Logo</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setLogoFile(e.target.files[0])}
            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          <p className="text-xs text-gray-500 mt-1">Accepts JPG, PNG, etc. Uploading will replace 'logo.png'.</p>
        </div>

        {/* 2. چینج ٹائٹل */}
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

        {/* --- یہ ہے حل 6: واٹس ایپ نمبر ان پٹ فیلڈ --- */}
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
        {/* --- حل ختم --- */}

        {/* 3. چینج ایڈمن پاس ورڈ */}
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
            // --- حل 7: بٹن کی 'disabled' لاجک کو اپ ڈیٹ کریں ---
            disabled={isLoading || (!websiteTitle && !newPassword && !logoFile && !whatsappNumber)}
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
