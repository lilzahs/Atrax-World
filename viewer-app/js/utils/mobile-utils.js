// Mobile Utils - Helper functions for mobile optimization
class MobileUtils {
    static isMobile() {
        return window.innerWidth <= 768;
    }
    
    static isTouchDevice() {
        return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    }
    
    static getViewportHeight() {
        return window.innerHeight;
    }
    
    static getViewportWidth() {
        return window.innerWidth;
    }
    
    static addTouchSupport() {
        if (this.isTouchDevice()) {
            document.body.classList.add('touch-device');
        }
    }
    
    static optimizeForMobile() {
        // Add mobile-specific optimizations
        if (this.isMobile()) {
            document.body.classList.add('mobile-view');
            
            // Adjust viewport for mobile browsers
            const viewport = document.querySelector('meta[name="viewport"]');
            if (viewport) {
                viewport.setAttribute('content', 
                    'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
            }
        }
    }
    
    static handleOrientationChange() {
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                // Recalculate layouts after orientation change
                this.optimizeForMobile();
            }, 100);
        });
    }
    
    static addSwipeSupport(element, onSwipeLeft, onSwipeRight) {
        if (!this.isTouchDevice()) return;
        
        let startX = 0;
        let startY = 0;
        
        element.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        });
        
        element.addEventListener('touchend', (e) => {
            const endX = e.changedTouches[0].clientX;
            const endY = e.changedTouches[0].clientY;
            
            const diffX = startX - endX;
            const diffY = startY - endY;
            
            // Check if horizontal swipe (ignore vertical)
            if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
                if (diffX > 0 && onSwipeLeft) {
                    onSwipeLeft();
                } else if (diffX < 0 && onSwipeRight) {
                    onSwipeRight();
                }
            }
        });
    }
    
    static vibrate(pattern = [100]) {
        if (navigator.vibrate) {
            navigator.vibrate(pattern);
        }
    }
    
    static showToast(message, duration = 3000) {
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        
        // Style the toast
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 12px 20px;
            border-radius: 20px;
            z-index: 10000;
            font-size: 14px;
            opacity: 0;
            transition: opacity 0.3s;
        `;
        
        document.body.appendChild(toast);
        
        // Show toast
        setTimeout(() => {
            toast.style.opacity = '1';
        }, 100);
        
        // Hide toast
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, duration);
    }
    
    static preventZoom() {
        // Prevent zoom on double tap
        let lastTouchEnd = 0;
        document.addEventListener('touchend', (e) => {
            const now = (new Date()).getTime();
            if (now - lastTouchEnd <= 300) {
                e.preventDefault();
            }
            lastTouchEnd = now;
        }, false);
    }
    
    static init() {
        this.addTouchSupport();
        this.optimizeForMobile();
        this.handleOrientationChange();
        this.preventZoom();
        
        console.log('Mobile utils initialized');
    }
}