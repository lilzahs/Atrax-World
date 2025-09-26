import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWallet as useWalletBase, useAnchorWallet } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { AnchorProvider, BN } from '@coral-xyz/anchor';
import { Buffer } from 'buffer';
import { getProgram, getProvider, findConfigPda, findLandPda, SystemProgram, PROGRAM_ID } from './anchor';

type Status = { kind: 'idle' | 'working' | 'ok' | 'err'; msg?: string };

function useAnchor() {
  const wallet = useWalletBase();
  const anchorWallet = useAnchorWallet();
  const provider = useMemo<AnchorProvider | null>(() => (anchorWallet ? getProvider(anchorWallet) : null), [anchorWallet]);
  const program = useMemo(() => (provider ? getProgram(provider) : null), [provider]);
  return { wallet, provider, program } as const;
}

export default function App() {
  const { wallet, program } = useAnchor();
  const [status, setStatus] = useState<Status>({ kind: 'idle' });
  const [configPda] = findConfigPda();
  const [config, setConfig] = useState<null | { admin: string; devWallet: string; feeBps: number }>(null);

  const refreshConfig = useCallback(async () => {
    if (!program) return;
    try {
      const ai = await program.provider.connection.getAccountInfo(configPda);
      if (!ai) { setConfig(null); return; }
      const data = Buffer.from(ai.data);
      const off = 8; // anchor account discriminator
      const admin = new PublicKey(data.slice(off, off + 32));
      const dev = new PublicKey(data.slice(off + 32, off + 64));
      const fee = data.readUInt16LE(off + 64);
      setConfig({ admin: admin.toBase58(), devWallet: dev.toBase58(), feeBps: fee });
    } catch (e) {
      setConfig(null);
    }
  }, [program, configPda]);

  useEffect(() => {
    refreshConfig();
  }, [refreshConfig]);

  const [initDevWallet, setInitDevWallet] = useState('');
  const [initFeeBps, setInitFeeBps] = useState(500);

  const [updDevWallet, setUpdDevWallet] = useState('');
  const [updFeeBps, setUpdFeeBps] = useState(500);

  const [donStreamer, setDonStreamer] = useState('');
  const [donDevWallet, setDonDevWallet] = useState('');
  const [donAmountSol, setDonAmountSol] = useState(0.1);

  const [buyItemId, setBuyItemId] = useState(1);
  const [buyDevWallet, setBuyDevWallet] = useState('');
  const [buyAmountSol, setBuyAmountSol] = useState(0.1);

  const [tradeItemId, setTradeItemId] = useState(1);
  const [tradeSeller, setTradeSeller] = useState('');
  const [tradeDevWallet, setTradeDevWallet] = useState('');
  const [tradeAmountSol, setTradeAmountSol] = useState(0.1);

  const [landId, setLandId] = useState(1);
  const [newOwner, setNewOwner] = useState('');

  const [claimAmountSol, setClaimAmountSol] = useState(0.01);

  async function withStatus<T>(fn: () => Promise<T>, ok: string) {
    setStatus({ kind: 'working' });
    try {
      const v = await fn();
      setStatus({ kind: 'ok', msg: ok });
      return v;
    } catch (e: any) {
      console.error(e);
      setStatus({ kind: 'err', msg: e?.message || String(e) });
      throw e;
    }
  }

  const onInitialize = useCallback(async () => {
    if (!program || !wallet.publicKey) return;
    const dev = new PublicKey(initDevWallet);
    const fee = Number(initFeeBps) | 0;
    const [config] = findConfigPda();
    await withStatus(async () => {
      await program.methods
        .initialize(dev, fee)
        .accounts({ config, admin: wallet.publicKey, systemProgram: SystemProgram.programId })
        .rpc();
      await refreshConfig();
    }, 'Initialized config');
  }, [program, wallet.publicKey, initDevWallet, initFeeBps, refreshConfig]);

  const onUpdateConfig = useCallback(async () => {
    if (!program || !wallet.publicKey) return;
    const dev = new PublicKey(updDevWallet);
    const fee = Number(updFeeBps) | 0;
    const [config] = findConfigPda();
    await withStatus(async () => {
      await program.methods
        .updateConfig(dev, fee)
        .accounts({ config, admin: wallet.publicKey })
        .rpc();
      await refreshConfig();
    }, 'Updated config');
  }, [program, wallet.publicKey, updDevWallet, updFeeBps, refreshConfig]);

  const onDonate = useCallback(async () => {
    if (!program || !wallet.publicKey) return;
    const amount = new BN(Math.floor(Number(donAmountSol) * LAMPORTS_PER_SOL));
    const streamer = new PublicKey(donStreamer);
    const devWallet = new PublicKey(donDevWallet);
    const [config] = findConfigPda();
    await withStatus(async () => {
      await program.methods
        .donate(amount)
        .accounts({ donor: wallet.publicKey, streamer, devWallet, config, systemProgram: SystemProgram.programId })
        .rpc();
    }, 'Donation sent');
  }, [program, wallet.publicKey, donAmountSol, donStreamer, donDevWallet]);

  const onBuy = useCallback(async () => {
    if (!program || !wallet.publicKey) return;
    const itemId = Number(buyItemId) | 0;
    const amount = new BN(Math.floor(Number(buyAmountSol) * LAMPORTS_PER_SOL));
    const devWallet = new PublicKey(buyDevWallet);
    const [config] = findConfigPda();
    await withStatus(async () => {
      await program.methods
        .buyItem(itemId, amount)
        .accounts({ payer: wallet.publicKey, devWallet, config, systemProgram: SystemProgram.programId })
        .rpc();
    }, 'Item purchased');
  }, [program, wallet.publicKey, buyItemId, buyAmountSol, buyDevWallet]);

  const onTrade = useCallback(async () => {
    if (!program || !wallet.publicKey) return;
    const itemId = Number(tradeItemId) | 0;
    const amount = new BN(Math.floor(Number(tradeAmountSol) * LAMPORTS_PER_SOL));
    const seller = new PublicKey(tradeSeller);
    const devWallet = new PublicKey(tradeDevWallet);
    const [config] = findConfigPda();
    await withStatus(async () => {
      await program.methods
        .tradeItem(itemId, amount)
        .accounts({ buyer: wallet.publicKey, seller, devWallet, config, systemProgram: SystemProgram.programId })
        .rpc();
    }, 'Trade executed');
  }, [program, wallet.publicKey, tradeItemId, tradeAmountSol, tradeSeller, tradeDevWallet]);

  const onInitLand = useCallback(async () => {
    if (!program || !wallet.publicKey) return;
    const land = Number(landId);
    const [landPda] = findLandPda(wallet.publicKey);
    await withStatus(async () => {
      await program.methods
        .initializeLand(new BN(land))
        .accounts({ owner: wallet.publicKey, land: landPda, systemProgram: SystemProgram.programId })
        .rpc();
    }, 'Land initialized');
  }, [program, wallet.publicKey, landId]);

  const onTransferLand = useCallback(async () => {
    if (!program || !wallet.publicKey) return;
    const land = Number(landId);
    const [landPda] = findLandPda(wallet.publicKey);
    const newOwnerPk = new PublicKey(newOwner);
    await withStatus(async () => {
      await program.methods
        .transferLand(new BN(land), newOwnerPk)
        .accounts({ owner: wallet.publicKey, land: landPda })
        .rpc();
    }, 'Land transferred (note: PDA bound to original owner)');
  }, [program, wallet.publicKey, landId, newOwner]);

  const onClaim = useCallback(async () => {
    if (!program || !wallet.publicKey) return;
    const amount = new BN(Math.floor(Number(claimAmountSol) * LAMPORTS_PER_SOL));
    await withStatus(async () => {
      await program.methods
        .claimProfit(amount)
        .accounts({ claimer: wallet.publicKey })
        .rpc();
    }, 'Claim invoked');
  }, [program, wallet.publicKey, claimAmountSol]);

  return (
    <div className="container">
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <div>
          <h2>Atrax Program Tester</h2>
          <div className="muted">Program ID: <span className="mono">{PROGRAM_ID.toBase58()}</span></div>
          <div className="muted">Config PDA: <span className="mono">{findConfigPda()[0].toBase58()}</span></div>
        </div>
        <WalletMultiButton />
      </div>

      <div className="card">
        <div className="row" style={{ justifyContent: 'space-between' }}>
          <div>
            <strong>Config</strong>
            {config ? (
              <div className="muted">
                Admin: <span className="mono">{config.admin}</span> · Dev Wallet: <span className="mono">{config.devWallet}</span> · Fee: {config.feeBps} bps
              </div>
            ) : (
              <div className="muted">No config found (initialize first)</div>
            )}
          </div>
          <button className="btn alt" onClick={refreshConfig}>Refresh</button>
        </div>
      </div>

      <div className="grid">
        <div className="card">
          <h3 className="section-title">Initialize</h3>
          <label>Dev Wallet</label>
          <input value={initDevWallet} onChange={(e) => setInitDevWallet(e.target.value)} placeholder="Dev wallet pubkey" />
          <label>Fee (bps)</label>
          <input type="number" value={initFeeBps} onChange={(e) => setInitFeeBps(Number(e.target.value))} />
          <button className="btn" disabled={!wallet.publicKey} onClick={onInitialize}>Initialize</button>
        </div>

        <div className="card">
          <h3 className="section-title">Update Config</h3>
          <label>New Dev Wallet</label>
          <input value={updDevWallet} onChange={(e) => setUpdDevWallet(e.target.value)} placeholder="Dev wallet pubkey" />
          <label>New Fee (bps)</label>
          <input type="number" value={updFeeBps} onChange={(e) => setUpdFeeBps(Number(e.target.value))} />
          <button className="btn" disabled={!wallet.publicKey} onClick={onUpdateConfig}>Update</button>
        </div>

        <div className="card">
          <h3 className="section-title">Donate</h3>
          <label>Streamer</label>
          <input value={donStreamer} onChange={(e) => setDonStreamer(e.target.value)} placeholder="Streamer pubkey" />
          <label>Dev Wallet (must match config)</label>
          <input value={donDevWallet} onChange={(e) => setDonDevWallet(e.target.value)} placeholder="Dev wallet pubkey" />
          <label>Amount (SOL)</label>
          <input type="number" value={donAmountSol} onChange={(e) => setDonAmountSol(Number(e.target.value))} />
          <button className="btn" disabled={!wallet.publicKey} onClick={onDonate}>Donate</button>
        </div>

        <div className="card">
          <h3 className="section-title">Buy Item</h3>
          <label>Item ID</label>
          <input type="number" value={buyItemId} onChange={(e) => setBuyItemId(Number(e.target.value))} />
          <label>Dev Wallet (must match config)</label>
          <input value={buyDevWallet} onChange={(e) => setBuyDevWallet(e.target.value)} placeholder="Dev wallet pubkey" />
          <label>Amount (SOL)</label>
          <input type="number" value={buyAmountSol} onChange={(e) => setBuyAmountSol(Number(e.target.value))} />
          <button className="btn" disabled={!wallet.publicKey} onClick={onBuy}>Buy</button>
        </div>

        <div className="card">
          <h3 className="section-title">Trade Item</h3>
          <label>Item ID</label>
          <input type="number" value={tradeItemId} onChange={(e) => setTradeItemId(Number(e.target.value))} />
          <label>Seller</label>
          <input value={tradeSeller} onChange={(e) => setTradeSeller(e.target.value)} placeholder="Seller pubkey" />
          <label>Dev Wallet (must match config)</label>
          <input value={tradeDevWallet} onChange={(e) => setTradeDevWallet(e.target.value)} placeholder="Dev wallet pubkey" />
          <label>Amount (SOL)</label>
          <input type="number" value={tradeAmountSol} onChange={(e) => setTradeAmountSol(Number(e.target.value))} />
          <button className="btn" disabled={!wallet.publicKey} onClick={onTrade}>Trade</button>
        </div>

        <div className="card">
          <h3 className="section-title">Land</h3>
          <label>Land ID</label>
          <input type="number" value={landId} onChange={(e) => setLandId(Number(e.target.value))} />
          <div className="row">
            <button className="btn" disabled={!wallet.publicKey} onClick={onInitLand}>Initialize Land</button>
          </div>
          <label>New Owner</label>
          <input value={newOwner} onChange={(e) => setNewOwner(e.target.value)} placeholder="New owner pubkey" />
          <button className="btn" disabled={!wallet.publicKey} onClick={onTransferLand}>Transfer Land</button>
          <div className="muted">Note: Current PDA uses seed ["land", owner], so after transfer it won’t match the new owner for subsequent ops.</div>
        </div>

        <div className="card">
          <h3 className="section-title">Claim Profit (placeholder)</h3>
          <label>Amount (SOL)</label>
          <input type="number" value={claimAmountSol} onChange={(e) => setClaimAmountSol(Number(e.target.value))} />
          <button className="btn" disabled={!wallet.publicKey} onClick={onClaim}>Claim</button>
        </div>
      </div>

      <div className="status">
        {status.kind === 'working' && <span>Working…</span>}
        {status.kind === 'ok' && <span>✅ {status.msg}</span>}
        {status.kind === 'err' && <span>❌ {status.msg}</span>}
      </div>
    </div>
  );
}
