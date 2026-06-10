import { supabase } from './supabase';
import { Project, ProprietaryProject } from '../types';
import { PROJECTS_DATA, PROPRIETARY_PROJECTS_DATA } from '../data';

// The secure token used to interact with authenticated admin endpoints (for REST fallback)
const TOKEN_STORAGE_KEY = 'bassse_admin_auth_token';
const DEFAULT_SECRET_KEY = 'bassse-secret-key-2026'; // Default authorized key matching Express Server

/**
 * Shared mapping helper to normalize Supabase project records into clean, strongly-typed Project instances.
 */
function mapDatabaseProject(item: any): Project {
  const idVal = item.id || item.slug || item.Slug || '';
  const nameVal = item.name || item.title || item.Title || 'Sin Nombre';
  const categoryVal = item.category || item.Category || '';
  
  let typeVal: 'CLIENTE BASSSE' | 'PROYECTO PROPIO' | 'EVENTO' = 'CLIENTE BASSSE';
  const rawClient = item.Client || item.type || item.Type || '';
  if (rawClient.toLowerCase().includes('propio') || rawClient.toLowerCase().includes('ceo') || nameVal.toLowerCase() === 'techno experience' || nameVal.toLowerCase() === 'sodoma') {
    typeVal = 'PROYECTO PROPIO';
  } else if (rawClient.toLowerCase().includes('evento') || rawClient.toLowerCase().includes('event') || nameVal.toLowerCase() === 'eventos') {
    typeVal = 'EVENTO';
  }

  const yearVal = String(item.year || item.Year || '2026');
  let rawBranchInput = String(item.branch || item.Bloque || item.Category || 'web').toLowerCase();
  let branchVal: 'web' | 'branding' | 'events' | 'ai' | 'merch' = 'web';
  let branchLabelVal = '01 — Web';

  if (rawBranchInput.includes('web') || rawBranchInput.includes('ux') || idVal === 'webs') {
    branchVal = 'web';
    branchLabelVal = '01 — Web';
  } else if (rawBranchInput.includes('branding') || rawBranchInput.includes('marca') || idVal === 'branding') {
    branchVal = 'branding';
    branchLabelVal = '02 — Branding';
  } else if (rawBranchInput.includes('evento') || rawBranchInput.includes('eventos') || rawBranchInput.includes('conciert') || idVal === 'eventos' || idVal === 'sodoma') {
    branchVal = 'events';
    branchLabelVal = '03 — Eventos';
  } else if (rawBranchInput.includes('ia') || rawBranchInput.includes('inteligencia') || rawBranchInput.includes('strategy') || idVal === 'ia-aplicada') {
    branchVal = 'ai';
    branchLabelVal = '04 — IA aplicada';
  } else if (rawBranchInput.includes('merch') || rawBranchInput.includes('prenda') || rawBranchInput.includes('física') || idVal === 'merchandising') {
    branchVal = 'merch';
    branchLabelVal = '05 — Merchandising';
  }

  const descriptionVal = item.description || item.Introduction || item.Descripcion || '';
  const detailedDescriptionVal = item.detailedDescription || item.Description || item.Descripcion || '';

  let imageVal = item.image || item.Featured_Image || item['Featured Image'] || item.Image || item['Featured Image:url'] || '';
  if (!imageVal) {
    imageVal = item['Image 1'] || item['Image 1:url'] || item.image_url || 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=1200&auto=format&fit=crop';
  }

  const imageUrlVal = item.image_url || item.Image_URL || item['Image URL'] || imageVal;

  let tagsVal: string[] = [];
  if (item.tags) {
    tagsVal = Array.isArray(item.tags) ? item.tags : typeof item.tags === 'string' ? JSON.parse(item.tags) : [];
  } else if (item.Casos) {
    tagsVal = String(item.Casos).split('·').map((t: string) => t.trim()).filter(Boolean);
  } else {
    tagsVal = ['DIRECCIÓN DE ARTE', 'ESTRATEGIA'];
  }

  const accentColorVal = item.accentColor || item.accent_color || '#0052FF';
  const linkVal = item.link || item.Link || '';

  let metricsVal = [];
  if (item.metrics) {
    metricsVal = Array.isArray(item.metrics) ? item.metrics : typeof item.metrics === 'string' ? JSON.parse(item.metrics) : [];
  } else {
    metricsVal = [
      { label: 'Eficacia', value: '100%' },
      { label: 'Impacto Global', value: 'BASSSE' }
    ];
  }

  let imagesVal: string[] = [];
  if (item.images) {
    try {
      imagesVal = Array.isArray(item.images) ? item.images : typeof item.images === 'string' ? JSON.parse(item.images) : [];
    } catch {
      imagesVal = [imageUrlVal];
    }
  } else {
    imagesVal = [imageUrlVal];
  }

  return {
    id: idVal,
    name: nameVal,
    branch: branchVal,
    branchLabel: branchLabelVal,
    type: typeVal,
    category: categoryVal,
    year: yearVal,
    description: descriptionVal,
    detailedDescription: detailedDescriptionVal,
    image: imageVal,
    image_url: imageUrlVal,
    images: imagesVal,
    tags: tagsVal,
    link: linkVal,
    metrics: metricsVal,
    accentColor: accentColorVal
  };
}

