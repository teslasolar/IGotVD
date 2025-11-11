# IGotVD API System

RESTful API server for managing and serving virtual desktop environments.

## Quick Start

```bash
# Start the API server
node api/api.md

# Or make it executable
chmod +x api/api.md
./api/api.md

# Custom port
PORT=8080 node api/api.md
```

## API Documentation

### Base URL
```
http://localhost:3000
```

---

## Endpoints

### 🏥 Health & Info

#### GET /api/health
Health check endpoint.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-11-11T19:45:00.000Z",
  "uptime": 123.45,
  "desktops": 10
}
```

#### GET /api/info
System information.

**Response:**
```json
{
  "name": "IGotVD API",
  "version": "1.0.0",
  "description": "Virtual Desktop Collection API",
  "desktops": 10,
  "node": "v18.16.0",
  "platform": "linux",
  "arch": "x64",
  "memory": {
    "total": 16384,
    "free": 8192,
    "used": 128
  }
}
```

---

### 🖥️ Desktops

#### GET /api/desktops
List all available virtual desktops.

**Response:**
```json
{
  "count": 10,
  "desktops": [
    {
      "id": "cyberOS_desktop",
      "file": "cyberOS_desktop.html",
      "name": "CyberOS v7.2 - Virtual Desktop",
      "description": "Cyberpunk terminal desktop",
      "size": 47523,
      "modified": "2025-11-11T18:44:00.000Z",
      "url": "/desktop/cyberOS_desktop",
      "apiUrl": "/api/desktops/cyberOS_desktop"
    },
    ...
  ]
}
```

#### GET /api/desktops/:name
Get specific desktop information.

**Parameters:**
- `name` - Desktop identifier (e.g., `cyberOS_desktop`)

**Example:**
```
GET /api/desktops/cyberOS_desktop
```

**Response:**
```json
{
  "id": "cyberOS_desktop",
  "file": "cyberOS_desktop.html",
  "name": "CyberOS v7.2 - Virtual Desktop",
  "description": "Cyberpunk-themed OS with Matrix aesthetics",
  "size": 47523,
  "modified": "2025-11-11T18:44:00.000Z",
  "url": "/desktop/cyberOS_desktop",
  "content": "/desktop/cyberOS_desktop",
  "modular": {
    "available": true,
    "module": "/src/modules/cyber.js",
    "theme": "/src/themes/cyber-theme.css"
  }
}
```

---

### 📋 Manifest

#### GET /api/manifest
Get the desktop manifest (desktops.json).

**Response:**
```json
{
  "desktops": [
    {
      "name": "CyberOS v7.2 - Virtual Desktop",
      "file": "cyberOS_desktop.html",
      "icon": "🖥️",
      "theme": "cyber",
      "description": "...",
      "features": ["...", "..."]
    },
    ...
  ],
  "generated": "2025-11-11T19:12:48.339Z"
}
```

#### POST /api/manifest/generate
Regenerate the desktop manifest by scanning HTML files.

**Response:**
```json
{
  "success": true,
  "message": "Manifest generated successfully",
  "output": "... (generation output) ...",
  "desktops": 10
}
```

---

### 📁 Static File Serving

#### GET /desktop/:name
Serve a desktop HTML file.

**Example:**
```
GET /desktop/cyberOS_desktop
```

Serves the `cyberOS_desktop.html` file.

#### GET /desktop.html
Serve the modular desktop loader.

#### GET /index.html
Serve the desktop collection browser.

#### GET /src/*
Serve source files (CSS, JS, modules, themes).

**Examples:**
```
GET /src/css/core.css
GET /src/js/core.js
GET /src/modules/cyber.js
GET /src/themes/cyber-theme.css
```

---

## Usage Examples

### cURL

```bash
# Health check
curl http://localhost:3000/api/health

# List desktops
curl http://localhost:3000/api/desktops

# Get specific desktop
curl http://localhost:3000/api/desktops/cyberOS_desktop

# Generate manifest
curl -X POST http://localhost:3000/api/manifest/generate

# Get manifest
curl http://localhost:3000/api/manifest

