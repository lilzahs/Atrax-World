import { PublicKey } from "@solana/web3.js"

/**
 * Derives PDA for config account
 */
export async function getConfigPDA(programId: PublicKey): Promise<[PublicKey, number]> {
  return PublicKey.findProgramAddressSync([Buffer.from("config")], programId)
}

/**
 * Derives PDA for room_settings account
 */
export async function getRoomSettingsPDA(programId: PublicKey): Promise<[PublicKey, number]> {
  return PublicKey.findProgramAddressSync([Buffer.from("room_settings")], programId)
}

/**
 * Derives PDA for a specific room by streamer public key
 */
export async function getRoomPDA(programId: PublicKey, streamer: PublicKey): Promise<[PublicKey, number]> {
  return PublicKey.findProgramAddressSync([Buffer.from("room"), streamer.toBuffer()], programId)
}
