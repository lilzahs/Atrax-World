// StreamList - Display and manage live streams
class StreamList {
    constructor() {
        this.streams = [];
        this.currentFilter = 'all';
    }
    
    render(streams) {
        console.log('Rendering stream list:', streams);
        this.streams = streams;
        
        const streamListElement = document.getElementById('stream-list');
        if (!streamListElement) return;
        
        if (streams.length === 0) {
            streamListElement.innerHTML = `
                <div class="no-streams">
                    <h3>�� No Live Streams</h3>
                    <p>No streamers are currently live. Check back later!</p>
                </div>
            `;
            return;
        }
        
        const streamsHTML = streams.map(stream => `
            <div class="stream-card" data-stream-id="${stream.id}">
                <div class="stream-thumbnail">
                    <img src="${stream.thumbnail}" alt="${stream.title}" onerror="this.src='https://via.placeholder.com/300x200'">
                    <div class="stream-overlay">
                        <span class="live-indicator">🔴 LIVE</span>
                        <span class="viewer-count">👥 ${stream.viewerCount}</span>
                    </div>
                </div>
                <div class="stream-info">
                    <h3>${stream.title}</h3>
                    <p class="streamer-name">by ${stream.streamer}</p>
                    <p class="stream-description">${stream.description}</p>
                    <div class="stream-stats">
                        <span class="donation-total">�� ${stream.donationTotal} SOL</span>
                        <span class="stream-duration">⏱️ 2h 15m</span>
                    </div>
                </div>
            </div>
        `).join('');
        
        streamListElement.innerHTML = streamsHTML;
        
        // Add click event listeners
        document.querySelectorAll('.stream-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const streamId = e.currentTarget.dataset.streamId;
                const stream = streams.find(s => s.id === streamId);
                if (stream && window.viewerApp) {
                    window.viewerApp.selectStream(stream);
                }
            });
        });
    }
    
    filterStreams(filter) {
        this.currentFilter = filter;
        
        let filteredStreams = this.streams;
        
        switch (filter) {
            case 'popular':
                filteredStreams = this.streams.sort((a, b) => b.viewerCount - a.viewerCount);
                break;
            case 'donations':
                filteredStreams = this.streams.sort((a, b) => b.donationTotal - a.donationTotal);
                break;
            case 'recent':
                filteredStreams = this.streams.sort((a, b) => new Date(b.startTime) - new Date(a.startTime));
                break;
        }
        
        this.render(filteredStreams);
    }
    
    addStream(stream) {
        this.streams.unshift(stream);
        this.render(this.streams);
    }
    
    removeStream(streamId) {
        this.streams = this.streams.filter(s => s.id !== streamId);
        this.render(this.streams);
    }
    
    updateStreamStats(streamId, stats) {
        const stream = this.streams.find(s => s.id === streamId);
        if (stream) {
            stream.viewerCount = stats.viewerCount;
            stream.donationTotal = stats.donationTotal;
            this.render(this.streams);
        }
    }
}