#!/usr/bin/env node
/**
 * GeoZiguinchor PWA Configuration Validator
 * Vérifie que tous les fichiers PWA sont correctement configurés
 * Utilisation: node check-pwa-config.js
 */

const fs = require('fs');
const path = require('path');

const BASE_PATH = __dirname;
const ERRORS = [];
const WARNINGS = [];
const SUCCESS = [];

console.log('\n🔍 GeoZiguinchor PWA Configuration Check\n');

// 1. Vérifier manifest.json
console.log('📋 Checking manifest.json...');
try {
    const manifest = JSON.parse(fs.readFileSync(path.join(BASE_PATH, 'manifest.json'), 'utf8'));
    
    // Vérifications obligatoires
    if (manifest.name && manifest.name.includes('Ziguinchor')) SUCCESS.push('✅ manifest.name configured');
    else ERRORS.push('❌ manifest.name incorrect');
    
    if (manifest.start_url === '/ziguinchor/index.html') SUCCESS.push('✅ start_url correct');
    else ERRORS.push(`❌ start_url incorrect: ${manifest.start_url}`);
    
    if (manifest.scope === '/ziguinchor/') SUCCESS.push('✅ scope correct');
    else ERRORS.push(`❌ scope incorrect: ${manifest.scope}`);
    
    if (manifest.display === 'standalone') SUCCESS.push('✅ display: standalone');
    else WARNINGS.push('⚠️ display should be "standalone"');
    
    if (manifest.icons && manifest.icons.length > 0) {
        SUCCESS.push(`✅ Icons configured (${manifest.icons.length})`);
        manifest.icons.forEach(icon => {
            if (!icon.src.startsWith('/ziguinchor/')) {
                WARNINGS.push(`⚠️ Icon path not GitHub Pages compatible: ${icon.src}`);
            }
        });
    } else ERRORS.push('❌ No icons configured');
    
} catch (error) {
    ERRORS.push(`❌ manifest.json invalid: ${error.message}`);
}

// 2. Vérifier sw.js
console.log('🔄 Checking sw.js...');
try {
    const swContent = fs.readFileSync(path.join(BASE_PATH, 'sw.js'), 'utf8');
    
    if (swContent.includes('v3.0.0')) SUCCESS.push('✅ Service Worker v3.0.0');
    else WARNINGS.push('⚠️ Service Worker version may not be v3.0.0');
    
    if (swContent.includes('cacheTilesStale')) SUCCESS.push('✅ Stale-While-Revalidate tile strategy');
    else ERRORS.push('❌ Tile caching strategy not found');
    
    if (swContent.includes('/ziguinchor/')) SUCCESS.push('✅ GitHub Pages paths in SW');
    else WARNINGS.push('⚠️ SW may not have GitHub Pages paths');
    
    if (swContent.includes('MAP_TILES_CACHE')) SUCCESS.push('✅ Map tiles cache defined');
    else ERRORS.push('❌ Map tiles cache not defined');
    
} catch (error) {
    ERRORS.push(`❌ sw.js not found or invalid: ${error.message}`);
}

// 3. Vérifier pwa-manager.js
console.log('💻 Checking js/pwa-manager.js...');
try {
    const pwaContent = fs.readFileSync(path.join(BASE_PATH, 'js', 'pwa-manager.js'), 'utf8');
    
    if (pwaContent.includes('GeoZiguinchorPWA')) SUCCESS.push('✅ PWA Manager class found');
    else ERRORS.push('❌ PWA Manager class not found');
    
    if (pwaContent.includes('registerServiceWorker')) SUCCESS.push('✅ SW registration method');
    else ERRORS.push('❌ SW registration method missing');
    
    if (pwaContent.includes('getLocation') && pwaContent.includes('toggleLocationTracking')) {
        SUCCESS.push('✅ Geolocation methods found');
    } else ERRORS.push('❌ Geolocation methods missing');
    
    if (pwaContent.includes('setupInstallation')) SUCCESS.push('✅ PWA installation setup');
    else ERRORS.push('❌ Installation setup missing');
    
} catch (error) {
    ERRORS.push(`❌ js/pwa-manager.js not found: ${error.message}`);
}

