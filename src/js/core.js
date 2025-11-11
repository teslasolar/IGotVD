/**
 * IGotVD Core JavaScript
 * Window management and desktop base system
 */

// =====  WINDOW MANAGER =====

class WindowManager {
    constructor() {
        this.windows = new Map();
        this.activeWindow = null;
        this.zIndex = 100;
        this.draggedWindow = null;
        this.offsetX = 0;
        this.offsetY = 0;

        this.initEventListeners();
    }

    createWindow(options) {
        const id = options.id || `window-${Date.now()}`;

        const windowEl = document.createElement('div');
        windowEl.className = 'window';
        windowEl.id = id;
        windowEl.style.left = `${options.x || 100}px`;
        windowEl.style.top = `${options.y || 100}px`;
        windowEl.style.width = `${options.width || 600}px`;
        windowEl.style.height = `${options.height || 400}px`;

        const header = document.createElement('div');
        header.className = 'window-header';
        header.innerHTML = `
            <span class="window-title">${options.title || 'Window'}</span>
            <div class="window-controls">
                <div class="window-btn btn-minimize" data-action="minimize"></div>
                <div class="window-btn btn-maximize" data-action="maximize"></div>
                <div class="window-btn btn-close" data-action="close"></div>
            </div>
        `;

        const content = document.createElement('div');
        content.className = 'window-content';
        if (typeof options.content === 'string') {
            content.innerHTML = options.content;
        } else if (options.content instanceof HTMLElement) {
            content.appendChild(options.content);
        }

        windowEl.appendChild(header);
        windowEl.appendChild(content);

        document.querySelector('.desktop').appendChild(windowEl);

        this.windows.set(id, {
            element: windowEl,
            options: options,
            minimized: false,
            maximized: false,
            originalBounds: null
        });

        this.attachWindowEvents(id);

        return id;
    }

    openWindow(id) {
        const win = this.windows.get(id);
        if (!win) return;

        win.element.classList.add('active');
        win.element.classList.remove('minimized');
        this.bringToFront(id);
        this.activeWindow = id;
    }

    closeWindow(id) {
        const win = this.windows.get(id);
        if (!win) return;

        win.element.classList.remove('active');
        win.element.classList.add('fade-out');

        setTimeout(() => {
            win.element.remove();
            this.windows.delete(id);
            if (this.activeWindow === id) {
                this.activeWindow = null;
            }
        }, 300);
    }

    minimizeWindow(id) {
        const win = this.windows.get(id);
        if (!win) return;

        win.minimized = true;
        win.element.classList.add('minimized');
        win.element.classList.remove('active');
    }

    maximizeWindow(id) {
        const win = this.windows.get(id);
        if (!win) return;

        if (win.maximized) {
            // Restore
            if (win.originalBounds) {
                win.element.style.left = win.originalBounds.left;
                win.element.style.top = win.originalBounds.top;
                win.element.style.width = win.originalBounds.width;
                win.element.style.height = win.originalBounds.height;
            }
            win.element.classList.remove('maximized');
            win.maximized = false;
        } else {
            // Maximize
            win.originalBounds = {
                left: win.element.style.left,
                top: win.element.style.top,
                width: win.element.style.width,
                height: win.element.style.height
            };
            win.element.classList.add('maximized');
            win.maximized = true;
        }
    }

    bringToFront(id) {
        const win = this.windows.get(id);
        if (!win) return;

        this.zIndex++;
        win.element.style.zIndex = this.zIndex;
    }

    attachWindowEvents(id) {
        const win = this.windows.get(id);
        if (!win) return;

        const header = win.element.querySelector('.window-header');
        const controls = win.element.querySelectorAll('.window-btn');

        // Draggable header
        header.addEventListener('mousedown', (e) => {
            if (e.target.classList.contains('window-btn')) return;
            this.startDrag(id, e);
        });

        // Window controls
        controls.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const action = btn.dataset.action;

                switch (action) {
                    case 'minimize':
                        this.minimizeWindow(id);
                        break;
                    case 'maximize':
                        this.maximizeWindow(id);
                        break;
                    case 'close':
                        this.closeWindow(id);
                        break;
                }
            });
        });

        // Bring to front on click
        win.element.addEventListener('mousedown', () => {
            this.bringToFront(id);
            this.activeWindow = id;
        });
    }

    startDrag(id, e) {
        const win = this.windows.get(id);
        if (!win || win.maximized) return;

        this.draggedWindow = id;
        const rect = win.element.getBoundingClientRect();
        this.offsetX = e.clientX - rect.left;
        this.offsetY = e.clientY - rect.top;

        win.element.style.cursor = 'grabbing';
        this.bringToFront(id);
    }

    initEventListeners() {
        document.addEventListener('mousemove', (e) => {
            if (!this.draggedWindow) return;

            const win = this.windows.get(this.draggedWindow);
            if (!win) return;

            win.element.style.left = `${e.clientX - this.offsetX}px`;
            win.element.style.top = `${e.clientY - this.offsetY}px`;
        });

        document.addEventListener('mouseup', () => {
            if (this.draggedWindow) {
                const win = this.windows.get(this.draggedWindow);
                if (win) {
                    win.element.style.cursor = '';
                }
                this.draggedWindow = null;
            }
        });
    }

    closeAllWindows() {
        this.windows.forEach((win, id) => {
            this.closeWindow(id);
        });
    }
}

