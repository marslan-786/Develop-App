import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';
import { isValidPassword } from '@/lib/auth'; // ہمارے نئے فنکشن کو امپورٹ کریں

export const dynamic = 'force-dynamic';

export async function POST(request) {
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get('filename');
  const password = searchParams.get('password'); // پاس ورڈ کو URL سے پڑھیں

  // 1. سیکیورٹی چیک
  if (!(await isValidPassword(password))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // 2. فائل نیم چیک
  if (!filename || !request.body) {
    return NextResponse.json(
      { error: 'Filename and body are required.' },
      { status: 400 }
    );
  }

  try {
    // 3. فائل اپ لوڈ کریں
    const blob = await put(filename, request.body, {
      access: 'public', // یہ اہم ہے تاکہ لوگو پبلک ہو
    });

    return NextResponse.json(blob);

  } catch (error) {
    console.error('Error uploading to Vercel Blob:', error);
    return NextResponse.json(
      { error: 'Failed to upload file.', message: error.message },
      { status: 500 }
    );
  }
}
