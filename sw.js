// GeoZiguinchor Service Worker v3.0.0
// Optimized for Leaflet map tiles with GitHub Pages deployment
// Features: Stale While Revalidate for tiles, Offline-first, Background Sync

const CACHE_VERSION = 'v3.0.0';
const MAP_TILES_CACHE = `geoziguinchor-tiles-${CACHE_VERSION}`;
const STATIC_CACHE = `geoziguinchor-static-${CACHE_VERSION}`;
const DATA_CACHE = `geoziguinchor-data-${CACHE_VERSION}`;
const GITHUB_PAGES_PREFIX = '/ziguinchor';

// Static assets to precache
const STATIC_ASSETS = [
    '/ziguinchor/',
    '/ziguinchor/index.html',
    '/ziguinchor/manifest.json',
    '/ziguinchor/css/app.css',
    '/ziguinchor/css/leaflet.css',
    '/ziguinchor/css/pwa-ui.css',
    '/ziguinchor/css/L.Control.Layers.Tree.css',
    '/ziguinchor/css/L.Control.Locate.min.css',
    '/ziguinchor/css/qgis2web.css',
    '/ziguinchor/css/fontawesome-all.min.css',
    '/ziguinchor/css/MarkerCluster.css',
    '/ziguinchor/css/MarkerCluster.Default.css',
    '/ziguinchor/css/leaflet.photon.css',
    '/ziguinchor/css/leaflet-measure.css',
    '/ziguinchor/js/app.js',
    '/ziguinchor/js/leaflet.js',
    '/ziguinchor/js/pwa-manager.js',
    '/ziguinchor/js/L.Control.Layers.Tree.min.js',
    '/ziguinchor/js/L.Control.Locate.min.js',
    '/ziguinchor/js/multi-style-layer.js',
    '/ziguinchor/js/leaflet-svg-shape-markers.min.js',
    '/ziguinchor/js/leaflet.rotatedMarker.js',
    '/ziguinchor/js/leaflet.pattern.js',
    '/ziguinchor/js/leaflet-hash.js',
    '/ziguinchor/js/Autolinker.min.js',
    '/ziguinchor/js/rbush.min.js',
    '/ziguinchor/js/labelgun.min.js',
    '/ziguinchor/js/labels.js',
    '/ziguinchor/js/leaflet.photon.js',
    '/ziguinchor/js/leaflet-measure.js',
    '/ziguinchor/js/leaflet.markercluster.js',
    '/ziguinchor/js/qgis2web_expressions.js'
];

// INSTALL EVENT - Cache essential assets
self.addEventListener('install', (event) => {
    console.log('🔨 GeoZiguinchor SW v3.0.0: Installing...');
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then((cache) => {
                console.log('📦 Caching', STATIC_ASSETS.length, 'static assets...');
                return cache.addAll(STATIC_ASSETS).catch((error) => {
                    console.warn('⚠️ Some assets failed to cache:', error);
                    return Promise.resolve();
                });
            })
            .catch((error) => {
                console.error('❌ Cache open failed:', error);
            })
    );
    self.skipWaiting();
});

