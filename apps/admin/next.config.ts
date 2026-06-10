import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@pizdit/core", "@pizdit/db", "@pizdit/ui", "@pizdit/ai"],
};

export default nextConfig;
