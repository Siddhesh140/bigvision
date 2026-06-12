/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/',
        destination: '/v3/index.html',
      },
    ];
  },
};

export default nextConfig;
