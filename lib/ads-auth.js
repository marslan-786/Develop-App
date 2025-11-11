// lib/ads-auth.js
import { put, head } in '@vercel/blob';

// یہ ایڈ پینل کا پاس ورڈ پڑھے گا
async function getAdsPassword() {
  const adsPassword = process.env.ADS_PANEL_PASSWORD;
  if (adsPassword) {
    return adsPassword;
  }
  
  // فال بیک: اگر ENV میں نہیں ہے تو بلاب سے 'ads-password.json' پڑھے
  try {
    const blob = await head('ads-password.json', { cache: 'no-store' });
    const response = await fetch(blob.url, { cache: 'no-store' });
    const data = await response.json();
    return data.password;
  } catch (error) {
    return 'fallback-password-123'; // ڈیفالٹ
  }
}

export async function isValidAdsPassword(password) {
  if (!password) return false;
  const correctPassword = await getAdsPassword();
  return password === correctPassword;
}
