import { hostname } from "os"

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.clerk.com',
      },
      {
        protocol: 'https',
        hostname: 'utfs.io',
      },
      {
        protocol: 'https',
        hostname: 'getstream.io',
      },
      {
        protocol: 'https',
        hostname: 'singlecolorimage.com',
      }
    ],
  },
}

module.exports = nextConfig
