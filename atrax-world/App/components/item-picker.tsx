"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Gamepad2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { ITEM_COUNT } from "@/lib/solana/config"
import { useWallet } from "@/lib/solana/wallet-context"

export function ItemPicker() {
  const [selectedItem, setSelectedItem] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [itemPrice, setItemPrice] = useState<number | null>(null)
  const [viewerName, setViewerName] = useState("")
  const { toast } = useToast()
  const { connected } = useWallet()

  useEffect(() => {
    const savedName = localStorage.getItem("atrax_viewer_name")
    if (savedName) {
      setViewerName(savedName)
    }
  }, [])

  useEffect(() => {
    const fetchItemPrice = async () => {
      try {
        console.log("[v0] Fetching item price from room_settings PDA...")
        // TODO: Fetch from on-chain room_settings PDA
        // const settings = await getRoomSettings()
        // setItemPrice(settings.item_price / LAMPORTS_PER_SOL)

        // Mock data for now
        await new Promise((resolve) => setTimeout(resolve, 500))
        setItemPrice(0.1) // 0.1 SOL per item
      } catch (error) {
        console.error("[v0] Failed to fetch item price:", error)
        toast({
          title: "Failed to Load Price",
          description: "Could not fetch item price from on-chain",
          variant: "destructive",
        })
      }
    }

    fetchItemPrice()
  }, [toast])

  const handleChooseItem = async (itemIndex: number) => {
    if (!connected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to choose items",
        variant: "destructive",
      })
      return
    }

    if (!viewerName.trim()) {
      toast({
        title: "Name Required",
        description: "Please enter your name before choosing items",
        variant: "destructive",
      })
      return
    }

    if (itemPrice === null) {
      toast({
        title: "Price Not Loaded",
        description: "Please wait for item price to load",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      console.log("[v0] Choosing item:", itemIndex, "for", itemPrice, "SOL", "by", viewerName)
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Item Selected!",
        description: `${viewerName} chose Item ${itemIndex} for ${itemPrice} SOL`,
      })
      setSelectedItem(itemIndex)
    } catch (error) {
      toast({
        title: "Selection Failed",
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
          <Gamepad2 className="h-5 w-5 text-purple-400" />
          <CardTitle className="text-white">Choose Item</CardTitle>
        </div>
        <CardDescription className="text-gray-400">
          {itemPrice !== null ? `${itemPrice} SOL per item` : "Loading price..."}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="viewer-name" className="text-sm text-gray-400">
            Your Name
          </label>
          <input
            id="viewer-name"
            type="text"
            placeholder="Enter your name"
            value={viewerName}
            onChange={(e) => handleNameChange(e.target.value)}
            className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-md text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-400"
            maxLength={30}
          />
        </div>

        <div className="grid grid-cols-4 gap-2">
          {Array.from({ length: ITEM_COUNT }, (_, i) => {
            const itemNumber = i + 1 // Items 1-8
            return (
              <Button
                key={itemNumber}
                variant={selectedItem === itemNumber ? "default" : "outline"}
                className={
                  selectedItem === itemNumber
                    ? "bg-purple-500 hover:bg-purple-600 text-white"
                    : "border-purple-400/30 text-purple-400 hover:bg-purple-400/10 bg-transparent"
                }
                onClick={() => handleChooseItem(itemNumber)}
                disabled={isLoading || itemPrice === null || !viewerName.trim()}
              >
                {itemNumber}
              </Button>
            )
          })}
        </div>
        <p className="text-xs text-gray-500">
          {itemPrice !== null ? `Fixed price: ${itemPrice} SOL` : "Fetching price from on-chain..."}
        </p>
      </CardContent>
    </Card>
  )
}
