import React from 'react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="container">
      <header className="header">
        <div className="brand">
          <div className="brand-badge">★</div>
          <div className="brand-title">Atrax Streaming</div>
        </div>
        <div className="muted">Choose your role</div>
      </header>

      <div className="grid">
        <Link href="/streamer" className="tile" title="Streamer">
          <h3 className="tile-title">Streamer</h3>
          <p className="tile-desc">Claim profits, share viewer link, connect wallet</p>
        </Link>

        <Link href="/viewer" className="tile" title="Viewer">
          <h3 className="tile-title">Viewer</h3>
          <p className="tile-desc">Watch on YouTube, donate and support gameplay</p>
        </Link>

        <Link href="/demo" className="tile" title="Demo">
          <h3 className="tile-title">Demo</h3>
          <p className="tile-desc">Placeholder area to embed overlays or previews</p>
        </Link>
      </div>
    </div>
  );
}

