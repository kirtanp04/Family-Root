import { env } from "./src/env.js";

/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.js");

/** @type {import("next").NextConfig} */
const config = {
  images: {
    domains: ["purepng.com"],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "50mb",
      allowedOrigins: ["*"],
    },
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Ensure that node-pre-gyp or any server-specific package is not bundled on the client-side
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        os: false,
      };
    }
    return config;
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: "/family",
        permanent: true,
      },
    ];
  },
  env: {
    DATABASE_URL: env.DATABASE_URL,
  },
};

export default config;
