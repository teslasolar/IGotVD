# 🚀 Adding New Virtual Desktops - Auto-Detection Guide

The IGotVD project now features **automatic desktop discovery**! Just create HTML files and the system auto-detects them.

---

## ⚡ Quick Start (3 Steps)

### 1. Create Your Desktop HTML File

Create a new `.html` file in the root directory:

```bash
touch my_awesome_desktop.html
```

### 2. Build Your Desktop

Use the templates in `DESKTOP_TEMPLATE.md`, `COMPONENTS_LIBRARY.md`, or copy an existing desktop as a starting point.

### 3. Generate the Manifest

Run one of these commands:

```bash
npm run manifest
# OR
npm run update
# OR
node generate-manifest.js
```

**That's it!** The index.html will automatically show your new desktop.

---

## 🤖 Automatic Updates (GitHub Pages)

When you push HTML files to GitHub, the manifest updates automatically via GitHub Actions:

1. Create/modify any `.html` file (except `index.html`)
2. Commit and push to GitHub
3. GitHub Actions runs `generate-manifest.js` automatically
4. The `desktops.json` manifest updates
5. Your desktop appears on the index page!

**Note**: The workflow runs on pushes to `main`, `master`, or any `claude/**` branch.

---

## 📋 How It Works

### The Auto-Detection System

```
┌─────────────────────────────────┐
│  1. You create: my_desktop.html │
└─────────────┬───────────────────┘
              │
              ▼
┌─────────────────────────────────────────┐
│  2. Run: node generate-manifest.js      │
│     - Scans all *.html files            │
│     - Extracts metadata (title, theme)  │
│     - Detects features from window apps │
└─────────────┬───────────────────────────┘
              │
              ▼
┌─────────────────────────────────────┐
│  3. Generates: desktops.json        │
│     {                                │
│       "desktops": [...],             │
│       "generated": "2025-11-11..."   │
│     }                                │
└─────────────┬───────────────────────┘
              │
              ▼
┌─────────────────────────────────────┐
│  4. index.html loads manifest       │
│     - Fetches desktops.json         │
│     - Displays all desktop cards    │
└─────────────────────────────────────┘
```

### What Gets Auto-Detected

The script automatically extracts:

- **Name**: From `<title>` tag
- **Theme**: Pattern matching on colors/keywords
  - Cyber: `#00ff41`, "cyberpunk", "matrix"
  - Neural: `#b366ff`, "neural", "brain"
  - Quantum: `#00ffff`, "quantum", "qubit"
  - Retro: `#ff00ff`, "retro", "vaporwave"
  - Hacker: `#0f0`, "hacker", "h4ck"
  - BioTech: `#00ff88`, "biotech", "dna", "crispr"
- **Icon**: Emoji based on detected theme
- **Features**: From window titles (`data-title` attributes)
- **Description**: From meta description or generated

---

## 🎨 Theme Detection Examples

```html
<!-- Cyber Theme -->
<style>
  :root {
    --primary: #00ff41; /* Auto-detected as "cyber" */
  }
</style>

<!-- Neural Theme -->
<title>My Neural Network Desktop</title> <!-- Contains "neural" -->

<!-- BioTech Theme -->
<h1>DNA Sequencer</h1> <!-- Contains "dna" -->
```

---

## 🔧 Manual Metadata (Optional)

For better control, add a meta description tag:

```html
<head>
  <meta name="description" content="Your custom description here">
</head>
```

Make sure window apps have clear titles:

```html
<div class="window" data-title="Neural Dashboard">
  <!-- Window content -->
</div>
```

Or desktop icons:

```html
<div class="app-icon">
  <div>🧬</div>
  <div>DNA Sequencer</div>
</div>
```

---

## 📁 File Structure

```
IGotVD/
├── index.html                    # Loads from desktops.json
├── desktops.json                 # Auto-generated manifest
├── generate-manifest.js          # Manifest generator script
├── package.json                  # npm scripts
├── .github/
│   └── workflows/
│       └── update-manifest.yml   # Auto-run on push
│
├── cyberOS_desktop.html          # Your desktops
├── neuronet_workspace.html
├── quantum_desktop.html
├── retrowave_desktop.html
├── hacker_terminal.html
├── biotech_lab.html
└── your_new_desktop.html         # Add yours here!
```

