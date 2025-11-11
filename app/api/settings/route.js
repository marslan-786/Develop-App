import { put, head } from '@vercel/blob';
import { NextResponse } from 'next/server';
import { isValidPassword } from '../../../lib/auth.js'; // 3 فولڈر باہر
import { revalidateTag } from 'next/cache'; // <-- 1. اسے امپورٹ کریں

export const dynamic = 'force-dynamic';

export async function POST(request) {
  const { searchParams } = new URL(request.url);
  const password = searchParams.get('password');

  if (!(await isValidPassword(password))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { websiteTitle, newPassword, whatsappNumber } = await request.json();

    let settings = {};
    try {
      // پرانی سیٹنگز پڑھیں
      const settingsBlob = await head('settings.json', { cache: 'no-store' });
      const settingsRes = await fetch(settingsBlob.url, { cache: 'no-store' });
      if (settingsRes.ok) {
         const textData = await settingsRes.text();
         if(textData) settings = JSON.parse(textData);
      }
    } catch (e) { /* اگر فائل نہیں ہے تو کوئی بات نہیں */ }
    
    // سیٹنگز کو اپ ڈیٹ کریں
    if (websiteTitle) {
      settings.websiteTitle = websiteTitle;
    }
    if (whatsappNumber) {
      settings.whatsappNumber = whatsappNumber;
    }

    // 1. اپ ڈیٹ شدہ 'settings' آبجیکٹ سے اسٹرنگ بنائیں
    const settingsString = JSON.stringify(settings, null, 2);
    
    // 2. اس اسٹرنگ سے ایک Blob آبجیکٹ بنائیں
    const settingsBlobData = new Blob([settingsString], { type: 'application/json' });

    // 3. 'put' کمانڈ کو اسٹرنگ کے بجائے Blob آبجیکٹ بھیجیں
    await put('settings.json', settingsBlobData, {
      access: 'public',
      addRandomSuffix: false,
    });
    
    // 4. نیا ایڈمن پاس ورڈ اپ ڈیٹ کریں
    if (newPassword) {
      const passwordData = { password: newPassword };
      const dataBlob = new Blob([JSON.stringify(passwordData)], { type: 'application/json' });
      
      await put('password.json', dataBlob, {
        access: 'public',
        addRandomSuffix: false,
      });
    }

    // --- ✅ تبدیلی یہاں ہے ---
    // 5. 'settings' ٹیگ والی کیش کو کلیئر کریں
    revalidateTag('settings');
    // --- --- ---

    return NextResponse.json({ success: true, message: 'Settings saved!' });

  } catch (error) {
    console.error('Error saving settings:', error);
    return NextResponse.json(
      { error: 'Failed to save settings.', message: error.message },
      { status: 500 }
    );
  }
}
