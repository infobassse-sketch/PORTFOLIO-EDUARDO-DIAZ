import { motion } from 'motion/react';

// Import real uploaded partner logo images
import logoAzul from './strip-logos/logo-azul.png';
import logoCompletoBlanco from './strip-logos/logo completo blanco.png';
import recurso2 from './strip-logos/Recurso 2.png';
import logoBlancoColor from './strip-logos/LOGO BLANCO COLOR.png';
import logoArchaic from './strip-logos/LOGO ARCHAIC.png';
import logoQuimeraProject from './strip-logos/logo-quimera-project.png';
import centerSuitesLogo from './strip-logos/center suites logo@2x.png';
import logoEssanSinFondo from './strip-logos/logo essan sin fondo.png';
import fishLogo from './strip-logos/fish.png';

interface HeroProps {
  onDiscoverClick: () => void;
  onContactClick: () => void;
}

export default function Hero({ onDiscoverClick, onContactClick }: HeroProps) {
  // Brand partners list for the bottom scrolling marquee using premium uploaded image assets
    const PARTNER_LOGOS = [
      { id: 'logo-azul', src: logoAzul, alt: 'Logo Azul' },
      { id: 'logo-completo-blanco', src: logoCompletoBlanco, alt: 'Logo Completo Blanco' },
      { id: 'recurso-2', src: recurso2, alt: 'Recurso 2' },
      { id: 'logo-blanco-color', src: logoBlancoColor, alt: 'Logo Blanco Color' },
      { id: 'logo-archaic', src: logoArchaic, alt: 'Archaic', heightClass: 'h-16 sm:h-18 md:h-20' },
      { id: 'logo-quimera-project', src: logoQuimeraProject, alt: 'Quimera Project' },
      { id: 'center-suites-logo', src: centerSuitesLogo, alt: 'Center Suites' },
      { id: 'logo-essan', src: logoEssanSinFondo, alt: 'Essan' },
      { id: 'fish-logo', src: fishLogo, alt: 'Fish & Cheese' }
    ];

  return (
    <section 
      id="hero-root"
      className="relative w-full min-h-screen bg-black text-white flex flex-col justify-between overflow-hidden select-none pt-28"
    >
      {/* 1. Cinematic Background Image - Darkened & blended matching physical artwork */}
      <div className="absolute inset-0 z-0">
        <motion.img 
          src="/assets/index/hero/upscalemedia-transformed (2)32.jpeg"
          alt="Eduardo D. Coco - Director Creativo"
          className="w-full h-full object-cover object-center md:object-[center_20%] grayscale brightness-[0.55] contrast-[1.12] opacity-95 pointer-events-none"
          animate={{
            scale: [1, 1.05, 1],
            x: [0, 6, -6, 0],
            y: [0, -3, 3, 0]
          }}
          transition={{
            duration: 35,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          referrerPolicy="no-referrer"
        />
        {/* Soft radial overlay enhancing face spotlight details */}
        <div className="absolute inset-0 bg-radial-[circle_at_center] from-transparent via-black/40 to-black pointer-events-none" />
        
        {/* Edge gradient guards merging into pure black */}
        {/* Left deep fade to guarantee name legibility */}
        <div className="absolute inset-y-0 left-0 w-full sm:w-[50%] bg-gradient-to-r from-black via-black/85 to-transparent pointer-events-none" />
        {/* Right fade */}
        <div className="absolute inset-y-0 right-0 w-full sm:w-[35%] bg-gradient-to-l from-black via-black/45 to-transparent pointer-events-none" />
        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 w-full h-[35%] bg-gradient-to-t from-black via-black/90 to-transparent pointer-events-none" />
        {/* Top fade to merge with absolute header */}
        <div className="absolute top-0 left-0 w-full h-[20%] bg-gradient-to-b from-black to-transparent pointer-events-none" />
      </div>

      {/* 2. Main Narrative Core Content Area */}
      <div className="w-[90%] mx-auto max-w-7xl flex-grow flex flex-col justify-end relative z-10 pb-16 md:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end w-full">
          
          {/* Left Column: Big bold name header and brief credit lines */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="overflow-hidden">
              <motion.h1 
                id="hero-developer-name"
                className="font-display select-none tracking-[0.05em] sm:tracking-[0.08em] leading-[1.05]"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              >
                <span className="block text-[clamp(4.2rem,11.5vw,9.5rem)] font-black text-white h-auto pb-1">Eduardo</span>
                <span className="block text-[clamp(4.2rem,11.5vw,9.5rem)] font-black text-white">D.Coco</span>
              </motion.h1>
            </div>

            {/* Core Roles Sub-Credentials with clean separator lines */}
            <motion.div 
              className="space-y-1.5 pt-4 border-t border-white/10 max-w-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <p className="font-sans text-[10px] sm:text-xs font-black tracking-[0.25em] text-neutral-400 uppercase leading-none">
                Fundador
              </p>
              <p className="font-sans text-xs sm:text-sm font-bold text-neutral-200 tracking-wider">
                BASSSE · Techno Experience · SODOMA
              </p>
            </motion.div>
          </div>

          {/* Right Column: Left-aligned floating pitch block at bottom right */}
          <div className="lg:col-span-5 text-left flex flex-col justify-end items-start lg:items-end w-full">
            <motion.div 
              className="max-w-md w-full lg:text-left space-y-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              <p className="font-sans text-lg sm:text-xl lg:text-[23px] font-normal leading-relaxed text-white/95 tracking-tight">
                Marketing, diseño, creatividad<br />
                e IA para música,<br />
                eventos y lifestyle.
              </p>

              {/* Discreet CTA Row to explore more */}
              <div id="discreet-cta-scroll" className="flex items-center gap-4 pt-2">
                <button 
                  onClick={onDiscoverClick}
                  className="flex items-center gap-2 group text-xs font-sans tracking-widest font-black uppercase text-white hover:text-brand-blue cursor-pointer transition-colors"
                >
                  Ver portfolio
                  <span className="px-2 py-0.5 bg-white/10 rounded-full group-hover:bg-[#0052FF]/20 group-hover:text-[#0052FF] transition-all">→</span>
                </button>
                <button 
                  onClick={onContactClick}
                  className="flex items-center gap-2 group text-xs font-sans tracking-widest font-black uppercase text-[#0052FF] hover:text-white cursor-pointer transition-colors"
                >
                  Pedir Propuesta
                  <span className="px-2 py-0.5 bg-[#0052FF]/15 rounded-full group-hover:bg-white/20 group-hover:text-white transition-all">↓</span>
                </button>
              </div>

            </motion.div>
          </div>

        </div>
      </div>

      {/* 3. Infinite Scrolling Brand Logos Marquee at the very bottom edge of viewport */}
      <div className="w-full bg-[#050505] py-5 border-t border-white/[0.04] overflow-hidden relative z-10">
        <div className="flex w-max animate-marquee">
          {/* Double mapped array for infinite structural loop */}
          {[...PARTNER_LOGOS, ...PARTNER_LOGOS, ...PARTNER_LOGOS, ...PARTNER_LOGOS].map((logo, index) => {
            return (
              <div 
                key={`logo-${logo.id}-${index}`}
                className="flex items-center gap-10 shrink-0 px-10 select-none group/logo"
              >
                {/* Star Bullet points like in terminal outputs */}
                <span className="w-1.5 h-1.5 rounded-full bg-[#0052FF] opacity-65 group-hover/logo:scale-125 group-hover/logo:bg-[#00A3FF] transition-all" />
                
                <div className="transition-all duration-300">
                  <img 
                    src={logo.src} 
                    alt={logo.alt} 
                    className={`${logo.heightClass || 'h-6 sm:h-7 md:h-8'} w-auto object-contain transition-all duration-300 ${logo.id === 'logo-archaic' ? 'max-w-[240px]' : 'max-w-[150px]'}`}
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </section>
  );
}
