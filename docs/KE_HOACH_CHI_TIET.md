# Atrax World - Kế Hoạch Chi Tiết & Hướng Dẫn Phát Triển

## 📅 Timeline Chi Tiết (2 Tuần Demo)

### Tuần 1: Foundation & Core Game

#### Ngày 1-2: Project Setup
**Nhiệm vụ:**
- [ ] Tạo cấu trúc thư mục dự án
- [ ] Setup Node.js server với Express + Socket.io
- [ ] Setup MongoDB connection
- [ ] Tạo basic HTML client với Canvas
- [ ] Setup Git repository

**Deliverables:**
- Server chạy được trên localhost:3000
- Client hiển thị canvas trống
- Database connection thành công

#### Ngày 3-4: Basic Game Engine
**Nhiệm vụ:**
- [ ] Tạo GameEngine.js với game loop
- [ ] Implement basic player movement
- [ ] Tạo WorldManager.js cho quản lý thế giới
- [ ] Implement basic rendering system
- [ ] Tạo player authentication system

**Deliverables:**
- Player có thể di chuyển trên canvas
- Game loop chạy ổn định 60 FPS
- Basic authentication hoạt động

#### Ngày 5-7: Building System
**Nhiệm vụ:**
- [ ] Tạo BuildingManager.js
- [ ] Implement building placement system
- [ ] Tạo basic building types (house, farm)
- [ ] Implement grid-based placement
- [ ] Tạo building inventory system

**Deliverables:**
- Player có thể đặt buildings trên grid
- Building inventory hoạt động
- Basic building types hiển thị được

### Tuần 2: Streaming & Crypto Integration

#### Ngày 8-9: YouTube Integration
**Nhiệm vụ:**
- [ ] Setup YouTube API
- [ ] Tạo StreamingManager.js
- [ ] Implement streamer registration
- [ ] Tạo streaming overlay
- [ ] Implement viewer notification system

**Deliverables:**
- Streamer có thể đăng ký với YouTube
- Overlay hiển thị trên stream
- Thông báo viewer hoạt động

#### Ngày 10-11: Solana Integration
**Nhiệm vụ:**
- [ ] Setup Solana RPC connection
- [ ] Tạo SolanaManager.js
- [ ] Implement wallet connection (Phantom, Solflare)
- [ ] Tạo basic transaction system
- [ ] Implement SOL balance display

**Deliverables:**
- Wallet connection hoạt động
- SOL balance hiển thị
- Basic transaction có thể thực hiện

#### Ngày 12-14: Shop & Donation System
**Nhiệm vụ:**
- [ ] Tạo ShopManager.js
- [ ] Implement item shop system
- [ ] Tạo donation system
- [ ] Implement viewer donation buttons
- [ ] Tạo profit sharing system

**Deliverables:**
- Shop hoạt động với SOL payments
- Donation system hoạt động
- Viewer có thể donate items cho streamer

---

## 🛠️ Hướng Dẫn Phát Triển

### Phase 1: Server Setup (Duy - Blockchain)

#### 1.1 Solana Smart Contracts
**Cấu trúc (gộp 1 program):**
```
server/smart-contracts/atrax/
├── Anchor.toml
├── Cargo.toml
├── programs/
│   └── atrax/
│       └── src/
│           └── lib.rs   # Tạm thời dồn toàn bộ instructions vào một file
└── tests/
    └── atrax.ts
```

**Hướng dẫn cho Duy:**
1. **Setup Solana Development Environment**
   ```bash
   # Install Solana CLI
   sh -c "$(curl -sSfL https://release.solana.com/v1.16.0/install)"
   
   # Install Anchor framework
   npm install -g @coral-xyz/anchor-cli
   
   # Create new project
   anchor init atraxd-contract
   ```

