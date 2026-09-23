const http = require('http');
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const cloudinary = require('cloudinary').v2;

const PORT = 8000;
const PUBLIC_DIR = __dirname;
const UPLOADS_DIR = path.join(__dirname, 'uploads');
const DATA_FILE = path.join(__dirname, 'menu_data.json');

// Supabase Cloud Credentials
const SUPABASE_URL = 'https://ehinmtwgotrxyuqwdhqa.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVoaW5tdHdnb3RyeHl1cXdkaHFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAxMzk3MzIsImV4cCI6MjEwNTcxNTczMn0.DX3KpsT0UXI_5Ya0n_8yrDGbpyHQevLMGZpqbTTYZkE';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVoaW5tdHdnb3RyeHl1cXdkaHFhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MDEzOTczMiwiZXhwIjoyMTA1NzE1NzMyfQ.yJ-L8RIDqBa_G7bsTD0F0ACh3UcVb-TqX2_AKs3mLV4';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Cloudinary Configuration
const CLOUDINARY_API_KEY = 'IBdX46pE2OZ9JV5JJMYSwW_5pdE';
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'chiyatale',
  api_key: CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET || CLOUDINARY_API_KEY
});

// Admin Credentials for Chiya Tale
const ADMIN_CREDENTIALS = {
  email: 'admin@chiyatale.com',
  password: 'admin123'
};

// In-Memory Active Session Tokens
const activeSessions = new Set(['chiyatale_session_demo']);

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

// Helper to check if a request is authenticated
function isAuthenticatedRequest(req) {
  const authHeader = req.headers['authorization'] || '';
  const tokenHeader = req.headers['x-auth-token'] || '';
  let token = tokenHeader;
  if (!token && authHeader.toLowerCase().startsWith('bearer ')) {
    token = authHeader.substring(7).trim();
  }
  return Boolean(token && activeSessions.has(token));
}

// Sync local JSON to Supabase on startup
async function initSupabaseSync() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const localData = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
      const { data, error } = await supabase
        .from('menu_data')
        .upsert({ id: 1, payload: localData, updated_at: new Date() });
      if (error) {
        console.log('Supabase table sync notice:', error.message);
      } else {
        console.log('Supabase Cloud Menu synced successfully!');
      }
    }
  } catch (err) {
    console.log('Supabase sync notice:', err.message);
  }
}

initSupabaseSync();

