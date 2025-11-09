import { head } from '@vercel/blob';

export async function isValidPassword(enteredPassword) {
  if (!enteredPassword) {
    return false;
  }

  // 1. ماسٹر پاس ورڈ (Vercel Environment سے) چیک کریں
  const masterPassword = process.env.ADMIN_PASSWORD;
  if (enteredPassword === masterPassword) {
    return true; // لاگ ان کامیاب
  }

  // 2. لاگ ان پاس ورڈ (Vercel Blob سے) چیک کریں
  try {
    const blob = await head('password.json');
    const response = await fetch(blob.url);
    if (!response.ok) {
      throw new Error('Blob password not found or unreadable');
    }
    
    const data = await response.json();
    const blobPassword = data.password; // { "password": "..." }

    if (enteredPassword === blobPassword) {
      return true; // لاگ ان کامیاب
    }
  } catch (error) {
    // اگر password.json موجود نہیں ہے تو یہ ایرر آئے گا
    console.warn("Could not check blob password:", error.message);
  }

  // 3. اگر دونوں پاس ورڈ میچ نہیں ہوئے
  return false;
}
