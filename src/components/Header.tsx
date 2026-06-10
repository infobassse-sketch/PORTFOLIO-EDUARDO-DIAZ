import { motion } from 'motion/react';

interface HeaderProps {
  currentSection: 'home' | 'portfolio' | 'projects' | 'contact' | 'admin';
  onNavChange: (id: 'home' | 'portfolio' | 'projects' | 'contact' | 'admin') => void;
}

export default function Header({ currentSection, onNavChange }: HeaderProps) {
  const isHome = currentSection === 'home';

  const handleNavClick = (id: 'about' | 'portfolio' | 'contact' | 'admin') => {
    if (id === 'about') {
      onNavChange('home');
      setTimeout(() => {
        const element = document.getElementById('about-section');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 150);
    } else {
      onNavChange(id === 'portfolio' ? 'portfolio' : id === 'contact' ? 'contact' : 'admin');
    }
  };

  return (
    <header 
      style={{ fontFamily: 'var(--font-sans)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}
      className="fixed top-0 left-0 w-full z-50 transition-all duration-300 select-none bg-neutral-500/30 text-white border-b border-white/[0.04]"
    >
      <div 
        id="main-nav-container"
        className="w-[90%] mx-auto max-w-7xl flex items-center justify-between py-6"
      >
        {/* Brand Name on the left page */}
        <button
          id="nav-brand-logo"
          onClick={() => {
            onNavChange('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center gap-1.5 font-display text-lg sm:text-2xl font-black tracking-normal transition-colors cursor-pointer text-white hover:text-brand-blue"
          style={{ letterSpacing: '0.04em' }}
        >
          <span>Eduardo D.Coco</span>
        </button>

        {/* Minimal Navigation Items matching Framer exactly */}
        <nav className="flex items-center gap-5 sm:gap-10 text-xs sm:text-sm font-semibold tracking-normal">
          <button
            id="nav-item-about"
            onClick={() => handleNavClick('about')}
            className="transition-colors cursor-pointer text-white hover:text-brand-blue"
          >
            Sobre mi
          </button>
          
          <button
            id="nav-item-portfolio"
            onClick={() => handleNavClick('portfolio')}
            className={`transition-colors cursor-pointer ${
              currentSection === 'portfolio' 
                ? 'text-[#0052FF] font-black' 
                : 'text-white hover:text-brand-blue'
            }`}
          >
            Proyectos
          </button>

          <button
            id="nav-item-contact"
            onClick={() => handleNavClick('contact')}
            className={`transition-colors cursor-pointer ${
              currentSection === 'contact' 
                ? 'text-[#0052FF] font-black' 
                : 'text-white hover:text-brand-blue'
            }`}
          >
            Contacto
          </button>

        </nav>
      </div>
    </header>
  );
}
