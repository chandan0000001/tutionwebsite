import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { soundEngine, type SoundType } from '../utils/soundEngine';

interface SoundContextType {
  isSoundEnabled: boolean;
  toggleSound: () => void;
  setSoundEnabled: (enabled: boolean) => void;
  playSound: (type: SoundType, options?: { volume?: number; detune?: number }) => void;
  triggerHaptic: (type: SoundType) => void;
}

const SoundContext = createContext<SoundContextType | undefined>(undefined);

export const SoundProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSoundEnabled, setIsSoundEnabledState] = useState<boolean>(() => soundEngine.isSoundEnabled());

  const toggleSound = useCallback(() => {
    const next = soundEngine.toggleSound();
    setIsSoundEnabledState(next);
  }, []);

  const setSoundEnabled = useCallback((enabled: boolean) => {
    soundEngine.setEnabled(enabled);
    setIsSoundEnabledState(enabled);
  }, []);

  const playSound = useCallback((type: SoundType, options?: { volume?: number; detune?: number }) => {
    soundEngine.play(type, options);
  }, []);

  const triggerHaptic = useCallback((type: SoundType) => {
    soundEngine.triggerHaptic(type);
  }, []);

  // Global PointerDown & Keyboard interaction listener (inspired by Kobra Systems)
  useEffect(() => {
    const resolveSoundType = (el: HTMLElement): SoundType | null => {
      // 1. Explicit data-sound override
      const explicit = el.getAttribute('data-sound') || el.closest('[data-sound]')?.getAttribute('data-sound');
      if (explicit) return explicit as SoundType;

      // 2. Destructive / Delete buttons
      const text = (el.textContent || '').toLowerCase();
      const ariaLabel = (el.getAttribute('aria-label') || '').toLowerCase();
      const title = (el.getAttribute('title') || '').toLowerCase();
      const classList = el.className || '';

      if (
        text.includes('delete') ||
        text.includes('remove') ||
        text.includes('deactivate') ||
        ariaLabel.includes('delete') ||
        ariaLabel.includes('remove') ||
        classList.includes('rose') ||
        classList.includes('red-600')
      ) {
        return 'destructive';
      }

      // 3. Copy buttons
      if (
        text.includes('copy') ||
        ariaLabel.includes('copy') ||
        title.includes('copy')
      ) {
        return 'copy';
      }

      // 4. Modal / Drawer / Accordion Close buttons
      if (
        text === 'close' ||
        text === 'cancel' ||
        ariaLabel.includes('close') ||
        title.includes('close') ||
        el.closest('[data-close-modal]')
      ) {
        return 'close';
      }

      // 5. Theme Toggle button
      if (
        ariaLabel.includes('mode') ||
        title.includes('mode') ||
        ariaLabel.includes('theme')
      ) {
        const isDark = document.documentElement.classList.contains('dark');
        return isDark ? 'toggleOff' : 'toggleOn';
      }

      // 6. Checkboxes and Switches
      if (el instanceof HTMLInputElement && (el.type === 'checkbox' || el.type === 'radio')) {
        return el.checked ? 'toggleOn' : 'toggleOff';
      }

      // 7. Carousel arrows & Pagination steppers
      if (
        ariaLabel.includes('next') ||
        ariaLabel.includes('prev') ||
        ariaLabel.includes('slide') ||
        text === 'next' ||
        text === 'prev' ||
        classList.includes('chevron')
      ) {
        return 'tick';
      }

      // 8. Navigation Links & Tabs
      if (
        el.tagName === 'A' ||
        el.getAttribute('role') === 'tab' ||
        el.closest('nav') ||
        el.getAttribute('role') === 'option' ||
        el.getAttribute('role') === 'menuitem'
      ) {
        return 'select';
      }

      // 9. Modal Triggers
      if (
        el.getAttribute('aria-haspopup') === 'dialog' ||
        text.includes('enroll') ||
        text.includes('consultation') ||
        text.includes('filter') ||
        text.includes('add')
      ) {
        return 'open';
      }

      // 10. Default interactive button tap
      return 'tap';
    };

    const handlePointerDown = (e: PointerEvent) => {
      // Primary click only (left button)
      if (e.button !== 0 || !(e.target instanceof Element)) return;

      const interactive = (e.target as HTMLElement).closest<HTMLElement>(
        'button, a[href], input[type="button"], input[type="submit"], input[type="checkbox"], input[type="radio"], select, [role="button"], [role="tab"], [role="menuitem"], [data-sound]'
      );

      if (!interactive) return;

      // Check if disabled
      if (
        (interactive as HTMLButtonElement).disabled ||
        interactive.getAttribute('aria-disabled') === 'true'
      ) {
        soundEngine.play('blocked');
        return;
      }

      const sound = resolveSoundType(interactive);
      if (sound) {
        soundEngine.play(sound);
      }
    };

    // Range slider input listener
    const handleInput = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target instanceof HTMLInputElement && target.type === 'range') {
        soundEngine.play('sliderTick');
      }
    };

    document.addEventListener('pointerdown', handlePointerDown, { capture: true, passive: true });
    document.addEventListener('input', handleInput, { capture: true, passive: true });

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown, { capture: true });
      document.removeEventListener('input', handleInput, { capture: true });
    };
  }, []);

  return (
    <SoundContext.Provider
      value={{
        isSoundEnabled,
        toggleSound,
        setSoundEnabled,
        playSound,
        triggerHaptic,
      }}
    >
      {children}
    </SoundContext.Provider>
  );
};

export const useSound = (): SoundContextType => {
  const context = useContext(SoundContext);
  if (!context) {
    throw new Error('useSound must be used within a SoundProvider');
  }
  return context;
};