2. **Atrax Program Structure**
   ```rust
   use anchor_lang::prelude::*;

   #[program]
   pub mod atrax {
       use super::*;

       pub fn initialize(ctx: Context<Initialize>, dev_wallet: Pubkey, fee_bps: u16) -> Result<()> { Ok(()) }
       pub fn update_config(ctx: Context<UpdateConfig>, dev_wallet: Pubkey, fee_bps: u16) -> Result<()> { Ok(()) }

       pub fn donate(ctx: Context<Donate>, amount: u64) -> Result<()> { Ok(()) }
       pub fn buy_item(ctx: Context<BuyItem>, item_id: u16, amount: u64) -> Result<()> { Ok(()) }
       pub fn trade_item(ctx: Context<TradeItem>, item_id: u16, amount: u64) -> Result<()> { Ok(()) }

       pub fn transfer_land(ctx: Context<TransferLand>, land_id: u64, new_owner: Pubkey) -> Result<()> { Ok(()) }
       pub fn claim_profit(ctx: Context<ClaimProfit>, amount: u64) -> Result<()> { Ok(()) }
   }
   ```

3. **Instructions cần implement (trong 1 program):**
   - `initialize`, `update_config`
   - `donate` - Xử lý donation từ viewer
   - `buy_item` - Mua item từ shop
   - `trade_item` - Giao dịch giữa players
   - `claim_profit` - Claim lợi nhuận cho viewer (stub)
   - `transfer_land` - Chuyển nhượng đất

#### 1.2 SolanaManager.js
**Hướng dẫn:**
```javascript
// server/managers/SolanaManager.js
class SolanaManager {
    constructor() {
        this.connection = new Connection('https://api.mainnet-beta.solana.com');
        this.programId = new PublicKey('YOUR_PROGRAM_ID');
    }
    
    async connectWallet(walletType) {
        // Connect to Phantom, Solflare, Glow, or MetaMask
    }
    
    async processDonation(donorWallet, streamerWallet, amount, itemId) {
        // Call atrax program: donate
    }
    
    async buyFromShop(playerWallet, itemId, amount) {
        // Call atrax program: buy_item
    }
    
    async tradeItems(sellerWallet, buyerWallet, itemId, price) {
        // Call atrax program: trade_item
    }
}
```

### Phase 2: Game Client (Bạn - Game Development)

#### 2.1 Basic Game Engine
**Files cần tạo:**
```
client/js/game/
├── GameClient.js
├── Renderer.js
├── InputHandler.js
├── Player.js
├── World.js
├── Village.js
└── Building.js
```

**Hướng dẫn:**
1. **GameClient.js - Main game controller**
   ```javascript
   class GameClient {
       constructor() {
           this.canvas = document.getElementById('gameCanvas');
           this.ctx = this.canvas.getContext('2d');
           this.socket = io();
           this.player = new Player();
           this.world = new World();
           this.renderer = new Renderer(this.ctx);
       }
       
       start() {
           this.gameLoop();
       }
       
       gameLoop() {
           this.update();
           this.render();
           requestAnimationFrame(() => this.gameLoop());
       }
   }
   ```

2. **Renderer.js - Pixel art rendering**
   ```javascript
   class Renderer {
       constructor(ctx) {
           this.ctx = ctx;
           this.tileSize = 32; // 32x32 pixel tiles
           this.scale = 2; // 2x scale for pixel art
       }
       
       drawTile(x, y, tileType) {
           // Draw pixel art tile
       }
       
       drawBuilding(x, y, buildingType) {
           // Draw building sprite
       }
   }
   ```

#### 2.2 Building System
**Hướng dẫn:**
1. **BuildingManager.js - Server side**
   ```javascript
   class BuildingManager {
       constructor() {
           this.buildings = new Map();
           this.buildingTypes = {
               'house-basic': { cost: 100, size: [2, 2] },
               'farm': { cost: 50, size: [3, 3] },
               'fence': { cost: 10, size: [1, 1] }
           };
       }
       
       placeBuilding(playerId, x, y, buildingType) {
           // Validate placement
           // Deduct cost
           // Add to world
       }
   }
   ```

