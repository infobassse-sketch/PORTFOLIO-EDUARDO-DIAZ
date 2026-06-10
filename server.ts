import express from 'express';
import fs from 'fs';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { PROJECTS_DATA, PROPRIETARY_PROJECTS_DATA } from './src/data';
import { Project } from './src/types';

const app = express();
const PORT = 3000;

// Central logs buffer for frontend transparency visualization
const logBuffer: { id: string; timestamp: string; level: 'info' | 'warn' | 'error' | 'http'; message: string }[] = [];

function writeLog(level: 'info' | 'warn' | 'error' | 'http', message: string) {
  const timestamp = new Date().toISOString();
  const logItem = {
    id: Math.random().toString(36).substring(2, 9),
    timestamp,
    level,
    message
  };
  
  logBuffer.push(logItem);
  if (logBuffer.length > 200) {
    logBuffer.shift();
  }
  
  // Format console logs with visual icons
  const icon = level === 'error' ? '🔴' : level === 'warn' ? '🟡' : level === 'http' ? '⚡' : '⚙️';
  console.log(`[${timestamp.slice(11, 19)}] ${icon} [${level.toUpperCase()}] ${message}`);
}

writeLog('info', 'BASSSE Engine starting up in full-stack mode...');

// Establish persistent db folders
const DATA_DIR = path.join(process.cwd(), 'data');
const PROJECTS_FILE = path.join(DATA_DIR, 'projects.json');
const PROPRIETARY_FILE = path.join(DATA_DIR, 'proprietary_projects.json');
const CONTACTS_FILE = path.join(DATA_DIR, 'contacts.json');

function initializeDatabase() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
      writeLog('info', 'Created directory: ' + DATA_DIR);
    }
    
    let projectsOnDisk = PROJECTS_DATA;
    if (fs.existsSync(PROJECTS_FILE)) {
      try {
        const fileContent = JSON.parse(fs.readFileSync(PROJECTS_FILE, 'utf-8'));
        if (Array.isArray(fileContent) && fileContent.length > 0) {
          // BASSSE Self-Healing Sync: If disk records contain old Unsplash placeholders but our codebase has high-fidelity offline assets, restore the premium physical paths!
          projectsOnDisk = fileContent.map((diskProj: any) => {
            const freshProj = PROJECTS_DATA.find(p => p.id === diskProj.id);
            if (freshProj) {
              const needsImageSync = (diskProj.image_url?.includes('unsplash.com') || !diskProj.image_url) && freshProj.image_url?.startsWith('/imagenes');
              return {
                ...diskProj,
                image: needsImageSync ? freshProj.image : (diskProj.image || freshProj.image),
                image_url: needsImageSync ? freshProj.image_url : (diskProj.image_url || freshProj.image_url),
                images: needsImageSync ? freshProj.images : (diskProj.images || freshProj.images)
              };
            }
            return diskProj;
          });
        }
      } catch (err) {
        writeLog('warn', 'Failed parsing projects.json on startup, fallback to codebase defaults.');
      }
    }
    fs.writeFileSync(PROJECTS_FILE, JSON.stringify(projectsOnDisk, null, 2), 'utf-8');
    writeLog('info', `Durable database fully loaded and synchronized at ${PROJECTS_FILE} (${projectsOnDisk.length} projects).`);

    let proprietaryOnDisk = PROPRIETARY_PROJECTS_DATA;
    if (fs.existsSync(PROPRIETARY_FILE)) {
      try {
        const fileContent = JSON.parse(fs.readFileSync(PROPRIETARY_FILE, 'utf-8'));
        if (Array.isArray(fileContent) && fileContent.length > 0) {
          proprietaryOnDisk = fileContent.map((diskProj: any) => {
            const freshProj = PROPRIETARY_PROJECTS_DATA.find(p => p.id === diskProj.id);
            if (freshProj) {
              const needsImageSync = !diskProj.image?.startsWith('/imagenes') && freshProj.image?.startsWith('/imagenes');
              return {
                ...diskProj,
                image: needsImageSync ? freshProj.image : (diskProj.image || freshProj.image)
              };
            }
            return diskProj;
          });
        }
      } catch (err) {
        writeLog('warn', 'Failed parsing proprietary_projects.json on startup.');
      }
    }
    fs.writeFileSync(PROPRIETARY_FILE, JSON.stringify(proprietaryOnDisk, null, 2), 'utf-8');
    writeLog('info', `Proprietary database fully loaded and synchronized at ${PROPRIETARY_FILE} (${proprietaryOnDisk.length} proprietary projects).`);

    if (fs.existsSync(CONTACTS_FILE)) {
      writeLog('info', 'Contacts database loaded successfully.');
    } else {
      fs.writeFileSync(CONTACTS_FILE, JSON.stringify([], null, 2), 'utf-8');
    }

    const UPLOADS_DIR = path.join(process.cwd(), 'data/uploads');
    if (!fs.existsSync(UPLOADS_DIR)) {
      fs.mkdirSync(UPLOADS_DIR, { recursive: true });
      writeLog('info', 'Created uploads directory: ' + UPLOADS_DIR);
    }

    // Seed native uploaded files from strip-logos to uploads directory for local consistency
    const LOGO_DIR = path.join(process.cwd(), 'src/components/strip-logos');
    const filesToCopy = [
      { src: 'DELANTERACAMISETAFOTO1_.png', dest: 'DELANTERACAMISETAFOTO1_.png' },
      { src: 'fish.png', dest: 'fish.png' },
      { src: 'video .png', dest: 'video.png' },
      { src: 'Sin título-1.png', dest: 'Sin_titulo-1.png' },
    ];

    filesToCopy.forEach(f => {
      const srcPath = path.join(LOGO_DIR, f.src);
      const destPath = path.join(UPLOADS_DIR, f.dest);
      if (fs.existsSync(srcPath) && !fs.existsSync(destPath)) {
        fs.copyFileSync(srcPath, destPath);
        writeLog('info', `Seeded native uploaded asset ${f.src} -> ${f.dest}`);
      }
    });

  } catch (error: any) {
    writeLog('error', `Database initialization failure: ${error.message}`);
  }
}

