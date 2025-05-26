import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    // output: 'export',
    // experimental: {
    //     serverComponentsExternalPackages: ['grammy'],
    // },
    eslint: {
        ignoreDuringBuilds: true,
    },
};

export default nextConfig;
