/**
 * IGotVD Static API - Client-Side API for GitHub Pages
 * Simulates REST API using static JSON files and localStorage
 * Works entirely in the browser - no server needed!
 */

class StaticAPI {
    constructor(baseURL = '') {
        this.baseURL = baseURL;
        this.cache = new Map();
        this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
    }

    /**
     * GET /api/health
     * Returns system health status
     */
    async getHealth() {
        return {
            status: 'healthy',
            timestamp: new Date().toISOString(),
            mode: 'static',
            platform: 'github-pages'
        };
    }

    /**
     * GET /api/info
     * Returns system information
     */
    async getInfo() {
        return {
            name: 'IGotVD Static API',
            version: '1.0.0',
            description: 'Client-side API for GitHub Pages',
            mode: 'static',
            features: [
                'Desktop management',
                'Manifest serving',
                'Client-side caching',
                'localStorage state'
            ],
            browser: {
                userAgent: navigator.userAgent,
                language: navigator.language,
                platform: navigator.platform,
                cookieEnabled: navigator.cookieEnabled
            }
        };
    }

    /**
     * GET /api/manifest
     * Fetch manifest from static JSON file
     */
    async getManifest() {
        const cacheKey = 'manifest';

        // Check cache first
        if (this.cache.has(cacheKey)) {
            const cached = this.cache.get(cacheKey);
            if (Date.now() - cached.timestamp < this.cacheTimeout) {
                console.log('📦 Serving manifest from cache');
                return cached.data;
            }
        }

        try {
            const response = await fetch(`${this.baseURL}desktops.json`);
            if (!response.ok) {
                throw new Error(`Failed to fetch manifest: ${response.status}`);
            }

            const data = await response.json();

            // Cache it
            this.cache.set(cacheKey, {
                data,
                timestamp: Date.now()
            });

            console.log('📥 Fetched manifest from file');
            return data;
        } catch (error) {
            console.error('Error fetching manifest:', error);
            throw error;
        }
    }

    /**
     * GET /api/desktops
     * List all desktops from manifest
     */
    async getDesktops() {
        const manifest = await this.getManifest();

        return {
            count: manifest.desktops.length,
            desktops: manifest.desktops.map(desktop => ({
                ...desktop,
                url: `${this.baseURL}${desktop.file}`,
                modularUrl: `${this.baseURL}desktop.html?mode=${this.getDesktopMode(desktop.file)}`
            })),
            generated: manifest.generated
        };
    }

    /**
     * GET /api/desktops/:name
     * Get specific desktop info
     */
    async getDesktop(name) {
        const manifest = await this.getManifest();

        // Try to find by file name match
        const desktop = manifest.desktops.find(d =>
            d.file === `${name}.html` ||
            d.file === name ||
            this.getDesktopMode(d.file) === name
        );

        if (!desktop) {
            throw new Error(`Desktop '${name}' not found`);
        }

        return {
            ...desktop,
            url: `${this.baseURL}${desktop.file}`,
            modularUrl: `${this.baseURL}desktop.html?mode=${this.getDesktopMode(desktop.file)}`,
            modular: {
                available: true, // Assume available
                mode: this.getDesktopMode(desktop.file)
            }
        };
    }

    /**
     * GET /api/desktops/:name/content
     * Fetch desktop HTML content
     */
    async getDesktopContent(name) {
        const desktop = await this.getDesktop(name);

        try {
            const response = await fetch(desktop.url);
            if (!response.ok) {
                throw new Error(`Failed to fetch desktop: ${response.status}`);
            }

            const html = await response.text();

            return {
                name: desktop.name,
                file: desktop.file,
                content: html,
                size: html.length
            };
        } catch (error) {
            console.error('Error fetching desktop content:', error);
            throw error;
        }
    }

    /**
     * POST /api/favorites/add
     * Add desktop to favorites (localStorage)
     */
    async addFavorite(desktopName) {
        const favorites = this.getFavorites();

        if (!favorites.includes(desktopName)) {
            favorites.push(desktopName);
            localStorage.setItem('igotvd_favorites', JSON.stringify(favorites));
        }

        return {
            success: true,
            favorites: favorites
        };
    }

    /**
     * POST /api/favorites/remove
     * Remove desktop from favorites
     */
    async removeFavorite(desktopName) {
        let favorites = this.getFavorites();
        favorites = favorites.filter(f => f !== desktopName);
        localStorage.setItem('igotvd_favorites', JSON.stringify(favorites));

        return {
            success: true,
            favorites: favorites
        };
    }

    /**
     * GET /api/favorites
     * Get user's favorite desktops
     */
    getFavorites() {
        const stored = localStorage.getItem('igotvd_favorites');
        return stored ? JSON.parse(stored) : [];
    }