initializeDatabase();

// Route for serving uploaded images statically
app.use('/api/uploads', express.static(path.join(process.cwd(), 'data/uploads')));
app.use('/imagenes', express.static(path.join(process.cwd(), 'public/imagenes')));

// --- Helper Database Functions ---
function readProjects(): Project[] {
  try {
    const data = fs.readFileSync(PROJECTS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error: any) {
    writeLog('error', `Could not read projects file: ${error.message}`);
    return PROJECTS_DATA;
  }
}

function saveProjects(projects: Project[]): boolean {
  try {
    fs.writeFileSync(PROJECTS_FILE, JSON.stringify(projects, null, 2), 'utf-8');
    return true;
  } catch (error: any) {
    writeLog('error', `Could not save projects file: ${error.message}`);
    return false;
  }
}

function readProprietary(): any[] {
  try {
    const data = fs.readFileSync(PROPRIETARY_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error: any) {
    writeLog('error', `Could not read proprietary projects file: ${error.message}`);
    return PROPRIETARY_PROJECTS_DATA;
  }
}

function saveProprietary(projects: any[]): boolean {
  try {
    fs.writeFileSync(PROPRIETARY_FILE, JSON.stringify(projects, null, 2), 'utf-8');
    return true;
  } catch (error: any) {
    writeLog('error', `Could not save proprietary projects file: ${error.message}`);
    return false;
  }
}

// --- Middlewares ---

// 1. JSON and URLencoded Parsing middlewares
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 2. Security Defense Headers Middleware
app.use((req, res, next) => {
  res.setHeader('X-Powered-By', 'BASSSE Full-Stack Engine (React + Vite + Express)');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

// 3. High-Fidelity Performance Transit Logger Middleware
app.use((req, res, next) => {
  const start = process.hrtime();
  
  res.on('finish', () => {
    const diff = process.hrtime(start);
    const durationMs = (diff[0] * 1e3 + diff[1] * 1e-6).toFixed(2);
    const size = res.get('Content-Length') || '0';
    const clientIp = req.ips || req.ip || '127.0.0.1';
    
    const logInfo = `${req.method} ${req.originalUrl} - [${res.statusCode}] - Size: ${size}B - Time: ${durationMs}ms - IP: ${clientIp}`;
    
    let level: 'http' | 'warn' | 'error' = 'http';
    if (res.statusCode >= 500) {
      level = 'error';
    } else if (res.statusCode >= 400) {
      level = 'warn';
    }
    
    writeLog(level, logInfo);
  });
  
  next();
});

// 4. API Security Auth Middleware - Reusable protection layer
const ADMIN_API_KEY = 'bassse-secret-key-2026';

function requireAuth(req: express.Request, res: express.Response, next: express.NextFunction) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    writeLog('warn', `Blocked Unauthorized Admin API Access to ${req.originalUrl}`);
    res.status(401).json({
      error: 'Unauthorized',
      message: 'Falta token de autorización Bearer en cabecera HTTP.'
    });
    return;
  }
  
  if (token !== ADMIN_API_KEY) {
    writeLog('warn', `Blocked Bad Authentication Attempt (Token: ${token}) to ${req.originalUrl}`);
    res.status(403).json({
      error: 'Forbidden',
      message: 'El token proporcionado no coincide con las credenciales BASSSE.'
    });
    return;
  }
  next();
}

app.use('/api/admin', requireAuth);

// --- API CRUD Routes ---

// GET /api/proprietary: List proprietary projects
app.get('/api/proprietary', (req, res) => {
  res.json(readProprietary());
});

// PUT /api/proprietary/:id: Update proprietary project
app.put('/api/proprietary/:id', requireAuth, (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body;
    const projects = readProprietary();
    const index = projects.findIndex(p => p.id === id);
    
    if (index === -1) {
      res.status(404).json({ error: 'Not Found', message: `No se encontró ningún proyecto propio con ID "${id}".` });
      return;
    }
    
    const updated = {
      ...projects[index],
      ...body,
      id: projects[index].id, // protect ID
    };
    
    projects[index] = updated;
    const saved = saveProprietary(projects);
    
    if (!saved) {
      res.status(500).json({ error: 'Server Error', message: 'Fallo al actualizar la persistencia de datos.' });
      return;
    }
    
    writeLog('info', `Updated proprietary project successfully: ${updated.name} (ID: ${id})`);
    res.json(updated);
  } catch (error: any) {
    writeLog('error', `Error updating proprietary project: ${error.message}`);
    res.status(500).json({ error: 'Server Error', message: error.message });
  }
});

// GET /api/projects: List and search projects
app.get('/api/projects', (req, res) => {
  const { branch, q } = req.query;
  let list = readProjects();
  
  if (branch && typeof branch === 'string' && branch !== 'all') {
    list = list.filter(p => p.branch === branch);
  }
  
  if (q && typeof q === 'string') {
    const query = q.toLowerCase();
    list = list.filter(p => 
      p.name.toLowerCase().includes(query) || 
      p.description.toLowerCase().includes(query) ||
      p.tags.some(t => t.toLowerCase().includes(query))
    );
  }
  
  res.json(list);
});

// GET /api/projects/:id: Fetch single project
app.get('/api/projects/:id', (req, res) => {
  const { id } = req.params;
  const list = readProjects();
  const project = list.find(p => p.id === id);
  
  if (!project) {
    res.status(404).json({
      error: 'Not Found',
      message: `El proyecto con el identificador "${id}" no existe.`
    });
    return;
  }
  
  res.json(project);
});

// POST /api/projects: Add a new project (Secured with requireAuth)
app.post('/api/projects', requireAuth, (req, res) => {
  try {
    const { name, branch, description, detailedDescription, image, image_url, images, tags, link, accentColor, metrics, type } = req.body;
    
    // Strict schema validator
    if (!name || !branch || !description) {
      res.status(400).json({
        error: 'Validation Error',
        message: 'Es obligatorio proporcionar un Nombre ("name"), Categoría ("branch") y Descripción básica ("description").'
      });
      return;
    }
    
    const projects = readProjects();
    const cleanId = name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '') + '-' + Math.floor(1000 + Math.random() * 9000);
    
    const initialImg = image_url || image || '';
    const newProject: Project = {
      id: cleanId,
      name,
      branch: branch as any,
      branchLabel: branch === 'web' ? '01 — Web' :
                   branch === 'branding' ? '02 — Branding' :
                   branch === 'events' ? '03 — Eventos' :
                   branch === 'ai' ? '04 — IA aplicada' : '05 — Merchandising',
      type: type || 'CLIENTE BASSSE',
      category: branch.toUpperCase() + ' · DIGITAL SYSTEM',
      year: String(new Date().getFullYear()),
      description,
      detailedDescription: detailedDescription || description,
      image: image || 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=1200&auto=format&fit=crop',
      image_url: initialImg,
      images: Array.isArray(images) ? images : [initialImg].filter(Boolean),
      tags: Array.isArray(tags) ? tags : [tags || 'DIGITAL SYSTEM'],
      link: link || '',
      accentColor: accentColor || '#0052FF',
      metrics: Array.isArray(metrics) ? metrics : [
        { label: 'Etiq', value: 'BASSSE' },
        { label: 'Desarrollo', value: 'Activo' }
      ]
    };
    
    projects.unshift(newProject);
    const saved = saveProjects(projects);
    
    if (!saved) {
      res.status(500).json({ error: 'Server Error', message: 'No se pudo guardar la base de datos de proyectos.' });
      return;
    }
    
    writeLog('info', `Created new project successfully: ${newProject.name} (ID: ${newProject.id})`);
    res.status(201).json(newProject);
  } catch (error: any) {
    writeLog('error', `Error processing project creation: ${error.message}`);
    res.status(500).json({ error: 'Server Error', message: error.message });
  }
});

