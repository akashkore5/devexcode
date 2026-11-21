import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  compress: true,
  poweredByHeader: false,
  trailingSlash: false,
  experimental: {
    optimizePackageImports: [
      '@heroicons/react',
      'lucide-react',
      'framer-motion',
    ],
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  async redirects() {
    return [
      // Apex -> www lived only in the hosting dashboard, invisible to this repo.
      // Every canonical, sitemap entry and JSON-LD @id points at www, so if that
      // dashboard setting is ever reset the apex would serve the whole site at
      // 200 with canonicals pointing elsewhere. Keep it in version control.
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'devexcode.com' }],
        destination: 'https://www.devexcode.com/:path*',
        permanent: true,
      },
      // Every micro dev tip was reachable at two URLs: the numeric id used by the
      // UI/sitemap and the `dev_<n>` markdown filename, which the sitemap also
      // emitted. Collapse the filename form onto the numeric one.
      {
        source: '/micro-dev-tips/dev_:id(\\d+)',
        destination: '/micro-dev-tips/:id',
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
      {
        source: '/:all*(svg|jpg|jpeg|png|webp|avif|ico|woff2)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
