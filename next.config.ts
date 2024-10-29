import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    output: "export",  // <=== enables static exports
    reactStrictMode: true,
    basePath:"/json-finder",
  /* config options here */
    // i18n:{
    //     locales:["pt-BR","en-US"],
    //     defaultLocale: "pt-BR",
    //
    // },
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "**",
            },
        ],
    },
    experimental:{
        optimizePackageImports: ["@chakra-ui/react"]
    }
};

export default nextConfig;
