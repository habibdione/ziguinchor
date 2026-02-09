// GeoZiguinchor Service Worker - Optimisé pour cartes Leaflet
// Version: 3.0.0 - Cartographie optimisée
const CACHE_VERSION = 'v3.0.0';
const CACHE_NAME = `geoziguinchor-${CACHE_VERSION}`;
const MAP_TILES_CACHE = `geoziguinchor-tiles-${CACHE_VERSION}`;
const DATA_CACHE = `geoziguinchor-data-${CACHE_VERSION}`;
const STATIC_CACHE = `geoziguinchor-static-${CACHE_VERSION}`;

// Core static assets
const STATIC_ASSETS = [
    '/ziguinchor/',
    '/ziguinchor/index.html',
    '/ziguinchor/manifest.json',
    '/ziguinchor/css/app.css',
    '/ziguinchor/css/leaflet.css',
];

// Install Service Worker - Cache essential assets
self.addEventListener('install', (event) => {
    console.log('🗺️ GeoZiguinchor SW: Installing v3.0.0 (Map optimized)');
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then((cache) => {
                return cache.addAll(STATIC_ASSETS).catch(() => {
                    console.warn('Some static assets unavailable');
                    return Promise.resolve();
                });
            })
    );
    self.skipWaiting();
});

// Activate Service Worker - Clean up old caches
self.addEventListener('activate', (event) => {
    console.log('🗺️ GeoZiguinchor SW: Activating...');
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (!cacheName.includes(CACHE_VERSION)) {
                        console.log('🗺️ Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

// Fetch Event - Optimized for map tiles and offline
self.addEventListener('fetch', (event) => {
    const { request } = event;
    
    if (request.method !== 'GET') return;
    
    const url = new URL(request.url);
    
    // **MAP TILES STRATEGY: Cache everything, update in background**
    if (url.includes('tile.openstreetmap.org') || 
        url.includes('mtile.lclick.com') ||
        url.includes('lclick.com') ||
        url.includes('maps.googleapis.com') ||
        url.includes('tile.stamen.com') ||
        url.includes('cartodb') ||
        url.pathname.includes('/tiles/') ||
        url.pathname.match(/\.(png|jpg|jpeg)$/)) {
        
        event.respondWith(cacheTilesStale(request));
        return;
    }
    
    // **DATA/API: Network first, fallback to cache**
    if (url.pathname.includes('/data/') || 
        url.pathname.includes('geojson') ||
        url.pathname.match(/\.json$/)) {
        event.respondWith(networkFirstWithCache(request));
        return;
    }
    
    // **STATIC ASSETS: Cache first**
    if (request.destination === 'style' || 
        request.destination === 'script' ||
        request.destination === 'image' ||
        request.destination === 'font' ||
        url.pathname.match(/\.(css|js|woff|woff2|ttf|eot|svg)$/)) {
        event.respondWith(cacheFirstWithFallback(request));
        return;
    }
    
    // **HTML: Network first**
    event.respondWith(networkFirstWithCache(request));
});

// **Stale While Revalidate - Perfect for map tiles**
async function cacheTilesStale(request) {
    const cache = await caches.open(MAP_TILES_CACHE);
    const cached = await cache.match(request);
    
    const fetchPromise = fetch(request).then((response) => {
        if (response.status === 200) {
            cache.put(request, response.clone());
        }
        return response;
    }).catch(() => cached || offlineResponse());
    
    return cached || fetchPromise;
}

// **Cache First Strategy**
async function cacheFirstWithFallback(request) {
    const cached = await caches.match(request);
    if (cached) return cached;
    
    try {
        const response = await fetch(request);
        if (response && response.status === 200) {
            const cache = await caches.open(STATIC_CACHE);
            cache.put(request, response.clone());
        }
        return response;
    } catch (error) {
        return offlineResponse();
    }
}

// **Network First Strategy**
async function networkFirstWithCache(request) {
    try {
        const response = await fetch(request);
        if (response && response.status === 200) {
            const cache = await caches.open(DATA_CACHE);
            cache.put(request, response.clone());
        }
        return response;
    } catch (error) {
        const cached = await caches.match(request);
        return cached || offlineResponse();
    }
}

// **Offline Fallback**
async function offlineResponse() {
    return caches.match('/ziguinchor/index.html') || new Response('Offline - No data available');
}

// **Handle messages from client**
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
    
    if (event.data && event.data.type === 'CACHE_TILES') {
        const urls = event.data.urls || [];
        event.waitUntil(
            caches.open(MAP_TILES_CACHE).then((cache) => {
                return Promise.allSettled(urls.map(url => cache.add(url)));
            }).then(() => {
                event.ports[0].postMessage({ cached: urls.length });
            })
        );
    }
});

// **Background Sync - Sync location data when online**
self.addEventListener('sync', (event) => {
    if (event.tag === 'sync-location') {
        event.waitUntil(syncLocationData());
    }
});

async function syncLocationData() {
    console.log('📍 Syncing location data...');
    return Promise.resolve();
}

console.log('🗺️ GeoZiguinchor Service Worker v3.0.0 loaded - Map optimized');
