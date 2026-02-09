#!/usr/bin/env node

/**
 * Icon Generator Script for GeoZiguinchor PWA
 * Generates PNG icons in multiple sizes from SVG source
 * 
 * Usage: node scripts/generate-icons.js
 * Requirements: npm install sharp
 */

const fs = require('fs');
const path = require('path');

// List of icon sizes to generate
const ICON_SIZES = [16, 32, 72, 96, 128, 144, 152, 180, 192, 384, 512];
const OUTPUT_DIR = path.join(__dirname, '../images');

// Check if sharp is available
let sharp;
try {
    sharp = require('sharp');
} catch (error) {
    console.error('❌ Error: sharp module not found');
    console.log('\nInstall it with: npm install sharp');
    console.log('Or use the web-based generator: generate-icons.html');
    process.exit(1);
}

async function generateIcons() {
    console.log('🎨 GeoZiguinchor Icon Generator');
    console.log('================================\n');

    // Ensure output directory exists
    if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR, { recursive: true });
        console.log(`✓ Created output directory: ${OUTPUT_DIR}`);
    }

    try {
        // Generate regular icons
        console.log('\n📦 Generating regular icons...');
        
        const svgPath = path.join(__dirname, '../images/icon-base.svg');
        if (!fs.existsSync(svgPath)) {
            throw new Error(`Source SVG not found: ${svgPath}`);
        }

        for (const size of ICON_SIZES) {
            const outputPath = path.join(OUTPUT_DIR, `icon-${size}x${size}.png`);
            
            await sharp(svgPath)
                .resize(size, size, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
                .png()
                .toFile(outputPath);
            
            console.log(`  ✓ icon-${size}x${size}.png`);
        }

        // Generate maskable icons
        console.log('\n🎭 Generating maskable icons...');
        
        const maskableSvgPath = path.join(__dirname, '../images/icon-maskable.svg');
        if (!fs.existsSync(maskableSvgPath)) {
            console.warn('⚠️  Maskable SVG not found, skipping maskable icons');
        } else {
            for (const size of [192, 512]) {
                const outputPath = path.join(OUTPUT_DIR, `icon-maskable-${size}x${size}.png`);
                
                await sharp(maskableSvgPath)
                    .resize(size, size, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
                    .png()
                    .toFile(outputPath);
                
                console.log(`  ✓ icon-maskable-${size}x${size}.png`);
            }
        }

        // Generate special sizes
        console.log('\n📱 Generating iOS icons...');
        
        const iosSize = 180;
        const iosPath = path.join(OUTPUT_DIR, `icon-180x180.png`);
        await sharp(svgPath)
            .resize(iosSize, iosSize, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
            .png()
            .toFile(iosPath);
        console.log(`  ✓ icon-180x180.png (iOS)`);

        console.log('\n✅ Icon generation completed!');
        console.log(`\n📂 Icons saved to: ${OUTPUT_DIR}`);
        console.log('\nYou can now:');
        console.log('1. Install the PWA from your browser');
        console.log('2. Use "Add to Home Screen" on mobile devices');
        console.log('3. Deploy to production');

    } catch (error) {
        console.error('\n❌ Error generating icons:', error.message);
        process.exit(1);
    }
}

// Run generator
generateIcons();
