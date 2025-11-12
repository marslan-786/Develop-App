// app/api/track-visit/route.js

import { kv } from '@vercel/kv';
import { NextResponse } from 'next/server';

// 6 گھنٹے سیکنڈز میں (KV میں expiry کے لیے)
const SIX_HOURS_IN_SECONDS = 6 * 60 * 60;
// 6 گھنٹے ملی سیکنڈز میں (وقت چیک کرنے کے لیے)
const SIX_HOURS_IN_MS = SIX_HOURS_IN_SECONDS * 1000;

export const dynamic = 'force-dynamic'; // اس بات کو یقینی بناتا ہے کہ یہ ہمیشہ تازہ چلے

export async function POST(request) {
  try {
    // 1. صارف کا IP ایڈریس حاصل کریں (Vercel یہ خود فراہم کرتا ہے)
    const ip = request.ip || 'unknown';

    // اگر IP معلوم نہیں ہے (جیسے لوکل ہوسٹ پر ٹیسٹنگ) تو گنتی نہ کریں
    if (ip === 'unknown' || ip === '127.0.0.1') {
      return NextResponse.json({ message: 'Cannot track local or unknown IP' }, { status: 200 });
    }

    const ipKey = `ip_last_seen:${ip}`;
    const now = Date.now();

    // 2. KV سے چیک کریں کہ اس IP کو آخری بار کب دیکھا گیا تھا
    const lastVisitTimestamp = await kv.get(ipKey);

    // 3. چیک کریں: کیا یہ نیا وزٹ ہے؟
    // (یعنی، اگر کوئی ریکارڈ نہیں ہے، یا ریکارڈ 6 گھنٹے سے پرانا ہے)
    if (!lastVisitTimestamp || (now - lastVisitTimestamp > SIX_HOURS_IN_MS)) {
      
      // --- ہاں، یہ ایک نیا گننے کے قابل وزٹ ہے ---

      // 4. اس IP کے لیے نیا ٹائم اسٹیمپ سیٹ کریں (یہ 6 گھنٹے بعد خود ڈیلیٹ ہو جائے گا)
      await kv.set(ipKey, now, { ex: SIX_HOURS_IN_SECONDS });

      // 5. آج کی اور ٹوٹل گنتی میں 1 جمع کریں
      const today = new Date().toLocaleString('sv-SE', { 
        timeZone: 'Asia/Karachi' 
      }).split(' ')[0]; // 'YYYY-MM-DD'
      
      const dailyVisitsKey = `visits:${today}`;

      // یہ دونوں کام ایک ساتھ چلائیں
      await Promise.all([
        kv.incr(dailyVisitsKey),
        kv.incr('total_visitors'),
        kv.expire(dailyVisitsKey, 60 * 60 * 24 * 2) // روزانہ کا کاؤنٹر 2 دن رکھیں
      ]);

      return NextResponse.json({ message: 'New visit counted' }, { status: 201 });
    }

    // --- نہیں، یہ 6 گھنٹے کے اندر واپس آنے والا وزٹر ہے ---
    return NextResponse.json({ message: 'Returning visitor. Not counting.' }, { status: 200 });

  } catch (error) {
    // اگر KV میں کوئی خرابی ہو
    console.error("KV Error (trackVisit API):", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
