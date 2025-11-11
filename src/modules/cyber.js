/**
 * CyberOS Desktop Module
 * Cyberpunk Matrix-style terminal desktop
 */

class CyberDesktop extends IGotVD.Desktop {
    constructor() {
        super('CyberOS', 'cyber');
        this.clock = null;
    }

    createBackground() {
        const bg = document.querySelector('.background-layer') || document.createElement('div');
        bg.className = 'background-layer';
        bg.innerHTML = '';

        // Matrix rain effect
        for (let i = 0; i < 50; i++) {
            const char = document.createElement('div');
            char.className = 'matrix-char';
            char.textContent = String.fromCharCode(0x30A0 + Math.random() * 96);
            char.style.left = Math.random() * 100 + '%';
            char.style.animationDuration = (Math.random() * 3 + 2) + 's';
            char.style.animationDelay = Math.random() * 5 + 's';
            bg.appendChild(char);
        }

        // Add scanlines
        const scanlines = document.createElement('div');
        scanlines.className = 'scanlines';
        bg.appendChild(scanlines);

        // Add CRT effect
        const crt = document.createElement('div');
        crt.className = 'crt-effect';
        bg.appendChild(crt);

        if (!bg.parentElement) {
            document.querySelector('.desktop').insertBefore(bg, document.querySelector('.desktop').firstChild);
        }
    }

    createTaskbar() {
        const taskbar = document.createElement('div');
        taskbar.className = 'taskbar';
        taskbar.innerHTML = `
            <div class="taskbar-left">
                <div style="font-size: 1.5em; color: var(--primary); font-weight: bold; text-shadow: 0 0 10px var(--primary);">
                    🖥️ CyberOS v7.2
                </div>
                <div class="app-icons" style="display: flex; gap: 15px; margin-left: 20px;">
                    <div class="app-icon" data-app="terminal">💻 Terminal</div>
                    <div class="app-icon" data-app="files">📁 Files</div>
                    <div class="app-icon" data-app="monitor">📊 Monitor</div>
                    <div class="app-icon" data-app="editor">📝 Editor</div>
                    <div class="app-icon" data-app="browser">🌐 Browser</div>
                </div>
            </div>
            <div class="taskbar-right">
                <div style="display: flex; gap: 15px; font-size: 0.9em;">
                    <div>CPU: <span id="cpu-stat" style="color: var(--accent); font-weight: bold;">0%</span></div>
                    <div>RAM: <span id="ram-stat" style="color: var(--accent); font-weight: bold;">0%</span></div>
                    <div>⏰ <span id="clock" style="color: var(--accent); font-weight: bold;">00:00:00</span></div>
                </div>
            </div>
        `;

        document.querySelector('.desktop').appendChild(taskbar);

        // Attach event listeners
        taskbar.querySelectorAll('.app-icon').forEach(icon => {
            icon.addEventListener('click', () => {
                const appName = icon.dataset.app;
                this.openApp(appName);
            });
        });
    }

    async initializeDesktop() {
        // Start clock
        this.clock = new IGotVD.Clock('clock');
        this.clock.start();

        // Start stats monitor
        this.startStatsMonitor();

        // Show welcome notification
        this.notificationManager.success('System initialized successfully', 'CyberOS');

        // Auto-open terminal
        setTimeout(() => {
            this.openApp('terminal');
        }, 500);
    }

    startStatsMonitor() {
        const monitor = new IGotVD.StatsMonitor();

        setInterval(() => {
            const stats = monitor.update();
            const cpuEl = document.getElementById('cpu-stat');
            const ramEl = document.getElementById('ram-stat');

            if (cpuEl) cpuEl.textContent = stats.cpu + '%';
            if (ramEl) ramEl.textContent = stats.memory + '%';
        }, 2000);
    }

    openApp(appName) {
        switch (appName) {
            case 'terminal':
                this.openTerminal();
                break;
            case 'files':
                this.openFileManager();
                break;
            case 'monitor':
                this.openSystemMonitor();
                break;
            case 'editor':
                this.openCodeEditor();
                break;
            case 'browser':
                this.openBrowser();
                break;
        }
    }

