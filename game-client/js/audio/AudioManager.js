// Audio Manager - Handle all game audio
class AudioManager {
    constructor() {
        this.sounds = {};
        this.music = {};
        this.isMuted = false;
        this.masterVolume = 1.0;
        this.sfxVolume = 0.7;
        this.musicVolume = 0.3;
        
        this.init();
    }
    
    init() {
        console.log('Initializing Audio Manager...');
        this.loadSounds();
        this.loadMusic();
    }
    
    loadSounds() {
        // Sound Effects
        this.sounds = {
            buttonClick: new Audio('assets/audio/sfx/button-click.mp3'),
            buttonHover: new Audio('assets/audio/sfx/button-hover.mp3'),
            playerWalk: new Audio('assets/audio/sfx/player-walk.mp3'),
            buildingPlace: new Audio('assets/audio/sfx/building-place.mp3'),
            buildingUpgrade: new Audio('assets/audio/sfx/building-upgrade.mp3'),
            itemPickup: new Audio('assets/audio/sfx/item-pickup.mp3'),
            itemDrop: new Audio('assets/audio/sfx/item-drop.mp3'),
            coinCollect: new Audio('assets/audio/sfx/coin-collect.mp3'),
            notification: new Audio('assets/audio/sfx/notification.mp3'),
            error: new Audio('assets/audio/sfx/error.mp3'),
            success: new Audio('assets/audio/sfx/success.mp3')
        };
        
        // Set volume for all sounds
        Object.values(this.sounds).forEach(sound => {
            sound.volume = this.sfxVolume * this.masterVolume;
        });
    }
    
    loadMusic() {
        // Background Music
        this.music = {
            plainsTheme: new Audio('assets/audio/music/plains-theme.mp3'),
            desertTheme: new Audio('assets/audio/music/desert-theme.mp3'),
            islandTheme: new Audio('assets/audio/music/island-theme.mp3'),
            snowTheme: new Audio('assets/audio/music/snow-theme.mp3'),
            mainMenu: new Audio('assets/audio/music/main-menu.mp3'),
            shopTheme: new Audio('assets/audio/music/shop-theme.mp3')
        };
        
        // Set volume and loop for all music
        Object.values(this.music).forEach(track => {
            track.volume = this.musicVolume * this.masterVolume;
            track.loop = true;
        });
        
        this.currentMusic = null;
    }
    
    // Sound Effects
    playSound(soundName) {
        if (this.isMuted || !this.sounds[soundName]) return;
        
        try {
            this.sounds[soundName].currentTime = 0;
            this.sounds[soundName].play().catch(e => {
                console.log('Could not play sound:', soundName, e);
            });
        } catch (error) {
            console.log('Error playing sound:', soundName, error);
        }
    }
    
    // Background Music
    playMusic(musicName, fadeIn = true) {
        if (this.isMuted || !this.music[musicName]) return;
        
        // Stop current music
        if (this.currentMusic) {
            this.stopMusic();
        }
        
        this.currentMusic = this.music[musicName];
        
        try {
            if (fadeIn) {
                this.fadeInMusic(this.currentMusic);
            } else {
                this.currentMusic.play().catch(e => {
                    console.log('Could not play music:', musicName, e);
                });
            }
        } catch (error) {
            console.log('Error playing music:', musicName, error);
        }
    }
    
    stopMusic(fadeOut = true) {
        if (!this.currentMusic) return;
        
        if (fadeOut) {
            this.fadeOutMusic(this.currentMusic);
        } else {
            this.currentMusic.pause();
            this.currentMusic.currentTime = 0;
        }
        
        this.currentMusic = null;
    }
    
    fadeInMusic(audio, duration = 2000) {
        audio.volume = 0;
        audio.play().catch(e => console.log('Could not play music:', e));
        
        const fadeInInterval = setInterval(() => {
            if (audio.volume < this.musicVolume * this.masterVolume) {
                audio.volume += 0.01;
            } else {
                clearInterval(fadeInInterval);
            }
        }, duration / 100);
    }
    
    fadeOutMusic(audio, duration = 2000) {
        const fadeOutInterval = setInterval(() => {
            if (audio.volume > 0.01) {
                audio.volume -= 0.01;
            } else {
                audio.pause();
                audio.currentTime = 0;
                clearInterval(fadeOutInterval);
            }
        }, duration / 100);
    }
    
    // Volume Controls
    setMasterVolume(volume) {
        this.masterVolume = Math.max(0, Math.min(1, volume));
        this.updateAllVolumes();
    }
    
    setSfxVolume(volume) {
        this.sfxVolume = Math.max(0, Math.min(1, volume));
        Object.values(this.sounds).forEach(sound => {
            sound.volume = this.sfxVolume * this.masterVolume;
        });
    }
    
    setMusicVolume(volume) {
        this.musicVolume = Math.max(0, Math.min(1, volume));
        Object.values(this.music).forEach(track => {
            track.volume = this.musicVolume * this.masterVolume;
        });
    }
    
    updateAllVolumes() {
        Object.values(this.sounds).forEach(sound => {
            sound.volume = this.sfxVolume * this.masterVolume;
        });
        Object.values(this.music).forEach(track => {
            track.volume = this.musicVolume * this.masterVolume;
        });
    }
    
    // Mute Controls
    toggleMute() {
        this.isMuted = !this.isMuted;
        
        if (this.isMuted) {
            this.stopMusic(false);
        } else {
            // Resume music if there was one playing
            if (this.currentMusic) {
                this.playMusic(this.getCurrentMusicName());
            }
        }
        
        return this.isMuted;
    }
    
    getCurrentMusicName() {
        if (!this.currentMusic) return null;
        
        for (let [name, track] of Object.entries(this.music)) {
            if (track === this.currentMusic) return name;
        }
        return null;
    }
    
    // Biome-specific music
    playBiomeMusic(biome) {
        const musicMap = {
            'plains': 'plainsTheme',
            'desert': 'desertTheme',
            'island': 'islandTheme',
            'snow': 'snowTheme'
        };
        
        const musicName = musicMap[biome];
        if (musicName) {
            this.playMusic(musicName);
        }
    }
    
    // UI Sound Effects
    playButtonClick() {
        this.playSound('buttonClick');
    }
    
    playButtonHover() {
        this.playSound('buttonHover');
    }
    
    // Game Sound Effects
    playPlayerWalk() {
        this.playSound('playerWalk');
    }
    
    playBuildingPlace() {
        this.playSound('buildingPlace');
    }
    
    playBuildingUpgrade() {
        this.playSound('buildingUpgrade');
    }
    
    playItemPickup() {
        this.playSound('itemPickup');
    }
    
    playItemDrop() {
        this.playSound('itemDrop');
    }
    
    playCoinCollect() {
        this.playSound('coinCollect');
    }
    
    playNotification() {
        this.playSound('notification');
    }
    
    playError() {
        this.playSound('error');
    }
    
    playSuccess() {
        this.playSound('success');
    }
}
