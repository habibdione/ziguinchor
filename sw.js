// Service Worker for GeoZiguinchor PWA
// Version: 2.0.0
const CACHE_VERSION = 'v2.0.0';
const CACHE_NAME = `geoziguinchor-${CACHE_VERSION}`;
const DATA_CACHE = `geoziguinchor-data-${CACHE_VERSION}`;
const OFFLINE_PAGE = './index.html';

// Core static assets to cache
const STATIC_ASSETS = [
    './',
    './index.html',
    './manifest.json',
    './css/app.css',
    './css/leaflet.css',
    './css/L.Control.Layers.Tree.css',
    './css/L.Control.Locate.min.css',
    './css/qgis2web.css',
    './css/fontawesome-all.min.css',
    './css/MarkerCluster.css',
    './css/MarkerCluster.Default.css',
    './css/leaflet.photon.css',
    './css/leaflet-measure.css',
    './js/app.js',
    './js/leaflet.js',
    './js/L.Control.Layers.Tree.min.js',
    './js/L.Control.Locate.min.js',
    './js/multi-style-layer.js',
    './js/leaflet-svg-shape-markers.min.js',
    './js/leaflet.rotatedMarker.js',
    './js/leaflet.pattern.js',
    './js/leaflet-hash.js',
    './js/Autolinker.min.js',
    './js/rbush.min.js',
    './js/labelgun.min.js',
    './js/labels.js',
    './js/leaflet.photon.js',
    './js/leaflet-measure.js',
    './js/leaflet.markercluster.js',
    './js/qgis2web_expressions.js'
];

// Install Service Worker - Cache essential assets
self.addEventListener('install', (event) => {
    console.log('GeoZiguinchor SW: Installing version', CACHE_VERSION);
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('GeoZiguinchor SW: Caching', STATIC_ASSETS.length, 'static assets');
                // Cache with ignoreErrors to avoid failing on missing assets
                return cache.addAll(STATIC_ASSETS).catch((error) => {
                    console.warn('GeoZiguinchor SW: Some assets failed to cache:', error);
                    // Continue even if some assets fail
                    return Promise.resolve();
                });
            })
            .catch((error) => {
                console.error('GeoZiguinchor SW: Cache open failed:', error);
            })
    );
    self.skipWaiting();
});

// Activate Service Worker - Clean up old caches
self.addEventListener('activate', (event) => {
    console.log('GeoZiguinchor SW: Activating...');
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (!cacheName.includes(CACHE_VERSION)) {
                        console.log('GeoZiguinchor SW: Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

// Fetch Event - Intelligent caching strategy
self.addEventListener('fetch', (event) => {
    const { request } = event;
    
    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }
    
    const url = new URL(request.url);
    
    // Handle API/data requests (Network First, Cache Fallback)
    if (url.pathname.includes('/data/') || url.pathname.includes('.js?')) {
        event.respondWith(networkFirst(request));
        return;
    }
    
    // Handle images (Cache First, Network Fallback)
    if (request.destination === 'image') {
        event.respondWith(cacheFirst(request));
        return;
    }
    
    // Handle static assets (Cache First)
    if (request.destination === 'style' || request.destination === 'script' || 
        url.pathname.endsWith('.css') || url.pathname.endsWith('.js') ||
        url.pathname.endsWith('.woff') || url.pathname.endsWith('.woff2') ||
        url.pathname.endsWith('.ttf') || url.pathname.endsWith('.eot')) {
        event.respondWith(cacheFirst(request));
        return;
    }
    
    // Default strategy for HTML and other (Network First)
    event.respondWith(networkFirst(request));
});

// Cache First Strategy
async function cacheFirst(request) {
    const cached = await caches.match(request);
    if (cached) {
        return cached;
    }
    
    try {
        const response = await fetch(request);
        if (response && response.status === 200) {
            const cache = await caches.open(CACHE_NAME);
            cache.put(request, response.clone());
        }
        return response;
    } catch (error) {
        console.warn('GeoZiguinchor SW: Fetch failed for', request.url, error);
        return caches.match('./index.html');
    }
}

// Network First Strategy
async function networkFirst(request) {
    try {
        const response = await fetch(request);
        if (response && response.status === 200) {
            const cache = await caches.open(CACHE_NAME);
            cache.put(request, response.clone());
        }
        return response;
    } catch (error) {
        console.warn('GeoZiguinchor SW: Network request failed for', request.url);
        const cached = await caches.match(request);
        if (cached) {
            return cached;
        }
        return caches.match('./index.html');
    }
}

// Background Sync for offline actions
self.addEventListener('sync', (event) => {
    console.log('GeoZiguinchor SW: Background sync event:', event.tag);
    if (event.tag === 'sync-location-data') {
        event.waitUntil(syncLocationData());
    }
});

async function syncLocationData() {
    try {
        // Placeholder for syncing location data when back online
        console.log('GeoZiguinchor SW: Syncing location data...');
        return Promise.resolve();
    } catch (error) {
        console.error('GeoZiguinchor SW: Sync failed:', error);
        return Promise.reject(error);
    }
}

// Handle messages from the client
self.addEventListener('message', (event) => {
    console.log('GeoZiguinchor SW: Message received:', event.data);
    
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
    
    if (event.data && event.data.type === 'CLEAR_CACHE') {
        event.waitUntil(
            caches.delete(CACHE_NAME).then(() => {
                event.ports[0].postMessage({ success: true });
            })
        );
    }
    
    if (event.data && event.data.type === 'CACHE_URLS') {
        event.waitUntil(
            caches.open(CACHE_NAME).then((cache) => {
                return cache.addAll(event.data.urls).then(() => {
                    event.ports[0].postMessage({ cached: event.data.urls.length });
                });
            })
        );
    }
});

// Push notifications
self.addEventListener('push', (event) => {
    const data = event.data ? event.data.json() : {};
    const options = {
        body: data.body || 'Nouvelle notification GeoZiguinchor',
        icon: './images/icon-192x192.png',
        badge: './images/icon-96x96.png',
        tag: 'geoziguinchor-notification',
        requireInteraction: data.requireInteraction || false,
        data: data.data || {}
    };
    
    event.waitUntil(
        self.registration.showNotification(data.title || 'GeoZiguinchor', options)
    );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    event.waitUntil(
        clients.matchAll({ type: 'window' }).then((clientList) => {
            // Find existing window
            for (let client of clientList) {
                if (client.url === self.registration.scope && 'focus' in client) {
                    return client.focus();
                }
            }
            // Or open a new window
            if (clients.openWindow) {
                return clients.openWindow('./index.html');
            }
        })
    );
});

console.log('GeoZiguinchor Service Worker loaded');
