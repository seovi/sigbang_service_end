import type { NextConfig } from "next";

const config: NextConfig = {
  poweredByHeader: false,
  skipTrailingSlashRedirect: true,
  // Keep dependency tracing inside this independent project.
  outputFileTracingRoot: process.cwd(),
  turbopack: { root: process.cwd() },
};

export default config;
