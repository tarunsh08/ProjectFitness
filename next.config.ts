import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: [
      'hhccrluqxbilzancmokq.supabase.co',
      'cdn.vectorstock.com',
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
