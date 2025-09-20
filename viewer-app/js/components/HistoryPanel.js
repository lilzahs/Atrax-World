// HistoryPanel - Display donation history
class HistoryPanel {
    constructor() {
        this.history = [];
    }
    
    loadHistory() {
        console.log('Loading donation history...');
        
        // Get history from localStorage
        this.history = JSON.parse(localStorage.getItem('donationHistory') || '[]');
        
        this.render();
    }
    
    render() {
        const historyElement = document.getElementById('donation-history');
        if (!historyElement) return;
        
        if (this.history.length === 0) {
            historyElement.innerHTML = `
                <div class="no-history">
                    <h3>📜 No Donations Yet</h3>
                    <p>Your donation history will appear here once you start supporting streamers!</p>
                </div>
            `;
            return;
        }
        
        const historyHTML = this.history.map(donation => `
            <div class="history-item">
                <div class="history-header">
                    <h4>💰 ${donation.amount} SOL</h4>
                    <span class="history-date">${this.formatDate(donation.timestamp)}</span>
                </div>
                <div class="history-details">
                    <p><strong>To:</strong> ${donation.streamer}</p>
                    ${donation.message ? `<p><strong>Message:</strong> "${donation.message}"</p>` : ''}
                    <p><strong>Stream:</strong> ${donation.streamId}</p>
                </div>
            </div>
        `).join('');
        
        historyElement.innerHTML = historyHTML;
    }
    
    formatDate(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);
        
        if (diffMins < 1) {
            return 'Just now';
        } else if (diffMins < 60) {
            return `${diffMins}m ago`;
        } else if (diffHours < 24) {
            return `${diffHours}h ago`;
        } else if (diffDays < 7) {
            return `${diffDays}d ago`;
        } else {
            return date.toLocaleDateString();
        }
    }
    
    addDonation(donation) {
        this.history.unshift(donation);
        this.render();
    }
    
    clearHistory() {
        if (confirm('Are you sure you want to clear all donation history?')) {
            localStorage.removeItem('donationHistory');
            this.history = [];
            this.render();
        }
    }
    
    getTotalDonated() {
        return this.history.reduce((total, donation) => total + donation.amount, 0);
    }
    
    getDonationCount() {
        return this.history.length;
    }
    
    getTopStreamer() {
        const streamerCounts = {};
        this.history.forEach(donation => {
            streamerCounts[donation.streamer] = (streamerCounts[donation.streamer] || 0) + 1;
        });
        
        return Object.keys(streamerCounts).reduce((a, b) => 
            streamerCounts[a] > streamerCounts[b] ? a : b, null);
    }
}