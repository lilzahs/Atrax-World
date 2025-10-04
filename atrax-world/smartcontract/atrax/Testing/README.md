Atrax Frontend Tester

Quick React + Vite UI to test the Atrax Anchor program on devnet.

Setup

- Prerequisites: Node 18+, Yarn or npm, a Solana wallet extension (Phantom/Solflare/Backpack)
- Environment (optional): set `VITE_RPC_URL` to a custom RPC. Defaults to Solana devnet.

Commands

- `yarn install` (or `npm install`)
- `yarn dev` (or `npm run dev`) then open http://localhost:5173

Notes

- Program ID: 35eYtQ3hgAqmDUtwcEQ6WFKfQri7figJGe9vR25mmMiC (as in Anchor.toml)
- The UI computes PDAs for `config` (seed `"config"`) and `land` (seed `"land"`, owner).
- For Donate/Buy/Trade, ensure the `dev_wallet` input matches the value stored in `config` or the program will reject.
- `transfer_land` updates the owner inside the account but the PDA remains derived from the original owner; subsequent calls expecting PDA(seed=["land", new_owner]) will not match.

Progress Tracker

Use this section to track implementation progress across on-chain and Testing UI.

- On-chain (Anchor program)
  - [x] `initialize`
  - [x] `update_config`
  - [x] `donate`
  - [x] `buy_item`
  - [x] `trade_item`
  - [x] `initialize_land`
  - [x] `transfer_land`
  - [x] `claim_profit` (placeholder in program)
  - [x] `update_admin`
  - [x] `initialize_room_settings` (item_price only)
  - [x] `update_room_settings` (item_price only)
  - [x] `claim_room` (room_name, stream_url, 120s cooldown)
  - [x] `choose_item` (fixed price from RoomSettings; fee to dev)
  - [ ] Extended room features (planned): `update_room_metadata`, `set_room_status`, `release_room`

- Testing UI
  - [x] Config initialize/update
  - [x] Donate/Buy/Trade
  - [x] Land initialize/transfer
  - [x] Claim profit (calls placeholder)
  - [x] Room Settings initialize/update (item price)
  - [x] Claim Room (basic fields)
  - [ ] Choose Item UI (buyer flow)
  - [ ] Live Rooms: show last chosen item, last buyer
  - [ ] Remove/disable placeholders for planned room features until IDL is updated

How to update this tracker

- Mark items as done when the corresponding on-chain method is deployed and the Testing UI can exercise it end-to-end.
- If you add new methods on-chain, extend this list and keep it in sync so everyone can see progress at a glance.
- Optionally, keep `progress.json` up to date for automation or CI dashboards.

Tips

- If the UI shows method-not-found errors, re-run `anchor build && anchor deploy`, then copy the updated IDL into `src/idl/atrax.json`.
- The Testing UI currently contains placeholders for planned room-management features; they remain disabled until those methods land in the IDL.
