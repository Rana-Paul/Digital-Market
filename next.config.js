/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "localhost",
        protocol: "http",
        port: "3000",
        pathname: "**",
      },
    ],
  },
};

module.exports = nextConfig;
