# ⚡ Virtual Desktop Quick Reference Guide

**Fast lookup for common patterns and code snippets**

---

## 🚀 One-Minute Setup

```html
<!DOCTYPE html>
<html><head><meta charset="UTF-8"><title>Desktop</title></head><body>
<style>
* { margin:0; padding:0; box-sizing:border-box; }
body { font-family:monospace; background:#000; color:#0f0; overflow:hidden; height:100vh; }
.window { position:absolute; background:#000; border:2px solid #0f0; padding:20px; display:none; }
.window.active { display:block; }
#taskbar { position:fixed; bottom:0; width:100%; height:50px; background:#001100; border-top:2px solid #0f0; padding:0 15px; display:flex; align-items:center; }
</style>

<div class="window" id="app1" style="left:400px; top:100px; width:700px; height:600px;">
    <h2>Application Window</h2>
    <p>Content here</p>
</div>

<div id="taskbar">
    <button onclick="openWindow('app1')">Open App</button>
    <span id="clock" style="margin-left:auto;">00:00:00</span>
</div>

<script>
function openWindow(id) { document.getElementById(id).classList.add('active'); }
setInterval(() => { document.getElementById('clock').textContent = new Date().toTimeString().split(' ')[0]; }, 1000);
</script>
</body></html>
```

---

## 📝 Essential Code Snippets

### Window Controls (Copy-Paste Ready)
```javascript
// Window management globals
let activeWindows = [];
let draggedWindow = null;
let dragOffset = { x: 0, y: 0 };

// Open/Close/Minimize/Maximize
const openWindow = id => {
    const w = document.getElementById(id);
    w.classList.add('active');
    if (!activeWindows.includes(id)) activeWindows.push(id);
};

const closeWindow = id => {
    document.getElementById(id).classList.remove('active');
    activeWindows = activeWindows.filter(i => i !== id);
};

const toggleMaximize = id => {
    const w = document.getElementById(id);
    if (w.style.width === '100vw') {
        w.style.cssText = 'left:400px;top:100px;width:700px;height:600px;';
    } else {
        w.style.cssText = 'left:0;top:0;width:100vw;height:calc(100vh - 60px);';
    }
};

// Drag setup (add to window headers)
document.querySelectorAll('.window-header').forEach(h => {
    h.onmousedown = e => {
        if (e.target.closest('.window-controls')) return;
        draggedWindow = h.parentElement;
        const r = draggedWindow.getBoundingClientRect();
        dragOffset = { x: e.clientX - r.left, y: e.clientY - r.top };
    };
});

document.onmousemove = e => {
    if (draggedWindow) {
        draggedWindow.style.left = (e.clientX - dragOffset.x) + 'px';
        draggedWindow.style.top = (e.clientY - dragOffset.y) + 'px';
    }
};

document.onmouseup = () => draggedWindow = null;
```

### Terminal Handler (One Function)
```javascript
const handleTerminal = e => {
    if (e.key !== 'Enter') return;

    const input = e.target;
    const output = document.getElementById('terminalOutput');
    const cmd = input.value.trim();

    const addLine = (text, cls = 'output') => {
        const line = document.createElement('div');
        line.className = 'terminal-line ' + cls;
        line.textContent = text;
        output.appendChild(line);
    };

    addLine(`$ ${cmd}`, 'command');

    const commands = {
        help: () => addLine('Commands: help, clear, ls, date'),
        clear: () => output.innerHTML = '',
        ls: () => addLine('Documents  Downloads  Pictures'),
        date: () => addLine(new Date().toString())
    };

    if (commands[cmd]) commands[cmd]();
    else if (cmd) addLine(`Command not found: ${cmd}`, 'error');

    input.value = '';
    output.scrollTop = output.scrollHeight;
};
```

