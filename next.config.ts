import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "100mb",
    }, // Enable Server Actions if needed
  },
};

export default nextConfig;
