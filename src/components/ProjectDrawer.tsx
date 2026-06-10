import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Project } from '../types';
import { X, ExternalLink, Calendar, Tag, ShieldCheck, TrendingUp, Landmark, ChevronLeft, ChevronRight } from 'lucide-react';
import { TechnoExperienceMockup, DskonnectMockup } from './ProjectMockups';

interface ProjectDrawerProps {
  project: Project | null;
  onClose: () => void;
}

export default function ProjectDrawer({ project, onClose }: ProjectDrawerProps) {
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (project) {
      document.body.style.overflow = 'hidden';
      setActiveImageIndex(0);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [project]);

  // Safely gather deduplicated images
  const imagesList = project
    ? Array.isArray(project.images) && project.images.length > 0
      ? project.images.filter((img): img is string => typeof img === 'string' && img.trim() !== '')
      : [project.image_url || project.image].filter(Boolean)
    : [];

  const handlePrevImage = () => {
    if (imagesList.length === 0) return;
    setActiveImageIndex((prev) => (prev === 0 ? imagesList.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    if (imagesList.length === 0) return;
    setActiveImageIndex((prev) => (prev === imagesList.length - 1 ? 0 : prev + 1));
  };

  const activeImageUrl = imagesList[activeImageIndex] || project?.image_url || project?.image || '';

  return (
    <AnimatePresence>
      {project && (
        <>
          {/* Backdrop */}
          <motion.div
            key="drawer-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-xs z-50 cursor-pointer"
          />

          {/* Slide-out Sidebar Panel */}
          <motion.div
            key="drawer-panel"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="fixed top-0 right-0 h-full w-full max-w-2xl bg-[#F6F6F4] shadow-2xl z-50 border-l border-brand-border overflow-y-auto flex flex-col"
          >
            {/* Upper static header bar */}
            <div className="sticky top-0 bg-[#F6F6F4]/90 backdrop-blur-md px-6 py-4 border-b border-brand-border flex items-center justify-between z-10">
              <div className="flex items-center gap-3">
                <span className="font-sans text-[10px] tracking-widest text-[#0052FF] bg-black px-2 py-0.5 rounded-sm">
                  {project.branchLabel}
                </span>
                <span className="font-sans text-[10px] font-bold text-neutral-500 uppercase tracking-widest">
                  {project.type}
                </span>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-white border border-brand-border/80 flex items-center justify-center hover:bg-black hover:text-white transition-colors cursor-pointer shadow-xs"
                title="Cerrar detalles"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Main content body */}
            <div className="p-6 md:p-8 space-y-8 flex-1">
              {/* Project title and core category */}
              <div className="space-y-2">
                <h2 id="drawer-project-title" className="text-4xl md:text-5xl font-display font-black tracking-wide text-black uppercase">
                  {project.name}
                </h2>
                <p id="drawer-project-subtitle" className="font-sans text-xs text-brand-blue tracking-widest uppercase font-bold">
                  {project.category}
                </p>
              </div>

              {/* Dynamic Multiple Image Gallery block */}
              <div className="space-y-3">
                <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-brand-border shadow-md bg-neutral-900 group/gallery">
                  {activeImageUrl ? (
                    <motion.img
                      key={activeImageIndex}
                      initial={{ opacity: 0.4, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0.4 }}
                      transition={{ duration: 0.35, ease: 'easeInOut' }}
                      src={activeImageUrl}
                      alt={`${project.name} - Imagen ${activeImageIndex + 1}`}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-neutral-400 text-xs">Sin imagen</div>
                  )}

                  <div className="absolute top-3 right-3 bg-black/80 px-2.5 py-1 rounded-sm text-[9px] font-sans text-white/90 tracking-wide flex items-center gap-1 uppercase z-10">
                    <Calendar className="w-3 h-3 text-[#0052FF]" />
                    AÑO {project.year}
                  </div>

                  {imagesList.length > 1 && (
                    <div className="absolute top-3 left-3 bg-[#0052FF] px-2.5 py-1 rounded-sm text-[9px] font-sans text-white tracking-widest font-extrabold z-10">
                      FOTO {activeImageIndex + 1} / {imagesList.length}
                    </div>
                  )}

                  {/* Manual Arrow Controls if multiple images are loaded */}
                  {imagesList.length > 1 && (
                    <>
                      <button
                        onClick={handlePrevImage}
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/75 hover:bg-[#0052FF] text-white flex items-center justify-center transition-all cursor-pointer select-none opacity-0 group-hover/gallery:opacity-100 z-10 border border-white/5 active:scale-90"
                        title="Foto anterior"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        onClick={handleNextImage}
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/75 hover:bg-[#0052FF] text-white flex items-center justify-center transition-all cursor-pointer select-none opacity-0 group-hover/gallery:opacity-100 z-10 border border-white/5 active:scale-90"
                        title="Siguiente foto"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </>
                  )}
                </div>

                {/* Sliding Miniature Thumbnails Strip */}
                {imagesList.length > 1 && (
                  <div className="flex flex-wrap gap-2.5 pt-1 overflow-x-auto">
                    {imagesList.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveImageIndex(idx)}
                        className={`relative w-20 aspect-video rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                          idx === activeImageIndex
                            ? 'border-[#0052FF] scale-102 shadow-sm'
                            : 'border-brand-border opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img
                          src={img}
                          alt=""
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Overview strategic description (Long detailed paragraphs) */}
              <div className="space-y-4">
                <h3 className="font-sans text-xs font-bold uppercase tracking-wider text-neutral-500 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-brand-blue" />
                  Propósito Estratégico
                </h3>
                <p className="text-lg text-neutral-800 leading-relaxed font-sans font-medium">
                  {project.description}
                </p>
                {project.detailedDescription && (
                  <p className="text-sm text-neutral-600 leading-relaxed font-sans">
                    {project.detailedDescription}
                  </p>
                )}
              </div>



              {/* Tag system list */}
              <div className="space-y-2">
                <h4 className="font-sans text-xs font-bold uppercase tracking-wider text-neutral-500 flex items-center gap-2">
                  <Tag className="w-3.5 h-3.5 text-brand-blue" />
                  Áreas Asociadas
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-neutral-200 text-neutral-800 text-[10px] font-sans uppercase tracking-wide rounded-md border border-brand-border/40"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom bar with final CTA action */}
              {project.link && (
                <div className="pt-6 border-t border-brand-border/60">
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 bg-black hover:bg-brand-blue hover:text-white px-5 py-3 rounded-lg text-xs font-sans font-bold uppercase tracking-widest transition-colors cursor-pointer text-white"
                  >
                    {project.branch === 'branding' ? 'Ver Guía Completa' : 'Ver Proyecto Activo'}
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
