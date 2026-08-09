import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    qualities: [75, 100],
  },
  allowedDevOrigins: ["192.168.1.4", "192.168.1.8", "*.trycloudflare.com"],
};

export default nextConfig;
