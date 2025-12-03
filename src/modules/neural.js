/**
 * NeuroNet Desktop Module - AI/ML Development Environment
 */
class NeuralDesktop extends IGotVD.Desktop {
    constructor() { super('NeuroNet', 'neural'); }

    createBackground() {
        const bg = document.querySelector('.background-layer');
        bg.innerHTML = '<div class="neural-grid"></div><div class="pulse-effect"></div>';
        for (let i = 0; i < 20; i++) {
            const node = document.createElement('div');
            node.className = 'neural-node';
            node.style.cssText = `left:${Math.random()*100}%;top:${Math.random()*100}%;animation-delay:${Math.random()*3}s`;
            bg.appendChild(node);
        }
    }

    createTaskbar() {
        const taskbar = document.createElement('div');
        taskbar.className = 'taskbar';
        taskbar.innerHTML = `
            <div class="taskbar-left"><span style="font-size:1.5em;color:var(--primary)">🧠 NeuroNet v4.1</span>
                <div class="app-icons" style="display:flex;gap:15px;margin-left:20px">
                    <div class="app-icon" data-app="terminal">💻 Console</div>
                    <div class="app-icon" data-app="model">🤖 Models</div>
                    <div class="app-icon" data-app="data">📊 Data</div>
                </div>
            </div>
            <div class="taskbar-right"><span id="clock">00:00:00</span></div>`;
        document.querySelector('.desktop').appendChild(taskbar);
        taskbar.querySelectorAll('.app-icon').forEach(i => i.onclick = () => this.openApp(i.dataset.app));
    }

    async initializeDesktop() {
        new IGotVD.Clock('clock').start();
        this.notificationManager.success('Neural network initialized', 'NeuroNet');
        setTimeout(() => this.openApp('terminal'), 500);
    }

    openApp(name) {
        const apps = {
            terminal: { title: '💻 Neural Console', content: '<div style="padding:20px;font-family:monospace;color:var(--primary)">NeuroNet Console v4.1<br>>>> model.status()<br><span style="color:var(--accent)">All neural pathways active</span></div>' },
            model: { title: '🤖 Model Manager', content: '<div style="padding:20px"><h3 style="color:var(--primary)">Active Models</h3><div class="card" style="margin:10px 0;padding:15px">GPT-Neural v3.2 - Running</div><div class="card" style="margin:10px 0;padding:15px">Vision-Net v2.1 - Standby</div></div>' },
            data: { title: '📊 Data Pipeline', content: '<div style="padding:20px"><h3 style="color:var(--primary)">Data Streams</h3><div style="margin:15px 0"><div>Training Data</div><div class="progress-bar"><div class="progress-fill" style="width:72%"></div></div></div></div>' }
        };
        const app = apps[name];
        if (app) this.windowManager.openWindow(this.windowManager.createWindow({ id: name, title: app.title, content: app.content, width: 600, height: 400, x: 50 + Math.random() * 100, y: 50 + Math.random() * 100 }));
    }
}
window.NeuralDesktop = NeuralDesktop;
