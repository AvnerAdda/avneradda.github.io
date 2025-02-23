/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    unoptimized: true,
  },
  basePath: process.env.GITHUB_ACTIONS ? '/avneradda.github.io' : '',
  assetPrefix: process.env.GITHUB_ACTIONS ? '/avneradda.github.io/' : '',
}

module.exports = nextConfig 