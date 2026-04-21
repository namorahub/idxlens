import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          // Izin embed iframe: gunakan CSP (X-Frame-Options ALLOW-FROM tidak didukung browser modern)
          { key: "Content-Security-Policy", value: "frame-ancestors 'self' https://websiteutama.com" },
        ],
      },
    ];
  },
};

export default nextConfig;