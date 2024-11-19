import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["twoja-domena-z-obrazkami.com"], // dodaj domeny, z których pobierasz obrazki
  },
  // jeśli używasz API Routes, możesz skonfigurować limity
  api: {
    bodyParser: {
      sizeLimit: "5mb",
    },
  },
};

export default nextConfig;
