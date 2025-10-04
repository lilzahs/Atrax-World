import React from 'react';

export default function DemoPage() {
  return (
    <div className="container">
      <header className="header">
        <div className="brand">
          <div className="brand-badge">◇</div>
          <div className="brand-title">Demo</div>
        </div>
      </header>
      <div className="card">
        <p className="muted">
          This is a placeholder viewport. Integrate any game or overlay here to test streamer interactions without committing
          to a specific game.
        </p>
      </div>
    </div>
  );
}
