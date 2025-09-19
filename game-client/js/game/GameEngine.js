// Game Engine - Core game logic and rendering
class GameEngine {
    constructor(gameCanvas, uiCanvas) {
        this.gameCanvas = gameCanvas;
        this.uiCanvas = uiCanvas;
        this.gameCtx = gameCanvas.getContext('2d');
        this.uiCtx = uiCanvas.getContext('2d');
        
        // Game state
        this.isRunning = false;
        this.lastTime = 0;
        this.deltaTime = 0;
        
        // Game objects
        this.world = null;
        this.player = null;
        this.entities = [];
        this.buildings = [];
        
        // Rendering
        this.camera = { x: 0, y: 0 };
        this.tileSize = 32;
        this.scale = 2;
        
        // Input handling
        this.inputHandler = new InputHandler(this.gameCanvas);
        
        // Initialize
        this.init();
    }
    
    init() {
        console.log('Initializing Game Engine...');
        
        // Set up canvas
        this.setupCanvas();
        
        // Initialize world
        this.initWorld();
        
        // Set up input handlers
        this.setupInputHandlers();
    }
    
    setupCanvas() {
        // Set canvas size
        this.gameCanvas.width = 1024;
        this.gameCanvas.height = 768;
        this.uiCanvas.width = 1024;
        this.uiCanvas.height = 768;
        
        // Set pixelated rendering
        this.gameCtx.imageSmoothingEnabled = false;
        this.uiCtx.imageSmoothingEnabled = false;
    }
    
    initWorld() {
        // Create a simple world for now
        this.world = new World();
        this.world.generatePlainsVillage();
        
        // Create player
        this.player = new Player(400, 300);
        this.entities.push(this.player);
        
        // Set camera to follow player
        this.camera.x = this.player.x - this.gameCanvas.width / 2;
        this.camera.y = this.player.y - this.gameCanvas.height / 2;
    }
    
    setupInputHandlers() {
        this.inputHandler.onMove = (dx, dy) => {
            if (this.player) {
                this.player.move(dx, dy);
            }
        };
        
        this.inputHandler.onClick = (x, y) => {
            // Convert screen coordinates to world coordinates
            const worldX = x + this.camera.x;
            const worldY = y + this.camera.y;
            
            // Handle click in world
            this.handleWorldClick(worldX, worldY);
        };
    }
    
    handleWorldClick(worldX, worldY) {
        // Check if clicking on a building
        for (let building of this.buildings) {
            if (building.isPointInside(worldX, worldY)) {
                console.log('Clicked on building:', building.type);
                return;
            }
        }
        
        // Check if clicking on empty land
        const tileX = Math.floor(worldX / this.tileSize);
        const tileY = Math.floor(worldY / this.tileSize);
        
        console.log('Clicked on tile:', tileX, tileY);
        
        // TODO: Implement building placement
    }
    
    start() {
        console.log('Starting Game Engine...');
        this.isRunning = true;
        this.lastTime = performance.now();
    }
    
    stop() {
        console.log('Stopping Game Engine...');
        this.isRunning = false;
    }
    
    update(deltaTime) {
        if (!this.isRunning) return;
        
        // Update player
        if (this.player) {
            this.player.update(deltaTime);
            
            // Update camera to follow player
            this.camera.x = this.player.x - this.gameCanvas.width / 2;
            this.camera.y = this.player.y - this.gameCanvas.height / 2;
        }
        
        // Update entities
        for (let entity of this.entities) {
            entity.update(deltaTime);
        }
        
        // Update buildings
        for (let building of this.buildings) {
            building.update(deltaTime);
        }
    }
    
    render() {
        if (!this.isRunning) return;
        
        // Clear canvas
        this.gameCtx.clearRect(0, 0, this.gameCanvas.width, this.gameCanvas.height);
        this.uiCtx.clearRect(0, 0, this.uiCanvas.width, this.uiCanvas.height);
        
        // Render world
        this.renderWorld();
        
        // Render entities
        this.renderEntities();
        
        // Render buildings
        this.renderBuildings();
        
        // Render UI
        this.renderUI();
    }
    
    renderWorld() {
        if (!this.world) return;
        
        // Render tiles
        const startX = Math.floor(this.camera.x / this.tileSize);
        const startY = Math.floor(this.camera.y / this.tileSize);
        const endX = startX + Math.ceil(this.gameCanvas.width / this.tileSize) + 1;
        const endY = startY + Math.ceil(this.gameCanvas.height / this.tileSize) + 1;
        
        for (let y = startY; y < endY; y++) {
            for (let x = startX; x < endX; x++) {
                const tile = this.world.getTile(x, y);
                if (tile) {
                    this.renderTile(x, y, tile);
                }
            }
        }
    }
    
    renderTile(x, y, tile) {
        const screenX = x * this.tileSize - this.camera.x;
        const screenY = y * this.tileSize - this.camera.y;
        
        // Load and draw tile image
        if (tile.image) {
            const img = new Image();
            img.onload = () => {
                this.gameCtx.drawImage(
                    img,
                    screenX, screenY, this.tileSize, this.tileSize
                );
            };
            img.src = tile.image;
        }
        
        // Fallback: Simple colored tiles if image fails to load
        this.gameCtx.fillStyle = tile.color;
        this.gameCtx.fillRect(screenX, screenY, this.tileSize, this.tileSize);
        
        // Draw tile border
        this.gameCtx.strokeStyle = '#333';
        this.gameCtx.lineWidth = 1;
        this.gameCtx.strokeRect(screenX, screenY, this.tileSize, this.tileSize);
    }
    
    renderEntities() {
        for (let entity of this.entities) {
            entity.render(this.gameCtx, this.camera);
        }
    }
    
    renderBuildings() {
        for (let building of this.buildings) {
            building.render(this.gameCtx, this.camera);
        }
    }
    
    renderUI() {
        // Render player info
        if (this.player) {
            this.uiCtx.fillStyle = 'white';
            this.uiCtx.font = '16px Courier New';
            this.uiCtx.fillText(`Player: ${this.player.x.toFixed(0)}, ${this.player.y.toFixed(0)}`, 10, 30);
        }
        
        // Render camera info
        this.uiCtx.fillText(`Camera: ${this.camera.x.toFixed(0)}, ${this.camera.y.toFixed(0)}`, 10, 50);
    }
}