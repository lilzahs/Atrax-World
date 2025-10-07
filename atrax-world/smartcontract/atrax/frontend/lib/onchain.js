import { PublicKey } from '@solana/web3.js';
import { ATRAX_PROGRAM_ID } from './config';

function getConfigPda(programIdStr) {
  const programId = new PublicKey(programIdStr);
  const seed = typeof TextEncoder !== 'undefined' ? new TextEncoder().encode('config') : Buffer.from('config');
  const [pda] = PublicKey.findProgramAddressSync([seed], programId);
  return pda;
}

export async function fetchConfig(connection) {
  if (!ATRAX_PROGRAM_ID) throw new Error('Program ID is not set');
  const configPda = getConfigPda(ATRAX_PROGRAM_ID);
  const ai = await connection.getAccountInfo(configPda);
  if (!ai) return null;
  const data = new Uint8Array(ai.data);
  const off = 8; // anchor account discriminator
  const dv = new DataView(data.buffer, data.byteOffset, data.byteLength);
  // Backward compatibility: detect old layout (admin + dev + fee + bump)
  const isOld = data.length >= off + 32 + 32 + 2 + 1;
  let devWallet, feeBps;
  if (isOld) {
    devWallet = new PublicKey(data.slice(off + 32, off + 64));
    feeBps = dv.getUint16(off + 64, true);
  } else {
    devWallet = new PublicKey(data.slice(off, off + 32));
    feeBps = dv.getUint16(off + 32, true);
  }
  return { pda: configPda, devWallet, feeBps };
}

function getRoomSettingsPda(programIdStr) {
  const programId = new PublicKey(programIdStr);
  const seed = typeof TextEncoder !== 'undefined' ? new TextEncoder().encode('room_settings') : Buffer.from('room_settings');
  const [pda] = PublicKey.findProgramAddressSync([seed], programId);
  return pda;
}

export async function fetchRoomSettings(connection, programIdStr = ATRAX_PROGRAM_ID) {
  if (!programIdStr) throw new Error('Program ID is not set');
  const pda = getRoomSettingsPda(programIdStr);
  const ai = await connection.getAccountInfo(pda);
  if (!ai) return null;
  const data = new Uint8Array(ai.data);
  const off = 8; // discriminator
  const dv = new DataView(data.buffer, data.byteOffset, data.byteLength);
  // Backward compatibility with old layout that had admin: Pubkey first
  const isOld = data.length >= off + 32 + 8 + 1;
  let itemBig;
  if (isOld) {
    itemBig = dv.getBigUint64(off + 32, true);
  } else {
    itemBig = dv.getBigUint64(off + 0, true);
  }
  return { pda, priceLamports: itemBig.toString() };
}

// Room PDA: seed by streamer pubkey
export function getRoomPda(programIdStr = ATRAX_PROGRAM_ID, streamerPubkey) {
  if (!programIdStr) throw new Error('Program ID is not set');
  const programId = new PublicKey(programIdStr);
  const seedA = typeof TextEncoder !== 'undefined' ? new TextEncoder().encode('room') : Buffer.from('room');
  const spk = new PublicKey(streamerPubkey);
  const [pda] = PublicKey.findProgramAddressSync([seedA, spk.toBytes()], programId);
  return pda;
}

export async function fetchRoom(connection, programIdStr = ATRAX_PROGRAM_ID, streamerPubkey) {
  const pda = getRoomPda(programIdStr, streamerPubkey);
  const ai = await connection.getAccountInfo(pda);
  if (!ai) return null;
  const data = new Uint8Array(ai.data);
  const dv = new DataView(data.buffer, data.byteOffset, data.byteLength);
  let off = 8; // discriminator
  // room_name: String
  const nameLen = dv.getUint32(off, true);
  const nameStart = off + 4;
  const nameEnd = nameStart + nameLen;
  const roomName = (typeof TextDecoder !== 'undefined') ? new TextDecoder().decode(data.slice(nameStart, nameEnd)) : '';
  off = nameEnd;
  // stream_url: String
  const urlLen = dv.getUint32(off, true);
  const urlStart = off + 4;
  const urlEnd = urlStart + urlLen;
  const streamUrl = (typeof TextDecoder !== 'undefined') ? new TextDecoder().decode(data.slice(urlStart, urlEnd)) : '';
  off = urlEnd;
  // player_wallet
  const playerWallet = new PublicKey(data.slice(off, off + 32)); off += 32;
  const latestChosenItem = data[off]; off += 1;
  const lastBuyer = new PublicKey(data.slice(off, off + 32)); off += 32;
  return { pda, roomName, streamUrl, playerWallet, latestChosenItem, lastBuyer };
}
