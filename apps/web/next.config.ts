import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    "@pizdit/core",
    "@pizdit/db",
    "@pizdit/ui",
    "@pizdit/adapters",
    "@pizdit/adapter-pt",
  ],
};

export default nextConfig;
