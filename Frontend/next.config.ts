import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  env: {
    SERVER_URL: process.env.SERVER_URL,
  },
  images: {
    disableStaticImages: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ziqxesyaovpowhccmwiw.supabase.co",
        pathname: "/storage/v1/object/public/book-covers/**",
      },
      {
        protocol: "https",
        hostname: "ziqxesyaovpowhccmwiw.supabase.co",
        pathname: "/storage/v1/object/public/news-covers/**",
      },
      {
        protocol: "https",
        hostname: "ziqxesyaovpowhccmwiw.supabase.co",
        pathname: "/storage/v1/object/public/user-covers/**",
      },
    ],
  },

  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://backend:4000/:path*",
      },
    ];
  },
};

export default nextConfig;