# Get system info
curl http://localhost:3000/api/info
```

### JavaScript (Fetch API)

```javascript
// List all desktops
const response = await fetch('http://localhost:3000/api/desktops');
const data = await response.json();
console.log(`Found ${data.count} desktops`);

// Get specific desktop
const desktop = await fetch('http://localhost:3000/api/desktops/cyberOS_desktop');
const info = await desktop.json();
console.log(info.name, info.description);

// Generate manifest
const result = await fetch('http://localhost:3000/api/manifest/generate', {
  method: 'POST'
});
const generated = await result.json();
console.log(generated.message);
```

### Python

```python
import requests

# Health check
response = requests.get('http://localhost:3000/api/health')
print(response.json())

# List desktops
desktops = requests.get('http://localhost:3000/api/desktops').json()
print(f"Found {desktops['count']} desktops")

# Generate manifest
result = requests.post('http://localhost:3000/api/manifest/generate')
print(result.json()['message'])
```

---

## Features

### ✅ Implemented

- [x] RESTful API with JSON responses
- [x] Desktop management (list, get)
- [x] Manifest generation endpoint
- [x] Static file serving (HTML, CSS, JS)
- [x] Health checks and system info
- [x] CORS enabled
- [x] Executable markdown format
- [x] Error handling
- [x] Graceful shutdown

### 🚧 Planned

- [ ] Desktop creation via API
- [ ] Desktop deletion
- [ ] Desktop updates
- [ ] Authentication/Authorization
- [ ] Rate limiting
- [ ] Caching
- [ ] WebSocket support for live updates
- [ ] Desktop preview generation
- [ ] Analytics and usage tracking

---

## Configuration

### Environment Variables

- `PORT` - Server port (default: 3000)

Example:
```bash
PORT=8080 node api/api.md
```

---

## Error Handling

All errors return JSON with the following format:

```json
{
  "error": "Error Type",
  "message": "Detailed error message",
  "status": 404
}
```

### HTTP Status Codes

- `200` - Success
- `404` - Not Found
- `500` - Internal Server Error

---

## Security

### CORS
CORS is enabled for all origins (`*`). In production, configure this to only allow specific origins.

### Path Traversal Protection
The server prevents directory traversal attacks by validating file paths.

### Recommendations for Production
1. Add authentication
2. Restrict CORS origins
3. Add rate limiting
4. Use HTTPS
5. Add input validation
6. Implement logging
7. Add monitoring

---

## Development

### File Structure

```
api/
├── api.md          # Main API server (executable)
└── README.md       # This file
```

### Testing

```bash
# Start server
node api/api.md

# In another terminal, test endpoints
curl http://localhost:3000/api/health
curl http://localhost:3000/api/desktops
curl http://localhost:3000/api/manifest

# Test static serving
curl http://localhost:3000/desktop.html
curl http://localhost:3000/src/css/core.css
```

---

## Integration

### With Desktop System

The API seamlessly integrates with the modular desktop system:

```javascript
// In desktop.html or custom app
async function loadDesktopsFromAPI() {
  const response = await fetch('http://localhost:3000/api/desktops');
  const data = await response.json();
  return data.desktops;
}

// Use in desktop switcher
const desktops = await loadDesktopsFromAPI();
desktops.forEach(desktop => {
  console.log(desktop.name, desktop.url);
});
```

### As a Backend for Frontend Apps

```javascript
// React/Vue/Angular frontend
import { createApp } from 'vue';

const API_BASE = 'http://localhost:3000/api';

export default {
  data() {
    return {
      desktops: []
    };
  },
  async mounted() {
    const response = await fetch(`${API_BASE}/desktops`);
    const data = await response.json();
    this.desktops = data.desktops;
  }
};
```

---

## Troubleshooting

### Port Already in Use

```bash
# Find process using port 3000
lsof -i :3000

# Kill it
kill -9 <PID>

# Or use different port
PORT=3001 node api/api.md
```

### Permission Denied

```bash
# Make executable
chmod +x api/api.md

# Then run
./api/api.md
```

### Module Not Found

Ensure you're running from the IGotVD root directory:

```bash
cd /path/to/IGotVD
node api/api.md
```

---

## License

Same as IGotVD project.

---

**Built with ❤️ for the IGotVD Virtual Desktop Collection**