// ACTIVATE EVENT - Clean up old caches
self.addEventListener('activate', (event) => {
    console.log('✅ GeoZiguinchor SW: Activating...');
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (!cacheName.includes(CACHE_VERSION) && cacheName.includes('geoziguinchor')) {
                        console.log('🗑️ Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

// FETCH EVENT - Intelligent cache strategies
self.addEventListener('fetch', (event) => {
    const { request } = event;
    
    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }
    
    const url = new URL(request.url);
    
    // Detect if this is a map tile request
    if (isTileRequest(url)) {
        // Stale While Revalidate for tiles (fast response + background update)
        event.respondWith(cacheTilesStale(request));
        return;
    }
    
    // Static assets - Cache First
    if (isStaticAsset(request, url)) {
        event.respondWith(cacheFirst(request));
        return;
    }
    
    // Data/API requests - Network First
    if (isDataRequest(url)) {
        event.respondWith(networkFirst(request));
        return;
    }
    
    // Default: Network First with fallback
    event.respondWith(networkFirst(request));
});

// **STALE WHILE REVALIDATE** - For map tiles (optimal for perceived performance)
async function cacheTilesStale(request) {
    const cache = await caches.open(MAP_TILES_CACHE);
    const cached = await cache.match(request);
    
    const fetchPromise = fetch(request).then((response) => {
        if (response && response.status === 200) {
            cache.put(request, response.clone());
        }
        return response;
    }).catch(() => cached || offlineResponse());
    
    return cached || fetchPromise;
}

// **CACHE FIRST** - For static assets
async function cacheFirst(request) {
    const cached = await caches.match(request);
    if (cached) {
        return cached;
    }
    
    try {
        const response = await fetch(request);
        if (response && response.status === 200) {
            const cache = await caches.open(STATIC_CACHE);
            cache.put(request, response.clone());
        }
        return response;
    } catch (error) {
        console.warn('⚠️ Fetch failed:', request.url);
        return offlineResponse();
    }
}

// **NETWORK FIRST** - For data and HTML
async function networkFirst(request) {
    try {
        const response = await fetch(request);
        if (response && response.status === 200) {
            const cache = await caches.open(DATA_CACHE);
            cache.put(request, response.clone());
        }
        return response;
    } catch (error) {
        console.warn('⚠️ Network request failed:', request.url);
        const cached = await caches.match(request);
        if (cached) {
            return cached;
        }
        
        // Fallback to cached index.html
        if (request.headers.get('accept')?.includes('text/html')) {
            return caches.match('/ziguinchor/index.html');
        }
        
        return offlineResponse();
    }
}

// Check if URL is a map tile request
function isTileRequest(url) {
    const tilePatterns = [
        'tile.openstreetmap.org',
        'tiles.openstreetmap.org',
        'maps.googleapis.com',
        'a.tile.opentopomap.org',
        'b.tile.opentopomap.org',
        'c.tile.opentopomap.org',
        'cartodb',
        'stamen',
        'esri',
        'thunderforest',
        '.tile.',
        'tileset'
    ];
    
    const urlStr = url.href.toLowerCase();
    const isTile = tilePatterns.some(pattern => urlStr.includes(pattern));
    
    // Also check file extensions
    const isTileFile = url.pathname.match(/\.(png|jpg|jpeg|webp)$/i);
    
    return isTile || (isTileFile && !url.hostname.includes('github'));
}

// Check if request is for static assets
function isStaticAsset(request, url) {
    const staticExts = ['.css', '.js', '.woff', '.woff2', '.ttf', '.eot', '.svg', '.json'];
    const path = url.pathname.toLowerCase();
    
    if (request.destination === 'style' || request.destination === 'script' || request.destination === 'font') {
        return true;
    }
    
    return staticExts.some(ext => path.endsWith(ext));
}

// Check if request is for data/API
function isDataRequest(url) {
    const path = url.pathname.toLowerCase();
    return path.includes('/data/') || path.endsWith('.geojson') || path.endsWith('.json');
}

// Offline fallback response
function offlineResponse() {
    return new Response(
        '<html><body><h1>📶 Offline</h1><p>Les données ne sont pas disponibles hors ligne.</p></body></html>',
        {
            headers: { 'Content-Type': 'text/html' },
            status: 503
        }
    );
}

// MESSAGE HANDLING - Receive commands from app
self.addEventListener('message', (event) => {
    console.log('📨 SW Message:', event.data);
    
    // Skip waiting for immediate update
    if (event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
    
    // Cache tiles from app request
    if (event.data.type === 'CACHE_TILES') {
        event.waitUntil(
            cacheTilesFromUrls(event.data.urls)
                .then(() => {
                    event.ports[0]?.postMessage({ success: true, cached: event.data.urls.length });
                })
        );
    }
    
    // Clear all caches
    if (event.data.type === 'CLEAR_CACHE') {
        event.waitUntil(
            caches.keys().then((names) => {
                return Promise.all(names.map(name => caches.delete(name)));
            }).then(() => {
                event.ports[0]?.postMessage({ success: true });
            })
        );
    }
});

// Cache multiple tiles
async function cacheTilesFromUrls(urls) {
    try {
        const cache = await caches.open(MAP_TILES_CACHE);
        const requests = urls.map(url => new Request(url, { mode: 'no-cors' }));
        
        for (const request of requests) {
            try {
                const response = await fetch(request);
                if (response && response.status === 200) {
                    await cache.put(request, response);
                }
            } catch (e) {
                console.warn('Failed to cache tile:', request.url);
            }
        }
    } catch (error) {
        console.error('Error caching tiles:', error);
    }
}

// BACKGROUND SYNC - Sync location data when back online
self.addEventListener('sync', (event) => {
    console.log('🔄 Background Sync:', event.tag);
    if (event.tag === 'sync-location-data') {
        event.waitUntil(syncLocationData());
    }
});

async function syncLocationData() {
    try {
        console.log('📍 Syncing location data...');
        // Implement location sync logic here
        return Promise.resolve();
    } catch (error) {
        console.error('❌ Sync failed:', error);
        return Promise.reject(error);
    }
}

// PUSH NOTIFICATIONS
self.addEventListener('push', (event) => {
    const data = event.data ? event.data.json() : {};
    const options = {
        body: data.body || 'Nouvelle notification GeoZiguinchor',
        icon: '/ziguinchor/images/icon-192x192.png',
        badge: '/ziguinchor/images/icon-96x96.png',
        tag: 'geoziguinchor-notification',
        requireInteraction: data.requireInteraction || false,
        data: data.data || {}
    };
    
    event.waitUntil(
        self.registration.showNotification(data.title || 'GeoZiguinchor 🗺️', options)
    );
});

// NOTIFICATION CLICK HANDLER
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    event.waitUntil(
        clients.matchAll({ type: 'window' }).then((clientList) => {
            for (let client of clientList) {
                if (client.url.includes('/ziguinchor/') && 'focus' in client) {
                    return client.focus();
                }
            }
            if (clients.openWindow) {
                return clients.openWindow('/ziguinchor/index.html');
            }
        })
    );
});

console.log('✅ GeoZiguinchor Service Worker v3.0.0 loaded: Ready for offline mapping!');
