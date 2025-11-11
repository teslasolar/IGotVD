# 🏗️ IGotVD Modular System

## Overview

The IGotVD project has been refactored into a **modular architecture** that separates concerns and enables code reuse across all virtual desktops.

## 🎯 Benefits

- **Code Reusability**: Window management, notifications, and UI components are shared
- **Maintainability**: Changes to core features affect all desktops
- **Performance**: Load only the needed modules
- **Scalability**: Easy to add new desktop environments
- **File Organization**: Clean directory structure
- **Development Speed**: Build new desktops faster using existing components

## 📁 Directory Structure

```
IGotVD/
├── desktop.html              # Unified desktop loader (NEW!)
├── index.html                # Desktop collection browser
├── src/                      # Modular source (NEW!)
│   ├── ARCHITECTURE.md       # Detailed architecture docs
│   ├── css/
│   │   ├── core.css          # Base styles, resets, utilities
│   │   ├── components.css    # Shared component styles
│   │   └── themes.css        # Theme color definitions (TODO)
│   ├── js/
│   │   ├── core.js           # Window management, desktop base
│   │   ├── components.js     # Reusable UI components (TODO)
│   │   └── desktop-loader.js # Desktop mode switcher (TODO)
│   ├── components/           # Reusable components (TODO)
│   │   ├── window.js
│   │   ├── taskbar.js
│   │   ├── notifications.js
│   │   └── ...
│   ├── modules/              # Desktop-specific modules
│   │   ├── cyber.js          # CyberOS (IMPLEMENTED!)
│   │   ├── neural.js         # NeuroNet (TODO)
│   │   ├── quantum.js        # Quantum (TODO)
│   │   └── ...               # 7 more modules (TODO)
│   └── themes/               # Theme CSS files
│       ├── cyber-theme.css   # Cyber theme (IMPLEMENTED!)
│       ├── neural-theme.css  # (TODO)
│       └── ...               # 9 more themes (TODO)
├── [legacy HTML files]       # Original standalone files (kept for reference)
└── docs/                     # Documentation
```

## 🚀 Quick Start

### Using the Modular System

Open `desktop.html` in your browser:

```bash
# Default desktop (CyberOS)
open desktop.html

# Specific desktop
open desktop.html?mode=cyber
open desktop.html?mode=neural
open desktop.html?mode=space
```

### Keyboard Shortcuts

- **Ctrl+Shift+D**: Show desktop switcher
- **ESC**: Close switcher

### URL Parameters

- `?mode=cyber` - Load CyberOS
- `?mode=neural` - Load NeuroNet
- `?mode=quantum` - Load QuantumOS
- ... (10 total desktops)

## 🏗️ Core Architecture

### 1. Window Management System

The `WindowManager` class provides:

```javascript
const wm = new IGotVD.WindowManager();

// Create window
const id = wm.createWindow({
    id: 'my-window',
    title: 'My App',
    content: '<div>Hello!</div>',
    width: 600,
    height: 400,
    x: 100,
    y: 100
});

// Control windows
wm.openWindow(id);
wm.closeWindow(id);
wm.minimizeWindow(id);
wm.maximizeWindow(id);
wm.bringToFront(id);
```

Features:
- Draggable windows
- Minimize/Maximize/Close
- Z-index management
- Automatic event handling

### 2. Notification System

The `NotificationManager` provides toast notifications:

```javascript
const nm = new IGotVD.NotificationManager();

nm.success('Operation successful!');
nm.error('Something went wrong');
nm.warning('Please note...');
nm.info('For your information');

// Custom notification
nm.show('Message', {
    title: 'Title',
    type: 'success',
    duration: 3000
});
```

### 3. Desktop Base Class

All desktops extend the `Desktop` base class:

```javascript
class MyDesktop extends IGotVD.Desktop {
    constructor() {
        super('MyDesktop', 'mytheme');
    }

    createBackground() {
        // Custom background effects
    }

    createTaskbar() {
        // Custom taskbar
    }

    async initializeDesktop() {
        // Initialize apps and features
    }

    cleanup() {
        // Cleanup on desktop switch
        super.cleanup();
    }
}
```

### 4. Utility Classes

```javascript
// Clock
const clock = new IGotVD.Clock('element-id');
clock.start();
clock.stop();

// Stats Monitor
const stats = new IGotVD.StatsMonitor();
const metrics = stats.update(); // { fps, memory, cpu }
```

## 🎨 Creating a New Desktop

### Step 1: Create Theme CSS

`src/themes/mytheme-theme.css`:

```css
:root[data-theme="mytheme"] {
    --primary: #ff00ff;
    --primary-rgb: 255, 0, 255;
    --secondary: #ff69b4;
    --accent: #ffc0cb;
    --bg-dark: #1a0033;
    --bg-darker: #0d001a;
    --text: #f0e6ff;
    --border: rgba(255, 0, 255, 0.3);
    --glow: rgba(255, 0, 255, 0.5);
}
```

### Step 2: Create Desktop Module

`src/modules/mytheme.js`:

```javascript
class MyDesktop extends IGotVD.Desktop {
    constructor() {
        super('MyDesktop', 'mytheme');
    }

    createBackground() {
        const bg = document.querySelector('.background-layer');
        bg.innerHTML = '<div>My custom background</div>';
    }

    createTaskbar() {
        const taskbar = document.createElement('div');
        taskbar.className = 'taskbar';
        taskbar.innerHTML = `
            <div class="taskbar-left">
                <div>🎨 MyDesktop</div>
            </div>
            <div class="taskbar-right">
                <div id="clock"></div>
            </div>
        `;
        document.querySelector('.desktop').appendChild(taskbar);
    }

    async initializeDesktop() {
        this.clock = new IGotVD.Clock('clock');
        this.clock.start();

        this.notificationManager.success('Welcome to MyDesktop!');
    }

    cleanup() {
        if (this.clock) this.clock.stop();
        super.cleanup();
    }
}

window.MyDesktop = MyDesktop;
```

