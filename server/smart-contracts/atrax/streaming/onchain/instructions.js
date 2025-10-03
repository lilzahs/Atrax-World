// Thin, browser-safe instruction helpers. Lazily import Anchor to avoid SSR issues.

export async function donate({ connection, wallet, streamer, lamports, programId, configPda, devWallet, idl }) {
  if (!wallet?.publicKey) throw new Error('Wallet not connected');
  const { PublicKey, SystemProgram } = await import('@solana/web3.js');
  const { AnchorProvider, Program, BN } = await import('@coral-xyz/anchor');
  const idlJson = idl || (await import('../idl/atrax.json')).default;

  const provider = new AnchorProvider(connection, wallet, { preflightCommitment: 'confirmed' });
  // Prefer IDL-bundled address; fall back to explicit programId if needed
  const program = idlJson?.address
    ? new Program(idlJson, provider)
    : new Program(idlJson, new PublicKey(programId), provider);

  const donor = wallet.publicKey;
  const streamerPk = new PublicKey(streamer);
  const devPk = new PublicKey(devWallet);
  const seed = typeof TextEncoder !== 'undefined' ? new TextEncoder().encode('config') : Buffer.from('config');
  const [derivedConfig] = PublicKey.findProgramAddressSync([seed], program.programId);
  const configPk = configPda ? new PublicKey(configPda) : derivedConfig;
  const amount = new BN(lamports);

  return await program.methods
    .donate(amount)
    .accounts({ donor, streamer: streamerPk, devWallet: devPk, config: configPk, systemProgram: SystemProgram.programId })
    .rpc();
}

export async function buyItem({ connection, wallet, itemId, amountLamports, programId, configPda, devWallet, idl }) {
  if (!wallet?.publicKey) throw new Error('Wallet not connected');
  const { PublicKey, SystemProgram } = await import('@solana/web3.js');
  const { AnchorProvider, Program, BN } = await import('@coral-xyz/anchor');
  const idlJson = idl || (await import('../idl/atrax.json')).default;

  const provider = new AnchorProvider(connection, wallet, { preflightCommitment: 'confirmed' });
  const program = idlJson?.address
    ? new Program(idlJson, provider)
    : new Program(idlJson, new PublicKey(programId), provider);

  const payer = wallet.publicKey;
  const devPk = new PublicKey(devWallet);
  const seed = typeof TextEncoder !== 'undefined' ? new TextEncoder().encode('config') : Buffer.from('config');
  const [derivedConfig] = PublicKey.findProgramAddressSync([seed], program.programId);
  const configPk = configPda ? new PublicKey(configPda) : derivedConfig;
  const amount = new BN(amountLamports);

  return await program.methods
    .buyItem(itemId, amount)
    .accounts({ payer, devWallet: devPk, config: configPk, systemProgram: SystemProgram.programId })
    .rpc();
}

export async function claimProfit({ connection, wallet, amountLamports, programId, idl }) {
  if (!wallet?.publicKey) throw new Error('Wallet not connected');
  const { PublicKey } = await import('@solana/web3.js');
  const { AnchorProvider, Program, BN } = await import('@coral-xyz/anchor');
  const idlJson = idl || (await import('../idl/atrax.json')).default;

  const provider = new AnchorProvider(connection, wallet, { preflightCommitment: 'confirmed' });
  const program = idlJson?.address
    ? new Program(idlJson, provider)
    : new Program(idlJson, new PublicKey(programId), provider);
  const claimer = wallet.publicKey;
  const amount = new BN(amountLamports);

  return await program.methods
    .claimProfit(amount)
    .accounts({ claimer })
    .rpc();
}
