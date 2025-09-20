// StreamPlayer - YouTube player integration
class StreamPlayer {
    constructor() {
        this.player = null;
        this.currentStream = null;
        this.isPlayerReady = false;
        
        this.init();
    }
    
    init() {
        console.log('StreamPlayer initialized');
        
        // Wait for YouTube API to load
        if (typeof YT !== 'undefined') {
            this.onYouTubeAPIReady();
        } else {
            window.onYouTubeIframeAPIReady = () => {
                this.onYouTubeAPIReady();
            };
        }
    }
    
    onYouTubeAPIReady() {
        console.log('YouTube API ready');
        this.isPlayerReady = true;
    }
    
    loadStream(stream) {
        console.log('Loading stream:', stream);
        this.currentStream = stream;
        
        const playerElement = document.getElementById('youtube-player');
        if (!playerElement) return;
        
        // Clear previous player
        playerElement.innerHTML = '';
        
        if (this.isPlayerReady && stream.youtubeId) {
            // Create YouTube player
            this.player = new YT.Player('youtube-player', {
                height: '200',
                width: '100%',
                videoId: stream.youtubeId,
                playerVars: {
                    'playsinline': 1,
                    'controls': 1,
                    'rel': 0,
                    'modestbranding': 1
                },
                events: {
                    'onReady': (event) => {
                        console.log('YouTube player ready');
                        event.target.playVideo();
                    },
                    'onStateChange': (event) => {
                        this.onPlayerStateChange(event);
                    }
                }
            });
        } else {
            // Fallback for when YouTube API is not ready
            playerElement.innerHTML = `
                <div class="player-placeholder">
                    <h3>🎮 ${stream.title}</h3>
                    <p>Loading stream...</p>
                    <button onclick="this.loadStream('${stream.id}')" class="retry-btn">Retry</button>
                </div>
            `;
        }
    }
    
    onPlayerStateChange(event) {
        console.log('Player state changed:', event.data);
        
        switch (event.data) {
            case YT.PlayerState.PLAYING:
                console.log('Video is playing');
                break;
            case YT.PlayerState.PAUSED:
                console.log('Video is paused');
                break;
            case YT.PlayerState.ENDED:
                console.log('Video ended');
                break;
        }
    }
    
    play() {
        if (this.player && this.player.playVideo) {
            this.player.playVideo();
        }
    }
    
    pause() {
        if (this.player && this.player.pauseVideo) {
            this.player.pauseVideo();
        }
    }
    
    stop() {
        if (this.player && this.player.stopVideo) {
            this.player.stopVideo();
        }
    }
    
    getCurrentTime() {
        if (this.player && this.player.getCurrentTime) {
            return this.player.getCurrentTime();
        }
        return 0;
    }
    
    getDuration() {
        if (this.player && this.player.getDuration) {
            return this.player.getDuration();
        }
        return 0;
    }
    
    destroy() {
        if (this.player && this.player.destroy) {
            this.player.destroy();
            this.player = null;
        }
    }
}