import React, { useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
const WalletMultiButton = dynamic(
  async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
  { ssr: false }
);
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { claimProfit } from '../onchain/instructions';
import { ATRAX_PROGRAM_ID, ATRAX_CONFIG_PDA, DEV_WALLET } from '../lib/config';
import { fetchConfig } from '../lib/onchain';

export default function StreamerPage() {
  const { connection } = useConnection();
  const wallet = useWallet();
  const [amount, setAmount] = useState(''); // SOL
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState('');
  const [feeInfo, setFeeInfo] = useState(null);
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [viewerUrl, setViewerUrl] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const cfg = await fetchConfig(connection);
        if (cfg) setFeeInfo({ feeBps: cfg.feeBps, dev: cfg.devWallet.toBase58() });
      } catch {}
    })();
  }, [connection]);

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

  function buildViewerUrl() {
    const id = parseYouTubeId(youtubeUrl.trim());
    if (!id || !wallet.publicKey) return '';
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    return `${origin}/viewer?video=${encodeURIComponent(id)}&streamer=${wallet.publicKey.toBase58()}`;
  }

  const onClaim = async () => {
    try {
      setBusy(true);
      setResult('');
      if (!ATRAX_PROGRAM_ID) throw new Error('Set NEXT_PUBLIC_ATRAX_PROGRAM_ID or bundle IDL address');
      const lamports = Math.round(Number(amount || '0') * 1_000_000_000);
      const sig = await claimProfit({
        connection,
        wallet,
        amountLamports: lamports,
        programId: ATRAX_PROGRAM_ID,
      });
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
          <div className="brand-badge">⟡</div>
          <div className="brand-title">Streamer Dashboard</div>
        </div>
        <WalletMultiButton />
      </header>

      <div className="grid">
        <div className="card">
          <div className="card-header">
            <h2 className="section-title">Share Viewer Link</h2>
          </div>
          <label>YouTube URL or ID</label>
          <input value={youtubeUrl} onChange={(e)=> setYoutubeUrl(e.target.value)} placeholder="https://youtube.com/watch?v=..." />
          <div className="row" style={{ marginTop: 10 }}>
            <button className="btn primary" onClick={()=> setViewerUrl(buildViewerUrl())}>Generate</button>
            <button className="btn secondary" disabled={!viewerUrl} onClick={async ()=> { try { await navigator.clipboard.writeText(viewerUrl); setResult('Copied!'); } catch {} }}>Copy</button>
          </div>
          {viewerUrl && <div className="muted" style={{ marginTop: 8 }}><span className="mono">{viewerUrl}</span></div>}
          {feeInfo && <div className="muted" style={{ marginTop: 8 }}>On-chain fee: {feeInfo.feeBps} bps • Dev wallet: <span className="mono">{feeInfo.dev}</span></div>}
        </div>

        <div className="card">
          <div className="card-header">
            <h2 className="section-title">Claim Profit</h2>
          </div>
          <div className="row">
            <input value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount in SOL" />
            <button className="btn primary" disabled={busy} onClick={onClaim}>{busy ? 'Processing…' : 'Claim'}</button>
          </div>
          {result && <div className="muted" style={{ marginTop: 8 }}>{result}</div>}
        </div>

        <div className="card">
          <div className="card-header">
            <h2 className="section-title">Overlay/Game Integration</h2>
          </div>
          <div className="muted">Embed your game/overlay here or via a dedicated component. The scaffold is agnostic to game type.</div>
        </div>
      </div>
    </div>
  );
}
