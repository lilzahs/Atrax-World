// Shop - Shop system for buying and selling items
class Shop {
    constructor() {
        this.isOpen = false;
        this.selectedCategory = 'materials';
        this.cart = [];
        this.totalCost = 0;
        
        // Shop categories and items
        this.categories = {
            materials: {
                name: 'Materials',
                items: [
                    { type: 'wood', name: 'Wood', price: 0.01, description: 'Basic building material', icon: 'assets/images/items/wood.png' },
                    { type: 'stone', name: 'Stone', price: 0.02, description: 'Strong construction material', icon: 'assets/images/items/stone.png' },
                    { type: 'seeds', name: 'Seeds', price: 0.005, description: 'Plant these to grow crops', icon: 'assets/images/items/seeds.png' },
                    { type: 'tools', name: 'Tools', price: 0.05, description: 'Helps with construction', icon: 'assets/images/items/tools.png' }
                ]
            },
            buildings: {
                name: 'Buildings',
                items: [
                    { type: 'house', name: 'House', price: 0.1, description: 'Basic dwelling for villagers', icon: 'assets/images/buildings/house-level-1.png' },
                    { type: 'farm', name: 'Farm House', price: 0.08, description: 'Agricultural building for farming', icon: 'assets/images/buildings/farm-house-level-1.png' },
                    { type: 'castle', name: 'Castle', price: 1.0, description: 'Fortified structure for defense', icon: 'assets/images/buildings/castle-level-1.png' }
                ]
            },
            food: {
                name: 'Food & Consumables',
                items: [
                    { type: 'food', name: 'Food', price: 0.02, description: 'Restores health and energy', icon: 'assets/images/items/food.png' },
                    { type: 'potion', name: 'Health Potion', price: 0.05, description: 'Restores health instantly', icon: 'assets/images/items/potion.png' },
                    { type: 'energy', name: 'Energy Drink', price: 0.03, description: 'Restores energy instantly', icon: 'assets/images/items/energy.png' }
                ]
            },
            special: {
                name: 'Special Items',
                items: [
                    { type: 'gems', name: 'Gems', price: 0.5, description: 'Valuable precious stones', icon: 'assets/images/items/gems.png' },
                    { type: 'coins', name: 'Coins', price: 0.1, description: 'Currency for trading', icon: 'assets/images/items/coins.png' },
                    { type: 'materials', name: 'Materials', price: 0.15, description: 'Various crafting materials', icon: 'assets/images/items/materials.png' }
                ]
            }
        };
    }
    
    // Toggle shop visibility
    toggle() {
        this.isOpen = !this.isOpen;
        this.render();
    }
    
    // Open shop
    open() {
        this.isOpen = true;
        this.render();
    }
    
    // Close shop
    close() {
        this.isOpen = false;
        this.hideShopPanel();
    }
    
    // Render shop panel
    render() {
        if (this.isOpen) {
            this.showShopPanel();
        } else {
            this.hideShopPanel();
        }
    }
    
