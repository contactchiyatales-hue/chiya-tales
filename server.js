const express = require('express');
const fs = require('fs');
const path = require('path');
const os = require('os');
const { createClient } = require('@supabase/supabase-js');
const cloudinary = require('cloudinary').v2;
require('dotenv').config({ path: '.env.local' });

const app = express();
const PORT = process.env.PORT || 8000;
const PUBLIC_DIR = __dirname;
const UPLOADS_DIR = path.join(__dirname, 'uploads');
const DATA_FILE = path.join(__dirname, 'menu_data.json');

// Supabase Cloud Credentials from .env.local
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://ehinmtwgotrxyuqwdhqa.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVoaW5tdHdnb3RyeHl1cXdkaHFhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MDEzOTczMiwiZXhwIjoyMTA1NzE1NzMyfQ.yJ-L8RIDqBa_G7bsTD0F0ACh3UcVb-TqX2_AKs3mLV4';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVoaW5tdHdnb3RyeHl1cXdkaHFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAxMzk3MzIsImV4cCI6MjEwNTcxNTczMn0.DX3KpsT0UXI_5Ya0n_8yrDGbpyHQevLMGZpqbTTYZkE';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Cloudinary Configuration from .env.local
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'chiyatale',
  api_key: process.env.CLOUDINARY_API_KEY || 'IBdX46pE2OZ9JV5JJMYSwW_5pdE',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'IBdX46pE2OZ9JV5JJMYSwW_5pdE'
});

// Admin Credentials from .env.local
const ADMIN_CREDENTIALS = {
  email: process.env.ADMIN_EMAIL || 'admin@chiyatale.com',
  password: process.env.ADMIN_PASSWORD || 'admin123'
};

// In-Memory Active Session Tokens
const activeSessions = new Set(['chiyatale_session_demo']);

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// CORS Middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-auth-token');
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  
  next();
});

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

// API Routes

// Supabase Config Endpoint
app.get('/api/supabase-config', (req, res) => {
  res.json({
    url: SUPABASE_URL,
    anonKey: SUPABASE_ANON_KEY
  });
});

// Login Endpoint
app.post('/api/login', express.json(), (req, res) => {
  const { email, password } = req.body;
  const inputEmail = (email || '').trim().toLowerCase();
  
  if (
    inputEmail === ADMIN_CREDENTIALS.email && 
    password === ADMIN_CREDENTIALS.password
  ) {
    const token = 'chiyatale_token_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
    activeSessions.add(token);
    res.json({ success: true, token, email: ADMIN_CREDENTIALS.email });
  } else {
    res.status(401).json({ success: false, error: 'Invalid email or password.' });
  }
});

// Verify Token Endpoint
app.post('/api/verify-token', express.json(), (req, res) => {
  const { token } = req.body;
  if (token && activeSessions.has(token)) {
    res.json({ valid: true, email: ADMIN_CREDENTIALS.email });
  } else {
    res.json({ valid: false });
  }
});

// Logout Endpoint
app.post('/api/logout', express.json(), (req, res) => {
  const { token } = req.body;
  if (token) activeSessions.delete(token);
  res.json({ success: true });
});

// Change Password Endpoint
app.post('/api/change-password', express.json(), (req, res) => {
  if (!isAuthenticatedRequest(req)) {
    return res.status(401).json({ success: false, error: 'Unauthorized. Please sign in.' });
  }

  const { currentPassword, newPassword } = req.body;
  
  if (currentPassword !== ADMIN_CREDENTIALS.password) {
    return res.status(400).json({ success: false, error: 'Current password is incorrect.' });
  }
  
  if (!newPassword || newPassword.trim().length < 6) {
    return res.status(400).json({ success: false, error: 'New password must be at least 6 characters.' });
  }

  ADMIN_CREDENTIALS.password = newPassword.trim();
  
  try {
    const envPath = path.join(__dirname, '.env.local');
    if (fs.existsSync(envPath)) {
      let envContent = fs.readFileSync(envPath, 'utf8');
      if (envContent.includes('ADMIN_PASSWORD=')) {
        envContent = envContent.replace(/ADMIN_PASSWORD=.*/g, `ADMIN_PASSWORD=${ADMIN_CREDENTIALS.password}`);
      } else {
        envContent += `\nADMIN_PASSWORD=${ADMIN_CREDENTIALS.password}`;
      }
      fs.writeFileSync(envPath, envContent, 'utf8');
    }
  } catch (envErr) {
    console.log('Env update notice:', envErr.message);
  }

  res.json({ success: true, message: 'Password changed successfully.' });
});

// Menu API - GET
app.get('/api/menu', async (req, res) => {
  try {
    // Fetch from Supabase Cloud PRIMARY
    const { data, error } = await supabase
      .from('menu_data')
      .select('payload')
      .eq('id', 1)
      .single();

    if (!error && data && data.payload) {
      return res.json(data.payload);
    }

    // Fallback to local JSON file
    if (fs.existsSync(DATA_FILE)) {
      const localData = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
      return res.json(localData);
    }

    res.status(500).json({ error: 'Failed to fetch menu from Supabase Cloud' });
  } catch (err) {
    if (fs.existsSync(DATA_FILE)) {
      const localData = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
      return res.json(localData);
    }
    res.status(500).json({ error: 'Supabase connection failed: ' + err.message });
  }
});

