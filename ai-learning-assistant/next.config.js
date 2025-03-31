/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    // Remove serverActions setting as it might cause issues
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Warning: This allows production builds to successfully complete even if
    // your project has TypeScript errors.
    ignoreBuildErrors: true,
  },
  // Increase timeout for static generation
  staticPageGenerationTimeout: 120,
  // Disable image optimization if causing issues
  images: {
    unoptimized: true,
  },
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
      dns: false,
      child_process: false,
      stream: false,
      util: false,
      path: false,
      os: false,
      crypto: false,
    };
    
    return config;
  },
  // Add specific output configuration for Vercel
  output: 'standalone',
};

module.exports = nextConfig; 