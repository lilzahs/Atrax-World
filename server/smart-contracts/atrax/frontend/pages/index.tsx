import { useCallback, useEffect, useMemo, useState } from 'react';

type WalletType = 'phantom' | 'solflare';

function isBrowser() { return typeof window !== 'undefined'; }

export default function Home() {
  const [walletType, setWalletType] = useState<WalletType>('phantom');
  const [wallet, setWallet] = useState<string>('');
  const [programId, setProgramId] = useState<string>('');
  const [log, setLog] = useState<string>('');
  const [configJson, setConfigJson] = useState<string>('');
  const append = useCallback((x: unknown) => setLog((prev) => `${new Date().toLocaleTimeString()}\n${typeof x === 'string' ? x : JSON.stringify(x, null, 2)}\n\n${prev}`), []);

  useEffect(() => {
    if (!isBrowser()) return;
    const saved = localStorage.getItem('atrax_program_id') || '';
    if (saved) setProgramId(saved);
  }, []);

  const ensureProgram = useCallback(async () => {
    if (!isBrowser()) throw new Error('Client only');
    if (!programId) throw new Error('Set Program ID first');
    const m = await import('../src/lib/anchorClient');
    m.setProgramIdStr(programId);
    return m.getProgram(walletType);
  }, [walletType, programId]);

  const onSetProgram = useCallback(() => {
    if (!isBrowser()) return;
    try {
      localStorage.setItem('atrax_program_id', programId.trim());
      append({ programIdSet: programId.trim() });
    } catch (e: any) { append(`Program ID error: ${e.message || e}`); }
  }, [append, programId]);

  const onConnect = useCallback(async () => {
    try {
      const program = await ensureProgram();
      const pubkey = (program.provider as any).wallet.publicKey.toBase58();
      setWallet(pubkey);
      append({ connected: pubkey, programId });
    } catch (e: any) { append(`Connect error: ${e.message || e}`); }
  }, [ensureProgram, append, programId]);

  const onFetchConfig = useCallback(async () => {
    try {
      const program = await ensureProgram();
      const { deriveConfigPda } = await import('../src/lib/anchorClient');
      const pda = deriveConfigPda(program.programId);
      const cfg = await (program.account as any).config.fetchNullable(pda);
      setConfigJson(cfg ? JSON.stringify({ pda: pda.toBase58(), ...cfg }, null, 2) : 'Config not initialized');
    } catch (e: any) { append(`Fetch config error: ${e.message || e}`); }
  }, [ensureProgram, append]);

  const onInitConfig = useCallback(async () => {
    try {
      const devWallet = (document.getElementById('devWallet') as HTMLInputElement).value.trim();
      const feeBps = Number((document.getElementById('feeBps') as HTMLInputElement).value.trim() || '1000');
      const program = await ensureProgram();
      const { PublicKey, SystemProgram, deriveConfigPda } = await import('../src/lib/anchorClient');
      const walletPk = (program.provider as any).wallet.publicKey;
      const pda = deriveConfigPda(program.programId);
      const sig = await (program.methods as any)
        .initialize(new PublicKey(devWallet), feeBps)
        .accounts({ admin: walletPk, config: pda, systemProgram: SystemProgram.programId })
        .rpc();
      append({ initializeSig: sig });
    } catch (e: any) { append(`Initialize error: ${e.message || e}`); }
  }, [ensureProgram, append]);

  const onDonate = useCallback(async () => {
    try {
      const streamer = (document.getElementById('donateStreamer') as HTMLInputElement).value.trim();
      const lamports = (document.getElementById('donateAmount') as HTMLInputElement).value.trim();
      const program = await ensureProgram();
      const { anchor, PublicKey, SystemProgram, deriveConfigPda } = await import('../src/lib/anchorClient');
      const walletPk = (program.provider as any).wallet.publicKey;
      const pda = deriveConfigPda(program.programId);
      const cfg = await (program.account as any).config.fetch(pda);
      const devWallet = new PublicKey(cfg.devWallet);
      const sig = await (program.methods as any)
        .donate(new anchor.BN(lamports))
        .accounts({ donor: walletPk, streamer: new PublicKey(streamer), devWallet, config: pda, systemProgram: SystemProgram.programId })
        .rpc();
      append({ donateSig: sig });
    } catch (e: any) { append(`Donate error: ${e.message || e}`); }
  }, [ensureProgram, append]);

  return (
    <main style={{ padding: 16, fontFamily: 'system-ui, Arial, sans-serif' }}>
      <h2>Atrax Program Tester (Next.js)</h2>

      <section style={{ border: '1px solid #ddd', padding: 12, marginBottom: 12 }}>
        <h3>Wallet</h3>
        <label>Provider&nbsp;
          <select value={walletType} onChange={(e) => setWalletType(e.target.value as WalletType)}>
            <option value="phantom">Phantom</option>
            <option value="solflare">Solflare</option>
          </select>
        </label>
        <div style={{ marginTop: 8 }}>
          <input id="programId" placeholder="Program ID (base58)" value={programId} onChange={(e) => setProgramId(e.target.value)} style={{ width: '360px' }} />
          <button onClick={onSetProgram} style={{ marginLeft: 8 }}>Set Program</button>
          <button onClick={onConnect} style={{ marginLeft: 8 }}>Connect</button>
        </div>
        <div style={{ marginTop: 6 }}>Wallet: {wallet || '-'}</div>
      </section>

      <section style={{ border: '1px solid #ddd', padding: 12, marginBottom: 12 }}>
        <h3>Config</h3>
        <div style={{ marginBottom: 8 }}>
          <button onClick={onFetchConfig}>Fetch Config</button>
        </div>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <div>
            <label>Dev Wallet<br />
              <input id="devWallet" placeholder="Dev wallet pubkey" style={{ width: 320 }} />
            </label>
          </div>
          <div>
            <label>Fee BPS (1000=10%)<br />
              <input id="feeBps" type="number" defaultValue={1000} style={{ width: 160 }} />
            </label>
          </div>
          <div style={{ alignSelf: 'end' }}>
            <button onClick={onInitConfig}>Initialize</button>
          </div>
        </div>
        <pre style={{ background: '#f5f5f5', padding: 8, minHeight: 80 }}>{configJson}</pre>
      </section>

      <section style={{ border: '1px solid #ddd', padding: 12, marginBottom: 12 }}>
        <h3>Donate</h3>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <div>
            <label>Streamer<br />
              <input id="donateStreamer" placeholder="Streamer pubkey" style={{ width: 320 }} />
            </label>
          </div>
          <div>
            <label>Amount (lamports)<br />
              <input id="donateAmount" type="number" defaultValue={1000000} style={{ width: 200 }} />
            </label>
          </div>
          <div style={{ alignSelf: 'end' }}>
            <button onClick={onDonate}>Donate</button>
          </div>
        </div>
      </section>

      <section>
        <h3>Output</h3>
        <pre style={{ background: '#f5f5f5', padding: 8, minHeight: 100 }}>{log}</pre>
      </section>
    </main>
  );
}

