import type { NextConfig } from "next";

// 이미지 CDN 도메인은 env와 한 곳에서 관리 (env 미설정 시 빌드 실패 대신 기본값)
const cdnHostname = new URL(
  process.env.CCC_CDN_IMAGE_DOMAIN ?? "https://dengtukgi5sf7.cloudfront.net"
).hostname;

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: cdnHostname }],
  },
};

export default nextConfig;
