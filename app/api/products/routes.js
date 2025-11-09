import { put, head } from '@vercel/blob';
import { NextResponse } from 'next/server';
import { isValidPassword } from '@/lib/auth.js';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  const { searchParams } = new URL(request.url);
  const password = searchParams.get('password'); // پاس ورڈ کو URL سے پڑھیں

  // 1. سیکیورٹی چیک
  if (!(await isValidPassword(password))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // 2. نئی پروڈکٹ کا ڈیٹا فارم سے حاصل کریں
    const newProduct = await request.json();

    // 3. پرانی پروڈکٹس کی لسٹ 'data.json' سے حاصل کریں
    let products = [];
    try {
      const dataBlob = await head('data.json', { cache: 'no-store' });
      const dataRes = await fetch(dataBlob.url, { cache: 'no-store' });
      if (dataRes.ok) {
        products = await dataRes.json();
      }
    } catch (e) {
      // اگر فائل موجود نہیں ہے تو کوئی بات نہیں، ہم نئی بنا دیں گے
      console.log("data.json not found, creating a new one.");
    }

    // 4. نئی پروڈکٹ کو لسٹ میں شامل کریں
    // ایک منفرد (unique) ID شامل کریں
    newProduct.id = `prod_${new Date().getTime()}`;
    products.push(newProduct);

    // 5. اپ ڈیٹ شدہ لسٹ کو 'data.json' میں واپس سیو کریں
    await put('data.json', JSON.stringify(products, null, 2), {
      access: 'public',
      contentType: 'application/json',
      addRandomSuffix: false, // یہ بہت اہم ہے
    });

    return NextResponse.json({ success: true, message: 'Product added!', newProduct });

  } catch (error) {
    console.error('Error adding product:', error);
    return NextResponse.json(
      { error: 'Failed to add product.', message: error.message },
      { status: 500 }
    );
  }
}
