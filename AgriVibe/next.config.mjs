/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '://cloudinary.com',
      },
    ],
  },
  // This completely forces Next.js to skip checking for TypeScript errors
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
