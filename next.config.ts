import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // <- энэ хэсгийг нэмсэн
  },
  // бусад config бол энд...
};

export default nextConfig;
