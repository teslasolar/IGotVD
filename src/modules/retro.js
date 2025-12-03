/**
 * RetroWave Desktop Module - 1980s Vaporwave Aesthetic
 */
class RetroDesktop extends IGotVD.Desktop {
    constructor() { super('RetroWave', 'retro'); }

    createBackground() {
        const bg = document.querySelector('.background-layer');
        bg.innerHTML = '<div class="retro-grid"></div><div class="sun-glow"></div>';
        for (let i = 0; i < 15; i++) {
            const star = document.createElement('div');
            star.className = 'retro-star';
            star.style.cssText = `left:${Math.random()*100}%;top:${Math.random()*50}%;animation-delay:${Math.random()*2}s`;
            bg.appendChild(star);
        }
    }

    createTaskbar() {
        const taskbar = document.createElement('div');
        taskbar.className = 'taskbar';
        taskbar.innerHTML = `
            <div class="taskbar-left"><span style="font-size:1.5em;color:var(--primary)">🌆 RetroWave v2.0</span>
                <div class="app-icons" style="display:flex;gap:15px;margin-left:20px">
                    <div class="app-icon" data-app="terminal">💾 Terminal</div>
                    <div class="app-icon" data-app="music">🎵 Synth</div>
                    <div class="app-icon" data-app="arcade">🕹️ Arcade</div>
                </div>
            </div>
            <div class="taskbar-right"><span id="clock">00:00:00</span></div>`;
        document.querySelector('.desktop').appendChild(taskbar);
        taskbar.querySelectorAll('.app-icon').forEach(i => i.onclick = () => this.openApp(i.dataset.app));
    }

    async initializeDesktop() {
        new IGotVD.Clock('clock').start();
        this.notificationManager.success('Welcome to the 80s', 'RetroWave');
        setTimeout(() => this.openApp('terminal'), 500);
    }

    openApp(name) {
        const apps = {
            terminal: { title: '💾 Retro Terminal', content: '<div style="padding:20px;font-family:monospace;color:var(--primary)">RETROWAVE OS v2.0<br>READY.<br><span style="color:var(--accent)">></span> _</div>' },
            music: { title: '🎵 Synth Player', content: '<div style="padding:20px;text-align:center"><div style="font-size:4em;margin:20px">🎹</div><h3 style="color:var(--primary)">Synthwave Player</h3><p>Now Playing: Neon Dreams</p></div>' },
            arcade: { title: '🕹️ Arcade', content: '<div style="padding:20px;text-align:center"><div style="font-size:4em;margin:20px">👾</div><h3 style="color:var(--primary)">Retro Arcade</h3><p>INSERT COIN TO PLAY</p></div>' }
        };
        const app = apps[name];
        if (app) this.windowManager.openWindow(this.windowManager.createWindow({ id: name, title: app.title, content: app.content, width: 600, height: 400, x: 50 + Math.random() * 100, y: 50 + Math.random() * 100 }));
    }
}
window.RetroDesktop = RetroDesktop;
