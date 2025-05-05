// next.config.ts
import createMDX from '@next/mdx';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: 'images.unsplash.com',
        pathname: '/**',
        protocol: 'https',
      },
      {
        hostname: 'avatars.githubusercontent.com',
        pathname: '/**',
        protocol: 'https',
      },
      {
        hostname: 'gilqgzjkzkmhbbcqidqb.supabase.co',
        pathname: '/storage/**',
        protocol: 'https',
      },
    ],
  },
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  publicRuntimeConfig: {
    SITE_URL: process.env.SITE_URL,
  },
  turbopack: {
    resolveExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '4mb',
    },
  },
};

const withMDX = createMDX({
  extension: /\.(md|mdx)$/,
});

// Merge MDX config with Next.js config
export default withMDX(nextConfig);
