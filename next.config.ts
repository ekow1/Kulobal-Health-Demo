import type { NextConfig } from 'next';

const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000';

const nextConfig: NextConfig = {
  /* config options here */
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
  images: {
    domains: ['images.unsplash.com'],
  },
  output: 'standalone',
  // async rewrites() {
  //   return [
  //     {
  //       source: '/pharmacy/:path*',
  //       destination: apiUrl,
  //     },
  //   ];
  // },
};

export default nextConfig;
