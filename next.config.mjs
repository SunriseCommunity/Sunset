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
        hostname: "a.ppy.sh",
        pathname: "/assets/**",
      },
    ],
  },
};

export default nextConfig;
