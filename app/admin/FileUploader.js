"use client";

import { useState, useRef, memo } from 'react';

// --- یہ ہے حل 2: ڈریگ اینڈ ڈراپ کمپوننٹ ---
function FileUploader({ title, onFileSelect }) {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null); 

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onFileSelect(file);
    }
  };

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
        onClick={() => fileInputRef.current.click()} 
      >
        <div className="space-y-1 text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
          </svg>
          <div className="flex text-sm text-gray-600">
            <span className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
              Upload a file
            </span>
            <input 
              ref={fileInputRef} 
              onChange={handleFileChange}
              id={title.replace(/\s+/g, '-')} 
              name={title.replace(/\s+/g, '-')} 
              type="file" 
              className="sr-only" 
              accept="image/*" 
              // --- یہ ہے حل 1: کیمرہ بگ فکس ---
              // 'capture="environment"' کو یہاں سے ہٹا دیا گیا ہے
              // اب یہ ڈیفالٹ (کیمرہ اور فائل) آپشن دکھائے گا
              // --- حل ختم ---
            />
            <p className="pl-1">or drag and drop</p>
          </div>
          <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
        </div>
      </div>
    </div>
  );
}

// 'memo' اس کو غیر ضروری ری-رینڈرنگ سے بچائے گا
export default memo(FileUploader);
