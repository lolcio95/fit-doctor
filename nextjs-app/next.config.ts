import type { NextConfig } from "next";
import fs from "fs";
import path from "path";

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig: NextConfig = withBundleAnalyzer({
  env: {
    // Matches the behavior of `sanity dev` which sets styled-components to use the fastest way of inserting CSS rules in both dev and production. It's default behavior is to disable it in dev mode.
    SC_DISABLE_SPEEDY: "false",
  },
  images: {
    remotePatterns: [{
      protocol: 'https',
      hostname: 'cdn.sanity.io'
    }],
    domains: ['lh3.googleusercontent.com'],
  },
});

export default nextConfig;
