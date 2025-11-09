import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic'; // Vercel پر API کو ہمیشہ متحرک رکھنے کے لیے

export async function POST(request) {
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get('filename');

  if (!filename || !request.body) {
    return NextResponse.json(
      { error: 'Filename and body are required.' },
      { status: 400 }
    );
  }

  try {
    const blob = await put(filename, request.body, {
      access: 'public',
      // ٹوکن خود بخود Environment Variable سے پڑھا جائے گا
    });

    // واپس اپ لوڈ کی گئی فائل کا URL بھیجیں
    return NextResponse.json(blob);

  } catch (error) {
    console.error('Error uploading to Vercel Blob:', error);
    return NextResponse.json(
      { error: 'Failed to upload file.', message: error.message },
      { status: 500 }
    );
  }
}
