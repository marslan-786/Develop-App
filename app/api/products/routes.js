import { put, head } from '@vercel/blob';
import { NextResponse } from 'next/server';
import { isValidPassword } from '../../../lib/auth.js'; // یہ پاتھ بالکل ٹھیک ہے

export const dynamic = 'force-dynamic';

export async function POST(request) {
  const { searchParams } = new URL(request.url);
  const password = searchParams.get('password');

  // 1. سیکیورٹی چیک
  if (!(await isValidPassword(password))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // 2. نئی پروڈکٹ کا ڈیٹا فارم سے حاصل کریں
    const newProduct = await request.json();

    // 3. پرانی پروڈکٹس کی لسٹ 'data.json' سے حاصل کریں
    let products = []; // ڈیفالٹ کے طور پر خالی لسٹ
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
      // اگر 'data.json' ڈیلیٹ ہو چکی ہے تو یہ چلے گا
      console.log("data.json not found, creating a new one.");
    }

    // 4. نئی پروڈکٹ کو لسٹ میں شامل کریں
    newProduct.id = `prod_${new Date().getTime()}`;
    products.push(newProduct);

    // 5. اپ ڈیٹ شدہ لسٹ کو 'data.json' میں واپس سیو کریں
    await put('data.json', JSON.stringify(products, null, 2), {
      access: 'public',
      // contentType: 'application/json', // <-- اس لائن کو ہٹا دیا گیا ہے
      addRandomSuffix: false, 
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
