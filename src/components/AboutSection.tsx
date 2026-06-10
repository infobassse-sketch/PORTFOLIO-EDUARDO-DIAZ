import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';

interface BlockType {
  num: string;
  title: string;
  short: string;
  description: string;
  extended: string;
  tags: string[];
  gridSpan: string;
}

export default function AboutSection() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const customBlocks: BlockType[] = [
    {
      num: '01',
      title: 'Estrategia de marca',
      short: 'Narrativa & Diferenciación',
      description: 'Diseño sistemas de identidad y propuestas de valor inquebrantables. Criterio visual inmune a modas pasajeras con tensión cultural.',
      extended: 'No creo logos bonitos; construyo marcas disruptivas con un posicionamiento premium y criterio estético comercial que atraen y retienen clientes de alto valor sin competir por precio.',
      tags: ['POSICIONAMIENTO', 'DIRECCIÓN CREATIVA', 'NARRATIVA CLAVE'],
      gridSpan: 'col-span-1 lg:col-span-2'
    },
    {
      num: '02',
      title: 'Diseño web high-end',
      short: 'Ingeniería Front-End & SEO',
      description: 'Desarrollo de portales ultra-rápidos que funcionan como el motor de captación principal del negocio.',
      extended: 'Clean code (React + TypeScript), animaciones fluidas con motion que acompañan la lectura, UX orientada a conversión directa y SEO de precisión con 100% en Lighthouse.',
      tags: ['CLEAN CODE', 'SEO AVANZADO', '100 LIGHTHOUSE'],
      gridSpan: 'col-span-1 lg:col-span-1'
    },
    {
      num: '03',
      title: 'Cultura musical',
      short: 'Underground & Dirección Artística',
      description: 'Lidero la comunicación y promoción musical vinculada a la cultura del techno y eventos.',
      extended: 'Desarrollo merchandising técnico comercial bajo metodologías de diseño industrial y construyo comunidades leales y fervientes de forma autónoma bajo la marca BASSSE.',
      tags: ['CULTURA TECHNO', 'BOUTIQUE RETAIL', 'COMMUNITY BRANDING'],
      gridSpan: 'col-span-1'
    },
    {
      num: '04',
      title: 'IA aplicada',
      short: 'Pipelines & Sistemas Autónomos',
      description: 'Programación de pipelines de software e integraciones avanzadas mediante IA para liberar tiempo.',
      extended: 'Desarrollo automatizaciones avanzadas (Brevo, Supabase, APIs, Webhooks) que eliminan por completo la fricción de ventas y optimizan los flujos comerciales sin intervención humana.',
      tags: ['AUTOMATIZACIÓN IA', 'WEBHOOKS', 'INTEGRACIÓN CRM'],
      gridSpan: 'col-span-1 lg:col-span-2'
    },
    {
      num: '05',
      title: 'Marketing y crecimiento',
      short: 'Embudo de Captación Premium',
      description: 'Estrategias audaces de captación orgánica y pagada enfocando el ROI como única métrica valiosa de éxito.',
      extended: 'Configuro campañas altamente refinadas en Google Ads y Meta Ads con modelos de atribución claros, diseñando embudos B2B premium orientados a maximizar el valor medio de vida del cliente.',
      tags: ['ROI DRIVEN', 'CAPTACIÓN B2B', 'EMBUDOS PREMIUM'],
      gridSpan: 'col-span-1 lg:col-span-3'
    }
  ];

  return (
    <section id="about-section" className="relative w-full py-28 select-none overflow-hidden bg-[#F5F5F3] text-black border-y border-neutral-200/70">
      {/* Editorial Gridlines in background for real structural blueprint vibe */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.45]">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#E5E5E7_1px,transparent_1px),linear-gradient(to_bottom,#E5E5E7_1px,transparent_1px)] bg-[size:48px_48px]" />
      </div>

      <div className="relative z-10 w-[90%] mx-auto max-w-7xl">
        {/* Structural Dividers & Strategic Header */}
        <div className="border-t border-neutral-300 pt-16 mb-16 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5 space-y-5">
            <div className="font-sans text-[11px] tracking-[0.2em] text-[#0052FF] uppercase font-black">
              NÚCLEO ESTRATÉGICO / PERSPECTIVA INTEGRAL
            </div>
            
            <h2 className="text-4xl sm:text-5xl lg:text-7xl font-display font-black tracking-[0.04em] text-neutral-950 uppercase leading-[1.05]">
              SISTEMA DE<br />PROPUESTA<br />DE VALOR.
            </h2>
            <div className="w-16 h-[3px] bg-[#0052FF]" />
          </div>

          <div className="lg:col-span-7 flex flex-col justify-end h-full pt-2">
            <p className="font-sans text-sm sm:text-base leading-relaxed text-neutral-700 font-semibold max-w-2xl">
              Entiendo perfectamente la diferencia entre verse inteligente y funcionar a un nivel de negocio real y rentable. Mi trabajo rechaza la mediocridad visual y la inconsistencia técnica. He unificado estas <span className="text-[#0052FF] font-black underline decoration-[2.5px] underline-offset-4">cinco disciplinas esenciales</span> en un único flujo sólido de alto rendimiento.
            </p>
          </div>
        </div>

        {/* Clean Premium Bento Grid with elegant white panels */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {customBlocks.map((block) => {
            const isHovered = hoveredCard === block.num;

            return (
              <div 
                key={block.num}
                id={`about-card-${block.num}`}
                onMouseEnter={() => setHoveredCard(block.num)}
                onMouseLeave={() => setHoveredCard(null)}
                className={`group relative flex flex-col justify-between border rounded-[24px] p-6 sm:p-8 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${block.gridSpan} overflow-hidden ${
                  isHovered
                    ? 'border-[#0052FF] bg-white text-black shadow-[0_22px_45px_rgba(0,82,255,0.07)] -translate-y-1'
                    : 'border-neutral-200/85 bg-white text-neutral-800'
                }`}
              >
                {/* Subtle floating huge background number */}
                <div className={`absolute right-6 top-2 font-display text-[120px] font-black select-none pointer-events-none transition-colors duration-500 leading-none ${
                  isHovered ? 'text-[#0052FF]/[0.05]' : 'text-neutral-100/60'
                }`}>
                  {block.num}
                </div>

                <div className="space-y-4 relative z-10 w-full">
                  <div className="flex justify-between items-center">
                    <span className="font-sans text-xs font-black tracking-widest flex items-center gap-2 text-[#0052FF]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#0052FF] animate-pulse" />
                      {block.num}
                    </span>
                    
                    <span className="font-sans text-[10px] font-bold uppercase tracking-wider text-[#0052FF]/80">
                      // {block.short}
                    </span>
                  </div>

                  <div className="space-y-2 pt-2">
                    <h3 className={`text-2xl sm:text-3xl font-display font-black uppercase tracking-wide leading-none transition-colors duration-355 ${
                      isHovered ? 'text-[#0052FF]' : 'text-neutral-950'
                    }`}>
                      {block.title}
                    </h3>
                    
                    <p className={`font-sans text-xs sm:text-sm leading-relaxed font-semibold max-w-xl transition-colors duration-355 ${
                      isHovered ? 'text-neutral-700' : 'text-neutral-550'
                    }`}>
                      {block.description}
                    </p>
                  </div>

                  {/* Premium Hover Reveal Details Box */}
                  <motion.div 
                    initial={false}
                    animate={{ 
                      height: isHovered ? 'auto' : '0px',
                      opacity: isHovered ? 1 : 0,
                      marginTop: isHovered ? 16 : 0
                    }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="p-4 rounded-xl border border-neutral-200 bg-neutral-50 text-neutral-600 font-sans text-xs sm:text-sm leading-relaxed italic">
                      {block.extended}
                    </div>
                  </motion.div>
                </div>

                {/* Tag Badges Footer inside each card */}
                <div className="mt-8 flex flex-wrap gap-x-4 gap-y-1.5 relative z-10 select-none">
                  {block.tags.map((tag) => (
                    <span 
                      key={tag} 
                      className="text-[9px] font-sans tracking-widest font-black text-[#0052FF] opacity-75 hover:opacity-100 transition-colors"
                    >
                      # {tag}
                    </span>
                  ))}
                </div>

                {/* Subtle hover icon on the corner */}
                <div className={`absolute bottom-6 right-6 transition-all duration-300 ${
                  isHovered ? 'opacity-100 transform translate-x-0' : 'opacity-0 transform translate-x-2'
                }`}>
                  <ArrowUpRight className="w-5 h-5 text-[#0052FF]" />
                </div>

              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
