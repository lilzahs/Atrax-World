// Thin, browser-safe instruction helpers. Lazily import Anchor to avoid SSR issues.

function teBytes(s) {
  return typeof TextEncoder !== 'undefined' ? new TextEncoder().encode(s) : Buffer.from(s);
}

function u32LeBytes(n) {
  const b = new Uint8Array(4);
  new DataView(b.buffer).setUint32(0, n >>> 0, true);
  return b;
}

async function getProgramAndProvider(connection, wallet, programId, idl) {
  const { PublicKey } = await import('@solana/web3.js');
  const { AnchorProvider, Program } = await import('@coral-xyz/anchor');
  const idlJson = idl || (await import('../idl/atrax.json')).default;
  const provider = new AnchorProvider(connection, wallet, { preflightCommitment: 'confirmed' });
  const program = idlJson?.address ? new Program(idlJson, provider) : new Program(idlJson, new PublicKey(programId), provider);
  return { program, provider };
}

function getMethod(program, snake, camel) {
  const methods = (program?.methods) || {};
  return methods[camel] || methods[snake];
}

export async function donate({ connection, wallet, streamer, lamports, programId, configPda, devWallet, idl }) {
  if (!wallet?.publicKey) throw new Error('Wallet not connected');
  const { PublicKey, SystemProgram } = await import('@solana/web3.js');
  const { BN } = await import('@coral-xyz/anchor');
  const { program } = await getProgramAndProvider(connection, wallet, programId, idl);

  const donor = wallet.publicKey;
  const streamerPk = new PublicKey(streamer);
  const devPk = new PublicKey(devWallet);
  const [derivedConfig] = PublicKey.findProgramAddressSync([teBytes('config')], program.programId);
  const configPk = configPda ? new PublicKey(configPda) : derivedConfig;
  const amount = new BN(lamports);

  const m = getMethod(program, 'donate', 'donate');
  return await m(amount)
    .accounts({ donor, streamer: streamerPk, devWallet: devPk, config: configPk, systemProgram: SystemProgram.programId })
    .rpc();
}

export async function buyItem({ connection, wallet, itemId, amountLamports, programId, configPda, devWallet, idl }) {
  if (!wallet?.publicKey) throw new Error('Wallet not connected');
  const { PublicKey, SystemProgram } = await import('@solana/web3.js');
  const { BN } = await import('@coral-xyz/anchor');
  const { program } = await getProgramAndProvider(connection, wallet, programId, idl);

  const payer = wallet.publicKey;
  const devPk = new PublicKey(devWallet);
  const [derivedConfig] = PublicKey.findProgramAddressSync([teBytes('config')], program.programId);
  const configPk = configPda ? new PublicKey(configPda) : derivedConfig;
  const amount = new BN(amountLamports);

  const m = getMethod(program, 'buy_item', 'buyItem');
  return await m(itemId, amount)
    .accounts({ payer, devWallet: devPk, config: configPk, systemProgram: SystemProgram.programId })
    .rpc();
}

export async function claimProfit({ connection, wallet, amountLamports, programId, idl }) {
  if (!wallet?.publicKey) throw new Error('Wallet not connected');
  const { PublicKey } = await import('@solana/web3.js');
  const { BN } = await import('@coral-xyz/anchor');
  const { program } = await getProgramAndProvider(connection, wallet, programId, idl);
  const claimer = wallet.publicKey;
  const amount = new BN(amountLamports);
  const m = getMethod(program, 'claim_profit', 'claimProfit');
  return await m(amount).accounts({ claimer }).rpc();
}

// ----- Rooms: helpers aligned with on-chain program -----

export async function initializeRoomSettings({ connection, wallet, itemPriceLamports, programId, idl }) {
  if (!wallet?.publicKey) throw new Error('Wallet not connected');
  const { PublicKey, SystemProgram } = await import('@solana/web3.js');
  const { BN } = await import('@coral-xyz/anchor');
  const { program } = await getProgramAndProvider(connection, wallet, programId, idl);

  const [roomSettingsPda] = PublicKey.findProgramAddressSync([teBytes('room_settings')], program.programId);
  const [configPda] = PublicKey.findProgramAddressSync([teBytes('config')], program.programId);
  const m = getMethod(program, 'initialize_room_settings', 'initializeRoomSettings');
  const price = new BN(itemPriceLamports);
  return await m(price)
    .accounts({ roomSettings: roomSettingsPda, config: configPda, dev: wallet.publicKey, systemProgram: SystemProgram.programId })
    .rpc();
}

export async function updateRoomSettings({ connection, wallet, itemPriceLamports, programId, idl }) {
  if (!wallet?.publicKey) throw new Error('Wallet not connected');
  const { PublicKey } = await import('@solana/web3.js');
  const { BN } = await import('@coral-xyz/anchor');
  const { program } = await getProgramAndProvider(connection, wallet, programId, idl);

  const [roomSettingsPda] = PublicKey.findProgramAddressSync([teBytes('room_settings')], program.programId);
  const [configPda] = PublicKey.findProgramAddressSync([teBytes('config')], program.programId);
  const m = getMethod(program, 'update_room_settings', 'updateRoomSettings');
  const price = new BN(itemPriceLamports);
  return await m(price).accounts({ roomSettings: roomSettingsPda, config: configPda, dev: wallet.publicKey }).rpc();
}

export async function claimRoom({ connection, wallet, programId, roomName, streamUrl, idl }) {
  if (!wallet?.publicKey) throw new Error('Wallet not connected');
  const { PublicKey, SystemProgram } = await import('@solana/web3.js');
  const { program } = await getProgramAndProvider(connection, wallet, programId, idl);

  const [roomPda] = PublicKey.findProgramAddressSync([teBytes('room'), wallet.publicKey.toBytes()], program.programId);
  const m = getMethod(program, 'claim_room', 'claimRoom');
  return await m(roomName, streamUrl)
    .accounts({ room: roomPda, streamer: wallet.publicKey, systemProgram: SystemProgram.programId })
    .rpc();
}

export async function chooseItem({ connection, wallet, programId, itemType, streamer, devWallet, idl }) {
  if (!wallet?.publicKey) throw new Error('Wallet not connected');
  const { PublicKey, SystemProgram } = await import('@solana/web3.js');
  const { program } = await getProgramAndProvider(connection, wallet, programId, idl);

  const [configPda] = PublicKey.findProgramAddressSync([teBytes('config')], program.programId);
  const [roomSettingsPda] = PublicKey.findProgramAddressSync([teBytes('room_settings')], program.programId);
  const streamerPk = new PublicKey(streamer);
  const [roomPda] = PublicKey.findProgramAddressSync([teBytes('room'), streamerPk.toBytes()], program.programId);

  const buyer = wallet.publicKey;
  const devPk = new PublicKey(devWallet);

  const m = getMethod(program, 'choose_item', 'chooseItem');
  return await m(itemType)
    .accounts({
      config: configPda,
      roomSettings: roomSettingsPda,
      room: roomPda,
      buyer,
      streamer: streamerPk,
      devWallet: devPk,
      systemProgram: SystemProgram.programId,
    })
    .rpc();
}
