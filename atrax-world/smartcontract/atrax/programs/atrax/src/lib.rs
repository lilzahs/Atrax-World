use anchor_lang::prelude::*;
use anchor_lang::system_program;

declare_id!("35eYtQ3hgAqmDUtwcEQ6WFKfQri7figJGe9vR25mmMiC");

const BPS_DENOMINATOR: u64 = 10000;

#[program]
pub mod atrax {
    use super::*;

    // Initializes global config (dev wallet authority, fee).
    // The signer must equal the provided dev_wallet (dev is the sole authority).
    pub fn initialize(ctx: Context<Initialize>, dev_wallet: Pubkey, fee_bps: u16) -> Result<()> {
        require!(fee_bps as u64 <= BPS_DENOMINATOR, AtraxError::FeeTooHigh);
        require_keys_eq!(ctx.accounts.dev.key(), dev_wallet, AtraxError::Unauthorized);

        let cfg = &mut ctx.accounts.config;
        cfg.dev_wallet = dev_wallet;
        cfg.fee_bps = fee_bps;
        cfg.bump = ctx.bumps.config;

        emit!(ConfigInitialized { dev_wallet, fee_bps });
        Ok(())
    }

    // Dev updates dev wallet and fee. Only current dev (config.dev_wallet) may call this.
    pub fn update_config(ctx: Context<UpdateConfig>, new_dev_wallet: Pubkey, new_fee_bps: u16) -> Result<()> {
        require!(new_fee_bps as u64 <= BPS_DENOMINATOR, AtraxError::FeeTooHigh);
        require_keys_eq!(ctx.accounts.dev.key(), ctx.accounts.config.dev_wallet, AtraxError::Unauthorized);
        let cfg = &mut ctx.accounts.config;
        cfg.dev_wallet = new_dev_wallet;
        cfg.fee_bps = new_fee_bps;
        emit!(ConfigUpdated { dev_wallet: new_dev_wallet, fee_bps: new_fee_bps });
        Ok(())
    } 