---

## 🎯 Workflow Examples

### Local Development

```bash
# 1. Create new desktop
cp cyberOS_desktop.html space_desktop.html

# 2. Edit your desktop
# (modify colors, apps, theme...)

# 3. Update manifest
npm run manifest

# 4. Test locally
open index.html

# 5. Commit and push
git add space_desktop.html desktops.json
git commit -m "Add space-themed desktop"
git push
```

### Quick Update

```bash
# Modify existing desktop
nano quantum_desktop.html

# Regenerate manifest
npm run update

# Push changes
git add quantum_desktop.html desktops.json
git commit -m "Update quantum desktop with new features"
git push
```

---

## 🐛 Troubleshooting

### "Manifest not found" error in browser

**Solution**: Run `npm run manifest` to generate `desktops.json`

### Desktop not appearing in index

**Checklist**:
- [ ] File ends with `.html`
- [ ] File is in root directory (not in subdirectory)
- [ ] File is not named `index.html`
- [ ] You ran `npm run manifest` after creating the file
- [ ] `desktops.json` exists and contains your desktop

### Wrong theme detected

**Solution**: Make theme patterns more obvious in your HTML:
- Use standard theme colors in CSS variables
- Include theme keywords in title or headings
- Colors: cyber=#00ff41, neural=#b366ff, quantum=#00ffff, retro=#ff00ff

### No features showing

**Solution**: Add clear window titles or app icons:
```html
<div class="window" data-title="File Manager"></div>
<div class="app-icon"><div>📁</div><div>Files</div></div>
```

---

## 📊 Supported Themes

| Theme | Color | Keywords | Icon |
|-------|-------|----------|------|
| Cyber | `#00ff41` | cyberpunk, cyber, matrix | 🖥️ |
| Neural | `#b366ff` | neural, neuro, brain | 🧠 |
| Quantum | `#00ffff` | quantum, qubit | ⚛️ |
| Retro | `#ff00ff` | retro, vaporwave, synthwave | 🌆 |
| Hacker | `#0f0` | hacker, h4ck, elite | 👾 |
| BioTech | `#00ff88` | biotech, genetic, dna, crispr | 🧬 |
| Cube | - | konomi, cube | 🧬 |
| Entropy | - | entropy, phi | ⚖️ |
| Compiler | - | compiler, emoji | 🔮 |

---

## 💡 Pro Tips

1. **Copy existing desktops** as templates - they already have the right structure
2. **Use DESKTOP_TEMPLATE.md** for comprehensive guidance
3. **Run manifest locally** before pushing to catch issues early
4. **Check desktops.json** after generation to verify metadata
5. **Use consistent naming** for easier organization (e.g., `theme_desktop.html`)
6. **Test in browser** by opening `index.html` locally
7. **Keep backups** of your custom desktops

---

## 🎓 Learning Resources

- `DESKTOP_TEMPLATE.md` - Complete desktop building guide
- `COMPONENTS_LIBRARY.md` - Reusable UI components
- `QUICK_REFERENCE.md` - Fast lookup for common patterns
- `README.md` - Project overview and gallery

---

## 🤝 Contributing

Created an amazing desktop? Share it!

1. Fork the repository
2. Add your desktop HTML file
3. Run `npm run manifest`
4. Commit both the HTML and updated `desktops.json`
5. Submit a pull request

---

## ⚙️ Advanced: Custom Manifest Fields

Edit `generate-manifest.js` to customize metadata extraction:

```javascript
// Add custom theme detection
const themePatterns = {
  'myTheme': /pattern|keywords/i
};

// Customize icon mapping
const THEME_ICONS = {
  'myTheme': '🎨'
};
```

---

**Happy Desktop Building! 🚀**

Need help? Check existing desktops for working examples, or reference the template docs.
