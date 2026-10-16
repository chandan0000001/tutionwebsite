import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * 🪜 STAIRCASE PAGE TRANSITION LOADER
 * Inspired by modern motion designs (as requested from reference video):
 * 5 vertical columns slide down with a staggered delay to cover the screen,
 * and then slide down out of view with the same stagger to reveal the newly loaded page.
 */
export const StairsTransition: React.FC = () => {
  const location = useLocation();
  // Status: 'idle' | 'covering' | 'covered' | 'revealing'
  const [status, setStatus] = useState<'idle' | 'covering' | 'covered' | 'revealing'>('covering');
  const prevPathRef = useRef<string>(location.pathname);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearAllTimeouts = () => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  };

  const runTransition = () => {
    clearAllTimeouts();
    setStatus('covering');

    // After columns cover the screen (~580ms)
    const t1 = setTimeout(() => {
      setStatus('covered');
      window.scrollTo({ top: 0, behavior: 'instant' });

      // Start revealing the new page after a brief pause
      const t2 = setTimeout(() => {
        setStatus('revealing');

        // Finish transition and set to idle
        const t3 = setTimeout(() => {
          setStatus('idle');
        }, 600);
        timeoutsRef.current.push(t3);
      }, 120);
      timeoutsRef.current.push(t2);
    }, 580);
    timeoutsRef.current.push(t1);
  };

  // Run on initial mount
  useEffect(() => {
    const t1 = setTimeout(() => {
      setStatus('covered');
      window.scrollTo({ top: 0, behavior: 'instant' });

      const t2 = setTimeout(() => {
        setStatus('revealing');

        const t3 = setTimeout(() => {
          setStatus('idle');
        }, 600);
        timeoutsRef.current.push(t3);
      }, 120);
      timeoutsRef.current.push(t2);
    }, 580);
    timeoutsRef.current.push(t1);

    return () => clearAllTimeouts();
  }, []);

  // Run on subsequent route changes
  useEffect(() => {
    if (prevPathRef.current !== location.pathname) {
      prevPathRef.current = location.pathname;
      runTransition();
    }
  }, [location.pathname]);

  if (status === 'idle') {
    return null;
  }

  const columns = [0, 1, 2, 3, 4];

  return (
    <div
      className={`fixed inset-0 z-[99999] overflow-hidden pointer-events-none select-none`}
      aria-hidden="true"
    >
      {/* 5 Vertical Staircase Columns */}
      {columns.map((index) => {
        const delay = index * 0.055; // 0s, 0.055s, 0.11s, 0.165s, 0.22s

        let animationClass = '';
        if (status === 'covering') {
          animationClass = 'animate-stairs-cover';
        } else if (status === 'covered') {
          animationClass = 'translate-y-0';
        } else if (status === 'revealing') {
          animationClass = 'animate-stairs-reveal';
        }

        return (
          <div
            key={index}
            className={`absolute top-0 bottom-0 h-full bg-[#0F172A] dark:bg-[#090D16] border-r border-slate-800/40 shadow-2xl transition-transform ${animationClass}`}
            style={{
              left: `${index * 20}%`,
              width: '20.2%', // slight overlap to prevent subpixel hairline gap
              animationDelay: `${delay}s`,
              animationDuration: '0.38s',
              animationFillMode: 'forwards',
              animationTimingFunction: 'cubic-bezier(0.76, 0, 0.24, 1)',
            }}
          />
        );
      })}

      {/* Central Brand Badge during Cover */}
      <div
        className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-300 z-10 ${
          status === 'covering' || status === 'covered'
            ? 'opacity-100 scale-100'
            : 'opacity-0 scale-95 pointer-events-none'
        }`}
      >
        <div className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-[#172033]/90 dark:bg-[#111827]/90 border border-[#C6922E]/40 dark:border-[#F4C76B]/40 shadow-2xl backdrop-blur-md">
          <div className="w-14 h-14 rounded-full bg-slate-900/80 p-2 flex items-center justify-center border-2 border-[#C6922E] dark:border-[#F4C76B] shadow-lg animate-pulse">
            <img
              src="/logo_transparent.png"
              alt="Antariksh Academy Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <div className="flex flex-col items-center text-center">
            <span className="font-display font-black text-lg tracking-wider text-white">
              ANTARIKSH <span className="gold-gradient-text">ACADEMY</span>
            </span>
            <span className="text-[10px] text-slate-300 dark:text-[#AAB4C3] tracking-widest uppercase font-semibold mt-1">
              Bijipur, Brahmapur • Excellence in +2 & Entrances
            </span>
          </div>
          {/* Subtle loading line */}
          <div className="w-32 h-1 bg-slate-800 rounded-full overflow-hidden mt-1">
            <div className="h-full bg-gradient-to-r from-[#C6922E] via-[#F4C76B] to-[#C6922E] animate-pulse w-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StairsTransition;
