// Solana configuration for Atrax Streaming
export const SOLANA_CONFIG = {
  network: (process.env.NEXT_PUBLIC_SOLANA_NETWORK || "devnet") as "devnet" | "mainnet-beta",
  rpcEndpoint: process.env.NEXT_PUBLIC_SOLANA_RPC || "https://api.devnet.solana.com",
  programId: process.env.NEXT_PUBLIC_PROGRAM_ID || "",
} as const

export const ITEM_COUNT = 8 // Items 1-8
