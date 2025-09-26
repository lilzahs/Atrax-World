Deployment Guide

Prerequisites
- Solana CLI installed and keypair configured (`solana-keygen new`).
- Anchor CLI installed (`@coral-xyz/anchor-cli`).
- Set provider env or rely on Anchor.toml provider:
  - Env: `ANCHOR_PROVIDER_URL` (e.g., devnet) and `ANCHOR_WALLET`
  - Or `server/smart-contracts/atrax/Anchor.toml` with `cluster = "devnet"` and `wallet = "~/.config/solana/id.json"`

Build & Deploy (Program)
1) `cd server/smart-contracts/atrax`
2) `anchor build`
3) `anchor deploy`
4) Confirm Program ID matches: `Anchor.toml` and FE read it from IDL `address`.

Sync IDL to Frontend
- Always copy the compiled IDL after any on-chain change:
  - PowerShell: `Copy-Item server/smart-contracts/atrax/target/idl/atrax.json server/smart-contracts/atrax/frontend/src/idl/atrax.json -Force`
  - Bash: `cp server/smart-contracts/atrax/target/idl/atrax.json server/smart-contracts/atrax/frontend/src/idl/atrax.json`

Initialize Config (first time)
- Call `initialize(dev_wallet, fee_bps)` with your admin wallet connected.
- Admin = the signer of initialize; Dev wallet = fee recipient.
- Fee is in bps (0–10000). If >10000, tx fails.

Frontend Tester (React + Vite)
1) `cd server/smart-contracts/atrax/frontend`
2) Install deps (pinned for compatibility):
   - npm: `npm install`
3) Run dev server: `npm run dev` then open http://localhost:5173
4) Connect wallet and test instructions.

Notes
- Frontend fetches IDL from on-chain first (fallback to bundled). Keep IDL deployed and synced.
- UI shows only Initialize until config exists; Update Config/Admin is dimmed unless you are admin.
- Dev wallet is auto-filled from config for Donate/Buy/Trade.
