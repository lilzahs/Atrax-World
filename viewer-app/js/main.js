// Viewer App - Main Controller
class ViewerApp {
    constructor() {
        this.currentStream = null;
        this.walletManager = null;
        this.streamList = null;
        this.streamPlayer = null;
        this.donationPanel = null;
        this.historyPanel = null;
        
        this.init();
    }
    
    init() {
        console.log('Initializing Viewer App...');
        
        // Initialize components
        this.walletManager = new WalletConnect();
        this.streamList = new StreamList();
        this.streamPlayer = new StreamPlayer();
        this.donationPanel = new DonationPanel();
        this.historyPanel = new HistoryPanel();
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Load initial data
        this.loadStreams();
        
        console.log('Viewer App initialized successfully!');
    }
    
    setupEventListeners() {
        // Bottom navigation
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const section = e.currentTarget.dataset.section;
                this.switchSection(section);
            });
        });
        
        // Wallet status click
        document.getElementById('wallet-status').addEventListener('click', () => {
            this.showWalletModal();
        });
        
        // Refresh streams
        document.getElementById('refresh-streams').addEventListener('click', () => {
            this.loadStreams();
        });
        
        // Back to list
        document.getElementById('back-to-list').addEventListener('click', () => {
            this.switchSection('stream-list');
        });
        
        // Modal close buttons
        document.getElementById('close-success-modal').addEventListener('click', () => {
            this.hideModal('donation-success-modal');
        });
        
        document.getElementById('close-history-modal').addEventListener('click', () => {
            this.hideModal('history-modal');
        });
    }
    
    switchSection(sectionName) {
        // Update navigation
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-section="${sectionName}"]`).classList.add('active');
        
        // Show/hide sections
        document.querySelectorAll('section').forEach(section => {
            section.classList.remove('active');
        });
        
        switch(sectionName) {
            case 'stream-list':
                document.getElementById('stream-list-section').classList.add('active');
                break;
            case 'donation':
                document.getElementById('donation-section').classList.add('active');
                break;
            case 'history':
                this.showHistoryModal();
                break;
            case 'wallet':
                this.showWalletModal();
                break;
        }
    }
    
    loadStreams() {
        console.log('Loading streams...');
        
        // Mock data for now
        const mockStreams = [
            {
                id: 'stream1',
                title: 'Building My Dream Village!',
                streamer: 'AtraxBuilder',
                description: 'Come watch me build the most amazing village in Atrax World!',
                viewerCount: 42,
                donationTotal: 2.5,
                thumbnail: 'https://via.placeholder.com/300x200',
                youtubeId: 'dQw4w9WgXcQ' // Rick Roll for demo
            },
            {
                id: 'stream2',
                title: 'Epic Castle Construction',
                streamer: 'CastleMaster',
                description: 'Building the biggest castle ever seen in Atrax World!',
                viewerCount: 28,
                donationTotal: 1.8,
                thumbnail: 'https://via.placeholder.com/300x200',
                youtubeId: 'dQw4w9WgXcQ'
            }
        ];
        
        this.streamList.render(mockStreams);
    }
    
    selectStream(stream) {
        console.log('Selecting stream:', stream);
        this.currentStream = stream;
        
        // Update stream player
        this.streamPlayer.loadStream(stream);
        
        // Switch to stream view
        document.getElementById('stream-list-section').classList.remove('active');
        document.getElementById('stream-player-section').classList.add('active');
        
        // Update stream info
        document.getElementById('current-stream-title').textContent = stream.title;
        document.getElementById('streamer-name').textContent = stream.streamer;
        document.getElementById('stream-description').textContent = stream.description;
        document.getElementById('viewer-count').textContent = `👥 ${stream.viewerCount} viewers`;
        document.getElementById('donation-total').textContent = `💰 ${stream.donationTotal} SOL donated`;
    }
    
    showWalletModal() {
        this.showModal('wallet-modal');
    }
    
    showHistoryModal() {
        this.historyPanel.loadHistory();
        this.showModal('history-modal');
    }
    
    showModal(modalId) {
        document.getElementById(modalId).style.display = 'flex';
    }
    
    hideModal(modalId) {
        document.getElementById(modalId).style.display = 'none';
    }
    
    // Wallet connection callback
    onWalletConnected(walletInfo) {
        console.log('Wallet connected:', walletInfo);
        
        // Update UI
        document.getElementById('wallet-indicator').classList.add('connected');
        document.getElementById('wallet-address').textContent = 
            `${walletInfo.publicKey.slice(0, 4)}...${walletInfo.publicKey.slice(-4)}`;
        
        this.hideModal('wallet-modal');
    }
    
    // Donation callback
    onDonationSent(donationInfo) {
        console.log('Donation sent:', donationInfo);
        
        // Show success modal
        document.getElementById('donation-success-message').textContent = 
            `Donated ${donationInfo.amount} SOL to ${donationInfo.streamer}!`;
        this.showModal('donation-success-modal');
        
        // Update stream stats
        if (this.currentStream) {
            this.currentStream.donationTotal += donationInfo.amount;
            document.getElementById('donation-total').textContent = 
                `�� ${this.currentStream.donationTotal} SOL donated`;
        }
    }
}

// Initialize app when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.viewerApp = new ViewerApp();
});