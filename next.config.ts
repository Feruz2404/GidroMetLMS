import type { NextConfig } from 'next'

const isDevelopment = process.env.NODE_ENV !== 'production'

function contentSecurityPolicy() {
  const directives = [
    "default-src 'self'",
    "base-uri 'self'",
    "frame-ancestors 'none'",
    "form-action 'self'",
    "object-src 'none'",
    `script-src 'self' 'unsafe-inline'${isDevelopment ? " 'unsafe-eval'" : ''}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https:",
    "font-src 'self' data:",
    `connect-src 'self'${isDevelopment ? ' ws: http:' : ''}`,
    "media-src 'self' https: blob:",
    // Lesson videos are embedded from YouTube's privacy-enhanced domain.
    'frame-src https://www.youtube-nocookie.com https://www.youtube.com',
    ...(isDevelopment ? [] : ['upgrade-insecure-requests']),
  ]
  return directives.join('; ')
}

const nextConfig: NextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  poweredByHeader: false,
  devIndicators: { position: 'bottom-right' },
  allowedDevOrigins: ['127.0.0.1', 'localhost', '192.168.*.*', '10.*.*.*'],
  async redirects() {
    return [
      // QR codes on certificates issued by earlier versions point at /?view=verify&hash=…
      {
        source: '/',
        has: [
          { type: 'query', key: 'view', value: 'verify' },
          { type: 'query', key: 'hash', value: '(?<hash>[A-Fa-f0-9]{40})' },
        ],
        destination: '/verify/:hash',
        permanent: true,
      },
    ]
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'Content-Security-Policy', value: contentSecurityPolicy() },
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
          { key: 'Cross-Origin-Resource-Policy', value: 'same-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=()' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          ...(isDevelopment ? [] : [{ key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' }]),
        ],
      },
    ]
  },
}

export default nextConfig
