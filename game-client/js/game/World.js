// World - World generation and tile management
class World {
    constructor() {
        this.width = 100;
        this.height = 100;
        this.tiles = [];
        
        // Biome types
        this.biomes = {
            plains: {
                name: 'Plains',
                color: '#4CAF50',
                resources: ['wood', 'water', 'fertile_soil']
            },
            desert: {
                name: 'Desert',
                color: '#FFC107',
                resources: ['sand', 'minerals', 'solar_energy']
            },
            island: {
                name: 'Island',
                color: '#2196F3',
                resources: ['fish', 'coral', 'sea_sand']
            },
            snow: {
                name: 'Snow',
                color: '#E3F2FD',
                resources: ['ice', 'pine_wood', 'minerals']
            }
        };
    }
    
    generatePlainsVillage() {
        console.log('Generating Plains Village...');
        
        // Initialize tiles array
        this.tiles = [];
        for (let y = 0; y < this.height; y++) {
            this.tiles[y] = [];
            for (let x = 0; x < this.width; x++) {
                this.tiles[y][x] = this.createTile(x, y, 'plains');
            }
        }
        
        // Add some variation
        this.addVariation();
        
        // Add river system
        this.addRiverSystem();
        
        console.log('Plains Village generated!');
    }
    
    createTile(x, y, biomeType) {
        const biome = this.biomes[biomeType];
        
        return {
            x: x,
            y: y,
            type: biomeType,
            color: biome.color,
            image: this.getTileImage(biomeType, 'grass'),
            resources: [...biome.resources],
            hasBuilding: false,
            building: null
        };
    }
    
    getTileImage(biome, type) {
        const imageMap = {
            plains: {
                grass: 'assets/images/tiles/grass.png',
                water: 'assets/images/tiles/water.png',
                dirt: 'assets/images/tiles/dirt.png'
            },
            desert: {
                grass: 'assets/images/tiles/sand.png',
                water: 'assets/images/tiles/water.png',
                dirt: 'assets/images/tiles/sand.png'
            },
            island: {
                grass: 'assets/images/tiles/water.png',
                water: 'assets/images/tiles/water.png',
                dirt: 'assets/images/tiles/water.png'
            },
            snow: {
                grass: 'assets/images/tiles/snow.png',
                water: 'assets/images/tiles/water.png',
                dirt: 'assets/images/tiles/snow.png'
            }
        };
        
        return imageMap[biome] && imageMap[biome][type] ? imageMap[biome][type] : 'assets/images/tiles/grass.png';
    }
    
    addVariation() {
        // Add some grass variation
        for (let i = 0; i < 50; i++) {
            const x = Math.floor(Math.random() * this.width);
            const y = Math.floor(Math.random() * this.height);
            
            if (this.tiles[y] && this.tiles[y][x]) {
                // Slightly different green color
                this.tiles[y][x].color = '#66BB6A';
                this.tiles[y][x].image = this.getTileImage('plains', 'grass');
            }
        }
        
        // Add some dirt patches
        for (let i = 0; i < 20; i++) {
            const x = Math.floor(Math.random() * this.width);
            const y = Math.floor(Math.random() * this.height);
            
            if (this.tiles[y] && this.tiles[y][x]) {
                this.tiles[y][x].color = '#8D6E63';
                this.tiles[y][x].image = this.getTileImage('plains', 'dirt');
            }
        }
    }
    
    addRiverSystem() {
        // Create a simple river from top to bottom
        const riverX = Math.floor(this.width / 2);
        
        for (let y = 0; y < this.height; y++) {
            if (this.tiles[y] && this.tiles[y][riverX]) {
                this.tiles[y][riverX].color = '#1976D2';
                this.tiles[y][riverX].type = 'water';
                this.tiles[y][riverX].image = this.getTileImage('plains', 'water');
                this.tiles[y][riverX].resources = ['water', 'fish'];
            }
        }
        
        // Add some river branches
        for (let i = 0; i < 3; i++) {
            const branchY = Math.floor(Math.random() * this.height);
            const branchLength = Math.floor(Math.random() * 10) + 5;
            
            for (let x = riverX - branchLength; x <= riverX + branchLength; x++) {
                if (x >= 0 && x < this.width && this.tiles[branchY] && this.tiles[branchY][x]) {
                    this.tiles[branchY][x].color = '#1976D2';
                    this.tiles[branchY][x].type = 'water';
                    this.tiles[branchY][x].resources = ['water', 'fish'];
                }
            }
        }
    }
    
    getTile(x, y) {
        if (y >= 0 && y < this.height && x >= 0 && x < this.width) {
            return this.tiles[y][x];
        }
        return null;
    }
    
    setTile(x, y, tile) {
        if (y >= 0 && y < this.height && x >= 0 && x < this.width) {
            this.tiles[y][x] = tile;
        }
    }
    
    canPlaceBuilding(x, y, buildingSize) {
        // Check if area is clear for building
        for (let dy = 0; dy < buildingSize.height; dy++) {
            for (let dx = 0; dx < buildingSize.width; dx++) {
                const tile = this.getTile(x + dx, y + dy);
                if (!tile || tile.hasBuilding || tile.type === 'water') {
                    return false;
                }
            }
        }
        return true;
    }
    
    placeBuilding(x, y, building) {
        if (this.canPlaceBuilding(x, y, { width: 2, height: 2 })) {
            // Mark tiles as having building
            for (let dy = 0; dy < 2; dy++) {
                for (let dx = 0; dx < 2; dx++) {
                    const tile = this.getTile(x + dx, y + dy);
                    if (tile) {
                        tile.hasBuilding = true;
                        tile.building = building;
                    }
                }
            }
            return true;
        }
        return false;
    }
}