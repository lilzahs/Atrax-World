use anchor_lang::prelude::*;
use anchor_lang::system_program;

declare_id!("35eYtQ3hgAqmDUtwcEQ6WFKfQri7figJGe9vR25mmMiC");

const BPS_DENOMINATOR: u64 = 10_000; // 100% = 10_000 bps
// TTL for a claimed room session. A room is considered active
// if current time <= room.expires_at. Kept constant for now
// to make off-chain discovery simple and fast.
const ROOM_TTL_SECONDS: i64 = 120;

#[program]
pub mod atrax {
    use super::*;

    // Initializes global config (admin, dev wallet, fee).
    pub fn initialize(ctx: Context<Initialize>, dev_wallet: Pubkey, fee_bps: u16) -> Result<()> {
        require!(fee_bps as u64 <= BPS_DENOMINATOR, AtraxError::FeeTooHigh);

        let cfg = &mut ctx.accounts.config;
        cfg.admin = ctx.accounts.admin.key();
        cfg.dev_wallet = dev_wallet;
        cfg.fee_bps = fee_bps;
        cfg.bump = ctx.bumps.config;

        emit!(ConfigInitialized { admin: cfg.admin, dev_wallet, fee_bps });
        Ok(())
    }

    // Admin can update dev wallet and fee.
    pub fn update_config(ctx: Context<UpdateConfig>, new_dev_wallet: Pubkey, new_fee_bps: u16) -> Result<()> {
        require!(new_fee_bps as u64 <= BPS_DENOMINATOR, AtraxError::FeeTooHigh);
        let cfg = &mut ctx.accounts.config;
        cfg.dev_wallet = new_dev_wallet;
        cfg.fee_bps = new_fee_bps;
        emit!(ConfigUpdated { dev_wallet: new_dev_wallet, fee_bps: new_fee_bps });
        Ok(())
    } 

    // Viewer donates lamports: 90% (by fee) to streamer, fee to dev wallet.
    pub fn donate(ctx: Context<Donate>, amount: u64) -> Result<()> {
        require!(amount > 0, AtraxError::InvalidAmount);
        // Verify dev wallet matches config
        require_keys_eq!(ctx.accounts.dev_wallet.key(), ctx.accounts.config.dev_wallet, AtraxError::InvalidDevWallet);

        let fee = amount
            .checked_mul(ctx.accounts.config.fee_bps as u64)
            .ok_or(AtraxError::MathOverflow)?
            .checked_div(BPS_DENOMINATOR)
            .ok_or(AtraxError::MathOverflow)?;
        let to_streamer = amount.checked_sub(fee).ok_or(AtraxError::MathOverflow)?;

        // transfer to streamer
        {
            let cpi_accounts = system_program::Transfer {
                from: ctx.accounts.donor.to_account_info(),
                to: ctx.accounts.streamer.to_account_info(),
            };
            let cpi_ctx = CpiContext::new(ctx.accounts.system_program.to_account_info(), cpi_accounts);
            system_program::transfer(cpi_ctx, to_streamer)?;
        }

        // transfer fee to dev
        if fee > 0 {
            let cpi_accounts = system_program::Transfer {
                from: ctx.accounts.donor.to_account_info(),
                to: ctx.accounts.dev_wallet.to_account_info(),
            };
            let cpi_ctx = CpiContext::new(ctx.accounts.system_program.to_account_info(), cpi_accounts);
            system_program::transfer(cpi_ctx, fee)?;
        }

        emit!(DonationEvent { donor: ctx.accounts.donor.key(), streamer: ctx.accounts.streamer.key(), amount, fee_bps: ctx.accounts.config.fee_bps });
        Ok(())
    }

