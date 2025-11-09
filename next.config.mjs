/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        // --- یہ ہے حل! ---
        // 'public.blob.vercel-storage.com' کو اس سے بدل دیں:
        hostname: 'hnt5qthrn2hkqfn9.public.blob.vercel-storage.com',
        // --- حل ختم ---
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
