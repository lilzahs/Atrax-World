"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import type { PublicKey } from "@solana/web3.js"

type WalletType = "phantom" | "solflare" | "backpack" | null

interface WalletContextType {
  connected: boolean
  publicKey: PublicKey | null
  connecting: boolean
  connect: () => Promise<void>
  disconnect: () => void
  isIframe: boolean
  walletType: WalletType
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

export function WalletProvider({ children }: { children: ReactNode }) {
  const [connected, setConnected] = useState(false)
  const [publicKey, setPublicKey] = useState<PublicKey | null>(null)
  const [connecting, setConnecting] = useState(false)
  const [isIframe, setIsIframe] = useState(false)
  const [walletType, setWalletType] = useState<WalletType>(null)

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsIframe(window.self !== window.top)
    }
  }, [])

  // Check if wallet is already connected on mount
  useEffect(() => {
    const checkConnection = async () => {
      if (typeof window !== "undefined") {
        if ("solana" in window) {
          const solana = (window as any).solana
          if (solana?.isPhantom && solana.isConnected) {
            try {
              const response = await solana.connect({ onlyIfTrusted: true })
              setPublicKey(response.publicKey)
              setConnected(true)
              setWalletType("phantom")
            } catch (error) {
              console.log("[v0] Phantom not auto-connected")
            }
          }
        }

        if ("solflare" in window) {
          const solflare = (window as any).solflare
          if (solflare?.isConnected) {
            try {
              setPublicKey(solflare.publicKey)
              setConnected(true)
              setWalletType("solflare")
            } catch (error) {
              console.log("[v0] Solflare not auto-connected")
            }
          }
        }

        if ("backpack" in window) {
          const backpack = (window as any).backpack
          if (backpack?.isConnected) {
            try {
              setPublicKey(backpack.publicKey)
              setConnected(true)
              setWalletType("backpack")
            } catch (error) {
              console.log("[v0] Backpack not auto-connected")
            }
          }
        }
      }
    }
    checkConnection()
  }, [])

  const connect = async () => {
    setConnecting(true)
    try {
      if (typeof window === "undefined") {
        throw new Error("Window not available")
      }

      if (isIframe) {
        console.warn("[v0] Running in iframe - wallet connection may have limitations")
      }

      if ("solana" in window) {
        const solana = (window as any).solana
        if (solana?.isPhantom) {
          try {
            const response = await solana.connect()
            setPublicKey(response.publicKey)
            setConnected(true)
            setWalletType("phantom")
            console.log("[v0] Connected to Phantom:", response.publicKey.toString())
            return
          } catch (error: any) {
            if (error.message?.includes("origins don't match") || error.message?.includes("origin")) {
              if (solana.publicKey) {
                setPublicKey(solana.publicKey)
                setConnected(true)
                setWalletType("phantom")
                console.log("[v0] Connected despite origin warning:", solana.publicKey.toString())
                return
              }
              throw new Error(
                "Wallet connection blocked due to iframe restrictions. Please open this preview in a new tab or deploy the app to test wallet functionality.",
              )
            }
            throw error
          }
        }
      }

      if ("solflare" in window) {
        const solflare = (window as any).solflare
        try {
          await solflare.connect()
          setPublicKey(solflare.publicKey)
          setConnected(true)
          setWalletType("solflare")
          console.log("[v0] Connected to Solflare:", solflare.publicKey.toString())
          return
        } catch (error: any) {
          if (error.message?.includes("origins don't match") || error.message?.includes("origin")) {
            throw new Error(
              "Wallet connection blocked due to iframe restrictions. Please open this preview in a new tab or deploy the app to test wallet functionality.",
            )
          }
          console.error("[v0] Solflare connection failed:", error)
        }
      }

      if ("backpack" in window) {
        const backpack = (window as any).backpack
        try {
          await backpack.connect()
          setPublicKey(backpack.publicKey)
          setConnected(true)
          setWalletType("backpack")
          console.log("[v0] Connected to Backpack:", backpack.publicKey.toString())
          return
        } catch (error: any) {
          if (error.message?.includes("origins don't match") || error.message?.includes("origin")) {
            throw new Error(
              "Wallet connection blocked due to iframe restrictions. Please open this preview in a new tab or deploy the app to test wallet functionality.",
            )
          }
          console.error("[v0] Backpack connection failed:", error)
        }
      }

      throw new Error("No Solana wallet found. Please install Phantom, Solflare, or Backpack.")
    } catch (error) {
      console.error("[v0] Wallet connection error:", error)
      throw error
    } finally {
      setConnecting(false)
    }
  }

  const disconnect = () => {
    if (typeof window !== "undefined") {
      if (walletType === "phantom" && "solana" in window) {
        const solana = (window as any).solana
        if (solana?.isPhantom) {
          solana.disconnect()
        }
      } else if (walletType === "solflare" && "solflare" in window) {
        const solflare = (window as any).solflare
        solflare.disconnect()
      } else if (walletType === "backpack" && "backpack" in window) {
        const backpack = (window as any).backpack
        backpack.disconnect()
      }
    }
    setConnected(false)
    setPublicKey(null)
    setWalletType(null)
    console.log("[v0] Wallet disconnected")
  }

  return (
    <WalletContext.Provider value={{ connected, publicKey, connecting, connect, disconnect, isIframe, walletType }}>
      {children}
    </WalletContext.Provider>
  )
}

export function useWallet() {
  const context = useContext(WalletContext)
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider")
  }
  return context
}
