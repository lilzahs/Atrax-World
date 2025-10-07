"use client"

import { Suspense } from "react"
import { VideoPlayer } from "@/components/video-player"
import { DonationPanel } from "@/components/donation-panel"
import { ItemPicker } from "@/components/item-picker"
import { Leaderboard } from "@/components/leaderboard"
import { GoalBar } from "@/components/goal-bar"
import { EventTicker } from "@/components/event-ticker"
import { WalletButton } from "@/components/wallet-button"
import Link from "next/link"
import { ArrowLeft, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"

function ViewerContent() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-sm sticky top-0 z-50 bg-black/80">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="gap-2 text-gray-400 hover:text-white">
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-cyan-400" />
              <span className="font-bold">Atrax</span>
            </div>
          </div>
          <WalletButton />
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-[1fr_400px] gap-6">
          {/* Left: Video Player */}
          <div className="space-y-4">
            <VideoPlayer />
            <EventTicker />
          </div>

          {/* Right: Action Stack */}
          <div className="space-y-4">
            <DonationPanel />
            <ItemPicker />
            <GoalBar />
            <Leaderboard />
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ViewerPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <ViewerContent />
    </Suspense>
  )
}
