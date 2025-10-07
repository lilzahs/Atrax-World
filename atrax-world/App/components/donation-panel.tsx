"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Coins } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useWallet } from "@/lib/solana/wallet-context"

const PRESET_AMOUNTS = [0.1, 0.5, 1, 5]

export function DonationPanel() {
  const [customAmount, setCustomAmount] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [viewerName, setViewerName] = useState("")
  const { toast } = useToast()
  const { connected } = useWallet()

  useEffect(() => {
    const savedName = localStorage.getItem("atrax_viewer_name")
    if (savedName) {
      setViewerName(savedName)
    }
  }, [])

  const handleDonate = async (amount: number) => {
    if (!connected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to donate",
        variant: "destructive",
      })
      return
    }

    if (!viewerName.trim()) {
      toast({
        title: "Name Required",
        description: "Please enter your name before donating",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      console.log("[v0] Donating:", amount, "SOL", "from", viewerName)

      // Simulate fee calculation (example: 2% fee)
      const fee = amount * 0.02
      const streamerReceives = amount - fee

      toast({
        title: "Donation Sent!",
        description: `${viewerName} donated ${amount} SOL (${streamerReceives.toFixed(4)} SOL to streamer, ${fee.toFixed(4)} SOL fee)`,
      })
    } catch (error) {
      toast({
        title: "Donation Failed",
        description: "Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleNameChange = (name: string) => {
    setViewerName(name)
    localStorage.setItem("atrax_viewer_name", name)
  }

  return (
    <Card className="bg-white/5 border-white/10 backdrop-blur">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Coins className="h-5 w-5 text-cyan-400" />
          <CardTitle className="text-white">Donate SOL</CardTitle>
        </div>
        <CardDescription className="text-gray-400">Support the streamer with instant donations</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="donor-name" className="text-sm text-gray-400">
            Your Name
          </label>
          <input
            id="donor-name"
            type="text"
            placeholder="Enter your name"
            value={viewerName}
            onChange={(e) => handleNameChange(e.target.value)}
            className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-md text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            maxLength={30}
          />
        </div>

        {/* Preset Amounts */}
        <div className="grid grid-cols-4 gap-2">
          {PRESET_AMOUNTS.map((amount) => (
            <Button
              key={amount}
              variant="outline"
              className="border-cyan-400/30 text-cyan-400 hover:bg-cyan-400/10 bg-transparent"
              onClick={() => handleDonate(amount)}
              disabled={isLoading || !viewerName.trim()}
            >
              {amount} SOL
            </Button>
          ))}
        </div>

        {/* Custom Amount */}
        <div className="space-y-2">
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Custom amount"
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              className="bg-black/50 border-white/10 text-white placeholder:text-gray-500"
              step="0.1"
              min="0"
            />
            <Button
              className="bg-cyan-500 hover:bg-cyan-600 text-black font-semibold"
              onClick={() => handleDonate(Number.parseFloat(customAmount) || 0)}
              disabled={isLoading || !customAmount || !viewerName.trim()}
            >
              Send
            </Button>
          </div>
          <p className="text-xs text-gray-500">Platform fee: ~2% (fetched from on-chain config)</p>
        </div>
      </CardContent>
    </Card>
  )
}
