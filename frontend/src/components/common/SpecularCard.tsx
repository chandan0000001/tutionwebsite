import React, { useRef } from 'react';

interface SpecularCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: 'gold' | 'blue' | 'emerald';
  tilt?: boolean;
  onClick?: () => void;
  'data-sound'?: string;
}

export const SpecularCard: React.FC<SpecularCardProps> = React.memo(({
  children,
  className = '',
  glowColor = 'gold',
  tilt = true,
  onClick,
  'data-sound': dataSound,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);

    if (glowRef.current) {
      glowRef.current.style.opacity = '1';
    }

    if (tilt) {
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      // Max 4 degrees tilt for subtle luxury feel
      const rotateX = ((y - centerY) / centerY) * -3.5;
      const rotateY = ((x - centerX) / centerX) * 3.5;

      card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.01, 1.01, 1.01)`;
    }
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;

    if (glowRef.current) {
      glowRef.current.style.opacity = '0';
    }
    if (tilt) {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    }
  };

  const getGlowGradient = () => {
    switch (glowColor) {
      case 'blue':
        return 'radial-gradient(400px circle at var(--mouse-x, -1000px) var(--mouse-y, -1000px), rgba(56, 189, 248, 0.16), transparent 70%)';
      case 'emerald':
        return 'radial-gradient(400px circle at var(--mouse-x, -1000px) var(--mouse-y, -1000px), rgba(52, 211, 153, 0.16), transparent 70%)';
      case 'gold':
      default:
        return 'radial-gradient(400px circle at var(--mouse-x, -1000px) var(--mouse-y, -1000px), rgba(244, 199, 107, 0.18), transparent 70%)';
    }
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      data-sound={dataSound}
      style={
        {
          transform: tilt ? 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)' : undefined,
          transition: 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.25s ease',
        } as React.CSSProperties
      }
      className={`relative rounded-3xl overflow-hidden bg-white/80 dark:bg-[#111827]/80 backdrop-blur-xl border border-slate-200/90 dark:border-white/10 shadow-lg dark:shadow-2xl shadow-slate-200/50 dark:shadow-black/50 group ${className}`}
    >
      {/* Specular Interactive Glow Layer */}
      <div
        ref={glowRef}
        className="pointer-events-none absolute -inset-px rounded-3xl transition-opacity duration-300 opacity-0"
        style={{
          background: getGlowGradient(),
        }}
        aria-hidden="true"
      />

      {/* Surface content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
});

SpecularCard.displayName = 'SpecularCard';

