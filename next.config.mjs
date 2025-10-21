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
  // Disable pre-rendering for pages directory since we use client-side React Router
  experimental: {
    skipTrailingSlashRedirect: true,
    skipMiddlewareUrlNormalize: true,
  },
}

export default nextConfig
