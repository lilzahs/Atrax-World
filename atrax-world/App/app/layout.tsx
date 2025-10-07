import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Toaster } from "@/components/ui/toaster"
import { WalletProvider } from "@/lib/solana/wallet-context"
import { Suspense } from "react"
import "./globals.css"

export const metadata: Metadata = {
  title: "Atrax Streaming - Solana-Powered Livestreaming",
  description: "Donate SOL and influence gameplay in real-time",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <WalletProvider>
          <Suspense fallback={null}>
            {children}
            <Toaster />
          </Suspense>
        </WalletProvider>
        <Analytics />
      </body>
    </html>
  )
}
