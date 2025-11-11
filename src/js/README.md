# Static API for GitHub Pages

## Overview

The **Static API** is a client-side API system that works entirely in the browser using static JSON files and localStorage. No server required!

## How It Works

Instead of a Node.js server, the Static API:

1. **Fetches static JSON files** (like `desktops.json`)
2. **Uses localStorage** for user data (favorites, recent, settings)
3. **Provides API-like methods** that JavaScript can call
4. **Works on GitHub Pages** (100% client-side)

## Quick Start

### 1. Load the Static API

```html
<script src="src/js/static-api.js"></script>
```

### 2. Use the API

```javascript
// The API is available as global `api` object

// Get all desktops
const desktops = await api.getDesktops();
console.log(desktops);

// Search desktops
const results = await api.search('cyber');
console.log(results);

// Add to favorites
await api.addFavorite('space');

// Get favorites
const favorites = api.getFavorites();
console.log(favorites);
```

## API Methods

### Health & Info

```javascript
// Health check
await api.getHealth();
// Returns: { status, timestamp, mode, platform }

// System info
await api.getInfo();
// Returns: { name, version, description, features, browser }

// Statistics
await api.getStats();
// Returns: { totalDesktops, favoritesCount, recentCount, ... }
```

### Desktop Management

```javascript
// Get manifest
await api.getManifest();
// Returns: { desktops: [...], generated: "..." }

// List all desktops
await api.getDesktops();
// Returns: { count, desktops: [...] }

// Get specific desktop
await api.getDesktop('cyber');
// Returns: { name, file, url, modularUrl, ... }

// Get desktop HTML content
await api.getDesktopContent('cyber');
// Returns: { name, file, content, size }

// Get themes
await api.getThemes();
// Returns: { count, themes: [...] }
```

### Search

```javascript
// Search desktops
await api.search('quantum');
// Returns: { query, count, results: [...] }
```

### Favorites (localStorage)

```javascript
// Get favorites
api.getFavorites();
// Returns: ['cyber', 'space', ...]

// Add favorite
await api.addFavorite('cyber');
// Returns: { success: true, favorites: [...] }

// Remove favorite
await api.removeFavorite('cyber');
// Returns: { success: true, favorites: [...] }
```

### Recent (localStorage)

```javascript
// Get recent
api.getRecent();
// Returns: [{ name, timestamp }, ...]

// Add to recent
await api.addRecent('space');
// Returns: { success: true, recent: [...] }
```

### Settings (localStorage)

```javascript
// Get settings
api.getSettings();
// Returns: { theme, defaultDesktop, autoSave, notifications }

// Save settings
await api.saveSettings({
    theme: 'dark',
    defaultDesktop: 'cyber',
    autoSave: true,
    notifications: true
});
// Returns: { success: true, settings: {...} }
```

### Data Management

```javascript
// Export all user data
api.exportData();
// Returns: { favorites, recent, settings, exported }

// Import user data
api.importData(data);
// Returns: { success: true, message }

// Clear cache
api.clearCache();

// Clear all user data
api.clearAllData();
// Returns: { success: true, message }

// Get storage usage
api.getStorageUsed();
// Returns: KB used
```

## Features

### ✅ Works on GitHub Pages
- No server required
- All client-side JavaScript
- Uses static JSON files
- localStorage for state

### ✅ Caching
- Automatic caching (5 minute timeout)
- Reduces redundant fetches
- Cache clearing available

### ✅ User Data Persistence
- Favorites stored in localStorage
- Recent desktops tracked
- Settings preserved
- Export/import functionality

### ✅ Search
- Search by name, description, theme, features
- Case-insensitive
- Real-time results

## Usage Example

### Desktop Switcher with Favorites

```javascript
// Load desktops
const { desktops } = await api.getDesktops();

// Get user's favorites
const favorites = api.getFavorites();

// Display desktops, mark favorites
desktops.forEach(desktop => {
    const isFavorite = favorites.includes(desktop.file);
    console.log(`${desktop.name} ${isFavorite ? '⭐' : ''}`);
});

// Add favorite on click
async function toggleFavorite(desktopName) {
    const favorites = api.getFavorites();

    if (favorites.includes(desktopName)) {
        await api.removeFavorite(desktopName);
    } else {
        await api.addFavorite(desktopName);
    }
}
```

### Track Recently Viewed

```javascript
// When user opens a desktop
async function openDesktop(desktopName) {
    // Track in recent
    await api.addRecent(desktopName);

    // Load desktop
    window.location.href = `desktop.html?mode=${desktopName}`;
}

// Show recent list
const recent = api.getRecent();
recent.forEach(item => {
    console.log(`${item.name} - ${new Date(item.timestamp).toLocaleString()}`);
});
```

### Search Functionality

```javascript
// Search input
const searchInput = document.getElementById('search');

searchInput.addEventListener('input', async (e) => {
    const query = e.target.value;

    if (query.length >= 2) {
        const results = await api.search(query);
        displayResults(results.results);
    }
});
```

## Demo

Open `api-demo.html` to see the Static API in action with a full interactive demo.

## Comparison: Server API vs Static API

| Feature | Server API | Static API |
|---------|-----------|------------|
| Works on GitHub Pages | ❌ No | ✅ Yes |
| List desktops | ✅ Yes | ✅ Yes |
| Get manifest | ✅ Yes | ✅ Yes |
| Search desktops | ✅ Yes | ✅ Yes |
| Favorites | ❌ Needs DB | ✅ localStorage |
| Recent items | ❌ Needs DB | ✅ localStorage |
| Settings | ❌ Needs DB | ✅ localStorage |
| Generate manifest | ✅ Yes | ❌ Use GitHub Actions |
| Real-time updates | ✅ Yes | ❌ Requires refresh |
| Authentication | ✅ Possible | ❌ Not needed |

## When to Use

### Use Static API (GitHub Pages)
- Deploying to GitHub Pages
- No server available
- Simple use cases
- Don't need real-time updates
- User data is personal (favorites, etc.)

### Use Server API
- Need dynamic manifest generation
- Real-time updates required
- Multiple users with shared data
- Advanced features (auth, analytics)
- Not hosting on GitHub Pages

## Browser Support

Works in all modern browsers that support:
- ES6+ JavaScript
- Fetch API
- localStorage
- Promises/async-await

## Storage Limits

localStorage has ~5-10MB limit per origin. The Static API stores:
- Favorites: ~1KB
- Recent: ~2KB (last 10)
- Settings: ~1KB
- Cache: Temporary (cleared on page refresh)

**Total:** ~4KB typical usage

## Security

- All data stored in user's browser
- No data sent to servers
- localStorage is same-origin only
- No sensitive data stored
- Export/import for backup

## Integration

The Static API integrates seamlessly with the modular desktop system:

```javascript
// In desktop.html
<script src="src/js/static-api.js"></script>
<script>
    // API is now available
    async function loadDesktops() {
        const data = await api.getDesktops();
        // Use data to populate UI
    }
</script>
```

## License

Same as IGotVD project.
