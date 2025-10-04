import { Connection, PublicKey, clusterApiUrl, SystemProgram } from '@solana/web3.js';
import { AnchorProvider, Program, Idl } from '@coral-xyz/anchor';
import { Buffer } from 'buffer';
import idl from './idl/atrax.json';

export const PROGRAM_ID = new PublicKey((idl as any).address);

export function getConnection(): Connection {
  const rpc = import.meta.env.VITE_RPC_URL || clusterApiUrl('devnet');
  return new Connection(rpc, 'confirmed');
}

export function getProvider(wallet: any): AnchorProvider {
  return new AnchorProvider(getConnection(), wallet, { preflightCommitment: 'confirmed' });
}

export function getProgram(provider: AnchorProvider): Program<Idl> {
  return new Program(idl as Idl, provider as any);
}

export async function loadProgram(provider: AnchorProvider): Promise<Program<Idl>> {
  const chainIdl = await Program.fetchIdl(PROGRAM_ID, provider);
  if (!chainIdl) throw new Error('IDL not found on-chain. Run anchor build && anchor deploy.');
  return new Program(chainIdl as Idl, provider as any);
}

export function findConfigPda(): [PublicKey, number] {
  return PublicKey.findProgramAddressSync([Buffer.from('config')], PROGRAM_ID);
}

export function findLandPda(owner: PublicKey): [PublicKey, number] {
  return PublicKey.findProgramAddressSync([Buffer.from('land'), owner.toBuffer()], PROGRAM_ID);
}

export { SystemProgram };
