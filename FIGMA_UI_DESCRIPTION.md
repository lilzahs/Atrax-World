# Atrax World - Figma UI Design Brief

## 🎮 Project Overview

**Atrax World** is a streaming-based multiplayer farming and building game that combines:
- **Stardew Valley-style gameplay** with pixel art aesthetics
- **Live streaming integration** (YouTube, Twitch)
- **Blockchain technology** (Solana) for all transactions
- **Viewer participation** through donations and investments
- **Multi-platform experience** (PC game client + Mobile viewer app)

## 🎯 Target Audience

### Primary Users:
- **Streamers**: Content creators who want to monetize their gaming
- **Viewers**: Mobile users who want to support streamers and earn rewards
- **Gamers**: PC users who enjoy farming/building games with social elements

### Age Range: 16-35 years old
### Tech Savviness: Medium to High (crypto/blockchain familiarity)

## 🎨 Design System & Visual Identity

### Color Palette:
```css
Primary Colors:
- Main Blue: #3498db (Streaming, Interactive elements)
- Success Green: #27ae60 (Farming, Growth, Success)
- Warning Orange: #f39c12 (Alerts, Energy, Resources)
- Danger Red: #e74c3c (Health, Warnings, Donations)
- Dark Blue: #2c3e50 (Backgrounds, Headers)
- Light Gray: #ecf0f1 (Text, Secondary elements)

Secondary Colors:
- Purple: #9b59b6 (Magic, Premium features)
- Teal: #16a085 (Water, Nature)
- Gold: #f1c40f (Currency, Premium items)
- Silver: #95a5a6 (Secondary currency, Common items)
```

### Typography:
- **Primary Font**: Modern, clean sans-serif (Inter, Roboto, or similar)
- **Game Font**: Pixel-style font for game elements
- **Headings**: Bold, impactful (700-800 weight)
- **Body Text**: Readable, medium weight (400-500)
- **UI Labels**: Medium weight, clear hierarchy

### Visual Style:
- **Pixel Art Aesthetic**: 16-bit inspired, retro gaming feel
- **Modern UI Elements**: Clean, minimalist interface design
- **Gradient Backgrounds**: Subtle gradients for depth
- **Glass Morphism**: Frosted glass effects for modals and panels
- **Smooth Animations**: 60fps transitions and micro-interactions

## 📱 Application Structure

### 1. Landing Page
**Purpose**: Entry point with two main options
**Layout**: Full-screen hero with clear CTAs

**Elements**:
- Hero background with game world preview
- Large "PLAY GAME" button (PC optimized)
- Large "WATCH STREAMS" button (Mobile optimized)
- Logo and branding
- Brief feature highlights

### 2. Game Client (PC/Laptop Optimized)
**Purpose**: Main game interface for players
**Resolution**: 1920x1080 minimum, scalable

#### Header Bar:
- Player avatar and name
- Wallet balance (SOL)
- Current biome indicator
- Stream status (if streaming)
- Settings menu

#### Game Canvas:
- 2D top-down view
- Pixel art world with 4 biomes:
  - **Plains**: Green grass, trees, rivers
  - **Desert**: Sand, cacti, oasis
  - **Island**: Water, palm trees, beaches
  - **Snow**: White terrain, pine trees, frozen lakes
- Central shop building
- Player buildings and farms
- Other players (up to 10 per village)

#### Bottom UI Panel:
- **Inventory Button**: Grid of items with quantities
- **Shop Button**: Browse and purchase items
- **Building Button**: Construction menu
- **Land Button**: Land management
- **Chat Panel**: Real-time communication

#### Modals:
- **Inventory Modal**: Item grid, item details, actions
- **Shop Modal**: Categories, item cards, cart, checkout
- **Building Modal**: Building types, placement, costs
- **Wallet Modal**: Connection, balance, transaction history

### 3. Viewer App (Mobile Optimized)
**Purpose**: Mobile interface for stream viewers
**Resolution**: 375x812 (iPhone X), responsive

#### Header:
- App logo and title
- Wallet connection status
- Notification indicator

#### Main Sections:

**Stream List Section**:
- Grid of live stream cards
- Stream thumbnail with overlay
- Streamer name and title
- Viewer count and donation total
- Live indicator
- Category filters

**Stream Player Section**:
- YouTube embed player
- Stream information
- Real-time stats
- Back to list button

**Donation Section**:
- Quick donation amounts (0.01, 0.05, 0.1, 0.5 SOL)
- Custom amount input
- Message input
- Donation confirmation

**History Section**:
- Past donations list
- Transaction details
- Total statistics

#### Bottom Navigation:
- **Streams**: List of live streams
- **Donate**: Donation interface
- **History**: Transaction history
- **Wallet**: Wallet management

## 🎮 Game Elements & Icons

### Item Categories:
- **Seeds**: Wheat, corn, rice, flowers
- **Tools**: Axe, pickaxe, hoe, watering can
- **Materials**: Wood, stone, metal, gems
- **Buildings**: Houses, farms, shops, decorations
- **Food**: Crops, cooked meals, potions
- **Currency**: SOL coins, tokens

### Building Types:
- **Houses**: 5 levels, different styles per biome
- **Farms**: Fields, animal pens, storage
- **Shops**: Central marketplace
- **Decorations**: Trees, flowers, paths, fences

### Character Sprites:
- **Player**: Customizable avatar
- **Villagers**: Biome-specific NPCs
- **Animals**: Cows, sheep, chickens, biome-specific animals

## 🔗 Integration Points

