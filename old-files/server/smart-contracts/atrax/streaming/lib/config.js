import { clusterApiUrl, PublicKey } from '@solana/web3.js';
import idl from '../idl/atrax.json';

export const NETWORK = process.env.NEXT_PUBLIC_NETWORK || 'devnet';
export const RPC_ENDPOINT = process.env.NEXT_PUBLIC_RPC_ENDPOINT || clusterApiUrl(NETWORK);

export const ATRAX_PROGRAM_ID = process.env.NEXT_PUBLIC_ATRAX_PROGRAM_ID || (idl && idl.address) || '';

// Compute Config PDA from program id if not provided
function computeConfigPda(programIdStr) {
  try {
    const programId = new PublicKey(programIdStr);
    const seed = typeof TextEncoder !== 'undefined' ? new TextEncoder().encode('config') : Buffer.from('config');
    const [pda] = PublicKey.findProgramAddressSync([seed], programId);
    return pda.toBase58();
  } catch (_) {
    return '';
  }
}

export const ATRAX_CONFIG_PDA = process.env.NEXT_PUBLIC_ATRAX_CONFIG_PDA || computeConfigPda(ATRAX_PROGRAM_ID);
export const DEV_WALLET = process.env.NEXT_PUBLIC_DEV_WALLET || '';