    // Shop purchase: 100% to dev wallet (dev shop).
    pub fn buy_item(ctx: Context<BuyItem>, _item_id: u16, amount: u64) -> Result<()> {
        require!(amount > 0, AtraxError::InvalidAmount);
        require_keys_eq!(ctx.accounts.dev_wallet.key(), ctx.accounts.config.dev_wallet, AtraxError::InvalidDevWallet);

        let cpi_accounts = system_program::Transfer {
            from: ctx.accounts.payer.to_account_info(),
            to: ctx.accounts.dev_wallet.to_account_info(),
        };
        let cpi_ctx = CpiContext::new(ctx.accounts.system_program.to_account_info(), cpi_accounts);
        system_program::transfer(cpi_ctx, amount)?;

        emit!(ShopPurchaseEvent { payer: ctx.accounts.payer.key(), amount });
        Ok(())
    }

    // Player-to-player trade: 90% to seller, 10% fee to dev.
    pub fn trade_item(ctx: Context<TradeItem>, _item_id: u16, amount: u64) -> Result<()> {
        require!(amount > 0, AtraxError::InvalidAmount);
        require_keys_eq!(ctx.accounts.dev_wallet.key(), ctx.accounts.config.dev_wallet, AtraxError::InvalidDevWallet);

        let fee = amount
            .checked_mul(ctx.accounts.config.fee_bps as u64)
            .ok_or(AtraxError::MathOverflow)?
            .checked_div(BPS_DENOMINATOR)
            .ok_or(AtraxError::MathOverflow)?;
        let to_seller = amount.checked_sub(fee).ok_or(AtraxError::MathOverflow)?;

        // transfer to seller
        {
            let cpi_accounts = system_program::Transfer {
                from: ctx.accounts.buyer.to_account_info(),
                to: ctx.accounts.seller.to_account_info(),
            };
            let cpi_ctx = CpiContext::new(ctx.accounts.system_program.to_account_info(), cpi_accounts);
            system_program::transfer(cpi_ctx, to_seller)?;
        }

        // transfer fee to dev
        if fee > 0 {
            let cpi_accounts = system_program::Transfer {
                from: ctx.accounts.buyer.to_account_info(),
                to: ctx.accounts.dev_wallet.to_account_info(),
            };
            let cpi_ctx = CpiContext::new(ctx.accounts.system_program.to_account_info(), cpi_accounts);
            system_program::transfer(cpi_ctx, fee)?;
        }

        emit!(TradeEvent { buyer: ctx.accounts.buyer.key(), seller: ctx.accounts.seller.key(), amount });
        Ok(())
    }

    // Land transfer requires prior initialization.
    pub fn transfer_land(ctx: Context<TransferLand>, land_id: u64, new_owner: Pubkey) -> Result<()> {
        let land = &mut ctx.accounts.land;
        require!(land.initialized == 1, AtraxError::LandNotInitialized);
        require!(land.land_id == land_id, AtraxError::InvalidLandId);
        require_keys_eq!(land.owner, ctx.accounts.owner.key(), AtraxError::Unauthorized);
        land.owner = new_owner;
        emit!(LandTransferEvent { land_id, new_owner });
        Ok(())
    }

    // Initialize land PDA for owner.
    pub fn initialize_land(ctx: Context<InitializeLand>, land_id: u64) -> Result<()> {
        let land = &mut ctx.accounts.land;
        land.land_id = land_id;
        land.owner = ctx.accounts.owner.key();
        let (_pda, bump) = Pubkey::find_program_address(&[b"land", ctx.accounts.owner.key.as_ref()], &crate::ID);
        land.bump = bump;
        land.initialized = 1;
        Ok(())
    }

    // Placeholder for profit sharing claim (wire vaults later).
    pub fn claim_profit(_ctx: Context<ClaimProfit>, _amount: u64) -> Result<()> {
        // TODO: implement vault-based claims; emit event for now
        Ok(())
    }

    // Admin can update admin authority to a new pubkey.
    pub fn update_admin(ctx: Context<UpdateAdmin>, new_admin: Pubkey) -> Result<()> {
        let cfg = &mut ctx.accounts.config;
        cfg.admin = new_admin;
        emit!(AdminUpdated { new_admin });
        Ok(())
    }

