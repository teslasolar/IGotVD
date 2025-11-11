#!/usr/bin/env node

/**
 * Auto-generate desktops manifest for IGotVD
 * Scans all HTML files in root and extracts metadata
 * Run: node generate-manifest.js
 */

const fs = require('fs');
const path = require('path');

// Files to exclude from desktop list
const EXCLUDE_FILES = ['index.html', 'generate-manifest.js'];

// Theme emoji mapping
const THEME_ICONS = {
    'cyber': '🖥️',
    'neural': '🧠',
    'quantum': '⚛️',
    'retro': '🌆',
    'hacker': '👾',
    'cube': '🧬',
    'entropy': '⚖️',
    'compiler': '🔮',
    'biotech': '🧬',
    'default': '💻'
};

function extractMetadata(htmlContent, filename) {
    const metadata = {
        name: '',
        file: filename,
        icon: '💻',
        theme: 'default',
        description: '',
        features: []
    };

    // Extract title
    const titleMatch = htmlContent.match(/<title>(.*?)<\/title>/i);
    if (titleMatch) {
        metadata.name = titleMatch[1].trim();
    }

    // Try to detect theme from CSS variables or classes
    const themePatterns = {
        'cyber': /#00ff41|cyberpunk|cyber|matrix/i,
        'neural': /#b366ff|neural|neuro|brain/i,
        'quantum': /#00ffff|quantum|qubit/i,
        'retro': /#ff00ff|retro|vaporwave|synthwave/i,
        'hacker': /hacker|h4ck|elite/i,
        'biotech': /#00ff88|biotech|genetic|dna|crispr/i,
        'cube': /konomi|cube/i,
        'entropy': /entropy|phi/i,
        'compiler': /compiler|emoji/i
    };

    for (const [theme, pattern] of Object.entries(themePatterns)) {
        if (pattern.test(htmlContent)) {
            metadata.theme = theme;
            metadata.icon = THEME_ICONS[theme] || THEME_ICONS.default;
            break;
        }
    }

    // Extract description from meta tag or first paragraph
    const descMatch = htmlContent.match(/<meta\s+name=["']description["']\s+content=["'](.*?)["']/i);
    if (descMatch) {
        metadata.description = descMatch[1].trim();
    } else {
        // Try to extract from title or create generic description
        metadata.description = `${metadata.name} - Interactive virtual desktop environment`;
    }

    // Try to extract features from window titles
    const windowMatches = htmlContent.matchAll(/data-title=["'](.*?)["']/g);
    const features = new Set();

    for (const match of windowMatches) {
        const title = match[1].trim();
        if (title && title.length < 50) {
            features.add(title);
        }
    }

    // Also check for app-icon titles
    const appMatches = htmlContent.matchAll(/<div\s+class=["']app-icon["'][^>]*>\s*<div[^>]*>[^<]*<\/div>\s*<div>(.*?)<\/div>/g);
    for (const match of appMatches) {
        const appName = match[1].trim();
        if (appName && appName.length < 50) {
            features.add(appName);
        }
    }

    metadata.features = Array.from(features).slice(0, 6);

    // If no features found, add generic ones
    if (metadata.features.length === 0) {
        metadata.features = [
            'Interactive windows',
            'Desktop environment',
            'Custom applications',
            'Theme styling'
        ];
    }

    return metadata;
}

function generateManifest() {
    console.log('🔍 Scanning for HTML desktop files...\n');

    const files = fs.readdirSync(__dirname)
        .filter(file => {
            return file.endsWith('.html') &&
                   !EXCLUDE_FILES.includes(file) &&
                   fs.statSync(path.join(__dirname, file)).isFile();
        })
        .sort();

    console.log(`Found ${files.length} desktop HTML files:\n`);

    const desktops = [];

    for (const file of files) {
        try {
            const htmlPath = path.join(__dirname, file);
            const htmlContent = fs.readFileSync(htmlPath, 'utf8');
            const metadata = extractMetadata(htmlContent, file);

            desktops.push(metadata);
            console.log(`✓ ${file}`);
            console.log(`  📝 ${metadata.name}`);
            console.log(`  ${metadata.icon} ${metadata.theme}`);
            console.log(`  🔧 ${metadata.features.length} features detected\n`);
        } catch (error) {
            console.error(`✗ Error processing ${file}:`, error.message);
        }
    }

    // Write manifest
    const manifestPath = path.join(__dirname, 'desktops.json');
    fs.writeFileSync(
        manifestPath,
        JSON.stringify({ desktops, generated: new Date().toISOString() }, null, 2)
    );

    console.log(`\n✅ Generated manifest with ${desktops.length} desktops`);
    console.log(`📄 Saved to: desktops.json`);
    console.log(`\n🚀 You can now open index.html - it will auto-load from the manifest!`);

    return desktops;
}

// Run if called directly
if (require.main === module) {
    try {
        generateManifest();
    } catch (error) {
        console.error('❌ Error generating manifest:', error.message);
        process.exit(1);
    }
}

module.exports = { generateManifest };
