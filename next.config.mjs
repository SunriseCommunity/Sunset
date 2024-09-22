/** @type {import('next').NextConfig} */
const domain = process.env.NEXT_PUBLIC_SERVER_DOMAIN || "ppy.sh";

const nextConfig = {
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
        hostname: "osu.ppy.sh",
        pathname: "**",
      },
    ],
  },
  reactStrictMode: false,
};

export default nextConfig;
