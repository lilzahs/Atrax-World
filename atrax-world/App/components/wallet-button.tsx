"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useWallet } from "@/lib/solana/wallet-context"
import { useToast } from "@/hooks/use-toast"
import { Wallet, Copy, LogOut, AlertCircle, ExternalLink } from "lucide-react"

export function WalletButton() {
  const { connected, publicKey, connecting, connect, disconnect, isIframe } = useWallet()
  const { toast } = useToast()

  const handleConnect = async () => {
    try {
      await connect()
      toast({
        title: "Wallet Connected",
        description: "Successfully connected to your Solana wallet",
      })
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: error instanceof Error ? error.message : "Failed to connect wallet",
        variant: "destructive",
      })
    }
  }

  const handleCopyAddress = () => {
    if (publicKey) {
      navigator.clipboard.writeText(publicKey.toString())
      toast({
        title: "Address Copied",
        description: "Wallet address copied to clipboard",
      })
    }
  }

  const handleDisconnect = () => {
    disconnect()
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected",
    })
  }

  if (isIframe && !connected) {
    return (
      <div className="flex items-center gap-2">
        <Alert className="border-yellow-500/30 bg-yellow-500/10 py-2 px-3">
          <AlertCircle className="h-4 w-4 text-yellow-500" />
          <AlertDescription className="text-xs text-yellow-500 ml-2">
            Wallet may not work in preview.{" "}
            <button
              onClick={() => window.open(window.location.href, "_blank")}
              className="underline inline-flex items-center gap-1 hover:text-yellow-400"
            >
              Open in new tab <ExternalLink className="h-3 w-3" />
            </button>
          </AlertDescription>
        </Alert>
        <Button
          onClick={handleConnect}
          disabled={connecting}
          className="bg-cyan-500 hover:bg-cyan-600 text-black font-semibold gap-2 whitespace-nowrap"
        >
          <Wallet className="h-4 w-4" />
          {connecting ? "Connecting..." : "Connect Wallet"}
        </Button>
      </div>
    )
  }

  if (!connected) {
    return (
      <Button
        onClick={handleConnect}
        disabled={connecting}
        className="bg-cyan-500 hover:bg-cyan-600 text-black font-semibold gap-2"
      >
        <Wallet className="h-4 w-4" />
        {connecting ? "Connecting..." : "Connect Wallet"}
      </Button>
    )
  }

  const address = publicKey?.toString() || ""
  const shortAddress = `${address.slice(0, 4)}...${address.slice(-4)}`

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="gap-2 border-cyan-400/30 text-cyan-400 bg-transparent hover:bg-cyan-400/10"
        >
          <Wallet className="h-4 w-4" />
          {shortAddress}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 bg-black border-white/10">
        <DropdownMenuLabel className="text-gray-400">Wallet</DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-white/10" />
        <DropdownMenuItem onClick={handleCopyAddress} className="text-white hover:bg-white/10 cursor-pointer">
          <Copy className="mr-2 h-4 w-4" />
          Copy Address
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleDisconnect} className="text-red-400 hover:bg-white/10 cursor-pointer">
          <LogOut className="mr-2 h-4 w-4" />
          Disconnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
