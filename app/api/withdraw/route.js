import { put, head } from '@vercel/blob';
import { NextResponse } from 'next/server';
import { isValidPassword } from '../../../lib/auth.js';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  const { searchParams } = new URL(request.url);
  const password = searchParams.get('password');

  // 1. پاس ورڈ چیک کریں
  if (!(await isValidPassword(password))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { amount, method, accountNumber, accountTitle } = await request.json();

    // 2. منیمم 30 ڈالر سرور پر بھی چیک کریں (حفاظت کے لیے)
    if (parseFloat(amount) < 30) {
        return NextResponse.json({ error: 'Minimum withdrawal amount is $30.' }, { status: 400 });
    }

    // 3. پرانی ریکویسٹس لوڈ کریں
    let withdrawals = [];
    try {
      const blob = await head('withdrawals.json', { cache: 'no-store' });
      const response = await fetch(blob.url, { cache: 'no-store' });
      if (response.ok) {
        const text = await response.text();
        if (text) withdrawals = JSON.parse(text);
      }
    } catch (e) { 
        // اگر فائل نہیں ہے تو نئی لسٹ شروع کریں
    }

    // 4. نئی ریکویسٹ تیار کریں
    const newRequest = {
        id: Date.now().toString(), // منفرد آئی ڈی
        amount: parseFloat(amount),
        method,
        accountNumber,
        accountTitle,
        status: 'Pending', // ابھی یہ پینڈنگ ہے
        date: new Date().toLocaleString('sv-SE', { timeZone: 'Asia/Karachi' })
    };

    // 5. لسٹ میں شامل کریں (نئی سب سے اوپر)
    withdrawals.unshift(newRequest);

    // 6. واپس Blob پر سیو کریں
    await put('withdrawals.json', JSON.stringify(withdrawals, null, 2), {
      access: 'public',
      addRandomSuffix: false,
    });

    return NextResponse.json({ success: true, message: 'Request submitted successfully!' });

  } catch (error) {
    console.error('Withdraw Error:', error);
    return NextResponse.json(
      { error: 'Failed to submit request.', message: error.message },
      { status: 500 }
    );
  }
}
