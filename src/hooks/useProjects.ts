import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { Project } from '../types';
import { PROJECTS_DATA } from '../data';
import { api } from '../lib/api';

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>(PROJECTS_DATA);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const applyLocalStorageOverrides = useCallback((list: Project[]): Project[] => {
    try {
      const overridesRaw = localStorage.getItem('bassse_custom_project_overrides');
      if (!overridesRaw) return list;
      const overrides = JSON.parse(overridesRaw);
      return list.map(proj => {
        if (overrides[proj.id]) {
          const overrideVal = { ...overrides[proj.id] };
          // BASSSE Smart Override Sanitization:
          // If the core data has physical local folder references (starting with /imagenes/)
          // but the client-side localStorage overrides are pointing to an unsplash placeholder URL,
          // discard the old cover override in favor of the beautiful physical disk asset!
          const hasLocalImage = proj.image_url?.startsWith('/imagenes') || proj.image?.startsWith('/imagenes');
          const isOverridePlaceholder = overrideVal.image_url?.includes('unsplash.com') || overrideVal.image?.includes('unsplash.com');
          
          if (hasLocalImage && isOverridePlaceholder) {
            delete overrideVal.image_url;
            delete overrideVal.image;
          }
          return { ...proj, ...overrideVal };
        }
        return proj;
      });
    } catch (e) {
      console.warn("Could not read local storage overrides:", e);
      return list;
    }
  }, []);

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. Try our centralized API controller
      const data = await api.getProjects();
      if (Array.isArray(data) && data.length > 0) {
        setProjects(applyLocalStorageOverrides(data));
        setLoading(false);
        return;
      }
      
      // If server returned empty or failed, prompt fallback
      throw new Error('API server returned empty or failed, trying Supabase fallback');
    } catch (apiErr: any) {
      console.warn("Express API fetch failed or returned empty. Recovering via Supabase. Error:", apiErr.message);
      
      try {
        // 2. Query the 'projects' table from Supabase
        const { data, error: sbError } = await supabase
          .from('projects')
          .select('*')
          .order('year', { ascending: false });

        if (sbError) {
          throw new Error(sbError.message);
        }

        if (data && data.length > 0) {
          // Robust mapping to ensure TypeScript shape compliance and CSV compatibility
          const mappedProjects: Project[] = data.map((item: any) => {
            const idVal = item.id || item.slug || item.Slug || '';
            const nameVal = item.name || item.title || item.Title || '';
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
              tags: tagsVal,
              link: linkVal,
              metrics: metricsVal,
              accentColor: accentColorVal
            };
          });
          setProjects(applyLocalStorageOverrides(mappedProjects));
        } else {
          // 3. Last Fallback: Seed local PROJECTS_DATA
          setProjects(applyLocalStorageOverrides(PROJECTS_DATA));
        }
      } catch (sbErr: any) {
        console.warn("Could not load projects from Supabase. Falling back to local offline data. Error:", sbErr.message);
        setError(sbErr.message || 'Error de conexión');
        setProjects(applyLocalStorageOverrides(PROJECTS_DATA));
      }
    } finally {
      setLoading(false);
    }
  }, [applyLocalStorageOverrides]);

  // --- Core CRUD API triggers to be exposed to Frontend Admin Console ---
  const addProject = async (projectData: Partial<Project>) => {
    try {
      const newProject = await api.createProject(projectData);
      setProjects(prev => [newProject, ...prev]);
      return newProject;
    } catch (err: any) {
      console.error("addProject failure:", err.message);
      throw err;
    }
  };

  const updateProject = async (id: string, updatedFields: Partial<Project>) => {
    try {
      // Persist immediately in browser's local storage overrides cache
      try {
        const overridesRaw = localStorage.getItem('bassse_custom_project_overrides') || '{}';
        const overrides = JSON.parse(overridesRaw);
        overrides[id] = { ...(overrides[id] || {}), ...updatedFields };
        localStorage.setItem('bassse_custom_project_overrides', JSON.stringify(overrides));
      } catch (e) {
        console.warn("Failed to write to local storage overrides:", e);
      }

      const updatedProject = await api.updateProject(id, updatedFields);
      setProjects(prev => prev.map(p => p.id === id ? { ...p, ...updatedProject } : p));
      return updatedProject;
    } catch (err: any) {
      console.error("updateProject failure:", err.message);
      throw err;
    }
  };

  const deleteProject = async (id: string) => {
    try {
      await api.deleteProject(id);
      setProjects(prev => prev.filter(p => p.id !== id));
      return true;
    } catch (err: any) {
      console.error("deleteProject failure:", err.message);
      throw err;
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return { 
    projects, 
    loading, 
    error, 
    refetch: fetchProjects,
    addProject,
    updateProject,
    deleteProject
  };
}
