// Atrax World - Main Game Entry Point
class AtraxWorldGame {
    constructor() {
        this.canvas = document.getElementById('game-canvas');
        this.uiCanvas = document.getElementById('ui-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.uiCtx = this.uiCanvas.getContext('2d');
        
        // Game state
        this.gameState = 'loading'; // loading, menu, playing, paused
        this.isConnected = false;
        this.player = null;
        this.world = null;
        this.gameEngine = null;
        this.audioManager = null;
        this.inventory = null;
        this.shop = null;
        // UI elements
        this.modals = {
            streamSetup: document.getElementById('stream-setup-modal'),
            youtube: document.getElementById('youtube-modal'),
            wallet: document.getElementById('wallet-modal')
        };
        
        this.init();
    }
    
    init() {
        console.log('Initializing Atrax World Game...');
        
        // Initialize audio manager
        this.audioManager = new AudioManager();
        // Initialize inventory system
        this.inventory = new Inventory(); 
        // Initialize shop system
        this.shop = new Shop();
        // Set up event listeners
        this.setupEventListeners();
        
        // Initialize game engine
        this.initGameEngine();
        
        // Show wallet connect modal first
        this.showWalletModal();
    }
    
    setupEventListeners() {
        // Wallet modal buttons
        document.getElementById('phantom-btn').addEventListener('click', () => {
            this.audioManager.playButtonClick();
            this.connectWallet('phantom');
        });
        document.getElementById('solflare-btn').addEventListener('click', () => {
            this.audioManager.playButtonClick();
            this.connectWallet('solflare');
        });
        document.getElementById('glow-btn').addEventListener('click', () => {
            this.audioManager.playButtonClick();
            this.connectWallet('glow');
        });
        document.getElementById('metamask-btn').addEventListener('click', () => {
            this.audioManager.playButtonClick();
            this.connectWallet('metamask');
        });
        
        // Stream setup modal buttons
        document.getElementById('no-stream-btn').addEventListener('click', () => {
            this.audioManager.playButtonClick();
            this.startGame(false);
        });
        document.getElementById('yes-stream-btn').addEventListener('click', () => {
            this.audioManager.playButtonClick();
            this.showYouTubeModal();
        });
        
        // YouTube modal buttons
        document.getElementById('cancel-youtube-btn').addEventListener('click', () => {
            this.audioManager.playButtonClick();
            this.hideYouTubeModal();
        });
        document.getElementById('confirm-youtube-btn').addEventListener('click', () => {
            this.audioManager.playButtonClick();
            this.setupStream();
        });
        
        // Chat input
        document.getElementById('chat-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.audioManager.playButtonClick();
                this.sendChatMessage();
            }
        });
        
        // UI buttons
        document.getElementById('inventory-btn').addEventListener('click', () => {
            this.audioManager.playButtonClick();
            this.toggleInventory();
        });
        document.getElementById('shop-btn').addEventListener('click', () => {
            this.audioManager.playButtonClick();
            this.toggleShop();
        });
        document.getElementById('building-btn').addEventListener('click', () => {
            this.audioManager.playButtonClick();
            this.toggleBuildingMode();
        });
        document.getElementById('land-btn').addEventListener('click', () => {
            this.audioManager.playButtonClick();
            this.toggleLand();
        });
        
