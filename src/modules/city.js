/**
 * Neon City Desktop Module - Urban Management System
 */
class CityDesktop extends IGotVD.Desktop {
    constructor() { super('NeonCity', 'city'); }

    createBackground() {
        const bg = document.querySelector('.background-layer');
        bg.innerHTML = '<div class="city-grid"></div><div class="neon-glow"></div>';
        for (let i = 0; i < 20; i++) {
            const light = document.createElement('div');
            light.className = 'city-light';
            light.style.cssText = `left:${Math.random()*100}%;bottom:${Math.random()*40}%;animation-delay:${Math.random()*2}s`;
            bg.appendChild(light);
        }
    }

    createTaskbar() {
        const taskbar = document.createElement('div');
        taskbar.className = 'taskbar';
        taskbar.innerHTML = `
            <div class="taskbar-left"><span style="font-size:1.5em;color:var(--primary)">🌆 Neon City Control</span>
                <div class="app-icons" style="display:flex;gap:15px;margin-left:20px">
                    <div class="app-icon" data-app="traffic">🚦 Traffic</div>
                    <div class="app-icon" data-app="cctv">📹 CCTV</div>
                    <div class="app-icon" data-app="power">⚡ Grid</div>
                </div>
            </div>
            <div class="taskbar-right"><span id="clock">00:00:00</span></div>`;
        document.querySelector('.desktop').appendChild(taskbar);
        taskbar.querySelectorAll('.app-icon').forEach(i => i.onclick = () => this.openApp(i.dataset.app));
    }

    async initializeDesktop() {
        new IGotVD.Clock('clock').start();
        this.notificationManager.success('City systems online', 'Control');
        setTimeout(() => this.openApp('traffic'), 500);
    }

    openApp(name) {
        const apps = {
            traffic: { title: '🚦 Traffic Control', content: '<div style="padding:20px;font-family:monospace;color:var(--primary)">TRAFFIC GRID ACTIVE<br>Vehicles: 24,892<br>Flow: OPTIMAL<br><span style="color:var(--accent)">All signals synced</span></div>' },
            cctv: { title: '📹 Surveillance', content: '<div style="padding:20px;text-align:center"><div style="font-size:4em;margin:20px">👁️</div><h3 style="color:var(--primary)">CCTV Network</h3><p>1,247 cameras online</p></div>' },
            power: { title: '⚡ Power Grid', content: '<div style="padding:20px"><h3 style="color:var(--primary)">Power Distribution</h3><div style="margin:15px 0"><div>Grid Load</div><div class="progress-bar"><div class="progress-fill" style="width:78%"></div></div></div></div>' }
        };
        const app = apps[name];
        if (app) this.windowManager.openWindow(this.windowManager.createWindow({ id: name, title: app.title, content: app.content, width: 600, height: 400, x: 50 + Math.random() * 100, y: 50 + Math.random() * 100 }));
    }
}
window.CityDesktop = CityDesktop;
