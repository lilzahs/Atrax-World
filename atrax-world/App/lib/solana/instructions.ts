import { type PublicKey, TransactionInstruction, SystemProgram } from "@solana/web3.js"

// Instruction discriminators (example - adjust based on your program)
enum InstructionType {
  ClaimRoom = 0,
  Donate = 1,
  ChooseItem = 2,
  ClaimProfit = 3,
  InitializeRoomSettings = 4,
  UpdateRoomSettings = 5,
}

/**
 * Creates a claim_room instruction
 * Updated to include room_name and stream_url parameters
 */
export function createClaimRoomInstruction(
  programId: PublicKey,
  streamer: PublicKey,
  roomPDA: PublicKey,
  roomName: string,
  streamUrl: string,
): TransactionInstruction {
  // Encode strings as UTF-8 with length prefix
  const roomNameBytes = Buffer.from(roomName, "utf-8")
  const streamUrlBytes = Buffer.from(streamUrl, "utf-8")

  // Calculate total data size: discriminator (1) + room_name_len (4) + room_name + stream_url_len (4) + stream_url
  const data = Buffer.alloc(1 + 4 + roomNameBytes.length + 4 + streamUrlBytes.length)
  let offset = 0

  // Write discriminator
  data.writeUInt8(InstructionType.ClaimRoom, offset)
  offset += 1

  // Write room_name length and bytes
  data.writeUInt32LE(roomNameBytes.length, offset)
  offset += 4
  roomNameBytes.copy(data, offset)
  offset += roomNameBytes.length

  // Write stream_url length and bytes
  data.writeUInt32LE(streamUrlBytes.length, offset)
  offset += 4
  streamUrlBytes.copy(data, offset)

  return new TransactionInstruction({
    keys: [
      { pubkey: streamer, isSigner: true, isWritable: true },
      { pubkey: roomPDA, isSigner: false, isWritable: true },
      { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
    ],
    programId,
    data,
  })
}

/**
 * Creates a donate instruction
 * Updated to match on-chain donate instruction (requires config, dev_wallet)
 */
export function createDonateInstruction(
  programId: PublicKey,
  donor: PublicKey,
  streamer: PublicKey,
  devWallet: PublicKey,
  configPDA: PublicKey,
  amount: number,
): TransactionInstruction {
  const data = Buffer.alloc(9)
  data.writeUInt8(InstructionType.Donate, 0)
  data.writeBigUInt64LE(BigInt(amount), 1)

  return new TransactionInstruction({
    keys: [
      { pubkey: donor, isSigner: true, isWritable: true },
      { pubkey: streamer, isSigner: false, isWritable: true },
      { pubkey: devWallet, isSigner: false, isWritable: true },
      { pubkey: configPDA, isSigner: false, isWritable: false },
      { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
    ],
    programId,
    data,
  })
}

/**
 * Creates a choose_item instruction
 * Updated to match on-chain choose_item (requires config, room_settings, dev_wallet, streamer)
 */
export function createChooseItemInstruction(
  programId: PublicKey,
  buyer: PublicKey,
  streamer: PublicKey,
  devWallet: PublicKey,
  configPDA: PublicKey,
  roomSettingsPDA: PublicKey,
  roomPDA: PublicKey,
  itemType: number,
): TransactionInstruction {
  const data = Buffer.alloc(2)
  data.writeUInt8(InstructionType.ChooseItem, 0)
  data.writeUInt8(itemType, 1)

  return new TransactionInstruction({
    keys: [
      { pubkey: configPDA, isSigner: false, isWritable: false },
      { pubkey: roomSettingsPDA, isSigner: false, isWritable: false },
      { pubkey: roomPDA, isSigner: false, isWritable: true },
      { pubkey: buyer, isSigner: true, isWritable: true },
      { pubkey: streamer, isSigner: false, isWritable: true },
      { pubkey: devWallet, isSigner: false, isWritable: true },
      { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
    ],
    programId,
    data,
  })
}

/**
 * Creates a claim_profit instruction
 */
export function createClaimProfitInstruction(
  programId: PublicKey,
  streamer: PublicKey,
  roomPDA: PublicKey,
): TransactionInstruction {
  const data = Buffer.from([InstructionType.ClaimProfit])

  return new TransactionInstruction({
    keys: [
      { pubkey: streamer, isSigner: true, isWritable: true },
      { pubkey: roomPDA, isSigner: false, isWritable: true },
      { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
    ],
    programId,
    data,
  })
}
