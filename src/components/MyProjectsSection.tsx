import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { PROPRIETARY_PROJECTS_DATA } from '../data';
import { ArrowUpRight, Camera, Check, X, Upload, Image as ImageIcon, Lock, Unlock } from 'lucide-react';
import { api } from '../lib/api';
import { ProprietaryProject } from '../types';

interface MyProjectsSectionProps {
  onNotification: (msg: string) => void;
  onProjectSelect?: (project: any) => void;
}

const getSafeImageUrl = (url: string) => {
  if (!url) return '';
  if (url.startsWith('/') && !url.startsWith('//')) {
    return encodeURI(url).replace(/&/g, '%26');
  }
  return url;
};

export default function MyProjectsSection({ onNotification, onProjectSelect }: MyProjectsSectionProps) {
  const [projectsList, setProjectsList] = useState<ProprietaryProject[]>([]);
  const [isEditMode, setIsEditMode] = useState<boolean>(() => api.isAuthenticated());

  useEffect(() => {
    const handleAuthUpdated = () => {
      setIsEditMode(api.isAuthenticated());
    };
    window.addEventListener('bassse_auth_updated', handleAuthUpdated);
    window.addEventListener('storage', handleAuthUpdated);
    return () => {
      window.removeEventListener('bassse_auth_updated', handleAuthUpdated);
      window.removeEventListener('storage', handleAuthUpdated);
    };
  }, []);

  const [editingProject, setEditingProject] = useState<ProprietaryProject | null>(null);
  const [customUrl, setCustomUrl] = useState<string>('');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  // Sync background attributes in real-time
  const [projectsBgMode, setProjectsBgMode] = useState<'dark' | 'light'>('dark');
  const [projectsBgUrl, setProjectsBgUrl] = useState<string>('https://images.unsplash.com/photo-1574169208507-84376144848b?q=80&w=1600');

  useEffect(() => {
    const savedMode = localStorage.getItem('bassse_projects_bg_mode') as 'dark' | 'light' | null;
    const savedBg = localStorage.getItem('bassse_projects_bg_url');
    if (savedMode) setProjectsBgMode(savedMode);
    if (savedBg !== null) setProjectsBgUrl(savedBg);

    const handleStorageChange = () => {
      const liveMode = localStorage.getItem('bassse_projects_bg_mode') as 'dark' | 'light' | null;
      const liveBg = localStorage.getItem('bassse_projects_bg_url');
      if (liveMode) setProjectsBgMode(liveMode);
      if (liveBg !== null) setProjectsBgUrl(liveBg);
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('bassse_bg_updated', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('bassse_bg_updated', handleStorageChange);
    };
  }, []);

  // Premium, highly atmospheric images for the branding representations of the 3 proprietary projects
  const BRAND_METADATA: { [key: string]: { img: string; title: string; desc: string; num: string; accentColor: string } } = {
    'techno-experience': {
      img: '/imagenes/1- WEB/1.2- TECHNOEXPERIENCE.ES/technoexperience web.jpg',
      title: 'TECHNO EXPERIENCE',
      desc: 'Medio líder de periodismo musical y cultura electrónica global.',
      num: '01',
      accentColor: '#00D5C9'
    },
    'bassse-agency': {
      img: '/imagenes/2- BRANDING/2.1- DSKONNECT BOOKINGS/guia dskonnect.jpg',
      title: 'BASSSE AGENCY',
      desc: 'Ingeniería de marca, automatización con IA y boutique corporativa.',
      num: '02',
      accentColor: '#0052FF'
    },
    'sodoma-project': {
      img: '/imagenes/3- EVENTOS/3.2- NÖCTAR/cuagrado.jpg',
      title: 'SODOMA CONCEPT',
      desc: 'La serie estroboscópica de techno industrial más pura.',
      num: '03',
      accentColor: '#FF5E00'
    }
  };

  const AGENCY_PRESETS = [
    { url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1200&auto=format&fit=crop', label: 'Techno Grid Concert' },
    { url: 'https://images.unsplash.com/photo-1542744094-3a31f103e35f?q=80&w=1200&auto=format&fit=crop', label: 'BASSSE Tech Corporate' },
    { url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1200&auto=format&fit=crop', label: 'Industrial Strobe Lights' },
    { url: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1200&auto=format&fit=crop', label: 'Club Crowd Energy' },
    { url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1200&auto=format&fit=crop', label: 'Mixer Faders Grid' },
    { url: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=1200&auto=format&fit=crop', label: 'Modular Synthesizer Cable' }
  ];

  const mapProprietaryToProject = (project: ProprietaryProject): any => {
    const defaultImg = BRAND_METADATA[project.id]?.img || '';
    const imgSource = project.image_url || project.image || defaultImg;
    
    const defaultCarouselImages: Record<string, string[]> = {
      'techno-experience': [
        'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1200&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1200&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=1200&auto=format&fit=crop'
      ],
      'bassse-agency': [
        'https://images.unsplash.com/photo-1542744094-3a31f103e35f?q=80&w=1200&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=1200&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1200&auto=format&fit=crop'
      ],
      'sodoma-project': [
        'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1200&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1200&auto=format&fit=crop'
      ]
    };

    const images = defaultCarouselImages[project.id] || [imgSource];
    if (imgSource && !images.includes(imgSource)) {
      images.unshift(imgSource);
    }

    return {
      id: project.id,
      name: project.name,
      branch: 'branding' as any,
      branchLabel: 'Propios',
      type: 'PROYECTO PROPIO',
      category: `DIRECCIÓN CREATIVA · ${project.role.toUpperCase()}`,
      year: 'ACTIVO',
      description: project.description,
      detailedDescription: project.longDescription,
      image: imgSource,
      image_url: imgSource,
      images: images,
      tags: project.tags,
      link: project.link,
      metrics: project.stats || [],
      accentColor: BRAND_METADATA[project.id]?.accentColor || '#0052FF'
    };
  };

  const applyProprietaryOverrides = (list: ProprietaryProject[]): ProprietaryProject[] => {
    try {
      localStorage.removeItem('bassse_custom_proprietary_overrides');
    } catch (e) {
      // Ignored
    }
    return list;
  };

  useEffect(() => {
    let active = true;
    const loadProprietary = async () => {
      try {
        const data = await api.getProprietaryProjects();
        if (active) {
          setProjectsList(applyProprietaryOverrides(data));
        }
      } catch (err) {
        console.error("Fallo al descargar proyectos propios de Express:", err);
        if (active) {
          setProjectsList(applyProprietaryOverrides(PROPRIETARY_PROJECTS_DATA));
        }
      }
    };
    loadProprietary();

    return () => {
      active = false;
    };
  }, []);

  const handleLocalUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      onNotification("ERROR: El formato del archivo seleccionado no es una imagen válida.");
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      onNotification("ERROR: El archivo excede el tamaño máximo permitido de 8MB.");
      return;
    }

    setIsUploading(true);
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64String = reader.result as string;
        try {
          const uploadedUrl = await api.uploadImage(file.name, base64String);
          setCustomUrl(uploadedUrl);
          onNotification("SISTEMA BASSSE: Imagen cargada de tu equipo local con éxito.");
        } catch (uploadErr) {
          console.warn("Local storage write issues, utilizing raw Base64 string directly:", uploadErr);
          setCustomUrl(base64String);
          onNotification("SISTEMA BASSSE: Imagen cargada en búfer en memoria correctamente.");
        } finally {
          setIsUploading(false);
        }
      };
      
      reader.onerror = () => {
        setIsUploading(false);
        onNotification("ERROR: No se pudo codificar el archivo local.");
      };

      reader.readAsDataURL(file);
    } catch (e: any) {
      setIsUploading(false);
      onNotification(`ERROR: Hilo de subida interrumpido: ${e.message}`);
    }
  };

  const handleSaveProprietaryImage = async () => {
    if (!editingProject) return;

    if (!customUrl.trim()) {
      onNotification("ERROR: Proporciona una imagen o enlace válido antes de guardar.");
      return;
    }

    setIsSaving(true);
    try {
      // Save directly to localStorage overrides cache
      try {
        const overridesRaw = localStorage.getItem('bassse_custom_proprietary_overrides') || '{}';
        const overrides = JSON.parse(overridesRaw);
        overrides[editingProject.id] = { 
          ...(overrides[editingProject.id] || {}), 
          image: customUrl, 
          image_url: customUrl 
        };
        localStorage.setItem('bassse_custom_proprietary_overrides', JSON.stringify(overrides));
      } catch (e) {
        console.warn("Failed to write proprietary overrides:", e);
      }

      const updated = await api.updateProprietaryProject(editingProject.id, {
        image: customUrl,
        image_url: customUrl
      });

      setProjectsList(prev => prev.map(p => p.id === editingProject.id ? { ...p, ...updated } : p));
      onNotification(`SISTEMA BASSSE: Imagen para "${editingProject.name}" modificada con éxito.`);
      setEditingProject(null);
      setCustomUrl('');
    } catch (err: any) {
      onNotification(`ERROR: No se pudo guardar la nueva portada: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section id="proprietary-projects-section" className={`relative w-full py-24 select-none font-sans overflow-hidden transition-colors duration-500 ${projectsBgMode === 'dark' ? 'bg-[#070707] text-white' : 'bg-[#F5F5F3] text-black'}`}>
      {/* Moving Background Image for heavy cinematic atmospheric impact */}
      <div className="absolute inset-0 z-0">
        {projectsBgUrl && (
          <motion.img
            src={projectsBgUrl}
            alt="Cinematic abstract texture representation"
            className="w-full h-full object-cover opacity-15 pointer-events-none filter grayscale contrast-125 brightness-50"
            animate={{
              scale: [1, 1.08, 1],
              x: [0, 15, -15, 0],
              y: [0, -10, 10, 0]
            }}
            transition={{
              duration: 35,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            referrerPolicy="no-referrer"
          />
        )}
        {/* Deep, rich shadows to isolate cards */}
        <div className={`absolute inset-0 bg-gradient-to-b ${projectsBgMode === 'dark' ? 'from-[#070707] via-transparent to-[#070707]' : 'from-[#F5F5F3] via-transparent to-[#F5F5F3]'}`} />
      </div>

      <div className="relative z-10 w-[90%] mx-auto max-w-7xl">
        {/* Editorial Title Block with thick line indicator in Blue */}
        <div className={`border-b pb-12 mb-16 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start ${projectsBgMode === 'dark' ? 'border-white/10' : 'border-black/10'}`}>
          <div className="lg:col-span-6 space-y-4">
            <div className="font-sans text-[11px] tracking-[0.2em] text-[#0052FF] uppercase font-black">
              CULTURA INTERNA & DESARROLLO CORPORATIVO
            </div>
            <h2 className={`text-4xl sm:text-6xl font-display font-black tracking-[0.05em] uppercase leading-none ${projectsBgMode === 'dark' ? 'text-white' : 'text-black'}`}>
              Mis Proyectos
            </h2>
          </div>
          <div className="lg:col-span-6 lg:pt-4 flex flex-col justify-between items-start">
            <p className={`max-w-2xl text-sm sm:text-base leading-relaxed font-semibold ${projectsBgMode === 'dark' ? 'text-neutral-400' : 'text-neutral-600'}`}>
              Iniciativas, medios de divulgación, marcas y agencias que he cofundado y que dirigo activamente. Estructuras serias, rentables y digitales de alta fidelidad que actúan como mis propios embudos de experimentación estética y técnica.
            </p>
          </div>
        </div>

        {/* Decorative vertical divider structure layout */}
        <div className="space-y-20">
          {projectsList.map((project, idx) => {
            const defaultImg = BRAND_METADATA[project.id]?.img || '';
            const imgSource = project.image_url || project.image || defaultImg;

            return (
              <div 
                key={project.id}
                className={`grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start border-b pb-20 last:border-0 ${projectsBgMode === 'dark' ? 'border-white/[0.08]' : 'border-black/10'}`}
              >
                {/* Number Counter & Name Details (Columns 1-4) */}
                <div className="lg:col-span-4 space-y-6">
                  <div className="flex items-baseline gap-4">
                    <span className="text-6xl md:text-8xl font-display font-black text-[#0052FF]/15 leading-none select-none">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <div>
                      <span className="block font-sans text-[10px] tracking-widest text-[#0052FF] uppercase font-black">
                        {project.role.toUpperCase()}
                      </span>
                      <h3 
                        onClick={() => {
                          if (!isEditMode && onProjectSelect) {
                            onProjectSelect(mapProprietaryToProject(project));
                          }
                        }}
                        className={`text-2xl sm:text-3.5xl font-display font-black uppercase tracking-[0.05em] transition-colors duration-200 ${
                          !isEditMode && onProjectSelect 
                            ? 'cursor-pointer hover:text-[#0052FF]' 
                            : (projectsBgMode === 'dark' ? 'text-white' : 'text-black')
                        }`}
                      >
                        {project.name}
                      </h3>
                    </div>
                  </div>

                  {/* Badges system */}
                  <div className="flex flex-wrap gap-1.5">
                    {project.tags.map((tag) => (
                      <span 
                        key={tag}
                        className={`px-2.5 py-1 font-sans text-[10px] uppercase tracking-wider rounded border font-bold ${
                          projectsBgMode === 'dark' 
                            ? 'bg-white/[0.03] text-neutral-300 border-white/[0.08]' 
                            : 'bg-black/[0.03] text-neutral-600 border-black/10'
                        }`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Action Trigger */}
                  {project.link && (
                    <div className="pt-2">
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => {
                          e.stopPropagation();
                          onNotification(`Redireccionando a ${project.name}...`);
                        }}
                        className={`inline-flex items-center gap-1.5 text-xs font-sans font-black uppercase tracking-widest transition-colors border-b pb-1 ${
                          projectsBgMode === 'dark' 
                            ? 'text-white border-white/20 hover:border-[#0052FF]' 
                            : 'text-black border-black/20 hover:border-[#0052FF]'
                        }`}
                      >
                        Visita el proyecto activo
                        <ArrowUpRight className="w-4 h-4 text-[#0052FF]" />
                      </a>
                    </div>
                  )}
                </div>

                {/* Description & Overview (Columns 5-8) */}
                <div className="lg:col-span-5 space-y-5">
                  <p className={`text-base sm:text-lg leading-relaxed font-semibold ${projectsBgMode === 'dark' ? 'text-white' : 'text-black'}`}>
                    {project.description}
                  </p>
                  <p className={`text-xs sm:text-sm leading-relaxed font-medium ${projectsBgMode === 'dark' ? 'text-neutral-400' : 'text-neutral-500'}`}>
                    {project.longDescription}
                  </p>
                </div>

                {/* Aesthetic Visual Image Column with continuous slow panning inside cards (Columns 9-12) */}
                <div className="lg:col-span-3 space-y-2.5">
                  <div 
                    onClick={() => {
                      if (isEditMode) {
                        setEditingProject(project);
                        setCustomUrl(project.image_url || project.image || defaultImg);
                      } else if (onProjectSelect) {
                        onProjectSelect(mapProprietaryToProject(project));
                      }
                    }}
                    className={`relative w-full aspect-square rounded-[24px] overflow-hidden border shadow-xl group flex items-center justify-center cursor-pointer hover:border-[#0052FF]/60 hover:shadow-2xl ${
                      projectsBgMode === 'dark' ? 'border-white/[0.08] bg-[#111]' : 'border-black/5 bg-white'
                    }`}
                  >
                    
                    {/* Frame photo replacement containing slow atmospheric continuous panning */}
                    <motion.img 
                      src={getSafeImageUrl(imgSource)}
                      alt={project.name}
                      onError={(e) => {
                        const fallbacks: Record<string, string> = {
                          'techno-experience': 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1200&auto=format&fit=crop',
                          'bassse-agency': 'https://images.unsplash.com/photo-1542744094-3a31f103e35f?q=80&w=1200&auto=format&fit=crop',
                          'sodoma-project': 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1200&auto=format&fit=crop'
                        };
                        const fallback = fallbacks[project.id] || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop';
                        if (e.currentTarget.src !== fallback) {
                          e.currentTarget.src = fallback;
                        }
                      }}
                      className={`w-full h-full object-cover transition-all duration-700 ease-[0.16, 1, 0.3, 1] ${
                        isEditMode 
                          ? 'brightness-40 contrast-105 select-none' 
                          : 'group-hover:scale-105'
                      }`}
                      animate={isEditMode ? {} : {
                        scale: [1.02, 1.06, 1.02],
                        x: [0, 4, -4, 0],
                        y: [0, -3, 3, 0]
                      }}
                      transition={{
                        duration: 25,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      referrerPolicy="no-referrer"
                    />

                    {/* Gradient spotlight overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                    
                    {isEditMode ? (
                      /* High-tech edit overlay with Camera feedback */
                      <div className="absolute inset-0 bg-black/40 border-2 border-dashed border-[#0052FF] rounded-[24px] flex flex-col items-center justify-center gap-1.5 z-10 p-4 text-center">
                        <div className="p-2.5 bg-[#0052FF] hover:bg-[#0077FF] text-white rounded-full shadow-lg transform scale-100 hover:scale-110 active:scale-95 transition-transform duration-200">
                          <Camera className="w-4 h-4" />
                        </div>
                        <span className="font-sans text-[8.5px] text-white font-extrabold uppercase tracking-widest bg-black/85 px-3 py-1 rounded border border-white/10 shadow-sm leading-none">
                          Cambiar Foto
                        </span>
                      </div>
                    ) : (
                      <>
                        {/* Visual mask indicator */}
                        <div className="absolute inset-x-0 bottom-0 bg-black/95 px-4 py-2.5 text-[9px] font-sans text-white border-t border-white/[0.08] flex items-center justify-between font-bold z-10">
                          <span className="tracking-widest flex items-center gap-1.5 font-black uppercase">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#0052FF] animate-pulse" />
                            PROYECTO PROPIO // 0{idx + 1}
                          </span>
                        </div>
                        
                        {/* Premium action circle mask inside the card on hover */}
                        <div className="absolute inset-0 bg-black/15 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-10">
                          <div className="bg-white text-black p-4 rounded-full shadow-lg transform scale-90 group-hover:scale-100 transition-transform duration-400 flex items-center justify-center">
                            <ArrowUpRight className="w-5 h-5 text-black" />
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                  <div className="flex justify-between items-center text-[10px] font-sans tracking-wide text-neutral-500 uppercase font-black px-1">
                    <span>{project.role}</span>
                    <span className="text-[#0052FF]">EN OPERACIÓN</span>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

        {/* Strategic Manifesto snippet */}
        <div className="mt-16 bg-black text-[#F2F2F0] border border-[#0052FF]/60 rounded-[32px] p-8 md:p-12 space-y-4 relative overflow-hidden shadow-2xl">
          {/* Subtle slow continuous moving light overlay in background */}
          <div className="absolute inset-0 z-0 opacity-20 pointer-events-none mix-blend-screen">
            <motion.div 
              className="w-[300px] h-[300px] rounded-full filter blur-[100px] bg-[#0052FF]"
              animate={{
                x: [-100, 200, -100],
                y: [-50, 100, -50],
              }}
              transition={{
                duration: 22,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </div>

          <div className="relative z-10 space-y-3">
            <span className="font-sans text-[10px] tracking-[0.2em] text-[#0052FF] uppercase font-black">
              MI COMPROMISO DE CALIDAD / DIRECCIÓN CREATIVA
            </span>
            <p className="font-sans text-lg sm:text-xl leading-relaxed text-neutral-200 font-semibold max-w-4xl">
              "Cada proyecto, marca propia o iniciativa la diseño bajo un principio inviolable de identidad extrema y tecnología orientada al rendimiento. No creo en fórmulas repetitivas, sino en la artesanía digital de mi más alto impacto."
            </p>
          </div>
        </div>
      </div>

    </section>
  );
}

