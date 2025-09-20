// Inventory - Player inventory management system
class Inventory {
    constructor(maxSlots = 20) {
        this.maxSlots = maxSlots;
        this.items = [];
        this.isOpen = false;
        this.selectedSlot = 0;
        
        // Initialize empty slots
        for (let i = 0; i < this.maxSlots; i++) {
            this.items.push(null);
        }
        
        // Add some starter items for testing
        this.addItem('wood', 10);
        this.addItem('stone', 5);
        this.addItem('seeds', 3);
    }
    
    // Add item to inventory
    addItem(itemType, quantity = 1) {
        // Check if item already exists in inventory
        for (let i = 0; i < this.maxSlots; i++) {
            if (this.items[i] && this.items[i].type === itemType) {
                this.items[i].quantity += quantity;
                return true;
            }
        }
        
        // Find empty slot
        for (let i = 0; i < this.maxSlots; i++) {
            if (this.items[i] === null) {
                this.items[i] = {
                    type: itemType,
                    quantity: quantity,
                    icon: this.getItemIcon(itemType),
                    name: this.getItemName(itemType),
                    description: this.getItemDescription(itemType)
                };
                return true;
            }
        }
        
        return false; // Inventory full
    }
    
    // Remove item from inventory
    removeItem(itemType, quantity = 1) {
        for (let i = 0; i < this.maxSlots; i++) {
            if (this.items[i] && this.items[i].type === itemType) {
                if (this.items[i].quantity > quantity) {
                    this.items[i].quantity -= quantity;
                } else {
                    this.items[i] = null;
                }
                return true;
            }
        }
        return false;
    }
    
    // Get item quantity
    getItemQuantity(itemType) {
        for (let i = 0; i < this.maxSlots; i++) {
            if (this.items[i] && this.items[i].type === itemType) {
                return this.items[i].quantity;
            }
        }
        return 0;
    }
    
    // Check if has enough items
    hasItem(itemType, quantity = 1) {
        return this.getItemQuantity(itemType) >= quantity;
    }
    
    // Get item icon path
    getItemIcon(itemType) {
        // Return placeholder class instead of image path
        return `item-placeholder ${itemType}`;
    }
    
    // Get item display name
    getItemName(itemType) {
        const nameMap = {
            wood: 'Wood',
            stone: 'Stone',
            seeds: 'Seeds',
            food: 'Food',
            tools: 'Tools',
            materials: 'Materials',
            coins: 'Coins',
            gems: 'Gems'
        };
        return nameMap[itemType] || 'Unknown Item';
    }
    
    // Get item description
    getItemDescription(itemType) {
        const descMap = {
            wood: 'Basic building material',
            stone: 'Strong construction material',
            seeds: 'Plant these to grow crops',
            food: 'Restores health and energy',
            tools: 'Helps with construction',
            materials: 'Various crafting materials',
            coins: 'Currency for trading',
            gems: 'Valuable precious stones'
        };
        return descMap[itemType] || 'A mysterious item';
    }
    
    // Toggle inventory visibility
    toggle() {
        console.log('=== INVENTORY TOGGLE CALLED ===');
        console.log('Current isOpen state:', this.isOpen);
        
        this.isOpen = !this.isOpen;
        console.log('New isOpen state:', this.isOpen);
        
        this.render();
    }
    
    // Open inventory
    open() {
        this.isOpen = true;
        this.render();
    }
    
    // Close inventory
    close() {
        this.isOpen = false;
        this.hideInventoryPanel();
    }
    
    // Render inventory panel
    render() {
        console.log('=== INVENTORY RENDER CALLED ===');
        console.log('isOpen:', this.isOpen);
        
        if (this.isOpen) {
            console.log('Calling showInventoryPanel...');
            this.showInventoryPanel();
        } else {
            console.log('Calling hideInventoryPanel...');
            this.hideInventoryPanel();
        }
    }
    