    /**
     * POST /api/recent/add
     * Add to recently viewed (localStorage)
     */
    async addRecent(desktopName) {
        let recent = this.getRecent();

        // Remove if already exists
        recent = recent.filter(r => r.name !== desktopName);

        // Add to beginning
        recent.unshift({
            name: desktopName,
            timestamp: new Date().toISOString()
        });

        // Keep only last 10
        recent = recent.slice(0, 10);

        localStorage.setItem('igotvd_recent', JSON.stringify(recent));

        return {
            success: true,
            recent: recent
        };
    }

    /**
     * GET /api/recent
     * Get recently viewed desktops
     */
    getRecent() {
        const stored = localStorage.getItem('igotvd_recent');
        return stored ? JSON.parse(stored) : [];
    }

    /**
     * GET /api/stats
     * Get usage statistics from localStorage
     */
    async getStats() {
        const favorites = this.getFavorites();
        const recent = this.getRecent();
        const manifest = await this.getManifest();

        return {
            totalDesktops: manifest.desktops.length,
            favoritesCount: favorites.length,
            recentCount: recent.length,
            lastViewed: recent[0] || null,
            cacheSize: this.cache.size,
            storageUsed: this.getStorageUsed()
        };
    }

    /**
     * POST /api/settings/save
     * Save user settings to localStorage
     */
    async saveSettings(settings) {
        localStorage.setItem('igotvd_settings', JSON.stringify(settings));

        return {
            success: true,
            settings: settings
        };
    }

    /**
     * GET /api/settings
     * Get user settings from localStorage
     */
    getSettings() {
        const stored = localStorage.getItem('igotvd_settings');
        return stored ? JSON.parse(stored) : {
            theme: 'dark',
            defaultDesktop: 'cyber',
            autoSave: true,
            notifications: true
        };
    }

    /**
     * GET /api/search?q=query
     * Search desktops by name or description
     */
    async search(query) {
        const manifest = await this.getManifest();
        const lowerQuery = query.toLowerCase();

        const results = manifest.desktops.filter(desktop =>
            desktop.name.toLowerCase().includes(lowerQuery) ||
            desktop.description.toLowerCase().includes(lowerQuery) ||
            desktop.theme.toLowerCase().includes(lowerQuery) ||
            desktop.features.some(f => f.toLowerCase().includes(lowerQuery))
        );

        return {
            query: query,
            count: results.length,
            results: results
        };
    }

    /**
     * GET /api/themes
     * List available themes
     */
    async getThemes() {
        const manifest = await this.getManifest();
        const themes = [...new Set(manifest.desktops.map(d => d.theme))];

        return {
            count: themes.length,
            themes: themes.map(theme => ({
                name: theme,
                desktops: manifest.desktops.filter(d => d.theme === theme).length
            }))
        };
    }

    /**
     * Helper: Extract desktop mode from filename
     */
    getDesktopMode(filename) {
        return filename
            .replace('.html', '')
            .replace('_desktop', '')
            .replace('_', '');
    }

    /**
     * Helper: Get localStorage usage
     */
    getStorageUsed() {
        let total = 0;
        for (let key in localStorage) {
            if (localStorage.hasOwnProperty(key)) {
                total += localStorage[key].length + key.length;
            }
        }
        return Math.round(total / 1024); // KB
    }

    /**
     * Clear cache
     */
    clearCache() {
        this.cache.clear();
        console.log('🧹 Cache cleared');
    }

    /**
     * Export all user data
     */
    exportData() {
        return {
            favorites: this.getFavorites(),
            recent: this.getRecent(),
            settings: this.getSettings(),
            exported: new Date().toISOString()
        };
    }

    /**
     * Import user data
     */
    importData(data) {
        if (data.favorites) {
            localStorage.setItem('igotvd_favorites', JSON.stringify(data.favorites));
        }
        if (data.recent) {
            localStorage.setItem('igotvd_recent', JSON.stringify(data.recent));
        }
        if (data.settings) {
            localStorage.setItem('igotvd_settings', JSON.stringify(data.settings));
        }

        return {
            success: true,
            message: 'Data imported successfully'
        };
    }

    /**
     * Clear all user data
     */
    clearAllData() {
        localStorage.removeItem('igotvd_favorites');
        localStorage.removeItem('igotvd_recent');
        localStorage.removeItem('igotvd_settings');
        this.clearCache();

        return {
            success: true,
            message: 'All data cleared'
        };
    }
}

// Create global instance
window.StaticAPI = StaticAPI;
window.api = new StaticAPI();

// Console helpers
console.log('📡 IGotVD Static API loaded!');
console.log('Usage: api.getDesktops(), api.getHealth(), api.getFavorites()');

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = StaticAPI;
}
