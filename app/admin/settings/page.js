"use client"; // <-- یہ بہت اہم ہے

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
  const passwordQuery = searchParams.get('password'); // URL سے سیشن پاس ورڈ حاصل کریں

  // فارم فیلڈز کے لیے اسٹیٹ
  const [websiteTitle, setWebsiteTitle] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [logoFile, setLogoFile] = useState(null);
  
  // لوڈنگ اور میسج کے لیے اسٹیٹ
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  // فارم جمع کروانے کا فنکشن
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      let logoUploaded = false;
      // 1. اگر لوگو فائل منتخب کی گئی ہے، تو اسے اپ لوڈ کریں
      if (logoFile) {
        // سیکیورڈ API کو پاس ورڈ کے ساتھ کال کریں
        const uploadRes = await fetch(
          `/api/upload?filename=logo.png&password=${passwordQuery}`,
          {
            method: 'POST',
            body: logoFile,
          }
        );
        if (!uploadRes.ok) throw new Error('Logo upload failed');
        logoUploaded = true;
      }

      // 2. اگر ٹائٹل یا پاس ورڈ تبدیل کیا گیا ہے، تو سیٹنگز API کو کال کریں
      if (websiteTitle || newPassword) {
        const settingsRes = await fetch(
          `/api/settings?password=${passwordQuery}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ websiteTitle, newPassword }),
          }
        );
        if (!settingsRes.ok) throw new Error('Settings save failed');
      }
      
      setMessage('Settings saved successfully!');
      setWebsiteTitle('');
      setNewPassword('');
      setLogoFile(null);
      
      // Vercel کو مجبور کریں کہ وہ پرانا ڈیٹا ریفریش کرے
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
          <label className="block text-sm font-medium text-gray-700">
            Change Website Logo
          </label>
          <input
            type="file"
            accept="image/png"
            onChange={(e) => setLogoFile(e.target.files[0])}
            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          <p className="text-xs text-gray-500 mt-1">Must be a .png file. Uploading will replace 'logo.png'.</p>
        </div>

        {/* 2. چینج ٹائٹل */}
        <div>
          <label htmlFor="websiteTitle" className="block text-sm font-medium text-gray-700">
            Change Website Title
          </label>
          <input
            type="text"
            id="websiteTitle"
            value={websiteTitle}
            onChange={(e) => setWebsiteTitle(e.target.value)}
            placeholder="Enter new website title"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* 3. چینج ایڈمن پاس ورڈ */}
        <div>
          <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
            Change Admin Login Password
          </label>
          <input
            type="password"
            id="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter new admin password"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
          <p className="text-xs text-gray-500 mt-1">This will change the login password (password.json). The Master Password will still work.</p>
        </div>

        {/* سیو بٹن */}
        <div>
          <button
            type="submit"
            disabled={isLoading || (!websiteTitle && !newPassword && !logoFile)}
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400"
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
            
