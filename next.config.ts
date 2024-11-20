import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // dodaj domeny, z których pobierasz obrazki
    domains: ["image.tmdb.org"],
  },
};

export default nextConfig;
