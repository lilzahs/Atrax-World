import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
const WalletMultiButton = dynamic(
  async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
  { ssr: false }
);
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { donate, buyItem } from '../onchain/instructions';
import ItemPicker from '../components/ItemPicker';
import { ATRAX_PROGRAM_ID } from '../lib/config';
import { fetchConfig } from '../lib/onchain';

export default function ViewerPage() {
  const { connection } = useConnection();
  const wallet = useWallet();
  const router = useRouter();

  const [streamer, setStreamer] = useState('');
  const [donation, setDonation] = useState('');
  const [itemId, setItemId] = useState('');
  const [amount, setAmount] = useState('');
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState('');
  const [videoId, setVideoId] = useState('');
  const [devWallet, setDevWallet] = useState('');
  const [feeBps, setFeeBps] = useState(null);

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
    } catch (_) {}
    return v; // assume already an id
  }

  useEffect(() => {
    if (!router.isReady) return;
    const q = router.query || {};
    const s = (q.streamer || q.s || '').toString();
    const v = (q.video || q.v || '').toString();
    if (s) setStreamer(s);
    if (v) setVideoId(parseYouTubeId(v));
  }, [router.isReady, router.query]);

  useEffect(() => {
    (async () => {
      try {
        if (!connection) return;
        const cfg = await fetchConfig(connection);
        if (cfg) {
          setDevWallet(cfg.devWallet.toBase58());
          setFeeBps(cfg.feeBps);
        }
      } catch (e) {
        // leave as-is; page can still function if user sets envs later
      }
    })();
  }, [connection]);

  const onDonate = async () => {
    try {
      setBusy(true);
      setResult('');
      if (!ATRAX_PROGRAM_ID) throw new Error('Set NEXT_PUBLIC_ATRAX_PROGRAM_ID or bundle IDL address');
      if (!devWallet) throw new Error('Config not found on-chain (dev wallet missing). Initialize via tester.');
      const lamports = Math.round(Number(donation || '0') * 1_000_000_000);
      const sig = await donate({
        connection,
        wallet,
        streamer,
        lamports,
        programId: ATRAX_PROGRAM_ID,
        // derive config PDA inside the instruction by idl/program context; pass dev wallet from on-chain
        configPda: undefined,
        devWallet: devWallet,
      });
      setResult(`Donation success: ${sig}`);
    } catch (e) {
      setResult(e.message || String(e));
    } finally {
      setBusy(false);
    }
  };

  const onBuy = async () => {
    try {
      setBusy(true);
      setResult('');
      if (!ATRAX_PROGRAM_ID) throw new Error('Set NEXT_PUBLIC_ATRAX_PROGRAM_ID or bundle IDL address');
      if (!devWallet) throw new Error('Config not found on-chain (dev wallet missing). Initialize via tester.');
      const lamports = Math.round(Number(amount || '0') * 1_000_000_000);
      const sig = await buyItem({
        connection,
        wallet,
        itemId: Number(itemId || 0),
        amountLamports: lamports,
        programId: ATRAX_PROGRAM_ID,
        configPda: undefined,
        devWallet: devWallet,
      });
      setResult(`Purchase success: ${sig}`);
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
          <div className="brand-badge">▶</div>
          <div className="brand-title">Viewer Panel</div>
        </div>
        <WalletMultiButton />
      </header>

      {videoId && (
        <div className="card">
          <div className="video-embed">
            <iframe
              src={`https://www.youtube.com/embed/${videoId}`}
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        </div>
      )}

      <div className="grid">
        <div className="card">
          <div className="card-header">
            <h2 className="section-title">Donate</h2>
          </div>
          <label>Streamer (pubkey)</label>
          <input value={streamer} onChange={(e) => setStreamer(e.target.value)} placeholder="Streamer address" />
          <label>Amount (SOL)</label>
          <input value={donation} onChange={(e) => setDonation(e.target.value)} placeholder="0.1" />
          <div className="row" style={{ marginTop: 10 }}>
            <button className="btn primary" disabled={busy} onClick={onDonate}>{busy ? 'Processing…' : 'Donate'}</button>
          </div>
          {feeBps !== null && (
            <div className="muted" style={{ marginTop: 8 }}>Fee: {feeBps} bps • Dev wallet: <span className="mono">{devWallet}</span></div>
          )}
        </div>

        <div className="card">
          <div className="card-header">
            <h2 className="section-title">Buy Item</h2>
          </div>
          <label>Item ID</label>
          <input value={itemId} onChange={(e) => setItemId(e.target.value)} placeholder="1" />
          <label>Amount (SOL)</label>
          <input value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.05" />
          <div className="row" style={{ marginTop: 10 }}>
            <button className="btn secondary" disabled={busy} onClick={onBuy}>{busy ? 'Processing…' : 'Buy'}</button>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h2 className="section-title">Choose Item (Viewer → Streamer)</h2>
          </div>
          <div className="muted" style={{ marginBottom: 8 }}>
            Pay fixed price from Room Settings, fee to dev wallet per config.
          </div>
          <ItemPicker
            connection={connection}
            wallet={wallet}
            streamer={streamer}
            devWallet={devWallet}
            programId={ATRAX_PROGRAM_ID}
            defaultRoomId={(router.query?.room || router.query?.r || '').toString() || undefined}
            onSuccess={(e) => setResult(`Choose item success: room ${e.roomId}, item ${e.itemType}`)}
          />
        </div>
      </div>

      {(!ATRAX_PROGRAM_ID) && (
        <div className="card muted">Set NEXT_PUBLIC_ATRAX_PROGRAM_ID (defaults to bundled IDL address).</div>
      )}

      {result && <div className="card" style={{ marginTop: 12 }}>{result}</div>}
    </div>
  );
}
