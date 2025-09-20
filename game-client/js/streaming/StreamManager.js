// StreamManager - Quản lý streaming và YouTube integration
class StreamManager {
    constructor(walletManager, smartContractManager) {
        this.walletManager = walletManager;
        this.smartContractManager = smartContractManager;
        this.youtubeApiKey = 'YOUR_YOUTUBE_API_KEY'; // TODO: Thay bằng API key thực
        this.currentStream = null;
        this.isStreaming = false;
        this.streamViewers = [];
        
        this.init();
    }
    
    init() {
        console.log('Initializing StreamManager...');
        this.loadYouTubeAPI();
    }
    
    // Load YouTube API
    loadYouTubeAPI() {
        if (!window.gapi) {
            const script = document.createElement('script');
            script.src = 'https://apis.google.com/js/api.js';
            script.onload = () => {
                window.gapi.load('client', () => {
                    window.gapi.client.init({
                        apiKey: this.youtubeApiKey,
                        discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest']
                    });
                    console.log('YouTube API loaded');
                });
            };
            document.head.appendChild(script);
        }
    }
    
    // Register stream on blockchain
    async registerStream(youtubeLink) {
        if (!this.walletManager.isConnected) {
            throw new Error('Wallet not connected');
        }
        
        try {
            console.log('Registering stream:', youtubeLink);
            
            // Validate YouTube link
            const videoId = this.extractVideoId(youtubeLink);
            if (!videoId) {
                throw new Error('Invalid YouTube link');
            }
            
            // Get video information from YouTube API
            const videoInfo = await this.getVideoInfo(videoId);
            if (!videoInfo) {
                throw new Error('Failed to get video information');
            }
            
            // Register on blockchain
            const result = await this.smartContractManager.registerStream(youtubeLink);
            
            if (result.success) {
                this.currentStream = {
                    youtubeLink: youtubeLink,
                    videoId: videoId,
                    title: videoInfo.title,
                    description: videoInfo.description,
                    thumbnail: videoInfo.thumbnail,
                    streamer: this.walletManager.walletAddress,
                    isActive: true,
                    startTime: Date.now()
                };
                
                this.isStreaming = true;
                console.log('Stream registered successfully:', this.currentStream);
                return this.currentStream;
            }
            
        } catch (error) {
            console.error('Stream registration failed:', error);
            throw error;
        }
    }
    
    // Extract video ID from YouTube URL
    extractVideoId(url) {
        const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/;
        const match = url.match(regex);
        return match ? match[1] : null;
    }
    
    // Get video information from YouTube API
    async getVideoInfo(videoId) {
        try {
            if (!window.gapi || !window.gapi.client) {
                throw new Error('YouTube API not loaded');
            }
            
            const response = await window.gapi.client.youtube.videos.list({
                part: 'snippet,statistics',
                id: videoId
            });
            
            if (response.result.items && response.result.items.length > 0) {
                const video = response.result.items[0];
                return {
                    title: video.snippet.title,
                    description: video.snippet.description,
                    thumbnail: video.snippet.thumbnails.medium.url,
                    viewCount: video.statistics.viewCount,
                    likeCount: video.statistics.likeCount
                };
            }
            
            return null;
        } catch (error) {
            console.error('Failed to get video info:', error);
            return null;
        }
    }
    
    // Start streaming
    async startStream(youtubeLink) {
        try {
            const stream = await this.registerStream(youtubeLink);
            this.isStreaming = true;
            return stream;
        } catch (error) {
            console.error('Failed to start stream:', error);
            throw error;
        }
    }
    
    // Stop streaming
    async stopStream() {
        try {
            if (this.currentStream) {
                // TODO: Call smart contract to deactivate stream
                this.currentStream.isActive = false;
                this.isStreaming = false;
                console.log('Stream stopped');
            }
        } catch (error) {
            console.error('Failed to stop stream:', error);
            throw error;
        }
    }
    
    // Get current stream info
    getCurrentStream() {
        return this.currentStream;
    }
    
    // Check if currently streaming
    isCurrentlyStreaming() {
        return this.isStreaming && this.currentStream && this.currentStream.isActive;
    }
    
    // Get stream embed URL
    getStreamEmbedUrl() {
        if (this.currentStream && this.currentStream.videoId) {
            return `https://www.youtube.com/embed/${this.currentStream.videoId}`;
        }
        return null;
    }
    
    // Add viewer to stream
    addViewer(viewerAddress) {
        if (!this.streamViewers.includes(viewerAddress)) {
            this.streamViewers.push(viewerAddress);
            console.log('Viewer added:', viewerAddress);
        }
    }
    
    // Remove viewer from stream
    removeViewer(viewerAddress) {
        const index = this.streamViewers.indexOf(viewerAddress);
        if (index > -1) {
            this.streamViewers.splice(index, 1);
            console.log('Viewer removed:', viewerAddress);
        }
    }
    
    // Get viewer count
    getViewerCount() {
        return this.streamViewers.length;
    }
    
    // Get all viewers
    getViewers() {
        return [...this.streamViewers];
    }
}