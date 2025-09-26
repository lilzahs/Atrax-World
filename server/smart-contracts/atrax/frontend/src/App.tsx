import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWallet as useWalletBase, useAnchorWallet } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { AnchorProvider, BN } from '@coral-xyz/anchor';
import { Buffer } from 'buffer';
import { getProgram, loadProgram, getProvider, findConfigPda, findLandPda, SystemProgram, PROGRAM_ID } from './anchor';

type Status = { kind: 'idle' | 'working' | 'ok' | 'err'; msg?: string };

function safePublicKey(input: string): PublicKey | null {
  try {
    const s = (input || '').trim();
    if (!s) return null;
    return new PublicKey(s);
  } catch { return null; }
}

function useAnchor() {
  const wallet = useWalletBase();
  const anchorWallet = useAnchorWallet();
  const provider = useMemo<AnchorProvider | null>(() => (anchorWallet ? getProvider(anchorWallet) : null), [anchorWallet]);
  const [program, setProgram] = useState<ReturnType<typeof getProgram> | null>(null);
  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!provider) { setProgram(null); return; }
      try {
        // Prefer on-chain IDL to avoid local desync
        const p = await loadProgram(provider);
        if (!cancelled) setProgram(p);
      } catch (e) {
        // Fallback to bundled IDL
        if (!cancelled) setProgram(getProgram(provider));
      }
    })();
    return () => { cancelled = true; };
  }, [provider]);
  return { wallet, provider, program } as const;
}

