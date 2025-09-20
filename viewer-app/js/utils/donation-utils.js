// Donation Utils - Helper functions for donations
class DonationUtils {
    static formatAmount(amount) {
        return `${amount.toFixed(4)} SOL`;
    }
    
    static formatUSD(amount, solPrice = 100) {
        const usdAmount = amount * solPrice;
        return `$${usdAmount.toFixed(2)} USD`;
    }
    
    static validateAmount(amount) {
        if (typeof amount !== 'number' || isNaN(amount)) {
            return { valid: false, error: 'Amount must be a number' };
        }
        
        if (amount <= 0) {
            return { valid: false, error: 'Amount must be greater than 0' };
        }
        
        if (amount < 0.001) {
            return { valid: false, error: 'Minimum donation is 0.001 SOL' };
        }
        
        if (amount > 100) {
            return { valid: false, error: 'Maximum donation is 100 SOL' };
        }
        
        return { valid: true };
    }
    
    static validateMessage(message) {
        if (message.length > 200) {
            return { valid: false, error: 'Message too long (max 200 characters)' };
        }
        
        // Check for inappropriate content (basic check)
        const inappropriateWords = ['spam', 'scam', 'hack'];
        const lowerMessage = message.toLowerCase();
        
        for (const word of inappropriateWords) {
            if (lowerMessage.includes(word)) {
                return { valid: false, error: 'Message contains inappropriate content' };
            }
        }
        
        return { valid: true };
    }
    
    static generateDonationId() {
        return 'donation_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    static calculateDonationFee(amount, feeRate = 0.05) {
        return amount * feeRate;
    }
    
    static getDonationTiers() {
        return [
            { amount: 0.01, name: 'Supporter', color: '#3498db' },
            { amount: 0.05, name: 'Fan', color: '#9b59b6' },
            { amount: 0.1, name: 'Super Fan', color: '#e74c3c' },
            { amount: 0.5, name: 'VIP', color: '#f39c12' },
            { amount: 1.0, name: 'Legend', color: '#e67e22' }
        ];
    }
    
    static getTierForAmount(amount) {
        const tiers = this.getDonationTiers();
        return tiers.find(tier => amount >= tier.amount) || tiers[0];
    }
}