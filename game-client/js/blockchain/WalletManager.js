// WalletManager - Solana wallet integration
class WalletManager {
    constructor() {
        console.log('WalletManager constructor called');
        
        this.connectedWallet = null;
        this.walletType = null;
        this.publicKey = null;
        this.balance = 0;
        this.isConnected = false;
        
        console.log('WalletManager initialized');
    }
    
    // Check wallet availability
    checkWalletAvailability() {
        const availableWallets = [];
        
        console.log('Checking wallet availability...');
        console.log('window.solana:', window.solana);
        console.log('window.glow:', window.glow);
        console.log('window.solflare:', window.solflare);
        console.log('window.ethereum:', window.ethereum);
        
        // Check Phantom with better detection
        if (window.solana && (window.solana.isPhantom || window.solana._isPhantom)) {
            availableWallets.push('phantom');
            console.log('Phantom wallet detected');
        } else if (window.solana) {
            console.log('window.solana exists but isPhantom is false:', window.solana);
        }
        
        // Check Glow
        if (window.glow) {
            availableWallets.push('glow');
            console.log('Glow wallet detected');
        }
        
        // Check Solflare
        if (window.solflare) {
            availableWallets.push('solflare');
            console.log('Solflare wallet detected');
        }
        
        // Check MetaMask
        if (window.ethereum) {
            availableWallets.push('metamask');
            console.log('MetaMask wallet detected');
        }
        
        console.log('Available wallets:', availableWallets);
        return availableWallets;
    }
    
    // Wait for wallet to load
    async waitForWallet(walletType, maxRetries = 10) {
        for (let i = 0; i < maxRetries; i++) {
            console.log(`Waiting for ${walletType} wallet... attempt ${i + 1}`);
            
            if (walletType === 'phantom' && window.solana && (window.solana.isPhantom || window.solana._isPhantom)) {
                console.log('Phantom wallet found!');
                return true;
            }
            
            if (walletType === 'glow' && window.glow) {
                console.log('Glow wallet found!');
                return true;
            }
            
            if (walletType === 'solflare' && window.solflare) {
                console.log('Solflare wallet found!');
                return true;
            }
            
            if (walletType === 'metamask' && window.ethereum) {
                console.log('MetaMask wallet found!');
                return true;
            }
            
            // Wait 500ms before next attempt
            await new Promise(resolve => setTimeout(resolve, 500));
        }
        
        return false;
    }
    
    // Connect to wallet
    async connectWallet(walletType) {
        console.log(`Connecting to ${walletType} wallet...`);
        
        try {
            // Wait for wallet to be available
            const walletAvailable = await this.waitForWallet(walletType);
            if (!walletAvailable) {
                throw new Error(`${walletType} wallet not available`);
            }
            
            let wallet = null;
            
            switch (walletType) {
                case 'phantom':
                    wallet = window.solana;
                    break;
                case 'glow':
                    wallet = window.glow;
                    break;
                case 'solflare':
                    wallet = window.solflare;
                    break;
                case 'metamask':
                    wallet = window.ethereum;
                    break;
                default:
                    throw new Error(`Unsupported wallet type: ${walletType}`);
            }
            
            if (!wallet) {
                throw new Error(`${walletType} wallet not found`);
            }
            
            // Connect to wallet
            const response = await wallet.connect();
            
            if (response && response.publicKey) {
                this.connectedWallet = wallet;
                this.walletType = walletType;
                this.publicKey = response.publicKey.toString();
                this.isConnected = true;
                
                // Get balance
                await this.updateBalance();
                
                console.log('Wallet connected successfully:', {
                    walletType,
                    publicKey: this.publicKey,
                    balance: this.balance
                });
                
                return {
                    success: true,
                    walletType,
                    publicKey: this.publicKey,
                    balance: this.balance
                };
            } else {
                throw new Error('Failed to get public key from wallet');
            }
            
        } catch (error) {
            console.error('Wallet connection failed:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }
    
    // Update wallet balance
    async updateBalance() {
        if (!this.connectedWallet || !this.publicKey) {
            return;
        }
        
        try {
            // For Solana wallets
            if (this.walletType === 'phantom' || this.walletType === 'glow' || this.walletType === 'solflare') {
                const { Connection, PublicKey } = await import('@solana/web3.js');
                const connection = new Connection('https://api.devnet.solana.com');
                const publicKey = new PublicKey(this.publicKey);
                const balance = await connection.getBalance(publicKey);
                this.balance = balance / 1000000000; // Convert lamports to SOL
            }
            // For MetaMask
            else if (this.walletType === 'metamask') {
                const balance = await this.connectedWallet.request({
                    method: 'eth_getBalance',
                    params: [this.publicKey, 'latest']
                });
                this.balance = parseInt(balance, 16) / 1000000000000000000; // Convert wei to ETH
            }
        } catch (error) {
            console.error('Failed to update balance:', error);
        }
    }
    
    // Get wallet info
    getWalletInfo() {
        return {
            isConnected: this.isConnected,
            walletType: this.walletType,
            publicKey: this.publicKey,
            balance: this.balance
        };
    }
    
    // Send transaction
    async sendTransaction(transaction) {
        if (!this.connectedWallet || !this.isConnected) {
            throw new Error('Wallet not connected');
        }
        
        try {
            const signature = await this.connectedWallet.sendTransaction(transaction);
            return signature;
        } catch (error) {
            console.error('Transaction failed:', error);
            throw error;
        }
    }
    
    // Disconnect wallet
    disconnect() {
        this.connectedWallet = null;
        this.walletType = null;
        this.publicKey = null;
        this.balance = 0;
        this.isConnected = false;
        
        console.log('Wallet disconnected');
    }
    
    // Get connection status
    getConnectionStatus() {
        return this.isConnected;
    }
    
    // Format balance for display
    formatBalance(balance) {
        return balance.toFixed(4);
    }
    
    // Shorten address for display
    shortenAddress(address) {
        if (!address) return '';
        return `${address.slice(0, 4)}...${address.slice(-4)}`;
    }
}
