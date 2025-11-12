"use client";

import { useState } from 'react';

export default function WithdrawPageClient({ earning, passwordQuery }) {
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('EasyPaisa');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountTitle, setAccountTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (parseFloat(amount) > parseFloat(earning)) {
      setMessage('Error: Insufficient balance.');
      return;
    }

    setIsLoading(true);
    setMessage('');

    // ابھی کے لیے ہم صرف ایک کامیابی کا میسج دکھائیں گے
    // بعد میں آپ یہاں API کال لگا سکتے ہیں جو ایڈمن کو ای میل بھیجے یا ڈیٹا بیس میں ریکویسٹ سیو کرے
    setTimeout(() => {
        setIsLoading(false);
        setMessage('Withdraw request submitted successfully! Allow 24-48 hours.');
        setAmount('');
    }, 1500);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-6 bg-gradient-to-br from-blue-600 to-blue-700 text-white text-center">
        <p className="text-sm font-medium opacity-90 uppercase tracking-wider">Available Balance</p>
        <h2 className="text-4xl font-bold mt-2">${earning}</h2>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-5">
        
        {message && (
          <div className={`p-3 rounded-lg text-sm ${message.startsWith('Error') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
            {message}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Withdraw Amount ($)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
            min="1"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="EasyPaisa">EasyPaisa</option>
            <option value="JazzCash">JazzCash</option>
            <option value="BankTransfer">Bank Transfer</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
          <input
            type="text"
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
            placeholder="0300xxxxxxx"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Account Title</label>
          <input
            type="text"
            value={accountTitle}
            onChange={(e) => setAccountTitle(e.target.value)}
            placeholder="Enter account holder name"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-md transition-colors disabled:bg-blue-400"
        >
          {isLoading ? 'Processing...' : 'Submit Request'}
        </button>

      </form>
    </div>
  );
}
