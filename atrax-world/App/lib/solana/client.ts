"use client"

import { Connection, PublicKey } from "@solana/web3.js"
import { SOLANA_CONFIG } from "./config"
import { getConfigPDA, getRoomPDA, getRoomSettingsPDA } from "./pda"
import type { ConfigData, RoomData, RoomSettingsData } from "./types"

let connection: Connection | null = null

/**
 * Gets or creates a singleton Solana connection
 */
export function getConnection(): Connection {
  if (!connection) {
    connection = new Connection(SOLANA_CONFIG.rpcEndpoint, "confirmed")
  }
  return connection
}

/**
 * Gets the program ID from config
 */
export function getProgramId(): PublicKey {
  if (!SOLANA_CONFIG.programId) {
    throw new Error("Program ID not configured. Set NEXT_PUBLIC_PROGRAM_ID environment variable.")
  }
  return new PublicKey(SOLANA_CONFIG.programId)
}

/**
 * Fetches the global config account
 */
export async function fetchConfig(): Promise<ConfigData | null> {
  try {
    const connection = getConnection()
    const programId = getProgramId()
    const [configPDA] = await getConfigPDA(programId)

    const accountInfo = await connection.getAccountInfo(configPDA)
    if (!accountInfo) {
      return null
    }

    const data = accountInfo.data
    // Parse Config account: dev_wallet (32) + fee_bps (2) + bump (1)
    const devWallet = new PublicKey(data.slice(8, 40)) // Skip 8-byte discriminator
    const feeBps = data.readUInt16LE(40)
    const bump = data.readUInt8(42)

    return { devWallet, feeBps, bump }
  } catch (error) {
    console.error("[v0] Failed to fetch config:", error)
    return null
  }
}

/**
 * Fetches the room settings account (item price)
 */
export async function fetchRoomSettings(): Promise<RoomSettingsData | null> {
  try {
    const connection = getConnection()
    const programId = getProgramId()
    const [roomSettingsPDA] = await getRoomSettingsPDA(programId)

    const accountInfo = await connection.getAccountInfo(roomSettingsPDA)
    if (!accountInfo) {
      return null
    }

    const data = accountInfo.data
    // Parse RoomSettings account: item_price (8) + bump (1)
    const itemPrice = Number(data.readBigUInt64LE(8)) // Skip 8-byte discriminator
    const bump = data.readUInt8(16)

    return { itemPrice, bump }
  } catch (error) {
    console.error("[v0] Failed to fetch room settings:", error)
    return null
  }
}

/**
 * Fetches a room account for a specific streamer
 */
export async function fetchRoom(streamer: PublicKey): Promise<RoomData | null> {
  try {
    const connection = getConnection()
    const programId = getProgramId()
    const [roomPDA] = await getRoomPDA(programId, streamer)

    const accountInfo = await connection.getAccountInfo(roomPDA)
    if (!accountInfo) {
      return null
    }

    const data = accountInfo.data
    let offset = 8 // Skip discriminator

    // Parse room_name (String with 4-byte length prefix)
    const roomNameLen = data.readUInt32LE(offset)
    offset += 4
    const roomName = data.slice(offset, offset + roomNameLen).toString("utf-8")
    offset += roomNameLen

    // Parse stream_url (String with 4-byte length prefix)
    const streamUrlLen = data.readUInt32LE(offset)
    offset += 4
    const streamUrl = data.slice(offset, offset + streamUrlLen).toString("utf-8")
    offset += streamUrlLen

    // Parse player_wallet (32 bytes)
    const playerWallet = new PublicKey(data.slice(offset, offset + 32))
    offset += 32

    // Parse latest_chosen_item (1 byte)
    const latestChosenItem = data.readUInt8(offset)
    offset += 1

    // Parse last_buyer (32 bytes)
    const lastBuyer = new PublicKey(data.slice(offset, offset + 32))

    return { roomName, streamUrl, playerWallet, latestChosenItem, lastBuyer }
  } catch (error) {
    console.error("[v0] Failed to fetch room:", error)
    return null
  }
}
