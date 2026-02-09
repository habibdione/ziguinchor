// GeoZiguinchor - GPS Geolocation & PWA Installation Manager
// Optimisé pour Leaflet et Github Pages

class GeoZiguinchorPWA {
    constructor() {
        this.sw = null;
        this.locationTracking = false;
        this.currentPosition = null;
        this.userMarker = null;
        this.accuracyCircle = null;
        this.installPrompt = null;
        this.init();
    }

    // Initialize PWA and Services
    async init() {
        console.log('🗺️ GeoZiguinchor PWA Initializing...');
        
        // Register Service Worker
        this.registerServiceWorker();
        
        // Setup geolocation
        this.setupGeolocation();
        
        // Setup PWA Installation
        this.setupInstallation();
        
        // Handle app parameters
        this.handleAppParams();
    }

    // **SERVICE WORKER REGISTRATION**
    async registerServiceWorker() {
        if (!('serviceWorker' in navigator)) {
            console.warn('⚠️ Service Worker not supported');
            return;
        }

        try {
            const registration = await navigator.serviceWorker.register('/ziguinchor/sw.js', {
                scope: '/ziguinchor/'
            });
            console.log('✅ Service Worker registered');
            
            // Check for updates
            setInterval(() => registration.update(), 60000);
            
            // Handle controller change
            navigator.serviceWorker.addEventListener('controller', () => {
                console.log('🔄 Service Worker updated');
                this.showNotification('Mise à jour disponible', 'Rafraîchissez la page');
            });
            
            return registration;
        } catch (error) {
            console.error('❌ Service Worker registration failed:', error);
        }
    }

    // **GEOLOCATION SETUP**
    setupGeolocation() {
        if (!('geolocation' in navigator)) {
            console.warn('⚠️ Geolocation not available');
            return;
        }

        // Create geolocation button
        this.createGeolocateButton();
        
        // Auto-locate on first load (optional)
        // this.getLocation();
    }

