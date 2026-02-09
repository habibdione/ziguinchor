// Service Worker for GeoZiguinchor PWA
const CACHE_NAME = 'geoziguinchor-v1.0';
const STATIC_ASSETS = [
    '/geoziguinchor/index.html',
    '/geoziguinchor/css/app.css',
    '/geoziguinchor/css/leaflet.css',
    '/geoziguinchor/css/L.Control.Layers.Tree.css',
    '/geoziguinchor/css/L.Control.Locate.min.css',
    '/geoziguinchor/css/qgis2web.css',
    '/geoziguinchor/css/fontawesome-all.min.css',
    '/geoziguinchor/css/MarkerCluster.css',
    '/geoziguinchor/css/MarkerCluster.Default.css',
    '/geoziguinchor/css/leaflet.photon.css',
    '/geoziguinchor/css/leaflet-measure.css',
    '/geoziguinchor/js/app.js',
    '/geoziguinchor/js/leaflet.js',
    '/geoziguinchor/js/L.Control.Layers.Tree.min.js',
    '/geoziguinchor/js/L.Control.Locate.min.js',
    '/geoziguinchor/js/multi-style-layer.js',
    '/geoziguinchor/js/leaflet-svg-shape-markers.min.js',
    '/geoziguinchor/js/leaflet.rotatedMarker.js',
    '/geoziguinchor/js/leaflet.pattern.js',
    '/geoziguinchor/js/leaflet-hash.js',
    '/geoziguinchor/js/Autolinker.min.js',
    '/geoziguinchor/js/rbush.min.js',
    '/geoziguinchor/js/labelgun.min.js',
    '/geoziguinchor/js/labels.js',
    '/geoziguinchor/js/leaflet.photon.js',
    '/geoziguinchor/js/leaflet-measure.js',
    '/geoziguinchor/js/leaflet.markercluster.js',
    '/geoziguinchor/js/qgis2web_expressions.js',
    '/geoziguinchor/manifest.json'
];

// Install Service Worker
self.addEventListener('install', (event) => {
    console.log('Service Worker installing...');
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('Caching static assets');
            return cache.addAll(STATIC_ASSETS);
        })
    );
    self.skipWaiting();
});

// Activate Service Worker
self.addEventListener('activate', (event) => {
    console.log('Service Worker activating...');
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

// Fetch Event - Network First, Cache Fallback
self.addEventListener('fetch', (event) => {
    // Skip non-GET requests
    if (event.request.method !== 'GET') {
        return;
    }

    // Handle API requests (data)
    if (event.request.url.includes('/data/')) {
        event.respondWith(
            fetch(event.request)
                .then((response) => {
                    const clone = response.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, clone);
                    });
                    return response;
                })
                .catch(() => {
                    return caches.match(event.request);
                })
        );
        return;
    }

    // Handle static assets (Cache First)
    event.respondWith(
        caches.match(event.request).then((response) => {
            if (response) {
                return response;
            }
            return fetch(event.request)
                .then((response) => {
                    if (!response || response.status !== 200 || response.type !== 'basic') {
                        return response;
                    }
                    const clone = response.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, clone);
                    });
                    return response;
                })
                .catch(() => {
                    // Return offline page or cached fallback
                    return caches.match('/geoziguinchor/index.html');
                });
        })
    );
});

// Background Sync for offline actions
self.addEventListener('sync', (event) => {
    if (event.tag === 'sync-data') {
        event.waitUntil(syncData());
    }
});

// Sync data function
function syncData() {
    return Promise.resolve();
}

// Handle messages from the client
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});

// Push notifications
self.addEventListener('push', (event) => {
    const data = event.data ? event.data.json() : {};
    const options = {
        body: data.body || 'Nouvelle notification',
        icon: '/geoziguinchor/images/icon-192x192.png',
        badge: '/geoziguinchor/images/icon-96x96.png',
        tag: 'geoziguinchor-notification'
    };
    event.waitUntil(
        self.registration.showNotification(data.title || 'GeoZiguinchor', options)
    );
});

// Notification click
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    event.waitUntil(
        clients.matchAll({ type: 'window' }).then((clientList) => {
            for (let client of clientList) {
                if (client.url === '/geoziguinchor/index.html' && 'focus' in client) {
                    return client.focus();
                }
            }
            if (clients.openWindow) {
                return clients.openWindow('/geoziguinchor/index.html');
            }
        })
    );
});