    // =========================
    // Streaming Rooms (claim + choose piece)
    // =========================

    // Initialize room settings (piece price) under separate PDA to avoid breaking Config.
    pub fn initialize_room_settings(
        ctx: Context<InitializeRoomSettings>,
        piece_price: u64,
        deposit_required: u64,
    ) -> Result<()> {
        let rs = &mut ctx.accounts.room_settings;
        rs.admin = ctx.accounts.admin.key();
        rs.piece_price = piece_price;
        rs.deposit_required = deposit_required;
        rs.bump = ctx.bumps.room_settings;
        Ok(())
    }

    // Admin can update piece price
    pub fn update_room_settings(
        ctx: Context<UpdateRoomSettings>,
        new_piece_price: u64,
        new_deposit_required: u64,
    ) -> Result<()> {
        let rs = &mut ctx.accounts.room_settings;
        rs.piece_price = new_piece_price;
        rs.deposit_required = new_deposit_required;
        Ok(())
    }

    // Claim a room id for a streamer with metadata; expires after ROOM_TTL_SECONDS
    pub fn claim_room(
        ctx: Context<ClaimRoom>,
        room_id: u32,
        room_name: String,
        stream_url: String,
    ) -> Result<()> {
        require!(room_id < 100, AtraxError::InvalidRoomId); // allow 0..99
        require!(room_name.len() <= 50, AtraxError::RoomNameTooLong);
        require!(stream_url.len() <= 200, AtraxError::StreamUrlTooLong);

        let room = &mut ctx.accounts.room;
        let now = Clock::get()?.unix_timestamp;

        if room.timestamp != 0 {
            let diff = now - room.timestamp;
            // Enforce cooldown before another claim on the same room id
            require!(diff >= ROOM_TTL_SECONDS, AtraxError::RoomNotExpired);
            // If previous session left a deposit, refund it to previous owner
            if room.deposit_lamports > 0 && room.player_wallet != Pubkey::default() {
                require_keys_eq!(
                    ctx.accounts.streamer_prev.key(),
                    room.player_wallet,
                    AtraxError::InvalidStreamer
                );
                let amount = room.deposit_lamports;
                let seeds: &[&[u8]] = &[b"room", &room_id.to_le_bytes(), &[room.bump]];
                let cpi_accounts = system_program::Transfer {
                    from: room.to_account_info(),
                    to: ctx.accounts.streamer_prev.to_account_info(),
                };
                let cpi_ctx = CpiContext::new_with_signer(
                    ctx.accounts.system_program.to_account_info(),
                    cpi_accounts,
                    &[seeds],
                );
                system_program::transfer(cpi_ctx, amount)?;
                room.deposit_lamports = 0;
            }
        }

        room.room_name = room_name;
        room.stream_url = stream_url;
        room.player_wallet = ctx.accounts.streamer.key();
        room.room_id = room_id;
        room.latest_chosen_piece = 0;
        room.last_buyer = Pubkey::default();
        room.timestamp = now;
        room.expires_at = now
            .checked_add(ROOM_TTL_SECONDS)
            .ok_or(AtraxError::MathOverflow)?;
        room.status = 1; // active
        room.purchase_count = 0;
        // set bump for PDA-signed ops
        room.bump = ctx.bumps.room;

        // take deposit if configured
        let deposit = ctx.accounts.room_settings.deposit_required;
        if deposit > 0 {
            let cpi_accounts = system_program::Transfer {
                from: ctx.accounts.streamer.to_account_info(),
                to: room.to_account_info(),
            };
            let cpi_ctx = CpiContext::new(ctx.accounts.system_program.to_account_info(), cpi_accounts);
            system_program::transfer(cpi_ctx, deposit)?;
            room.deposit_lamports = deposit;
        }

        emit!(RoomClaimed { room_id, streamer: room.player_wallet });
        Ok(())
    }

