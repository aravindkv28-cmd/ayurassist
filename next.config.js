// next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
  // 1. Tell Next.js about your AI library
  serverExternalPackages: ['@xenova/transformers'],

  // 2. Add empty turbopack config
  turbopack: {},

  // 3. Add the webpack config for the AI model
  webpack: (config) => {
    config.externals = [...config.externals, { canvas: 'canvas' }];
    return config;
  },
};

export default nextConfig;