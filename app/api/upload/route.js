import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';
import { isValidPassword } from '../../../lib/auth.js';
import { revalidateTag } from 'next/cache'; // <-- 1. اسے امپورٹ کریں

export const dynamic = 'force-dynamic';

export async function POST(request) {
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get('filename');
  const password = searchParams.get('password');

  if (!(await isValidPassword(password))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!filename || !request.body) {
    return NextResponse.json(
      { error: 'Filename and body are required.' },
      { status: 400 }
    );
  }

  try {
    const blob = await put(filename, request.body, {
      access: 'public',
      addRandomSuffix: false, // <-- یہ ہے حل!
    });

    // --- ✅ تبدیلی یہاں ہے ---
    // 2. 'settings' ٹیگ والی کیش کو کلیئر کریں
    revalidateTag('settings');
    // --- --- ---

    return NextResponse.json(blob);

  } catch (error) {
    console.error('Error uploading to Vercel Blob:', error);
    return NextResponse.json(
      { error: 'Failed to upload file.', message: error.message },
      { status: 500 }
    );
  }
}
