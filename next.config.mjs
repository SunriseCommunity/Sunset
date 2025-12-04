import createNextIntlPlugin from "next-intl/plugin";

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

  turbopack: {
    rules: {
      "*.svg": {
        loaders: [
          {
            loader: "@svgr/webpack",
            options: {
              svgoConfig: {
                plugins: [
                  {
                    name: "preset-default",
                    params: {
                      overrides: {
                        removeViewBox: false,
                      },
                    },
                  },
                  "removeDimensions",
                ],
              },
            },
          },
        ],
        as: "*.js",
      },
    },
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

const withNextIntl = createNextIntlPlugin("./lib/i18n/request.ts");
export default withNextIntl(nextConfig);
