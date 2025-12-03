/**
 * BioTech Lab Desktop Module - Genetic Computing Interface
 */
class BiotechDesktop extends IGotVD.Desktop {
    constructor() { super('BioTech', 'biotech'); }

    createBackground() {
        const bg = document.querySelector('.background-layer');
        bg.innerHTML = '<div class="dna-helix"></div><div class="cell-grid"></div>';
        for (let i = 0; i < 25; i++) {
            const cell = document.createElement('div');
            cell.className = 'bio-cell';
            cell.style.cssText = `left:${Math.random()*100}%;top:${Math.random()*100}%;animation-delay:${Math.random()*3}s`;
            bg.appendChild(cell);
        }
    }

    createTaskbar() {
        const taskbar = document.createElement('div');
        taskbar.className = 'taskbar';
        taskbar.innerHTML = `
            <div class="taskbar-left"><span style="font-size:1.5em;color:var(--primary)">🧬 BioTech Lab OS</span>
                <div class="app-icons" style="display:flex;gap:15px;margin-left:20px">
                    <div class="app-icon" data-app="dna">🧬 DNA Lab</div>
                    <div class="app-icon" data-app="micro">🔬 Microscope</div>
                    <div class="app-icon" data-app="seq">📊 Sequencer</div>
                </div>
            </div>
            <div class="taskbar-right"><span id="clock">00:00:00</span></div>`;
        document.querySelector('.desktop').appendChild(taskbar);
        taskbar.querySelectorAll('.app-icon').forEach(i => i.onclick = () => this.openApp(i.dataset.app));
    }

    async initializeDesktop() {
        new IGotVD.Clock('clock').start();
        this.notificationManager.success('Lab systems online', 'BioTech');
        setTimeout(() => this.openApp('dna'), 500);
    }

    openApp(name) {
        const apps = {
            dna: { title: '🧬 DNA Editor', content: '<div style="padding:20px;font-family:monospace;color:var(--primary)">SEQUENCE LOADED<br>ATCGATCGATCG...<br><span style="color:var(--accent)">Gene expression: ACTIVE</span></div>' },
            micro: { title: '🔬 Microscope', content: '<div style="padding:20px;text-align:center"><div style="font-size:4em;margin:20px">🦠</div><h3 style="color:var(--primary)">Live Cell View</h3><p>Magnification: 1000x</p></div>' },
            seq: { title: '📊 Gene Sequencer', content: '<div style="padding:20px"><h3 style="color:var(--primary)">Sequencing Progress</h3><div style="margin:15px 0"><div>Genome Analysis</div><div class="progress-bar"><div class="progress-fill" style="width:67%"></div></div></div></div>' }
        };
        const app = apps[name];
        if (app) this.windowManager.openWindow(this.windowManager.createWindow({ id: name, title: app.title, content: app.content, width: 600, height: 400, x: 50 + Math.random() * 100, y: 50 + Math.random() * 100 }));
    }
}
window.BiotechDesktop = BiotechDesktop;
