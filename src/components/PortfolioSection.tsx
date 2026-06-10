import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { AI_CAPABILITIES } from '../data';
import { useProjects } from '../hooks/useProjects';
import { api } from '../lib/api';
import { Project, ProjectBranch } from '../types';
import { ArrowUpRight, Camera, Key, Lock, Unlock, Image as ImageIcon, X, Check, Search, Upload, Plus } from 'lucide-react';
import ProjectsGravityBox from './ProjectsGravityBox';
import { TechnoExperienceMockup, DskonnectMockup } from './ProjectMockups';

interface PortfolioSectionProps {
  onProjectSelect: (project: Project) => void;
  onNotification?: (msg: string) => void;
}

const getSafeImageUrl = (url: string) => {
  if (!url) return '';
  if (url.startsWith('/') && !url.startsWith('//')) {
    return encodeURI(url).replace(/&/g, '%26');
  }
  return url;
};

const PRESET_IMAGES: Record<ProjectBranch, { url: string; label: string }[]> = {
  web: [
    { url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=600&auto=format&fit=crop', label: 'Mechanical Coding' },
    { url: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=600&auto=format&fit=crop', label: 'Monitor Workstation' },
    { url: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=600&auto=format&fit=crop', label: 'UX Interface Wireframes' },
    { url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=600&auto=format&fit=crop', label: 'Visual UI Mockups' },
    { url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=600&auto=format&fit=crop', label: 'Database Grid Node' },
    { url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=600&auto=format&fit=crop', label: 'Cyber Systems Cyberware' }
  ],
  branding: [
    { url: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=600&auto=format&fit=crop', label: 'Design Editorial System' },
    { url: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?q=80&w=600&auto=format&fit=crop', label: 'Stationery & Identity' },
    { url: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?q=80&w=600&auto=format&fit=crop', label: 'Sculptural Clay Shapes' },
    { url: 'https://images.unsplash.com/photo-1509343256512-d77a5cb3791b?q=80&w=600&auto=format&fit=crop', label: 'Corporate Label Mockups' },
    { url: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?q=80&w=600&auto=format&fit=crop', label: 'Aesthetic Blueprint Layout' },
    { url: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=600&auto=format&fit=crop', label: 'Metallic Wave Abstraction' }
  ],
  events: [
    { url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=600&auto=format&fit=crop', label: 'Atmospheric Lasers' },
    { url: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=600&auto=format&fit=crop', label: 'Electronic Music Silhouette' },
    { url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=600&auto=format&fit=crop', label: 'Industrial Strobes' },
    { url: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=600&auto=format&fit=crop', label: 'Main Stage Lights' },
    { url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=600&auto=format&fit=crop', label: 'Synthesizer Shadows' },
    { url: 'https://images.unsplash.com/photo-1482440308425-276ad0f28b19?q=80&w=600&auto=format&fit=crop', label: 'Strobe Sweeping Rays' }
  ],
  ai: [
    { url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=600&auto=format&fit=crop', label: 'Neural Data Modules' },
    { url: 'https://images.unsplash.com/photo-1527474305487-b87b222841cc?q=80&w=600&auto=format&fit=crop', label: 'Digital Grid Schema' },
    { url: 'https://images.unsplash.com/photo-1544256718-3bcf237f3974?q=80&w=600&auto=format&fit=crop', label: 'Intelligent Network Lattice' },
    { url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop', label: 'Symmetric Space Sphere' },
    { url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=600&auto=format&fit=crop', label: 'Active Semiconductor Board' },
    { url: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=600&auto=format&fit=crop', label: 'AI Node Hyper-Matrix' }
  ],
  merch: [
    { url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=600&auto=format&fit=crop', label: 'Minimal Premium Techwear' },
    { url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=600&auto=format&fit=crop', label: 'Heavy Cotton Street Tee' },
    { url: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=600&auto=format&fit=crop', label: 'Ecom Studio Shadows' },
    { url: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?q=80&w=600&auto=format&fit=crop', label: 'Premium Apparel Hanger' },
    { url: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=600&auto=format&fit=crop', label: 'Abstract Fabric Texture' },
    { url: 'https://images.unsplash.com/photo-1508427953056-b00b8d78ebf5?q=80&w=600&auto=format&fit=crop', label: 'High-Contrast Clothes Rail' }
  ]
};

const SEARCH_CATALOG: { url: string; tags: string[]; label: string }[] = [
  // Music & Club Culture
  { url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=600', tags: ['music', 'techno', 'rave', 'laser', 'lights', 'club'], label: 'Laser Synthesis' },
  { url: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=600', tags: ['club', 'crowd', 'rave', 'party', 'audience'], label: 'Club Rave Crowd' },
  { url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=600', tags: ['strobe', 'club', 'dark', 'industrial', 'flash'], label: 'Industrial Strobe' },
  { url: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=600', tags: ['lights', 'stage', 'concert', 'crowd'], label: 'Epic Stage Show' },
  { url: 'https://images.unsplash.com/photo-1482440308425-276ad0f28b19?q=80&w=600', tags: ['lasers', 'blue', 'rave', 'dancing'], label: 'Cyan Rave Strobe' },
  { url: 'https://images.unsplash.com/photo-1484755560693-a4074577af3a?q=80&w=600', tags: ['vinyl', 'music', 'sound', 'turntable', 'dj'], label: 'Analogue Vinyl' },
  { url: 'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?q=80&w=600', tags: ['mixer', 'dj', 'fader', 'console', 'music'], label: 'Contoured Mixer Faders' },
  { url: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=600', tags: ['synth', 'synthesizer', 'analog', 'keyboard'], label: 'Analog Synthesizer' },
  // Coding & Web Design
  { url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=600', tags: ['code', 'programming', 'web', 'coding', 'js', 'developer'], label: 'Mechanical Terminal' },
  { url: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=600', tags: ['setup', 'workstation', 'monitor', 'desk', 'workspace'], label: 'Dual Monitor Workstation' },
  { url: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=600', tags: ['ux', 'ui', 'figma', 'design', 'grids', 'wireframe'], label: 'Aesthetic Interface Grids' },
  { url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=600', tags: ['laptop', 'macbook', 'mockup', 'computer'], label: 'Macbook UI Layout' },
  { url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=600', tags: ['matrix', 'database', 'grid', 'network'], label: 'Database Grid Node' },
  { url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=600', tags: ['server', 'cyber', 'energy', 'tech'], label: 'Cyber Systems' },
  // Branding & Architecture
  { url: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=600', tags: ['branding', 'logo', 'design', 'book', 'guideline'], label: 'Corporate Brand Book' },
  { url: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?q=80&w=600', tags: ['cards', 'stationery', 'branding', 'labels'], label: 'Minimalist Stationery Set' },
  { url: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?q=80&w=600', tags: ['clay', 'abstract', 'modeling', 'objects'], label: 'Sculptural Clay Shapes' },
  { url: 'https://images.unsplash.com/photo-1509343256512-d77a5cb3791b?q=80&w=600', tags: ['labels', 'hang', 'shelf', 'mockup'], label: 'Corporate Hangtags' },
  { url: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?q=80&w=600', tags: ['lines', 'architecture', 'blueprint'], label: 'Abstract Architecture' },
  { url: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=600', tags: ['waves', 'mesh', 'abstract'], label: 'Metallic Flowing Mesh' },
  // Apparel & Merch
  { url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=600', tags: ['apparel', 'hoodie', 'techwear', 'clothing', 'fashion'], label: 'Premium Techwear Coat' },
  { url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=600', tags: ['tshirt', 'tee', 'apparel', 'clothing'], label: 'Cotton Minimal Tee' },
  { url: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=600', tags: ['model', 'photoshoot', 'apparel'], label: 'Monochrome Model Posing' },
  { url: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?q=80&w=600', tags: ['hanger', 'clothes', 'clothing', 'closet'], label: 'Minimal Apparel Hangers' },
  { url: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=600', tags: ['fabrics', 'texture', 'merchandise'], label: 'Textured Fabric Waves' },
  { url: 'https://images.unsplash.com/photo-1508427953056-b00b8d78ebf5?q=80&w=600', tags: ['rail', 'boutique', 'hangers'], label: 'Industrial Apparel Rail' }
];

const BRANCHES: { id: ProjectBranch | 'all'; label: string; number: string; intro: string }[] = [
  { 
    id: 'all', 
    label: 'Todos los Proyectos', 
    number: '00',
    intro: 'El espectro completo de mi trabajo creativo y estratégico. Soluciones unificadas bajo un mismo sistema visual y tecnológico.'
  },
  { 
    id: 'web', 
    label: 'Diseño Web', 
    number: '01',
    intro: 'Diseño y desarrollo experiencias digitales para marcas, medios y proyectos culturales. Creo webs pensadas para comunicar mejor, ordenar contenidos, posicionar y convertir.'
  },
  { 
    id: 'branding', 
    label: 'Sistemas de Branding', 
    number: '02',
    intro: 'Construyo identidades visuales y de marca diseñadas para crear reconocimiento, coherencia y una presencia más sólida en el mercado.'
  },
  { 
    id: 'events', 
    label: 'Marketing de Eventos', 
    number: '03',
    intro: 'Lidero la comunicación, dirección visual y desarrollo de eventos con enfoque en cultura musical, comunidad, experiencia del público y presencia de marca.'
  },
  { 
    id: 'ai', 
    label: 'IA aplicada', 
    number: '04',
    intro: 'Implemento sistemas, automatizaciones y agentes de inteligencia artificial aplicados a marketing, contenidos artísticos, bookings, email, SEO, redes sociales, captación y gestión de proyectos.'
  },
  { 
    id: 'merch', 
    label: 'Merchandising', 
    number: '05',
    intro: 'Diseño producto físico, prendas exclusivas, lanyards, piezas promocionales y merchandising para marcas, eventos y proyectos musicales independientes.'
  },
];

interface InteractiveProjectCardProps {
  key?: React.Key;
  project: Project;
  index: number;
  isEditMode: boolean;
  bgMode?: 'dark' | 'light';
  handleOpenImageEditor: (project: Project) => void;
  onProjectSelect: (project: Project) => void;
}

function InteractiveProjectCard({
  project,
  index,
  isEditMode,
  bgMode = 'dark',
  handleOpenImageEditor,
  onProjectSelect,
}: InteractiveProjectCardProps) {
  const cardRef = React.useRef<HTMLDivElement>(null);
  
  // Motion values to drive hardware accelerated silky smooth 3D rot values
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Use springs to eliminate jitter and animate with inertia
  const rotateX = useSpring(x, { stiffness: 100, damping: 20 });
  const rotateY = useSpring(y, { stiffness: 100, damping: 20 });
  
  // Also create a sheen / spotlight motion value for card reflection
  const sheenX = useMotionValue(50);
  const sheenY = useMotionValue(50);
  const sheenOpacity = useSpring(0, { stiffness: 120, damping: 22 });

  // High-fidelity nested parallax translations for absolute spatial depth inside card container
  const imgX = useTransform(y, (latestY) => (latestY * -1.2));
  const imgY = useTransform(x, (latestX) => (latestX * 1.2));

  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    
    // Relative coordinate positions inside card
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    const width = rect.width;
    const height = rect.height;

    // Normalize to -0.5 to 0.5
    const normX = (mouseX / width) - 0.5;
    const normY = (mouseY / height) - 0.5;

    // Rotate up to 8 degrees (gentle tilt for premium aesthetic)
    x.set(normY * -16);
    y.set(normX * 16);

    // Update reflection sheen coordinate percentage
    sheenX.set((mouseX / width) * 100);
    sheenY.set((mouseY / height) * 100);
  };

  const handleMouseEnter = () => {
    sheenOpacity.set(0.12); // subtle blue reflection sheen opacity on enter
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    sheenOpacity.set(0);
    setIsHovered(false);
  };

  // Build the background glare reflection style
  const sheenStyle = useTransform(
    [sheenX, sheenY],
    ([sx, sy]) => `radial-gradient(circle 200px at ${sx}% ${sy}%, rgba(0, 107, 255, 0.28) 0%, transparent 80%)`
  );

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={() => {
        if (isEditMode) {
          handleOpenImageEditor(project);
        } else {
          onProjectSelect(project);
        }
      }}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
        perspective: 1000,
      }}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay: (index % 2) * 0.1, ease: [0.16, 1, 0.3, 1] }}
      className={`group relative backdrop-blur-md rounded-[24px] md:rounded-[32px] border overflow-hidden flex flex-col justify-between hover:shadow-2xl transition-all duration-400 select-none pb-4 cursor-pointer ${
        bgMode === 'dark' 
          ? 'bg-[#121214]/90 border-white/10 hover:border-[#0052FF]/40 text-white hover:shadow-[#0052FF]/10' 
          : 'bg-[#ffffff]/90 border-brand-border/80 hover:border-[#0052FF]/30 text-black'
      }`}
    >
      {/* Glare Reflection Holographic Overlay */}
      <motion.div 
        className="absolute inset-0 pointer-events-none z-20"
        style={{
          background: sheenStyle,
          opacity: sheenOpacity,
        }}
      />

      {/* Card Header information */}
      <div className="p-5 md:p-6 pb-2 space-y-3.5" style={{ transform: 'translateZ(12px)' }}>
        <div className="flex items-center justify-between font-sans text-[10px] tracking-wider font-extrabold uppercase text-neutral-400">
          <span className="text-[#0052FF] font-sans tracking-widest text-[9.5px]">
            // 0{index + 1}
          </span>
          <span className={bgMode === 'dark' ? 'text-neutral-400' : 'text-neutral-450'}>{project.type}</span>
        </div>

        {/* Project Title / Year row */}
        <div className={`flex items-baseline justify-between border-b pb-3 ${bgMode === 'dark' ? 'border-white/10' : 'border-brand-border/40'}`}>
          <h3 
            className={`text-xl sm:text-2xl font-display font-black tracking-wide transition-colors uppercase ${
              bgMode === 'dark' ? 'text-white hover:text-[#0052FF]' : 'text-black hover:text-[#0052FF]'
            }`}
          >
            {project.name}
          </h3>
          <span className={`font-sans text-xs font-extrabold ${bgMode === 'dark' ? 'text-neutral-500' : 'text-neutral-400'}`}>
            [{project.year}]
          </span>
        </div>

        <p className={`font-sans text-xs md:text-sm leading-relaxed font-semibold ${bgMode === 'dark' ? 'text-neutral-300' : 'text-neutral-700'}`}>
          {project.description}
        </p>
      </div>

      {/* Stylized Cover image frame */}
      <div className="px-5 md:px-6" style={{ transform: 'translateZ(24px)' }}>
        <div 
          className={`relative w-full ${
            project.branch === 'web' ? 'aspect-[16/10.5] sm:aspect-[16/9.5]' : 'aspect-[4/3]'
          } rounded-[16px] md:rounded-[20px] overflow-hidden border bg-neutral-150/90 group flex flex-col ${
            bgMode === 'dark' ? 'border-white/10' : 'border-brand-border'
          }`}
        >
          {project.branch === 'web' && (
            <div className="bg-[#1C1C1E] h-7 w-full flex items-center px-4 border-b border-[#2C2C2E] gap-2 select-none z-10 shrink-0">
              <div className="flex gap-1.5 items-center">
                <div className="w-2 rounded-full h-2 bg-red-500/80" />
                <div className="w-2 rounded-full h-2 bg-yellow-500/80" />
                <div className="w-2 rounded-full h-2 bg-green-500/80" />
              </div>
              <div className="mx-auto bg-neutral-800 text-[9px] text-neutral-400 font-sans px-4 py-0.5 rounded-md max-w-[200px] truncate text-center font-bold tracking-wide">
                {project.name}
              </div>
              <div className="w-8 shrink-0" /> {/* Spacer for symmetry */}
            </div>
          )}

          <div className="flex-grow w-full h-full overflow-hidden relative bg-neutral-900 flex items-center justify-center">
            <motion.img
              src={getSafeImageUrl(project.image_url || project.image)}
              alt={project.name}
              onError={(e) => {
                const branchPresets = PRESET_IMAGES[project.branch] || PRESET_IMAGES.web;
                const fallbackUrl = branchPresets[index % branchPresets.length]?.url || branchPresets[0]?.url;
                if (e.currentTarget.src !== fallbackUrl) {
                  e.currentTarget.src = fallbackUrl;
                }
              }}
              style={project.branch === 'web' ? {} : {
                x: imgX,
                y: imgY,
              }}
              className={`w-full h-full ${
                project.branch === 'web' 
                  ? 'object-cover object-top scale-100 group-hover:scale-105' 
                  : 'object-cover scale-112'
              } transition-all duration-700 ease-[0.16, 1, 0.3, 1] ${
                isEditMode
                  ? 'brightness-[0.7] contrast-105'
                  : 'group-hover:brightness-95'
              }`}
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Ambient vignette mask */}
          <div className="absolute inset-x-0 bottom-0 bg-neutral-950/80 px-4 py-2.5 text-[8.5px] font-sans tracking-wider text-white/90 border-t border-white/5 flex items-center justify-between uppercase z-10 font-bold">
            <span>{project.category}</span>
          </div>

          {isEditMode ? (
            /* High-tech overlay badge */
            <div className="absolute inset-0 bg-black/45 border-2 border-dashed border-[#0052FF] rounded-[16px] md:rounded-[20px] transition-all duration-300 flex flex-col items-center justify-center gap-1.5 z-10">
              <div className="p-2.5 bg-white text-black rounded-full shadow-lg transform scale-100 hover:scale-110 active:scale-95 transition-transform">
                <Camera className="w-4 h-4 text-[#0052FF]" />
              </div>
              <span className="font-sans text-[8.5px] text-white font-extrabold uppercase tracking-widest bg-black/85 px-3 py-1 rounded border border-white/10 shadow-sm">
                Cambiar Foto
              </span>
            </div>
          ) : (
            /* Premium action circle mask */
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <div className="bg-white text-black p-4 rounded-full shadow-lg transform scale-90 group-hover:scale-100 transition-transform duration-400 flex items-center justify-center">
                <ArrowUpRight className="w-5 h-5 text-black" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Lower action block */}
      <div className="px-5 md:px-6 pt-4 flex items-center justify-end font-sans" style={{ transform: 'translateZ(8px)' }}>
        <span
          className={`text-xs font-sans font-black uppercase tracking-widest group-hover:text-[#0052FF] border-b group-hover:border-[#0052FF] pb-0.5 transition-colors flex items-center gap-1.5 animate-pulse-slow font-extrabold ${
            bgMode === 'dark' ? 'text-neutral-250 border-white/20' : 'text-[#1a1a1a] border-black'
          }`}
        >
          {isEditMode ? 'Cambiar Foto' : 'Ver Caso'}
          <ArrowUpRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </motion.div>
  );
}

export default function PortfolioSection({ onProjectSelect, onNotification }: PortfolioSectionProps) {
  const { projects, loading, updateProject, refetch } = useProjects();
  const [activeBranch, setActiveBranch] = useState<ProjectBranch | 'all'>('all');
  const sectionRef = React.useRef<HTMLDivElement>(null);

  // Interactive customizer states for portfolio background
  const [portfolioBgMode, setPortfolioBgMode] = useState<'dark' | 'light'>('dark');
  const [portfolioBgUrl, setPortfolioBgUrl] = useState<string>('https://images.unsplash.com/photo-1590483736741-993f2b49b915?q=80&w=1600&auto=format&fit=crop');

  React.useEffect(() => {
    const savedMode = localStorage.getItem('bassse_portfolio_bg_mode') as 'dark' | 'light' | null;
    const savedBg = localStorage.getItem('bassse_portfolio_bg_url');
    if (savedMode) setPortfolioBgMode(savedMode);
    if (savedBg !== null) setPortfolioBgUrl(savedBg);

    const handleStorageChange = () => {
      const liveMode = localStorage.getItem('bassse_portfolio_bg_mode') as 'dark' | 'light' | null;
      const liveBg = localStorage.getItem('bassse_portfolio_bg_url');
      if (liveMode) setPortfolioBgMode(liveMode);
      if (liveBg !== null) setPortfolioBgUrl(liveBg);
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('bassse_bg_updated', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('bassse_bg_updated', handleStorageChange);
    };
  }, []);

  const handleSectionMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    sectionRef.current.style.setProperty('--mouse-x', `${x}px`);
    sectionRef.current.style.setProperty('--mouse-y', `${y}px`);
  };

  // Edit states
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => api.isAuthenticated());
  const [isEditMode, setIsEditMode] = useState<boolean>(() => api.isAuthenticated());

  useEffect(() => {
    const handleAuthUpdated = () => {
      const auth = api.isAuthenticated();
      setIsAuthenticated(auth);
      setIsEditMode(auth);
    };
    window.addEventListener('bassse_auth_updated', handleAuthUpdated);
    window.addEventListener('storage', handleAuthUpdated);
    return () => {
      window.removeEventListener('bassse_auth_updated', handleAuthUpdated);
      window.removeEventListener('storage', handleAuthUpdated);
    };
  }, []);

  const [isPasscodeModalOpen, setIsPasscodeModalOpen] = useState<boolean>(false);
  const [passcodeAttempt, setPasscodeAttempt] = useState<string>('');
  const [passcodeError, setPasscodeError] = useState<boolean>(false);

  // Focus image changer states
  const [editingProjectForImage, setEditingProjectForImage] = useState<Project | null>(null);
  const [customImageUrl, setCustomImageUrl] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSavingImage, setIsSavingImage] = useState<boolean>(false);
  const [isUploadingLocal, setIsUploadingLocal] = useState<boolean>(false);

  // Advanced Tab states for image gallery
  const [activeEditorTab, setActiveEditorTab] = useState<'cover' | 'gallery'>('cover');
  const [customGalleryUrl, setCustomGalleryUrl] = useState<string>('');
  const [isUploadingGallery, setIsUploadingGallery] = useState<boolean>(false);

  // Grouped text headers to give an elegant editorial divider before categories
  const BRANCH_TEXTS = {
    web: {
      title: "01 — Web",
      desc: "Diseño y desarrollo de experiencias digitales para marcas, medios y proyectos culturales. Creo webs pensadas para comunicar mejor, ordenar contenidos, posicionar y convertir."
    },
    branding: {
      title: "02 — Branding",
      desc: "Construyo identidades visuales y de marca diseñadas para crear reconocimiento, coherencia y una presencia más robusta en el mercado."
    },
    events: {
      title: "03 — Eventos",
      desc: "Lidero la comunicación, dirección visual y desarrollo de eventos con enfoque en cultura musical, comunidad, experiencia del público y presencia de marca."
    },
    ai: {
      title: "04 — IA aplicada",
      desc: "Implemento sistemas, automatizaciones y agentes de inteligencia artificial aplicados a marketing, contenidos artísticos, bookings, email, SEO, redes sociales, captación de posibles clientes y gestión de proyectos."
    },
    merch: {
      title: "05 — Merchandising",
      desc: "Diseño producto físico, prendas exclusivas, lanyards, piezas promocionales y merchandising para marcas, eventos y proyectos musicales independientes."
    }
  };

  const handleOpenImageEditor = (project: Project) => {
    setEditingProjectForImage(project);
    setCustomImageUrl(project.image_url || project.image || '');
    setSearchQuery('');
    setActiveEditorTab('cover');
    setCustomGalleryUrl('');
  };

  const handleAddGalleryImage = async (urlToAdd: string) => {
    if (!editingProjectForImage || !urlToAdd.trim()) return;
    
    // Deduplicate and compile current images array
    const currentImages = Array.isArray(editingProjectForImage.images)
      ? [...editingProjectForImage.images]
      : [editingProjectForImage.image_url || editingProjectForImage.image].filter(Boolean);
      
    if (currentImages.includes(urlToAdd)) {
      if (onNotification) onNotification("INFO: Esta imagen ya existe en la galería de este proyecto.");
      return;
    }
    
    const updatedImages = [...currentImages, urlToAdd];
    try {
      const updatedProj = await updateProject(editingProjectForImage.id, { images: updatedImages });
      // Sync local editing project state instantly so UX updates smoothly!
      setEditingProjectForImage(updatedProj);
      setCustomGalleryUrl('');
      if (onNotification) {
        onNotification(`SISTEMA BASSSE: Imagen añadida con éxito a la galería de "${editingProjectForImage.name}".`);
      }
      refetch();
    } catch (err: any) {
      if (onNotification) {
        onNotification(`ERROR: No se pudo añadir la foto a la galería: ${err.message}`);
      }
    }
  };

  const handleRemoveGalleryImage = async (urlToRemove: string) => {
    if (!editingProjectForImage) return;
    
    const currentImages = Array.isArray(editingProjectForImage.images)
      ? [...editingProjectForImage.images]
      : [editingProjectForImage.image_url || editingProjectForImage.image].filter(Boolean);
      
    const updatedImages = currentImages.filter(img => img !== urlToRemove);
    try {
      const updatePayload: Partial<Project> = { images: updatedImages };
      
      // If the image being deleted is the main image, handle cover replacement if elements are left
      if (editingProjectForImage.image_url === urlToRemove || editingProjectForImage.image === urlToRemove) {
        if (updatedImages.length > 0) {
          updatePayload.image_url = updatedImages[0];
          updatePayload.image = updatedImages[0];
          setCustomImageUrl(updatedImages[0]);
        }
      }
      
      const updatedProj = await updateProject(editingProjectForImage.id, updatePayload);
      setEditingProjectForImage(updatedProj);
      if (onNotification) {
        onNotification(`SISTEMA BASSSE: Imagen eliminada de la galería.`);
      }
      refetch();
    } catch (err: any) {
      if (onNotification) {
        onNotification(`ERROR: No se pudo eliminar la imagen: ${err.message}`);
      }
    }
  };

  const handleSetGalleryAsCover = async (urlToSet: string) => {
    if (!editingProjectForImage) return;
    try {
      const updatedProj = await updateProject(editingProjectForImage.id, {
        image_url: urlToSet,
        image: urlToSet
      });
      setEditingProjectForImage(updatedProj);
      setCustomImageUrl(urlToSet);
      if (onNotification) {
        onNotification(`SISTEMA BASSSE: Se ha establecido la imagen seleccionada como portada principal.`);
      }
      refetch();
    } catch (err: any) {
      if (onNotification) {
        onNotification(`ERROR: No se pudo definir la portada principal: ${err.message}`);
      }
    }
  };

  const handleGalleryLocalImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      if (onNotification) onNotification("ERROR: Selecciona un formato de imagen compatible (PNG, JPG, WEBP).");
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      if (onNotification) onNotification("ERROR: El archivo excede el tamaño máximo de 8MB.");
      return;
    }

    setIsUploadingGallery(true);
    if (onNotification) onNotification("SISTEMA BASSSE: Subiendo imagen de galería...");

    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result as string;
        try {
          const uploadedUrl = await api.uploadImage(file.name, base64String);
          await handleAddGalleryImage(uploadedUrl);
        } catch (uploadErr) {
          console.warn("Express static write failed, utilizing Base64 directly as inline assets:", uploadErr);
          await handleAddGalleryImage(base64String);
        } finally {
          setIsUploadingGallery(false);
          // reset input
          event.target.value = '';
        }
      };

      reader.onerror = () => {
        setIsUploadingGallery(false);
        if (onNotification) onNotification("ERROR: Fallo al leer de forma binaria el archivo local.");
      };

      reader.readAsDataURL(file);
    } catch (err: any) {
      setIsUploadingGallery(false);
      if (onNotification) onNotification(`ERROR: Fallo en el hilo de carga: ${err.message}`);
    }
  };

  const handleSaveImageChange = async () => {
    if (!editingProjectForImage || !customImageUrl) return;
    setIsSavingImage(true);
    try {
      await updateProject(editingProjectForImage.id, { image_url: customImageUrl });
      if (onNotification) {
        onNotification(`SISTEMA BASSSE: Foto de portada para "${editingProjectForImage.name}" actualizada.`);
      }
      setEditingProjectForImage(null);
      refetch();
    } catch (err: any) {
      if (onNotification) {
        onNotification(`ERROR: No se pudo guardar la fotografía: ${err.message}`);
      }
    } finally {
      setIsSavingImage(false);
    }
  };

  const handleLocalImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      if (onNotification) onNotification("ERROR: Selecciona un formato de imagen compatible (PNG, JPG, WEBP).");
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      if (onNotification) onNotification("ERROR: El archivo excede el tamaño máximo de 8MB.");
      return;
    }

    setIsUploadingLocal(true);
    if (onNotification) onNotification("SISTEMA BASSSE: Leyendo y comprimiendo imagen local...");

    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result as string;
        try {
          const uploadedUrl = await api.uploadImage(file.name, base64String);
          setCustomImageUrl(uploadedUrl);
          if (onNotification) {
            onNotification("SISTEMA BASSSE: Portada cargada desde tu ordenador con éxito.");
          }
        } catch (uploadErr) {
          console.warn("Express static write failed, utilizing Base64 directly as inline assets:", uploadErr);
          setCustomImageUrl(base64String);
          if (onNotification) {
            onNotification("SISTEMA BASSSE: Guardado temporal en búfer Base64 (falló persistencia física).");
          }
        } finally {
          setIsUploadingLocal(false);
        }
      };

      reader.onerror = () => {
        setIsUploadingLocal(false);
        if (onNotification) onNotification("ERROR: Fallo al leer de forma binaria el archivo local.");
      };

      reader.readAsDataURL(file);
    } catch (err: any) {
      setIsUploadingLocal(false);
      if (onNotification) onNotification(`ERROR: Fallo en el hilo de carga: ${err.message}`);
    }
  };

  const searchResults = searchQuery
    ? SEARCH_CATALOG.filter(item => 
        item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
        item.label.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  // Render individual portfolio cards
  const renderProjectCard = (project: Project, index: number) => {
    return (
      <InteractiveProjectCard
        key={project.id}
        project={project}
        index={index}
        isEditMode={isEditMode}
        bgMode={portfolioBgMode}
        handleOpenImageEditor={handleOpenImageEditor}
        onProjectSelect={onProjectSelect}
      />
    );
  };

  return (
    <section 
      ref={sectionRef}
      onMouseMove={handleSectionMouseMove}
      id="portfolio-section" 
      className={`relative w-full py-20 select-none font-sans overflow-hidden transition-colors duration-500 ${portfolioBgMode === 'dark' ? 'bg-[#050505]' : 'bg-brand-bg'}`}
    >
      {/* 1. HIGH-TECH NOVEL ANIMATED BACKDROP LAYER */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Interactive Spotlight Glow following cursor over the clear base */}
        <div 
          className="absolute inset-0 pointer-events-none z-0 opacity-80"
          style={{
            background: 'radial-gradient(550px circle at var(--mouse-x, 50%) var(--mouse-y, 25%), rgba(0, 107, 255, 0.055) 0%, transparent 80%)'
          }}
        />
        {/* Subtle grid system line overlay */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.14] text-[#0052FF]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="premium-portfolio-grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="currentColor" strokeWidth="0.5" />
              <circle cx="0" cy="0" r="1.5" fill="currentColor" opacity="0.3" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#premium-portfolio-grid)" />
        </svg>

        {/* Dynamic Electric Blue & Cyan Ambient Luminous Spheres (Flowing Blurs) */}
        <motion.div
          className="absolute top-[8%] right-[15%] w-[450px] h-[450px] rounded-full bg-[#0052FF]/6 blur-[120px]"
          animate={{
            x: [0, 60, -40, 0],
            y: [0, -50, 40, 0],
            scale: [1, 1.15, 0.9, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-[10%] left-[8%] w-[500px] h-[500px] rounded-full bg-[#00A3FF]/4 blur-[140px]"
          animate={{
            x: [0, -50, 60, 0],
            y: [0, 40, -60, 0],
            scale: [1, 0.9, 1.1, 1],
          }}
          transition={{
            duration: 28,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-[50%] right-[30%] w-[350px] h-[350px] rounded-full bg-[#0052FF]/4 blur-[110px]"
          animate={{
            x: [0, 30, -50, 0],
            y: [0, 60, -30, 0],
            scale: [0.95, 1.05, 0.9, 0.95],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Left Side: Orbiting Technical Circle Map Grid */}
        <div className="absolute top-[18%] left-[5%] w-[550px] h-[550px] opacity-[0.05] hidden lg:block">
          <motion.svg
            viewBox="0 0 100 100"
            className={`w-full h-full stroke-[0.3] ${portfolioBgMode === 'dark' ? 'text-white' : 'text-black'}`}
            animate={{ rotate: 360 }}
            transition={{ duration: 140, repeat: Infinity, ease: "linear" }}
          >
            <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeDasharray="1 3" />
            <circle cx="50" cy="50" r="35" fill="none" stroke="currentColor" strokeDasharray="3 3" />
            <circle cx="50" cy="50" r="25" fill="none" stroke="currentColor" strokeWidth="0.15" />
            <circle cx="50" cy="50" r="15" fill="none" stroke="currentColor" strokeDasharray="2 2" />
            <line x1="50" y1="0" x2="50" y2="100" stroke="currentColor" strokeDasharray="1 1" />
            <line x1="0" y1="50" x2="100" y2="50" stroke="currentColor" strokeDasharray="1 1" />
            {/* Cyberspace Nodes */}
            <circle cx="50" cy="5" r="1.2" fill="#0052FF" />
            <circle cx="15" cy="50" r="1" fill="#0052FF" opacity="0.8" />
            <circle cx="50" cy="75" r="1.5" fill="#0052FF" />
            <circle cx="85" cy="50" r="1.2" fill="#0052FF" />
          </motion.svg>
        </div>

        {/* Right Side: Holographic Geometrical Data Nodes Node graph */}
        <div className="absolute bottom-[12%] right-[4%] w-[500px] h-[500px] opacity-[0.04] hidden lg:block">
          <motion.svg
            viewBox="0 0 100 100"
            className={`w-full h-full stroke-[0.3] ${portfolioBgMode === 'dark' ? 'text-white' : 'text-black'}`}
            animate={{ rotate: -360 }}
            transition={{ duration: 180, repeat: Infinity, ease: "linear" }}
          >
            <polygon points="50,10 90,30 90,70 50,90 10,70 10,30" fill="none" stroke="currentColor" strokeDasharray="2 3" />
            <polygon points="50,22 80,38 80,62 50,78 20,62 20,38" fill="none" stroke="currentColor" strokeWidth="0.2" />
            <circle cx="50" cy="50" r="18" fill="none" stroke="currentColor" />
            <line x1="50" y1="10" x2="50" y2="90" stroke="currentColor" strokeDasharray="1 1" />
            <line x1="10" y1="30" x2="90" y2="70" stroke="currentColor" strokeDasharray="1 1" />
            <line x1="10" y1="70" x2="90" y2="30" stroke="currentColor" strokeDasharray="1 1" />
            {/* Intersection Dots */}
            <circle cx="50" cy="10" r="1.5" fill="#0052FF" />
            <circle cx="90" cy="30" r="1.5" fill="#0052FF" />
            <circle cx="90" cy="70" r="1.5" fill="#0052FF" />
            <circle cx="50" cy="90" r="1.5" fill="#0052FF" />
            <circle cx="10" cy="70" r="1.5" fill="#0052FF" />
            <circle cx="10" cy="30" r="1.5" fill="#0052FF" />
          </motion.svg>
        </div>

        {/* Continuous slow pan architectural photo accent layer in background */}
        {portfolioBgUrl && (
          <motion.img
            src={portfolioBgUrl}
            alt="Architectural Accent Graphics"
            className="w-full h-full object-cover opacity-[0.05] filter grayscale contrast-125 brightness-105"
            animate={{
              scale: [1, 1.05, 1],
              x: [0, -10, 10, 0],
              y: [0, 5, -5, 0]
            }}
            transition={{
              duration: 60,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            referrerPolicy="no-referrer"
          />
        )}

        {/* Gradient edge-fade masks */}
        <div className={`absolute inset-0 bg-gradient-to-b via-transparent opacity-95 ${portfolioBgMode === 'dark' ? 'from-[#050505] to-[#050505]' : 'from-[#F5F5F3] to-[#F5F5F3]'}`} />
      </div>

      <div className="relative z-10 w-[90%] mx-auto max-w-7xl">
        {/* Upper Header Box with Integrated 2D Gravity Physics Engine and Brand Logo Canvas */}
        <div className="relative w-full rounded-[32px] md:rounded-[40px] border border-neutral-800 bg-[#0A0A0B] shadow-[0_24px_60px_-15px_rgba(0,0,0,0.5)] overflow-hidden p-6 sm:p-10 md:p-12 mb-12 min-h-[500px] lg:min-h-[550px] flex flex-col justify-center">
          {/* Subtle blue accent glows inside the obsidian container */}
          <div className="absolute top-0 right-1/4 w-[300px] h-[300px] bg-[#0052FF]/10 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 left-1/4 w-[250px] h-[250px] bg-[#00A3FF]/5 rounded-full blur-[90px] pointer-events-none" />
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-20 w-full h-full">
            
            {/* Left Column: Strategic description text */}
            <div className="lg:col-span-5 flex flex-col justify-center select-none order-1 text-left">
              <h2 className="text-4xl sm:text-5xl lg:text-[58px] font-display font-black tracking-tight text-white uppercase mb-4 leading-[0.95] md:leading-none">
                PRODUCTO DE <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0052FF] via-[#00A3FF] to-white">PROFESIONALES</span>.
              </h2>
              
              <div className="w-16 h-[2px] bg-[#0052FF] mb-6" />
              
              <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed font-sans">
                Selección de sistemas de desarrollo y dirección creativa firmados por <span className="text-white font-extrabold tracking-wider uppercase">BASSSE</span>. Estructuras de marca premium, interfaces de alta gama y productos tangibles donde la estrategia comercial, la cultura musical y los algoritmos de inteligencia artificial aplicada convergen bajo un estándar estético de máximo rigor.
              </p>
            </div>

            {/* Right Column: Interactive branding box container */}
            <div className="lg:col-span-7 h-[320px] sm:h-[380px] lg:h-[460px] relative w-full rounded-2xl bg-[#09090A] border border-neutral-800 overflow-hidden order-2 pointer-events-auto shadow-[inset_0_4px_30px_rgba(0,0,0,0.8)]">
              <div className="w-full h-full relative">
                <ProjectsGravityBox />
              </div>
            </div>

          </div>
        </div>

        {/* Modern Filter selectors */}
        <div 
          id="branch-selector-container"
          className={`flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b pb-8 mb-12 ${
            portfolioBgMode === 'dark' ? 'border-white/10' : 'border-brand-border/60'
          }`}
        >
          <div className="flex flex-wrap gap-1.5">
            {BRANCHES.map((branch) => {
              const isActive = activeBranch === branch.id;
              return (
                <button
                  key={branch.id}
                  onClick={() => setActiveBranch(branch.id)}
                  className={`group flex items-center gap-2 px-5 py-3 rounded-full border text-[10px] md:text-xs font-sans uppercase tracking-widest transition-all duration-300 relative cursor-pointer ${
                    isActive
                      ? portfolioBgMode === 'dark'
                        ? 'border-white bg-white text-black shadow-md shadow-[#0052FF]/10'
                        : 'border-black bg-black text-white shadow-md'
                      : portfolioBgMode === 'dark'
                        ? 'border-white/10 bg-white/5 text-neutral-400 hover:border-white/20 hover:text-white hover:bg-white/10'
                        : 'border-brand-border bg-white text-neutral-600 hover:border-black hover:text-black hover:bg-[#FAF9F7]'
                  }`}
                >
                  <span className={`text-[9.5px] font-black ${isActive ? 'text-[#0052FF]' : 'text-neutral-400 group-hover:text-[#0052FF]'}`}>
                    {branch.number}
                  </span>
                  <span className="font-bold">{branch.label}</span>
                </button>
              );
            })}
          </div>

          {/* Admin Edit Controller on the right of filters */}
          <div className="flex items-center gap-3 self-end lg:self-auto">
            {isEditMode ? (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 bg-[#0052FF]/10 border border-[#0052FF]/30 px-3.5 py-1.5 rounded-full text-[#0052FF] font-sans text-[9.5px] font-black uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0052FF] animate-pulse" />
                  MODO EDICIÓN ACTIVADO
                </div>
                <button
                  onClick={() => {
                    api.clearToken();
                    setIsAuthenticated(false);
                    setIsEditMode(false);
                    window.dispatchEvent(new Event('bassse_auth_updated'));
                    if (onNotification) onNotification("SISTEMA BASSSE: Consola de edición cerrada.");
                  }}
                  className="font-sans text-[9px] text-[#0052FF] hover:text-red-500 font-extrabold uppercase tracking-wider underline cursor-pointer hover:no-underline transition-all"
                >
                  [Salir]
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsPasscodeModalOpen(true)}
                className={`flex items-center gap-1.5 px-4 py-2.5 rounded-full border text-[10px] font-sans uppercase tracking-widest font-black transition-all duration-300 cursor-pointer ${
                  portfolioBgMode === 'dark'
                    ? 'border-[#0052FF]/30 bg-[#0052FF]/5 text-[#0052FF] hover:border-[#0052FF]/70 hover:bg-[#0052FF]/10'
                    : 'border-brand-border bg-white text-[#0052FF] hover:border-[#0052FF]/30 hover:bg-[#0052FF]/5 hover:shadow-sm'
                }`}
              >
                <Lock className="w-3.5 h-3.5" />
                <span>MODO EDICIÓN</span>
              </button>
            )}
          </div>
        </div>

        {/* Main Project Output Frame depending on filter selection */}
        <div className="space-y-20 min-h-[400px]">
          
          {/* -- SECTION 01: WEB DEVELOPMENT -- */}
          {(activeBranch === 'all' || activeBranch === 'web') && (
            <div className="space-y-8">
              <div className={`border-b pb-5 ${portfolioBgMode === 'dark' ? 'border-white/10' : 'border-brand-border/50'}`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <h3 className={`text-2xl sm:text-3xl font-display font-black uppercase tracking-wide flex items-baseline gap-1.5 pt-1 ${portfolioBgMode === 'dark' ? 'text-white' : 'text-black'}`}>
                      {BRANCH_TEXTS.web.title}
                    </h3>
                  </div>
                </div>
                <p className={`text-xs md:text-sm font-semibold max-w-3xl mt-2 leading-relaxed ${portfolioBgMode === 'dark' ? 'text-neutral-400' : 'text-neutral-600'}`}>
                  {BRANCH_TEXTS.web.desc}
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {loading ? (
                  <div className="col-span-2 py-8 text-center text-xs font-sans text-neutral-400 font-bold">
                    CARGANDO PROYECTOS DESDE BASE DE DATOS...
                  </div>
                ) : (
                  projects.filter(p => p.branch === 'web').map((project, idx) => renderProjectCard(project, idx))
                )}
              </div>
            </div>
          )}

          {/* -- SECTION 02: BRANDING IDENTITY -- */}
          {(activeBranch === 'all' || activeBranch === 'branding') && (
            <div className="space-y-8">
              <div className={`border-b pb-5 ${portfolioBgMode === 'dark' ? 'border-white/10' : 'border-brand-border/50'}`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <h3 className={`text-2xl sm:text-3xl font-display font-black uppercase tracking-wide flex items-baseline gap-1.5 pt-1 ${portfolioBgMode === 'dark' ? 'text-white' : 'text-black'}`}>
                      {BRANCH_TEXTS.branding.title}
                    </h3>
                  </div>
                </div>
                <p className={`text-xs md:text-sm font-semibold max-w-3xl mt-2 leading-relaxed ${portfolioBgMode === 'dark' ? 'text-neutral-400' : 'text-neutral-600'}`}>
                  {BRANCH_TEXTS.branding.desc}
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {loading ? (
                  <div className="col-span-full py-8 text-center text-xs font-sans text-neutral-400 font-bold">
                    CRIBERA DE BRANDING EN PROCESO...
                  </div>
                ) : (
                  projects.filter(p => p.branch === 'branding').map((project, idx) => renderProjectCard(project, idx))
                )}
              </div>
            </div>
          )}

          {/* -- SECTION 03: EVENT PROMOTIONS -- */}
          {(activeBranch === 'all' || activeBranch === 'events') && (
            <div className="space-y-8">
              <div className={`border-b pb-5 ${portfolioBgMode === 'dark' ? 'border-white/10' : 'border-brand-border/50'}`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <h3 className={`text-2xl sm:text-3xl font-display font-black uppercase tracking-wide flex items-baseline gap-1.5 pt-1 ${portfolioBgMode === 'dark' ? 'text-white' : 'text-black'}`}>
                      {BRANCH_TEXTS.events.title}
                    </h3>
                  </div>
                </div>
                <p className={`text-xs md:text-sm font-semibold max-w-3xl mt-2 leading-relaxed ${portfolioBgMode === 'dark' ? 'text-neutral-400' : 'text-neutral-600'}`}>
                  {BRANCH_TEXTS.events.desc}
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {loading ? (
                  <div className="col-span-full py-8 text-center text-xs font-sans text-neutral-400 font-bold">
                    ESCANER DE CAMPAÑAS EMITIENDO...
                  </div>
                ) : (
                  projects.filter(p => p.branch === 'events').map((project, idx) => renderProjectCard(project, idx))
                )}
              </div>
            </div>
          )}

          {/* -- SECTION 04: ARTIFICIAL INTELLIGENCE SYSTEMS (Highly Structured Dashboard) -- */}
          {(activeBranch === 'all' || activeBranch === 'ai') && (
            <div className="space-y-8 bg-[#0D0D0D] text-[#F2F2F0] rounded-[32px] p-6 md:p-10 border border-white/[0.08] relative overflow-hidden">
              {/* Discrete moving texture background for AI dark block */}
              <div className="absolute inset-0 z-0">
                <motion.img 
                  src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1200&auto=format&fit=crop"
                  className="w-full h-full object-cover opacity-10 filter grayscale brightness-50"
                  animate={{
                    scale: [1, 1.05, 1],
                  }}
                  transition={{
                    duration: 30,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="relative z-10 space-y-8">
                <div className="border-b border-neutral-800 pb-6">
                  <div className="space-y-1">
                    <h3 className="text-2xl sm:text-3xl font-display font-black uppercase tracking-wide text-white pt-1">
                      {BRANCH_TEXTS.ai.title}
                    </h3>
                  </div>
                </div>
                <p className="text-xs md:text-sm text-neutral-400 font-semibold max-w-3xl mt-1 leading-relaxed">
                  {BRANCH_TEXTS.ai.desc}
                </p>



                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {AI_CAPABILITIES.map((cap, idx) => (
                    <div
                      key={idx}
                      className="bg-[#141414]/90 backdrop-blur-md border border-white/[0.06] rounded-2xl p-5 hover:border-[#0052FF] hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
                    >
                      <div className="space-y-4">
                        <div className="flex items-start justify-end">
                          <span className="font-sans text-[8px] px-2 py-0.5 bg-white/[0.05] text-[#0052FF] border border-white/[0.08] rounded font-black tracking-wider uppercase">
                            {cap.key}
                          </span>
                        </div>

                        <div className="space-y-2">
                          <h4 className="font-display font-extrabold text-base text-white uppercase tracking-wide">
                            {cap.title}
                          </h4>
                          <p className="font-sans text-xs text-neutral-400 leading-relaxed font-semibold">
                            {cap.description}
                          </p>
                        </div>
                      </div>

                      <div className="mt-6 pt-4 border-t border-white/[0.06] space-y-2 font-sans">
                        <div className="flex items-center gap-1.5 text-[9px] text-neutral-500 uppercase tracking-wide font-black">
                          Integración:
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {cap.tags.map((tag) => (
                            <span key={tag} className="px-2 py-0.5 bg-white/[0.03] text-neutral-300 text-[9px] uppercase tracking-wide rounded border border-white/[0.05] font-bold">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* -- SECTION 05: MERCHANDISING DROPS -- */}
          {(activeBranch === 'all' || activeBranch === 'merch') && (
            <div className="space-y-8">
              <div className={`border-b pb-5 ${portfolioBgMode === 'dark' ? 'border-white/10' : 'border-brand-border/50'}`}>
                <div className="space-y-1">
                  <h3 className={`text-2xl sm:text-3xl font-display font-black uppercase tracking-wide flex items-baseline gap-1.5 pt-1 ${portfolioBgMode === 'dark' ? 'text-white' : 'text-black'}`}>
                    {BRANCH_TEXTS.merch.title}
                  </h3>
                </div>
                <p className={`text-xs md:text-sm font-semibold max-w-3xl mt-2 leading-relaxed ${portfolioBgMode === 'dark' ? 'text-neutral-400' : 'text-neutral-600'}`}>
                  {BRANCH_TEXTS.merch.desc}
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {loading ? (
                  <div className="col-span-2 py-8 text-center text-xs font-sans text-neutral-400 font-bold">
                    CONECTANDO CON INGREDIENTES...
                  </div>
                ) : (
                  projects.filter(p => p.branch === 'merch').map((project, idx) => renderProjectCard(project, idx))
                )}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* 2. SECURITY AUTHENTICATION PASSWORD GATE POP-UP */}
      {isPasscodeModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop mask element with premium heavy blur */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setIsPasscodeModalOpen(false)}
            className="absolute inset-0 bg-neutral-950/85 backdrop-blur-md"
          />

          {/* Dialog Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative w-full max-w-md bg-white border border-brand-border rounded-[24px] overflow-hidden p-6 sm:p-8 shadow-2xl space-y-6 z-10 animate-fade-in"
          >
            {/* Header branding */}
            <div className="space-y-2 text-center pb-2 border-b border-brand-border/40">
              <span className="inline-flex p-2 bg-[#0052FF]/6 rounded-full border border-[#0052FF]/10 text-[#0052FF] mb-2 font-black">
                <Lock className="w-5 h-5" />
              </span>
              <h4 className="font-display font-black text-lg text-black uppercase tracking-wide">
                ACCESO AUTORIZADO BASSSE
              </h4>
              <p className="font-sans text-[11px] text-neutral-450 tracking-wider font-extrabold uppercase">
                // SYSTEM CORE AUTHORIZATION REQ_BASSSE2026
              </p>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              if (passcodeAttempt === 'BASSSE2026') {
                api.setToken('bassse-secret-key-2026');
                setIsAuthenticated(true);
                setIsEditMode(true);
                setIsPasscodeModalOpen(false);
                setPasscodeAttempt('');
                setPasscodeError(false);
                window.dispatchEvent(new Event('bassse_auth_updated'));
                if (onNotification) onNotification("ACCESO CONCEDIDO: Consola de edición activada con éxito.");
              } else {
                setPasscodeError(true);
                if (onNotification) onNotification("ERROR: Contraseña denegada por el servidor.");
              }
            }} className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-baseline">
                  <label className="font-sans text-[9px] text-[#0052FF] font-black uppercase tracking-widest block">
                    CONTRASEÑA DE DISEÑO:
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setPasscodeAttempt('BASSSE2026');
                      setPasscodeError(false);
                      if (onNotification) onNotification("INFO: Credencial de demo rellenada. Pulsa Verificar.");
                    }}
                    className="font-sans text-[8px] text-neutral-450 hover:text-[#0052FF] font-black uppercase tracking-wider underline cursor-pointer"
                  >
                    Bypass Demo [BASSSE2026]
                  </button>
                </div>
                <input
                  type="password"
                  value={passcodeAttempt}
                  onChange={(e) => {
                    setPasscodeAttempt(e.target.value);
                    setPasscodeError(false);
                  }}
                  placeholder="Introduce la contraseña corporativa..."
                  className="w-full px-4 py-3 bg-neutral-100 text-[#1a1a1a] border border-brand-border hover:border-black focus:border-[#0052FF] outline-none rounded-xl font-sans text-xs transition-all font-bold"
                  autoFocus
                />
                {passcodeError && (
                  <p className="font-sans text-[9px] text-red-600 font-extrabold uppercase tracking-wide px-1">
                    [ CONFLICT: CREDENCIALES INCORRECTAS ]
                  </p>
                )}
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsPasscodeModalOpen(false);
                    setPasscodeAttempt('');
                    setPasscodeError(false);
                  }}
                  className="flex-1 font-sans text-[10px] text-neutral-500 hover:text-black font-extrabold uppercase py-3 border border-brand-border bg-white rounded-xl transition-all hover:bg-neutral-50 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 font-sans text-[10px] text-white bg-[#0052FF] hover:bg-brand-blue font-extrabold uppercase py-3 rounded-xl transition-all hover:shadow-md cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Unlock className="w-3 h-3" />
                  Verificar
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* 3. BASSSE IMAGING CONSOLE: RE-ARRANGE PHOTO TOOLBAR */}
      {editingProjectForImage && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto">
          {/* Backdrop mask with high-end premium blur */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setEditingProjectForImage(null)}
            className="absolute inset-0 bg-neutral-950/85 backdrop-blur-md"
          />

          {/* Main Visual Changer Console Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative w-full max-w-4xl bg-white border border-brand-border rounded-[28px] overflow-hidden shadow-2xl flex flex-col md:flex-row z-10 max-h-[90vh]"
          >
            {/* Left Frame: Image focus display & live preview info */}
            <div className="w-full md:w-[45%] bg-[#0A0A0A] p-6 lg:p-8 text-white flex flex-col justify-between border-b md:border-b-0 md:border-r border-brand-border/10">
              <div className="space-y-4">
                <div className="font-sans text-[9px] text-[#006BFF] uppercase tracking-[0.25em] font-black flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0052FF] animate-ping" />
                  BASSSE PORTADA EDITOR // CONSOLE
                </div>
                <div className="space-y-1">
                  <h4 className="font-display font-black text-xl uppercase tracking-wider leading-none text-white">
                    {editingProjectForImage.name}
                  </h4>
                  <p className="font-sans text-[11px] text-neutral-400 font-bold uppercase tracking-wider">
                    Categoría: {editingProjectForImage.category}
                  </p>
                </div>
              </div>

              {/* Dynamic preview block */}
              <div className="my-6 space-y-3">
                <span className="font-sans text-[8px] text-neutral-500 font-bold uppercase tracking-widest block">
                  VISTA PREVIA DE PORTADA:
                </span>
                <div className={`${
                  editingProjectForImage.branch === 'web' ? 'aspect-[16/10] sm:aspect-[16/9]' : 'aspect-[4/3]'
                } w-full rounded-2xl overflow-hidden border border-white/5 bg-neutral-900 shadow-inner relative flex items-center justify-center`}>
                  {customImageUrl ? (
                    <img 
                      src={customImageUrl} 
                      alt="Live custom preview" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-neutral-600 gap-2 p-4 text-center">
                      <ImageIcon className="w-8 h-8 text-[#0052FF]" />
                      <span className="font-sans text-[9px] uppercase tracking-wider">Esperando enlace de imagen válido...</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Console logs */}
              <div className="border-t border-white/5 pt-4 font-sans text-[8px] text-neutral-500 tracking-wider space-y-1">
                <div>[ SRC CLOBSED: {editingProjectForImage.id} ]</div>
                <div className="text-[#00A3FF]">[ STATUS: ESPERANDO CONTROL DE CAMBIO ]</div>
              </div>
            </div>

            {/* Right Frame: Presets grid, search catalog & raw url address input */}
            <div className="w-full md:w-[55%] p-6 lg:p-8 flex flex-col justify-between overflow-y-auto max-h-[75vh] md:max-h-[90vh]">
              
              <div className="space-y-6">
                {/* Advanced Mode Tab Selector Panel */}
                <div className="flex border-b border-brand-border/40 pb-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setActiveEditorTab('cover')}
                    className={`pb-2.5 font-sans text-[9.5px] font-extrabold uppercase tracking-widest relative cursor-pointer pt-1 ${
                      activeEditorTab === 'cover' ? 'text-[#0052FF]' : 'text-neutral-450 hover:text-neutral-900'
                    }`}
                  >
                    Imagen de Portada
                    {activeEditorTab === 'cover' && (
                      <motion.div layoutId="activeEditorTabLine" className="absolute bottom-0 inset-x-0 h-0.5 bg-[#0052FF]" />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveEditorTab('gallery')}
                    className={`pb-2.5 font-sans text-[9.5px] font-extrabold uppercase tracking-widest relative cursor-pointer pt-1 ${
                      activeEditorTab === 'gallery' ? 'text-[#0052FF]' : 'text-neutral-450 hover:text-neutral-900'
                    }`}
                  >
                    Añadir una foto
                    {activeEditorTab === 'gallery' && (
                      <motion.div layoutId="activeEditorTabLine" className="absolute bottom-0 inset-x-0 h-0.5 bg-[#0052FF]" />
                    )}
                  </button>
                </div>

                {activeEditorTab === 'cover' ? (
                  <>
                    {/* 1. Raw URL Entry field */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="font-sans text-[9px] text-[#0052FF] font-black uppercase tracking-widest">
                          PEGAR DIRECCIÓN DE PORTADA (URL):
                        </label>
                        <span className="text-[10px] text-neutral-450 font-bold font-sans">Soporta Unsplash, Imgur, etc.</span>
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={customImageUrl}
                          onChange={(e) => setCustomImageUrl(e.target.value)}
                          placeholder="https://images.unsplash.com/photo-..."
                          className="flex-grow px-3.5 py-2.5 bg-neutral-100 text-[#1a1a1a] border border-brand-border hover:border-black focus:border-[#0052FF] outline-none rounded-xl font-sans text-xs font-semibold"
                        />
                        {customImageUrl && (
                          <button 
                            onClick={() => setCustomImageUrl('')}
                            className="px-2.5 bg-neutral-100 text-neutral-500 hover:text-black rounded-xl border border-brand-border select-none"
                            type="button"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Local Computer File Upload Block */}
                    <div id="local-upload-zone" className="space-y-2">
                      <span className="font-sans text-[9px] text-[#0052FF] font-black uppercase tracking-widest block">
                        SUBIR FOTO DESDE TU ORDENADOR:
                      </span>
                      <div className="relative group/zone">
                        <label className={`flex flex-col items-center justify-center w-full min-h-[96px] border-2 border-dashed rounded-[16px] transition-all cursor-pointer ${
                          isUploadingLocal 
                            ? 'border-[#0052FF]/60 bg-[#0052FF]/5 cursor-wait' 
                            : 'border-brand-border hover:border-[#0052FF] hover:bg-neutral-50 bg-white'
                        }`}>
                          <input 
                            type="file" 
                            accept="image/*" 
                            onChange={handleLocalImageUpload} 
                            disabled={isUploadingLocal}
                            className="hidden" 
                          />
                          <div className="flex flex-col items-center justify-center p-4 text-center space-y-1">
                            {isUploadingLocal ? (
                              <>
                                <div className="w-5 h-5 rounded-full border-2 border-t-[#0052FF] border-brand-border animate-spin mb-1" />
                                <span className="font-sans text-[9.5px] font-bold text-[#006BFF] uppercase tracking-widest animate-pulse">
                                  SUBIENDO ARCHIVO...
                                </span>
                              </>
                            ) : (
                              <>
                                <Upload className="w-5 h-5 text-neutral-450 group-hover/zone:text-[#0052FF] group-hover/zone:scale-110 transition-all duration-300" />
                                <p className="font-sans text-[11px] font-black uppercase tracking-wider text-neutral-800 pt-1">
                                  Haz clic para seleccionar o arrastra la foto aquí
                                </p>
                                <p className="font-sans text-[8px] text-neutral-450 tracking-widest font-extrabold">
                                  {editingProjectForImage.branch === 'web' 
                                    ? 'MOCKUP DE PANTALLA RECOMENDADO 16:9 / 16:10 · MÁXIMO 8MB' 
                                    : 'SOPORTA CORTE RECOMENDADO 4:3 · MÁXIMO 8MB'}
                                </p>
                              </>
                            )}
                          </div>
                        </label>
                      </div>
                    </div>

                    {/* 2. Visual presets matching project branch */}
                    {PRESET_IMAGES[editingProjectForImage.branch] && (
                      <div className="space-y-2.5">
                        <label className="font-sans text-[9px] text-[#0052FF] font-black uppercase tracking-widest block">
                          SELECCIONAR DE GALERÍA CURADA ({editingProjectForImage.branchLabel}):
                        </label>
                        
                        <div className="grid grid-cols-3 gap-2 col-span-full">
                          {PRESET_IMAGES[editingProjectForImage.branch].map((preset, idx) => {
                            const isSelected = customImageUrl === preset.url;
                            return (
                              <div
                                key={idx}
                                onClick={() => setCustomImageUrl(preset.url)}
                                className={`group ${
                                  editingProjectForImage.branch === 'web' ? 'aspect-[16/10] sm:aspect-[16/9]' : 'aspect-[4/3]'
                                } rounded-lg overflow-hidden border relative cursor-pointer hover:border-black transition-all ${
                                  isSelected ? 'border-[#0052FF] ring-2 ring-[#0052FF]' : 'border-brand-border'
                                }`}
                              >
                                <img
                                  src={preset.url}
                                  alt={preset.label}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                  referrerPolicy="no-referrer"
                                />
                                {isSelected && (
                                  <div className="absolute inset-0 bg-[#0052FF]/20 flex items-center justify-center">
                                    <span className="p-1 bg-white text-[#0052FF] rounded-full shadow-md">
                                      <Check className="w-3 h-3 font-semibold" />
                                    </span>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* 3. Global Catalogue Search */}
                    <div className="space-y-2.5 pt-1">
                      <label className="font-sans text-[9px] text-[#0052FF] font-black uppercase tracking-widest block">
                        BUSCAR EN NUESTRO BANCO EDITORIAL DE UNSPLASH:
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Escribe clave: 'techno', 'rave', 'setup', 'analog', 'branding'..."
                          className="w-full pl-9 pr-4 py-2 bg-neutral-150 text-[#191919] border border-brand-border focus:border-[#0052FF] hover:border-black outline-none rounded-xl font-sans text-xs font-semibold"
                        />
                        <Search className="w-3.5 h-3.5 text-neutral-450 absolute left-3 top-3 block" />
                      </div>

                      {searchQuery && (
                        <div className="grid grid-cols-4 gap-1.5 max-h-[140px] overflow-y-auto p-1 bg-neutral-50 rounded-xl border border-brand-border mt-1">
                          {searchResults.length > 0 ? (
                            searchResults.map((item, idx) => (
                              <div
                                key={idx}
                                onClick={() => setCustomImageUrl(item.url)}
                                className={`group ${
                                  editingProjectForImage.branch === 'web' ? 'aspect-[16/10] sm:aspect-[16/9]' : 'aspect-[4/3]'
                                } rounded overflow-hidden border relative cursor-pointer ${
                                  customImageUrl === item.url ? 'border-[#0052FF] ring-1 ring-[#0052FF]' : 'border-neutral-250'
                                }`}
                              >
                                <img
                                  src={item.url}
                                  alt={item.label}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                  referrerPolicy="no-referrer"
                                />
                              </div>
                            ))
                          ) : (
                            <div className="col-span-full py-4 text-center font-sans text-[9px] text-[#999] uppercase">
                              No se encontraron resultados
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  /* TAB GALLERY: AÑADIR UNA FOTO DE MANERA DINÁMICA (UP TO 3 OR MORE CAROUSEL IMAGES) */
                  <div className="space-y-6">
                    <div>
                      <span className="font-sans text-[9px] text-[#0052FF] font-black uppercase tracking-widest block mb-2.5">
                        FOTOS ASOCIADAS A ESTE CASO ({
                          (Array.isArray(editingProjectForImage.images) ? editingProjectForImage.images.length : 1)
                        }):
                      </span>

                      {/* Visual grid list of extra photographs */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {(Array.isArray(editingProjectForImage.images) && editingProjectForImage.images.length > 0
                          ? editingProjectForImage.images.filter(Boolean)
                          : [editingProjectForImage.image_url || editingProjectForImage.image].filter(Boolean)
                        ).map((imgUrl, idx) => {
                          const isMainCover = imgUrl === editingProjectForImage.image_url;
                          return (
                            <div key={idx} className="bg-neutral-100 rounded-xl overflow-hidden border border-brand-border flex flex-col justify-between group/gallery-item relative">
                              <div className="aspect-video w-full bg-neutral-900 border-b border-brand-border relative overflow-hidden">
                                <img src={imgUrl} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                {isMainCover && (
                                  <div className="absolute top-1.5 right-1.5 bg-[#0052FF] text-white font-sans text-[7px] font-black tracking-widest px-1.5 py-0.5 rounded uppercase">
                                    PORTADA
                                  </div>
                                )}
                              </div>
                              <div className="p-2 space-y-1.5 text-center flex flex-col justify-end">
                                {!isMainCover && (
                                  <button
                                    type="button"
                                    onClick={() => handleSetGalleryAsCover(imgUrl)}
                                    className="w-full text-[8.5px] font-sans font-black uppercase tracking-wider text-[#0052FF] hover:text-blue-700 block text-left truncate transition-colors"
                                  >
                                    // Poner Portada
                                  </button>
                                )}
                                <button
                                  type="button"
                                  onClick={() => handleRemoveGalleryImage(imgUrl)}
                                  className="w-full text-[8.5px] font-sans font-black uppercase tracking-wider text-red-600 hover:text-red-800 flex items-center gap-1 transition-colors"
                                >
                                  <X className="w-2.5 h-2.5 inline" /> Eliminar foto
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Adding interface: Url and local upload strictly implemented for gallery */}
                    <div className="border-t border-brand-border/40 pt-5 space-y-4">
                      <div className="space-y-2">
                        <label className="font-sans text-[9px] text-[#0052FF] font-black uppercase tracking-widest block">
                          AÑADIR UNA NUEVA FOTO DE PORTAFOLIO:
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={customGalleryUrl}
                            onChange={(e) => setCustomGalleryUrl(e.target.value)}
                            placeholder="Pegar dirección URL (ej: https://images.unsplash.com/...)"
                            className="flex-grow px-3.5 py-2.5 bg-neutral-100 text-[#1a1a1a] border border-brand-border hover:border-black focus:border-[#0052FF] outline-none rounded-xl font-sans text-xs font-semibold"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              if (customGalleryUrl.trim()) {
                                handleAddGalleryImage(customGalleryUrl);
                              }
                            }}
                            className="px-4 bg-[#0052FF] hover:bg-brand-blue text-white rounded-xl font-sans text-[10px] uppercase font-black tracking-widest cursor-pointer select-none whitespace-nowrap active:scale-95 transition-transform"
                          >
                            AÑADIR URL
                          </button>
                        </div>
                      </div>

                      {/* File upload connector */}
                      <div className="space-y-2">
                        <span className="font-sans text-[8px] text-neutral-500 font-extrabold uppercase tracking-widest block">
                          O TAMBIÉN SUBE DESDE LA MEMORIA DE TU ORDENADOR:
                        </span>
                        <div className="relative group/gallery-zone">
                          <label className={`flex flex-col items-center justify-center w-full min-h-[82px] border-2 border-dashed rounded-[16px] transition-all cursor-pointer ${
                            isUploadingGallery 
                              ? 'border-[#0052FF]/60 bg-[#0052FF]/5 cursor-wait' 
                              : 'border-brand-border hover:border-[#0052FF] hover:bg-neutral-50 bg-white'
                          }`}>
                            <input 
                              type="file" 
                              accept="image/*" 
                              onChange={handleGalleryLocalImageUpload} 
                              disabled={isUploadingGallery}
                              className="hidden" 
                            />
                            <div className="flex flex-col items-center justify-center p-3 text-center space-y-1">
                              {isUploadingGallery ? (
                                <>
                                  <div className="w-4 h-4 rounded-full border-2 border-t-[#0052FF] border-brand-border animate-spin mb-1" />
                                  <span className="font-sans text-[8.5px] font-bold text-[#006BFF] uppercase tracking-widest animate-pulse">
                                    Subiendo imagen adicional...
                                  </span>
                                </>
                              ) : (
                                <>
                                  <Upload className="w-4 h-4 text-neutral-450 group-hover/gallery-zone:text-[#0052FF] transition-all" />
                                  <p className="font-sans text-[10px] font-black uppercase tracking-wider text-neutral-800 pt-1">
                                    Haz clic para examinar o arrastra otra foto
                                  </p>
                                  <p className="font-sans text-[8px] text-neutral-450 tracking-wider">
                                    Formatos compatibles PNG, JPG, WEBP. Máximo 8MB.
                                  </p>
                                </>
                              )}
                            </div>
                          </label>
                        </div>
                      </div>

                      {/* Quick click presets to enrich portfolio assets */}
                      {PRESET_IMAGES[editingProjectForImage.branch] && (
                        <div className="space-y-2 pt-2">
                          <span className="font-sans text-[9px] text-[#0052FF] font-black uppercase tracking-widest block">
                            AÑADIR FOTO RÁPIDA DE GALERÍA CURADA:
                          </span>
                          <div className="grid grid-cols-4 gap-2">
                            {PRESET_IMAGES[editingProjectForImage.branch].map((preset, idx) => (
                              <div
                                key={idx}
                                onClick={() => handleAddGalleryImage(preset.url)}
                                className="group aspect-video rounded-lg overflow-hidden border border-brand-border relative cursor-pointer hover:border-[#0052FF] hover:ring-1 hover:ring-[#0052FF] transition-all"
                                title={`Hacer clic para añadir "${preset.label}" a la galería`}
                              >
                                <img src={preset.url} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform" referrerPolicy="no-referrer" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all bg-neutral-950/20">
                                  <Plus className="w-3.5 h-3.5 text-white bg-[#0052FF] rounded-full p-0.5" />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* CTAs */}
              <div className="flex gap-2.5 pt-6 border-t border-brand-border/60 mt-6 font-sans">
                <button
                  type="button"
                  onClick={() => setEditingProjectForImage(null)}
                  className="flex-1 font-sans text-[10px] text-neutral-600 hover:text-black font-extrabold uppercase py-3 border border-brand-border bg-white rounded-xl transition-all cursor-pointer"
                >
                  Cancelar
                </button>
                {activeEditorTab === 'cover' ? (
                  <button
                    type="button"
                    disabled={isSavingImage}
                    onClick={handleSaveImageChange}
                    className="flex-1 font-sans text-[10px] text-white bg-[#0052FF] hover:bg-brand-blue disabled:bg-neutral-300 font-extrabold uppercase py-3 rounded-xl transition-all hover:shadow-md cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    {isSavingImage ? 'GUARDANDO...' : 'GUARDAR PORTADA'}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setEditingProjectForImage(null)}
                    className="flex-1 font-sans text-[10px] text-white bg-[#101010] hover:bg-black font-extrabold uppercase py-3 rounded-xl transition-all hover:shadow-md cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Check className="w-3.5 h-3.5 text-[#0052FF]" />
                    FINALIZAR GALERÍA
                  </button>
                )}
              </div>

            </div>
          </motion.div>
        </div>
      )}

    </section>
  );
}
