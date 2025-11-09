import { head } from '@vercel/blob';

export async function isValidPassword(enteredPassword) {
  if (!enteredPassword) {
    return false;
  }

  const masterPassword = process.env.ADMIN_PASSWORD;
  if (enteredPassword === masterPassword) {
    return true;
  }

  try {
    // --- حل 4: پاس ورڈ کے لیے 'no-store' ---
    const blob = await head('password.json', { cache: 'no-store' });
    const response = await fetch(blob.url, { cache: 'no-store' });

    if (!response.ok) {
      throw new Error('Blob password not found or unreadable');
    }
    
    const data = await response.json();
    const blobPassword = data.password;

    if (enteredPassword === blobPassword) {
      return true;
    }
  } catch (error) {
    console.warn("Could not check blob password:", error.message);
  }

  return false;
}