    openTerminal() {
        const content = `
            <div style="background: rgba(0, 0, 0, 0.9); padding: 15px; border-radius: 5px; font-family: 'Courier New', monospace; height: 100%;">
                <div style="color: var(--primary); margin-bottom: 15px;">
                    CyberOS Terminal v7.2 - Type 'help' for commands
                </div>
                <div id="terminal-output" style="height: calc(100% - 80px); overflow-y: auto; margin-bottom: 10px;">
                    <div style="margin: 5px 0;">
                        <span style="color: var(--accent);">user@cyberOS:~$</span>
                        <span style="color: var(--text);"> system.status()</span>
                    </div>
                    <div style="margin: 5px 0; color: var(--primary);">
                        ✓ All systems operational<br>
                        ✓ Security protocols active<br>
                        ✓ Network connection established
                    </div>
                </div>
                <div style="display: flex; gap: 10px;">
                    <span style="color: var(--accent);">user@cyberOS:~$</span>
                    <input type="text" id="terminal-input" style="flex: 1; background: transparent; border: none; color: var(--primary); outline: none; font-family: 'Courier New', monospace;" placeholder="Enter command...">
                </div>
            </div>
        `;

        const windowId = this.windowManager.createWindow({
            id: 'terminal',
            title: '💻 Terminal',
            content: content,
            width: 700,
            height: 500,
            x: 50,
            y: 50
        });

        this.windowManager.openWindow(windowId);

        // Add terminal functionality
        setTimeout(() => {
            const input = document.getElementById('terminal-input');
            const output = document.getElementById('terminal-output');

            if (input && output) {
                input.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter') {
                        const command = input.value.trim();
                        if (command) {
                            const prompt = `<div style="margin: 5px 0;"><span style="color: var(--accent);">user@cyberOS:~$</span> <span style="color: var(--text);">${command}</span></div>`;
                            const response = this.executeCommand(command);
                            output.innerHTML += prompt + response;
                            output.scrollTop = output.scrollHeight;
                            input.value = '';
                        }
                    }
                });
                input.focus();
            }
        }, 100);
    }

    executeCommand(cmd) {
        const commands = {
            'help': '<div style="color: var(--primary);">Available commands: help, status, clear, date, echo, whoami</div>',
            'status': '<div style="color: var(--primary);">System: ONLINE | Memory: 64GB | CPU: 8 cores</div>',
            'clear': '',
            'date': `<div style="color: var(--primary);">${new Date().toString()}</div>`,
            'whoami': '<div style="color: var(--primary);">user@cyberOS</div>'
        };

        if (cmd === 'clear') {
            document.getElementById('terminal-output').innerHTML = '';
            return '';
        }

        if (cmd.startsWith('echo ')) {
            return `<div style="color: var(--primary);">${cmd.substring(5)}</div>`;
        }

        return commands[cmd] || `<div style="color: #ff4757;">Command not found: ${cmd}</div>`;
    }

    openFileManager() {
        const content = `
            <div style="padding: 10px;">
                <div style="margin-bottom: 15px; padding: 10px; background: rgba(0, 255, 65, 0.1); border-radius: 5px;">
                    📂 /home/user
                </div>
                <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px;">
                    ${this.generateFileItems()}
                </div>
            </div>
        `;

        const windowId = this.windowManager.createWindow({
            id: 'files',
            title: '📁 File Manager',
            content: content,
            width: 800,
            height: 600,
            x: 100,
            y: 100
        });

        this.windowManager.openWindow(windowId);
    }

    generateFileItems() {
        const items = [
            { icon: '📁', name: 'Documents', type: 'folder' },
            { icon: '📁', name: 'Downloads', type: 'folder' },
            { icon: '📁', name: 'Projects', type: 'folder' },
            { icon: '📁', name: 'Pictures', type: 'folder' },
            { icon: '📄', name: 'readme.txt', type: 'file' },
            { icon: '📄', name: 'config.json', type: 'file' },
            { icon: '🖼️', name: 'avatar.png', type: 'file' },
            { icon: '🎵', name: 'music.mp3', type: 'file' }
        ];

        return items.map(item => `
            <div class="card" style="text-align: center; cursor: pointer; padding: 20px;">
                <div style="font-size: 3em; margin-bottom: 10px;">${item.icon}</div>
                <div style="font-size: 0.9em; color: var(--text);">${item.name}</div>
            </div>
        `).join('');
    }

    openSystemMonitor() {
        const content = `
            <div style="padding: 15px;">
                <h3 style="color: var(--primary); margin-bottom: 20px;">System Performance</h3>

                <div style="margin-bottom: 20px;">
                    <div style="margin-bottom: 5px;">CPU Usage</div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: 45%;"></div>
                        <div class="progress-text">45%</div>
                    </div>
                </div>

                <div style="margin-bottom: 20px;">
                    <div style="margin-bottom: 5px;">RAM Usage</div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: 68%;"></div>
                        <div class="progress-text">68%</div>
                    </div>
                </div>

                <div style="margin-bottom: 20px;">
                    <div style="margin-bottom: 5px;">Disk Usage</div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: 34%;"></div>
                        <div class="progress-text">34%</div>
                    </div>
                </div>

                <div style="margin-bottom: 20px;">
                    <div style="margin-bottom: 5px;">Network</div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: 22%;"></div>
                        <div class="progress-text">22 MB/s</div>
                    </div>
                </div>
            </div>
        `;

        const windowId = this.windowManager.createWindow({
            id: 'monitor',
            title: '📊 System Monitor',
            content: content,
            width: 500,
            height: 400,
            x: 150,
            y: 150
        });

        this.windowManager.openWindow(windowId);
    }

    openCodeEditor() {
        const content = `
            <div style="height: 100%; display: flex; flex-direction: column;">
                <div style="padding: 10px; background: rgba(0, 255, 65, 0.1); border-bottom: 1px solid var(--border);">
                    <input type="text" placeholder="filename.js" style="width: 100%; padding: 5px; background: rgba(0, 0, 0, 0.5); border: 1px solid var(--border); color: var(--text); border-radius: 3px;">
                </div>
                <textarea style="flex: 1; background: rgba(0, 0, 0, 0.9); border: none; color: var(--primary); padding: 15px; font-family: 'Courier New', monospace; font-size: 14px; resize: none; line-height: 1.5;" placeholder="// Write your code here..."></textarea>
            </div>
        `;

        const windowId = this.windowManager.createWindow({
            id: 'editor',
            title: '📝 Code Editor',
            content: content,
            width: 700,
            height: 500,
            x: 200,
            y: 100
        });

        this.windowManager.openWindow(windowId);
    }

    openBrowser() {
        const content = `
            <div style="height: 100%; display: flex; flex-direction: column;">
                <div style="padding: 10px; background: rgba(0, 255, 65, 0.1); border-bottom: 1px solid var(--border); display: flex; gap: 10px;">
                    <button class="btn" style="padding: 5px 15px;">←</button>
                    <button class="btn" style="padding: 5px 15px;">→</button>
                    <input type="text" value="https://cyberOS.local" style="flex: 1; padding: 8px; background: rgba(0, 0, 0, 0.5); border: 1px solid var(--border); color: var(--text); border-radius: 5px;">
                    <button class="btn" style="padding: 5px 20px;">Go</button>
                </div>
                <div style="flex: 1; background: rgba(0, 0, 0, 0.5); padding: 30px; text-align: center; display: flex; align-items: center; justify-content: center;">
                    <div>
                        <div style="font-size: 4em; margin-bottom: 20px;">🌐</div>
                        <h2 style="color: var(--primary); margin-bottom: 10px;">Welcome to CyberBrowser</h2>
                        <p style="color: var(--text);">Secure browsing in the CyberOS environment</p>
                    </div>
                </div>
            </div>
        `;

        const windowId = this.windowManager.createWindow({
            id: 'browser',
            title: '🌐 Browser',
            content: content,
            width: 900,
            height: 600,
            x: 80,
            y: 80
        });

        this.windowManager.openWindow(windowId);
    }

    cleanup() {
        if (this.clock) {
            this.clock.stop();
        }
        super.cleanup();
    }
}

// Export
window.CyberDesktop = CyberDesktop;