// ===== NOTIFICATION MANAGER =====

class NotificationManager {
    constructor() {
        this.container = this.createContainer();
        this.notifications = [];
    }

    createContainer() {
        let container = document.querySelector('.notification-container');
        if (!container) {
            container = document.createElement('div');
            container.className = 'notification-container';
            document.body.appendChild(container);
        }
        return container;
    }

    show(message, options = {}) {
        const notification = document.createElement('div');
        notification.className = `notification ${options.type || ''}`;

        notification.innerHTML = `
            ${options.title ? `<div class="notification-title">${options.title}</div>` : ''}
            <div class="notification-message">${message}</div>
        `;

        this.container.appendChild(notification);
        this.notifications.push(notification);

        const duration = options.duration || 3000;
        if (duration > 0) {
            setTimeout(() => {
                this.remove(notification);
            }, duration);
        }

        return notification;
    }

    remove(notification) {
        notification.classList.add('fade-out');
        setTimeout(() => {
            notification.remove();
            const index = this.notifications.indexOf(notification);
            if (index > -1) {
                this.notifications.splice(index, 1);
            }
        }, 300);
    }

    error(message, title = 'Error') {
        return this.show(message, { type: 'error', title });
    }

    warning(message, title = 'Warning') {
        return this.show(message, { type: 'warning', title });
    }

    success(message, title = 'Success') {
        return this.show(message, { type: 'success', title });
    }

    info(message, title = 'Info') {
        return this.show(message, { type: 'info', title });
    }
}

// ===== DESKTOP BASE CLASS =====

class Desktop {
    constructor(name, theme) {
        this.name = name;
        this.theme = theme;
        this.windowManager = new WindowManager();
        this.notificationManager = new NotificationManager();
        this.apps = [];
        this.initialized = false;
    }

    async init() {
        if (this.initialized) return;

        // Apply theme
        document.documentElement.setAttribute('data-theme', this.theme);

        // Load theme CSS
        await this.loadTheme();

        // Create background
        this.createBackground();

        // Create taskbar
        this.createTaskbar();

        // Initialize desktop-specific features
        await this.initializeDesktop();

        this.initialized = true;
    }

    async loadTheme() {
        return new Promise((resolve, reject) => {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = `src/themes/${this.theme}-theme.css`;
            link.onload = resolve;
            link.onerror = reject;
            document.head.appendChild(link);
        });
    }

    createBackground() {
        // Override in subclass
    }

    createTaskbar() {
        // Override in subclass
    }

    initializeDesktop() {
        // Override in subclass
    }

    cleanup() {
        // Close all windows
        this.windowManager.closeAllWindows();

        // Remove background elements
        const bg = document.querySelector('.background-layer');
        if (bg) bg.innerHTML = '';

        // Remove taskbar
        const taskbar = document.querySelector('.taskbar');
        if (taskbar) taskbar.remove();
    }

    registerApp(app) {
        this.apps.push(app);
    }

    getApp(name) {
        return this.apps.find(app => app.name === name);
    }
}

// ===== CLOCK UTILITY =====

class Clock {
    constructor(elementId) {
        this.element = document.getElementById(elementId);
        this.interval = null;
    }

    start() {
        this.update();
        this.interval = setInterval(() => this.update(), 1000);
    }

    stop() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
    }

    update() {
        if (!this.element) return;
        const now = new Date();
        this.element.textContent = now.toTimeString().split(' ')[0];
    }
}

// ===== STATS MONITOR =====

class StatsMonitor {
    constructor() {
        this.stats = {
            fps: 60,
            memory: 0,
            cpu: 0
        };
    }

    update() {
        // Simulate stats - in real app would use Performance API
        this.stats.fps = Math.floor(55 + Math.random() * 10);
        this.stats.memory = Math.floor(40 + Math.random() * 20);
        this.stats.cpu = Math.floor(20 + Math.random() * 30);
        return this.stats;
    }
}

// ===== EXPORT TO GLOBAL =====

window.IGotVD = {
    WindowManager,
    NotificationManager,
    Desktop,
    Clock,
    StatsMonitor
};
