"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { WalletButton } from "@/components/wallet-button"
import Link from "next/link"
import { ArrowLeft, Copy, ExternalLink, Coins, Info, Zap, Video } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import { useWallet } from "@/lib/solana/wallet-context"

export default function StreamerDashboard() {
  const [youtubeUrl, setYoutubeUrl] = useState("")
  const [roomName, setRoomName] = useState("")
  const [generatedLink, setGeneratedLink] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [roomClaimed, setRoomClaimed] = useState(false)
  const { toast } = useToast()
  const { connected, publicKey } = useWallet()

  const feePercentage = 2.0
  const totalEarnings = 45.8
  const claimableAmount = 43.5

  const extractVideoId = (url: string): string | null => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/,
      /youtube\.com\/embed\/([^&\s]+)/,
      /youtube\.com\/v\/([^&\s]+)/,
    ]

    for (const pattern of patterns) {
      const match = url.match(pattern)
      if (match) return match[1]
    }
    return null
  }

  const handleGenerateLink = () => {
    if (!connected || !publicKey) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to generate a viewer link",
        variant: "destructive",
      })
      return
    }

    if (!roomClaimed) {
      toast({
        title: "Claim Room First",
        description: "You must claim your room before generating a viewer link",
        variant: "destructive",
      })
      return
    }

    const videoId = extractVideoId(youtubeUrl)
    if (!videoId) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid YouTube URL",
        variant: "destructive",
      })
      return
    }

    const streamerAddress = publicKey.toString()

    const viewerLink = `${window.location.origin}/viewer?video=${videoId}&streamer=${streamerAddress}`
    setGeneratedLink(viewerLink)

    toast({
      title: "Link Generated!",
      description: "Share this link with your viewers",
    })
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(generatedLink)
    toast({
      title: "Copied!",
      description: "Viewer link copied to clipboard",
    })
  }

  const handleClaimRoom = async () => {
    if (!connected || !publicKey) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to claim a room",
        variant: "destructive",
      })
      return
    }

    if (!roomName.trim()) {
      toast({
        title: "Room Name Required",
        description: "Please enter a room name (max 50 characters)",
        variant: "destructive",
      })
      return
    }

    if (roomName.length > 50) {
      toast({
        title: "Room Name Too Long",
        description: "Room name must be 50 characters or less",
        variant: "destructive",
      })
      return
    }

    if (!youtubeUrl.trim()) {
      toast({
        title: "YouTube URL Required",
        description: "Please enter your YouTube stream URL",
        variant: "destructive",
      })
      return
    }

    const videoId = extractVideoId(youtubeUrl)
    if (!videoId) {
      toast({
        title: "Invalid YouTube URL",
        description: "Please enter a valid YouTube URL",
        variant: "destructive",
      })
      return
    }

    if (youtubeUrl.length > 200) {
      toast({
        title: "URL Too Long",
        description: "Stream URL must be 200 characters or less",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      console.log("[v0] Claiming room with name:", roomName, "and URL:", youtubeUrl)
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setRoomClaimed(true)
      toast({
        title: "Room Claimed!",
        description: `"${roomName}" is now active. You can update it anytime.`,
      })
    } catch (error) {
      toast({
        title: "Claim Failed",
        description: "Please try again",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleClaimProfit = async () => {
    if (!connected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to claim profits",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      console.log("[v0] Claiming profit...")
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Profit Claimed!",
        description: `${claimableAmount} SOL transferred to your wallet`,
      })
    } catch (error) {
      toast({
        title: "Claim Failed",
        description: "Please try again",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="border-b border-white/10 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="gap-2 text-gray-400 hover:text-white">
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <Zap className="h-6 w-6 text-cyan-400" />
              <span className="text-xl font-bold">Streamer Dashboard</span>
            </div>
          </div>
          <WalletButton />
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-6">
          <Card className="bg-white/5 border-white/10 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Video className="h-5 w-5 text-cyan-400" />
                {roomClaimed ? "Update Room" : "Claim Your Room"}
              </CardTitle>
              <CardDescription className="text-gray-400">
                {roomClaimed
                  ? "Update your room name or stream URL anytime"
                  : "Set up your streaming room to start earning"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="room-name" className="text-gray-300">
                  Room Name <span className="text-red-400">*</span>
                </Label>
                <Input
                  id="room-name"
                  type="text"
                  placeholder="My Awesome Stream"
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                  maxLength={50}
                  className="bg-black/50 border-white/10 text-white placeholder:text-gray-500"
                />
                <p className="text-xs text-gray-500">{roomName.length}/50 characters</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="youtube-url" className="text-gray-300">
                  YouTube Stream URL <span className="text-red-400">*</span>
                </Label>
                <Input
                  id="youtube-url"
                  type="url"
                  placeholder="https://youtube.com/watch?v=..."
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  maxLength={200}
                  className="bg-black/50 border-white/10 text-white placeholder:text-gray-500"
                />
                <p className="text-xs text-gray-500">{youtubeUrl.length}/200 characters</p>
              </div>

              <Button
                className="w-full bg-cyan-500 hover:bg-cyan-600 text-black font-semibold"
                onClick={handleClaimRoom}
                disabled={isLoading}
              >
                {roomClaimed ? "Update Room" : "Claim Room"}
              </Button>

              {roomClaimed && (
                <Alert className="bg-green-500/10 border-green-400/30">
                  <Info className="h-4 w-4 text-green-400" />
                  <AlertDescription className="text-gray-300">
                    Room claimed! You can now generate viewer links and update your room anytime.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-4">
            <Card className="bg-white/5 border-white/10 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Coins className="h-5 w-5 text-green-400" />
                  Total Earnings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-green-400">{totalEarnings} SOL</p>
                <p className="text-sm text-gray-400 mt-1">Lifetime donations received</p>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Coins className="h-5 w-5 text-cyan-400" />
                  Claimable
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-cyan-400">{claimableAmount} SOL</p>
                <Button
                  className="mt-3 bg-cyan-500 hover:bg-cyan-600 text-black font-semibold w-full"
                  onClick={handleClaimProfit}
                  disabled={isLoading || claimableAmount === 0}
                >
                  Claim Profit
                </Button>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-white/5 border-white/10 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Info className="h-5 w-5 text-blue-400" />
                Platform Fee
              </CardTitle>
              <CardDescription className="text-gray-400">Fetched from on-chain config</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Current fee rate:</span>
                <span className="text-2xl font-bold text-white">{feePercentage}%</span>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                This fee is applied to all donations and helps maintain the platform.
              </p>
            </CardContent>
          </Card>

          {roomClaimed && (
            <Card className="bg-white/5 border-white/10 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <ExternalLink className="h-5 w-5 text-purple-400" />
                  Generate Viewer Link
                </CardTitle>
                <CardDescription className="text-gray-400">Create a shareable link for your viewers</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  className="w-full bg-purple-500 hover:bg-purple-600 text-white font-semibold"
                  onClick={handleGenerateLink}
                >
                  Generate Link
                </Button>

                {generatedLink && (
                  <div className="space-y-2 p-4 bg-black/50 rounded-lg border border-white/10">
                    <Label className="text-gray-300">Your Viewer Link</Label>
                    <div className="flex gap-2">
                      <Input
                        value={generatedLink}
                        readOnly
                        className="bg-black/50 border-white/10 text-cyan-400 font-mono text-sm"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={handleCopyLink}
                        className="border-white/10 bg-transparent"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" asChild className="border-white/10 bg-transparent">
                        <a href={generatedLink} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500">
                      Share this link with your viewers to start receiving donations
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          <Card className="bg-white/5 border-white/10 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-white">OBS Overlay Setup</CardTitle>
              <CardDescription className="text-gray-400">Add donation alerts to your stream</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm text-gray-400">
                <p>1. Open OBS and add a new Browser Source</p>
                <p>2. Enter your overlay URL (coming soon)</p>
                <p>3. Set dimensions to 1920x1080</p>
                <p>4. Position the overlay on your stream layout</p>
              </div>
              <Button variant="outline" className="mt-4 border-white/10 text-gray-400 bg-transparent" disabled>
                Get Overlay URL (Coming Soon)
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
