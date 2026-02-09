// GeoZiguinchor Main Application Script

// Global variables
let map;
let highlightLayer;
let currentLocation;
let allLayers = {};
let measureControl;
let geolocateControl;
let userMarker;
let selectedFeatures = [];

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    initializeMap();
    setupEventListeners();
    setupModals();
    setupGeolocation();
    updateCoordinatesAndScale();
});

// Initialize Leaflet Map
function initializeMap() {
    // Create map
    map = L.map('map', {
        zoomControl: false,
        maxZoom: 20,
        minZoom: 1,
        center: [13.5, -14.5],
        zoom: 10
    });

    // Add hash for URL tracking
    const hash = new L.Hash(map);

    // Add attribution
    map.attributionControl.setPrefix('<a href="https://github.com/tomchadwin/qgis2web" target="_blank">qgis2web</a> &middot; <a href="https://leafletjs.com" title="A JS library for interactive maps">Leaflet</a> &middot; <a href="https://qgis.org">QGIS</a>');

    // Add Autolinker
    window.autolinker = new Autolinker({truncate: {length: 30, location: 'smart'}});

    // Create bounds group
    window.bounds_group = new L.featureGroup([]);

    // Add basemaps
    addBasemaps();

    // Add data layers
    addDataLayers();

    // Setup layer control
    setupLayerControl();

    // Add basemap controls to right panel
    createBasemapsControl();

    // Add legend
    createLegend();

    // Fit bounds
    setBounds();

    // Setup labels
    setupLabels();

    // Add map event listeners
    map.on('zoom', updateCoordinatesAndScale);
    map.on('move', updateCoordinatesAndScale);
}

// Add basemap layers
function addBasemaps() {
    // Google Hybrid
    map.createPane('pane_GoogleHybrid_0');
    map.getPane('pane_GoogleHybrid_0').style.zIndex = 400;
    window.layer_GoogleHybrid_0 = L.tileLayer('https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', {
        pane: 'pane_GoogleHybrid_0',
        opacity: 1.0,
        attribution: '<a href="https://www.google.at/permissions/geoguidelines/attr-guide.html">Map data ©2015 Google</a>',
        minZoom: 1,
        maxZoom: 20,
        minNativeZoom: 0,
        maxNativeZoom: 20
    });
    map.addLayer(window.layer_GoogleHybrid_0);

    // Dark Matter
    map.createPane('pane_DarkMatter_1');
    map.getPane('pane_DarkMatter_1').style.zIndex = 401;
    window.layer_DarkMatter_1 = L.tileLayer('https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png', {
        pane: 'pane_DarkMatter_1',
        opacity: 1.0,
        attribution: '<a href="https://cartodb.com/basemaps/">Map tiles by CartoDB</a>',
        minZoom: 1,
        maxZoom: 20,
        minNativeZoom: 0,
        maxNativeZoom: 20
    });

    // OpenStreetMap
    map.createPane('pane_OpenStreetMap_2');
    map.getPane('pane_OpenStreetMap_2').style.zIndex = 402;
    window.layer_OpenStreetMap_2 = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        pane: 'pane_OpenStreetMap_2',
        opacity: 1.0,
        attribution: '© OpenStreetMap contributors',
        minZoom: 1,
        maxZoom: 20,
        minNativeZoom: 0,
        maxNativeZoom: 19
    });
}

