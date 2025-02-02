import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: process.env.GITHUB_ACTIONS ? '/avneradda.github.io' : '',
  assetPrefix: process.env.GITHUB_ACTIONS ? '/avneradda.github.io/' : '',
};

export default nextConfig;
