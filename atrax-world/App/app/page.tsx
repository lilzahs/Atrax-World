import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Coins, Gamepad2, TrendingUp, Zap } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="h-6 w-6 text-cyan-400" />
            <span className="text-xl font-bold">Atrax Streaming</span>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/streamer">
              <Button className="bg-cyan-500 hover:bg-cyan-600 text-black font-semibold">Streamer Dashboard</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto space-y-6">
          <h1 className="text-5xl md:text-7xl font-bold leading-tight text-balance">
            Monetize Your Stream with{" "}
            <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">Solana</span>
          </h1>
          <p className="text-xl text-gray-400 text-balance max-w-2xl mx-auto leading-relaxed">
            Accept instant SOL donations and let viewers influence your gameplay. Earn transparently with on-chain
            payments and claim profits anytime.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/streamer">
              <Button size="lg" className="bg-white text-black hover:bg-gray-200 font-semibold gap-2">
                Get Started
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <Card className="bg-white/5 border-white/10 backdrop-blur">
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-cyan-500/10 flex items-center justify-center mb-4">
                <Coins className="h-6 w-6 text-cyan-400" />
              </div>
              <CardTitle className="text-white">Instant Donations</CardTitle>
              <CardDescription className="text-gray-400">
                Receive SOL directly on-chain. No middlemen, no delays, no chargebacks.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-white/5 border-white/10 backdrop-blur">
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-purple-500/10 flex items-center justify-center mb-4">
                <Gamepad2 className="h-6 w-6 text-purple-400" />
              </div>
              <CardTitle className="text-white">Interactive Gameplay</CardTitle>
              <CardDescription className="text-gray-400">
                Viewers choose items (1-8) to influence your stream and create engaging moments.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-white/5 border-white/10 backdrop-blur">
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-green-500/10 flex items-center justify-center mb-4">
                <TrendingUp className="h-6 w-6 text-green-400" />
              </div>
              <CardTitle className="text-white">Transparent Earnings</CardTitle>
              <CardDescription className="text-gray-400">
                All transactions on-chain. Claim profits anytime with full transparency.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Getting Started */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">How It Works</h2>
          <div className="space-y-8">
            <div className="flex gap-4">
              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-cyan-500 flex items-center justify-center font-bold text-black">
                1
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Claim Your Room</h3>
                <p className="text-gray-400 leading-relaxed">
                  Connect your wallet, set your room name and YouTube stream URL. Your room is ready instantly.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-purple-500 flex items-center justify-center font-bold text-black">
                2
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Share Your Link</h3>
                <p className="text-gray-400 leading-relaxed">
                  Generate a viewer link and share it with your audience. They can watch and interact without leaving
                  the page.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-green-500 flex items-center justify-center font-bold text-black">
                3
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Earn & Claim</h3>
                <p className="text-gray-400 leading-relaxed">
                  Receive donations and item purchases instantly. Claim your profits anytime with no cooldown period.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tips Section */}
      <section className="container mx-auto px-4 py-20 border-t border-white/10">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Important Info</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white text-lg">Platform Fees</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 text-sm leading-relaxed">
                  A small percentage fee is applied to donations and item purchases. Fee info is fetched from on-chain
                  config and displayed transparently.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white text-lg">Item Pricing</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Each item (1-8) has a specific price set on-chain. Prices are fetched dynamically when viewers
                  interact.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white text-lg">Devnet Testing</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Currently running on Solana Devnet. Use devnet SOL for testing. No real funds required.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white text-lg">No Cooldowns</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Update your room anytime without waiting. Claim profits instantly whenever you want.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8">
        <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
          <p>Atrax Streaming - Powered by Solana Devnet</p>
        </div>
      </footer>
    </div>
  )
}