// Add data layers
function addDataLayers() {
    // Région
    map.createPane('pane_Rgion_3');
    map.getPane('pane_Rgion_3').style.zIndex = 403;
    window.layer_Rgion_3 = createGeoJsonLayer(json_Rgion_3, 'Rgion_3', pop_Rgion_3, style_Rgion_3_0);
    window.bounds_group.addLayer(window.layer_Rgion_3);
    map.addLayer(window.layer_Rgion_3);
    allLayers['Région'] = window.layer_Rgion_3;

    // Département
    map.createPane('pane_Departement_4');
    map.getPane('pane_Departement_4').style.zIndex = 404;
    window.layer_Departement_4 = createGeoJsonLayer(json_Departement_4, 'Departement_4', pop_Departement_4, style_Departement_4_0);
    window.bounds_group.addLayer(window.layer_Departement_4);
    map.addLayer(window.layer_Departement_4);
    allLayers['Département'] = window.layer_Departement_4;

    // Arrondissement
    map.createPane('pane_Arrondissement_5');
    map.getPane('pane_Arrondissement_5').style.zIndex = 405;
    window.layer_Arrondissement_5 = createGeoJsonLayer(json_Arrondissement_5, 'Arrondissement_5', pop_Arrondissement_5, style_Arrondissement_5_0);
    window.bounds_group.addLayer(window.layer_Arrondissement_5);
    map.addLayer(window.layer_Arrondissement_5);
    allLayers['Arrondissement'] = window.layer_Arrondissement_5;

    // Routes
    map.createPane('pane_Routes_6');
    map.getPane('pane_Routes_6').style.zIndex = 406;
    window.layer_Routes_6 = createGeoJsonLayer(json_Routes_6, 'Routes_6', pop_Routes_6, style_Routes_6_0);
    window.bounds_group.addLayer(window.layer_Routes_6);
    map.addLayer(window.layer_Routes_6);
    allLayers['Routes'] = window.layer_Routes_6;

    // Localités
    map.createPane('pane_Localits_7');
    map.getPane('pane_Localits_7').style.zIndex = 407;
    window.layer_Localits_7 = new L.geoJson.multiStyle(json_Localits_7, {
        attribution: '',
        interactive: true,
        dataVar: 'json_Localits_7',
        layerName: 'layer_Localits_7',
        pane: 'pane_Localits_7',
        onEachFeature: pop_Localits_7,
        pointToLayers: [function (feature, latlng) {
            return L.shapeMarker(latlng, style_Localits_7_0(feature));
        },function (feature, latlng) {
            return L.shapeMarker(latlng, style_Localits_7_1(feature));
        }]
    });
    window.cluster_Localits_7 = new L.MarkerClusterGroup({showCoverageOnHover: false, spiderfyDistanceMultiplier: 2});
    window.cluster_Localits_7.addLayer(window.layer_Localits_7);
    window.bounds_group.addLayer(window.layer_Localits_7);
    window.cluster_Localits_7.addTo(map);
    allLayers['Localités'] = window.cluster_Localits_7;

    // Écoles
    map.createPane('pane_Ecoles_8');
    map.getPane('pane_Ecoles_8').style.zIndex = 408;
    window.layer_Ecoles_8 = new L.geoJson(json_Ecoles_8, {
        attribution: '',
        interactive: true,
        dataVar: 'json_Ecoles_8',
        layerName: 'layer_Ecoles_8',
        pane: 'pane_Ecoles_8',
        onEachFeature: pop_Ecoles_8,
        pointToLayer: function (feature, latlng) {
            return L.shapeMarker(latlng, style_Ecoles_8_0(feature));
        }
    });
    window.cluster_Ecoles_8 = new L.MarkerClusterGroup({showCoverageOnHover: false, spiderfyDistanceMultiplier: 2});
    window.cluster_Ecoles_8.addLayer(window.layer_Ecoles_8);
    window.bounds_group.addLayer(window.layer_Ecoles_8);
    window.cluster_Ecoles_8.addTo(map);
    allLayers['Écoles'] = window.cluster_Ecoles_8;
}

// Create GeoJSON layer helper
function createGeoJsonLayer(geojson, name, popupFn, styleFn) {
    return new L.geoJson(geojson, {
        attribution: '',
        interactive: true,
        dataVar: name,
        layerName: 'layer_' + name,
        onEachFeature: popupFn,
        style: styleFn
    });
}

