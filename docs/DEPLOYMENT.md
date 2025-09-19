Deployment Guide

Prerequisites
- Solana CLI installed and keypair configured (`solana-keygen new`).
- Anchor CLI installed.
- Set provider env: `ANCHOR_PROVIDER_URL` (e.g., devnet) and `ANCHOR_WALLET`.

Build & Deploy (Program)
1) `cd server/smart-contracts/atrax`
2) `anchor build`
3) `anchor deploy`
4) Update program ID in `Anchor.toml` if Anchor generated a new keypair.

Initialize Config
- Call `initialize(dev_wallet, fee_bps)`. See examples in `docs/SOLANA_INTEGRATION.md`.

Web Apps
- Game client: open `client/index.html` or serve via static server.
- Viewer app: open `viewer-app/index.html`.
- Server: configure `.env` and run with Node (see `server/` configs).
