"use client"; // <-- "use client" یہاں فائل کے شروع میں ہے

import { useState } from 'react';

export default function WhatsAppButton({ product, whatsappNumber }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = () => {
    setIsLoading(true);
    const message = `
Hello, I am interested in this mobile phone:
*Model:* ${product.name}
*Condition:* ${product.condition}
*Price:* PKR ${product.price}
*Link:* ${window.location.href}
    `;
    
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    
    window.location.href = whatsappUrl;
  };

  return (
    <button
      onClick={handleClick}
      disabled={isLoading || !whatsappNumber} // اگر نمبر سیٹ نہ ہو تو بٹن ڈس ایبل کریں
      className="w-full py-3 bg-green-500 text-white text-lg font-bold rounded-lg shadow-md hover:bg-green-600 transition-colors disabled:bg-gray-400"
    >
      {isLoading ? 'Redirecting...' : 'Buy on WhatsApp'}
    </button>
  );
}