### Step 3: Register in desktop.html

Add to the `DESKTOPS` object:

```javascript
mytheme: {
    name: 'MyDesktop',
    icon: '🎨',
    description: 'My custom desktop environment',
    module: 'src/modules/mytheme.js',
    class: 'MyDesktop'
}
```

### Step 4: Test

```bash
open desktop.html?mode=mytheme
```

## 📦 Component Library

### Window

```javascript
const windowId = this.windowManager.createWindow({
    id: 'unique-id',
    title: '📝 Window Title',
    content: '<div>Content</div>',
    width: 600,
    height: 400,
    x: 100,
    y: 100
});

this.windowManager.openWindow(windowId);
```

### Card

```html
<div class="card">
    <div class="card-title">Title</div>
    <div class="card-content">Content</div>
</div>
```

### Progress Bar

```html
<div class="progress-bar">
    <div class="progress-fill" style="width: 75%;"></div>
    <div class="progress-text">75%</div>
</div>
```

### Button

```html
<button class="btn">Primary Button</button>
<button class="btn btn-secondary">Secondary Button</button>
<button class="btn btn-danger">Danger Button</button>
```

### Input

```html
<input type="text" placeholder="Enter text...">
```

### Badge

```html
<span class="badge">Default</span>
<span class="badge badge-success">Success</span>
<span class="badge badge-warning">Warning</span>
<span class="badge badge-danger">Danger</span>
```

## 🎯 Implementation Status

### ✅ Completed

- [x] Modular directory structure
- [x] Core CSS (base styles, utilities, animations)
- [x] Components CSS (windows, taskbar, cards, forms)
- [x] Core JS (WindowManager, NotificationManager, Desktop base)
- [x] Cyber theme CSS
- [x] CyberOS desktop module
- [x] Unified desktop.html loader
- [x] Desktop switcher UI
- [x] Architecture documentation

### 🚧 In Progress

- [ ] Complete remaining 9 theme CSS files
- [ ] Complete remaining 9 desktop modules
- [ ] Component JavaScript library
- [ ] Additional utility functions

### 📋 TODO

- [ ] Convert all 10 legacy HTML files to modules
- [ ] Create desktop configuration UI
- [ ] Implement save/load desktop layouts
- [ ] Add plugin system
- [ ] Mobile responsive improvements
- [ ] Accessibility enhancements
- [ ] Performance optimizations
- [ ] Comprehensive testing

## 🧪 Testing

### Test CyberOS (implemented)

```bash
open desktop.html?mode=cyber
```

Expected:
- Green Matrix aesthetic
- Working terminal with commands
- File manager
- System monitor
- Code editor
- Browser

### Test Desktop Switcher

1. Press **Ctrl+Shift+D**
2. See all 10 desktops
3. Click on available desktops
4. "Coming Soon" desktops show badge

## 📝 Migration Guide

### For Users

**Old way:**
```html
<!-- Open standalone file -->
open cyberOS_desktop.html
```

**New way:**
```html
<!-- Use unified loader -->
open desktop.html?mode=cyber
```

### For Developers

**Old way:**
```html
<!-- Duplicate window code in each file -->
<script>
  function createWindow() { /* ... */ }
</script>
```

**New way:**
```javascript
// Use shared window manager
const wm = new IGotVD.WindowManager();
const id = wm.createWindow({ /* ... */ });
wm.openWindow(id);
```

## 🔧 Development Workflow

### Adding a New App to CyberOS

```javascript
// In src/modules/cyber.js

openMyNewApp() {
    const content = `<div>My app content</div>`;

    const windowId = this.windowManager.createWindow({
        id: 'my-new-app',
        title: '📱 My New App',
        content: content,
        width: 500,
        height: 400,
        x: 150,
        y: 150
    });

    this.windowManager.openWindow(windowId);
}

// Add to taskbar in createTaskbar()
<div class="app-icon" data-app="mynewapp">📱 My App</div>

// Add to openApp() switch
case 'mynewapp':
    this.openMyNewApp();
    break;
```

## 🐛 Troubleshooting

### Desktop won't load

1. Check browser console for errors
2. Verify module path is correct
3. Ensure class name matches in desktop.html
4. Check theme CSS exists

### Windows won't drag

- Ensure `window-header` class is present
- Check z-index management
- Verify WindowManager is initialized

### Styles not applying

- Check theme CSS is loaded
- Verify `data-theme` attribute is set
- Inspect CSS custom properties

## 📚 Additional Resources

- [ARCHITECTURE.md](src/ARCHITECTURE.md) - Detailed architecture documentation
- [Core CSS](src/css/core.css) - Base styles and utilities
- [Components CSS](src/css/components.css) - Component library
- [Core JS](src/js/core.js) - JavaScript core system
- [CyberOS Module](src/modules/cyber.js) - Example desktop module

## 🤝 Contributing

To add a new desktop:

1. Create theme CSS in `src/themes/`
2. Create module JS in `src/modules/`
3. Register in `desktop.html` DESKTOPS object
4. Test with `?mode=yourdesktop`
5. Submit PR

## 📄 License

Same as main IGotVD project.

---

**Built with ❤️ for modular desktop experiences**

*Last Updated: 2025-11-11*
