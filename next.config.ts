import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  serverExternalPackages: [
    "yauzl-promise",
    "@node-rs/crc32",
    "better-sqlite3",
    "sharp",
  ],
};

export default nextConfig;
