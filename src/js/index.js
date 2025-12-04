/**
 * IGotVD Index Page JavaScript
 */

// App State
let allDesktops = [];
let filteredDesktops = [];
let currentTab = 'all';
let currentTheme = null;
let searchQuery = '';

// Initialize app
async function initialize() {
    try {
        const data = await api.getDesktops();
        allDesktops = data.desktops;
        console.log('Loaded ' + allDesktops.length + ' desktops');
        createParticles();
        setupEventListeners();
        populateThemeFilter();
        updateStats();
        renderDesktops();
    } catch (error) {
        console.error('Error loading desktops:', error);
        showError();
    }
}

function setupEventListeners() {
    var searchInput = document.getElementById('searchInput');
    var clearSearch = document.getElementById('clearSearch');

    searchInput.addEventListener('input', function(e) {
        searchQuery = e.target.value;
        clearSearch.classList.toggle('visible', searchQuery.length > 0);
        renderDesktops();
    });

    clearSearch.addEventListener('click', function() {
        searchInput.value = '';
        searchQuery = '';
        clearSearch.classList.remove('visible');
        renderDesktops();
    });

    document.querySelectorAll('.tab-item').forEach(function(tab) {
        tab.addEventListener('click', function() {
            document.querySelectorAll('.tab-item').forEach(function(t) { t.classList.remove('active'); });
            tab.classList.add('active');
            currentTab = tab.dataset.tab;
            updateSectionTitle();
            renderDesktops();
        });
    });

    document.getElementById('sortSelect').addEventListener('change', function() {
        renderDesktops();
    });

    document.getElementById('favoritesStat').addEventListener('click', function() {
        document.querySelectorAll('.tab-item').forEach(function(t) { t.classList.remove('active'); });
        document.querySelector('[data-tab="favorites"]').classList.add('active');
        currentTab = 'favorites';
        updateSectionTitle();
        renderDesktops();
    });

    document.getElementById('recentStat').addEventListener('click', function() {
        document.querySelectorAll('.tab-item').forEach(function(t) { t.classList.remove('active'); });
        document.querySelector('[data-tab="recent"]').classList.add('active');
        currentTab = 'recent';
        updateSectionTitle();
        renderDesktops();
    });
}

function populateThemeFilter() {
    var themes = [];
    allDesktops.forEach(function(d) {
        if (themes.indexOf(d.theme) === -1) themes.push(d.theme);
    });
    themes.sort();
    var themeFilter = document.getElementById('themeFilter');

    themes.forEach(function(theme) {
        var tag = document.createElement('div');
        tag.className = 'theme-tag';
        tag.textContent = theme;
        tag.dataset.theme = theme;
        tag.addEventListener('click', function() {
            if (currentTheme === theme) {
                currentTheme = null;
                tag.classList.remove('active');
            } else {
                document.querySelectorAll('.theme-tag').forEach(function(t) { t.classList.remove('active'); });
                currentTheme = theme;
                tag.classList.add('active');
            }
            renderDesktops();
        });
        themeFilter.appendChild(tag);
    });
}

function updateStats() {
    var favorites = api.getFavorites();
    var recent = api.getRecent();
    document.getElementById('totalCount').textContent = allDesktops.length;
    document.getElementById('favoritesCount').textContent = favorites.length;
    document.getElementById('recentCount').textContent = recent.length;
    document.getElementById('allCount').textContent = allDesktops.length;
    document.getElementById('favCount').textContent = favorites.length;
    document.getElementById('recCount').textContent = recent.length;
}

function updateSectionTitle() {
    var titles = {
        all: { title: 'All Virtual Desktops', subtitle: 'Explore browser-based operating systems and workspaces' },
        favorites: { title: 'Your Favorites', subtitle: 'Desktops you have starred for quick access' },
        recent: { title: 'Recently Viewed', subtitle: 'Your recently accessed virtual desktops' }
    };
    var config = titles[currentTab];
    document.getElementById('sectionTitle').textContent = config.title;
    document.getElementById('sectionSubtitle').textContent = config.subtitle;
}

function getFilteredDesktops() {
    var desktops = allDesktops.slice();
    if (currentTab === 'favorites') {
        var favorites = api.getFavorites();
        desktops = desktops.filter(function(d) { return favorites.indexOf(getDesktopId(d)) !== -1; });
    } else if (currentTab === 'recent') {
        var recent = api.getRecent().map(function(r) { return r.name; });
        desktops = desktops.filter(function(d) { return recent.indexOf(getDesktopId(d)) !== -1; });
    }
    if (currentTheme) {
        desktops = desktops.filter(function(d) { return d.theme === currentTheme; });
    }
    if (searchQuery) {
        var query = searchQuery.toLowerCase();
        desktops = desktops.filter(function(d) {
            return d.name.toLowerCase().indexOf(query) !== -1 ||
                   d.description.toLowerCase().indexOf(query) !== -1 ||
                   d.theme.toLowerCase().indexOf(query) !== -1 ||
                   d.features.some(function(f) { return f.toLowerCase().indexOf(query) !== -1; });
        });
    }
    var sortValue = document.getElementById('sortSelect').value;
    if (sortValue === 'name-asc') {
        desktops.sort(function(a, b) { return a.name.localeCompare(b.name); });
    } else if (sortValue === 'name-desc') {
        desktops.sort(function(a, b) { return b.name.localeCompare(a.name); });
    } else if (sortValue === 'theme-asc') {
        desktops.sort(function(a, b) { return a.theme.localeCompare(b.theme); });
    }
    return desktops;
}