    // Buyer pays fixed price to influence next piece; fee goes to dev as per Config.fee_bps
    pub fn choose_piece(ctx: Context<ChoosePiece>, room_id: u32, piece_type: u8) -> Result<()> {
        require!(room_id < 100, AtraxError::InvalidRoomId);
        require!(piece_type < 7, AtraxError::InvalidPieceType);
        require_keys_eq!(ctx.accounts.dev_wallet.key(), ctx.accounts.config.dev_wallet, AtraxError::InvalidDevWallet);

        let price = ctx.accounts.room_settings.piece_price;
        require!(price > 0, AtraxError::InvalidAmount);

        let fee = price
            .checked_mul(ctx.accounts.config.fee_bps as u64).ok_or(AtraxError::MathOverflow)?
            .checked_div(BPS_DENOMINATOR).ok_or(AtraxError::MathOverflow)?;
        let to_streamer = price.checked_sub(fee).ok_or(AtraxError::MathOverflow)?;

        // transfer to streamer
        {
            let cpi_accounts = system_program::Transfer {
                from: ctx.accounts.buyer.to_account_info(),
                to: ctx.accounts.streamer.to_account_info(),
            };
            let cpi_ctx = CpiContext::new(ctx.accounts.system_program.to_account_info(), cpi_accounts);
            system_program::transfer(cpi_ctx, to_streamer)?;
        }
        // transfer fee to dev
        if fee > 0 {
            let cpi_accounts = system_program::Transfer {
                from: ctx.accounts.buyer.to_account_info(),
                to: ctx.accounts.dev_wallet.to_account_info(),
            };
            let cpi_ctx = CpiContext::new(ctx.accounts.system_program.to_account_info(), cpi_accounts);
            system_program::transfer(cpi_ctx, fee)?;
        }

        // Ensure room is active and not expired
        let now = Clock::get()?.unix_timestamp;
        require!(now <= ctx.accounts.room.expires_at, AtraxError::RoomExpired);
        require!(ctx.accounts.room.status == 1, AtraxError::RoomPaused);

        // update room state
        let room = &mut ctx.accounts.room;
        room.latest_chosen_piece = piece_type;
        room.last_buyer = ctx.accounts.buyer.key();
        room.timestamp = now;
        // Refresh expiry to keep room active while there is engagement
        room.expires_at = now
            .checked_add(ROOM_TTL_SECONDS)
            .ok_or(AtraxError::MathOverflow)?;
        emit!(PieceChosen { room_id, piece_type, buyer: room.last_buyer });
        Ok(())
    }

    // Update room metadata (name/url). Only owner (or admin) can call.
    pub fn update_room_metadata(
        ctx: Context<UpdateRoomMetadata>,
        room_id: u32,
        room_name: String,
        stream_url: String,
    ) -> Result<()> {
        require!(room_name.len() <= 50, AtraxError::RoomNameTooLong);
        require!(stream_url.len() <= 200, AtraxError::StreamUrlTooLong);
        let room = &mut ctx.accounts.room;
        let caller = ctx.accounts.authority.key();
        let is_admin = ctx.accounts.config.admin == caller;
        require!(caller == room.player_wallet || is_admin, AtraxError::Unauthorized);

        room.room_name = room_name;
        room.stream_url = stream_url;
        emit!(RoomUpdated { room_id, streamer: room.player_wallet });
        Ok(())
    }

    // Change room status: 0=inactive,1=active,2=paused,3=ended
    pub fn set_room_status(
        ctx: Context<SetRoomStatus>,
        room_id: u32,
        new_status: u8,
    ) -> Result<()> {
        require!(new_status <= 3, AtraxError::InvalidStatus);
        let room = &mut ctx.accounts.room;
        let caller = ctx.accounts.authority.key();
        let is_admin = ctx.accounts.config.admin == caller;
        require!(caller == room.player_wallet || is_admin, AtraxError::Unauthorized);

        room.status = new_status;
        if new_status == 1 {
            // resume -> refresh expiry
            let now = Clock::get()?.unix_timestamp;
            room.expires_at = now.checked_add(ROOM_TTL_SECONDS).ok_or(AtraxError::MathOverflow)?;
        }
        emit!(RoomStatusChanged { room_id, status: new_status });
        Ok(())
    }

