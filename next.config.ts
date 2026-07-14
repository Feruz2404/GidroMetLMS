import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  typescript: {
    ignoreBuildErrors: false,
  },
  reactStrictMode: true,
  poweredByHeader: false,
  allowedDevOrigins: [
    "127.0.0.1",
    "localhost",
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
  async headers() {
    const isDevelopment = process.env.NODE_ENV !== 'production';
    const scriptSrc = isDevelopment ? "'self' 'unsafe-inline' 'unsafe-eval'" : "'self' 'unsafe-inline'";
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'Content-Security-Policy', value: `default-src 'self'; base-uri 'self'; frame-ancestors 'none'; form-action 'self'; object-src 'none'; script-src ${scriptSrc}; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https:; font-src 'self' data:; connect-src 'self'${isDevelopment ? ' ws: http:' : ''}; media-src 'self' https: blob:; upgrade-insecure-requests` },
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
          { key: 'Cross-Origin-Resource-Policy', value: 'same-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=()' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          ...(isDevelopment ? [] : [{ key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' }]),
        ],
      },
    ];
  },
};

export default nextConfig;
