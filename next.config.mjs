/** @type {import('next').NextConfig} */
const domain = process.env.NEXT_PUBLIC_SERVER_DOMAIN || "ppy.sh";

const nextConfig = {
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: [{ loader: "@svgr/webpack", options: { icon: true } }],
    });

    return config;
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: `a.${domain}`,
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "assets.ppy.sh",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "a.ppy.sh",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "osu.ppy.sh",
        pathname: "**",
      },
    ],
  },
  reactStrictMode: false,
};

export default nextConfig;
