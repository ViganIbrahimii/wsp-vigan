/** @type {import('next').NextConfig} */
import createNextIntlPlugin from "next-intl/plugin"

const withNextIntl = createNextIntlPlugin()

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "orderific.com",
        port: "",
        pathname: "/admin_images/**",
      },
      {
        protocol: "https",
        hostname: "www.publiish.io",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "github.com",
        port: "",
        pathname: "/**",
      },
    ],
    domains: ["www.publiish.io"],
  },
}

export default withNextIntl(nextConfig)
