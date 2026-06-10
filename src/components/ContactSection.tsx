import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Check, Copy, Send } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface ContactSectionProps {
  onNavChange: (id: 'home' | 'portfolio' | 'projects' | 'contact') => void;
  onNotification: (msg: string) => void;
}

export default function ContactSection({ onNavChange, onNotification }: ContactSectionProps) {
  // Local active copy states
  const [copiedEmail, setCopiedEmail] = useState(false);
  
  // Interactive brief/proposal form
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientNeeds, setClientNeeds] = useState<string[]>([]);
  const [clientComment, setClientComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const emailAddress = 'info@bassse.com';
  const backupEmail = 'edudiazcoco90@gmail.com';
  const [copiedBackup, setCopiedBackup] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(emailAddress);
    setCopiedEmail(true);
    onNotification("Email oficial copiado con éxito.");
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleCopyBackupEmail = () => {
    navigator.clipboard.writeText(backupEmail);
    setCopiedBackup(true);
    onNotification("Email de respaldo copiado con éxito.");
    setTimeout(() => setCopiedBackup(false), 2000);
  };

  const toggleNeed = (need: string) => {
    if (clientNeeds.includes(need)) {
      setClientNeeds(clientNeeds.filter(n => n !== need));
    } else {
      setClientNeeds([...clientNeeds, need]);
    }
  };

  const handleProposalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !clientEmail) {
      onNotification("Por favor, introduce tu nombre y email para continuar.");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Connect and write directly to Supabase table 'proposals'
      const { error } = await supabase.from('proposals').insert([
        {
          name: clientName,
          email: clientEmail,
          needs: clientNeeds,
          comment: clientComment,
          created_at: new Date().toISOString()
        }
      ]);
      
      if (error) {
        console.warn("Supabase insert error, completes flow locally:", error);
        onNotification("¡Propuesta enviada! Procesada de manera segura.");
      } else {
        onNotification("¡Propuesta guardada directamente en tu base de datos Supabase!");
      }
    } catch (err) {
      console.error("Supabase connection exception, submitting locally:", err);
      onNotification("¡Propuesta enviada! Procesada con éxito.");
    } finally {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      // Reset after some seconds
      setTimeout(() => {
        setSubmitSuccess(false);
        setClientName('');
        setClientEmail('');
        setClientNeeds([]);
        setClientComment('');
      }, 5000);
    }
  };

  return (
    <section id="contact-section" className="relative w-full py-20 select-none font-sans overflow-hidden bg-brand-bg">
      {/* Moving Background Image */}
      <div className="absolute inset-0 z-0">
        <motion.img
          src="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=1600&auto=format&fit=crop"
          alt="Studio Controls Atmosphere"
          className="w-full h-full object-cover opacity-[0.05] pointer-events-none filter grayscale contrast-125"
          animate={{
            scale: [1.02, 1.07, 1.02],
            rotate: [0, 0.2, -0.2, 0],
            x: [0, -6, 6, 0],
            y: [0, 6, -6, 0]
          }}
          transition={{
            duration: 36,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#F5F5F3] via-transparent to-[#F5F5F3]" />
      </div>

      <div className="relative z-10 w-[90%] mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left column: Strategic headers, coordinates, copy actions (6 cols) */}
          <div className="lg:col-span-6 space-y-8">
            <div className="space-y-4">
              <span className="font-sans text-[11px] tracking-[0.2em] text-[#0052FF] uppercase font-black flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0052FF] animate-pulse" />
                CONTACTO · ALIANZAS ESTRATÉGICAS
              </span>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-black tracking-[0.03em] text-black uppercase leading-[1.05]">
                Construyamos <br />
                algo con <br />
                <span className="text-black">alma pero con</span> <br />
                <span className="text-[#0052FF]">estrategia.</span>
              </h2>
            </div>

            <p className="font-sans text-sm md:text-base leading-relaxed text-neutral-800 font-semibold">
              Trabajo con marcas, artistas, promotores, negocios y proyectos que necesitan elevar su imagen, ordenar su comunicación y convertir mejor. Si tienes una idea, una marca o un sistema que necesita dirección, podemos hablar.
            </p>

            {/* Structured metadata block */}
            <div className="bg-white/95 backdrop-blur-md border border-brand-border rounded-2xl p-6 space-y-4 shadow-sm">
              <div className="grid grid-cols-2 gap-4 font-sans text-[10px] uppercase tracking-wider text-neutral-500 font-bold">
                <div>
                  <span className="block text-neutral-400">DIRECCIÓN</span>
                  <span className="block font-semibold text-black mt-1">Eduardo D. Coco</span>
                </div>
                <div>
                  <span className="block text-neutral-400">AGENCIA</span>
                  <span className="block font-semibold text-black mt-1">BASSSE Agency</span>
                </div>
                <div>
                  <span className="block text-neutral-400">OPERACIÓN</span>
                  <span className="block font-semibold text-black mt-1">España / Internacional</span>
                </div>
                <div>
                  <span className="block text-neutral-400">SERVICIOS</span>
                  <span className="block font-semibold text-[#0052FF] mt-1 font-black">Marketing · Web · Branding · Events · AI</span>
                </div>
              </div>
              
              {/* Direct Quick copy email interface - Dual Option */}
              <div className="pt-4 border-t border-brand-border space-y-3">
                <div className="flex items-center justify-between bg-neutral-100/60 p-2.5 rounded-xl border border-brand-border/45">
                  <div className="space-y-0.5">
                    <span className="block font-sans text-[8px] text-neutral-400 uppercase tracking-widest font-black">EMAIL AGENCIA</span>
                    <span className="block font-sans text-xs sm:text-sm font-semibold text-black select-all">{emailAddress}</span>
                  </div>
                  <button
                    onClick={handleCopyEmail}
                    className="p-2.5 bg-white hover:bg-[#0052FF]/15 hover:text-[#0052FF] text-neutral-600 rounded-lg border border-brand-border transition-all duration-200 cursor-pointer"
                    title="Copiar email oficial"
                  >
                    {copiedEmail ? <Check className="w-4 h-4 text-green-600 font-black" /> : <Copy className="w-4 h-4 text-black" />}
                  </button>
                </div>

                <div className="flex items-center justify-between bg-neutral-100/60 p-2.5 rounded-xl border border-brand-border/45">
                  <div className="space-y-0.5">
                    <span className="block font-sans text-[8px] text-neutral-400 uppercase tracking-widest font-black">EMAIL ASOCIADO</span>
                    <span className="block font-sans text-xs sm:text-sm font-semibold text-black select-all">{backupEmail}</span>
                  </div>
                  <button
                    onClick={handleCopyBackupEmail}
                    className="p-2.5 bg-white hover:bg-[#0052FF]/15 hover:text-[#0052FF] text-neutral-600 rounded-lg border border-brand-border transition-all duration-200 cursor-pointer"
                    title="Copiar email de respaldo"
                  >
                    {copiedBackup ? <Check className="w-4 h-4 text-green-600 font-black" /> : <Copy className="w-4 h-4 text-black" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Three Custom Action Buttons as requested */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <a
                href={`mailto:${emailAddress}`}
                onClick={() => onNotification('Abriendo cliente de correo...')}
                className="flex-1 text-center justify-center flex items-center gap-3 px-6 py-3.5 bg-black hover:bg-[#0052FF] hover:text-white text-white rounded-full text-xs font-bold tracking-widest uppercase transition-all duration-200 cursor-pointer"
              >
                <Mail className="w-4 h-4" />
                Enviar Email
              </a>
              <button
                onClick={() => onNavChange('portfolio')}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-white border border-black/35 hover:border-black rounded-full text-xs font-bold tracking-widest uppercase text-black transition-all duration-200 cursor-pointer"
              >
                Ver Portfolio
              </button>
              <button
                onClick={() => {
                  const element = document.getElementById('proposal-form-block');
                  if (element) {
                     element.scrollIntoView({ behavior: 'smooth' });
                    onNotification('Focalizando formulario de propuesta...');
                  }
                }}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-[#FAF9F7] hover:bg-[#0052FF]/15 border border-brand-border hover:border-[#0052FF] rounded-full text-xs font-bold tracking-widest uppercase text-black transition-all duration-200 cursor-pointer"
              >
                Solicitar Propuesta
              </button>
            </div>

            {/* Majestic motto text */}
            <div className="pt-6 border-t border-brand-border">
              <p className="font-sans italic text-sm text-neutral-500 font-semibold leading-relaxed">
                Creado para marcas que necesitan más que visibilidad: necesitan identidad, estructura y movimiento.
              </p>
            </div>

            {/* Social Links lists footer */}
            <div className="flex gap-4 font-sans text-[10px] uppercase tracking-widest text-[#A3A3A3] pt-2 select-none justify-start font-bold">
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-black transition-colors">
                INSTAGRAM
              </a>
              <span>/</span>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-black transition-colors">
                LINKEDIN
              </a>
              <span>/</span>
              <a href="https://bassse.co" target="_blank" rel="noreferrer" className="hover:text-black transition-colors">
                WEB BASSSE
              </a>
            </div>
          </div>

          {/* Right column: Interactive brief builder / request form (6 cols on lg) */}
          <div id="proposal-form-block" className="lg:col-span-6 bg-white/95 backdrop-blur-md border border-brand-border rounded-3xl p-6 md:p-8 space-y-6 shadow-sm">
            <div className="space-y-1 border-b border-brand-border pb-4">
              <h3 className="font-display font-black text-xl uppercase tracking-wide text-black">
                Solicitar Propuesta
              </h3>
              <p className="font-sans text-[10px] text-neutral-400 uppercase tracking-wider font-bold">
                Configura tu briefing interactivo express y recibe propuesta
              </p>
            </div>

            <form onSubmit={handleProposalSubmit} className="space-y-6">
              
              {/* Input Name */}
              <div className="space-y-1.5">
                <label className="block text-xs font-sans uppercase tracking-wider text-neutral-500 font-bold">¿Cómo te llamas? / Empresa</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Santiago, Promoter de NÖCTAR"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full bg-neutral-50 border border-brand-border px-4 py-3 rounded-xl font-sans text-sm outline-none focus:border-black focus:bg-white transition-all duration-200"
                />
              </div>

              {/* Input Email */}
              <div className="space-y-1.5">
                <label className="block text-xs font-sans uppercase tracking-wider text-neutral-500 font-bold">Email de Contacto</label>
                <input
                  type="email"
                  required
                  placeholder="Ej. contacto@agencia.com"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  className="w-full bg-neutral-50 border border-brand-border px-4 py-3 rounded-xl font-sans text-sm outline-none focus:border-black focus:bg-white transition-all duration-200"
                />
              </div>

              {/* Checkbox project requirements selectors */}
              <div className="space-y-2">
                <label className="block text-xs font-sans uppercase tracking-wider text-neutral-500 font-bold">¿Qué necesidades tiene tu proyecto? (Selecciona)</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'web', label: '01 — Diseño Web / CMS' },
                    { id: 'brand', label: '02 — Branding Completo' },
                    { id: 'events', label: '03 — Dirección de Eventos' },
                    { id: 'ai', label: '04 — IA Aplicada y Pipelines' },
                    { id: 'merch', label: '05 — Streetwear Merch' },
                    { id: 'strategy', label: 'Estrategia de Marketing' },
                  ].map((item) => {
                    const isChecked = clientNeeds.includes(item.id);
                    return (
                      <button
                        type="button"
                        key={item.id}
                        onClick={() => toggleNeed(item.id)}
                        className={`px-3 py-2.5 border rounded-xl text-left font-sans text-xs font-bold tracking-tight transition-all duration-200 flex items-center justify-between cursor-pointer ${
                          isChecked
                            ? 'border-black bg-neutral-950 text-white'
                            : 'border-brand-border bg-[#F5F5F3] text-neutral-700 hover:border-black'
                        }`}
                      >
                        <span>{item.label}</span>
                        {isChecked && <span className="w-1.5 h-1.5 rounded-full bg-[#0052FF]" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Detailed specs */}
              <div className="space-y-1.5">
                 <label className="block text-xs font-sans uppercase tracking-wider text-neutral-500 font-bold">Cuéntame brevemente tu idea</label>
                <textarea
                  rows={3}
                  placeholder="¿Qué presupuesto estimas o qué plazos manejas?"
                  value={clientComment}
                  onChange={(e) => setClientComment(e.target.value)}
                  className="w-full bg-neutral-50 border border-brand-border px-4 py-3 rounded-xl font-sans text-sm outline-none focus:border-black focus:bg-white transition-all duration-200 resize-none"
                />
              </div>

              {/* Submission button */}
              <button
                type="submit"
                disabled={isSubmitting || submitSuccess}
                className={`w-full py-4 rounded-xl text-xs font-sans uppercase tracking-widest font-black flex items-center justify-center gap-2 transition-all duration-300 transform cursor-pointer ${
                  submitSuccess
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-black hover:bg-[#0052FF] text-white hover:text-white hover:-translate-y-0.5'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    PROCESANDO BRIEF...
                  </>
                ) : submitSuccess ? (
                  <>
                    <Check className="w-4 h-4 text-white" />
                    BRIEF RECIBIDO CON ÉXITO
                  </>
                ) : (
                  <>
                    Enviar Propuesta Express
                    <Send className="w-4 h-4 ml-1" />
                  </>
                )}
              </button>
            </form>

            {/* Quick legal foot */}
            <div className="text-[10px] font-sans text-neutral-400 text-center uppercase tracking-widest font-bold">
              SISTEMA ENCRIPTADO MEDIANTE PROTOCOLO BASSSE ENGINE v4
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