### Notification System (Minimal)
```javascript
const notify = (title, msg, ms = 3000) => {
    const n = document.createElement('div');
    n.style.cssText = 'position:fixed;top:20px;right:20px;background:#000;border:2px solid #0f0;padding:15px;z-index:9999;';
    n.innerHTML = `<b>${title}</b><br>${msg}`;
    document.body.appendChild(n);
    setTimeout(() => n.remove(), ms);
};
```

---

## 🎨 CSS Quick Patterns

### Window Base
```css
.window {
    position: absolute;
    background: rgba(0,0,0,0.95);
    border: 2px solid var(--primary);
    backdrop-filter: blur(10px);
    display: none;
}
.window.active { display: flex; flex-direction: column; }
.window-header {
    background: var(--primary);
    padding: 10px;
    cursor: move;
    display: flex;
    justify-content: space-between;
}
.window-content { flex: 1; padding: 20px; overflow-y: auto; }
```

### Animations
```css
/* Fade in */ @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
/* Slide up */ @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
/* Pulse */ @keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }
/* Glow */ @keyframes glow { 0%, 100% { box-shadow: 0 0 10px var(--primary); } 50% { box-shadow: 0 0 30px var(--primary); } }
```

### Buttons
```css
.btn {
    padding: 10px 20px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.3s;
}
.btn:hover { transform: translateY(-2px); box-shadow: 0 5px 15px rgba(0,0,0,0.3); }
.btn-primary { background: linear-gradient(135deg, var(--primary), var(--secondary)); }
```

---

## 🎯 Theme Colors (Copy One)

```css
/* Cyberpunk Green */
:root { --primary: #00ff41; --secondary: #00cc33; --bg: #0a0e27; }

/* Neon Purple */
:root { --primary: #b366ff; --secondary: #8000ff; --bg: #1a0033; }

/* Quantum Cyan */
:root { --primary: #00ffff; --secondary: #0088ff; --bg: #001a33; }

/* Retro Pink */
:root { --primary: #ff00ff; --secondary: #ff0088; --bg: #000; }

/* Hacker Green */
:root { --primary: #0f0; --secondary: #0c0; --bg: #000; }

/* Matrix */
:root { --primary: #00ff00; --secondary: #008800; --bg: #001100; }

/* Vaporwave */
:root { --primary: #ff00ff; --secondary: #00ffff; --bg: linear-gradient(#001a33, #003366); }

/* Neon Orange */
:root { --primary: #ff6600; --secondary: #ff9900; --bg: #0a0a0a; }
```

---

## 🧩 Component Quick Drops

### Taskbar
```html
<div id="taskbar" style="position:fixed;bottom:0;left:0;right:0;height:50px;background:#001100;border-top:2px solid #0f0;display:flex;align-items:center;padding:0 15px;gap:10px;z-index:1000;">
    <button style="background:#0f0;color:#000;border:none;padding:8px 16px;border-radius:6px;cursor:pointer;">START</button>
    <div id="apps" style="display:flex;gap:10px;"></div>
    <div id="clock" style="margin-left:auto;font-weight:bold;">00:00:00</div>
</div>
```

### Desktop Icon
```html
<div style="position:absolute;top:60px;left:60px;width:80px;text-align:center;padding:10px;cursor:pointer;" ondblclick="openWindow('app1')">
    <div style="font-size:48px;margin-bottom:5px;">📁</div>
    <div style="font-size:12px;">Files</div>
</div>
```

### Terminal
```html
<div style="background:#000;border:2px solid #0f0;padding:15px;font-family:monospace;color:#0f0;">
    <div id="output"></div>
    <input type="text" onkeypress="handleTerminal(event)" style="width:100%;background:#000;border:none;color:#0f0;font-family:inherit;margin-top:10px;">
</div>
```

### Progress Bar
```html
<div style="width:100%;height:24px;background:rgba(0,0,0,0.5);border:1px solid #0f0;border-radius:12px;overflow:hidden;">
    <div style="height:100%;width:75%;background:linear-gradient(90deg,#0f0,#0c0);transition:width 0.5s;"></div>
</div>
```

