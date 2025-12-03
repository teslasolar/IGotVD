/**
 * Ocean Lab Desktop Module - Deep Sea Research Facility
 */
class OceanDesktop extends IGotVD.Desktop {
    constructor() { super('OceanLab', 'ocean'); }

    createBackground() {
        const bg = document.querySelector('.background-layer');
        bg.innerHTML = '<div class="ocean-depth"></div><div class="caustics"></div>';
        for (let i = 0; i < 30; i++) {
            const bubble = document.createElement('div');
            bubble.className = 'bubble';
            bubble.style.cssText = `left:${Math.random()*100}%;animation-duration:${3+Math.random()*4}s;animation-delay:${Math.random()*5}s`;
            bg.appendChild(bubble);
        }
    }

    createTaskbar() {
        const taskbar = document.createElement('div');
        taskbar.className = 'taskbar';
        taskbar.innerHTML = `
            <div class="taskbar-left"><span style="font-size:1.5em;color:var(--primary)">🌊 Ocean Lab Station</span>
                <div class="app-icons" style="display:flex;gap:15px;margin-left:20px">
                    <div class="app-icon" data-app="sonar">📡 Sonar</div>
                    <div class="app-icon" data-app="sub">🚢 Sub Control</div>
                    <div class="app-icon" data-app="bio">🐟 Marine Bio</div>
                </div>
            </div>
            <div class="taskbar-right"><span id="clock">00:00:00</span></div>`;
        document.querySelector('.desktop').appendChild(taskbar);
        taskbar.querySelectorAll('.app-icon').forEach(i => i.onclick = () => this.openApp(i.dataset.app));
    }

    async initializeDesktop() {
        new IGotVD.Clock('clock').start();
        this.notificationManager.success('Pressure stable', 'OceanLab');
        setTimeout(() => this.openApp('sonar'), 500);
    }

    openApp(name) {
        const apps = {
            sonar: { title: '📡 Sonar Array', content: '<div style="padding:20px;font-family:monospace;color:var(--primary)">SONAR ACTIVE<br>Depth: 3,200m<br>Contacts: 12<br><span style="color:var(--accent)">Mapping seafloor...</span></div>' },
            sub: { title: '🚢 Submarine Control', content: '<div style="padding:20px;text-align:center"><div style="font-size:4em;margin:20px">🤿</div><h3 style="color:var(--primary)">ROV Status</h3><p>Depth: 2,800m | Battery: 84%</p></div>' },
            bio: { title: '🐟 Marine Biology', content: '<div style="padding:20px"><h3 style="color:var(--primary)">Species Database</h3><div style="margin:15px 0"><div>Catalog Progress</div><div class="progress-bar"><div class="progress-fill" style="width:43%"></div></div></div></div>' }
        };
        const app = apps[name];
        if (app) this.windowManager.openWindow(this.windowManager.createWindow({ id: name, title: app.title, content: app.content, width: 600, height: 400, x: 50 + Math.random() * 100, y: 50 + Math.random() * 100 }));
    }
}
window.OceanDesktop = OceanDesktop;
