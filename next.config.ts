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
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // Next.js needs unsafe-eval in dev
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https:",
      "font-src 'self'",
      "connect-src 'self' https://site.api.espn.com https://www.youtube.com https://api.twitch.tv https://id.twitch.tv wss:",
      "media-src 'self' https:",
      "frame-src 'self' https://www.youtube.com https://player.twitch.tv",
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
    remotePatterns: [
      { protocol: "https", hostname: "**.marca.com" },
      { protocol: "https", hostname: "**.estaticos-marca.com" },
      { protocol: "https", hostname: "**.as.com" },
      { protocol: "https", hostname: "**.sport.es" },
      { protocol: "https", hostname: "**.mundodeportivo.com" },
      { protocol: "https", hostname: "**.basketplus.es" },
      { protocol: "https", hostname: "img.youtube.com" },
      { protocol: "https", hostname: "i.ytimg.com" },
      { protocol: "https", hostname: "**.twimg.com" },
      { protocol: "https", hostname: "pbs.twimg.com" },
      { protocol: "https", hostname: "**.supabase.co" },
      { protocol: "https", hostname: "a.espncdn.com" },
      { protocol: "https", hostname: "**.espn.com" },
      { protocol: "https", hostname: "placehold.co" },
      { protocol: "https", hostname: "unavatar.io" },
      { protocol: "https", hostname: "ui-avatars.com" },
      // Global news sources
      { protocol: "https", hostname: "**.bbci.co.uk" },
      { protocol: "https", hostname: "ichef.bbci.co.uk" },
      { protocol: "https", hostname: "**.skysports.com" },
      { protocol: "https", hostname: "e0.365dm.com" },
      { protocol: "https", hostname: "**.elpais.com" },
      { protocol: "https", hostname: "**.abc.es" },
      { protocol: "https", hostname: "**.cope.es" },
      { protocol: "https", hostname: "**.clarin.com" },
      { protocol: "https", hostname: "**.fourfourtwo.com" },
      { protocol: "https", hostname: "cdn.mos.cms.futurecdn.net" },
      { protocol: "https", hostname: "a.fssta.com" },
      { protocol: "https", hostname: "**.espncdn.com" },
      { protocol: "https", hostname: "**.uefa.com" },
      { protocol: "https", hostname: "**.static.espn.go.com" },
    ],
  },
};

export default nextConfig;
