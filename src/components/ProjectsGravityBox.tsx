import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { RefreshCw, Maximize2, Minimize2, Radio } from 'lucide-react';

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

interface PhysicsBody {
  id: string;
  imgUrl: string;
  alt: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  angle: number;
  angularVelocity: number;
  radius: number;
  width: number;
  height: number;
  mass: number;
  imgElement?: HTMLImageElement;
  loaded: boolean;
  isWhiteLogo?: boolean;
}

export default function ProjectsGravityBox() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [status, setStatus] = useState<'IDLE' | 'DRAGGING' | 'COLLIDING' | 'WEIGHTLESS'>('IDLE');
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Maintain reference of bodies
  const bodiesRef = useRef<PhysicsBody[]>([]);
  const isDraggingRef = useRef<boolean>(false);
  const selectedBodyRef = useRef<PhysicsBody | null>(null);
  const mouseRef = useRef<{ x: number; y: number; prevX: number; prevY: number; vx: number; vy: number }>({
    x: 0,
    y: 0,
    prevX: 0,
    prevY: 0,
    vx: 0,
    vy: 0,
  });

  // Premium design telemetry refs
  const shocksRef = useRef<{ x: number; y: number; radius: number; maxRadius: number; alpha: number }[]>([]);
  const particlesRef = useRef<{ x: number; y: number; vx: number; vy: number; radius: number; alpha: number; color: string }[]>([]);
  const hoveredBodyRef = useRef<PhysicsBody | null>(null);
  const mouseInCanvasRef = useRef<boolean>(false);

  // Initial partner logos metadata with light mode inversion detection to keep contrast perfect
  const LOGO_METADATA = [
    { id: 'logo-azul', src: logoAzul, alt: 'Logo Azul', rawWidth: 160, rawHeight: 60, isWhiteLogo: false },
    { id: 'logo-completo-blanco', src: logoCompletoBlanco, alt: 'BASSSE Logo Blanco', rawWidth: 150, rawHeight: 45, isWhiteLogo: true },
    { id: 'recurso-2', src: recurso2, alt: 'Recurso 2 Agency', rawWidth: 140, rawHeight: 60, isWhiteLogo: false },
    { id: 'logo-blanco-color', src: logoBlancoColor, alt: 'Logo Blanco Color', rawWidth: 130, rawHeight: 50, isWhiteLogo: true },
    { id: 'logo-archaic', src: logoArchaic, alt: 'Archaic Project', rawWidth: 150, rawHeight: 55, isWhiteLogo: true },
    { id: 'logo-quimera-project', src: logoQuimeraProject, alt: 'Quimera Project', rawWidth: 160, rawHeight: 50, isWhiteLogo: false },
    { id: 'center-suites-logo', src: centerSuitesLogo, alt: 'Center Suites', rawWidth: 140, rawHeight: 55, isWhiteLogo: false },
    { id: 'logo-essan', src: logoEssanSinFondo, alt: 'Essan Group', rawWidth: 130, rawHeight: 50, isWhiteLogo: true },
    { id: 'fish-logo', src: fishLogo, alt: 'Fish & Cheese', rawWidth: 130, rawHeight: 50, isWhiteLogo: false }
  ];

  // Spawn/Restart bodies of floating logos within physical canvas bounds
  const initBodies = (cw: number, ch: number) => {
    const bodies: PhysicsBody[] = LOGO_METADATA.map((meta, index) => {
      // Calculate responsive layout scale factors with brand dimension fidelity
      const scale = cw < 640 ? 0.55 : cw < 1024 ? 0.8 : 1.0;
      const finalWidth = meta.rawWidth * scale;
      const finalHeight = meta.rawHeight * scale;
      // Define circular collision boundary radius slightly smaller than bounding box height to avoid overlap glitches
      const radius = Math.max(finalWidth, finalHeight) * 0.48;

      const img = new Image();
      img.src = meta.src;
      img.referrerPolicy = 'no-referrer';
      
      // Calculate a nicely distributed spawn coordinate inside the actual canvas viewport box
      const xMargin = finalWidth * 0.8;
      const yMargin = finalHeight * 0.8;
      const spawnX = xMargin + Math.random() * (cw - xMargin * 2);
      const spawnY = yMargin + Math.random() * (ch - yMargin * 2);

      // Random drifting angular direction
      const randomDirection = Math.random() * Math.PI * 2;
      const randomSpeed = 0.35 + Math.random() * 0.35;

      const body: PhysicsBody = {
        id: meta.id,
        imgUrl: meta.src,
        alt: meta.alt,
        x: spawnX,
        y: spawnY,
        vx: Math.cos(randomDirection) * randomSpeed,
        vy: Math.sin(randomDirection) * randomSpeed,
        angle: (Math.random() * 30 - 15) * (Math.PI / 180),
        angularVelocity: (Math.random() * 0.05 - 0.025) * (Math.PI / 180),
        radius,
        width: finalWidth,
        height: finalHeight,
        mass: radius * 0.12,
        imgElement: img,
        loaded: false,
        isWhiteLogo: meta.isWhiteLogo,
      };

      img.onload = () => {
        body.loaded = true;
        if (img.naturalHeight > 0) {
          const aspect = img.naturalWidth / img.naturalHeight;
          body.height = body.width / aspect;
          body.radius = Math.max(body.width, body.height) * 0.48;
          body.mass = body.radius * 0.12;
        }
      };

      return body;
    });

    bodiesRef.current = bodies;
  };

  // Trigger floating reshuffle
  const handleDropCascade = () => {
    if (!canvasRef.current) return;
    initBodies(canvasRef.current.width, canvasRef.current.height);
  };

  // Set up resize observer & main physics canvas loops
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animFrameId: number;
    let width = containerRef.current?.clientWidth || 800;
    let height = containerRef.current?.clientHeight || 400;

    canvas.width = width;
    canvas.height = height;

    // Build the structural bounding bodies
    initBodies(width, height);

    // Watch resize of bounding elements
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const newW = entry.contentRect.width;
        const newH = containerRef.current?.clientHeight || entry.contentRect.height || 400;
        
        canvas.width = newW;
        canvas.height = newH;
        
        // Scale positions of any existing bodies to avoid dropping out bounds
        const oldW = width;
        const oldH = height;
        
        bodiesRef.current.forEach(b => {
          b.x = (b.x / oldW) * newW;
          if (b.y > 0) {
            b.y = (b.y / oldH) * newH;
          }
          // Adapt scales of bodies to look like true dimensions without deforming
          const scale = newW < 640 ? 0.55 : newW < 1024 ? 0.8 : 1.0;
          const meta = LOGO_METADATA.find(m => m.id === b.id);
          if (meta) {
            b.width = meta.rawWidth * scale;
            if (b.imgElement && b.imgElement.naturalHeight > 0) {
              const aspect = b.imgElement.naturalWidth / b.imgElement.naturalHeight;
              b.height = b.width / aspect;
            } else {
              b.height = meta.rawHeight * scale;
            }
            b.radius = Math.max(b.width, b.height) * 0.48;
            b.mass = b.radius * 0.12;
          }
        });

        width = newW;
        height = newH;
      }
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    // Standard high-fidelity tick updates
    const gravity = 0; // Absolute zero gravity
    const friction = 0.996; // Fluid drift preservation
    const elasticity = 0.82; // Satisfying bouncing elastic collisions

    // Dynamic shock and particle builders
    const createShockwave = (x: number, y: number, maxRad: number) => {
      shocksRef.current.push({
        x,
        y,
        radius: 2,
        maxRadius: maxRad,
        alpha: 0.6,
      });
      for (let k = 0; k < 6; k++) {
        const pAngle = Math.random() * Math.PI * 2;
        const pSpeed = 1.0 + Math.random() * 2.0;
        particlesRef.current.push({
          x,
          y,
          vx: Math.cos(pAngle) * pSpeed,
          vy: Math.sin(pAngle) * pSpeed,
          radius: 1 + Math.random() * 1.5,
          alpha: 0.7,
          color: Math.random() > 0.4 ? '#006BFF' : '#ffffff',
        });
      }
    };

    const tick = () => {
      ctx.clearRect(0, 0, width, height);

      // Track mouse velocity
      mouseRef.current.vx = mouseRef.current.x - mouseRef.current.prevX;
      mouseRef.current.vy = mouseRef.current.y - mouseRef.current.prevY;
      mouseRef.current.prevX = mouseRef.current.x;
      mouseRef.current.prevY = mouseRef.current.y;

      let collidingState = false;

      // Draw premium grid indicators (editorial-tech blueprint aesthetic)
      ctx.strokeStyle = '#0052FF';
      ctx.lineWidth = 0.5;
      
      const gap = 50;
      for (let x = gap; x < width; x += gap) {
        for (let y = gap; y < height; y += gap) {
          ctx.beginPath();
          ctx.globalAlpha = 0.08;
          // Intersection pluses (+)
          ctx.moveTo(x - 3, y);
          ctx.lineTo(x + 3, y);
          ctx.moveTo(x, y - 3);
          ctx.lineTo(x, y + 3);
          ctx.stroke();

          // Subtle digital indicators every few nodes
          if ((x / gap) % 3 === 0 && (y / gap) % 3 === 0) {
            ctx.fillStyle = '#0052FF';
            ctx.font = '5.5px monospace';
            ctx.globalAlpha = 0.15;
            ctx.textAlign = 'left';
            ctx.fillText(`NET.${Math.round(x/10)}.${Math.round(y/10)}`, x + 5, y - 4);
          }
        }
      }
      ctx.globalAlpha = 1.0;

      // Connect close logos with beautiful fine glowing tech lines (Constellation Network Concept)
      const bodies = bodiesRef.current;
      ctx.lineWidth = 0.55;
      for (let i = 0; i < bodies.length; i++) {
        for (let j = i + 1; j < bodies.length; j++) {
          const b1 = bodies[i];
          const b2 = bodies[j];
          const dx = b2.x - b1.x;
          const dy = b2.y - b1.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < 230) {
            const alpha = (1 - dist / 230) * 0.16;
            ctx.strokeStyle = '#0052FF';
            ctx.globalAlpha = alpha;
            ctx.beginPath();
            ctx.moveTo(b1.x, b1.y);
            ctx.lineTo(b2.x, b2.y);
            ctx.stroke();

            // Animated light data digital pulses flowing between node clusters
            ctx.globalAlpha = alpha * 2.2;
            ctx.fillStyle = '#00A3FF';
            const pulseT = ((Date.now() + i * 250) % 2000) / 2000;
            const px = b1.x + dx * pulseT;
            const py = b1.y + dy * pulseT;
            ctx.beginPath();
            ctx.arc(px, py, 1.5, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }
      ctx.globalAlpha = 1.0;

      // Render shock ripples
      ctx.lineWidth = 0.75;
      shocksRef.current.forEach((shock, idx) => {
        shock.radius += (shock.maxRadius - shock.radius) * 0.12;
        shock.alpha *= 0.91;
        if (shock.alpha < 0.01) {
          shocksRef.current.splice(idx, 1);
          return;
        }
        ctx.strokeStyle = '#0052FF';
        ctx.globalAlpha = shock.alpha;
        ctx.beginPath();
        ctx.arc(shock.x, shock.y, shock.radius, 0, Math.PI * 2);
        ctx.stroke();
      });

      // Render micro sparkles trail
      particlesRef.current.forEach((p, idx) => {
        p.x += p.vx;
        p.y += p.vy;
        p.alpha *= 0.96;
        if (p.alpha < 0.02) {
          particlesRef.current.splice(idx, 1);
          return;
        }
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1.0;

      // 1. Move and update drag bounds
      bodies.forEach(b => {
        if (b === selectedBodyRef.current) {
          // Locked to dynamic mouse positioning with micro inertial pull-back spring
          b.vx = (mouseRef.current.x - b.x) * 0.25;
          b.vy = (mouseRef.current.y - b.y) * 0.25;
          b.angularVelocity = mouseRef.current.vx * 0.005; // Soft torque when dragging
          
          // Spawn elegant drag sparkles trail
          if (Math.random() > 0.4) {
            particlesRef.current.push({
              x: b.x + (Math.random() - 0.5) * (b.width * 0.5),
              y: b.y + (Math.random() - 0.5) * (b.height * 0.5),
              vx: (Math.random() - 0.5) * 0.5,
              vy: (Math.random() - 0.5) * 0.5,
              radius: 0.8 + Math.random(),
              alpha: 0.45,
              color: '#0052FF'
            });
          }
        } else {
          // Ambient micro-drift physics
          b.vx *= friction;
          b.vy *= friction;
          b.angularVelocity *= 0.95;

          // Interactive magnetism pull of logos gently towards cursor within range to feel alive
          if (mouseInCanvasRef.current) {
            const mDx = mouseRef.current.x - b.x;
            const mDy = mouseRef.current.y - b.y;
            const mDist = Math.sqrt(mDx * mDx + mDy * mDy);
            if (mDist < 150 && mDist > 5) {
              const pullStrength = (1 - mDist / 150) * 0.12;
              b.vx += (mDx / mDist) * pullStrength;
              b.vy += (mDy / mDist) * pullStrength;
              b.angularVelocity += (mDx > 0 ? 0.001 : -0.001) * pullStrength;
            }
          }

          // Maintain perpetual minimal movement
          const speed = Math.sqrt(b.vx * b.vx + b.vy * b.vy);
          const minSpeed = 0.45;
          const maxSpeed = 3.5;
          if (speed < minSpeed) {
            const randomAngle = Math.random() * Math.PI * 2;
            b.vx += Math.cos(randomAngle) * 0.04;
            b.vy += Math.sin(randomAngle) * 0.04;
          } else if (speed > maxSpeed) {
            b.vx *= 0.93;
            b.vy *= 0.93;
          }

          // Upright auto-stabilization spring: guides logos to align straight and horizontal (0 rad)
          const angleDiff = 0 - b.angle;
          b.angularVelocity += angleDiff * 0.035;
        }

        // Cap maximum angular velocity
        b.angularVelocity = Math.max(-0.06, Math.min(0.06, b.angularVelocity));

        b.x += b.vx;
        b.y += b.vy;
        b.angle += b.angularVelocity;

        // 2. Wall containment bounds + bouncy elasticity on all 4 boundaries
        // Left
        if (b.x < b.radius) {
          b.x = b.radius;
          b.vx = -b.vx * elasticity;
          b.angularVelocity += b.vy * 0.001;
          createShockwave(b.x - b.radius, b.y, 40);
        }
        // Right
        if (b.x > width - b.radius) {
          b.x = width - b.radius;
          b.vx = -b.vx * elasticity;
          b.angularVelocity -= b.vy * 0.001;
          createShockwave(b.x + b.radius, b.y, 40);
        }
        // Bottom floor limits
        if (b.y > height - b.radius) {
          b.y = height - b.radius;
          b.vy = -b.vy * elasticity;
          b.angularVelocity += b.vx * 0.001;
          createShockwave(b.x, b.y + b.radius, 40);
        }
        // Top ceiling limits
        if (b.y < b.radius) {
          b.y = b.radius;
          b.vy = -b.vy * elasticity;
          b.angularVelocity -= b.vx * 0.001;
          createShockwave(b.x, b.y - b.radius, 40);
        }
      });

      // 3. Inter-body collision checks and spring resolutions
      for (let i = 0; i < bodies.length; i++) {
        for (let j = i + 1; j < bodies.length; j++) {
          const b1 = bodies[i];
          const b2 = bodies[j];

          const dx = b2.x - b1.x;
          const dy = b2.y - b1.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const minDist = b1.radius + b2.radius;

          if (dist < minDist && dist > 1) {
            collidingState = true;

            // Resolve overlapping pushes immediately
            const overlap = minDist - dist;
            const pushX = (dx / dist) * overlap * 0.5;
            const pushY = (dy / dist) * overlap * 0.5;

            if (b1 !== selectedBodyRef.current) {
              b1.x -= pushX;
              b1.y -= pushY;
            }
            if (b2 !== selectedBodyRef.current) {
              b2.x += pushX;
              b2.y += pushY;
            }

            // Normal and tangent coordinate vectors
            const nx = dx / dist;
            const ny = dy / dist;
            const tx = -ny;
            const ty = nx;

            // Project velocities to 1D
            const v1n = b1.vx * nx + b1.vy * ny;
            const v1t = b1.vx * tx + b1.vy * ty;
            const v2n = b2.vx * nx + b2.vy * ny;
            const v2t = b2.vx * tx + b2.vy * ty;

            // Rel normal speed
            const normalRelSpeed = v1n - v2n;

            // Resolve only if they approach
            if (normalRelSpeed > 0) {
              // Elastic rigid body formula
              const m1 = b1.mass;
              const m2 = b2.mass;
              
              const p = (2 * normalRelSpeed) / (m1 + m2);
              
              const v1n_after = v1n - p * m2;
              const v2n_after = v2n + p * m1;

              b1.vx = v1n_after * nx + v1t * tx;
              b1.vy = v1n_after * ny + v1t * ty;
              b2.vx = v2n_after * nx + v2t * tx;
              b2.vy = v2n_after * ny + v2t * ty;

              // Give custom torque feedback on colliding (highly dampened)
              const impulseTorque = normalRelSpeed * 0.002;
              b1.angularVelocity -= impulseTorque;
              b2.angularVelocity += impulseTorque;

              // Collision burst ripple
              if (normalRelSpeed > 0.6) {
                createShockwave((b1.x + b2.x) / 2, (b1.y + b2.y) / 2, 30);
              }
            }
          }
        }
      }

      // Update real-time status telemetry
      if (selectedBodyRef.current) {
        setStatus('DRAGGING');
      } else if (collidingState) {
        setStatus('COLLIDING');
      } else {
        setStatus('WEIGHTLESS');
      }

      // 4. Render the current graphics frame
      bodies.forEach(b => {
        ctx.save();
        ctx.translate(b.x, b.y);
        ctx.rotate(b.angle);

        // Highlight dragging selection in active color
        const isDraggingThis = b === selectedBodyRef.current;

        const rX = -b.width / 2;
        const rY = -b.height / 2;

        // Draw glowing neon subtle aura around logo when dragging
        if (isDraggingThis) {
          ctx.shadowColor = '#0052FF';
          ctx.shadowBlur = 12;
          ctx.shadowOffsetX = 0;
          ctx.shadowOffsetY = 0;

          ctx.strokeStyle = 'rgba(0, 82, 255, 0.45)';
          ctx.lineWidth = 1.0;
          ctx.beginPath();
          ctx.arc(0, 0, b.radius, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Draw genuine partner image with exact proportions and premium filters
        if (b.imgElement && b.loaded) {
          ctx.globalAlpha = 1.0;
          ctx.filter = 'none';
          ctx.drawImage(b.imgElement, rX, rY, b.width, b.height);
        } else {
          // Fallback label in clean monospace brand font
          ctx.fillStyle = '#0052FF';
          ctx.font = 'bold 9px monospace';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(b.alt.toUpperCase(), 0, 0);
        }

        // Reset dynamic shadow effects
        ctx.shadowBlur = 0;

        ctx.restore();
      });

      // 5. Draw a premium high-tech hover label box near closest body (Radar detail)
      if (hoveredBodyRef.current && hoveredBodyRef.current !== selectedBodyRef.current) {
        const hb = hoveredBodyRef.current;
        ctx.save();
        ctx.translate(hb.x, hb.y);
        
        ctx.strokeStyle = 'rgba(0, 107, 255, 0.45)';
        ctx.lineWidth = 0.55;
        ctx.globalAlpha = 0.9;

        // Circular ticks around logo radius
        const offset = hb.radius + 12;
        const len = 6;
        
        // Top-left
        ctx.beginPath();
        ctx.moveTo(-offset, -offset + len);
        ctx.lineTo(-offset, -offset);
        ctx.lineTo(-offset + len, -offset);
        ctx.stroke();

        // Top-right
        ctx.beginPath();
        ctx.moveTo(offset, -offset + len);
        ctx.lineTo(offset, -offset);
        ctx.lineTo(offset - len, -offset);
        ctx.stroke();

        // Bottom-left
        ctx.beginPath();
        ctx.moveTo(-offset, offset - len);
        ctx.lineTo(-offset, offset);
        ctx.lineTo(-offset + len, offset);
        ctx.stroke();

        // Bottom-right
        ctx.beginPath();
        ctx.moveTo(offset, offset - len);
        ctx.lineTo(offset, offset);
        ctx.lineTo(offset - len, offset);
        ctx.stroke();

        // Monospace tech readout panel parallel to node
        ctx.fillStyle = '#0077FF';
        ctx.font = '7px monospace';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.globalAlpha = 0.85;
        
        const textX = offset + 8;
        ctx.fillText(`SYS.NODE  : [${Math.round(hb.x)}x${Math.round(hb.y)}]`, textX, -11);
        ctx.fillText(`ID_TAG    : ${hb.alt.toUpperCase()}`, textX, -1);
        ctx.fillText(`NODE_STAB : SECURE // ACTIVE`, textX, 9);

        ctx.restore();
      }

      // 6. Draw visual tracking radar around mouse pointer actual coordinates
      if (mouseInCanvasRef.current && !selectedBodyRef.current) {
        ctx.save();
        ctx.translate(mouseRef.current.x, mouseRef.current.y);
        ctx.strokeStyle = '#006BFF';
        ctx.globalAlpha = 0.22;
        ctx.lineWidth = 0.5;

        // Center crosshairs
        ctx.beginPath();
        ctx.moveTo(-8, 0);
        ctx.lineTo(8, 0);
        ctx.moveTo(0, -8);
        ctx.lineTo(0, 8);
        ctx.stroke();

        // Tracking circular rings scale animation
        ctx.beginPath();
        ctx.arc(0, 0, 15, 0, Math.PI * 2);
        ctx.stroke();

        ctx.font = '6px monospace';
        ctx.fillStyle = '#006BFF';
        ctx.textAlign = 'left';
        ctx.fillText(`RADAR // ${Math.round(mouseRef.current.x)},${Math.round(mouseRef.current.y)}`, 19, 3);
        ctx.restore();
      }

      animFrameId = requestAnimationFrame(tick);
    };

    animFrameId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(animFrameId);
      resizeObserver.disconnect();
    };
  }, [isFullscreen]);

  // Handle pointer down (mouse and touch compatibility)
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Check hit over any body
    const bodies = bodiesRef.current;
    for (let i = bodies.length - 1; i >= 0; i--) {
      const b = bodies[i];
      const dx = x - b.x;
      const dy = y - b.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Hit matches if it falls inside bounding radius or box area
      if (dist < b.radius + 15 || (Math.abs(dx) < b.width/2 && Math.abs(dy) < b.height/2)) {
        selectedBodyRef.current = b;
        isDraggingRef.current = true;
        canvas.setPointerCapture(e.pointerId);

        mouseRef.current.x = x;
        mouseRef.current.y = y;
        mouseRef.current.prevX = x;
        mouseRef.current.prevY = y;
        break;
      }
    }
  };

  // Handle dynamic pointer moves
  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    mouseRef.current.x = x;
    mouseRef.current.y = y;
    mouseInCanvasRef.current = true;

    if (!isDraggingRef.current) {
      let closestBody: PhysicsBody | null = null;
      let minDist = 120;
      const bodies = bodiesRef.current;
      for (const b of bodies) {
        const dx = x - b.x;
        const dy = y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < minDist && b.loaded) {
          minDist = dist;
          closestBody = b;
        }
      }
      hoveredBodyRef.current = closestBody;
    }
  };

  // Handle drag completion (and release of mouse-tossed force forces)
  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDraggingRef.current) return;
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.releasePointerCapture(e.pointerId);
    }

    if (selectedBodyRef.current) {
      // Release client element with thrown velocity bounds
      const b = selectedBodyRef.current;
      b.vx = Math.min(12, Math.max(-12, mouseRef.current.vx * 0.8));
      b.vy = Math.min(12, Math.max(-12, mouseRef.current.vy * 0.8));
    }

    selectedBodyRef.current = null;
    isDraggingRef.current = false;
  };

  return (
    <div 
      ref={containerRef}
      className="absolute inset-0 w-full h-full overflow-hidden bg-transparent border-none pointer-events-auto"
    >
      {/* 1. Canvas Screen */}
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerEnter={() => { mouseInCanvasRef.current = true; }}
        onPointerLeave={() => { mouseInCanvasRef.current = false; hoveredBodyRef.current = null; }}
        className="block cursor-grab active:cursor-grabbing w-full h-full select-none"
      />

      {/* 4. Controls HUD Console bar - BOTTOM OVERLAY */}
      <div className="absolute bottom-6 right-6 z-10 flex items-center justify-end pointer-events-none">
        {/* UI Control Buttons block */}
        <div className="flex items-center pointer-events-auto">
          {/* Re-deploy/Scatter Logos button */}
          <button
            onClick={handleDropCascade}
            title="Mezclar y relanzar logos flotantes"
            className="flex items-center gap-1.5 px-4.5 py-2.5 rounded-full font-sans text-[9px] tracking-[0.16em] font-extrabold uppercase bg-black hover:bg-[#0052FF] text-white border border-transparent transition-all duration-300 shadow-md cursor-pointer hover:scale-103 active:scale-97"
          >
            <RefreshCw className="w-3 h-3 group-hover:rotate-180 transition-transform duration-500" />
            MEZCLAR LOGOS
          </button>
        </div>
      </div>
    </div>
  );
}
