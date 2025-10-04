Streaming Setup (YouTube) — Outline

Goal
- Streamers can broadcast on YouTube while gameplay and donations integrate with Solana.

Basic Flow
- Streamer plays the game (desktop-optimized UI)
- Viewer opens a mobile-friendly viewer site to watch and donate
- Donations go on-chain via Atrax program and are reflected in-game via server events

Suggested Components (non-blocking for on-chain tests)
- Game client overlay: shows latest donations, top donors
- Viewer site: YouTube embed + Solana wallet connect + donation buttons
- Server bridge: listens to confirmed donation txs and pushes events to clients (WebSocket)

Notes
- On-chain fee model comes from Config (fee_bps, dev_wallet)
- Donate path does not require streamer to sign; donor signs the tx
- Start simple: wire the FE tester first, then add server and viewer apps