    // Viewer donates lamports: fee (bps) to dev wallet, rest to streamer.
    pub fn donate(ctx: Context<Donate>, amount: u64, donor_name: String) -> Result<()> {
        require!(amount > 0, AtraxError::InvalidAmount);
        require!(donor_name.len() <= 16, AtraxError::NameTooLong);
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

        emit!(DonationEvent { donor: ctx.accounts.donor.key(), streamer: ctx.accounts.streamer.key(), amount, fee_bps: ctx.accounts.config.fee_bps, name: donor_name });
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

    // Player-to-player trade: split to seller and dev by fee.
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

    // =========================
    // Streaming Rooms (claim + choose item)
    // =========================

    // Initialize room settings (item price) under separate PDA.
    // Authority: dev (config.dev_wallet) only.
    pub fn initialize_room_settings(ctx: Context<InitializeRoomSettings>, item_price: u64) -> Result<()> {
        require_keys_eq!(ctx.accounts.dev.key(), ctx.accounts.config.dev_wallet, AtraxError::Unauthorized);
        let rs = &mut ctx.accounts.room_settings;
        rs.item_price = item_price;
        rs.bump = ctx.bumps.room_settings;
        Ok(())
    }

    // Dev can update item price
    pub fn update_room_settings(ctx: Context<UpdateRoomSettings>, new_item_price: u64) -> Result<()> {
        require_keys_eq!(ctx.accounts.dev.key(), ctx.accounts.config.dev_wallet, AtraxError::Unauthorized);
        let rs = &mut ctx.accounts.room_settings;
        rs.item_price = new_item_price;
        Ok(())
    }

    // Claim a room bound to the streamer pubkey; immediate overwrite without cooldown
    pub fn claim_room(
        ctx: Context<ClaimRoom>,
        room_name: String,
        stream_url: String,
    ) -> Result<()> {
        require!(room_name.len() <= 50, AtraxError::RoomNameTooLong);
        require!(stream_url.len() <= 200, AtraxError::StreamUrlTooLong);

        let room = &mut ctx.accounts.room;

        room.room_name = room_name;
        room.stream_url = stream_url;
        room.player_wallet = ctx.accounts.streamer.key();
        room.latest_chosen_item = 0;
        room.last_buyer = Pubkey::default();

        emit!(RoomClaimed { streamer: room.player_wallet });
        Ok(())
    }

    // Buyer pays fixed price to influence next item; fee goes to dev as per Config.fee_bps
    pub fn choose_item(ctx: Context<ChooseItem>, item_type: u8) -> Result<()> {
        require!(item_type < 7, AtraxError::InvalidItemType);
        require_keys_eq!(ctx.accounts.dev_wallet.key(), ctx.accounts.config.dev_wallet, AtraxError::InvalidDevWallet);

        let price = ctx.accounts.room_settings.item_price;
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

        // update room state
        let room = &mut ctx.accounts.room;
        room.latest_chosen_item = item_type;
        room.last_buyer = ctx.accounts.buyer.key();
        emit!(ItemChosen { item_type, buyer: room.last_buyer });
        Ok(())
    }
}

// =========================
// Accounts
// =========================

#[account]
pub struct Config {
    pub dev_wallet: Pubkey,
    pub fee_bps: u16,
    pub bump: u8,
}

impl Config {
    pub const LEN: usize = 32 + 2 + 1;
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

// Room settings (item price)
#[account]
pub struct RoomSettings {
    pub item_price: u64,
    pub bump: u8,
}

impl RoomSettings {
    pub const LEN: usize = 8 + 1;
}

// Streaming room state
#[account]
pub struct Room {
    pub room_name: String,
    pub stream_url: String,
    pub player_wallet: Pubkey,
    pub latest_chosen_item: u8,
    pub last_buyer: Pubkey,
}

impl Room {
    // Strings have a 4-byte length prefix; allocate for 50 and 200 chars respectively
    pub const LEN: usize = (4 + 50) + (4 + 200) + 32 + 1 + 32;
}

// =========================
// Instruction Accounts
// =========================

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
        init,
        payer = dev,
        space = 8 + Config::LEN,
        seeds = [b"config"],
        bump
    )]
    pub config: Account<'info, Config>,
    #[account(mut)]
    pub dev: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct InitializeRoomSettings<'info> {
    #[account(
        init,
        payer = dev,
        space = 8 + RoomSettings::LEN,
        seeds = [b"room_settings"],
        bump
    )]
    pub room_settings: Account<'info, RoomSettings>,
    #[account(seeds = [b"config"], bump = config.bump)]
    pub config: Account<'info, Config>,
    #[account(mut)]
    pub dev: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UpdateRoomSettings<'info> {
    #[account(mut, seeds = [b"room_settings"], bump = room_settings.bump)]
    pub room_settings: Account<'info, RoomSettings>,
    #[account(seeds = [b"config"], bump = config.bump)]
    pub config: Account<'info, Config>,
    pub dev: Signer<'info>,
}

#[derive(Accounts)]
pub struct ClaimRoom<'info> {
    #[account(
        init_if_needed,
        payer = streamer,
        space = 8 + Room::LEN,
        seeds = [b"room", streamer.key().as_ref()],
        bump
    )]
    pub room: Account<'info, Room>,
    #[account(mut)]
    pub streamer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ChooseItem<'info> {
    #[account(seeds = [b"config"], bump = config.bump)]
    pub config: Account<'info, Config>,
    #[account(seeds = [b"room_settings"], bump = room_settings.bump)]
    pub room_settings: Account<'info, RoomSettings>,
    #[account(
        mut,
        seeds = [b"room", streamer.key().as_ref()],
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
pub struct UpdateConfig<'info> {
    #[account(mut, seeds = [b"config"], bump = config.bump)]
    pub config: Account<'info, Config>,
    pub dev: Signer<'info>,
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
    pub name: String,
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
pub struct RoomClaimed {
    pub streamer: Pubkey,
}

#[event]
pub struct ItemChosen {
    pub item_type: u8,
    pub buyer: Pubkey,
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
    #[msg("Room name too long (max 50)")] 
    RoomNameTooLong,
    #[msg("Stream URL too long (max 200)")] 
    StreamUrlTooLong,
    #[msg("Invalid item type (0..6)")] 
    InvalidItemType,
    #[msg("Invalid streamer wallet for room")] 
    InvalidStreamer,
    #[msg("Donor name too long (max 16)")]
    NameTooLong,
}
