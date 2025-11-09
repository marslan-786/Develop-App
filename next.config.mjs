/** @type {import('next').NextConfig} */
const nextConfig = {
  // Vercel Blob سے تصاویر لوڈ کرنے کی اجازت دینے کے لیے
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'v*.public.blob.vercel-storage.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
