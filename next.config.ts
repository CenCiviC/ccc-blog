import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "dengtukgi5sf7.cloudfront.net" },
    ],
  },
};

export default nextConfig;