// Menu API - POST/PUT
app.post('/api/menu', express.json({ limit: '50mb' }), async (req, res) => {
  if (!isAuthenticatedRequest(req)) {
    return res.status(401).json({ success: false, error: 'Unauthorized. Please sign in.' });
  }

  try {
    const parsed = req.body;
    
    // Save to local file as backup
    fs.writeFileSync(DATA_FILE, JSON.stringify(parsed, null, 2), 'utf8');

    // Sync to Supabase Cloud PRIMARY
    try {
      await supabase.from('menu_data').upsert({ id: 1, payload: parsed, updated_at: new Date() });
      res.json({ success: true, message: 'Menu updated in Supabase Cloud!' });
    } catch (spErr) {
      res.json({ success: true, message: 'Menu saved locally (Supabase notice: ' + spErr.message + ')' });
    }
  } catch (e) {
    res.status(400).json({ error: 'Invalid JSON payload' });
  }
});

app.put('/api/menu', express.json({ limit: '50mb' }), async (req, res) => {
  if (!isAuthenticatedRequest(req)) {
    return res.status(401).json({ success: false, error: 'Unauthorized. Please sign in.' });
  }

  try {
    const parsed = req.body;
    
    // Save to local file as backup
    fs.writeFileSync(DATA_FILE, JSON.stringify(parsed, null, 2), 'utf8');

    // Sync to Supabase Cloud PRIMARY
    try {
      await supabase.from('menu_data').upsert({ id: 1, payload: parsed, updated_at: new Date() });
      res.json({ success: true, message: 'Menu updated in Supabase Cloud!' });
    } catch (spErr) {
      res.json({ success: true, message: 'Menu saved locally (Supabase notice: ' + spErr.message + ')' });
    }
  } catch (e) {
    res.status(400).json({ error: 'Invalid JSON payload' });
  }
});

// Image Upload Endpoint
app.post('/api/upload', express.json({ limit: '50mb' }), async (req, res) => {
  if (!isAuthenticatedRequest(req)) {
    return res.status(401).json({ success: false, error: 'Unauthorized. Please sign in.' });
  }

  const { imageData } = req.body;
  
  if (!imageData) {
    return res.status(400).json({ error: 'No imageData provided' });
  }

  try {
    // Use Cloudinary PRIMARY
    const cldRes = await cloudinary.uploader.upload(imageData, {
      folder: 'chiyatale_menu'
    });
    
    if (cldRes && cldRes.secure_url) {
      return res.json({ success: true, imageUrl: cldRes.secure_url });
    }
  } catch (cldErr) {
    // Fallback to local uploads directory
    try {
      const matches = imageData.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      if (matches && matches.length === 3) {
        const ext = matches[1].split('/')[1] || 'jpg';
        const filename = `img_${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${ext}`;
        const filePath = path.join(UPLOADS_DIR, filename);
        fs.writeFileSync(filePath, Buffer.from(matches[2], 'base64'));
        const localUrl = `/uploads/${filename}`;
        return res.json({ success: true, imageUrl: localUrl });
      }
    } catch (locErr) {
      // Fall through to error
    }

    return res.status(500).json({ error: 'Upload failed: ' + cldErr.message });
  }
});

// Static File Serving
app.use(express.static(PUBLIC_DIR));
app.use('/uploads', express.static(UPLOADS_DIR));

// Public Menu Route
app.get('/menu', (req, res) => {
  const menuPath = path.join(PUBLIC_DIR, 'page.html');
  res.sendFile(menuPath, (err) => {
    if (err) {
      res.status(404).send('<h1>Menu not found</h1>');
    }
  });
});

// Admin SPA Route - serve page.html for root
app.get('/', (req, res) => {
  const menuPath = path.join(PUBLIC_DIR, 'page.html');
  res.sendFile(menuPath, (err) => {
    if (err) {
      res.status(404).send('<h1>Not found</h1>');
    }
  });
});

// 404 Fallback
app.use((req, res) => {
  const page404Path = path.join(PUBLIC_DIR, '404.html');
  
  fs.readFile(page404Path, (err, content) => {
    res.status(404);
    if (!err) {
      res.send(content);
    } else {
      res.send('<h1>404 Not Found — Chiya Tale</h1>');
    }
  });
});

function getNetworkIp() {
  const interfaces = os.networkInterfaces();
  for (const devName in interfaces) {
    const iface = interfaces[devName];
    for (let i = 0; i < iface.length; i++) {
      const alias = iface[i];
      if (alias.family === 'IPv4' && !alias.internal && alias.address !== '127.0.0.1') {
        return alias.address;
      }
    }
  }
  return 'localhost';
}

function startServer(port) {
  const portNum = parseInt(port, 10);
  const netIp = getNetworkIp();
  
  app.listen(portNum, '0.0.0.0', () => {
    console.log(`\n==================================================`);
    console.log(` ☕ Chiya Tale Server Live! (Express.js)`);
    console.log(` 🏠 Local Access:   http://localhost:${portNum}`);
    console.log(` 🌐 Network Access: http://${netIp}:${portNum}`);
    console.log(` 📋 Public Menu:    http://${netIp}:${portNum}/`);
    console.log(` 🛡️ Admin Panel:     http://${netIp}:${portNum}/admin`);
    console.log(`==================================================\n`);
  }).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`Port ${portNum} in use, trying ${portNum + 1}...`);
      startServer(portNum + 1);
    } else {
      console.error('Server error:', err);
    }
  });
}

startServer(PORT);
