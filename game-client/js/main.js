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
        this.walletManager = null;
        this.smartContractManager = null;
        this.streamManager = null;
        this.viewerInterface = null;
        
        this.init();
    }
    
    init() {
        console.log('Initializing Atrax World Game...');
        
        try {
            // Initialize audio manager
            this.audioManager = new AudioManager();
            console.log('AudioManager initialized');
            
            // Initialize inventory system
            this.inventory = new Inventory();
            console.log('Inventory initialized');
            
            // Initialize shop system
            this.shop = new Shop();
            console.log('Shop initialized');
            
            // Initialize wallet manager
            this.walletManager = new WalletManager();
            console.log('WalletManager initialized');
            
            // Initialize smart contract manager
            this.smartContractManager = new SmartContractManager(this.walletManager);
            console.log('SmartContractManager initialized');
            
            // Initialize stream manager
            this.streamManager = new StreamManager(this.walletManager, this.smartContractManager);
            console.log('StreamManager initialized');
            
            // Initialize viewer interface
            this.viewerInterface = new ViewerInterface(this.walletManager, this.smartContractManager);
            console.log('ViewerInterface initialized');
            
            // Set up event listeners
            this.setupEventListeners();
            console.log('Event listeners set up');
            
            // Don't initialize game engine yet - wait for user to start game
            console.log('Home page ready');
            
            console.log('Game initialization completed successfully!');
            
        } catch (error) {
            console.error('Game initialization failed:', error);
            alert('Game initialization failed: ' + error.message);
        }
    }
    
    initGameEngine() {
        // Set canvas size
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
        
        // Initialize game engine
        this.gameEngine = new GameEngine(this.canvas, this.uiCanvas);
        console.log('GameEngine created');
        
        // Initialize world
        this.world = new World();
        console.log('World created');
        
        // Initialize player
        this.player = new Player(100, 100);
        console.log('Player created');
        
        // Start game loop
        this.gameLoop();
    }
    
    resizeCanvas() {
        const container = document.getElementById('game-container');
        const rect = container.getBoundingClientRect();
        
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
        this.uiCanvas.width = rect.width;
        this.uiCanvas.height = rect.height;
        
        console.log(`Canvas resized to: ${rect.width}x${rect.height}`);
    }
    
    gameLoop() {
        this.update();
        this.render();
        requestAnimationFrame(() => this.gameLoop());
    }
    
    update() {
        if (this.gameEngine) {
            this.gameEngine.update();
        }
    }
    
    render() {
        if (this.gameEngine) {
            this.gameEngine.render();
        }
    }
    
    setupEventListeners() {
        console.log('Setting up home page event listeners...');
        
        // Connect Wallet Button
        const connectWalletBtn = document.getElementById('connect-wallet-btn');
        if (connectWalletBtn) {
            connectWalletBtn.addEventListener('click', () => {
                this.connectWallet();
            });
        }
        
        // Player Name Input
        const playerNameInput = document.getElementById('player-name-input');
        if (playerNameInput) {
            playerNameInput.addEventListener('input', (e) => {
                this.onPlayerNameChange(e.target.value);
            });
            
            playerNameInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.onPlayerNameSubmit();
                }
            });
        }
        
        // Play Button
        const playBtn = document.getElementById('play-btn');
        if (playBtn) {
            playBtn.addEventListener('click', () => {
                this.startGame();
            });
        }
        
        // Watch Button
        const watchBtn = document.getElementById('watch-btn');
        if (watchBtn) {
            watchBtn.addEventListener('click', () => {
                this.openViewerApp();
            });
        }
    }
    
    // Connect Wallet
    connectWallet() {
        console.log('Connecting wallet...');
        
        // Simulate wallet connection for now
        setTimeout(() => {
            this.onWalletConnected('Fzbs8K9mN2pQ7rT5wX3yJ6hG4vB1nM8kL2pQ7rT5wX3yJmb');
        }, 1000);
    }
    
    // Wallet Connected
    onWalletConnected(address) {
        console.log('Wallet connected:', address);
        
        // Hide connect wallet section
        const connectSection = document.getElementById('connect-wallet-section');
        if (connectSection) {
            connectSection.classList.add('hidden');
        }
        
        // Show wallet address
        const walletSection = document.getElementById('wallet-address-section');
        const walletText = document.getElementById('wallet-address-text');
        if (walletSection && walletText) {
            walletText.textContent = this.formatWalletAddress(address);
            walletSection.classList.remove('hidden');
        }
        
        // Show player name input
        const nameSection = document.getElementById('player-name-section');
        if (nameSection) {
            nameSection.classList.remove('hidden');
        }
        
        // Show action buttons (gray)
        const actionButtons = document.getElementById('action-buttons');
        if (actionButtons) {
            actionButtons.classList.remove('hidden');
        }
    }
    
    // Format wallet address
    formatWalletAddress(address) {
        if (address.length <= 8) return address;
        return address.substring(0, 4) + '...' + address.substring(address.length - 3);
    }
    
    // Player name change
    onPlayerNameChange(name) {
        const playBtn = document.getElementById('play-btn');
        const watchBtn = document.getElementById('watch-btn');
        
        if (name.trim().length > 0) {
            // Change to red buttons
            if (playBtn) {
                const img = playBtn.querySelector('.btn-image');
                if (img) {
                    img.src = 'assets/images/ui/buttons/play-red.png';
                }
            }
            if (watchBtn) {
                const img = watchBtn.querySelector('.btn-image');
                if (img) {
                    img.src = 'assets/images/ui/buttons/watch-stream-red.png';
                }
            }
        } else {
            // Change to gray buttons
            if (playBtn) {
                const img = playBtn.querySelector('.btn-image');
                if (img) {
                    img.src = 'assets/images/ui/buttons/play-gray.png';
                }
            }
            if (watchBtn) {
                const img = watchBtn.querySelector('.btn-image');
                if (img) {
                    img.src = 'assets/images/ui/buttons/watch-stream-gray.png';
                }
            }
        }
    }
    
    // Player name submit
    onPlayerNameSubmit() {
        const nameInput = document.getElementById('player-name-input');
        if (nameInput && nameInput.value.trim().length > 0) {
            this.playerName = nameInput.value.trim();
            console.log('Player name set:', this.playerName);
        }
    }
    
    // Start Game
    startGame() {
        const nameInput = document.getElementById('player-name-input');
        if (!nameInput || nameInput.value.trim().length === 0) {
            alert('Please enter your player name first!');
            return;
        }
        
        this.playerName = nameInput.value.trim();
        console.log('Starting game with player name:', this.playerName);
        
        // Switch to game page
        this.switchToGamePage();
    }
    
    // Open Viewer App
    openViewerApp() {
        console.log('Opening viewer app...');
        // For now, just show alert
        alert('Viewer app will open in a new tab');
        // window.open('viewer-app/index.html', '_blank');
    }
    
    // Switch to Game Page
    switchToGamePage() {
        const homePage = document.getElementById('home-page');
        const gamePage = document.getElementById('game-page');
        
        if (homePage && gamePage) {
            homePage.classList.remove('active');
            gamePage.classList.add('active');
            
            // Initialize game engine
            this.initGameEngine();
        }
    }
    
    startGame(skipWallet = false) {
        console.log('Starting game...');
        this.gameState = 'playing';
        this.hideAllModals();
    }
    
    hideAllModals() {
        // Hide all modals
        console.log('Hiding all modals...');
    }
}

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.game = new AtraxWorldGame();
});