const server = http.createServer((req, res) => {
  // CORS Headers for API
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-auth-token');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const reqUrl = req.url.split('?')[0];

  // API Supabase Info Endpoint
  if (reqUrl === '/api/supabase-config' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      url: SUPABASE_URL,
      anonKey: SUPABASE_ANON_KEY
    }));
    return;
  }

  // API Authentication Endpoints
  if (reqUrl === '/api/login' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
      try {
        const { email, password } = JSON.parse(body);
        const inputEmail = (email || '').trim().toLowerCase();
        if (
          inputEmail === ADMIN_CREDENTIALS.email && 
          password === ADMIN_CREDENTIALS.password
        ) {
          const token = 'chiyatale_token_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
          activeSessions.add(token);
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: true, token, email: ADMIN_CREDENTIALS.email }));
        } else {
          res.writeHead(401, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, error: 'Invalid email or password.' }));
        }
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid request body' }));
      }
    });
    return;
  }

  if (reqUrl === '/api/verify-token' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
      try {
        const { token } = JSON.parse(body);
        if (token && activeSessions.has(token)) {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ valid: true, email: ADMIN_CREDENTIALS.email }));
        } else {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ valid: false }));
        }
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ valid: false }));
      }
    });
    return;
  }

  if (reqUrl === '/api/logout' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
      try {
        const { token } = JSON.parse(body);
        if (token) activeSessions.delete(token);
      } catch (e) {}
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true }));
    });
    return;
  }

  // API Menu Endpoints (Reads from Supabase Cloud with fallback to local JSON)
  if (reqUrl === '/api/menu') {
    if (req.method === 'GET') {
      // Fetch from Supabase Cloud first
      supabase
        .from('menu_data')
        .select('payload')
        .eq('id', 1)
        .single()
        .then(({ data, error }) => {
          if (!error && data && data.payload) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(data.payload));
          } else {
            // Fallback to local file
            fs.readFile(DATA_FILE, 'utf8', (err, localContent) => {
              if (err) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Failed to read menu data' }));
                return;
              }
              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.end(localContent);
            });
          }
        })
        .catch(() => {
          fs.readFile(DATA_FILE, 'utf8', (err, localContent) => {
            if (err) {
              res.writeHead(500, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: 'Failed to read menu data' }));
              return;
            }
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(localContent);
          });
        });
      return;
    }

    if (req.method === 'POST' || req.method === 'PUT') {
      if (!isAuthenticatedRequest(req)) {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: 'Unauthorized. Please sign in.' }));
        return;
      }
      let body = '';
      req.on('data', chunk => { body += chunk.toString(); });
      req.on('end', async () => {
        try {
          const parsed = JSON.parse(body);
          // Save to local file
          fs.writeFileSync(DATA_FILE, JSON.stringify(parsed, null, 2), 'utf8');

          // Sync to Supabase Cloud
          try {
            await supabase.from('menu_data').upsert({ id: 1, payload: parsed, updated_at: new Date() });
          } catch (spErr) {
            console.log('Supabase update notice:', spErr.message);
          }

          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: true, message: 'Chiya Tale menu updated successfully in Local & Supabase Cloud!' }));
        } catch (e) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Invalid JSON payload' }));
        }
      });
      return;
    }
  }

  // API Image Upload Endpoint (Cloudinary + Local Fallback)
  if (reqUrl === '/api/upload' && req.method === 'POST') {
    if (!isAuthenticatedRequest(req)) {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: 'Unauthorized. Please sign in.' }));
      return;
    }
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', async () => {
      try {
        const payload = JSON.parse(body);
        if (!payload.imageData) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'No imageData provided' }));
          return;
        }

        // Attempt Cloudinary upload first
        try {
          const cldRes = await cloudinary.uploader.upload(payload.imageData, {
            folder: 'chiyatale_menu'
          });
          if (cldRes && cldRes.secure_url) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true, imageUrl: cldRes.secure_url }));
            return;
          }
        } catch (cldErr) {
          console.log('Cloudinary upload notice (falling back to local storage):', cldErr.message);
        }

        // Fallback to local storage
        const matches = payload.imageData.match(/^data:image\/([a-zA-Z+]+);base64,(.+)$/);
        let ext = 'jpg';
        let base64String = payload.imageData;

        if (matches) {
          ext = matches[1] === 'jpeg' ? 'jpg' : matches[1];
          base64String = matches[2];
        }

        const fileName = `img_${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${ext}`;
        const filePath = path.join(UPLOADS_DIR, fileName);
        const imageBuffer = Buffer.from(base64String, 'base64');

        fs.writeFile(filePath, imageBuffer, err => {
          if (err) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Failed to write image file' }));
            return;
          }
          const imageUrl = `/uploads/${fileName}`;
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: true, imageUrl }));
        });
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Failed to parse upload request' }));
      }
    });
    return;
  }

  // Static File Serving
  let filePath = path.join(PUBLIC_DIR, reqUrl === '/' ? 'index.html' : reqUrl);
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('<h1>404 Not Found</h1>');
      } else {
        res.writeHead(500);
        res.end(`Server Error: ${err.code}`);
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

function startServer(port) {
  server.listen(port, () => {
    console.log(`Chiya Tale Server running at http://localhost:${port}`);
    console.log(`Public Menu: http://localhost:${port}/`);
    console.log(`Admin Panel: http://localhost:${port}/admin.html`);
    console.log(`Supabase & Cloudinary Integrated.`);
  }).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`Port ${port} in use, trying ${port + 1}...`);
      startServer(port + 1);
    } else {
      console.error('Server error:', err);
    }
  });
}

startServer(PORT);
