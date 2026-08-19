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
  // Tells Turbopack exactly where your hidden app/pages folders reside
  experimental: {
    turbo: {
      root: '../../',
    }
  }
};

export default nextConfig;
