Atrax World

- Web game with Solana + YouTube streaming integration.
- Single Anchor program consolidates core on-chain features for the demo.

Key Paths
- Program: `server/smart-contracts/atrax/programs/atrax/src/lib.rs`
- Docs: `docs/API.md`, `docs/SOLANA_INTEGRATION.md`, `Project_Details`, `KE_HOACH_CHI_TIET.md`

Docs
- API: instructions, accounts, and events — see `docs/API.md`.
- Solana integration: PDA derivation, client examples — see `docs/SOLANA_INTEGRATION.md`.
- Plan & timeline: `KE_HOACH_CHI_TIET.md` (Vietnamese).
- Project overview: `Project_Details` (Vietnamese).

Dev Quickstart
1) Install Solana CLI and Anchor.
2) Build and deploy program:
   - `cd server/smart-contracts/atrax`
   - `anchor build && anchor deploy`
3) Initialize config on-chain via Anchor client or server script.
