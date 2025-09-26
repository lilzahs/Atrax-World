Atrax Program API (Solana / Anchor)

Program ID
- `35eYtQ3hgAqmDUtwcEQ6WFKfQri7figJGe9vR25mmMiC`

Accounts
- `Config` PDA
  - Seeds: `b"config"`
  - Fields: `admin: Pubkey`, `dev_wallet: Pubkey`, `fee_bps: u16`, `bump: u8`
  - Purpose: global settings and authority
- `LandAccount` PDA
  - Seeds: `b"land", owner`
  - Fields: `land_id: u64`, `owner: Pubkey`, `bump: u8`, `initialized: u8`

Instructions
- `initialize(dev_wallet: Pubkey, fee_bps: u16)`
  - Accounts: `config (init, payer=admin)`, `admin (Signer)`, `system_program`
  - Auth: any wallet (becomes admin)
  - Notes: creates config; fee_bps ≤ 10000 bps; emits ConfigInitialized

- `update_config(new_dev_wallet: Pubkey, new_fee_bps: u16)`
  - Accounts: `config (mut, has_one=admin)`, `admin (Signer)`
  - Auth: admin only
  - Notes: rotates dev wallet and fee; emits ConfigUpdated

- `update_admin(new_admin: Pubkey)`
  - Accounts: `config (mut, has_one=admin)`, `admin (Signer)`
  - Auth: admin only
  - Notes: rotates admin; emits AdminUpdated

- `donate(amount: u64)`
  - Accounts: `donor (Signer, mut)`, `streamer (mut)`, `dev_wallet (mut)`, `config`, `system_program`
  - Auth: any wallet (donor)
  - Notes: transfers amount; fee = amount*fee_bps/10000 → dev_wallet; rest → streamer; emits DonationEvent

- `buy_item(_item_id: u16, amount: u64)`
  - Accounts: `payer (Signer, mut)`, `dev_wallet (mut)`, `config`, `system_program`
  - Auth: any wallet (payer)
  - Notes: 100% amount → dev_wallet; emits ShopPurchaseEvent

- `trade_item(_item_id: u16, amount: u64)`
  - Accounts: `buyer (Signer, mut)`, `seller (mut)`, `dev_wallet (mut)`, `config`, `system_program`
  - Auth: buyer
  - Notes: fee to dev_wallet; remainder to seller; emits TradeEvent

- `initialize_land(land_id: u64)`
  - Accounts: `owner (Signer, mut)`, `land (init, seeds=[b"land", owner])`, `system_program`
  - Auth: owner
  - Notes: initializes LandAccount for owner

- `transfer_land(land_id: u64, new_owner: Pubkey)`
  - Accounts: `owner (Signer, mut)`, `land (mut, seeds=[b"land", owner])`
  - Auth: current owner
  - Notes: updates owner field; PDA still derived from old owner seed

- `claim_profit(_amount: u64)`
  - Accounts: `claimer (Signer, mut)`
  - Auth: any wallet
  - Notes: placeholder; no vault logic yet

Events
- `ConfigInitialized{ admin, dev_wallet, fee_bps }`
- `ConfigUpdated{ dev_wallet, fee_bps }`
- `AdminUpdated{ new_admin }`
- `DonationEvent{ donor, streamer, amount, fee_bps }`
- `ShopPurchaseEvent{ payer, amount }`
- `TradeEvent{ buyer, seller, amount }`
- `LandTransferEvent{ land_id, new_owner }`

Errors
- `InvalidAmount`
- `FeeTooHigh`
- `InvalidDevWallet`
- `Unauthorized`
- `MathOverflow`
- `LandNotInitialized`
- `InvalidLandId`

Authority Model
- Admin: controls `update_config`, `update_admin` (must sign)
- Dev wallet: fee recipient; must match `config.dev_wallet` in accounts for Donate/Buy/Trade

PDAs
- `config_pda = findProgramAddress(["config"])`
- `land_pda = findProgramAddress(["land", owner])`

Frontend Tester
- Path: `server/smart-contracts/atrax/frontend`
- Behaviors:
  - Shows only Initialize until config exists
  - Dim Update Config/Admin if current wallet ≠ admin
  - Auto-fills dev_wallet from config for Donate/Buy/Trade
