/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          {
            key: "Access-Control-Allow-Credentials",
            value: "true",
          },
          {
            key: "Access-Control-Allow-Origin",
            value: "https://api-ecommerce.muhamadzafarsyah.com",
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET,DELETE,PATCH,POST,PUT,OPTIONS",
          },
          {
            key: "Access-Control-Allow-Headers",
            value:
              "Content-Type, Authorization, X-Requested-With, Accept, Origin, X-CSRF-Token",
          },
        ],
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api-ecommerce.muhamadzafarsyah.com",
        pathname: "/**",
      },
    ],
  },
};

module.exports = nextConfig;
