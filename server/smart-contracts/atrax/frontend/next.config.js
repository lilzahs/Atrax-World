/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Ensure client-only modules don’t import on server
  webpack: (config) => {
    config.resolve.fallback = { fs: false, path: false, crypto: false, stream: false };
    return config;
  }
};

module.exports = nextConfig;

