import type React from "react"
import type { Metadata, Viewport } from "next"

import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { Inter, Manrope as V0_Font_Manrope, Geist_Mono as V0_Font_Geist_Mono } from "next/font/google"
import { StoreProvider } from "@/lib/store"

// Initialize fonts
const _manrope = V0_Font_Manrope({ subsets: ["latin"], weight: ["200", "300", "400", "500", "600", "700", "800"] })
const _geistMono = V0_Font_Geist_Mono({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
})

const _inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "DentFlow - Dental Clinic Management",
  description: "Centralized dental clinic management system for patient CRM, scheduling, financials, inventory, and HR",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <StoreProvider>{children}</StoreProvider>
        <Analytics />
      </body>
    </html>
  )
}
