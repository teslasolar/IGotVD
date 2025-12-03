/**
 * Hacker Terminal Desktop Module - Elite Security Workstation
 */
class HackerDesktop extends IGotVD.Desktop {
    constructor() { super('H4CK3R', 'hacker'); }

    createBackground() {
        const bg = document.querySelector('.background-layer');
        bg.innerHTML = '<div class="hex-grid"></div><div class="scanlines"></div>';
        for (let i = 0; i < 40; i++) {
            const char = document.createElement('div');
            char.className = 'hack-char';
            char.textContent = Math.random() > 0.5 ? '1' : '0';
            char.style.cssText = `left:${Math.random()*100}%;animation-duration:${2+Math.random()*3}s;animation-delay:${Math.random()*5}s`;
            bg.appendChild(char);
        }
    }

    createTaskbar() {
        const taskbar = document.createElement('div');
        taskbar.className = 'taskbar';
        taskbar.innerHTML = `
            <div class="taskbar-left"><span style="font-size:1.5em;color:var(--primary)">👾 H4CK3R T3RM1N4L</span>
                <div class="app-icons" style="display:flex;gap:15px;margin-left:20px">
                    <div class="app-icon" data-app="shell">💀 Shell</div>
                    <div class="app-icon" data-app="scan">🔍 Scanner</div>
                    <div class="app-icon" data-app="crypto">🔐 Crypto</div>
                </div>
            </div>
            <div class="taskbar-right"><span id="clock">00:00:00</span></div>`;
        document.querySelector('.desktop').appendChild(taskbar);
        taskbar.querySelectorAll('.app-icon').forEach(i => i.onclick = () => this.openApp(i.dataset.app));
    }

    async initializeDesktop() {
        new IGotVD.Clock('clock').start();
        this.notificationManager.success('Access granted', 'H4CK3R');
        setTimeout(() => this.openApp('shell'), 500);
    }

    openApp(name) {
        const apps = {
            shell: { title: '💀 Root Shell', content: '<div style="padding:20px;font-family:monospace;color:var(--primary)">root@h4ck3r:~# whoami<br><span style="color:var(--accent)">root</span><br>root@h4ck3r:~# _</div>' },
            scan: { title: '🔍 Network Scanner', content: '<div style="padding:20px"><h3 style="color:var(--primary)">Port Scan Results</h3><div class="card" style="margin:10px 0;padding:10px;font-family:monospace">22/tcp open ssh<br>80/tcp open http<br>443/tcp open https</div></div>' },
            crypto: { title: '🔐 Crypto Tools', content: '<div style="padding:20px;text-align:center"><div style="font-size:4em;margin:20px">🔓</div><h3 style="color:var(--primary)">Encryption Suite</h3><p>AES-256 | RSA-4096</p></div>' }
        };
        const app = apps[name];
        if (app) this.windowManager.openWindow(this.windowManager.createWindow({ id: name, title: app.title, content: app.content, width: 600, height: 400, x: 50 + Math.random() * 100, y: 50 + Math.random() * 100 }));
    }
}
window.HackerDesktop = HackerDesktop;
