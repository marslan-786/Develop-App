import { kv } from '@vercel/kv';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    // 1. User-Agent چیک کریں (Bots کو روکنے کے لیے)
    const userAgent = request.headers.get('user-agent') || '';
    const isBot = /bot|crawler|spider|crawling/i.test(userAgent);
    
    if (isBot) {
      return NextResponse.json({ message: 'Bot detected. Not counting.' });
    }

    // 2. IP ایڈریس حاصل کریں
    let ip = request.headers.get('x-forwarded-for') || request.ip || 'unknown';
    if (ip.includes(',')) ip = ip.split(',')[0];

    if (ip === 'unknown' || ip === '::1' || ip === '127.0.0.1') {
      return NextResponse.json({ message: 'Local/Unknown IP ignored' });
    }

    // 3. KV میں چیک کریں (6 گھنٹے کا لاک)
    const ipKey = `visitor_ip:${ip}`;
    const hasVisited = await kv.get(ipKey);

    if (hasVisited) {
      return NextResponse.json({ message: 'Returning visitor. Not counting.' });
    }

    // 4. نیا وزٹر - لاک کریں
    await kv.set(ipKey, 'true', { ex: 21600 }); // 6 گھنٹے

    // 5. گنتی بڑھائیں
    const today = new Date().toLocaleString('sv-SE', { 
      timeZone: 'Asia/Karachi' 
    }).split(' ')[0]; // YYYY-MM-DD
    
    const dailyKey = `visits:${today}`;

    await Promise.all([
      kv.incr(dailyKey),
      kv.incr('total_visitors'),
      kv.expire(dailyKey, 172800)
    ]);

    return NextResponse.json({ message: 'New visit counted successfully!' });

  } catch (error) {
    console.error("Tracking Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
