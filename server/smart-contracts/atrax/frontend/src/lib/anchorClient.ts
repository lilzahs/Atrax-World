// Client-only helpers for Anchor + Solana
export type WalletType = 'phantom' | 'solflare';

export const DEFAULT_PROGRAM_ID_STR = '35eYtQ3hgAqmDUtwcEQ6WFKfQri7figJGe9vR25mmMiC';
export let PROGRAM_ID_STR = (process.env.NEXT_PUBLIC_ATRAX_PROGRAM_ID || DEFAULT_PROGRAM_ID_STR).trim();
export function setProgramIdStr(s: string) { PROGRAM_ID_STR = (s || '').trim(); }

async function loadIdl(): Promise<any> {
  // Load from Next.js public folder to avoid bundler JSON issues
  const res = await fetch('/idl/atrax.json');
  if (!res.ok) throw new Error('IDL not found at /idl/atrax.json');
  return res.json();
}

export async function getProgram(walletType: WalletType = 'phantom') {
  const idl = await loadIdl();
  const anchor = await import('@coral-xyz/anchor');
  const web3 = await import('@solana/web3.js');

  // Use built-in/env Program ID by default; if missing, fallback to IDL.address
  let pidStr = PROGRAM_ID_STR;
  const idlAddr = (idl as any)?.address || (idl as any)?.metadata?.address;
  if (!pidStr && idlAddr) pidStr = String(idlAddr);
  if (!pidStr) throw new Error('Program ID not set');
  const programId = new web3.PublicKey(pidStr);

  const anyWindow = window as any;
  let adapter: any = null;
  if (walletType === 'phantom' && anyWindow?.solana?.isPhantom) adapter = anyWindow.solana;
  if (walletType === 'solflare' && anyWindow?.solflare?.isSolflare) adapter = anyWindow.solflare;
  if (!adapter) throw new Error(`${walletType} wallet not found`);
  if (typeof adapter.connect === 'function') await adapter.connect();

  const connection = new web3.Connection(web3.clusterApiUrl('devnet'), 'confirmed');
  const provider = new (anchor as any).AnchorProvider(connection, adapter, { commitment: 'confirmed' });
  (anchor as any).setProvider(provider);
  const program = new (anchor as any).Program(idl as any, programId, provider);
  return program;
}

export async function deriveConfigPda(programId: any) {
  const web3 = await import('@solana/web3.js');
  return (web3.PublicKey as any).findProgramAddressSync([new TextEncoder().encode('config')], programId)[0];
}

export async function deriveLandPda(programId: any, owner: any) {
  const web3 = await import('@solana/web3.js');
  return (web3.PublicKey as any).findProgramAddressSync([new TextEncoder().encode('land'), owner.toBuffer()], programId)[0];
}

export async function PublicKey() {
  const web3 = await import('@solana/web3.js');
  return web3.PublicKey;
}

export async function SystemProgram() {
  const web3 = await import('@solana/web3.js');
  return web3.SystemProgram;
}

export async function anchor() {
  return await import('@coral-xyz/anchor');
}
