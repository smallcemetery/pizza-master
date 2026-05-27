import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    // Это заставляет Next.js правильно работать с внешними пакетами вроде Prisma
    serverComponentsExternalPackages: ['@prisma/client'],
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lasbaexjyuilncrpgbfd.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
};

export default nextConfig;
