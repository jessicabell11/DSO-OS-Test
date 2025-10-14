
  /** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  distDir: 'dist',

  // Skip ESLint issues during build
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Skip TypeScript issues during build
  typescript: {
    ignoreBuildErrors: true,
  },

  // Disable Next.js image optimization
  images: { 
    unoptimized: true,
  },
  
  // Custom base path for deployment
  basePath: '/13b9709c-4fff-4e69-be61-235b071c2533/c6ztu2hk/q92xcfu4/preview',
  assetPrefix: '/13b9709c-4fff-4e69-be61-235b071c2533/c6ztu2hk/q92xcfu4/preview',
};

module.exports = nextConfig;