// PUT /api/projects/:id: Update project (Secured with requireAuth)
app.put('/api/projects/:id', requireAuth, (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body;
    const projects = readProjects();
    const index = projects.findIndex(p => p.id === id);
    
    if (index === -1) {
      res.status(404).json({ error: 'Not Found', message: `No se encontró ningún proyecto con ID "${id}".` });
      return;
    }
    
    const updated = {
      ...projects[index],
      ...body,
      // Overwrite static fields
      id: projects[index].id, // keep original ID
      branchLabel: body.branch === 'web' ? '01 — Web' :
                   body.branch === 'branding' ? '02 — Branding' :
                   body.branch === 'events' ? '03 — Eventos' :
                   body.branch === 'ai' ? '04 — IA aplicada' : '05 — Merchandising',
    };
    
    projects[index] = updated;
    const saved = saveProjects(projects);
    
    if (!saved) {
      res.status(500).json({ error: 'Server Error', message: 'Fallo al actualizar la persistencia de datos.' });
      return;
    }
    
    writeLog('info', `Updated project successfully: ${updated.name} (ID: ${id})`);
    res.json(updated);
  } catch (error: any) {
    writeLog('error', `Error updating project: ${error.message}`);
    res.status(500).json({ error: 'Server Error', message: error.message });
  }
});

