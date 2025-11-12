// app/api/track-visit/route.js

import { kv } from '@vercel/kv';
import { NextResponse } from 'next/server';

// یہ وہی فنکشن ہے جو پہلے page.js میں تھا
async function trackVisit() {
  try {
    const today = new Date().toLocaleString('sv-SE', { 
      timeZone: 'Asia/Karachi' 
    }).split(' ')[0]; // 'YYYY-MM-DD'
    
    const dailyVisitsKey = `visits:${today}`;

    // 1. آج کے وزٹ میں 1 جمع کریں
    await kv.incr(dailyVisitsKey);
    // 2. ٹوٹل وزٹ میں 1 جمع کریں
    await kv.incr('total_visitors');
    
    // پرانی تاریخوں کا ڈیٹا 2 دن بعد خود بخود ڈیلیٹ کر دیں
    await kv.expire(dailyVisitsKey, 60 * 60 * 24 * 2); // 2 دن

  } catch (error) {
    console.error("KV Error (trackVisit API):", error.message);
  }
}

// جب کلائنٹ /api/track-visit پر POST ریکویسٹ بھیجے گا، تو یہ فنکشن چلے گا
export async function POST() {
  try {
    // گنتی کو بیک گراؤنڈ میں چلائیں اور کلائنٹ کو انتظار نہ کروائیں
    trackVisit();
    
    // کلائنٹ کو فوراً جواب بھیج دیں
    return NextResponse.json({ success: true }, { status: 202 });
    
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
