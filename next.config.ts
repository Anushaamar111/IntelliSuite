import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "100mb",
    }, // Enable Server Actions if needed
  },
  eslint: {
    ignoreDuringBuilds: true, // Skips ESLint during builds
  },
  images: {
    domains: ["img.clerk.com", "res.cloudinary.com"],
  },
};

export default nextConfig;
