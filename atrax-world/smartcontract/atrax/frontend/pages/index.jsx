import React from 'react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="container">
      <header className="header">
        <div className="brand">
          <div className="brand-badge">🚀</div>
          <div className="brand-title">Atrax Streaming — Streamer Hub</div>
        </div>
      </header>

      <div className="card" style={{ marginBottom: 18 }}>
        <h2 className="section-title">Welcome, Streamers!</h2>
        <p className="muted">
          Plug your YouTube stream into an on-chain experience: accept donations, sell items, and let viewers influence gameplay.
        </p>
      </div>

      <div className="grid" style={{ alignItems: 'stretch' }}>
        <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <div className="card-header flush"><h3 className="section-title" style={{ margin: 0 }}>Quick Start</h3></div>
          <ol className="muted" style={{ paddingLeft: 18, margin: 0, flex: 1 }}>
            <li>Connect your wallet on the Streamer page</li>
            <li>Start Streaming (room name + YouTube URL)</li>
            <li>Copy the auto-generated Viewer link</li>
            <li>Share it and go live</li>
          </ol>
          <div className="row" style={{ marginTop: 12 }}>
            <Link href="/streamer" className="btn primary">Go to Streamer</Link>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <div className="card-header flush"><h3 className="section-title" style={{ margin: 0 }}>Tips</h3></div>
          <ul className="muted" style={{ paddingLeft: 18, margin: 0, flex: 1 }}>
            <li>Platform fee (bps) is shown in the Streamer Dashboard</li>
            <li>Viewer item price is set in Room Settings (on-chain)</li>
            <li>You can re-claim after 120s to update metadata</li>
            <li>Dev wallet receives the configured fee</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
