/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Header from './components/Header';
import Hero from './components/Hero';
import AboutSection from './components/AboutSection';
import ManifestoBackground from './components/ManifestoBackground';
import PortfolioSection from './components/PortfolioSection';
import MyProjectsSection from './components/MyProjectsSection';
import ContactSection from './components/ContactSection';
import AdminSection from './components/AdminSection';
import ProjectDrawer from './components/ProjectDrawer';
import Notification from './components/Notification';
import { Project } from './types';
import { Globe, Clock, Shield, Terminal, Instagram, Linkedin, HelpCircle } from 'lucide-react';

export default function App() {
  const [currentSection, setCurrentSection] = useState<'home' | 'portfolio' | 'projects' | 'contact' | 'admin'>('home');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);
  const [utcTime, setUtcTime] = useState<string>('17:42:52');

  // Handle automatic timeout for notifications
  useEffect(() => {
    if (notificationMsg) {
      const timer = setTimeout(() => {
        setNotificationMsg(null);
      }, 4500);
      return () => clearTimeout(timer);
    }
  }, [notificationMsg]);

  // Scroll to top of the page smoothly and instantly when changing sections
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.documentElement.scrollTo({ top: 0, behavior: 'smooth' });
    document.body.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentSection]);

  // Keep a digital clock ticked for aesthetic, strategic status indicators in Spain timezone/UTC format
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getUTCHours()).padStart(2, '0');
      const minutes = String(now.getUTCMinutes()).padStart(2, '0');
      const seconds = String(now.getUTCSeconds()).padStart(2, '0');
      setUtcTime(`${hours}:${minutes}:${seconds}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleShowNotification = (msg: string) => {
    setNotificationMsg(msg);
  };

  const handleProjectSelect = (project: Project) => {
    if (project.branch === 'web' && project.link) {
      window.open(project.link, '_blank');
      handleShowNotification(`Redireccionando a ${project.name}...`);
      return;
    }
    setSelectedProject(project);
  };

  return (
    <div id="portfolio-app-root" className="min-h-screen bg-brand-bg text-black selection:bg-brand-blue selection:text-white flex flex-col justify-between">
      
      {/* Decorative top grid accent line */}
      <div className="w-full h-1.5 bg-[#0052FF]" />

      {/* Dynamic Upper Header Bar */}
      <Header currentSection={currentSection} onNavChange={setCurrentSection} />

      {/* Main Switchboard Canvas Section */}
      <main className="flex-grow pt-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSection}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
          >
            {currentSection === 'home' && (
              <>
                <Hero 
                  onDiscoverClick={() => setCurrentSection('portfolio')} 
                  onContactClick={() => setCurrentSection('contact')} 
                />
                
                <AboutSection />
                
                {/* Clean, high-impact minimalist Manifesto statement - DEEP BLACK */}
                <section className="w-full text-white py-32 relative overflow-hidden border-t border-b border-white/[0.04] bg-black">
                  {/* Stunning animated and interactive core background */}
                  <ManifestoBackground />

                  {/* Technical fine background borders to match premium designer flavor */}
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.12] to-transparent pointer-events-none" />
                  <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/[0.12] to-transparent pointer-events-none" />
                  
                  {/* Digital precise corner guides for premium design standard */}
                  <div className="absolute top-8 left-8 w-6 h-6 pointer-events-none border-t border-l border-[#0052FF]/35 hidden sm:block" />
                  <div className="absolute top-8 right-8 w-6 h-6 pointer-events-none border-t border-r border-[#0052FF]/35 hidden sm:block" />
                  <div className="absolute bottom-8 left-8 w-6 h-6 pointer-events-none border-b border-l border-[#0052FF]/35 hidden sm:block" />
                  <div className="absolute bottom-8 right-8 w-6 h-6 pointer-events-none border-b border-r border-[#0052FF]/35 hidden sm:block" />

                  <div className="w-[90%] mx-auto max-w-5xl text-center space-y-10 relative z-10 pointer-events-none">
                    
                    {/* Glowing status pill badge */}
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-neutral-900/80 border border-white/10 rounded-full backdrop-blur-md mb-2 pointer-events-auto select-none">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00A3FF] animate-pulse shadow-[0_0_8px_rgba(0,163,255,0.85)]" />
                      <span className="font-sans text-[8px] sm:text-[9px] font-black tracking-[0.25em] text-[#00A3FF] uppercase">
                        INGENIERÍA ESTRATÉGICA // MULTI-CANAL
                      </span>
                    </div>

                    <h3 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-extrabold uppercase text-white leading-[0.95] tracking-tight max-w-5xl mx-auto pointer-events-auto select-text filter drop-shadow-[0_10px_35px_rgba(0,0,0,0.9)]">
                      SÓLIDA INGENIERÍA <br className="hidden sm:block" />
                      <span className="text-neutral-500 font-light font-sans italic tracking-wide lowercase">de</span> MARCA <span className="font-sans font-light italic text-[#00A3FF] lowercase">&amp;</span> <br />
                      <span className="bg-gradient-to-r from-[#006BFF] via-[#00A3FF] to-[#0077FF] bg-clip-text text-transparent font-black select-text tracking-normal filter drop-shadow-[0_2px_20px_rgba(0,107,255,0.28)]">
                        AUTOMATIZACIÓN AVANZADA.
                      </span>
                    </h3>

                    <p className="font-sans text-sm sm:text-base md:text-lg leading-relaxed text-neutral-300 max-w-3xl mx-auto font-medium pointer-events-auto select-text">
                      Bajo mi dirección estratégica en <span className="font-semibold text-white tracking-wider border-b border-[#0052FF]/30 pb-0.5 whitespace-nowrap">BASSSE</span>, diseño sistemas operativos visuales. Creo identidades con alma conceptual que conectan de verdad, potencio la conversión B2B y automatizo tus flujos de captación mediante Inteligencia Artificial y pipelines de alta tecnología.
                    </p>
                  </div>
                </section>
              </>
            )}

            {currentSection === 'portfolio' && (
              <>
                <PortfolioSection 
                  onProjectSelect={handleProjectSelect} 
                  onNotification={handleShowNotification} 
                />
                <MyProjectsSection 
                  onNotification={handleShowNotification} 
                  onProjectSelect={handleProjectSelect} 
                />
              </>
            )}

            {currentSection === 'projects' && (
              <MyProjectsSection 
                onNotification={handleShowNotification} 
                onProjectSelect={handleProjectSelect} 
              />
            )}

            {currentSection === 'contact' && (
              <ContactSection 
                onNavChange={setCurrentSection} 
                onNotification={handleShowNotification} 
              />
            )}

            {currentSection === 'admin' && (
              <AdminSection onNotification={handleShowNotification} />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* System Detailed Case study slider Drawer */}
      <ProjectDrawer 
        project={selectedProject} 
        onClose={() => setSelectedProject(null)} 
      />

      {/* Micro system feedback status notification toast */}
      <Notification 
        message={notificationMsg} 
        onClear={() => setNotificationMsg(null)} 
      />

      {/* Meticulous Global UI Footer */}
      <footer className="w-[90%] mx-auto py-10 border-t border-brand-border/60 mt-12 select-none font-sans text-[11px] text-neutral-450 font-semibold tracking-wide">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Copyright branding */}
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-brand-blue animate-pulse" />
            <span className="text-black font-semibold">EDUARDO D. COCO</span>
            <span className="text-neutral-400">/ FUNDADOR DE BASSSE & TECHNO EXPERIENCE</span>
          </div>

          {/* UTC timezone live ticker & spain geographic indicators */}
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1">
              <Globe className="w-3 h-3 text-[#0052FF]" />
              ESPAÑA / INTERNACIONAL
            </span>
            <span className="flex items-center gap-1 bg-neutral-200/50 px-2 py-0.5 rounded text-black font-bold">
              <Clock className="w-3 h-3 text-[#0052FF]" />
              UTC {utcTime}
            </span>
          </div>

          {/* Bottom rights tag */}
          <div className="flex items-center gap-1">
            <span>© 2026. TODOS LOS DERECHOS RESERVADOS.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

