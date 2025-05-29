import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "@/globals.css";

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
    title: "Team Orders PWA",
    description: "A Progressive Web App for managing team café orders",
    manifest: "/manifest.json",
    appleWebApp: {
        capable: true,
        statusBarStyle: "default",
        title: "Team Orders",
    },
}

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    themeColor: "#0d9488",
}

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
        <head>
            <link rel="apple-touch-icon" href="/icon-192x192.png" />
            <meta name="apple-mobile-web-app-capable" content="yes" />
            <meta name="apple-mobile-web-app-status-bar-style" content="default" />
            <meta name="apple-mobile-web-app-title" content="Team Orders" />
        </head>
        <body className={inter.className}>{children}</body>
        </html>
    )
}
