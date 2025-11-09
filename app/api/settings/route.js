import { put, head } from '@vercel/blob';
import { NextResponse } from 'next/server';
import { isValidPassword } from '../../../lib/auth.js'; // 3 فولڈر باہر

export const dynamic = 'force-dynamic';

export async function POST(request) {
  const { searchParams } = new URL(request.url);
  const password = searchParams.get('password');

  if (!(await isValidPassword(password))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // --- یہ ہے حل 1: 'whatsappNumber' کو یہاں حاصل کریں ---
    const { websiteTitle, newPassword, whatsappNumber } = await request.json();

    let settings = {};
    try {
      // پرانی سیٹنگز پڑھیں (اگر موجود ہیں)
      const settingsBlob = await head('settings.json', { cache: 'no-store' });
      const settingsRes = await fetch(settingsBlob.url, { cache: 'no-store' });
      if (settingsRes.ok) {
         const textData = await settingsRes.text();
         if(textData) settings = JSON.parse(textData);
      }
    } catch (e) { /* اگر فائل نہیں ہے تو کوئی بات نہیں */ }
    
    // 3. ویب سائٹ کا ٹائٹل اپ ڈیٹ کریں
    if (websiteTitle) {
      settings.websiteTitle = websiteTitle;
    }
    
    // --- یہ ہے حل 2: واٹس ایپ نمبر کو اپ ڈیٹ کریں ---
    if (whatsappNumber) {
      settings.whatsappNumber = whatsappNumber;
    }

    // اپ ڈیٹ شدہ 'settings' آبجیکٹ کو Blob پر اوور رائٹ کریں
    await put('settings.json', JSON.stringify(settings, null, 2), {
      access: 'public',
      contentType: 'application/json',
      addRandomSuffix: false,
    });
    
    // 4. نیا ایڈمن پاس ورڈ اپ ڈیٹ کریں (یہ الگ فائل ہے)
    if (newPassword) {
      const passwordData = { password: newPassword };
      const dataBlob = new Blob([JSON.stringify(passwordData)], { type: 'application/json' });
      
      await put('password.json', dataBlob, {
        access: 'public',
        addRandomSuffix: false,
      });
    }

    return NextResponse.json({ success: true, message: 'Settings saved!' });

  } catch (error) {
    console.error('Error saving settings:', error);
    return NextResponse.json(
      { error: 'Failed to save settings.', message: error.message },
      { status: 500 }
    );
  }
}
