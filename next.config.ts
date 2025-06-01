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
        domains: ['firebasestorage.googleapis.com'],
        // Or use the newer remotePatterns (Next.js 12.3+)
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'firebasestorage.googleapis.com',
                port: '',
                pathname: '/v0/b/**',
            },
        ],
    },
};

export default nextConfig;