2. **Building.js - Client side**
   ```javascript
   class Building {
       constructor(type, x, y) {
           this.type = type;
           this.x = x;
           this.y = y;
           this.sprite = this.loadSprite(type);
       }
       
       render(renderer) {
           renderer.drawBuilding(this.x, this.y, this.sprite);
       }
   }
   ```

### Phase 3: Streaming Integration

#### 3.1 YouTube API Setup
**Hướng dẫn:**
1. **Get YouTube API Key**
   - Go to Google Cloud Console
   - Enable YouTube Data API v3
   - Create API key
   - Add to .env file

2. **StreamingManager.js**
   ```javascript
   class StreamingManager {
       constructor() {
           this.youtubeApiKey = process.env.YOUTUBE_API_KEY;
           this.activeStreams = new Map();
       }
       
       async registerStreamer(streamerData) {
           // Register streamer with YouTube
           // Create stream overlay
           // Setup donation system
       }
       
       handleViewerDonation(donationData) {
           // Process donation
           // Update streamer inventory
           // Show notification
       }
   }
   ```

#### 3.2 Streaming Overlay
**Files cần tạo:**
```
client/streaming/
├── overlay.html
├── viewer-widget.html
└── donation-page.html
```

**Hướng dẫn:**
1. **overlay.html - Stream overlay**
   ```html
   <div id="stream-overlay">
       <div id="player-stats">
           <span id="sol-balance">0 SOL</span>
           <span id="viewer-count">0 viewers</span>
       </div>
       <div id="donation-notifications"></div>
   </div>
   ```

2. **viewer-widget.html - Viewer interaction**
   ```html
   <div id="viewer-widget">
       <h3>Donate to Streamer</h3>
       <div id="item-buttons">
           <!-- Dynamic item buttons -->
       </div>
       <button id="connect-wallet">Connect Wallet</button>
   </div>
   ```

### Phase 4: Asset Creation Guide

#### 4.1 Pixel Art Specifications
**Hướng dẫn tạo assets:**
1. **Tile Size:** 32x32 pixels
2. **Color Palette:** 16-32 colors max
3. **Style:** Pixel art, retro gaming
4. **Format:** PNG with transparency

**Asset List cần tạo:**
```
assets/images/
├── tiles/
│   ├── plains/                    # Village 1 - Đồng Bằng
│   │   ├── grass-green.png (32x32)
│   │   ├── dirt-fertile.png (32x32)
│   │   ├── water-fresh.png (32x32)
│   │   └── tree-oak.png (32x32)
│   ├── desert/                    # Village 2 - Sa Mạc
│   │   ├── sand-yellow.png (32x32)
│   │   ├── cactus.png (32x32)
│   │   ├── oasis.png (32x32)
│   │   └── rock-desert.png (32x32)
│   ├── island/                    # Village 3 - Đảo Biển
│   │   ├── sand-beach.png (32x32)
│   │   ├── water-ocean.png (32x32)
│   │   ├── coral.png (32x32)
│   │   └── palm-tree.png (32x32)
│   ├── snow/                      # Village 4 - Tuyết
│   │   ├── snow-white.png (32x32)
│   │   ├── ice.png (32x32)
│   │   ├── pine-tree.png (32x32)
│   │   └── rock-snow.png (32x32)
│   └── common/                    # Dùng chung
│       ├── river.png (32x32)
│       ├── bridge.png (32x32)
│       └── path.png (32x32)
├── buildings/
│   ├── plains/
│   │   ├── house-plains.png (64x64)
│   │   ├── farm-plains.png (96x96)
│   │   └── barn.png (64x64)
│   ├── desert/
│   │   ├── house-desert.png (64x64)
│   │   ├── oasis-farm.png (96x96)
│   │   └── pyramid.png (64x64)
│   ├── island/
│   │   ├── house-island.png (64x64)
│   │   ├── fishing-hut.png (96x96)
│   │   └── lighthouse.png (64x64)
│   ├── snow/
│   │   ├── house-snow.png (64x64)
│   │   ├── igloo.png (96x96)
│   │   └── ski-lodge.png (64x64)
│   └── common/
│       ├── shop.png (64x64)
│       └── warehouse.png (64x64)
├── items/
│   ├── plains/
│   │   ├── wood-oak.png (32x32)
│   │   ├── wheat.png (32x32)
│   │   └── water-bucket.png (32x32)
│   ├── desert/
│   │   ├── sand.png (32x32)
│   │   ├── cactus-fruit.png (32x32)
│   │   └── solar-panel.png (32x32)
│   ├── island/
│   │   ├── fish.png (32x32)
│   │   ├── coral.png (32x32)
│   │   └── boat.png (32x32)
│   ├── snow/
│   │   ├── ice.png (32x32)
│   │   ├── pine-wood.png (32x32)
│   │   └── heater.png (32x32)
│   └── common/
│       ├── coin.png (32x32)
│       └── gem.png (32x32)
└── characters/
    ├── player-idle.png (32x32)
    ├── player-walk.png (32x32)
    └── player-work.png (32x32)
```

