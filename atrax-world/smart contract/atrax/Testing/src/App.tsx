import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWallet as useWalletBase, useAnchorWallet } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { AnchorProvider, BN } from '@coral-xyz/anchor';
import { Buffer } from 'buffer';
import { getProgram, loadProgram, getProvider, findConfigPda, findLandPda, findRoomPda, findRoomSettingsPda, SystemProgram, PROGRAM_ID, getConnection } from './anchor';

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
  // --- Streamer Room Management State ---
  const [rsPiecePriceSol, setRsPiecePriceSol] = useState(0.01);
  const [rsDepositSol, setRsDepositSol] = useState(0);
  const [roomSettingsInfo, setRoomSettingsInfo] = useState<null | { piecePriceLamports: string; depositLamports: string }>(null);

  const [roomId, setRoomId] = useState(0);
  const [roomName, setRoomName] = useState('');
  const [roomUrl, setRoomUrl] = useState('');
  const [roomPrevStreamer, setRoomPrevStreamer] = useState('');

  const [roomUpdName, setRoomUpdName] = useState('');
  const [roomUpdUrl, setRoomUpdUrl] = useState('');
  const [roomNewStatus, setRoomNewStatus] = useState<1 | 2 | 3>(2);

  type RoomLite = {
    pda: string;
    id: number;
    name: string;
    url: string;
    owner: string;
    status: number;
    expiresAt: number;
    lastBuyer: string;
  };
  const [rooms, setRooms] = useState<RoomLite[]>([]);

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
    const adminPk = wallet.publicKey!;
    const dev = new PublicKey(initDevWallet);
    const fee = Number(initFeeBps) | 0;
    const [configPda] = findConfigPda();
    await withStatus(async () => {
      await program.methods
        .initialize!(dev, fee)
        .accounts({ config: configPda, admin: adminPk, systemProgram: SystemProgram.programId })
        .rpc();
      await refreshConfig();
    }, 'Initialized config');
  }, [program, wallet.publicKey, initDevWallet, initFeeBps, refreshConfig]);

  const onUpdateConfig = useCallback(async () => {
    if (!program || !wallet.publicKey) return;
    const adminPk = wallet.publicKey!;
    const dev = new PublicKey(updDevWallet);
    const fee = Number(updFeeBps) | 0;
    const [configPda] = findConfigPda();
    await withStatus(async () => {
      await program.methods
        .updateConfig!(dev, fee)
        .accounts({ config: configPda, admin: adminPk })
        .rpc();
      await refreshConfig();
    }, 'Updated config');
  }, [program, wallet.publicKey, updDevWallet, updFeeBps, refreshConfig]);

  const onUpdateAdmin = useCallback(async () => {
    if (!program || !wallet.publicKey) return;
    const adminPk = wallet.publicKey!;
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
      const ix = await m(newAdmin).accounts({ config: configPda, admin: adminPk }).instruction();
      const tx = new (await import('@solana/web3.js')).Transaction().add(ix);
      await (program.provider as any).sendAndConfirm(tx);
      await refreshConfig();
    }, 'Admin updated');
  }, [program, wallet.publicKey, updAdmin, refreshConfig]);

  const onDonate = useCallback(async () => {
    if (!program || !wallet.publicKey) return;
    const donorPk = wallet.publicKey!;
    if (!config) { setStatus({ kind: 'err', msg: 'No config found. Initialize first.' }); return; }
    const amount = new BN(Math.floor(Number(donAmountSol) * LAMPORTS_PER_SOL));
    const streamer = new PublicKey(donStreamer.trim());
    const devWallet = new PublicKey(config.devWallet);
    const [configPda] = findConfigPda();
    await withStatus(async () => {
      await program.methods
        .donate!(amount)
        .accounts({ donor: donorPk, streamer, devWallet, config: configPda, systemProgram: SystemProgram.programId })
        .rpc();
    }, 'Donation sent');
  }, [program, wallet.publicKey, donAmountSol, donStreamer, config]);

  const onBuy = useCallback(async () => {
    if (!program || !wallet.publicKey) return;
    const payerPk = wallet.publicKey!;
    if (!config) { setStatus({ kind: 'err', msg: 'No config found. Initialize first.' }); return; }
    const itemId = Number(buyItemId) | 0;
    const amount = new BN(Math.floor(Number(buyAmountSol) * LAMPORTS_PER_SOL));
    const devWallet = new PublicKey(config.devWallet);
    const [configPda] = findConfigPda();
    await withStatus(async () => {
      await program.methods
        .buyItem!(itemId, amount)
        .accounts({ payer: payerPk, devWallet, config: configPda, systemProgram: SystemProgram.programId })
        .rpc();
    }, 'Item purchased');
  }, [program, wallet.publicKey, buyItemId, buyAmountSol, config]);

  const onTrade = useCallback(async () => {
    if (!program || !wallet.publicKey) return;
    const buyerPk = wallet.publicKey!;
    if (!config) { setStatus({ kind: 'err', msg: 'No config found. Initialize first.' }); return; }
    const itemId = Number(tradeItemId) | 0;
    const amount = new BN(Math.floor(Number(tradeAmountSol) * LAMPORTS_PER_SOL));
    const seller = new PublicKey(tradeSeller.trim());
    const devWallet = new PublicKey(config.devWallet);
    const [configPda] = findConfigPda();
    await withStatus(async () => {
      await program.methods
        .tradeItem!(itemId, amount)
        .accounts({ buyer: buyerPk, seller, devWallet, config: configPda, systemProgram: SystemProgram.programId })
        .rpc();
    }, 'Trade executed');
  }, [program, wallet.publicKey, tradeItemId, tradeAmountSol, tradeSeller, config]);

  const onInitLand = useCallback(async () => {
    if (!program || !wallet.publicKey) return;
    const ownerPk = wallet.publicKey!;
    const land = Number(landId);
    const [landPda] = findLandPda(wallet.publicKey);
    await withStatus(async () => {
      await program.methods
        .initializeLand!(new BN(land))
        .accounts({ owner: ownerPk, land: landPda, systemProgram: SystemProgram.programId })
        .rpc();
    }, 'Land initialized');
  }, [program, wallet.publicKey, landId]);

  const onTransferLand = useCallback(async () => {
    if (!program || !wallet.publicKey) return;
    const ownerPk = wallet.publicKey!;
    const land = Number(landId);
    const [landPda] = findLandPda(wallet.publicKey);
    const newOwnerPk = new PublicKey(newOwner);
    await withStatus(async () => {
      await program.methods
        .transferLand!(new BN(land), newOwnerPk)
        .accounts({ owner: ownerPk, land: landPda })
        .rpc();
    }, 'Land transferred (note: PDA bound to original owner)');
  }, [program, wallet.publicKey, landId, newOwner]);

  const onClaim = useCallback(async () => {
    if (!program || !wallet.publicKey) return;
    const claimerPk = wallet.publicKey!;
    const amount = new BN(Math.floor(Number(claimAmountSol) * LAMPORTS_PER_SOL));
    await withStatus(async () => {
      await program.methods
        .claimProfit!(amount)
        .accounts({ claimer: claimerPk })
        .rpc();
    }, 'Claim invoked');
  }, [program, wallet.publicKey, claimAmountSol]);

  // --- Streamer Room Management Helpers & Actions ---
  function parseRoomAccount(data: Buffer): RoomLite | null {
    try {
      let o = 8; // discriminator
      const rnLen = data.readUInt32LE(o); o += 4;
      const rn = data.slice(o, o + rnLen).toString('utf8'); o += rnLen;
      const suLen = data.readUInt32LE(o); o += 4;
      const su = data.slice(o, o + suLen).toString('utf8'); o += suLen;
      const player = new PublicKey(data.slice(o, o + 32)); o += 32;
      const rid = data.readUInt32LE(o); o += 4;
      o += 1; // latest_chosen_piece (skip)
      const lastBuyer = new PublicKey(data.slice(o, o + 32)); o += 32;
      const exp = Number(data.readBigInt64LE(o + 8)); // skip timestamp at o, expires_at at o+8
      const status = data.readUInt8(o + 8 + 8);
      return {
        pda: '',
        id: rid,
        name: rn,
        url: su,
        owner: player.toBase58(),
        status,
        expiresAt: exp,
        lastBuyer: lastBuyer.toBase58(),
      };
    } catch (e) {
      return null;
    }
  }

  const refreshRoomSettings = useCallback(async () => {
    if (!program) return;
    const [pda] = findRoomSettingsPda();
    const ai = await program.provider.connection.getAccountInfo(pda);
    if (!ai) { setRoomSettingsInfo(null); return; }
    // Layout: admin:32, piece_price:u64, deposit:u64, bump:u8
    const data = Buffer.from(ai.data);
    const off = 8 + 32; // skip discr + admin
    const piece = data.readBigUInt64LE(off);
    const deposit = data.readBigUInt64LE(off + 8);
    setRoomSettingsInfo({ piecePriceLamports: piece.toString(), depositLamports: deposit.toString() });
  }, [program]);

  const refreshRooms = useCallback(async () => {
    const conn = program?.provider?.connection ?? getConnection();
    const ids = Array.from({ length: 100 }, (_, i) => i);
    const pdas = ids.map((i) => findRoomPda(i)[0]);
    const out: RoomLite[] = [];
    const chunkSize = 20;
    for (let i = 0; i < pdas.length; i += chunkSize) {
      const chunk = pdas.slice(i, i + chunkSize);
      const infos = await conn.getMultipleAccountsInfo(chunk);
      for (let j = 0; j < chunk.length; j++) {
        const ai = infos[j];
        if (!ai) continue;
        const r = parseRoomAccount(Buffer.from(ai.data));
        if (r) {
          r.pda = chunk[j].toBase58();
          out.push(r);
        }
      }
    }
    const now = Math.floor(Date.now() / 1000);
    out.sort((a, b) => {
      const aActive = Number(now <= a.expiresAt && a.status === 1);
      const bActive = Number(now <= b.expiresAt && b.status === 1);
      if (aActive !== bActive) return bActive - aActive;
      return b.expiresAt - a.expiresAt;
    });
    setRooms(out);
  }, [program]);

  // Auto refresh viewer dashboard periodically
  useEffect(() => {
    refreshRooms();
    const t = setInterval(refreshRooms, 20000);
    return () => clearInterval(t);
  }, [refreshRooms]);

  const getMethod = useCallback((nameSnake: string, nameCamel: string) => {
    const methods = (program as any)?.methods || {};
    return methods[nameSnake] || methods[nameCamel] || null;
  }, [program]);

  const onInitRoomSettings = useCallback(async () => {
    if (!program || !wallet.publicKey) return;
    const pieceLamports = new BN(Math.floor(Number(rsPiecePriceSol) * LAMPORTS_PER_SOL));
    const depositLamports = new BN(Math.floor(Number(rsDepositSol) * LAMPORTS_PER_SOL));
    const [pda] = findRoomSettingsPda();
    await withStatus(async () => {
      const m = getMethod('initialize_room_settings', 'initializeRoomSettings');
      if (!m) throw new Error('IDL chưa có initialize_room_settings. Hãy anchor build && deploy, rồi cập nhật IDL vào FE.');
      await m(pieceLamports, depositLamports)
        .accounts({ roomSettings: pda, admin: wallet.publicKey, systemProgram: SystemProgram.programId })
        .rpc();
      await refreshRoomSettings();
    }, 'Initialized Room Settings');
  }, [program, wallet.publicKey, rsPiecePriceSol, rsDepositSol, refreshRoomSettings, getMethod]);

  const onUpdateRoomSettings = useCallback(async () => {
    if (!program || !wallet.publicKey) return;
    const pieceLamports = new BN(Math.floor(Number(rsPiecePriceSol) * LAMPORTS_PER_SOL));
    const depositLamports = new BN(Math.floor(Number(rsDepositSol) * LAMPORTS_PER_SOL));
    const [pda] = findRoomSettingsPda();
    await withStatus(async () => {
      const m = getMethod('update_room_settings', 'updateRoomSettings');
      if (!m) throw new Error('IDL chưa có update_room_settings. Cập nhật IDL.');
      await m(pieceLamports, depositLamports)
        .accounts({ roomSettings: pda, admin: wallet.publicKey })
        .rpc();
      await refreshRoomSettings();
    }, 'Updated Room Settings');
  }, [program, wallet.publicKey, rsPiecePriceSol, rsDepositSol, refreshRoomSettings, getMethod]);

  const onClaimRoom = useCallback(async () => {
    if (!program || !wallet.publicKey) return;
    const id = Number(roomId) | 0;
    const [roomPda] = findRoomPda(id);
    const [rsPda] = findRoomSettingsPda();
    const prev = roomPrevStreamer.trim();
    const prevPk = prev ? new PublicKey(prev) : wallet.publicKey;
    await withStatus(async () => {
      const m = getMethod('claim_room', 'claimRoom');
      if (!m) throw new Error('IDL chưa có claim_room. Cập nhật IDL.');
      await m(id, roomName, roomUrl)
        .accounts({ room: roomPda, roomSettings: rsPda, streamerPrev: prevPk, streamer: wallet.publicKey, systemProgram: SystemProgram.programId })
        .rpc();
      await refreshRooms();
    }, 'Room claimed');
  }, [program, wallet.publicKey, roomId, roomName, roomUrl, roomPrevStreamer, getMethod, refreshRooms]);

  const onUpdateRoomMetadata = useCallback(async () => {
    if (!program || !wallet.publicKey) return;
    const id = Number(roomId) | 0;
    const [roomPda] = findRoomPda(id);
    const [configPda] = findConfigPda();
    await withStatus(async () => {
      const m = getMethod('update_room_metadata', 'updateRoomMetadata');
      if (!m) throw new Error('IDL chưa có update_room_metadata. Cập nhật IDL.');
      await m(id, roomUpdName, roomUpdUrl)
        .accounts({ config: configPda, room: roomPda, authority: wallet.publicKey })
        .rpc();
      await refreshRooms();
    }, 'Room metadata updated');
  }, [program, wallet.publicKey, roomId, roomUpdName, roomUpdUrl, getMethod, refreshRooms]);

  const onSetRoomStatus = useCallback(async () => {
    if (!program || !wallet.publicKey) return;
    const id = Number(roomId) | 0;
    const [roomPda] = findRoomPda(id);
    const [configPda] = findConfigPda();
    await withStatus(async () => {
      const m = getMethod('set_room_status', 'setRoomStatus');
      if (!m) throw new Error('IDL chưa có set_room_status. Cập nhật IDL.');
      await m(id, roomNewStatus)
        .accounts({ config: configPda, room: roomPda, authority: wallet.publicKey })
        .rpc();
      await refreshRooms();
    }, 'Room status updated');
  }, [program, wallet.publicKey, roomId, roomNewStatus, getMethod, refreshRooms]);

  const onReleaseRoom = useCallback(async () => {
    if (!program || !wallet.publicKey) return;
    const id = Number(roomId) | 0;
    const [roomPda] = findRoomPda(id);
    const [configPda] = findConfigPda();
    await withStatus(async () => {
      const m = getMethod('release_room', 'releaseRoom');
      if (!m) throw new Error('IDL chưa có release_room. Cập nhật IDL.');
      await m(id)
        .accounts({ config: configPda, room: roomPda, streamer: wallet.publicKey, authority: wallet.publicKey, systemProgram: SystemProgram.programId })
        .rpc();
      await refreshRooms();
    }, 'Room released');
  }, [program, wallet.publicKey, roomId, getMethod, refreshRooms]);

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
      {/* Viewer: Live Rooms (no wallet required) */}
      <div className="card" style={{ marginTop: 12 }}>
        <h3 className="section-title">Live Rooms</h3>
        <div className="row" style={{ gap: 8, alignItems: 'center' }}>
          <button className="btn alt" onClick={refreshRooms}>Refresh</button>
          <div className="muted">Danh sách các room đang hoạt động (0..99)</div>
        </div>
        <div style={{ maxHeight: 260, overflowY: 'auto', marginTop: 8 }}>
          {rooms.map((r) => {
            const now = Math.floor(Date.now() / 1000);
            const active = now <= r.expiresAt && r.status === 1;
            return (
              <div key={`viewer-${r.id}`} className="row" style={{ justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #333' }}>
                <div>
                  <div><strong>Room {r.id}</strong> {active ? '🟢' : '⚪️'} — <span className="muted">{r.name}</span></div>
                  <div className="muted mono" style={{ fontSize: 12 }}>Owner: {r.owner}</div>
                  <div className="muted mono" style={{ fontSize: 12 }}>URL: {r.url}</div>
                </div>
                <div className="muted" style={{ textAlign: 'right' }}>
                  <div>status: {r.status}</div>
                  <div>expires: {new Date(r.expiresAt * 1000).toLocaleTimeString()}</div>
                </div>
              </div>
            );
          })}
          {rooms.length === 0 && <div className="muted">Chưa có room nào.</div>}
        </div>
      </div>
      {!wallet.publicKey && (
        <div className="card" style={{ marginTop: 16 }}>
          <h3 className="section-title">Kết nối ví để tiếp tục</h3>
          <div className="muted">Vui lòng bấm nút Connect Wallet ở góc phải để bắt đầu sử dụng.</div>
        </div>
      )}

      {wallet.publicKey && (
      <>
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
            {/* Streamer Room Management */}
            <div className="card">
              <h3 className="section-title">Room Settings</h3>
              <div className="muted">Thiết lập giá piece và tiền đặt cọc khi claim.</div>
              <div className="row" style={{ gap: 8 }}>
                <button className="btn alt" onClick={refreshRoomSettings}>Refresh</button>
                {roomSettingsInfo && (
                  <div className="muted">Current: price {Number(roomSettingsInfo.piecePriceLamports)/LAMPORTS_PER_SOL} SOL, deposit {Number(roomSettingsInfo.depositLamports)/LAMPORTS_PER_SOL} SOL</div>
                )}
              </div>
              <label>Piece Price (SOL)</label>
              <input type="number" value={rsPiecePriceSol} onChange={(e) => setRsPiecePriceSol(Number(e.target.value))} />
              <label>Deposit Required (SOL)</label>
              <input type="number" value={rsDepositSol} onChange={(e) => setRsDepositSol(Number(e.target.value))} />
              <div className="row" style={{ gap: 8 }}>
                <button className="btn" onClick={onInitRoomSettings}>Initialize RoomSettings</button>
                <button className="btn" onClick={onUpdateRoomSettings}>Update RoomSettings</button>
              </div>
              <div className="muted">Yêu cầu: IDL đã cập nhật các hàm initialize_room_settings / update_room_settings.</div>
            </div>

            <div className="card">
              <h3 className="section-title">Claim Room</h3>
              <div className="muted">Streamer claim một room id (0..99). Tự động gia hạn khi có lượt mua piece. Nếu room đã có cọc cũ sẽ hoàn trả cho chủ trước.</div>
              <label>Room ID</label>
              <input type="number" value={roomId} onChange={(e) => setRoomId(Number(e.target.value))} />
              <label>Room Name</label>
              <input value={roomName} onChange={(e) => setRoomName(e.target.value)} placeholder="Tên room" />
              <label>Stream URL</label>
              <input value={roomUrl} onChange={(e) => setRoomUrl(e.target.value)} placeholder="https://..." />
              <label>Previous Streamer (for refund)</label>
              <input value={roomPrevStreamer} onChange={(e) => setRoomPrevStreamer(e.target.value)} placeholder="Pubkey chủ cũ (nếu có)" />
              <button className="btn" onClick={onClaimRoom}>Claim</button>
              <div className="muted">Yêu cầu: IDL đã có claim_room.</div>
            </div>

            <div className="card">
              <h3 className="section-title">Update Room Metadata</h3>
              <div className="muted">Chủ room hoặc admin có thể cập nhật tên/URL.</div>
              <label>Room ID</label>
              <input type="number" value={roomId} onChange={(e) => setRoomId(Number(e.target.value))} />
              <label>New Name</label>
              <input value={roomUpdName} onChange={(e) => setRoomUpdName(e.target.value)} />
              <label>New URL</label>
              <input value={roomUpdUrl} onChange={(e) => setRoomUpdUrl(e.target.value)} />
              <button className="btn" onClick={onUpdateRoomMetadata}>Update Metadata</button>
              <div className="muted">Yêu cầu: IDL đã có update_room_metadata.</div>
            </div>

            <div className="card">
              <h3 className="section-title">Set Room Status</h3>
              <div className="muted">Trạng thái: 1=Active, 2=Paused, 3=Ended. Resume sẽ gia hạn TTL.</div>
              <label>Room ID</label>
              <input type="number" value={roomId} onChange={(e) => setRoomId(Number(e.target.value))} />
              <label>Status</label>
              <select value={roomNewStatus} onChange={(e) => setRoomNewStatus(Number(e.target.value) as any)}>
                <option value={1}>Active</option>
                <option value={2}>Paused</option>
                <option value={3}>Ended</option>
              </select>
              <button className="btn" onClick={onSetRoomStatus}>Update Status</button>
              <div className="muted">Yêu cầu: IDL đã có set_room_status.</div>
            </div>

            <div className="card">
              <h3 className="section-title">Release Room</h3>
              <div className="muted">Kết thúc buổi stream, hoàn trả deposit (nếu có) về ví streamer.</div>
              <label>Room ID</label>
              <input type="number" value={roomId} onChange={(e) => setRoomId(Number(e.target.value))} />
              <button className="btn" onClick={onReleaseRoom}>Release</button>
              <div className="muted">Yêu cầu: IDL đã có release_room.</div>
            </div>

            <div className="card">
              <h3 className="section-title">Rooms Dashboard</h3>
              <div className="row" style={{ gap: 8, alignItems: 'center' }}>
                <button className="btn alt" onClick={refreshRooms}>Refresh Rooms</button>
                <div className="muted">Hiển thị 0..99 rooms, ưu tiên phòng đang hoạt động.</div>
              </div>
              <div style={{ maxHeight: 260, overflowY: 'auto', marginTop: 8 }}>
                {rooms.map((r) => {
                  const now = Math.floor(Date.now() / 1000);
                  const active = now <= r.expiresAt && r.status === 1;
                  return (
                    <div key={`${r.id}`} className="row" style={{ justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #333' }}>
                      <div>
                        <div><strong>Room {r.id}</strong> {active ? '🟢' : '⚪️'} — <span className="muted">{r.name}</span></div>
                        <div className="muted mono" style={{ fontSize: 12 }}>Owner: {r.owner}</div>
                        <div className="muted mono" style={{ fontSize: 12 }}>URL: {r.url}</div>
                      </div>
                      <div className="muted" style={{ textAlign: 'right' }}>
                        <div>status: {r.status}</div>
                        <div>expires: {new Date(r.expiresAt * 1000).toLocaleTimeString()}</div>
                      </div>
                    </div>
                  );
                })}
                {rooms.length === 0 && <div className="muted">Chưa có room nào.</div>}
              </div>
            </div>
          </>
        )}
      </div>
      </>
      )}

      <div className="status">
        {status.kind === 'working' && <span>Working…</span>}
        {status.kind === 'ok' && <span>✅ {status.msg}</span>}
        {status.kind === 'err' && <span>❌ {status.msg}</span>}
      </div>
    </div>
  );
}
