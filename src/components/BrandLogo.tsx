import React from 'react';
import { motion } from 'motion/react';

interface BrandLogoProps {
  id: 'bassse-agency' | 'techno-experience' | 'sodoma-project' | string;
  className?: string;
  ambient?: boolean;
}

export default function BrandLogo({ id, className = '', ambient = false }: BrandLogoProps) {
  if (id === 'bassse-agency' || id.includes('bassse')) {
    return (
      <div className={`relative flex flex-col items-center justify-center p-6 bg-[#0B0C10] rounded-2xl border border-white/10 shadow-2xl overflow-hidden group ${className}`}>
        {/* Ambient glow in background if requested */}
        {ambient && (
          <div className="absolute inset-0 bg-radial-gradient from-[#7A01AC]/20 via-transparent to-transparent pointer-events-none" />
        )}

        {/* Impossible Triangle SVG Representation */}
        <div className="relative w-36 h-36 flex items-center justify-center">
          <svg
            viewBox="0 0 512 512"
            className="w-full h-full transform transition-transform duration-500 group-hover:scale-105"
          >
            <defs>
              <linearGradient id="bassseYellowRed" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#DF0000" />
                <stop offset="30%" stopColor="#FF4500" />
                <stop offset="70%" stopColor="#FFAA00" />
                <stop offset="100%" stopColor="#FFEA00" />
              </linearGradient>
            </defs>
            
            {/* 3D Geometric facets of the Penrose Triangle of BASSSE */}
            {/* Top apex pointing up, inner equalizer bars */}
            <g className="origin-center">
              {/* Outer Triangle loop */}
              {/* Piece 1 (Bottom Face) */}
              <polygon 
                points="80,420 440,420 370,300 150,300"
                fill="url(#bassseYellowRed)"
                opacity="1"
              />
              {/* Piece 2 (Right Face) */}
              <polygon 
                points="440,420 256,100 186,220 300,420"
                fill="url(#bassseYellowRed)"
                opacity="0.9"
              />
              {/* Piece 3 (Left Face) */}
              <polygon 
                points="256,100 80,420 150,300 256,140"
                fill="url(#bassseYellowRed)"
                opacity="0.8"
              />
              
              {/* Inner Equalizer Spectrum bars of the BASSSE symbol, mirroring music industry nature */}
              <g fill="#FFFFFF" className="opacity-95">
                {/* 7 micro bars */}
                <motion.rect x="210" y="270" width="8" height="20" animate={{ height: [20, 45, 20] }} transition={{ repeat: Infinity, duration: 1.2, delay: 0.1 }} />
                <motion.rect x="225" y="250" width="8" height="40" animate={{ height: [40, 75, 40] }} transition={{ repeat: Infinity, duration: 1.4, delay: 0.3 }} />
                <motion.rect x="240" y="230" width="8" height="60" animate={{ height: [60, 105, 60] }} transition={{ repeat: Infinity, duration: 1.1, delay: 0.2 }} />
                <motion.rect x="255" y="210" width="8" height="80" animate={{ height: [80, 130, 80] }} transition={{ repeat: Infinity, duration: 1.3, delay: 0.5 }} />
                <motion.rect x="270" y="235" width="8" height="55" animate={{ height: [55, 95, 55] }} transition={{ repeat: Infinity, duration: 1.2, delay: 0.4 }} />
                <motion.rect x="285" y="255" width="8" height="35" animate={{ height: [35, 65, 35] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.1 }} />
                <motion.rect x="300" y="275" width="8" height="15" animate={{ height: [15, 35, 15] }} transition={{ repeat: Infinity, duration: 1.0, delay: 0.3 }} />
              </g>
            </g>
          </svg>
        </div>

        {/* BASSSE Bold Typography Text underneath */}
        <div className="mt-4 flex flex-col items-center">
          <span className="font-sans font-black tracking-[0.25em] text-white text-lg uppercase transition-all duration-300 group-hover:tracking-[0.35em]">
            BASSSE
          </span>
          <span className="text-[8px] font-sans tracking-widest text-[#FFF200] mt-1 uppercase font-bold">
            DIGITAL STUDIO & IA
          </span>
        </div>
      </div>
    );
  }

  if (id === 'techno-experience' || id.includes('techno') || id.includes('te')) {
    return (
      <div className={`relative flex flex-col items-center justify-center p-6 bg-[#050505] rounded-2xl border border-cyan-500/15 shadow-2xl overflow-hidden group ${className}`}>
        {/* Cyber Grid background style */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,229,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,229,255,0.03)_1px,transparent_1px)] bg-[size:10px_10px] pointer-events-none" />
        
        {ambient && (
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-cyan-500/10 to-transparent pointer-events-none" />
        )}

        {/* High-Fidelity Stylized "TE" Monogram Logo */}
        <div className="relative w-36 h-36 flex items-center justify-center p-2">
          <svg
            viewBox="0 0 200 200"
            className="w-full h-full text-[#00E5FF] filter drop-shadow-[0_0_8px_rgba(0,229,255,0.3)] transition-transform duration-500 group-hover:scale-105"
            fill="none"
            stroke="currentColor"
            strokeWidth="16"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {/* Horizontal Top Bar representing T */}
            <path d="M 20 40 L 180 40" strokeWidth="18" />
            
            {/* Main Central Diagonal Connector */}
            <path d="M 120 40 L 40 160" strokeWidth="16" />
            
            {/* The E vertical backbone */}
            <path d="M 80 100 L 80 160" strokeWidth="14" />
            
            {/* Lower Horizontal shelf of E */}
            <path d="M 80 160 L 180 160" strokeWidth="18" />
            
            {/* Middle Horizontal stroke of E */}
            <path d="M 100 100 L 160 100" strokeWidth="14" strokeDasharray="none" />
          </svg>
        </div>

        {/* Techno Experience text layout */}
        <div className="mt-4 flex flex-col items-center">
          <span className="font-sans font-black text-sm tracking-[0.18em] text-white uppercase text-center group-hover:text-[#00E5FF] transition-colors">
            TECHNO EXPERIENCE
          </span>
          <span className="text-[7.5px] font-sans tracking-widest text-neutral-450 mt-1 uppercase font-semibold">
            PLATAFORMA EDITORIAL & CLUBBING
          </span>
        </div>
      </div>
    );
  }

  if (id === 'sodoma-project' || id.includes('sodoma')) {
    return (
      <div className={`relative flex flex-col items-center justify-center p-6 bg-gradient-to-tr from-[#C85D32] to-[#E3815A] rounded-2xl border border-orange-700/20 shadow-2xl overflow-hidden group ${className}`}>
        {/* Subtle physical paper texture effect */}
        <div className="absolute inset-0 bg-[#000000]/10 mix-blend-color-burn opacity-20 pointer-events-none" />
        <div className="absolute inset-0 bg-radial-gradient from-transparent to-black/20 opacity-30 pointer-events-none" />

        {/* Logo Text centered beautifully inside a physical graphic card */}
        <div className="relative w-full aspect-square flex flex-col items-center justify-center border border-black/10 rounded-xl p-4 transition-transform duration-500 group-hover:scale-102">
          
          {/* Top minimal signifier */}
          <div className="absolute top-4 text-[7px] font-sans tracking-widest text-[#000000]/60 uppercase font-black">
            COLECTIVO UNDERGROUND
          </div>

          {/* Majestic Roman high-contrast Serif font-set */}
          <div className="text-center py-6">
            <h4 className="text-3xl sm:text-4xl font-serif font-bold tracking-widest text-[#0C0C0C] uppercase select-none relative group-hover:tracking-[0.18em] transition-all duration-500">
              SODOMA
              <span className="text-xs font-sans align-top ml-0.5 font-bold">®</span>
            </h4>
          </div>

          {/* Bottom minimal aesthetic bar */}
          <div className="absolute bottom-4 flex items-center gap-2">
            <span className="w-1 h-1 rounded-full bg-black/40" />
            <span className="text-[7px] font-sans tracking-widest text-[#000000]/60 uppercase font-semibold">
              TECHNO INDUSTRIAL & ESTROBOSCÓPICO
            </span>
            <span className="w-1 h-1 rounded-full bg-black/40" />
          </div>

        </div>
      </div>
    );
  }

  // Fallback icon placeholder for other projects
  return (
    <div className={`flex items-center justify-center aspect-square rounded-2xl bg-neutral-150 border border-brand-border/60 ${className}`}>
      <span className="text-neutral-500 font-sans text-xs font-bold uppercase tracking-wider">{id.substring(0, 15)}</span>
    </div>
  );
}
