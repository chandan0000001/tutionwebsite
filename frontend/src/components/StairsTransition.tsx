import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { preloadRoute, navigateWithTransition } from '../utils/navigation';

export { navigateWithTransition, preloadRoute };

/**
 * 🪜 STAIRCASE PAGE TRANSITION LOADER
 *
 * Behavior:
 * 1. User clicks any internal navigation link or calls navigateWithTransition.
 * 2. Preloading begins immediately at t = 0ms while columns are dropping down.
 * 3. 5 columns cascade down sequentially from top to cover the screen (480ms).
 * 4. Once fully covered (status = 'covered'):
 *    - Route chunk is guaranteed resolved.
 *    - navigate(targetPath) is called to swap the route.
 *    - window.scrollTo({ top: 0, behavior: 'instant' }) resets scroll.
 *    - Double requestAnimationFrame ensures React commits and the browser paints.
 * 5. The 5 columns cascade downwards (status = 'revealing'), unveiling the already-mounted target page!
 * 6. When the cascade reaches the bottom, status resets to 'idle'.
 */
export const StairsTransition: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Status: 'idle' | 'covering' | 'covered' | 'revealing'
  // On initial site load, reveal the homepage smoothly
  const [status, setStatus] = useState<'idle' | 'covering' | 'covered' | 'revealing'>('revealing');
  const isNavigatingRef = useRef(false);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearAllTimeouts = () => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  };

  // Initial site load reveal
  useEffect(() => {
    const t = setTimeout(() => {
      setStatus('idle');
    }, 480);
    timeoutsRef.current.push(t);

    return () => clearAllTimeouts();
  }, []);

  const startTransition = useCallback(
    (targetPath: string, state?: unknown) => {
      if (isNavigatingRef.current) return;
      const cleanTarget = targetPath.split('#')[0];
      if (cleanTarget === location.pathname) return;

      isNavigatingRef.current = true;
      clearAllTimeouts();
      setStatus('covering');

      // 1. Immediately kick off preload at t = 0ms while stairs are covering
      const preloadPromise = preloadRoute(cleanTarget);

      // 2. Wait for all 5 columns to cascade down and cover the screen
      // (Col 0: 0.32s, Col 4: 0.16s delay + 0.32s = 0.48s)
      const tCover = setTimeout(async () => {
        setStatus('covered');

        // Await chunk preload with fallback so it never hangs
        try {
          await Promise.race([
            preloadPromise,
            new Promise((resolve) => setTimeout(resolve, 800)),
          ]);
        } catch {
          // Preload errors handled gracefully
        }

        // 3. WHILE 100% COVERED: Navigate to the target page!
        navigate(targetPath, { state });
        window.scrollTo({ top: 0, behavior: 'instant' });

        // 4. Double rAF guarantees React 18 has committed new DOM tree and browser has painted
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            const tHold = setTimeout(() => {
              // 5. Reveal the new page by cascading columns downwards
              setStatus('revealing');

              // 6. Complete reveal animation (0.16s + 0.32s = 0.48s)
              const tReveal = setTimeout(() => {
                setStatus('idle');
                isNavigatingRef.current = false;
              }, 480);
              timeoutsRef.current.push(tReveal);
            }, 60);
            timeoutsRef.current.push(tHold);
          });
        });
      }, 480);
      timeoutsRef.current.push(tCover);
    },
    [location.pathname, navigate]
  );

  // Intercept all internal navigation link clicks & hover preloading
  useEffect(() => {
    const handleLinkClick = (e: MouseEvent) => {
      const link = (e.target as HTMLElement).closest('a');
      if (!link) return;

      const href = link.getAttribute('href');
      const target = link.getAttribute('target');

      // Ignore external, blank, hash, tel, mailto, or download links
      if (
        !href ||
        target === '_blank' ||
        href.startsWith('http://') ||
        href.startsWith('https://') ||
        href.startsWith('//') ||
        href.startsWith('#') ||
        href.startsWith('tel:') ||
        href.startsWith('mailto:') ||
        link.hasAttribute('download')
      ) {
        return;
      }

      // Ignore if user is opening in new tab via modifier keys or middle click
      if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey || e.button !== 0) {
        return;
      }

      // If it's an internal route starting with '/'
      if (href.startsWith('/')) {
        const [targetPath, targetHash] = href.split('#');

        // Same path without hash -> do nothing
        if (targetPath === location.pathname && !targetHash) {
          e.preventDefault();
          return;
        }

        // Same path with hash -> anchor scroll within page, don't play stairs
        if (targetPath === location.pathname && targetHash) {
          return;
        }

        e.preventDefault();
        startTransition(href);
      }
    };

    // Preload chunk on hover/touch for instant response
    const handleLinkHover = (e: MouseEvent) => {
      const link = (e.target as HTMLElement).closest('a');
      if (!link) return;
      const href = link.getAttribute('href');
      if (href && href.startsWith('/') && !href.startsWith('//')) {
        preloadRoute(href);
      }
    };

    // Custom programmatic navigation event listener
    const handleCustomNav = (e: Event) => {
      const customEvent = e as CustomEvent<{ path: string; state?: unknown }>;
      if (customEvent.detail?.path) {
        startTransition(customEvent.detail.path, customEvent.detail.state);
      }
    };

    document.addEventListener('click', handleLinkClick, { capture: true });
    document.addEventListener('mouseover', handleLinkHover, { passive: true });
    window.addEventListener('page-transition-navigate', handleCustomNav);

    return () => {
      document.removeEventListener('click', handleLinkClick, { capture: true });
      document.removeEventListener('mouseover', handleLinkHover);
      window.removeEventListener('page-transition-navigate', handleCustomNav);
    };
  }, [location.pathname, startTransition]);

  // Handle browser Back / Forward navigation (popstate)
  useEffect(() => {
    const handlePopState = () => {
      setStatus('revealing');
      const tEnd = setTimeout(() => {
        setStatus('idle');
      }, 480);
      timeoutsRef.current.push(tEnd);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  if (status === 'idle') {
    return null;
  }

  const columns = [0, 1, 2, 3, 4];

  return (
    <div
      className="fixed inset-0 z-[999999] overflow-hidden select-none"
      style={{
        pointerEvents: status === 'revealing' ? 'none' : 'auto',
      }}
      aria-hidden="true"
    >
      {/* 5 Cascading Staircase Columns */}
      {columns.map((index) => {
        const delay = index * 0.04; // 0s, 0.04s, 0.08s, 0.12s, 0.16s

        let animationClass = '';
        if (status === 'covering') {
          animationClass = 'animate-stairs-cover';
        } else if (status === 'covered') {
          animationClass = 'stairs-covered';
        } else if (status === 'revealing') {
          animationClass = 'animate-stairs-reveal';
        }

        return (
          <div
            key={index}
            className={`absolute top-0 bottom-0 h-full bg-white dark:bg-[#0B1120] border-r border-slate-200/80 dark:border-slate-800/40 border-b-4 border-b-[#C6922E] dark:border-b-[#F4C76B] border-t-4 border-t-[#C6922E] dark:border-t-[#F4C76B] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15)] dark:shadow-2xl ${animationClass}`}
            style={{
              left: `${index * 20}%`,
              width: '20.2%', // slight overlap prevents subpixel hairline gap
              animationDelay: `${delay}s`,
              animationDuration: '0.32s',
              animationFillMode: 'both',
              animationTimingFunction: 'cubic-bezier(0.76, 0, 0.24, 1)',
            }}
          />
        );
      })}

      {/* Floating Center Brand Emblem */}
      <div
        className={`absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-200 z-10 pointer-events-none ${
          status === 'covering' || status === 'covered' ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white/95 dark:bg-slate-900/95 p-2 flex items-center justify-center border-2 border-[#C6922E] dark:border-[#F4C76B] shadow-xl shadow-amber-500/15 dark:shadow-amber-500/25 backdrop-blur-md animate-pulse">
          <img
            src="/logo_transparent.png"
            alt="Antariksh Academy"
            width="56"
            height="56"
            decoding="async"
            className="w-full h-full object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default StairsTransition;