// DELETE /api/projects/:id: Delete project (Secured with requireAuth)
app.delete('/api/projects/:id', requireAuth, (req, res) => {
  try {
    const { id } = req.params;
    const projects = readProjects();
    const index = projects.findIndex(p => p.id === id);
    
    if (index === -1) {
      res.status(404).json({ error: 'Not Found', message: `No se encontró ningún proyecto con ID "${id}" para ser eliminado.` });
      return;
    }
    
    const deletedName = projects[index].name;
    projects.splice(index, 1);
    const saved = saveProjects(projects);
    
    if (!saved) {
      res.status(500).json({ error: 'Server Error', message: 'Fallo al eliminar el registro.' });
      return;
    }
    
    writeLog('info', `Deleted project successfully: ${deletedName} (ID: ${id})`);
    res.json({ success: true, message: `Proyecto "${deletedName}" eliminado correctamente.` });
  } catch (error: any) {
    writeLog('error', `Error deleting project: ${error.message}`);
    res.status(500).json({ error: 'Server Error', message: error.message });
  }
});

// POST /api/upload: Upload localized image from computer (Base64 wrapper with requireAuth)
app.post('/api/upload', requireAuth, (req, res) => {
  try {
    const { filename, base64 } = req.body;
    if (!filename || !base64) {
      res.status(400).json({
        error: 'Validation Error',
        message: 'Es obligatorio proporcionar el nombre del archivo ("filename") y el contenido en Base64 ("base64").'
      });
      return;
    }

    const uploadsDir = path.join(process.cwd(), 'data/uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // Strip metadata prefix if exists
    const base64Data = base64.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, 'base64');

    // Make clean, non-colliding filename
    const cleanFilename = Date.now() + '-' + filename.replace(/[^a-zA-Z0-9.\-_]/g, '_');
    const filePath = path.join(uploadsDir, cleanFilename);

    fs.writeFileSync(filePath, buffer);
    writeLog('info', `Local image uploaded successfully: ${cleanFilename}`);

    // Return the absolute public path starting with /api/uploads/
    res.json({
      success: true,
      url: `/api/uploads/${cleanFilename}`
    });
  } catch (error: any) {
    writeLog('error', `Error processing local image upload: ${error.message}`);
    res.status(500).json({ error: 'Server Error', message: error.message });
  }
});

