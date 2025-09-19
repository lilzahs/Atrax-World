# Atrax World - Kế Hoạch Chi Tiết & Hướng Dẫn Phát Triển

## 📋 Tổng Quan Dự Án

**Tên Dự Án:** Atrax World - Streaming Crypto Game  
**Blockchain:** Solana  
**Wallets:** Phantom, Solflare, Glow, MetaMask  
**Streaming Platform:** YouTube (ưu tiên)  
**Timeline:** 2 tháng (Demo trong 2 tuần)  
**Team:** 2 người (Bạn + Duy - Blockchain)  

### Khái Niệm Cốt Lõi
**Atrax World** là một web game xây dựng làng multiplayer với tích hợp streaming và crypto. Hệ thống bao gồm:

**🎮 Web Game (PC/Laptop Optimized):**
- Người chơi đăng nhập ví Solana trước khi vào game
- Khi vào room, hiển thị câu hỏi: "Bạn có đang livestream không?"
- Nếu có stream: Nhập link YouTube để embed vào viewer website
- Nếu không stream: Chơi game bình thường
- Tối ưu cho PC/Laptop với giao diện game đầy đủ

**📱 Viewer Website (Mobile Optimized):**
- Giao diện riêng biệt cho người xem
- Kết nối ví Solana để donate
- Hiển thị danh sách stream đang live
- Hiển thị lịch sử stream đã donate
- Tối ưu UI cho mobile với donation buttons
- Embed video stream từ YouTube

**🔄 Tích Hợp:**
- Streamer xây dựng làng trong game
- Viewer donate SOL để mua items cho streamer
- Nhận 50% lợi nhuận từ đầu tư

---

## 🏗️ Kiến Trúc Game

### Cấu Trúc Thế Giới
```
┌─────────────────────────────────────────────────────────────────┐
│                        WORLD 1 (Larger Map)                    │
│                                                                 │
│  ┌─────────────────┐    ┌─────────────────┐                    │
│  │   VILLAGE 1     │    │   VILLAGE 2     │                    │
│  │  (Đồng Bằng)    │    │   (Sa Mạc)      │                    │
│  │  ┌───┐ ┌───┐    │    │  ┌───┐ ┌───┐    │                    │
│  │  │ H │ │ H │    │    │  │ H │ │ H │    │                    │
│  │  └───┘ └───┘    │    │  └───┘ └───┘    │                    │
│  │  ┌───┐ ┌───┐    │    │  ┌───┐ ┌───┐    │                    │
│  │  │ H │ │ H │    │    │  │ H │ │ H │    │                    │
│  │  └───┘ └───┘    │    │  └───┘ └───┘    │                    │
│  │  ┌───┐ ┌───┐    │    │  ┌───┐ ┌───┐    │                    │
│  │  │ H │ │ H │    │    │  │ H │ │ H │    │                    │
│  │  └───┘ └───┘    │    │  └───┘ └───┘    │                    │
│  │  ┌───┐ ┌───┐    │    │  ┌───┐ ┌───┐    │                    │
│  │  │ H │ │ H │    │    │  │ H │ │ H │    │                    │
│  │  └───┘ └───┘    │    │  └───┘ └───┘    │                    │
│  │  ┌───┐ ┌───┐    │    │  ┌───┐ ┌───┐    │                    │
│  │  │ H │ │ H │    │    │  │ H │ │ H │    │                    │
│  │  └───┘ └───┘    │    │  └───┘ └───┘    │                    │
│  └─────────────────┘    └─────────────────┘                    │
│           │                        │                           │
│    ┌──────┴────────────────────────┴──────┐                    │
│    │            RIVER SYSTEM              │                    │
│    │     (Chia cắt các làng)              │                    │
│    └──────────────────────────────────────┘                    │
│                                                                 │
│  ┌─────────────────┐    ┌─────────────────┐                    │
│  │   VILLAGE 3     │    │   VILLAGE 4     │                    │
│  │  (Đảo Biển)     │    │   (Tuyết)       │                    │
│  │  ┌───┐ ┌───┐    │    │  ┌───┐ ┌───┐    │                    │
│  │  │ H │ │ H │    │    │  │ H │ │ H │    │                    │
│  │  └───┘ └───┘    │    │  └───┘ └───┘    │                    │
│  │  ┌───┐ ┌───┐    │    │  ┌───┐ ┌───┐    │                    │
│  │  │ H │ │ H │    │    │  │ H │ │ H │    │                    │
│  │  └───┘ └───┘    │    │  └───┘ └───┘    │                    │
│  │  ┌───┐ ┌───┐    │    │  ┌───┐ ┌───┐    │                    │
│  │  │ H │ │ H │    │    │  │ H │ │ H │    │                    │
│  │  └───┘ └───┘    │    │  └───┘ └───┘    │                    │
│  │  ┌───┐ ┌───┐    │    │  ┌───┐ ┌───┐    │                    │
│  │  │ H │ │ H │    │    │  │ H │ │ H │    │                    │
│  │  └───┘ └───┘    │    │  └───┘ └───┘    │                    │
│  │  ┌───┐ ┌───┐    │    │  ┌───┐ ┌───┐    │                    │
│  │  │ H │ │ H │    │    │  │ H │ │ H │    │                    │
│  │  └───┘ └───┘    │    │  └───┘ └───┘    │                    │
│  └─────────────────┘    └─────────────────┘                    │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │              CENTRAL SHOP AREA                              ││
│  │         (Trung tâm giao thương)                             ││
│  └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│  [Empty Land Plots for New Players - Scattered around world]   │
└─────────────────────────────────────────────────────────────────┘
```

