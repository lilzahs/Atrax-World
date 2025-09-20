// WalletConnect - Mobile wallet integration for viewers
class WalletConnect {
    constructor() {
        this.connectedWallet = null;
        this.walletType = null;
        this.publicKey = null;
        this.balance = 0;
        this.isConnected = false;
        
        this.init();
    }
    
    init() {
        console.log('WalletConnect initialized');
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        // Wallet modal buttons
        document.getElementById('phantom-btn').addEventListener('click', () => {
            this.connectWallet('phantom');
        });
        
        document.getElementById('solflare-btn').addEventListener('click', () => {
            this.connectWallet('solflare');
        });
        
        document.getElementById('glow-btn').addEventListener('click', () => {
            this.connectWallet('glow');
        });
    }
    
    async connectWallet(walletType) {
        console.log(`Connecting to ${walletType} wallet...`);
        
        try {
            let wallet = null;
            
            switch (walletType) {
                case 'phantom':
                    if (window.solana && window.solana.isPhantom) {
                        wallet = window.solana;
                    } else {
                        throw new Error('Phantom wallet not found');
                    }
                    break;
                case 'solflare':
                    if (window.solflare) {
                        wallet = window.solflare;
                    } else {
                        throw new Error('Solflare wallet not found');
                    }
                    break;
                case 'glow':
                    if (window.glow) {
                        wallet = window.glow;
                    } else {
                        throw new Error('Glow wallet not found');
                    }
                    break;
                default:
                    throw new Error(`Unsupported wallet type: ${walletType}`);
            }
            
            if (!wallet) {
                throw new Error(`${walletType} wallet not available`);
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
                
                // Notify app
                if (window.viewerApp) {
                    window.viewerApp.onWalletConnected({
                        walletType,
                        publicKey: this.publicKey,
                        balance: this.balance
                    });
                }
                
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
            alert(`Wallet connection failed: ${error.message}`);
            return {
                success: false,
                error: error.message
            };
        }
    }
    
    async updateBalance() {
        if (!this.connectedWallet || !this.publicKey) {
            return;
        }
        
        try {
            const { Connection, PublicKey } = await import('@solana/web3.js');
            const connection = new Connection('https://api.devnet.solana.com');
            const publicKey = new PublicKey(this.publicKey);
            const balance = await connection.getBalance(publicKey);
            this.balance = balance / 1000000000; // Convert lamports to SOL
        } catch (error) {
            console.error('Failed to update balance:', error);
        }
    }
    
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
    
    disconnect() {
        this.connectedWallet = null;
        this.walletType = null;
        this.publicKey = null;
        this.balance = 0;
        this.isConnected = false;
        
        console.log('Wallet disconnected');
    }
    
    getWalletInfo() {
        return {
            isConnected: this.isConnected,
            walletType: this.walletType,
            publicKey: this.publicKey,
            balance: this.balance
        };
    }
}