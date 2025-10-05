import React from 'react';

export default function Leaderboard({ entries }) {
  const sorted = [...(entries || [])].sort((a,b) => b.total - a.total).slice(0, 10);
  return (
    <div className="card">
      <div className="card-header"><h2 className="section-title">Top ủng hộ hôm nay</h2></div>
      {sorted.length === 0 && <div className="muted">Chưa có ủng hộ nào</div>}
      {sorted.map((e, idx) => (
        <div key={e.addr} className="row" style={{ justifyContent: 'space-between', padding: '4px 0' }}>
          <div>#{idx+1} <span className="mono">{e.addr.slice(0,4)}…{e.addr.slice(-4)}</span></div>
          <div className="muted">{e.total.toFixed(3)} SOL</div>
        </div>
      ))}
    </div>
  );
}

