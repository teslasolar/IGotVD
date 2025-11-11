#!/usr/bin/env node
/*<!--
# IGotVD API Server
RESTful API for managing virtual desktop environments.

## Features
- Desktop management (list, get, create)
- Manifest generation and serving
- Static file serving for desktop assets
- Health checks and system info
- CORS enabled for frontend access

## Usage
```bash
# Start server
node api/api.md

# Or make executable
chmod +x api/api.md
./api/api.md

# With custom port
PORT=8080 node api/api.md
```

## API Endpoints

### Desktops
- `GET /api/desktops` - List all available desktops
- `GET /api/desktops/:name` - Get specific desktop info
- `GET /api/manifest` - Get desktop manifest (desktops.json)
- `POST /api/manifest/generate` - Regenerate manifest

### System
- `GET /api/health` - Health check
- `GET /api/info` - System information

### Static Files
- `GET /desktop/:name` - Serve desktop HTML file
- `GET /src/*` - Serve source files (CSS, JS, themes, modules)

-->*/

const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

// Configuration
const PORT = process.env.PORT || 3000;
const BASE_DIR = path.join(__dirname, '..');
const MANIFEST_FILE = path.join(BASE_DIR, 'desktops.json');

// MIME types
const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.md': 'text/markdown'
};

class IGotVDAPI {
  constructor() {
    this.desktops = new Map();
    this.loadDesktops();
  }

  // Load desktop configurations
  loadDesktops() {
    console.log('📦 Loading desktop configurations...');

    // Scan for HTML files
    const files = fs.readdirSync(BASE_DIR);
    const htmlFiles = files.filter(f =>
      f.endsWith('.html') &&
      f !== 'index.html' &&
      f !== 'desktop.html' &&
      !f.startsWith('test-')
    );

    htmlFiles.forEach(file => {
      try {
        const content = fs.readFileSync(path.join(BASE_DIR, file), 'utf8');
        const title = this.extractTitle(content);
        const description = this.extractDescription(content);

        this.desktops.set(file.replace('.html', ''), {
          file,
          name: title || file.replace('.html', ''),
          description: description || `Virtual desktop: ${file}`,
          size: fs.statSync(path.join(BASE_DIR, file)).size,
          modified: fs.statSync(path.join(BASE_DIR, file)).mtime
        });
      } catch (e) {
        console.error(`Error loading ${file}:`, e.message);
      }
    });

    console.log(`✅ Loaded ${this.desktops.size} desktops`);
  }

  // Extract title from HTML
  extractTitle(html) {
    const match = html.match(/<title>(.*?)<\/title>/i);
    return match ? match[1].trim() : null;
  }

