// app/api/ads/route.js

import { put, head } from '@vercel/blob';
import { NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { isValidAdsPassword } from '../../../lib/ads-auth.js'; // <-- نیا آتھ استعمال کریں

export const dynamic = 'force-dynamic';

export async function POST(request) {
  const { searchParams } = new URL(request.url);
  const password = searchParams.get('password');

  // 1. ایڈ پینل کے پاس ورڈ سے چیک کریں
  if (!(await isValidAdsPassword(password))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const newSettings = await request.json();
    let oldSettings = {};
    try {
      const blob = await head('ads.json', { cache: 'no-store' });
      const response = await fetch(blob.url, { cache: 'no-store' });
      if (response.ok) {
        const text = await response.text();
        if (text) oldSettings = JSON.parse(text);
      }
    } catch (e) { /* فائل نہیں ہے تو کوئی بات نہیں */ }

    // 2. نئی اور پرانی سیٹنگز کو مکس کریں
    const updatedSettings = { ...oldSettings, ...newSettings };

    // 3. 'ads.json' فائل کو اپ ڈیٹ کریں
    await put('ads.json', JSON.stringify(updatedSettings, null, 2), {
      access: 'public',
      addRandomSuffix: false,
    });

    // 4. مین ویب سائٹ کو سگنل بھیجیں
    revalidateTag('ads');

    return NextResponse.json({ success: true, message: 'Ad settings saved!' });

  } catch (error) {
    console.error('Error saving ad settings:', error);
    return NextResponse.json(
      { error: 'Failed to save ad settings.', message: error.message },
      { status: 500 }
    );
  }
}
