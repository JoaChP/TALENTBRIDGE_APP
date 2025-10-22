/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Moved from experimental in Next.js 15
  skipTrailingSlashRedirect: true,
  skipMiddlewareUrlNormalize: true,
  // Force new build
  generateBuildId: async () => {
    return 'build-' + Date.now()
  },
}

export default nextConfig
