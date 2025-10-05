import React, { useMemo, useState } from 'react';
import { donate } from '../onchain/instructions';

export default function DonationPanel({
  connection,
  wallet,
  streamer,
  feeBps,
  devWallet,
  programId,
  onSuccess,
}) {
  const [amount, setAmount] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');

  const parsed = useMemo(() => {
    const v = Math.max(0, Number(amount || 0));
    const fee = (v * (Number(feeBps || 0) / 10000));
    const toStreamer = Math.max(0, v - fee);
    return { v, fee, toStreamer };
  }, [amount, feeBps]);

  const quick = [0.05, 0.1, 0.5];

  async function onDonate() {
    try {
      setBusy(true);
      setMsg('');
      if (!programId) throw new Error('Chưa cấu hình chương trình');
      if (!devWallet) throw new Error('Thiếu dev wallet (chưa initialize config)');
      const lamports = Math.round(parsed.v * 1_000_000_000);
      const sig = await donate({ connection, wallet, streamer, lamports, programId, devWallet });
      setMsg(`Thành công: ${sig}`);
      onSuccess?.({ kind: 'donation', amount: parsed.v, streamer, sig });
    } catch (e) {
      setMsg(e.message || String(e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="card">
      <div className="card-header"><h2 className="section-title">Ủng hộ nhanh</h2></div>
      <div className="row" style={{ gap: 8 }}>
        {quick.map(q => (
          <button key={q} className="btn" onClick={() => setAmount(String(q))}>{q} SOL</button>
        ))}
      </div>
      <label>Số lượng (SOL)</label>
      <input value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.1" />
      <div className="muted" style={{ marginTop: 6 }}>
        Ước tính: Streamer nhận {parsed.toStreamer.toFixed(4)} SOL • Phí {parsed.fee.toFixed(4)} SOL
      </div>
      <div className="row" style={{ marginTop: 10 }}>
        <button className="btn primary" disabled={busy} onClick={onDonate}>{busy ? 'Đang xử lý…' : 'Ủng hộ'}</button>
      </div>
      {msg && <div className="muted" style={{ marginTop: 8 }}>{msg}</div>}
    </div>
  );
}

