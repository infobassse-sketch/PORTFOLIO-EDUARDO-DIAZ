import React from 'react';
import { motion } from 'motion/react';
import { Globe, Play, Music, Radio, Heart, MessageSquare, Instagram, Youtube, Facebook, Rss, ArrowRight } from 'lucide-react';

interface MockupProps {
  size?: 'small' | 'large';
  hovered?: boolean;
}

export function TechnoExperienceMockup({ size = 'small', hovered = false }: MockupProps) {
  const isLarge = size === 'large';

  // Concentric ring animations
  const spinTransitionFast = {
    repeat: Infinity,
    duration: 8,
    ease: 'linear',
  };

  const spinTransitionMedium = {
    repeat: Infinity,
    duration: 18,
    ease: 'linear',
  };

  const spinTransitionSlow = {
    repeat: Infinity,
    duration: 32,
    ease: 'linear',
  };

  return (
    <div 
      className={`relative w-full h-full bg-[#030303] flex flex-col justify-between overflow-hidden select-none font-sans ${
        isLarge ? 'p-6 md:p-8' : 'p-3.5 sm:p-4'
      }`}
      style={{
        backgroundImage: `
          linear-gradient(to right, rgba(0, 163, 255, 0.03) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(0, 163, 255, 0.03) 1px, transparent 1px)
        `,
        backgroundSize: isLarge ? '30px 30px' : '15px 15px',
      }}
    >
      {/* Background ambient deep blue glow */}
      <div className={`absolute rounded-full bg-cyan-950/20 blur-[60px] pointer-events-none transition-all duration-700 ${
        hovered ? 'scale-125 bg-cyan-900/35 h-64 w-64' : 'h-48 w-48'
      } ${
        isLarge ? '-top-10 -right-10' : '-top-12 -right-12'
      }`} />

      {/* Mini Top Navbar header */}
      <div className={`flex items-center justify-between border-b border-neutral-900 pb-2 z-10 ${
        isLarge ? 'text-xs mb-4' : 'text-[8px] mb-2'
      }`}>
        <div className="flex items-center gap-2">
          {/* Cyan electric brand square indicator */}
          <div className="w-2.5 h-2.5 bg-[#00A3FF] flex items-center justify-center rounded-xs shadow-[0_0_8px_rgba(0,163,255,0.8)]">
            <span className="text-[6px] text-black font-black font-sans">T</span>
          </div>
          <span className="font-display font-black tracking-wider text-white uppercase">
            TECHNO EXPERIENCE
          </span>
        </div>
        <div className="flex items-center gap-2 text-neutral-500 font-sans font-bold tracking-tight">
          <span>INICIO</span>
          <span className="text-neutral-800">/</span>
          <span>ESTUDIOS</span>
          <span className="text-neutral-800">/</span>
          <span className="text-[#00A3FF] animate-pulse">LORENA</span>
        </div>
      </div>

      {/* Main hero segment */}
      <div className="flex-grow flex items-center justify-between relative z-10 py-1">
        
        {/* Left Headline Content */}
        <div className="max-w-[55%] flex flex-col justify-center space-y-1">
          <span className={`font-sans font-extrabold uppercase text-[#00A3FF] tracking-widest ${
            isLarge ? 'text-[10px]' : 'text-[6.5px]'
          }`}>
            NEWS • TECHNO • CULTURA
          </span>
          <h1 className={`font-display font-black tracking-tight text-white leading-[1] uppercase ${
            isLarge ? 'text-4xl md:text-5xl' : 'text-xl sm:text-2xl'
          }`}>
            <span className="relative inline-block text-[#00A3FF] drop-shadow-[0_0_12px_rgba(0,163,255,0.4)]">
              TECHNO
            </span>{" "}
            <br />
            <span className="text-white hover:text-neutral-300 transition-colors">
              EXPERIENCE
            </span>
          </h1>
          <p className={`text-neutral-400 font-medium leading-relaxed ${
            isLarge ? 'text-[11px] pt-2' : 'text-[6px] opacity-80'
          }`}>
            Plataforma líder en divulgación de la cultura de club internacional y deejay tracking de primer nivel.
          </p>
        </div>

        {/* Right Concentric Radar Wheel core */}
        <div className={`relative flex items-center justify-center shrink-0 ${
          isLarge ? 'w-56 h-56 mr-4' : 'w-24 h-24 sm:w-28 sm:h-28'
        }`}>
          {/* Cyber glowing central core */}
          <div className={`absolute rounded-full bg-cyan-950/45 flex items-center justify-center border border-cyan-400/80 transition-all duration-500 ${
            hovered ? 'shadow-[0_0_25px_rgba(0,163,255,0.6)] border-cyan-400 scale-105' : 'shadow-[0_0_12px_rgba(0,163,255,0.35)]'
          } ${
            isLarge ? 'w-24 h-24' : 'w-[44px] h-[44px] sm:w-12 sm:h-12'
          }`}>
            {/* Glowing cyber Z symbol */}
            <span className={`font-sans font-black text-[#00A3FF] tracking-wider select-none translate-x-0.5 ${
              isLarge ? 'text-4xl' : 'text-[16px] sm:text-lg'
            }`}>
              ⚡
            </span>
          </div>

          {/* Outer dashed fast rotating ring */}
          <motion.div 
            animate={{ rotate: 360 }}
            transition={spinTransitionFast}
            className={`absolute border-2 border-dashed border-[#00A3FF]/25 rounded-full ${
              isLarge ? 'w-52 h-52' : 'w-24 h-24 sm:w-[104px] sm:h-[104px]'
            }`}
          />

          {/* Middle reverse spin solid segmented ring */}
          <motion.div 
            animate={{ rotate: -360 }}
            transition={spinTransitionMedium}
            className={`absolute border border-dashed border-cyan-400/40 rounded-full border-t-transparent border-b-transparent ${
              isLarge ? 'w-40 h-40' : 'w-20 h-20 sm:w-[84px] sm:h-[84px]'
            }`}
          />

          {/* Inner ring helper */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={spinTransitionSlow}
            className={`absolute border border-[#00A3FF]/15 rounded-full border-l-transparent border-r-cyan-400/30 ${
              isLarge ? 'w-[114px] h-[114px]' : 'w-[56px] h-[56px]'
            }`}
          />
        </div>
      </div>

      {/* Bottom Editorial widgets grid (Hidden in extremely small mobile screens) */}
      <div className={`grid grid-cols-3 gap-2 border-t border-neutral-900/60 pt-2 shrink-0 z-10 ${
        isLarge ? 'mt-4' : 'mt-1'
      }`}>
        {/* Column 1: Ultimas noticias */}
        <div className="space-y-1">
          <span className={`block font-sans font-black text-white ${
            isLarge ? 'text-[9px]' : 'text-[5.5px]'
          }`}>
            / ÚLTIMAS NOTICIAS
          </span>
          <div className="space-y-0.5">
            <div className={`p-1 bg-neutral-950 rounded-xs border border-neutral-900 text-neutral-400 truncate font-sans ${isLarge ? 'text-[8.5px]' : 'text-[5px]'}`}>
              <span className="text-[#00A3FF]">22 MAY_</span> DIGGERCAMP IA
            </div>
            {isLarge && (
              <div className="p-1 bg-neutral-950 rounded-xs border border-neutral-900 text-neutral-400 truncate font-sans text-[8.5px]">
                <span className="text-[#00A3FF]">22 MAY_</span> DETROIT TECHNO WEEK 2026
              </div>
            )}
          </div>
        </div>

        {/* Column 2: Playlist widget */}
        <div className="space-y-1">
          <span className={`block font-sans font-black text-white ${
            isLarge ? 'text-[9px]' : 'text-[5.5px]'
          }`}>
            / PLAYLIST DYNAMIC
          </span>
          <div className={`flex items-center gap-1 bg-neutral-950 p-[3px] sm:p-[4px] rounded-xs border border-neutral-900 ${
            isLarge ? 'h-[36px]' : 'h-[16px] sm:h-[18px]'
          }`}>
            <div className="h-full aspect-square bg-[#00A3FF]/20 flex items-center justify-center rounded-xs shrink-0">
              <Music className={`text-[#00A3FF] ${isLarge ? 'w-3.5 h-3.5' : 'w-1.5 h-1.5'}`} />
            </div>
            <div className="flex-1 min-w-0 pr-1 flex flex-col justify-center">
              <div className={`text-white font-bold truncate leading-none ${isLarge ? 'text-[8.5px]' : 'text-[4.5px]'}`}>Evil</div>
              <div className={`text-neutral-500 font-sans truncate leading-none ${isLarge ? 'text-[7.5px]' : 'text-[3.5px]'}`}>Yanamaste</div>
            </div>
            <Play className={`text-[#00A3FF] shrink-0 fill-[#00A3FF] ${isLarge ? 'w-3 h-3 mr-1' : 'w-1.5 h-1.5'}`} />
          </div>
        </div>

        {/* Column 3: Siguenos statistics */}
        <div className="space-y-1">
          <span className={`block font-sans font-black text-white ${
            isLarge ? 'text-[9px]' : 'text-[5.5px]'
          }`}>
            / SÍGUENOS
          </span>
          <div className={`flex items-center justify-between px-1 bg-neutral-950 rounded-xs border border-neutral-900 font-sans font-bold ${
            isLarge ? 'py-1 text-[8px]' : 'py-0.5 text-[5px]'
          }`}>
            <span className="text-neutral-400 flex items-center gap-0.5"><Instagram className="w-1.5 h-1.5 text-pink-500" /> INSTAGRAM</span>
            <span className="text-[#00A3FF]">31.8K</span>
          </div>
        </div>
      </div>

      {/* Cyber ambient scrollbar footer logo ticker */}
      <div className={`w-full border-t border-neutral-940 mt-1 md:mt-2 pt-1 flex items-center justify-between font-sans text-neutral-600 ${
        isLarge ? 'text-[8.5px]' : 'text-[4.5px]'
      }`}>
        <span className="font-black text-[#00A3FF]/45">SYS_ONLINE_CORE</span>
        <div className="flex gap-2 text-[4px] sm:text-[5px] md:text-[8px] font-bold">
          <span>TRESOR // </span>
          <span>FABRIK MADRID // </span>
          <span>AWAKENINGS // </span>
          <span>TIME WARP</span>
        </div>
        <span>MADRID, ES [2026]</span>
      </div>
    </div>
  );
}

export function DskonnectMockup({ size = 'small', hovered = false }: MockupProps) {
  const isLarge = size === 'large';

  return (
    <div 
      className={`relative w-full h-full bg-[#0a0214] flex flex-col justify-between overflow-hidden select-none font-sans ${
        isLarge ? 'p-6 md:p-8' : 'p-3.5 sm:p-4'
      }`}
      style={{
        backgroundImage: `
          linear-gradient(to right, rgba(122, 1, 172, 0.035) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(122, 1, 172, 0.035) 1px, transparent 1px)
        `,
        backgroundSize: isLarge ? '30px 30px' : '15px 15px',
      }}
    >
      {/* Deep corporate purple glow background */}
      <div className={`absolute rounded-full bg-purple-900/30 blur-[50px] pointer-events-none transition-all duration-700 ${
        hovered ? 'scale-135 bg-purple-800/40 h-64 w-64' : 'h-48 w-48'
      } ${
        isLarge ? '-bottom-10 -left-10' : '-bottom-12 -left-12'
      }`} />

      {/* Mini top navbar header */}
      <div className={`flex items-center justify-between border-b border-purple-950/50 pb-2 z-10 ${
        isLarge ? 'text-xs mb-4' : 'text-[8px] mb-2'
      }`}>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 bg-[#7A01AC] flex items-center justify-center rounded-xs shadow-[0_0_8px_rgba(122,1,172,0.85)]">
            <span className="text-[6px] text-white font-black font-sans">D</span>
          </div>
          <span className="font-display font-black tracking-wider text-white uppercase">
            DSKONNECT.COM
          </span>
        </div>
        <div className="flex gap-2.5 text-neutral-400 font-sans font-bold tracking-tight">
          <span className="text-[#a855f7]">ROSTER</span>
          <span>DATES</span>
          <span>NEWS</span>
          <span>RECORDS</span>
        </div>
      </div>

      {/* Main artist headline segment */}
      <div className="flex-grow flex flex-col justify-center relative z-10 py-1 text-left space-y-1 max-w-[90%]">
        <div className="flex items-center gap-1.5 font-sans uppercase text-[#a855f7] tracking-widest leading-none">
          <span className="w-1.5 h-1.5 rounded-full bg-[#7A01AC] animate-pulse" />
          <span className={isLarge ? 'text-[10px]' : 'text-[6px] sm:text-[6.5px]'}>BOOKING &amp; MANAGEMENT INT. GIANTS</span>
        </div>
        
        <h1 className={`font-display font-black tracking-tight text-white leading-[1] uppercase ${
          isLarge ? 'text-3xl md:text-4xl lg:text-5xl' : 'text-[17px] sm:text-xl md:text-[22px]'
        }`}>
          A JOURNEY THROUGH <br />
          <span className="bg-gradient-to-r from-white via-purple-150 to-purple-400 bg-clip-text text-transparent drop-shadow-[0_2px_15px_rgba(122,1,172,0.3)] font-black">
            ELECTRONIC MUSIC
          </span>
        </h1>
        
        <p className={`text-neutral-400 leading-relaxed font-sans font-medium ${
          isLarge ? 'text-xs pt-1.5 max-w-lg' : 'text-[6px] sm:text-[6.5px] opacity-85 max-w-[85%]'
        }`}>
          Representamos a los mayores exponentes de la música techno, house y vanguardia electrónica de toda Europa.
        </p>
      </div>

      {/* Mini artist roster cards grid (Hidden on very small layout sizes) */}
      <div className="grid grid-cols-4 gap-1.5 mt-1 sm:mt-2 shrink-0 z-10">
        {[
          { name: 'OSCAR MULERO', label: 'Techno' },
          { name: 'PABLO BOZZI', label: 'Italo' },
          { name: 'KREISLER', label: 'Industrial' },
          { name: 'BEN SIMS', label: 'Groove' }
        ].map((artist, idx) => (
          <div 
            key={idx} 
            className={`p-1 bg-[#10031d] rounded-xs border border-purple-950/40 relative group/artist transition-all duration-300 flex flex-col justify-between ${
              isLarge ? 'h-16 py-1.5' : 'h-7 sm:h-8 py-0.5'
            } ${hovered && idx === 0 ? 'border-purple-500/65 shadow-[0_0_8px_rgba(168,85,247,0.3)]' : ''}`}
          >
            <span className={`block font-display font-black text-white ${
              isLarge ? 'text-[9.5px]' : 'text-[5.5px]'
            }`}>
              {artist.name}
            </span>
            <div className="flex items-center justify-between text-neutral-500 font-sans">
              <span className={isLarge ? 'text-[8px]' : 'text-[4px]'}>{artist.label}</span>
              <span className={`text-[#a855f7] ${isLarge ? 'text-[8px] font-black' : 'text-[4px] font-bold'}`}>EP.{12 + idx}</span>
            </div>
            {/* Absolute overlay marker */}
            <div className="absolute top-1 right-1 w-1 h-1 rounded-full bg-green-500 opacity-0 group-hover/artist:opacity-100" />
          </div>
        ))}
      </div>

      {/* Minimal Footer indicator bar */}
      <div className={`w-full border-t border-purple-950/60 mt-1 md:mt-2 pt-1.5 flex items-center justify-between font-sans text-purple-950 ${
        isLarge ? 'text-[8.5px]' : 'text-[5px]'
      }`}>
        <span className="font-extrabold text-[#7A01AC] animate-pulse-slow">DSKONNECT // LIVE</span>
        <span className="text-neutral-500">EUROPEAN AGENCY DEEJAYS</span>
        <span className="text-neutral-500">AGENCY SYSTEM V.25</span>
      </div>
    </div>
  );
}
