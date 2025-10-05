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
