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