### Blockchain Elements:
- **Wallet Connection**: Phantom, Solflare, Glow wallets
- **Transaction Status**: Loading, success, error states
- **Balance Display**: SOL amount with USD equivalent
- **Smart Contract Interactions**: Donations, purchases, trading

### Streaming Elements:
- **YouTube Integration**: Embedded player
- **Stream Status**: Live indicator, viewer count
- **Donation Notifications**: Real-time alerts
- **Streamer Dashboard**: Revenue tracking

## 📐 Layout Specifications

### Game Client Layout:
```
Header: 60px height, full width
Game Canvas: 100vh - 120px (header + bottom panel)
Bottom Panel: 60px height, full width
Modals: Centered, max 800px width, max 600px height
```

### Viewer App Layout:
```
Header: 80px height, full width
Main Content: 100vh - 160px (header + bottom nav)
Bottom Navigation: 80px height, full width
Modals: Full screen on mobile, centered on tablet+
```

## 🎨 Component Library

### Buttons:
- **Primary**: Blue gradient, rounded corners, hover effects
- **Secondary**: Gray gradient, outlined style
- **Danger**: Red gradient, for destructive actions
- **Icon Buttons**: Circular, with icon and label
- **Floating Action**: Large, prominent, for main actions

### Cards:
- **Stream Cards**: Thumbnail, overlay, info, hover effects
- **Item Cards**: Icon, name, price, quantity
- **Building Cards**: Preview, name, cost, requirements

### Inputs:
- **Text Inputs**: Rounded, with labels, validation states
- **Number Inputs**: For amounts, with increment/decrement
- **Search Inputs**: With search icon, clear button

### Modals:
- **Overlay**: Dark background with blur
- **Content**: Rounded corners, shadow, close button
- **Header**: Title, close button
- **Body**: Scrollable content
- **Footer**: Action buttons

## 🎯 User Experience Goals

### Game Client:
- **Intuitive**: Easy to learn, hard to master
- **Efficient**: Quick access to all features
- **Immersive**: Minimal UI, maximum game world
- **Social**: Clear communication and interaction

### Viewer App:
- **Simple**: One-tap donations, easy navigation
- **Engaging**: Real-time updates, social features
- **Rewarding**: Clear benefits, progress tracking
- **Trustworthy**: Transparent transactions, secure

## 🚀 Technical Considerations

### Performance:
- **60fps animations** for smooth experience
- **Lazy loading** for images and content
- **Optimized assets** for fast loading
- **Responsive design** for all screen sizes

### Accessibility:
- **High contrast** for readability
- **Large touch targets** (44px minimum)
- **Clear typography** with good hierarchy
- **Keyboard navigation** support

### Cross-Platform:
- **Consistent design** across web and mobile
- **Platform-specific** optimizations
- **Progressive enhancement** for older devices

## 📋 Design Deliverables

### Required Screens:
1. **Landing Page** (Desktop + Mobile)
2. **Game Client** (Desktop)
   - Main game interface
   - Inventory modal
   - Shop modal
   - Building modal
   - Wallet modal
3. **Viewer App** (Mobile)
   - Stream list
   - Stream player
   - Donation interface
   - History view
   - Wallet connection

### Asset Requirements:
- **Icons**: 24x24, 32x32, 48x48px
- **Illustrations**: Hero images, empty states
- **Sprites**: Game items, buildings, characters
- **Backgrounds**: Game world, UI backgrounds

### Style Guide:
- **Color palette** with hex codes
- **Typography** specifications
- **Spacing** system (8px grid)
- **Component** specifications
- **Animation** guidelines

## 🎨 Inspiration & References

### Game References:
- **Stardew Valley**: Farming mechanics, pixel art
- **Animal Crossing**: Building, customization
- **Terraria**: Exploration, crafting
- **Minecraft**: Creative building

### UI References:
- **Discord**: Chat interface, user management
- **Twitch**: Streaming interface, donations
- **Steam**: Game library, social features
- **MetaMask**: Wallet interface, transactions

### Design Trends:
- **Glassmorphism**: Frosted glass effects
- **Neumorphism**: Soft, tactile elements
- **Gradient Overlays**: Depth and dimension
- **Micro-interactions**: Delightful details

## 🎯 Success Metrics

### User Experience:
- **Task Completion Rate**: >90% for core actions
- **Time to First Action**: <30 seconds
- **User Satisfaction**: >4.5/5 rating
- **Retention Rate**: >70% after first week

### Technical Performance:
- **Load Time**: <3 seconds initial load
- **Frame Rate**: 60fps during gameplay
- **Error Rate**: <1% for transactions
- **Uptime**: >99.5% availability

---

## 📝 Additional Notes for Figma AI

### Key Design Principles:
1. **Clarity**: Every element should have a clear purpose
2. **Consistency**: Use the same patterns throughout
3. **Efficiency**: Minimize clicks and cognitive load
4. **Delight**: Add personality and charm to the interface
5. **Accessibility**: Design for all users and abilities

### Technical Constraints:
- **Web-based**: Must work in modern browsers
- **Mobile-first**: Viewer app optimized for touch
- **Performance**: Lightweight, fast loading
- **Scalability**: Support for future features

### Brand Personality:
- **Friendly**: Welcoming and approachable
- **Professional**: Trustworthy for financial transactions
- **Playful**: Fun and engaging for gaming
- **Innovative**: Cutting-edge blockchain integration

This design brief should provide Figma AI with comprehensive information to create a cohesive, user-friendly, and visually appealing interface for Atrax World that meets all technical and user experience requirements.
