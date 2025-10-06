import React, { useEffect, useMemo, useState } from 'react';
import { chooseItem } from '../onchain/instructions';
import { fetchRoomSettings } from '../lib/onchain';

const ITEMS = [0, 1, 2, 3, 4, 5, 6];

export default function ItemPicker({
  connection,
  wallet,
  streamer,
  devWallet,
  programId,
  onSuccess,
}) {
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');
  const [itemType, setItemType] = useState(0);
  const [priceLamports, setPriceLamports] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const rs = await fetchRoomSettings(connection, programId);
        if (rs?.priceLamports != null) setPriceLamports(rs.priceLamports);
      } catch {}
    })();
  }, [connection, programId]);

  const priceSol = useMemo(() => (priceLamports != null ? Number(priceLamports) / 1_000_000_000 : null), [priceLamports]);

  async function onChoose() {
    try {
      setBusy(true);
      setMsg('');
      if (!programId) throw new Error('Chưa cấu hình chương trình');
      if (!devWallet) throw new Error('Thiếu dev wallet (chưa initialize config)');
      const sig = await chooseItem({ connection, wallet, programId, itemType, streamer, devWallet });
      setMsg(`Thành công: ${sig}`);
      onSuccess?.({ kind: 'item', itemType, priceSol });
    } catch (e) {
      setMsg(e.message || String(e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="card">
      <div className="card-header"><h2 className="section-title">Chọn item</h2></div>
      <div className="row" style={{ gap: 8, marginTop: 8 }}>
        {ITEMS.map((i) => (
          <button key={i} className={`btn ${itemType === i ? 'primary' : ''}`} onClick={() => setItemType(i)}>
            #{i}
          </button>
        ))}
      </div>
      <div className="muted" style={{ marginTop: 6 }}>
        Giá cố định: {priceSol != null ? `${priceSol} SOL` : '…'}
      </div>
      <div className="row" style={{ marginTop: 10 }}>
        <button className="btn primary" disabled={busy} onClick={onChoose}>
          {busy ? 'Đang xử lý…' : 'Chọn ngay'}
        </button>
      </div>
      {msg && <div className="muted" style={{ marginTop: 8 }}>{msg}</div>}
    </div>
  );
}