// Setup layer control
function setupLayerControl() {
    const overlaysTree = [
        {label: '<img src="legend/Ecoles_8.png" /> Écoles', layer: window.cluster_Ecoles_8},
        {label: '<img src="legend/Localits_7.png" /> Localités', layer: window.cluster_Localits_7},
        {label: '<img src="legend/Routes_6.png" /> Routes', layer: window.layer_Routes_6},
        {label: 'Arrondissements', layer: window.layer_Arrondissement_5},
        {label: 'Départements', layer: window.layer_Departement_4},
        {label: '<img src="legend/Rgion_3.png" /> Région', layer: window.layer_Rgion_3}
    ];

    const layerControl = L.control.layers.tree(null, overlaysTree, {
        collapsed: false
    });
    
    const container = document.getElementById('layersControl');
    if (container) {
        // Add a simple layer list instead of the tree control
        const layerList = document.createElement('div');
        layerList.className = 'layers-list';
        
        overlaysTree.forEach(item => {
            const label = document.createElement('label');
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = map.hasLayer(item.layer);
            
            checkbox.addEventListener('change', function() {
                if (this.checked) {
                    map.addLayer(item.layer);
                } else {
                    map.removeLayer(item.layer);
                }
            });
            
            const text = document.createElement('span');
            text.innerHTML = item.label;
            
            label.appendChild(checkbox);
            label.appendChild(text);
            layerList.appendChild(label);
        });
        
        container.appendChild(layerList);
    }
}

// Create basemaps control in right panel
function createBasemapsControl() {
    const container = document.getElementById('basemapsControl');
    if (container) {
        const basemaps = [
            {name: 'Google Hybrid', layer: window.layer_GoogleHybrid_0, active: true},
            {name: 'Dark Matter', layer: window.layer_DarkMatter_1, active: false},
            {name: 'OpenStreetMap', layer: window.layer_OpenStreetMap_2, active: false}
        ];

        basemaps.forEach((bm, index) => {
            const div = document.createElement('div');
            div.className = 'basemap-item' + (bm.active ? ' active' : '');
            
            const radio = document.createElement('input');
            radio.type = 'radio';
            radio.name = 'basemap';
            radio.value = bm.name;
            radio.checked = bm.active;
            
            const label = document.createElement('label');
            label.style.cursor = 'pointer';
            label.appendChild(radio);
            label.appendChild(document.createTextNode(bm.name));
            
            radio.addEventListener('change', function() {
                if (this.checked) {
                    // Remove all basemaps
                    map.removeLayer(window.layer_GoogleHybrid_0);
                    map.removeLayer(window.layer_DarkMatter_1);
                    map.removeLayer(window.layer_OpenStreetMap_2);
                    
                    // Add selected basemap
                    map.addLayer(bm.layer);
                    
                    // Update UI
                    document.querySelectorAll('.basemap-item').forEach(el => {
                        el.classList.remove('active');
                    });
                    div.classList.add('active');
                }
            });
            
            div.appendChild(label);
            container.appendChild(div);
        });
    }
}

// Create legend
function createLegend() {
    const container = document.getElementById('legend');
    if (container) {
        const legendData = [
            {name: 'Région', color: 'rgba(152,125,183,0.0)', image: 'legend/Rgion_3.png'},
            {name: 'Département BIGNONA', color: 'rgba(210,89,229,1.0)'},
            {name: 'Département OUSSOUYE', color: 'rgba(15,138,215,1.0)'},
            {name: 'Département ZIGUINCHOR', color: 'rgba(112,234,96,1.0)'},
            {name: 'Arrondissement', color: 'rgba(50,242,152,1.0)'},
            {name: 'Routes', color: 'rgba(227,26,28,1.0)'},
            {name: 'Localités', color: 'rgba(255,0,0,1.0)', image: 'legend/Localits_7.png'},
            {name: 'Écoles', color: 'rgba(84,176,74,1.0)', image: 'legend/Ecoles_8.png'}
        ];

        legendData.forEach(item => {
            const div = document.createElement('div');
            div.className = 'legend-item';
            
            if (item.image) {
                const img = document.createElement('img');
                img.src = item.image;
                img.className = 'legend-symbol';
                img.style.width = '20px';
                img.style.height = '20px';
                div.appendChild(img);
            } else {
                const symbol = document.createElement('div');
                symbol.className = 'legend-symbol';
                symbol.style.backgroundColor = item.color;
                div.appendChild(symbol);
            }
            
            const label = document.createElement('span');
            label.textContent = item.name;
            div.appendChild(label);
            
            container.appendChild(div);
        });
    }
}

