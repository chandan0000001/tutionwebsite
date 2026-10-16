import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

/**
 * Global helper to trigger page navigation through the staircase transition
 */
export const navigateWithTransition = (path: string, state?: unknown) => {
  window.dispatchEvent(
    new CustomEvent('page-transition-navigate', { detail: { path, state } })
  );
};

/**
 * 🪜 STAIRCASE PAGE TRANSITION LOADER
 *
 * Behavior:
 * 1. User clicks any internal navigation link or calls navigateWithTransition.
 * 2. Current page remains visible as 5 columns cascade down sequentially from top to cover the screen.
 * 3. Once fully covered (status = 'covered'):
 *    - navigate(targetPath) is called to swap the route.
 *    - window.scrollTo({ top: 0, behavior: 'instant' }) resets scroll.
 *    - Because all pages are statically imported, the target page renders synchronously behind the covered screen.
 * 4. A brief layout/paint hold (120ms) ensures the browser has rendered and painted the new page.
 * 5. The 5 columns cascade downwards (status = 'revealing'), unveiling the already-mounted target page!
 * 6. When the cascade reaches the bottom, status resets to 'idle'.
 * 7. Adapts cleanly to Light Mode & Dark Mode with no bulky boxed containers.
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
      if (targetPath === location.pathname) return;

      isNavigatingRef.current = true;
      clearAllTimeouts();
      setStatus('covering');

      // 1. Wait for all 5 columns to cascade down and cover the screen
      // (Col 0: 0.32s, Col 4: 0.16s delay + 0.32s = 0.48s)
      const tCover = setTimeout(() => {
        // Screen is now 100% covered!
        setStatus('covered');

        // 2. WHILE 100% COVERED: Navigate to the target page!
        navigate(targetPath, { state });
        window.scrollTo({ top: 0, behavior: 'instant' });

        // 3. Generous hold (120ms) while completely covered to guarantee React commits and DOM paints
        const tHold = setTimeout(() => {
          // 4. Reveal the new page by cascading columns downwards
          setStatus('revealing');

          // 5. Complete reveal animation (0.16s + 0.32s = 0.48s)
          const tReveal = setTimeout(() => {
            setStatus('idle');
            isNavigatingRef.current = false;
          }, 480);
          timeoutsRef.current.push(tReveal);
        }, 120);
        timeoutsRef.current.push(tHold);
      }, 480);
      timeoutsRef.current.push(tCover);
    },
    [location.pathname, navigate]
  );

  // Intercept all internal navigation link clicks
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

    // Custom programmatic navigation event listener
    const handleCustomNav = (e: Event) => {
      const customEvent = e as CustomEvent<{ path: string; state?: unknown }>;
      if (customEvent.detail?.path) {
        startTransition(customEvent.detail.path, customEvent.detail.state);
      }
    };

    document.addEventListener('click', handleLinkClick, { capture: true });
    window.addEventListener('page-transition-navigate', handleCustomNav);

    return () => {
      document.removeEventListener('click', handleLinkClick, { capture: true });
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
            className="w-full h-full object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default StairsTransition;
