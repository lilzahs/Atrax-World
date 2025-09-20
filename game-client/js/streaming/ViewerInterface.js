// ViewerInterface - Giao diện cho viewers xem stream và donate
class ViewerInterface {
    constructor(walletManager, smartContractManager) {
        this.walletManager = walletManager;
        this.smartContractManager = smartContractManager;
        this.isOpen = false;
        this.currentStream = null;
        this.donationAmount = 0.01; // Default donation amount
        
        this.init();
    }
    
    init() {
        console.log('Initializing ViewerInterface...');
    }
    
    // Show viewer interface
    show() {
        this.isOpen = true;
        this.render();
    }
    
    // Hide viewer interface
    hide() {
        this.isOpen = false;
        this.hideViewerPanel();
    }
    
    // Toggle viewer interface
    toggle() {
        if (this.isOpen) {
            this.hide();
        } else {
            this.show();
        }
    }
    
    // Render viewer interface
    render() {
        if (this.isOpen) {
            this.showViewerPanel();
        } else {
            this.hideViewerPanel();
        }
    }
    
    // Show viewer panel
    showViewerPanel() {
        let viewerPanel = document.getElementById('viewer-panel');
        
        if (!viewerPanel) {
            viewerPanel = document.createElement('div');
            viewerPanel.id = 'viewer-panel';
            viewerPanel.className = 'viewer-panel';
            document.body.appendChild(viewerPanel);
        }
        
        // Generate viewer HTML
        let viewerHTML = `
            <div class="viewer-header">
                <h3>Atrax World - Viewer Interface</h3>
                <button id="close-viewer" class="close-btn">×</button>
            </div>
            <div class="viewer-content">
                <div class="stream-section">
                    <h4>Live Stream</h4>
                    <div class="stream-container">
                        ${this.currentStream ? `
                            <iframe 
                                src="${this.getStreamEmbedUrl()}" 
                                frameborder="0" 
                                allowfullscreen>
                            </iframe>
                            <div class="stream-info">
                                <h5>${this.currentStream.title}</h5>
                                <p>Streamer: ${this.walletManager.shortenAddress(this.currentStream.streamer)}</p>
                            </div>
                        ` : `
                            <div class="no-stream">
                                <p>No active stream</p>
                            </div>
                        `}
                    </div>
                </div>
                
                <div class="donation-section">
                    <h4>Support Streamer</h4>
                    <div class="donation-form">
                        <div class="donation-amount">
                            <label>Donation Amount (SOL):</label>
                            <input type="number" id="donation-amount" value="${this.donationAmount}" min="0.001" step="0.001">
                        </div>
                        <div class="donation-message">
                            <label>Message (optional):</label>
                            <textarea id="donation-message" placeholder="Leave a message for the streamer..."></textarea>
                        </div>
                        <button id="donate-btn" class="donate-btn" ${!this.currentStream ? 'disabled' : ''}>
                            Donate ${this.donationAmount} SOL
                        </button>
                    </div>
                </div>
                
                <div class="streamer-info">
                    <h4>Streamer Information</h4>
                    <div class="streamer-details">
                        ${this.currentStream ? `
                            <p><strong>Address:</strong> ${this.currentStream.streamer}</p>
                            <p><strong>Streaming Since:</strong> ${new Date(this.currentStream.startTime).toLocaleString()}</p>
                            <p><strong>Viewers:</strong> ${this.getViewerCount()}</p>
                        ` : `
                            <p>No streamer information available</p>
                        `}
                    </div>
                </div>
            </div>
        `;
        
        viewerPanel.innerHTML = viewerHTML;
        
        // Add event listeners
        this.addViewerEventListeners();
    }
    
    // Hide viewer panel
    hideViewerPanel() {
        const viewerPanel = document.getElementById('viewer-panel');
        if (viewerPanel) {
            viewerPanel.remove();
        }
    }
    
    // Add event listeners for viewer interface
    addViewerEventListeners() {
        // Close button
        document.getElementById('close-viewer').addEventListener('click', () => {
            this.hide();
        });
        
        // Donation amount input
        document.getElementById('donation-amount').addEventListener('input', (e) => {
            this.donationAmount = parseFloat(e.target.value) || 0.01;
            document.getElementById('donate-btn').textContent = `Donate ${this.donationAmount} SOL`;
        });
        
        // Donate button
        document.getElementById('donate-btn').addEventListener('click', () => {
            this.processDonation();
        });
    }
    
    // Process donation
    async processDonation() {
        if (!this.currentStream) {
            alert('No active stream to donate to');
            return;
        }
        
        if (!this.walletManager.isConnected) {
            alert('Please connect your wallet first');
            return;
        }
        
        if (this.donationAmount <= 0) {
            alert('Please enter a valid donation amount');
            return;
        }
        
        try {
            const message = document.getElementById('donation-message').value;
            
            console.log(`Donating ${this.donationAmount} SOL to streamer: ${this.currentStream.streamer}`);
            
            const result = await this.smartContractManager.donateToStreamer(
                this.currentStream.streamer,
                this.donationAmount
            );
            
            if (result.success) {
                alert(`Donation successful! Transaction: ${result.transactionId}`);
                console.log('Donation result:', result);
                
                // Clear form
                document.getElementById('donation-message').value = '';
                this.donationAmount = 0.01;
                document.getElementById('donation-amount').value = this.donationAmount;
                document.getElementById('donate-btn').textContent = `Donate ${this.donationAmount} SOL`;
            }
            
        } catch (error) {
            console.error('Donation failed:', error);
            alert(`Donation failed: ${error.message}`);
        }
    }
    
    // Set current stream
    setCurrentStream(stream) {
        this.currentStream = stream;
        if (this.isOpen) {
            this.render();
        }
    }
    
    // Get stream embed URL
    getStreamEmbedUrl() {
        if (this.currentStream && this.currentStream.videoId) {
            return `https://www.youtube.com/embed/${this.currentStream.videoId}`;
        }
        return null;
    }
    
    // Get viewer count (simulated)
    getViewerCount() {
        return Math.floor(Math.random() * 100) + 10; // Simulated viewer count
    }
}