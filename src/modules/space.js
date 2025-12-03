/**
 * Space Station Desktop Module - Orbital Command Interface
 */
class SpaceDesktop extends IGotVD.Desktop {
    constructor() { super('SpaceStation', 'space'); }

    createBackground() {
        const bg = document.querySelector('.background-layer');
        bg.innerHTML = '<div class="star-field"></div>';
        for (let i = 0; i < 60; i++) {
            const star = document.createElement('div');
            star.className = 'space-star';
            star.style.cssText = `left:${Math.random()*100}%;top:${Math.random()*100}%;animation-delay:${Math.random()*3}s;width:${1+Math.random()*2}px;height:${1+Math.random()*2}px`;
            bg.appendChild(star);
        }
    }

    createTaskbar() {
        const taskbar = document.createElement('div');
        taskbar.className = 'taskbar';
        taskbar.innerHTML = `
            <div class="taskbar-left"><span style="font-size:1.5em;color:var(--primary)">🛰️ Space Station OS</span>
                <div class="app-icons" style="display:flex;gap:15px;margin-left:20px">
                    <div class="app-icon" data-app="nav">🌍 Navigation</div>
                    <div class="app-icon" data-app="comms">📡 Comms</div>
                    <div class="app-icon" data-app="life">💨 Life Support</div>
                </div>
            </div>
            <div class="taskbar-right"><span id="clock">00:00:00</span></div>`;
        document.querySelector('.desktop').appendChild(taskbar);
        taskbar.querySelectorAll('.app-icon').forEach(i => i.onclick = () => this.openApp(i.dataset.app));
    }

    async initializeDesktop() {
        new IGotVD.Clock('clock').start();
        this.notificationManager.success('Orbital systems nominal', 'Station');
        setTimeout(() => this.openApp('nav'), 500);
    }

    openApp(name) {
        const apps = {
            nav: { title: '🌍 Navigation', content: '<div style="padding:20px;font-family:monospace;color:var(--primary)">ORBITAL POSITION<br>Alt: 408 km<br>Vel: 7.66 km/s<br><span style="color:var(--accent)">Next sunrise: 45 min</span></div>' },
            comms: { title: '📡 Communications', content: '<div style="padding:20px;text-align:center"><div style="font-size:4em;margin:20px">📡</div><h3 style="color:var(--primary)">Ground Link Active</h3><p>Signal: 98% | Latency: 240ms</p></div>' },
            life: { title: '💨 Life Support', content: '<div style="padding:20px"><h3 style="color:var(--primary)">Environmental Status</h3><div style="margin:15px 0"><div>O2 Levels</div><div class="progress-bar"><div class="progress-fill" style="width:95%"></div></div></div></div>' }
        };
        const app = apps[name];
        if (app) this.windowManager.openWindow(this.windowManager.createWindow({ id: name, title: app.title, content: app.content, width: 600, height: 400, x: 50 + Math.random() * 100, y: 50 + Math.random() * 100 }));
    }
}
window.SpaceDesktop = SpaceDesktop;
