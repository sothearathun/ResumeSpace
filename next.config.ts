import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    // The template gallery lives on the landing page now.
    return [{ source: "/templates", destination: "/#templates", permanent: true }];
  },
};

export default nextConfig;
