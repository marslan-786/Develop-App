"use client";

import { useState, useRef } from 'react'; // <-- 'useRef' کو امپورٹ کریں
import { useSearchParams, useRouter } from 'next/navigation';

// --- Icon Components ---
function IconArrowLeft() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
    </svg>
  );
}

// --- نیا: ڈریگ اینڈ ڈراپ اپ لوڈر کمپوننٹ ---
function FileUploader({ title, onFileSelect }) {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null); // <-- فائل ان پٹ کو ریفرنس کرنے کے لیے

  // فائل سلیکٹ ہونے پر
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onFileSelect(file);
    }
  };

  // ڈریگ ایونٹس
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };
  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      onFileSelect(file);
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">{title}</label>
      <div
        className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 
          ${isDragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300 border-dashed'} 
          rounded-md transition-all`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current.click()} // <-- ڈو پر کلک کرنے سے ان پٹ کھلے گا
      >
        <div className="space-y-1 text-center">
          {/* کیمرہ آئیکن */}
          <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
          </svg>
          <div className="flex text-sm text-gray-600">
            <span className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
              Upload a file
            </span>
            <input 
              ref={fileInputRef} // <-- ریفرنس سیٹ کریں
              onChange={handleFileChange}
              id={title.replace(/\s+/g, '-')} 
              name={title.replace(/\s+/g, '-')} 
              type="file" 
              className="sr-only" // <-- اصل ان پٹ کو چھپائیں
              accept="image/*" 
              capture="environment" // <-- یہ موبائل پر کیمرہ اور فائل دونوں آپشن دے گا
            />
            <p className="pl-1">or drag and drop</p>
          </div>
          <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
        </div>
      </div>
    </div>
  );
}
// --- (اپ لوڈر ختم) ---


export default function SettingsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const passwordQuery = searchParams.get('password');

  // فارم فیلڈز
  const [websiteTitle, setWebsiteTitle] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  
  // --- یہ ہے حل 1: بینر فائل کے لیے اسٹیٹ ---
  const [logoFile, setLogoFile] = useState(null);
  const [bannerFile, setBannerFile] = useState(null); // <-- بینر فائل
  // --- حل ختم ---
  
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  // فارم جمع کروانے کا فنکشن
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    
    // چیک کریں کہ کم از کم ایک فیلڈ بھری ہو
    if (!websiteTitle && !newPassword && !whatsappNumber && !logoFile && !bannerFile) {
      setMessage('Error: No changes detected.');
      setIsLoading(false);
      return;
    }

    try {
      // 1. لوگو اپ لوڈ (اگر موجود ہو)
      if (logoFile) {
        const uploadRes = await fetch(
          `/api/upload?filename=logo.png&password=${passwordQuery}`,
          { method: 'POST', body: logoFile }
        );
        if (!uploadRes.ok) throw new Error('Logo upload failed');
      }

      // --- یہ ہے حل 1 (جاری): بینر اپ لوڈ ---
      // 2. بینر اپ لوڈ (اگر موجود ہو)
      if (bannerFile) {
        const uploadRes = await fetch(
          `/api/upload?filename=background.png&password=${passwordQuery}`, // <-- فائل کا نام 'background.png'
          { method: 'POST', body: bannerFile }
        );
        if (!uploadRes.ok) throw new Error('Banner upload failed');
      }
      // --- حل ختم ---

      // 3. ٹائٹل، پاس ورڈ، یا واٹس ایپ نمبر اپ ڈیٹ کریں
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
      // تمام فیلڈز کو خالی کریں
      setWebsiteTitle('');
      setNewPassword('');
      setWhatsappNumber('');
      setLogoFile(null);
      setBannerFile(null); // <-- بینر اسٹیٹ کو ری سیٹ کریں
      
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
        
        {/* --- یہ ہے حل 2: ڈریگ اینڈ ڈراپ اپ لوڈرز --- */}
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
        {/* --- حل ختم --- */}


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

        {/* 3. واٹس ایپ نمبر */}
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

        {/* 4. چینج ایڈمن پاس ورڈ */}
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
