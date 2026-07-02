import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  typescript: {
    ignoreBuildErrors: false,
  },
  reactStrictMode: true,
  poweredByHeader: false,
  allowedDevOrigins: [
    "preview-chat-71467160-990b-406b-9dea-0fb7f4735583.space-z.ai",
    // Allow access from LAN IPs (e.g. testing from another device on the
    // same network) so the dev server doesn't reject HMR websocket
    // connections with "Cross origin request detected" / failed ws:// errors.
    "192.168.*.*",
    "10.*.*.*",
  ],
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'api.qrserver.com' },
    ],
  },
};

export default nextConfig;