/**
 * Central Database and API Interactions Module.
 * Provides client operations to manage projects inside the 'projects' table of Supabase,
 * with resilient automatic failover to the local Express rest service.
 */
export const api = {
  getToken(): string | null {
    return localStorage.getItem(TOKEN_STORAGE_KEY);
  },

  setToken(token: string): void {
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
  },

  clearToken(): void {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  },

  isAuthenticated(): boolean {
    return this.getToken() === DEFAULT_SECRET_KEY;
  },

  getHeaders(secured = false): HeadersInit {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    if (secured) {
      const token = this.getToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    return headers;
  },

  /**
   * 1. fetchProjects
   * Fetches projects from Supabase database table 'projects', with fallback to Express Server.
   * Basic validation guarantees clean output types.
   */
  async fetchProjects(branch?: string, searchQuery?: string): Promise<Project[]> {
    try {
      // Primary DB Interaction: Query the Express Backend API Server (which has local file database projects.json)
      const params = new URLSearchParams();
      if (branch && branch !== 'all') params.append('branch', branch);
      if (searchQuery) params.append('q', searchQuery);

      const url = `/api/projects${params.toString() ? `?${params.toString()}` : ''}`;
      const res = await fetch(url, {
        method: 'GET',
        headers: this.getHeaders(false),
      });

      if (res.ok) {
        const localData = await res.json();
        if (Array.isArray(localData) && localData.length > 0) {
          return localData;
        }
      }
      throw new Error("Express backend returned empty or non-200. Proceeding to Supabase fallback");
    } catch (localError: any) {
      console.warn("Express API fetch failed or returned empty. Recovering via Supabase...", localError.message);
      
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .order('year', { ascending: false });

        if (error) {
          throw new Error(`[Supabase Error] ${error.message}`);
        }

        if (data && data.length > 0) {
          let mapped = data.map(mapDatabaseProject);
          if (branch && branch !== 'all') {
            mapped = mapped.filter(item => item.branch === branch);
          }
          if (searchQuery) {
            const q = searchQuery.toLowerCase();
            mapped = mapped.filter(item => 
              item.name.toLowerCase().includes(q) || 
              item.description.toLowerCase().includes(q) ||
              item.category.toLowerCase().includes(q)
            );
          }
          return mapped;
        }
        throw new Error("No data returned from projects table in Supabase");
      } catch (dbError: any) {
        console.warn("Supabase fetch projects failed as well. Falling back to offline PROJECTS_DATA:", dbError.message);
        
        // Final fallback to PROJECTS_DATA
        let list = PROJECTS_DATA;
        if (branch && branch !== 'all') {
          list = list.filter(p => p.branch === branch);
        }
        if (searchQuery) {
          const q = searchQuery.toLowerCase();
          list = list.filter(p => 
            p.name.toLowerCase().includes(q) || 
            p.description.toLowerCase().includes(q) ||
            p.category.toLowerCase().includes(q)
          );
        }
        return list;
      }
    }
  },

  /**
   * Alias legacy method to bridge existing hooks without breaking imports
   */
  async getProjects(branch?: string, searchQuery?: string): Promise<Project[]> {
    return this.fetchProjects(branch, searchQuery);
  },

  /**
   * fetchProjectById
   */
  async getProjectById(id: string): Promise<Project> {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      if (data) return mapDatabaseProject(data);
      throw new Error('Project not found in Supabase');
    } catch (dbError) {
      // Fallback
      const res = await fetch(`/api/projects/${id}`, {
        method: 'GET',
        headers: this.getHeaders(false),
      });

      if (!res.ok) {
        throw new Error(`Fallo al localizar el proyecto ${id}`);
      }

      return res.json();
    }
  },

  /**
   * 2. createProject
   * Adds record to the database table 'projects' after performing strict validations.
   */
  async createProject(project: Partial<Project>): Promise<Project> {
    // Basic validations
    if (!project.name || project.name.trim() === '') {
      throw new Error('Validación: El nombre del proyecto es obligatorio.');
    }
    if (!project.year || project.year.trim() === '') {
      throw new Error('Validación: El año del proyecto es obligatorio.');
    }

    try {
      const dbPayload = {
        id: project.id || project.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        name: project.name,
        branch: project.branch || 'web',
        year: project.year,
        description: project.description || '',
        detailedDescription: project.detailedDescription || '',
        image: project.image || '',
        image_url: project.image_url || project.image || '',
        images: Array.isArray(project.images) ? JSON.stringify(project.images) : '[]',
        tags: Array.isArray(project.tags) ? JSON.stringify(project.tags) : project.tags || '[]',
        link: project.link || '',
        accentColor: project.accentColor || '#0052FF',
        category: project.category || '',
        type: project.type || 'CLIENTE BASSSE',
        metrics: Array.isArray(project.metrics) ? JSON.stringify(project.metrics) : '[]'
      };

      const { data, error } = await supabase
        .from('projects')
        .insert([dbPayload])
        .select()
        .single();

      if (error) throw error;
      if (data) return mapDatabaseProject(data);
      throw new Error('Fallo al insertar el registro en Supabase');
    } catch (dbError: any) {
      console.warn("Supabase insert failed. Falling back to Express Backend server... Server Error:", dbError.message);

      // Secure pre-flight authentication check for Express Server Endpoints
      if (!this.isAuthenticated()) {
        throw new Error('Permisos insuficientes: Debes iniciar una sesión autorizada.');
      }

      // Fallback to Server Api
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: this.getHeaders(true),
        body: JSON.stringify(project),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || 'Error del servidor al registrar el proyecto.');
      }

      return res.json();
    }
  },

  /**
   * 3. updateProject
   * Modifies columns in database table 'projects' matching primary key id.
   */
  async updateProject(id: string, project: Partial<Project>): Promise<Project> {
    if (!id || id.trim() === '') {
      throw new Error('Validación: Se require un ID válido para proceder con la actualización.');
    }

    try {
      const dbPayload: any = {};
      if (project.name !== undefined) dbPayload.name = project.name;
      if (project.branch !== undefined) dbPayload.branch = project.branch;
      if (project.year !== undefined) dbPayload.year = project.year;
      if (project.description !== undefined) dbPayload.description = project.description;
      if (project.detailedDescription !== undefined) dbPayload.detailedDescription = project.detailedDescription;
      if (project.image !== undefined) dbPayload.image = project.image;
      if (project.image_url !== undefined) dbPayload.image_url = project.image_url;
      if (project.images !== undefined) dbPayload.images = Array.isArray(project.images) ? JSON.stringify(project.images) : project.images;
      if (project.tags !== undefined) dbPayload.tags = Array.isArray(project.tags) ? JSON.stringify(project.tags) : project.tags;
      if (project.link !== undefined) dbPayload.link = project.link;
      if (project.accentColor !== undefined) dbPayload.accentColor = project.accentColor;
      if (project.category !== undefined) dbPayload.category = project.category;
      if (project.type !== undefined) dbPayload.type = project.type;
      if (project.metrics !== undefined) dbPayload.metrics = Array.isArray(project.metrics) ? JSON.stringify(project.metrics) : project.metrics;

      const { data, error } = await supabase
        .from('projects')
        .update(dbPayload)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      if (data) return mapDatabaseProject(data);
      throw new Error('Fallo al actualizar el registro en Supabase');
    } catch (dbError: any) {
      console.warn("Supabase update failed. Falling back to Express Backend Server... Error:", dbError.message);

      if (!this.isAuthenticated()) {
        throw new Error('Permisos insuficientes: Sesión administrativa requerida.');
      }

      // Fallback
      const res = await fetch(`/api/projects/${id}`, {
        method: 'PUT',
        headers: this.getHeaders(true),
        body: JSON.stringify(project),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || `No se pudo actualizar el registro: ${id}`);
      }

      return res.json();
    }
  },

  /**
   * 4. deleteProject
   * Removes from the 'projects' table matching the id column.
   */
  async deleteProject(id: string): Promise<{ success: boolean; message: string }> {
    if (!id || id.trim() === '') {
      throw new Error('Validación: Se requiere un ID de proyecto válido.');
    }

    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return { success: true, message: 'Registro borrado con éxito de Supabase' };
    } catch (dbError: any) {
      console.warn("Supabase delete failed. Falling back to Express Backend Server... Error:", dbError.message);

      if (!this.isAuthenticated()) {
        throw new Error('Permisos insuficientes: Sesión no autenticada.');
      }

      const res = await fetch(`/api/projects/${id}`, {
        method: 'DELETE',
        headers: this.getHeaders(true),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || `Fallo al procesar la eliminación del registro: ${id}`);
      }

      return res.json();
    }
  },

  /**
   * 5. uploadImage
   * Uploads an image from the local computer via base64 encoded payload.
   */
  async uploadImage(filename: string, base64: string): Promise<string> {
    if (!this.isAuthenticated()) {
      throw new Error('Permisos insuficientes: Debes iniciar una sesión autorizada.');
    }

    const res = await fetch('/api/upload', {
      method: 'POST',
      headers: this.getHeaders(true),
      body: JSON.stringify({ filename, base64 })
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.message || 'Fallo al procesar la subida del archivo al servidor BASSSE.');
    }

    const data = await res.json();
    return data.url;
  },

  async getProprietaryProjects(): Promise<ProprietaryProject[]> {
    try {
      const res = await fetch('/api/proprietary', {
        method: 'GET',
        headers: this.getHeaders(false),
      });
      if (!res.ok) throw new Error('Fallo al descargar proyectos propios de Express');
      return res.json();
    } catch {
      return PROPRIETARY_PROJECTS_DATA;
    }
  },

  async updateProprietaryProject(id: string, project: Partial<ProprietaryProject>): Promise<ProprietaryProject> {
    if (!id || id.trim() === '') {
      throw new Error('Validación: Se requiere un ID válido.');
    }
    const res = await fetch(`/api/proprietary/${id}`, {
      method: 'PUT',
      headers: this.getHeaders(true),
      body: JSON.stringify(project),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.message || `No se pudo actualizar el proyecto propio: ${id}`);
    }

    return res.json();
  },

  initializeSession(): void {
    // Keep credentials if they exist in localStorage so sessions survive reload.
    const token = this.getToken();
    if (token && token !== DEFAULT_SECRET_KEY) {
      this.clearToken();
    }
  }
};

api.initializeSession();
