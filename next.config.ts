import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    // output: 'export',
    // experimental: {
    //     serverComponentsExternalPackages: ['grammy'],
    // },
    eslint: {
        ignoreDuringBuilds: true,
    },
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "ik.imagekit.io",
                port: "",
            },
        ],
    },
};

export default nextConfig;
