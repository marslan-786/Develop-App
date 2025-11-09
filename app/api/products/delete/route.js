import { put, head } from '@vercel/blob';
import { NextResponse } from 'next/server';
import { isValidPassword } from '../../../lib/auth.js'; // ہمارا auth فنکشن

export const dynamic = 'force-dynamic';

export async function POST(request) {
  const { searchParams } = new URL(request.url);
  const password = searchParams.get('password'); // پاس ورڈ کو URL سے پڑھیں

  // 1. سیکیورٹی چیک
  if (!(await isValidPassword(password))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // 2. ڈیلیٹ کی جانے والی پروڈکٹ کی ID حاصل کریں
    const { productId } = await request.json();
    if (!productId) {
      return NextResponse.json({ error: 'Product ID is required.' }, { status: 400 });
    }

    // 3. پرانی پروڈکٹس کی لسٹ 'data.json' سے حاصل کریں
    let products = [];
    try {
      const dataBlob = await head('data.json', { cache: 'no-store' });
      const dataRes = await fetch(dataBlob.url, { cache: 'no-store' });
      
      if (dataRes.ok) {
        const textData = await dataRes.text();
        if (textData) { 
          products = JSON.parse(textData);
        }
      }
    } catch (e) {
      // اگر فائل موجود نہیں ہے تو ایرر دیں
      return NextResponse.json({ error: 'data.json not found.' }, { status: 404 });
    }

    // 4. پروڈکٹ کو لسٹ سے فلٹر (remove) کریں
    const newProducts = products.filter(product => product.id !== productId);

    // 5. اپ ڈیٹ شدہ (نئی) لسٹ کو 'data.json' میں واپس سیو کریں
    const jsonString = JSON.stringify(newProducts, null, 2);
    const dataBlob = new Blob([jsonString], { type: 'application/json' });

    await put('data.json', dataBlob, {
      access: 'public',
      addRandomSuffix: false, 
    });

    return NextResponse.json({ success: true, message: 'Product deleted!' });

  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: 'Failed to delete product.', message: error.message },
      { status: 500 }
    );
  }
}