// 4. Vérifier css/pwa-ui.css
console.log('🎨 Checking css/pwa-ui.css...');
try {
    const cssContent = fs.readFileSync(path.join(BASE_PATH, 'css', 'pwa-ui.css'), 'utf8');
    
    if (cssContent.includes('.pwa-control-btn')) SUCCESS.push('✅ PWA control button styles');
    else ERRORS.push('❌ PWA button styles missing');
    
    if (cssContent.includes('#pwa-geolocate-btn')) SUCCESS.push('✅ GPS button styles');
    else ERRORS.push('❌ GPS button styles missing');
    
    if (cssContent.includes('#pwa-install-btn')) SUCCESS.push('✅ Install button styles');
    else ERRORS.push('❌ Install button styles missing');
    
    if (cssContent.includes('@media') || cssContent.includes('@supports')) {
        SUCCESS.push('✅ Responsive design included');
    } else WARNINGS.push('⚠️ No responsive design found');
    
} catch (error) {
    ERRORS.push(`❌ css/pwa-ui.css not found: ${error.message}`);
}

// 5. Vérifier index.html
console.log('📄 Checking index.html...');
try {
    const htmlContent = fs.readFileSync(path.join(BASE_PATH, 'index.html'), 'utf8');
    
    if (htmlContent.includes('pwa-ui.css')) SUCCESS.push('✅ PWA CSS linked');
    else ERRORS.push('❌ PWA CSS not linked in HTML');
    
    if (htmlContent.includes('pwa-manager.js')) SUCCESS.push('✅ PWA Manager script loaded');
    else ERRORS.push('❌ PWA Manager script not loaded');
    
    if (htmlContent.includes('/ziguinchor/manifest.json')) SUCCESS.push('✅ Manifest linked with correct path');
    else WARNINGS.push('⚠️ Manifest path may not be GitHub Pages compatible');
    
    if (htmlContent.includes('viewport') && htmlContent.includes('viewport-fit')) {
        SUCCESS.push('✅ Mobile viewport with notch support');
    } else WARNINGS.push('⚠️ Mobile viewport configuration incomplete');
    
    if (htmlContent.includes('https') || htmlContent.includes('manifest.json')) {
        SUCCESS.push('✅ HTML metadata configured');
    }
    
} catch (error) {
    ERRORS.push(`❌ index.html not found: ${error.message}`);
}

// 6. Vérifier les chemins des assets
console.log('📁 Checking file paths...');
const requiredFiles = [
    'manifest.json',
    'sw.js',
    'index.html',
    'js/pwa-manager.js',
    'css/pwa-ui.css'
];

requiredFiles.forEach(file => {
    if (fs.existsSync(path.join(BASE_PATH, file))) {
        SUCCESS.push(`✅ ${file} exists`);
    } else {
        ERRORS.push(`❌ ${file} missing`);
    }
});

// 7. Vérifier les images
console.log('🖼️  Checking PWA icons...');
const iconPaths = [
    'images/icon-192x192.png',
    'images/icon-512x512.png'
];

iconPaths.forEach(icon => {
    if (fs.existsSync(path.join(BASE_PATH, icon))) {
        SUCCESS.push(`✅ ${icon} exists`);
    } else {
        WARNINGS.push(`⚠️ ${icon} missing - PWA installation may not work properly`);
    }
});

// 8. Afficher le résumé
console.log('\n' + '='.repeat(60));
console.log('CHECK RESULTS');
console.log('='.repeat(60) + '\n');

if (SUCCESS.length > 0) {
    console.log('✅ SUCCESS:');
    SUCCESS.forEach(msg => console.log(`  ${msg}`));
    console.log();
}

if (WARNINGS.length > 0) {
    console.log('⚠️  WARNINGS:');
    WARNINGS.forEach(msg => console.log(`  ${msg}`));
    console.log();
}

if (ERRORS.length > 0) {
    console.log('❌ ERRORS:');
    ERRORS.forEach(msg => console.log(`  ${msg}`));
    console.log();
}

// Résumé final
console.log('='.repeat(60));
console.log(`Summary: ${SUCCESS.length} passed, ${WARNINGS.length} warnings, ${ERRORS.length} errors\n`);

if (ERRORS.length === 0) {
    console.log('🎉 Configuration is valid! Ready for deployment.\n');
    process.exit(0);
} else {
    console.log('❌ Please fix the errors above before deploying.\n');
    process.exit(1);
}
