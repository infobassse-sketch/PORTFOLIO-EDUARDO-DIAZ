import React, { useEffect, useRef, useState } from 'react';

export default function ManifestoBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mouse, setMouse] = useState({ x: -1000, y: -1000, active: false, radius: 150 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let width = 0;
    let height = 0;

    // Grid coordinates, particles and waveforms
    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      color: string;
      originalX: number;
      originalY: number;
    }

    let particles: Particle[] = [];
    const particleCount = 45;

    // Technical data streams floating subtly in space
    interface TechStrand {
      x: number;
      y: number;
      text: string;
      speed: number;
      opacity: number;
      scale: number;
    }
    let techStrands: TechStrand[] = [];
    const techWords = [
      'BASSSE CORE v4.26',
      'AI_PIPELINE: ACTIVE',
      'TECHNO_FREQ // 128_BPM',
      'BRANDING_ENGINE_OK',
      'FRONTEND_HIGH_END',
      'SEO_PERFECT_100',
      'METRICS_STABLE',
      'CREATIVE_DISRUPTION',
      'LATENCY // 1.2ms',
      'INTERACTIVE_GRID_NODE',
      'BASSSE DIGITAL INTELLIGENCE',
      'COGNITIVE_AUTOMATION',
    ];

    const resize = () => {
      const rect = container.getBoundingClientRect();
      width = rect.width;
      height = rect.height;

      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);

      // Re-init particles on size change if empty, or just reposition
      initElements();
    };

    const initElements = () => {
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        particles.push({
          x,
          y,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          radius: Math.random() * 2 + 1,
          color: i % 5 === 0 ? 'rgba(0, 107, 255, 0.75)' : 'rgba(255, 255, 255, 0.3)',
          originalX: x,
          originalY: y,
        });
      }

      techStrands = [];
      const columnCount = 4;
      for (let i = 0; i < columnCount; i++) {
        techStrands.push({
          x: (width / columnCount) * i + Math.random() * 40 + 30,
          y: Math.random() * height,
          text: techWords[Math.floor(Math.random() * techWords.length)],
          speed: 0.15 + Math.random() * 0.25,
          opacity: 0.12 + Math.random() * 0.18,
          scale: 0.8 + Math.random() * 0.4,
        });
      }
    };

    // Phase values for sound wave frequency synthesis
    let phase1 = 0;
    let phase2 = Math.PI;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. Draw subtle grid backdrop
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.015)';
      ctx.lineWidth = 1;
      const gridSize = 60;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // 2. Cyber glows for ambient depth (Radial blue light orbs)
      // Pulse animation for orbs using slow sine waves
      const orbPulse = Math.sin(Date.now() * 0.0006) * 0.15 + 0.85;
      
      // Orb 1: Blue tech flare (Top Right)
      const gradient1 = ctx.createRadialGradient(width * 0.75, height * 0.25, 10, width * 0.75, height * 0.25, 250 * orbPulse);
      gradient1.addColorStop(0, 'rgba(0, 107, 255, 0.18)');
      gradient1.addColorStop(0.5, 'rgba(0, 119, 255, 0.04)');
      gradient1.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = gradient1;
      ctx.beginPath();
      ctx.arc(width * 0.75, height * 0.25, 250 * orbPulse, 0, Math.PI * 2);
      ctx.fill();

      // Orb 2: Electronic Cyan flare (Bottom Left)
      const gradient2 = ctx.createRadialGradient(width * 0.22, height * 0.75, 10, width * 0.22, height * 0.75, 200 * orbPulse);
      gradient2.addColorStop(0, 'rgba(0, 163, 255, 0.15)');
      gradient2.addColorStop(0.5, 'rgba(0, 82, 255, 0.03)');
      gradient2.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = gradient2;
      ctx.beginPath();
      ctx.arc(width * 0.22, height * 0.75, 200 * orbPulse, 0, Math.PI * 2);
      ctx.fill();

      // 3. Ambient Interactive Mouse Light Sweep
      if (mouse.active) {
        const mouseGradient = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, mouse.radius);
        mouseGradient.addColorStop(0, 'rgba(0, 107, 255, 0.25)');
        mouseGradient.addColorStop(0.3, 'rgba(0, 163, 255, 0.06)');
        mouseGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = mouseGradient;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, mouse.radius, 0, Math.PI * 2);
        ctx.fill();

        // Subtle electric ring around mouse coordinates
        ctx.strokeStyle = 'rgba(0, 107, 255, 0.08)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 35, 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = 'rgba(0, 163, 255, 0.12)';
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 8, 0, Math.PI * 2);
        ctx.stroke();
      }

      // 4. Harmonic Frequency Waves (Techno / Sound signature)
      // Representing electronic culture + data flows
      phase1 += 0.0075;
      phase2 += 0.012;

      ctx.lineWidth = 1.5;
      
      // Wave 1: Deep Blue main wave
      ctx.strokeStyle = 'rgba(0, 107, 255, 0.22)';
      ctx.beginPath();
      for (let x = 0; x < width; x += 3) {
        // Amplitude modulated by section height and width positioning
        const amplitude = Math.sin(x * 0.003) * 35 * Math.sin(Date.now() * 0.0003);
        const y = height * 0.5 + Math.sin(x * 0.009 + phase1) * amplitude;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Wave 2: Sub-frequency secondary line
      ctx.strokeStyle = 'rgba(0, 163, 255, 0.14)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = 0; x < width; x += 4) {
        const amplitude = Math.sin(x * 0.0025 + 2) * 22;
        const y = height * 0.52 + Math.sin(x * 0.015 - phase2) * amplitude;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // 5. Tech letters/words streaming down
      ctx.font = "italic 600 7.5px 'JetBrains Mono', monospace, sans-serif";
      techStrands.forEach((strand) => {
        ctx.fillStyle = `rgba(255, 255, 255, ${strand.opacity})`;
        ctx.fillText(`[ ${strand.text} ]`, strand.x, strand.y);
        
        // Let them crawl downwards gently
        strand.y += strand.speed;
        if (strand.y > height + 20) {
          strand.y = -20;
          strand.x = Math.random() * width;
          strand.text = techWords[Math.floor(Math.random() * techWords.length)];
        }
      });

      // 6. Draw floating core particle network (interactive nodes)
      // Draw lines between nearby particles
      for (let i = 0; i < particles.length; i++) {
        const pi = particles[i];

        // Gently drift particles
        pi.x += pi.vx;
        pi.y += pi.vy;

        // Bounce from boundaries
        if (pi.x < 0 || pi.x > width) pi.vx *= -1;
        if (pi.y < 0 || pi.y > height) pi.vy *= -1;

        // Draw node points
        ctx.fillStyle = pi.color;
        ctx.beginPath();
        // Hover expansion on particles near the cursor
        let activeRadius = pi.radius;
        if (mouse.active) {
          const dx = pi.x - mouse.x;
          const dy = pi.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouse.radius) {
            // Push active nodes slightly away
            const force = (mouse.radius - dist) / mouse.radius;
            pi.x += (dx / dist) * force * 1.5;
            pi.y += (dy / dist) * force * 1.5;
            activeRadius *= (1 + force * 1.8);
            ctx.fillStyle = 'rgba(0, 163, 255, 0.8)';
          }
        }
        
        ctx.arc(pi.x, pi.y, activeRadius, 0, Math.PI * 2);
        ctx.fill();

        // Connect nearby points
        for (let j = i + 1; j < particles.length; j++) {
          const pj = particles[j];
          const dx = pi.x - pj.x;
          const dy = pi.y - pj.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 100) {
            const alpha = (1 - dist / 100) * 0.16;
            ctx.strokeStyle = `rgba(0, 107, 255, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(pi.x, pi.y);
            ctx.lineTo(pj.x, pj.y);
            ctx.stroke();
          }
        }
      }

      animationId = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener('resize', resize);
    draw();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, [mouse]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMouse((prev) => ({
      ...prev,
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      active: true,
    }));
  };

  const handleMouseLeave = () => {
    setMouse((prev) => ({
      ...prev,
      active: false,
    }));
  };

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="absolute inset-0 w-full h-full pointer-events-auto z-0 overflow-hidden bg-black"
    >
      <canvas 
        ref={canvasRef} 
        className="block w-full h-full opacity-90 transition-opacity duration-500"
      />
    </div>
  );
}