### Modal
```html
<div id="modal" style="position:fixed;inset:0;background:rgba(0,0,0,0.8);display:none;align-items:center;justify-content:center;z-index:9999;">
    <div style="background:#000;border:2px solid #0f0;border-radius:12px;padding:30px;min-width:400px;">
        <h3>Dialog Title</h3>
        <p style="margin:15px 0;">Content here</p>
        <button onclick="document.getElementById('modal').style.display='none'">Close</button>
    </div>
</div>
```

---

## 🔢 Data Patterns

### File List Generator
```javascript
const generateFiles = () => {
    const types = { folder: '📁', doc: '📄', img: '🖼️', code: '💻', music: '🎵' };
    const files = [
        { name: 'Documents', type: 'folder', size: '24 items' },
        { name: 'readme.txt', type: 'doc', size: '2.4 KB' },
        { name: 'photo.jpg', type: 'img', size: '1.2 MB' }
    ];

    return files.map(f => `
        <div class="file-item">
            <div>${types[f.type]}</div>
            <div>${f.name}</div>
            <div>${f.size}</div>
        </div>
    `).join('');
};
```

### Live Stats Updater
```javascript
setInterval(() => {
    document.getElementById('cpu').textContent = (Math.random() * 100).toFixed(1) + '%';
    document.getElementById('mem').textContent = (Math.random() * 16).toFixed(1) + ' GB';
    document.getElementById('net').textContent = (Math.random() * 100).toFixed(1) + ' Mbps';
}, 1000);
```

### Graph Drawing (Canvas)
```javascript
const drawGraph = (canvasId, data) => {
    const canvas = document.getElementById(canvasId);
    const ctx = canvas.getContext('2d');
    const w = canvas.width, h = canvas.height;

    ctx.clearRect(0, 0, w, h);
    ctx.strokeStyle = '#0f0';
    ctx.lineWidth = 2;
    ctx.beginPath();

    data.forEach((val, i) => {
        const x = (i / (data.length - 1)) * w;
        const y = h - (val * h);
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });

    ctx.stroke();
};
```

---

## ⚡ Performance Hacks

### Virtual Scrolling
```javascript
// Only render visible items
const renderVisible = (allItems, scrollTop, containerHeight, itemHeight) => {
    const start = Math.floor(scrollTop / itemHeight);
    const end = Math.ceil((scrollTop + containerHeight) / itemHeight);
    return allItems.slice(start, end + 1);
};
```

### Debounce
```javascript
const debounce = (fn, ms) => {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => fn(...args), ms);
    };
};

// Usage: input.oninput = debounce(expensiveFunction, 300);
```

### RequestAnimationFrame Loop
```javascript
const fps = 60;
const interval = 1000 / fps;
let then = Date.now();

function loop() {
    requestAnimationFrame(loop);
    const now = Date.now();
    const delta = now - then;

    if (delta > interval) {
        then = now - (delta % interval);
        // Your animation code here
    }
}
loop();
```

---

## 🐛 Common Fixes

### Z-index Issues
```javascript
let zIndex = 100;
window.onclick = e => {
    const win = e.target.closest('.window');
    if (win) win.style.zIndex = ++zIndex;
};
```

### Prevent Text Selection While Dragging
```css
.window-header {
    cursor: move;
    user-select: none;
    -webkit-user-select: none;
}
```

### Stop Event Bubbling
```javascript
element.onclick = e => {
    e.stopPropagation();
    // Your code
};
```

### Mobile Touch Support
```javascript
let touchStart = null;

element.ontouchstart = e => {
    touchStart = { x: e.touches[0].clientX, y: e.touches[0].clientY };
};

element.ontouchmove = e => {
    if (!touchStart) return;
    const deltaX = e.touches[0].clientX - touchStart.x;
    const deltaY = e.touches[0].clientY - touchStart.y;
    // Update position
};

element.ontouchend = () => touchStart = null;
```

