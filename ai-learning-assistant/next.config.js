/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
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
  // Add this to skip static generation and make all pages dynamic
  staticPageGenerationTimeout: 1,
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Don't attempt to load these modules on the client to prevent errors
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        dns: false,
        child_process: false,
        'node:stream': false,
        stream: false,
        util: false,
        path: false,
        os: false,
        crypto: false,
      };
    }
    return config;
  },
};

module.exports = nextConfig; 