### Quy Mô Hệ Thống Mới
- **5 Worlds** (maps riêng biệt, lớn hơn)
- **4 Villages per World** (mỗi village có biome riêng)
- **10 Houses per Village** (tối đa 10 người chơi mỗi làng)
- **Empty Land Plots** (rải rác khắp thế giới cho người chơi mới)
- **Tổng cộng:** 200 người chơi đồng thời (5 worlds × 4 villages × 10 players)

### Hệ Thống Biome
**Village 1 - Đồng Bằng (Plains):**
- Đất đai màu xanh lá chủ đạo
- Tài nguyên: Gỗ, nước, đất màu mỡ
- Đặc điểm: Dễ trồng trọt, nhiều tài nguyên

**Village 2 - Sa Mạc (Desert):**
- Đất cát vàng, ít nước
- Tài nguyên: Cát, khoáng sản, năng lượng mặt trời
- Đặc điểm: Khó trồng trọt, cần hệ thống tưới tiêu

**Village 3 - Đảo Biển (Island):**
- Đất đai xung quanh biển
- Tài nguyên: Nước biển, cá, san hô, cát
- Đặc điểm: Nguồn nước dồi dào, giao thông bằng thuyền

**Village 4 - Tuyết (Snow):**
- Đất đai phủ tuyết trắng
- Tài nguyên: Băng, gỗ thông, khoáng sản
- Đặc điểm: Khí hậu lạnh, cần hệ thống sưởi ấm

---

## 🔄 User Flow & Navigation

### Landing Page Flow
```
User visits atrax-world.com
├── [Play Game] Button
│   ├── Connect Solana Wallet (Phantom/Solflare/Glow/MetaMask)
│   ├── Enter Game Room
│   ├── "Bạn có đang livestream không?" Modal
│   │   ├── [Không] → Start Playing Game
│   │   └── [Có] → Enter YouTube Stream Link
│   │       ├── Validate YouTube URL
│   │       ├── Embed Stream to Viewer Website
│   │       └── Start Playing Game with Stream
│   └── Game Interface (PC/Laptop Optimized)
│
└── [Watch Stream] Button
    ├── Connect Solana Wallet
    ├── View Stream List (Live & History)
    ├── Select Stream to Watch
    ├── YouTube Video Player (Embedded)
    ├── Donation Panel (Mobile Optimized)
    └── Donation History
```

### Game Client Features (PC/Laptop)
- **Full Game Interface:** Canvas-based game with pixel art
- **Stream Setup Modal:** YouTube link input and validation
- **Stream Overlay:** Real-time stats and notifications
- **Wallet Integration:** SOL balance and transaction history
- **Building System:** Drag-and-drop building placement
- **Chat System:** Real-time communication with other players

### Viewer App Features (Mobile Optimized)
- **Stream Discovery:** List of live streams with thumbnails
- **Video Player:** YouTube embedded player with mobile controls
- **Donation Interface:** Touch-optimized donation buttons
- **Wallet Integration:** Mobile-friendly wallet connection
- **Donation History:** List of previous donations and profits
- **Real-time Updates:** Live donation notifications

