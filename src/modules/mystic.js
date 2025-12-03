/**
 * Mystic Arcane Desktop Module - Fantasy Wizard Workstation
 */
class MysticDesktop extends IGotVD.Desktop {
    constructor() { super('MysticArcane', 'mystic'); }

    createBackground() {
        const bg = document.querySelector('.background-layer');
        bg.innerHTML = '<div class="magic-circle"></div><div class="rune-glow"></div>';
        for (let i = 0; i < 20; i++) {
            const spark = document.createElement('div');
            spark.className = 'magic-spark';
            spark.style.cssText = `left:${Math.random()*100}%;top:${Math.random()*100}%;animation-delay:${Math.random()*3}s`;
            bg.appendChild(spark);
        }
    }

    createTaskbar() {
        const taskbar = document.createElement('div');
        taskbar.className = 'taskbar';
        taskbar.innerHTML = `
            <div class="taskbar-left"><span style="font-size:1.5em;color:var(--primary)">✨ Mystic Arcane</span>
                <div class="app-icons" style="display:flex;gap:15px;margin-left:20px">
                    <div class="app-icon" data-app="spell">📖 Spellbook</div>
                    <div class="app-icon" data-app="potion">🧪 Potions</div>
                    <div class="app-icon" data-app="crystal">🔮 Scrying</div>
                </div>
            </div>
            <div class="taskbar-right"><span id="clock">00:00:00</span></div>`;
        document.querySelector('.desktop').appendChild(taskbar);
        taskbar.querySelectorAll('.app-icon').forEach(i => i.onclick = () => this.openApp(i.dataset.app));
    }

    async initializeDesktop() {
        new IGotVD.Clock('clock').start();
        this.notificationManager.success('Mana restored', 'Arcane');
        setTimeout(() => this.openApp('spell'), 500);
    }

    openApp(name) {
        const apps = {
            spell: { title: '📖 Grimoire', content: '<div style="padding:20px;font-family:serif;color:var(--primary)"><i>Ancient Tome of Spells</i><br><br>🔥 Fireball - 30 mana<br>❄️ Ice Storm - 45 mana<br><span style="color:var(--accent)">✨ Arcane Blast - 25 mana</span></div>' },
            potion: { title: '🧪 Alchemy Lab', content: '<div style="padding:20px;text-align:center"><div style="font-size:4em;margin:20px">⚗️</div><h3 style="color:var(--primary)">Brewing Station</h3><p>Health Potion brewing... 67%</p></div>' },
            crystal: { title: '🔮 Crystal Ball', content: '<div style="padding:20px"><h3 style="color:var(--primary)">Divination</h3><div style="margin:15px 0"><div>Mystic Energy</div><div class="progress-bar"><div class="progress-fill" style="width:88%"></div></div></div></div>' }
        };
        const app = apps[name];
        if (app) this.windowManager.openWindow(this.windowManager.createWindow({ id: name, title: app.title, content: app.content, width: 600, height: 400, x: 50 + Math.random() * 100, y: 50 + Math.random() * 100 }));
    }
}
window.MysticDesktop = MysticDesktop;
