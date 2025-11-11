# 🧩 Virtual Desktop Components Library

## Complete reference of reusable UI components for building virtual desktops

---

## 📁 File System Components

### File Grid View
```html
<div class="file-grid">
    <div class="file-item" data-type="folder" ondblclick="openFolder(this)">
        <div class="file-icon">📁</div>
        <div class="file-name">Documents</div>
        <div class="file-meta">24 items</div>
    </div>
    <div class="file-item" data-type="file" ondblclick="openFile(this)">
        <div class="file-icon">📄</div>
        <div class="file-name">readme.txt</div>
        <div class="file-meta">2.4 KB</div>
    </div>
</div>

<style>
.file-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    gap: 15px;
    padding: 15px;
}

.file-item {
    text-align: center;
    padding: 12px;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s;
}

.file-item:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateY(-3px);
}

.file-icon {
    font-size: 48px;
    margin-bottom: 8px;
}

.file-name {
    font-size: 12px;
    word-wrap: break-word;
}

.file-meta {
    font-size: 10px;
    opacity: 0.6;
    margin-top: 4px;
}
</style>
```

### File List View
```html
<div class="file-list">
    <div class="file-list-header">
        <span class="col-name">Name</span>
        <span class="col-size">Size</span>
        <span class="col-modified">Modified</span>
        <span class="col-type">Type</span>
    </div>
    <div class="file-list-item" ondblclick="openFile(this)">
        <span class="col-name">
            <span class="file-icon">📄</span>
            <span>document.txt</span>
        </span>
        <span class="col-size">2.4 KB</span>
        <span class="col-modified">2024-01-15</span>
        <span class="col-type">Text</span>
    </div>
</div>

<style>
.file-list {
    display: flex;
    flex-direction: column;
    gap: 2px;
}

.file-list-header,
.file-list-item {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr 1fr;
    gap: 15px;
    padding: 10px 15px;
    font-size: 12px;
}

.file-list-header {
    font-weight: bold;
    border-bottom: 1px solid var(--border-color);
}

.file-list-item {
    cursor: pointer;
    transition: background 0.2s;
}

.file-list-item:hover {
    background: rgba(255, 255, 255, 0.1);
}
</style>
```

### Breadcrumb Navigation
```html
<div class="breadcrumb">
    <span class="breadcrumb-item" onclick="navigateTo('home')">🏠 Home</span>
    <span class="breadcrumb-separator">›</span>
    <span class="breadcrumb-item" onclick="navigateTo('documents')">Documents</span>
    <span class="breadcrumb-separator">›</span>
    <span class="breadcrumb-item active">Projects</span>
</div>

<style>
.breadcrumb {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 15px;
    background: rgba(0, 0, 0, 0.3);
    border-radius: 6px;
    font-size: 13px;
}

.breadcrumb-item {
    cursor: pointer;
    padding: 4px 8px;
    border-radius: 4px;
    transition: all 0.2s;
}

.breadcrumb-item:hover {
    background: rgba(255, 255, 255, 0.1);
}

.breadcrumb-item.active {
    font-weight: bold;
    cursor: default;
}

.breadcrumb-separator {
    opacity: 0.5;
}
</style>
```

---

## 💻 Terminal Components

### Basic Terminal
```html
<div class="terminal">
    <div class="terminal-header">
        <span>Terminal</span>
        <div class="terminal-controls">
            <button>−</button>
            <button>□</button>
            <button>×</button>
        </div>
    </div>
    <div class="terminal-body">
        <div class="terminal-output" id="output"></div>
        <div class="terminal-input-line">
            <span class="prompt">$</span>
            <input type="text" class="terminal-input" id="terminal-input">
        </div>
    </div>
</div>

<style>
.terminal {
    background: #000;
    border: 2px solid var(--primary-color);
    border-radius: 8px;
    font-family: 'Courier New', monospace;
    overflow: hidden;
}

.terminal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 12px;
    background: var(--primary-color);
    color: #000;
    font-weight: bold;
}

.terminal-body {
    padding: 15px;
    max-height: 500px;
    overflow-y: auto;
}

.terminal-output {
    margin-bottom: 10px;
    line-height: 1.6;
}

.terminal-input-line {
    display: flex;
    align-items: center;
    gap: 8px;
}

.prompt {
    color: var(--primary-color);
    font-weight: bold;
}

.terminal-input {
    flex: 1;
    background: transparent;
    border: none;
    color: var(--primary-color);
    font-family: inherit;
    font-size: 14px;
    outline: none;
}
</style>
```

