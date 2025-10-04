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
  const admin = new PublicKey(data.slice(off, off + 32));
  const devWallet = new PublicKey(data.slice(off + 32, off + 64));
  const dv = new DataView(data.buffer, data.byteOffset, data.byteLength);
  const feeBps = dv.getUint16(off + 64, true);
  return { pda: configPda, admin, devWallet, feeBps };
}