---

## 💰 Hệ Thống Kinh Tế & Crypto

### Token & Giao Dịch
- **Token chính:** SOL (Solana)
- **Phí giao dịch:** 10% cho dev (trừ mua shop = 100% cho dev)
- **Chia lợi nhuận:** 50% cho viewer khi streamer có lời

### Smart Contracts Cần Thiết
1. **Donation Contract** - Xử lý donate từ viewer
2. **Player Trading Contract** - Giao dịch giữa người chơi
3. **Shop Contract** - Mua items từ dev shop
4. **Profit Sharing Contract** - Chia lợi nhuận cho viewer
5. **Land Ownership Contract** - Quản lý quyền sở hữu đất

### Luồng Giao Dịch
```
Viewer Donate SOL → Smart Contract → 
├── 90% SOL → Streamer Wallet
├── 10% SOL → Dev Wallet
└── Item → Streamer Inventory

Player Buy Item → Smart Contract →
├── 100% SOL → Dev Wallet (nếu mua từ shop)
├── 90% SOL → Seller Wallet (nếu mua từ player)
└── 10% SOL → Dev Wallet (nếu mua từ player)
```

---

## 🎮 Tính Năng Game

### Hệ Thống Xây Dựng
**Categories:**
- **Nông Nghiệp:** Ruộng, nông trại, hàng rào, cây cối, lúa, bắp
- **Nhà Cửa:** Nhà, cửa, nâng cấp nhà
- **Trang Trí:** Cây cối, hoa, đá, nước
- **Công Nghiệp:** Nhà máy, kho, xưởng

**Phong Cách Xây Dựng:**
- Hiện đại vs Cổ điển
- Thành thị vs Nông thôn
- Trồng trọt vs Chăn nuôi
- Tự do sáng tạo

### Tài Nguyên & Địa Hình Theo Biome

**Village 1 - Đồng Bằng (Plains):**
- **Tài nguyên:** Gỗ sồi, nước ngọt, đất màu mỡ, lúa mì
- **Địa hình:** Đồng cỏ xanh, rừng sồi, sông nước ngọt
- **Đặc điểm:** Dễ trồng trọt, tài nguyên dồi dào, khí hậu ôn hòa

**Village 2 - Sa Mạc (Desert):**
- **Tài nguyên:** Cát, khoáng sản, năng lượng mặt trời, xương rồng
- **Địa hình:** Cát vàng, ốc đảo, đá sa mạc, cây xương rồng
- **Đặc điểm:** Khó trồng trọt, cần hệ thống tưới tiêu, năng lượng mặt trời dồi dào

**Village 3 - Đảo Biển (Island):**
- **Tài nguyên:** Cá, san hô, cát biển, nước biển, dừa
- **Địa hình:** Bãi biển, rừng dừa, rạn san hô, nước biển
- **Đặc điểm:** Nguồn nước dồi dào, giao thông bằng thuyền, hải sản phong phú

**Village 4 - Tuyết (Snow):**
- **Tài nguyên:** Băng, gỗ thông, khoáng sản, lông thú
- **Địa hình:** Tuyết trắng, rừng thông, núi băng, hồ đóng băng
- **Đặc điểm:** Khí hậu lạnh, cần hệ thống sưởi ấm, tài nguyên quý hiếm

**Hệ Thống Sông (River System):**
- **Chức năng:** Kết nối 4 làng, giao thông, tài nguyên nước
- **Tương tác:** Lấy nước tưới cây, vận chuyển hàng hóa, câu cá
- **Cầu:** Cho phép di chuyển giữa các làng

---

## 📺 Tích Hợp Streaming

### YouTube Integration
**Streamer Tools:**
- Chat overlay hiển thị tin nhắn
- Thông báo donation real-time
- Hiển thị số lượng viewer
- Stats overlay (số SOL, items, tiến độ xây dựng)

**Viewer Interaction:**
- Nút donate với giá và icon items
- Trả tiền hộ cho streamer
- Theo dõi lợi nhuận đầu tư
- Nhận 50% lợi nhuận khi streamer có lời

### Donation System
```
Viewer Click Donate Button → 
├── Chọn Item từ Shop
├── Nhập số lượng SOL
├── Kết nối Wallet (Phantom/Solflare/Glow/MetaMask)
├── Xác nhận giao dịch
└── Item xuất hiện trong game của Streamer
```