### Terminal with Tabs
```html
<div class="terminal-tabbed">
    <div class="terminal-tabs">
        <div class="terminal-tab active" onclick="switchTab(0)">bash</div>
        <div class="terminal-tab" onclick="switchTab(1)">python</div>
        <div class="terminal-tab" onclick="switchTab(2)">node</div>
        <button class="terminal-tab-add">+</button>
    </div>
    <div class="terminal-content">
        <!-- Terminal content here -->
    </div>
</div>

<style>
.terminal-tabs {
    display: flex;
    gap: 2px;
    background: #000;
    padding: 5px 5px 0 5px;
}

.terminal-tab {
    padding: 8px 16px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 6px 6px 0 0;
    cursor: pointer;
    font-size: 12px;
    transition: all 0.2s;
}

.terminal-tab:hover {
    background: rgba(255, 255, 255, 0.2);
}

.terminal-tab.active {
    background: var(--primary-color);
    color: #000;
    font-weight: bold;
}

.terminal-tab-add {
    margin-left: auto;
    background: transparent;
    border: none;
    color: var(--primary-color);
    font-size: 18px;
    cursor: pointer;
}
</style>
```

---

## 📊 Data Visualization Components

### Progress Bar
```html
<div class="progress-bar">
    <div class="progress-fill" style="width: 75%;">
        <span class="progress-label">75%</span>
    </div>
</div>

<style>
.progress-bar {
    width: 100%;
    height: 24px;
    background: rgba(0, 0, 0, 0.5);
    border: 1px solid var(--primary-color);
    border-radius: 12px;
    overflow: hidden;
    position: relative;
}

.progress-fill {
    height: 100%;
    background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
    transition: width 0.5s ease;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding-right: 10px;
}

.progress-label {
    font-size: 11px;
    font-weight: bold;
    color: #000;
}
</style>
```

### Circular Progress
```html
<div class="progress-circle" data-progress="75">
    <svg width="100" height="100">
        <circle cx="50" cy="50" r="45" class="progress-bg"/>
        <circle cx="50" cy="50" r="45" class="progress-value"
                style="stroke-dasharray: 283; stroke-dashoffset: 70.75"/>
    </svg>
    <div class="progress-text">75%</div>
</div>

<style>
.progress-circle {
    position: relative;
    width: 100px;
    height: 100px;
}

.progress-circle svg {
    transform: rotate(-90deg);
}

.progress-bg {
    fill: none;
    stroke: rgba(255, 255, 255, 0.1);
    stroke-width: 10;
}

.progress-value {
    fill: none;
    stroke: var(--primary-color);
    stroke-width: 10;
    stroke-linecap: round;
    transition: stroke-dashoffset 0.5s;
}

.progress-text {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 18px;
    font-weight: bold;
}
</style>
```

### Stats Card
```html
<div class="stat-card">
    <div class="stat-icon">💾</div>
    <div class="stat-content">
        <div class="stat-label">Disk Usage</div>
        <div class="stat-value">45.2 GB</div>
        <div class="stat-change positive">+2.3% ↑</div>
    </div>
</div>

<style>
.stat-card {
    display: flex;
    align-items: center;
    gap: 15px;
    padding: 20px;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid var(--primary-color);
    border-radius: 12px;
    transition: all 0.3s;
}

.stat-card:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateY(-3px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.stat-icon {
    font-size: 48px;
}

.stat-label {
    font-size: 12px;
    opacity: 0.7;
    margin-bottom: 5px;
}

.stat-value {
    font-size: 24px;
    font-weight: bold;
    color: var(--primary-color);
}

.stat-change {
    font-size: 11px;
    margin-top: 5px;
}

.stat-change.positive {
    color: #0f0;
}

.stat-change.negative {
    color: #f00;
}
</style>
```

### Live Graph
```html
<div class="live-graph">
    <canvas id="graph-canvas" width="600" height="150"></canvas>
</div>

<style>
.live-graph {
    background: rgba(0, 0, 0, 0.5);
    border: 1px solid var(--primary-color);
    border-radius: 8px;
    padding: 10px;
}

.live-graph canvas {
    width: 100%;
    height: 100%;
}
</style>

<script>
function drawGraph(canvas, data) {
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    // Draw grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 10; i++) {
        const y = (i / 10) * height;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
    }

    // Draw data line
    ctx.strokeStyle = 'var(--primary-color)';
    ctx.lineWidth = 2;
    ctx.beginPath();

    data.forEach((value, index) => {
        const x = (index / (data.length - 1)) * width;
        const y = height - (value * height);

        if (index === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });

    ctx.stroke();
}
</script>
```

