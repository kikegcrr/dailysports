import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-DNS-Prefetch-Control", value: "on" },
  { key: "X-XSS-Protection", value: "1; mode=block" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://pagead2.googlesyndication.com https://partner.googleadservices.com https://platform.twitter.com",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https:",
      "font-src 'self'",
      "connect-src 'self' https://site.api.espn.com https://www.youtube.com https://api.twitch.tv https://id.twitch.tv https://pagead2.googlesyndication.com https://googleads.g.doubleclick.net https://api.twitter.com https://syndication.twitter.com https://*.supabase.co wss:",
      "media-src 'self' https:",
      "frame-src 'self' https://www.youtube.com https://player.twitch.tv https://googleads.g.doubleclick.net https://tpc.googlesyndication.com https://platform.twitter.com https://syndication.twitter.com",
      "frame-ancestors 'self'",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
  images: {
    // Allow any HTTPS image source — this site aggregates from dozens of
    // news CDNs whose domains we cannot exhaustively enumerate.
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
};

export default nextConfig;
