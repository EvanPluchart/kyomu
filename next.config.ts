import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  allowedDevOrigins: ["192.168.1.163"],
  serverExternalPackages: [
    "yauzl-promise",
    "@node-rs/crc32",
    "better-sqlite3",
    "sharp",
  ],
};

export default nextConfig;