// Update coordinates and scale
function updateCoordinatesAndScale() {
    const center = map.getCenter();
    const zoom = map.getZoom();
    
    // Update coordinates
    const lat = center.lat.toFixed(6);
    const lng = center.lng.toFixed(6);
    document.getElementById('coordinates').textContent = `${lat}°, ${lng}°`;
    
    // Update zoom level
    document.getElementById('zoomLevel').textContent = zoom;
    
    // Update scale (approximate)
    const metersPerPixel = 40075017 * Math.cos(center.lat * Math.PI / 180) / Math.pow(2, zoom + 8);
    const scalePixels = 100;
    const scaleMeters = metersPerPixel * scalePixels;
    const scaleDisplay = scaleMeters > 1000 ? (scaleMeters / 1000).toFixed(1) + ' km' : scaleMeters.toFixed(0) + ' m';
    document.getElementById('scaleInfo').textContent = scaleDisplay + ' / 100px';
}

// Setup geolocation
function setupGeolocation() {
    const geolocateBtn = document.getElementById('geolocateBtn');
    
    geolocateBtn.addEventListener('click', function() {
        if ('geolocation' in navigator) {
            showToast('Localisation en cours...', 'info');
            
            navigator.geolocation.getCurrentPosition(
                function(position) {
                    const lat = position.coords.latitude;
                    const lng = position.coords.longitude;
                    const accuracy = position.coords.accuracy;
                    
                    currentLocation = {lat, lng, accuracy};
                    
                    // Remove old marker if exists
                    if (userMarker) {
                        map.removeLayer(userMarker);
                    }
                    
                    // Add new user marker
                    userMarker = L.circleMarker([lat, lng], {
                        radius: 8,
                        fillColor: '#3498db',
                        color: '#2980b9',
                        weight: 2,
                        opacity: 1,
                        fillOpacity: 0.8
                    }).addTo(map);
                    
                    // Add accuracy circle
                    const accuracyCircle = L.circle([lat, lng], accuracy, {
                        color: '#3498db',
                        fillColor: '#3498db',
                        fillOpacity: 0.1,
                        weight: 2
                    }).addTo(map);
                    
                    // Pan to location
                    map.setView([lat, lng], 15);
                    
                    // Bind popup
                    userMarker.bindPopup(`
                        <strong>Ma position</strong><br>
                        Latitude: ${lat.toFixed(6)}<br>
                        Longitude: ${lng.toFixed(6)}<br>
                        Précision: ±${accuracy.toFixed(0)}m
                    `).openPopup();
                    
                    showToast('Position trouvée!', 'success');
                },
                function(error) {
                    showToast('Impossible d\'accéder à votre position: ' + error.message, 'error');
                },
                {
                    enableHighAccuracy: true,
                    timeout: 5000,
                    maximumAge: 0
                }
            );
        } else {
            showToast('La géolocalisation n\'est pas disponible', 'error');
        }
    });
}

