"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function WithdrawPageClient({ earning, passwordQuery }) {
  const router = useRouter();
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('EasyPaisa');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountTitle, setAccountTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const withdrawAmount = parseFloat(amount);
    const currentBalance = parseFloat(earning);

    // --- 1. بیلنس چیک ---
    if (withdrawAmount > currentBalance) {
      setMessage('Error: Insufficient balance.');
      return;
    }

    // --- 2. منیمم 30 ڈالر کی شرط ---
    if (withdrawAmount < 30) {
      setMessage('Error: Minimum withdrawal amount is $30.');
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      // --- 3. API کو کال کریں ---
      const res = await fetch(`/api/withdraw?password=${passwordQuery}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            amount: withdrawAmount,
            method,
            accountNumber,
            accountTitle
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit request.');
      }

      // کامیابی!
      setMessage('Success: Withdrawal request submitted! View status in Ads Panel.');
      setAmount('');
      setAccountNumber('');
      setAccountTitle('');
      
      // تھوڑی دیر بعد ایڈمن پیج پر واپس لے جائیں (آپشنل)
      // setTimeout(() => router.push(`/admin?password=${passwordQuery}`), 3000);

    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
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
            placeholder="Minimum $30"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
            min="30" // HTML لیول پر بھی روک دیا
          />
          <p className="text-xs text-gray-500 mt-1">Minimum withdrawal limit: $30</p>
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