---

## 🎮 Interactive Components

### Button Variants
```html
<!-- Primary Button -->
<button class="btn btn-primary">Primary Action</button>

<!-- Secondary Button -->
<button class="btn btn-secondary">Secondary</button>

<!-- Icon Button -->
<button class="btn btn-icon">
    <span>🔍</span>
</button>

<!-- Loading Button -->
<button class="btn btn-loading">
    <span class="spinner"></span>
    Loading...
</button>

<style>
.btn {
    padding: 10px 20px;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;
    display: inline-flex;
    align-items: center;
    gap: 8px;
}

.btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}

.btn:active {
    transform: translateY(0);
}

.btn-primary {
    background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
    color: #000;
}

.btn-secondary {
    background: rgba(255, 255, 255, 0.1);
    color: var(--primary-color);
    border: 1px solid var(--primary-color);
}

.btn-icon {
    width: 40px;
    height: 40px;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
}

.btn-loading {
    pointer-events: none;
    opacity: 0.7;
}

.spinner {
    width: 16px;
    height: 16px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top-color: var(--primary-color);
    border-radius: 50%;
    animation: spin 0.6s linear infinite;
}

@keyframes spin {
    to { transform: rotate(360deg); }
}
</style>
```

### Toggle Switch
```html
<label class="toggle-switch">
    <input type="checkbox" checked>
    <span class="toggle-slider"></span>
    <span class="toggle-label">Enable Feature</span>
</label>

<style>
.toggle-switch {
    display: inline-flex;
    align-items: center;
    gap: 12px;
    cursor: pointer;
    user-select: none;
}

.toggle-switch input {
    display: none;
}

.toggle-slider {
    position: relative;
    width: 50px;
    height: 26px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 13px;
    transition: all 0.3s;
}

.toggle-slider::before {
    content: '';
    position: absolute;
    width: 22px;
    height: 22px;
    background: #fff;
    border-radius: 50%;
    top: 2px;
    left: 2px;
    transition: all 0.3s;
}

.toggle-switch input:checked + .toggle-slider {
    background: var(--primary-color);
}

.toggle-switch input:checked + .toggle-slider::before {
    transform: translateX(24px);
}
</style>
```

### Dropdown Menu
```html
<div class="dropdown">
    <button class="dropdown-toggle" onclick="toggleDropdown(this)">
        Options ▼
    </button>
    <div class="dropdown-menu">
        <div class="dropdown-item" onclick="selectOption(this)">Option 1</div>
        <div class="dropdown-item" onclick="selectOption(this)">Option 2</div>
        <div class="dropdown-item" onclick="selectOption(this)">Option 3</div>
        <div class="dropdown-divider"></div>
        <div class="dropdown-item danger" onclick="selectOption(this)">Delete</div>
    </div>
</div>

<style>
.dropdown {
    position: relative;
    display: inline-block;
}

.dropdown-toggle {
    padding: 10px 16px;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid var(--primary-color);
    color: var(--primary-color);
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
}

.dropdown-menu {
    position: absolute;
    top: 100%;
    left: 0;
    min-width: 180px;
    background: rgba(0, 0, 0, 0.95);
    border: 1px solid var(--primary-color);
    border-radius: 6px;
    margin-top: 5px;
    display: none;
    z-index: 1000;
}

.dropdown.active .dropdown-menu {
    display: block;
    animation: fadeIn 0.2s;
}

.dropdown-item {
    padding: 10px 15px;
    cursor: pointer;
    font-size: 13px;
    transition: all 0.2s;
}

.dropdown-item:hover {
    background: rgba(255, 255, 255, 0.1);
}

.dropdown-item.danger {
    color: #f00;
}

.dropdown-divider {
    height: 1px;
    background: rgba(255, 255, 255, 0.1);
    margin: 5px 0;
}
</style>

<script>
function toggleDropdown(btn) {
    btn.parentElement.classList.toggle('active');
}
</script>
```

