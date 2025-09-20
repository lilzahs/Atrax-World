// Shop - Shop system for buying and selling items
class Shop {
    constructor() {
        this.isOpen = false;
        this.selectedCategory = 'materials';
        this.cart = [];
        this.totalCost = 0;
        this.smartContractManager = null;
        
        // Shop categories and items
        this.categories = {
            materials: {
                name: 'Materials',
                items: [
                    { type: 'wood', name: 'Wood', price: 0.01, description: 'Basic building material', icon: 'item-placeholder wood' },
                    { type: 'stone', name: 'Stone', price: 0.02, description: 'Strong construction material', icon: 'item-placeholder stone' },
                    { type: 'seeds', name: 'Seeds', price: 0.005, description: 'Plant these to grow crops', icon: 'item-placeholder seeds' },
                    { type: 'tools', name: 'Tools', price: 0.05, description: 'Helps with construction', icon: 'item-placeholder tools' }
                ]
            },
            buildings: {
                name: 'Buildings',
                items: [
                    { type: 'house', name: 'House', price: 0.1, description: 'Basic dwelling for villagers', icon: 'item-placeholder materials' },
                    { type: 'farm', name: 'Farm House', price: 0.08, description: 'Agricultural building for farming', icon: 'item-placeholder materials' },
                    { type: 'castle', name: 'Castle', price: 1.0, description: 'Fortified structure for defense', icon: 'item-placeholder materials' }
                ]
            },
            food: {
                name: 'Food & Consumables',
                items: [
                    { type: 'food', name: 'Food', price: 0.02, description: 'Restores health and energy', icon: 'item-placeholder materials' },
                    { type: 'potion', name: 'Health Potion', price: 0.05, description: 'Restores health instantly', icon: 'item-placeholder potion' },
                    { type: 'energy', name: 'Energy Drink', price: 0.03, description: 'Restores energy instantly', icon: 'item-placeholder energy' }
                ]
            },
            special: {
                name: 'Special Items',
                items: [
                    { type: 'gems', name: 'Gems', price: 0.5, description: 'Valuable precious stones', icon: 'item-placeholder gems' },
                    { type: 'coins', name: 'Coins', price: 0.1, description: 'Currency for trading', icon: 'item-placeholder materials' },
                    { type: 'materials', name: 'Materials', price: 0.15, description: 'Various crafting materials', icon: 'item-placeholder materials' }
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
        // Create modal overlay
        let modalOverlay = document.getElementById('modal-overlay');
        if (!modalOverlay) {
            modalOverlay = document.createElement('div');
            modalOverlay.id = 'modal-overlay';
            modalOverlay.className = 'modal-overlay';
            document.body.appendChild(modalOverlay);
        }
        
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
                                    <div class="${item.icon}" title="${item.name}">${item.name.charAt(0).toUpperCase()}</div>
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
        
        // Show modal overlay and panel
        modalOverlay.style.display = 'block';
        shopPanel.style.display = 'block';
        
        // Add animation class after a small delay
        setTimeout(() => {
            shopPanel.classList.add('show');
        }, 10);
        
        // Add event listeners
        this.addShopEventListeners();
    }
    
    // Hide shop panel
    hideShopPanel() {
        const shopPanel = document.getElementById('shop-panel');
        const modalOverlay = document.getElementById('modal-overlay');
        
        if (shopPanel) {
            // Remove animation class first
            shopPanel.classList.remove('show');
            
            // Hide after animation completes
            setTimeout(() => {
                shopPanel.style.display = 'none';
            }, 300);
        }
        
        if (modalOverlay) {
            modalOverlay.style.display = 'none';
        }
    }
    
    // Add event listeners for shop
    addShopEventListeners() {
        // Close button
        document.getElementById('close-shop').addEventListener('click', () => {
            this.close();
        });
        
        // Modal overlay click to close
        const modalOverlay = document.getElementById('modal-overlay');
        if (modalOverlay) {
            modalOverlay.addEventListener('click', () => {
                this.close();
            });
        }
        
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
    async checkout() {
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
            await this.processPurchase();
        }
    }
    
    // Process purchase
    async processPurchase() {
        if (this.cart.length === 0) {
            alert('Your cart is empty!');
            return;
        }
        
        try {
            console.log('Processing purchase...');
            
            // Lấy smart contract manager từ main game
            const game = window.game;
            if (!game || !game.smartContractManager) {
                throw new Error('Smart contract manager not available');
            }
            
            // Xử lý từng item trong cart
            for (const item of this.cart) {
                const result = await game.smartContractManager.buyShopItem(
                    item.type, // itemId
                    1, // quantity
                    'seller_address_here' // TODO: Lấy địa chỉ seller thực
                );
                
                if (result.success) {
                    console.log(`Purchased ${item.name}:`, result);
                }
            }
            
            // Xóa cart sau khi mua thành công
            this.cart = [];
            this.totalCost = 0;
            this.render();
            
            alert('Purchase successful! Items added to inventory.');
            
        } catch (error) {
            console.error('Purchase failed:', error);
            alert(`Purchase failed: ${error.message}`);
        }
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