  // Extract description from HTML meta
  extractDescription(html) {
    const match = html.match(/<meta\s+name=["']description["']\s+content=["'](.*?)["']/i);
    return match ? match[1].trim() : null;
  }

  // API Routes
  async handleRequest(req, res) {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const pathname = url.pathname;
    const method = req.method;

    console.log(`${method} ${pathname}`);

    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (method === 'OPTIONS') {
      res.writeHead(200);
      res.end();
      return;
    }

    try {
      // API Routes
      if (pathname === '/api/health') {
        return this.handleHealth(req, res);
      }

      if (pathname === '/api/info') {
        return this.handleInfo(req, res);
      }

      if (pathname === '/api/desktops') {
        return this.handleListDesktops(req, res);
      }

      if (pathname.match(/^\/api\/desktops\/([^\/]+)$/)) {
        const name = pathname.split('/')[3];
        return this.handleGetDesktop(req, res, name);
      }

      if (pathname === '/api/manifest') {
        return this.handleGetManifest(req, res);
      }

      if (pathname === '/api/manifest/generate' && method === 'POST') {
        return this.handleGenerateManifest(req, res);
      }

      // Static file serving
      if (pathname.startsWith('/desktop/')) {
        const name = pathname.split('/')[2];
        return this.serveDesktop(req, res, name);
      }

      if (pathname.startsWith('/src/') || pathname === '/desktop.html' || pathname === '/index.html') {
        return this.serveStatic(req, res, pathname);
      }

      // 404
      this.send404(res, pathname);
    } catch (error) {
      this.send500(res, error);
    }
  }

  // Health check
  handleHealth(req, res) {
    this.sendJSON(res, {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      desktops: this.desktops.size
    });
  }

  // System info
  handleInfo(req, res) {
    this.sendJSON(res, {
      name: 'IGotVD API',
      version: '1.0.0',
      description: 'Virtual Desktop Collection API',
      desktops: this.desktops.size,
      node: process.version,
      platform: process.platform,
      arch: process.arch,
      memory: {
        total: Math.round(require('os').totalmem() / 1024 / 1024),
        free: Math.round(require('os').freemem() / 1024 / 1024),
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024)
      }
    });
  }

  // List all desktops
  handleListDesktops(req, res) {
    const desktops = Array.from(this.desktops.entries()).map(([key, value]) => ({
      id: key,
      ...value,
      url: `/desktop/${key}`,
      apiUrl: `/api/desktops/${key}`
    }));

    this.sendJSON(res, {
      count: desktops.length,
      desktops
    });
  }

  // Get specific desktop
  handleGetDesktop(req, res, name) {
    const desktop = this.desktops.get(name);

    if (!desktop) {
      return this.send404(res, `Desktop '${name}' not found`);
    }

    this.sendJSON(res, {
      id: name,
      ...desktop,
      url: `/desktop/${name}`,
      content: `/desktop/${name}`,
      modular: {
        available: fs.existsSync(path.join(BASE_DIR, `src/modules/${name}.js`)),
        module: `/src/modules/${name}.js`,
        theme: `/src/themes/${name}-theme.css`
      }
    });
  }

  // Get manifest
  handleGetManifest(req, res) {
    if (!fs.existsSync(MANIFEST_FILE)) {
      return this.send404(res, 'Manifest not found. Generate it first.');
    }

    const manifest = JSON.parse(fs.readFileSync(MANIFEST_FILE, 'utf8'));
    this.sendJSON(res, manifest);
  }

  // Generate manifest
  async handleGenerateManifest(req, res) {
    try {
      console.log('🔄 Generating manifest...');

      const scriptPath = path.join(BASE_DIR, 'generate-manifest.js');

      if (!fs.existsSync(scriptPath)) {
        return this.sendJSON(res, {
          success: false,
          error: 'generate-manifest.js not found'
        }, 404);
      }

      const { stdout, stderr } = await execAsync(`node "${scriptPath}"`);

      console.log(stdout);
      if (stderr) console.error(stderr);

      // Reload desktops
      this.loadDesktops();

      this.sendJSON(res, {
        success: true,
        message: 'Manifest generated successfully',
        output: stdout,
        desktops: this.desktops.size
      });
    } catch (error) {
      this.sendJSON(res, {
        success: false,
        error: error.message
      }, 500);
    }
  }

  // Serve desktop HTML file
  serveDesktop(req, res, name) {
    const desktop = this.desktops.get(name);

    if (!desktop) {
      return this.send404(res, `Desktop '${name}' not found`);
    }

    const filePath = path.join(BASE_DIR, desktop.file);
    this.serveFile(res, filePath, MIME_TYPES['.html']);
  }

  // Serve static files
  serveStatic(req, res, pathname) {
    const filePath = path.join(BASE_DIR, pathname);

    // Security: prevent directory traversal
    if (!filePath.startsWith(BASE_DIR)) {
      return this.send404(res, 'Invalid path');
    }

    if (!fs.existsSync(filePath)) {
      return this.send404(res, `File not found: ${pathname}`);
    }

    const ext = path.extname(filePath);
    const mimeType = MIME_TYPES[ext] || 'application/octet-stream';

    this.serveFile(res, filePath, mimeType);
  }

  // Serve file helper
  serveFile(res, filePath, mimeType) {
    try {
      const content = fs.readFileSync(filePath);
      res.writeHead(200, {
        'Content-Type': mimeType,
        'Content-Length': content.length
      });
      res.end(content);
    } catch (error) {
      this.send500(res, error);
    }
  }

  // Send JSON response
  sendJSON(res, data, status = 200) {
    const json = JSON.stringify(data, null, 2);
    res.writeHead(status, {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(json)
    });
    res.end(json);
  }

  // 404 handler
  send404(res, message = 'Not found') {
    this.sendJSON(res, {
      error: 'Not Found',
      message,
      status: 404
    }, 404);
  }

  // 500 handler
  send500(res, error) {
    console.error('Server error:', error);
    this.sendJSON(res, {
      error: 'Internal Server Error',
      message: error.message,
      status: 500
    }, 500);
  }

  // Start server
  start() {
    const server = http.createServer((req, res) => this.handleRequest(req, res));

    server.listen(PORT, () => {
      console.log('\n🚀 IGotVD API Server Started!\n');
      console.log(`🌐 Server running at: http://localhost:${PORT}`);
      console.log(`📦 Serving ${this.desktops.size} virtual desktops\n`);
      console.log('📚 API Endpoints:');
      console.log(`   GET  /api/health              - Health check`);
      console.log(`   GET  /api/info                - System information`);
      console.log(`   GET  /api/desktops            - List all desktops`);
      console.log(`   GET  /api/desktops/:name      - Get desktop info`);
      console.log(`   GET  /api/manifest            - Get manifest`);
      console.log(`   POST /api/manifest/generate   - Generate manifest`);
      console.log(`\n🖥️  Desktop Access:`);
      console.log(`   GET  /desktop/:name           - Serve desktop HTML`);
      console.log(`   GET  /desktop.html            - Modular desktop loader`);
      console.log(`   GET  /index.html              - Desktop collection`);
      console.log(`\n📁 Static Files:`);
      console.log(`   GET  /src/css/*               - Stylesheets`);
      console.log(`   GET  /src/js/*                - JavaScript`);
      console.log(`   GET  /src/modules/*           - Desktop modules`);
      console.log(`   GET  /src/themes/*            - Theme files`);
      console.log('\n✨ Press Ctrl+C to stop\n');
    });

    // Graceful shutdown
    process.on('SIGINT', () => {
      console.log('\n\n👋 Shutting down gracefully...');
      server.close(() => {
        console.log('✅ Server closed');
        process.exit(0);
      });
    });
  }
}

// Start server if run directly
if (require.main === module) {
  const api = new IGotVDAPI();
  api.start();
}

module.exports = IGotVDAPI;
