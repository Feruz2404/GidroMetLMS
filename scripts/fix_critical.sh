#!/bin/bash
# Comprehensive fix script for Meteo LMS
set -e

echo "=== Phase 1: Fix configuration files ==="

# Fix next.config.ts
cat > /home/z/my-project/next.config.ts << 'NXEOF'
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  typescript: {
    ignoreBuildErrors: false,
  },
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'api.qrserver.com' },
    ],
  },
};

export default nextConfig;
NXEOF
echo "✓ next.config.ts"

# Fix tsconfig.json
cat > /home/z/my-project/tsconfig.json << 'TSEOF'
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "noImplicitAny": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "react-jsx",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./src/*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
TSEOF
echo "✓ tsconfig.json"

# Fix .env
cat > /home/z/my-project/.env << 'ENVEOF'
DATABASE_URL=file:/home/z/my-project/db/custom.db
NEXT_PUBLIC_APP_URL=http://localhost:3000
SESSION_SECRET=gidroedu-session-secret-change-in-production-32chars
ENVEOF
echo "✓ .env"

# Create .env.example
cat > /home/z/my-project/.env.example << 'EXEENV'
# Database — Use a cloud PostgreSQL URL on Vercel (Vercel Postgres / Neon / Supabase)
DATABASE_URL=file:./dev.db
# Public app URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
# Secret for session tokens (min 32 chars, change in production!)
SESSION_SECRET=change-this-to-a-random-32-char-string
EXEENV
echo "✓ .env.example"

# Create vercel.json
cat > /home/z/my-project/vercel.json << 'VCEOF'
{
  "framework": "nextjs",
  "buildCommand": "npx prisma generate && next build",
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-XSS-Protection", "value": "1; mode=block" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" }
      ]
    }
  ]
}
VCEOF
echo "✓ vercel.json"

echo "=== Phase 1 complete ==="