#### 4.2 Asset Creation Tools
**Recommended tools:**
- **Aseprite** (Best for pixel art)
- **Photoshop** (with pixel art settings)
- **GIMP** (Free alternative)
- **Piskel** (Online pixel art editor)

**Hướng dẫn tạo:**
1. **Setup canvas:** 32x32 pixels
2. **Use pixel perfect brush:** 1px size
3. **Limit colors:** 16-32 colors max
4. **Save as PNG:** With transparency
5. **Test in game:** Ensure looks good at 2x scale

---

## 🚀 Deployment Guide

### Development Environment
```bash
# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Edit .env with your API keys

# Start development server
npm run dev

# Start client
# Open client/index.html in browser
```

### Production Deployment
```bash
# Build for production
npm run build

# Deploy to cloud platform
# Recommended: Vercel, Netlify, or DigitalOcean
```

---

## 📊 Success Metrics

### Demo Success Criteria (2 weeks)
- [ ] Landing page with Play/Watch options working
- [ ] Game client (PC optimized) with basic movement and building
- [ ] Viewer app (Mobile optimized) with stream list and donation
- [ ] YouTube streaming integration and embed functionality
- [ ] SOL wallet connection functional on both platforms
- [ ] Stream setup modal with YouTube link validation
- [ ] Basic donation system operational
- [ ] 1 world with 4 biomes operational
- [ ] 20 concurrent players supported

### Hackathon Success Criteria (2 months)
- [ ] Complete web app with landing page and routing
- [ ] Full game client with all building and streaming features
- [ ] Complete viewer app with mobile optimization
- [ ] All 5 worlds operational (20 villages total)
- [ ] Complete building system with biome-specific assets
- [ ] Full streaming integration with YouTube embed
- [ ] All smart contracts deployed
- [ ] Profit sharing system working
- [ ] 200 concurrent players supported
- [ ] River system connecting villages
- [ ] Biome-specific resources and gameplay
- [ ] Mobile-responsive viewer interface
- [ ] PC-optimized game interface

---

## 🔧 Troubleshooting Guide

### Common Issues
1. **Solana Connection Issues**
   - Check RPC endpoint
   - Verify network (mainnet vs devnet)
   - Check wallet connection

2. **YouTube API Issues**
   - Verify API key
   - Check API quotas
   - Ensure proper permissions

3. **Game Performance Issues**
   - Optimize rendering
   - Reduce update frequency
   - Use object pooling

### Debug Tools
- **Solana Explorer:** https://explorer.solana.com/
- **YouTube API Tester:** Google API Explorer
- **Browser DevTools:** For client debugging
- **MongoDB Compass:** For database debugging

---

*Tài liệu này sẽ được cập nhật khi dự án tiến triển. Cập nhật lần cuối: [Ngày hiện tại]*