    // Release a room: refund deposit to owner, mark ended
    pub fn release_room(ctx: Context<ReleaseRoom>, room_id: u32) -> Result<()> {
        let room = &mut ctx.accounts.room;
        let caller = ctx.accounts.authority.key();
        let is_admin = ctx.accounts.config.admin == caller;
        require!(caller == room.player_wallet || is_admin, AtraxError::Unauthorized);

        // Refund deposit if any
        if room.deposit_lamports > 0 {
            let amount = room.deposit_lamports;
            let seeds: &[&[u8]] = &[b"room", &room_id.to_le_bytes(), &[room.bump]];
            let cpi_accounts = system_program::Transfer {
                from: room.to_account_info(),
                to: ctx.accounts.streamer.to_account_info(),
            };
            let cpi_ctx = CpiContext::new_with_signer(
                ctx.accounts.system_program.to_account_info(),
                cpi_accounts,
                &[seeds],
            );
            system_program::transfer(cpi_ctx, amount)?;
            room.deposit_lamports = 0;
        }
        room.status = 3; // ended
        emit!(RoomReleased { room_id, streamer: room.player_wallet });
        Ok(())
    }
}

// =========================
// Accounts
// =========================

#[account]
pub struct Config {
    pub admin: Pubkey,
    pub dev_wallet: Pubkey,
    pub fee_bps: u16,
    pub bump: u8,
}

impl Config {
    pub const LEN: usize = 32 + 32 + 2 + 1;
}

#[account]
pub struct LandAccount {
    pub land_id: u64,
    pub owner: Pubkey,
    pub bump: u8,
    pub initialized: u8, // 0 = false, 1 = true
}

impl LandAccount {
    pub const LEN: usize = 8 + 32 + 1 + 1;
}

// Room settings (piece price)
#[account]
pub struct RoomSettings {
    pub admin: Pubkey,
    pub piece_price: u64,
    pub deposit_required: u64,
    pub bump: u8,
}

impl RoomSettings {
    pub const LEN: usize = 32 + 8 + 8 + 1;
}

// Streaming room state
#[account]
pub struct Room {
    pub room_name: String,
    pub stream_url: String,
    pub player_wallet: Pubkey,
    pub room_id: u32,
    pub latest_chosen_piece: u8,
    pub last_buyer: Pubkey,
    pub timestamp: i64,
    pub expires_at: i64,
    pub status: u8,
    pub deposit_lamports: u64,
    pub purchase_count: u32,
    pub bump: u8,
}

impl Room {
    // Strings have a 4-byte length prefix; allocate for 50 and 200 chars respectively
    // Layout: name, url, player_wallet, room_id, latest_piece, last_buyer, timestamp, expires_at
    pub const LEN: usize = (4 + 50) + (4 + 200) + 32 + 4 + 1 + 32 + 8 + 8 + 1 + 8 + 4 + 1;
}

// =========================
// Instruction Accounts
// =========================

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
        init,
        payer = admin,
        space = 8 + Config::LEN,
        seeds = [b"config"],
        bump
    )]
    pub config: Account<'info, Config>,
    #[account(mut)]
    pub admin: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct InitializeRoomSettings<'info> {
    #[account(
        init,
        payer = admin,
        space = 8 + RoomSettings::LEN,
        seeds = [b"room_settings"],
        bump
    )]
    pub room_settings: Account<'info, RoomSettings>,
    #[account(mut)]
    pub admin: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UpdateRoomSettings<'info> {
    #[account(mut, seeds = [b"room_settings"], bump = room_settings.bump, has_one = admin)]
    pub room_settings: Account<'info, RoomSettings>,
    pub admin: Signer<'info>,
}

