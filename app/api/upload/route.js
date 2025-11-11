import { put, head } from '@vercel/blob'; // <-- 'head' کو امپورٹ کریں
import { NextResponse } from 'next/server';
import { isValidPassword } from '../../../lib/auth.js';
import { revalidateTag } from 'next/cache'; 

export const dynamic = 'force-dynamic';

export async function POST(request) {
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get('filename');
  const password = searchParams.get('password');

  if (!(await isValidPassword(password))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!filename || !request.body) {
    return NextResponse.json(
      { error: 'Filename and body are required.' },
      { status: 400 }
    );
  }

  try {
    // 1. تصویر اپ لوڈ کریں (یہ پہلے سے تھا)
    const blob = await put(filename, request.body, {
      access: 'public',
      addRandomSuffix: false,
      cacheControlMaxAge: 0 // <-- یہ بہترین ہے
    });

    // --- ✅ نیا کوڈ یہاں سے شروع ---
    
    // 2. پرانی settings.json پڑھیں
    let settings = {};
    try {
      const settingsBlob = await head('settings.json', { cache: 'no-store' });
      const settingsRes = await fetch(settingsBlob.url, { cache: 'no-store' });
      if (settingsRes.ok) {
         const textData = await settingsRes.text();
         if(textData) settings = JSON.parse(textData);
      }
    } catch (e) { /* اگر فائل نہیں ہے تو کوئی بات نہیں */ }

    // 3. صرف متعلقہ ٹائم اسٹیمپ اپ ڈیٹ کریں
    if (filename === 'logo.png') {
      settings.logoLastUpdated = Date.now();
    } else if (filename === 'background.png') {
      settings.bannerLastUpdated = Date.now();
    }

    // 4. اپ ڈیٹ شدہ settings.json کو واپس سیو کریں
    const settingsString = JSON.stringify(settings, null, 2);
    const settingsBlobData = new Blob([settingsString], { type: 'application/json' });
    
    await put('settings.json', settingsBlobData, {
      access: 'public',
      addRandomSuffix: false,
    });
    
    // --- نیا کوڈ ختم ---

    // 5. سگنل بھیجیں
    revalidateTag('settings'); 

    return NextResponse.json(blob);

  } catch (error) {
    console.error('Error uploading to Vercel Blob:', error);
    return NextResponse.json(
      { error: 'Failed to upload file.', message: error.message },
      { status: 500 }
    );
  }
}
