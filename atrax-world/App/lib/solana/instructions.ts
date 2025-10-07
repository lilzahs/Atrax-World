import { type PublicKey, TransactionInstruction, SystemProgram } from "@solana/web3.js"

// Anchor 8-byte discriminators (from IDL)
const IX = {
  claim_room: Buffer.from([62, 51, 97, 121, 144, 160, 43, 85]),
  donate: Buffer.from([121, 186, 218, 211, 73, 70, 196, 180]),
  choose_item: Buffer.from([204, 165, 157, 164, 222, 105, 194, 57]),
  claim_profit: Buffer.from([234, 73, 53, 22, 182, 46, 83, 104]),
  initialize_room_settings: Buffer.from([238, 66, 98, 15, 39, 151, 11, 230]),
  update_room_settings: Buffer.from([251, 172, 220, 119, 59, 238, 106, 191]),
} as const

function encodeString(s: string): Buffer {
  const b = Buffer.from(s, "utf-8")
  const out = Buffer.alloc(4 + b.length)
  out.writeUInt32LE(b.length, 0)
  b.copy(out, 4)
  return out
}

/** claim_room(room_name: string, stream_url: string) */
export function createClaimRoomInstruction(
  programId: PublicKey,
  streamer: PublicKey,
  roomPDA: PublicKey,
  roomName: string,
  streamUrl: string,
): TransactionInstruction {
  const data = Buffer.concat([IX.claim_room, encodeString(roomName), encodeString(streamUrl)])
  return new TransactionInstruction({
    keys: [
      { pubkey: roomPDA, isSigner: false, isWritable: true },
      { pubkey: streamer, isSigner: true, isWritable: true },
      { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
    ],
    programId,
    data,
  })
}

/** donate(amount: u64) */
export function createDonateInstruction(
  programId: PublicKey,
  donor: PublicKey,
  streamer: PublicKey,
  devWallet: PublicKey,
  configPDA: PublicKey,
  amountLamports: number,
): TransactionInstruction {
  const amt = Buffer.alloc(8)
  amt.writeBigUInt64LE(BigInt(amountLamports), 0)
  const data = Buffer.concat([IX.donate, amt])
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

/** choose_item(item_type: u8) */
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
  const t = Buffer.from([itemType & 0xff])
  const data = Buffer.concat([IX.choose_item, t])
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

/** claim_profit(_amount: u64) placeholder */
export function createClaimProfitInstruction(
  programId: PublicKey,
  claimer: PublicKey,
  amountLamports: number,
): TransactionInstruction {
  const amt = Buffer.alloc(8)
  amt.writeBigUInt64LE(BigInt(amountLamports), 0)
  const data = Buffer.concat([IX.claim_profit, amt])
  return new TransactionInstruction({
    keys: [
      { pubkey: claimer, isSigner: true, isWritable: true },
    ],
    programId,
    data,
  })
}

/** initialize_room_settings(item_price: u64) */
export function createInitializeRoomSettingsInstruction(
  programId: PublicKey,
  dev: PublicKey,
  roomSettingsPDA: PublicKey,
  configPDA: PublicKey,
  itemPriceLamports: number,
): TransactionInstruction {
  const price = Buffer.alloc(8)
  price.writeBigUInt64LE(BigInt(itemPriceLamports), 0)
  const data = Buffer.concat([IX.initialize_room_settings, price])
  return new TransactionInstruction({
    keys: [
      { pubkey: roomSettingsPDA, isSigner: false, isWritable: true },
      { pubkey: configPDA, isSigner: false, isWritable: false },
      { pubkey: dev, isSigner: true, isWritable: true },
      { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
    ],
    programId,
    data,
  })
}

/** update_room_settings(new_item_price: u64) */
export function createUpdateRoomSettingsInstruction(
  programId: PublicKey,
  dev: PublicKey,
  roomSettingsPDA: PublicKey,
  configPDA: PublicKey,
  newItemPriceLamports: number,
): TransactionInstruction {
  const price = Buffer.alloc(8)
  price.writeBigUInt64LE(BigInt(newItemPriceLamports), 0)
  const data = Buffer.concat([IX.update_room_settings, price])
  return new TransactionInstruction({
    keys: [
      { pubkey: roomSettingsPDA, isSigner: false, isWritable: true },
      { pubkey: configPDA, isSigner: false, isWritable: false },
      { pubkey: dev, isSigner: true, isWritable: true },
    ],
    programId,
    data,
  })
}