// Setup event listeners
function setupEventListeners() {
    // Menu toggle
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    
    menuToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
    });
    
    // Panel toggles
    document.getElementById('closeLeftPanel').addEventListener('click', function() {
        document.getElementById('leftPanel').classList.toggle('active');
    });
    
    document.getElementById('closeRightPanel').addEventListener('click', function() {
        document.getElementById('rightPanel').classList.toggle('active');
    });
    
    document.getElementById('togglePanels').addEventListener('click', function() {
        document.getElementById('leftPanel').classList.toggle('active');
        document.getElementById('rightPanel').classList.toggle('active');
    });
    
    // Fullscreen button
    document.getElementById('fullscreenBtn').addEventListener('click', function() {
        const mapContainer = document.getElementById('map');
        if (mapContainer.requestFullscreen) {
            mapContainer.requestFullscreen();
        } else if (mapContainer.webkitRequestFullscreen) {
            mapContainer.webkitRequestFullscreen();
        }
    });
    
    // Tool buttons
    document.getElementById('downloadGeoJSON').addEventListener('click', downloadGeoJSON);
    document.getElementById('downloadCSV').addEventListener('click', downloadCSV);
    document.getElementById('downloadKML').addEventListener('click', downloadKML);
}

// Setup modals
function setupModals() {
    // Modal links
    const modalLinks = document.querySelectorAll('.nav-link');
    
    modalLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const modalName = this.getAttribute('data-modal');
            const modal = document.getElementById(modalName + 'Modal');
            
            if (modal) {
                // Close all modals
                document.querySelectorAll('.modal').forEach(m => {
                    m.classList.remove('active');
                });
                
                // Open selected modal
                modal.classList.add('active');
            }
        });
    });
    
    // Close modals
    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', function() {
            this.closest('.modal').classList.remove('active');
        });
    });
    
    // Close on background click
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.classList.remove('active');
            }
        });
    });
    
    // Query button
    document.getElementById('queryBtn').addEventListener('click', function() {
        const attr = document.getElementById('attributeSelect').value;
        const value = document.getElementById('attributeValue').value;
        
        if (attr && value) {
            queryFeatures(attr, value);
            showToast('Recherche effectuée', 'success');
        } else {
            showToast('Veuillez remplir tous les champs', 'warning');
        }
    });
}

// Query features
function queryFeatures(attribute, value) {
    // Example query function
    // This would need to be customized based on your data
    selectedFeatures = [];
    
    window.layer_Departement_4.eachLayer(function(layer) {
        if (layer.feature.properties[attribute] === value) {
            selectedFeatures.push(layer);
            layer.setStyle({fillOpacity: 0.8});
        }
    });
    
    window.layer_Arrondissement_5.eachLayer(function(layer) {
        if (layer.feature.properties[attribute] === value) {
            selectedFeatures.push(layer);
            layer.setStyle({fillOpacity: 0.8});
        }
    });
}

// Download functions
function downloadGeoJSON() {
    const data = {
        type: 'FeatureCollection',
        features: []
    };
    
    window.bounds_group.eachLayer(function(layer) {
        if (layer.toGeoJSON) {
            data.features.push(layer.toGeoJSON());
        }
    });
    
    downloadFile(JSON.stringify(data, null, 2), 'geoziguinchor.geojson', 'application/json');
}

function downloadCSV() {
    let csv = 'Name,Latitude,Longitude,Type\n';
    
    window.bounds_group.eachLayer(function(layer) {
        if (layer.feature) {
            const props = layer.feature.properties;
            const coords = L.GeoJSON.coordsToLatLng(layer.feature.geometry.coordinates);
            csv += `"${props.name || ''}",${coords.lat},${coords.lng},${layer.feature.geometry.type}\n`;
        }
    });
    
    downloadFile(csv, 'geoziguinchor.csv', 'text/csv');
}

