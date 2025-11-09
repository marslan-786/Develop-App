/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        // --- یہ ہے حل! ---
        // 'v*.public.blob.vercel-storage.com' کو اس سے بدل دیں:
        hostname: 'public.blob.vercel-storage.com',
        // --- حل ختم ---
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
