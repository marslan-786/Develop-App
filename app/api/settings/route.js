import { put, head } from '@vercel/blob';
import { NextResponse } from 'next/server';
import { isValidPassword } from '../../../lib/auth.js'; // ہمارے auth فنکشن کو امپورٹ کریں

export const dynamic = 'force-dynamic';

export async function POST(request) {
  const { searchParams } = new URL(request.url);
  const password = searchParams.get('password'); // پاس ورڈ کو URL سے پڑھیں

  // 1. سیکیورٹی چیک
  if (!(await isValidPassword(password))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // 2. نئی سیٹنگز کو JSON باڈی سے پڑھیں
  const { websiteTitle, newPassword } = await request.json();

  try {
    // 3. ویب سائٹ کا ٹائٹل اپ ڈیٹ کریں
    if (websiteTitle) {
      let settings = {};
      try {
        // پرانی سیٹنگز پڑھیں (اگر موجود ہیں)
        const settingsBlob = await head('settings.json');
        const settingsRes = await fetch(settingsBlob.url);
        if (settingsRes.ok) settings = await settingsRes.json();
      } catch (e) { /* اگر فائل نہیں ہے تو کوئی بات نہیں */ }
      
      // ٹائٹل کو اپ ڈیٹ کریں
      settings.websiteTitle = websiteTitle;
      
      // نئی settings.json فائل کو Blob پر اوور رائٹ کریں
      await put('settings.json', JSON.stringify(settings), {
        access: 'public',
        contentType: 'application/json',
      });
    }

    // 4. نیا ایڈمن پاس ورڈ اپ ڈیٹ کریں
    if (newPassword) {
      const passwordData = { password: newPassword };
      
      // نئی password.json فائل کو Blob پر اوور رائٹ کریں
      await put('password.json', JSON.stringify(passwordData), {
        access: 'public',
        contentType: 'application/json',
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
