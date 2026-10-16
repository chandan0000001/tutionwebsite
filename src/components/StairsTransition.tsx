import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

/**
 * Global helper to trigger page navigation through the staircase transition
 */
export const navigateWithTransition = (path: string) => {
  window.dispatchEvent(
    new CustomEvent('page-transition-navigate', { detail: { path } })
  );
};

/**
 * 🪜 STAIRCASE PAGE TRANSITION LOADER
 *
 * Behavior:
 * 1. User clicks a link to switch pages.
 * 2. Current page stays visible while 5 columns cascade down in staircase steps to cover the screen.
 * 3. Only when fully covered, the route is changed (navigate) and page scrolls to top.
 * 4. The 5 columns cascade away downwards, revealing the freshly loaded page.
 * 5. Minimalist floating brand icon - NO bulky cards or modal boxes on mobile or desktop.
 */
export const StairsTransition: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Status: 'idle' | 'covering' | 'revealing'
  // On initial site load, reveal the page cleanly
  const [status, setStatus] = useState<'idle' | 'covering' | 'revealing'>('revealing');
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
    (targetPath: string) => {
      if (isNavigatingRef.current) return;
      if (targetPath === location.pathname) return;

      isNavigatingRef.current = true;
      clearAllTimeouts();
      setStatus('covering');

      // 1. Wait for all 5 columns to cascade down and cover the screen (approx 480ms)
      // (Column 0: 0.32s, Col 4: 0.16s delay + 0.32s = 0.48s)
      const tCover = setTimeout(() => {
        // 2. WHILE FULLY COVERED: Navigate to the target page!
        navigate(targetPath);
        window.scrollTo({ top: 0, behavior: 'instant' });

        // 3. Small buffer to allow the new route component to mount
        const tMount = setTimeout(() => {
          setStatus('revealing');

          // 4. Wait for columns to exit downwards (480ms)
          const tReveal = setTimeout(() => {
            setStatus('idle');
            isNavigatingRef.current = false;
          }, 480);
          timeoutsRef.current.push(tReveal);
        }, 80);
        timeoutsRef.current.push(tMount);
      }, 480);
      timeoutsRef.current.push(tCover);
    },
    [location.pathname, navigate]
  );

  // Intercept all internal navigation link clicks
  useEffect(() => {
    const handleLinkClick = (e: MouseEvent) => {
      // Find closest anchor tag
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
        // Same route
        if (href === location.pathname) {
          e.preventDefault();
          return;
        }

        e.preventDefault();
        startTransition(href);
      }
    };

    // Custom programmatic navigation event listener
    const handleCustomNav = (e: Event) => {
      const customEvent = e as CustomEvent<{ path: string }>;
      if (customEvent.detail?.path) {
        startTransition(customEvent.detail.path);
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
      setStatus('covering');
      const t = setTimeout(() => {
        setStatus('revealing');
        const tEnd = setTimeout(() => {
          setStatus('idle');
        }, 480);
        timeoutsRef.current.push(tEnd);
      }, 200);
      timeoutsRef.current.push(t);
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
        pointerEvents: status === 'covering' ? 'auto' : 'none',
      }}
      aria-hidden="true"
    >
      {/* 5 Cascading Staircase Columns */}
      {columns.map((index) => {
        const delay = index * 0.04; // 0s, 0.04s, 0.08s, 0.12s, 0.16s

        let animationClass = '';
        if (status === 'covering') {
          animationClass = 'animate-stairs-cover';
        } else if (status === 'revealing') {
          animationClass = 'animate-stairs-reveal';
        }

        return (
          <div
            key={index}
            className={`absolute top-0 bottom-0 h-full bg-white dark:bg-[#0B1120] border-r border-slate-200/80 dark:border-slate-800/40 border-b-4 border-b-[#C6922E] dark:border-b-[#F4C76B] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15)] dark:shadow-2xl ${animationClass}`}
            style={{
              left: `${index * 20}%`,
              width: '20.2%', // slight overlap prevents subpixel hairline gap
              animationDelay: `${delay}s`,
              animationDuration: '0.32s',
              animationFillMode: 'forwards',
              animationTimingFunction: 'cubic-bezier(0.76, 0, 0.24, 1)',
            }}
          />
        );
      })}

      {/* Floating Center Brand Emblem - Adapts to light/dark mode without any bulky card box */}
      <div
        className={`absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-200 z-10 pointer-events-none ${
          status === 'covering' ? 'opacity-100' : 'opacity-0'
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
