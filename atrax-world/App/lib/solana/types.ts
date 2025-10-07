import type { PublicKey } from "@solana/web3.js"

export interface DonationEvent {
  donor: PublicKey
  streamer: PublicKey
  amount: number
  timestamp: number
}

export interface ItemChosenEvent {
  user: PublicKey
  itemIndex: number
  timestamp: number
}

export interface RoomClaimedEvent {
  streamer: PublicKey
  timestamp: number
}

export interface RoomData {
  roomName: string
  streamUrl: string
  playerWallet: PublicKey
  latestChosenItem: number
  lastBuyer: PublicKey
}

export interface ConfigData {
  devWallet: PublicKey
  feeBps: number
  bump: number
}

export interface RoomSettingsData {
  itemPrice: number // in lamports
  bump: number
}

export interface LeaderboardEntry {
  address: string
  amount: number
  displayName?: string
}
