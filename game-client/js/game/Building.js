// Building - Building management class
class Building {
    constructor(x, y, type, level = 1, owner = null) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.level = level;
        this.owner = owner;
        this.width = 2; // 2 tiles wide
        this.height = 2; // 2 tiles tall
        this.isPlaced = false;
        this.constructionTime = 0;
        this.maxConstructionTime = 5000; // 5 seconds
        this.isConstructing = false;
        
        // Building properties
        this.properties = this.getBuildingProperties(type, level);
        
        // Visual properties
        this.sprite = this.getBuildingSprite(type, level);
        this.alpha = 1.0;
    }
    
    getBuildingProperties(type, level) {
        const properties = {
            house: {
                name: 'House',
                cost: { wood: 10, stone: 5, sol: 0.1 },
                upgradeCost: { wood: 15, stone: 8, sol: 0.15 },
                maxLevel: 5,
                description: 'Basic dwelling for villagers'
            },
            farm: {
                name: 'Farm House',
                cost: { wood: 8, stone: 3, sol: 0.08 },
                upgradeCost: { wood: 12, stone: 5, sol: 0.12 },
                maxLevel: 3,
                description: 'Agricultural building for farming'
            },
            castle: {
                name: 'Castle',
                cost: { wood: 50, stone: 100, sol: 1.0 },
                upgradeCost: { wood: 75, stone: 150, sol: 1.5 },
                maxLevel: 5,
                description: 'Fortified structure for defense'
            }
        };
        
        return properties[type] || properties.house;
    }
    
    getBuildingSprite(type, level) {
        const spriteMap = {
            house: `assets/images/buildings/house-level-${level}.png`,
            farm: `assets/images/buildings/farm-house-level-${level}.png`,
            castle: `assets/images/buildings/castle-level-${level}.png`
        };
        
        return spriteMap[type] || spriteMap.house;
    }
    
    // Check if building can be placed at given position
    canPlace(world, x, y) {
        // Check bounds
        if (x < 0 || y < 0 || x + this.width > world.width || y + this.height > world.height) {
            return false;
        }
        
        // Check if tiles are available and suitable
        for (let dy = 0; dy < this.height; dy++) {
            for (let dx = 0; dx < this.width; dx++) {
                const tile = world.getTile(x + dx, y + dy);
                if (!tile) return false;
                
                // Can't place on water
                if (tile.type === 'water') return false;
                
                // Can't place on existing building
                if (tile.hasBuilding) return false;
            }
        }
        
        return true;
    }
    
    // Place building at given position
    place(world, x, y) {
        if (!this.canPlace(world, x, y)) {
            return false;
        }
        
        this.x = x;
        this.y = y;
        this.isPlaced = true;
        this.isConstructing = true;
        this.constructionTime = 0;
        
        // Mark tiles as occupied
        for (let dy = 0; dy < this.height; dy++) {
            for (let dx = 0; dx < this.width; dx++) {
                const tile = world.getTile(x + dx, y + dy);
                if (tile) {
                    tile.hasBuilding = true;
                    tile.building = this;
                }
            }
        }
        
        return true;
    }
    
    // Render building
    render(ctx, camera, tileSize) {
        if (!this.isPlaced) return;
        
        const screenX = this.x * tileSize - camera.x;
        const screenY = this.y * tileSize - camera.y;
        
        // Save context state
        ctx.save();
        
        // Apply alpha for construction effect
        ctx.globalAlpha = this.alpha;
        
        // Load and draw building sprite
        const img = new Image();
        img.onload = () => {
            ctx.drawImage(
                img,
                screenX, screenY, 
                this.width * tileSize, this.height * tileSize
            );
        };
        img.src = this.sprite;
        
        // Fallback: Draw colored rectangle if sprite fails to load
        ctx.fillStyle = this.getBuildingColor();
        ctx.fillRect(screenX, screenY, this.width * tileSize, this.height * tileSize);
        
        // Draw building border
        ctx.strokeStyle = '#8B4513';
        ctx.lineWidth = 2;
        ctx.strokeRect(screenX, screenY, this.width * tileSize, this.height * tileSize);
        
        // Restore context state
        ctx.restore();
    }
    
    getBuildingColor() {
        const colors = {
            house: '#8B4513',
            farm: '#DEB887',
            castle: '#696969'
        };
        
        return colors[this.type] || '#8B4513';
    }
}