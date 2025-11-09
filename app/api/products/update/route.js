import { put, head } from '@vercel/blob';
import { NextResponse } from 'next/server';
import { isValidPassword } from '../../../../lib/auth.js'; // 4 فولڈر باہر

export const dynamic = 'force-dynamic';

export async function POST(request) {
  const { searchParams } = new URL(request.url);
  const password = searchParams.get('password');

  // 1. سیکیورٹی چیک
  if (!(await isValidPassword(password))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // 2. اپ ڈیٹ شدہ پروڈکٹ کا ڈیٹا فارم سے حاصل کریں
    const updatedProduct = await request.json();
    if (!updatedProduct.id) {
      return NextResponse.json({ error: 'Product ID is required for update.' }, { status: 400 });
    }

    // 3. پرانی پروڈکٹس کی لسٹ 'data.json' سے حاصل کریں
    let products = [];
    try {
      const dataBlob = await head('data.json', { cache: 'no-store' });
      const dataRes = await fetch(dataBlob.url, { cache: 'no-store' });
      if (dataRes.ok) {
        const textData = await dataRes.text();
        if (textData) products = JSON.parse(textData);
      } else {
        throw new Error('data.json not found or empty.');
      }
    } catch (e) {
      return NextResponse.json({ error: 'data.json not found or is empty.' }, { status: 404 });
    }

    // 4. پروڈکٹ کو لسٹ میں تلاش کریں اور اسے اپ ڈیٹ کریں
    const newProducts = products.map(product => {
      if (product.id === updatedProduct.id) {
        return updatedProduct; // پرانی کو نئے ڈیٹا سے بدل دیں
      }
      return product; // باقی پروڈکٹس کو ویسے ہی رہنے دیں
    });

    // 5. اپ ڈیٹ شدہ لسٹ کو 'data.json' میں واپس سیو کریں
    const jsonString = JSON.stringify(newProducts, null, 2);
    const dataBlob = new Blob([jsonString], { type: 'application/json' });

    await put('data.json', dataBlob, {
      access: 'public',
      addRandomSuffix: false, 
    });

    return NextResponse.json({ success: true, message: 'Product updated!', updatedProduct });

  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: 'Failed to update product.', message: error.message },
      { status: 500 }
    );
  }
}
