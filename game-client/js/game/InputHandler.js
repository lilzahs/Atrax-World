// Input Handler - Handle mouse and keyboard input
class InputHandler {
    constructor(canvas) {
        this.canvas = canvas;
        
        // Input state
        this.keys = {};
        this.mouse = {
            x: 0,
            y: 0,
            isDown: false,
            isUp: true
        };
        
        // Callbacks
        this.onMove = null;
        this.onClick = null;
        this.onKeyDown = null;
        this.onKeyUp = null;
        
        // Initialize
        this.init();
    }
    
    init() {
        this.setupKeyboardEvents();
        this.setupMouseEvents();
    }
    
    setupKeyboardEvents() {
        document.addEventListener('keydown', (e) => {
            this.keys[e.code] = true;
            
            if (this.onKeyDown) {
                this.onKeyDown(e.code);
            }
            
            // Handle movement
            this.handleMovement();
        });
        
        document.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
            
            if (this.onKeyUp) {
                this.onKeyUp(e.code);
            }
        });
    }
    
    setupMouseEvents() {
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouse.x = e.clientX - rect.left;
            this.mouse.y = e.clientY - rect.top;
        });
        
        this.canvas.addEventListener('mousedown', (e) => {
            this.mouse.isDown = true;
            this.mouse.isUp = false;
            
            if (this.onClick) {
                this.onClick(this.mouse.x, this.mouse.y);
            }
        });
        
        this.canvas.addEventListener('mouseup', (e) => {
            this.mouse.isDown = false;
            this.mouse.isUp = true;
        });
        
        // Prevent context menu on right click
        this.canvas.addEventListener('contextmenu', (e) => {
            e.preventDefault();
        });
    }
    
    handleMovement() {
        if (!this.onMove) return;
        
        let dx = 0;
        let dy = 0;
        
        // Arrow keys or WASD
        if (this.keys['ArrowLeft'] || this.keys['KeyA']) dx = -1;
        if (this.keys['ArrowRight'] || this.keys['KeyD']) dx = 1;
        if (this.keys['ArrowUp'] || this.keys['KeyW']) dy = -1;
        if (this.keys['ArrowDown'] || this.keys['KeyS']) dy = 1;
        
        if (dx !== 0 || dy !== 0) {
            this.onMove(dx, dy);
        }
    }
    
    isKeyPressed(keyCode) {
        return this.keys[keyCode] || false;
    }
    
    getMousePosition() {
        return { x: this.mouse.x, y: this.mouse.y };
    }
}
// Thêm method mới:
handleBuildingClick(x, y, buildingType) 
{
    if (this.onBuildingClick)
    {
        this.onBuildingClick(x, y, buildingType);
    }
}