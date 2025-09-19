// Player - Player character class
class Player {
    constructor(x, y, biome = 'plains', gender = 'male') {
        this.x = x;
        this.y = y;
        this.width = 32;
        this.height = 48;
        
        // Movement
        this.speed = 200; // pixels per second
        this.velocity = { x: 0, y: 0 };
        
        // Animation
        this.animationFrame = 0;
        this.animationSpeed = 0.1;
        this.direction = 'down'; // up, down, left, right
        
        // State
        this.isMoving = false;
        this.lastMoveTime = 0;
        
        // Character properties
        this.biome = biome;
        this.gender = gender;
        this.sprite = this.getCharacterSprite();
    }
    
    getCharacterSprite() {
        const spriteMap = {
            plains: {
                male: 'assets/images/characters/plains-male-villager.png',
                female: 'assets/images/characters/plains-female-villager.png'
            },
            desert: {
                male: 'assets/images/characters/desert-male-villager.png',
                female: 'assets/images/characters/desert-female-villager.png'
            },
            island: {
                male: 'assets/images/characters/island-male-villager.png',
                female: 'assets/images/characters/island-female-villager.png'
            },
            snow: {
                male: 'assets/images/characters/snow-male-villager.png',
                female: 'assets/images/characters/snow-female-villager.png'
            }
        };
        
        return spriteMap[this.biome] && spriteMap[this.biome][this.gender] 
            ? spriteMap[this.biome][this.gender] 
            : 'assets/images/characters/plains-male-villager.png';
    }
    
    getAnimationFrame() {
        // Return animation frame (0 for idle, 1-3 for walk)
        return this.isMoving ? Math.floor(this.animationFrame) % 4 : 0;
    }
    
    getDirectionFrame() {
        // Return direction frame (0=down, 1=left, 2=right, 3=up)
        const directionMap = {
            'down': 0,
            'left': 1,
            'right': 2,
            'up': 3
        };
        return directionMap[this.direction] || 0;
    }
    
    move(dx, dy) {
        this.velocity.x = dx * this.speed;
        this.velocity.y = dy * this.speed;
        
        this.isMoving = dx !== 0 || dy !== 0;
        
        // Update direction
        if (dx > 0) this.direction = 'right';
        else if (dx < 0) this.direction = 'left';
        else if (dy > 0) this.direction = 'down';
        else if (dy < 0) this.direction = 'up';
        
        if (this.isMoving) {
            this.lastMoveTime = Date.now();
        }
    }
    
    update(deltaTime) {
        // Update position
        this.x += this.velocity.x * deltaTime;
        this.y += this.velocity.y * deltaTime;
        
        // Update animation
        if (this.isMoving) {
            this.animationFrame += this.animationSpeed * deltaTime * 60;
            if (this.animationFrame >= 4) {
                this.animationFrame = 0;
            }
        } else {
            this.animationFrame = 0;
        }
        
        // Reset velocity
        this.velocity.x = 0;
        this.velocity.y = 0;
    }
    
    render(ctx, camera) {
        const screenX = this.x - camera.x;
        const screenY = this.y - camera.y;
        
        // Load and draw character sprite
        const img = new Image();
        img.onload = () => {
            // Calculate sprite frame based on direction and animation
            const frameX = this.getAnimationFrame() * this.width;
            const frameY = this.getDirectionFrame() * this.height;
            
            ctx.drawImage(
                img,
                frameX, frameY, this.width, this.height,
                screenX, screenY, this.width, this.height
            );
        };
        img.src = this.sprite;
        
        // Fallback: Simple player representation if sprite fails to load
        ctx.fillStyle = '#4CAF50';
        ctx.fillRect(screenX, screenY, this.width, this.height);
        
        // Draw player border
        ctx.strokeStyle = '#2E7D32';
        ctx.lineWidth = 2;
        ctx.strokeRect(screenX, screenY, this.width, this.height);
        
        // Draw direction indicator
        ctx.fillStyle = '#FFC107';
        const centerX = screenX + this.width / 2;
        const centerY = screenY + this.height / 2;
        
        switch (this.direction) {
            case 'up':
                ctx.fillRect(centerX - 2, screenY + 4, 4, 8);
                break;
            case 'down':
                ctx.fillRect(centerX - 2, screenY + this.height - 12, 4, 8);
                break;
            case 'left':
                ctx.fillRect(screenX + 4, centerY - 2, 8, 4);
                break;
            case 'right':
                ctx.fillRect(screenX + this.width - 12, centerY - 2, 8, 4);
                break;
        }
    }
    
    getBounds() {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        };
    }
}