function renderDesktops() {
    var grid = document.getElementById('desktopGrid');
    var desktops = getFilteredDesktops();
    if (desktops.length === 0) { showEmptyState(grid); return; }
    grid.innerHTML = '';
    var favorites = api.getFavorites();
    var recent = api.getRecent();

    desktops.forEach(function(desktop) {
        var desktopId = getDesktopId(desktop);
        var isFavorite = favorites.indexOf(desktopId) !== -1;
        var recentItem = recent.find(function(r) { return r.name === desktopId; });
        var card = document.createElement('div');
        card.className = 'desktop-card card-' + desktop.theme;
        var features = desktop.features.slice(0, 3).map(function(f) { return '<li>' + f + '</li>'; }).join('');
        var moreFeatures = desktop.features.length > 3 ? '<li>+' + (desktop.features.length - 3) + ' more...</li>' : '';
        var recentHtml = recentItem ? '<div class="card-meta"><div class="meta-item"><span>Viewed ' + formatRelativeTime(recentItem.timestamp) + '</span></div></div>' : '';

        card.innerHTML = '<div class="card-header"><span class="card-icon">' + desktop.icon + '</span>' +
            '<button class="favorite-btn ' + (isFavorite ? 'active' : '') + '" data-desktop="' + desktopId + '">' + (isFavorite ? '★' : '☆') + '</button></div>' +
            '<div class="card-theme">' + desktop.theme + '</div>' +
            '<div class="card-title">' + desktop.name + '</div>' +
            '<div class="card-description">' + desktop.description + '</div>' +
            '<ul class="card-features">' + features + moreFeatures + '</ul>' + recentHtml +
            '<div class="card-buttons">' +
            '<a href="' + desktop.file + '" class="btn btn-primary" data-desktop="' + desktopId + '">Launch</a>' +
            '<a href="desktop.html?mode=' + desktopId + '" class="btn btn-secondary" data-desktop="' + desktopId + '">Modular</a>' +
            '</div>';
        grid.appendChild(card);
    });

    document.querySelectorAll('.favorite-btn').forEach(function(btn) {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            var desktopId = btn.dataset.desktop;
            var isFavorite = btn.classList.contains('active');
            if (isFavorite) {
                api.removeFavorite(desktopId);
                btn.classList.remove('active');
                btn.textContent = '☆';
            } else {
                api.addFavorite(desktopId);
                btn.classList.add('active');
                btn.textContent = '★';
            }
            updateStats();
        });
    });
}

function getDesktopId(desktop) {
    if (desktop && typeof desktop === 'object' && desktop.mode) return desktop.mode;
    var filename = typeof desktop === 'string' ? desktop : desktop.file;
    return filename.replace('.html', '').replace('_desktop', '').replace(/_/g, '');
}

function formatRelativeTime(timestamp) {
    var now = new Date();
    var then = new Date(timestamp);
    var diff = now - then;
    var minutes = Math.floor(diff / 60000);
    var hours = Math.floor(diff / 3600000);
    var days = Math.floor(diff / 86400000);
    if (minutes < 1) return 'just now';
    if (minutes < 60) return minutes + 'm ago';
    if (hours < 24) return hours + 'h ago';
    return days + 'd ago';
}

function showEmptyState(grid) {
    var msgs = {
        all: { icon: '🔍', title: 'No desktops found', text: 'Try adjusting your search or filters' },
        favorites: { icon: '⭐', title: 'No favorites yet', text: 'Click the star icon on any desktop to add it to your favorites' },
        recent: { icon: '🕒', title: 'No recent desktops', text: 'Launch a desktop to see it appear here' }
    };
    var msg = msgs[currentTab] || msgs.all;
    grid.innerHTML = '<div class="empty-state" style="grid-column: 1 / -1;"><div class="empty-icon">' + msg.icon + '</div><div class="empty-title">' + msg.title + '</div><div class="empty-text">' + msg.text + '</div></div>';
}

function showError() {
    var grid = document.getElementById('desktopGrid');
    grid.innerHTML = '<div class="empty-state" style="grid-column: 1 / -1;"><div class="empty-icon">⚠️</div><div class="empty-title">Failed to load desktops</div><div class="empty-text">The manifest file could not be loaded.</div></div>';
}

function createParticles() {
    for (var i = 0; i < 25; i++) {
        var particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
        particle.style.animationDelay = Math.random() * 5 + 's';
        document.body.appendChild(particle);
    }
}

// Start
initialize();
