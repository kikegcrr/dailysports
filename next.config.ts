import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
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
    ],
  },
};

export default nextConfig;
