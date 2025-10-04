Game Design (High-level)

Core Loop
- Players build and expand villages on a shared world map
- Streamers can play live; viewers donate items/funds to influence gameplay
- Economy uses SOL; donations and trades flow via Atrax program

Systems
- Building placement (grid-based), inventory, simple movement
- Shop purchases (dev shop): payer → dev_wallet (100%)
- Player trade: buyer → seller (minus fee to dev)
- Donations: donor → streamer (minus fee to dev)

Ownership Models for Items
- PDA-based: program-owned accounts for ownership (simple, cheap, DApp-local)
- SPL fungible tokens (decimals=0): good for stackable items; ATA-based balances
- NFTs/Compressed NFTs: for unique items; integrates with wallets/marketplaces

Phased Plan
- Phase 1: PDA-based ownership for fast iteration
- Phase 2: SPL tokens for common items; NFTs for rare items

Land System
- LandAccount PDA is derived by `["land", owner]` and stores `land_id`, owner
- TransferLand updates the owner field but PDA key stays tied to original owner seed
- Consider redesign to seed by `land_id` if ownership transfer needs matching PDA