        // Add hover effects for buttons
        this.addButtonHoverEffects();
    }
    
    addButtonHoverEffects() {
        // Add hover sound effects to all buttons
        const buttons = document.querySelectorAll('.ui-btn, .btn, .wallet-btn');
        buttons.forEach(button => {
            button.addEventListener('mouseenter', () => {
                this.audioManager.playButtonHover();
            });
        });
    }
    
    initGameEngine() {
        // Initialize the game engine
        this.gameEngine = new GameEngine(this.canvas, this.uiCanvas);
        
        // Set up game loop
        this.gameLoop();
    }
    
    async connectWallet(walletType) {
        console.log(`Connecting to ${walletType} wallet...`);
        
        try {
            // TODO: Implement actual wallet connection
            // For now, simulate successful connection
            await this.simulateWalletConnection(walletType);
            
            this.hideWalletModal();
            this.showStreamSetupModal();
            
        } catch (error) {
            console.error('Wallet connection failed:', error);
            alert('Failed to connect wallet. Please try again.');
        }
    }
    
    async simulateWalletConnection(walletType) {
        // Simulate wallet connection delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Simulate getting wallet address and balance
        this.walletAddress = 'Atrax' + Math.random().toString(36).substr(2, 9);
        this.solBalance = Math.random() * 10;
        
        // Update UI
        document.getElementById('player-name').textContent = this.walletAddress;
        document.getElementById('sol-balance').textContent = this.solBalance.toFixed(4) + ' SOL';
        
        this.isConnected = true;
    }
    
    showWalletModal() {
        this.modals.wallet.style.display = 'block';
    }
    
    hideWalletModal() {
        this.modals.wallet.style.display = 'none';
    }
    
    showStreamSetupModal() {
        this.modals.streamSetup.style.display = 'block';
    }
    
    hideStreamSetupModal() {
        this.modals.streamSetup.style.display = 'none';
    }
    
    showYouTubeModal() {
        this.hideStreamSetupModal();
        this.modals.youtube.style.display = 'block';
    }
    
    hideYouTubeModal() {
        this.modals.youtube.style.display = 'none';
    }
    
    setupStream() {
        const youtubeLink = document.getElementById('youtube-link').value;
        
        if (!this.validateYouTubeLink(youtubeLink)) {
            alert('Please enter a valid YouTube link');
            return;
        }
        
        // TODO: Implement YouTube stream setup
        console.log('Setting up stream with link:', youtubeLink);
        
        this.hideYouTubeModal();
        this.startGame(true, youtubeLink);
    }
    
    validateYouTubeLink(link) {
        const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[\w-]+/;
        return youtubeRegex.test(link);
    }
    
    startGame(isStreaming = false, youtubeLink = null) {
        console.log('Starting game...', { isStreaming, youtubeLink });
        
        this.hideStreamSetupModal();
        this.hideYouTubeModal();
        
        // Initialize game world
        this.initGameWorld();
        
        // Start game engine
        this.gameEngine.start();
        
        // Play background music for current biome
        this.audioManager.playBiomeMusic('plains'); // Default to plains for now
        
        this.gameState = 'playing';
        
        // If streaming, set up stream integration
        if (isStreaming && youtubeLink) {
            this.setupStreamIntegration(youtubeLink);
        }
    }
    
    initGameWorld() {
        // TODO: Initialize game world with biomes
        this.world = new World();
        this.player = new Player(400, 300); // Start position
        
        // Update world info in UI
        document.getElementById('world-name').textContent = 'World 1';
        document.getElementById('village-name').textContent = 'Plains Village';
    }
    
    setupStreamIntegration(youtubeLink) {
        // TODO: Implement stream integration
        console.log('Setting up stream integration with:', youtubeLink);
    }
    
    gameLoop() {
        if (this.gameState === 'playing' && this.gameEngine) {
            this.gameEngine.update();
            this.gameEngine.render();
        }
        
        requestAnimationFrame(() => this.gameLoop());
    }
    
    sendChatMessage() {
        const input = document.getElementById('chat-input');
        const message = input.value.trim();
        
        if (message) {
            // TODO: Send message to server
            this.addChatMessage(this.walletAddress, message);
            input.value = '';
        }
    }
    
    addChatMessage(sender, message) {
        const chatMessages = document.getElementById('chat-messages');
        const messageElement = document.createElement('div');
        messageElement.innerHTML = `<strong>${sender}:</strong> ${message}`;
        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    toggleInventory() {
        console.log('Toggle inventory');
        this.audioManager.playButtonClick();
        this.inventory.toggle();
        // TODO: Implement inventory panel
    }
    
    toggleShop() {
        console.log('Toggle shop');
        this.audioManager.playButtonClick();
        this.shop.toggle();        // TODO: Implement shop panel
    }
    
    toggleBuilding() {
        console.log('Toggle building mode');
        // TODO: Implement building mode
    }
    
    toggleLand() {
        console.log('Toggle land management');
        // TODO: Implement land management
    }

    toggleBuildingMode() {
        this.isBuildingMode = !this.isBuildingMode;
        if (this.isBuildingMode) {
            this.showBuildingMenu();
        } else {
            this.hideBuildingMenu();
        }
    }

    showBuildingMenu() {
        // Tạo building selection UI
        const buildingMenu = document.createElement('div');
        buildingMenu.id = 'building-menu';
        buildingMenu.innerHTML = `
            <div class="building-options">
                <button class="building-option" data-type="house">House</button>
                <button class="building-option" data-type="farm">Farm</button>
                <button class="building-option" data-type="castle">Castle</button>
            </div>
        `;
        document.body.appendChild(buildingMenu);
        
        // Add event listeners
        buildingMenu.querySelectorAll('.building-option').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.selectedBuildingType = e.target.dataset.type;
                this.audioManager.playButtonClick();
            });
        });
    }

    hideBuildingMenu() {
        const menu = document.getElementById('building-menu');
        if (menu) {
            menu.remove();
        }
    }
}

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.game = new AtraxWorldGame();
});
