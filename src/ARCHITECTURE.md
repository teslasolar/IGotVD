# IGotVD Modular Architecture

## Overview
Refactored from 10 standalone HTML files into a unified modular system.

## Directory Structure

```
src/
├── css/
│   ├── core.css           # Base styles, resets, utilities
│   ├── components.css     # Shared component styles
│   └── themes.css         # Theme color definitions
├── js/
│   ├── core.js           # Window management, desktop base
│   ├── components.js     # Reusable UI components
│   └── desktop-loader.js # Desktop mode switcher
├── components/
│   ├── window.js         # Window system (drag, minimize, maximize, close)
│   ├── taskbar.js        # Taskbar/dock component
│   ├── notifications.js  # Notification system
│   ├── clock.js          # System clock
│   └── desktop-icons.js  # Desktop icon grid
├── modules/
│   ├── cyber.js          # CyberOS desktop module
│   ├── neural.js         # NeuroNet desktop module
│   ├── quantum.js        # Quantum desktop module
│   ├── retro.js          # RetroWave desktop module
│   ├── hacker.js         # Hacker terminal module
│   ├── biotech.js        # BioTech lab module
│   ├── space.js          # Space station module
│   ├── city.js           # Neon city module
│   ├── ocean.js          # Ocean lab module
│   └── mystic.js         # Mystic arcane module
└── themes/
    ├── cyber-theme.css
    ├── neural-theme.css
    ├── quantum-theme.css
    ├── retro-theme.css
    ├── hacker-theme.css
    ├── biotech-theme.css
    ├── space-theme.css
    ├── city-theme.css
    ├── ocean-theme.css
    └── mystic-theme.css
```

## Common Components Identified

### 1. Window Management System
- Draggable windows
- Minimize/Maximize/Close buttons
- Window z-index management
- Window header with title
- Window content area
- Multiple window support

### 2. Taskbar/Header System
- Application/module launcher icons
- System stats display
- Clock/time display
- Status indicators
- Theme-specific branding

### 3. Desktop Environment
- Background animations (particles, grids, bubbles, etc.)
- Desktop icons with click handlers
- Start menu / sidebar navigation
- Module switching system

### 4. Interactive Applications (Desktop-Specific)
- Terminal emulators
- File managers
- System monitors
- Data visualizations
- Custom tools per theme

### 5. Visual Effects
- Theme-specific animations
- Particle systems
- Gradient backgrounds
- Glow effects
- Hover transitions

## Component API Design

### Window Component
```javascript
class Window {
  constructor(options) {
    this.id = options.id;
    this.title = options.title;
    this.content = options.content;
    this.width = options.width || 400;
    this.height = options.height || 300;
    this.x = options.x || 100;
    this.y = options.y || 100;
  }

  open() { /* ... */ }
  close() { /* ... */ }
  minimize() { /* ... */ }
  maximize() { /* ... */ }
  makeDraggable() { /* ... */ }
}
```

### Taskbar Component
```javascript
class Taskbar {
  constructor(options) {
    this.apps = options.apps;
    this.stats = options.stats;
    this.theme = options.theme;
  }

  render() { /* ... */ }
  addApp(app) { /* ... */ }
  updateStats(stats) { /* ... */ }
}
```

### Desktop Module Interface
```javascript
class DesktopModule {
  constructor() {
    this.name = '';
    this.theme = '';
    this.windows = [];
    this.apps = [];
  }

  init() { /* Initialize desktop */ }
  cleanup() { /* Cleanup on switch */ }
  createWindows() { /* Create specific windows */ }
  createBackground() { /* Theme-specific background */ }
}
```

## Theme System

Each theme defines:
- Primary color
- Secondary color
- Accent color
- Background colors
- Text colors
- Border colors
- Glow/shadow effects

Example:
```css
:root[data-theme="cyber"] {
  --primary: #00ff41;
  --secondary: #0f0;
  --accent: #39ff14;
  --bg-dark: #0a0e0a;
  --bg-darker: #050a05;
  --text: #e0ffe0;
  --border: rgba(0, 255, 65, 0.3);
  --glow: rgba(0, 255, 65, 0.5);
}
```

## Unified Desktop Loader

Single HTML file (`desktop.html`) that:
1. Loads core CSS and JS
2. Reads desktop mode from URL parameter or localStorage
3. Dynamically loads theme CSS
4. Loads and initializes desktop module
5. Provides desktop switcher UI

Example URL: `desktop.html?mode=cyber`

## Feature Breakdown by Desktop

### CyberOS
- Terminal with command processing
- File manager with grid view
- System monitor (CPU, RAM, Network)
- Code editor
- Browser simulator
- Music player
- Chat app
- Settings panel

### NeuroNet
- Neural network visualizer (canvas)
- Model training center (progress bars)
- Dataset manager (file grid)
- AI dashboard (metrics)
- Model library browser
- Neural terminal

### Quantum
- Quantum circuit builder
- State visualizer (Bloch sphere)
- Quantum simulator console
- Algorithm library (Grover, Shor, QFT, VQE, QAOA)
- QASM code editor
- Entanglement lab

### RetroWave
- 3D animated grid background
- MS-DOS terminal
- Synthwave music player
- Arcade games simulator
- Pixel art paint tool
- File manager

### Hacker
- Terminal with hacker commands
- Network topology mapper (100 nodes)
- Exploit database (CVE listings)
- Packet sniffer (live data)
- Process manager
- Hex viewer
- Code editor

### BioTech
- DNA sequencer (ATGC visualization)
- Genome viewer (200 cells)
- Protein synthesis chain
- CRISPR gene editor
- Petri dish (microorganisms)
- Microscope view
- Stats tracker

### Space Station
- Star map (50 objects)
- Satellite control (9 satellites)
- Life support systems
- Deep space communications
- Proximity radar
- Orbital navigation
- Mission log

### Neon City
- Surveillance network (9 cameras)
- Traffic control (junction map)
- Building management (12 buildings)
- Crime monitoring (incident feed)
- Power grid (64 cells)
- City analytics
- Weather widget

### Ocean Lab
- Sonar mapping (rotating sweep)
- Marine biology database (9 creatures)
- Submarine controls
- Pressure systems
- Research log
- Specimen collection (16 specimens)
- Depth indicator

### Mystic Arcane
- Ancient spellbook (8 spells)
- Potion brewing cauldron
- Crystal ball divination
- Rune casting circle (12 runes)
- Enchantment forge
- Arcane library
- Mana bar system

## Benefits of Modular Architecture

1. **Code Reusability**: Shared components reduce duplication
2. **Maintainability**: Changes to window system affect all desktops
3. **Performance**: Load only needed modules
4. **Scalability**: Easy to add new desktops
5. **Testing**: Test components independently
6. **File Size**: Smaller individual files
7. **Development**: Parallel development on modules
8. **Customization**: Users can mix/match components

## Migration Strategy

1. ✅ Create directory structure
2. Extract core CSS from all desktops
3. Extract core JS (window management)
4. Create component library
5. Build desktop modules
6. Create theme files
7. Build unified loader
8. Test each desktop mode
9. Update documentation
10. Deprecate standalone HTML files (keep as backup)

## Future Enhancements

- Desktop customization UI
- Save/load desktop layouts
- Plugin system for new apps
- Cross-desktop app launching
- Workspace management (multiple desktops)
- Keyboard shortcuts system
- Accessibility features
- Mobile responsive modes
- Performance monitoring
- Developer tools panel
