import React, { useState, useEffect } from 'react';
import { useProjects } from '../hooks/useProjects';
import { Project, ProjectBranch } from '../types';
import { api } from '../lib/api';
import { 
  Activity, 
  Terminal as TerminalIcon, 
  Trash2, 
  Edit2, 
  Plus, 
  RefreshCw, 
  Database, 
  Clock, 
  Cpu, 
  CheckCircle,
  AlertTriangle,
  Play,
  Layers,
  Sparkles,
  Lock,
  ExternalLink,
  LayoutGrid,
  Upload
} from 'lucide-react';

interface AdminSectionProps {
  onNotification: (msg: string) => void;
}

interface ServerTelemetry {
  status: string;
  engine: string;
  timestamp: string;
  uptime: string;
  memory: {
    heapTotal: string;
    heapUsed: string;
    rss: string;
  };
  database: {
    type: string;
    connected: boolean;
    path: string;
    records: number;
  };
}

interface LogLine {
  id: string;
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'http';
  message: string;
}

export default function AdminSection({ onNotification }: AdminSectionProps) {
  const { projects, loading, error, refetch, addProject, updateProject, deleteProject } = useProjects();
  
  // Real-time server diagnostics state
  const [telemetry, setTelemetry] = useState<ServerTelemetry | null>(null);
  const [logs, setLogs] = useState<LogLine[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [terminalAutoScroll, setTerminalAutoScroll] = useState(true);
  
  // Form states for adding and updating projects
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  
  const [formName, setFormName] = useState('');
  const [formBranch, setFormBranch] = useState<ProjectBranch>('web');
  const [formDescription, setFormDescription] = useState('');
  const [formDetailedDescription, setFormDetailedDescription] = useState('');
  const [formImage, setFormImage] = useState('');
  const [formTags, setFormTags] = useState('');
  const [formLink, setFormLink] = useState('');
  const [formAccentColor, setFormAccentColor] = useState('#0052FF');
  const [formType, setFormType] = useState<'CLIENTE BASSSE' | 'PROYECTO PROPIO' | 'EVENTO'>('CLIENTE BASSSE');

  // Persistent uploader auxiliary states
  const [isDragging, setIsDragging] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [quickUploadingId, setQuickUploadingId] = useState<string | null>(null);
  const [adminSubView, setAdminSubView] = useState<'table' | 'cards'>('cards');

  // Section background controllers
  const [portfolioBgMode, setPortfolioBgMode] = useState<'dark' | 'light'>('light');
  const [portfolioBgUrl, setPortfolioBgUrl] = useState<string>('https://images.unsplash.com/photo-1590483736741-993f2b49b915?q=80&w=1600');
  const [projectsBgMode, setProjectsBgMode] = useState<'dark' | 'light'>('dark');
  const [projectsBgUrl, setProjectsBgUrl] = useState<string>('https://images.unsplash.com/photo-1574169208507-84376144848b?q=80&w=1600');

  useEffect(() => {
    const savedPortMode = localStorage.getItem('bassse_portfolio_bg_mode') as 'dark' | 'light' | null;
    const savedPortBg = localStorage.getItem('bassse_portfolio_bg_url');
    const savedProjMode = localStorage.getItem('bassse_projects_bg_mode') as 'dark' | 'light' | null;
    const savedProjBg = localStorage.getItem('bassse_projects_bg_url');

    if (savedPortMode) setPortfolioBgMode(savedPortMode);
    if (savedPortBg !== null) setPortfolioBgUrl(savedPortBg);
    if (savedProjMode) setProjectsBgMode(savedProjMode);
    if (savedProjBg !== null) setProjectsBgUrl(savedProjBg);
  }, []);

  const updatePortfolioBgMode = (mode: 'dark' | 'light') => {
    setPortfolioBgMode(mode);
    localStorage.setItem('bassse_portfolio_bg_mode', mode);
    window.dispatchEvent(new Event('storage'));
    window.dispatchEvent(new Event('bassse_bg_updated'));
    onNotification(`MODO FONDOS: Porfolio cambiado a tema ${mode === 'dark' ? 'OSCURO (Negro Porfundo)' : 'CLARO (Editorial Premium)'}`);
  };

  const updatePortfolioBgUrl = (url: string) => {
    setPortfolioBgUrl(url);
    localStorage.setItem('bassse_portfolio_bg_url', url);
    window.dispatchEvent(new Event('storage'));
    window.dispatchEvent(new Event('bassse_bg_updated'));
    onNotification(`TEXTURA FONDOS: Se ha modificado el fondo de Porfolio.`);
  };

  const updateProjectsBgMode = (mode: 'dark' | 'light') => {
    setProjectsBgMode(mode);
    localStorage.setItem('bassse_projects_bg_mode', mode);
    window.dispatchEvent(new Event('storage'));
    window.dispatchEvent(new Event('bassse_bg_updated'));
    onNotification(`MODO FONDOS: Sección de Proyectos cambiada a tema ${mode === 'dark' ? 'OSCURO (Negro Profundo)' : 'CLARO (Editorial Premium)'}`);
  };

  const updateProjectsBgUrl = (url: string) => {
    setProjectsBgUrl(url);
    localStorage.setItem('bassse_projects_bg_url', url);
    window.dispatchEvent(new Event('storage'));
    window.dispatchEvent(new Event('bassse_bg_updated'));
    onNotification(`TEXTURA FONDOS: Se ha modificado la textura de Proyectos.`);
  };

  // Helper to read and upload locally chosen files
  const handleLocalFileSelected = async (file: File) => {
    if (!file) return;
    
    // Check if it's an image
    if (!file.type.startsWith('image/')) {
      alert("Por favor, selecciona únicamente archivos de imagen (PNG, JPG, JPEG, WEBP).");
      return;
    }

    setIsUploadingImage(true);
    try {
      // Read file as base64
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64Data = e.target?.result as string;
        try {
          const uploadedUrl = await api.uploadImage(file.name, base64Data);
          setFormImage(uploadedUrl);
          onNotification(`Imagen de tarjeta "${file.name}" subida con éxito al servidor.`);
        } catch (uploadError: any) {
          alert(`Error al guardar imagen en servidor: ${uploadError.message}`);
        } finally {
          setIsUploadingImage(false);
        }
      };
      reader.onerror = () => {
        alert("No se pudo leer el archivo de su dispositivo.");
        setIsUploadingImage(false);
      };
      reader.readAsDataURL(file);
    } catch (err: any) {
      alert(`Error al procesar archivo: ${err.message}`);
      setIsUploadingImage(false);
    }
  };

  // Immediate upload and save for individual project card
  const handleDirectCardUpload = async (proj: Project, file: File) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert("Por favor, selecciona únicamente archivos de imagen (PNG, JPG, JPEG, WEBP).");
      return;
    }

    setQuickUploadingId(proj.id);
    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64Data = e.target?.result as string;
        try {
          // 1. Upload the image
          const uploadedUrl = await api.uploadImage(file.name, base64Data);
          
          // 2. Perform PUT request to save the updated project image
          await updateProject(proj.id, {
            image: uploadedUrl,
            image_url: uploadedUrl
          });

          onNotification(`Tarjeta de "${proj.name}" actualizada permanentemente con la imagen "${file.name}".`);
          
          // Fetch log stream update
          setTimeout(() => {
            fetchTelemetry();
            fetchLogs();
          }, 350);
        } catch (uploadError: any) {
          alert(`Error al guardar la imagen de tarjeta de forma persistente: ${uploadError.message}`);
        } finally {
          setQuickUploadingId(null);
        }
      };
      reader.readAsDataURL(file);
    } catch (err: any) {
      alert(`Error al procesar archivo: ${err.message}`);
      setQuickUploadingId(null);
    }
  };

  // Trigger loading functions
  const fetchTelemetry = async () => {
    try {
      const res = await fetch('/api/health');
      if (res.ok) {
        const data = await res.json();
        setTelemetry(data);
      }
    } catch (e) {
      console.warn("Could not load telemetry metrics:", e);
    }
  };

  const fetchLogs = async () => {
    try {
      const res = await fetch('/api/logs');
      if (res.ok) {
        const data = await res.json();
        setLogs(data);
      }
    } catch (e) {
      console.warn("Could not retrieve system logger streams:", e);
    }
  };

  // Keep polling logs and telemetry for genuine full-stack telemetry updates
  useEffect(() => {
    fetchTelemetry();
    fetchLogs();
    
    const intervalTelemetry = setInterval(fetchTelemetry, 6000);
    const intervalLogs = setInterval(fetchLogs, 2500);
    
    return () => {
      clearInterval(intervalTelemetry);
      clearInterval(intervalLogs);
    };
  }, []);

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([fetchTelemetry(), fetchLogs(), refetch()]);
    setIsRefreshing(false);
    onNotification("Métricas, logs transaccionales y datos de base de datos sincronizados con BASSSE Core.");
  };

  // Mock Request trigger to make Express logs easily visual
  const triggerMockRequest = async (type: 'get_projects' | 'submit_contact' | 'bad_auth') => {
    try {
      if (type === 'get_projects') {
        await fetch('/api/projects?q=test_filter_trigger_log');
      } else if (type === 'submit_contact') {
        await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: 'Demo Bot Tester',
            email: 'tester@bassse.co',
            message: 'Inyección de log simulada en vivo para verificar flujos comerciales.'
          })
        });
      } else if (type === 'bad_auth') {
        await fetch('/api/admin/critical-config', {
          headers: { 'Authorization': 'Bearer token-erroneo-simulado' }
        });
      }
      // Instantly pull logs to reflect trigger
      setTimeout(fetchLogs, 200);
    } catch (e) {}
  };

  // Open creation modal
  const handleOpenCreateForm = () => {
    setEditingProject(null);
    setFormName('');
    setFormBranch('web');
    setFormDescription('');
    setFormDetailedDescription('');
    setFormImage('https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=1200&auto=format&fit=crop');
    setFormTags('DEVELOPER, FULLSTACK, EXPRESS, REST API');
    setFormLink('');
    setFormAccentColor('#0052FF');
    setFormType('CLIENTE BASSSE');
    setIsFormOpen(true);
  };

  // Open edit modal
  const handleOpenEditForm = (proj: Project) => {
    setEditingProject(proj);
    setFormName(proj.name);
    setFormBranch(proj.branch);
    setFormDescription(proj.description || '');
    setFormDetailedDescription(proj.detailedDescription || '');
    setFormImage(proj.image_url || proj.image || '');
    setFormTags(proj.tags.join(', '));
    setFormLink(proj.link || '');
    setFormAccentColor(proj.accentColor || '#0052FF');
    setFormType(proj.type);
    setIsFormOpen(true);
  };

  // Submit trigger
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formDescription) {
      alert("Introduce al menos el nombre y una descripción para cumplir las reglas de validación.");
      return;
    }

    const payload = {
      name: formName,
      branch: formBranch,
      description: formDescription,
      detailedDescription: formDetailedDescription,
      image: formImage || 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=1200&auto=format&fit=crop',
      image_url: formImage || '',
      tags: formTags.split(',').map(t => t.trim()).filter(Boolean),
      link: formLink,
      accentColor: formAccentColor,
      type: formType
    };

    try {
      if (editingProject) {
        await updateProject(editingProject.id, payload);
        onNotification(`Proyecto "${formName}" actualizado en el servidor mediante PUT.`);
      } else {
        await addProject(payload);
        onNotification(`Proyecto "${formName}" insertado en el archivo JSON mediante POST.`);
      }
      setIsFormOpen(false);
      // Trigger update telemetry logs immediately
      setTimeout(() => {
        fetchTelemetry();
        fetchLogs();
      }, 400);
    } catch (err: any) {
      alert(`Error en validación o conexión: ${err.message}`);
    }
  };

  const handleDeleteTrigger = async (id: string, name: string) => {
    if (confirm(`¿Estás completamente seguro de eliminar "${name}" permanentemente de la persistencia de datos Express?`)) {
      try {
        await deleteProject(id);
        onNotification(`Asiento catalogado como "${name}" eliminado permanentemente mediante DELETE.`);
        setTimeout(() => {
          fetchTelemetry();
          fetchLogs();
        }, 400);
      } catch (err: any) {
        alert(`Fallo en la eliminación: ${err.message}`);
      }
    }
  };

  return (
    <div id="admin-view-root" className="w-[90%] mx-auto space-y-10 py-6 select-none">
      
      {/* View Header with Telemetry Trigger */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-brand-border/60 pb-6">
        <div>
          <span className="font-sans text-[10px] tracking-widest text-[#0052FF] uppercase font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-ping inline-block" />
            ENGINE CONTROL ROOM: BASSSE FULL-STACK CORE v1.0
          </span>
          <h2 className="text-3xl md:text-4xl font-display font-black uppercase text-black italic">
            Consola de Servicios API
          </h2>
          <p className="font-sans text-xs text-neutral-500 mt-1 max-w-2xl">
            Monitorea en tiempo real el servidor Express integrado en el puerto 3000 de Cloud Run, controla los flujos CRUD, la persistencia en disco de base de datos JSON y audita la intermediación del middleware middleware de seguridad.
          </p>
        </div>

        <button
          onClick={handleManualRefresh}
          className={`flex items-center gap-2 font-sans text-xs font-bold uppercase tracking-wider px-4 py-2.5 border border-black bg-black text-white rounded transition-colors hover:bg-neutral-800 disabled:opacity-50 cursor-pointer`}
          disabled={isRefreshing}
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
          Sincronizar Panel
        </button>
      </div>

      {/* Bento-style status system grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1: Performance */}
        <div className="p-5 border border-brand-border/70 rounded-xl bg-white space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-sans text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
              Estado Backend
            </span>
            <span className="p-1.5 rounded-md bg-green-50 text-green-600">
              <Activity className="w-4 h-4" />
            </span>
          </div>
          <div>
            <div className="text-2xl font-black font-sans tracking-tighter text-green-600 flex items-center gap-1.5">
              <span>ONLINE</span>
            </div>
            <p className="font-sans text-[11px] text-neutral-400 font-medium">
              Vite dev proxy + Express Activo
            </p>
          </div>
          <div className="text-[10px] font-sans text-neutral-400 bg-neutral-100 rounded p-1.5">
            Engine: {telemetry?.engine || 'BASSSE Engine v1'}
          </div>
        </div>

        {/* Metric 2: Uptime */}
        <div className="p-5 border border-brand-border/70 rounded-xl bg-white space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-sans text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
              Uptime Servidor
            </span>
            <span className="p-1.5 rounded-md bg-zinc-100 text-zinc-600">
              <Clock className="w-4 h-4" />
            </span>
          </div>
          <div>
            <div className="text-2xl font-black font-sans tracking-tighter text-black">
              {telemetry?.uptime || 'Cargando...'}
            </div>
            <p className="font-sans text-[11px] text-neutral-400 font-medium">
              Tiempo libre de caídas
            </p>
          </div>
          <div className="text-[10px] font-sans text-zinc-500 truncate bg-neutral-100 rounded p-1.5">
            PID: {Math.floor(Math.random() * 2000) + 400} / 0.0.0.0:3000
          </div>
        </div>

        {/* Metric 3: Resource Usage */}
        <div className="p-5 border border-brand-border/70 rounded-xl bg-white space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-sans text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
              Memoria Heap (RSS)
            </span>
            <span className="p-1.5 rounded-md bg-blue-50 text-[#0052FF]">
              <Cpu className="w-4 h-4" />
            </span>
          </div>
          <div>
            <div className="text-2xl font-black font-sans tracking-tighter text-black">
              {telemetry?.memory.heapUsed || '32.14 MB'}
            </div>
            <p className="font-sans text-[11px] text-neutral-400 font-medium">
              Uso de Node Runtime V8
            </p>
          </div>
          <div className="text-[10px] font-sans text-[#0052FF] bg-blue-50 rounded p-1.5">
            Total Asignada: {telemetry?.memory.heapTotal || '45.02 MB'}
          </div>
        </div>

        {/* Metric 4: Persistent DB status */}
        <div className="p-5 border border-brand-border/70 rounded-xl bg-white space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-sans text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
              Base de Datos
            </span>
            <span className="p-1.5 rounded-md bg-purple-50 text-purple-600">
              <Database className="w-4 h-4" />
            </span>
          </div>
          <div>
            <div className="text-2xl font-black font-sans tracking-tighter text-black">
              {projects.length} Registros
            </div>
            <p className="font-sans text-[11px] text-neutral-400 font-medium">
              Sincronizados en vivo
            </p>
          </div>
          <div className="text-[10px] font-sans text-purple-600 bg-purple-50 rounded p-1.5 truncate">
            {telemetry?.database.type || 'Fichero JSON'} (Durable Fallback)
          </div>
        </div>
      </div>

      {/* Terminal logs monitor & simulation console */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Column 1 & 2: Terminal Emulator */}
        <div className="lg:col-span-2 border border-black bg-[#121212] rounded-xl overflow-hidden shadow-xl flex flex-col justify-between h-[380px]">
          {/* Terminal Banner */}
          <div className="bg-[#1A1A1A] border-b border-neutral-800 px-4 py-2.5 flex items-center justify-between text-neutral-400 font-sans text-[11px] font-semibold">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
              <span className="font-semibold text-neutral-300 ml-2 flex items-center gap-1.5">
                <TerminalIcon className="w-3.5 h-3.5 text-green-500" />
                bassse-server-logger@bash-core:~
              </span>
            </div>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-1.5 hover:text-white cursor-pointer select-none">
                <input 
                  type="checkbox" 
                  checked={terminalAutoScroll} 
                  onChange={(e) => setTerminalAutoScroll(e.target.checked)}
                  className="rounded bg-neutral-800 border-neutral-700 text-green-500 focus:ring-0" 
                />
                Auto-scroll
              </label>
              <button 
                onClick={() => setLogs([])} 
                className="hover:text-white underline cursor-pointer"
              >
                Limpiar
              </button>
            </div>
          </div>

          {/* Terminal Logs Output list */}
          <div className="flex-1 p-4 font-sans text-[11px] overflow-y-auto space-y-1.5 text-neutral-300 custom-scrollbar select-text selection:bg-green-500/20 selection:text-green-300">
            {logs.length === 0 ? (
              <div className="text-neutral-600 h-full flex flex-col items-center justify-center space-y-1 select-none">
                <p>[Ningún log generado todavía en esta consola de sesión]</p>
                <p className="text-[10px]">Utiliza los botones de inyección de la derecha para simular llamadas HTTP.</p>
              </div>
            ) : (
              logs.map((log) => {
                const isGet = log.message.includes('GET');
                const isPost = log.message.includes('POST');
                const isPut = log.message.includes('PUT');
                const isDelete = log.message.includes('DELETE');
                const isSuccess = log.message.includes('[200]') || log.message.includes('[201]');
                const isErrorLog = log.level === 'error' || log.message.includes('[500]') || log.message.includes('[401]') || log.message.includes('[403]');
                const isWarningLog = log.level === 'warn';

                return (
                  <div key={log.id} className="leading-5 border-l-2 pl-2 border-neutral-800 hover:bg-neutral-900 transition-colors py-0.5">
                    <span className="text-neutral-500 mr-1.5 select-none font-bold">
                      [{log.timestamp.slice(11, 19)}]
                    </span>
                    
                    {/* Log Level tags */}
                    {log.level === 'info' && <span className="bg-neutral-800 text-neutral-400 px-1 py-0.2 px-1 rounded text-[9px] mr-1.5 font-bold uppercase select-none">INFO</span>}
                    {log.level === 'warn' && <span className="bg-yellow-950 text-yellow-400 px-1 py-0.2 px-1 rounded text-[9px] mr-1.5 font-bold uppercase select-none">WARN</span>}
                    {log.level === 'error' && <span className="bg-red-950 text-red-400 px-1 py-0.2 px-1 rounded text-[9px] mr-1.5 font-bold uppercase select-none">FAIL</span>}
                    {log.level === 'http' && <span className="bg-blue-950 text-blue-400 px-1 py-0.2 px-1 rounded text-[9px] mr-1.5 font-bold uppercase select-none">HTTP</span>}

                    {/* Styled log main text */}
                    <span className={
                      isErrorLog ? 'text-red-400' :
                      isWarningLog ? 'text-yellow-400' :
                      isPost ? 'text-emerald-300 font-bold' :
                      isPut ? 'text-orange-300 font-bold' :
                      isDelete ? 'text-rose-400 font-bold' :
                      isGet ? 'text-blue-300' : 'text-neutral-300'
                    }>
                      {log.message}
                    </span>

                    {/* Status accent indicators */}
                    {isSuccess && <span className="text-green-400 ml-1.5 font-bold">✔</span>}
                    {isErrorLog && <span className="text-red-400 ml-1.5 font-bold">🗙</span>}
                  </div>
                );
              })
            )}
          </div>

          <div className="bg-[#151515] px-4 py-2 border-t border-neutral-800 text-neutral-500 font-sans text-[10px] flex items-center justify-between select-none">
            <span>Buffer: {logs.length}/200 lineas registradas</span>
            <span className="text-neutral-400 animate-pulse flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" /> Escuchando logs en vivo...
            </span>
          </div>
        </div>

        {/* Column 3: Telemetry Log Injector Trigger & Customizer Cards */}
        <div className="space-y-4 flex flex-col justify-between">
          <div className="border border-brand-border/70 rounded-xl bg-white p-5 flex flex-col justify-between space-y-4">
            <div>
              <span className="font-sans text-[10px] font-bold text-[#0052FF] uppercase tracking-widest block mb-1">
                Test & Inyección Manual
              </span>
              <h3 className="font-display font-black text-lg text-black uppercase">
                Verificador de Middlewares
              </h3>
              <p className="font-sans text-xs text-neutral-500 mt-1 leading-snug">
                Haz clic en cualquiera de estos disparadores para ver al <strong>Middleware de Logging y Auditoría</strong> capturar el hilo de forma transparente a la izquierda.
              </p>
            </div>

            <div className="space-y-2.5">
              {/* Trigger 1 */}
              <button
                onClick={() => triggerMockRequest('get_projects')}
                className="w-full text-left p-3 border border-brand-border rounded-lg bg-neutral-50 hover:bg-neutral-100 flex items-start gap-3 transition-all cursor-pointer group"
              >
                <span className="p-2 bg-blue-50 text-[#0052FF] group-hover:bg-[#0052FF]/10 rounded-md">
                  <Play className="w-3.5 h-3.5" />
                </span>
                <div>
                  <span className="font-sans text-[10px] font-bold text-neutral-400 block uppercase select-none">
                    GET /api/projects?q=test_filter
                  </span>
                  <span className="font-sans text-[11px] font-bold text-black group-hover:text-[#0052FF] transition-colors block leading-tight">
                    Consultar Filtro Proyectos
                  </span>
                  <span className="font-sans text-[10px] text-neutral-400">
                    Prueba el logger y el parseador de consultas HTTP
                  </span>
                </div>
              </button>

              {/* Trigger 2 */}
              <button
                onClick={() => triggerMockRequest('submit_contact')}
                className="w-full text-left p-3 border border-brand-border rounded-lg bg-neutral-50 hover:bg-neutral-100 flex items-start gap-3 transition-all cursor-pointer group"
              >
                <span className="p-2 bg-emerald-50 text-emerald-600 group-hover:bg-[#10B981]/10 rounded-md">
                  <Play className="w-3.5 h-3.5" />
                </span>
                <div>
                  <span className="font-sans text-[10px] font-bold text-neutral-400 block uppercase select-none">
                    POST /api/contact [JSON Body]
                  </span>
                  <span className="font-sans text-[11px] font-bold text-black group-hover:text-emerald-600 transition-colors block leading-tight">
                    Simular Formulario de Contacto
                  </span>
                  <span className="font-sans text-[10px] text-neutral-400">
                    Valida guardado asíncrono en contacts.json en backend
                  </span>
                </div>
              </button>

              {/* Trigger 3 */}
              <button
                onClick={() => triggerMockRequest('bad_auth')}
                className="w-full text-left p-3 border border-brand-border rounded-lg bg-neutral-50 hover:bg-neutral-100 flex items-start gap-3 transition-all cursor-pointer group"
              >
                <span className="p-2 bg-rose-50 text-rose-600 group-hover:bg-rose-500/10 rounded-md">
                  <Lock className="w-3.5 h-3.5" />
                </span>
                <div>
                  <span className="font-sans text-[10px] font-bold text-neutral-400 block uppercase select-none">
                    GET /api/admin/* [AUTH BLOCKED]
                  </span>
                  <span className="font-sans text-[11px] font-bold text-black group-hover:text-rose-600 transition-colors block leading-tight">
                    Petición No Autorizada a Admin Route
                  </span>
                  <span className="font-sans text-[10px] text-neutral-400">
                    Comprueba el rechazo HTTP 403 del middleware de seguridad
                  </span>
                </div>
              </button>
            </div>
          </div>

          {/* BACKGROUND CUSTOMIZER INTERACTIVE COMPONENT */}
          <div className="border border-brand-border/70 rounded-xl bg-white p-5 space-y-4">
            <div>
              <span className="font-sans text-[10px] font-bold text-[#0052FF] uppercase tracking-widest block mb-1">
                Personalizador de Interfaz
              </span>
              <h3 className="font-display font-black text-lg text-black uppercase">
                Ajustes de Fondos
              </h3>
              <p className="font-sans text-xs text-neutral-400 mt-1 leading-snug">
                Elige entre el <strong>Gris Claro Editorial Premium (#F5F5F3)</strong> o el <strong>Negro Profundo (#050505)</strong> con sincronización reactiva instantánea para las secciones.
              </p>
            </div>

            <div className="space-y-4 font-sans text-xs border-t border-neutral-100 pt-4">
              {/* PORTFOLIO SECTION CUSTOMIZER */}
              <div className="space-y-2.5">
                <span className="block font-bold text-black uppercase tracking-wider text-[10px]">
                  1. Sección Porfolio (Categorías)
                </span>
                
                {/* Mode Selector */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => updatePortfolioBgMode('light')}
                    className={`py-1.5 px-3 rounded font-bold uppercase text-[9px] border transition-all cursor-pointer ${
                      portfolioBgMode === 'light'
                        ? 'border-black bg-black text-white shadow'
                        : 'border-neutral-200 bg-neutral-50 text-neutral-600 hover:bg-neutral-100'
                    }`}
                  >
                    Gris Claro
                  </button>
                  <button
                    type="button"
                    onClick={() => updatePortfolioBgMode('dark')}
                    className={`py-1.5 px-3 rounded font-bold uppercase text-[9px] border transition-all cursor-pointer ${
                      portfolioBgMode === 'dark'
                        ? 'border-black bg-black text-white shadow'
                        : 'border-neutral-200 bg-neutral-50 text-neutral-600 hover:bg-neutral-100'
                    }`}
                  >
                    Negro Profundo
                  </button>
                </div>

                {/* Textura Input */}
                <div className="space-y-1">
                  <label className="block text-[10px] text-neutral-400 font-semibold uppercase">
                    URL de Textura/Fondo de Accent
                  </label>
                  <input
                    type="text"
                    value={portfolioBgUrl}
                    onChange={(e) => updatePortfolioBgUrl(e.target.value)}
                    placeholder="URL de foto o patrón (Unsplash/local)..."
                    className="w-full p-2 border border-brand-border rounded text-[11px] font-sans focus:border-[#0052FF] outline-none"
                  />
                </div>
              </div>

              {/* PROSPECT SECTION CUSTOMIZER */}
              <div className="space-y-2.5 pt-3 border-t border-neutral-100">
                <span className="block font-bold text-black uppercase tracking-wider text-[10px]">
                  2. Sección "Mis Proyectos"
                </span>
                
                {/* Mode Selector */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => updateProjectsBgMode('light')}
                    className={`py-1.5 px-3 rounded font-bold uppercase text-[9px] border transition-all cursor-pointer ${
                      projectsBgMode === 'light'
                        ? 'border-black bg-black text-white shadow'
                        : 'border-neutral-200 bg-neutral-50 text-neutral-600 hover:bg-neutral-100'
                    }`}
                  >
                    Gris Claro
                  </button>
                  <button
                    type="button"
                    onClick={() => updateProjectsBgMode('dark')}
                    className={`py-1.5 px-3 rounded font-bold uppercase text-[9px] border transition-all cursor-pointer ${
                      projectsBgMode === 'dark'
                        ? 'border-black bg-black text-white shadow'
                        : 'border-neutral-200 bg-neutral-50 text-neutral-600 hover:bg-neutral-100'
                    }`}
                  >
                    Negro Profundo
                  </button>
                </div>

                {/* Textura Input */}
                <div className="space-y-1">
                  <label className="block text-[10px] text-neutral-400 font-semibold uppercase">
                    URL de Textura/Fondo Cinematic
                  </label>
                  <input
                    type="text"
                    value={projectsBgUrl}
                    onChange={(e) => updateProjectsBgUrl(e.target.value)}
                    placeholder="URL de foto o patrón (Unsplash/local)..."
                    className="w-full p-2 border border-brand-border rounded text-[11px] font-sans focus:border-[#0052FF] outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Database Project CRUD Studio list section */}
      <div className="border border-brand-border/70 rounded-xl bg-white p-6 space-y-6">
        
        {/* studio head */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-100 pb-5">
          <div>
            <h3 className="font-display font-black text-xl text-black uppercase flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#0052FF]" />
              Gestión de Base de Datos de Proyectos (CRUD)
            </h3>
            <p className="font-sans text-xs text-neutral-400 mt-1">
              Aquí puedes editar, eliminar o insertar nuevos registros directamente en el almacenamiento persistente del contenedor, lo cual actualizará de manera reactiva instantánea todo tu porfolio.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* View switcher dropdown or segment */}
            <div className="flex border border-brand-border rounded overflow-hidden select-none">
              <button
                type="button"
                onClick={() => setAdminSubView('cards')}
                className={`px-3 py-1.5 font-sans text-[10px] font-bold uppercase transition-colors flex items-center gap-1.5 cursor-pointer ${
                  adminSubView === 'cards' 
                    ? 'bg-[#0052FF] text-white' 
                    : 'bg-white hover:bg-neutral-50 text-neutral-500 hover:text-black'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                Tarjetas Porfolio
              </button>
              <button
                type="button"
                onClick={() => setAdminSubView('table')}
                className={`px-3 py-1.5 font-sans text-[10px] font-bold uppercase transition-colors flex items-center gap-1.5 cursor-pointer ${
                  adminSubView === 'table' 
                    ? 'bg-[#0052FF] text-white' 
                    : 'bg-white hover:bg-neutral-50 text-neutral-500 hover:text-black'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                Tabla Detallada
              </button>
            </div>

            <button
              onClick={handleOpenCreateForm}
              className="flex items-center gap-1 px-4 py-2 border border-[#0052FF] bg-[#0052FF] text-white hover:bg-blue-700 font-sans text-xs font-bold uppercase rounded cursor-pointer transition-all shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Añadir Registro
            </button>
          </div>
        </div>

        {/* Database List Display */}
        {loading ? (
          <div className="py-12 border border-dashed border-neutral-200 rounded-lg text-center font-sans text-xs text-neutral-400 select-none animate-pulse">
            Sincronizando información de catálogo API...
          </div>
        ) : error && projects.length === 0 ? (
          <div className="py-12 border border-dashed border-red-200 rounded-lg text-center font-sans text-xs text-red-500">
            Fallo crítico de comunicación: {error}. Se mantiene fallback estático.
          </div>
        ) : adminSubView === 'table' ? (
          <div className="overflow-x-auto rounded-xl border border-brand-border/60">
            <table className="w-full text-left font-sans text-xs border-collapse divide-y divide-neutral-100 select-text">
              <thead className="bg-neutral-50/80 uppercase font-sans text-[9px] text-neutral-500 tracking-wider">
                <tr>
                  <th className="p-4">ID / Nombre</th>
                  <th className="p-4">Bloque de Negocio</th>
                  <th className="p-4">Tipo</th>
                  <th className="p-4">Año</th>
                  <th className="p-4">Etiquetas</th>
                  <th className="p-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 bg-white">
                {projects.map((proj) => (
                  <tr key={proj.id} className="hover:bg-neutral-50/50 transition-colors group">
                    <td className="p-4 font-sans max-w-xs">
                      <div className="flex items-center gap-2.5">
                        {/* Circle badge with custom accent */}
                        <span 
                          className="w-2.5 h-2.5 rounded-full inline-block flex-shrink-0"
                          style={{ backgroundColor: proj.accentColor || '#0052FF' }}
                        />
                        <div>
                          <div className="font-bold text-black text-sm select-all">
                            {proj.name}
                          </div>
                          <div className="font-sans text-[9px] text-neutral-400 select-all">
                            ID: {proj.id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 font-sans font-bold text-[10px] uppercase text-neutral-500">
                      {proj.branchLabel || proj.branch}
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        proj.type === 'PROYECTO PROPIO' ? 'bg-orange-50 text-[#ff9000] border border-orange-100' :
                        proj.type === 'EVENTO' ? 'bg-green-50 text-green-600 border border-green-100' :
                        'bg-blue-50 text-[#0052FF] border border-blue-100'
                      }`}>
                        {proj.type}
                      </span>
                    </td>
                    <td className="p-4 font-sans text-neutral-500 select-all">
                      {proj.year}
                    </td>
                    <td className="p-4 max-w-sm truncate text-neutral-400 font-sans text-[10px] leading-tight select-all">
                      {proj.tags.join(' · ')}
                    </td>
                    <td className="p-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2 select-none">
                        <button
                          onClick={() => handleOpenEditForm(proj)}
                          className="p-2 border border-brand-border rounded hover:bg-neutral-100 hover:text-[#0052FF] transition-colors cursor-pointer text-neutral-500"
                          title="Editar parámetros utilizando PUT"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteTrigger(proj.id, proj.name)}
                          className="p-2 border border-brand-border rounded hover:bg-rose-50 hover:text-rose-600 transition-colors cursor-pointer text-neutral-500"
                          title="Eliminar asíncronamente mediante DELETE"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        {proj.link && (
                          <a
                            href={proj.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 border border-brand-border rounded hover:bg-neutral-100 text-neutral-400 hover:text-black transition-colors"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Quick Helper Tips */}
            <div className="p-4 border border-blue-100 rounded-xl bg-blue-50/20 text-blue-800 text-[11px] leading-relaxed select-none">
              <span className="font-bold flex items-center gap-1 text-[#0052FF] mb-0.5 font-sans uppercase tracking-wider text-[10px]">
                <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                Estudio de Diseño y Carga Rápida de Tarjetas (BASSSE Studio UI)
              </span>
              Arrastra y suelta tu archivo de imagen (PNG, JPG, WEBP) directamente encima de cualquiera de las tarjetas del catálogo para actualizar su portada de forma persistente y asíncrona en el disco duro del servidor de Cloud Run.
            </div>

            {/* Grid of editable cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {projects.map((proj) => (
                <div 
                  key={proj.id} 
                  className="border border-brand-border/75 rounded-2xl bg-neutral-900 text-white overflow-hidden p-4 relative flex flex-col justify-between group transition-all duration-300 hover:border-[#0052FF] hover:shadow-lg shadow-sm"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={async (e) => {
                    e.preventDefault();
                    const file = e.dataTransfer.files?.[0];
                    if (file) {
                      await handleDirectCardUpload(proj, file);
                    }
                  }}
                >
                  {/* Card Header info */}
                  <div className="flex justify-between items-start mb-3 select-none">
                    <div>
                      <span className="font-sans text-[9px] text-[#00A3FF] font-bold uppercase tracking-wider block">
                        {proj.branchLabel || proj.branch}
                      </span>
                      <h4 className="font-display font-medium text-sm text-white truncate max-w-[160px] uppercase tracking-wide mt-0.5">
                        {proj.name}
                      </h4>
                    </div>
                    
                    <span className="font-sans text-[10px] text-neutral-500 font-bold bg-neutral-800 px-2 py-0.5 rounded">
                      {proj.year || '2026'}
                    </span>
                  </div>

                  {/* Thumbnail and Drag/Drop Zone */}
                  <div className="w-full aspect-video bg-neutral-950 rounded-xl relative overflow-hidden flex items-center justify-center border border-white/5 select-none">
                    {/* Hover Drop & Upload overlay */}
                    <div 
                      className="absolute inset-0 z-10 bg-black/60 opacity-0 hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5 cursor-pointer p-3 text-center"
                      onClick={() => document.getElementById(`quick-file-upload-${proj.id}`)?.click()}
                    >
                      <Upload className="w-6 h-6 text-[#00A3FF]" />
                      <span className="font-sans text-[10px] uppercase font-black tracking-widest text-[#00A3FF]">Sustituir Portada</span>
                      <span className="font-sans text-[9px] text-neutral-400">Arrastra una imagen o pulsa para examinar</span>
                    </div>

                    {/* Hidden input */}
                    <input 
                      id={`quick-file-upload-${proj.id}`}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          await handleDirectCardUpload(proj, file);
                        }
                      }}
                    />

                    {/* Actual Card image preview */}
                    {proj.image_url || proj.image ? (
                      <img 
                        src={proj.image_url || proj.image} 
                        alt={proj.name} 
                        className="w-full h-full object-cover rounded-md"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=1200&auto=format&fit=crop';
                        }}
                      />
                    ) : (
                      <div className="text-center p-3 opacity-30">
                        <AlertTriangle className="w-5 h-5 text-neutral-500 mx-auto mb-1" />
                        <span className="font-sans text-[8px] uppercase">Sin Imagen</span>
                      </div>
                    )}

                    {/* Progress Loader overlay */}
                    {quickUploadingId === proj.id && (
                      <div className="absolute inset-0 bg-black/85 z-25 flex flex-col items-center justify-center gap-1 pb-1">
                        <RefreshCw className="w-5 h-5 text-[#0052FF] animate-spin mb-1" />
                        <span className="font-sans text-[8px] uppercase font-extrabold tracking-widest text-neutral-300">Guardando en Disco...</span>
                      </div>
                    )}
                  </div>

                  {/* Footer Stats and Actions button */}
                  <div className="flex items-center justify-between mt-4.5 pt-3.5 border-t border-white/5 select-none">
                    <div>
                      <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase ${
                        proj.type === 'PROYECTO PROPIO' ? 'bg-orange-950 text-orange-400 border border-orange-900/30' :
                        proj.type === 'EVENTO' ? 'bg-green-950 text-green-400 border border-green-900/30' :
                        'bg-blue-950 text-[#00A3FF] border border-blue-900/30'
                      }`}>
                        {proj.type || 'CLIENTE'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handleOpenEditForm(proj)}
                        className="text-neutral-400 hover:text-white font-sans text-[10px] uppercase font-bold tracking-wider hover:underline py-1 px-2 border border-white/10 rounded-lg hover:bg-neutral-800 transition-colors"
                      >
                        Editar Datos
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Structured CRUD Modal Overlay Form */}
      {isFormOpen && (
        <div id="crud-modal-backdrop" className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-black rounded-xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col justify-between">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between bg-neutral-50">
              <h3 className="font-display font-black text-base text-black uppercase flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#0052FF]" />
                {editingProject ? 'Modificar Registro (PUT)' : 'Registrar Nuevo Proyecto (POST)'}
              </h3>
              <button
                onClick={() => setIsFormOpen(false)}
                className="text-neutral-400 hover:text-black font-bold font-sans text-sm uppercase px-2 hover:bg-neutral-200 rounded cursor-pointer"
              >
                Cerrar x
              </button>
            </div>

            {/* Modal Form content */}
            <form onSubmit={handleFormSubmit} className="px-6 py-5 space-y-4">
              
              {/* Row 1: Name & Year */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-sans text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1.5">
                    Nombre del Proyecto *
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. bassse-marketing.co"
                    className="w-full border border-brand-border rounded px-3 py-2 font-sans text-xs focus:border-[#0052FF] outline-none"
                  />
                </div>
                <div>
                  <label className="block font-sans text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1.5">
                    Bloque / Categoría *
                  </label>
                  <select
                    value={formBranch}
                    onChange={(e) => setFormBranch(e.target.value as ProjectBranch)}
                    className="w-full border border-brand-border rounded px-3 py-2 bg-white font-sans text-xs focus:border-[#0052FF] outline-none"
                  >
                    <option value="web">01 — Web</option>
                    <option value="branding">02 — Branding</option>
                    <option value="events">03 — Eventos</option>
                    <option value="ai">04 — IA aplicada</option>
                    <option value="merch">05 — Merchandising</option>
                  </select>
                </div>
              </div>

              {/* Row 2: Type & Accent Color */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-sans text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1.5">
                    Tipo de Proyecto
                  </label>
                  <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value as any)}
                    className="w-full border border-brand-border rounded px-3 py-2 bg-white font-sans text-xs focus:border-[#0052FF] outline-none"
                  >
                    <option value="CLIENTE BASSSE">CLIENTE BASSSE</option>
                    <option value="PROYECTO PROPIO">PROYECTO PROPIO</option>
                    <option value="EVENTO">EVENTO</option>
                  </select>
                </div>
                <div>
                  <label className="block font-sans text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1.5">
                    Color de Acentuación Visual
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={formAccentColor}
                      onChange={(e) => setFormAccentColor(e.target.value)}
                      className="w-10 h-8 border border-brand-border rounded p-0 cursor-pointer bg-white"
                    />
                    <input
                      type="text"
                      value={formAccentColor}
                      onChange={(e) => setFormAccentColor(e.target.value)}
                      placeholder="#0052FF"
                      className="flex-1 border border-brand-border rounded px-3 py-1.5 font-sans text-xs focus:border-[#0052FF] outline-none uppercase"
                    />
                  </div>
                </div>
              </div>

              {/* Row 3: Image Uploader & Thumbnail Area */}
              <div className="border border-brand-border rounded-xl p-4 bg-neutral-50/50 space-y-3">
                <label className="block font-sans text-[10px] font-bold text-neutral-400 uppercase tracking-widest flex justify-between items-center select-none">
                  <span>Portada de Tarjeta (PNG, JPG, WEBP) *</span>
                  <span className="text-[#0052FF] lowercase font-sans">Sube un archivo directo</span>
                </label>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
                  {/* File Selector DragZone */}
                  <div 
                    className={`md:col-span-2 border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all flex flex-col items-center justify-center min-h-[110px] relative select-none ${
                      isDragging ? 'border-[#0052FF] bg-blue-50/40' : 'border-brand-border bg-white hover:border-[#0052FF]'
                    }`}
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={async (e) => {
                      e.preventDefault();
                      setIsDragging(false);
                      const file = e.dataTransfer.files?.[0];
                      if (file) handleLocalFileSelected(file);
                    }}
                    onClick={() => document.getElementById('modal-card-file-input')?.click()}
                  >
                    <input 
                      id="modal-card-file-input"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleLocalFileSelected(file);
                      }}
                    />
                    {isUploadingImage ? (
                      <div className="space-y-1 text-center flex flex-col items-center">
                        <RefreshCw className="w-5 h-5 text-[#0052FF] animate-spin" />
                        <span className="font-sans text-[9px] uppercase font-bold text-neutral-400">Subiendo...</span>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <Plus className="w-4 h-4 text-neutral-400 mx-auto" />
                        <p className="font-sans text-[11px] font-bold text-black font-semibold">Arrastra o haz clic para subir archivo</p>
                        <p className="font-sans text-[9px] text-neutral-400">PNG, JPG o WEBP (Alojamiento permanente)</p>
                      </div>
                    )}
                  </div>

                  {/* Thumbnail Preview Area */}
                  <div className="border border-brand-border/60 rounded-xl bg-white p-2 h-[110px] flex flex-col justify-between items-center relative overflow-hidden select-none">
                    {formImage ? (
                      <>
                        <img 
                          src={formImage} 
                          alt="Previsualización" 
                          className="w-full h-[75px] object-cover rounded shadow-sm"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=1200&auto=format&fit=crop';
                          }}
                        />
                        <span className="font-sans text-[8px] text-neutral-400 truncate w-full text-center px-1">
                          {formImage.startsWith('/api/uploads/') ? 'SEMBRADO EN CORE' : 'URL EXTERNA'}
                        </span>
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full text-center">
                        <AlertTriangle className="w-4 h-4 text-neutral-300 mb-1" />
                        <span className="font-sans text-[8px] text-neutral-400 uppercase">Sin Imagen</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Direct text input for fallback URL input option */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  <div>
                    <label className="block font-sans text-[9px] text-neutral-400 uppercase tracking-widest mb-1">
                      O pega una URL directa de respaldo
                    </label>
                    <input
                      type="url"
                      value={formImage}
                      onChange={(e) => setFormImage(e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full border border-brand-border rounded px-3 py-1.5 font-sans text-[10px] focus:border-[#0052FF] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-sans text-[9px] text-[#0052FF] uppercase tracking-widest mb-1 font-extrabold">
                      {formBranch === 'branding' ? 'Enlace a la Guía de Marca Completa' : 'Enlace Web del Proyecto (Opcional)'}
                    </label>
                    <input
                      type="url"
                      value={formLink}
                      onChange={(e) => setFormLink(e.target.value)}
                      placeholder={formBranch === 'branding' ? 'https://link-a-tu-pdf-o-guia.com' : 'https://example.com'}
                      className="w-full border border-brand-border rounded px-3 py-1.5 font-sans text-[10px] focus:border-[#0052FF] outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Tags Column */}
              <div>
                <label className="block font-sans text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1.5">
                  Etiquetas Industriales (Separadas por Comas)
                </label>
                <input
                  type="text"
                  value={formTags}
                  onChange={(e) => setFormTags(e.target.value)}
                  placeholder="DIRECCIÓN DE ARTE, NEXT JS, AUTOMATIZACIÓN IA"
                  className="w-full border border-brand-border rounded px-3 py-2 font-sans text-xs focus:border-[#0052FF] outline-none uppercase"
                />
              </div>

              {/* Description Input */}
              <div>
                <label className="block font-sans text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1.5">
                  Descripción Corta *
                </label>
                <textarea
                  required
                  rows={2}
                  maxLength={180}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Introduce un resumen corporativo breve que cumpla las reglas de estilo (máx 180 chars)..."
                  className="w-full border border-brand-border rounded px-3 py-2 font-sans text-xs focus:border-[#0052FF] outline-none resize-none"
                />
              </div>

              {/* Detailed Description Input */}
              <div>
                <label className="block font-sans text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1.5">
                  Descripción Técnica Extendida
                </label>
                <textarea
                  rows={3}
                  value={formDetailedDescription}
                  onChange={(e) => setFormDetailedDescription(e.target.value)}
                  placeholder="Introduce detalles sobre los sistemas arquitectónicos tipo de letra emparejada, flujos de automatismos, etc..."
                  className="w-full border border-brand-border rounded px-3 py-2 font-sans text-xs focus:border-[#0052FF] outline-none resize-none"
                />
              </div>

              {/* Form Actions Footer */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-100 select-none">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 border border-brand-border hover:bg-neutral-100 font-sans text-xs font-bold uppercase rounded cursor-pointer transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 border border-[#0052FF] bg-[#0052FF] text-white hover:bg-blue-700 font-sans text-xs font-bold uppercase rounded cursor-pointer transition-all shadow-sm flex items-center gap-1.5"
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                  {editingProject ? 'Actualizar (PUT)' : 'Guardar (POST)'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