    // Show shop panel
    showShopPanel() {
        let shopPanel = document.getElementById('shop-panel');
        
        if (!shopPanel) {
            shopPanel = document.createElement('div');
            shopPanel.id = 'shop-panel';
            shopPanel.className = 'shop-panel';
            document.body.appendChild(shopPanel);
        }
        
        // Generate shop HTML
        let shopHTML = `
            <div class="shop-header">
                <h3>Atrax World Shop</h3>
                <button id="close-shop" class="close-btn">×</button>
            </div>
            <div class="shop-content">
                <div class="shop-sidebar">
                    <div class="shop-categories">
                        <h4>Categories</h4>
                        ${Object.keys(this.categories).map(category => `
                            <button class="category-btn ${category === this.selectedCategory ? 'active' : ''}" 
                                    data-category="${category}">
                                ${this.categories[category].name}
                            </button>
                        `).join('')}
                    </div>
                    <div class="shop-cart">
                        <h4>Cart (${this.cart.length} items)</h4>
                        <div class="cart-items">
                            ${this.cart.map((item, index) => `
                                <div class="cart-item">
                                    <img src="${item.icon}" alt="${item.name}" class="cart-item-icon">
                                    <span class="cart-item-name">${item.name}</span>
                                    <span class="cart-item-price">${item.price} SOL</span>
                                    <button class="remove-from-cart" data-index="${index}">×</button>
                                </div>
                            `).join('')}
                        </div>
                        <div class="cart-total">
                            <strong>Total: ${this.totalCost.toFixed(3)} SOL</strong>
                        </div>
                        <button id="checkout-btn" class="checkout-btn" ${this.cart.length === 0 ? 'disabled' : ''}>
                            Checkout
                        </button>
                    </div>
                </div>
                <div class="shop-main">
                    <div class="shop-items">
                        <h4>${this.categories[this.selectedCategory].name}</h4>
                        <div class="items-grid">
                            ${this.categories[this.selectedCategory].items.map(item => `
                                <div class="shop-item" data-type="${item.type}">
                                    <img src="${item.icon}" alt="${item.name}" class="item-icon">
                                    <div class="item-info">
                                        <h5>${item.name}</h5>
                                        <p>${item.description}</p>
                                        <div class="item-price">${item.price} SOL</div>
                                    </div>
                                    <button class="add-to-cart-btn" data-type="${item.type}">
                                        Add to Cart
                                    </button>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        shopPanel.innerHTML = shopHTML;
        
        // Add event listeners
        this.addShopEventListeners();
    }
    
    // Hide shop panel
    hideShopPanel() {
        const shopPanel = document.getElementById('shop-panel');
        if (shopPanel) {
            shopPanel.remove();
        }
    }
    
    // Add event listeners for shop
    addShopEventListeners() {
        // Close button
        document.getElementById('close-shop').addEventListener('click', () => {
            this.close();
        });
        
        // Category buttons
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.selectedCategory = e.target.dataset.category;
                this.render(); // Refresh to show new category
            });
        });
        
        // Add to cart buttons
        document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const itemType = e.target.dataset.type;
                this.addToCart(itemType);
            });
        });
        
        // Remove from cart buttons
        document.querySelectorAll('.remove-from-cart').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.target.dataset.index);
                this.removeFromCart(index);
            });
        });
        
        // Checkout button
        document.getElementById('checkout-btn').addEventListener('click', () => {
            this.checkout();
        });
    }
    
    // Add item to cart
    addToCart(itemType) {
        // Find item in current category
        const category = this.categories[this.selectedCategory];
        const item = category.items.find(i => i.type === itemType);
        
        if (item) {
            this.cart.push(item);
            this.calculateTotal();
            this.render(); // Refresh to update cart
            console.log(`Added ${item.name} to cart`);
        }
    }
    
    // Remove item from cart
    removeFromCart(index) {
        if (index >= 0 && index < this.cart.length) {
            this.cart.splice(index, 1);
            this.calculateTotal();
            this.render(); // Refresh to update cart
        }
    }
    
    // Calculate total cost
    calculateTotal() {
        this.totalCost = this.cart.reduce((total, item) => total + item.price, 0);
    }
    
    // Checkout process
    checkout() {
        if (this.cart.length === 0) {
            alert('Your cart is empty!');
            return;
        }
        
        // TODO: Integrate with wallet and blockchain
        console.log('Checking out:', this.cart);
        console.log('Total cost:', this.totalCost, 'SOL');
        
        // For now, just show confirmation
        const confirmMessage = `Purchase ${this.cart.length} items for ${this.totalCost.toFixed(3)} SOL?`;
        if (confirm(confirmMessage)) {
            this.processPurchase();
        }
    }
    
    // Process purchase
    processPurchase() {
        // TODO: Implement actual purchase logic with wallet
        console.log('Processing purchase...');
        
        // Clear cart after successful purchase
        this.cart = [];
        this.totalCost = 0;
        this.render();
        
        alert('Purchase successful! Items added to inventory.');
    }
    
    // Get shop items by category
    getItemsByCategory(category) {
        return this.categories[category] ? this.categories[category].items : [];
    }
    
    // Get item price
    getItemPrice(itemType) {
        for (const category of Object.values(this.categories)) {
            const item = category.items.find(i => i.type === itemType);
            if (item) return item.price;
        }
        return 0;
    }
}