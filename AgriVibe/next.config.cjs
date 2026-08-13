/** @type {import('next').NextConfig} */
const nextConfig = {
  // Tell Next.js where your pages are
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
  
  // If you're using images from external URLs
  images: {
    domains: ['images.unsplash.com', 'images.pexels.com'],
  },

  // Important: Tell Next.js to look in src/pages
  distDir: '.next',
  
  // Enable React strict mode
  reactStrictMode: true,
  
  // For production
  swcMinify: true,
}

module.exports = nextConfig