/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/:path*',
        destination: '/', // If this is correct for your use case
      },
    ];
  },
};

module.exports = nextConfig;
