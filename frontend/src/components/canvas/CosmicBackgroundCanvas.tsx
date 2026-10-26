import React, { useEffect, useRef } from 'react';

interface CosmicBackgroundCanvasProps {
  className?: string;
  density?: number;
}

export const CosmicBackgroundCanvas: React.FC<CosmicBackgroundCanvasProps> = ({
  className = '',
  density = 65,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Respect reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    const isMobile = width < 768;

    // Mouse tracking for reactive gravity (desktop only)
    let mouseX = -1000;
    let mouseY = -1000;

    const handlePointerMove = (e: PointerEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    if (!isMobile) {
      window.addEventListener('pointermove', handlePointerMove, { passive: true });
    }

    // Particle definition
    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      baseAlpha: number;
      alpha: number;
      color: string;
      depth: number;
    }

    const particles: Particle[] = [];
    const maxDensity = isMobile ? Math.min(density, 20) : density;
    const count = Math.min(Math.floor((width * height) / 22000), maxDensity);

    const colors = [
      'rgba(244, 199, 107, ', // Gold
      'rgba(56, 189, 248, ',  // Sapphire
      'rgba(255, 255, 255, ',  // White Starlight
    ];

    for (let i = 0; i < count; i++) {
      const depth = Math.random() * 0.8 + 0.2;
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.25 * depth,
        vy: (Math.random() - 0.5) * 0.25 * depth,
        radius: (Math.random() * 1.4 + 0.5) * depth,
        baseAlpha: Math.random() * 0.45 + 0.2,
        alpha: 0,
        color: colors[Math.floor(Math.random() * colors.length)],
        depth,
      });
    }

    // Resize handler
    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize, { passive: true });

    // Visibility change handler (pause when tab hidden)
    let isTabVisible = true;
    const handleVisibilityChange = () => {
      isTabVisible = document.visibilityState === 'visible';
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // If user prefers reduced motion, draw a single static starfield and stop
    if (prefersReducedMotion) {
      ctx.clearRect(0, 0, width, height);
      const isDark = document.documentElement.classList.contains('dark');
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const alpha = isDark ? p.baseAlpha : p.baseAlpha * 0.5;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${alpha})`;
        ctx.fill();
      }
      return () => {
        window.removeEventListener('resize', handleResize);
        document.removeEventListener('visibilitychange', handleVisibilityChange);
      };
    }

    // Animation Loop
    let lastTime = performance.now();

    const render = (time: number) => {
      animationFrameId = requestAnimationFrame(render);

      if (!isTabVisible) return;

      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      ctx.clearRect(0, 0, width, height);
      const isDark = document.documentElement.classList.contains('dark');

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Cosmic Drift
        p.x += p.vx * 60 * dt;
        p.y += p.vy * 60 * dt;

        // Wrap around boundaries
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        let auraAlpha = p.baseAlpha;
        if (!isMobile && mouseX > 0) {
          const dx = mouseX - p.x;
          const dy = mouseY - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 160) {
            const factor = (160 - dist) / 160;
            p.x -= (dx / dist) * factor * 1.5;
            p.y -= (dy / dist) * factor * 1.5;
            auraAlpha = Math.min(p.baseAlpha + factor * 0.5, 0.95);
          }
        }

        // Render Particle Star
        const alpha = isDark ? auraAlpha : auraAlpha * 0.55;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${alpha})`;
        ctx.fill();

        // Constellation link to nearby particles (desktop only for 60fps smoothness)
        if (!isMobile) {
          for (let j = i + 1; j < particles.length; j++) {
            const p2 = particles[j];
            const distBetween = Math.hypot(p.x - p2.x, p.y - p2.y);
            if (distBetween < 85) {
              const lineAlpha = (1 - distBetween / 85) * (isDark ? 0.12 : 0.07);
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.strokeStyle = isDark
                ? `rgba(244, 199, 107, ${lineAlpha})`
                : `rgba(23, 54, 93, ${lineAlpha})`;
              ctx.lineWidth = 0.5;
              ctx.stroke();
            }
          }
        }
      }
    };

    // Stagger start slightly to let the initial frame paint instantly
    const timer = setTimeout(() => {
      animationFrameId = requestAnimationFrame(render);
    }, 100);

    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(animationFrameId);
      if (!isMobile) {
        window.removeEventListener('pointermove', handlePointerMove);
      }
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [density]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none z-0 transition-opacity duration-1000 ${className}`}
      aria-hidden="true"
    />
  );
};
