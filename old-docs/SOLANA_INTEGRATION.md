Solana Integration Notes (Atrax)

Toolchain
- Anchor on-chain: `anchor-lang = "0.31.0"`
- Anchor JS: `@coral-xyz/anchor@^0.31.0`
- Web3: `@solana/web3.js@^1.95.3`
- Wallet Adapters (pinned):
  - `@solana/wallet-adapter-react@0.15.39`
  - `@solana/wallet-adapter-react-ui@0.9.39`
  - `@solana/wallet-adapter-wallets@0.19.37`
  - `@solana/wallet-adapter-base@0.9.27`

Frontend Patterns
- Provider
  - Use `useAnchorWallet()` and construct `AnchorProvider(connection, wallet)`
  - Provide global Buffer for browser: `window.Buffer = Buffer`
- Program
  - Prefer on-chain IDL: `Program.fetchIdl(PROGRAM_ID, provider)` then `new Program(idl, provider)`
  - Fallback to bundled IDL only if on-chain IDL missing
- PDA helpers
  - `config = PublicKey.findProgramAddressSync([Buffer.from('config')], PROGRAM_ID)`
  - `land = PublicKey.findProgramAddressSync([Buffer.from('land'), owner], PROGRAM_ID)`

IDL Sync
- After `anchor build`, copy IDL into FE:
  - `cp server/smart-contracts/atrax/target/idl/atrax.json server/smart-contracts/atrax/frontend/src/idl/atrax.json`
- Hard refresh browser to reload IDL

Initialize Gating (UI)
- If config not found on chain, show only Initialize form
- After Initialize, show all features; Update Config/Admin dimmed unless wallet is admin
- For Donate/Buy/Trade, FE auto-uses `config.dev_wallet` (no manual input)

Calling Patterns (examples)
- Initialize
```
await program.methods
  .initialize(devWallet, feeBps)
  .accounts({ config, admin: wallet.publicKey, systemProgram: SystemProgram.programId })
  .rpc();
```

- Update Admin (explicit instruction + send)
```
const ix = await program.methods
  .updateAdmin(newAdmin)
  .accounts({ config, admin: wallet.publicKey })
  .instruction();
const tx = new Transaction().add(ix);
await program.provider.sendAndConfirm(tx);
```

Common Pitfalls
- IDL mismatch → coder encode errors. Fix: build+deploy and copy IDL, reload FE.
- Wrong dev_wallet in accounts → `InvalidDevWallet`. Fix: FE uses `config.dev_wallet` automatically.
- Admin auth errors → Ensure connected wallet equals `config.admin`.