function downloadKML() {
    // Simplified KML export
    let kml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    kml += '<kml xmlns="http://www.opengis.net/kml/2.2">\n';
    kml += '<Document>\n';
    
    window.bounds_group.eachLayer(function(layer) {
        if (layer.toGeoJSON) {
            const feature = layer.toGeoJSON();
            const coords = feature.geometry.coordinates;
            kml += '<Placemark>\n';
            kml += `<name>${feature.properties.name || 'Feature'}</name>\n`;
            if (feature.geometry.type === 'Point') {
                kml += `<Point><coordinates>${coords[0]},${coords[1]}</coordinates></Point>\n`;
            }
            kml += '</Placemark>\n';
        }
    });
    
    kml += '</Document>\n</kml>';
    downloadFile(kml, 'geoziguinchor.kml', 'application/vnd.google-earth.kml+xml');
}

// Download file helper
function downloadFile(content, filename, type) {
    const blob = new Blob([content], {type: type});
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
}

// Set bounds
function setBounds() {
    if (window.bounds_group.getLayers().length) {
        map.fitBounds(window.bounds_group.getBounds(), {padding: [50, 50]});
    }
}

// Setup labels (from original code)
function setupLabels() {
    window.labels = [];
    window.totalMarkers = 0;
    
    let i = 0;
    window.layer_Departement_4.eachLayer(function(layer) {
        if (layer.feature.properties['Dept'] !== null) {
            layer.bindTooltip(
                `<div style="color: #e31a1c; font-size: 10pt; font-family: 'Times New Roman', sans-serif;">${layer.feature.properties['Dept']}</div>`,
                {permanent: true, offset: [-0, -16], className: 'css_Departement_4'}
            );
        }
        window.labels.push(layer);
        window.totalMarkers += 1;
        i++;
    });
    
    i = 0;
    window.layer_Arrondissement_5.eachLayer(function(layer) {
        if (layer.feature.properties['arr'] !== null) {
            layer.bindTooltip(
                `<div style="color: #323232; font-size: 10pt; font-weight: bold; font-family: 'Times New Roman', sans-serif;">${layer.feature.properties['arr']}</div>`,
                {permanent: true, offset: [-0, -16], className: 'css_Arrondissement_5'}
            );
        }
        window.labels.push(layer);
        window.totalMarkers += 1;
        i++;
    });
}

// Toast notification
function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = 'toast show ' + type;
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Highlight feature
function highlightFeature(e) {
    highlightLayer = e.target;
    
    if (e.target.feature.geometry.type === 'LineString' || e.target.feature.geometry.type === 'MultiLineString') {
        highlightLayer.setStyle({
            color: 'rgba(255, 255, 0, 1.00)',
        });
    } else {
        highlightLayer.setStyle({
            fillColor: 'rgba(255, 255, 0, 1.00)',
            fillOpacity: 1
        });
    }
    highlightLayer.openPopup();
}

// Remove focus from highlighted features
function removeFocusFromHighlightedFeatures(e) {
    for (var i in e.target._eventParents) {
        if (typeof e.target._eventParents[i].resetStyle === 'function') {
            e.target._eventParents[i].resetStyle(e.target);
        }
    }
    if (typeof e.target.closePopup == 'function') {
        e.target.closePopup();
    }
}

// Helper functions for popups
function removeEmptyRowsFromPopupContent(content, feature) {
    var tempDiv = document.createElement('div');
    tempDiv.innerHTML = content;
    var rows = tempDiv.querySelectorAll('tr');
    for (var i = rows.length - 1; i >= 0; i--) {
        var td = rows[i].querySelector('td.visible-with-data');
        var key = td ? td.id : '';
        if (td && td.classList.contains('visible-with-data') && feature.properties[key] == null) {
            rows[i].parentNode.removeChild(rows[i]);
        }
    }
    return tempDiv.innerHTML;
}

function addClassToPopupIfMedia(content, popup) {
    var tempDiv = document.createElement('div');
    tempDiv.innerHTML = content;
    var imgTd = tempDiv.querySelector('td img');
    if (imgTd) {
        var src = imgTd.getAttribute('src');
        if (/\.(jpg|jpeg|png|gif|bmp|webp|avif)$/i.test(src)) {
            popup._contentNode.classList.add('media');
        }
    }
}