export default function App() {
  const { wallet, program } = useAnchor();
  const [status, setStatus] = useState<Status>({ kind: 'idle' });
  const [configPda] = findConfigPda();
  const [config, setConfig] = useState<null | { admin: string; devWallet: string; feeBps: number }>(null);
  const isAdmin = useMemo(() => !!(config && wallet.publicKey && wallet.publicKey.toBase58() === config.admin), [config, wallet.publicKey]);

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

  const [updAdmin, setUpdAdmin] = useState('');

  const [donStreamer, setDonStreamer] = useState('');
  const [donAmountSol, setDonAmountSol] = useState(0.1);

  const [buyItemId, setBuyItemId] = useState(1);
  const [buyAmountSol, setBuyAmountSol] = useState(0.1);

  const [tradeItemId, setTradeItemId] = useState(1);
  const [tradeSeller, setTradeSeller] = useState('');
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
    const [configPda] = findConfigPda();
    await withStatus(async () => {
      await program.methods
        .initialize(dev, fee)
        .accounts({ config: configPda, admin: wallet.publicKey, systemProgram: SystemProgram.programId })
        .rpc();
      await refreshConfig();
    }, 'Initialized config');
  }, [program, wallet.publicKey, initDevWallet, initFeeBps, refreshConfig]);

  const onUpdateConfig = useCallback(async () => {
    if (!program || !wallet.publicKey) return;
    const dev = new PublicKey(updDevWallet);
    const fee = Number(updFeeBps) | 0;
    const [configPda] = findConfigPda();
    await withStatus(async () => {
      await program.methods
        .updateConfig(dev, fee)
        .accounts({ config: configPda, admin: wallet.publicKey })
        .rpc();
      await refreshConfig();
    }, 'Updated config');
  }, [program, wallet.publicKey, updDevWallet, updFeeBps, refreshConfig]);

  const onUpdateAdmin = useCallback(async () => {
    if (!program || !wallet.publicKey) return;
    const newAdmin = safePublicKey(updAdmin);
    if (!newAdmin) { setStatus({ kind: 'err', msg: 'Pubkey admin mới không hợp lệ' }); return; }
    const [configPda] = findConfigPda();
    await withStatus(async () => {
      const methods = (program as any).methods || {};
      const m = methods.update_admin || methods.updateAdmin;
      if (!m) {
        const available = Object.keys(methods);
        throw new Error('IDL không có method update_admin/updateAdmin. Hãy chạy anchor build && deploy, rồi copy IDL mới sang FE. Methods: ' + available.join(', '));
      }
      console.log('update_admin call', { configPda: configPda.toBase58(), newAdmin: newAdmin.toBase58() });
      const ix = await m(newAdmin).accounts({ config: configPda, admin: wallet.publicKey }).instruction();
      const tx = new (await import('@solana/web3.js')).Transaction().add(ix);
      await (program.provider as any).sendAndConfirm(tx);
      await refreshConfig();
    }, 'Admin updated');
  }, [program, wallet.publicKey, updAdmin, refreshConfig]);

  const onDonate = useCallback(async () => {
    if (!program || !wallet.publicKey) return;
    if (!config) { setStatus({ kind: 'err', msg: 'No config found. Initialize first.' }); return; }
    const amount = new BN(Math.floor(Number(donAmountSol) * LAMPORTS_PER_SOL));
    const streamer = new PublicKey(donStreamer.trim());
    const devWallet = new PublicKey(config.devWallet);
    const [configPda] = findConfigPda();
    await withStatus(async () => {
      await program.methods
        .donate(amount)
        .accounts({ donor: wallet.publicKey, streamer, devWallet, config: configPda, systemProgram: SystemProgram.programId })
        .rpc();
    }, 'Donation sent');
  }, [program, wallet.publicKey, donAmountSol, donStreamer, config]);

  const onBuy = useCallback(async () => {
    if (!program || !wallet.publicKey) return;
    if (!config) { setStatus({ kind: 'err', msg: 'No config found. Initialize first.' }); return; }
    const itemId = Number(buyItemId) | 0;
    const amount = new BN(Math.floor(Number(buyAmountSol) * LAMPORTS_PER_SOL));
    const devWallet = new PublicKey(config.devWallet);
    const [configPda] = findConfigPda();
    await withStatus(async () => {
      await program.methods
        .buyItem(itemId, amount)
        .accounts({ payer: wallet.publicKey, devWallet, config: configPda, systemProgram: SystemProgram.programId })
        .rpc();
    }, 'Item purchased');
  }, [program, wallet.publicKey, buyItemId, buyAmountSol, config]);

  const onTrade = useCallback(async () => {
    if (!program || !wallet.publicKey) return;
    if (!config) { setStatus({ kind: 'err', msg: 'No config found. Initialize first.' }); return; }
    const itemId = Number(tradeItemId) | 0;
    const amount = new BN(Math.floor(Number(tradeAmountSol) * LAMPORTS_PER_SOL));
    const seller = new PublicKey(tradeSeller.trim());
    const devWallet = new PublicKey(config.devWallet);
    const [configPda] = findConfigPda();
    await withStatus(async () => {
      await program.methods
        .tradeItem(itemId, amount)
        .accounts({ buyer: wallet.publicKey, seller, devWallet, config: configPda, systemProgram: SystemProgram.programId })
        .rpc();
    }, 'Trade executed');
  }, [program, wallet.publicKey, tradeItemId, tradeAmountSol, tradeSeller, config]);

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
      {!wallet.publicKey && (
        <div className="card" style={{ marginTop: 16 }}>
          <h3 className="section-title">Kết nối ví để tiếp tục</h3>
          <div className="muted">Vui lòng bấm nút Connect Wallet ở góc phải để bắt đầu sử dụng.</div>
        </div>
      )}

      {wallet.publicKey && (
      <div className="card">
        <div className="row" style={{ justifyContent: 'space-between' }}>
          <div>
            <strong>Config</strong>
            {config ? (
              <div className="muted">
                Admin: <span style={{ backgroundColor: '#3c4244ff', padding: '2px', lineHeight: '2', borderRadius: '10px' }} className="mono">{config.admin}</span> <br />
                Dev Wallet: <span style={{ backgroundColor: '#3c4244ff', padding: '2px', lineHeight: '2', borderRadius: '10px' }} className="mono">{config.devWallet}</span> <br />
                Fee: <span style={{ backgroundColor: '#3c4244ff', padding: '2px', lineHeight: '2', borderRadius: '10px' }} className="mono">{config.feeBps} bps</span>
              </div>
            ) : (
              <div className="muted">No config found (initialize first)</div>
            )}
          </div>
          <button className="btn alt" onClick={refreshConfig}>Refresh</button>
        </div>
      </div>

      <div className="grid">
        {!config && (
          <div className="card">
            <h3 className="section-title">Initialize</h3>
            <div className="muted">Quyền: bất kỳ ví nào (ví ký sẽ trở thành admin). Nên chạy 1 lần.</div>
            <label>Dev Wallet</label>
            <input value={initDevWallet} onChange={(e) => setInitDevWallet(e.target.value)} placeholder="Dev wallet pubkey" />
            <label>Fee (bps)</label>
            <input type="number" value={initFeeBps} onChange={(e) => setInitFeeBps(Number(e.target.value))} />
            <button className="btn" disabled={!wallet.publicKey} onClick={onInitialize}>Initialize</button>
          </div>
        )}

        {config && (
          <>
            <div className={`card ${!isAdmin ? 'disabled' : ''}`}>
              <h3 className="section-title">Update Config</h3>
              <div className="muted">Quyền: admin hiện tại (phải ký giao dịch).</div>
              <label>New Dev Wallet</label>
              <input value={updDevWallet} onChange={(e) => setUpdDevWallet(e.target.value)} placeholder="Dev wallet pubkey" disabled={!isAdmin} />
              <label>New Fee (bps)</label>
              <input type="number" value={updFeeBps} onChange={(e) => setUpdFeeBps(Number(e.target.value))} disabled={!isAdmin} />
              <button className="btn" disabled={!wallet.publicKey || !isAdmin} onClick={onUpdateConfig}>Update</button>
              {!isAdmin && <div className="muted">Chỉ admin mới có thể cập nhật cấu hình.</div>}
            </div>

            <div className={`card ${!isAdmin ? 'disabled' : ''}`}>
              <h3 className="section-title">Update Admin</h3>
              <div className="muted">Quyền: admin hiện tại (ký) để đổi sang admin mới.</div>
              <label>New Admin</label>
              <input value={updAdmin} onChange={(e) => setUpdAdmin(e.target.value)} placeholder="New admin pubkey" disabled={!isAdmin} />
              <button className="btn" disabled={!wallet.publicKey || !isAdmin} onClick={onUpdateAdmin}>Update Admin</button>
              {!isAdmin && <div className="muted">Chỉ admin mới có thể đổi admin.</div>}
            </div>

            <div className="card">
              <h3 className="section-title">Donate</h3>
              <div className="muted">Quyền: bất kỳ ví nào (donor ký). Phí bị trừ theo fee_bps và gửi về dev wallet.</div>
              <label>Streamer</label>
              <input value={donStreamer} onChange={(e) => setDonStreamer(e.target.value)} placeholder="Streamer pubkey" />
              <label>Amount (SOL)</label>
              <input type="number" value={donAmountSol} onChange={(e) => setDonAmountSol(Number(e.target.value))} />
              <button className="btn" disabled={!wallet.publicKey} onClick={onDonate}>Donate</button>
            </div>

            <div className="card">
              <h3 className="section-title">Buy Item</h3>
              <div className="muted">Quyền: bất kỳ ví nào (payer ký). 100% số tiền chuyển vào dev wallet.</div>
              <label>Item ID</label>
              <input type="number" value={buyItemId} onChange={(e) => setBuyItemId(Number(e.target.value))} />
              <label>Amount (SOL)</label>
              <input type="number" value={buyAmountSol} onChange={(e) => setBuyAmountSol(Number(e.target.value))} />
              <button className="btn" disabled={!wallet.publicKey} onClick={onBuy}>Buy</button>
            </div>

            <div className="card">
              <h3 className="section-title">Trade Item</h3>
              <div className="muted">Quyền: buyer ký; seller chỉ là ví nhận. Phí gửi vào dev wallet.</div>
              <label>Item ID</label>
              <input type="number" value={tradeItemId} onChange={(e) => setTradeItemId(Number(e.target.value))} />
              <label>Seller</label>
              <input value={tradeSeller} onChange={(e) => setTradeSeller(e.target.value)} placeholder="Seller pubkey" />
              <label>Amount (SOL)</label>
              <input type="number" value={tradeAmountSol} onChange={(e) => setTradeAmountSol(Number(e.target.value))} />
              <button className="btn" disabled={!wallet.publicKey} onClick={onTrade}>Trade</button>
            </div>

            <div className="card">
              <h3 className="section-title">Land</h3>
              <div className="muted">Initialize Land: chủ ví (owner) ký để tạo PDA đất của chính mình.</div>
              <label>Land ID</label>
              <input type="number" value={landId} onChange={(e) => setLandId(Number(e.target.value))} />
              <div className="row">
                <button className="btn" disabled={!wallet.publicKey} onClick={onInitLand}>Initialize Land</button>
              </div>
              <div className="muted">Transfer Land: chỉ chủ sở hữu hiện tại (owner) được ký để chuyển.</div>
              <label>New Owner</label>
              <input value={newOwner} onChange={(e) => setNewOwner(e.target.value)} placeholder="New owner pubkey" />
              <button className="btn" disabled={!wallet.publicKey} onClick={onTransferLand}>Transfer Land</button>
              <div className="muted">Note: Current PDA uses seed ["land", owner], so after transfer it won’t match the new owner for subsequent ops.</div>
            </div>

            <div className="card">
              <h3 className="section-title">Claim Profit (placeholder)</h3>
              <div className="muted">Quyền: bất kỳ ví nào (claimer ký). Hiện chỉ là placeholder, chưa có vault.</div>
              <label>Amount (SOL)</label>
              <input type="number" value={claimAmountSol} onChange={(e) => setClaimAmountSol(Number(e.target.value))} />
              <button className="btn" disabled={!wallet.publicKey} onClick={onClaim}>Claim</button>
            </div>
          </>
        )}
      </div>
      )}

      <div className="status">
        {status.kind === 'working' && <span>Working…</span>}
        {status.kind === 'ok' && <span>✅ {status.msg}</span>}
        {status.kind === 'err' && <span>❌ {status.msg}</span>}
      </div>
    </div>
  );
}
