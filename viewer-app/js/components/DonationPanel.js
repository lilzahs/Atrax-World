// DonationPanel - Handle donations to streamers
class DonationPanel {
    constructor() {
        this.currentAmount = 0;
        this.donationMessage = '';
        this.isProcessing = false;
        
        this.init();
    }
    
    init() {
        console.log('DonationPanel initialized');
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        // Donation amount buttons
        document.querySelectorAll('.donation-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const amount = parseFloat(e.currentTarget.dataset.amount);
                this.selectAmount(amount);
            });
        });
        
        // Custom donation
        document.getElementById('custom-donate-btn').addEventListener('click', () => {
            const amount = parseFloat(document.getElementById('custom-amount').value);
            if (amount > 0) {
                this.selectAmount(amount);
            }
        });
        
        // Donation message
        document.getElementById('donation-message').addEventListener('input', (e) => {
            this.donationMessage = e.target.value;
        });
    }
    
    selectAmount(amount) {
        console.log('Selected donation amount:', amount);
        this.currentAmount = amount;
        
        // Update UI
        document.querySelectorAll('.donation-btn').forEach(btn => {
            btn.classList.remove('selected');
        });
        
        // Highlight selected button
        const selectedBtn = document.querySelector(`[data-amount="${amount}"]`);
        if (selectedBtn) {
            selectedBtn.classList.add('selected');
        }
        
        // Update custom amount input
        document.getElementById('custom-amount').value = amount;
        
        // Show donation confirmation
        this.showDonationConfirmation(amount);
    }
    
    showDonationConfirmation(amount) {
        const message = this.donationMessage || 'Thank you for the stream!';
        
        const confirmed = confirm(`
Donation Details:
Amount: ${amount} SOL
Message: "${message}"

Do you want to proceed with this donation?
        `);
        
        if (confirmed) {
            this.processDonation(amount, message);
        }
    }
    
    async processDonation(amount, message) {
        if (this.isProcessing) {
            console.log('Donation already processing...');
            return;
        }
        
        this.isProcessing = true;
        console.log('Processing donation:', { amount, message });
        
        try {
            // Check if wallet is connected
            if (!window.viewerApp || !window.viewerApp.walletManager || !window.viewerApp.walletManager.isConnected) {
                alert('Please connect your wallet first!');
                this.isProcessing = false;
                return;
            }
            
            // Check balance
            const walletInfo = window.viewerApp.walletManager.getWalletInfo();
            if (walletInfo.balance < amount) {
                alert('Insufficient balance!');
                this.isProcessing = false;
                return;
            }
            
            // Create donation transaction
            const donationData = {
                amount: amount,
                message: message,
                streamer: window.viewerApp.currentStream?.streamer || 'Unknown',
                streamId: window.viewerApp.currentStream?.id || 'unknown',
                timestamp: new Date().toISOString()
            };
            
            // Simulate transaction (replace with actual Solana transaction)
            const success = await this.sendDonationTransaction(donationData);
            
            if (success) {
                console.log('Donation successful:', donationData);
                
                // Notify app
                if (window.viewerApp) {
                    window.viewerApp.onDonationSent(donationData);
                }
                
                // Save to history
                this.saveDonationToHistory(donationData);
                
                // Reset form
                this.resetForm();
            } else {
                throw new Error('Transaction failed');
            }
            
        } catch (error) {
            console.error('Donation failed:', error);
            alert(`Donation failed: ${error.message}`);
        } finally {
            this.isProcessing = false;
        }
    }
    
    async sendDonationTransaction(donationData) {
        // Simulate transaction delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // In real implementation, this would:
        // 1. Create Solana transaction
        // 2. Send to smart contract
        // 3. Wait for confirmation
        // 4. Return success/failure
        
        console.log('Simulating donation transaction:', donationData);
        
        // Simulate 90% success rate
        return Math.random() > 0.1;
    }
    
    saveDonationToHistory(donationData) {
        // Get existing history
        let history = JSON.parse(localStorage.getItem('donationHistory') || '[]');
        
        // Add new donation
        history.unshift(donationData);
        
        // Keep only last 50 donations
        history = history.slice(0, 50);
        
        // Save back to localStorage
        localStorage.setItem('donationHistory', JSON.stringify(history));
        
        console.log('Donation saved to history');
    }
    
    resetForm() {
        this.currentAmount = 0;
        this.donationMessage = '';
        
        // Reset UI
        document.querySelectorAll('.donation-btn').forEach(btn => {
            btn.classList.remove('selected');
        });
        
        document.getElementById('custom-amount').value = '';
        document.getElementById('donation-message').value = '';
    }
    
    getDonationHistory() {
        return JSON.parse(localStorage.getItem('donationHistory') || '[]');
    }
}