    // **CREATE GEOLOCATE BUTTON**
    createGeolocateButton() {
        // Check if button already exists
        if (document.getElementById('pwa-geolocate-btn')) return;

        const btn = document.createElement('button');
        btn.id = 'pwa-geolocate-btn';
        btn.className = 'pwa-control-btn';
        btn.title = 'Voir ma position (GPS)';
        btn.innerHTML = '📍 GPS';
        
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            this.toggleLocationTracking();
        });

        // Find navbar and add button
        const navbar = document.querySelector('.navbar-menu') || document.querySelector('.navbar');
        if (navbar) {
            navbar.appendChild(btn);
        } else {
            // Fallback: add to body
            document.body.appendChild(btn);
        }
    }

    // **GET LOCATION**
    async getLocation() {
        if (!('geolocation' in navigator)) {
            this.showNotification('❌ Géolocalisation non disponible');
            return;
        }

        try {
            const position = await new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject, {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 0
                });
            });

            this.currentPosition = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
                accuracy: position.coords.accuracy,
                timestamp: new Date()
            };

            console.log('📍 Location:', this.currentPosition);
            this.displayLocationOnMap();
            this.showNotification('✅ Position trouvée', `Précision: ±${Math.round(this.currentPosition.accuracy)}m`);
            
            // Save to localStorage
            localStorage.setItem('geoziguinchor-last-location', JSON.stringify(this.currentPosition));
            
            return this.currentPosition;
        } catch (error) {
            console.error('❌ Geolocation error:', error);
            this.showNotification('❌ Impossible d\'accéder à votre position', error.message);
        }
    }

    // **TOGGLE LOCATION TRACKING**
    toggleLocationTracking() {
        if (this.locationTracking) {
            this.stopLocationTracking();
        } else {
            this.startLocationTracking();
        }
    }

    // **START LOCATION TRACKING**
    async startLocationTracking() {
        this.locationTracking = true;
        
        // Initial position
        await this.getLocation();
        
        // Watch position
        this.watchId = navigator.geolocation.watchPosition(
            (position) => {
                this.currentPosition = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                    accuracy: position.coords.accuracy,
                    timestamp: new Date()
                };
                this.displayLocationOnMap();
                console.log('📍 Position updated:', this.currentPosition);
            },
            (error) => {
                console.error('⚠️ Watch error:', error);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 5000
            }
        );

        // Update button
        const btn = document.getElementById('pwa-geolocate-btn');
        if (btn) {
            btn.textContent = '📍 Arrêter';
            btn.classList.add('active');
        }
    }

    // **STOP LOCATION TRACKING**
    stopLocationTracking() {
        if (this.watchId) {
            navigator.geolocation.clearWatch(this.watchId);
        }
        
        this.locationTracking = false;
        
        // Remove map elements
        if (this.userMarker && map) {
            map.removeLayer(this.userMarker);
            this.userMarker = null;
        }
        if (this.accuracyCircle && map) {
            map.removeLayer(this.accuracyCircle);
            this.accuracyCircle = null;
        }

        // Update button
        const btn = document.getElementById('pwa-geolocate-btn');
        if (btn) {
            btn.textContent = '📍 GPS';
            btn.classList.remove('active');
        }

        this.showNotification('Suivi arrêté');
    }

    // **DISPLAY LOCATION ON MAP (Leaflet)**
    displayLocationOnMap() {
        if (!window.map || !this.currentPosition) return;

        const { lat, lng, accuracy } = this.currentPosition;

        // Remove old marker
        if (this.userMarker) {
            window.map.removeLayer(this.userMarker);
        }
        if (this.accuracyCircle) {
            window.map.removeLayer(this.accuracyCircle);
        }

        // Add accuracy circle
        this.accuracyCircle = L.circle([lat, lng], accuracy, {
            color: '#3498db',
            fillColor: '#3498db',
            fillOpacity: 0.1,
            weight: 2,
            dashArray: '5,5'
        }).addTo(window.map);

        // Add user marker
        this.userMarker = L.circleMarker([lat, lng], {
            radius: 8,
            fillColor: '#e74c3c',
            color: '#c0392b',
            weight: 2,
            opacity: 1,
            fillOpacity: 0.9
        }).addTo(window.map).bindPopup(`
            <div style="font-family: Arial; font-size: 12px; text-align: center;">
                <strong>📍 Ma position</strong><br>
                <hr style="margin: 5px 0;">
                <b>Lat:</b> ${lat.toFixed(6)}°<br>
                <b>Lon:</b> ${lng.toFixed(6)}°<br>
                <b>Précision:</b> ±${accuracy.toFixed(0)}m<br>
                <b>Heure:</b> ${this.currentPosition.timestamp.toLocaleTimeString('fr-FR')}<br>
                <button onclick="navigator.clipboard.writeText('${lat.toFixed(6)}, ${lng.toFixed(6)}')" 
                    style="margin-top: 8px; padding: 4px 8px; background: #3498db; color: white; border: none; border-radius: 3px; cursor: pointer; font-size: 11px;">
                    📋 Copier coordonnées
                </button>
            </div>
        `).openPopup();

        // Pan map to location
        window.map.setView([lat, lng], 15);
    }

    // **PWA INSTALLATION SETUP**
    setupInstallation() {
        // Capture install prompt
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            this.installPrompt = e;
            console.log('📲 Install prompt available');
            this.showInstallButton();
        });

        // Handle app installed
        window.addEventListener('appinstalled', () => {
            console.log('✅ App installed successfully');
            this.installPrompt = null;
            this.hideInstallButton();
            this.showNotification('✅ App installée', 'Bienvenue sur GeoZiguinchor!');
        });
    }

    // **SHOW INSTALL BUTTON**
    showInstallButton() {
        let installBtn = document.getElementById('pwa-install-btn');
        if (!installBtn) {
            installBtn = document.createElement('button');
            installBtn.id = 'pwa-install-btn';
            installBtn.className = 'pwa-control-btn pwa-install';
            installBtn.innerHTML = '⬇️ Installer';
            installBtn.title = 'Installer l\'application sur votre appareil';
            
            installBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.promptInstall();
            });

            const navbar = document.querySelector('.navbar-menu') || document.querySelector('.navbar');
            if (navbar) {
                navbar.appendChild(installBtn);
            } else {
                document.body.appendChild(installBtn);
            }
        }
    }

    // **HIDE INSTALL BUTTON**
    hideInstallButton() {
        const btn = document.getElementById('pwa-install-btn');
        if (btn) btn.style.display = 'none';
    }

    // **PROMPT INSTALL**
    async promptInstall() {
        if (!this.installPrompt) return;

        this.installPrompt.prompt();
        const { outcome } = await this.installPrompt.userChoice;
        
        if (outcome === 'accepted') {
            console.log('✅ User accepted installation');
        } else {
            console.log('❌ User dismissed installation');
        }
        
        this.installPrompt = null;
    }

    // **HANDLE APP URL PARAMETERS**
    handleAppParams() {
        const params = new URLSearchParams(window.location.search);
        
        if (params.get('view') === 'location') {
            this.startLocationTracking();
        }

        // Cache tiles if param provided
        if (params.get('cache-tiles') === '1') {
            this.cacheTiles();
        }
    }

    // **CACHE TILES FOR OFFLINE**
    async cacheTiles() {
        if (!('serviceWorker' in navigator)) return;

        try {
            const reg = await navigator.serviceWorker.ready;
            
            // Send message to SW to cache tiles
            const urls = this.getCommonTileUrls();
            
            reg.active.postMessage({
                type: 'CACHE_TILES',
                urls: urls
            });
            
            this.showNotification('⏳ Mise en cache des cartes...', 'Cela peut prendre quelques secondes');
        } catch (error) {
            console.error('Error caching tiles:', error);
        }
    }

    // **GET COMMON TILE URLS**
    getCommonTileUrls() {
        // Generate sample tile URLs for preloading
        const tiles = [];
        const baseUrl = 'https://tile.openstreetmap.org';
        
        // Zoom 10-15 around Ziguinchor (13.5, -14.6)
        for (let z = 10; z <= 12; z++) {
            for (let x = 0; x < Math.pow(2, z); x++) {
                for (let y = 0; y < Math.pow(2, z); y++) {
                    // Simple square around area
                    tiles.push(`${baseUrl}/${z}/${x}/${y}.png`);
                }
            }
        }
        
        return tiles.slice(0, 50); // Limit to 50 tiles
    }

    // **SHOW NOTIFICATION**
    showNotification(title, message = '') {
        // Try native notification
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(title, { body: message });
        } else if ('Notification' in window && Notification.permission !== 'denied') {
            Notification.requestPermission().then((permission) => {
                if (permission === 'granted') {
                    new Notification(title, { body: message });
                }
            });
        }

        // Fallback: Toast message
        this.showToast(title + (message ? ': ' + message : ''));
    }

    // **SHOW TOAST**
    showToast(message) {
        let toast = document.getElementById('pwa-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'pwa-toast';
            toast.style.cssText = `
                position: fixed;
                bottom: 20px;
                left: 20px;
                right: 20px;
                background: #2c3e50;
                color: white;
                padding: 12px 16px;
                border-radius: 4px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.2);
                z-index: 10000;
                animation: slideUp 0.3s ease-out;
                max-width: 300px;
                margin: 0 auto;
            `;
            document.body.appendChild(toast);
        }

        toast.textContent = message;
        toast.style.opacity = '1';
        
        clearTimeout(this.toastTimeout);
        this.toastTimeout = setTimeout(() => {
            toast.style.opacity = '0';
        }, 3000);
    }

    // **COPY LOCATION TO CLIPBOARD**
    static copyLocation(lat, lng) {
        const text = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
        navigator.clipboard.writeText(text).then(() => {
            console.log('✅ Coordonnées copiées');
        });
    }

    // **SHARE LOCATION**
    static async shareLocation(lat, lng) {
        if (!navigator.share) {
            alert(`Partage non supporté - Coordonnées: ${lat.toFixed(6)}, ${lng.toFixed(6)}`);
            return;
        }

        try {
            await navigator.share({
                title: 'GeoZiguinchor - Ma position',
                text: `Lat: ${lat.toFixed(6)}, Lon: ${lng.toFixed(6)}`,
                url: `/ziguinchor/?lat=${lat}&lng=${lng}`
            });
        } catch (error) {
            console.log('Partage annulé');
        }
    }
}

// **INITIALIZE WHEN DOM IS READY**
document.addEventListener('DOMContentLoaded', () => {
    window.geoziguinchorPWA = new GeoZiguinchorPWA();
});

// **REQUEST NOTIFICATION PERMISSION ON LOAD**
window.addEventListener('load', () => {
    if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
    }
});