### Modal Dialog
```html
<div class="modal" id="myModal">
    <div class="modal-overlay" onclick="closeModal('myModal')"></div>
    <div class="modal-content">
        <div class="modal-header">
            <h3>Dialog Title</h3>
            <button class="modal-close" onclick="closeModal('myModal')">×</button>
        </div>
        <div class="modal-body">
            <p>Dialog content goes here.</p>
        </div>
        <div class="modal-footer">
            <button class="btn btn-secondary" onclick="closeModal('myModal')">Cancel</button>
            <button class="btn btn-primary">Confirm</button>
        </div>
    </div>
</div>

<style>
.modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 9999;
    display: none;
    align-items: center;
    justify-content: center;
}

.modal.active {
    display: flex;
}

.modal-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(5px);
}

.modal-content {
    position: relative;
    background: rgba(0, 0, 0, 0.95);
    border: 2px solid var(--primary-color);
    border-radius: 12px;
    min-width: 400px;
    max-width: 90vw;
    max-height: 90vh;
    overflow: auto;
    animation: modalSlide 0.3s ease-out;
}

@keyframes modalSlide {
    from {
        transform: translateY(-50px);
        opacity: 0;
    }
    to {
        transform: translateY(0);
        opacity: 1;
    }
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    border-bottom: 1px solid var(--primary-color);
}

.modal-close {
    background: none;
    border: none;
    color: var(--primary-color);
    font-size: 28px;
    cursor: pointer;
    line-height: 1;
}

.modal-body {
    padding: 20px;
}

.modal-footer {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    padding: 20px;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
}
</style>

<script>
function openModal(id) {
    document.getElementById(id).classList.add('active');
}

function closeModal(id) {
    document.getElementById(id).classList.remove('active');
}
</script>
```

---

## 🎨 Layout Components

### Split Panel
```html
<div class="split-panel">
    <div class="split-left">
        Left content
    </div>
    <div class="split-divider"></div>
    <div class="split-right">
        Right content
    </div>
</div>

<style>
.split-panel {
    display: grid;
    grid-template-columns: 1fr 3px 2fr;
    gap: 0;
    height: 100%;
}

.split-left,
.split-right {
    overflow: auto;
    padding: 15px;
}

.split-divider {
    background: var(--primary-color);
    cursor: col-resize;
    transition: all 0.2s;
}

.split-divider:hover {
    background: var(--secondary-color);
    width: 5px;
}
</style>
```

### Tab Panel
```html
<div class="tab-panel">
    <div class="tab-list">
        <div class="tab active" onclick="switchTab('tab1')">Tab 1</div>
        <div class="tab" onclick="switchTab('tab2')">Tab 2</div>
        <div class="tab" onclick="switchTab('tab3')">Tab 3</div>
    </div>
    <div class="tab-content">
        <div id="tab1" class="tab-pane active">Content 1</div>
        <div id="tab2" class="tab-pane">Content 2</div>
        <div id="tab3" class="tab-pane">Content 3</div>
    </div>
</div>

<style>
.tab-list {
    display: flex;
    gap: 5px;
    border-bottom: 2px solid var(--primary-color);
}

.tab {
    padding: 10px 20px;
    cursor: pointer;
    border-radius: 6px 6px 0 0;
    transition: all 0.2s;
}

.tab:hover {
    background: rgba(255, 255, 255, 0.1);
}

.tab.active {
    background: var(--primary-color);
    color: #000;
    font-weight: bold;
}

.tab-pane {
    display: none;
    padding: 20px;
}

.tab-pane.active {
    display: block;
}
</style>
```

### Card Grid
```html
<div class="card-grid">
    <div class="card">
        <div class="card-header">Card Title</div>
        <div class="card-body">
            Card content goes here.
        </div>
        <div class="card-footer">
            <button class="btn btn-sm">Action</button>
        </div>
    </div>
    <!-- More cards -->
</div>

<style>
.card-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 20px;
}

.card {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid var(--primary-color);
    border-radius: 12px;
    overflow: hidden;
    transition: all 0.3s;
}

.card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.card-header {
    padding: 15px;
    background: rgba(255, 255, 255, 0.1);
    font-weight: bold;
    border-bottom: 1px solid var(--primary-color);
}

.card-body {
    padding: 15px;
}

.card-footer {
    padding: 15px;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    display: flex;
    justify-content: flex-end;
}
</style>
```

---

**Continue exploring more components in the next sections...**