#[derive(Accounts)]
#[instruction(room_id: u32)]
pub struct ClaimRoom<'info> {
    #[account(
        init_if_needed,
        payer = streamer,
        space = 8 + Room::LEN,
        seeds = [b"room", room_id.to_le_bytes().as_ref()],
        bump
    )]
    pub room: Account<'info, Room>,
    #[account(seeds = [b"room_settings"], bump = room_settings.bump)]
    pub room_settings: Account<'info, RoomSettings>,
    /// CHECK: previous streamer for refund (can be default)
    #[account(mut)]
    pub streamer_prev: UncheckedAccount<'info>,
    #[account(mut)]
    pub streamer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(room_id: u32)]
pub struct ChoosePiece<'info> {
    #[account(seeds = [b"config"], bump = config.bump)]
    pub config: Account<'info, Config>,
    #[account(seeds = [b"room_settings"], bump = room_settings.bump)]
    pub room_settings: Account<'info, RoomSettings>,
    #[account(
        mut,
        seeds = [b"room", room_id.to_le_bytes().as_ref()],
        bump,
        constraint = room.player_wallet == streamer.key() @ AtraxError::InvalidStreamer
    )]
    pub room: Account<'info, Room>,
    #[account(mut)]
    pub buyer: Signer<'info>,
    /// CHECK: Streamer system wallet (receiver)
    #[account(mut)]
    pub streamer: UncheckedAccount<'info>,
    /// CHECK: validated to equal config.dev_wallet
    #[account(mut)]
    pub dev_wallet: UncheckedAccount<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(room_id: u32)]
pub struct UpdateRoomMetadata<'info> {
    #[account(seeds = [b"config"], bump = config.bump)]
    pub config: Account<'info, Config>,
    #[account(
        mut,
        seeds = [b"room", room_id.to_le_bytes().as_ref()],
        bump,
    )]
    pub room: Account<'info, Room>,
    #[account(mut)]
    pub authority: Signer<'info>,
}

#[derive(Accounts)]
#[instruction(room_id: u32)]
pub struct SetRoomStatus<'info> {
    #[account(seeds = [b"config"], bump = config.bump)]
    pub config: Account<'info, Config>,
    #[account(
        mut,
        seeds = [b"room", room_id.to_le_bytes().as_ref()],
        bump,
    )]
    pub room: Account<'info, Room>,
    #[account(mut)]
    pub authority: Signer<'info>,
}

#[derive(Accounts)]
#[instruction(room_id: u32)]
pub struct ReleaseRoom<'info> {
    #[account(seeds = [b"config"], bump = config.bump)]
    pub config: Account<'info, Config>,
    #[account(
        mut,
        seeds = [b"room", room_id.to_le_bytes().as_ref()],
        bump,
    )]
    pub room: Account<'info, Room>,
    /// CHECK: funds receiver (streamer/owner)
    #[account(mut)]
    pub streamer: UncheckedAccount<'info>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UpdateConfig<'info> {
    #[account(mut, seeds = [b"config"], bump = config.bump, has_one = admin)]
    pub config: Account<'info, Config>,
    pub admin: Signer<'info>,
}

#[derive(Accounts)]
pub struct Donate<'info> {
    #[account(mut)]
    pub donor: Signer<'info>,
    /// CHECK: streamer is a system account (wallet); only receives lamports
    #[account(mut)]
    pub streamer: UncheckedAccount<'info>,
    /// CHECK: dev wallet validated against config
    #[account(mut)]
    pub dev_wallet: UncheckedAccount<'info>,
    pub config: Account<'info, Config>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct BuyItem<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    /// CHECK: dev wallet validated against config
    #[account(mut)]
    pub dev_wallet: UncheckedAccount<'info>,
    pub config: Account<'info, Config>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct TradeItem<'info> {
    #[account(mut)]
    pub buyer: Signer<'info>,
    /// CHECK: seller is a system account (wallet); only receives lamports
    #[account(mut)]
    pub seller: UncheckedAccount<'info>,
    /// CHECK: dev wallet validated against config
    #[account(mut)]
    pub dev_wallet: UncheckedAccount<'info>,
    pub config: Account<'info, Config>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct TransferLand<'info> {
    #[account(mut)]
    pub owner: Signer<'info>,
    #[account(
        mut,
        seeds = [b"land", owner.key().as_ref()],
        bump
    )]
    pub land: Account<'info, LandAccount>,
}