---

## 🗂️ Cấu Trúc Thư Mục Dự Án

```
atrax-world/
├── README.md
├── package.json
├── .env
├── .gitignore
├── KE_HOACH_CHI_TIET.md
│
├── web-app/                    # Main Web Application
│   ├── index.html              # Landing page with Play/Watch options
│   ├── css/
│   │   ├── main.css            # Main landing page styles
│   │   ├── landing.css         # Landing page specific styles
│   │   └── responsive.css      # Responsive design
│   ├── js/
│   │   ├── main.js             # Landing page logic
│   │   ├── router.js           # Route handling
│   │   └── wallet-connect.js   # Wallet connection logic
│   └── assets/
│       ├── images/
│       └── icons/
│
├── game-client/                # Web Game (PC/Laptop Optimized)
│   ├── index.html              # Game main page
│   ├── css/
│   │   ├── game.css            # Game-specific styles
│   │   ├── ui.css              # Game UI components
│   │   └── pixel-art.css       # Pixel art rendering styles
│   ├── js/
│   │   ├── main.js             # Game entry point
│   │   ├── game/               # Game logic
│   │   │   ├── GameClient.js
│   │   │   ├── Renderer.js
│   │   │   ├── InputHandler.js
│   │   │   ├── Player.js
│   │   │   ├── World.js
│   │   │   ├── Village.js
│   │   │   └── Building.js
│   │   ├── ui/                 # Game UI components
│   │   │   ├── Chat.js
│   │   │   ├── Shop.js
│   │   │   ├── Building.js
│   │   │   ├── Inventory.js
│   │   │   ├── Wallet.js
│   │   │   └── Land.js
│   │   ├── streaming/          # Streaming integration
│   │   │   ├── StreamSetup.js  # Stream setup modal
│   │   │   ├── YouTubeEmbed.js # YouTube integration
│   │   │   └── StreamOverlay.js
│   │   ├── solana/             # Solana integration
│   │   │   ├── WalletConnector.js
│   │   │   ├── TransactionHandler.js
│   │   │   ├── PriceTracker.js
│   │   │   └── ContractInterface.js
│   │   └── utils/              # Game utilities
│   │       ├── pixelArt.js
│   │       ├── animation.js
│   │       └── sound.js
│   ├── assets/                 # Game assets
│   │   ├── images/
│   │   │   ├── tiles/
│   │   │   ├── buildings/
│   │   │   ├── characters/
│   │   │   └── ui/
│   │   ├── sounds/
│   │   └── maps/
│   └── streaming/              # Streaming-specific files
│       ├── overlay.html
│       └── streamer-dashboard.html
│
├── viewer-app/                 # Viewer Website (Mobile Optimized)
│   ├── index.html              # Viewer main page
│   ├── css/
│   │   ├── viewer.css          # Viewer-specific styles
│   │   ├── mobile.css          # Mobile optimization
│   │   ├── donation.css        # Donation UI styles
│   │   └── stream-list.css     # Stream list styles
│   ├── js/
│   │   ├── main.js             # Viewer app entry point
│   │   ├── components/         # Viewer components
│   │   │   ├── StreamList.js   # List of live streams
│   │   │   ├── StreamPlayer.js # YouTube embed player
│   │   │   ├── DonationPanel.js # Donation interface
│   │   │   ├── WalletConnect.js # Wallet connection
│   │   │   └── HistoryPanel.js # Donation history
│   │   ├── streaming/          # Streaming features
│   │   │   ├── ViewerWidget.js
│   │   │   ├── DonationHandler.js
│   │   │   └── YouTubeIntegration.js
│   │   ├── solana/             # Solana integration
│   │   │   ├── WalletConnector.js
│   │   │   ├── TransactionHandler.js
│   │   │   └── PriceTracker.js
│   │   └── utils/              # Viewer utilities
│   │       ├── mobile-utils.js
│   │       └── donation-utils.js
│   └── assets/
│       ├── images/
│       └── icons/
│
├── server/                          # Backend Server
│   ├── index.js                     # Main server entry point
│   ├── config/                      # Configuration files
│   │   ├── database.js              # MongoDB connection
│   │   ├── solana.js                # Solana RPC & wallet config
│   │   ├── youtube.js               # YouTube API config
│   │   └── game.js                  # Game settings
│   │
│   ├── core/                        # Core game engine
│   │   ├── GameEngine.js            # Main game controller
│   │   ├── GameLoop.js              # Game tick system
│   │   ├── EventSystem.js           # Event handling
│   │   ├── Physics.js               # Collision detection
│   │   └── WorldManager.js          # World & village management
│   │
│   ├── managers/                    # Feature managers
│   │   ├── PlayerManager.js         # Player data & actions
│   │   ├── BuildingManager.js       # Building placement & management
│   │   ├── InventoryManager.js      # Item & resource management
│   │   ├── StreamingManager.js      # YouTube streaming integration
│   │   ├── SolanaManager.js         # Solana blockchain integration
│   │   ├── ShopManager.js           # Shop & item management
│   │   └── LandManager.js           # Land ownership & trading
│   │
│   ├── models/                      # Database models
│   │   ├── Player.js                # Player data schema
│   │   ├── World.js                 # World data schema
│   │   ├── Village.js               # Village data schema
│   │   ├── Building.js              # Building data schema
│   │   ├── Item.js                  # Item data schema
│   │   ├── Transaction.js           # Transaction history
│   │   ├── Stream.js                # Streaming data
│   │   └── Land.js                  # Land ownership data
│   │
│   ├── routes/                      # API endpoints
│   │   ├── auth.js                  # Authentication routes
│   │   ├── game.js                  # Game action routes
│   │   ├── streaming.js             # Streaming routes
│   │   ├── solana.js                # Solana blockchain routes
│   │   ├── shop.js                  # Shop routes
│   │   └── land.js                  # Land trading routes
│   │
│   ├── smart-contracts/             # Solana smart contracts
│   │   ├── donation-contract/       # Donation handling
│   │   │   ├── lib.rs               # Rust contract code
│   │   │   ├── Cargo.toml           # Dependencies
│   │   │   └── tests/               # Contract tests
│   │   ├── trading-contract/        # Player trading
│   │   │   ├── lib.rs
│   │   │   ├── Cargo.toml
│   │   │   └── tests/
│   │   ├── shop-contract/           # Shop purchases
│   │   │   ├── lib.rs
│   │   │   ├── Cargo.toml
│   │   │   └── tests/
│   │   ├── profit-sharing-contract/ # Profit distribution
│   │   │   ├── lib.rs
│   │   │   ├── Cargo.toml
│   │   │   └── tests/
│   │   └── land-contract/           # Land ownership
│   │       ├── lib.rs
│   │       ├── Cargo.toml
│   │       └── tests/
│   │
│   └── utils/                       # Utility functions
│       ├── solanaUtils.js           # Solana helper functions
│       ├── validation.js            # Input validation
│       ├── logger.js                # Logging system
│       └── constants.js             # Game constants
│
├── client/                          # Frontend Game Client
│   ├── index.html                   # Main HTML file
│   ├── css/                         # Stylesheets
│   │   ├── main.css                 # Main game styles
│   │   ├── ui.css                   # UI component styles
│   │   ├── streaming.css            # Streaming overlay styles
│   │   └── pixel-art.css            # Pixel art specific styles
│   │
│   ├── js/                          # Client-side JavaScript
│   │   ├── main.js                  # Client entry point
│   │   ├── game/                    # Game client logic
│   │   │   ├── GameClient.js        # Main game client
│   │   │   ├── Renderer.js          # Canvas rendering
│   │   │   ├── InputHandler.js      # User input handling
│   │   │   ├── Player.js            # Client player logic
│   │   │   ├── World.js             # Client world rendering
│   │   │   ├── Village.js           # Village rendering
│   │   │   └── Building.js          # Building rendering
│   │   │
│   │   ├── ui/                      # User interface
│   │   │   ├── Chat.js              # Chat system
│   │   │   ├── Shop.js              # Shop interface
│   │   │   ├── Building.js          # Building interface
│   │   │   ├── Inventory.js         # Inventory management
│   │   │   ├── Wallet.js            # Wallet connection UI
│   │   │   └── Land.js              # Land trading UI
│   │   │
│   │   ├── streaming/               # Streaming features
│   │   │   ├── StreamOverlay.js     # Streaming overlay
│   │   │   ├── ViewerWidget.js      # Viewer interaction widget
│   │   │   ├── DonationHandler.js   # Donation processing
│   │   │   └── YouTubeIntegration.js # YouTube API integration
│   │   │
│   │   ├── solana/                  # Solana integration
│   │   │   ├── WalletConnector.js   # Wallet connection
│   │   │   ├── TransactionHandler.js # Transaction processing
│   │   │   ├── PriceTracker.js      # SOL price tracking
│   │   │   └── ContractInterface.js # Smart contract interface
│   │   │
│   │   └── utils/                   # Client utilities
│   │       ├── pixelArt.js          # Pixel art rendering helpers
│   │       ├── animation.js         # Animation system
│   │       └── sound.js             # Sound effects
│   │
│   ├── assets/                      # Game assets
│   │   ├── images/                  # Game sprites and images
│   │   │   ├── tiles/               # Tile sprites (32x32px)
│   │   │   │   ├── grass.png
│   │   │   │   ├── water.png
│   │   │   │   ├── stone.png
│   │   │   │   └── dirt.png
│   │   │   ├── buildings/           # Building sprites
│   │   │   │   ├── house-basic.png
│   │   │   │   ├── house-modern.png
│   │   │   │   ├── farm.png
│   │   │   │   ├── shop.png
│   │   │   │   └── factory.png
│   │   │   ├── items/               # Item sprites
│   │   │   │   ├── wood.png
│   │   │   │   ├── stone.png
│   │   │   │   ├── water-bucket.png
│   │   │   │   ├── seeds.png
│   │   │   │   └── crops.png
│   │   │   ├── characters/          # Character sprites
│   │   │   │   ├── player-idle.png
│   │   │   │   ├── player-walk.png
│   │   │   │   └── player-work.png
│   │   │   └── ui/                  # UI elements
│   │   │       ├── buttons.png
│   │   │       ├── panels.png
│   │   │       └── icons.png
│   │   ├── sounds/                  # Audio files
│   │   │   ├── music/               # Background music
│   │   │   ├── effects/             # Sound effects
│   │   │   └── ui/                  # UI sounds
│   │   └── maps/                    # Game map data
│   │       ├── world1.json          # World 1 map data
│   │       ├── world2.json          # World 2 map data
│   │       └── templates/           # Map templates
│   │
│   └── streaming/                   # Streaming-specific files
│       ├── overlay.html             # Streaming overlay HTML
│       ├── viewer-widget.html       # Viewer interaction widget
│       ├── donation-page.html       # Donation page for viewers
│       └── streamer-dashboard.html  # Streamer control panel
│
├── docs/                            # Documentation
│   ├── API.md                       # API documentation
│   ├── GAME_DESIGN.md               # Game design document
│   ├── SOLANA_INTEGRATION.md        # Solana integration guide
│   ├── STREAMING_SETUP.md           # Streaming setup guide
│   └── DEPLOYMENT.md                # Deployment guide
│
└── tests/                           # Test files
    ├── server/                      # Server tests
    ├── client/                      # Client tests
    └── contracts/                   # Smart contract tests
```

---

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
**Files cần tạo:**
```
server/smart-contracts/
├── donation-contract/
│   ├── lib.rs
│   ├── Cargo.toml
│   └── tests/
├── trading-contract/
├── shop-contract/
├── profit-sharing-contract/
└── land-contract/
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

2. **Donation Contract Structure**
   ```rust
   // lib.rs - Main contract logic
   use anchor_lang::prelude::*;
   
   #[program]
   pub mod donation_contract {
       use super::*;
       
       pub fn donate(ctx: Context<Donate>, amount: u64) -> Result<()> {
           // Transfer SOL from viewer to streamer
           // Take 10% fee for dev
           // Emit donation event
           Ok(())
       }
   }
   ```

3. **Key Functions cần implement:**
   - `donate()` - Xử lý donation từ viewer
   - `buy_item()` - Mua item từ shop
   - `trade_item()` - Giao dịch giữa players
   - `claim_profit()` - Claim lợi nhuận cho viewer
   - `transfer_land()` - Chuyển nhượng đất

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
        // Call donation smart contract
    }
    
    async buyFromShop(playerWallet, itemId, amount) {
        // Call shop smart contract
    }
    
    async tradeItems(sellerWallet, buyerWallet, itemId, price) {
        // Call trading smart contract
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
