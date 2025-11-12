import { kv } from '@vercel/kv';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    // 1. صارف کا IP حاصل کریں
    // Vercel میں 'x-forwarded-for' ہیڈر سب سے بہتر طریقہ ہے
    let ip = request.headers.get('x-forwarded-for') || request.ip || 'unknown';
    
    // اگر ایک سے زیادہ IP ہوں (جیسے proxy) تو پہلا والا اٹھا لیں
    if (ip.includes(',')) {
      ip = ip.split(',')[0];
    }

    // 2. اگر IP نہیں مل رہا تو کاؤنٹ نہ کریں (جیسے لوکل ہوسٹ)
    if (ip === 'unknown' || ip === '::1' || ip === '127.0.0.1') {
      return NextResponse.json({ message: 'Local/Unknown IP ignored' });
    }

    // 3. KV میں چیک کریں: کیا یہ IP پچھلے 6 گھنٹے میں آیا ہے؟
    const ipKey = `visitor_ip:${ip}`;
    const hasVisited = await kv.get(ipKey);

    if (hasVisited) {
      // اگر پہلے آیا ہے، تو کچھ نہ کریں
      return NextResponse.json({ message: 'Returning visitor (IP matched). Not counting.' });
    }

    // --- نیا وزٹر ---

    // 4. اس IP کو 6 گھنٹے (21600 سیکنڈز) کے لیے لاک کر دیں
    await kv.set(ipKey, 'true', { ex: 21600 });

    // 5. ٹریکرز اپ ڈیٹ کریں
    const today = new Date().toLocaleString('sv-SE', { 
      timeZone: 'Asia/Karachi' 
    }).split(' ')[0]; // YYYY-MM-DD
    
    const dailyKey = `visits:${today}`;

    // ایک ساتھ گنتی بڑھائیں
    await Promise.all([
      kv.incr(dailyKey),           // آج کے وزٹر +1
      kv.incr('total_visitors'),   // ٹوٹل وزٹر +1
      kv.expire(dailyKey, 172800)  // آج کا ریکارڈ 2 دن تک رکھیں
    ]);

    return NextResponse.json({ message: 'New visit counted successfully!' });

  } catch (error) {
    console.error("Tracking Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