#[derive(Accounts)]
pub struct ClaimProfit<'info> {
    #[account(mut)]
    pub claimer: Signer<'info>,
}

#[derive(Accounts)]
pub struct UpdateAdmin<'info> {
    #[account(mut, seeds = [b"config"], bump = config.bump, has_one = admin)]
    pub config: Account<'info, Config>,
    pub admin: Signer<'info>,
}

#[derive(Accounts)]
pub struct InitializeLand<'info> {
    #[account(mut)]
    pub owner: Signer<'info>,
    #[account(
        init,
        payer = owner,
        space = 8 + LandAccount::LEN,
        seeds = [b"land", owner.key().as_ref()],
        bump
    )]
    pub land: Account<'info, LandAccount>,
    pub system_program: Program<'info, System>,
}

// =========================
// Events & Errors
// =========================

#[event]
pub struct ConfigInitialized {
    pub admin: Pubkey,
    pub dev_wallet: Pubkey,
    pub fee_bps: u16,
}

#[event]
pub struct ConfigUpdated {
    pub dev_wallet: Pubkey,
    pub fee_bps: u16,
}

#[event]
pub struct DonationEvent {
    pub donor: Pubkey,
    pub streamer: Pubkey,
    pub amount: u64,
    pub fee_bps: u16,
}

#[event]
pub struct ShopPurchaseEvent {
    pub payer: Pubkey,
    pub amount: u64,
}

#[event]
pub struct TradeEvent {
    pub buyer: Pubkey,
    pub seller: Pubkey,
    pub amount: u64,
}

#[event]
pub struct LandTransferEvent {
    pub land_id: u64,
    pub new_owner: Pubkey,
}

#[event]
pub struct AdminUpdated {
    pub new_admin: Pubkey,
}

#[event]
pub struct RoomClaimed {
    pub room_id: u32,
    pub streamer: Pubkey,
}

#[event]
pub struct PieceChosen {
    pub room_id: u32,
    pub piece_type: u8,
    pub buyer: Pubkey,
}

#[event]
pub struct RoomUpdated {
    pub room_id: u32,
    pub streamer: Pubkey,
}

#[event]
pub struct RoomStatusChanged {
    pub room_id: u32,
    pub status: u8,
}

#[event]
pub struct RoomReleased {
    pub room_id: u32,
    pub streamer: Pubkey,
}

#[error_code]
pub enum AtraxError {
    #[msg("Amount must be greater than zero")] 
    InvalidAmount,
    #[msg("Fee exceeds 100% (10000 bps)")] 
    FeeTooHigh,
    #[msg("Invalid developer wallet provided")] 
    InvalidDevWallet,
    #[msg("Unauthorized action")] 
    Unauthorized,
    #[msg("Math overflow")] 
    MathOverflow,
    #[msg("Land account is not initialized")] 
    LandNotInitialized,
    #[msg("Provided land id does not match record")] 
    InvalidLandId,
    #[msg("Invalid room id")] 
    InvalidRoomId,
    #[msg("Room name too long (max 50)")] 
    RoomNameTooLong,
    #[msg("Stream URL too long (max 200)")] 
    StreamUrlTooLong,
    #[msg("Invalid piece type (0..6)")] 
    InvalidPieceType,
    #[msg("Room is not expired yet")] 
    RoomNotExpired,
    #[msg("Invalid streamer wallet for room")] 
    InvalidStreamer,
    #[msg("Room is expired")] 
    RoomExpired,
    #[msg("Room is paused or inactive")] 
    RoomPaused,
    #[msg("Invalid status value")] 
    InvalidStatus,
}
