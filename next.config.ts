import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false, // Helps avoid double-invocation issues in dev
  images: {
    unoptimized: true, // For static export compatibility if needed later, also simpler local dev
  }
};

export default nextConfig;