// POST /api/contact: Submit a message
app.post('/api/contact', (req, res) => {
  try {
    const { name, email, message } = req.body;
    
    if (!name || !email || !message) {
      res.status(400).json({ error: 'Validation Error', message: 'Todos los campos (nombre, correo y mensaje) son requeridos por las políticas de intermediación.' });
      return;
    }
    
    let contacts = [];
    try {
      if (fs.existsSync(CONTACTS_FILE)) {
        contacts = JSON.parse(fs.readFileSync(CONTACTS_FILE, 'utf-8'));
      }
    } catch (e) {}
    
    const newContactSubmit = {
      id: Math.random().toString(36).substring(2, 9),
      name,
      email,
      message,
      submittedAt: new Date().toISOString()
    };
    
    contacts.push(newContactSubmit);
    fs.writeFileSync(CONTACTS_FILE, JSON.stringify(contacts, null, 2), 'utf-8');
    
    writeLog('info', `✉️ Nuevo mensaje recibido de ${name} (${email})`);
    
    res.status(201).json({
      success: true,
      message: 'Mensaje archivado y enviado a la cola del servidor de BASSSE con éxito.'
    });
  } catch (error: any) {
    writeLog('error', `Error handling contact: ${error.message}`);
    res.status(500).json({ error: 'Server Error', message: error.message });
  }
});

// GET /api/logs: Send streaming transaction logs
app.get('/api/logs', (req, res) => {
  res.json(logBuffer);
});

// GET /api/health: Full-stack System performance stats
app.get('/api/health', (req, res) => {
  const stats = {
    status: 'online',
    engine: 'BASSSE Core V1',
    timestamp: new Date().toISOString(),
    uptime: `${process.uptime().toFixed(1)}s`,
    memory: {
      heapTotal: `${(process.memoryUsage().heapTotal / 1024 / 1024).toFixed(2)} MB`,
      heapUsed: `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`,
      rss: `${(process.memoryUsage().rss / 1024 / 1024).toFixed(2)} MB`,
    },
    database: {
      type: 'JSON Durable File Buffer',
      connected: true,
      path: PROJECTS_FILE,
      records: readProjects().length
    }
  };
  
  res.json(stats);
});

// --- Centralized Error Handler Middleware ---
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  writeLog('error', `Critical crash detected: ${err.stack || err.message}`);
  res.status(500).json({
    error: 'Critical Error',
    message: 'Ha ocurrido un error inesperado dentro del motor fullstack del servidor comercial. Inténtelo de nuevo.',
    details: err.message
  });
});

// --- Boot Server and Mount Vite Middleware ---
async function startServer() {
  if (process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'production-test') {
    // Mount Dev server with HMR configurations through local proxy
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    
    app.use(vite.middlewares);
    writeLog('info', 'Integrated Vite development server middleware.');
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
    writeLog('info', 'Serving production static landing page from /dist.');
  }

  if (!process.env.VERCEL) {
    app.listen(PORT, '0.0.0.0', () => {
      writeLog('info', `===========================================================`);
      writeLog('info', `🚀 SERVER READY AND BINDED TO PORT http://0.0.0.0:${PORT}`);
      writeLog('info', `===========================================================`);
    });
  } else {
    writeLog('info', 'Executing inside Vercel serverless environment.');
  }
}

startServer();

export default app;