    // Show inventory panel
    showInventoryPanel() {
        console.log('=== SHOWING INVENTORY PANEL ===');
        
        // Create modal overlay
        let modalOverlay = document.getElementById('modal-overlay');
        if (!modalOverlay) {
            console.log('Creating modal overlay...');
            modalOverlay = document.createElement('div');
            modalOverlay.id = 'modal-overlay';
            modalOverlay.className = 'modal-overlay';
            document.body.appendChild(modalOverlay);
            console.log('Modal overlay created');
        } else {
            console.log('Modal overlay already exists');
        }
        
        let inventoryPanel = document.getElementById('inventory-panel');
        
        if (!inventoryPanel) {
            console.log('Creating inventory panel...');
            inventoryPanel = document.createElement('div');
            inventoryPanel.id = 'inventory-panel';
            inventoryPanel.className = 'inventory-panel';
            document.body.appendChild(inventoryPanel);
            console.log('Inventory panel created');
        } else {
            console.log('Inventory panel already exists');
        }
        
        // Generate inventory HTML
        let inventoryHTML = `
            <div class="inventory-header">
                <h3>Inventory</h3>
                <button id="close-inventory" class="close-btn">×</button>
            </div>
            <div class="inventory-grid">
        `;
        
        // Create inventory slots
        for (let i = 0; i < this.maxSlots; i++) {
            const item = this.items[i];
            const slotClass = item ? 'inventory-slot filled' : 'inventory-slot empty';
            const slotId = `slot-${i}`;
            
            inventoryHTML += `
                <div class="${slotClass}" id="${slotId}" data-slot="${i}">
                    ${item ? `
                        <div class="${item.icon}" title="${item.name}">${item.name.charAt(0).toUpperCase()}</div>
                        <span class="item-quantity">${item.quantity}</span>
                        <div class="item-tooltip">
                            <strong>${item.name}</strong><br>
                            ${item.description}<br>
                            Quantity: ${item.quantity}
                        </div>
                    ` : ''}
                </div>
            `;
        }
        
        inventoryHTML += `
            </div>
            <div class="inventory-info">
                <div class="selected-item-info">
                    <span id="selected-item-name">Select an item</span>
                    <span id="selected-item-desc"></span>
                </div>
                <div class="inventory-actions">
                    <button id="use-item-btn" class="inventory-action-btn">Use</button>
                    <button id="drop-item-btn" class="inventory-action-btn">Drop</button>
                </div>
            </div>
        `;
        
        inventoryPanel.innerHTML = inventoryHTML;
        
        // Show modal overlay and panel
        console.log('Showing modal overlay and panel...');
        modalOverlay.style.display = 'block';
        inventoryPanel.style.display = 'block';
        
        // Add animation class after a small delay
        setTimeout(() => {
            inventoryPanel.classList.add('show');
        }, 10);
        
        console.log('Modal overlay display:', modalOverlay.style.display);
        console.log('Inventory panel display:', inventoryPanel.style.display);
        
        // Add event listeners
        this.addInventoryEventListeners();
        console.log('=== INVENTORY PANEL SHOWN ===');
    }
    
    // Hide inventory panel
    hideInventoryPanel() {
        const inventoryPanel = document.getElementById('inventory-panel');
        const modalOverlay = document.getElementById('modal-overlay');
        
        if (inventoryPanel) {
            // Remove animation class first
            inventoryPanel.classList.remove('show');
            
            // Hide after animation completes
            setTimeout(() => {
                inventoryPanel.style.display = 'none';
            }, 300);
        }
        
        if (modalOverlay) {
            modalOverlay.style.display = 'none';
        }
    }
    
    // Add event listeners for inventory
    addInventoryEventListeners() {
        // Close button
        document.getElementById('close-inventory').addEventListener('click', () => {
            this.close();
        });
        
        // Modal overlay click to close
        const modalOverlay = document.getElementById('modal-overlay');
        if (modalOverlay) {
            modalOverlay.addEventListener('click', () => {
                this.close();
            });
        }
        
        // Use item button
        document.getElementById('use-item-btn').addEventListener('click', () => {
            this.useSelectedItem();
        });
        
        // Drop item button
        document.getElementById('drop-item-btn').addEventListener('click', () => {
            this.dropSelectedItem();
        });
        
        // Slot clicks
        for (let i = 0; i < this.maxSlots; i++) {
            const slot = document.getElementById(`slot-${i}`);
            if (slot) {
                slot.addEventListener('click', () => {
                    this.selectSlot(i);
                });
                
                slot.addEventListener('mouseenter', () => {
                    this.showItemTooltip(i);
                });
                
                slot.addEventListener('mouseleave', () => {
                    this.hideItemTooltip();
                });
            }
        }
    }
    
    // Select inventory slot
    selectSlot(slotIndex) {
        this.selectedSlot = slotIndex;
        const item = this.items[slotIndex];
        
        // Update selected item info
        const nameElement = document.getElementById('selected-item-name');
        const descElement = document.getElementById('selected-item-desc');
        
        if (item) {
            nameElement.textContent = item.name;
            descElement.textContent = item.description;
        } else {
            nameElement.textContent = 'Empty slot';
            descElement.textContent = '';
        }
        
        // Update visual selection
        document.querySelectorAll('.inventory-slot').forEach(slot => {
            slot.classList.remove('selected');
        });
        document.getElementById(`slot-${slotIndex}`).classList.add('selected');
    }
    
    // Show item tooltip
    showItemTooltip(slotIndex) {
        const item = this.items[slotIndex];
        if (item) {
            const tooltip = document.querySelector(`#slot-${slotIndex} .item-tooltip`);
            if (tooltip) {
                tooltip.style.display = 'block';
            }
        }
    }
    
    // Hide item tooltip
    hideItemTooltip() {
        document.querySelectorAll('.item-tooltip').forEach(tooltip => {
            tooltip.style.display = 'none';
        });
    }
    
    // Get selected item
    getSelectedItem() {
        return this.items[this.selectedSlot];
    }
    
    // Use selected item
    useSelectedItem() {
        const item = this.getSelectedItem();
        if (item) {
            console.log(`Using item: ${item.name}`);
            // TODO: Implement item usage logic
            return true;
        }
        return false;
    }
    
    // Drop selected item
    dropSelectedItem() {
        const item = this.getSelectedItem();
        if (item) {
            this.removeItem(item.type, 1);
            this.render(); // Refresh display
            console.log(`Dropped item: ${item.name}`);
            return true;
        }
        return false;
    }
}