---

## 📱 Responsive Patterns

### Media Query
```css
@media (max-width: 768px) {
    .window {
        width: 100vw !important;
        height: 100vh !important;
        left: 0 !important;
        top: 0 !important;
    }

    .desktop-icon {
        width: 60px;
        font-size: 36px;
    }

    #taskbar {
        height: 60px;
        flex-wrap: wrap;
    }
}
```

### Touch-Friendly Buttons
```css
.btn {
    min-height: 44px; /* iOS touch target */
    min-width: 44px;
    padding: 12px 20px;
}
```

---

## 🎮 Keyboard Shortcuts

```javascript
document.onkeydown = e => {
    // Ctrl/Cmd + K = Open search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        openSearch();
    }

    // Ctrl/Cmd + W = Close active window
    if ((e.ctrlKey || e.metaKey) && e.key === 'w') {
        e.preventDefault();
        closeActiveWindow();
    }

    // Escape = Close modals
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal').forEach(m => m.classList.remove('active'));
    }

    // Alt + Tab = Switch windows
    if (e.altKey && e.key === 'Tab') {
        e.preventDefault();
        switchWindow();
    }
};
```

---

## 🎯 Testing Checklist

```javascript
// Console test commands
const test = {
    windows: () => {
        openWindow('app1');
        setTimeout(() => closeWindow('app1'), 2000);
    },

    terminal: () => {
        const cmds = ['help', 'ls', 'date', 'clear'];
        cmds.forEach((cmd, i) => {
            setTimeout(() => processCommand(cmd), i * 500);
        });
    },

    notifications: () => {
        notify('Test 1', 'Message 1');
        setTimeout(() => notify('Test 2', 'Message 2'), 1000);
        setTimeout(() => notify('Test 3', 'Message 3'), 2000);
    },

    stress: () => {
        for (let i = 0; i < 100; i++) {
            setTimeout(() => {
                notify('Stress Test', `Message ${i + 1}`);
            }, i * 50);
        }
    }
};

// Run tests: test.windows(), test.terminal(), etc.
```

---

## 🔧 Debug Helpers

```javascript
// Log all window states
const debugWindows = () => {
    console.table(activeWindows.map(id => ({
        id,
        visible: document.getElementById(id)?.classList.contains('active'),
        position: document.getElementById(id)?.style.cssText
    })));
};

// Performance monitor
const perfMonitor = () => {
    setInterval(() => {
        const windows = document.querySelectorAll('.window').length;
        const activeEls = document.querySelectorAll('.active').length;
        console.log(`Windows: ${windows} | Active: ${activeEls} | FPS: ~60`);
    }, 1000);
};

// Memory usage (Chrome only)
if (performance.memory) {
    setInterval(() => {
        const mb = (performance.memory.usedJSHeapSize / 1048576).toFixed(2);
        console.log(`Memory: ${mb} MB`);
    }, 5000);
}
```

---

## 🚀 Quick Deploy

### Single File
All HTML, CSS, and JS in one file. Just open in browser.

### GitHub Pages
```bash
git add .
git commit -m "Add virtual desktop"
git push origin main
# Enable GitHub Pages in repository settings
```

### Quick Server
```bash
# Python 3
python -m http.server 8000

# Node.js
npx http-server

# PHP
php -S localhost:8000
```

---

## 💡 Pro Tips

1. **Start with index.html** - Use it as your launcher page
2. **Use CSS variables** - Easy theme switching
3. **Inline everything** - Single file = easy sharing
4. **Test on mobile** - Touch interactions matter
5. **Add console logs** - Debug with `console.log()`
6. **Use browser DevTools** - Inspect elements live
7. **Cache nothing** - Use Ctrl+Shift+R for hard refresh
8. **Comment your code** - Future you will thank you
9. **Keep functions small** - Easier to debug
10. **Save frequently** - Use Git or local backups

---

**Quick Reference Guide - Keep this tab open while coding! 📌**
