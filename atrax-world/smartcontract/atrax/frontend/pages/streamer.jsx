import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
const WalletMultiButton = dynamic(
  async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
  { ssr: false }
);
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { claimProfit, claimRoom } from '../onchain/instructions';
import { ATRAX_PROGRAM_ID } from '../lib/config';
import { fetchConfig, fetchRoom } from '../lib/onchain';

export default function StreamerPage() {
  const { connection } = useConnection();
  const wallet = useWallet();
  const [amount, setAmount] = useState('');
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState('');
  const [feeInfo, setFeeInfo] = useState(null);
  const [viewerUrl, setViewerUrl] = useState('');
  const [roomName, setRoomName] = useState('');
  const [streamUrl, setStreamUrl] = useState('');
  const [hasRoom, setHasRoom] = useState(false);
  const [roomMsg, setRoomMsg] = useState('');
  const [roomInfo, setRoomInfo] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const cfg = await fetchConfig(connection);
        if (cfg) setFeeInfo({ feeBps: cfg.feeBps, dev: cfg.devWallet.toBase58() });
      } catch {}
    })();
  }, [connection]);

  useEffect(() => {
    (async () => {
      try {
        setHasRoom(false);
        if (!connection || !wallet.publicKey) return;
        const info = await fetchRoom(connection, ATRAX_PROGRAM_ID, wallet.publicKey.toBase58());
        if (info && info.playerWallet?.toBase58() === wallet.publicKey.toBase58()) {
          setHasRoom(true);
          setRoomInfo(info);
        } else {
          setRoomInfo(null);
        }
      } catch {}
    })();
  }, [connection, wallet.publicKey]);

  function parseYouTubeId(v) {
    if (!v) return '';
    try {
      if (/^https?:\/\//i.test(v)) {
        const url = new URL(v);
        if (url.hostname.includes('youtu.be')) return url.pathname.slice(1);
        if (url.searchParams.get('v')) return url.searchParams.get('v');
        const parts = url.pathname.split('/');
        const idx = parts.findIndex((p) => p === 'embed');
        if (idx >= 0 && parts[idx + 1]) return parts[idx + 1];
      }
    } catch {}
    return v;
  }

  async function onClaimRoom() {
    try {
      setRoomMsg('');
      if (!wallet?.publicKey) throw new Error('Wallet not connected');
      if (!ATRAX_PROGRAM_ID) throw new Error('Set NEXT_PUBLIC_ATRAX_PROGRAM_ID');
      const rn = (roomName || '').trim();
      const su = (streamUrl || '').trim();
      if (!rn) throw new Error('Room name is required');
      if (!su) throw new Error('Stream URL is required');
      const sig = await claimRoom({ connection, wallet, programId: ATRAX_PROGRAM_ID, roomName: rn, streamUrl: su });
      setRoomMsg(`Claimed: ${sig}`);
      setHasRoom(true);
      const id = parseYouTubeId(su);
      const origin = typeof window !== 'undefined' ? window.location.origin : '';
      if (id && wallet.publicKey && origin) setViewerUrl(`${origin}/viewer?video=${encodeURIComponent(id)}&streamer=${wallet.publicKey.toBase58()}`);
      // refresh room panel
      try {
        const info = await fetchRoom(connection, ATRAX_PROGRAM_ID, wallet.publicKey.toBase58());
        if (info) setRoomInfo(info);
      } catch {}
    } catch (e) {
      setRoomMsg(e.message || String(e));
    }
  }

  const onClaim = async () => {
    try {
      setBusy(true);
      setResult('');
      if (!hasRoom) throw new Error('Please claim a room first');
      if (!ATRAX_PROGRAM_ID) throw new Error('Set NEXT_PUBLIC_ATRAX_PROGRAM_ID or bundle IDL address');
      const lamports = Math.round(Number(amount || '0') * 1_000_000_000);
      const sig = await claimProfit({ connection, wallet, amountLamports: lamports, programId: ATRAX_PROGRAM_ID });
      setResult(`Success: ${sig}`);
    } catch (e) {
      setResult(e.message || String(e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="container">
      <header className="header">
        <div className="brand">
          <div className="brand-badge">🎮</div>
          <div className="brand-title">Streamer Dashboard</div>
        </div>
        <WalletMultiButton />
      </header>

      {/* Start Streaming + Room Info row */}
      <div className="equal-grid">
        <div className="card">
          <div className="card-header">
            <h2 className="section-title">Start Streaming</h2>
          </div>
          <div className="muted">Set up your on-chain stream room and generate a viewer link.</div>
          <label>Room Name</label>
          <input value={roomName} onChange={(e) => setRoomName(e.target.value)} placeholder="My Stream Room" />
          <label>Stream URL (YouTube)</label>
          <input value={streamUrl} onChange={(e) => setStreamUrl(e.target.value)} placeholder="https://youtube.com/watch?v=..." />
          <div className="row" style={{ marginTop: 10 }}>
            <button className="btn primary" onClick={onClaimRoom}>Start</button>
            {hasRoom ? <span className="muted">Room active</span> : <span className="muted">No room yet</span>}
          </div>
          {roomMsg && <div className="muted" style={{ marginTop: 8 }}>{roomMsg}</div>}
          {viewerUrl && (
            <div className="muted" style={{ marginTop: 8 }}>
              Viewer link: <span className="mono">{viewerUrl}</span>
              <div className="row" style={{ marginTop: 8 }}>
                <button className="btn secondary" onClick={async () => { try { await navigator.clipboard.writeText(viewerUrl); setResult('Copied!'); } catch {} }}>Copy</button>
              </div>
            </div>
          )}
          {feeInfo && <div className="muted" style={{ marginTop: 8 }}>On-chain fee: {feeInfo.feeBps} bps • Dev wallet: <span className="mono">{feeInfo.dev}</span></div>}
        </div>

        <div className="card" style={hasRoom ? {} : { filter: 'blur(2px)', opacity: 0.7 }}>
          <div className="card-header">
            <h2 className="section-title">Room Info</h2>
          </div>
          {roomInfo ? (
            <>
              <div className="muted">Live metadata for your current room.</div>
              <label>Room Name</label>
              <input readOnly value={roomInfo.roomName || ''} />
              <div className="row" style={{ gap: 8, marginTop: 8 }}>
                <button
                  className="btn secondary"
                  onClick={() => {
                    try {
                      const raw = roomInfo.streamUrl || '';
                      const id = parseYouTubeId(raw);
                      const url = /^https?:/i.test(raw) ? raw : (id ? `https://www.youtube.com/watch?v=${id}` : '');
                      if (url) window.open(url, '_blank', 'noopener,noreferrer');
                    } catch {}
                  }}
                >
                  Open Livestream
                </button>
                <button
                  className="btn secondary"
                  onClick={async () => {
                    try {
                      const origin = typeof window !== 'undefined' ? window.location.origin : '';
                      const id = parseYouTubeId(roomInfo.streamUrl || '');
                      const link = (origin && id && wallet.publicKey)
                        ? `${origin}/viewer?video=${encodeURIComponent(id)}&streamer=${wallet.publicKey.toBase58()}`
                        : '';
                      if (link) {
                        await navigator.clipboard.writeText(link);
                        setResult('Copied!');
                      }
                    } catch {}
                  }}
                >
                  Copy Viewer Link
                </button>
              </div>
              <div className="row" style={{ gap: 8, marginTop: 8 }}>
                <div className="muted">Latest item: <span className="mono">{roomInfo.latestChosenItem ?? '-'}</span></div>
                <div className="muted">Last buyer: <span className="mono">{roomInfo.lastBuyer?.toBase58 ? roomInfo.lastBuyer.toBase58() : '-'}</span></div>
              </div>
              <div className="muted" style={{ marginTop: 8 }}>
                Updated at: {roomInfo.timestamp ? new Date(roomInfo.timestamp * 1000).toLocaleString() : '-'}
              </div>
            </>
          ) : (
            <div className="muted">No room yet. Start streaming to create your room.</div>
          )}
        </div>
      </div>

      <div className="grid">
        <div className="card">
          <div className="card-header">
            <h2 className="section-title">Claim Profit</h2>
          </div>
          <div className="row">
            <input value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount in SOL" />
            <button className="btn primary" disabled={busy || !hasRoom} onClick={onClaim}>{busy ? 'Processing...' : 'Claim'}</button>
          </div>
          {result && <div className="muted" style={{ marginTop: 8 }}>{result}</div>}
        </div>
      </div>
    </div>
  );
}

