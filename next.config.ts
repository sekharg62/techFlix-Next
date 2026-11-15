import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Serve modern formats; Cloudinary uploads are already WebP
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 86400,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        // Placeholder images used by the demo seed data
        protocol: "https",
        hostname: "placehold.co",
      },
    ],
  },
};

export default nextConfig;
